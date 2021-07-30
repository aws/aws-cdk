import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as kms from '@aws-cdk/aws-kms';
import * as redshift from '@aws-cdk/aws-redshift';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps, CommonDestinationS3Props, Compression } from './common';
import { createBackupConfig, createBufferingHints, createEncryptionConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import { FirehoseRedshiftTable } from './redshift/table';
import { FirehoseRedshiftUser } from './redshift/user';

/**
 * The Redshift user Firehose will assume to deliver data to Redshift
 */
export interface RedshiftUser {
  /**
   * Username for user that has permission to insert records into a Redshift table.
   */
  readonly username: string;

  /**
   * Password for user that has permission to insert records into a Redshift table.
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default - a Secrets Manager generated password.
   */
  readonly password?: cdk.SecretValue;

  /**
   * KMS key to encrypt the generated secret.
   *
   * @default - default master key.
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A column in a Redshift table.
 */
export interface RedshiftColumn {
  /**
   * The name of the column.
   */
  readonly name: string;

  /**
   * The data type of the column.
   */
  readonly dataType: string;
}

/**
 * Properties for configuring a Redshift delivery stream destination.
 */
export interface RedshiftDestinationProps extends CommonDestinationProps, CommonDestinationS3Props {
  /**
   * The cluster user that has INSERT permissions to the desired output table.
   */
  readonly user: RedshiftUser;

  /**
   * The database containing the desired output table.
   */
  readonly database: string;

  /**
   * The table that data should be inserted into.
   */
  readonly tableName: string;

  /**
   * The table columns that the source fields will be loaded into.
   */
  readonly tableColumns: RedshiftColumn[];

  /**
   * The secret that holds Redshift cluster credentials for a user with administrator privileges.
   *
   * Used to create the user that Firehose assumes and the table that data is inserted into.
   *
   * @default - the master secret is taken from the cluster.
   */
  readonly masterSecret?: secretsmanager.ISecret;

  /**
   * Parameters given to the COPY command that is used to move data from S3 to Redshift.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/APIReference/API_CopyCommand.html
   *
   * @default '' - no extra parameters are provided to the Redshift COPY command
   */
  readonly copyOptions?: string;

  /**
   * The length of time during which Firehose retries delivery after a failure.
   *
   * @default Duration.hours(1)
   */
  readonly retryTimeout?: cdk.Duration;

  /**
   * The intermediate bucket where Firehose will stage your data before COPYing it to the Redshift cluster.
   *
   * @default - a bucket will be created for you.
   */
  readonly intermediateBucket?: s3.IBucket;

  /**
   * The role that is attached to the Redshift cluster and will have permissions to access the intermediate bucket.
   *
   * If a role is provided, it must be already attached to the cluster, to avoid the 10 role per cluster limit.
   *
   * @default - a role will be created for you.
   */
  readonly bucketAccessRole?: iam.IRole;
}

/**
 * Redshift delivery stream destination.
 */
export class RedshiftCluster implements firehose.IDestination {
  /**
   * The secret Firehose will use to access the Redshift cluster.
   */
  public secret?: secretsmanager.ISecret;

  private masterSecret: secretsmanager.ISecret;

  constructor(private readonly cluster: redshift.ICluster, private readonly props: RedshiftDestinationProps) {
    if (!cluster.publiclyAccessible) {
      throw new Error('Redshift cluster used as Firehose destination must be publicly accessible');
    }
    if (!cluster.subnetGroup?.selectedSubnets?.hasPublic) {
      throw new Error('Redshift cluster used as Firehose destination must be located in a public subnet');
    }
    const masterSecret = props.masterSecret ?? (cluster instanceof redshift.Cluster ? cluster.secret : undefined);
    if (!masterSecret) {
      throw new Error('Master secret must be provided or Redshift cluster must generate a master secret');
    }
    this.masterSecret = masterSecret;
    if (props.retryTimeout && props.retryTimeout.toSeconds() > cdk.Duration.hours(2).toSeconds()) {
      throw new Error('Retry timeout must be less that 2 hours');
    }
    if (props.compression === Compression.SNAPPY || props.compression === Compression.HADOOP_SNAPPY || props.compression === Compression.ZIP) {
      throw new Error('Compression must not be HADOOP_SNAPPY, SNAPPY, or ZIP');
    }
    if (props.s3Backup?.mode === BackupMode.FAILED) {
      throw new Error('Redshift delivery stream destination only supports ALL and DISABLED BackupMode, given FAILED');
    }
  }

  public bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const {
      database,
      tableName,
      tableColumns,
      user: userConfig,
      compression,
      retryTimeout,
      bufferingInterval,
      bufferingSize,
      copyOptions,
    } = this.props;

    const role = this.props.role ?? new iam.Role(scope, 'Redshift Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const endpoint = this.cluster.clusterEndpoint;
    const jdbcUrl = `jdbc:redshift://${endpoint.hostname}:${cdk.Token.asString(endpoint.port)}/${database}`;
    this.cluster.connections.allowDefaultPortFrom(options.connections, 'Allow incoming connections from Kinesis Data Firehose');

    const redshiftTable = new FirehoseRedshiftTable(scope, 'Firehose Redshift Table', {
      cluster: this.cluster,
      masterSecret: this.masterSecret,
      database: database,
      tableName: tableName,
      tableColumns: tableColumns,
    });

    const user = (() => {
      if (userConfig.password) {
        return {
          username: userConfig.username,
          password: userConfig.password,
        };
      } else {
        const secret = new redshift.DatabaseSecret(scope, 'Firehose User Secret', {
          username: userConfig.username,
          encryptionKey: userConfig.encryptionKey,
        });
        this.secret = secret.attach(this.cluster);

        const redshiftUser = new FirehoseRedshiftUser(scope, 'Firehose Redshift User', {
          cluster: this.cluster,
          masterSecret: this.masterSecret,
          userSecret: this.secret,
          database: database,
          tableName: redshiftTable.tableName,
        });

        return {
          username: redshiftUser.username,
          password: this.secret.secretValueFromJson('password'),
        };
      };
    })();

    const { loggingOptions: intermediateLoggingOptions, dependables: intermediateLoggingDependables } = createLoggingOptions(scope, {
      logging: this.props.logging,
      logGroup: this.props.logGroup,
      role,
      streamId: 'IntermediateS3',
    }) ?? {};
    const intermediateBucket = this.props.intermediateBucket ?? new s3.Bucket(scope, 'Intermediate Bucket');
    intermediateBucket.grantReadWrite(role);
    const intermediateS3Config: firehose.CfnDeliveryStream.S3DestinationConfigurationProperty = {
      bucketArn: intermediateBucket.bucketArn,
      roleArn: role.roleArn,
      bufferingHints: createBufferingHints(bufferingInterval, bufferingSize),
      encryptionConfiguration: createEncryptionConfig(role, this.props.encryptionKey),
      cloudWatchLoggingOptions: intermediateLoggingOptions,
      compressionFormat: compression?.value,
    };
    const bucketAccessRole = this.props.bucketAccessRole ?? new iam.Role(scope, 'Intermediate Bucket Access Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });
    if (!this.props.bucketAccessRole && this.cluster instanceof redshift.Cluster) {
      this.cluster.attachRole(bucketAccessRole);
    }
    intermediateBucket.grantRead(bucketAccessRole);

    const { loggingOptions: redshiftLoggingOptions, dependables: redshiftLoggingDependables } = createLoggingOptions(scope, {
      logging: this.props.logging,
      logGroup: this.props.logGroup,
      role,
      streamId: 'Redshift',
    }) ?? {};
    const { backupConfig, dependables: backupDependables } = createBackupConfig(scope, role, this.props.s3Backup) ?? {};
    return {
      redshiftDestinationConfiguration: {
        clusterJdbcurl: jdbcUrl,
        copyCommand: {
          dataTableName: tableName,
          dataTableColumns: tableColumns.map(column => column.name).join(),
          copyOptions: copyOptions + (compression === Compression.GZIP ? ' gzip' : ''),
        },
        password: user.password.toString(),
        username: user.username.toString(),
        s3Configuration: intermediateS3Config,
        roleArn: role.roleArn,
        cloudWatchLoggingOptions: redshiftLoggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        retryOptions: this.createRetryOptions(retryTimeout),
        s3BackupConfiguration: backupConfig,
        s3BackupMode: this.getS3BackupMode(),
      },
      dependables: [...(intermediateLoggingDependables ?? []), ...(redshiftLoggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }

  private createRetryOptions(retryTimeout?: cdk.Duration): firehose.CfnDeliveryStream.RedshiftRetryOptionsProperty | undefined {
    return retryTimeout ? {
      durationInSeconds: retryTimeout.toSeconds(),
    } : undefined;
  }

  private getS3BackupMode(): string | undefined {
    return (this.props.s3Backup?.bucket && !this.props.s3Backup.mode) || this.props.s3Backup?.mode === BackupMode.ALL
      ? 'Enabled'
      : undefined;
  }
}

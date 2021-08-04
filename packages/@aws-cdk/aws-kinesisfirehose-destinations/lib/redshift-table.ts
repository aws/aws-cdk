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
 * The Redshift user Firehose will assume to deliver data to the destination table.
 */
export class RedshiftUser {
  /**
   * Specify a Redshift user using credentials that already exist.
   *
   * The user must have INSERT permissions to the destination table.
   *
   * @param username Username for the user.
   * @param password Password for the user. Do not put passwords in CDK code directly.
   */
  static fromExisting(username: string, password: cdk.SecretValue): RedshiftUser {
    return new RedshiftUser(username, password);
  }

  /**
   * Generate credentials and create a Redshift user.
   *
   * The user will be given INSERT permissions to the destination table. The credentials for the user will be stored in AWS Secrets Manager.
   *
   * @param encryptionKey KMS key to encrypt the generated secret. If not provided, the default AWS managed key is used.
   */
  static create(encryptionKey?: kms.IKey): RedshiftUser {
    return new RedshiftUser(undefined, undefined, encryptionKey);
  }

  /**
   * @param username Username for the user.
   * @param password Password for the user. Do not put passwords in CDK code directly.
   * @param encryptionKey KMS key to encrypt the generated secret. If not provided, the default AWS managed key is used.
   */
  private constructor(public readonly username?: string, public readonly password?: cdk.SecretValue, public readonly encryptionKey?: kms.IKey) {}
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
   * The Redshift user Firehose will assume to deliver data to Redshift.
   */
  readonly user: RedshiftUser;

  /**
   * The database containing the destination table.
   */
  readonly database: string;

  /**
   * The name of the table that data should be inserted into.
   *
   * @default - a table is generated automatically
   */
  readonly tableName?: string;

  /**
   * The table columns that the source fields will be loaded into.
   */
  readonly tableColumns: RedshiftColumn[];

  /**
   * The secret that holds Redshift cluster credentials for a user with administrator privileges.
   *
   * Used to create the user that Firehose assumes and the table that data is inserted into.
   * Not required if neither user nor table need to be generated.
   * Secret JSON schema: `{ username: string; password: string }`.
   *
   * @default - the admin secret is taken from the cluster
   */
  readonly adminUser?: secretsmanager.ISecret;

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
   * Minimum: None
   * Maximum: Duration.hours(2)
   *
   * @default Duration.hours(1)
   */
  readonly retryTimeout?: cdk.Duration;

  /**
   * The intermediate bucket where Firehose will stage the data before COPYing to the Redshift cluster.
   *
   * @default - a bucket will be created
   */
  readonly intermediateBucket?: s3.IBucket;

  /**
   * The role that is attached to the Redshift cluster and will have permissions to access the intermediate bucket.
   *
   * If a role is provided, it must be already attached to the cluster, to avoid the 10 role per cluster limit.
   *
   * @default - a role will be created
   */
  readonly bucketAccessRole?: iam.IRole;
}

/**
 * Redshift table delivery stream destination.
 */
export class RedshiftTable implements firehose.IDestination {
  /**
   * The Redshift database that contains the table were data will be delivered.
   */
  public readonly database: string;

  /**
   * The name of the Redshift table were data will be delivered.
   */
  get tableName(): string {
    if (!this._tableName) {
      throw new Error('Bind must be called before the name of the generated table is available');
    }
    return this._tableName;
  }

  private _tableName?: string;
  private readonly adminUser?: secretsmanager.ISecret;

  constructor(private readonly cluster: redshift.ICluster, private readonly props: RedshiftDestinationProps) {
    if (!cluster.publiclyAccessible) {
      throw new Error('Redshift cluster used as delivery stream destination is not publicly accessible');
    }
    if (!cluster.subnetGroup?.selectedSubnets?.hasPublic) {
      throw new Error('Redshift cluster used as delivery stream destination is not located in a public subnet');
    }
    if (props.retryTimeout && props.retryTimeout.toSeconds() > cdk.Duration.hours(2).toSeconds()) {
      throw new Error(`Retry timeout must be less than 7,200 seconds (2 hours), given ${props.retryTimeout.toSeconds()} seconds`);
    }
    if (props.compression === Compression.SNAPPY || props.compression === Compression.HADOOP_SNAPPY || props.compression === Compression.ZIP) {
      throw new Error(`Redshift delivery stream destination does not support ${props.compression.value} compression`);
    }
    if (props.s3Backup?.mode === BackupMode.FAILED) {
      throw new Error('Redshift delivery stream destination does not support ${props.s3Backup?.mode} backup mode');
    }

    const generateTable = !props.tableName;
    const generateUser = !props.user.username || !props.user.password;
    const adminUser = props.adminUser ?? (cluster instanceof redshift.Cluster ? cluster.secret : undefined);
    if (!adminUser && (generateTable || generateUser)) {
      throw new Error(
        'Administrative access to the cluster is required but an admin user secret was not provided and either the Redshift cluster did not generate admin user credentials (they were provided explicitly) or the cluster was imported',
      );
    }
    this.adminUser = adminUser;

    this.database = props.database;
    this._tableName = props.tableName;
  }

  public bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const {
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
    const jdbcUrl = `jdbc:redshift://${endpoint.hostname}:${cdk.Token.asString(endpoint.port)}/${this.database}`;
    this.cluster.connections.allowDefaultPortFrom(options.connections, 'Allow incoming connections from Kinesis Data Firehose');

    if (!this._tableName) {
      const redshiftTable = new FirehoseRedshiftTable(scope, 'Firehose Redshift Table', {
        cluster: this.cluster,
        adminUser: this.adminUser!,
        database: this.database,
        tableColumns: tableColumns,
      });
      this._tableName = redshiftTable.tableName;
    }

    const user = (() => {
      if (userConfig.username && userConfig.password) {
        return {
          username: userConfig.username,
          password: userConfig.password,
        };
      } else {
        const secret = new redshift.DatabaseSecret(scope, 'Firehose User Secret', {
          username: cdk.Names.uniqueId(scope),
          encryptionKey: userConfig.encryptionKey,
        });
        const attachedSecret = secret.attach(this.cluster);

        const redshiftUser = new FirehoseRedshiftUser(scope, 'Firehose Redshift User', {
          cluster: this.cluster,
          adminUser: this.adminUser!,
          userSecret: attachedSecret,
          database: this.database,
          tableName: this.tableName,
        });

        return {
          username: redshiftUser.username,
          password: attachedSecret.secretValueFromJson('password'),
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
          dataTableName: this.tableName,
          dataTableColumns: tableColumns.map(column => column.name).join(),
          copyOptions: copyOptions + (compression === Compression.GZIP ? ' gzip' : ''),
        },
        password: user.password.toString(),
        username: user.username,
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
    return this.props.s3Backup?.bucket || this.props.s3Backup?.mode === BackupMode.ALL
      ? 'Enabled'
      : undefined;
  }
}

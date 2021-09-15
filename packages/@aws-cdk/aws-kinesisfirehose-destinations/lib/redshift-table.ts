import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as redshift from '@aws-cdk/aws-redshift';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps, CommonDestinationS3Props, Compression } from './common';
import { createBackupConfig, createBufferingHints, createEncryptionConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';

/**
 * Properties for configuring a Redshift delivery stream destination.
 */
export interface RedshiftDestinationProps extends CommonDestinationProps, CommonDestinationS3Props {
  /**
   * The Redshift user Firehose will assume to deliver data to the destination table.
   *
   * @default - a user is generated
   */
  readonly user?: redshift.IUser;

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
   * @param table The Redshift table that data should be inserted into.
   */
  constructor(private readonly table: redshift.ITable, private readonly props: RedshiftDestinationProps = {}) {
    const cluster = table.cluster;
    if (!cluster.publiclyAccessible) {
      throw new Error('Redshift cluster used as delivery stream destination is not publicly accessible');
    }
    if (!cluster.subnetGroup?.selectedSubnets?.hasPublic) {
      throw new Error('Redshift cluster used as delivery stream destination is not located in a public subnet');
    }
    if (props.user) {
      if (props.user.cluster !== table.cluster || props.user.databaseName !== table.databaseName) {
        throw new Error('Provided Redshift user must be located in the same Redshift cluster and database as the table');
      }
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
  }

  public bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const {
      compression,
      retryTimeout,
      bufferingInterval,
      bufferingSize,
      copyOptions,
    } = this.props;
    const cluster = this.table.cluster;

    const role = this.props.role ?? new iam.Role(scope, 'Redshift Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const endpoint = cluster.clusterEndpoint;
    const jdbcUrl = `jdbc:redshift://${endpoint.hostname}:${cdk.Token.asString(endpoint.port)}/${this.table.databaseName}`;
    cluster.connections.allowDefaultPortFrom(options.connections, 'Allow incoming connections from Kinesis Data Firehose');

    const user = this.props.user ?? new redshift.User(scope, 'Redshift User', {
      cluster: cluster,
      databaseName: this.table.databaseName,
    });
    this.table.grant(user, redshift.TableAction.INSERT);

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
    const bucketAccessRole = this.props.bucketAccessRole ?? new iam.Role(scope, 'Intermediate Bucket Redshift Access Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });
    if (!this.props.bucketAccessRole && cluster instanceof redshift.Cluster) {
      cluster.attachRole(bucketAccessRole);
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
          dataTableName: this.table.tableName,
          dataTableColumns: this.table.tableColumns.map(column => column.name).join(),
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

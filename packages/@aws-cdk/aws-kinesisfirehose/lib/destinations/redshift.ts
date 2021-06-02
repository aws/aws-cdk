import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as redshift from '@aws-cdk/aws-redshift';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, SecretValue, Size, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDeliveryStream } from '../delivery-stream';
import { BackupMode, Compression, DestinationBase, DestinationConfig, DestinationProps } from '../destination';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

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
  readonly password?: SecretValue;

  /**
   * KMS key to encrypt the generated secret.
   *
   * @default - default master key.
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Properties for configuring a Redshift delivery stream destination.
 */
export interface RedshiftDestinationProps extends DestinationProps {
  /**
   * The Redshift cluster to deliver data to.
   * TODO: add ingress access from the Firehose CIDR
   */
  readonly cluster: redshift.Cluster;

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
   *
   * Firehose does not create the table if it does not exist.
   */
  readonly tableName: string;

  /**
   * A list of column names to load source data fields into specific target columns.
   *
   * The order of the columns must match the order of the source data.
   *
   * @default []
   */
  readonly tableColumns?: string[];

  /**
   * Parameters given to the COPY command that is used to move data from S3 to Redshift.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/APIReference/API_CopyCommand.html // TODO: proper annotation
   *
   * @default '' - no extra parameters are provided to the Redshift COPY command
   */
  readonly copyOptions?: string;

  /**
   * The length of time during which Firehose retries delivery after a failure.
   *
   * TODO: valid values [0, 7200] seconds
   *
   * @default Duration.hours(1)
   */
  readonly retryTimeout?: Duration;

  /**
   * The intermediate bucket where Firehose will stage your data before COPYing it to the Redshift cluster
   *
   * @default - a bucket will be created for you.
   */
  readonly intermediateBucket?: s3.IBucket;

  /**
   * The size of the buffer that Firehose uses for incoming data before delivering it to the intermediate bucket.
   *
   * TODO: valid values [60, 900] seconds
   *
   * @default Duration.seconds(60)
   */
  readonly bufferingInterval?: Duration;

  /**
   * The length of time that Firehose buffers incoming data before delivering it to the intermediate bucket.
   *
   * TODO: valid values [1, 128] MBs
   *
   * @default Size.mebibytes(3)
   */
  readonly bufferingSize?: Size;

  /**
   * The compression that Firehose uses when delivering data to the intermediate bucket.
   *
   * TODO: Redshift COPY does not support SNAPPY or ZIP
   *
   * @default Compression.UNCOMPRESSED
   */
  readonly compression?: Compression;
}

/**
 * Redshift delivery stream destination.
 */
export class RedshiftDestination extends DestinationBase {
  protected readonly redshiftProps: RedshiftDestinationProps;

  constructor(redshiftProps: RedshiftDestinationProps) {
    super(redshiftProps);

    this.redshiftProps = redshiftProps;

    if (this.redshiftProps.backup === BackupMode.FAILED_ONLY) {
      throw new Error(`Redshift delivery stream destination only supports ENABLED and DISABLED BackupMode, given ${this.redshiftProps.backup}`);
    }
  }

  public bind(scope: Construct, deliveryStream: IDeliveryStream): DestinationConfig {
    return {
      properties: {
        redshiftDestinationConfiguration: this.createRedshiftConfig(scope, deliveryStream),
      },
    };
  }

  private createRedshiftConfig(scope: Construct, deliveryStream: IDeliveryStream): CfnDeliveryStream.RedshiftDestinationConfigurationProperty {
    const endpoint = this.redshiftProps.cluster.clusterEndpoint;
    const jdbcUrl = `jdbc:redshift://${endpoint.hostname}:${Token.asString(endpoint.port)}/${this.redshiftProps.database}`;

    const user = (() => {
      if (this.redshiftProps.user.password) {
        return {
          username: this.redshiftProps.user.username,
          password: this.redshiftProps.user.password,
        };
      } else {
        const secret = new redshift.DatabaseSecret(scope, 'Firehose User', {
          username: this.redshiftProps.user.username,
          encryptionKey: this.redshiftProps.user.encryptionKey,
        });
        return {
          username: secret.secretValueFromJson('username'),
          password: secret.secretValueFromJson('password'),
        };
      };
    })();

    const intermediateBucket = this.redshiftProps.intermediateBucket ?? new s3.Bucket(scope, 'Intermediate Bucket');
    intermediateBucket.grantReadWrite(deliveryStream);
    const compression = this.redshiftProps.compression;
    const intermediateS3Config: CfnDeliveryStream.S3DestinationConfigurationProperty = {
      bucketArn: intermediateBucket.bucketArn,
      roleArn: (deliveryStream.grantPrincipal as iam.Role).roleArn,
      bufferingHints: {
        intervalInSeconds: this.redshiftProps.bufferingInterval?.toSeconds(),
        sizeInMBs: this.redshiftProps.bufferingSize?.toMebibytes(),
      },
      cloudWatchLoggingOptions: this.createLoggingOptions(scope, deliveryStream),
      compressionFormat: compression ?? Compression.UNCOMPRESSED,
    };
    // TODO: encryptionConfiguration? why need to provide if bucket has encryption

    return {
      clusterJdbcurl: jdbcUrl,
      copyCommand: {
        dataTableName: this.redshiftProps.tableName,
        dataTableColumns: this.redshiftProps.tableColumns?.join(),
        copyOptions: this.redshiftProps.copyOptions,
      },
      password: user.password.toString(),
      username: user.username.toString(),
      s3Configuration: intermediateS3Config,
      roleArn: (deliveryStream.grantPrincipal as iam.Role).roleArn,
      cloudWatchLoggingOptions: this.createLoggingOptions(scope, deliveryStream),
      processingConfiguration: this.createProcessingConfig(deliveryStream),
      retryOptions: {
        durationInSeconds: this.redshiftProps.retryTimeout?.toSeconds(),
      },
      s3BackupConfiguration: this.createBackupConfig(scope, deliveryStream),
      s3BackupMode: (this.redshiftProps.backup === BackupMode.ENABLED) ? 'Enabled' : 'Disabled',
    };
  }
}

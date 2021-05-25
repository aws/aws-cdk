import * as kms from '@aws-cdk/aws-kms';
import * as redshift from '@aws-cdk/aws-redshift';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, SecretValue, Size } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDeliveryStream } from '../delivery-stream';
import { Compression, Destination, DestinationConfig, DestinationProps, DestinationType } from '../destination';

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
export class RedshiftDestination extends Destination {
  constructor(_props: RedshiftDestinationProps) {
    super();
  }

  public bind(_scope: Construct, _deliveryStream: IDeliveryStream): DestinationConfig {
    return {
      destinationType: DestinationType.REDSHIFT,
      properties: {},
    };
  }
}

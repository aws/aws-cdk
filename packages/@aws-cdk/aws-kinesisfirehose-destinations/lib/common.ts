import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as logs from '@aws-cdk/aws-logs';

/**
 * Possible compression options Kinesis Data Firehose can use to compress data on delivery.
 */
export class Compression {
  /**
   * gzip
   */
  public static readonly GZIP = new Compression('GZIP');

  /**
   * Hadoop-compatible Snappy
   */
  public static readonly HADOOP_SNAPPY = new Compression('HADOOP_SNAPPY');

  /**
   * Snappy
   */
  public static readonly SNAPPY = new Compression('Snappy');

  /**
   * ZIP
   */
  public static readonly ZIP = new Compression('ZIP');

  /**
   * Creates a new Compression instance with a custom value.
   */
  public static of(value: string): Compression {
    return new Compression(value);
  }

  /**
   * @param value the string value of the Compression.
   */
  private constructor(public readonly value: string) { }
}

/**
 * Generic properties for defining a delivery stream destination.
 */
export interface CommonDestinationProps {
  /**
   * If true, log errors when data transformation or data delivery fails.
   *
   * If `logGroup` is provided, this will be implicitly set to `true`.
   *
   * @default true - errors are logged.
   */
  readonly logging?: boolean;

  /**
   * The CloudWatch log group where log streams will be created to hold error logs.
   *
   * @default - if `logging` is set to `true`, a log group will be created for you.
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * The IAM role associated with this destination.
   *
   * Assumed by Kinesis Data Firehose to invoke processors and write to destinations
   *
   * @default - a role will be created with default permissions.
   */
  readonly role?: iam.IRole;

  /**
   * The data transformation that should be performed on the data before writing to the destination.
   *
   * @default - no data transformation will occur.
   */
  readonly processor?: firehose.IDataProcessor;
}

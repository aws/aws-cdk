/**
 * The format in which log records are delivered.
 *
 * Not all formats are available for all destination types:
 * - `PLAIN`, `JSON`: S3, CloudWatch Logs, Firehose
 * - `W3C`, `PARQUET`: S3 only
 * - `RAW`: Firehose only
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html
 */
export class OutputFormat {
  /**
   * Space-separated field text. Works with S3, CloudWatch Logs, and Firehose.
   * Use `fieldDelimiter` on the `Delivery` to override the separator character.
   */
  public static readonly PLAIN = new OutputFormat('plain');

  /**
   * JSON Lines format (one JSON object per line).
   * Works with S3, CloudWatch Logs, and Firehose.
   */
  public static readonly JSON = new OutputFormat('json');

  /**
   * W3C standard log format with a tab-separated header (`#Fields:` line).
   * S3 only.
   */
  public static readonly W3C = new OutputFormat('w3c');

  /**
   * Apache Parquet columnar binary format.
   * S3 only. Recommended for use with Amazon Athena and AWS Glue.
   */
  public static readonly PARQUET = new OutputFormat('parquet');

  /**
   * Raw logs exactly as emitted by the source service.
   * Firehose only.
   */
  public static readonly RAW = new OutputFormat('raw');

  /**
   * Create an `OutputFormat` from an arbitrary string value.
   * Use this for formats not yet represented as static members.
   */
  public static of(value: string): OutputFormat {
    return new OutputFormat(value);
  }

  /**
   * The raw string value sent to CloudFormation.
   */
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}

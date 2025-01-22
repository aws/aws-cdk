import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Token } from 'aws-cdk-lib';
import { EOL } from 'os';

/**
 * Properties for enabling Spark UI monitoring feature for Spark-based Glue jobs.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
 */
export interface SparkUIProps {
  /**
   * The bucket where the Glue job stores the logs.
   *
   * @default a new bucket will be created.
   */
  readonly bucket?: IBucket;

  /**
   * The path inside the bucket (objects prefix) where the Glue job stores the logs.
   * Use format `'/foo/bar'`
   *
   * @default - the logs will be written at the root of the bucket
   */
  readonly prefix?: string;

  /**
   * Specifies whether job run queuing is enabled for the job runs for this job.
   * A value of true means job run queuing is enabled for the job runs.
   * If false or not populated, the job runs will not be considered for queueing.
   * If this field does not match the value set in the job run, then the value from
   * the job run field will be used. This property must be set to false for flex jobs.
   * If this property is enabled, maxRetries must be set to zero.
   *
   * @default - no job run queuing
   */
  readonly jobRunQueuingEnabled?: boolean;
}

/**
 * The Spark UI logging location.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
 */
export interface SparkUILoggingLocation {
  /**
   * The bucket where the Glue job stores the logs.
   */
  readonly bucket: IBucket;

  /**
   * The path inside the bucket (objects prefix) where the Glue job stores the logs.
   *
   * @default '/' - the logs will be written at the root of the bucket
   */
  readonly prefix?: string;
}

export function validateSparkUiPrefix(prefix?: string): void {
  if (!prefix || Token.isUnresolved(prefix)) {
    // skip validation if prefix is not specified or is a token
    return;
  }

  const errors: string[] = [];

  if (!prefix.startsWith('/')) {
    errors.push('Prefix must begin with \'/\'');
  }

  if (prefix.endsWith('/')) {
    errors.push('Prefix must not end with \'/\'');
  }

  if (errors.length > 0) {
    throw new Error(`Invalid prefix format (value: ${prefix})${EOL}${errors.join(EOL)}`);
  }
}

export function cleanSparkUiPrefixForGrant(prefix?: string): string | undefined {
  return prefix !== undefined ? prefix.slice(1) + '/*' : undefined;
}

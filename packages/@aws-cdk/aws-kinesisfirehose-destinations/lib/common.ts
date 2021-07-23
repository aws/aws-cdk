import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';

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
}

/**
 * A system field that CloudWatch Logs adds to log events in centralized log groups.
 *
 * System fields identify the source of each log event when one log group
 * receives events from several accounts or Regions.
 */
export enum SystemField {
  /**
   * The ID of the AWS account that the log event came from.
   */
  AWS_ACCOUNT = '@aws.account',

  /**
   * The AWS Region that the log event came from.
   */
  AWS_REGION = '@aws.region',

  /**
   * The source log group of the log event.
   *
   * Only valid in `emitSystemFields` on a subscription filter.
   */
  SOURCE_LOG = '@source.log',
}

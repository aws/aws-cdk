import type { IKeyRef } from '../../aws-kms';
import type { Duration } from '../../core';

/**
 * Configuration for durable functions.
 *
 * Lambda durable functions allow for long-running executions with persistent state.
 */
export interface DurableConfig {
  /**
   * The amount of time that Lambda allows a durable function to run before stopping it.
   *
   * Must be between 1 and 31,622,400 seconds (366 days).
   */
  readonly executionTimeout: Duration;

  /**
   * The number of days after a durable execution is closed that Lambda retains its history.
   *
   * Must be between 1 and 90 days.
   *
   * The underlying configuration is expressed in whole numbers of days. Providing a Duration that
   * does not represent a whole number of days will result in a runtime or deployment error.
   *
   * @default Duration.days(14)
   */
  readonly retentionPeriod?: Duration;

  /**
   * The AWS KMS customer managed key that encrypts durable execution data at rest.
   *
   * The key must be a symmetric encryption key in the function's Region. CDK requires the key itself,
   * not an alias. It is separate from `environmentEncryption`. CDK grants the execution role `kms:Decrypt`
   * through its IAM policy, and adds the Lambda service principal statement to the key policy when CDK can
   * edit it. Set `functionName` to a literal string to scope both to this function; without one, they match
   * every function in the account and Region.
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/durable-encryption.html
   * @default - Lambda encrypts durable execution data at rest by default.
   */
  readonly kmsKey?: IKeyRef;
}

import * as sns from '@aws-cdk/aws-sns';
import { IQueue } from '@aws-cdk/aws-sqs';

/**
 * Options to subscribing to an SNS topic
 */
export interface SubscriptionProps {
  /**
   * The filter policy.
   *
   * @default - all messages are delivered
   */
  readonly filterPolicy?: { [attribute: string]: sns.SubscriptionFilter };

  /**
   * Queue used when `deadLetterQueue` is enabled.
   * Default queue is created when not specified.
   *
   * @default - SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`
   */
  readonly deadLetterQueue?: IQueue;
}

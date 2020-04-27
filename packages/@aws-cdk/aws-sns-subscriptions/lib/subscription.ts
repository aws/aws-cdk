import * as sns from '@aws-cdk/aws-sns';
import { IQueue } from '@aws-cdk/aws-sqs';

export interface SubscriptionProps {
  /**
   * The filter policy.
   *
   * @default - all messages are delivered
   */
  readonly filterPolicy?: { [attribute: string]: sns.SubscriptionFilter };

  /**
   * Enabled DLQ. If `deadLetterQueue` is undefined,
   * an SQS queue with default options will be defined for your Function.
   *
   * @default - false unless `deadLetterQueue` is set, which implies DLQ is enabled.
   */
  readonly deadLetterQueueEnabled?: boolean;

  /**
   * The SQS queue to use if DLQ is enabled.
   *
   * @default - SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`
   */
  readonly deadLetterQueue?: IQueue;
}

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
   * Queue to be used as dead letter queue.
   * If not passed no dead letter queue is enabled.
   *
   * @default - No dead letter queue enabled.
   */
  readonly deadLetterQueue?: IQueue;
}

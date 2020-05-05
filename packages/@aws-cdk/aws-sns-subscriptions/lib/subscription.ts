import * as sns from '@aws-cdk/aws-sns';

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
}

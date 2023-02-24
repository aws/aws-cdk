import * as sns from '@aws-cdk/aws-sns';
import { SubscriptionProps } from './subscription';

/**
 * Options for email subscriptions.
 */
export interface EmailSubscriptionProps extends SubscriptionProps {
  /**
   * Indicates if the full notification JSON should be sent to the email
   * address or just the message text.
   *
   * @default false (Message text)
   */
  readonly json?: boolean;
}

/**
 * Use an email address as a subscription target
 *
 * Email subscriptions require confirmation.
 */
export class EmailSubscription implements sns.ITopicSubscription {
  constructor(private readonly emailAddress: string, private readonly props: EmailSubscriptionProps = {}) {
  }

  /**
   * Returns a configuration for an email address to subscribe to an SNS topic
   */
  public bind(_topic: sns.ITopic): sns.TopicSubscriptionConfig {
    return {
      subscriberId: this.emailAddress,
      endpoint: this.emailAddress,
      protocol: this.props.json ? sns.SubscriptionProtocol.EMAIL_JSON : sns.SubscriptionProtocol.EMAIL,
      filterPolicy: this.props.filterPolicy,
      filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
      deadLetterQueue: this.props.deadLetterQueue,
    };
  }
}

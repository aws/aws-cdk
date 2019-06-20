import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/cdk';

/**
 * Options for email subscriptions.
 */
export interface EmailSubscriptionProps {
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

  public bind(scope: Construct, topic: sns.ITopic): void {
    new sns.Subscription(scope, this.emailAddress, {
      topic,
      endpoint: this.emailAddress,
      protocol: this.props.json ? sns.SubscriptionProtocol.EMAIL_JSON : sns.SubscriptionProtocol.EMAIL
    });
  }
}

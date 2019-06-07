import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/cdk';

/**
 * Options for email subscriptions.
 */
export interface EmailSubscriberProps {
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
export class EmailSubscriber implements sns.ISubscriber {
  constructor(private readonly emailAddress: string, private readonly props: EmailSubscriberProps = {}) {
  }

  public bind(scope: Construct, topic: sns.ITopic): void {
    new sns.Subscription(scope, this.emailAddress, {
      topic,
      endpoint: this.emailAddress,
      protocol: this.props.json ? sns.SubscriptionProtocol.EmailJson : sns.SubscriptionProtocol.Email
    });
  }
}
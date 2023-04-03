import * as sns from '../../aws-sns';
import { SubscriptionProps } from './subscription';

/**
 * Options for SMS subscriptions.
 */
export interface SmsSubscriptionProps extends SubscriptionProps {
}

/**
 * Use an sms address as a subscription target
 */
export class SmsSubscription implements sns.ITopicSubscription {
  constructor(private readonly phoneNumber: string, private readonly props: SmsSubscriptionProps = {}) {
  }

  public bind(_topic: sns.ITopic): sns.TopicSubscriptionConfig {
    return {
      subscriberId: this.phoneNumber,
      endpoint: this.phoneNumber,
      protocol: sns.SubscriptionProtocol.SMS,
      filterPolicy: this.props.filterPolicy,
      filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
    };
  }
}

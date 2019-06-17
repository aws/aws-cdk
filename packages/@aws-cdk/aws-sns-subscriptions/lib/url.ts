import sns = require('@aws-cdk/aws-sns');
import { SubscriptionProps } from './subscription';

/**
 * Options for URL subscriptions.
 */
export interface UrlSubscriptionProps extends SubscriptionProps {
  /**
   * The message to the queue is the same as it was sent to the topic
   *
   * If false, the message will be wrapped in an SNS envelope.
   *
   * @default false
   */
  readonly rawMessageDelivery?: boolean;
}

/**
 * Use a URL as a subscription target
 *
 * The message will be POSTed to the given URL.
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-http-https-endpoint-as-subscriber.html
 */
export class UrlSubscription implements sns.ITopicSubscription {
  constructor(private readonly url: string, private readonly props: UrlSubscriptionProps = {}) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with either http:// or https://');
    }
  }

  public bind(_topic: sns.ITopic): sns.TopicSubscriptionConfig {
    return {
      subscriberId: this.url,
      endpoint: this.url,
      protocol: this.url.startsWith('https:') ? sns.SubscriptionProtocol.Https : sns.SubscriptionProtocol.Http,
      rawMessageDelivery: this.props.rawMessageDelivery,
      filterPolicy: this.props.filterPolicy,
    };
  }
}

import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/cdk';

/**
 * Options for URL subscriptions.
 */
export interface UrlSubscriptionProps {
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

  public bind(scope: Construct, topic: sns.ITopic): void {
    new sns.Subscription(scope, this.url, {
      topic,
      endpoint: this.url,
      protocol: this.url.startsWith('https:') ? sns.SubscriptionProtocol.HTTPS : sns.SubscriptionProtocol.HTTP,
      rawMessageDelivery: this.props.rawMessageDelivery,
    });
  }
}

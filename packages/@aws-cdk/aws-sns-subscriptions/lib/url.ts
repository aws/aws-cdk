import * as sns from '@aws-cdk/aws-sns';
import { Token } from '@aws-cdk/core';
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

  /**
   * The subscription's protocol.
   *
   * @default - Protocol is derived from url
   */
  readonly protocol?: sns.SubscriptionProtocol;
}

/**
 * Use a URL as a subscription target
 *
 * The message will be POSTed to the given URL.
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-http-https-endpoint-as-subscriber.html
 */
export class UrlSubscription implements sns.ITopicSubscription {
  private readonly protocol: sns.SubscriptionProtocol;
  private readonly unresolvedUrl: boolean;

  constructor(private readonly url: string, private readonly props: UrlSubscriptionProps = {}) {
    this.unresolvedUrl = Token.isUnresolved(url);
    if (!this.unresolvedUrl && !url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with either http:// or https://');
    }

    if (this.unresolvedUrl && props.protocol === undefined) {
      throw new Error('Must provide protocol if url is unresolved');
    }

    if (this.unresolvedUrl) {
      this.protocol = props.protocol!;
    } else {
      this.protocol = this.url.startsWith('https:') ? sns.SubscriptionProtocol.HTTPS : sns.SubscriptionProtocol.HTTP;
    }
  }

  /**
   * Returns a configuration for a URL to subscribe to an SNS topic
   */
  public bind(_topic: sns.ITopic): sns.TopicSubscriptionConfig {
    return {
      subscriberId: this.url,
      endpoint: this.url,
      protocol: this.protocol,
      rawMessageDelivery: this.props.rawMessageDelivery,
      filterPolicy: this.props.filterPolicy,
      filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
      deadLetterQueue: this.props.deadLetterQueue,
    };
  }
}

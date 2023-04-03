import * as sns from '@aws-cdk/aws-sns';
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
export declare class UrlSubscription implements sns.ITopicSubscription {
    private readonly url;
    private readonly props;
    private readonly protocol;
    private readonly unresolvedUrl;
    constructor(url: string, props?: UrlSubscriptionProps);
    /**
     * Returns a configuration for a URL to subscribe to an SNS topic
     */
    bind(_topic: sns.ITopic): sns.TopicSubscriptionConfig;
}

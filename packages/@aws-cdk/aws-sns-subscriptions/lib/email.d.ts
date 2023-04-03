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
export declare class EmailSubscription implements sns.ITopicSubscription {
    private readonly emailAddress;
    private readonly props;
    constructor(emailAddress: string, props?: EmailSubscriptionProps);
    /**
     * Returns a configuration for an email address to subscribe to an SNS topic
     */
    bind(_topic: sns.ITopic): sns.TopicSubscriptionConfig;
}

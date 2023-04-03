import * as sns from '@aws-cdk/aws-sns';
import { SubscriptionProps } from './subscription';
/**
 * Options for SMS subscriptions.
 */
export interface SmsSubscriptionProps extends SubscriptionProps {
}
/**
 * Use an sms address as a subscription target
 */
export declare class SmsSubscription implements sns.ITopicSubscription {
    private readonly phoneNumber;
    private readonly props;
    constructor(phoneNumber: string, props?: SmsSubscriptionProps);
    bind(_topic: sns.ITopic): sns.TopicSubscriptionConfig;
}

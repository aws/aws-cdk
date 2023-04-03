import { Construct, IDependable } from 'constructs';
import { SubscriptionOptions } from './subscription';
import { ITopic } from './topic-base';
/**
 * Subscription configuration
 */
export interface TopicSubscriptionConfig extends SubscriptionOptions {
    /**
     * The scope in which to create the SNS subscription resource. Normally you'd
     * want the subscription to be created on the consuming stack because the
     * topic is usually referenced by the consumer's resource policy (e.g. SQS
     * queue policy). Otherwise, it will cause a cyclic reference.
     *
     * If this is undefined, the subscription will be created on the topic's stack.
     *
     * @default - use the topic as the scope of the subscription, in which case `subscriberId` must be defined.
     */
    readonly subscriberScope?: Construct;
    /**
     * The id of the SNS subscription resource created under `scope`. In most
     * cases, it is recommended to use the `uniqueId` of the topic you are
     * subscribing to.
     */
    readonly subscriberId: string;
    /**
     * The resources that need to be created before the subscription can be safely created.
     * For example for SQS subscription, the subscription needs to have a dependency on the SQS queue policy
     * in order for the subscription to successfully deliver messages.
     *
     * @default - empty list
     */
    readonly subscriptionDependency?: IDependable;
}
/**
 * Topic subscription
 */
export interface ITopicSubscription {
    /**
     * Returns a configuration used to subscribe to an SNS topic
     *
     * @param topic topic for which subscription will be configured
     */
    bind(topic: ITopic): TopicSubscriptionConfig;
}

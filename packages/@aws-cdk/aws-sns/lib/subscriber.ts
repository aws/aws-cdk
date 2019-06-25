import { Construct } from '@aws-cdk/core';
import { SubscriptionOptions } from './subscription';
import { ITopic } from './topic-base';

/**
 * Subscription configuration
 */
export interface TopicSubscriptionConfig extends SubscriptionOptions {
  /**
   * The id of the subscriber. Will be used as the id for the subscription in
   * the scope defined by `scope`.
   *
   * @default - if `scope` is defined, the default for this will be to use the
   * topic's unique ID. If `scope` is not defined, this field cannot be
   * undefined.
   */
  readonly subscriberId?: string;

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
  readonly scope?: Construct;
}

/**
 * Topic subscription
 */
export interface ITopicSubscription {
  bind(topic: ITopic): TopicSubscriptionConfig;
}

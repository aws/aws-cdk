import { SubscriptionOptions } from './subscription';
import { ITopic } from './topic-base';

/**
 * Subscription configuration
 */
export interface TopicSubscriptionConfig extends SubscriptionOptions {
  /**
   * The id of the subscriber. Will be used as the id for the subscription in
   * the topic's scope.
   */
  readonly subscriberId: string;
}

/**
 * Topic subscription
 */
export interface ITopicSubscription {
  bind(topic: ITopic): TopicSubscriptionConfig;
}

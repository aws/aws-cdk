import { SubscriptionOptions } from './subscription';
import { ITopic } from './topic-base';

/**
 * Subscription configuration
 */
export interface TopicSubscriptionConfig extends SubscriptionOptions {
  /**
   * The id of the construct that is being subscribed to the topic.
   */
  readonly id: string;
}

/**
 * Topic subscription
 */
export interface ITopicSubscription {
  bind(topic: ITopic): TopicSubscriptionConfig;
}

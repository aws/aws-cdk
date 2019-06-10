import { Construct } from '@aws-cdk/cdk';
import { ITopic } from './topic-base';

/**
 * Topic subscription
 */
export interface ITopicSubscription {
  bind(scope: Construct, topic: ITopic): void;
}

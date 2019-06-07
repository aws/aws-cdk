import { Construct } from '@aws-cdk/cdk';
import { ITopic } from './topic-base';

/**
 * Topic subscriber
 */
export interface ISubscriber {
  bind(scope: Construct, topic: ITopic): void;
}
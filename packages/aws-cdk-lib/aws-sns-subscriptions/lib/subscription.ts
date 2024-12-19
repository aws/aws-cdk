import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as sns from '../../aws-sns';
import * as sqs from '../../aws-sqs';
import { IResource } from '../../core';
import * as regionInfo from '../../region-info';

/**
 * Options to subscribing to an SNS topic
 */
export interface SubscriptionProps {
  /**
   * The filter policy.
   *
   * @default - all messages are delivered
   */
  readonly filterPolicy?: { [attribute: string]: sns.SubscriptionFilter };
  /**
   * The filter policy that is applied on the message body.
   * To apply a filter policy to the message attributes, use `filterPolicy`. A maximum of one of `filterPolicyWithMessageBody` and `filterPolicy` may be used.
   *
   * @default - all messages are delivered
   */
  readonly filterPolicyWithMessageBody?: { [attribute: string]: sns.FilterOrPolicy };
  /**
   * Queue to be used as dead letter queue.
   * If not passed no dead letter queue is enabled.
   *
   * @default - No dead letter queue enabled.
   */
  readonly deadLetterQueue?: sqs.IQueue;
}

/**
 * Generic subscription target
 */
export abstract class Subscription implements sns.ITopicSubscription {
  constructor(private readonly subscriber: IResource) {
  }

  /**
   * Generates the principal to be used for a given subscription and the cross-region relation to the topic.
   * Depending on the subscriber type and the region setup,
   * this method will either return the default service principal (`sns.amazonaws.com`),
   * return a service principal for the subscriber's or topic's opt-in region (`sns.<region>.amazonaws.com`),
   * or throw an error.
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html
   *
   * @param topic The topic to subscribe to
   * @throws Error if the queue and target are in different regions and both of those regions are opt-in
   * @throws Error if the queue and target are in different regions and if the subscriber is a Lambda function in an opt-in region
   * @returns the generated grant principal for the topic
   */
  public generateGrantPrincipal(topic: sns.ITopic): iam.IPrincipal {
    const [subscriberRegion, topicRegion] = [this.subscriber, topic].map(({ stack }) => stack.region);
    if (subscriberRegion === topicRegion) {
      return new iam.ServicePrincipal('sns.amazonaws.com');
    };

    const [isSubscriberRegionOptIn, isTopicRegionOptIn] = [subscriberRegion, topicRegion].map((region) => regionInfo.Fact.find(
      region,
      regionInfo.FactName.IS_OPT_IN_REGION,
    ));

    if (isSubscriberRegionOptIn === 'YES' && isTopicRegionOptIn === 'YES') {
      throw new Error('Cross region delivery is not supported if both regions are opt-in');
    }

    if (isSubscriberRegionOptIn === 'YES') {
      if (lambda.Function.isFunction(this.subscriber)) {
        throw new Error('Cross region delivery is not supported for Lambda functions belonging to an opt-in region');
      } else if (sqs.Queue.isQueue(this.subscriber)) {
        return new iam.ServicePrincipal(`sns.${subscriberRegion}.amazonaws.com`);
      } else {
        // All SQS queues and Lambda functions should be caught in the above checks
        // This is future proofing in case we implement other Subscription targets
        throw new Error(`Unknown subscriber type for resource "${this.subscriber.node.id}"`);
      }
    }

    if (isTopicRegionOptIn === 'YES') {
      return new iam.ServicePrincipal(`sns.${topicRegion}.amazonaws.com`);
    }

    return new iam.ServicePrincipal('sns.amazonaws.com');
  }

  public abstract bind(topic: sns.ITopic): sns.TopicSubscriptionConfig;
}

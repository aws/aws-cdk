import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct, Stack } from '@aws-cdk/core';
import { SubscriptionProps } from './subscription';

/**
 * Properties for an SQS subscription
 */
export interface SqsSubscriptionProps extends SubscriptionProps {
  /**
   * The message to the queue is the same as it was sent to the topic
   *
   * If false, the message will be wrapped in an SNS envelope.
   *
   * @default false
   */
  readonly rawMessageDelivery?: boolean;
}

/**
 * Use an SQS queue as a subscription target
 */
export class SqsSubscription implements sns.ITopicSubscription {
  constructor(private readonly queue: sqs.IQueue, private readonly props: SqsSubscriptionProps = {}) {
  }

  public bind(topic: sns.ITopic): sns.TopicSubscriptionConfig {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.queue)) {
      throw new Error('The supplied Queue object must be an instance of Construct');
    }

    // add a statement to the queue resource policy which allows this topic
    // to send messages to the queue.
    this.queue.addToResourcePolicy(new iam.PolicyStatement({
      resources: [this.queue.queueArn],
      actions: ['sqs:SendMessage'],
      principals: [new iam.ServicePrincipal('sns.amazonaws.com')],
      conditions: {
        ArnEquals: { 'aws:SourceArn': topic.topicArn },
      },
    }));

    return {
      subscriberScope: this.queue,
      subscriberId: topic.node.uniqueId,
      endpoint: this.queue.queueArn,
      protocol: sns.SubscriptionProtocol.SQS,
      rawMessageDelivery: this.props.rawMessageDelivery,
      filterPolicy: this.props.filterPolicy,
      region: this.regionFromArn(topic),
    };
  }

  private regionFromArn(topic: sns.ITopic): string | undefined {
    // no need to specify `region` for topics defined within the same stack
    if (topic instanceof sns.Topic) {
      return undefined;
    }
    return Stack.of(topic).parseArn(topic.topicArn).region;
  }
}

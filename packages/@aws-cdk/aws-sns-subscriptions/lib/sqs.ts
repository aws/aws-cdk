import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import { ArnFormat, Names, Stack, Token } from '@aws-cdk/core';
import { SubscriptionProps } from './subscription';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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

  /**
   * Returns a configuration for an SQS queue to subscribe to an SNS topic
   */
  public bind(topic: sns.ITopic): sns.TopicSubscriptionConfig {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.queue)) {
      throw new Error('The supplied Queue object must be an instance of Construct');
    }
    const snsServicePrincipal = new iam.ServicePrincipal('sns.amazonaws.com');

    // add a statement to the queue resource policy which allows this topic
    // to send messages to the queue.
    this.queue.addToResourcePolicy(new iam.PolicyStatement({
      resources: [this.queue.queueArn],
      actions: ['sqs:SendMessage'],
      principals: [snsServicePrincipal],
      conditions: {
        ArnEquals: { 'aws:SourceArn': topic.topicArn },
      },
    }));

    // if the queue is encrypted, add a statement to the key resource policy
    // which allows this topic to decrypt KMS keys
    if (this.queue.encryptionMasterKey) {
      this.queue.encryptionMasterKey.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:Decrypt', 'kms:GenerateDataKey'],
        principals: [snsServicePrincipal],
      }));
    }

    // if the topic and queue are created in different stacks
    // then we need to make sure the topic is created first
    if (topic instanceof sns.Topic && topic.stack !== this.queue.stack) {
      this.queue.stack.addDependency(topic.stack);
    }

    return {
      subscriberScope: this.queue,
      subscriberId: Names.nodeUniqueId(topic.node),
      endpoint: this.queue.queueArn,
      protocol: sns.SubscriptionProtocol.SQS,
      rawMessageDelivery: this.props.rawMessageDelivery,
      filterPolicy: this.props.filterPolicy,
      region: this.regionFromArn(topic),
      deadLetterQueue: this.props.deadLetterQueue,
    };
  }

  private regionFromArn(topic: sns.ITopic): string | undefined {
    // no need to specify `region` for topics defined within the same stack
    if (topic instanceof sns.Topic) {
      if (topic.stack !== this.queue.stack) {
        // only if we know the region, will not work for
        // env agnostic stacks
        if (!Token.isUnresolved(topic.stack.region) &&
          (topic.stack.region !== this.queue.stack.region)) {
          return topic.stack.region;
        }
      }
      return undefined;
    }
    return Stack.of(topic).splitArn(topic.topicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
  }
}

import { Construct } from 'constructs';
import { SubscriptionProps } from './subscription';
import * as iam from '../../aws-iam';
import * as sns from '../../aws-sns';
import * as sqs from '../../aws-sqs';
import { ArnFormat, FeatureFlags, Names, Stack, Token } from '../../core';
import * as cxapi from '../../cx-api';

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
  public bind(topic: sns.ICfnTopic): sns.TopicSubscriptionConfig {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.queue)) {
      throw new Error('The supplied Queue object must be an instance of Construct');
    }
    const snsServicePrincipal = new iam.ServicePrincipal('sns.amazonaws.com');

    // if the queue is encrypted by AWS managed KMS key (alias/aws/sqs),
    // throw error message
    if (this.queue.encryptionType === sqs.QueueEncryption.KMS_MANAGED) {
      throw new Error('SQS queue encrypted by AWS managed KMS key cannot be used as SNS subscription');
    }

    // if the dead-letter queue is encrypted by AWS managed KMS key (alias/aws/sqs),
    // throw error message
    if (this.props.deadLetterQueue && this.props.deadLetterQueue.encryptionType === sqs.QueueEncryption.KMS_MANAGED) {
      throw new Error('SQS queue encrypted by AWS managed KMS key cannot be used as dead-letter queue');
    }

    // add a statement to the queue resource policy which allows this topic
    // to send messages to the queue.
    const queuePolicyDependable = this.queue.addToResourcePolicy(new iam.PolicyStatement({
      resources: [this.queue.queueArn],
      actions: ['sqs:SendMessage'],
      principals: [snsServicePrincipal],
      conditions: {
        ArnEquals: { 'aws:SourceArn': topic.attrTopicArn },
      },
    })).policyDependable;

    // if the queue is encrypted, add a statement to the key resource policy
    // which allows this topic to decrypt KMS keys
    if (this.queue.encryptionMasterKey) {
      this.queue.encryptionMasterKey.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:Decrypt', 'kms:GenerateDataKey'],
        principals: [snsServicePrincipal],
        conditions: FeatureFlags.of(topic).isEnabled(cxapi.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY)
          ? { ArnEquals: { 'aws:SourceArn': topic.attrTopicArn } }
          : undefined,
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
      filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
      region: this.regionFromArn(topic),
      deadLetterQueue: this.props.deadLetterQueue,
      subscriptionDependency: queuePolicyDependable,
    };
  }

  private regionFromArn(topic: sns.ICfnTopic): string | undefined {
    // no need to specify `region` for topics defined within the same stack
    if (topic instanceof sns.Topic) {
      if (topic.stack !== this.queue.stack) {
        // only if we know the region, will not work for
        // env agnostic stacks
        if (!Token.isUnresolved(topic.env.region) &&
          (topic.env.region !== this.queue.env.region)) {
          return topic.env.region;
        }
      }
      return undefined;
    }
    return Stack.of(topic).splitArn(topic.attrTopicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
  }
}

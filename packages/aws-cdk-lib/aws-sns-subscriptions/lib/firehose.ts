import { Construct } from 'constructs';
import { SubscriptionProps } from './subscription';
import * as iam from '../../aws-iam';
import * as firehose from '../../aws-kinesisfirehose';
import * as sns from '../../aws-sns';
import { Names, ValidationError } from '../../core';
import { regionFromArn } from './private/util';

/**
 * Properties for an Amazon Data Firehose subscription
 */
export interface FirehoseSubscriptionProps extends SubscriptionProps {
  /**
   * Whether to remove any Amazon SNS metadata from published messages.
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html
   * @default false
   */
  readonly rawMessageDelivery?: boolean;

  /**
   * The role to assume to write messages to the Amazon Data Firehose delivery stream.
   *
   * @default - A new Role is created
   */
  readonly role?: iam.IRole;
}

/**
 * Use an Amazon Data Firehose delivery stream as a subscription target.
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-firehose-as-subscriber.html
 */
export class FirehoseSubscription implements sns.ITopicSubscription {
  constructor(private readonly deliveryStream: firehose.IDeliveryStream, private readonly props: FirehoseSubscriptionProps = {}) {
  }

  /**
   * Returns a configuration for a Lambda function to subscribe to an SNS topic
   */
  public bind(topic: sns.ITopic): sns.TopicSubscriptionConfig {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.deliveryStream)) {
      throw new ValidationError('The supplied delivery stream object must be an instance of Construct', topic);
    }

    // Permissions based on SNS documentation:
    // https://docs.aws.amazon.com/sns/latest/dg/prereqs-kinesis-data-firehose.html
    const role = this.props.role
      ?? (this.deliveryStream.node.tryFindChild('TopicSubscriptionRole') as iam.IRole)
      ?? new iam.Role(this.deliveryStream, 'TopicSubscriptionRole', { assumedBy: new iam.ServicePrincipal('sns.amazonaws.com') });
    this.deliveryStream.grant(
      role,
      'firehose:DescribeDeliveryStream',
      'firehose:ListDeliveryStreams',
      'firehose:ListTagsForDeliveryStream',
      'firehose:PutRecord',
      'firehose:PutRecordBatch',
    );

    // if the topic and delivery stream are created in different stacks
    // then we need to make sure the topic is created first
    if (topic instanceof sns.Topic && topic.stack !== this.deliveryStream.stack) {
      this.deliveryStream.stack.addDependency(topic.stack);
    }

    return {
      subscriberScope: this.deliveryStream,
      subscriberId: Names.nodeUniqueId(topic.node),
      endpoint: this.deliveryStream.deliveryStreamArn,
      protocol: sns.SubscriptionProtocol.FIREHOSE,
      filterPolicy: this.props.filterPolicy,
      filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
      rawMessageDelivery: this.props.rawMessageDelivery,
      region: regionFromArn(topic, this.deliveryStream),
      deadLetterQueue: this.props.deadLetterQueue,
      subscriptionRoleArn: role.roleArn,
    };
  }
}

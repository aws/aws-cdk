import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import { Construct } from '@aws-cdk/cdk';

/**
 * Properties for an SQS subscription
 */
export interface SqsSubscriptionProps {
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
export class SqsSubscription implements sns.ISubscription {
  constructor(private readonly queue: sqs.IQueue, private readonly props: SqsSubscriptionProps = {}) {
  }

  public bind(_scope: Construct, topic: sns.ITopic): void {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.queue)) {
      throw new Error(`The supplied Queue object must be an instance of Construct`);
    }

    // we use the queue name as the subscription's. there's no meaning to
    // subscribing the same queue twice on the same topic.
    const subscriptionName = topic.node.id + 'Subscription';
    if (this.queue.node.tryFindChild(subscriptionName)) {
      throw new Error(`A subscription between the topic ${topic.node.id} and the queue ${this.queue.node.id} already exists`);
    }

    new sns.Subscription(this.queue, subscriptionName, {
      topic,
      endpoint: this.queue.queueArn,
      protocol: sns.SubscriptionProtocol.Sqs,
      rawMessageDelivery: this.props.rawMessageDelivery,
    });

    // add a statement to the queue resource policy which allows this topic
    // to send messages to the queue.
    this.queue.addToResourcePolicy(new iam.PolicyStatement()
      .addResource(this.queue.queueArn)
      .addAction('sqs:SendMessage')
      .addServicePrincipal('sns.amazonaws.com')
      .setCondition('ArnEquals', { 'aws:SourceArn': topic.topicArn }));
  }
}

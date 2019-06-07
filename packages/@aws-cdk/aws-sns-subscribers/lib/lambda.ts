import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/cdk';

/**
 * Use a Lambda function as a subscription target
 */
export class LambdaSubscriber implements sns.ISubscriber {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(_scope: Construct, topic: sns.ITopic): void {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.fn)) {
      throw new Error(`The supplied lambda Function object must be an instance of Construct`);
    }

    // we use the target name as the subscription's. there's no meaning to
    // subscribing the same queue twice on the same topic.
    const subscriptionName = topic.node.id + 'Subscription';
    if (this.fn.node.tryFindChild(subscriptionName)) {
      throw new Error(`A subscription between the topic ${topic.node.id} and the lambda ${this.fn.id} already exists`);
    }

    new sns.Subscription(this.fn, subscriptionName, {
      topic,
      endpoint: this.fn.functionArn,
      protocol: sns.SubscriptionProtocol.Lambda,
    });

    this.fn.addPermission(topic.node.id, {
      sourceArn: topic.topicArn,
      principal: new iam.ServicePrincipal('sns.amazonaws.com'),
    });
  }
}

import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/cdk';
import { SubscriptionProps } from './subscription';

/**
 * Properties for a Lambda subscription
 */
export interface LambdaSubscriptionProps extends SubscriptionProps {

}
/**
 * Use a Lambda function as a subscription target
 */
export class LambdaSubscription implements sns.ITopicSubscription {
  constructor(private readonly fn: lambda.IFunction, private readonly props: LambdaSubscriptionProps = {}) {
  }

  public bind(topic: sns.ITopic): sns.TopicSubscriptionConfig {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.fn)) {
      throw new Error(`The supplied lambda Function object must be an instance of Construct`);
    }

    this.fn.addPermission(topic.node.id, {
      sourceArn: topic.topicArn,
      principal: new iam.ServicePrincipal('sns.amazonaws.com'),
    });

    return {
      id: this.fn.node.id,
      endpoint: this.fn.functionArn,
      protocol: sns.SubscriptionProtocol.Lambda,
      filterPolicy: this.props.filterPolicy,
    };
  }
}

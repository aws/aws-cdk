import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { Names, Stack } from '@aws-cdk/core';
import { SubscriptionProps } from './subscription';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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

  /**
   * Returns a configuration for a Lambda function to subscribe to an SNS topic
   */
  public bind(topic: sns.ITopic): sns.TopicSubscriptionConfig {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.fn)) {
      throw new Error('The supplied lambda Function object must be an instance of Construct');
    }

    this.fn.addPermission(`AllowInvoke:${Names.nodeUniqueId(topic.node)}`, {
      sourceArn: topic.topicArn,
      principal: new iam.ServicePrincipal('sns.amazonaws.com'),
    });

    return {
      subscriberScope: this.fn,
      subscriberId: topic.node.id,
      endpoint: this.fn.functionArn,
      protocol: sns.SubscriptionProtocol.LAMBDA,
      filterPolicy: this.props.filterPolicy,
      region: this.regionFromArn(topic),
      deadLetterQueue: this.props.deadLetterQueue,
    };
  }

  private regionFromArn(topic: sns.ITopic): string | undefined {
    // no need to specify `region` for topics defined within the same stack.
    if (topic instanceof sns.Topic) {
      return undefined;
    }
    return Stack.of(topic).parseArn(topic.topicArn).region;
  }
}

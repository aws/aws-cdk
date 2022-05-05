import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { ArnFormat, Names, Stack, Token } from '@aws-cdk/core';
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

    // if the topic and function are created in different stacks
    // then we need to make sure the topic is created first
    if (topic instanceof sns.Topic && topic.stack !== this.fn.stack) {
      this.fn.stack.addDependency(topic.stack);
    }

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
      if (topic.stack !== this.fn.stack) {
        // only if we know the region, will not work for
        // env agnostic stacks
        if (!Token.isUnresolved(topic.env.region) &&
          (topic.env.region !== this.fn.env.region)) {
          return topic.env.region;
        }
      }
      return undefined;
    }
    return Stack.of(topic).splitArn(topic.topicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
  }
}

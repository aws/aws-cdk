import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import { Construct } from '@aws-cdk/core';
import { TopicHook } from './topic-hook';

/**
 * Use a Lambda Function as a hook target
 *
 * Internally creates a Topic to make the connection.
 */
export class FunctionHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetConfig {
    const topic = new sns.Topic(scope, 'Topic');
    topic.addSubscription(new subs.LambdaSubscription(this.fn));
    return new TopicHook(topic).bind(scope, lifecycleHook);
  }
}

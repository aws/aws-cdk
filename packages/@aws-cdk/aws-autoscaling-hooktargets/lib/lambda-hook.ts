import autoscaling = require('@aws-cdk/aws-autoscaling');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/cdk';
import { TopicHook } from './topic-hook';

/**
 * Use a Lambda Function as a hook target
 *
 * Internally creates a Topic to make the connection.
 */
export class FunctionHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetProps {
    const topic = new sns.Topic(scope, 'Topic');
    topic.subscribeLambda(this.fn);
    return new TopicHook(topic).bind(scope, lifecycleHook);
  }
}
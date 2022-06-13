import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import { Construct } from 'constructs';
import { createRole } from './common';
import { TopicHook } from './topic-hook';

/**
 * Use a Lambda Function as a hook target
 *
 * Internally creates a Topic to make the connection.
 */
export class FunctionHook implements autoscaling.ILifecycleHookTarget {
  /**
   * @param fn Function to invoke in response to a lifecycle event
   * @param encryptionKey If provided, this key is used to encrypt the contents of the SNS topic.
   */
  constructor(private readonly fn: lambda.IFunction, private readonly encryptionKey?: kms.IKey) {
  }

  /**
   * If the `IRole` does not exist in `options`, will create an `IRole` and an SNS Topic and attach both to the lifecycle hook.
   * If the `IRole` does exist in `options`, will only create an SNS Topic and attach it to the lifecycle hook.
   */
  public bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const topic = new sns.Topic(_scope, 'Topic', {
      masterKey: this.encryptionKey,
    });

    const role = createRole(_scope, options.role);

    // Per: https://docs.aws.amazon.com/sns/latest/dg/sns-key-management.html#sns-what-permissions-for-sse
    // Topic's grantPublish() is in a base class that does not know there is a kms key, and so does not
    // grant appropriate permissions to the kms key. We do that here to ensure the correct permissions
    // are in place.
    this.encryptionKey?.grant(role, 'kms:Decrypt', 'kms:GenerateDataKey');
    topic.addSubscription(new subs.LambdaSubscription(this.fn));
    return new TopicHook(topic).bind(_scope, { lifecycleHook: options.lifecycleHook, role });
  }
}

import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import { TopicHook } from './topic-hook';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

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

  public bind(scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetConfig {
    const topic = new sns.Topic(scope, 'Topic', {
      masterKey: this.encryptionKey,
    });
    // Per: https://docs.aws.amazon.com/sns/latest/dg/sns-key-management.html#sns-what-permissions-for-sse
    // Topic's grantPublish() is in a base class that does not know there is a kms key, and so does not
    // grant appropriate permissions to the kms key. We do that here to ensure the correct permissions
    // are in place.
    this.encryptionKey?.grant(lifecycleHook.role, 'kms:Decrypt', 'kms:GenerateDataKey');
    topic.addSubscription(new subs.LambdaSubscription(this.fn));
    return new TopicHook(topic).bind(scope, lifecycleHook);
  }
}

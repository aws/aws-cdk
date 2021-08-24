import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SNS topic as a hook target
 */
export class TopicHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(_scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetConfig {
    if (lifecycleHook.role) {
      this.topic.grantPublish(lifecycleHook.role);
      return { notificationTargetArn: this.topic.topicArn };
    } else {
      throw new Error('This `TopicHook` has an undefined `role`');
    }
  }
}

import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SNS topic as a hook target
 */
export class TopicHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(_scope: Construct, lifecycleHook: autoscaling.LifecycleHook): autoscaling.LifecycleHookTargetConfig {
    if (!lifecycleHook.role) {
      lifecycleHook.role = new iam.Role(lifecycleHook, 'Role', {
        assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
      });
    }

    this.topic.grantPublish(lifecycleHook.role);

    return { notificationTargetArn: this.topic.topicArn };
  }
}

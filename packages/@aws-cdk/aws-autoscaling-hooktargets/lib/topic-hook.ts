import autoscaling = require('@aws-cdk/aws-autoscaling');
import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/cdk';

/**
 * Use an SNS topic as a hook target
 */
export class TopicHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(_scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetProps {
    this.topic.grantPublish(lifecycleHook.role);
    return { notificationTargetArn: this.topic.topicArn };
  }
}
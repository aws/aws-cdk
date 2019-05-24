import autoscaling = require('@aws-cdk/aws-autoscaling');
import sns = require('@aws-cdk/aws-sns');

/**
 * Use an SNS topic as a hook target
 */
export class TopicHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetProps {
    this.topic.grantPublish(lifecycleHook.role);
    return { notificationTargetArn: this.topic.topicArn };
  }
}
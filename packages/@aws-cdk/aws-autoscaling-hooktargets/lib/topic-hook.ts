import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from 'constructs';

/**
 * Use an SNS topic as a hook target
 */
export class TopicHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(_scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetConfig {
    this.topic.grantPublish(lifecycleHook.role);
    return { notificationTargetArn: this.topic.topicArn };
  }
}

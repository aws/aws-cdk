import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SNS topic as a hook target
 */
export class TopicHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = autoscaling.createRole(_scope, options.role);
    this.topic.grantPublish(role);

    return {
      notificationTargetArn: this.topic.topicArn,
      createdRole: role,
    };
  }
}

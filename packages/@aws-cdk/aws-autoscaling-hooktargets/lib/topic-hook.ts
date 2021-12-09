import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sns from '@aws-cdk/aws-sns';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

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

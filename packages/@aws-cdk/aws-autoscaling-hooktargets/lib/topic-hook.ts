import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from 'constructs';
import { createRole } from './common';

/**
 * Use an SNS topic as a hook target
 */
export class TopicHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  /**
   * If an `IRole` is found in `options`, grant it topic publishing permissions.
   * Otherwise, create a new `IRole` and grant it topic publishing permissions.
   *
   * @returns the `IRole` with topic publishing permissions and the ARN of the topic it has publishing permission to.
   */
  public bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = createRole(_scope, options.role);
    this.topic.grantPublish(role);

    return {
      notificationTargetArn: this.topic.topicArn,
      createdRole: role,
    };
  }
}

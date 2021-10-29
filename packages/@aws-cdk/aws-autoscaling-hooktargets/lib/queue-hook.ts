import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SQS queue as a hook target
 */
export class QueueHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly queue: sqs.IQueue) {
  }

  public bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = autoscaling.createRole(_scope, options.role);
    this.queue.grantSendMessages(role);

    return {
      notificationTargetArn: this.queue.queueArn,
      createdRole: role,
    };
  }
}

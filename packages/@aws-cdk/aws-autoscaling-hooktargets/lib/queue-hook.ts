import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SQS queue as a hook target
 */
export class QueueHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly queue: sqs.IQueue) {
  }

  public bind(_scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetConfig {
    if (lifecycleHook.role) {
      this.queue.grantSendMessages(lifecycleHook.role);
      return { notificationTargetArn: this.queue.queueArn };
    } else {
      throw new Error('this lifecycle hook has an undefined role');
    }
  }
}

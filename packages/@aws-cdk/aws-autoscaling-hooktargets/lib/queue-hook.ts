import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SQS queue as a hook target
 */
export class QueueHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly queue: sqs.IQueue) {
  }

  public bind(_scope: Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetConfig {
    try { lifecycleHook.role; } catch (noRoleError) {
      lifecycleHook.role = new iam.Role(_scope, 'Role', {
        assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
      });
    }

    this.queue.grantSendMessages(lifecycleHook.role);

    return { notificationTargetArn: this.queue.queueArn };
  }
}

import autoscaling = require('@aws-cdk/aws-autoscaling');
import sqs = require('@aws-cdk/aws-sqs');

/**
 * Use an SQS queue as a hook target
 */
export class QueueHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly queue: sqs.IQueue) {
  }

  public bind(lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetProps {
    this.queue.grantSendMessages(lifecycleHook.role);
    return { notificationTargetArn: this.queue.queueArn };
  }
}

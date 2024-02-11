import { Construct } from 'constructs';
import { createRole } from './common';
import * as autoscaling from '../../aws-autoscaling';
import * as sqs from '../../aws-sqs';

/**
 * Use an SQS queue as a hook target
 */
export class QueueHook implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly queue: sqs.IQueue) {
  }

  /**
   * If an `IRole` is found in `options`, grant it access to send messages.
   * Otherwise, create a new `IRole` and grant it access to send messages.
   *
   * @returns the `IRole` with access to send messages and the ARN of the queue it has access to send messages to.
   */
  public bind(_scope: Construct, _id: string, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = createRole(_scope, options.role);
    this.queue.grantSendMessages(role);

    return {
      notificationTargetArn: this.queue.queueArn,
      createdRole: role,
    };
  }
}

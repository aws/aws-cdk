import { Construct } from 'constructs';
import { createRole } from './common';
import * as autoscaling from '../../aws-autoscaling';
import * as sqs from '../../aws-sqs';

/**
 * Use an SQS queue as a hook target
 */
export class QueueHook implements autoscaling.ILifecycleHookTarget {
  private readonly _queue: sqs.IQueue;
  constructor(queue: sqs.ICfnQueue) {
    this._queue = sqs.Queue.fromCfnQueue(queue);
  }

  /**
   * If an `IRole` is found in `options`, grant it access to send messages.
   * Otherwise, create a new `IRole` and grant it access to send messages.
   *
   * @returns the `IRole` with access to send messages and the ARN of the queue it has access to send messages to.
   */
  public bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = createRole(_scope, options.role);
    this._queue.grantSendMessages(role);

    return {
      notificationTargetArn: this._queue.attrArn,
      createdRole: role,
    };
  }
}

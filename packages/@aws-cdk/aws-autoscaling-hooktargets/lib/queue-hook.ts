import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sqs from '@aws-cdk/aws-sqs';
import { createRole } from './common';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

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
  public bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = createRole(_scope, options.role);
    this.queue.grantSendMessages(role);

    return {
      notificationTargetArn: this.queue.queueArn,
      createdRole: role,
    };
  }
}

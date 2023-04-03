import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from 'constructs';
/**
 * Use an SQS queue as a hook target
 */
export declare class QueueHook implements autoscaling.ILifecycleHookTarget {
    private readonly queue;
    constructor(queue: sqs.IQueue);
    /**
     * If an `IRole` is found in `options`, grant it access to send messages.
     * Otherwise, create a new `IRole` and grant it access to send messages.
     *
     * @returns the `IRole` with access to send messages and the ARN of the queue it has access to send messages to.
     */
    bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig;
}

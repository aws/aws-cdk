import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from 'constructs';
/**
 * Use an SNS topic as a hook target
 */
export declare class TopicHook implements autoscaling.ILifecycleHookTarget {
    private readonly topic;
    constructor(topic: sns.ITopic);
    /**
     * If an `IRole` is found in `options`, grant it topic publishing permissions.
     * Otherwise, create a new `IRole` and grant it topic publishing permissions.
     *
     * @returns the `IRole` with topic publishing permissions and the ARN of the topic it has publishing permission to.
     */
    bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig;
}

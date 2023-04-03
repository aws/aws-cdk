import * as iam from '@aws-cdk/aws-iam';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAutoScalingGroup } from './auto-scaling-group';
import { ILifecycleHookTarget } from './lifecycle-hook-target';
/**
 * Basic properties for a lifecycle hook
 */
export interface BasicLifecycleHookProps {
    /**
     * Name of the lifecycle hook
     *
     * @default - Automatically generated name.
     */
    readonly lifecycleHookName?: string;
    /**
     * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs.
     *
     * @default Continue
     */
    readonly defaultResult?: DefaultResult;
    /**
     * Maximum time between calls to RecordLifecycleActionHeartbeat for the hook
     *
     * If the lifecycle hook times out, perform the action in DefaultResult.
     *
     * @default - No heartbeat timeout.
     */
    readonly heartbeatTimeout?: Duration;
    /**
     * The state of the Amazon EC2 instance to which you want to attach the lifecycle hook.
     */
    readonly lifecycleTransition: LifecycleTransition;
    /**
     * Additional data to pass to the lifecycle hook target
     *
     * @default - No metadata.
     */
    readonly notificationMetadata?: string;
    /**
     * The target of the lifecycle hook
     *
     * @default - No target.
     */
    readonly notificationTarget?: ILifecycleHookTarget;
    /**
     * The role that allows publishing to the notification target
     *
     * @default - A role will be created if a target is provided. Otherwise, no role is created.
     */
    readonly role?: iam.IRole;
}
/**
 * Properties for a Lifecycle hook
 */
export interface LifecycleHookProps extends BasicLifecycleHookProps {
    /**
     * The AutoScalingGroup to add the lifecycle hook to
     */
    readonly autoScalingGroup: IAutoScalingGroup;
}
/**
 * A basic lifecycle hook object
 */
export interface ILifecycleHook extends IResource {
    /**
     * The role for the lifecycle hook to execute
     *
     * @default - A default role is created if 'notificationTarget' is specified.
     * Otherwise, no role is created.
     */
    readonly role: iam.IRole;
}
/**
 * Define a life cycle hook
 */
export declare class LifecycleHook extends Resource implements ILifecycleHook {
    private _role?;
    /**
     * The role that allows the ASG to publish to the notification target
     *
     * @default - A default role is created if 'notificationTarget' is specified.
     * Otherwise, no role is created.
     */
    get role(): iam.IRole;
    /**
     * The name of this lifecycle hook
     * @attribute
     */
    readonly lifecycleHookName: string;
    constructor(scope: Construct, id: string, props: LifecycleHookProps);
}
export declare enum DefaultResult {
    CONTINUE = "CONTINUE",
    ABANDON = "ABANDON"
}
/**
 * What instance transition to attach the hook to
 */
export declare enum LifecycleTransition {
    /**
     * Execute the hook when an instance is about to be added
     */
    INSTANCE_LAUNCHING = "autoscaling:EC2_INSTANCE_LAUNCHING",
    /**
     * Execute the hook when an instance is about to be terminated
     */
    INSTANCE_TERMINATING = "autoscaling:EC2_INSTANCE_TERMINATING"
}

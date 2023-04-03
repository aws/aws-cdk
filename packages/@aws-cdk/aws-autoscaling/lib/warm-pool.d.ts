import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAutoScalingGroup } from './auto-scaling-group';
/**
 * Options for a warm pool
 */
export interface WarmPoolOptions {
    /**
     * Indicates whether instances in the Auto Scaling group can be returned to the warm pool on scale in.
     *
     * If the value is not specified, instances in the Auto Scaling group will be terminated
     * when the group scales in.
     *
     * @default false
     */
    readonly reuseOnScaleIn?: boolean;
    /**
     * The maximum number of instances that are allowed to be in the warm pool
     * or in any state except Terminated for the Auto Scaling group.
     *
     * If the value is not specified, Amazon EC2 Auto Scaling launches and maintains
     * the difference between the group's maximum capacity and its desired capacity.
     *
     * @default - max size of the Auto Scaling group
     */
    readonly maxGroupPreparedCapacity?: number;
    /**
     * The minimum number of instances to maintain in the warm pool.
     *
     * @default 0
     */
    readonly minSize?: number;
    /**
     * The instance state to transition to after the lifecycle actions are complete.
     *
     * @default PoolState.STOPPED
     */
    readonly poolState?: PoolState;
}
/**
 * Properties for a warm pool
 */
export interface WarmPoolProps extends WarmPoolOptions {
    /**
     * The Auto Scaling group to add the warm pool to.
     */
    readonly autoScalingGroup: IAutoScalingGroup;
}
/**
 * Define a warm pool
 */
export declare class WarmPool extends Resource {
    constructor(scope: Construct, id: string, props: WarmPoolProps);
}
/**
 * The instance state in the warm pool
 */
export declare enum PoolState {
    /**
     * Hibernated
     *
     * To use this state, prerequisites must be in place.
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html
     */
    HIBERNATED = "Hibernated",
    /**
     * Running
     */
    RUNNING = "Running",
    /**
     * Stopped
     */
    STOPPED = "Stopped"
}

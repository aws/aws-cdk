import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents the structure to pass into the underlying CfnDeploymentConfig class.
 */
export interface TrafficRoutingConfig {
    /**
     * The type of traffic shifting ( `TimeBasedCanary` or `TimeBasedLinear` ) used by a deployment configuration.
     */
    readonly type: string;
    /**
     * A configuration that shifts traffic from one version of a Lambda function or ECS task set to another in two increments.
     * @default none
     */
    readonly timeBasedCanary?: CanaryTrafficRoutingConfig;
    /**
     * A configuration that shifts traffic from one version of a Lambda function or Amazon ECS task set to another in equal increments, with an equal number of minutes between each increment.
     * @default none
     */
    readonly timeBasedLinear?: LinearTrafficRoutingConfig;
}
/**
 * Represents the configuration specific to canary traffic shifting.
 */
export interface CanaryTrafficRoutingConfig {
    /**
     * The number of minutes between the first and second traffic shifts of a `TimeBasedCanary` deployment.
     */
    readonly canaryInterval: number;
    /**
     * The percentage of traffic to shift in the first increment of a `TimeBasedCanary` deployment.
     */
    readonly canaryPercentage: number;
}
/**
 * Represents the configuration specific to linear traffic shifting.
 */
export interface LinearTrafficRoutingConfig {
    /**
     * The number of minutes between each incremental traffic shift of a `TimeBasedLinear` deployment.
     */
    readonly linearInterval: number;
    /**
     * The percentage of traffic that is shifted at the start of each increment of a `TimeBasedLinear` deployment.
     */
    readonly linearPercentage: number;
}
/**
 * Represents how traffic is shifted during a CodeDeploy deployment.
 */
export declare abstract class TrafficRouting {
    /**
     * Shifts 100% of traffic in a single shift.
     */
    static allAtOnce(): TrafficRouting;
    /**
     * Shifts a specified percentage of traffic, waits for a specified amount of time, then shifts the rest of traffic.
     */
    static timeBasedCanary(props: TimeBasedCanaryTrafficRoutingProps): TrafficRouting;
    /**
     * Keeps shifting a specified percentage of traffic until reaching 100%, waiting for a specified amount of time in between each traffic shift.
     */
    static timeBasedLinear(props: TimeBasedLinearTrafficRoutingProps): TrafficRouting;
    /**
     * Returns the traffic routing configuration.
     */
    abstract bind(scope: Construct): TrafficRoutingConfig;
}
/**
 * Common properties of traffic shifting routing configurations
 */
export interface BaseTrafficShiftingConfigProps {
    /**
     * The amount of time between traffic shifts.
     */
    readonly interval: Duration;
    /**
     * The percentage to increase traffic on each traffic shift.
     */
    readonly percentage: number;
}
/**
 * Define a traffic routing config of type 'AllAtOnce'.
 */
export declare class AllAtOnceTrafficRouting extends TrafficRouting {
    constructor();
    /**
     * Return a TrafficRoutingConfig of type `AllAtOnce`.
     */
    bind(_scope: Construct): TrafficRoutingConfig;
}
/**
 * Construction properties for `TimeBasedCanaryTrafficRouting`.
 */
export interface TimeBasedCanaryTrafficRoutingProps extends BaseTrafficShiftingConfigProps {
}
/**
 * Define a traffic routing config of type 'TimeBasedCanary'.
 */
export declare class TimeBasedCanaryTrafficRouting extends TrafficRouting {
    /**
     * The amount of time between additional traffic shifts.
     */
    readonly interval: Duration;
    /**
     * The percentage to increase traffic on each traffic shift.
     */
    readonly percentage: number;
    constructor(props: TimeBasedCanaryTrafficRoutingProps);
    /**
     * Return a TrafficRoutingConfig of type `TimeBasedCanary`.
     */
    bind(_scope: Construct): TrafficRoutingConfig;
}
/**
 * Construction properties for `TimeBasedLinearTrafficRouting`.
 */
export interface TimeBasedLinearTrafficRoutingProps extends BaseTrafficShiftingConfigProps {
}
/**
 * Define a traffic routing config of type 'TimeBasedLinear'.
 */
export declare class TimeBasedLinearTrafficRouting extends TrafficRouting {
    /**
     * The amount of time between additional traffic shifts.
     */
    readonly interval: Duration;
    /**
     * The percentage to increase traffic on each traffic shift.
     */
    readonly percentage: number;
    constructor(props: TimeBasedLinearTrafficRoutingProps);
    /**
     * Return a TrafficRoutingConfig of type `TimeBasedLinear`.
     */
    bind(_scope: Construct): TrafficRoutingConfig;
}

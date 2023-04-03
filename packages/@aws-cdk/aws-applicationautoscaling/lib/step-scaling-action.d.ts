import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IScalableTarget } from './scalable-target';
/**
 * Properties for a scaling policy
 */
export interface StepScalingActionProps {
    /**
     * The scalable target
     */
    readonly scalingTarget: IScalableTarget;
    /**
     * A name for the scaling policy
     *
     * @default Automatically generated name
     */
    readonly policyName?: string;
    /**
     * How the adjustment numbers are interpreted
     *
     * @default ChangeInCapacity
     */
    readonly adjustmentType?: AdjustmentType;
    /**
     * Grace period after scaling activity.
     *
     * For scale out policies, multiple scale outs during the cooldown period are
     * squashed so that only the biggest scale out happens.
     *
     * For scale in policies, subsequent scale ins during the cooldown period are
     * ignored.
     *
     * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_StepScalingPolicyConfiguration.html
     * @default No cooldown period
     */
    readonly cooldown?: cdk.Duration;
    /**
     * Minimum absolute number to adjust capacity with as result of percentage scaling.
     *
     * Only when using AdjustmentType = PercentChangeInCapacity, this number controls
     * the minimum absolute effect size.
     *
     * @default No minimum scaling effect
     */
    readonly minAdjustmentMagnitude?: number;
    /**
     * The aggregation type for the CloudWatch metrics.
     *
     * @default Average
     */
    readonly metricAggregationType?: MetricAggregationType;
}
/**
 * Define a step scaling action
 *
 * This kind of scaling policy adjusts the target capacity in configurable
 * steps. The size of the step is configurable based on the metric's distance
 * to its alarm threshold.
 *
 * This Action must be used as the target of a CloudWatch alarm to take effect.
 */
export declare class StepScalingAction extends Construct {
    /**
     * ARN of the scaling policy
     */
    readonly scalingPolicyArn: string;
    private readonly adjustments;
    constructor(scope: Construct, id: string, props: StepScalingActionProps);
    /**
     * Add an adjusment interval to the ScalingAction
     */
    addAdjustment(adjustment: AdjustmentTier): void;
}
/**
 * How adjustment numbers are interpreted
 */
export declare enum AdjustmentType {
    /**
     * Add the adjustment number to the current capacity.
     *
     * A positive number increases capacity, a negative number decreases capacity.
     */
    CHANGE_IN_CAPACITY = "ChangeInCapacity",
    /**
     * Add this percentage of the current capacity to itself.
     *
     * The number must be between -100 and 100; a positive number increases
     * capacity and a negative number decreases it.
     */
    PERCENT_CHANGE_IN_CAPACITY = "PercentChangeInCapacity",
    /**
     * Make the capacity equal to the exact number given.
     */
    EXACT_CAPACITY = "ExactCapacity"
}
/**
 * How the scaling metric is going to be aggregated
 */
export declare enum MetricAggregationType {
    /**
     * Average
     */
    AVERAGE = "Average",
    /**
     * Minimum
     */
    MINIMUM = "Minimum",
    /**
     * Maximum
     */
    MAXIMUM = "Maximum"
}
/**
 * An adjustment
 */
export interface AdjustmentTier {
    /**
     * What number to adjust the capacity with
     *
     * The number is interpeted as an added capacity, a new fixed capacity or an
     * added percentage depending on the AdjustmentType value of the
     * StepScalingPolicy.
     *
     * Can be positive or negative.
     */
    readonly adjustment: number;
    /**
     * Lower bound where this scaling tier applies.
     *
     * The scaling tier applies if the difference between the metric
     * value and its alarm threshold is higher than this value.
     *
     * @default -Infinity if this is the first tier, otherwise the upperBound of the previous tier
     */
    readonly lowerBound?: number;
    /**
     * Upper bound where this scaling tier applies
     *
     * The scaling tier applies if the difference between the metric
     * value and its alarm threshold is lower than this value.
     *
     * @default +Infinity
     */
    readonly upperBound?: number;
}

import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAutoScalingGroup } from './auto-scaling-group';
import { AdjustmentType, MetricAggregationType, StepScalingAction } from './step-scaling-action';
export interface BasicStepScalingPolicyProps {
    /**
     * Metric to scale on.
     */
    readonly metric: cloudwatch.IMetric;
    /**
     * The intervals for scaling.
     *
     * Maps a range of metric values to a particular scaling behavior.
     */
    readonly scalingSteps: ScalingInterval[];
    /**
     * How the adjustment numbers inside 'intervals' are interpreted.
     *
     * @default ChangeInCapacity
     */
    readonly adjustmentType?: AdjustmentType;
    /**
     * Grace period after scaling activity.
     *
     * @default Default cooldown period on your AutoScalingGroup
     */
    readonly cooldown?: Duration;
    /**
     * Estimated time until a newly launched instance can send metrics to CloudWatch.
     *
     * @default Same as the cooldown
     */
    readonly estimatedInstanceWarmup?: Duration;
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
     * How many evaluation periods of the metric to wait before triggering a scaling action
     *
     * Raising this value can be used to smooth out the metric, at the expense
     * of slower response times.
     *
     * @default 1
     */
    readonly evaluationPeriods?: number;
    /**
     * Aggregation to apply to all data points over the evaluation periods
     *
     * Only has meaning if `evaluationPeriods != 1`.
     *
     * @default - The statistic from the metric if applicable (MIN, MAX, AVERAGE), otherwise AVERAGE.
     */
    readonly metricAggregationType?: MetricAggregationType;
}
export interface StepScalingPolicyProps extends BasicStepScalingPolicyProps {
    /**
     * The auto scaling group
     */
    readonly autoScalingGroup: IAutoScalingGroup;
}
/**
 * Define a acaling strategy which scales depending on absolute values of some metric.
 *
 * You can specify the scaling behavior for various values of the metric.
 *
 * Implemented using one or more CloudWatch alarms and Step Scaling Policies.
 */
export declare class StepScalingPolicy extends Construct {
    readonly lowerAlarm?: cloudwatch.Alarm;
    readonly lowerAction?: StepScalingAction;
    readonly upperAlarm?: cloudwatch.Alarm;
    readonly upperAction?: StepScalingAction;
    constructor(scope: Construct, id: string, props: StepScalingPolicyProps);
}
/**
 * A range of metric values in which to apply a certain scaling operation
 */
export interface ScalingInterval {
    /**
     * The lower bound of the interval.
     *
     * The scaling adjustment will be applied if the metric is higher than this value.
     *
     * @default Threshold automatically derived from neighbouring intervals
     */
    readonly lower?: number;
    /**
     * The upper bound of the interval.
     *
     * The scaling adjustment will be applied if the metric is lower than this value.
     *
     * @default Threshold automatically derived from neighbouring intervals
     */
    readonly upper?: number;
    /**
     * The capacity adjustment to apply in this interval
     *
     * The number is interpreted differently based on AdjustmentType:
     *
     * - ChangeInCapacity: add the adjustment to the current capacity.
     *  The number can be positive or negative.
     * - PercentChangeInCapacity: add or remove the given percentage of the current
     *   capacity to itself. The number can be in the range [-100..100].
     * - ExactCapacity: set the capacity to this number. The number must
     *   be positive.
     */
    readonly change: number;
}

import { findAlarmThresholds, normalizeIntervals } from '@aws-cdk/aws-autoscaling-common';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { IAutoScalingGroup } from './auto-scaling-group';
import { AdjustmentType, MetricAggregationType, StepScalingAction } from './step-scaling-action';

export interface BasicStepScalingPolicyProps {
  /**
   * Metric to scale on.
   */
  metric: cloudwatch.Metric;

  /**
   * The intervals for scaling.
   *
   * Maps a range of metric values to a particular scaling behavior.
   */
  scalingSteps: ScalingInterval[];

  /**
   * How the adjustment numbers inside 'intervals' are interpreted.
   *
   * @default ChangeInCapacity
   */
  adjustmentType?: AdjustmentType;

  /**
   * Grace period after scaling activity.
   *
   * @default Default cooldown period on your AutoScalingGroup
   */
  cooldownSeconds?: number;

  /**
   * Estimated time until a newly launched instance can send metrics to CloudWatch.
   *
   * @default Same as the cooldown
   */
  estimatedInstanceWarmupSeconds?: number;

  /**
   * Minimum absolute number to adjust capacity with as result of percentage scaling.
   *
   * Only when using AdjustmentType = PercentChangeInCapacity, this number controls
   * the minimum absolute effect size.
   *
   * @default No minimum scaling effect
   */
  minAdjustmentMagnitude?: number;
}

export interface StepScalingPolicyProps extends BasicStepScalingPolicyProps {
  /**
   * The auto scaling group
   */
  autoScalingGroup: IAutoScalingGroup;
}

/**
 * Define a acaling strategy which scales depending on absolute values of some metric.
 *
 * You can specify the scaling behavior for various values of the metric.
 *
 * Implemented using one or more CloudWatch alarms and Step Scaling Policies.
 */
export class StepScalingPolicy extends cdk.Construct {
  public readonly lowerAlarm?: cloudwatch.Alarm;
  public readonly lowerAction?: StepScalingAction;
  public readonly upperAlarm?: cloudwatch.Alarm;
  public readonly upperAction?: StepScalingAction;

  constructor(parent: cdk.Construct, id: string, props: StepScalingPolicyProps) {
    super(parent, id);

    if (props.scalingSteps.length < 2) {
      throw new Error('You must supply at least 2 intervals for autoscaling');
    }

    const adjustmentType = props.adjustmentType || AdjustmentType.ChangeInCapacity;
    const changesAreAbsolute = adjustmentType === AdjustmentType.ExactCapacity;

    const intervals = normalizeIntervals(props.scalingSteps, changesAreAbsolute);
    const alarms = findAlarmThresholds(intervals);

    if (alarms.lowerAlarmIntervalIndex !== undefined) {
      const threshold = intervals[alarms.lowerAlarmIntervalIndex].upper;

      this.lowerAction = new StepScalingAction(this, 'LowerPolicy', {
        adjustmentType: props.adjustmentType,
        cooldownSeconds: props.cooldownSeconds,
        metricAggregationType: aggregationTypeFromMetric(props.metric),
        minAdjustmentMagnitude: props.minAdjustmentMagnitude,
        autoScalingGroup: props.autoScalingGroup,
      });

      for (let i = alarms.lowerAlarmIntervalIndex; i >= 0; i--) {
        this.lowerAction.addAdjustment({
          adjustment: intervals[i].change!,
          lowerBound: i !== 0 ? intervals[i].lower - threshold : undefined, // Extend last interval to -infinity
          upperBound: intervals[i].upper - threshold,
        });
      }

      this.lowerAlarm = new cloudwatch.Alarm(this, 'LowerAlarm', {
        // Recommended by AutoScaling
        metric: props.metric.with({ periodSec: 60 }),
        alarmDescription: 'Lower threshold scaling alarm',
        comparisonOperator: cloudwatch.ComparisonOperator.LessThanOrEqualToThreshold,
        evaluationPeriods: 1,
        threshold,
      });
      this.lowerAlarm.onAlarm(this.lowerAction);
    }

    if (alarms.upperAlarmIntervalIndex !== undefined) {
      const threshold = intervals[alarms.upperAlarmIntervalIndex].lower;

      this.upperAction = new StepScalingAction(this, 'UpperPolicy', {
        adjustmentType: props.adjustmentType,
        cooldownSeconds: props.cooldownSeconds,
        metricAggregationType: aggregationTypeFromMetric(props.metric),
        minAdjustmentMagnitude: props.minAdjustmentMagnitude,
        autoScalingGroup: props.autoScalingGroup,
      });

      for (let i = alarms.upperAlarmIntervalIndex; i < intervals.length; i++) {
        this.upperAction.addAdjustment({
          adjustment: intervals[i].change!,
          lowerBound: intervals[i].lower - threshold,
          upperBound: i !== intervals.length - 1 ? intervals[i].upper - threshold : undefined, // Extend last interval to +infinity
        });
      }

      this.upperAlarm = new cloudwatch.Alarm(this, 'UpperAlarm', {
        // Recommended by AutoScaling
        metric: props.metric.with({ periodSec: 60 }),
        alarmDescription: 'Upper threshold scaling alarm',
        comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanOrEqualToThreshold,
        evaluationPeriods: 1,
        threshold,
      });
      this.upperAlarm.onAlarm(this.upperAction);
    }
  }
}

function aggregationTypeFromMetric(metric: cloudwatch.Metric): MetricAggregationType {
  switch (metric.statistic) {
    case 'Average':
      return MetricAggregationType.Average;
    case 'Minimum':
      return MetricAggregationType.Minimum;
    case 'Maximum':
      return MetricAggregationType.Maximum;
    default:
      throw new Error(`Cannot only scale on 'Minimum', 'Maximum', 'Average' metrics, got ${metric.statistic}`);
  }
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
  lower?: number;

  /**
   * The upper bound of the interval.
   *
   * The scaling adjustment will be applied if the metric is lower than this value.
   *
   * @default Threshold automatically derived from neighbouring intervals
   */
  upper?: number;

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
  change: number;
}
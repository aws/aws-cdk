import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { findAlarmThresholds, normalizeIntervals } from './interval-utils';
import { ScalableTarget } from './scalable-target';
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
   * Subsequent scale outs during the cooldown period are squashed so that only
   * the biggest scale out happens.
   *
   * Subsequent scale ins during the cooldown period are ignored.
   *
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_StepScalingPolicyConfiguration.html
   * @default No cooldown period
   */
  cooldownSec?: number;

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
   * The scaling target
   */
  scalingTarget: ScalableTarget;
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

    if (alarms.lowerAlarmIntervalIndex) {
      const threshold = intervals[alarms.lowerAlarmIntervalIndex].upper;

      this.lowerAction = new StepScalingAction(this, 'LowerPolicy', {
        adjustmentType: props.adjustmentType,
        cooldownSec: props.cooldownSec,
        metricAggregationType: aggregationTypeFromMetric(props.metric),
        minAdjustmentMagnitude: props.minAdjustmentMagnitude,
        scalingTarget: props.scalingTarget,
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
        comparisonOperator: cloudwatch.ComparisonOperator.LessThanThreshold,
        evaluationPeriods: 1,
        threshold,
      });
      this.lowerAlarm.onAlarm(this.lowerAction);
    }

    if (alarms.upperAlarmIntervalIndex) {
      const threshold = intervals[alarms.upperAlarmIntervalIndex].lower;

      this.upperAction = new StepScalingAction(this, 'UpperPolicy', {
        adjustmentType: props.adjustmentType,
        cooldownSec: props.cooldownSec,
        metricAggregationType: aggregationTypeFromMetric(props.metric),
        minAdjustmentMagnitude: props.minAdjustmentMagnitude,
        scalingTarget: props.scalingTarget,
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
        comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanThreshold,
        evaluationPeriods: 1,
        threshold,
      });
      this.upperAlarm.onAlarm(this.upperAction);
    }
  }
}

export interface ScalingInterval {
  lower?: number;
  upper?: number;
  change: number;
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
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './applicationautoscaling.generated';
import { BaseScalingPolicy, BaseScalingPolicyProps } from "./base-scaling-policy";

/**
 * Properties for a scaling policy
 */
export interface StepScalingPolicyProps extends BaseScalingPolicyProps {
  /**
   * How the adjustment numbers are interpreted
   *
   * @default ChangeInCapacity
   */
  adjustmentType?: AdjustmentType;

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
  cooldownSeconds?: number;

  /**
   * Minimum absolute number to adjust capacity with as result of percentage scaling.
   *
   * Only when using AdjustmentType = PercentChangeInCapacity, this number controls
   * the minimum absolute effect size.
   *
   * @default No minimum scaling effect
   */
  minAdjustmentMagnitude?: number;

  /**
   * The aggregation type for the CloudWatch metrics.
   *
   * @default Average
   */
  metricAggregationType?: MetricAggregationType;
}

/**
 * Define a step scaling policy
 *
 * This kind of scaling policy adjusts the target capacity in configurable
 * steps. The size of the step is configurable based on the metric's distance
 * to its alarm threshold.
 */
export class StepScalingPolicy extends BaseScalingPolicy implements cloudwatch.IAlarmAction {
  public readonly alarmActionArn: string;
  private readonly adjustments = new Array<cloudformation.ScalingPolicyResource.StepAdjustmentProperty>();

  constructor(parent: cdk.Construct, id: string, props: StepScalingPolicyProps) {
    super(parent, id, props, {
      policyType: 'StepScaling',
      stepScalingPolicyConfiguration: {
        adjustmentType: props.adjustmentType,
        cooldown: props.cooldownSeconds,
        minAdjustmentMagnitude: props.minAdjustmentMagnitude,
        metricAggregationType: props.metricAggregationType,
        stepAdjustments: new cdk.Token(() => this.adjustments),
      } as cloudformation.ScalingPolicyResource.StepScalingPolicyConfigurationProperty
    });
    this.alarmActionArn = this.scalingPolicyArn;
  }
}

/**
 * How adjustment numbers are interpreted
 */
export enum AdjustmentType {
  /**
   * Add the adjustment number to the current capacity.
   *
   * A positive number increases capacity, a negative number decreases capacity.
   */
  ChangeInCapacity = 'ChangeInCapacity',

  /**
   * Add this percentage of the current capacity to itself.
   *
   * The number must be between -100 and 100; a positive number increases
   * capacity and a negative number decreases it.
   */
  PercentChangeInCapacity = 'PercentChangeInCapacity',

  /**
   * Make the capacity equal to the exact number given.
   */
  ExactCapacity = 'ExactCapacity',
}

/**
 * How the scaling metric is going to be aggregated
 */
export enum MetricAggregationType {
  /**
   * Average
   */
  Average = 'Average',

  /**
   * Minimum
   */
  Minimum = 'Minimum',

  /**
   * Maximum
   */
  Maximum = 'Maximum'
}

export interface ITierRange {
  scaleBy(adjustment: number): ITierMark;
}

export interface ITierMark {
  at(threshold: number): ITierRange;

  endAt0(): StepScalingPolicy;

  endAtInfinity(): StepScalingPolicy;
}
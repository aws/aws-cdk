import { Construct } from 'constructs';
import { IAutoScalingGroup } from './auto-scaling-group';
import { CfnScalingPolicy } from './autoscaling.generated';
import { Annotations, Duration, Lazy, ValidationError } from '../../core';

/**
 * Properties for a scaling policy
 */
export interface StepScalingActionProps {
  /**
   * The auto scaling group
   */
  readonly autoScalingGroup: IAutoScalingGroup;

  /**
   * Period after a scaling completes before another scaling activity can start.
   *
   * @default The default cooldown configured on the AutoScalingGroup
   * @deprecated cooldown is not valid with step scaling action
   */
  readonly cooldown?: Duration;

  /**
   * Estimated time until a newly launched instance can send metrics to CloudWatch.
   *
   * @default Same as the cooldown
   */
  readonly estimatedInstanceWarmup?: Duration;

  /**
   * How the adjustment numbers are interpreted
   *
   * @default ChangeInCapacity
   */
  readonly adjustmentType?: AdjustmentType;

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
export class StepScalingAction extends Construct {
  /**
   * ARN of the scaling policy
   */
  public readonly scalingPolicyArn: string;

  private readonly adjustments = new Array<CfnScalingPolicy.StepAdjustmentProperty>();

  constructor(scope: Construct, id: string, props: StepScalingActionProps) {
    super(scope, id);

    // Specify cooldown property in StepScaling policy type is ineffective and may cause deployment failure
    // in certain regions. We can't simply remove the property since it break existing users. Since setting
    // this value is ineffective, we can safely ignore the value of this property with a warning.
    if (props.cooldown) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-autoscaling:cooldownOnStepScaling', '\'Cooldown\' is valid only if the policy type is SimpleScaling. Default to ignore the values set.');
    }

    const resource = new CfnScalingPolicy(this, 'Resource', {
      policyType: 'StepScaling',
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
      estimatedInstanceWarmup: props.estimatedInstanceWarmup && props.estimatedInstanceWarmup.toSeconds(),
      adjustmentType: props.adjustmentType,
      minAdjustmentMagnitude: props.minAdjustmentMagnitude,
      metricAggregationType: props.metricAggregationType,
      stepAdjustments: Lazy.any({ produce: () => this.adjustments }),
    });

    this.scalingPolicyArn = resource.ref;
  }

  /**
   * Add an adjusment interval to the ScalingAction
   */
  public addAdjustment(adjustment: AdjustmentTier) {
    if (adjustment.lowerBound === undefined && adjustment.upperBound === undefined) {
      throw new ValidationError('At least one of lowerBound or upperBound is required', this);
    }
    this.adjustments.push({
      metricIntervalLowerBound: adjustment.lowerBound,
      metricIntervalUpperBound: adjustment.upperBound,
      scalingAdjustment: adjustment.adjustment,
    });
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
  CHANGE_IN_CAPACITY = 'ChangeInCapacity',

  /**
   * Add this percentage of the current capacity to itself.
   *
   * The number must be between -100 and 100; a positive number increases
   * capacity and a negative number decreases it.
   */
  PERCENT_CHANGE_IN_CAPACITY = 'PercentChangeInCapacity',

  /**
   * Make the capacity equal to the exact number given.
   */
  EXACT_CAPACITY = 'ExactCapacity',
}

/**
 * How the scaling metric is going to be aggregated
 */
export enum MetricAggregationType {
  /**
   * Average
   */
  AVERAGE = 'Average',

  /**
   * Minimum
   */
  MINIMUM = 'Minimum',

  /**
   * Maximum
   */
  MAXIMUM = 'Maximum',
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

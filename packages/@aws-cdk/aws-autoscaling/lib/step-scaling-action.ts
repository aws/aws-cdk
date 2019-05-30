import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { IAutoScalingGroup } from './auto-scaling-group';
import { CfnScalingPolicy } from './autoscaling.generated';

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
   */
  readonly cooldownSeconds?: number;

  /**
   * Estimated time until a newly launched instance can send metrics to CloudWatch.
   *
   * @default Same as the cooldown
   */
  readonly estimatedInstanceWarmupSeconds?: number;

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
export class StepScalingAction extends cdk.Construct {
  /**
   * ARN of the scaling policy
   */
  public readonly scalingPolicyArn: string;

  private readonly adjustments = new Array<CfnScalingPolicy.StepAdjustmentProperty>();

  constructor(scope: cdk.Construct, id: string, props: StepScalingActionProps) {
    super(scope, id);

    const resource = new CfnScalingPolicy(this, 'Resource', {
      policyType: 'StepScaling',
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
      cooldown: props.cooldownSeconds !== undefined ? `${props.cooldownSeconds}` : undefined,
      estimatedInstanceWarmup: props.estimatedInstanceWarmupSeconds,
      adjustmentType: props.adjustmentType,
      minAdjustmentMagnitude: props.minAdjustmentMagnitude,
      metricAggregationType: props.metricAggregationType,
      stepAdjustments: new cdk.Token(() => this.adjustments),
    });

    this.scalingPolicyArn = resource.scalingPolicyArn;
  }

  /**
   * Add an adjusment interval to the ScalingAction
   */
  public addAdjustment(adjustment: AdjustmentTier) {
    if (adjustment.lowerBound === undefined && adjustment.upperBound === undefined) {
      throw new Error('At least one of lowerBound or upperBound is required');
    }
    this.adjustments.push({
      metricIntervalLowerBound: adjustment.lowerBound,
      metricIntervalUpperBound: adjustment.upperBound,
      scalingAdjustment: adjustment.adjustment,
    });
  }
}

/**
 * Use a StepScalingAction as an Alarm Action
 *
 * This class is here and not in aws-cloudwatch-actions because this library
 * needs to use the class, and otherwise we'd have a circular dependency:
 *
 * aws-autoscaling -> aws-cloudwatch-actions (for using the Action)
 * aws-cloudwatch-actions -> aws-autoscaling (for the definition of IStepScalingAction)
 */
export class StepScalingAlarmAction implements cloudwatch.IAlarmAction {
  constructor(private readonly stepScalingAction: StepScalingAction) {
  }

  public bind(_scope: cdk.Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionProperties {
    return { alarmActionArn: this.stepScalingAction.scalingPolicyArn };
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
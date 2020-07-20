import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import { Construct } from '@aws-cdk/core';

/**
 * Interface for scalable attributes
 */
export interface IScalableFunctionAttribute {
  /**
   * Scale out or in to keep utilization at a given level. The utilization is tracked by the
   * LambdaProvisionedConcurrencyUtilization metric, emitted by lambda. See:
   * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
   *
   * Allowed values: 0.1 - 0.9.
   */
  scaleOnUtilization(props: UtilizationScalingOptions): void;
  /**
   * Scale out or in based on schedule.
   */
  scaleOnSchedule(id: string, actions: appscaling.ScalingSchedule): void;
}

/**
 * Properties for enabling Lambda utilization tracking
 */
export interface UtilizationScalingOptions extends appscaling.BaseTargetTrackingProps {
  /**
   * Target utilization percent for the attribute.
   *
   * Allowed values: 0.1 - 0.9.
   */
  readonly targetUtilizationPercent: number;
}

/**
 * A scalable lambda alias attribute
 */
export class ScalableFunctionAttribute extends appscaling.BaseScalableAttribute {
  constructor(scope: Construct, id: string, props: appscaling.BaseScalableAttributeProps) {
    super(scope, id, props);
  }

  /**
   * Scale out or in to keep utilization at a given level. The utilization is tracked by the
   * LambdaProvisionedConcurrencyUtilization metric, emitted by lambda. See:
   * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
   *
   * Allowed values: 0.1 - 0.9.
   */
  public scaleOnUtilization(props: UtilizationScalingOptions) {
    if (props.targetUtilizationPercent < 0.1 || props.targetUtilizationPercent > 0.9) {
      throw new Error('TargetUtilizationPercent should be between 0.1 and 0.9.');
    }
    super.doScaleToTrackMetric('Tracking', {
      targetValue: props.targetUtilizationPercent,
      predefinedMetric: appscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
      ...props,
    });
  }

  /**
   * Scale out or in based on schedule.
   */
  public scaleOnSchedule(id: string, action: appscaling.ScalingSchedule) {
    super.doScaleOnSchedule(id, action);
  }
}

/**
 * Properties for enabling Lambda capacity scaling
 */
export interface EnableScalingProps {
  /**
   * Minimum capacity to scale to
   */
  readonly minCapacity: number;

  /**
   * Maximum capacity to scale to
   */
  readonly maxCapacity: number;
}
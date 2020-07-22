import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import { IConstruct, Token } from '@aws-cdk/core';

/**
 * Interface for scalable attributes
 */
export interface IScalableFunctionAttribute extends IConstruct {
  /**
   * Scale out or in to keep utilization at a given level. The utilization is tracked by the
   * LambdaProvisionedConcurrencyUtilization metric, emitted by lambda. See:
   * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
   *
   * Allowed values: 0.1 - 0.9.
   */
  scaleOnUtilization(options: UtilizationScalingOptions): void;
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
   * Utilization target for the attribute. For example, .5 indicates that 50 percent of allocated provisioned concurrency is in use.
   *
   * Allowed values: 0.1 - 0.9.
   */
  readonly utilizationTarget: number;
}

/**
 * A scalable lambda alias attribute
 */
export class ScalableFunctionAttribute extends appscaling.BaseScalableAttribute {
  /**
   * Scale out or in to keep utilization at a given level. The utilization is tracked by the
   * LambdaProvisionedConcurrencyUtilization metric, emitted by lambda. See:
   * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
   *
   * Allowed values: 0.1 - 0.9.
   */
  public scaleOnUtilization(options: UtilizationScalingOptions) {
    if ( !Token.isUnresolved(options.utilizationTarget) && (options.utilizationTarget < 0.1 || options.utilizationTarget > 0.9)) {
      throw new Error('Utilization Target should be between 0.1 and 0.9.');
    }
    super.doScaleToTrackMetric('Tracking', {
      targetValue: options.utilizationTarget,
      predefinedMetric: appscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
      ...options,
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
 * Properties for enabling Lambda autoscaling
 */
export interface AutoScalingOptions {
  /**
   * Minimum capacity to scale to
   *
   * @default 1
   */
  readonly minCapacity?: number;

  /**
   * Maximum capacity to scale to
   */
  readonly maxCapacity: number;
}
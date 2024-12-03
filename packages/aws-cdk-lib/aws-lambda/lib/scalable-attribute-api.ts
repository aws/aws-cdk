import { IConstruct } from 'constructs';
import * as appscaling from '../../aws-applicationautoscaling';

/**
 * Interface for scalable attributes
 */
export interface IScalableFunctionAttribute extends IConstruct {
  /**
   * Scale out or in to keep utilization at a given level. The utilization is tracked by the
   * LambdaProvisionedConcurrencyUtilization metric, emitted by lambda. See:
   * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
   */
  scaleOnUtilization(options: UtilizationScalingOptions): void;
  /**
   * Scale out or in based on schedule.
   */
  scaleOnSchedule(id: string, actions: appscaling.ScalingSchedule): void;
}

/**
 * Options for enabling Lambda utilization tracking
 */
export interface UtilizationScalingOptions extends appscaling.BaseTargetTrackingProps {
  /**
   * Utilization target for the attribute. For example, .5 indicates that 50 percent of allocated provisioned concurrency is in use.
   */
  readonly utilizationTarget: number;
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

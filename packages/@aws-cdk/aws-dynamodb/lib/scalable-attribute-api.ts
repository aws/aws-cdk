import * as appscaling from '@aws-cdk/aws-applicationautoscaling';

/**
 * Interface for scalable attributes
 */
export interface IScalableTableAttribute {
  /**
   * Add scheduled scaling for this scaling attribute
   */
  scaleOnSchedule(id: string, actions: appscaling.ScalingSchedule): void;

  /**
   * Scale out or in to keep utilization at a given level
   */
  scaleOnUtilization(props: UtilizationScalingProps): void;
}

/**
 * Properties for enabling DynamoDB capacity scaling
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

/**
 * Properties for enabling DynamoDB utilization tracking
 */
export interface UtilizationScalingProps extends appscaling.BaseTargetTrackingProps {
  /**
   * Target utilization percentage for the attribute
   */
  readonly targetUtilizationPercent: number;
}

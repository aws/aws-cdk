import * as appscaling from '@aws-cdk/aws-applicationautoscaling';

/**
 * Interface for scalable attributes
 */
export interface IScalableVersionAttribute {
  /**
   * Scale out or in to keep utilization at a given level
   */
  scaleOnUtilization(props: UtilizationScalingProps): void;
  /**
   * Add scheduled scaling for this scaling attribute
   */
  scaleOnSchedule(id: string, actions: appscaling.ScalingSchedule): void;
}

/**
 * Properties for enabling Lambda utilization tracking
 */
export interface UtilizationScalingProps extends appscaling.BaseTargetTrackingProps {
  /**
   * Target utilization percentage for the attribute
   */
  readonly targetUtilizationPercent: number;
}

/**
 * A scalable lambda version attribute
 */
export class ScalableVersionAttribute extends appscaling.BaseScalableAttribute {
  /**
   * Scale out or in to keep utilization at a given level
   */
  public scaleOnUtilization(props: UtilizationScalingProps) {
    if (props.targetUtilizationPercent < 0 || props.targetUtilizationPercent > 1) {
      throw new Error('target utilization is a percentage and must be between 0 and 1.');
    }
    super.doScaleToTrackMetric('Tracking', {
      targetValue: props.targetUtilizationPercent,
      predefinedMetric: appscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
      ...props,
    });
  }

  /**
   * Scale out or in based on time
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
  minCapacity: number;
  /**
   * Maximum capacity to scale to
   */
  maxCapacity: number;
}
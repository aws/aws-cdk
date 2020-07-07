import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import { IRole } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';

/**
 * Interface for scalable attributes
 */
export interface IScalableFunctionAttribute {
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
 * A scalable lambda function attribute
 */
export class ScalableFunctionAttribute extends appscaling.BaseScalableAttribute {
  constructor(scope: Construct, id: string, props: AttributeScalingProps) {
    super(scope, id, {
      serviceNamespace: appscaling.ServiceNamespace.LAMBDA,
      ...props,
    });
  }

  /**
   * Scale out or in to keep utilization at a given level. This uses the predefined metric
   * LambdaProvisionedConcurrencyUtilization, which is a percentage.
   */
  public scaleOnUtilization(props: UtilizationScalingProps) {
    if (props.targetUtilizationPercent < 10 || props.targetUtilizationPercent > 90) {
      throw new Error('The tracked metric, LambdaProvisionedConcurrencyUtilization, must be between 10% and 90%.');
    }
    super.doScaleToTrackMetric('Tracking', {
      targetValue: props.targetUtilizationPercent / 100,
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
 * Properties for creating a scalable function attribute
 */
export interface AttributeScalingProps {
  /**
   * Minimum capacity to scale to
   */
  readonly minCapacity: number;

  /**
   * Maximum capacity to scale to
   */
  readonly maxCapacity: number;

  /**
   * The id of the resource - should be 'function:<function_name>:<alias>'
   */
  readonly resourceId: string;

  /**
   * The iam role that executes autoscaling rules
   */
  readonly role: IRole;

  /**
   * The dimension - should always be 'lambda:function:ProvisionedConcurrency'
   */
  readonly dimension: string;
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
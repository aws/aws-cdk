import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import { Construct } from 'constructs';

/**
 * The properties of a scalable attribute representing task count.
 */
export interface ScalableInstanceCountProps extends appscaling.BaseScalableAttributeProps {
}

/**
 * A scalable sagemaker endpoint attribute
 */
export class ScalableInstanceCount extends appscaling.BaseScalableAttribute {
  /**
   * Constructs a new instance of the ScalableInstanceCount class.
   */
  constructor(scope: Construct, id: string, props: ScalableInstanceCountProps) {
    super(scope, id, props);
  }

  /**
   * Scales in or out to achieve a target requests per second per instance.
   */
  public scaleOnInvocations(id: string, props: InvocationsScalingProps) {
    const predefinedMetric = appscaling.PredefinedMetric.SAGEMAKER_VARIANT_INVOCATIONS_PER_INSTANCE;

    super.doScaleToTrackMetric(id, {
      policyName: props.policyName,
      disableScaleIn: props.disableScaleIn,
      scaleInCooldown: props.scaleInCooldown,
      scaleOutCooldown: props.scaleOutCooldown,
      targetValue: this.calculateScalingTarget(props),
      predefinedMetric,
    });
  }

  /**
   * Calculate target value based on a ScalableProductionVariant
   *
   * Documentation for the equation is here: https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-scaling-loadtest.html
   * @param props the scaling properties.
   */
  private calculateScalingTarget(props: InvocationsScalingProps): number {
    const safetyFactor = props.safetyFactor ?? 0.5;
    if (safetyFactor <= 0.0 || safetyFactor > 1.0) {
      throw new Error(`Safety factor (${safetyFactor}) must be greater than 0.0 and less than or equal 1.0`);
    }
    return safetyFactor * props.maxRequestsPerSecond * 60;
  }
}

/**
 * Properties for enabling SageMaker Endpoint utilization tracking
 */
export interface InvocationsScalingProps extends appscaling.BaseTargetTrackingProps {
  /**
   * Max RPS per instance used for calculating the target SageMaker variant invocation per instance
   *
   * More documentation available here: https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-scaling-loadtest.html
   */
  readonly maxRequestsPerSecond: number;
  /**
   * Safty factor for calculating the target SageMaker variant invocation per instance
   *
   * More documentation available here: https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-scaling-loadtest.html
   * @default 0.5
   */
  readonly safetyFactor?: number;
}

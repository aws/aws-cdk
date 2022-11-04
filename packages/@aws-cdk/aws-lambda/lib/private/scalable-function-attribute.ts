import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import { Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IScalableFunctionAttribute, UtilizationScalingOptions } from '../scalable-attribute-api';

/**
 * A scalable lambda alias attribute
 */
export class ScalableFunctionAttribute extends appscaling.BaseScalableAttribute implements IScalableFunctionAttribute {
  constructor(scope: Construct, id: string, props: ScalableFunctionAttributeProps) {
    super(scope, id, props);
  }

  /**
   * Scale out or in to keep utilization at a given level. The utilization is tracked by the
   * LambdaProvisionedConcurrencyUtilization metric, emitted by lambda. See:
   * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
   */
  public scaleOnUtilization(options: UtilizationScalingOptions) {
    if ( !Token.isUnresolved(options.utilizationTarget) && (options.utilizationTarget < 0.1 || options.utilizationTarget > 0.9)) {
      throw new Error(`Utilization Target should be between 0.1 and 0.9. Found ${options.utilizationTarget}.`);
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
 * Properties of a scalable function attribute
 */
export interface ScalableFunctionAttributeProps extends appscaling.BaseScalableAttributeProps {
}

import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import { Construct } from 'constructs';
import { IScalableFunctionAttribute, UtilizationScalingOptions } from '../scalable-attribute-api';
/**
 * A scalable lambda alias attribute
 */
export declare class ScalableFunctionAttribute extends appscaling.BaseScalableAttribute implements IScalableFunctionAttribute {
    constructor(scope: Construct, id: string, props: ScalableFunctionAttributeProps);
    /**
     * Scale out or in to keep utilization at a given level. The utilization is tracked by the
     * LambdaProvisionedConcurrencyUtilization metric, emitted by lambda. See:
     * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
     */
    scaleOnUtilization(options: UtilizationScalingOptions): void;
    /**
     * Scale out or in based on schedule.
     */
    scaleOnSchedule(id: string, action: appscaling.ScalingSchedule): void;
}
/**
 * Properties of a scalable function attribute
 */
export interface ScalableFunctionAttributeProps extends appscaling.BaseScalableAttributeProps {
}

import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { ScalingSchedule, ServiceNamespace } from './scalable-target';
import { BasicStepScalingPolicyProps } from './step-scaling-policy';
import { BasicTargetTrackingScalingPolicyProps } from './target-tracking-scaling-policy';
/**
 * Properties for a ScalableTableAttribute
 */
export interface BaseScalableAttributeProps extends EnableScalingProps {
    /**
     * Service namespace of the scalable attribute
     */
    readonly serviceNamespace: ServiceNamespace;
    /**
     * Resource ID of the attribute
     */
    readonly resourceId: string;
    /**
     * Scalable dimension of the attribute
     */
    readonly dimension: string;
    /**
     * Role to use for scaling
     */
    readonly role: iam.IRole;
}
/**
 * Represent an attribute for which autoscaling can be configured
 *
 * This class is basically a light wrapper around ScalableTarget, but with
 * all methods protected instead of public so they can be selectively
 * exposed and/or more specific versions of them can be exposed by derived
 * classes for individual services support autoscaling.
 *
 * Typical use cases:
 *
 * - Hide away the PredefinedMetric enum for target tracking policies.
 * - Don't expose all scaling methods (for example Dynamo tables don't support
 *   Step Scaling, so the Dynamo subclass won't expose this method).
 */
export declare abstract class BaseScalableAttribute extends Construct {
    protected readonly props: BaseScalableAttributeProps;
    private target;
    constructor(scope: Construct, id: string, props: BaseScalableAttributeProps);
    /**
     * Scale out or in based on time
     */
    protected doScaleOnSchedule(id: string, props: ScalingSchedule): void;
    /**
     * Scale out or in based on a metric value
     */
    protected doScaleOnMetric(id: string, props: BasicStepScalingPolicyProps): void;
    /**
     * Scale out or in in order to keep a metric around a target value
     */
    protected doScaleToTrackMetric(id: string, props: BasicTargetTrackingScalingPolicyProps): void;
}
/**
 * Properties for enabling Application Auto Scaling
 */
export interface EnableScalingProps {
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

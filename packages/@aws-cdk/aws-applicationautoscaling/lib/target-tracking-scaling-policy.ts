import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import { CfnScalingPolicy } from './applicationautoscaling.generated';
import { IScalableTarget } from './scalable-target';

/**
 * Base interface for target tracking props
 *
 * Contains the attributes that are common to target tracking policies,
 * except the ones relating to the metric and to the scalable target.
 *
 * This interface is reused by more specific target tracking props objects
 * in other services.
 */
export interface BaseTargetTrackingProps {
  /**
   * A name for the scaling policy
   *
   * @default - Automatically generated name.
   */
  readonly policyName?: string;

  /**
   * Indicates whether scale in by the target tracking policy is disabled.
   *
   * If the value is true, scale in is disabled and the target tracking policy
   * won't remove capacity from the scalable resource. Otherwise, scale in is
   * enabled and the target tracking policy can remove capacity from the
   * scalable resource.
   *
   * @default false
   */
  readonly disableScaleIn?: boolean;

  /**
   * Period after a scale in activity completes before another scale in activity can start.
   *
   * @default - No scale in cooldown.
   */
  readonly scaleInCooldown?: cdk.Duration;

  /**
   * Period after a scale out activity completes before another scale out activity can start.
   *
   * @default - No scale out cooldown.
   */
  readonly scaleOutCooldown?: cdk.Duration;
}

/**
 * Properties for a Target Tracking policy that include the metric but exclude the target
 */
export interface BasicTargetTrackingScalingPolicyProps extends BaseTargetTrackingProps {
  /**
   * The target value for the metric.
   */
  readonly targetValue: number;

  /**
   * A predefined metric for application autoscaling
   *
   * The metric must track utilization. Scaling out will happen if the metric is higher than
   * the target value, scaling in will happen in the metric is lower than the target value.
   *
   * Exactly one of customMetric or predefinedMetric must be specified.
   *
   * @default - No predefined metrics.
   */
  readonly predefinedMetric?: PredefinedMetric;

  /**
   * Identify the resource associated with the metric type.
   *
   * Only used for predefined metric ALBRequestCountPerTarget.
   *
   * @example app/<load-balancer-name>/<load-balancer-id>/targetgroup/<target-group-name>/<target-group-id>
   *
   * @default - No resource label.
   */
  readonly resourceLabel?: string;

  /**
   * A custom metric for application autoscaling
   *
   * The metric must track utilization. Scaling out will happen if the metric is higher than
   * the target value, scaling in will happen in the metric is lower than the target value.
   *
   * Exactly one of customMetric or predefinedMetric must be specified.
   *
   * @default - No custom metric.
   */
  readonly customMetric?: cloudwatch.IMetric;
}

/**
 * Properties for a concrete TargetTrackingPolicy
 *
 * Adds the scalingTarget.
 */
export interface TargetTrackingScalingPolicyProps extends BasicTargetTrackingScalingPolicyProps {
  /*
   * The scalable target
   */
  readonly scalingTarget: IScalableTarget;
}

export class TargetTrackingScalingPolicy extends cdk.Construct {
  /**
   * ARN of the scaling policy
   */
  public readonly scalingPolicyArn: string;

  constructor(scope: cdk.Construct, id: string, props: TargetTrackingScalingPolicyProps) {
    if ((props.customMetric === undefined) === (props.predefinedMetric === undefined)) {
      throw new Error(`Exactly one of 'customMetric' or 'predefinedMetric' must be specified.`);
    }

    super(scope, id);

    const resource = new CfnScalingPolicy(this, 'Resource', {
      policyName: props.policyName || this.node.uniqueId,
      policyType: 'TargetTrackingScaling',
      scalingTargetId: props.scalingTarget.scalableTargetId,
      targetTrackingScalingPolicyConfiguration: {
        customizedMetricSpecification: renderCustomMetric(props.customMetric),
        disableScaleIn: props.disableScaleIn,
        predefinedMetricSpecification: props.predefinedMetric !== undefined ? {
          predefinedMetricType: props.predefinedMetric,
          resourceLabel: props.resourceLabel,
        } : undefined,
        scaleInCooldown: props.scaleInCooldown && props.scaleInCooldown.toSeconds(),
        scaleOutCooldown: props.scaleOutCooldown && props.scaleOutCooldown.toSeconds(),
        targetValue: props.targetValue
      }
    });

    this.scalingPolicyArn = resource.ref;
  }
}

function renderCustomMetric(metric?: cloudwatch.IMetric): CfnScalingPolicy.CustomizedMetricSpecificationProperty | undefined {
  if (!metric) { return undefined; }
  const c = metric.toMetricConfig().metricStat;

  if (c === undefined) {
    throw new Error("A `Metric` object must be used here.");
  }

  if (!c.statistic) {
    throw new Error('Can only use Average, Minimum, Maximum, SampleCount, Sum statistic for target tracking');
  }

  return {
    dimensions: c.dimensions,
    metricName: c.metricName,
    namespace: c.namespace,
    statistic: c.statistic
  };
}

/**
 * One of the predefined autoscaling metrics
 */
export enum PredefinedMetric {
  DYNAMODB_READ_CAPACITY_UTILIZATION = 'DynamoDBReadCapacityUtilization',
  DYANMODB_WRITE_CAPACITY_UTILIZATION = 'DynamoDBWriteCapacityUtilization',
  ALB_REQUEST_COUNT_PER_TARGET = 'ALBRequestCountPerTarget',
  RDS_READER_AVERAGE_CPU_UTILIZATION = 'RDSReaderAverageCPUUtilization',
  RDS_READER_AVERAGE_DATABASE_CONNECTIONS = 'RDSReaderAverageDatabaseConnections',
  EC2_SPOT_FLEET_REQUEST_AVERAGE_CPU_UTILIZATION = 'EC2SpotFleetRequestAverageCPUUtilization',
  EC2_SPOT_FLEET_REQUEST_AVERAGE_NETWORK_IN = 'EC2SpotFleetRequestAverageNetworkIn',
  EC2_SPOT_FLEET_REQUEST_AVERAGE_NETWORK_OUT = 'EC2SpotFleetRequestAverageNetworkOut',
  SAGEMAKER_VARIANT_INVOCATIONS_PER_INSTANCE = 'SageMakerVariantInvocationsPerInstance',
  ECS_SERVICE_AVERAGE_CPU_UTILIZATION = 'ECSServiceAverageCPUUtilization',
  ECS_SERVICE_AVERAGE_MEMORY_UTILIZATION = 'ECSServiceAverageMemoryUtilization',
}

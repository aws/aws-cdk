import { Construct } from 'constructs';
import { CfnScalingPolicy } from './applicationautoscaling.generated';
import type * as cloudwatch from '../../aws-cloudwatch';
import * as cdk from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { lit } from '../../core/lib/private/literal-string';
import type { IScalableTargetRef } from '../../interfaces/generated/aws-applicationautoscaling-interfaces.generated';

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
   * @default Duration.seconds(300) for the following scalable targets: ECS services,
   * Spot Fleet requests, EMR clusters, AppStream 2.0 fleets, Aurora DB clusters,
   * Amazon SageMaker endpoint variants, Custom resources. For all other scalable
   * targets, the default value is Duration.seconds(0): DynamoDB tables, DynamoDB
   * global secondary indexes, Amazon Comprehend document classification endpoints,
   * Lambda provisioned concurrency
   */
  readonly scaleInCooldown?: cdk.Duration;

  /**
   * Period after a scale out activity completes before another scale out activity can start.
   *
   * @default Duration.seconds(300) for the following scalable targets: ECS services,
   * Spot Fleet requests, EMR clusters, AppStream 2.0 fleets, Aurora DB clusters,
   * Amazon SageMaker endpoint variants, Custom resources. For all other scalable
   * targets, the default value is Duration.seconds(0): DynamoDB tables, DynamoDB
   * global secondary indexes, Amazon Comprehend document classification endpoints,
   * Lambda provisioned concurrency
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
   * Example value: `app/<load-balancer-name>/<load-balancer-id>/targetgroup/<target-group-name>/<target-group-id>`
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
   * The metric can be a `Metric` or a `MathExpression` that combines several metrics into a
   * single time series. Search expressions are not supported.
   *
   * The metric must be in the same account and region as the scaling policy.
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
  readonly scalingTarget: IScalableTargetRef;
}

export class TargetTrackingScalingPolicy extends Construct {
  /**
   * ARN of the scaling policy
   */
  public readonly scalingPolicyArn: string;

  constructor(scope: Construct, id: string, props: TargetTrackingScalingPolicyProps) {
    if ((props.customMetric === undefined) === (props.predefinedMetric === undefined)) {
      throw new ValidationError(lit`ExactlyOneCustomMetricPredefined`, 'Exactly one of \'customMetric\' or \'predefinedMetric\' must be specified.', scope);
    }

    const customMetricConfig = props.customMetric?.toMetricConfig();
    if (customMetricConfig && !customMetricConfig.metricStat && !customMetricConfig.mathExpression) {
      throw new ValidationError(lit`DirectMetricsSupportedTargetTracking`, 'Only metrics and math expressions are supported for Target Tracking. Use Step Scaling or supply a Metric or MathExpression object.', scope);
    }

    super(scope, id);

    // replace dummy value in DYNAMODB_WRITE_CAPACITY_UTILIZATION due to a jsii bug (https://github.com/aws/jsii/issues/2782)
    const predefinedMetric = props.predefinedMetric === PredefinedMetric.DYNAMODB_WRITE_CAPACITY_UTILIZATION ?
      PredefinedMetric.DYANMODB_WRITE_CAPACITY_UTILIZATION :
      props.predefinedMetric;

    const resource = new CfnScalingPolicy(this, 'Resource', {
      policyName: props.policyName || cdk.Names.uniqueId(this),
      policyType: 'TargetTrackingScaling',
      scalingTargetId: props.scalingTarget.scalableTargetRef.resourceId,
      targetTrackingScalingPolicyConfiguration: {
        customizedMetricSpecification: renderCustomMetric(this, props.customMetric),
        disableScaleIn: props.disableScaleIn,
        predefinedMetricSpecification: predefinedMetric !== undefined ? {
          predefinedMetricType: predefinedMetric,
          resourceLabel: props.resourceLabel,
        } : undefined,
        scaleInCooldown: props.scaleInCooldown && props.scaleInCooldown.toSeconds(),
        scaleOutCooldown: props.scaleOutCooldown && props.scaleOutCooldown.toSeconds(),
        targetValue: props.targetValue,
      },
    });

    this.scalingPolicyArn = resource.ref;

    // Surface problems the math expression found in itself, such as identifiers missing from `usingMetrics`
    if (customMetricConfig?.mathExpression) {
      for (const [warningId, message] of Object.entries(props.customMetric?.warningsV2 ?? {})) {
        cdk.Annotations.of(this).addWarningV2(warningId, message);
      }
    }
  }
}

function renderCustomMetric(scope: Construct, metric?: cloudwatch.IMetric): CfnScalingPolicy.CustomizedMetricSpecificationProperty | undefined {
  if (!metric) { return undefined; }
  const config = metric.toMetricConfig();

  if (config.mathExpression) {
    return { metrics: renderMetricMath(scope, metric) };
  }

  const c = config.metricStat!;

  if (c.statistic.startsWith('p')) {
    throw new ValidationError(lit`CannotStatistic`, `Cannot use statistic '${c.statistic}' for Target Tracking: only 'Average', 'Minimum', 'Maximum', 'SampleCount', and 'Sum' are supported.`, scope);
  }

  warnIfElsewhere(scope, c);

  return {
    dimensions: c.dimensions,
    metricName: c.metricName,
    namespace: c.namespace,
    statistic: c.statistic,
    unit: c.unitFilter,
  };
}

/**
 * Flatten a math expression and the metrics it uses into metric data queries.
 *
 * The top-level expression is the only query that returns data. Every metric and nested
 * expression keeps the id it has in `usingMetrics`, because the expressions refer to it by that id.
 * `MathExpression` already rejects two different metrics under one id, so a repeated id is rendered once.
 */
function renderMetricMath(scope: Construct, expression: cloudwatch.IMetric): CfnScalingPolicy.TargetTrackingMetricDataQueryProperty[] {
  const queries: CfnScalingPolicy.TargetTrackingMetricDataQueryProperty[] = [];
  const seen = new Set<string>();

  const render = (metric: cloudwatch.IMetric, id: string, returnData: boolean): CfnScalingPolicy.TargetTrackingMetricDataQueryProperty => {
    const config = metric.toMetricConfig();
    const label = config.renderingProperties?.label as string | undefined;

    if (config.mathExpression) {
      return { id, expression: config.mathExpression.expression, label, returnData };
    }
    if (config.metricStat) {
      const stat = config.metricStat;
      warnIfElsewhere(scope, stat);
      return {
        id,
        metricStat: {
          metric: {
            namespace: stat.namespace,
            metricName: stat.metricName,
            dimensions: stat.dimensions,
          },
          stat: stat.statistic,
          unit: stat.unitFilter,
        },
        label,
        returnData,
      };
    }
    throw new ValidationError(lit`SearchExpressionsNotSupportedTargetTracking`, 'Search expressions are not supported for Target Tracking.', scope);
  };

  const visitChildren = (metric: cloudwatch.IMetric) => {
    for (const [id, child] of Object.entries(metric.toMetricConfig().mathExpression?.usingMetrics ?? {})) {
      if (seen.has(id)) { continue; }
      seen.add(id);
      queries.push(render(child, id, false));
      visitChildren(child);
    }
  };
  visitChildren(expression);

  // The top-level expression needs an id of its own that no metric in `usingMetrics` uses
  let n = 1;
  while (seen.has(`expr_${n}`)) { n++; }
  queries.unshift(render(expression, `expr_${n}`, true));

  return queries;
}

/**
 * Warn when a metric names another account or region, which target tracking ignores.
 */
function warnIfElsewhere(scope: Construct, c: cloudwatch.MetricStatConfig) {
  const stack = cdk.Stack.of(scope);
  if (definitelyDifferent(c.account, stack.account)) {
    cdk.Annotations.of(scope).addWarningV2('@aws-cdk/aws-applicationautoscaling:crossAccountMetricIgnored',
      `target tracking can only use metrics from its own account; metric account ${JSON.stringify(c.account)} is ignored and account ${JSON.stringify(stack.account)} is used`);
  }
  if (definitelyDifferent(c.region, stack.region)) {
    cdk.Annotations.of(scope).addWarningV2('@aws-cdk/aws-applicationautoscaling:crossRegionMetricIgnored',
      `target tracking can only use metrics from its own region; metric region ${JSON.stringify(c.region)} is ignored and region ${JSON.stringify(stack.region)} is used`);
  }
}

/**
 * Whether a metric's account or region is known at synth time to differ from the expected one.
 *
 * Returns false when either side is an unresolved token, since such values can only be compared at deploy time.
 */
function definitelyDifferent(value: string | undefined, expected: string): boolean {
  return value !== undefined && !cdk.Token.isUnresolved(value) && !cdk.Token.isUnresolved(expected) && value !== expected;
}

/**
 * One of the predefined autoscaling metrics
 */
export enum PredefinedMetric {
  /**
   * Average percentage of instances in an AppStream fleet that are being used.
   */
  APPSTREAM_AVERAGE_CAPACITY_UTILIZATION = 'AppStreamAverageCapacityUtilization',
  /**
   * Percentage of provisioned read capacity units utilized by a Keyspaces table.
   */
  CASSANDRA_READ_CAPACITY_UTILIZATION = 'CassandraReadCapacityUtilization',
  /**
   * Percentage of provisioned write capacity units utilized by a Keyspaces table.
   */
  CASSANDRA_WRITE_CAPACITY_UTILIZATION = 'CassandraWriteCapacityUtilization',
  /**
   * Percentage of provisioned inference units utilized by a Comprehend endpoint.
   */
  COMPREHEND_INFERENCE_UTILIZATION = 'ComprehendInferenceUtilization',
  /**
   * Average CPU Utilization of read replica instances in a Neptune DB cluster.
   */
  NEPTURE_READER_AVERAGE_CPU_UTILIZATION = 'NeptuneReaderAverageCPUUtilization',
  /**
   * Percentage of provisioned read capacity units consumed by a DynamoDB table.
   */
  DYNAMODB_READ_CAPACITY_UTILIZATION = 'DynamoDBReadCapacityUtilization',
  /**
   * Percentage of provisioned write capacity units consumed by a DynamoDB table.
   *
   * Suffix `dummy` is necessary due to jsii bug (https://github.com/aws/jsii/issues/2782).
   * Duplicate values will be dropped, so this suffix is added as a workaround.
   * The value will be replaced when this enum is used.
   *
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  DYNAMODB_WRITE_CAPACITY_UTILIZATION = 'DynamoDBWriteCapacityUtilization-dummy',
  /**
   * DYANMODB_WRITE_CAPACITY_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   * @deprecated use `PredefinedMetric.DYNAMODB_WRITE_CAPACITY_UTILIZATION`
   */
  DYANMODB_WRITE_CAPACITY_UTILIZATION = 'DynamoDBWriteCapacityUtilization',
  /**
   * ALB_REQUEST_COUNT_PER_TARGET
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  ALB_REQUEST_COUNT_PER_TARGET = 'ALBRequestCountPerTarget',
  /**
   * RDS_READER_AVERAGE_CPU_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  RDS_READER_AVERAGE_CPU_UTILIZATION = 'RDSReaderAverageCPUUtilization',
  /**
   * RDS_READER_AVERAGE_DATABASE_CONNECTIONS
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  RDS_READER_AVERAGE_DATABASE_CONNECTIONS = 'RDSReaderAverageDatabaseConnections',
  /**
   * EC2_SPOT_FLEET_REQUEST_AVERAGE_CPU_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  EC2_SPOT_FLEET_REQUEST_AVERAGE_CPU_UTILIZATION = 'EC2SpotFleetRequestAverageCPUUtilization',
  /**
   * EC2_SPOT_FLEET_REQUEST_AVERAGE_NETWORK_IN
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  EC2_SPOT_FLEET_REQUEST_AVERAGE_NETWORK_IN = 'EC2SpotFleetRequestAverageNetworkIn',
  /**
   * EC2_SPOT_FLEET_REQUEST_AVERAGE_NETWORK_OUT
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  EC2_SPOT_FLEET_REQUEST_AVERAGE_NETWORK_OUT = 'EC2SpotFleetRequestAverageNetworkOut',
  /**
   * SAGEMAKER_VARIANT_INVOCATIONS_PER_INSTANCE
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  SAGEMAKER_VARIANT_INVOCATIONS_PER_INSTANCE = 'SageMakerVariantInvocationsPerInstance',
  /**
   * SAGEMAKER_VARIANT_PROVISIONED_CONCURRENCY_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  SAGEMAKER_VARIANT_PROVISIONED_CONCURRENCY_UTILIZATION = 'SageMakerVariantProvisionedConcurrencyUtilization',
  /**
   * SAGEMAKER_INFERENCE_COMPONENT_INVOCATIONS_PER_COPY
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  SAGEMAKER_INFERENCE_COMPONENT_INVOCATIONS_PER_COPY = 'SageMakerInferenceComponentInvocationsPerCopy',
  /**
   * ECS_SERVICE_AVERAGE_CPU_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  ECS_SERVICE_AVERAGE_CPU_UTILIZATION = 'ECSServiceAverageCPUUtilization',
  /**
   * ECS_SERVICE_AVERAGE_MEMORY_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  ECS_SERVICE_AVERAGE_MEMORY_UTILIZATION = 'ECSServiceAverageMemoryUtilization',
  /**
   * LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION
   * @see https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html#monitoring-metrics-concurrency
   */
  LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION = 'LambdaProvisionedConcurrencyUtilization',
  /**
   * KAFKA_BROKER_STORAGE_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  KAFKA_BROKER_STORAGE_UTILIZATION = 'KafkaBrokerStorageUtilization',
  /**
   * ELASTICACHE_PRIMARY_ENGINE_CPU_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  ELASTICACHE_PRIMARY_ENGINE_CPU_UTILIZATION = 'ElastiCachePrimaryEngineCPUUtilization',
  /**
   * ELASTICACHE_REPLICA_ENGINE_CPU_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  ELASTICACHE_REPLICA_ENGINE_CPU_UTILIZATION = 'ElastiCacheReplicaEngineCPUUtilization',
  /**
   * ELASTICACHE_DATABASE_MEMORY_USAGE_COUNTED_FOR_EVICT_PERCENTAGE
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  ELASTICACHE_DATABASE_MEMORY_USAGE_COUNTED_FOR_EVICT_PERCENTAGE = 'ElastiCacheDatabaseMemoryUsageCountedForEvictPercentage',
  /**
   * ELASTICACHE_DATABASE_CAPACITY_USAGE_COUNTED_FOR_EVICT_PERCENTAGE
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  ELASTICACHE_DATABASE_CAPACITY_USAGE_COUNTED_FOR_EVICT_PERCENTAGE = 'ElastiCacheDatabaseCapacityUsageCountedForEvictPercentage',
  /**
   * SAGEMAKER_INFERENCE_COMPONENT_CONCURRENT_REQUESTS_PER_COPY_HIGH_RESOLUTION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  SAGEMAKER_INFERENCE_COMPONENT_CONCURRENT_REQUESTS_PER_COPY_HIGH_RESOLUTION = 'SageMakerInferenceComponentConcurrentRequestsPerCopyHighResolution',
  /**
   * SAGEMAKER_VARIANT_CONCURRENT_REQUESTS_PER_MODEL_HIGH_RESOLUTION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  SAGEMAKER_VARIANT_CONCURRENT_REQUESTS_PER_MODEL_HIGH_RESOLUTION = 'SageMakerVariantConcurrentRequestsPerModelHighResolution',
  /**
   * WORKSPACES_AVERAGE_USER_SESSIONS_CAPACITY_UTILIZATION
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PredefinedMetricSpecification.html
   */
  WORKSPACES_AVERAGE_USER_SESSIONS_CAPACITY_UTILIZATION = 'WorkSpacesAverageUserSessionsCapacityUtilization',
}

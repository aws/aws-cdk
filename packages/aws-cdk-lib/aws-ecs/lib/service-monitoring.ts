import type { IConstruct } from 'constructs';
import { DeploymentControllerType } from './base/base-service';
import { Token, ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * The `CPUUtilization` service-level metric.
 */
const CPU_UTILIZATION = 'CPUUtilization';

/**
 * The `MemoryUtilization` service-level metric.
 */
const MEMORY_UTILIZATION = 'MemoryUtilization';

/**
 * The metric names that support a configurable resolution.
 */
const SUPPORTED_METRIC_NAMES = [CPU_UTILIZATION, MEMORY_UTILIZATION];

/**
 * The resolution, in seconds, that enables high-resolution service metrics.
 */
const HIGH_RESOLUTION_SECONDS = 20;

/**
 * The resolutions, in seconds, that Amazon ECS supports for service-level metrics.
 */
const SUPPORTED_RESOLUTION_SECONDS = [HIGH_RESOLUTION_SECONDS, 60];

/**
 * The maximum number of metric configurations Amazon ECS accepts for a service.
 */
const MAX_METRIC_CONFIGURATIONS = 2;

/**
 * The configuration for a specific set of service-level metrics to collect for a service.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-metricconfiguration.html
 */
export interface ServiceMetricConfiguration {
  /**
   * The list of metric names to configure.
   *
   * The supported metric names are `CPUUtilization` and `MemoryUtilization`.
   */
  readonly metricNames: string[];

  /**
   * The resolution, in seconds, at which to collect the metrics.
   *
   * The valid values are `20` and `60`. A resolution of `20` seconds enables
   * high-resolution metrics, which lets Application Auto Scaling detect load
   * changes faster.
   */
  readonly resolutionSeconds: number;
}

/**
 * The monitoring configuration for a service, which defines the resolution for the
 * service-level `CPUUtilization` and `MemoryUtilization` Amazon CloudWatch metrics.
 *
 * When not specified, Amazon ECS uses the default resolution of 60 seconds.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/target-tracking-faster-auto-scaling.html
 */
export interface ServiceMonitoringConfiguration {
  /**
   * The list of metric configurations for the service monitoring.
   *
   * At most one configuration can be supplied per metric name, and at most two
   * configurations can be supplied in total.
   */
  readonly metricConfigurations: ServiceMetricConfiguration[];
}

/**
 * Validates a service monitoring configuration and returns it in the shape expected by
 * `CfnService.MonitoringConfigurationProperty`.
 *
 * The L2 and L1 property names are identical, so no mapping is required.
 */
export function renderServiceMonitoring(
  scope: IConstruct,
  monitoring?: ServiceMonitoringConfiguration,
  deploymentControllerType?: DeploymentControllerType,
): ServiceMonitoringConfiguration | undefined {
  if (monitoring === undefined) {
    return undefined;
  }

  // Amazon ECS does not publish high-resolution metrics for services using the
  // CODE_DEPLOY or EXTERNAL deployment controllers.
  if (deploymentControllerType !== undefined && deploymentControllerType !== DeploymentControllerType.ECS) {
    throw new ValidationError(
      lit`ServiceMonitoringRequiresEcsController`,
      `monitoring requires the ECS deployment controller, got ${JSON.stringify(deploymentControllerType)}`,
      scope,
    );
  }

  const metricConfigurations = monitoring.metricConfigurations;

  // A tokenized list reports a length of 1 regardless of its real contents, so the
  // per-configuration checks below can only run on a concrete list.
  if (Token.isUnresolved(metricConfigurations)) {
    return monitoring;
  }

  if (metricConfigurations.length < 1 || metricConfigurations.length > MAX_METRIC_CONFIGURATIONS) {
    throw new ValidationError(
      lit`ServiceMonitoringMetricConfigurationsCount`,
      `monitoring must contain between 1 and ${MAX_METRIC_CONFIGURATIONS} metricConfigurations, got ${metricConfigurations.length}`,
      scope,
    );
  }

  const seenMetricNames = new Set<string>();

  for (const metricConfiguration of metricConfigurations) {
    const { metricNames, resolutionSeconds } = metricConfiguration;

    if (!Token.isUnresolved(resolutionSeconds) && !SUPPORTED_RESOLUTION_SECONDS.includes(resolutionSeconds)) {
      throw new ValidationError(
        lit`ServiceMonitoringInvalidResolutionSeconds`,
        `monitoring resolutionSeconds must be one of ${JSON.stringify(SUPPORTED_RESOLUTION_SECONDS)}, got ${JSON.stringify(resolutionSeconds)}`,
        scope,
      );
    }

    if (Token.isUnresolved(metricNames)) {
      continue;
    }

    if (metricNames.length < 1) {
      throw new ValidationError(
        lit`ServiceMonitoringEmptyMetricNames`,
        'monitoring metricNames must contain at least one metric name',
        scope,
      );
    }

    for (const metricName of metricNames) {
      if (!Token.isUnresolved(metricName) && !SUPPORTED_METRIC_NAMES.includes(metricName)) {
        throw new ValidationError(
          lit`ServiceMonitoringInvalidMetricName`,
          `monitoring metricNames must only contain ${JSON.stringify(SUPPORTED_METRIC_NAMES)}, got ${JSON.stringify(metricName)}`,
          scope,
        );
      }

      if (seenMetricNames.has(metricName)) {
        throw new ValidationError(
          lit`ServiceMonitoringDuplicateMetricName`,
          `monitoring metricNames must not repeat a metric name across metricConfigurations, got ${JSON.stringify(metricName)} more than once`,
          scope,
        );
      }
      seenMetricNames.add(metricName);
    }
  }

  return monitoring;
}

/**
 * Whether any metric configuration opts into the 20-second (high) resolution.
 *
 * A tokenized configuration is treated as standard resolution, since blocking a
 * value that cannot be inspected would reject valid configurations.
 */
export function usesHighResolutionMetrics(monitoring?: ServiceMonitoringConfiguration): boolean {
  if (monitoring === undefined || Token.isUnresolved(monitoring.metricConfigurations)) {
    return false;
  }

  return monitoring.metricConfigurations.some(
    (metricConfiguration) => metricConfiguration.resolutionSeconds === HIGH_RESOLUTION_SECONDS,
  );
}

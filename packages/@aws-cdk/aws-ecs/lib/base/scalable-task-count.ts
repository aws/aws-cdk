import appscaling = require('@aws-cdk/aws-applicationautoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');

/**
 * Scalable attribute representing task count
 */
export class ScalableTaskCount extends appscaling.BaseScalableAttribute {
  /**
   * Scale out or in based on time
   */
  public scaleOnSchedule(id: string, props: appscaling.ScalingSchedule) {
    return super.scaleOnSchedule(id, props);
  }

  /**
   * Scale out or in based on a metric value
   */
  public scaleOnMetric(id: string, props: appscaling.BasicStepScalingPolicyProps) {
    return super.scaleOnMetric(id, props);
  }

  /**
   * Scale out or in to achieve a target CPU utilization
   */
  public scaleOnCpuUtilization(id: string, props: CpuUtilizationScalingProps) {
    return super.scaleToTrackMetric(id, {
      predefinedMetric: appscaling.PredefinedMetric.ECSServiceAverageCPUUtilization,
      policyName: props.policyName,
      disableScaleIn: props.disableScaleIn,
      targetValue: props.targetUtilizationPercent,
      scaleInCooldownSec: props.scaleInCooldownSec,
      scaleOutCooldownSec: props.scaleOutCooldownSec,
    });
  }

  /**
   * Scale out or in to achieve a target memory utilization utilization
   */
  public scaleOnMemoryUtilization(id: string, props: CpuUtilizationScalingProps) {
    return super.scaleToTrackMetric(id, {
      predefinedMetric: appscaling.PredefinedMetric.ECSServiceAverageMemoryUtilization,
      targetValue: props.targetUtilizationPercent,
      policyName: props.policyName,
      disableScaleIn: props.disableScaleIn,
      scaleInCooldownSec: props.scaleInCooldownSec,
      scaleOutCooldownSec: props.scaleOutCooldownSec,
    });
  }

  /**
   * Scale out or in to track a custom metric
   */
  public scaleToTrackCustomMetric(id: string, props: TrackCustomMetricProps) {
    return super.scaleToTrackMetric(id, {
      customMetric: props.metric,
      targetValue: props.targetValue,
      policyName: props.policyName,
      disableScaleIn: props.disableScaleIn,
      scaleInCooldownSec: props.scaleInCooldownSec,
      scaleOutCooldownSec: props.scaleOutCooldownSec,
    });
  }
}

/**
 * Properties for enabling scaling based on CPU utilization
 */
export interface CpuUtilizationScalingProps extends appscaling.BaseTargetTrackingProps {
  /**
   * Target average CPU utilization across the task
   */
  targetUtilizationPercent: number;
}

/**
 * Properties for enabling scaling based on memory utilization
 */
export interface MemoryUtilizationScalingProps extends appscaling.BaseTargetTrackingProps {
  /**
   * Target average memory utilization across the task
   */
  targetUtilizationPercent: number;
}

/**
 * Properties to target track a custom metric
 */
export interface TrackCustomMetricProps extends appscaling.BaseTargetTrackingProps {
  /**
   * Metric to track
   *
   * The metric must represent utilization; that is, you will always get the following behavior:
   *
   * - metric > targetValue => scale out
   * - metric < targetValue => scale in
   */
  metric: cloudwatch.Metric;

  /**
   * The target value to achieve for the metric
   */
  targetValue: number;
}
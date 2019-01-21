import appscaling = require('@aws-cdk/aws-applicationautoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

/**
 * Scalable attribute representing task count
 */
export class ScalableTaskCount extends appscaling.BaseScalableAttribute {
  /**
   * Scale out or in based on time
   */
  public scaleOnSchedule(id: string, props: appscaling.ScalingSchedule) {
    return super.doScaleOnSchedule(id, props);
  }

  /**
   * Scale out or in based on a metric value
   */
  public scaleOnMetric(id: string, props: appscaling.BasicStepScalingPolicyProps) {
    return super.doScaleOnMetric(id, props);
  }

  /**
   * Scale out or in to achieve a target CPU utilization
   */
  public scaleOnCpuUtilization(id: string, props: CpuUtilizationScalingProps) {
    return super.doScaleToTrackMetric(id, {
      predefinedMetric: appscaling.PredefinedMetric.ECSServiceAverageCPUUtilization,
      policyName: props.policyName,
      disableScaleIn: props.disableScaleIn,
      targetValue: props.targetUtilizationPercent,
      scaleInCooldownSec: props.scaleInCooldownSec,
      scaleOutCooldownSec: props.scaleOutCooldownSec
    });
  }

  /**
   * Scale out or in to achieve a target memory utilization
   */
  public scaleOnMemoryUtilization(id: string, props: MemoryUtilizationScalingProps) {
    return super.doScaleToTrackMetric(id, {
      predefinedMetric: appscaling.PredefinedMetric.ECSServiceAverageMemoryUtilization,
      targetValue: props.targetUtilizationPercent,
      policyName: props.policyName,
      disableScaleIn: props.disableScaleIn,
      scaleInCooldownSec: props.scaleInCooldownSec,
      scaleOutCooldownSec: props.scaleOutCooldownSec
    });
  }

  /**
   * Scale out or in to achieve a target ALB request count per target
   */
  public scaleOnRequestCount(id: string, props: RequestCountScalingProps) {
    const resourceLabel = props.targetGroup.firstLoadBalancerFullName +
       '/' + props.targetGroup.targetGroupFullName;

    return super.doScaleToTrackMetric(id, {
      predefinedMetric: appscaling.PredefinedMetric.ALBRequestCountPerTarget,
      resourceLabel,
      targetValue: props.requestsPerTarget,
      policyName: props.policyName,
      disableScaleIn: props.disableScaleIn,
      scaleInCooldownSec: props.scaleInCooldownSec,
      scaleOutCooldownSec: props.scaleOutCooldownSec
    });
  }

  /**
   * Scale out or in to track a custom metric
   */
  public scaleToTrackCustomMetric(id: string, props: TrackCustomMetricProps) {
    return super.doScaleToTrackMetric(id, {
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
 * Properties for enabling scaling based on ALB request counts
 */
export interface RequestCountScalingProps extends appscaling.BaseTargetTrackingProps {
  /**
   * ALB requests per target
   */
  requestsPerTarget: number;

  /**
   * ALB Target Group
   */
  targetGroup: elbv2.ApplicationTargetGroup;
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

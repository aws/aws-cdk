import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { IAutoScalingGroup } from './auto-scaling-group';
import { CfnScalingPolicy } from './autoscaling.generated';

/**
 * Base interface for target tracking props
 *
 * Contains the attributes that are common to target tracking policies,
 * except the ones relating to the metric and to the scalable target.
 *
 * This interface is reused by more specific target tracking props objects.
 */
export interface BaseTargetTrackingProps {
  /**
   * Indicates whether scale in by the target tracking policy is disabled.
   *
   * If the value is true, scale in is disabled and the target tracking policy
   * won't remove capacity from the autoscaling group. Otherwise, scale in is
   * enabled and the target tracking policy can remove capacity from the
   * group.
   *
   * @default false
   */
  disableScaleIn?: boolean;

  /**
   * Period after a scaling completes before another scaling activity can start.
   *
   * @default The default cooldown configured on the AutoScalingGroup
   */
  cooldownSeconds?: number;

  /**
   * Estimated time until a newly launched instance can send metrics to CloudWatch.
   *
   * @default Same as the cooldown
   */
  estimatedInstanceWarmupSeconds?: number;
}

/**
 * Properties for a Target Tracking policy that include the metric but exclude the target
 */
export interface BasicTargetTrackingScalingPolicyProps extends BaseTargetTrackingProps {
  /**
   * The target value for the metric.
   */
  targetValue: number;

  /**
   * A predefined metric for application autoscaling
   *
   * The metric must track utilization. Scaling out will happen if the metric is higher than
   * the target value, scaling in will happen in the metric is lower than the target value.
   *
   * Exactly one of customMetric or predefinedMetric must be specified.
   */
  predefinedMetric?: PredefinedMetric;

  /**
   * A custom metric for application autoscaling
   *
   * The metric must track utilization. Scaling out will happen if the metric is higher than
   * the target value, scaling in will happen in the metric is lower than the target value.
   *
   * Exactly one of customMetric or predefinedMetric must be specified.
   */
  customMetric?: cloudwatch.Metric;

  /**
   * The resource label associated with the predefined metric
   *
   * Should be supplied if the predefined metric is ALBRequestCountPerTarget, and the
   * format should be:
   *
   * app/<load-balancer-name>/<load-balancer-id>/targetgroup/<target-group-name>/<target-group-id>
   *
   * @default No resource label
   */
  resourceLabel?: string;
}

/**
 * Properties for a concrete TargetTrackingPolicy
 *
 * Adds the scalingTarget.
 */
export interface TargetTrackingScalingPolicyProps extends BasicTargetTrackingScalingPolicyProps {
  /*
   * The auto scaling group
   */
  autoScalingGroup: IAutoScalingGroup;
}

export class TargetTrackingScalingPolicy extends cdk.Construct {
  /**
   * ARN of the scaling policy
   */
  public readonly scalingPolicyArn: string;

  /**
   * The resource object
   */
  private resource: CfnScalingPolicy;

  private targetGroups: elbv2.ITargetGroup[];

  constructor(scope: cdk.Construct, id: string, props: TargetTrackingScalingPolicyProps) {
    if ((props.customMetric === undefined) === (props.predefinedMetric === undefined)) {
      throw new Error(`Exactly one of 'customMetric' or 'predefinedMetric' must be specified.`);
    }

    if (props.cooldownSeconds !== undefined && props.cooldownSeconds < 0) {
      throw new RangeError(`cooldownSeconds cannot be negative, got: ${props.cooldownSeconds}`);
    }

    if (props.estimatedInstanceWarmupSeconds !== undefined && props.estimatedInstanceWarmupSeconds < 0) {
      throw new RangeError(`estimatedInstanceWarmupSeconds cannot be negative, got: ${props.estimatedInstanceWarmupSeconds}`);
    }

    if (props.predefinedMetric === PredefinedMetric.ALBRequestCountPerTarget && !props.resourceLabel) {
      throw new Error('When tracking the ALBRequestCountPerTarget metric, the ALB identifier must be supplied in resourceLabel');
    }

    super(scope, id);

    this.targetGroups = [];

    this.resource = new CfnScalingPolicy(this, 'Resource', {
      policyType: 'TargetTrackingScaling',
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
      cooldown: props.cooldownSeconds !== undefined ? `${props.cooldownSeconds}` : undefined,
      estimatedInstanceWarmup: props.estimatedInstanceWarmupSeconds,
      targetTrackingConfiguration: {
        customizedMetricSpecification: renderCustomMetric(props.customMetric),
        disableScaleIn: props.disableScaleIn,
        predefinedMetricSpecification: props.predefinedMetric !== undefined ? {
          predefinedMetricType: props.predefinedMetric,
          resourceLabel: props.resourceLabel,
        } : undefined,
        targetValue: props.targetValue,
      }
    });

    this.scalingPolicyArn = this.resource.scalingPolicyArn;
  }

  /**
   * Mark this scaling policy as depending on the given targetGroup being attached to a LoadBalancer.
   *
   * The scaling policy can only be created after the attachment has happened,
   * so we add an ordering dependency on the Target Group being associated with
   * a Load Balancer.
   */
  public dependOnLoadBalancerAttachment(targetGroup: elbv2.ITargetGroup) {
    // Defer the actual work until prepare() since the load balancer association
    // may still be created later during setup.
    this.targetGroups.push(targetGroup);
  }

  protected prepare() {
    for (const targetGroup of this.targetGroups) {
      this.node.addDependency(...targetGroup.loadBalancerConstructs);
    }
  }

}

function renderCustomMetric(metric?: cloudwatch.Metric): CfnScalingPolicy.CustomizedMetricSpecificationProperty | undefined {
  if (!metric) { return undefined; }
  return {
    dimensions: metric.dimensionsAsList(),
    metricName: metric.metricName,
    namespace: metric.namespace,
    statistic: metric.statistic,
    unit: metric.unit
  };
}

/**
 * One of the predefined autoscaling metrics
 */
export enum PredefinedMetric {
  /**
   * Average CPU utilization of the Auto Scaling group
   */
  ASGAverageCPUUtilization = 'ASGAverageCPUUtilization',

  /**
   * Average number of bytes received on all network interfaces by the Auto Scaling group
   */
  ASGAverageNetworkIn = 'ASGAverageNetworkIn',

  /**
   * Average number of bytes sent out on all network interfaces by the Auto Scaling group
   */
  ASGAverageNetworkOut = 'ASGAverageNetworkOut',

  /**
   * Number of requests completed per target in an Application Load Balancer target group
   *
   * Specify the ALB to look at in the `resourceLabel` field.
   */
  ALBRequestCountPerTarget = 'ALBRequestCountPerTarget',
}

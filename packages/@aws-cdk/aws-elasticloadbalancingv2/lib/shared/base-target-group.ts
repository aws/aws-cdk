import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct, DependencyGroup, IConstruct, IDependable } from 'constructs';
import { Protocol, TargetType } from './enums';
import { Attributes, renderAttributes } from './util';
import { CfnTargetGroup } from '../elasticloadbalancingv2.generated';

/**
 * Basic properties of both Application and Network Target Groups
 */
export interface BaseTargetGroupProps {
  /**
   * The name of the target group.
   *
   * This name must be unique per region per account, can have a maximum of
   * 32 characters, must contain only alphanumeric characters or hyphens, and
   * must not begin or end with a hyphen.
   *
   * @default - Automatically generated.
   */
  readonly targetGroupName?: string;

  /**
   * The virtual private cloud (VPC).
   *
   * only if `TargetType` is `Ip` or `InstanceId`
   *
   * @default - undefined
   */
  readonly vpc?: ec2.IVpc;

  /**
   * The amount of time for Elastic Load Balancing to wait before deregistering a target.
   *
   * The range is 0-3600 seconds.
   *
   * @default 300
   */
  readonly deregistrationDelay?: cdk.Duration;

  /**
   * Health check configuration
   *
   * @default - The default value for each property in this configuration varies depending on the target.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#aws-resource-elasticloadbalancingv2-targetgroup-properties
   */
  readonly healthCheck?: HealthCheck;

  /**
   * The type of targets registered to this TargetGroup, either IP or Instance.
   *
   * All targets registered into the group must be of this type. If you
   * register targets to the TargetGroup in the CDK app, the TargetType is
   * determined automatically.
   *
   * @default - Determined automatically.
   */
  readonly targetType?: TargetType;
}

/**
 * Properties for configuring a health check
 */
export interface HealthCheck {

  /**
   * Indicates whether health checks are enabled. If the target type is lambda,
   * health checks are disabled by default but can be enabled. If the target type
   * is instance or ip, health checks are always enabled and cannot be disabled.
   *
   * @default - Determined automatically.
   */
  readonly enabled?: boolean;

  /**
   * The approximate number of seconds between health checks for an individual target.
   * Must be 5 to 300 seconds
   *
   * @default 10 seconds if protocol is `GENEVE`, 35 seconds if target type is `lambda`, else 30 seconds
   */
  readonly interval?: cdk.Duration;

  /**
   * The ping path destination where Elastic Load Balancing sends health check requests.
   *
   * @default /
   */
  readonly path?: string;

  /**
   * The port that the load balancer uses when performing health checks on the targets.
   *
   * @default 'traffic-port'
   */
  readonly port?: string;

  /**
   * The protocol the load balancer uses when performing health checks on targets.
   *
   * The TCP protocol is supported for health checks only if the protocol of the target group is TCP, TLS, UDP, or TCP_UDP.
   * The TLS, UDP, and TCP_UDP protocols are not supported for health checks.
   *
   * @default HTTP for ALBs, TCP for NLBs
   */
  readonly protocol?: Protocol;

  /**
   * The amount of time, in seconds, during which no response from a target means a failed health check.
   *
   * For Application Load Balancers, the range is 2-60 seconds and the
   * default is 5 seconds. For Network Load Balancers, this is 10 seconds for
   * TCP and HTTPS health checks and 6 seconds for HTTP health checks.
   *
   * @default Duration.seconds(5) for ALBs, Duration.seconds(10) or Duration.seconds(6) for NLBs
   */
  readonly timeout?: cdk.Duration;

  /**
   * The number of consecutive health checks successes required before considering an unhealthy target healthy.
   *
   * For Application Load Balancers, the default is 5. For Network Load Balancers, the default is 3.
   *
   * @default 5 for ALBs, 3 for NLBs
   */
  readonly healthyThresholdCount?: number;

  /**
   * The number of consecutive health check failures required before considering a target unhealthy.
   *
   * For Application Load Balancers, the default is 2. For Network Load
   * Balancers, this value must be the same as the healthy threshold count.
   *
   * @default 2
   */
  readonly unhealthyThresholdCount?: number;

  /**
   * GRPC code to use when checking for a successful response from a target.
   *
   * You can specify values between 0 and 99. You can specify multiple values
   * (for example, "0,1") or a range of values (for example, "0-5").
   *
   * @default - 12
   */
  readonly healthyGrpcCodes?: string;

  /**
   * HTTP code to use when checking for a successful response from a target.
   *
   * For Application Load Balancers, you can specify values between 200 and
   * 499, and the default value is 200. You can specify multiple values (for
   * example, "200,202") or a range of values (for example, "200-299").
   */
  readonly healthyHttpCodes?: string;
}

/**
 * Define the target of a load balancer
 */
export abstract class TargetGroupBase extends Construct implements ITargetGroup {
  /**
   * The ARN of the target group
   */
  public readonly targetGroupArn: string;

  /**
   * The full name of the target group
   */
  public readonly targetGroupFullName: string;

  /**
   * The name of the target group
   */
  public readonly targetGroupName: string;

  /**
   * ARNs of load balancers load balancing to this TargetGroup
   */
  public readonly targetGroupLoadBalancerArns: string[];

  /**
   * Full name of first load balancer
   *
   * This identifier is emitted as a dimensions of the metrics of this target
   * group.
   *
   * Example value: `app/my-load-balancer/123456789`
   */
  public abstract readonly firstLoadBalancerFullName: string;

  /**
   * Health check for the members of this target group
   */
  /**
   * A token representing a list of ARNs of the load balancers that route traffic to this target group
   */
  public readonly loadBalancerArns: string;

  public healthCheck: HealthCheck;

  /**
   * Default port configured for members of this target group
   */
  protected readonly defaultPort: number;

  /**
   * Configurable dependable with all resources that lead to load balancer attachment
   */
  protected readonly loadBalancerAttachedDependencies = new DependencyGroup();

  /**
   * The types of the directly registered members of this target group
   */
  protected targetType?: TargetType;

  /**
   * Attributes of this target group
   */
  private readonly attributes: Attributes = {};

  /**
   * The JSON objects returned by the directly registered members of this target group
   */
  private readonly targetsJson = new Array<CfnTargetGroup.TargetDescriptionProperty>();

  /**
   * The target group VPC
   *
   * @default - Required if adding instances instead of Lambdas to TargetGroup
   */
  private vpc?: ec2.IVpc;

  /**
   * The target group resource
   */
  private readonly resource: CfnTargetGroup;

  constructor(scope: Construct, id: string, baseProps: BaseTargetGroupProps, additionalProps: any) {
    super(scope, id);

    if (baseProps.deregistrationDelay !== undefined) {
      this.setAttribute('deregistration_delay.timeout_seconds', baseProps.deregistrationDelay.toSeconds().toString());
    }

    this.healthCheck = baseProps.healthCheck || {};
    this.vpc = baseProps.vpc;
    this.targetType = baseProps.targetType;

    this.resource = new CfnTargetGroup(this, 'Resource', {
      name: baseProps.targetGroupName,
      targetGroupAttributes: cdk.Lazy.any({ produce: () => renderAttributes(this.attributes) }, { omitEmptyArray: true }),
      targetType: cdk.Lazy.string({ produce: () => this.targetType }),
      targets: cdk.Lazy.any({ produce: () => this.targetsJson }, { omitEmptyArray: true }),
      vpcId: cdk.Lazy.string({ produce: () => this.vpc && this.targetType !== TargetType.LAMBDA ? this.vpc.vpcId : undefined }),

      // HEALTH CHECK
      healthCheckEnabled: cdk.Lazy.any({ produce: () => this.healthCheck?.enabled }),
      healthCheckIntervalSeconds: cdk.Lazy.number({
        produce: () => this.healthCheck?.interval?.toSeconds(),
      }),
      healthCheckPath: cdk.Lazy.string({ produce: () => this.healthCheck?.path }),
      healthCheckPort: cdk.Lazy.string({ produce: () => this.healthCheck?.port }),
      healthCheckProtocol: cdk.Lazy.string({ produce: () => this.healthCheck?.protocol }),
      healthCheckTimeoutSeconds: cdk.Lazy.number({
        produce: () => this.healthCheck?.timeout?.toSeconds(),
      }),
      healthyThresholdCount: cdk.Lazy.number({ produce: () => this.healthCheck?.healthyThresholdCount }),
      unhealthyThresholdCount: cdk.Lazy.number({ produce: () => this.healthCheck?.unhealthyThresholdCount }),
      matcher: cdk.Lazy.any({
        produce: () => this.healthCheck?.healthyHttpCodes !== undefined || this.healthCheck?.healthyGrpcCodes !== undefined ? {
          grpcCode: this.healthCheck.healthyGrpcCodes,
          httpCode: this.healthCheck.healthyHttpCodes,
        } : undefined,
      }),

      ...additionalProps,
    });

    this.targetGroupLoadBalancerArns = this.resource.attrLoadBalancerArns;
    this.targetGroupArn = this.resource.ref;
    this.targetGroupFullName = this.resource.attrTargetGroupFullName;
    this.loadBalancerArns = this.resource.attrLoadBalancerArns.toString();
    this.targetGroupName = this.resource.attrTargetGroupName;
    this.defaultPort = additionalProps.port;

    this.node.addValidation({ validate: () => this.validateTargetGroup() });
  }

  /**
   * List of constructs that need to be depended on to ensure the TargetGroup is associated to a load balancer
   */
  public get loadBalancerAttached(): IDependable {
    return this.loadBalancerAttachedDependencies;
  }

  /**
   * Set/replace the target group's health check
   */
  public configureHealthCheck(healthCheck: HealthCheck) {
    this.healthCheck = healthCheck;
  }

  /**
   * Set a non-standard attribute on the target group
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-attributes
   */
  public setAttribute(key: string, value: string | undefined) {
    this.attributes[key] = value;
  }

  /**
   * Register the given load balancing target as part of this group
   */
  protected addLoadBalancerTarget(props: LoadBalancerTargetProps) {
    if (this.targetType !== undefined && this.targetType !== props.targetType) {
      throw new Error(`Already have a of type '${this.targetType}', adding '${props.targetType}'; make all targets the same type.`);
    }
    this.targetType = props.targetType;

    if (this.targetType === TargetType.LAMBDA && this.targetsJson.length >= 1) {
      throw new Error('TargetGroup can only contain one LAMBDA target. Create a new TargetGroup.');
    }

    if (props.targetJson) {
      this.targetsJson.push(props.targetJson);
    }
  }

  protected validateTargetGroup(): string[] {
    const ret = new Array<string>();

    if (this.targetType === undefined && this.targetsJson.length === 0) {
      cdk.Annotations.of(this).addWarning("When creating an empty TargetGroup, you should specify a 'targetType' (this warning may become an error in the future).");
    }

    if (this.targetType !== TargetType.LAMBDA && this.vpc === undefined) {
      ret.push("'vpc' is required for a non-Lambda TargetGroup");
    }

    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-name
    const targetGroupName = this.resource.name;
    if (!cdk.Token.isUnresolved(targetGroupName) && targetGroupName !== undefined) {
      if (targetGroupName.length > 32) {
        ret.push(`Target group name: "${targetGroupName}" can have a maximum of 32 characters.`);
      }
      if (targetGroupName.startsWith('-') || targetGroupName.endsWith('-')) {
        ret.push(`Target group name: "${targetGroupName}" must not begin or end with a hyphen.`);
      }
      if (!/^[0-9a-z-]+$/i.test(targetGroupName)) {
        ret.push(`Target group name: "${targetGroupName}" must contain only alphanumeric characters or hyphens.`);
      }
    }

    return ret;
  }
}

/**
 * Properties to reference an existing target group
 */
export interface TargetGroupAttributes {
  /**
   * ARN of the target group
   */
  readonly targetGroupArn: string;

  /**
   * Port target group is listening on
   *
   * @deprecated - This property is unused and the wrong type. No need to use it.
   */
  readonly defaultPort?: string;

  /**
   * A Token representing the list of ARNs for the load balancer routing to this target group
   */
  readonly loadBalancerArns?: string;
}

/**
 * Properties to reference an existing target group
 *
 * @deprecated Use TargetGroupAttributes instead
 */
export interface TargetGroupImportProps extends TargetGroupAttributes {
}

/**
 * A target group
 */
export interface ITargetGroup extends IConstruct {
  /**
   * The name of the target group
   */
  readonly targetGroupName: string;

  /**
   * ARN of the target group
   */
  readonly targetGroupArn: string;

  /**
   * A token representing a list of ARNs of the load balancers that route traffic to this target group
   */
  readonly loadBalancerArns: string;

  /**
   * Return an object to depend on the listeners added to this target group
   */
  readonly loadBalancerAttached: IDependable;
}

/**
 * Result of attaching a target to load balancer
 */
export interface LoadBalancerTargetProps {
  /**
   * What kind of target this is
   */
  readonly targetType: TargetType;

  /**
   * JSON representing the target's direct addition to the TargetGroup list
   *
   * May be omitted if the target is going to register itself later.
   */
  readonly targetJson?: any;
}

/**
 * Extract the full load balancer name (used for metrics) from the listener ARN:
 *
 * Turns
 *
 *     arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/app/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2
 *
 * Into
 *
 *     app/my-load-balancer/50dc6c495c0c9188
 */
export function loadBalancerNameFromListenerArn(listenerArn: string) {
  const arnParts = cdk.Fn.split('/', listenerArn);
  return `${cdk.Fn.select(1, arnParts)}/${cdk.Fn.select(2, arnParts)}/${cdk.Fn.select(3, arnParts)}`;
}

import type { IConstruct, IDependable } from 'constructs';
import { Construct, DependencyGroup } from 'constructs';
import type { Protocol } from './enums';
import { TargetType } from './enums';
import type { Attributes } from './util';
import { renderAttributes } from './util';
import type * as ec2 from '../../../aws-ec2';
import * as cdk from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import type { IArrayBox, IBox } from '../../../core/lib/helpers-internal';
import { Box } from '../../../core/lib/helpers-internal';
import { noBoxStackTraces } from '../../../core/lib/no-box-stack-traces';
import { lit } from '../../../core/lib/private/literal-string';
import type { aws_elasticloadbalancingv2 } from '../../../interfaces';
import { CfnTargetGroup } from '../elasticloadbalancingv2.generated';

/**
 * The IP address type of targets registered with a target group
 */
export enum TargetGroupIpAddressType {
  /**
   * IPv4 addresses
   */
  IPV4 = 'ipv4',

  /**
   * IPv6 addresses
   */
  IPV6 = 'ipv6',
}

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

  /**
   * Indicates whether cross zone load balancing is enabled.
   *
   * @default - use load balancer configuration
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html
   */
  readonly crossZoneEnabled?: boolean;

  /**
   * The type of IP addresses of the targets registered with the target group.
   *
   * @default undefined - ELB defaults to IPv4
   */
  readonly ipAddressType?: TargetGroupIpAddressType;

  /**
   * Configuring target group health.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-attributes
   * @default - use default configuration
   */
  readonly targetGroupHealth?: TargetGroupHealth;
}

/**
 * Properties for configuring a target group health
 * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-attributes
 */
export interface TargetGroupHealth {
  /**
   * The minimum number of targets that must be healthy for DNS failover.
   * If below this value, mark the zone as unhealthy in DNS.
   * Use 0 for "off".
   * @default 1
   */
  readonly dnsMinimumHealthyTargetCount?: number;

  /**
   * The minimum percentage of targets that must be healthy for DNS failover.
   * If below this value, mark the zone as unhealthy in DNS.
   * Use 0 for "off".
   * @default 0
   */
  readonly dnsMinimumHealthyTargetPercentage?: number;

  /**
   * The minimum number of targets that must be healthy for unhealthy state routing.
   * If below this value, send traffic to all targets including unhealthy ones.
   * @default 1
   */
  readonly routingMinimumHealthyTargetCount?: number;

  /**
   * The minimum percentage of targets that must be healthy for unhealthy state routing.
   * If below this value, send traffic to all targets including unhealthy ones.
   * Use 0 for "off".
   * @default 0
   */
  readonly routingMinimumHealthyTargetPercentage?: number;
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
   * @default - 10 seconds if protocol is `GENEVE`, 35 seconds if target type is `lambda`, else 30 seconds
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
   * @default - HTTP for ALBs, TCP for NLBs
   */
  readonly protocol?: Protocol;

  /**
   * The amount of time, in seconds, during which no response from a target means a failed health check.
   * Must be 2 to 120 seconds.
   *
   * @default - 6 seconds if the protocol is HTTP, 5 seconds if protocol is `GENEVE`, 30 seconds if target type is `lambda`, 10 seconds for TCP, TLS, or HTTPS
   */
  readonly timeout?: cdk.Duration;

  /**
   * The number of consecutive health checks successes required before considering an unhealthy target healthy.
   *
   * For Application Load Balancers, the default is 5. For Network Load Balancers, the default is 3.
   *
   * @default - 5 for ALBs, 3 for NLBs
   */
  readonly healthyThresholdCount?: number;

  /**
   * The number of consecutive health check failures required before considering a target unhealthy.
   *
   * For Application Load Balancers, the default is 2. For Network Load
   * Balancers, the range is between 2-10 and can be set accordingly.
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
   * @default 12
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
@noBoxStackTraces
export abstract class TargetGroupBase extends Construct implements ITargetGroup {
  /**
   * The ARN of the target group
   */
  public readonly targetGroupArn: string;

  /**
   * A reference to this target group
   */
  public get targetGroupRef(): aws_elasticloadbalancingv2.TargetGroupReference {
    return {
      targetGroupArn: this.targetGroupArn,
    };
  }

  /**
   * The environment this resource belongs to
   */
  public get env(): cdk.ResourceEnvironment {
    return cdk.Stack.of(this).env;
  }

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
   * A token representing a list of ARNs of the load balancers that route traffic to this target group
   */
  public readonly loadBalancerArns: string;

  /**
   * Health check for the members of this target group
   */
  public get healthCheck(): HealthCheck {
    return this._healthCheck.get() as HealthCheck;
  }
  public set healthCheck(value: HealthCheck) {
    this._healthCheck.set(value);
  }

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
  protected get targetType(): TargetType | undefined {
    return this._targetType.get() as TargetType | undefined;
  }
  protected set targetType(value: TargetType | undefined) {
    this._targetType.set(value);
  }

  /**
   * Attributes of this target group
   */
  private readonly attributes: Attributes = {};

  private readonly _healthCheck: IBox<HealthCheck>;
  private readonly _targetType: IBox<TargetType | undefined>;

  /**
   * The JSON objects returned by the directly registered members of this target group
   */
  private readonly _targetsJson: IArrayBox<CfnTargetGroup.TargetDescriptionProperty>;

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

    if (baseProps.crossZoneEnabled !== undefined) {
      this.setAttribute('load_balancing.cross_zone.enabled', baseProps.crossZoneEnabled === true ? 'true' : 'false');
    }

    if (baseProps.targetGroupHealth?.dnsMinimumHealthyTargetCount !== undefined) {
      this.setAttribute(
        'target_group_health.dns_failover.minimum_healthy_targets.count',
        baseProps.targetGroupHealth.dnsMinimumHealthyTargetCount == 0
          ? 'off'
          : baseProps.targetGroupHealth.dnsMinimumHealthyTargetCount.toString(),
      );
    }

    if (baseProps.targetGroupHealth?.dnsMinimumHealthyTargetPercentage !== undefined) {
      this.setAttribute(
        'target_group_health.dns_failover.minimum_healthy_targets.percentage',
        baseProps.targetGroupHealth.dnsMinimumHealthyTargetPercentage == 0
          ? 'off'
          : baseProps.targetGroupHealth.dnsMinimumHealthyTargetPercentage.toString(),
      );
    }

    if (baseProps.targetGroupHealth?.routingMinimumHealthyTargetCount !== undefined) {
      this.setAttribute(
        'target_group_health.unhealthy_state_routing.minimum_healthy_targets.count',
        baseProps.targetGroupHealth.routingMinimumHealthyTargetCount.toString(),
      );
    }

    if (baseProps.targetGroupHealth?.routingMinimumHealthyTargetPercentage !== undefined) {
      this.setAttribute(
        'target_group_health.unhealthy_state_routing.minimum_healthy_targets.percentage',
        baseProps.targetGroupHealth.routingMinimumHealthyTargetPercentage == 0
          ? 'off'
          : baseProps.targetGroupHealth.routingMinimumHealthyTargetPercentage.toString(),
      );
    }

    this._targetsJson = Box.fromArray([]);

    this._healthCheck = Box.fromValue<HealthCheck>(baseProps.healthCheck || {});
    this.vpc = baseProps.vpc;
    this._targetType = Box.fromValue<TargetType | undefined>(baseProps.targetType);

    this.resource = new CfnTargetGroup(this, 'Resource', {
      name: baseProps.targetGroupName,
      targetGroupAttributes: cdk.Lazy.any({ produce: () => renderAttributes(this.attributes) }, { omitEmptyArray: true }),
      targetType: cdk.Token.asString(this._targetType),
      targets: this._targetsJson,
      vpcId: cdk.Token.asString(
        Box.combine({ targetType: this._targetType }, ({ targetType }) =>
          this.vpc && targetType !== TargetType.LAMBDA ? this.vpc.vpcId : undefined,
        ),
      ),

      // HEALTH CHECK
      healthCheckEnabled: this._healthCheck.derive(hc => hc?.enabled),
      healthCheckIntervalSeconds: cdk.Token.asNumber(this._healthCheck.derive(hc => hc?.interval?.toSeconds())),
      healthCheckPath: cdk.Token.asString(this._healthCheck.derive(hc => hc?.path)),
      healthCheckPort: cdk.Token.asString(this._healthCheck.derive(hc => hc?.port)),
      healthCheckProtocol: cdk.Token.asString(this._healthCheck.derive(hc => hc?.protocol)),
      healthCheckTimeoutSeconds: cdk.Token.asNumber(this._healthCheck.derive(hc => hc?.timeout?.toSeconds())),
      healthyThresholdCount: cdk.Token.asNumber(this._healthCheck.derive(hc => hc?.healthyThresholdCount)),
      unhealthyThresholdCount: cdk.Token.asNumber(this._healthCheck.derive(hc => hc?.unhealthyThresholdCount)),
      matcher: this._healthCheck.derive(hc =>
        hc?.healthyHttpCodes !== undefined || hc?.healthyGrpcCodes !== undefined ? {
          grpcCode: hc.healthyGrpcCodes,
          httpCode: hc.healthyHttpCodes,
        } : undefined,
      ),
      ipAddressType: baseProps.ipAddressType,

      ...additionalProps,
    });

    this.targetGroupLoadBalancerArns = this.resource.attrLoadBalancerArns;
    this.targetGroupArn = this.resource.ref;
    this.targetGroupFullName = this.resource.attrTargetGroupFullName;
    this.loadBalancerArns = this.resource.attrLoadBalancerArns.toString();
    this.targetGroupName = this.resource.attrTargetGroupName;
    this.defaultPort = additionalProps.port;

    this.node.addValidation({ validate: () => this.validateHealthCheck() });
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
    if (value !== undefined) {
      switch (key) {
        case 'target_group_health.dns_failover.minimum_healthy_targets.count':
          if ((!Number.isInteger(+value) || +value < 1) && value !== 'off') {
            throw new ValidationError(lit`MustBeIntegerGreaterThan`, `${key} must be an integer greater than 0 or 'off'. Received: ${value}`, this);
          }
          break;
        case 'target_group_health.unhealthy_state_routing.minimum_healthy_targets.count':
          if (!Number.isInteger(+value) || +value < 1) {
            throw new ValidationError(lit`MustBePositiveInteger`, `${key} must be an integer greater than 0. Received: ${value}`, this);
          }
          break;
        case 'target_group_health.dns_failover.minimum_healthy_targets.percentage':
        case 'target_group_health.unhealthy_state_routing.minimum_healthy_targets.percentage':
          if ((!Number.isInteger(+value) || +value < 1 || +value > 100) && value !== 'off') {
            throw new ValidationError(lit`MustBeIntegerOff`, `${key} must be an integer from 1 to 100 or 'off'. Received: ${value}`, this);
          }
          break;
        default:
          break;
      }
    }

    this.attributes[key] = value;
  }

  /**
   * Register the given load balancing target as part of this group
   */
  protected addLoadBalancerTarget(props: LoadBalancerTargetProps) {
    if (this.targetType !== undefined && this.targetType !== props.targetType) {
      throw new ValidationError(lit`AlreadyType`, `Already have a of type '${this.targetType}', adding '${props.targetType}'; make all targets the same type.`, this);
    }
    this.targetType = props.targetType;

    if (this.targetType === TargetType.LAMBDA && this._targetsJson.length >= 1) {
      throw new ValidationError(lit`TargetGroupContainOneTarget`, 'TargetGroup can only contain one LAMBDA target. Create a new TargetGroup.', this);
    }

    if (props.targetJson) {
      this._targetsJson.push(props.targetJson);
    }
  }

  protected validateTargetGroup(): string[] {
    const ret = new Array<string>();

    if (this.targetType === undefined && this._targetsJson.length === 0) {
      cdk.Annotations.of(this).addWarningV2('@aws-cdk/aws-elbv2:targetGroupSpecifyTargetTypeForEmptyTargetGroup', "When creating an empty TargetGroup, you should specify a 'targetType' (this warning may become an error in the future).");
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

  protected validateHealthCheck(): string[] {
    const ret = new Array<string>();

    const intervalSeconds = this.healthCheck.interval?.toSeconds();
    const timeoutSeconds = this.healthCheck.timeout?.toSeconds();

    if (intervalSeconds && timeoutSeconds) {
      if (intervalSeconds < timeoutSeconds) {
        // < instead of <= for backwards compatibility, see discussion in https://github.com/aws/aws-cdk/pull/26031
        ret.push('Health check interval must be greater than or equal to the timeout; received interval ' +
        `${intervalSeconds}, timeout ${timeoutSeconds}.`);
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
export interface ITargetGroup extends IConstruct, aws_elasticloadbalancingv2.ITargetGroupRef {
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

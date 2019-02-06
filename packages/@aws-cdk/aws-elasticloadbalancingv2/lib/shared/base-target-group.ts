import codedeploy = require('@aws-cdk/aws-codedeploy-api');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { CfnTargetGroup } from '../elasticloadbalancingv2.generated';
import { Protocol, TargetType } from './enums';
import { Attributes, renderAttributes } from './util';

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
   * @default Automatically generated
   */
  targetGroupName?: string;

  /**
   * The virtual private cloud (VPC).
   */
  vpc: ec2.IVpcNetwork;

  /**
   * The amount of time for Elastic Load Balancing to wait before deregistering a target.
   *
   * The range is 0–3600 seconds.
   *
   * @default 300
   */
  deregistrationDelaySec?: number;

  /**
   * Health check configuration
   *
   * @default No health check
   */
  healthCheck?: HealthCheck;

  /**
   * The type of targets registered to this TargetGroup, either IP or Instance.
   *
   * All targets registered into the group must be of this type. If you
   * register targets to the TargetGroup in the CDK app, the TargetType is
   * determined automatically.
   *
   * @default Determined automatically
   */
  targetType?: TargetType;
}

/**
 * Properties for configuring a health check
 */
export interface HealthCheck {
  /**
   * The approximate number of seconds between health checks for an individual target.
   *
   * @default 30
   */
  intervalSecs?: number;

  /**
   * The ping path destination where Elastic Load Balancing sends health check requests.
   *
   * @default /
   */
  path?: string;

  /**
   * The port that the load balancer uses when performing health checks on the targets.
   *
   * @default 'traffic-port'
   */
  port?: string;

  /**
   * The protocol the load balancer uses when performing health checks on targets.
   *
   * The TCP protocol is supported only if the protocol of the target group
   * is TCP.
   *
   * @default HTTP for ALBs, TCP for NLBs
   */
  protocol?: Protocol;

  /**
   * The amount of time, in seconds, during which no response from a target means a failed health check.
   *
   * For Application Load Balancers, the range is 2–60 seconds and the
   * default is 5 seconds. For Network Load Balancers, this is 10 seconds for
   * TCP and HTTPS health checks and 6 seconds for HTTP health checks.
   *
   * @default 5 for ALBs, 10 or 6 for NLBs
   */
  timeoutSeconds?: number;

  /**
   * The number of consecutive health checks successes required before considering an unhealthy target healthy.
   *
   * For Application Load Balancers, the default is 5. For Network Load Balancers, the default is 3.
   *
   * @default 5 for ALBs, 3 for NLBs
   */
  healthyThresholdCount?: number;

  /**
   * The number of consecutive health check failures required before considering a target unhealthy.
   *
   * For Application Load Balancers, the default is 2. For Network Load
   * Balancers, this value must be the same as the healthy threshold count.
   *
   * @default 2
   */
  unhealthyThresholdCount?: number;

  /**
   * HTTP code to use when checking for a successful response from a target.
   *
   * For Application Load Balancers, you can specify values between 200 and
   * 499, and the default value is 200. You can specify multiple values (for
   * example, "200,202") or a range of values (for example, "200-299").
   */
  healthyHttpCodes?: string;
}

/**
 * Define the target of a load balancer
 */
export abstract class TargetGroupBase extends cdk.Construct implements ITargetGroup, codedeploy.ILoadBalancer {
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
   * @example app/my-load-balancer/123456789
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
  protected readonly defaultPort: string;

  /**
   * Configurable dependable with all resources that lead to load balancer attachment
   */
  protected readonly loadBalancerAttachedDependencies = new cdk.ConcreteDependable();

  /**
   * Attributes of this target group
   */
  private readonly attributes: Attributes = {};

  /**
   * The JSON objects returned by the directly registered members of this target group
   */
  private readonly targetsJson = new Array<any>();

  /**
   * The types of the directly registered members of this target group
   */
  private targetType?: TargetType;

  /**
   * The target group resource
   */
  private readonly resource: CfnTargetGroup;

  constructor(scope: cdk.Construct, id: string, baseProps: BaseTargetGroupProps, additionalProps: any) {
    super(scope, id);

    if (baseProps.deregistrationDelaySec !== undefined) {
      this.setAttribute('deregistration_delay.timeout_seconds', baseProps.deregistrationDelaySec.toString());
    }

    this.healthCheck = baseProps.healthCheck || {};
    this.targetType = baseProps.targetType;

    this.resource = new CfnTargetGroup(this, 'Resource', {
      name: baseProps.targetGroupName,
      targetGroupAttributes: new cdk.Token(() => renderAttributes(this.attributes)),
      targetType: new cdk.Token(() => this.targetType),
      targets: new cdk.Token(() => this.targetsJson),
      vpcId: baseProps.vpc.vpcId,

      // HEALTH CHECK
      healthCheckIntervalSeconds: new cdk.Token(() => this.healthCheck && this.healthCheck.intervalSecs),
      healthCheckPath: new cdk.Token(() => this.healthCheck && this.healthCheck.path),
      healthCheckPort: new cdk.Token(() => this.healthCheck && this.healthCheck.port),
      healthCheckProtocol: new cdk.Token(() => this.healthCheck && this.healthCheck.protocol),
      healthCheckTimeoutSeconds: new cdk.Token(() => this.healthCheck && this.healthCheck.timeoutSeconds),
      healthyThresholdCount: new cdk.Token(() => this.healthCheck && this.healthCheck.healthyThresholdCount),
      unhealthyThresholdCount: new cdk.Token(() => this.healthCheck && this.healthCheck.unhealthyThresholdCount),
      matcher: new cdk.Token(() => this.healthCheck && this.healthCheck.healthyHttpCodes !== undefined ? {
        httpCode: this.healthCheck.healthyHttpCodes
      } : undefined),

      ...additionalProps
    });

    this.targetGroupLoadBalancerArns = this.resource.targetGroupLoadBalancerArns;
    this.targetGroupArn = this.resource.ref;
    this.targetGroupFullName = this.resource.targetGroupFullName;
    this.loadBalancerArns = this.resource.targetGroupLoadBalancerArns.toString();
    this.targetGroupName = this.resource.targetGroupName;
    this.defaultPort = `${additionalProps.port}`;
  }

  /**
   * List of constructs that need to be depended on to ensure the TargetGroup is associated to a load balancer
   */
  public get loadBalancerAttached(): cdk.IDependable {
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
   * Export this target group
   */
  public export(): TargetGroupImportProps {
    return {
      targetGroupArn: new cdk.Output(this, 'TargetGroupArn', { value: this.targetGroupArn }).makeImportValue().toString(),
      defaultPort: new cdk.Output(this, 'Port', { value: this.defaultPort }).makeImportValue().toString(),
    };
  }

  public asCodeDeployLoadBalancer(): codedeploy.ILoadBalancerProps {
    return {
      generation: codedeploy.LoadBalancerGeneration.Second,
      name: this.targetGroupName,
    };
  }

  /**
   * Register the given load balancing target as part of this group
   */
  protected addLoadBalancerTarget(props: LoadBalancerTargetProps) {
    if (this.targetType !== undefined && this.targetType !== props.targetType) {
      throw new Error(`Already have a of type '${this.targetType}', adding '${props.targetType}'; make all targets the same type.`);
    }
    this.targetType = props.targetType;

    if (props.targetJson) {
      this.targetsJson.push(props.targetJson);
    }
  }
}

/**
 * Properties to reference an existing target group
 */
export interface TargetGroupImportProps {
  /**
   * ARN of the target group
   */
  targetGroupArn: string;

  /**
   * Port target group is listening on
   */
  defaultPort: string;

  /**
   * A Token representing the list of ARNs for the load balancer routing to this target group
   */
  loadBalancerArns?: string;
}

/**
 * A target group
 */
export interface ITargetGroup extends cdk.IConstruct {
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
  readonly loadBalancerAttached: cdk.IDependable;

  /**
   * Export this target group
   */
  export(): TargetGroupImportProps;

}

/**
 * Result of attaching a target to load balancer
 */
export interface LoadBalancerTargetProps {
  /**
   * What kind of target this is
   */
  targetType: TargetType;

  /**
   * JSON representing the target's direct addition to the TargetGroup list
   *
   * May be omitted if the target is going to register itself later.
   */
  targetJson?: any;
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

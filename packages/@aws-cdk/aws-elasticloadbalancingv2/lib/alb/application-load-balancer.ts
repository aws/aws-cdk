import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct, Duration, Lazy, Resource } from '@aws-cdk/core';
import { BaseLoadBalancer, BaseLoadBalancerProps, ILoadBalancerV2 } from '../shared/base-load-balancer';
import { IpAddressType } from '../shared/enums';
import { ApplicationListener, BaseApplicationListenerProps } from './application-listener';

/**
 * Properties for defining an Application Load Balancer
 */
export interface ApplicationLoadBalancerProps extends BaseLoadBalancerProps {
  /**
   * Security group to associate with this load balancer
   *
   * @default A security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The type of IP addresses to use
   *
   * Only applies to application load balancers.
   *
   * @default IpAddressType.Ipv4
   */
  readonly ipAddressType?: IpAddressType;

  /**
   * Indicates whether HTTP/2 is enabled.
   *
   * @default true
   */
  readonly http2Enabled?: boolean;

  /**
   * The load balancer idle timeout, in seconds
   *
   * @default 60
   */
  readonly idleTimeout?: Duration;
}

/**
 * Define an Application Load Balancer
 *
 * @resource AWS::ElasticLoadBalancingV2::LoadBalancer
 */
export class ApplicationLoadBalancer extends BaseLoadBalancer implements IApplicationLoadBalancer {
  /**
   * Import an existing Application Load Balancer
   */
  public static fromApplicationLoadBalancerAttributes(
    scope: Construct, id: string, attrs: ApplicationLoadBalancerAttributes): IApplicationLoadBalancer {

    return new ImportedApplicationLoadBalancer(scope, id, attrs);
  }

  public readonly connections: ec2.Connections;
  public readonly ipAddressType?: IpAddressType;
  private readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: ApplicationLoadBalancerProps) {
    super(scope, id, props, {
      type: 'application',
      securityGroups: Lazy.listValue({ produce: () => [this.securityGroup.securityGroupId] }),
      ipAddressType: props.ipAddressType,
    });

    this.ipAddressType = props.ipAddressType ?? IpAddressType.IPV4;
    this.securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: `Automatically created Security Group for ELB ${this.node.uniqueId}`,
      allowAllOutbound: false,
    });
    this.connections = new ec2.Connections({ securityGroups: [this.securityGroup] });

    if (props.http2Enabled === false) { this.setAttribute('routing.http2.enabled', 'false'); }
    if (props.idleTimeout !== undefined) { this.setAttribute('idle_timeout.timeout_seconds', props.idleTimeout.toSeconds().toString()); }
  }

  /**
   * Add a new listener to this load balancer
   */
  public addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener {
    return new ApplicationListener(this, id, {
      loadBalancer: this,
      ...props,
    });
  }

  /**
   * Return the given named metric for this Application Load Balancer
   *
   * @default Average over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApplicationELB',
      metricName,
      dimensions: { LoadBalancer: this.loadBalancerFullName },
      ...props,
    });
  }

  /**
   * The total number of concurrent TCP connections active from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   */
  public metricActiveConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.metric('ActiveConnectionCount', {
      statistic: 'sum',
      ...props,
    });
  }

  /**
   * The number of TLS connections initiated by the client that did not
   * establish a session with the load balancer. Possible causes include a
   * mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  public metricClientTlsNegotiationErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metric('ClientTLSNegotiationErrorCount', {
      statistic: 'sum',
      ...props,
    });
  }

  /**
   * The number of load balancer capacity units (LCU) used by your load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricConsumedLCUs(props?: cloudwatch.MetricOptions) {
    return this.metric('ConsumedLCUs', {
      statistic: 'sum',
      ...props,
    });
  }

  /**
   * The number of fixed-response actions that were successful.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpFixedResponseCount(props?: cloudwatch.MetricOptions) {
    return this.metric('HTTP_Fixed_Response_Count', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of redirect actions that were successful.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpRedirectCount(props?: cloudwatch.MetricOptions) {
    return this.metric('HTTP_Redirect_Count', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of redirect actions that couldn't be completed because the URL
   * in the response location header is larger than 8K.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpRedirectUrlLimitExceededCount(props?: cloudwatch.MetricOptions) {
    return this.metric('HTTP_Redirect_Url_Limit_Exceeded_Count', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of HTTP 3xx/4xx/5xx codes that originate from the load balancer.
   *
   * This does not include any response codes generated by the targets.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpCodeElb(code: HttpCodeElb, props?: cloudwatch.MetricOptions) {
    return this.metric(code, {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets
   * in the load balancer.
   *
   * This does not include any response codes generated by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricOptions) {
    return this.metric(code, {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The total number of bytes processed by the load balancer over IPv6.
   *
   * @default Sum over 5 minutes
   */
  public metricIpv6ProcessedBytes(props?: cloudwatch.MetricOptions) {
    return this.metric('IPv6ProcessedBytes', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of IPv6 requests received by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricIpv6RequestCount(props?: cloudwatch.MetricOptions) {
    return this.metric('IPv6RequestCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The total number of new TCP connections established from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   */
  public metricNewConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.metric('NewConnectionCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The total number of bytes processed by the load balancer over IPv4 and IPv6.
   *
   * @default Sum over 5 minutes
   */
  public metricProcessedBytes(props?: cloudwatch.MetricOptions) {
    return this.metric('ProcessedBytes', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of connections that were rejected because the load balancer had
   * reached its maximum number of connections.
   *
   * @default Sum over 5 minutes
   */
  public metricRejectedConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.metric('RejectedConnectionCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of requests processed over IPv4 and IPv6.
   *
   * This count includes only the requests with a response generated by a target of the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricRequestCount(props?: cloudwatch.MetricOptions) {
    return this.metric('RequestCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of rules processed by the load balancer given a request rate averaged over an hour.
   *
   * @default Sum over 5 minutes
   */
  public metricRuleEvaluations(props?: cloudwatch.MetricOptions) {
    return this.metric('RuleEvaluations', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of connections that were not successfully established between the load balancer and target.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetConnectionErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metric('TargetConnectionErrorCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The time elapsed, in seconds, after the request leaves the load balancer until a response from the target is received.
   *
   * @default Average over 5 minutes
   */
  public metricTargetResponseTime(props?: cloudwatch.MetricOptions) {
    return this.metric('TargetResponseTime', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * The number of TLS connections initiated by the load balancer that did not establish a session with the target.
   *
   * Possible causes include a mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetTLSNegotiationErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metric('TargetTLSNegotiationErrorCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of user authentications that could not be completed
   *
   * Because an authenticate action was misconfigured, the load balancer
   * couldn't establish a connection with the IdP, or the load balancer
   * couldn't complete the authentication flow due to an internal error.
   *
   * @default Sum over 5 minutes
   */
  public metricElbAuthError(props?: cloudwatch.MetricOptions) {
    return this.metric('ELBAuthError', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of user authentications that could not be completed because the
   * IdP denied access to the user or an authorization code was used more than
   * once.
   *
   * @default Sum over 5 minutes
   */
  public metricElbAuthFailure(props?: cloudwatch.MetricOptions) {
    return this.metric('ELBAuthFailure', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The time elapsed, in milliseconds, to query the IdP for the ID token and user info.
   *
   * If one or more of these operations fail, this is the time to failure.
   *
   * @default Average over 5 minutes
   */
  public metricElbAuthLatency(props?: cloudwatch.MetricOptions) {
    return this.metric('ELBAuthLatency', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * The number of authenticate actions that were successful.
   *
   * This metric is incremented at the end of the authentication workflow,
   * after the load balancer has retrieved the user claims from the IdP.
   *
   * @default Sum over 5 minutes
   */
  public metricElbAuthSuccess(props?: cloudwatch.MetricOptions) {
    return this.metric('ELBAuthSuccess', {
      statistic: 'Sum',
      ...props,
    });
  }
}

/**
 * Count of HTTP status originating from the load balancer
 *
 * This count does not include any response codes generated by the targets.
 */
export enum HttpCodeElb {
  /**
   * The number of HTTP 3XX redirection codes that originate from the load balancer.
   */
  ELB_3XX_COUNT = 'HTTPCode_ELB_3XX_Count',

  /**
   * The number of HTTP 4XX client error codes that originate from the load balancer.
   *
   * Client errors are generated when requests are malformed or incomplete.
   * These requests have not been received by the target. This count does not
   * include any response codes generated by the targets.
   */
  ELB_4XX_COUNT = 'HTTPCode_ELB_4XX_Count',

  /**
   * The number of HTTP 5XX server error codes that originate from the load balancer.
   */
  ELB_5XX_COUNT = 'HTTPCode_ELB_5XX_Count',
}

/**
 * Count of HTTP status originating from the targets
 */
export enum HttpCodeTarget {
  /**
   * The number of 2xx response codes from targets
   */
  TARGET_2XX_COUNT = 'HTTPCode_Target_2XX_Count',

  /**
   * The number of 3xx response codes from targets
   */
  TARGET_3XX_COUNT = 'HTTPCode_Target_3XX_Count',

  /**
   * The number of 4xx response codes from targets
   */
  TARGET_4XX_COUNT = 'HTTPCode_Target_4XX_Count',

  /**
   * The number of 5xx response codes from targets
   */
  TARGET_5XX_COUNT = 'HTTPCode_Target_5XX_Count'
}

/**
 * An application load balancer
 */
export interface IApplicationLoadBalancer extends ILoadBalancerV2, ec2.IConnectable {
  /**
   * The ARN of this load balancer
   */
  readonly loadBalancerArn: string;

  /**
   * The VPC this load balancer has been created in (if available).
   * If this interface is the result of an import call to fromApplicationLoadBalancerAttributes,
   * the vpc attribute will be undefined unless specified in the optional properties of that method.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * The IP Address Type for this load balancer
   *
   * @default IpAddressType.IPV4
   */
  readonly ipAddressType?: IpAddressType;

  /**
   * Add a new listener to this load balancer
   */
  addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener;
}

/**
 * Properties to reference an existing load balancer
 */
export interface ApplicationLoadBalancerAttributes {
  /**
   * ARN of the load balancer
   */
  readonly loadBalancerArn: string;

  /**
   * ID of the load balancer's security group
   */
  readonly securityGroupId: string;

  /**
   * The canonical hosted zone ID of this load balancer
   *
   * @default - When not provided, LB cannot be used as Route53 Alias target.
   */
  readonly loadBalancerCanonicalHostedZoneId?: string;

  /**
   * The DNS name of this load balancer
   *
   * @default - When not provided, LB cannot be used as Route53 Alias target.
   */
  readonly loadBalancerDnsName?: string;

  /**
   * Whether the security group allows all outbound traffic or not
   *
   * Unless set to `false`, no egress rules will be added to the security group.
   *
   * @default true
   */
  readonly securityGroupAllowsAllOutbound?: boolean;

  /**
   * The VPC this load balancer has been created in, if available
   *
   * @default - If the Load Balancer was imported and a VPC was not specified,
   * the VPC is not available.
   */
  readonly vpc?: ec2.IVpc;

}

/**
 * An ApplicationLoadBalancer that has been defined elsewhere
 */
class ImportedApplicationLoadBalancer extends Resource implements IApplicationLoadBalancer {
  /**
   * Manage connections for this load balancer
   */
  public readonly connections: ec2.Connections;

  /**
   * ARN of the load balancer
   */
  public readonly loadBalancerArn: string;

  /**
   * VPC of the load balancer
   *
   * Undefined if optional vpc is not specified.
   */
  public readonly vpc?: ec2.IVpc;

  constructor(scope: Construct, id: string, private readonly props: ApplicationLoadBalancerAttributes) {
    super(scope, id);
    this.vpc = props.vpc;
    this.loadBalancerArn = props.loadBalancerArn;
    this.connections = new ec2.Connections({
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroup', props.securityGroupId, {
        allowAllOutbound: props.securityGroupAllowsAllOutbound,
      })],
    });
  }

  public addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener {
    return new ApplicationListener(this, id, {
      loadBalancer: this,
      ...props,
    });
  }

  public get loadBalancerCanonicalHostedZoneId(): string {
    if (this.props.loadBalancerCanonicalHostedZoneId) { return this.props.loadBalancerCanonicalHostedZoneId; }
    // eslint-disable-next-line max-len
    throw new Error(`'loadBalancerCanonicalHostedZoneId' was not provided when constructing Application Load Balancer ${this.node.path} from attributes`);
  }

  public get loadBalancerDnsName(): string {
    if (this.props.loadBalancerDnsName) { return this.props.loadBalancerDnsName; }
    // eslint-disable-next-line max-len
    throw new Error(`'loadBalancerDnsName' was not provided when constructing Application Load Balancer ${this.node.path} from attributes`);
  }
}

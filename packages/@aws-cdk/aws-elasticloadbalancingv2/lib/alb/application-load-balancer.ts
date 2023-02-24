import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Duration, Lazy, Names, Resource } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { ApplicationListener, BaseApplicationListenerProps } from './application-listener';
import { ListenerAction } from './application-listener-action';
import { ApplicationELBMetrics } from '../elasticloadbalancingv2-canned-metrics.generated';
import { BaseLoadBalancer, BaseLoadBalancerLookupOptions, BaseLoadBalancerProps, ILoadBalancerV2 } from '../shared/base-load-balancer';
import { IpAddressType, ApplicationProtocol, DesyncMitigationMode } from '../shared/enums';
import { parseLoadBalancerFullName } from '../shared/util';

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

  /**
   * Indicates whether HTTP headers with invalid header fields are removed
   * by the load balancer (true) or routed to targets (false)
   *
   * @default false
   */
  readonly dropInvalidHeaderFields?: boolean;

  /**
   * Determines how the load balancer handles requests that
   * might pose a security risk to your application
   *
   * @default DesyncMitigationMode.DEFENSIVE
   */
  readonly desyncMitigationMode?: DesyncMitigationMode;
}

/**
 * Options for looking up an ApplicationLoadBalancer
 */
export interface ApplicationLoadBalancerLookupOptions extends BaseLoadBalancerLookupOptions {
}

/**
 * Define an Application Load Balancer
 *
 * @resource AWS::ElasticLoadBalancingV2::LoadBalancer
 */
export class ApplicationLoadBalancer extends BaseLoadBalancer implements IApplicationLoadBalancer {
  /**
   * Look up an application load balancer.
   */
  public static fromLookup(scope: Construct, id: string, options: ApplicationLoadBalancerLookupOptions): IApplicationLoadBalancer {
    const props = BaseLoadBalancer._queryContextProvider(scope, {
      userOptions: options,
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
    });

    return new LookedUpApplicationLoadBalancer(scope, id, props);
  }

  /**
   * Import an existing Application Load Balancer
   */
  public static fromApplicationLoadBalancerAttributes(
    scope: Construct, id: string, attrs: ApplicationLoadBalancerAttributes): IApplicationLoadBalancer {

    return new ImportedApplicationLoadBalancer(scope, id, attrs);
  }

  public readonly connections: ec2.Connections;
  public readonly ipAddressType?: IpAddressType;
  public readonly listeners: ApplicationListener[];
  public readonly metrics: IApplicationLoadBalancerMetrics;

  constructor(scope: Construct, id: string, props: ApplicationLoadBalancerProps) {
    super(scope, id, props, {
      type: 'application',
      securityGroups: Lazy.list({ produce: () => this.connections.securityGroups.map(sg => sg.securityGroupId) }),
      ipAddressType: props.ipAddressType,
    });

    this.ipAddressType = props.ipAddressType ?? IpAddressType.IPV4;
    const securityGroups = [props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: `Automatically created Security Group for ELB ${Names.uniqueId(this)}`,
      allowAllOutbound: false,
    })];
    this.connections = new ec2.Connections({ securityGroups });
    this.listeners = [];
    this.metrics = new ApplicationLoadBalancerMetrics(this, this.loadBalancerFullName);

    if (props.http2Enabled === false) { this.setAttribute('routing.http2.enabled', 'false'); }
    if (props.idleTimeout !== undefined) { this.setAttribute('idle_timeout.timeout_seconds', props.idleTimeout.toSeconds().toString()); }
    if (props.dropInvalidHeaderFields) {this.setAttribute('routing.http.drop_invalid_header_fields.enabled', 'true'); }
    if (props.desyncMitigationMode !== undefined) {this.setAttribute('routing.http.desync_mitigation_mode', props.desyncMitigationMode); }
  }

  /**
   * Add a new listener to this load balancer
   */
  public addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener {
    const listener = new ApplicationListener(this, id, {
      loadBalancer: this,
      ...props,
    });
    this.listeners.push(listener);
    return listener;
  }

  /**
   * Add a redirection listener to this load balancer
   */
  public addRedirect(props: ApplicationLoadBalancerRedirectConfig = {}): ApplicationListener {
    const sourcePort = props.sourcePort ?? 80;
    const targetPort = (props.targetPort ?? 443).toString();
    return this.addListener(`Redirect${sourcePort}To${targetPort}`, {
      protocol: props.sourceProtocol ?? ApplicationProtocol.HTTP,
      port: sourcePort,
      open: props.open ?? true,
      defaultAction: ListenerAction.redirect({
        port: targetPort,
        protocol: props.targetProtocol ?? ApplicationProtocol.HTTPS,
        permanent: true,
      }),
    });
  }

  /**
   * Add a security group to this load balancer
   */
  public addSecurityGroup(securityGroup: ec2.ISecurityGroup) {
    this.connections.addSecurityGroup(securityGroup);
  }

  /**
   * Return the given named metric for this Application Load Balancer
   *
   * @default Average over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.custom`` instead
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metrics.custom(metricName, props);
  }

  /**
   * The total number of concurrent TCP connections active from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.activeConnectionCount`` instead
   */
  public metricActiveConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.activeConnectionCount(props);
  }

  /**
   * The number of TLS connections initiated by the client that did not
   * establish a session with the load balancer. Possible causes include a
   * mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.clientTlsNegotiationErrorCount`` instead
   */
  public metricClientTlsNegotiationErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.clientTlsNegotiationErrorCount(props);
  }

  /**
   * The number of load balancer capacity units (LCU) used by your load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.consumedLCUs`` instead
   */
  public metricConsumedLCUs(props?: cloudwatch.MetricOptions) {
    return this.metrics.consumedLCUs(props);
  }

  /**
   * The number of fixed-response actions that were successful.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.httpFixedResponseCount`` instead
   */
  public metricHttpFixedResponseCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.httpFixedResponseCount(props);
  }

  /**
   * The number of redirect actions that were successful.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.httpRedirectCount`` instead
   */
  public metricHttpRedirectCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.httpRedirectCount(props);
  }

  /**
   * The number of redirect actions that couldn't be completed because the URL
   * in the response location header is larger than 8K.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.httpRedirectUrlLimitExceededCount`` instead
   */
  public metricHttpRedirectUrlLimitExceededCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.httpRedirectUrlLimitExceededCount(props);
  }

  /**
   * The number of HTTP 3xx/4xx/5xx codes that originate from the load balancer.
   *
   * This does not include any response codes generated by the targets.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.httpCodeElb`` instead
   */
  public metricHttpCodeElb(code: HttpCodeElb, props?: cloudwatch.MetricOptions) {
    return this.metrics.httpCodeElb(code, props);
  }

  /**
   * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets
   * in the load balancer.
   *
   * This does not include any response codes generated by the load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.httpCodeTarget`` instead
   */
  public metricHttpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricOptions) {
    return this.metrics.httpCodeTarget(code, props);
  }

  /**
   * The total number of bytes processed by the load balancer over IPv6.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.ipv6ProcessedBytes`` instead
   */
  public metricIpv6ProcessedBytes(props?: cloudwatch.MetricOptions) {
    return this.metrics.ipv6ProcessedBytes(props);
  }

  /**
   * The number of IPv6 requests received by the load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.ipv6RequestCount`` instead
   */
  public metricIpv6RequestCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.ipv6RequestCount(props);
  }

  /**
   * The total number of new TCP connections established from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.newConnectionCount`` instead
   */
  public metricNewConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.newConnectionCount(props);
  }

  /**
   * The total number of bytes processed by the load balancer over IPv4 and IPv6.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.processedBytes`` instead
   */
  public metricProcessedBytes(props?: cloudwatch.MetricOptions) {
    return this.metrics.processedBytes(props);
  }

  /**
   * The number of connections that were rejected because the load balancer had
   * reached its maximum number of connections.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.rejectedConnectionCount`` instead
   */
  public metricRejectedConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.rejectedConnectionCount(props);
  }

  /**
   * The number of requests processed over IPv4 and IPv6.
   *
   * This count includes only the requests with a response generated by a target of the load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.requestCount`` instead
   */
  public metricRequestCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.requestCount(props);
  }

  /**
   * The number of rules processed by the load balancer given a request rate averaged over an hour.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.ruleEvaluations`` instead
   */
  public metricRuleEvaluations(props?: cloudwatch.MetricOptions) {
    return this.metrics.ruleEvaluations(props);
  }

  /**
   * The number of connections that were not successfully established between the load balancer and target.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.targetConnectionErrorCount`` instead
   */
  public metricTargetConnectionErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.targetConnectionErrorCount(props);
  }

  /**
   * The time elapsed, in seconds, after the request leaves the load balancer until a response from the target is received.
   *
   * @default Average over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.targetResponseTime`` instead
   */
  public metricTargetResponseTime(props?: cloudwatch.MetricOptions) {
    return this.metrics.targetResponseTime(props);
  }

  /**
   * The number of TLS connections initiated by the load balancer that did not establish a session with the target.
   *
   * Possible causes include a mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.targetTLSNegotiationErrorCount`` instead
   */
  public metricTargetTLSNegotiationErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.targetTLSNegotiationErrorCount(props);
  }

  /**
   * The number of user authentications that could not be completed
   *
   * Because an authenticate action was misconfigured, the load balancer
   * couldn't establish a connection with the IdP, or the load balancer
   * couldn't complete the authentication flow due to an internal error.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthError`` instead
   */
  public metricElbAuthError(props?: cloudwatch.MetricOptions) {
    return this.metrics.elbAuthError(props);
  }

  /**
   * The number of user authentications that could not be completed because the
   * IdP denied access to the user or an authorization code was used more than
   * once.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthFailure`` instead
   */
  public metricElbAuthFailure(props?: cloudwatch.MetricOptions) {
    return this.metrics.elbAuthFailure(props);
  }

  /**
   * The time elapsed, in milliseconds, to query the IdP for the ID token and user info.
   *
   * If one or more of these operations fail, this is the time to failure.
   *
   * @default Average over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthLatency`` instead
   */
  public metricElbAuthLatency(props?: cloudwatch.MetricOptions) {
    return this.metrics.elbAuthLatency(props);
  }

  /**
   * The number of authenticate actions that were successful.
   *
   * This metric is incremented at the end of the authentication workflow,
   * after the load balancer has retrieved the user claims from the IdP.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthSuccess`` instead
   *
   */
  public metricElbAuthSuccess(props?: cloudwatch.MetricOptions) {
    return this.metrics.elbAuthSuccess(props);
  }
}

class ApplicationLoadBalancerMetrics implements IApplicationLoadBalancerMetrics {
  private readonly scope: Construct;
  private readonly loadBalancerFullName: string;

  constructor(scope: Construct, loadBalancerFullName: string) {
    this.scope = scope;
    this.loadBalancerFullName = loadBalancerFullName;
  }

  /**
   * Return the given named metric for this Application Load Balancer
   *
   * @default Average over 5 minutes
   */
  public custom(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApplicationELB',
      metricName,
      dimensionsMap: { LoadBalancer: this.loadBalancerFullName },
      ...props,
    });
  }

  public activeConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.activeConnectionCountSum, props);
  }

  public clientTlsNegotiationErrorCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.clientTlsNegotiationErrorCountSum, props);
  }

  public consumedLCUs(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.consumedLcUsAverage, {
      statistic: 'sum',
      ...props,
    });
  }

  public httpFixedResponseCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.httpFixedResponseCountSum, props);
  }

  public httpRedirectCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.httpRedirectCountSum, props);
  }

  public httpRedirectUrlLimitExceededCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.httpRedirectUrlLimitExceededCountSum, props);
  }

  public httpCodeElb(code: HttpCodeElb, props?: cloudwatch.MetricOptions) {
    return this.custom(code, {
      statistic: 'Sum',
      ...props,
    });
  }

  public httpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricOptions) {
    return this.custom(code, {
      statistic: 'Sum',
      ...props,
    });
  }

  public ipv6ProcessedBytes(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.iPv6ProcessedBytesSum, props);
  }

  public ipv6RequestCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.iPv6RequestCountSum, props);
  }

  public newConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.newConnectionCountSum, props);
  }

  public processedBytes(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.processedBytesSum, props);
  }

  public rejectedConnectionCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.rejectedConnectionCountSum, props);
  }

  public requestCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.requestCountSum, props);
  }

  public ruleEvaluations(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.ruleEvaluationsSum, props);
  }

  public targetConnectionErrorCount(props?: cloudwatch.MetricOptions) {
    return this.custom('TargetConnectionErrorCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  public targetResponseTime(props?: cloudwatch.MetricOptions) {
    return this.custom('TargetResponseTime', {
      statistic: 'Average',
      ...props,
    });
  }

  public targetTLSNegotiationErrorCount(props?: cloudwatch.MetricOptions) {
    return this.custom('TargetTLSNegotiationErrorCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  public elbAuthError(props?: cloudwatch.MetricOptions) {
    return this.custom('ELBAuthError', {
      statistic: 'Sum',
      ...props,
    });
  }

  public elbAuthFailure(props?: cloudwatch.MetricOptions) {
    return this.custom('ELBAuthFailure', {
      statistic: 'Sum',
      ...props,
    });
  }

  public elbAuthLatency(props?: cloudwatch.MetricOptions) {
    return this.custom('ELBAuthLatency', {
      statistic: 'Average',
      ...props,
    });
  }

  public elbAuthSuccess(props?: cloudwatch.MetricOptions) {
    return this.custom('ELBAuthSuccess', {
      statistic: 'Sum',
      ...props,
    });
  }

  private cannedMetric(
    fn: (dims: { LoadBalancer: string }) => cloudwatch.MetricProps,
    props?: cloudwatch.MetricOptions,
  ): cloudwatch.Metric {
    return new cloudwatch.Metric({
      ...fn({ LoadBalancer: this.loadBalancerFullName }),
      ...props,
    }).attachTo(this.scope);
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
 * Contains all metrics for an Application Load Balancer.
 */
export interface IApplicationLoadBalancerMetrics {

  /**
   * Return the given named metric for this Application Load Balancer
   *
   * @default Average over 5 minutes
   */
  custom(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of concurrent TCP connections active from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   */
  activeConnectionCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of TLS connections initiated by the client that did not
   * establish a session with the load balancer. Possible causes include a
   * mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  clientTlsNegotiationErrorCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of load balancer capacity units (LCU) used by your load balancer.
   *
   * @default Sum over 5 minutes
   */
  consumedLCUs(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of fixed-response actions that were successful.
   *
   * @default Sum over 5 minutes
   */
  httpFixedResponseCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of redirect actions that were successful.
   *
   * @default Sum over 5 minutes
   */
  httpRedirectCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of redirect actions that couldn't be completed because the URL
   * in the response location header is larger than 8K.
   *
   * @default Sum over 5 minutes
   */
  httpRedirectUrlLimitExceededCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of HTTP 3xx/4xx/5xx codes that originate from the load balancer.
   *
   * This does not include any response codes generated by the targets.
   *
   * @default Sum over 5 minutes
   */
  httpCodeElb(code: HttpCodeElb, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets
   * in the load balancer.
   *
   * This does not include any response codes generated by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  httpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of bytes processed by the load balancer over IPv6.
   *
   * @default Sum over 5 minutes
   */
  ipv6ProcessedBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of IPv6 requests received by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  ipv6RequestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of new TCP connections established from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   */
  newConnectionCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of bytes processed by the load balancer over IPv4 and IPv6.
   *
   * @default Sum over 5 minutes
   */
  processedBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of connections that were rejected because the load balancer had
   * reached its maximum number of connections.
   *
   * @default Sum over 5 minutes
   */
  rejectedConnectionCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of requests processed over IPv4 and IPv6.
   *
   * This count includes only the requests with a response generated by a target of the load balancer.
   *
   * @default Sum over 5 minutes
   */
  requestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of rules processed by the load balancer given a request rate averaged over an hour.
   *
   * @default Sum over 5 minutes
   */
  ruleEvaluations(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of connections that were not successfully established between the load balancer and target.
   *
   * @default Sum over 5 minutes
   */
  targetConnectionErrorCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time elapsed, in seconds, after the request leaves the load balancer until a response from the target is received.
   *
   * @default Average over 5 minutes
   */
  targetResponseTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of TLS connections initiated by the load balancer that did not establish a session with the target.
   *
   * Possible causes include a mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  targetTLSNegotiationErrorCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of user authentications that could not be completed
   *
   * Because an authenticate action was misconfigured, the load balancer
   * couldn't establish a connection with the IdP, or the load balancer
   * couldn't complete the authentication flow due to an internal error.
   *
   * @default Sum over 5 minutes
   */
  elbAuthError(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of user authentications that could not be completed because the
   * IdP denied access to the user or an authorization code was used more than
   * once.
   *
   * @default Sum over 5 minutes
   */
  elbAuthFailure(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time elapsed, in milliseconds, to query the IdP for the ID token and user info.
   *
   * If one or more of these operations fail, this is the time to failure.
   *
   * @default Average over 5 minutes
   */
  elbAuthLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of authenticate actions that were successful.
   *
   * This metric is incremented at the end of the authentication workflow,
   * after the load balancer has retrieved the user claims from the IdP.
   *
   * @default Sum over 5 minutes
   */
  elbAuthSuccess(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
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
   * A list of listeners that have been added to the load balancer.
   * This list is only valid for owned constructs.
   */
  readonly listeners: ApplicationListener[];

  /**
   * All metrics available for this load balancer
   */
  readonly metrics: IApplicationLoadBalancerMetrics;

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

  public get listeners(): ApplicationListener[] {
    throw Error('.listeners can only be accessed if the class was constructed as an owned, not imported, load balancer');
  }

  /**
   * VPC of the load balancer
   *
   * Undefined if optional vpc is not specified.
   */
  public readonly vpc?: ec2.IVpc;
  public readonly metrics: IApplicationLoadBalancerMetrics;

  constructor(scope: Construct, id: string, private readonly props: ApplicationLoadBalancerAttributes) {
    super(scope, id, {
      environmentFromArn: props.loadBalancerArn,
    });

    this.vpc = props.vpc;
    this.loadBalancerArn = props.loadBalancerArn;
    this.connections = new ec2.Connections({
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroup', props.securityGroupId, {
        allowAllOutbound: props.securityGroupAllowsAllOutbound,
      })],
    });
    this.metrics = new ApplicationLoadBalancerMetrics(this, parseLoadBalancerFullName(props.loadBalancerArn));
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

class LookedUpApplicationLoadBalancer extends Resource implements IApplicationLoadBalancer {
  public readonly loadBalancerArn: string;
  public readonly loadBalancerCanonicalHostedZoneId: string;
  public readonly loadBalancerDnsName: string;
  public readonly ipAddressType?: IpAddressType;
  public readonly connections: ec2.Connections;
  public readonly vpc?: ec2.IVpc;
  public readonly metrics: IApplicationLoadBalancerMetrics;

  public get listeners(): ApplicationListener[] {
    throw Error('.listeners can only be accessed if the class was constructed as an owned, not looked up, load balancer');
  }

  constructor(scope: Construct, id: string, props: cxapi.LoadBalancerContextResponse) {
    super(scope, id, {
      environmentFromArn: props.loadBalancerArn,
    });

    this.loadBalancerArn = props.loadBalancerArn;
    this.loadBalancerCanonicalHostedZoneId = props.loadBalancerCanonicalHostedZoneId;
    this.loadBalancerDnsName = props.loadBalancerDnsName;

    if (props.ipAddressType === cxapi.LoadBalancerIpAddressType.IPV4) {
      this.ipAddressType = IpAddressType.IPV4;
    } else if (props.ipAddressType === cxapi.LoadBalancerIpAddressType.DUAL_STACK) {
      this.ipAddressType = IpAddressType.DUAL_STACK;
    }

    this.vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      vpcId: props.vpcId,
    });

    this.connections = new ec2.Connections();
    for (const securityGroupId of props.securityGroupIds) {
      const securityGroup = ec2.SecurityGroup.fromLookupById(this, `SecurityGroup-${securityGroupId}`, securityGroupId);
      this.connections.addSecurityGroup(securityGroup);
    }
    this.metrics = new ApplicationLoadBalancerMetrics(this, parseLoadBalancerFullName(this.loadBalancerArn));
  }

  public addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener {
    return new ApplicationListener(this, id, {
      ...props,
      loadBalancer: this,
    });
  }
}

/**
 * Properties for a redirection config
 */
export interface ApplicationLoadBalancerRedirectConfig {

  /**
   * The protocol of the listener being created
   *
   * @default HTTP
   */
  readonly sourceProtocol?: ApplicationProtocol;

  /**
   * The port number to listen to
   *
   * @default 80
   */
  readonly sourcePort?: number;

  /**
   * The protocol of the redirection target
   *
   * @default HTTPS
   */
  readonly targetProtocol?: ApplicationProtocol;

  /**
   * The port number to redirect to
   *
   * @default 443
   */
  readonly targetPort?: number;

  /**
   * Allow anyone to connect to this listener
   *
   * If this is specified, the listener will be opened up to anyone who can reach it.
   * For internal load balancers this is anyone in the same VPC. For public load
   * balancers, this is anyone on the internet.
   *
   * If you want to be more selective about who can access this load
   * balancer, set this to `false` and use the listener's `connections`
   * object to selectively grant access to the listener.
   *
   * @default true
   */
  readonly open?: boolean;

}

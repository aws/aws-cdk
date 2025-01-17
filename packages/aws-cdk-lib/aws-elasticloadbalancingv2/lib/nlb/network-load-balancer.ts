import { Construct } from 'constructs';
import { BaseNetworkListenerProps, NetworkListener } from './network-listener';
import * as cloudwatch from '../../../aws-cloudwatch';
import * as ec2 from '../../../aws-ec2';
import * as cxschema from '../../../cloud-assembly-schema';
import { Lazy, Resource } from '../../../core';
import * as cxapi from '../../../cx-api';
import { NetworkELBMetrics } from '../elasticloadbalancingv2-canned-metrics.generated';
import { BaseLoadBalancer, BaseLoadBalancerLookupOptions, BaseLoadBalancerProps, ILoadBalancerV2 } from '../shared/base-load-balancer';
import { IpAddressType, Protocol } from '../shared/enums';
import { parseLoadBalancerFullName } from '../shared/util';

/**
 * Indicates how traffic is distributed among the load balancer Availability Zones.
 *
 * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#zonal-dns-affinity
 */
export enum ClientRoutingPolicy {
  /**
   * 100 percent zonal affinity
   */
  AVAILABILITY_ZONE_AFFINITY = 'availability_zone_affinity',
  /**
   * 85 percent zonal affinity
   */
  PARTIAL_AVAILABILITY_ZONE_AFFINITY = 'partial_availability_zone_affinity',
  /**
   * No zonal affinity
   */
  ANY_AVAILABILITY_ZONE = 'any_availability_zone',
}

/**
 * Properties for a network load balancer
 */
export interface NetworkLoadBalancerProps extends BaseLoadBalancerProps {
  /**
   * Security groups to associate with this load balancer
   *
   * @default - No security groups associated with the load balancer.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The type of IP addresses to use
   *
   * If you want to add a UDP or TCP_UDP listener to the load balancer,
   * you must choose IPv4.
   *
   * @default IpAddressType.IPV4
   */
  readonly ipAddressType?: IpAddressType;

  /**
   * The AZ affinity routing policy
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#zonal-dns-affinity
   *
   * @default - AZ affinity is disabled.
   */
  readonly clientRoutingPolicy?: ClientRoutingPolicy;

  /**
   * Indicates whether to evaluate inbound security group rules for traffic sent to a Network Load Balancer through AWS PrivateLink.
   *
   * @default true
   */
  readonly enforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: boolean;

  /**
   * Indicates whether zonal shift is enabled
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/network/zonal-shift.html
   *
   * @default false
   */
  readonly zonalShift?: boolean;

  /**
   * Indicates whether to use an IPv6 prefix from each subnet for source NAT.
   *
   * The IP address type must be IpAddressType.DUALSTACK.
   *
   * @default undefined - NLB default behavior is false
   */
  readonly enablePrefixForIpv6SourceNat?: boolean;
}

/**
 * Properties to reference an existing load balancer
 */
export interface NetworkLoadBalancerAttributes {
  /**
   * ARN of the load balancer
   */
  readonly loadBalancerArn: string;

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
   * The VPC to associate with the load balancer.
   *
   * @default - When not provided, listeners cannot be created on imported load
   * balancers.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Security groups to associate with this load balancer
   *
   * @default - No security groups associated with the load balancer.
   */
  readonly loadBalancerSecurityGroups?: string[];
}

/**
 * Options for looking up an NetworkLoadBalancer
 */
export interface NetworkLoadBalancerLookupOptions extends BaseLoadBalancerLookupOptions {
}

/**
 * The metrics for a network load balancer.
 */
class NetworkLoadBalancerMetrics implements INetworkLoadBalancerMetrics {
  private readonly loadBalancerFullName: string;
  private readonly scope: Construct;

  constructor(scope: Construct, loadBalancerFullName: string) {
    this.scope = scope;
    this.loadBalancerFullName = loadBalancerFullName;
  }

  public custom(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/NetworkELB',
      metricName,
      dimensionsMap: { LoadBalancer: this.loadBalancerFullName },
      ...props,
    }).attachTo(this.scope);
  }

  public activeFlowCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(NetworkELBMetrics.activeFlowCountAverage, props);
  }

  public consumedLCUs(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(NetworkELBMetrics.consumedLcUsAverage, {
      statistic: 'Sum',
      ...props,
    });
  }

  public newFlowCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(NetworkELBMetrics.newFlowCountSum, props);
  }

  public processedBytes(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(NetworkELBMetrics.processedBytesSum, props);
  }

  public tcpClientResetCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(NetworkELBMetrics.tcpClientResetCountSum, props);
  }
  public tcpElbResetCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(NetworkELBMetrics.tcpElbResetCountSum, props);
  }
  public tcpTargetResetCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(NetworkELBMetrics.tcpTargetResetCountSum, props);
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
 * Define a new network load balancer
 *
 * @resource AWS::ElasticLoadBalancingV2::LoadBalancer
 */
export class NetworkLoadBalancer extends BaseLoadBalancer implements INetworkLoadBalancer {
  /**
   * Looks up the network load balancer.
   */
  public static fromLookup(scope: Construct, id: string, options: NetworkLoadBalancerLookupOptions): INetworkLoadBalancer {
    const props = BaseLoadBalancer._queryContextProvider(scope, {
      userOptions: options,
      loadBalancerType: cxschema.LoadBalancerType.NETWORK,
    });

    return new LookedUpNetworkLoadBalancer(scope, id, props);
  }

  public static fromNetworkLoadBalancerAttributes(scope: Construct, id: string, attrs: NetworkLoadBalancerAttributes): INetworkLoadBalancer {
    class Import extends Resource implements INetworkLoadBalancer {
      public readonly connections: ec2.Connections = new ec2.Connections({
        securityGroups: attrs.loadBalancerSecurityGroups?.map(
          (securityGroupId, index) => ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup-${index}`, securityGroupId),
        ),
      });
      public readonly loadBalancerArn = attrs.loadBalancerArn;
      public readonly vpc?: ec2.IVpc = attrs.vpc;
      public readonly metrics: INetworkLoadBalancerMetrics = new NetworkLoadBalancerMetrics(this, parseLoadBalancerFullName(attrs.loadBalancerArn));
      public readonly securityGroups?: string[] = attrs.loadBalancerSecurityGroups;

      public addListener(lid: string, props: BaseNetworkListenerProps): NetworkListener {
        return new NetworkListener(this, lid, {
          loadBalancer: this,
          ...props,
        });
      }

      public get loadBalancerCanonicalHostedZoneId(): string {
        if (attrs.loadBalancerCanonicalHostedZoneId) { return attrs.loadBalancerCanonicalHostedZoneId; }
        // eslint-disable-next-line max-len
        throw new Error(`'loadBalancerCanonicalHostedZoneId' was not provided when constructing Network Load Balancer ${this.node.path} from attributes`);
      }

      public get loadBalancerDnsName(): string {
        if (attrs.loadBalancerDnsName) { return attrs.loadBalancerDnsName; }
        // eslint-disable-next-line max-len
        throw new Error(`'loadBalancerDnsName' was not provided when constructing Network Load Balancer ${this.node.path} from attributes`);
      }
    }

    return new Import(scope, id, { environmentFromArn: attrs.loadBalancerArn });
  }

  public readonly metrics: INetworkLoadBalancerMetrics;
  public readonly ipAddressType?: IpAddressType;
  public readonly connections: ec2.Connections;
  private readonly isSecurityGroupsPropertyDefined: boolean;
  private readonly _enforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: boolean;
  private enablePrefixForIpv6SourceNat?: boolean;

  /**
   * After the implementation of `IConnectable` (see https://github.com/aws/aws-cdk/pull/28494), the default
   * value for `securityGroups` is set by the `ec2.Connections` constructor to an empty array.
   * To keep backward compatibility (`securityGroups` is `undefined` if the related property is not specified)
   * a getter has been added.
   */
  public get securityGroups(): string[] | undefined {
    return this.isSecurityGroupsPropertyDefined || this.connections.securityGroups.length
      ? this.connections.securityGroups.map(sg => sg.securityGroupId)
      : undefined;
  }

  constructor(scope: Construct, id: string, props: NetworkLoadBalancerProps) {
    super(scope, id, props, {
      type: 'network',
      securityGroups: Lazy.list({ produce: () => this.securityGroups }),
      ipAddressType: props.ipAddressType,
      enforceSecurityGroupInboundRulesOnPrivateLinkTraffic: Lazy.string({
        produce: () => this.enforceSecurityGroupInboundRulesOnPrivateLinkTraffic,
      }),
      enablePrefixForIpv6SourceNat: props.enablePrefixForIpv6SourceNat === true ? 'on': props.enablePrefixForIpv6SourceNat === false ? 'off' : undefined,
    });

    this.enablePrefixForIpv6SourceNat = props.enablePrefixForIpv6SourceNat;
    this.metrics = new NetworkLoadBalancerMetrics(this, this.loadBalancerFullName);
    this.isSecurityGroupsPropertyDefined = !!props.securityGroups;
    this.connections = new ec2.Connections({ securityGroups: props.securityGroups });
    this.ipAddressType = props.ipAddressType ?? IpAddressType.IPV4;
    if (props.clientRoutingPolicy) {
      this.setAttribute('dns_record.client_routing_policy', props.clientRoutingPolicy);
    }
    if (props.zonalShift !== undefined) {
      this.setAttribute('zonal_shift.config.enabled', props.zonalShift ? 'true' : 'false');
    }
    this._enforceSecurityGroupInboundRulesOnPrivateLinkTraffic = props.enforceSecurityGroupInboundRulesOnPrivateLinkTraffic;
  }

  public get enforceSecurityGroupInboundRulesOnPrivateLinkTraffic(): string | undefined {
    if (this._enforceSecurityGroupInboundRulesOnPrivateLinkTraffic === undefined) return undefined;
    return this._enforceSecurityGroupInboundRulesOnPrivateLinkTraffic ? 'on' : 'off';
  }

  /**
   * Add a listener to this load balancer
   *
   * @returns The newly created listener
   */
  public addListener(id: string, props: BaseNetworkListenerProps): NetworkListener {
    // UDP listener with dual stack NLB requires prefix IPv6 source NAT to be enabled
    if (
      (props.protocol === Protocol.UDP || props.protocol === Protocol.TCP_UDP) &&
      (this.ipAddressType === IpAddressType.DUAL_STACK || this.ipAddressType === IpAddressType.DUAL_STACK_WITHOUT_PUBLIC_IPV4) &&
      this.enablePrefixForIpv6SourceNat !== true
    ) {
      throw new Error('To add a listener with UDP protocol to a dual stack NLB, \'enablePrefixForIpv6SourceNat\' must be set to true.');
    }
    return new NetworkListener(this, id, {
      loadBalancer: this,
      ...props,
    });
  }

  /**
   * Add a security group to this load balancer
   */
  public addSecurityGroup(securityGroup: ec2.ISecurityGroup) {
    this.connections.addSecurityGroup(securityGroup);
  }

  /**
   * Return the given named metric for this Network Load Balancer
   *
   * @default Average over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.custom`` instead
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/NetworkELB',
      metricName,
      dimensions: { LoadBalancer: this.loadBalancerFullName },
      ...props,
    }).attachTo(this);
  }

  /**
   * The total number of concurrent TCP flows (or connections) from clients to targets.
   *
   * This metric includes connections in the SYN_SENT and ESTABLISHED states.
   * TCP connections are not terminated at the load balancer, so a client
   * opening a TCP connection to a target counts as a single flow.
   *
   * @default Average over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.activeFlowCount`` instead
   */
  public metricActiveFlowCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.activeFlowCount(props);
  }

  /**
   * The number of load balancer capacity units (LCU) used by your load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.activeFlowCount`` instead
   */
  public metricConsumedLCUs(props?: cloudwatch.MetricOptions) {
    return this.metrics.consumedLCUs(props);
  }

  /**
   * The number of targets that are considered healthy.
   *
   * @default Average over 5 minutes
   * @deprecated use ``NetworkTargetGroup.metricHealthyHostCount`` instead
   */
  public metricHealthyHostCount(props?: cloudwatch.MetricOptions) {
    return this.metric('HealthyHostCount', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * The number of targets that are considered unhealthy.
   *
   * @default Average over 5 minutes
   * @deprecated use ``NetworkTargetGroup.metricUnHealthyHostCount`` instead
   */
  public metricUnHealthyHostCount(props?: cloudwatch.MetricOptions) {
    return this.metric('UnHealthyHostCount', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * The total number of new TCP flows (or connections) established from clients to targets in the time period.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.newFlowCount`` instead
   */
  public metricNewFlowCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.newFlowCount(props);
  }

  /**
   * The total number of bytes processed by the load balancer, including TCP/IP headers.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.processedBytes`` instead
   */
  public metricProcessedBytes(props?: cloudwatch.MetricOptions) {
    return this.metrics.processedBytes(props);
  }

  /**
   * The total number of reset (RST) packets sent from a client to a target.
   *
   * These resets are generated by the client and forwarded by the load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.tcpClientResetCount`` instead
   */
  public metricTcpClientResetCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.tcpClientResetCount(props);
  }

  /**
   * The total number of reset (RST) packets generated by the load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.tcpElbResetCount`` instead
   */
  public metricTcpElbResetCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.tcpElbResetCount(props);
  }

  /**
   * The total number of reset (RST) packets sent from a target to a client.
   *
   * These resets are generated by the target and forwarded by the load balancer.
   *
   * @default Sum over 5 minutes
   * @deprecated Use ``NetworkLoadBalancer.metrics.tcpTargetResetCount`` instead
   */
  public metricTcpTargetResetCount(props?: cloudwatch.MetricOptions) {
    return this.metrics.tcpTargetResetCount(props);
  }
}

/**
 * Contains all metrics for a Network Load Balancer.
 */
export interface INetworkLoadBalancerMetrics {

  /**
   * Return the given named metric for this Network Load Balancer
   *
   * @default Average over 5 minutes
   */
  custom(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of concurrent TCP flows (or connections) from clients to targets.
   *
   * This metric includes connections in the SYN_SENT and ESTABLISHED states.
   * TCP connections are not terminated at the load balancer, so a client
   * opening a TCP connection to a target counts as a single flow.
   *
   * @default Average over 5 minutes
   */
  activeFlowCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of load balancer capacity units (LCU) used by your load balancer.
   *
   * @default Sum over 5 minutes
   */
  consumedLCUs(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of new TCP flows (or connections) established from clients to targets in the time period.
   *
   * @default Sum over 5 minutes
   */
  newFlowCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of bytes processed by the load balancer, including TCP/IP headers.
   *
   * @default Sum over 5 minutes
   */
  processedBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of reset (RST) packets sent from a client to a target.
   *
   * These resets are generated by the client and forwarded by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  tcpClientResetCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of reset (RST) packets generated by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  tcpElbResetCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of reset (RST) packets sent from a target to a client.
   *
   * These resets are generated by the target and forwarded by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  tcpTargetResetCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * A network load balancer
 */
export interface INetworkLoadBalancer extends ILoadBalancerV2, ec2.IVpcEndpointServiceLoadBalancer, ec2.IConnectable {

  /**
   * The VPC this load balancer has been created in (if available)
   */
  readonly vpc?: ec2.IVpc;

  /**
   * All metrics available for this load balancer
   */
  readonly metrics: INetworkLoadBalancerMetrics;

  /**
   * Security groups associated with this load balancer
   */
  readonly securityGroups?: string[];

  /**
   * The type of IP addresses to use
   *
   * @default IpAddressType.IPV4
   */
  readonly ipAddressType?: IpAddressType;

  /**
   * Indicates whether to evaluate inbound security group rules for traffic sent to a Network Load Balancer through AWS PrivateLink
   *
   * @default on
   */
  readonly enforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: string;

  /**
   * Add a listener to this load balancer
   *
   * @returns The newly created listener
   */
  addListener(id: string, props: BaseNetworkListenerProps): NetworkListener;
}

class LookedUpNetworkLoadBalancer extends Resource implements INetworkLoadBalancer {
  public readonly loadBalancerCanonicalHostedZoneId: string;
  public readonly loadBalancerDnsName: string;
  public readonly loadBalancerArn: string;
  public readonly vpc?: ec2.IVpc;
  public readonly metrics: INetworkLoadBalancerMetrics;
  public readonly securityGroups?: string[];
  public readonly ipAddressType?: IpAddressType;
  public readonly connections: ec2.Connections;

  constructor(scope: Construct, id: string, props: cxapi.LoadBalancerContextResponse) {
    super(scope, id, { environmentFromArn: props.loadBalancerArn });

    this.loadBalancerArn = props.loadBalancerArn;
    this.loadBalancerCanonicalHostedZoneId = props.loadBalancerCanonicalHostedZoneId;
    this.loadBalancerDnsName = props.loadBalancerDnsName;
    this.metrics = new NetworkLoadBalancerMetrics(this, parseLoadBalancerFullName(props.loadBalancerArn));
    this.securityGroups = props.securityGroupIds;
    this.connections = new ec2.Connections({
      securityGroups: props.securityGroupIds.map(
        (securityGroupId, index) => ec2.SecurityGroup.fromLookupById(this, `SecurityGroup-${index}`, securityGroupId),
      ),
    });

    if (props.ipAddressType === cxapi.LoadBalancerIpAddressType.IPV4) {
      this.ipAddressType = IpAddressType.IPV4;
    } else if (props.ipAddressType === cxapi.LoadBalancerIpAddressType.DUAL_STACK) {
      this.ipAddressType = IpAddressType.DUAL_STACK;
    }

    this.vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      vpcId: props.vpcId,
    });
  }

  public addListener(lid: string, props: BaseNetworkListenerProps): NetworkListener {
    return new NetworkListener(this, lid, {
      loadBalancer: this,
      ...props,
    });
  }
}

import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct, Resource } from '@aws-cdk/core';
import { BaseLoadBalancer, BaseLoadBalancerProps, ILoadBalancerV2 } from '../shared/base-load-balancer';
import { BaseNetworkListenerProps, NetworkListener } from './network-listener';

/**
 * Properties for a network load balancer
 */
export interface NetworkLoadBalancerProps extends BaseLoadBalancerProps {
  /**
   * Indicates whether cross-zone load balancing is enabled.
   *
   * @default false
   */
  readonly crossZoneEnabled?: boolean;
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
}

/**
 * Define a new network load balancer
 *
 * @resource AWS::ElasticLoadBalancingV2::LoadBalancer
 */
export class NetworkLoadBalancer extends BaseLoadBalancer implements INetworkLoadBalancer {
  public static fromNetworkLoadBalancerAttributes(scope: Construct, id: string, attrs: NetworkLoadBalancerAttributes): INetworkLoadBalancer {
    class Import extends Resource implements INetworkLoadBalancer {
      public readonly loadBalancerArn = attrs.loadBalancerArn;
      public readonly vpc?: ec2.IVpc = undefined;
      public addListener(lid: string, props: BaseNetworkListenerProps): NetworkListener {
        return new NetworkListener(this, lid, {
          loadBalancer: this,
          ...props
        });
      }

      public get loadBalancerCanonicalHostedZoneId(): string {
        if (attrs.loadBalancerCanonicalHostedZoneId) { return attrs.loadBalancerCanonicalHostedZoneId; }
        // tslint:disable-next-line:max-line-length
        throw new Error(`'loadBalancerCanonicalHostedZoneId' was not provided when constructing Network Load Balancer ${this.node.path} from attributes`);
      }

      public get loadBalancerDnsName(): string {
        if (attrs.loadBalancerDnsName) { return attrs.loadBalancerDnsName; }
        // tslint:disable-next-line:max-line-length
        throw new Error(`'loadBalancerDnsName' was not provided when constructing Network Load Balancer ${this.node.path} from attributes`);
      }
    }

    return new Import(scope, id);
  }

  constructor(scope: Construct, id: string, props: NetworkLoadBalancerProps) {
    super(scope, id, props, {
      type: "network",
    });

    if (props.crossZoneEnabled) { this.setAttribute('load_balancing.cross_zone.enabled', 'true'); }
  }

  /**
   * Add a listener to this load balancer
   *
   * @returns The newly created listener
   */
  public addListener(id: string, props: BaseNetworkListenerProps): NetworkListener {
    return new NetworkListener(this, id, {
      loadBalancer: this,
      ...props
    });
  }

  /**
   * Return the given named metric for this Network Load Balancer
   *
   * @default Average over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/NetworkELB',
      metricName,
      dimensions: { LoadBalancer: this.loadBalancerFullName },
      ...props
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
   */
  public metricActiveFlowCount(props?: cloudwatch.MetricOptions) {
    return this.metric('ActiveFlowCount', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The number of load balancer capacity units (LCU) used by your load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricConsumedLCUs(props?: cloudwatch.MetricOptions) {
    return this.metric('ConsumedLCUs', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of targets that are considered healthy.
   *
   * @default Average over 5 minutes
   */
  public metricHealthyHostCount(props?: cloudwatch.MetricOptions) {
    return this.metric('HealthyHostCount', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The number of targets that are considered unhealthy.
   *
   * @default Average over 5 minutes
   */
  public metricUnHealthyHostCount(props?: cloudwatch.MetricOptions) {
    return this.metric('UnHealthyHostCount', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The total number of new TCP flows (or connections) established from clients to targets in the time period.
   *
   * @default Sum over 5 minutes
   */
  public metricNewFlowCount(props?: cloudwatch.MetricOptions) {
    return this.metric('NewFlowCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The total number of bytes processed by the load balancer, including TCP/IP headers.
   *
   * @default Sum over 5 minutes
   */
  public metricProcessedBytes(props?: cloudwatch.MetricOptions) {
    return this.metric('ProcessedBytes', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The total number of reset (RST) packets sent from a client to a target.
   *
   * These resets are generated by the client and forwarded by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricTcpClientResetCount(props?: cloudwatch.MetricOptions) {
    return this.metric('TCP_Client_Reset_Count', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The total number of reset (RST) packets generated by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricTcpElbResetCount(props?: cloudwatch.MetricOptions) {
    return this.metric('TCP_ELB_Reset_Count', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The total number of reset (RST) packets sent from a target to a client.
   *
   * These resets are generated by the target and forwarded by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricTcpTargetResetCount(props?: cloudwatch.MetricOptions) {
    return this.metric('TCP_Target_Reset_Count', {
      statistic: 'Sum',
      ...props
    });
  }
}

/**
 * A network load balancer
 */
export interface INetworkLoadBalancer extends ILoadBalancerV2, ec2.IVpcEndpointServiceLoadBalancer {

  /**
   * The VPC this load balancer has been created in (if available)
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Add a listener to this load balancer
   *
   * @returns The newly created listener
   */
  addListener(id: string, props: BaseNetworkListenerProps): NetworkListener;
}

import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseLoadBalancer, BaseLoadBalancerProps } from '../shared/base-load-balancer';
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
  crossZoneEnabled?: boolean;
}

/**
 * Define a new network load balancer
 */
export class NetworkLoadBalancer extends BaseLoadBalancer implements INetworkLoadBalancer {
  public static import(parent: cdk.Construct, id: string, props: NetworkLoadBalancerRefProps): INetworkLoadBalancer {
    return new ImportedNetworkLoadBalancer(parent, id, props);
  }

  constructor(parent: cdk.Construct, id: string, props: NetworkLoadBalancerProps) {
    super(parent, id, props, {
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
   * Export this load balancer
   */
  public export(): NetworkLoadBalancerRefProps {
    return {
      loadBalancerArn: new cdk.Output(this, 'LoadBalancerArn', { value: this.loadBalancerArn }).makeImportValue().toString()
    };
  }
}

/**
 * A network load balancer
 */
export interface INetworkLoadBalancer {
  /**
   * The ARN of this load balancer
   */
  readonly loadBalancerArn: string;

  /**
   * The VPC this load balancer has been created in (if available)
   */
  readonly vpc?: ec2.VpcNetworkRef;

  /**
   * Add a listener to this load balancer
   *
   * @returns The newly created listener
   */
  addListener(id: string, props: BaseNetworkListenerProps): NetworkListener;
}

/**
 * Properties to reference an existing load balancer
 */
export interface NetworkLoadBalancerRefProps {
  /**
   * ARN of the load balancer
   */
  loadBalancerArn: string;
}

/**
 * An imported network load balancer
 */
class ImportedNetworkLoadBalancer extends cdk.Construct implements INetworkLoadBalancer {
  /**
   * ARN of the load balancer
   */
  public readonly loadBalancerArn: string;

  /**
   * VPC of the load balancer
   *
   * Always undefined.
   */
  public readonly vpc?: ec2.VpcNetworkRef;

  constructor(parent: cdk.Construct, id: string, props: NetworkLoadBalancerRefProps) {
    super(parent, id);

    this.loadBalancerArn = props.loadBalancerArn;
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
}

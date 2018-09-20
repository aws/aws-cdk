import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseLoadBalancer, BaseLoadBalancerProps, LoadBalancerRefProps } from '../shared/base-load-balancer';
import { BaseImportedLoadBalancer } from '../shared/imported';
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
    public static import(parent: cdk.Construct, id: string, props: LoadBalancerRefProps): INetworkLoadBalancer {
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
 * An imported network load balancer
 */
class ImportedNetworkLoadBalancer extends BaseImportedLoadBalancer implements INetworkLoadBalancer {
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
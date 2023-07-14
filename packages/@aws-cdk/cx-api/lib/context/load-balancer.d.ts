/**
 * Load balancer ip address type.
 */
export declare enum LoadBalancerIpAddressType {
    /**
     * IPV4 ip address
     */
    IPV4 = "ipv4",
    /**
     * Dual stack address
     */
    DUAL_STACK = "dualstack"
}
/**
 * Properties of a discovered load balancer
 */
export interface LoadBalancerContextResponse {
    /**
     * The ARN of the load balancer.
     */
    readonly loadBalancerArn: string;
    /**
     * The hosted zone ID of the load balancer's name.
     */
    readonly loadBalancerCanonicalHostedZoneId: string;
    /**
     * Load balancer's DNS name
     */
    readonly loadBalancerDnsName: string;
    /**
     * Type of IP address
     */
    readonly ipAddressType: LoadBalancerIpAddressType;
    /**
     * Load balancer's security groups
     */
    readonly securityGroupIds: string[];
    /**
     * Load balancer's VPC
     */
    readonly vpcId: string;
}
/**
 * Properties of a discovered load balancer listener.
 */
export interface LoadBalancerListenerContextResponse {
    /**
     * The ARN of the listener.
     */
    readonly listenerArn: string;
    /**
     * The port the listener is listening on.
     */
    readonly listenerPort: number;
    /**
     * The security groups of the load balancer.
     */
    readonly securityGroupIds: string[];
}

import { Connections, IConnectable, ISecurityGroup, IVpc, Port, SubnetSelection } from '@aws-cdk/aws-ec2';
import { Duration, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnLoadBalancer } from './elasticloadbalancing.generated';
/**
 * Construction properties for a LoadBalancer
 */
export interface LoadBalancerProps {
    /**
     * VPC network of the fleet instances
     */
    readonly vpc: IVpc;
    /**
     * Whether this is an internet-facing Load Balancer
     *
     * This controls whether the LB has a public IP address assigned. It does
     * not open up the Load Balancer's security groups to public internet access.
     *
     * @default false
     */
    readonly internetFacing?: boolean;
    /**
     * What listeners to set up for the load balancer.
     *
     * Can also be added by .addListener()
     *
     * @default -
     */
    readonly listeners?: LoadBalancerListener[];
    /**
     * What targets to load balance to.
     *
     * Can also be added by .addTarget()
     *
     * @default - None.
     */
    readonly targets?: ILoadBalancerTarget[];
    /**
     * Health check settings for the load balancing targets.
     *
     * Not required but recommended.
     *
     * @default - None.
     */
    readonly healthCheck?: HealthCheck;
    /**
     * Whether cross zone load balancing is enabled
     *
     * This controls whether the load balancer evenly distributes requests
     * across each availability zone
     *
     * @default true
     */
    readonly crossZone?: boolean;
    /**
     * Which subnets to deploy the load balancer
     *
     * Can be used to define a specific set of subnets to deploy the load balancer to.
     * Useful multiple public or private subnets are covering the same availability zone.
     *
     * @default - Public subnets if internetFacing, Private subnets otherwise
     */
    readonly subnetSelection?: SubnetSelection;
    /**
     * Enable Loadbalancer access logs
     * Can be used to avoid manual work as aws console
     * Required S3 bucket name , enabled flag
     * Can add interval for pushing log
     * Can set bucket prefix in order to provide folder name inside bucket
     * @default - disabled
     */
    readonly accessLoggingPolicy?: CfnLoadBalancer.AccessLoggingPolicyProperty;
}
/**
 * Describe the health check to a load balancer
 */
export interface HealthCheck {
    /**
     * What port number to health check on
     */
    readonly port: number;
    /**
     * What protocol to use for health checking
     *
     * The protocol is automatically determined from the port if it's not supplied.
     *
     * @default Automatic
     */
    readonly protocol?: LoadBalancingProtocol;
    /**
     * What path to use for HTTP or HTTPS health check (must return 200)
     *
     * For SSL and TCP health checks, accepting connections is enough to be considered
     * healthy.
     *
     * @default "/"
     */
    readonly path?: string;
    /**
     * After how many successful checks is an instance considered healthy
     *
     * @default 2
     */
    readonly healthyThreshold?: number;
    /**
     * After how many unsuccessful checks is an instance considered unhealthy
     *
     * @default 5
     */
    readonly unhealthyThreshold?: number;
    /**
     * Number of seconds between health checks
     *
     * @default Duration.seconds(30)
     */
    readonly interval?: Duration;
    /**
     * Health check timeout
     *
     * @default Duration.seconds(5)
     */
    readonly timeout?: Duration;
}
/**
 * Interface that is going to be implemented by constructs that you can load balance to
 */
export interface ILoadBalancerTarget extends IConnectable {
    /**
     * Attach load-balanced target to a classic ELB
     * @param loadBalancer [disable-awslint:ref-via-interface] The load balancer to attach the target to
     */
    attachToClassicLB(loadBalancer: LoadBalancer): void;
}
/**
 * Add a backend to the load balancer
 */
export interface LoadBalancerListener {
    /**
     * External listening port
     */
    readonly externalPort: number;
    /**
     * What public protocol to use for load balancing
     *
     * Either 'tcp', 'ssl', 'http' or 'https'.
     *
     * May be omitted if the external port is either 80 or 443.
     */
    readonly externalProtocol?: LoadBalancingProtocol;
    /**
     * Instance listening port
     *
     * Same as the externalPort if not specified.
     *
     * @default externalPort
     */
    readonly internalPort?: number;
    /**
     * What public protocol to use for load balancing
     *
     * Either 'tcp', 'ssl', 'http' or 'https'.
     *
     * May be omitted if the internal port is either 80 or 443.
     *
     * The instance protocol is 'tcp' if the front-end protocol
     * is 'tcp' or 'ssl', the instance protocol is 'http' if the
     * front-end protocol is 'https'.
     */
    readonly internalProtocol?: LoadBalancingProtocol;
    /**
     * SSL policy names
     */
    readonly policyNames?: string[];
    /**
     * the ARN of the SSL certificate
     * @deprecated - use sslCertificateArn instead
     */
    readonly sslCertificateId?: string;
    /**
     * the ARN of the SSL certificate
     *
     * @default - none
     */
    readonly sslCertificateArn?: string;
    /**
     * Allow connections to the load balancer from the given set of connection peers
     *
     * By default, connections will be allowed from anywhere. Set this to an empty list
     * to deny connections, or supply a custom list of peers to allow connections from
     * (IP ranges or security groups).
     *
     * @default Anywhere
     */
    readonly allowConnectionsFrom?: IConnectable[];
}
export declare enum LoadBalancingProtocol {
    TCP = "tcp",
    SSL = "ssl",
    HTTP = "http",
    HTTPS = "https"
}
/**
 * A load balancer with a single listener
 *
 * Routes to a fleet of of instances in a VPC.
 */
export declare class LoadBalancer extends Resource implements IConnectable {
    /**
     * Control all connections from and to this load balancer
     */
    readonly connections: Connections;
    /**
     * An object controlling specifically the connections for each listener added to this load balancer
     */
    readonly listenerPorts: ListenerPort[];
    private readonly elb;
    private readonly securityGroup;
    private readonly listeners;
    private readonly instancePorts;
    private readonly targets;
    constructor(scope: Construct, id: string, props: LoadBalancerProps);
    /**
     * Add a backend to the load balancer
     *
     * @returns A ListenerPort object that controls connections to the listener port
     */
    addListener(listener: LoadBalancerListener): ListenerPort;
    addTarget(target: ILoadBalancerTarget): void;
    /**
     * @attribute
     */
    get loadBalancerName(): string;
    /**
     * @attribute
     */
    get loadBalancerCanonicalHostedZoneNameId(): string;
    /**
     * @attribute
     */
    get loadBalancerCanonicalHostedZoneName(): string;
    /**
     * @attribute
     */
    get loadBalancerDnsName(): string;
    /**
     * @attribute
     */
    get loadBalancerSourceSecurityGroupGroupName(): string;
    /**
     * @attribute
     */
    get loadBalancerSourceSecurityGroupOwnerAlias(): string;
    /**
     * Allow connections to all existing targets on new instance port
     */
    private newInstancePort;
    /**
     * Allow connections to target on all existing instance ports
     */
    private newTarget;
    /**
     * Allow connections for a single (port, target) pair
     */
    private allowTargetConnection;
}
/**
 * Reference to a listener's port just created.
 *
 * This implements IConnectable with a default port (the port that an ELB
 * listener was just created on) for a given security group so that it can be
 * conveniently used just like any Connectable. E.g:
 *
 *    const listener = elb.addListener(...);
 *
 *    listener.connections.allowDefaultPortFromAnyIPv4();
 *    // or
 *    instance.connections.allowToDefaultPort(listener);
 */
export declare class ListenerPort implements IConnectable {
    readonly connections: Connections;
    constructor(securityGroup: ISecurityGroup, defaultPort: Port);
}

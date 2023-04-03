import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { NetworkListenerAction } from './network-listener-action';
import { INetworkLoadBalancer } from './network-load-balancer';
import { INetworkLoadBalancerTarget, INetworkTargetGroup, NetworkTargetGroup } from './network-target-group';
import { BaseListener, BaseListenerLookupOptions, IListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { AlpnPolicy, Protocol, SslPolicy } from '../shared/enums';
import { IListenerCertificate } from '../shared/listener-certificate';
/**
 * Basic properties for a Network Listener
 */
export interface BaseNetworkListenerProps {
    /**
     * The port on which the listener listens for requests.
     */
    readonly port: number;
    /**
     * Default target groups to load balance to
     *
     * All target groups will be load balanced to with equal weight and without
     * stickiness. For a more complex configuration than that, use
     * either `defaultAction` or `addAction()`.
     *
     * Cannot be specified together with `defaultAction`.
     *
     * @default - None.
     */
    readonly defaultTargetGroups?: INetworkTargetGroup[];
    /**
     * Default action to take for requests to this listener
     *
     * This allows full control of the default Action of the load balancer,
     * including weighted forwarding. See the `NetworkListenerAction` class for
     * all options.
     *
     * Cannot be specified together with `defaultTargetGroups`.
     *
     * @default - None.
     */
    readonly defaultAction?: NetworkListenerAction;
    /**
     * Protocol for listener, expects TCP, TLS, UDP, or TCP_UDP.
     *
     * @default - TLS if certificates are provided. TCP otherwise.
     */
    readonly protocol?: Protocol;
    /**
     * Certificate list of ACM cert ARNs. You must provide exactly one certificate if the listener protocol is HTTPS or TLS.
     *
     * @default - No certificates.
     */
    readonly certificates?: IListenerCertificate[];
    /**
     * SSL Policy
     *
     * @default - Current predefined security policy.
     */
    readonly sslPolicy?: SslPolicy;
    /**
     * Application-Layer Protocol Negotiation (ALPN) is a TLS extension that is sent on the initial TLS handshake hello messages.
     * ALPN enables the application layer to negotiate which protocols should be used over a secure connection, such as HTTP/1 and HTTP/2.
     *
     * Can only be specified together with Protocol TLS.
     *
     * @default - None
     */
    readonly alpnPolicy?: AlpnPolicy;
}
/**
 * Properties for adding a certificate to a listener
 *
 * This interface exists for backwards compatibility.
 *
 * @deprecated Use IListenerCertificate instead
 */
export interface INetworkListenerCertificateProps extends IListenerCertificate {
}
/**
 * Properties for a Network Listener attached to a Load Balancer
 */
export interface NetworkListenerProps extends BaseNetworkListenerProps {
    /**
     * The load balancer to attach this listener to
     */
    readonly loadBalancer: INetworkLoadBalancer;
}
/**
 * Options for looking up a network listener.
 */
export interface NetworkListenerLookupOptions extends BaseListenerLookupOptions {
    /**
     * Protocol of the listener port
     * @default - listener is not filtered by protocol
     */
    readonly listenerProtocol?: Protocol;
}
/**
 * Define a Network Listener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
export declare class NetworkListener extends BaseListener implements INetworkListener {
    /**
     * Looks up a network listener
     */
    static fromLookup(scope: Construct, id: string, options: NetworkListenerLookupOptions): INetworkListener;
    /**
     * Import an existing listener
     */
    static fromNetworkListenerArn(scope: Construct, id: string, networkListenerArn: string): INetworkListener;
    /**
     * The load balancer this listener is attached to
     */
    readonly loadBalancer: INetworkLoadBalancer;
    /**
     * ARNs of certificates added to this listener
     */
    private readonly certificateArns;
    /**
     * the protocol of the listener
     */
    private readonly protocol;
    constructor(scope: Construct, id: string, props: NetworkListenerProps);
    /**
     * Add one or more certificates to this listener.
     *
     * After the first certificate, this creates NetworkListenerCertificates
     * resources since cloudformation requires the certificates array on the
     * listener resource to have a length of 1.
     */
    addCertificates(id: string, certificates: IListenerCertificate[]): void;
    /**
     * Load balance incoming requests to the given target groups.
     *
     * All target groups will be load balanced to with equal weight and without
     * stickiness. For a more complex configuration than that, use `addAction()`.
     */
    addTargetGroups(_id: string, ...targetGroups: INetworkTargetGroup[]): void;
    /**
     * Perform the given Action on incoming requests
     *
     * This allows full control of the default Action of the load balancer,
     * including weighted forwarding. See the `NetworkListenerAction` class for
     * all options.
     */
    addAction(_id: string, props: AddNetworkActionProps): void;
    /**
     * Load balance incoming requests to the given load balancing targets.
     *
     * This method implicitly creates a NetworkTargetGroup for the targets
     * involved, and a 'forward' action to route traffic to the given TargetGroup.
     *
     * If you want more control over the precise setup, create the TargetGroup
     * and use `addAction` yourself.
     *
     * It's possible to add conditions to the targets added in this way. At least
     * one set of targets must be added without conditions.
     *
     * @returns The newly created target group
     */
    addTargets(id: string, props: AddNetworkTargetsProps): NetworkTargetGroup;
    /**
     * Wrapper for _setDefaultAction which does a type-safe bind
     */
    private setDefaultAction;
}
/**
 * Properties to reference an existing listener
 */
export interface INetworkListener extends IListener {
}
/**
 * Properties for adding a new action to a listener
 */
export interface AddNetworkActionProps {
    /**
     * Action to perform
     */
    readonly action: NetworkListenerAction;
}
/**
 * Properties for adding new network targets to a listener
 */
export interface AddNetworkTargetsProps {
    /**
     * The port on which the listener listens for requests.
     *
     * @default Determined from protocol if known
     */
    readonly port: number;
    /**
     * Protocol for target group, expects TCP, TLS, UDP, or TCP_UDP.
     *
     * @default - inherits the protocol of the listener
     */
    readonly protocol?: Protocol;
    /**
     * The targets to add to this target group.
     *
     * Can be `Instance`, `IPAddress`, or any self-registering load balancing
     * target. If you use either `Instance` or `IPAddress` as targets, all
     * target must be of the same type.
     */
    readonly targets?: INetworkLoadBalancerTarget[];
    /**
     * The name of the target group.
     *
     * This name must be unique per region per account, can have a maximum of
     * 32 characters, must contain only alphanumeric characters or hyphens, and
     * must not begin or end with a hyphen.
     *
     * @default Automatically generated
     */
    readonly targetGroupName?: string;
    /**
     * The amount of time for Elastic Load Balancing to wait before deregistering a target.
     *
     * The range is 0-3600 seconds.
     *
     * @default Duration.minutes(5)
     */
    readonly deregistrationDelay?: Duration;
    /**
     * Indicates whether Proxy Protocol version 2 is enabled.
     *
     * @default false
     */
    readonly proxyProtocolV2?: boolean;
    /**
     * Indicates whether client IP preservation is enabled.
     *
     * @default false if the target group type is IP address and the
     * target group protocol is TCP or TLS. Otherwise, true.
     */
    readonly preserveClientIp?: boolean;
    /**
     * Health check configuration
     *
     * @default - The default value for each property in this configuration varies depending on the target.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#aws-resource-elasticloadbalancingv2-targetgroup-properties
     */
    readonly healthCheck?: HealthCheck;
}

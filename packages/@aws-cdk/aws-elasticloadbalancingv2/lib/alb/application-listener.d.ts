import * as ec2 from '@aws-cdk/aws-ec2';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ListenerAction } from './application-listener-action';
import { FixedResponse, RedirectResponse } from './application-listener-rule';
import { IApplicationLoadBalancer } from './application-load-balancer';
import { ApplicationTargetGroup, IApplicationLoadBalancerTarget, IApplicationTargetGroup } from './application-target-group';
import { ListenerCondition } from './conditions';
import { BaseListener, BaseListenerLookupOptions, IListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { ApplicationProtocol, ApplicationProtocolVersion, TargetGroupLoadBalancingAlgorithmType, SslPolicy } from '../shared/enums';
import { IListenerCertificate } from '../shared/listener-certificate';
/**
 * Basic properties for an ApplicationListener
 */
export interface BaseApplicationListenerProps {
    /**
     * The protocol to use
     *
     * @default - Determined from port if known.
     */
    readonly protocol?: ApplicationProtocol;
    /**
     * The port on which the listener listens for requests.
     *
     * @default - Determined from protocol if known.
     */
    readonly port?: number;
    /**
     * The certificates to use on this listener
     *
     * @default - No certificates.
     * @deprecated Use the `certificates` property instead
     */
    readonly certificateArns?: string[];
    /**
     * Certificate list of ACM cert ARNs. You must provide exactly one certificate if the listener protocol is HTTPS or TLS.
     *
     * @default - No certificates.
     */
    readonly certificates?: IListenerCertificate[];
    /**
     * The security policy that defines which ciphers and protocols are supported.
     *
     * @default - The current predefined security policy.
     */
    readonly sslPolicy?: SslPolicy;
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
    readonly defaultTargetGroups?: IApplicationTargetGroup[];
    /**
     * Default action to take for requests to this listener
     *
     * This allows full control of the default action of the load balancer,
     * including Action chaining, fixed responses and redirect responses.
     *
     * See the `ListenerAction` class for all options.
     *
     * Cannot be specified together with `defaultTargetGroups`.
     *
     * @default - None.
     */
    readonly defaultAction?: ListenerAction;
    /**
     * Allow anyone to connect to the load balancer on the listener port
     *
     * If this is specified, the load balancer will be opened up to anyone who can reach it.
     * For internal load balancers this is anyone in the same VPC. For public load
     * balancers, this is anyone on the internet.
     *
     * If you want to be more selective about who can access this load
     * balancer, set this to `false` and use the listener's `connections`
     * object to selectively grant access to the load balancer on the listener port.
     *
     * @default true
     */
    readonly open?: boolean;
}
/**
 * Properties for defining a standalone ApplicationListener
 */
export interface ApplicationListenerProps extends BaseApplicationListenerProps {
    /**
     * The load balancer to attach this listener to
     */
    readonly loadBalancer: IApplicationLoadBalancer;
}
/**
 * Options for ApplicationListener lookup
 */
export interface ApplicationListenerLookupOptions extends BaseListenerLookupOptions {
    /**
     * ARN of the listener to look up
     * @default - does not filter by listener arn
     */
    readonly listenerArn?: string;
    /**
     * Filter listeners by listener protocol
     * @default - does not filter by listener protocol
     */
    readonly listenerProtocol?: ApplicationProtocol;
}
/**
 * Define an ApplicationListener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
export declare class ApplicationListener extends BaseListener implements IApplicationListener {
    /**
     * Look up an ApplicationListener.
     */
    static fromLookup(scope: Construct, id: string, options: ApplicationListenerLookupOptions): IApplicationListener;
    /**
     * Import an existing listener
     */
    static fromApplicationListenerAttributes(scope: Construct, id: string, attrs: ApplicationListenerAttributes): IApplicationListener;
    /**
     * Manage connections to this ApplicationListener
     */
    readonly connections: ec2.Connections;
    /**
     * Load balancer this listener is associated with
     */
    readonly loadBalancer: IApplicationLoadBalancer;
    /**
     * ARNs of certificates added to this listener
     */
    private readonly certificateArns;
    /**
     * Listener protocol for this listener.
     */
    private readonly protocol;
    constructor(scope: Construct, id: string, props: ApplicationListenerProps);
    /**
     * Add one or more certificates to this listener.
     *
     * After the first certificate, this creates ApplicationListenerCertificates
     * resources since cloudformation requires the certificates array on the
     * listener resource to have a length of 1.
     *
     * @deprecated Use `addCertificates` instead.
     */
    addCertificateArns(id: string, arns: string[]): void;
    /**
     * Add one or more certificates to this listener.
     *
     * After the first certificate, this creates ApplicationListenerCertificates
     * resources since cloudformation requires the certificates array on the
     * listener resource to have a length of 1.
     */
    addCertificates(id: string, certificates: IListenerCertificate[]): void;
    /**
     * Perform the given default action on incoming requests
     *
     * This allows full control of the default action of the load balancer,
     * including Action chaining, fixed responses and redirect responses. See
     * the `ListenerAction` class for all options.
     *
     * It's possible to add routing conditions to the Action added in this way.
     * At least one Action must be added without conditions (which becomes the
     * default Action).
     */
    addAction(id: string, props: AddApplicationActionProps): void;
    /**
     * Load balance incoming requests to the given target groups.
     *
     * All target groups will be load balanced to with equal weight and without
     * stickiness. For a more complex configuration than that, use `addAction()`.
     *
     * It's possible to add routing conditions to the TargetGroups added in this
     * way. At least one TargetGroup must be added without conditions (which will
     * become the default Action for this listener).
     */
    addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void;
    /**
     * Load balance incoming requests to the given load balancing targets.
     *
     * This method implicitly creates an ApplicationTargetGroup for the targets
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
    addTargets(id: string, props: AddApplicationTargetsProps): ApplicationTargetGroup;
    /**
     * Add a fixed response
     *
     * @deprecated Use `addAction()` instead
     */
    addFixedResponse(id: string, props: AddFixedResponseProps): void;
    /**
     * Add a redirect response
     *
     * @deprecated Use `addAction()` instead
     */
    addRedirectResponse(id: string, props: AddRedirectResponseProps): void;
    /**
     * Register that a connectable that has been added to this load balancer.
     *
     * Don't call this directly. It is called by ApplicationTargetGroup.
     */
    registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void;
    /**
     * Validate this listener.
     */
    protected validateListener(): string[];
    /**
     * Wrapper for _setDefaultAction which does a type-safe bind
     */
    private setDefaultAction;
}
/**
 * Properties to reference an existing listener
 */
export interface IApplicationListener extends IListener, ec2.IConnectable {
    /**
     * Add one or more certificates to this listener.
     * @deprecated use `addCertificates()`
     */
    addCertificateArns(id: string, arns: string[]): void;
    /**
     * Add one or more certificates to this listener.
     */
    addCertificates(id: string, certificates: IListenerCertificate[]): void;
    /**
     * Load balance incoming requests to the given target groups.
     *
     * It's possible to add conditions to the TargetGroups added in this way.
     * At least one TargetGroup must be added without conditions.
     */
    addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void;
    /**
     * Load balance incoming requests to the given load balancing targets.
     *
     * This method implicitly creates an ApplicationTargetGroup for the targets
     * involved.
     *
     * It's possible to add conditions to the targets added in this way. At least
     * one set of targets must be added without conditions.
     *
     * @returns The newly created target group
     */
    addTargets(id: string, props: AddApplicationTargetsProps): ApplicationTargetGroup;
    /**
     * Register that a connectable that has been added to this load balancer.
     *
     * Don't call this directly. It is called by ApplicationTargetGroup.
     */
    registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void;
    /**
     * Perform the given action on incoming requests
     *
     * This allows full control of the default action of the load balancer,
     * including Action chaining, fixed responses and redirect responses. See
     * the `ListenerAction` class for all options.
     *
     * It's possible to add routing conditions to the Action added in this way.
     *
     * It is not possible to add a default action to an imported IApplicationListener.
     * In order to add actions to an imported IApplicationListener a `priority`
     * must be provided.
     */
    addAction(id: string, props: AddApplicationActionProps): void;
}
/**
 * Properties to reference an existing listener
 */
export interface ApplicationListenerAttributes {
    /**
     * ARN of the listener
     */
    readonly listenerArn: string;
    /**
     * Security group of the load balancer this listener is associated with
     */
    readonly securityGroup: ec2.ISecurityGroup;
    /**
     * The default port on which this listener is listening
     */
    readonly defaultPort?: number;
    /**
     * Whether the imported security group allows all outbound traffic or not when
     * imported using `securityGroupId`
     *
     * Unless set to `false`, no egress rules will be added to the security group.
     *
     * @default true
     *
     * @deprecated use `securityGroup` instead
     */
    readonly securityGroupAllowsAllOutbound?: boolean;
}
/**
 * Properties for adding a conditional load balancing rule
 */
export interface AddRuleProps {
    /**
     * Priority of this target group
     *
     * The rule with the lowest priority will be used for every request.
     * If priority is not given, these target groups will be added as
     * defaults, and must not have conditions.
     *
     * Priorities must be unique.
     *
     * @default Target groups are used as defaults
     */
    readonly priority?: number;
    /**
     * Rule applies if matches the conditions.
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html
     *
     * @default - No conditions.
     */
    readonly conditions?: ListenerCondition[];
    /**
     * Rule applies if the requested host matches the indicated host
     *
     * May contain up to three '*' wildcards.
     *
     * Requires that priority is set.
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#host-conditions
     *
     * @default No host condition
     * @deprecated Use `conditions` instead.
     */
    readonly hostHeader?: string;
    /**
     * Rule applies if the requested path matches the given path pattern
     *
     * May contain up to three '*' wildcards.
     *
     * Requires that priority is set.
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
     * @default No path condition
     * @deprecated Use `conditions` instead.
     */
    readonly pathPattern?: string;
    /**
     * Rule applies if the requested path matches any of the given patterns.
     *
     * May contain up to three '*' wildcards.
     *
     * Requires that priority is set.
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
     * @default - No path condition.
     * @deprecated Use `conditions` instead.
     */
    readonly pathPatterns?: string[];
}
/**
 * Properties for adding a new target group to a listener
 */
export interface AddApplicationTargetGroupsProps extends AddRuleProps {
    /**
     * Target groups to forward requests to
     */
    readonly targetGroups: IApplicationTargetGroup[];
}
/**
 * Properties for adding a new action to a listener
 */
export interface AddApplicationActionProps extends AddRuleProps {
    /**
     * Action to perform
     */
    readonly action: ListenerAction;
}
/**
 * Properties for adding new targets to a listener
 */
export interface AddApplicationTargetsProps extends AddRuleProps {
    /**
     * The protocol to use
     *
     * @default Determined from port if known
     */
    readonly protocol?: ApplicationProtocol;
    /**
     * The protocol version to use
     *
     * @default ApplicationProtocolVersion.HTTP1
     */
    readonly protocolVersion?: ApplicationProtocolVersion;
    /**
     * The port on which the listener listens for requests.
     *
     * @default Determined from protocol if known
     */
    readonly port?: number;
    /**
     * The time period during which the load balancer sends a newly registered
     * target a linearly increasing share of the traffic to the target group.
     *
     * The range is 30-900 seconds (15 minutes).
     *
     * @default 0
     */
    readonly slowStart?: Duration;
    /**
     * The stickiness cookie expiration period.
     *
     * Setting this value enables load balancer stickiness.
     *
     * After this period, the cookie is considered stale. The minimum value is
     * 1 second and the maximum value is 7 days (604800 seconds).
     *
     * @default Stickiness disabled
     */
    readonly stickinessCookieDuration?: Duration;
    /**
     * The name of an application-based stickiness cookie.
     *
     * Names that start with the following prefixes are not allowed: AWSALB, AWSALBAPP,
     * and AWSALBTG; they're reserved for use by the load balancer.
     *
     * Note: `stickinessCookieName` parameter depends on the presence of `stickinessCookieDuration` parameter.
     * If `stickinessCookieDuration` is not set, `stickinessCookieName` will be omitted.
     *
     * @default - If `stickinessCookieDuration` is set, a load-balancer generated cookie is used. Otherwise, no stickiness is defined.
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html
     */
    readonly stickinessCookieName?: string;
    /**
     * The targets to add to this target group.
     *
     * Can be `Instance`, `IPAddress`, or any self-registering load balancing
     * target. All target must be of the same type.
     */
    readonly targets?: IApplicationLoadBalancerTarget[];
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
     * Health check configuration
     *
     * @default - The default value for each property in this configuration varies depending on the target.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#aws-resource-elasticloadbalancingv2-targetgroup-properties
     */
    readonly healthCheck?: HealthCheck;
    /**
     * The load balancing algorithm to select targets for routing requests.
     *
     * @default round_robin.
     */
    readonly loadBalancingAlgorithmType?: TargetGroupLoadBalancingAlgorithmType;
}
/**
 * Properties for adding a fixed response to a listener
 *
 * @deprecated Use `ApplicationListener.addAction` instead.
 */
export interface AddFixedResponseProps extends AddRuleProps, FixedResponse {
}
/**
 * Properties for adding a redirect response to a listener
 *
 * @deprecated Use `ApplicationListener.addAction` instead.
 */
export interface AddRedirectResponseProps extends AddRuleProps, RedirectResponse {
}

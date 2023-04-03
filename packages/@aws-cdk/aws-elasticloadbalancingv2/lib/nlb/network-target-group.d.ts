import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Construct } from 'constructs';
import { INetworkListener } from './network-listener';
import { BaseTargetGroupProps, ITargetGroup, LoadBalancerTargetProps, TargetGroupAttributes, TargetGroupBase, TargetGroupImportProps } from '../shared/base-target-group';
import { Protocol } from '../shared/enums';
/**
 * Properties for a new Network Target Group
 */
export interface NetworkTargetGroupProps extends BaseTargetGroupProps {
    /**
     * The port on which the listener listens for requests.
     */
    readonly port: number;
    /**
     * Protocol for target group, expects TCP, TLS, UDP, or TCP_UDP.
     *
     * @default - TCP
     */
    readonly protocol?: Protocol;
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
     * The targets to add to this target group.
     *
     * Can be `Instance`, `IPAddress`, or any self-registering load balancing
     * target. If you use either `Instance` or `IPAddress` as targets, all
     * target must be of the same type.
     *
     * @default - No targets.
     */
    readonly targets?: INetworkLoadBalancerTarget[];
    /**
     *
     * Indicates whether the load balancer terminates connections at
     * the end of the deregistration timeout.
     *
     * @default false
     */
    readonly connectionTermination?: boolean;
}
/**
 * Contains all metrics for a Target Group of a Network Load Balancer.
 */
export interface INetworkTargetGroupMetrics {
    /**
     * Return the given named metric for this Network Target Group
     *
     * @default Average over 5 minutes
     */
    custom(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The number of targets that are considered healthy.
     *
     * @default Average over 5 minutes
     */
    healthyHostCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The number of targets that are considered unhealthy.
     *
     * @default Average over 5 minutes
     */
    unHealthyHostCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
/**
 * Define a Network Target Group
 */
export declare class NetworkTargetGroup extends TargetGroupBase implements INetworkTargetGroup {
    /**
     * Import an existing target group
     */
    static fromTargetGroupAttributes(scope: Construct, id: string, attrs: TargetGroupAttributes): INetworkTargetGroup;
    /**
     * Import an existing listener
     *
     * @deprecated Use `fromTargetGroupAttributes` instead
     */
    static import(scope: Construct, id: string, props: TargetGroupImportProps): INetworkTargetGroup;
    private readonly listeners;
    private _metrics?;
    constructor(scope: Construct, id: string, props: NetworkTargetGroupProps);
    get metrics(): INetworkTargetGroupMetrics;
    /**
     * Add a load balancing target to this target group
     */
    addTarget(...targets: INetworkLoadBalancerTarget[]): void;
    /**
     * Register a listener that is load balancing to this target group.
     *
     * Don't call this directly. It will be called by listeners.
     */
    registerListener(listener: INetworkListener): void;
    /**
     * The number of targets that are considered healthy.
     *
     * @default Average over 5 minutes
     * @deprecated Use ``NetworkTargetGroup.metrics.healthyHostCount`` instead
     */
    metricHealthyHostCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The number of targets that are considered unhealthy.
     *
     * @default Average over 5 minutes
     * @deprecated Use ``NetworkTargetGroup.metrics.healthyHostCount`` instead
     */
    metricUnHealthyHostCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Full name of first load balancer
     */
    get firstLoadBalancerFullName(): string;
    protected validateTargetGroup(): string[];
}
/**
 * A network target group
 */
export interface INetworkTargetGroup extends ITargetGroup {
    /**
     * All metrics available for this target group.
     */
    readonly metrics: INetworkTargetGroupMetrics;
    /**
     * Register a listener that is load balancing to this target group.
     *
     * Don't call this directly. It will be called by listeners.
     */
    registerListener(listener: INetworkListener): void;
    /**
     * Add a load balancing target to this target group
     */
    addTarget(...targets: INetworkLoadBalancerTarget[]): void;
}
/**
 * Interface for constructs that can be targets of an network load balancer
 */
export interface INetworkLoadBalancerTarget {
    /**
     * Attach load-balanced target to a TargetGroup
     *
     * May return JSON to directly add to the [Targets] list, or return undefined
     * if the target will register itself with the load balancer.
     */
    attachToNetworkTargetGroup(targetGroup: INetworkTargetGroup): LoadBalancerTargetProps;
}

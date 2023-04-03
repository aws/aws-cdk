import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAccelerator } from './accelerator';
import { EndpointGroup, EndpointGroupOptions } from './endpoint-group';
/**
 * Interface of the Listener
 */
export interface IListener extends cdk.IResource {
    /**
     * The ARN of the listener
     *
     * @attribute
     */
    readonly listenerArn: string;
}
/**
 * Construct options for Listener
 */
export interface ListenerOptions {
    /**
     * Name of the listener
     *
     * @default - logical ID of the resource
     */
    readonly listenerName?: string;
    /**
     * The list of port ranges for the connections from clients to the accelerator
     */
    readonly portRanges: PortRange[];
    /**
     * The protocol for the connections from clients to the accelerator
     *
     * @default ConnectionProtocol.TCP
     */
    readonly protocol?: ConnectionProtocol;
    /**
     * Client affinity to direct all requests from a user to the same endpoint
     *
     * If you have stateful applications, client affinity lets you direct all
     * requests from a user to the same endpoint.
     *
     * By default, each connection from each client is routed to seperate
     * endpoints. Set client affinity to SOURCE_IP to route all connections from
     * a single client to the same endpoint.
     *
     * @default ClientAffinity.NONE
     */
    readonly clientAffinity?: ClientAffinity;
}
/**
 * Construct properties for Listener
 */
export interface ListenerProps extends ListenerOptions {
    /**
     * The accelerator for this listener
     */
    readonly accelerator: IAccelerator;
}
/**
 * The list of port ranges for the connections from clients to the accelerator.
 */
export interface PortRange {
    /**
     * The first port in the range of ports, inclusive.
     */
    readonly fromPort: number;
    /**
     * The last port in the range of ports, inclusive.
     *
     * @default - same as `fromPort`
     */
    readonly toPort?: number;
}
/**
 * The protocol for the connections from clients to the accelerator.
 */
export declare enum ConnectionProtocol {
    /**
     * TCP
     */
    TCP = "TCP",
    /**
     * UDP
     */
    UDP = "UDP"
}
/**
 * Client affinity gives you control over whether to always route each client to the same specific endpoint.
 *
 * @see https://docs.aws.amazon.com/global-accelerator/latest/dg/about-listeners.html#about-listeners-client-affinity
 */
export declare enum ClientAffinity {
    /**
     * Route traffic based on the 5-tuple `(source IP, source port, destination IP, destination port, protocol)`
     */
    NONE = "NONE",
    /**
     * Route traffic based on the 2-tuple `(source IP, destination IP)`
     *
     * The result is that multiple connections from the same client will be routed the same.
     */
    SOURCE_IP = "SOURCE_IP"
}
/**
 * The construct for the Listener
 */
export declare class Listener extends cdk.Resource implements IListener {
    /**
     * import from ARN
     */
    static fromListenerArn(scope: Construct, id: string, listenerArn: string): IListener;
    readonly listenerArn: string;
    /**
     * The name of the listener
     *
     * @attribute
     */
    readonly listenerName: string;
    constructor(scope: Construct, id: string, props: ListenerProps);
    /**
     * Add a new endpoint group to this listener
     */
    addEndpointGroup(id: string, options?: EndpointGroupOptions): EndpointGroup;
}

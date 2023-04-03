import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { IResource, Resource } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { IListenerAction } from './listener-action';
/**
 * Options for listener lookup
 */
export interface BaseListenerLookupOptions {
    /**
     * Filter listeners by associated load balancer arn
     * @default - does not filter by load balancer arn
     */
    readonly loadBalancerArn?: string;
    /**
     * Filter listeners by associated load balancer tags
     * @default - does not filter by load balancer tags
     */
    readonly loadBalancerTags?: Record<string, string>;
    /**
     * Filter listeners by listener port
     * @default - does not filter by listener port
     */
    readonly listenerPort?: number;
}
/**
 * Options for querying the load balancer listener context provider
 * @internal
 */
export interface ListenerQueryContextProviderOptions {
    /**
     * User's provided options
     */
    readonly userOptions: BaseListenerLookupOptions;
    /**
     * Type of load balancer expected
     */
    readonly loadBalancerType: cxschema.LoadBalancerType;
    /**
     * ARN of the listener to look up
     * @default - does not filter by listener arn
     */
    readonly listenerArn?: string;
    /**
     * Optional protocol of the listener to look up
     */
    readonly listenerProtocol?: cxschema.LoadBalancerListenerProtocol;
}
/**
 * Base interface for listeners
 */
export interface IListener extends IResource {
    /**
     * ARN of the listener
     * @attribute
     */
    readonly listenerArn: string;
}
/**
 * Base class for listeners
 */
export declare abstract class BaseListener extends Resource implements IListener {
    /**
     * Queries the load balancer listener context provider for load balancer
     * listener info.
     * @internal
     */
    protected static _queryContextProvider(scope: Construct, options: ListenerQueryContextProviderOptions): cxapi.LoadBalancerListenerContextResponse;
    /**
     * @attribute
     */
    readonly listenerArn: string;
    private defaultAction?;
    constructor(scope: Construct, id: string, additionalProps: any);
    /**
     * Validate this listener
     */
    protected validateListener(): string[];
    /**
     * Configure the default action
     *
     * @internal
     */
    protected _setDefaultAction(action: IListenerAction): void;
}

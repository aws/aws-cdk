import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { IResource, Resource } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
/**
 * Shared properties of both Application and Network Load Balancers
 */
export interface BaseLoadBalancerProps {
    /**
     * Name of the load balancer
     *
     * @default - Automatically generated name.
     */
    readonly loadBalancerName?: string;
    /**
     * The VPC network to place the load balancer in
     */
    readonly vpc: ec2.IVpc;
    /**
     * Whether the load balancer has an internet-routable address
     *
     * @default false
     */
    readonly internetFacing?: boolean;
    /**
     * Which subnets place the load balancer in
     *
     * @default - the Vpc default strategy.
     *
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
     * Indicates whether deletion protection is enabled.
     *
     * @default false
     */
    readonly deletionProtection?: boolean;
}
export interface ILoadBalancerV2 extends IResource {
    /**
     * The canonical hosted zone ID of this load balancer
     *
     * Example value: `Z2P70J7EXAMPLE`
     *
     * @attribute
     */
    readonly loadBalancerCanonicalHostedZoneId: string;
    /**
     * The DNS name of this load balancer
     *
     * Example value: `my-load-balancer-424835706.us-west-2.elb.amazonaws.com`
     *
     * @attribute
     */
    readonly loadBalancerDnsName: string;
}
/**
 * Options for looking up load balancers
 */
export interface BaseLoadBalancerLookupOptions {
    /**
     * Find by load balancer's ARN
     * @default - does not search by load balancer arn
     */
    readonly loadBalancerArn?: string;
    /**
     * Match load balancer tags.
     * @default - does not match load balancers by tags
     */
    readonly loadBalancerTags?: Record<string, string>;
}
/**
 * Options for query context provider
 * @internal
 */
export interface LoadBalancerQueryContextProviderOptions {
    /**
     * User's lookup options
     */
    readonly userOptions: BaseLoadBalancerLookupOptions;
    /**
     * Type of load balancer
     */
    readonly loadBalancerType: cxschema.LoadBalancerType;
}
/**
 * Base class for both Application and Network Load Balancers
 */
export declare abstract class BaseLoadBalancer extends Resource {
    /**
     * Queries the load balancer context provider for load balancer info.
     * @internal
     */
    protected static _queryContextProvider(scope: Construct, options: LoadBalancerQueryContextProviderOptions): cxapi.LoadBalancerContextResponse;
    /**
     * The canonical hosted zone ID of this load balancer
     *
     * Example value: `Z2P70J7EXAMPLE`
     *
     * @attribute
     */
    readonly loadBalancerCanonicalHostedZoneId: string;
    /**
     * The DNS name of this load balancer
     *
     * Example value: `my-load-balancer-424835706.us-west-2.elb.amazonaws.com`
     *
     * @attribute
     */
    readonly loadBalancerDnsName: string;
    /**
     * The full name of this load balancer
     *
     * Example value: `app/my-load-balancer/50dc6c495c0c9188`
     *
     * @attribute
     */
    readonly loadBalancerFullName: string;
    /**
     * The name of this load balancer
     *
     * Example value: `my-load-balancer`
     *
     * @attribute
     */
    readonly loadBalancerName: string;
    /**
     * The ARN of this load balancer
     *
     * Example value: `arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-internal-load-balancer/50dc6c495c0c9188`
     *
     * @attribute
     */
    readonly loadBalancerArn: string;
    /**
     * @attribute
     */
    readonly loadBalancerSecurityGroups: string[];
    /**
     * The VPC this load balancer has been created in.
     *
     * This property is always defined (not `null` or `undefined`) for sub-classes of `BaseLoadBalancer`.
     */
    readonly vpc?: ec2.IVpc;
    /**
     * Attributes set on this load balancer
     */
    private readonly attributes;
    constructor(scope: Construct, id: string, baseProps: BaseLoadBalancerProps, additionalProps: any);
    /**
     * Enable access logging for this load balancer.
     *
     * A region must be specified on the stack containing the load balancer; you cannot enable logging on
     * environment-agnostic stacks. See https://docs.aws.amazon.com/cdk/latest/guide/environments.html
     */
    logAccessLogs(bucket: s3.IBucket, prefix?: string): void;
    /**
     * Set a non-standard attribute on the load balancer
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#load-balancer-attributes
     */
    setAttribute(key: string, value: string | undefined): void;
    /**
     * Remove an attribute from the load balancer
     */
    removeAttribute(key: string): void;
    protected resourcePolicyPrincipal(): iam.IPrincipal;
    protected validateLoadBalancer(): string[];
}

import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents an API Gateway VpcLink
 */
export interface IVpcLink extends IResource {
    /**
     * Physical ID of the VpcLink resource
     * @attribute
     */
    readonly vpcLinkId: string;
}
/**
 * Properties for a VpcLink
 */
export interface VpcLinkProps {
    /**
     * The name used to label and identify the VPC link.
     * @default - automatically generated name
     */
    readonly vpcLinkName?: string;
    /**
     * The description of the VPC link.
     * @default no description
     */
    readonly description?: string;
    /**
     * The network load balancers of the VPC targeted by the VPC link.
     * The network load balancers must be owned by the same AWS account of the API owner.
     *
     * @default - no targets. Use `addTargets` to add targets
     */
    readonly targets?: elbv2.INetworkLoadBalancer[];
}
/**
 * Define a new VPC Link
 * Specifies an API Gateway VPC link for a RestApi to access resources in an Amazon Virtual Private Cloud (VPC).
 */
export declare class VpcLink extends Resource implements IVpcLink {
    /**
     * Import a VPC Link by its Id
     */
    static fromVpcLinkId(scope: Construct, id: string, vpcLinkId: string): IVpcLink;
    /**
     * Physical ID of the VpcLink resource
     * @attribute
     */
    readonly vpcLinkId: string;
    private readonly _targets;
    constructor(scope: Construct, id: string, props?: VpcLinkProps);
    addTargets(...targets: elbv2.INetworkLoadBalancer[]): void;
    /**
     * Return the list of DNS names from the target NLBs.
     * @internal
     * */
    get _targetDnsNames(): string[];
    private validateVpcLink;
    private renderTargets;
}

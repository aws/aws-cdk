import * as ec2 from '@aws-cdk/aws-ec2';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseNamespaceProps, INamespace, NamespaceType } from './namespace';
import { DnsServiceProps, Service } from './service';
export interface PrivateDnsNamespaceProps extends BaseNamespaceProps {
    /**
     * The Amazon VPC that you want to associate the namespace with.
     */
    readonly vpc: ec2.IVpc;
}
export interface IPrivateDnsNamespace extends INamespace {
}
export interface PrivateDnsNamespaceAttributes {
    /**
     * A name for the Namespace.
     */
    readonly namespaceName: string;
    /**
     * Namespace Id for the Namespace.
     */
    readonly namespaceId: string;
    /**
     * Namespace ARN for the Namespace.
     */
    readonly namespaceArn: string;
}
/**
 * Define a Service Discovery HTTP Namespace
 */
export declare class PrivateDnsNamespace extends Resource implements IPrivateDnsNamespace {
    static fromPrivateDnsNamespaceAttributes(scope: Construct, id: string, attrs: PrivateDnsNamespaceAttributes): IPrivateDnsNamespace;
    /**
     * The name of the PrivateDnsNamespace.
     */
    readonly namespaceName: string;
    /**
     * Namespace Id of the PrivateDnsNamespace.
     */
    readonly namespaceId: string;
    /**
     * Namespace Arn of the namespace.
     */
    readonly namespaceArn: string;
    /**
     * ID of hosted zone created by namespace
     */
    readonly namespaceHostedZoneId: string;
    /**
     * Type of the namespace.
     */
    readonly type: NamespaceType;
    constructor(scope: Construct, id: string, props: PrivateDnsNamespaceProps);
    /** @attribute */
    get privateDnsNamespaceArn(): string;
    /** @attribute */
    get privateDnsNamespaceName(): string;
    /** @attribute */
    get privateDnsNamespaceId(): string;
    /**
     * Creates a service within the namespace
     */
    createService(id: string, props?: DnsServiceProps): Service;
}

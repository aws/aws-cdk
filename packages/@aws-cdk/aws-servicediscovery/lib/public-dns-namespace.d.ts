import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseNamespaceProps, INamespace, NamespaceType } from './namespace';
import { DnsServiceProps, Service } from './service';
export interface PublicDnsNamespaceProps extends BaseNamespaceProps {
}
export interface IPublicDnsNamespace extends INamespace {
}
export interface PublicDnsNamespaceAttributes {
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
 * Define a Public DNS Namespace
 */
export declare class PublicDnsNamespace extends Resource implements IPublicDnsNamespace {
    static fromPublicDnsNamespaceAttributes(scope: Construct, id: string, attrs: PublicDnsNamespaceAttributes): IPublicDnsNamespace;
    /**
     * A name for the namespace.
     */
    readonly namespaceName: string;
    /**
     * Namespace Id for the namespace.
     */
    readonly namespaceId: string;
    /**
     * Namespace Arn for the namespace.
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
    constructor(scope: Construct, id: string, props: PublicDnsNamespaceProps);
    /** @attribute */
    get publicDnsNamespaceArn(): string;
    /** @attribute */
    get publicDnsNamespaceName(): string;
    /** @attribute */
    get publicDnsNamespaceId(): string;
    /**
     * Creates a service within the namespace
     */
    createService(id: string, props?: DnsServiceProps): Service;
}

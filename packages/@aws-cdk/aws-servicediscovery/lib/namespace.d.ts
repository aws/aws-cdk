import { IResource } from '@aws-cdk/core';
export interface INamespace extends IResource {
    /**
     * A name for the Namespace.
     * @attribute
     */
    readonly namespaceName: string;
    /**
     * Namespace Id for the Namespace.
     * @attribute
     */
    readonly namespaceId: string;
    /**
     * Namespace ARN for the Namespace.
     * @attribute
     */
    readonly namespaceArn: string;
    /**
     * Type of Namespace
     */
    readonly type: NamespaceType;
}
export interface BaseNamespaceProps {
    /**
     * A name for the Namespace.
     */
    readonly name: string;
    /**
     * A description of the Namespace.
     *
     * @default none
     */
    readonly description?: string;
}
export declare enum NamespaceType {
    /**
     * Choose this option if you want your application to use only API calls to discover registered instances.
     */
    HTTP = "HTTP",
    /**
     * Choose this option if you want your application to be able to discover instances using either API calls or using
     * DNS queries in a VPC.
     */
    DNS_PRIVATE = "DNS_PRIVATE",
    /**
     * Choose this option if you want your application to be able to discover instances using either API calls or using
     * public DNS queries. You aren't required to use both methods.
     */
    DNS_PUBLIC = "DNS_PUBLIC"
}

import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseNamespaceProps, INamespace, NamespaceType } from './namespace';
import { BaseServiceProps, Service } from './service';
export interface HttpNamespaceProps extends BaseNamespaceProps {
}
export interface IHttpNamespace extends INamespace {
}
export interface HttpNamespaceAttributes {
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
 * Define an HTTP Namespace
 */
export declare class HttpNamespace extends Resource implements IHttpNamespace {
    static fromHttpNamespaceAttributes(scope: Construct, id: string, attrs: HttpNamespaceAttributes): IHttpNamespace;
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
     * Type of the namespace.
     */
    readonly type: NamespaceType;
    constructor(scope: Construct, id: string, props: HttpNamespaceProps);
    /** @attribute */
    get httpNamespaceArn(): string;
    /** @attribute */
    get httpNamespaceName(): string;
    /** @attribute */
    get httpNamespaceId(): string;
    /**
     * Creates a service within the namespace
     */
    createService(id: string, props?: BaseServiceProps): Service;
}

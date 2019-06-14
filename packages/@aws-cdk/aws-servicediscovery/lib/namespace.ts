import { IResource, PhysicalName } from '@aws-cdk/cdk';

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
  readonly namespaceName: PhysicalName;

  /**
   * A description of the Namespace.
   *
   * @default none
   */
  readonly description?: string;
}

export interface NamespaceAttributes {
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

  /**
   * Type of Namespace. Valid values: HTTP, DNS_PUBLIC, or DNS_PRIVATE
   */
  readonly type: NamespaceType;
}

export enum NamespaceType {
  /**
   * Choose this option if you want your application to use only API calls to discover registered instances.
   */
  Http = "HTTP",

  /**
   * Choose this option if you want your application to be able to discover instances using either API calls or using
   * DNS queries in a VPC.
   */
  DnsPrivate = "DNS_PRIVATE",

  /**
   * Choose this option if you want your application to be able to discover instances using either API calls or using
   * public DNS queries. You aren't required to use both methods.
   */
  DnsPublic = "DNS_PUBLIC",
}

import cdk = require('@aws-cdk/cdk');

export interface INamespace extends cdk.IConstruct {
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

export interface BaseNamespaceProps {
  /**
   * A name for the Namespace.
   */
  name: string;

  /**
   * A description of the Namespace.
   *
   * @default none
   */
  description?: string;
}

export interface NamespaceImportProps {
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

export abstract class NamespaceBase extends cdk.Construct implements INamespace {
  public abstract readonly namespaceId: string;
  public abstract readonly namespaceArn: string;
  public abstract readonly namespaceName: string;
  public abstract readonly type: NamespaceType;
}

// FIXME don't export
export class ImportedNamespace extends NamespaceBase {
  public readonly namespaceId: string;
  public readonly namespaceArn: string;
  public readonly namespaceName: string;
  public readonly type: NamespaceType;

  constructor(scope: cdk.Construct, id: string, private readonly props: NamespaceImportProps) {
    super(scope, id);

    this.namespaceId = props.namespaceId;
    this.namespaceArn = props.namespaceArn;
    this.namespaceName = props.namespaceName || '';
    this.type = props.type;
  }

  public export() {
    return this.props;
  }
}

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
   * Type of Namespace
   */
  readonly type: NamespaceType;

  /**
   * Export the namespace properties
   */
  export(): NamespaceImportProps;
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

  public export(): NamespaceImportProps {
    return {
      namespaceName: new cdk.CfnOutput(this, 'NamespaceName', { value: this.namespaceArn }).makeImportValue().toString(),
      namespaceArn: new cdk.CfnOutput(this, 'NamespaceArn', { value: this.namespaceArn }).makeImportValue().toString(),
      namespaceId: new cdk.CfnOutput(this, 'NamespaceId', { value: this.namespaceId }).makeImportValue().toString(),
      type: this.type,
    };
  }
}

// The class below exists purely so that users can still type Namespace.import().
// It does not make sense to have HttpNamespace.import({ ..., type: NamespaceType.PublicDns }),
// but at the same time ecs.Cluster wants a type-generic export()/import(). Hence, we put
// it in Namespace.

/**
 * Static Namespace class
 */
export class Namespace {
  /**
   * Import a namespace
   */
  public static import(scope: cdk.Construct, id: string, props: NamespaceImportProps): INamespace {
    return new ImportedNamespace(scope, id, props);
  }

  private constructor() {
  }
}

class ImportedNamespace extends NamespaceBase {
  public namespaceId: string;
  public namespaceArn: string;
  public namespaceName: string;
  public type: NamespaceType;

  constructor(scope: cdk.Construct, id: string, props: NamespaceImportProps) {
    super(scope, id);
    this.namespaceId = props.namespaceId;
    this.namespaceArn = props.namespaceArn;
    this.namespaceName = props.namespaceName;
    this.type = props.type;
  }
}
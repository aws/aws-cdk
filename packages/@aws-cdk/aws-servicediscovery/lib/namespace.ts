import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
// import { BaseServiceProps, Service } from './service';
import { CfnHttpNamespace, CfnPrivateDnsNamespace, CfnPublicDnsNamespace} from './servicediscovery.generated';

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

export interface NamespaceProps {
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

  /**
   * Type of Namespace. Valid values: HTTP, DNS_PUBLIC, or DNS_PRIVATE
   *
   * @default HTTP
   */
  type?: NamespaceType;

  /**
   * The Amazon VPC that you want to associate the namespace with.
   * Only applies for Private DNS Namespaces.
   *
   * @default none
   */
  vpc?: ec2.IVpcNetwork;

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

export class Namespace extends cdk.Construct implements INamespace {
  public readonly namespaceName: string;
  public readonly namespaceId: string;
  public readonly namespaceArn: string;
  public readonly type: NamespaceType;

  constructor(scope: cdk.Construct, id: string, props: NamespaceProps) {
    super(scope, id);

    const namespaceName = props.name;
    const description = props.description;
    const namespaceType = props.type !== undefined ? props.type : NamespaceType.Http;

    this.namespaceName = namespaceName;
    this.type = namespaceType;

    switch (namespaceType) {
      case NamespaceType.Http: {
        const ns = new CfnHttpNamespace(this, 'Resource', {
          name: namespaceName,
          description
        });

        this.namespaceId = ns.httpNamespaceId;
        this.namespaceArn = ns.httpNamespaceArn;
        break;
      }

      case NamespaceType.DnsPrivate: {
        if (props.vpc === undefined) {
          throw new Error(`VPC must be specified for PrivateDNSNamespaces`);
        }

        const ns = new CfnPrivateDnsNamespace(this, 'Resource', {
          name: namespaceName,
          description,
          vpc: props.vpc.vpcId
        });

        this.namespaceId = ns.privateDnsNamespaceId;
        this.namespaceArn = ns.privateDnsNamespaceArn;
        break;
      }

      case NamespaceType.DnsPublic: {
        const ns = new CfnPublicDnsNamespace(this, 'Resource', {
          name: namespaceName,
          description
        });

        this.namespaceId = ns.publicDnsNamespaceId;
        this.namespaceArn = ns.publicDnsNamespaceArn;
        break;
      }
    }
  }

  /**
   * Creates a new service in this namespace FIXME -- not setting namespace correctly
   */
  // public createService(id: string, props?: BaseServiceProps): Service {
  //   return new Service(this, id, {
  //     namespace: this,
  //     ...props,
  //   });
  // }
}

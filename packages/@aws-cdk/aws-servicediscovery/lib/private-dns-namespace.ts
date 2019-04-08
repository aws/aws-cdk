import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseNamespaceProps, NamespaceBase, NamespaceType } from './namespace';
import { DnsServiceProps, Service } from './service';
import { CfnPrivateDnsNamespace} from './servicediscovery.generated';

export interface PrivateDnsNamespaceProps extends BaseNamespaceProps {
  /**
   * The Amazon VPC that you want to associate the namespace with.
   */
  readonly vpc: ec2.IVpcNetwork;
}

/**
 * Define a Service Discovery HTTP Namespace
 */
export class PrivateDnsNamespace extends NamespaceBase {
  /**
   * The name of the PrivateDnsNamespace.
   */
  public readonly namespaceName: string;

  /**
   * Namespace Id of the PrivateDnsNamespace.
   */
  public readonly namespaceId: string;

  /**
   * Namespace Arn of the namespace.
   */
  public readonly namespaceArn: string;

  /**
   * Type of the namespace.
   */
  public readonly type: NamespaceType;

  constructor(scope: cdk.Construct, id: string, props: PrivateDnsNamespaceProps) {
    super(scope, id);
    if (props.vpc === undefined) {
      throw new Error(`VPC must be specified for PrivateDNSNamespaces`);
    }

    const ns = new CfnPrivateDnsNamespace(this, 'Resource', {
      name: props.name,
      description: props.description,
      vpc: props.vpc.vpcId
    });

    this.namespaceName = props.name;
    this.namespaceId = ns.privateDnsNamespaceId;
    this.namespaceArn = ns.privateDnsNamespaceArn;
    this.type = NamespaceType.DnsPrivate;
  }

  /**
   * Creates a service within the namespace
   */
  public createService(id: string, props?: DnsServiceProps): Service {
    return new Service(this, id, {
      namespace: this,
      ...props
    });
  }
}

import ec2 = require('@aws-cdk/aws-ec2');
import { BaseNamespaceProps, NamespaceBase, NamespaceType } from './namespace';
import { CfnPrivateDnsNamespace} from './servicediscovery.generated';
import cdk = require('@aws-cdk/cdk');

export interface PrivateDnsNamespaceProps extends BaseNamespaceProps {
  /**
   * The Amazon VPC that you want to associate the namespace with.
   */
  vpc: ec2.IVpcNetwork;
}

/**
 * Define a Service Discovery HTTP Namespace
 */
export class PrivateDnsNamespace extends NamespaceBase {
  /**
   * A name for the PrivateDnsNamespace.
   */
  public readonly namespaceName: string;

  /**
   * Namespace Id for the PrivateDnsNamespace.
   */
  public readonly namespaceId: string;

  /**
   * Namespace Arn for the namespace.
   */
  public readonly namespaceArn: string;

  /**
   * Type of the namespace.
   */
  public readonly type: NamespaceType;

  /**
   * The Amazon VPC that you want to associate the namespace with.
   */
  public readonly vpc: ec2.IVpcNetwork;

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
    this.vpc = props.vpc;
  }
}

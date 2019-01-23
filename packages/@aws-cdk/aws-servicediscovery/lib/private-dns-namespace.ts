import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { CfnPrivateDnsNamespace} from './servicediscovery.generated';

export interface PrivateDnsNamespaceProps {
  /**
   * A name for the HttpNamespace.
   */
  name: string;

  /**
   * The Amazon VPC that you want to associate the namespace with.
   */
  vpc: ec2.IVpcNetwork;

  /**
   * A description of the namespace.
   */
  description?: string;
}

/**
 * Define a Service Discovery HTTP Namespace
 */
export class PrivateDnsNamespace extends cdk.Construct {
  /**
   * A name for the PrivateDnsNamespace.
   */
  public readonly name: string;

  /**
   * Namespace Id for the PrivateDnsNamespace.
   */
  public readonly namespaceId: string;

  /**
   * The Amazon VPC that you want to associate the namespace with.
   */
  public readonly vpc: ec2.IVpcNetwork;

  constructor(scope: cdk.Construct, id: string, props: PrivateDnsNamespaceProps) {
    super(scope, id);

    const ns = new CfnPrivateDnsNamespace(this, 'Resource', {
      name: props.name,
      description: props.description,
      vpc: props.vpc.vpcId
    });

    this.vpc = props.vpc;
    this.name = props.name;
    this.namespaceId = ns.privateDnsNamespaceId;
  }
}

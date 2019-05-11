import ec2 = require('@aws-cdk/aws-ec2');
import { Construct } from '@aws-cdk/cdk';
import { BaseNamespaceProps, INamespace, NamespaceBase, NamespaceType } from './namespace';
import { DnsServiceProps, Service } from './service';
import { CfnPrivateDnsNamespace} from './servicediscovery.generated';

export interface PrivateDnsNamespaceProps extends BaseNamespaceProps {
  /**
   * The Amazon VPC that you want to associate the namespace with.
   */
  readonly vpc: ec2.IVpcNetwork;
}

export interface IPrivateDnsNamespace extends INamespace {
  /**
   * The ID of the private namespace.
   * @attribute
   */
  readonly privateDnsNamespaceId: string;

  /**
   * The Amazon Resource Name (ARN) of the private namespace.
   * @attribute
   */
  readonly privateDnsNamespaceArn: string;
}

/**
 * Define a Service Discovery HTTP Namespace
 */
export class PrivateDnsNamespace extends NamespaceBase implements IPrivateDnsNamespace {
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

  constructor(scope: Construct, id: string, props: PrivateDnsNamespaceProps) {
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

  public get privateDnsNamespaceArn() { return this.namespaceArn; }
  public get privateDnsNamespaceId() { return this.namespaceId; }

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

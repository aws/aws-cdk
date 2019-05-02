import { Construct } from '@aws-cdk/cdk';
import { BaseNamespaceProps, INamespace, NamespaceBase, NamespaceType } from './namespace';
import { BaseServiceProps, Service } from './service';
import { CfnHttpNamespace } from './servicediscovery.generated';

export interface HttpNamespaceProps extends BaseNamespaceProps {}

export interface IHttpNamespace extends INamespace {
  /**
   * The Amazon Resource Name (ARN) of the namespace, such as
   * arn:aws:service-discovery:us-east-1:123456789012:http-namespace/http-namespace-a1bzhi.
   */
  readonly httpNamespaceArn: string;

  /**
   * The ID of the namespace.
   */
  readonly httpNamespaceId: string;
}

/**
 * Define an HTTP Namespace
 */
export class HttpNamespace extends NamespaceBase implements IHttpNamespace {
  /**
   * A name for the namespace.
   */
  public readonly namespaceName: string;

  /**
   * Namespace Id for the namespace.
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

  constructor(scope: Construct, id: string, props: HttpNamespaceProps) {
    super(scope, id);

    const ns = new CfnHttpNamespace(this, 'Resource', {
      name: props.name,
      description: props.description
    });

    this.namespaceName = props.name;
    this.namespaceId = ns.httpNamespaceId;
    this.namespaceArn = ns.httpNamespaceArn;
    this.type = NamespaceType.Http;
  }

  public get httpNamespaceArn() { return this.namespaceArn; }
  public get httpNamespaceId() { return this.namespaceId; }

  /**
   * Creates a service within the namespace
   */
  public createService(id: string, props?: BaseServiceProps): Service {
    return new Service(this, id, {
      namespace: this,
      ...props
    });
  }
}

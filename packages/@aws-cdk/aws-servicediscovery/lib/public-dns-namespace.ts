import cdk = require('@aws-cdk/cdk');
import { CfnPublicDnsNamespace} from './servicediscovery.generated';

export interface PublicDnsNamespaceProps {
  /**
   * A name for the HttpNamespace.
   */
  name: string;

  /**
   * A description of the namespace.
   */
  description?: string;
}

/**
 * Define a Service Discovery HTTP Namespace
 */
export class PublicDnsNamespace extends cdk.Construct {
  /**
   * A name for the PublicDnsNamespace.
   */
  public readonly name: string;

  /**
   * Namespace Id for the PublicDnsNamespace.
   */
  public readonly namespaceId: string;

  constructor(scope: cdk.Construct, id: string, props: PublicDnsNamespaceProps) {
    super(scope, id);

    const ns = new CfnPublicDnsNamespace(this, 'Resource', {
      name: props.name,
      description: props.description,
    });

    this.name = props.name;
    this.namespaceId = ns.publicDnsNamespaceId;
  }
}

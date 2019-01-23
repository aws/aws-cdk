import cdk = require('@aws-cdk/cdk');
import { CfnHttpNamespace } from './servicediscovery.generated';

export interface HttpNamespaceProps {
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
export class HttpNamespace extends cdk.Construct {
  /**
   * A domain name
   */
  public readonly name: string;

  /**
   * Namespace Id for the HttpNamespace.
   */
  public readonly namespaceId: string;

  constructor(scope: cdk.Construct, id: string, props: HttpNamespaceProps) {
    super(scope, id);

    const ns = new CfnHttpNamespace(this, 'Resource', {
      name: props.name,
      description: props.description
    });

    this.name = props.name;
    this.namespaceId = ns.httpNamespaceId;
  }
}

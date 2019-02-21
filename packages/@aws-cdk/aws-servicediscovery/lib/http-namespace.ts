import cdk = require('@aws-cdk/cdk');
import { BaseNamespaceProps, NamespaceBase, NamespaceType } from './namespace';
import { CfnHttpNamespace } from './servicediscovery.generated';

// tslint:disable:no-empty-interface
export interface HttpNamespaceProps extends BaseNamespaceProps {}

/**
 * Define an HTTP Namespace
 */
export class HttpNamespace extends NamespaceBase {
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

  constructor(scope: cdk.Construct, id: string, props: HttpNamespaceProps) {
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
}

import cdk = require('@aws-cdk/cdk');
import { CfnVirtualService } from './appmesh.generated';
import { NAME_TAG } from './shared-interfaces';

// TODO: Add import() and eport() capabilities

/**
 * The base properties which all classes in VirtualService will inherit from
 */
export interface VirtualServiceBaseProps {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   *
   * @example service.domain.local
   */
  readonly virtualServiceName: string;
  /**
   * The name of the VirtualRouter which this VirtualService uses as provider
   */
  readonly virtualRouterName: string;
}

/**
 * The properties applied to the VirtualService being created
 */
export interface VirtualServiceProps extends VirtualServiceBaseProps {
  /**
   * The AppMesh mesh name for whiich the VirtualService belongs to
   */
  readonly meshName: string;
}

/**
 * VirtualService represents a service inside an AppMesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_services.html
 */
export class VirtualService extends cdk.Construct {
  /**
   * The AppMesh mesh name for whiich the VirtualService belongs to
   *
   * @type {string}
   * @memberof VirtualService
   */
  public readonly meshName: string;
  /**
   * The name of the VirtualRouter which this VirtualService uses as provider
   *
   * @type {string}
   * @memberof VirtualService
   */
  public readonly virtualRouterName: string;
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   *
   * @type {string}
   * @memberof VirtualService
   */
  public readonly virtualServiceName: string;
  /**
   * The Amazon Resource Name (ARN) for the virtual service
   *
   * @type {string}
   * @memberof VirtualService
   */
  public readonly virtaulServiceArn: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceProps) {
    super(scope, id);

    this.meshName = props.meshName;
    this.virtualRouterName = props.virtualRouterName;

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));
    const name = props.virtualServiceName;

    const svc = new CfnVirtualService(this, 'VirtualService', {
      meshName: this.meshName,
      virtualServiceName: name,
      spec: {
        provider: {
          virtualRouter: {
            virtualRouterName: this.virtualRouterName,
          },
        },
      },
    });

    this.virtaulServiceArn = svc.virtualServiceArn;
    this.virtualServiceName = svc.virtualServiceName;
  }
}

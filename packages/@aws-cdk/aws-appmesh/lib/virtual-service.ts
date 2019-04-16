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
  readonly virtualRouterName?: string;
  /**
   * The name of the VirtualNode attached to the virtual service
   */
  readonly virtualNodeName?: string;
}

/**
 * The properties applied to the VirtualService being define
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
  public readonly virtualRouterName?: string;
  /**
   * The name of the VirtualNode attached to the virtual service
   *
   * @type {string}
   * @memberof VirtualService
   */
  public readonly virtualNodeName?: string;
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

  private readonly virtualServiceProvider?: CfnVirtualService.VirtualServiceProviderProperty;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceProps) {
    super(scope, id);

    if (props.virtualNodeName && props.virtualRouterName) {
      throw new Error('Must provide only one of virtualNodeName or virtualRouterName for the provider');
    }

    this.meshName = props.meshName;

    // Check which provider to use node or router
    if (props.virtualRouterName) {
      this.virtualRouterName = props.virtualRouterName;
      this.virtualServiceProvider = this.addVirtualRouter(this.virtualRouterName);
    } else if (props.virtualNodeName) {
      this.virtualNodeName = props.virtualNodeName;
      this.virtualServiceProvider = this.addVirtualNode(this.virtualNodeName);
    }

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));
    const name = props.virtualServiceName;

    const svc = new CfnVirtualService(this, 'VirtualService', {
      meshName: this.meshName,
      virtualServiceName: name,
      spec: {
        provider: this.virtualServiceProvider,
      },
    });

    this.virtaulServiceArn = svc.virtualServiceArn;
    this.virtualServiceName = svc.virtualServiceName;
  }

  private addVirtualRouter(name: string): CfnVirtualService.VirtualServiceProviderProperty {
    return {
      virtualRouter: {
        virtualRouterName: name,
      },
    };
  }

  private addVirtualNode(name: string): CfnVirtualService.VirtualServiceProviderProperty {
    return {
      virtualNode: {
        virtualNodeName: name,
      },
    };
  }
}

import cdk = require('@aws-cdk/core');

import { CfnVirtualService } from './appmesh.generated';
import { IMesh } from './mesh';
import { IVirtualNode } from './virtual-node';
import { IVirtualRouter } from './virtual-router';

/**
 * Interface with properties ncecessary to import a reusable VirtualService
 */
export interface VirtualServiceAttributes {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   *
   * @default if virtualServiceMeshName given, derived from serviceName and meshName
   */
  readonly virtualServiceArn?: string;

  /**
   * The name of the service mesh that the virtual service resides in
   *
   * @see use to derive ARN from mesh name if ARN not provided
   */
  readonly virtualServiceMeshName: string;
}

/**
 * Represents the interface which all VirtualService based classes MUST implement
 */
export interface IVirtualService extends cdk.IResource {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  readonly virtualServiceArn: string;

  /**
   * The name of the service mesh that the virtual service resides in
   */
  readonly virtualServiceMeshName: string;
}

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
   * The VirtualRouter which the VirtualService uses as provider
   */
  readonly virtualRouter?: IVirtualRouter;

  /**
   * The VirtualNode attached to the virtual service
   */
  readonly virtualNode?: IVirtualNode;
}

/**
 * The properties applied to the VirtualService being define
 */
export interface VirtualServiceProps extends VirtualServiceBaseProps {
  /**
   * The AppMesh mesh name for whiich the VirtualService belongs to
   */
  readonly mesh: IMesh;
}

/**
 * VirtualService represents a service inside an AppMesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_services.html
 */
export class VirtualService extends cdk.Resource implements IVirtualService {
  /**
   * A static method to import a VirtualService an make it re-usable accross stacks
   */
  public static fromVirtualServiceAttributes(scope: cdk.Construct, id: string, attrs: VirtualServiceAttributes): IVirtualService {
    return new ImportedVirtualService(scope, id, attrs);
  }

  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  public readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  public readonly virtualServiceArn: string;

  /**
   * The AppMesh mesh name for whiich the VirtualService belongs to
   */
  public readonly virtualServiceMeshName: string;

  /**
   * The name of the VirtualRouter which the VirtualService uses as provider
   */
  public readonly virtualRouterName?: string;

  /**
   * The name of the VirtualNode attached to the virtual service
   */
  public readonly virtualNodeName?: string;

  private readonly virtualServiceProvider?: CfnVirtualService.VirtualServiceProviderProperty;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceProps) {
    super(scope, id);

    if (props.virtualNode && props.virtualRouter) {
      throw new Error('Must provide only one of virtualNode or virtualRouter for the provider');
    }

    this.virtualServiceMeshName = props.mesh.meshName;

    // Check which provider to use node or router
    if (props.virtualRouter) {
      this.virtualRouterName = props.virtualRouter.virtualRouterName;
      this.virtualServiceProvider = this.addVirtualRouter(this.virtualRouterName);
    } else if (props.virtualNode) {
      this.virtualNodeName = props.virtualNode.virtualNodeName;
      this.virtualServiceProvider = this.addVirtualNode(this.virtualNodeName);
    }

    const name = props.virtualServiceName;

    const svc = new CfnVirtualService(this, 'VirtualService', {
      meshName: this.virtualServiceMeshName,
      virtualServiceName: name,
      spec: {
        provider: this.virtualServiceProvider,
      },
    });

    this.virtualServiceArn = svc.ref;
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

/**
 * Interface with properties ncecessary to import a reusable VirtualService
 */
export interface ImportedVirtualServiceProps {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   *
   * @default if virtualServiceMeshName given, derived from serviceName and meshName
   */
  readonly virtualServiceArn?: string;

  /**
   * The name of the service mesh that the virtual service resides in
   *
   * @see use to derive ARN from mesh name if ARN not provided
   */
  readonly virtualServiceMeshName: string;
}

/**
 * Returns properties that allows a VirtualService to be imported
 */
class ImportedVirtualService extends cdk.Resource implements IVirtualService {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  public readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  public readonly virtualServiceArn: string;

  /**
   * The name of the service mesh that the virtual service resides in
   */
  public readonly virtualServiceMeshName: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceAttributes) {
    super(scope, id);

    this.virtualServiceName = props.virtualServiceName;
    this.virtualServiceMeshName = props.virtualServiceMeshName;

    this.virtualServiceArn =
      props.virtualServiceArn ||
      cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${this.virtualServiceMeshName}/virtualService`,
        resourceName: this.virtualServiceName,
      });
  }
}

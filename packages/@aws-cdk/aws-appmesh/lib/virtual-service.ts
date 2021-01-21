import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVirtualService } from './appmesh.generated';
import { ClientPolicy } from './client-policy';
import { IMesh, Mesh } from './mesh';
import { IVirtualNode } from './virtual-node';
import { IVirtualRouter } from './virtual-router';

/**
 * Represents the interface which all VirtualService based classes MUST implement
 */
export interface IVirtualService extends cdk.IResource {
  /**
   * The name of the VirtualService
   *
   * @attribute
   */
  readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   *
   * @attribute
   */
  readonly virtualServiceArn: string;

  /**
   * The Mesh which the VirtualService belongs to
   */
  readonly mesh: IMesh;

  /**
   * Client policy for this Virtual Service
   */
  readonly clientPolicy?: ClientPolicy;
}

/**
 * The base properties which all classes in VirtualService will inherit from
 */
export interface VirtualServiceBaseProps {
  /**
   * The name of the VirtualService.
   *
   * It is recommended this follows the fully-qualified domain name format,
   * such as "my-service.default.svc.cluster.local".
   *
   * @example service.domain.local
   * @default - A name is automatically generated
   */
  readonly virtualServiceName?: string;

  /**
   * The VirtualRouter which the VirtualService uses as provider
   *
   * @default - At most one of virtualRouter and virtualNode is allowed.
   */
  readonly virtualRouter?: IVirtualRouter;

  /**
   * The VirtualNode attached to the virtual service
   *
   * @default - At most one of virtualRouter and virtualNode is allowed.
   */
  readonly virtualNode?: IVirtualNode;

  /**
   * Client policy for this Virtual Service
   *
   * @default - none
   */
  readonly clientPolicy?: ClientPolicy;
}

/**
 * The properties applied to the VirtualService being define
 */
export interface VirtualServiceProps extends VirtualServiceBaseProps {
  /**
   * The Mesh which the VirtualService belongs to
   */
  readonly mesh: IMesh;
}

/**
 * VirtualService represents a service inside an AppMesh
 *
 * It routes traffic either to a Virtual Node or to a Virtual Router.
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_services.html
 */
export class VirtualService extends cdk.Resource implements IVirtualService {
  /**
   * Import an existing VirtualService given an ARN
   */
  public static fromVirtualServiceArn(scope: Construct, id: string, virtualServiceArn: string): IVirtualService {
    return new class extends cdk.Resource implements IVirtualService {
      readonly virtualServiceArn = virtualServiceArn;
      private readonly parsedArn = cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(virtualServiceArn).resourceName!);
      readonly virtualServiceName = cdk.Fn.select(2, this.parsedArn);
      readonly mesh = Mesh.fromMeshName(this, 'Mesh', cdk.Fn.select(0, this.parsedArn));
    }(scope, id);
  }

  /**
   * Import an existing VirtualService given its attributes
   */
  public static fromVirtualServiceAttributes(scope: Construct, id: string, attrs: VirtualServiceAttributes): IVirtualService {
    return new class extends cdk.Resource implements IVirtualService {
      readonly virtualServiceName = attrs.virtualServiceName;
      readonly mesh = attrs.mesh;
      readonly clientPolicy = attrs.clientPolicy;
      readonly virtualServiceArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${attrs.mesh.meshName}/virtualService`,
        resourceName: this.virtualServiceName,
      });
    }(scope, id);
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
   * The Mesh which the VirtualService belongs to
   */
  public readonly mesh: IMesh;

  public readonly clientPolicy?: ClientPolicy;

  private readonly virtualServiceProvider?: CfnVirtualService.VirtualServiceProviderProperty;

  constructor(scope: Construct, id: string, props: VirtualServiceProps) {
    super(scope, id, {
      physicalName: props.virtualServiceName || cdk.Lazy.string({ produce: () => cdk.Names.uniqueId(this) }),
    });

    if (props.virtualNode && props.virtualRouter) {
      throw new Error('Must provide only one of virtualNode or virtualRouter for the provider');
    }

    this.mesh = props.mesh;
    this.clientPolicy = props.clientPolicy;

    // Check which provider to use node or router (or neither)
    if (props.virtualRouter) {
      this.virtualServiceProvider = this.addVirtualRouter(props.virtualRouter.virtualRouterName);
    }
    if (props.virtualNode) {
      this.virtualServiceProvider = this.addVirtualNode(props.virtualNode.virtualNodeName);
    }

    const svc = new CfnVirtualService(this, 'Resource', {
      meshName: this.mesh.meshName,
      virtualServiceName: this.physicalName,
      spec: {
        provider: this.virtualServiceProvider,
      },
    });

    this.virtualServiceName = this.getResourceNameAttribute(svc.attrVirtualServiceName);
    this.virtualServiceArn = this.getResourceArnAttribute(svc.ref, {
      service: 'appmesh',
      resource: `mesh/${props.mesh.meshName}/virtualService`,
      resourceName: this.physicalName,
    });
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
export interface VirtualServiceAttributes {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  readonly virtualServiceName: string;

  /**
   * The Mesh which the VirtualService belongs to
   */
  readonly mesh: IMesh;

  /**
   * Client policy for this Virtual Service
   *
   * @default - none
   */
  readonly clientPolicy?: ClientPolicy;
}

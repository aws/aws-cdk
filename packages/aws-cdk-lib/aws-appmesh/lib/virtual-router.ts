import type { Construct } from 'constructs';
import type { IVirtualRouterRef, VirtualRouterReference } from './appmesh.generated';
import { CfnVirtualRouter } from './appmesh.generated';
import type { IMesh } from './mesh';
import { Mesh } from './mesh';
import { renderMeshOwner } from './private/utils';
import type { RouteBaseProps } from './route';
import { Route } from './route';
import { VirtualRouterListener } from './virtual-router-listener';
import * as cdk from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Interface which all VirtualRouter based classes MUST implement
 */
export interface IVirtualRouter extends cdk.IResource, IVirtualRouterRef {
  /**
   * The name of the VirtualRouter
   *
   * @attribute
   */
  readonly virtualRouterName: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualRouter
   *
   * @attribute
   */
  readonly virtualRouterArn: string;

  /**
   * The Mesh which the VirtualRouter belongs to
   */
  readonly mesh: IMesh;

  /**
   * Add a single route to the router
   */
  addRoute(id: string, props: RouteBaseProps): Route;
}

/**
 * Interface with base properties all routers willl inherit
 */
export interface VirtualRouterBaseProps {
  /**
   * Listener specification for the VirtualRouter
   *
   * @default - A listener on HTTP port 8080
   */
  readonly listeners?: VirtualRouterListener[];

  /**
   * The name of the VirtualRouter
   *
   * @default - A name is automatically determined
   */
  readonly virtualRouterName?: string;
}

abstract class VirtualRouterBase extends cdk.Resource implements IVirtualRouter {
  /**
   * The name of the VirtualRouter
   */
  public abstract readonly virtualRouterName: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualRouter
   */
  public abstract readonly virtualRouterArn: string;

  /**
   * The Mesh which the VirtualRouter belongs to
   */
  public abstract readonly mesh: IMesh;

  /**
   * Add a single route to the router
   */
  public addRoute(id: string, props: RouteBaseProps): Route {
    const route = new Route(this, id, {
      ...props,
      routeName: id,
      mesh: this.mesh,
      virtualRouter: this,
    });

    return route;
  }

  public get virtualRouterRef(): VirtualRouterReference {
    return { virtualRouterArn: this.virtualRouterArn };
  }
}

/**
 * The properties used when creating a new VirtualRouter
 */
export interface VirtualRouterProps extends VirtualRouterBaseProps {
  /**
   * The Mesh which the VirtualRouter belongs to
   */
  readonly mesh: IMesh;
}

@propertyInjectable
export class VirtualRouter extends VirtualRouterBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-appmesh.VirtualRouter';

  /**
   * Import an existing VirtualRouter given an ARN
   */
  public static fromVirtualRouterArn(scope: Construct, id: string, virtualRouterArn: string): IVirtualRouter {
    return new class extends VirtualRouterBase {
      readonly virtualRouterArn = virtualRouterArn;
      private readonly parsedArn = cdk.Fn.split('/', cdk.Stack.of(scope).splitArn(virtualRouterArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!);
      readonly virtualRouterName = cdk.Fn.select(2, this.parsedArn);
      readonly mesh = Mesh.fromMeshName(this, 'Mesh', cdk.Fn.select(0, this.parsedArn));
      public get virtualRouterRef(): VirtualRouterReference {
        return { virtualRouterArn: this.virtualRouterArn };
      }
    }(scope, id);
  }

  /**
   * Import an existing VirtualRouter given attributes
   */
  public static fromVirtualRouterAttributes(scope: Construct, id: string, attrs: VirtualRouterAttributes): IVirtualRouter {
    return new class extends VirtualRouterBase {
      readonly virtualRouterName = attrs.virtualRouterName;
      readonly mesh = attrs.mesh;
      readonly virtualRouterArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${attrs.mesh.meshName}/virtualRouter`,
        resourceName: this.virtualRouterName,
      });
      public get virtualRouterRef(): VirtualRouterReference {
        return { virtualRouterArn: this.virtualRouterArn };
      }
    }(scope, id);
  }

  /**
   * The name of the VirtualRouter
   */
  @memoizedGetter
  public get virtualRouterName(): string {
    return this.getResourceNameAttribute(this.resource.attrVirtualRouterName);
  }

  /**
   * The Amazon Resource Name (ARN) for the VirtualRouter
   */
  @memoizedGetter
  public get virtualRouterArn(): string {
    return this.getResourceArnAttribute(this.resource.ref, {
      service: 'appmesh',
      resource: `mesh/${this.mesh.meshName}/virtualRouter`,
      resourceName: this.physicalName,
    });
  }

  /**
   * The Mesh which the VirtualRouter belongs to
   */
  public readonly mesh: IMesh;

  private readonly listeners = new Array<CfnVirtualRouter.VirtualRouterListenerProperty>();
  private readonly resource: CfnVirtualRouter;

  constructor(scope: Construct, id: string, props: VirtualRouterProps) {
    super(scope, id, {
      physicalName: props.virtualRouterName || cdk.Lazy.string({ produce: () => cdk.Names.uniqueId(this) }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.mesh = props.mesh;
    if (props.listeners && props.listeners.length) {
      props.listeners.forEach(listener => this.addListener(listener));
    } else {
      this.addListener(VirtualRouterListener.http());
    }

    this.resource = new CfnVirtualRouter(this, 'Resource', {
      virtualRouterName: this.physicalName,
      meshName: this.mesh.meshName,
      meshOwner: renderMeshOwner(this.env.account, this.mesh.env.account),
      spec: {
        listeners: this.listeners,
      },
    });
  }

  /**
   * Add port mappings to the router
   */
  private addListener(listener: VirtualRouterListener) {
    this.listeners.push(listener.bind(this).listener);
  }
}

/**
 * Interface with properties ncecessary to import a reusable VirtualRouter
 */
export interface VirtualRouterAttributes {
  /**
   * The name of the VirtualRouter
   */
  readonly virtualRouterName: string;

  /**
   * The Mesh which the VirtualRouter belongs to
   */
  readonly mesh: IMesh;
}

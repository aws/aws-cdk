import cdk = require('@aws-cdk/core');

import { CfnVirtualRouter } from './appmesh.generated';
import { IMesh } from './mesh';
import { Route, RouteBaseProps } from './route';
import { PortMappingProps, Protocol } from './shared-interfaces';

/**
 * Interface which all VirtualRouter based classes MUST implement
 */
export interface IVirtualRouter extends cdk.IResource {
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
   * The  service mesh that the virtual router resides in
   */
  readonly mesh: IMesh;

  /**
   * Utility method for adding a single route to the router
   */
  addRoute(id: string, props: RouteBaseProps): Route;

  /**
   * Utility method to add multiple routes to the router
   */
  addRoutes(ids: string[], props: RouteBaseProps[]): Route[];
}

/**
 * Interface with base properties all routers willl inherit
 */
export interface VirtualRouterBaseProps {
  /**
   * Array of PortMappingProps for the virtual router
   */
  readonly portMappings: PortMappingProps[];

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
   * The AppMesh mesh the VirtualRouter belongs to
   */
  public abstract readonly mesh: IMesh;

  /**
   * Utility method for adding a single route to the router
   */
  public addRoute(id: string, props: RouteBaseProps): Route {
    const route = new Route(this, id, {
      routeName: id,
      mesh: this.mesh,
      virtualRouter: this,
      routeTargets: props.routeTargets,
      isHttpRoute: props.isHttpRoute,
      prefix: props.prefix,
    });

    return route;
  }

  /**
   * Utility method to add multiple routes to the router
   */
  public addRoutes(ids: string[], props: RouteBaseProps[]): Route[] {
    const routes = new Array<Route>();

    if (ids.length < 1 || props.length < 1) {
      throw new Error('When adding routes, IDs and Route Properties cannot be empty.');
    }
    if (ids.length !== props.length) {
      throw new Error('Routes must have the same number of IDs and RouteProps.');
    }

    for (let i = 0; i < ids.length; i++) {
      const route = new Route(this, ids[i], {
        routeName: ids[i],
        mesh: this.mesh,
        virtualRouter: this,
        routeTargets: props[i].routeTargets,
        isHttpRoute: props[i].isHttpRoute,
        prefix: props[i].prefix,
      });
      routes.push(route);
    }

    return routes;
  }
}

/**
 * The properties used when creating a new VritualRouter
 */
export interface VirtualRouterProps extends VirtualRouterBaseProps {
  /**
   * The AppMesh mesh the VirtualRouter belongs to
   */
  readonly mesh: IMesh;
}

export class VirtualRouter extends VirtualRouterBase {
  /**
   * Import an existing VirtualRouter given an ARN
   */
  public static fromVirtualRouterArn(scope: cdk.Construct, id: string, virtualRouterArn: string): IVirtualRouter {
    return new ImportedVirtualRouter(scope, id, { virtualRouterArn });
  }

  /**
   * Import an existing VirtualRouter given names
   */
  public static fromVirtualRouterName(scope: cdk.Construct, id: string, meshName: string, virtualRouterName: string): IVirtualRouter {
    return new ImportedVirtualRouter(scope, id, { meshName, virtualRouterName });
  }

  /**
   * The name of the VirtualRouter
   */
  public readonly virtualRouterName: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualRouter
   */
  public readonly virtualRouterArn: string;

  /**
   * The AppMesh mesh the VirtualRouter belongs to
   */
  public readonly mesh: IMesh;

  private readonly listeners = new Array<CfnVirtualRouter.VirtualRouterListenerProperty>();

  constructor(scope: cdk.Construct, id: string, props: VirtualRouterProps) {
    super(scope, id, {
      physicalName: props.virtualRouterName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId })
    });

    this.mesh = props.mesh;

    this.addListeners(props);

    const router = new CfnVirtualRouter(this, 'Resource', {
      virtualRouterName: this.physicalName,
      meshName: this.mesh.meshName,
      spec: {
        listeners: this.listeners,
      },
    });

    this.virtualRouterName = this.getResourceNameAttribute(router.attrVirtualRouterName);
    this.virtualRouterArn = this.getResourceArnAttribute(router.ref, {
      service: 'appmesh',
      resource: `mesh/${props.mesh.meshName}/virtualRouter`,
      resourceName: this.physicalName,
    });
  }

  /**
   * Add listeners to the router, such as ports and protocols
   */
  private addListeners(props: VirtualRouterBaseProps) {
    if (props.portMappings.length <= 0) {
      throw new Error('Portmappings cannot be empty for VirtualRouter listeners');
    } else if (props.portMappings.length > 1) {
      throw new Error('Only a listener length of one (1) is supported as of current release of Virtual Router Spec');
    }

    if (props.portMappings) {
      this.addPortMappings(props.portMappings);
    } else {
      const portMappings = [{ port: 8080, protocol: Protocol.HTTP }];
      this.addPortMappings(portMappings);
    }
  }

  private addPortMappings(props: PortMappingProps[]) {
    if (props.length <= 0) {
      throw new Error('Portmappings cannot be empty for VirtualRouter listeners');
    }

    for (const p of props) {
      this.listeners.push({
        portMapping: {
          port: p.port,
          protocol: p.protocol,
        },
      });
    }
  }
}

/**
 * Interface with properties ncecessary to import a reusable VirtualRouter
 */
interface VirtualRouterAttributes {
  /**
   * The name of the VirtualRouter
   */
  readonly virtualRouterName?: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualRouter
   */
  readonly virtualRouterArn?: string;

  /**
   * The AppMesh mesh the VirtualRouter belongs to
   */
  readonly meshName?: string;
}

/**
 * Used to import a VirtualRouter and perform actions or read properties from
 */
class ImportedVirtualRouter extends VirtualRouterBase {
  /**
   * The name of the VirtualRouter
   */
  public readonly virtualRouterName: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualRouter
   */
  public readonly virtualRouterArn: string;

  /**
   * The AppMesh mesh the VirtualRouter belongs to
   */
  public readonly mesh: IMesh;

  constructor(scope: cdk.Construct, id: string, props: VirtualRouterAttributes) {
    super(scope, id);

    if (props.virtualRouterArn) {
      this.virtualRouterArn = props.virtualRouterArn;
      this.virtualRouterName = cdk.Fn.select(2, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.virtualRouterArn).resourceName!));
    } else if (props.virtualRouterName && props.meshName) {
      this.virtualRouterName = props.virtualRouterName;
      this.virtualRouterArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${props.meshName}/virtualRouter`,
        resourceName: this.virtualRouterName,
      });
    } else {
      throw new Error('Need either arn or both names');
    }
  }
}

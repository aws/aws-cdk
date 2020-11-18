import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnRoute } from './appmesh.generated';
import { IMesh } from './mesh';
import { RouteSpec } from './route-spec';
import { IVirtualRouter } from './virtual-router';

/**
 * Interface for which all Route based classes MUST implement
 */
export interface IRoute extends cdk.IResource {
  /**
   * The name of the route
   *
   * @attribute
   */
  readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   *
   * @attribute
   */
  readonly routeArn: string;
}

/**
 * Base interface properties for all Routes
 */
export interface RouteBaseProps {
  /**
   * The name of the route
   *
   * @default - An automatically generated name
   */
  readonly routeName?: string;

  /**
   * Protocol specific spec
   */
  readonly routeSpec: RouteSpec;
}

/**
 * Properties to define new Routes
 */
export interface RouteProps extends RouteBaseProps {
  /**
   * The service mesh to define the route in
   */
  readonly mesh: IMesh;

  /**
   * The virtual router in which to define the route
   */
  readonly virtualRouter: IVirtualRouter;
}

/**
 * Route represents a new or existing route attached to a VirtualRouter and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/routes.html
 */
export class Route extends cdk.Resource implements IRoute {
  /**
   * Import an existing route given an ARN
   */
  public static fromRouteArn(scope: Construct, id: string, routeArn: string): IRoute {
    return new ImportedRoute(scope, id, { routeArn });
  }

  /**
   * Import an existing route given its name
   */
  public static fromRouteName(scope: Construct, id: string, meshName: string, virtualRouterName: string, routeName: string): IRoute {
    return new ImportedRoute(scope, id, { meshName, virtualRouterName, routeName });
  }

  /**
   * The name of the route
   */
  public readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  public readonly routeArn: string;

  /**
   * The virtual router this route is a part of
   */
  public readonly virtualRouter: IVirtualRouter;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id, {
      physicalName: props.routeName || cdk.Lazy.stringValue({ produce: () => cdk.Names.uniqueId(this) }),
    });

    this.virtualRouter = props.virtualRouter;

    const spec = props.routeSpec.bind(this);

    const route = new CfnRoute(this, 'Resource', {
      routeName: this.physicalName,
      meshName: this.virtualRouter.mesh.meshName,
      virtualRouterName: this.virtualRouter.virtualRouterName,
      spec: {
        tcpRoute: spec.tcpRouteSpec,
        httpRoute: spec.httpRouteSpec,
        http2Route: spec.http2RouteSpec,
        grpcRoute: spec.grpcRouteSpec,
      },
    });

    this.routeName = this.getResourceNameAttribute(route.attrRouteName);
    this.routeArn = this.getResourceArnAttribute(route.ref, {
      service: 'appmesh',
      resource: `mesh/${props.mesh.meshName}/virtualRouter/${props.virtualRouter.virtualRouterName}/route`,
      resourceName: this.physicalName,
    });
  }
}

/**
 * Interface with properties ncecessary to import a reusable Route
 */
interface RouteAttributes {
  /**
   * The name of the route
   */
  readonly routeName?: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  readonly routeArn?: string;

  /**
   * The name of the mesh this route is associated with
   */
  readonly meshName?: string;

  /**
   * The name of the virtual router this route is associated with
   */
  readonly virtualRouterName?: string;
}

/**
 * Represents and imported IRoute
 */
class ImportedRoute extends cdk.Resource implements IRoute {
  /**
   * The name of the route
   */
  public readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  public readonly routeArn: string;

  constructor(scope: Construct, id: string, props: RouteAttributes) {
    super(scope, id);

    if (props.routeArn) {
      this.routeArn = props.routeArn;
      this.routeName = cdk.Fn.select(4, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.routeArn).resourceName!));
    } else if (props.routeName && props.meshName && props.virtualRouterName) {
      this.routeName = props.routeName;
      this.routeArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${props.meshName}/virtualRouter/${props.virtualRouterName}/route`,
        resourceName: this.routeName,
      });
    } else {
      throw new Error('Need either arn or three names');
    }
  }
}

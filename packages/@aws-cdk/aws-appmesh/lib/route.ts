import cdk = require('@aws-cdk/core');

import { CfnRoute } from './appmesh.generated';
import { IMesh } from './mesh';
import { IVirtualNode } from './virtual-node';
import { IVirtualRouter } from './virtual-router';

/**
 * Interface with properties ncecessary to import a reusable Route
 */
export interface RouteAttributes {
  /**
   * The name of the route
   */
  readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  readonly routeArn?: string;

  /**
   * The VirtualRouter the route is associated with
   */
  readonly virtualRouter: IVirtualRouter;
}

/**
 * Interface for which all Route based classes MUST implement
 */
export interface IRoute extends cdk.IResource {
  /**
   * The name of the route
   */
  readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  readonly routeArn: string;

  /**
   * The VirtualRouter the route is associated with
   */
  readonly virtualRouter: IVirtualRouter;
}

/**
 * Base interface properties for all Routes
 */
export interface RouteBaseProps {
  /**
   * The name of the route
   */
  readonly routeName?: string;

  /**
   * The path prefix to match for the route
   *
   * @default "/" if http otherwise none
   */
  readonly prefix?: string;

  /**
   * Array of weighted route targets
   *
   * @requires minimum of 1
   */
  readonly routeTargets: WeightedTargetProps[];

  /**
   * Weather the route is HTTP based
   *
   * @default false
   */
  readonly isHttpRoute?: boolean;
}

/**
 * Properties for the Weighted Targets in the route
 */
export interface WeightedTargetProps {
  /**
   * The VirtualNode the route points to
   */
  readonly virtualNode: IVirtualNode;

  /**
   * The weight for the target
   *
   * @default 1
   */
  readonly weight?: number;
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
   * A static method to import a Route an make it re-usable accross stacks
   */
  public static fromRouteAttributes(scope: cdk.Construct, id: string, props: RouteAttributes): IRoute {
    return new ImportedRoute(scope, id, props);
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
   * The name of the service mesh that the route resides in
   */
  public readonly routeMeshName: string;

  /**
   * The virtual router this route is a part of
   */
  public readonly virtualRouter: IVirtualRouter;

  /**
   * The name of the VirtualRouter the route is associated with
   */
  public readonly routeVirtualRouterName: string;

  private readonly weightedTargets = new Array<CfnRoute.WeightedTargetProperty>();
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: cdk.Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.routeMeshName = props.mesh.meshName;
    this.routeVirtualRouterName = props.virtualRouter.virtualRouterName;

    this.routeName = props && props.routeName ? props.routeName : this.node.id;

    if (props.isHttpRoute) {
      this.httpRoute = this.addHttpRoute(props);
    } else {
      this.tcpRoute = this.addTcpRoute(props.routeTargets);
    }

    const route = new CfnRoute(this, 'VirtualRoute', {
      routeName: this.routeName,
      meshName: this.routeMeshName,
      virtualRouterName: this.routeVirtualRouterName,
      spec: {
        tcpRoute: this.tcpRoute,
        httpRoute: this.httpRoute,
      },
    });

    this.routeArn = route.ref;
  }

  /**
   * Utility method to add weighted route targets to an existing route
   */
  private addWeightedTargets(props: WeightedTargetProps[]) {
    for (const t of props) {
      this.weightedTargets.push({
        virtualNode: t.virtualNode.virtualNodeName,
        weight: t.weight || 1,
      });
    }

    return this.weightedTargets;
  }

  private addHttpRoute(props: RouteProps) {
    return {
      match: {
        prefix: props.prefix || '/',
      },
      action: {
        weightedTargets: this.addWeightedTargets(props.routeTargets),
      },
    };
  }

  private addTcpRoute(props: WeightedTargetProps[]) {
    return {
      action: {
        weightedTargets: this.addWeightedTargets(props),
      },
    };
  }
}

/**
 * Interface with properties ncecessary to import a reusable Route
 */
export interface ImportedRouteProps {
  /**
   * The name of the route
   */
  readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  readonly routeArn?: string;

  /**
   * The name of the service mesh that the route resides in
   */
  readonly routeMeshName: string;

  /**
   * The name of the VirtualRouter the route is associated with
   */
  readonly routeVirtualRouterName: string;
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

  /**
   * The virtual router this route is associated with
   */
  public readonly virtualRouter: IVirtualRouter;

  constructor(scope: cdk.Construct, id: string, private readonly props: RouteAttributes) {
    super(scope, id);

    this.routeName = props.routeName;
    this.virtualRouter = props.virtualRouter;

    // arn:aws:appmesh:us-east-2:935516422975:mesh/awsm-mesh/virtualRouter/cars-router/route/cars-route
    this.routeArn = props.routeArn || `${this.virtualRouter.virtualRouterArn}/route/${this.routeName}`;
  }

  /**
   * Exports properties for a reusable Route
   */
  public export() {
    return this.props;
  }
}

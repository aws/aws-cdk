import cdk = require('@aws-cdk/cdk');

import { CfnRoute } from './appmesh.generated';
import { IMesh } from './mesh';
import { IVirtualNode } from './virtual-node';
import { IVirtualRouter } from './virtual-router';

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
   * The unique identifier for the route
   */
  readonly routeUid: string;

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
   * The unique identifier for the route
   */
  readonly routeUid: string;

  /**
   * The name of the service mesh that the route resides in
   */
  readonly routeMeshName: string;

  /**
   * The name of the VirtualRouter the route is associated with
   */
  readonly routeVirtualRouterName: string;

  /**
   * Exports properties for a reusable Route
   */
  export(): ImportedRouteProps;
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
  public static import(scope: cdk.Construct, id: string, props: ImportedRouteProps): IRoute {
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
   * The unique identifier for the route
   */
  public readonly routeUid: string;

  /**
   * The name of the service mesh that the route resides in
   */
  public readonly routeMeshName: string;

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

    this.routeArn = route.routeArn;
    this.routeUid = route.routeUid;
  }

  /**
   * Exports properties for a reusable Route
   */
  public export(): ImportedRouteProps {
    return {
      routeName: new cdk.CfnOutput(this, 'RouteName', { value: this.routeName }).makeImportValue().toString(),
      routeArn: new cdk.CfnOutput(this, 'RouteArn', { value: this.routeArn }).makeImportValue().toString(),
      routeMeshName: new cdk.CfnOutput(this, 'RouteMeshName', { value: this.routeMeshName })
        .makeImportValue()
        .toString(),
      routeVirtualRouterName: this.routeVirtualRouterName,
      routeUid: this.routeUid,
    };
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
 * Represents and imported IRoute
 */
export class ImportedRoute extends cdk.Construct implements IRoute {
  /**
   * The name of the route
   */
  public readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  public readonly routeArn: string;

  /**
   * The unique identifier for the route
   */
  public readonly routeUid: string;

  /**
   * The name of the service mesh that the route resides in
   */
  public readonly routeMeshName: string;

  /**
   * The name of the VirtualRouter the route is associated with
   */
  public readonly routeVirtualRouterName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: ImportedRouteProps) {
    super(scope, id);

    this.routeName = props.routeName;
    this.routeMeshName = props.routeMeshName;
    this.routeVirtualRouterName = props.routeVirtualRouterName;

    // arn:aws:appmesh:us-east-2:935516422975:mesh/awsm-mesh/virtualRouter/cars-router/route/cars-route
    this.routeArn =
      props.routeArn ||
      this.node.stack.formatArn({
        service: 'appmesh',
        resource: `mesh/${this.routeMeshName}/virtualRouter/${this.routeVirtualRouterName}/route`,
        resourceName: this.routeName,
      });

    this.routeUid = props.routeUid;
  }

  /**
   * Exports properties for a reusable Route
   */
  public export() {
    return this.props;
  }
}

import cdk = require('@aws-cdk/cdk');

import { CfnRoute } from './appmesh.generated';

export interface IRoute {
  /**
   * The name of the service mesh that the route resides in
   *
   * @type {string}
   * @memberof Route
   */
  readonly routeMeshName: string;
  /**
   * The name of the route
   *
   * @type {string}
   * @memberof Route
   */
  readonly routeName: string;
  /**
   * The Amazon Resource Name (ARN) for the route
   *
   * @type {string}
   * @memberof Route
   */
  readonly routeArn: string;
  /**
   * The unique identifier for the route
   *
   * @type {string}
   * @memberof Route
   */
  readonly routeUid: string;
  /**
   * The name of the VirtualRouter the route is associated with
   *
   * @type {string}
   * @memberof Route
   */
  readonly routeVirtualRouterName: string;
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
   * The name of the VirtualNode the route points to
   */
  readonly virtualNodeName: string;
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
   * The name of the service mesh to define the route in
   */
  readonly meshName: string;
  /**
   * The name of the virtual router in which to define the route
   */
  readonly virtualRouterName: string;
}

/**
 * Route represents a new or existing route attached to a VirtualRouter and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/routes.html
 */
export class Route extends cdk.Construct implements IRoute {
  /**
   * The name of the service mesh that the route resides in
   *
   * @type {string}
   * @memberof Route
   */
  public readonly routeMeshName: string;
  /**
   * The name of the route
   *
   * @type {string}
   * @memberof Route
   */
  public readonly routeName: string;
  /**
   * The Amazon Resource Name (ARN) for the route
   *
   * @type {string}
   * @memberof Route
   */
  public readonly routeArn: string;
  /**
   * The unique identifier for the route
   *
   * @type {string}
   * @memberof Route
   */
  public readonly routeUid: string;
  /**
   * The name of the VirtualRouter the route is associated with
   *
   * @type {string}
   * @memberof Route
   */
  public readonly routeVirtualRouterName: string;

  private readonly weightedTargets: CfnRoute.WeightedTargetProperty[] = [];
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: cdk.Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.routeMeshName = props.meshName;
    this.routeVirtualRouterName = props.virtualRouterName;

    this.routeName = props && props.routeName ? props.routeName : this.node.id;

    if (props.isHttpRoute && props.routeTargets) {
      this.httpRoute = this.addHttpRoute(props);
    } else if (!props.isHttpRoute && props.routeTargets) {
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
   * Utility method to add weighted route targets to an existing route
   *
   * @param {WeightedTargetProps[]} props
   * @returns
   * @memberof Route
   */
  public addWeightedTargets(props: WeightedTargetProps[]) {
    props.map(t => {
      this.weightedTargets.push({
        virtualNode: t.virtualNodeName,
        weight: t.weight || 1,
      });
    });

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

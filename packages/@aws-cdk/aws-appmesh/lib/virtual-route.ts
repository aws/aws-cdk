import cdk = require('@aws-cdk/cdk');

import { CfnRoute } from './appmesh.generated';
import { IMesh } from './mesh';
import { IVirtualNode } from './virtual-node';

/**
 * Interface with properties ncecessary to import a reusable Route
 */
export interface RouteImportProps {
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
}

/**
 * Interface for which all Route based classes MUST implement
 */
export interface IRoute extends cdk.IConstruct {
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
   * Exports properties for a reusable Route
   */
  export(): RouteImportProps;
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
 * Represents a new or imported Route
 */
export abstract class RouteBase extends cdk.Construct implements IRoute {
  /**
   * The name of the route
   */
  public abstract readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  public abstract readonly routeArn: string;

  /**
   * The unique identifier for the route
   */
  public abstract readonly routeUid: string;

  /**
   * Exports properties for a reusable Route
   */
  public abstract export(): RouteImportProps;
}

/**
 * Properties to define new Routes
 */
export interface RouteProps extends RouteBaseProps {
  /**
   * The name of the service mesh to define the route in
   */
  readonly mesh: IMesh;

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
export class Route extends RouteBase {
  /**
   * A static method to import a Route an make it re-usable accross stacks
   */
  public static import(scope: cdk.Construct, id: string, props: RouteImportProps): IRoute {
    return new ImportedRoute(scope, id, props);
  }

  /**
   * The name of the service mesh that the route resides in
   */
  public readonly routeMeshName: string;

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
   * The name of the VirtualRouter the route is associated with
   */
  public readonly routeVirtualRouterName: string;

  private readonly weightedTargets = new Array<CfnRoute.WeightedTargetProperty>();
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: cdk.Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.routeMeshName = props.mesh.meshName;
    this.routeVirtualRouterName = props.virtualRouterName;

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
  public export(): RouteImportProps {
    return {
      routeName: this.routeName,
      routeArn: this.routeArn,
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
export class ImportedRoute extends RouteBase {
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

  constructor(scope: cdk.Construct, id: string, props: RouteImportProps) {
    super(scope, id);

    this.routeName = props.routeName;
    this.routeArn = props.routeArn;
    this.routeUid = props.routeUid;
  }

  /**
   * Exports properties for a reusable Route
   */
  public export(): RouteImportProps {
    return {
      routeName: this.routeName,
      routeArn: this.routeArn,
      routeUid: this.routeUid,
    };
  }
}

import * as cdk from '@aws-cdk/cdk';
import { CfnRoute } from './appmesh.generated';

// TODO: Add import() and eport() capabilities

/**
 * Base interface properties for all Routes
 */
export interface VirtualRouteBaseProps {
  /**
   * The name for the route as an identifier
   */
  readonly virtualRouteName?: string;
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
 * Properties to create new VirtualRoutes
 */
export interface VirtualRouteProps extends VirtualRouteBaseProps {
  /**
   * The name of the AppMesh mesh the route belongs to
   */
  readonly meshName: string;
  /**
   * The name of the VirtualRouter the route belongs to
   */
  readonly virtualRouterName: string;
}

/**
 * VirtualRoute represents a new or existing route attached to a VirtualRouter and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/routes.html
 */
export class VirtualRoute extends cdk.Construct {
  /**
   * The name of the AppMesh mesh the route belongs to
   *
   * @type {string}
   * @memberof VirtualRoute
   */
  public readonly meshName: string;
  public readonly virtualRouterName: string;
  public readonly virtualRouteName: string;

  private readonly weightedTargets: CfnRoute.WeightedTargetProperty[] = [];
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: cdk.Construct, id: string, props: VirtualRouteProps) {
    super(scope, id);

    this.meshName = props.meshName;
    this.virtualRouterName = props.virtualRouterName;

    this.virtualRouteName = props && props.virtualRouteName ? props.virtualRouteName : this.node.id;

    if (props.isHttpRoute && props.routeTargets) {
      this.httpRoute = this.addHttpRoute(props);
    } else if (!props.isHttpRoute && props.routeTargets) {
      this.tcpRoute = this.addTcpRoute(props.routeTargets);
    }

    new CfnRoute(this, 'VirtualRoute', {
      routeName: this.virtualRouteName,
      meshName: this.meshName,
      virtualRouterName: this.virtualRouterName,
      spec: {
        tcpRoute: this.tcpRoute,
        httpRoute: this.httpRoute,
      },
    });
  }

  public addWeightedTargets(props: WeightedTargetProps[]) {
    props.map(t => {
      this.weightedTargets.push({
        virtualNode: t.virtualNodeName,
        weight: t.weight || 1,
      });
    });

    return this.weightedTargets;
  }

  private addHttpRoute(props: VirtualRouteProps) {
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

import cdk = require('@aws-cdk/core');

import { CfnRoute } from './appmesh.generated';
import { IMesh } from './mesh';
import { IVirtualNode } from './virtual-node';
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
   * @default - HTTP if `prefix` is given, TCP otherwise
   */
  readonly routeType?: RouteType;
}

/**
 * Type of route
 */
export enum RouteType {
  /**
   * HTTP route
   */
  HTTP = 'http',

  /**
   * TCP route
   */
  TCP = 'tcp'
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
   * Import an existing route given an ARN
   */
  public static fromRouteArn(scope: cdk.Construct, id: string, routeArn: string): IRoute {
    return new ImportedRoute(scope, id, { routeArn });
  }

  /**
   * Import an existing route given its name
   */
  public static fromRouteName(scope: cdk.Construct, id: string, meshName: string, virtualRouterName: string, routeName: string): IRoute {
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

  private readonly weightedTargets = new Array<CfnRoute.WeightedTargetProperty>();
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: cdk.Construct, id: string, props: RouteProps) {
    super(scope, id, {
      physicalName: props.routeName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId })
    });

    this.virtualRouter = props.virtualRouter;

    const routeType = props.routeType !== undefined ? props.routeType :
      props.prefix !== undefined ? RouteType.HTTP :
      RouteType.TCP;

    if (routeType === RouteType.HTTP) {
      this.httpRoute = this.renderHttpRoute(props);
    } else {
      this.tcpRoute = this.renderTcpRoute(props);
    }

    const route = new CfnRoute(this, 'Resource', {
      routeName: this.physicalName,
      meshName: this.virtualRouter.mesh.meshName,
      virtualRouterName: this.virtualRouter.virtualRouterName,
      spec: {
        tcpRoute: this.tcpRoute,
        httpRoute: this.httpRoute,
      },
    });

    this.routeName = this.getResourceNameAttribute(route.attrRouteName);
    this.routeArn = this.getResourceArnAttribute(route.ref, {
      service: 'appmesh',
      resource: `mesh/${props.mesh.meshName}/virtualRouter/${props.virtualRouter.virtualRouterName}/route`,
      resourceName: this.physicalName,
    });
  }

  /**
   * Utility method to add weighted route targets to an existing route
   */
  private renderWeightedTargets(props: WeightedTargetProps[]) {
    for (const t of props) {
      this.weightedTargets.push({
        virtualNode: t.virtualNode.virtualNodeName,
        weight: t.weight || 1,
      });
    }

    return this.weightedTargets;
  }

  private renderHttpRoute(props: RouteProps) {
    return {
      match: {
        prefix: props.prefix || '/',
      },
      action: {
        weightedTargets: this.renderWeightedTargets(props.routeTargets),
      },
    };
  }

  private renderTcpRoute(props: RouteProps) {
    return {
      action: {
        weightedTargets: this.renderWeightedTargets(props.routeTargets),
      },
    };
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

  constructor(scope: cdk.Construct, id: string, props: RouteAttributes) {
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

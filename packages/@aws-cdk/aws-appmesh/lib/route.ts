import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnRoute } from './appmesh.generated';
import { IMesh, Mesh } from './mesh';
import { IVirtualNode } from './virtual-node';
import { IVirtualRouter, VirtualRouter } from './virtual-router';

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

  /**
   * The VirtualRouter the Route belongs to
   */
  readonly virtualRouter: IVirtualRouter;
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
   * The VirtualRouter the Route belongs to
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
   * Import an existing Route given an ARN
   */
  public static fromRouteArn(scope: Construct, id: string, routeArn: string): IRoute {
    return new class extends cdk.Resource implements IRoute {
      readonly routeArn = routeArn;
      readonly mesh = Mesh.fromMeshName(this, 'Mesh', cdk.Fn.select(0, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(routeArn).resourceName!)));
      readonly virtualRouter = VirtualRouter.fromVirtualRouterAttributes(this, 'VirtualRouter', {
        mesh: this.mesh,
        virtualRouterName: cdk.Fn.select(2, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(routeArn).resourceName!)),
      });
      readonly routeName = cdk.Fn.select(4, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(routeArn).resourceName!));
    }(scope, id);
  }

  /**
   * Import an existing Route given attributes
   */
  public static fromRouteAttributes(scope: Construct, id: string, attrs: RouteAttributes): IRoute {
    return new class extends cdk.Resource implements IRoute {
      readonly routeName = attrs.routeName;
      readonly virtualRouter = attrs.virtualRouter;
      readonly routeArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${attrs.virtualRouter.mesh.meshName}/virtualRouter/${attrs.virtualRouter.virtualRouterName}/route`,
        resourceName: this.routeName,
      });
    }(scope, id);
  }

  /**
   * The name of the Route
   */
  public readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  public readonly routeArn: string;

  /**
   * The VirtualRouter the Route belongs to
   */
  public readonly virtualRouter: IVirtualRouter;

  private readonly weightedTargets = new Array<CfnRoute.WeightedTargetProperty>();
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id, {
      physicalName: props.routeName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId }),
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
export interface RouteAttributes {
  /**
   * The name of the Route
   */
  readonly routeName: string;

  /**
   * The VirtualRouter the Route belongs to
   */
  readonly virtualRouter: IVirtualRouter;
}

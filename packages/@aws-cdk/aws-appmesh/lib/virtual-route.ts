import * as cdk from '@aws-cdk/cdk';
import { CfnRoute } from './appmesh.generated';
import { Mesh } from './mesh';
import { VirtualRouter } from './virtual-router';

// TODO: Add import() and eport() capabilities

export interface RouteTargetProps {
  readonly virtualNodeName: string;
  /**
   * @default 1
   */
  readonly weight?: number;
  /**
   * @default none
   */
}

export interface AddVirtualRouteProps {
  /**
   * @default none
   */
  readonly prefix?: string;
  readonly routeTargets: RouteTargetProps[];
  readonly isHttpRoute?: boolean;
}

export interface VirtualRouteProps {
  readonly name?: string;
  readonly mesh: Mesh;
  readonly router: VirtualRouter;
  /**
   * @default none
   */
  readonly prefix?: string;
  readonly routeTargets: RouteTargetProps[];
  readonly isHttpRoute?: boolean;
}

export class VirtualRoute extends cdk.Construct {
  public readonly mesh: Mesh;
  public readonly router: VirtualRouter;

  private readonly weightedTargets: CfnRoute.WeightedTargetProperty[] = [];
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: cdk.Construct, id: string, props: VirtualRouteProps) {
    super(scope, id);

    this.mesh = props.mesh;
    this.router = props.router;

    const name = props && props.name ? props.name : this.node.id;

    if (props.isHttpRoute && props.routeTargets) {
      this.httpRoute = this.addHttpRoute(props);
    } else if (!props.isHttpRoute && props.routeTargets) {
      this.tcpRoute = this.addTcpRoute(props.routeTargets);
    }

    new CfnRoute(this, 'VirtualRoute', {
      routeName: name,
      meshName: this.mesh.meshName,
      virtualRouterName: this.router.virtualRouterName,
      spec: {
        tcpRoute: this.tcpRoute,
        httpRoute: this.httpRoute,
      },
    });
  }

  public addWeightedTargets(props: RouteTargetProps[]) {
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

  private addTcpRoute(props: RouteTargetProps[]) {
    return {
      action: {
        weightedTargets: this.addWeightedTargets(props),
      },
    };
  }
}

import * as cdk from '@aws-cdk/cdk';
import { CfnRoute } from './appmesh.generated';
import { VirtualRouter } from './virtual-router';

// TODO: Add import() and eport() capabilities

export interface VirtualRouteBaseProps {
  readonly name?: string;
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

export interface VirtualRouteProps extends VirtualRouteBaseProps {
  readonly meshName: string;
  readonly router: VirtualRouter;
}

export class VirtualRoute extends cdk.Construct {
  public readonly meshName: string;
  public readonly router: VirtualRouter;

  private readonly weightedTargets: CfnRoute.WeightedTargetProperty[] = [];
  private readonly httpRoute?: CfnRoute.HttpRouteProperty;
  private readonly tcpRoute?: CfnRoute.TcpRouteProperty;

  constructor(scope: cdk.Construct, id: string, props: VirtualRouteProps) {
    super(scope, id);

    this.meshName = props.meshName;
    this.router = props.router;

    const name = props && props.name ? props.name : this.node.id;

    if (props.isHttpRoute && props.routeTargets) {
      this.httpRoute = this.addHttpRoute(props);
    } else if (!props.isHttpRoute && props.routeTargets) {
      this.tcpRoute = this.addTcpRoute(props.routeTargets);
    }

    new CfnRoute(this, 'VirtualRoute', {
      routeName: name,
      meshName: this.meshName,
      virtualRouterName: this.router.virtualRouterName,
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

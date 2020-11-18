import * as cdk from '@aws-cdk/core';
import { CfnRoute } from './appmesh.generated';
import { Protocol } from './shared-interfaces';
import { IVirtualNode } from './virtual-node';

/**
 * Properties for the Weighted Targets in the route
 */
export interface WeightedTarget {
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
 * The criterion for determining a request match for this GatewayRoute
 */
export interface HttpRouteMatch {
  /**
   * Specifies the path to match requests with.
   * This parameter must always start with /, which by itself matches all requests to the virtual service name.
   * You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   * and you want the route to match requests to my-service.local/metrics, your prefix should be /metrics.
   */
  readonly prefixPath: string;
}

/**
 * The criterion for determining a request match for this GatewayRoute
 */
export interface GrpcRouteMatch {
  /**
   * The fully qualified domain name for the service to match from the request
   */
  readonly serviceName: string;
}

/**
 * Properties specific for HTTP Based Routes
 */
export interface HttpRouteSpecOptions {
  /**
   * The criterion for determining a request match for this Route
   *
   * @default - matches on '/'
   */
  readonly match?: HttpRouteMatch;

  /**
   * List of targets that traffic is routed to when a request matches the route
   */
  readonly weightedTargets: WeightedTarget[];
}

/**
 * Properties specific for a TCP Based Routes
 */
export interface TcpRouteSpecOptions {
  /**
   * List of targets that traffic is routed to when a request matches the route
   */
  readonly weightedTargets: WeightedTarget[];
}

/**
 * Properties specific for a GRPC Based Routes
 */
export interface GrpcRouteSpecOptions {
  /**
   * The criterion for determining a request match for this Route
   *
   * @default - no default
   */
  readonly match: GrpcRouteMatch;

  /**
   * List of targets that traffic is routed to when a request matches the route
   */
  readonly weightedTargets: WeightedTarget[];
}

/**
 * All Properties for GatewayRoute Specs
 */
export interface RouteSpecConfig {
  /**
   * The spec for an http route
   *
   * @default - no http spec
   */
  readonly httpRouteSpec?: CfnRoute.HttpRouteProperty;

  /**
   * The spec for an http2 route
   *
   * @default - no http2 spec
   */
  readonly http2RouteSpec?: CfnRoute.HttpRouteProperty;

  /**
   * The spec for a grpc route
   *
   * @default - no grpc spec
   */
  readonly grpcRouteSpec?: CfnRoute.GrpcRouteProperty;

  /**
   * The spec for a tcp route
   *
   * @default - no tcp spec
   */
  readonly tcpRouteSpec?: CfnRoute.TcpRouteProperty;
}

/**
 * Used to generate specs with different protocols for a RouteSpec
 */
export abstract class RouteSpec {
  /**
   * Creates an HTTP Based RouteSpec
   */
  public static http(options: HttpRouteSpecOptions): RouteSpec {
    return new HttpRouteSpec(options, Protocol.HTTP);
  }

  /**
   * Creates an HTTP2 Based RouteSpec
   *
   */
  public static http2(options: HttpRouteSpecOptions): RouteSpec {
    return new HttpRouteSpec(options, Protocol.HTTP2);
  }

  /**
   * Creates a TCP Based RouteSpec
   */
  public static tcp(options: TcpRouteSpecOptions): RouteSpec {
    return new TcpRouteSpec(options);
  }

  /**
   * Creates a GRPC Based RouteSpec
   */
  public static grpc(options: GrpcRouteSpecOptions): RouteSpec {
    return new GrpcRouteSpec(options);
  }

  /**
   * List of targets that traffic is routed to when a request matches the route
   */
  abstract readonly weightedTargets: WeightedTarget[];

  /**
   * Called when the GatewayRouteSpec type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: cdk.Construct): RouteSpecConfig;

  /**
  * Utility method to add weighted route targets to an existing route
  */
  protected renderWeightedTargets() {
    const renderedTargets: CfnRoute.WeightedTargetProperty[] = [];
    for (const t of this.weightedTargets) {
      renderedTargets.push({
        virtualNode: t.virtualNode.virtualNodeName,
        weight: t.weight || 1,
      });
    }
    return renderedTargets;
  }
}

class HttpRouteSpec extends RouteSpec {
  /**
   * Type of route you are creating
   */
  public readonly protocol: Protocol;

  /**
   * The criteria for determining a request match
   */
  public readonly match?: HttpRouteMatch;

  /**
   * List of targets that traffic is routed to when a request matches the route
   */
  public readonly weightedTargets: WeightedTarget[];

  constructor(props: HttpRouteSpecOptions, protocol: Protocol) {
    super();
    this.protocol = protocol;
    this.match = props.match;
    this.weightedTargets = props.weightedTargets;
  }

  public bind(_scope: cdk.Construct): RouteSpecConfig {
    const prefixPath = this.match ? this.match.prefixPath : '/';
    if (prefixPath[0] != '/') {
      throw new Error(`Prefix Path must start with \'/\', got: ${prefixPath}`);
    }
    const httpConfig: CfnRoute.HttpRouteProperty = {
      action: {
        weightedTargets: this.renderWeightedTargets(),
      },
      match: {
        prefix: prefixPath,
      },
    };
    return {
      httpRouteSpec: this.protocol === Protocol.HTTP ? httpConfig : undefined,
      http2RouteSpec: this.protocol === Protocol.HTTP2 ? httpConfig : undefined,
    };
  }
}

class TcpRouteSpec extends RouteSpec {
  /*
   * List of targets that traffic is routed to when a request matches the route
   */
  public readonly weightedTargets: WeightedTarget[];

  constructor(props: TcpRouteSpecOptions) {
    super();
    this.weightedTargets = props.weightedTargets;
  }

  public bind(_scope: cdk.Construct): RouteSpecConfig {
    return {
      tcpRouteSpec: {
        action: {
          weightedTargets: this.renderWeightedTargets(),
        },
      },
    };
  }
}

class GrpcRouteSpec extends RouteSpec {
  public readonly weightedTargets: WeightedTarget[];
  public readonly match: GrpcRouteMatch;

  constructor(props: GrpcRouteSpecOptions) {
    super();
    this.weightedTargets = props.weightedTargets;
    this.match = props.match;
  }

  public bind(_scope: cdk.Construct): RouteSpecConfig {
    return {
      grpcRouteSpec: {
        action: {
          weightedTargets: this.renderWeightedTargets(),
        },
        match: {
          serviceName: this.match.serviceName,
        },
      },
    };
  }
}
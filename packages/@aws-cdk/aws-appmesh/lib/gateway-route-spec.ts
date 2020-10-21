import * as cdk from '@aws-cdk/core';
import { CfnGatewayRoute } from './appmesh.generated';
import { Protocol } from './shared-interfaces';
import { IVirtualService } from './virtual-service';

/**
 * Properties specific for a GRPC GatewayRoute
 */
export interface GrpcRouteSpecProps {
  /**
   * The criterion for determining a request match for this GatewayRoute
   */
  readonly match: GrpcGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;
}

/**
 * All Properties for GatewayRoute Specs
 */
export interface GatewayRouteSpecConfig {
  /**
   * The spec for an http gateway route
   *
   * @default - no http spec
   */
  readonly httpSpecConfig?: CfnGatewayRoute.HttpGatewayRouteProperty;
  /**
   * The spec for an http2 gateway route
   *
   * @default - no http2 spec
   */
  readonly http2SpecConfig?: CfnGatewayRoute.HttpGatewayRouteProperty;
  /**
   * The spec for a grpc gateway route
   *
   * @default - no grpc spec
   */
  readonly grpcSpecConfig?: CfnGatewayRoute.GrpcGatewayRouteProperty;
}

/**
 * Used to generate specs with different protocols for a GatewayRoute
 */
export abstract class GatewayRouteSpec {
  /**
   * Creates an HTTP Based GatewayRoute
   *
   * @param props - no http gateway route
   */
  public static httpRouteSpec(props: HttpRouteSpecProps): GatewayRouteSpec {
    return new HttpGatewayRouteSpec(props, Protocol.HTTP);
  }

  /**
   * Creates an HTTP2 Based GatewayRoute
   *
   * @param props - no http2 gateway route
   */
  public static http2RouteSpec(props: HttpRouteSpecProps): GatewayRouteSpec {
    return new HttpGatewayRouteSpec(props, Protocol.HTTP2);
  }

  /**
   * Creates an GRPC Based GatewayRoute
   *
   * @param props - no grpc gateway route
   */
  public static grpcRouteSpec(props: GrpcRouteSpecProps): GatewayRouteSpec {
    return new GrpcGatewayRouteSpec(props);
  }

  /**
   * Called when the GatewayRouteSpec type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: cdk.Construct): GatewayRouteSpecConfig;
}

class HttpGatewayRouteSpec extends GatewayRouteSpec {
  /**
   * The criterion for determining a request match for this GatewayRoute.
   *
   * @default - matches on '/'
   */
  readonly match?: HttpGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;
  /**
   * Type of route you are creating
   */
  readonly routeType: Protocol;

  constructor(props: HttpRouteSpecProps, protocol: Protocol.HTTP | Protocol.HTTP2) {
    super();
    this.routeTarget = props.routeTarget;
    this.routeType = protocol;
    this.match = props.match;
  }
  public bind(_scope: cdk.Construct): GatewayRouteSpecConfig {
    const prefixPath = this.match ? this.match.prefixPath : '/';
    if (prefixPath[0] != '/') {
      throw new Error('Prefix Path must start with \'/\'');
    }
    const httpConfig: CfnGatewayRoute.HttpGatewayRouteProperty = {
      match: {
        prefix: prefixPath,
      },
      action: {
        target: {
          virtualService: {
            virtualServiceName: this.routeTarget.virtualServiceName,
          },
        },
      },
    };
    return {
      httpSpecConfig: this.routeType === Protocol.HTTP ? httpConfig : undefined,
      http2SpecConfig: this.routeType === Protocol.HTTP2 ? httpConfig : undefined,
    };
  }
}

class GrpcGatewayRouteSpec extends GatewayRouteSpec {
  /**
   * The criterion for determining a request match for this GatewayRoute.
   *
   * @default - no default
   */
  readonly match: GrpcGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;

  constructor(props: GrpcRouteSpecProps) {
    super();
    this.match = props.match;
    this.routeTarget = props.routeTarget;
  }

  public bind(_scope: cdk.Construct): GatewayRouteSpecConfig {
    return {
      grpcSpecConfig: {
        action: {
          target: {
            virtualService: {
              virtualServiceName: this.routeTarget.virtualServiceName,
            },
          },
        },
        match: {
          serviceName: this.match.serviceName,
        },
      },
    };
  }
}

/**
 * The criterion for determining a request match for this GatewayRoute
 */
export interface HttpGatewayRouteMatch {
  /**
   * Specifies the path to match requests with.
   * This parameter must always start with /, which by itself matches all requests to the virtual service name.
   * You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   * and you want the route to match requests to my-service.local/metrics, your prefix should be /metrics.
   *
   */
  readonly prefixPath: string;
}

/**
 * The criterion for determining a request match for this GatewayRoute
 */
export interface GrpcGatewayRouteMatch {
  /**
   * The fully qualified domain name for the service to match from the request
   */
  readonly serviceName: string;
}

/**
 * Properties specific for HTTP Based GatewayRoutes
 */
export interface HttpRouteSpecProps {
  /**
   * The criterion for determining a request match for this GatewayRoute
   *
   * @default - matches on '/'
   */
  readonly match?: HttpGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;
}
import { CfnGatewayRoute } from './appmesh.generated';
import { HeaderMatch } from './header-match';
import { HttpRouteMethod } from './http-route-method';
import { HttpRoutePathMatch } from './http-route-path-match';
import { areMatchPropertiesUndefined, validateGprcMatch, validateMetadata } from './private/utils';
import { QueryParameterMatch } from './query-parameter-match';
import { Protocol } from './shared-interfaces';
import { IVirtualService } from './virtual-service';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Configuration for gateway route host name match.
 */
export interface GatewayRouteHostnameMatchConfig {
  /**
   * GatewayRoute CFN configuration for host name match.
   */
  readonly hostnameMatch: CfnGatewayRoute.GatewayRouteHostnameMatchProperty;
}

/**
 * Used to generate host name matching methods.
 */
export abstract class GatewayRouteHostnameMatch {
  /**
   * The value of the host name must match the specified value exactly.
   *
   * @param name The exact host name to match on
   */
  public static exact(name: string): GatewayRouteHostnameMatch {
    return new GatewayRouteHostnameMatchImpl({
      exact: name,
    });
  }

  /**
   * The value of the host name with the given name must end with the specified characters.
   *
   * @param suffix The specified ending characters of the host name to match on
   */
  public static suffix(suffix: string): GatewayRouteHostnameMatch {
    return new GatewayRouteHostnameMatchImpl({
      suffix: suffix,
    });
  }

  /**
   * Returns the gateway route host name match configuration.
   */
  public abstract bind(scope: Construct): GatewayRouteHostnameMatchConfig;
}

class GatewayRouteHostnameMatchImpl extends GatewayRouteHostnameMatch {
  constructor(
    private readonly matchProperty: CfnGatewayRoute.GatewayRouteHostnameMatchProperty,
  ) { super(); }

  bind(_scope: Construct): GatewayRouteHostnameMatchConfig {
    return {
      hostnameMatch: this.matchProperty,
    };
  }
}

/**
 * The criterion for determining a request match for this GatewayRoute.
 */
export interface HttpGatewayRouteMatch {
  /**
   * Either path or prefix can be selected
   *
   * @default - prefix match on '/'
   */
  readonly path?: HttpRoutePathMatch;

  /**
   * Specifies the client request headers to match on. All specified headers
   * must match for the gateway route to match.
   *
   * @default - do not match on headers
   */
  readonly headers?: HeaderMatch[];

  /**
   * The gateway route host name to be matched on.
   *
   * @default - no match on host name
   */
  readonly hostname?: GatewayRouteHostnameMatch;

  /**
   * The method to match on.
   *
   * @default - no match on method
   */
  readonly method?: HttpRouteMethod;

  /**
   * The query parameters to match on.
   * All specified query parameters must match for the route to match.
   *
   * @default - no match on query parameters
   */
  readonly queryParameters?: QueryParameterMatch[];

  /**
   * When `true`, rewrites the original request received at the Virtual Gateway to the destination Virtual Service name.
   * When `false`, retains the original hostname/prefix from the request.
   *
   * @default true
   */
  readonly rewriteRequestHostname?: boolean;

  /**
   * The in-coming request's path to be rewritten when the request is matched.
   *
   * @default - matched prefix is rewritten to '/'.
   */
  readonly pathRewrite?: HttpGatewayRoutePathRewrite;
}

/**
 * The criterion for determining a request match for this GatewayRoute
 */
export interface GrpcGatewayRouteMatch {
  /**
   * Create service name based gRPC gateway route match.
   *
   * @default - no matching on service name.
   */
  readonly serviceName?: string;

  /**
   * Create host name based gRPC gateway route match.
   *
   * @default - No matching on host name.
   */
  readonly hostname?: GatewayRouteHostnameMatch;

  /**
   * Create metadata based gRPC gateway route match.
   * All specified metadata must match for the route to match.
   *
   * @default - not matching on metadata.
   */
  readonly metadata?: HeaderMatch[];

  /**
   * When `true`, rewrites the original request received at the Virtual Gateway to the destination Virtual Service name.
   * When `false`, retains the original hostname/prefix from the request.
   *
   * @default true
   */
  readonly rewriteRequestHostname?: boolean;
}

/**
 * Path and prefix properties for HTTP gateway route rewrite.
 */
export interface HttpGatewayRoutePathRewriteConfig {
  /**
   * GatewayRoute CFN configuration for HTTP gateway route path rewrite.
   *
   * @default - rewrite path to '/'.
   */
  readonly path?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty;

  /**
   * GatewayRoute CFN configuration for HTTP gateway route prefix rewrite.
   *
   * @default - rewrite prefix to '/'.
   */
  readonly prefix?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Used to generate HTTP gateway route rewrite other than the host name.
 */
export abstract class HttpGatewayRoutePathRewrite {
  /**
   * The path to rewrite.
   *
   * @param exact The exact path to rewrite.
   */
  public static exact(exact: string): HttpGatewayRoutePathRewrite {
    return new HttpGatewayRoutePathRewriteImpl(exact);
  }

  /**
   * The default prefix used to replace the incoming route prefix when rewritten.
   * When enabled, rewrites the matched prefix in Gateway Route to '/'.
   * When disabled, retains the original prefix from the request.
   */
  public static disableDefaultPrefix(): HttpGatewayRoutePathRewrite {
    return new HttpGatewayRoutePrefixRewriteImpl({ defaultPrefix: 'DISABLED' });
  }

  /**
   * Replace the incoming route prefix when rewritten.
   *
   * @param value The value used to replace the incoming route prefix when rewritten.
   */
  public static customPrefix(value: string): HttpGatewayRoutePathRewrite {
    return new HttpGatewayRoutePrefixRewriteImpl({ value: value } );
  }

  /**
   * Return HTTP gateway route rewrite configuration.
   */
  abstract bind(scope: Construct): HttpGatewayRoutePathRewriteConfig;
}

class HttpGatewayRoutePathRewriteImpl extends HttpGatewayRoutePathRewrite {
  constructor(
    private readonly exact: string,
  ) { super(); }

  bind(_scope: Construct): HttpGatewayRoutePathRewriteConfig {
    return {
      path: {
        exact: this.exact,
      },
    };
  }
}

class HttpGatewayRoutePrefixRewriteImpl extends HttpGatewayRoutePathRewrite {
  constructor(
    private readonly prefixRewrite: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty,
  ) { super(); }

  bind(_scope: Construct): HttpGatewayRoutePathRewriteConfig {
    return {
      prefix: this.prefixRewrite,
    };
  }
}

/**
 * Properties specific for HTTP Based GatewayRoutes
 */
export interface HttpGatewayRouteSpecOptions {
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

/**
 * Properties specific for a gRPC GatewayRoute
 */
export interface GrpcGatewayRouteSpecOptions {
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
   * @param options - no http gateway route
   */
  public static http(options: HttpGatewayRouteSpecOptions): GatewayRouteSpec {
    return new HttpGatewayRouteSpec(options, Protocol.HTTP);
  }

  /**
   * Creates an HTTP2 Based GatewayRoute
   *
   * @param options - no http2 gateway route
   */
  public static http2(options: HttpGatewayRouteSpecOptions): GatewayRouteSpec {
    return new HttpGatewayRouteSpec(options, Protocol.HTTP2);
  }

  /**
   * Creates an gRPC Based GatewayRoute
   *
   * @param options - no grpc gateway route
   */
  public static grpc(options: GrpcGatewayRouteSpecOptions): GatewayRouteSpec {
    return new GrpcGatewayRouteSpec(options);
  }

  /**
   * Called when the GatewayRouteSpec type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: Construct): GatewayRouteSpecConfig;
}

class HttpGatewayRouteSpec extends GatewayRouteSpec {
  readonly match?: HttpGatewayRouteMatch;

  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;

  /**
   * Type of route you are creating
   */
  readonly routeType: Protocol;

  constructor(options: HttpGatewayRouteSpecOptions, protocol: Protocol.HTTP | Protocol.HTTP2) {
    super();
    this.routeTarget = options.routeTarget;
    this.routeType = protocol;
    this.match = options.match;
  }

  public bind(scope: Construct): GatewayRouteSpecConfig {
    const pathRewriteConfig = this.match?.pathRewrite?.bind(scope);
    const pathMatchConfig = this.match?.path?.bind(scope).requestMatch;
    const defaultTargetHostname = this.match?.rewriteRequestHostname;

    // Set prefix Match to '/' if none on match properties are defined.
    const prefixMatch = areMatchPropertiesUndefined(this.match)
      ? '/'
      : pathMatchConfig?.prefix;
    const prefixPathRewrite = pathRewriteConfig?.prefix;
    const pathRewrite = pathRewriteConfig?.path;

    if (prefixMatch && prefixMatch[0] !== '/') {
      throw new Error(`Prefix Path for the match must start with \'/\', got: ${prefixMatch}`);
    }
    if (prefixPathRewrite?.value && prefixPathRewrite.value[0] !== '/') {
      throw new Error(`Prefix Path for the rewrite must start with \'/\', got: ${prefixPathRewrite.value}`);
    }
    if (prefixPathRewrite && !prefixMatch) {
      throw new Error('HTTP Gateway Route prefix match must be provided if a prefix rewrite was provided.');
    }
    if (pathRewrite && prefixMatch) {
      throw new Error('HTTP Gateway Route prefix match and path rewrite cannot both be provided.');
    }

    const httpConfig: CfnGatewayRoute.HttpGatewayRouteProperty = {
      match: {
        prefix: prefixMatch,
        path: pathMatchConfig?.path,
        hostname: this.match?.hostname?.bind(scope).hostnameMatch,
        method: this.match?.method,
        headers: this.match?.headers?.map(header => header.bind(scope).headerMatch),
        queryParameters: this.match?.queryParameters?.map(queryParameter => queryParameter.bind(scope).queryParameter),
      },
      action: {
        target: {
          virtualService: {
            virtualServiceName: this.routeTarget.virtualServiceName,
          },
        },
        rewrite: defaultTargetHostname || pathRewriteConfig
          ? {
            hostname: defaultTargetHostname
              ? {
                defaultTargetHostname: defaultTargetHostname ? 'ENABLED' : 'DISABLED',
              }
              : undefined,
            prefix: prefixPathRewrite
              ? {
                defaultPrefix: prefixPathRewrite.defaultPrefix,
                value: prefixPathRewrite.value,
              }
              : undefined,
            path: pathRewrite
              ? {
                exact: pathRewrite.exact,
              }
              : undefined,
          }
          : undefined,
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
  constructor(options: GrpcGatewayRouteSpecOptions) {
    super();
    this.match = options.match;
    this.routeTarget = options.routeTarget;
  }

  public bind(scope: Construct): GatewayRouteSpecConfig {
    const defaultTargetHostname = this.match.rewriteRequestHostname;

    validateGprcMatch(this.match);
    validateMetadata(this.match.metadata);

    return {
      grpcSpecConfig: {
        action: {
          target: {
            virtualService: {
              virtualServiceName: this.routeTarget.virtualServiceName,
            },
          },
          rewrite: defaultTargetHostname
            ? {
              hostname: {
                defaultTargetHostname: defaultTargetHostname ? 'ENABLED' : 'DISABLED',
              },
            }: undefined,
        },
        match: {
          serviceName: this.match.serviceName,
          hostname: this.match.hostname?.bind(scope).hostnameMatch,
          metadata: this.match.metadata?.map(metadata => metadata.bind(scope).headerMatch),
        },
      },
    };
  }
}

import { CfnGatewayRoute } from './appmesh.generated';
import { HttpRouteMatchMethod } from './http-route-match-method';
import { HttpRoutePathMatch } from './http-route-path-match';
import { HeaderMatch } from './header-match';
import { areMatchPropertiesUndefined, validateGprcMatch, validateMetadata } from './private/utils';
import { QueryParameterMatch } from './query-parameter-match';
import { Protocol } from './shared-interfaces';
import { IVirtualService } from './virtual-service';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';


/**
 * Configuration for gRPC gateway route match with the host name.
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
export abstract class GatewayRouteHostname {
  /**
   * The value of the host name must match the specified value exactly.
   *
   * @param name The exact host name to match on
   */
  public static matchingExactly(name: string): GatewayRouteHostname {
    return new GatewayRouteHostnameImpl({
      exact: name,
    });
  }

  /**
   * The value of the host name with the given name must end with the specified characters.
   *
   * @param suffix The specified ending characters of the host name to match on
   */
  public static matchingSuffix(suffix: string): GatewayRouteHostname {
    return new GatewayRouteHostnameImpl({
      suffix: suffix,
    });
  }

  /**
   * Returns the gateway route host name match configuration.
   */
  public abstract bind(scope: Construct): GatewayRouteHostnameMatchConfig;
}

class GatewayRouteHostnameImpl extends GatewayRouteHostname {
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
  readonly hostname?: GatewayRouteHostname;

  /**
   * The method to match on.
   *
   * @default - no match on method
   */
  readonly method?: HttpRouteMatchMethod;

  /**
   * The query parameter to match on.
   * All specified query parameter must match for the route to match.
   *
   * @default - no match on query parameter
   */
  readonly queryParameters?: QueryParameterMatch[];
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
  readonly hostname?: GatewayRouteHostname;

  /**
   * Create metadata based gRPC gateway route match.
   *
   * @default - not matching on metadata.
   */
  readonly metadata?: HeaderMatch[];
}

/**
 * Path and prefix properties for gRPC gateway route rewrite.
 */
export interface HttpGatewayRouteRewriteConfig {
  /**
   * GatewayRoute CFN configuration for gRPC gateway route path rewrite.
   *
   * @default - rewrite path to '/'.
   */
  readonly path?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty;

  /**
   * GatewayRoute CFN configuration for gRPC gateway route prefix rewrite.
   *
   * @default - rewrite prefix to '/'.
   */
  readonly prefix?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Defines gRPC gateway route rewrite that can be defined in addition to host name.
 */
export abstract class HttpGatewayRouteRewrite {
  /**
   * The path to rewrite.
   *
   * @param exact The exact path to rewrite.
   */
  public static exactPath(exact: string): HttpGatewayRouteRewrite {
    return new HttpGatewayRoutePathRewriteImpl(exact);
  }

  /**
   * The default prefix used to replace the incoming route prefix when rewritten.
   * When enabled, rewrites the matched path in Gateway Route to '/'.
   * When disabled, does not rewrite to '/'.
   *
   * @param isDefault Boolean to select to enable or disable the default prefix.
   *  Default value is enabled.
   */
  public static defaultPrefix(isDefault?: boolean): HttpGatewayRouteRewrite {
    return new HttpGatewayRoutePrefixRewriteImpl({ defaultPrefix: isDefault == false ? 'DISABLED' : 'ENABLED' });
  }

  /**
   * Replace the incoming route prefix when rewritten.
   *
   * @param value The value used to replace the incoming route prefix when rewritten.
   */
  public static customPrefix(value: string): HttpGatewayRouteRewrite {
    return new HttpGatewayRoutePrefixRewriteImpl({ value: value } );
  }

  /**
   * Return HTTP gateway route rewrite configuration.
   */
  abstract bind(scope: Construct): HttpGatewayRouteRewriteConfig;
}

class HttpGatewayRoutePathRewriteImpl extends HttpGatewayRouteRewrite {
  constructor(
    private readonly exact: string,
  ) { super(); }

  bind(_scope: Construct): HttpGatewayRouteRewriteConfig {
    return {
      path: {
        exact: this.exact,
      },
    };
  }
}

class HttpGatewayRoutePrefixRewriteImpl extends HttpGatewayRouteRewrite {
  constructor(
    private readonly prefixRewrite: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty,
  ) { super(); }

  bind(_scope: Construct): HttpGatewayRouteRewriteConfig {
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

  /**
   * The default target host name to write to.
   * Boolean is used to select either enable or disable.
   * When enabled, rewrites the original request received at the Virtual Gateway to the destination Virtual Service hostname.
   * When disabled, does not rewrite to destination Virtual Service hostname.
   *
   * @default true
   */
  readonly defaultHostnameRewrite?: boolean;

  /**
   * The path to rewrite.
   *
   * @default - rewritten to the target Virtual Service's hostname and the matched prefix is rewritten to '/'.
   */
  readonly pathRewrite?: HttpGatewayRouteRewrite;
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

  /**
   * The default target host name to write to.
   * Boolean is used to select either enable or disable.
   * When enabled, rewrites the original request received at the Virtual Gateway to the destination Virtual Service hostname.
   * When disabled, does not rewrite to destination Virtual Service hostname.
   *
   * @default true
   */
  readonly defaultHostnameRewrite?: boolean;
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
  /**
   * The criterion for determining a request match for this GatewayRoute
   *
   * @default - matches on prefix with '/'
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

  /**
   * The default target host name to write to.
   * Boolean is used to select either enable or disable.
   * When enabled, rewrites the original request received at the Virtual Gateway to the destination Virtual Service hostname.
   * When disabled, does not rewrite to destination Virtual Service hostname.
   *
   * @default true
   */
  readonly defaultHostnameRewrite?: boolean;

  /**
   * The path to rewrite.
   *
   * @default - rewritten to the target Virtual Service's hostname and the matched prefix is rewritten to '/'.
   */
  readonly pathRewrite?: HttpGatewayRouteRewrite;

  constructor(options: HttpGatewayRouteSpecOptions, protocol: Protocol.HTTP | Protocol.HTTP2) {
    super();
    this.routeTarget = options.routeTarget;
    this.routeType = protocol;
    this.match = options.match;
    this.defaultHostnameRewrite = options.defaultHostnameRewrite;
    this.pathRewrite = options.pathRewrite;
  }

  public bind(scope: Construct): GatewayRouteSpecConfig {
    // Set prefix Match to '/' if none on match properties are defined.
    const prefixMatch = !areMatchPropertiesUndefined(this.match) ? this.match?.path?.bind(scope).requestMatch.prefix :'/';
    const prefixPathRewrite = this.pathRewrite?.bind(scope).prefix;
    const pathRewrite = this.pathRewrite?.bind(scope).path;

    if (prefixMatch && prefixMatch[0] != '/') {
      throw new Error(`Prefix Path must start with \'/\', got: ${prefixMatch}`);
    }
    if (prefixPathRewrite && !prefixMatch) {
      throw new Error('HTTP Gateway Route Prefix Match must be set.');
    }
    if (pathRewrite && prefixMatch) {
      throw new Error('HTTP Gateway Route Prefix Match and Path Rewrite both cannot be set.');
    }

    const httpConfig: CfnGatewayRoute.HttpGatewayRouteProperty = {
      match: {
        prefix: prefixMatch,
        path: this.match?.path?.bind(scope).requestMatch.path,
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
        rewrite: renderHttpGatewayRouteRewrite(scope, this.defaultHostnameRewrite, this.pathRewrite),
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

  /**
   * The default target host name to write to.
   * Boolean is used to select either enable or disable.
   * When enabled, rewrites the original request received at the Virtual Gateway to the destination Virtual Service hostname.
   * When disabled, does not rewrite to destination Virtual Service hostname.
   *
   * @default true
   */
  readonly defaultHostname?: boolean;

  constructor(options: GrpcGatewayRouteSpecOptions) {
    super();
    this.match = options.match;
    this.routeTarget = options.routeTarget;
    this.defaultHostname = options.defaultHostnameRewrite;
  }

  public bind(scope: Construct): GatewayRouteSpecConfig {
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
          rewrite: this.defaultHostname
            ? {
              hostname: {
                defaultTargetHostname: this.defaultHostname ? 'ENABLED' : 'DISABLED',
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

function renderHttpGatewayRouteRewrite(scope: Construct, defaultTargetHostname?: boolean, pathRewrite?: HttpGatewayRouteRewrite)
  : CfnGatewayRoute.HttpGatewayRouteRewriteProperty | undefined {
  return defaultTargetHostname || pathRewrite
    ? {
      hostname: defaultTargetHostname
        ? {
          defaultTargetHostname: defaultTargetHostname ? 'ENABLED' : 'DISABLED',
        }
        : undefined,
      prefix: pathRewrite?.bind(scope).prefix
        ? {
          defaultPrefix: pathRewrite.bind(scope).prefix?.defaultPrefix,
          value: pathRewrite.bind(scope).prefix?.value,
        }
        : undefined,
      path: pathRewrite?.bind(scope).path
        ? {
          exact: pathRewrite.bind(scope).path?.exact,
        }
        : undefined,
    }
    : undefined;
}

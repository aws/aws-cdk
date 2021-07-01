import { CfnGatewayRoute } from './appmesh.generated';
import { HttpHeaderMatch, HttpRouteMatchMethod } from './route-spec';
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
  abstract bind(scope: Construct): GatewayRouteHostnameMatchConfig;
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
 * Configuration for `MetadataMatch`
 */
export interface GrpcGatewayRouteMetadataMatchConfig {
  /**
   * The gRPC gateway route metadata.
   */
  readonly metadataMatch: CfnGatewayRoute.GrpcGatewayRouteMetadataProperty;
}

/**
 * Used to generate metadata matching methods.
 */
export abstract class GrpcMetadataMatch {
  /**
   * The value of the metadata with the given name in the request must match the
   * specified value exactly.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param metadataValue The exact value to test against
   */
  static valueIs(metadataName: string, metadataValue: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { exact: metadataValue });
  }

  /**
   * The value of the metadata with the given name in the request must not match
   * the specified value exactly.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param metadataValue The exact value to test against
   */
  static valueIsNot(metadataName: string, metadataValue: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { exact: metadataValue });
  }

  /**
   * The value of the metadata with the given name in the request must start with
   * the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param prefix The prefix to test against
   */
  static valueStartsWith(metadataName: string, prefix: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { prefix });
  }

  /**
   * The value of the metadata with the given name in the request must not start
   * with the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param prefix The prefix to test against
   */
  static valueDoesNotStartWith(metadataName: string, prefix: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { prefix });
  }

  /**
   * The value of the metadata with the given name in the request must end with
   * the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param suffix The suffix to test against
   */
  static valueEndsWith(metadataName: string, suffix: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { suffix });
  }

  /**
   * The value of the metadata with the given name in the request must not end
   * with the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param suffix The suffix to test against
   */
  static valueDoesNotEndWith(metadataName: string, suffix: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { suffix });
  }

  /**
   * The value of the metadata with the given name in the request must include
   * the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param regex The regex to test against
   */
  static valueMatchesRegex(metadataName: string, regex: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { regex });
  }

  /**
   * The value of the metadata with the given name in the request must not
   * include the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param regex The regex to test against
   */
  static valueDoesNotMatchRegex(metadataName: string, regex: string): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { regex });
  }

  /**
   * The value of the metadata with the given name in the request must be in a
   * range of values.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param start Match on values starting at and including this value
   * @param end Match on values up to but not including this value
   */
  static valuesIsInRange(metadataName: string, start: number, end: number): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, false, {
      range: {
        start,
        end,
      },
    });
  }

  /**
   * The value of the metadata with the given name in the request must not be in
   * a range of values.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param start Match on values starting at and including this value
   * @param end Match on values up to but not including this value
   */
  static valuesIsNotInRange(metadataName: string, start: number, end: number): GrpcMetadataMatch {
    return new MetadataMatchImpl(metadataName, true, {
      range: {
        start,
        end,
      },
    });
  }

  /**
   * Returns the metadata match configuration.
   */
  abstract bind(scope: Construct): GrpcGatewayRouteMetadataMatchConfig;
}

class MetadataMatchImpl extends GrpcMetadataMatch {
  constructor(
    private readonly metadataName: string,
    private readonly invert: boolean,
    private readonly matchProperty: CfnGatewayRoute.GatewayRouteMetadataMatchProperty,
  ) {
    super();
  }

  bind(_scope: Construct): GrpcGatewayRouteMetadataMatchConfig {
    return {
      metadataMatch: {
        name: this.metadataName,
        invert: this.invert,
        match: this.matchProperty,
      },
    };
  }
}

/**
 * Configuration for HTTP gateway route match
 */
export interface HttpGatewayRouteMatchConfig {
  /**
   * GatewayRoute CFN configuration for HTTP gateway route match.
   */
  readonly requestMatch: CfnGatewayRoute.HttpGatewayRouteMatchProperty;
}

/**
 * Defines HTTP gateway route path or prefix request match.
 */
export abstract class HttpGatewayRoutePathOrPrefixMatch {
  /**
   * Specifies the path to match requests with.
   * This parameter must always start with /, which by itself matches all requests to the virtual service name.
   * You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   * and you want the route to match requests to my-service.local/metrics, your prefix should be /metrics.
   */
  public static prefix(path: string): HttpGatewayRoutePathOrPrefixMatch {
    return new HttpGatewayRoutePrefixMatchImpl(path);
  }

  /**
   * The path to match on.
   */
  public static path(pathMatch: HttpPathMatch): HttpGatewayRoutePathOrPrefixMatch {
    return new HttpGatewayRoutePathMatchImpl(pathMatch);
  }

  /**
   * Return HTTP gateway route match configuration.
   */
  abstract bind(scope: Construct): HttpGatewayRouteMatchConfig;
}

class HttpGatewayRoutePrefixMatchImpl extends HttpGatewayRoutePathOrPrefixMatch {
  constructor(
    private readonly prefix: string,
  ) { super(); }

  bind(_scope: Construct): HttpGatewayRouteMatchConfig {
    return {
      requestMatch: {
        prefix: this.prefix,
      },
    };
  }
}

class HttpGatewayRoutePathMatchImpl extends HttpGatewayRoutePathOrPrefixMatch {
  constructor(
    private readonly pathMatch: HttpPathMatch,
  ) { super(); }

  bind(scope: Construct): HttpGatewayRouteMatchConfig {
    return {
      requestMatch: {
        path: this.pathMatch.bind(scope).pathMatch,
      },
    };
  }
}


/**
 * Configuration for HTTP gateway route path match
 */
export interface HttpPathMatchConfig {
  /**
   * GatewayRoute CFN configuration for HTTP gateway route path match.
   */
  readonly pathMatch: CfnGatewayRoute.HttpPathMatchProperty;
}

/**
 * Used to generate HTTP path matching methods.
 */
export abstract class HttpPathMatch {
  /**
   * The value of the path must match the specified value exactly.
   *
   * @param path The exact path to match on
   */
  public static matchingExactly(path: string): HttpPathMatch {
    return new HttpPathMatchImpl({ exact: path });
  }

  /**
   * The value of the path must match the specified regex.
   * @param regex The regex used to match the path.
   */
  public static matchingRegex(regex: string): HttpPathMatch {
    return new HttpPathMatchImpl({ regex: regex });
  }

  /**
   * Returns the gateway route path match configuration.
   */
  abstract bind(scope: Construct): HttpPathMatchConfig;
}

class HttpPathMatchImpl extends HttpPathMatch {
  constructor(
    private readonly pathMatch: CfnGatewayRoute.HttpPathMatchProperty,
  ) { super(); }

  bind(_scope: Construct): HttpPathMatchConfig {
    return {
      pathMatch: this.pathMatch,
    };
  }
}

/**
 * Configuration for `QueryParameterMatch`
 */
export interface QueryParameterConfig {
  /**
   * The HTTP route header.
   */
  readonly queryParameter: CfnGatewayRoute.QueryParameterProperty;
}

/**
 * Used to generate query parameter matching methods.
 */
export abstract class QueryParameterMatch {
  /**
   * The value of the query parameter with the given name in the request must match the
   * specified value exactly.
   *
   * @param queryParameterName the name of the query parameter to match against
   * @param queryParameterValue The exact value to test against
   */
  static valueIs(queryParameterName: string, queryParameterValue: string): QueryParameterMatch {
    return new QueryParameterMatchImpl(queryParameterName, { exact: queryParameterValue });
  }

  /**
   * Returns the query parameter match configuration.
   */
  abstract bind(scope: Construct): QueryParameterConfig;
}

class QueryParameterMatchImpl extends QueryParameterMatch {
  constructor(
    private readonly queryParameterName: string,
    private readonly matchProperty: CfnGatewayRoute.HttpQueryParameterMatchProperty,
  ) {
    super();
  }

  bind(_scope: Construct): QueryParameterConfig {
    return {
      queryParameter: {
        match: this.matchProperty,
        name: this.queryParameterName,
      },
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
  readonly pathOrPrefix?: HttpGatewayRoutePathOrPrefixMatch,

  /**
   * Specifies the client request headers to match on. All specified headers
   * must match for the gateway route to match.
   *
   * @default - do not match on headers
   */
  readonly header?: HttpHeaderMatch[]

  /**
   * The gateway route host name to be matched on.
   *
   * @default - no match on host name
   */
  readonly hostname?: GatewayRouteHostname

  /**
   * The method to match on.
   *
   * @default - no match on method
   */
  readonly method?: HttpRouteMatchMethod

  /**
   * The query parameter to match on.
   *
   * @default - no match on query parameter
   */
  readonly queryParameters?: QueryParameterMatch[]
}

/**
 * Configuration for gRPC gateway route match.
 */
export interface GrpcGatewayRouteMatchConfig {
  /**
   * GatewayRoute CFN configuration for gRPC gateway route match.
   */
  readonly requestMatch: CfnGatewayRoute.GrpcGatewayRouteMatchProperty;
}

/**
 * Other optional properties for gRPC gateway route match other than the host name.
 */
export interface GrpcGatewayRouteHostnameMatchOptions {
  /**
   * The gateway route metadata to be matched on
   *
   * @default - no match on metadata
   */
  readonly metadata?: GrpcMetadataMatch[];

  /**
   * The fully qualified domain name for the service to match from the request.
   *
   * @default - no match on service name
   */
  readonly serviceName?: string;
}

/**
 * Other optional properties for gRPC gateway route match other than the metadata.
 */
export interface GrpcGatewayRouteMetadataMatchOptions {
  /**
   * The gateway route host name to be matched on.
   *
   * @default - no match on host name
   */
  readonly hostname?: GatewayRouteHostname;

  /**
   * The fully qualified domain name for the service to match from the request.
   *
   * @default - no match on service name
   */
  readonly serviceName?: string;
}

/**
 * Other optional properties for gRPC gateway route match other than the service name.
 */
export interface GrpcGatewayRouteServiceNameMatchOptions {
  /**
   * The gateway route host name to be matched on.
   *
   * @default - no match on host name
   */
  readonly hostname?: GatewayRouteHostname;

  /**
   * The gateway route metadata to be matched on.
   *
   * @default - no match on metadata
   */
  readonly metadata?: GrpcMetadataMatch[];
}

/**
 * The criterion for determining a request match for this GatewayRoute.
 */
export abstract class GrpcGatewayRouteMatch {
  /**
   * Create host name based gRPC gateway route match.
   *
   * @param hostname The gateway route host name to be matched on
   * @param options Other optional properties to define gRPC gateway route match
   */
  public static hostname(hostname: GatewayRouteHostname, options?: GrpcGatewayRouteHostnameMatchOptions): GrpcGatewayRouteMatch {
    return new GrpcGatewayRouteHostnameMatchImpl(hostname, options);
  }

  /**
   * Create metadata based gRPC gateway route match.
   *
   * @param metadata An object that represents the data to match from the request.
   * @param options Other optional properties to define gRPC gateway route match
   */
  public static metadata(metadata: GrpcMetadataMatch[], options?: GrpcGatewayRouteMetadataMatchOptions): GrpcGatewayRouteMatch {
    return new GrpcGatewayRouteMetadataMatchImpl(metadata, options);
  }

  /**
   * Create service name based gRPC gateway route match.
   *
   * @param serviceName The fully qualified domain name for the service to match from the request
   * @param options Other optional properties to define gRPC gateway route match
   */
  public static serviceName(serviceName: string, options?: GrpcGatewayRouteServiceNameMatchOptions): GrpcGatewayRouteMatch {
    return new GrpcGatewayRouteServicenameMatchImpl(serviceName, options);
  }

  /**
   * Return the gRPC gateway route match configuration.
   */
  abstract bind(scope: Construct): GrpcGatewayRouteMatchConfig;
}

class GrpcGatewayRouteHostnameMatchImpl extends GrpcGatewayRouteMatch {
  constructor(
    private readonly hostname: GatewayRouteHostname,
    private readonly options?: GrpcGatewayRouteHostnameMatchOptions,
  ) { super(); }

  bind(scope: Construct): GrpcGatewayRouteMatchConfig {
    return {
      requestMatch: {
        hostname: this.hostname.bind(scope).hostnameMatch,
        metadata: this.options?.metadata?.map(metadata => metadata.bind(scope).metadataMatch),
        serviceName: this.options?.serviceName,
      },
    };
  }
}

class GrpcGatewayRouteMetadataMatchImpl extends GrpcGatewayRouteMatch {
  constructor(
    private readonly metadata: GrpcMetadataMatch[],
    private readonly options?: GrpcGatewayRouteMetadataMatchOptions,

  ) { super(); }

  bind(scope: Construct): GrpcGatewayRouteMatchConfig {
    return {
      requestMatch: {
        metadata: this.metadata.map(metadata => metadata.bind(scope).metadataMatch),
        hostname: this.options?.hostname?.bind(scope).hostnameMatch,
        serviceName: this.options?.serviceName,
      },
    };
  }
}

class GrpcGatewayRouteServicenameMatchImpl extends GrpcGatewayRouteMatch {
  constructor(
    private readonly serviceName: string,
    private readonly options?: GrpcGatewayRouteServiceNameMatchOptions,

  ) { super(); }

  bind(scope: Construct): GrpcGatewayRouteMatchConfig {
    return {
      requestMatch: {
        serviceName: this.serviceName,
        hostname: this.options?.hostname?.bind(scope).hostnameMatch,
        metadata: this.options?.metadata?.map(metadata => metadata.bind(scope).metadataMatch),
      },
    };
  }
}

/**
 * Enum of rewrite default target
 */
export enum Default {
  /**
   * Enable default rewrite.
   */
  ENABLED = 'enabled',

  /**
   * Disable default rewrite.
   */
  DISABLED = 'disabled',
}

/**
 * All properties for gRPC gateway route rewrite.
 */
export interface HttpGatewayRouteRewriteConfig {
  /**
   * GatewayRoute CFN configuration for gRPC gateway route host name rewrite.
   *
   * @default - rewrite hostname to the destination Virtual Service name.
   */
  readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameRewriteProperty;

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
export abstract class HttpGatewayRoutePathOrPrefixRewrite {
  /**
   * The path to rewrite.
   *
   * @param exact The exact path to rewrite.
   */
  public static path(exact: string): HttpGatewayRoutePathOrPrefixRewrite {
    return new HttpGatewayRoutePathRewriteImpl(exact);
  }

  /**
   * The default prefix used to replace the incoming route prefix when rewritten.
   *
   * @param isDefault Enable or disable the default prefix
   */
  public static defaultPrefix(isDefault: Default): HttpGatewayRoutePathOrPrefixRewrite {
    return new HttpGatewayRoutePrefixRewriteImpl({ defaultPrefix: isDefault } );
  }

  /**
   * Replace the incoming route prefix when rewritten.
   *
   * @param value The value used to replace the incoming route prefix when rewritten.
   */
  public static customPrefix(value: string): HttpGatewayRoutePathOrPrefixRewrite {
    return new HttpGatewayRoutePrefixRewriteImpl({ value: value } );
  }

  /**
   * Return HTTP gateway route rewrite configuration.
   */
  abstract bind(scope: Construct): HttpGatewayRouteRewriteConfig;
}

class HttpGatewayRoutePathRewriteImpl extends HttpGatewayRoutePathOrPrefixRewrite {
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

class HttpGatewayRoutePrefixRewriteImpl extends HttpGatewayRoutePathOrPrefixRewrite {
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
 * The criterion for determining a rewrite for this HTTP GatewayRoute.
 */
export interface HttpGatewayRouteRewrite {
  /**
   * The default target host name to write to.
   *
   * @default - rewrite hostname to the destination Virtual Service name.
   */
  readonly defaultHostname?: Default;

  /**
   * The path to rewrite.
   *
   * @default - rewritten to the target Virtual Service's hostname and the matched prefix or path is rewritten to '/'.
   */
  readonly pathOrPrefix?: HttpGatewayRoutePathOrPrefixRewrite,
}

/**
 * Defines gRPC gateway route rewrite
 */
export interface GrpcGatewayRouteRewrite {
  /**
   * The host name to rewrite
   *
   * @default - rewrite hostname to the destination Virtual Service name.
   */
  readonly defaultHostname?: Default
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
   * The gateway route action to rewrite.
   *
   * @default - rewritten to the target Virtual Service's hostname and the matched prefix or path is rewritten to '/'.
   */
  readonly rewrite?: HttpGatewayRouteRewrite,
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
   * The gateway route action to rewrite.
   *
   * @default - rewrite hostname to the destination Virtual Service name.
   */
  readonly rewrite?: GrpcGatewayRouteRewrite,
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
   * The criterion for determining a request match for this GatewayRoute.
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
   * The gateway route action to rewrite.
   *
   * @default - rewritten to the target Virtual Service's hostname and the matched prefix or path is rewritten to '/'.
   */
  readonly rewrite?: HttpGatewayRouteRewrite;

  constructor(options: HttpGatewayRouteSpecOptions, protocol: Protocol.HTTP | Protocol.HTTP2) {
    super();
    this.routeTarget = options.routeTarget;
    this.routeType = protocol;
    this.match = options.match;
    this.rewrite = options.rewrite;
  }

  public bind(scope: Construct): GatewayRouteSpecConfig {
    // Todo - Add a logic to set prefix to '/' when {} is passed to match.
    const prefix = this.match ? this.match.pathOrPrefix?.bind(scope).requestMatch.prefix :'/';

    if (prefix && prefix[0] != '/') {
      throw new Error(`Prefix Path must start with \'/\', got: ${prefix}`);
    }
    if (this.rewrite?.pathOrPrefix?.bind(scope).prefix && !prefix) {
      throw new Error('HTTP Gateway Route Prefix Match must be set.');
    }
    if (this.rewrite?.pathOrPrefix?.bind(scope).path && prefix) {
      throw new Error('HTTP Gateway Route Prefix Match and Path Rewrite both cannot be set.');
    }

    const httpConfig: CfnGatewayRoute.HttpGatewayRouteProperty = {
      match: {
        prefix: prefix,
        path: this.match?.pathOrPrefix?.bind(scope).requestMatch.path,
        hostname: this.match?.hostname?.bind(scope).hostnameMatch,
        method: this.match?.method,
        headers: this.match?.header?.map(header => header.bind(scope).httpRouteHeader),
        queryParameters: this.match?.queryParameters?.map(queryParameter => queryParameter.bind(scope).queryParameter),
      },
      action: {
        target: {
          virtualService: {
            virtualServiceName: this.routeTarget.virtualServiceName,
          },
        },
        rewrite: renderHttpGatewayRouteRewrite(scope, this.rewrite),
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
   * The gateway route action to rewrite.
   *
   * @default - rewrite hostname to the destination Virtual Service name.
   */
  readonly rewrite?: GrpcGatewayRouteRewrite;

  constructor(options: GrpcGatewayRouteSpecOptions) {
    super();
    this.match = options.match;
    this.routeTarget = options.routeTarget;
    this.rewrite = options.rewrite;
  }

  public bind(scope: Construct): GatewayRouteSpecConfig {
    return {
      grpcSpecConfig: {
        action: {
          target: {
            virtualService: {
              virtualServiceName: this.routeTarget.virtualServiceName,
            },
          },
          rewrite: renderGrpcGatewayRouteRewrite(this.rewrite),
        },
        match: this.match.bind(scope).requestMatch,
      },
    };
  }
}

function renderHttpGatewayRouteRewrite(scope: Construct, rewrite?: HttpGatewayRouteRewrite)
  : CfnGatewayRoute.HttpGatewayRouteRewriteProperty | undefined {
  return rewrite
    ? {
      hostname: rewrite.defaultHostname
        ? {
          defaultTargetHostname: rewrite.defaultHostname,
        }
        : undefined,
      prefix: rewrite.pathOrPrefix?.bind(scope).prefix
        ? {
          defaultPrefix: rewrite.pathOrPrefix.bind(scope).prefix?.defaultPrefix,
          value: rewrite.pathOrPrefix.bind(scope).prefix?.value,
        }
        : undefined,
      path: rewrite.pathOrPrefix?.bind(scope).path
        ? {
          exact: rewrite.pathOrPrefix?.bind(scope).path?.exact,
        }
        : undefined,
    }
    : undefined;
}

function renderGrpcGatewayRouteRewrite(rewrite?: GrpcGatewayRouteRewrite): CfnGatewayRoute.GrpcGatewayRouteRewriteProperty | undefined {
  return rewrite
    ? {
      hostname: rewrite.defaultHostname
        ? {
          defaultTargetHostname: rewrite.defaultHostname,
        }
        : undefined,
    }
    : undefined;
}

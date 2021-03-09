import { CfnRoute } from './appmesh.generated';
import { Protocol, HttpTimeout, GrpcTimeout, TcpTimeout } from './shared-interfaces';
import { IVirtualNode } from './virtual-node';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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

  /**
   * Specifies the client request headers to match on. All specified headers
   * must match for the route to match.
   *
   * @default - do not match on headers
   */
  readonly headers?: HeaderMatch[];

  /**
   * The HTTP client request method to match on.
   *
   * @default - do not match on request method
   */
  readonly method?: HttpRouteMatchMethod;

  /**
   * The client request protocol to match on. Applicable only for HTTP2 routes.
   *
   * @default - do not match on HTTP2 request protocol
   */
  readonly protocol?: HttpRouteMatchScheme;
}

/**
 * Supported values for matching routes based on the HTTP request method
 */
export enum HttpRouteMatchMethod {
  /**
   * GET request
   */
  GET = 'GET',

  /**
   * HEAD request
   */
  HEAD = 'HEAD',

  /**
   * POST request
   */
  POST = 'POST',

  /**
   * PUT request
   */
  PUT = 'PUT',

  /**
   * DELETE request
   */
  DELETE = 'DELETE',

  /**
   * CONNECT request
   */
  CONNECT = 'CONNECT',

  /**
   * OPTIONS request
   */
  OPTIONS = 'OPTIONS',

  /**
   * TRACE request
   */
  TRACE = 'TRACE',

  /**
   * PATCH request
   */
  PATCH = 'PATCH',
}

/**
 * Supported :scheme options for HTTP2
 */
export enum HttpRouteMatchScheme {
  /**
   * Match HTTP requests
   */
  HTTP = 'http',

  /**
   * Match HTTPS requests
   */
  HTTPS = 'https',
}

/**
 * Configuration for `HeaderMatch`
 */
export interface HeaderMatchConfig {
  /**
   * The Http header name
   */
  readonly headerName: string;

  /**
   * Invert the matching condition.
   *
   * @default false
   */
  readonly invert?: boolean;

  /**
   * The match property.
   */
  readonly matchProperty: CfnRoute.HeaderMatchMethodProperty;
}

/**
 * Used to generate header matching methods.
 */
export abstract class HeaderMatch {
  /**
   * The value sent by the client must match the specified value exactly.
   */
  static valueIs(name: string, exact: string): HeaderMatch {
    return new HeaderMatchImpl(name, false, { exact });
  }

  /**
   * The value sent by the client must not match the specified value exactly.
   */
  static valueIsNot(name: string, exact: string): HeaderMatch {
    return new HeaderMatchImpl(name, true, { exact });
  }

  /**
   * The value sent by the client must start with the specified characters.
   */
  static valueStartsWith(name: string, prefix: string): HeaderMatch {
    return new HeaderMatchImpl(name, false, { prefix });
  }

  /**
   * The value sent by the client must not start with the specified characters.
   */
  static valueDoesNotStartWith(name: string, prefix: string): HeaderMatch {
    return new HeaderMatchImpl(name, true, { prefix });
  }

  /**
   * The value sent by the client must end with the specified characters.
   */
  static valueEndsWith(name: string, suffix: string): HeaderMatch {
    return new HeaderMatchImpl(name, false, { suffix });
  }

  /**
   * The value sent by the client must not end with the specified characters.
   */
  static valueDoesNotEndWith(name: string, suffix: string): HeaderMatch {
    return new HeaderMatchImpl(name, true, { suffix });
  }

  /**
   * The value sent by the client must include the specified characters.
   */
  static valueMatchesRegex(name: string, regex: string): HeaderMatch {
    return new HeaderMatchImpl(name, false, { regex });
  }

  /**
   * The value sent by the client must not include the specified characters.
   */
  static valueDoesNotMatchRegex(name: string, regex: string): HeaderMatch {
    return new HeaderMatchImpl(name, true, { regex });
  }

  /**
   * The value sent by the client must be in a range of values
   * @param start Match on values starting at and including this value
   * @param end Match on values up to but not including this value
   */
  static valuesIsInRange(name: string, start: number, end: number): HeaderMatch {
    return new HeaderMatchImpl(name, false, {
      range: {
        start,
        end,
      },
    });
  }

  /**
   * The value sent by the client must not be in a range of values
   * @param start Match on values starting at and including this value
   * @param end Match on values up to but not including this value
   */
  static valuesIsNotInRange(name: string, start: number, end: number): HeaderMatch {
    return new HeaderMatchImpl(name, true, {
      range: {
        start,
        end,
      },
    });
  }

  /**
   * Returns the header match configuration.
   */
  abstract bind(scope: Construct): HeaderMatchConfig;
}

class HeaderMatchImpl extends HeaderMatch {
  constructor(private readonly name: string, private readonly invert: boolean, private readonly matchProperty: CfnRoute.HeaderMatchMethodProperty) {
    super();
  }

  bind(_scope: Construct): HeaderMatchConfig {
    return {
      headerName: this.name,
      invert: this.invert,
      matchProperty: this.matchProperty,
    };
  }
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
 * Base options for all route specs.
 */
export interface RouteSpecOptionsBase {
  /**
   * The priority for the route. Routes are matched based on the specified
   * value, where 0 is the highest priority.
   *
   * @default - no particular priority
   */
  readonly priority?: number;
}

/**
 * Properties specific for HTTP Based Routes
 */
export interface HttpRouteSpecOptions extends RouteSpecOptionsBase {
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

  /**
   * An object that represents a http timeout
   *
   * @default - None
   */
  readonly timeout?: HttpTimeout;
}

/**
 * Properties specific for a TCP Based Routes
 */
export interface TcpRouteSpecOptions extends RouteSpecOptionsBase {
  /**
   * List of targets that traffic is routed to when a request matches the route
   */
  readonly weightedTargets: WeightedTarget[];

  /**
   * An object that represents a tcp timeout
   *
   * @default - None
   */
  readonly timeout?: TcpTimeout;
}

/**
 * Properties specific for a GRPC Based Routes
 */
export interface GrpcRouteSpecOptions extends RouteSpecOptionsBase {
  /**
   * The criterion for determining a request match for this Route
   */
  readonly match: GrpcRouteMatch;

  /**
   * An object that represents a grpc timeout
   *
   * @default - None
   */
  readonly timeout?: GrpcTimeout;

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

  /**
   * The priority for the route. Routes are matched based on the specified
   * value, where 0 is the highest priority.
   *
   * @default - no particular priority
   */
  readonly priority?: number;
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
   * Called when the GatewayRouteSpec type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: Construct): RouteSpecConfig;
}

class HttpRouteSpec extends RouteSpec {
  /**
   * The priority for the route.
   */
  public readonly priority?: number;

  /**
   * Type of route you are creating
   */
  public readonly protocol: Protocol;

  /**
   * The criteria for determining a request match
   */
  public readonly match?: HttpRouteMatch;

  /**
   * The criteria for determining a timeout configuration
   */
  public readonly timeout?: HttpTimeout;

  /**
   * List of targets that traffic is routed to when a request matches the route
   */
  public readonly weightedTargets: WeightedTarget[];

  constructor(props: HttpRouteSpecOptions, protocol: Protocol) {
    super();
    this.protocol = protocol;
    this.match = props.match;
    this.weightedTargets = props.weightedTargets;
    this.timeout = props.timeout;
    this.priority = props.priority;
  }

  public bind(_scope: Construct): RouteSpecConfig {
    const prefixPath = this.match ? this.match.prefixPath : '/';
    if (prefixPath[0] != '/') {
      throw new Error(`Prefix Path must start with \'/\', got: ${prefixPath}`);
    }

    let headers: CfnRoute.HttpRouteHeaderProperty[] | undefined;
    if (this.match?.headers) {
      headers = this.match.headers.map(header => {
        const config = header.bind(_scope);
        return {
          name: config.headerName,
          invert: config.invert,
          match: config.matchProperty,
        };
      });
    }

    const httpConfig: CfnRoute.HttpRouteProperty = {
      action: {
        weightedTargets: renderWeightedTargets(this.weightedTargets),
      },
      match: {
        prefix: prefixPath,
        headers: headers,
        method: this.match?.method,
        scheme: this.match?.protocol,
      },
      timeout: renderTimeout(this.timeout),
    };
    return {
      priority: this.priority,
      httpRouteSpec: this.protocol === Protocol.HTTP ? httpConfig : undefined,
      http2RouteSpec: this.protocol === Protocol.HTTP2 ? httpConfig : undefined,
    };
  }
}

class TcpRouteSpec extends RouteSpec {
  /**
   * The priority for the route.
   */
  public readonly priority?: number;

  /*
   * List of targets that traffic is routed to when a request matches the route
   */
  public readonly weightedTargets: WeightedTarget[];

  /**
   * The criteria for determining a timeout configuration
   */
  public readonly timeout?: TcpTimeout;

  constructor(props: TcpRouteSpecOptions) {
    super();
    this.weightedTargets = props.weightedTargets;
    this.timeout = props.timeout;
    this.priority = props.priority;
  }

  public bind(_scope: Construct): RouteSpecConfig {
    return {
      priority: this.priority,
      tcpRouteSpec: {
        action: {
          weightedTargets: renderWeightedTargets(this.weightedTargets),
        },
        timeout: renderTimeout(this.timeout),
      },
    };
  }
}

class GrpcRouteSpec extends RouteSpec {
  /**
   * The priority for the route.
   */
  public readonly priority?: number;

  public readonly weightedTargets: WeightedTarget[];
  public readonly match: GrpcRouteMatch;
  public readonly timeout?: GrpcTimeout;

  constructor(props: GrpcRouteSpecOptions) {
    super();
    this.weightedTargets = props.weightedTargets;
    this.match = props.match;
    this.timeout = props.timeout;
    this.priority = props.priority;
  }

  public bind(_scope: Construct): RouteSpecConfig {
    return {
      priority: this.priority,
      grpcRouteSpec: {
        action: {
          weightedTargets: renderWeightedTargets(this.weightedTargets),
        },
        match: {
          serviceName: this.match.serviceName,
        },
        timeout: renderTimeout(this.timeout),
      },
    };
  }
}

/**
* Utility method to add weighted route targets to an existing route
*/
function renderWeightedTargets(weightedTargets: WeightedTarget[]): CfnRoute.WeightedTargetProperty[] {
  const renderedTargets: CfnRoute.WeightedTargetProperty[] = [];
  for (const t of weightedTargets) {
    renderedTargets.push({
      virtualNode: t.virtualNode.virtualNodeName,
      weight: t.weight || 1,
    });
  }
  return renderedTargets;
}

/**
 * Utility method to construct a route timeout object
 */
function renderTimeout(timeout?: HttpTimeout): CfnRoute.HttpTimeoutProperty | undefined {
  return timeout
    ? {
      idle: timeout?.idle !== undefined
        ? {
          unit: 'ms',
          value: timeout?.idle.toMilliseconds(),
        }
        : undefined,
      perRequest: timeout?.perRequest !== undefined
        ? {
          unit: 'ms',
          value: timeout?.perRequest.toMilliseconds(),
        }
        : undefined,
    }
    : undefined;
}

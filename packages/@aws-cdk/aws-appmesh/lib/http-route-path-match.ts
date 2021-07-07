import { CfnGatewayRoute, CfnRoute } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Path and Prefix properties for HTTP route match.
 */
export interface HttpRoutePathMatchConfig {
  /**
   * Route CFN configuration for path match.
   *
   * @default - no path match.
   */
  readonly pathMatch?: CfnRoute.HttpPathMatchProperty;

  /**
   * String defining the prefix match.
   *
   * @default - no prefix match
   */
  readonly prefixMatch?: string;
}

/**
 * Defines HTTP route path or prefix request match.
 */
export abstract class HttpRoutePathMatch {
  /**
   * The value of the path must match the specified value exactly.
   *
   * @param path The exact path to match on
   */
  public static exact(path: string): HttpRoutePathMatch {
    return new HttpRoutePathSpecificMatch({ exact: path });
  }

  /**
   * The value of the path must match the specified regex.
   * @param regex The regex used to match the path.
   */
  public static regex(regex: string): HttpRoutePathMatch {
    return new HttpRoutePathSpecificMatch({ regex: regex });
  }

  /**
   * The value of the path must match the specified prefix.
   *
   * @param prefix This parameter must always start with /, which by itself matches all requests to the virtual service name.
   *  You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   *  and you want the route to match requests to my-service.local/metrics, your prefix should be /metrics.
   */
  public static startingWith(prefix: string): HttpRoutePathMatch {
    return new HttpRoutePrefixMatchImpl(prefix);
  }

  /**
   * Returns the route path match configuration.
   */
  public abstract bind(scope: Construct): HttpRoutePathMatchConfig;
}

class HttpRoutePrefixMatchImpl extends HttpRoutePathMatch {
  constructor(
    private readonly prefix: string,
  ) {
    super();
  }

  bind(_scope: Construct): HttpRoutePathMatchConfig {
    return {
      prefixMatch: this.prefix,
    };
  }
}

class HttpRoutePathSpecificMatch extends HttpRoutePathMatch {
  constructor(
    private readonly match: CfnRoute.HttpPathMatchProperty,
  ) {
    super();
  }

  bind(_scope: Construct): HttpRoutePathMatchConfig {
    return {
      pathMatch: this.match,
    };
  }
}

/**
 * Path and Prefix properties for HTTP gateway route match and rewrite.
 */
export interface HttpGatewayRoutePathMatchConfig {
  /**
   * Gateway route CFN configuration for HTTP path match.
   *
   * @default - no path match.
   */
  readonly pathMatch?: CfnGatewayRoute.HttpPathMatchProperty;

  /**
   * String defining the HTTP prefix match.
   *
   * @default - matches requests with any path
   */
  readonly prefixMatch?: string;

  /**
   * Gateway route CFN configuration for HTTP path rewrite.
   *
   * @default - no path rewrite
   */
  readonly pathRewrite?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty;

  /**
   * Gateway route CFN configuration for HTTP prefix rewrite.
   *
   * @default - rewrite prefix to '/'.
   */
  readonly prefixRewrite?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Defines HTTP gateway route path or prefix request match.
 */
export abstract class HttpGatewayRoutePathMatch {
  /**
   * The value of the path must match the specified value exactly.
   *
   * @param pathMatch The exact path to match on
   */
  public static exact(pathMatch: string, exactPathRewrite?: string): HttpGatewayRoutePathMatch {
    return new HttpGatewayRoutePathSpecificMatch({ exact: pathMatch }, exactPathRewrite);
  }

  /**
   * The value of the path must match the specified regex.
   * @param regexMatch The regex used to match the path.
   */
  public static regex(regexMatch: string, exactPathRewrite?: string): HttpGatewayRoutePathMatch {
    return new HttpGatewayRoutePathSpecificMatch({ regex: regexMatch }, exactPathRewrite);
  }

  /**
   * The value of the path must match the specified prefix.
   *
   * @param prefixMatch This parameter must always start with /, which by itself matches all requests to the virtual service name.
   *  You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   *  and you want the gateway route to match requests to my-service.local/metrics, your prefix should be /metrics.
   */
  public static startingWith(prefixMatch: string, prefixRewrite?: HttpGatewayRoutePrefixPathRewrite): HttpGatewayRoutePathMatch {
    return new HttpGatewayRoutePrefixMatchImpl(prefixMatch, prefixRewrite);
  }

  /**
   * Returns the gateway route path match configuration.
   */
  public abstract bind(scope: Construct): HttpGatewayRoutePathMatchConfig;
}

class HttpGatewayRoutePrefixMatchImpl extends HttpGatewayRoutePathMatch {
  constructor(
    private readonly prefixPathMatch: string,
    private readonly prefixPathRewrite?: HttpGatewayRoutePrefixPathRewrite,
  ) {
    super();
  }

  bind(scope: Construct): HttpGatewayRoutePathMatchConfig {
    return {
      prefixMatch: this.prefixPathMatch,
      prefixRewrite: this.prefixPathRewrite?.bind(scope).prefixPath,
    };
  }
}

class HttpGatewayRoutePathSpecificMatch extends HttpGatewayRoutePathMatch {
  constructor(
    private readonly match: CfnGatewayRoute.HttpPathMatchProperty,
    private readonly exactPathRewrite?: string,
  ) {
    super();
  }

  bind(_scope: Construct): HttpGatewayRoutePathMatchConfig {
    return {
      pathMatch: this.match,
      pathRewrite: {
        exact: this.exactPathRewrite,
      },
    };
  }
}

/**
 * Prefix properties for HTTP gateway route rewrite.
 */
export interface HttpGatewayRoutePrefixPathRewriteConfig {
  /**
   * GatewayRoute CFN configuration for HTTP gateway route prefix rewrite.
   *
   * @default - rewrite prefix to '/'.
   */
  readonly prefixPath?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Used to generate HTTP gateway route rewrite other than the host name.
 */
export abstract class HttpGatewayRoutePrefixPathRewrite {
  /**
   * The default prefix used to replace the incoming route prefix when rewritten.
   * When enabled, rewrites the matched prefix in Gateway Route to '/'.
   * When disabled, retains the original prefix from the request.
   */
  public static disableDefaultPrefix(): HttpGatewayRoutePrefixPathRewrite {
    return new HttpGatewayRoutePrefixPathRewriteImpl({ defaultPrefix: 'DISABLED' });
  }

  /**
   * Replace the incoming route prefix when rewritten.
   *
   * @param value The value used to replace the incoming route prefix when rewritten.
   */
  public static customPrefix(value: string): HttpGatewayRoutePrefixPathRewrite {
    return new HttpGatewayRoutePrefixPathRewriteImpl({ value: value } );
  }

  /**
   * Return HTTP gateway route rewrite configuration.
   */
  abstract bind(scope: Construct): HttpGatewayRoutePrefixPathRewriteConfig;
}

class HttpGatewayRoutePrefixPathRewriteImpl extends HttpGatewayRoutePrefixPathRewrite {
  constructor(
    private readonly prefixRewrite: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty,
  ) { super(); }

  bind(_scope: Construct): HttpGatewayRoutePrefixPathRewriteConfig {
    return {
      prefixPath: this.prefixRewrite,
    };
  }
}

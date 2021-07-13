import { CfnGatewayRoute, CfnRoute } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * The type returned from the `bind()` method in {@link HttpRoutePathMatch}.
 */
export interface HttpRoutePathMatchConfig {
  /**
   * Route configuration for matching on the complete URL path of the request.
   *
   * @default - no matching will be performed on the complete URL path
   */
  readonly wholePathMatch?: CfnRoute.HttpPathMatchProperty;

  /**
   * Route configuration for matching on the prefix of the URL path of the request.
   *
   * @default - no matching will be performed on the prefix of the URL path
   */
  readonly prefixPathMatch?: string;
}

/**
 * Defines HTTP route matching based on the URL path of the request.
 */
export abstract class HttpRoutePathMatch {
  /**
   * The value of the path must match the specified value exactly.
   * The provided `path` must start with the '/' character.
   *
   * @param path the exact path to match on
   */
  public static exactly(path: string): HttpRoutePathMatch {
    return new HttpRouteWholePathMatch({ exact: path });
  }

  /**
   * The value of the path must match the specified regex.
   *
   * @param regex the regex used to match the path
   */
  public static regex(regex: string): HttpRoutePathMatch {
    return new HttpRouteWholePathMatch({ regex: regex });
  }

  /**
   * The value of the path must match the specified prefix.
   *
   * @param prefix the value to use to match the beginning of the path part of the URL of the request.
   *   It must start with the '/' character. If provided as "/", matches all requests.
   *   For example, if your virtual service name is "my-service.local"
   *   and you want the route to match requests to "my-service.local/metrics", your prefix should be "/metrics".
   */
  public static startsWith(prefix: string): HttpRoutePathMatch {
    return new HttpRoutePrefixPathMatch(prefix);
  }

  /**
   * Returns the route path match configuration.
   */
  public abstract bind(scope: Construct): HttpRoutePathMatchConfig;
}

class HttpRoutePrefixPathMatch extends HttpRoutePathMatch {
  constructor(private readonly prefix: string) {
    super();

    if (this.prefix && this.prefix[0] !== '/') {
      throw new Error(`Prefix Path for the match must start with \'/\', got: ${this.prefix}`);
    }
  }

  bind(_scope: Construct): HttpRoutePathMatchConfig {
    return {
      prefixPathMatch: this.prefix,
    };
  }
}

class HttpRouteWholePathMatch extends HttpRoutePathMatch {
  constructor(private readonly match: CfnRoute.HttpPathMatchProperty) {
    super();

    if (this.match.exact && this.match.exact[0] !== '/') {
      throw new Error(`Exact Path for the match must start with \'/\', got: ${this.match.exact}`);
    }
  }

  bind(_scope: Construct): HttpRoutePathMatchConfig {
    return {
      wholePathMatch: this.match,
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
  readonly wholePathMatch?: CfnGatewayRoute.HttpPathMatchProperty;

  /**
   * String defining the HTTP prefix match.
   *
   * @default - matches requests with any path
   */
  readonly prefixPathMatch?: string;

  /**
   * Gateway route CFN configuration for HTTP path rewrite.
   *
   * @default - no path rewrite
   */
  readonly wholePathRewrite?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty;

  /**
   * Gateway route CFN configuration for HTTP prefix rewrite.
   *
   * @default - rewrite prefix to '/'.
   */
  readonly prefixPathRewrite?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Defines HTTP gateway route path or prefix request match.
 */
export abstract class HttpGatewayRoutePathMatch {
  /**
   * The value of the path must match the specified value exactly.
   *
   * @param path the exact path to match on
   * @param exactPathRewrite the value to substitute for the matched part of the path of the gateway request URL
   */
  public static exactly(path: string, exactPathRewrite?: string): HttpGatewayRoutePathMatch {
    return new HttpGatewayRouteWholePathMatch({ exact: path }, { exact: exactPathRewrite });
  }

  /**
   * The value of the path must match the specified regex.
   *
   * @param regex the regex used to match the path
   * @param exactPathRewrite the value to substitute for the matched part of the path of the gateway request URL
   */
  public static regex(regex: string, exactPathRewrite?: string): HttpGatewayRoutePathMatch {
    return new HttpGatewayRouteWholePathMatch({ regex: regex }, { exact: exactPathRewrite });
  }

  /**
   * The value of the path must match the specified prefix.
   *
   * @param prefixMatch This parameter must always start with /, which by itself matches all requests to the virtual service name.
   *  You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   *  and you want the gateway route to match requests to my-service.local/metrics, your prefix should be /metrics.
   * @param prefixRewrite Specify either disabling automatic rewrite to '/' or rewriting to specified prefix path.
   */
  public static startsWith(prefixMatch: string, prefixRewrite?: HttpGatewayRoutePathRewrite): HttpGatewayRoutePathMatch {
    return new HttpGatewayRoutePrefixPathMatch(prefixMatch, prefixRewrite);
  }

  /**
   * Returns the gateway route path match configuration.
   */
  public abstract bind(scope: Construct): HttpGatewayRoutePathMatchConfig;
}

class HttpGatewayRoutePrefixPathMatch extends HttpGatewayRoutePathMatch {
  constructor(
    private readonly prefixPathMatch: string,
    private readonly pathRewrite?: HttpGatewayRoutePathRewrite,
  ) {
    super();
  }

  bind(scope: Construct): HttpGatewayRoutePathMatchConfig {
    const prefixPathRewrite = this.pathRewrite?.bind(scope).prefixPathPath;

    if (this.prefixPathMatch && this.prefixPathMatch[0] !== '/') {
      throw new Error(`Prefix Path for the match must start with \'/\', got: ${this.prefixPathMatch}`);
    }
    if (prefixPathRewrite?.value && prefixPathRewrite.value[0] !== '/') {
      throw new Error(`Prefix Path for the rewrite must start with \'/\', got: ${prefixPathRewrite.value}`);
    }

    return {
      prefixPathMatch: this.prefixPathMatch,
      prefixPathRewrite: prefixPathRewrite,
    };
  }
}

class HttpGatewayRouteWholePathMatch extends HttpGatewayRoutePathMatch {
  constructor(
    private readonly wholePathMatch: CfnGatewayRoute.HttpPathMatchProperty,
    private readonly wholePathRewrite?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty,
  ) {
    super();
  }

  bind(_scope: Construct): HttpGatewayRoutePathMatchConfig {
    if (this.wholePathMatch?.exact && this.wholePathMatch.exact[0] !== '/') {
      throw new Error(`Exact Path for the match must start with \'/\', got: ${ this.wholePathMatch.exact }`);
    }
    if (this.wholePathRewrite?.exact && this.wholePathRewrite.exact[0] !== '/') {
      throw new Error(`Exact Path for the rewrite must start with \'/\', got: ${ this.wholePathRewrite.exact }`);
    }

    return {
      wholePathMatch: this.wholePathMatch,
      wholePathRewrite: this.wholePathRewrite?.exact
        ? this.wholePathRewrite
        : undefined,
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
  readonly prefixPathPath?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Used to generate HTTP gateway route rewrite other than the host name.
 */
export abstract class HttpGatewayRoutePathRewrite {
  /**
   * The default prefix used to replace the incoming route prefix when rewritten.
   * When enabled, rewrites the matched prefix in Gateway Route to '/'.
   * When disabled, retains the original prefix from the request.
   */
  public static disableDefaultPrefix(): HttpGatewayRoutePathRewrite {
    return new HttpGatewayRoutePrefixPathRewriteImpl({ defaultPrefix: 'DISABLED' });
  }

  /**
   * Replace the incoming route prefix when rewritten.
   *
   * @param value The value used to replace the incoming route prefix when rewritten.
   */
  public static customPrefix(value: string): HttpGatewayRoutePathRewrite {
    return new HttpGatewayRoutePrefixPathRewriteImpl({ value: value } );
  }

  /**
   * Return HTTP gateway route rewrite configuration.
   */
  abstract bind(scope: Construct): HttpGatewayRoutePrefixPathRewriteConfig;
}

class HttpGatewayRoutePrefixPathRewriteImpl extends HttpGatewayRoutePathRewrite {
  constructor(
    private readonly prefixRewrite: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty,
  ) { super(); }

  bind(_scope: Construct): HttpGatewayRoutePrefixPathRewriteConfig {
    return {
      prefixPathPath: this.prefixRewrite,
    };
  }
}
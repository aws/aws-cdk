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
 * The type returned from the `bind()` method in {@link HttpGatewayRoutePathMatch}.
 */
export interface HttpGatewayRoutePathMatchConfig {
  /**
   * Gateway route configuration for matching on the complete URL path of the request.
   *
   * @default - no matching will be performed on the complete URL path
   */
  readonly wholePathMatch?: CfnGatewayRoute.HttpPathMatchProperty;

  /**
   * Gateway route configuration for matching on the prefix of the URL path of the request.
   *
   * @default - no matching will be performed on the prefix of the URL path
   */
  readonly prefixPathMatch?: string;

  /**
   * Gateway route configuration for rewriting the complete URL path of the request..
   *
   * @default - no rewrite will be performed on the request's complete URL path
   */
  readonly wholePathRewrite?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty;

  /**
   * Gateway route configuration for rewriting the prefix of the URL path of the request.
   *
   * @default - rewrites the request's URL path to '/'
   */
  readonly prefixPathRewrite?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Defines HTTP gateway route matching based on the URL path of the request.
 */
export abstract class HttpGatewayRoutePathMatch {
  /**
   * The value of the path must match the specified value exactly.
   * The provided `path` must start with the '/' character.
   * If path rewrite is specified, the provided `path must also end with the `/` character.
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
   * @param prefixPathMatch the value to use to match the beginning of the path part of the URL of the request.
   *   It must start with the '/' character. If provided as "/", matches all requests.
   *   For example, if your virtual service name is "my-service.local"
   *   and you want the route to match requests to "my-service.local/metrics", your prefix should be "/metrics".
   * @param prefixRewrite Specify either disabling automatic rewrite to '/' or rewriting to specified prefix path.
   */
  public static startsWith(prefixPathMatch: string, prefixRewrite?: HttpGatewayRoutePathRewrite): HttpGatewayRoutePathMatch {
    return new HttpGatewayRoutePrefixPathMatch(prefixPathMatch, prefixRewrite);
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

    if (this.pathRewrite) {
      if (this.prefixPathMatch[0] !== '/') {
        throw new Error('When prefix path for the rewrite is specified, prefix path for the match must start with \'/\', '
          + `got: ${this.prefixPathMatch}`);
      }
      if (this.prefixPathMatch[this.prefixPathMatch.length-1] !== '/') {
        throw new Error('When prefix path for the rewrite is specified, prefix path for the match must end with \'/\', '
          + `got: ${this.prefixPathMatch}`);
      }
    }
  }

  bind(scope: Construct): HttpGatewayRoutePathMatchConfig {
    const prefixPathRewrite = this.pathRewrite?.bind(scope).prefixPathPath;
    if (prefixPathRewrite?.value && prefixPathRewrite.value[0] !== '/') {
      throw new Error(`Prefix path for the rewrite must start with \'/\', got: ${prefixPathRewrite.value}`);
    }
    if (prefixPathRewrite?.value && prefixPathRewrite.value[prefixPathRewrite.value.length-1] !== '/') {
      throw new Error(`Prefix path for the rewrite must end with \'/\', got: ${prefixPathRewrite.value}`);
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

    if (this.wholePathMatch?.exact && this.wholePathMatch.exact[0] !== '/') {
      throw new Error(`Exact Path for the match must start with \'/\', got: ${ this.wholePathMatch.exact }`);
    }
    if (this.wholePathRewrite?.exact && this.wholePathRewrite.exact[0] !== '/') {
      throw new Error(`Exact Path for the rewrite must start with \'/\', got: ${ this.wholePathRewrite.exact }`);
    }
  }

  bind(_scope: Construct): HttpGatewayRoutePathMatchConfig {
    return {
      wholePathMatch: this.wholePathMatch,
      wholePathRewrite: this.wholePathRewrite?.exact
        ? this.wholePathRewrite
        : undefined,
    };
  }
}

/**
 * The type returned from the `bind()` method in {@link HttpGatewayRoutePathRewrite}.
 */
export interface HttpGatewayRoutePrefixPathRewriteConfig {
  /**
   * Gateway route configuration for rewriting the URL path of the request.
   *
   * @default - rewrites the request's URL path to '/'
   */
  readonly prefixPathPath?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty;
}

/**
 * Defines HTTP gateway route path rewrite based on the URL path of the request.
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
   * @param value the value used to replace the incoming route prefix when rewritten
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

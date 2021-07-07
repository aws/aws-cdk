import { CfnRoute } from './appmesh.generated';

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

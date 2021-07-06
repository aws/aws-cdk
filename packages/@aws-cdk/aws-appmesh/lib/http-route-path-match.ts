import { CfnRoute } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Configuration for HTTP route match
 */
export interface HttpRouteMatchConfig {
  /**
   * Route CFN configuration for HTTP route match.
   */
  readonly requestMatch: CfnRoute.HttpRouteMatchProperty;
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
  public static matchingExactly(path: string): HttpRoutePathMatch {
    return new HttpPathMatchImpl({ exact: path });
  }

  /**
   * The value of the path must match the specified regex.
   * @param regex The regex used to match the path.
   */
  public static matchingRegex(regex: string): HttpRoutePathMatch {
    return new HttpPathMatchImpl({ regex: regex });
  }

  /**
   * The value of the path must match the specified prefix.
   *
   * @param prefix This parameter must always start with /, which by itself matches all requests to the virtual service name.
   *  You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   *  and you want the route to match requests to my-service.local/metrics, your prefix should be /metrics.
   */
  public static matchingPrefix(prefix: string): HttpRoutePathMatch {
    return new HttpPrefixMatchImpl(prefix);
  }

  /**
   * Returns the route path match configuration.
   */
  public abstract bind(scope: Construct): HttpRouteMatchConfig;
}

class HttpPrefixMatchImpl extends HttpRoutePathMatch {
  constructor(
    private readonly prefix: string,
  ) {
    super();
  }

  bind(_scope: Construct): HttpRouteMatchConfig {
    return {
      requestMatch: {
        prefix: this.prefix,
      },
    };
  }
}

class HttpPathMatchImpl extends HttpRoutePathMatch {
  constructor(
    private readonly match: CfnRoute.HttpPathMatchProperty,
  ) {
    super();
  }

  bind(_scope: Construct): HttpRouteMatchConfig {
    return {
      requestMatch: {
        path: this.match,
      },
    };
  }
}

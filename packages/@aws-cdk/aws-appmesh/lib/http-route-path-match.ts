import { CfnRoute } from './appmesh.generated';

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
   *   If provided as "/", matches all requests.
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
  }

  bind(_scope: Construct): HttpRoutePathMatchConfig {
    return {
      wholePathMatch: this.match,
    };
  }
}

import { CfnDistribution } from './cloudfront.generated';
import { ViewerProtocolPolicy } from './distribution';
import { Origin } from './origin';

/**
 * The HTTP methods that the Behavior will accept requests on.
 */
export class AllowedMethods {
  /** HEAD and GET */
  public static readonly ALLOW_GET_HEAD = new AllowedMethods(['GET', 'HEAD']);
  /** HEAD, GET, and OPTIONS */
  public static readonly ALLOW_GET_HEAD_OPTIONS = new AllowedMethods(['GET', 'HEAD', 'OPTIONS']);
  /** All supported HTTP methods */
  public static readonly ALLOW_ALL = new AllowedMethods(['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE']);

  /** HTTP methods supported */
  public readonly methods: string[];

  private constructor(methods: string[]) { this.methods = methods; }
}

/**
 * Options for creating a new behavior.
 */
export interface CacheBehaviorOptions {
  /**
   * The origin that you want CloudFront to route requests to when they match this cache behavior.
   */
  readonly origin: Origin;

  /**
   * HTTP methods to allow for this behavior.
   *
   * @default GET and HEAD
   */
  readonly allowedMethods?: AllowedMethods;

  /**
   * Whether CloudFront will forward query strings to the origin.
   * If this is set to true, CloudFront will forward all query parameters to the origin, and cache
   * based on all parameters. See `forwardQueryStringCacheKeys` for a way to limit the query parameters
   * CloudFront caches on.
   *
   * @default false
   */
  readonly forwardQueryString?: boolean;

  /**
   * A set of query string parameter names to use for caching if `forwardQueryString` is set to true.
   *
   * @default empty list
   */
  readonly forwardQueryStringCacheKeys?: string[];
}

/**
 * Properties for specifying custom behaviors for origins.
 */
export interface CacheBehaviorProps extends CacheBehaviorOptions {
  /**
   * The pattern (e.g., `images/*.jpg`) that specifies which requests to apply the behavior to.
   * There must be exactly one behavior associated with each `Distribution` that has a path pattern
   * of '*', which acts as the catch-all default behavior.
   */
  readonly pathPattern: string;
}

/**
 * Allows configuring a variety of CloudFront functionality for a given URL path pattern.
 *
 * Note: This really should simply by called 'Behavior', but this name is already taken by the legacy
 * CloudFrontWebDistribution implementation.
 */
export class CacheBehavior {

  /**
   * Origin that this behavior will route traffic to.
   */
  public readonly origin: Origin;

  constructor(private readonly props: CacheBehaviorProps) {
    this.origin = props.origin;
  }

  /**
   * Creates and returns the CloudFormation representation of this behavior.
   * This renders as a "CacheBehaviorProperty" regardless of if this is a default
   * cache behavior or not, as the two are identical except that the pathPattern
   * is omitted for the default cache behavior.
   *
   * @internal
   */
  public _renderBehavior(): CfnDistribution.CacheBehaviorProperty {
    return {
      pathPattern: this.props.pathPattern,
      targetOriginId: this.origin.id,
      allowedMethods: this.props.allowedMethods?.methods ?? undefined,
      forwardedValues: {
        queryString: this.props.forwardQueryString ?? false,
        queryStringCacheKeys: this.props.forwardQueryStringCacheKeys,
      },
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
    };
  }

}
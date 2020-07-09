import { CfnDistribution } from './cloudfront.generated';
import { Origin } from './origin';
import { ViewerProtocolPolicy } from './web_distribution';

/**
 * The HTTP methods that the Behavior will accept requests on.
 */
export class AllowedMethods {
  /** HEAD and GET */
  public static readonly ALLOW_GET_HEAD = new AllowedMethods(['GET' ,'HEAD']);
  /** HEAD, GET, and OPTIONS */
  public static readonly ALLOW_GET_HEAD_OPTIONS = new AllowedMethods(['GET', 'HEAD', 'OPTIONS']);
  /** All supported HTTP methods */
  public static readonly ALLOW_ALL = new AllowedMethods(['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE']);

  /** HTTP methods supported */
  public readonly methods: string[];

  private constructor(methods: string[]) { this.methods = methods; }
}

/**
 * Options for adding a behavior to an Origin.
 */
export interface CacheBehaviorOptions {
  /**
   * HTTP methods to allow for this behavior.
   *
   * @default GET and HEAD
   */
  readonly allowedMethods?: AllowedMethods;
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

  /**
   * The origin that you want CloudFront to route requests to when they match this cache behavior.
   */
  readonly origin: Origin;
}

/**
 * Allows configuring a variety of CloudFront functionality for a given URL path pattern.
 *
 * Note: This really should simply by called 'Behavior', but this name is already taken by the legacy
 * CloudFrontWebDistribution implementation.
 */
export class CacheBehavior {

  /**
   * The pattern (e.g., `images/*.jpg`) that specifies which requests to apply the behavior to.
   */
  public readonly pathPattern: string;
  private readonly origin: Origin;

  constructor(private readonly props: CacheBehaviorProps) {
    this.origin = props.origin;
    this.pathPattern = props.pathPattern;

    this.origin._attachBehavior(this);
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
      targetOriginId: this.origin.id,
      pathPattern: this.pathPattern,
      allowedMethods: this.props.allowedMethods?.methods ?? undefined,
      forwardedValues: { queryString: false },
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
    };
  }

}
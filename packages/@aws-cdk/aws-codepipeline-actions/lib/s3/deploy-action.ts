import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, Duration } from '@aws-cdk/core';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

/**
 * Construction properties of the {@link S3DeployAction S3 deploy Action}.
 */
export interface S3DeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * Should the deploy action extract the artifact before deploying to Amazon S3.
   *
   * @default true
   */
  readonly extract?: boolean;

  /**
   * The key of the target object. This is required if extract is false.
   */
  readonly objectKey?: string;

  /**
   * The input Artifact to deploy to Amazon S3.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The Amazon S3 bucket that is the deploy target.
   */
  readonly bucket: s3.IBucket;

  /**
   * The specified canned ACL to objects deployed to Amazon S3.
   * This overwrites any existing ACL that was applied to the object.
   *
   * @default - the original object ACL
   */
  readonly accessControl?: s3.BucketAccessControl;

  /**
   * The caching behavior for requests/responses for objects in the bucket.
   *
   * @example (new CacheControlResponse()).public().maxAge(Duration.days(365))
   *
   * @default - none, decided to the HTTP client
   */
  readonly cacheControl?: CacheControlResponse;
}

/**
 * Deploys the sourceArtifact to Amazon S3.
 */
export class S3DeployAction extends Action {
  private readonly props: S3DeployActionProps;

  constructor(props: S3DeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'S3',
      artifactBounds: deployArtifactBounds(),
      inputs: [props.input],
    });

    this.props = props;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    // pipeline needs permissions to write to the S3 bucket
    this.props.bucket.grantWrite(options.role);

    // the Action Role also needs to read from the Pipeline's bucket
    options.bucket.grantRead(options.role);

    return {
      configuration: {
        BucketName: this.props.bucket.bucketName,
        Extract: this.props.extract === false ? 'false' : 'true',
        ObjectKey: this.props.objectKey,
        CannedACL: this.props.accessControl,
        CacheControl: this.props.cacheControl && this.props.cacheControl.toString(),
      },
    };
  }
}

/**
 * Helper class generating RFC 2616 compliant HTTP Cache-Control request or response header values
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9 RFC 2616 14.9 Cache-Control
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control MDN: Cache-Control
 */
export class CacheControlDirective {
  protected readonly directives: string[] = [];

  /**
   * Specifies the maximum amount of time a resource will be considered fresh
   *
   * @param duration Maximum freshness
   */
  public maxAge(duration: Duration): this {
    this.directives.push(`max-age=${duration.toSeconds()}`);

    return this;
  }

  /**
   * Forces caches to submit the request to the origin server for validation before releasing a cached copy
   */
  public noCache(): this {
    this.directives.push('no-cache');

    return this;
  }

  /**
   * The cache should not store anything about the client request or server response
   */
  public noStore(): this {
    this.directives.push('no-store');

    return this;
  }

  /**
   * No transformations or conversions should be made to the resource
   * The Content-Encoding, Content-Range, Content-Type headers must not be modified by a proxy.
   */
  public noTransform(): this {
    this.directives.push('no-transform');

    return this;
  }

  protected constructor() {
  }

  /**
   * Generate the string value of the built Cache-Control directive
   */
  public toString(): string {
    return this.directives.join(', ');
  }
}

/**
 * Helper class generating RFC 2616 compliant HTTP Cache-Control request header values
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9 RFC 2616 14.9 Cache-Control
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Cache_request_directives MDN: Cache-Control
 */
export class CacheControlRequest extends CacheControlDirective {
  /**
   * Indicates that the client is willing to accept a response that has exceeded its expiration time
   *
   * @param duration Maximum staleness
   * @default No threshold
   */
  public maxStale(duration?: Duration): this {
    this.directives.push(duration ? `max-stale=${duration.toSeconds()}` : 'max-stale');

    return this;
  }

  /**
   * Indicates that the client wants a response that will still be fresh for at least the specified number of seconds
   *
   * @param duration minimum freshness
   */
  public maxFresh(duration: Duration): this {
    this.directives.push(`max-fresh=${duration.toSeconds()}`);

    return this;
  }

  /**
   * Indicates to not retrieve new data
   * This being the case, the server wishes the client to obtain a response only once and then cache.
   */
  public onlyIfCached(): this {
    this.directives.push('only-if-cached');

    return this;
  }

  /**
   * Get a CacheControlRequest value from an arbitrary string
   *
   * @param cacheDirective RFC 2161 compliant Cache-Control header value
   * @example CacheControlRequest.of('stale-while-revalidate=3600')
   */
  public of(cacheDirective: string): this {
    this.directives.push(cacheDirective);

    return this;
  }

  public constructor() {
    super();
  }
}


/**
 * Helper class generating RFC 2616 compliant HTTP Cache-Control response header values
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9 RFC 2616 14.9 Cache-Control
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Cache_response_directives MDN: Cache-Control
 */
export class CacheControlResponse extends CacheControlDirective {
  /**
   * Indicates that once a resource has become stale (e.g. max-age has expired),
   * a cache must not use the response to satisfy subsequent requests
   * for this resource without successful validation on the origin server.
   */
  public mustRevalidate(): this {
    this.directives.push('must-revalidate');

    return this;
  }

  /**
   * Indicates that the response may be cached by any cache,
   * even if the response would normally be non-cacheable
   */
  public public(): this {
    this.directives.push('public');

    return this;
  }

  /**
   * Indicates that the response is intended for a single user and must not be stored by a shared cache
   * A private cache may store the response.
   */
  public private(): this {
    this.directives.push('private');

    return this;
  }

  /**
   * Same as must-revalidate, but it only applies to shared caches (e.g., proxies) and is ignored by a private cache.
   *
   * @see mustRevalidate
   */
  public proxyRevalidate(): this {
    this.directives.push('proxy-revalidate');

    return this;
  }

  /**
   * Takes precedence over max-age or the Expires header,
   * but it only applies to shared caches (e.g., proxies) and is ignored by a private cache.
   *
   * @see CacheControlDirective#maxAge
   * @param duration Maximum freshness
   */
  public sMaxAge(duration: Duration): this {
    this.directives.push(`s-maxage=${duration.toSeconds()}`);

    return this;
  }

  /**
   * Get a CacheControlResponse value from an arbitrary string
   *
   * @param cacheDirective RFC 2161 compliant Cache-Control header value
   * @example CacheControlResponse.of('stale-while-revalidate=3600')
   */
  public of(cacheDirective: string): this {
    this.directives.push(cacheDirective);

    return this;
  }

  public constructor() {
    super();
  }
}
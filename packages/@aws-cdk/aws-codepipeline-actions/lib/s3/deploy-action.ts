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
   * @default - none, decided to the HTTP client
   */
  readonly cacheControl?: CacheControlOptions;
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
        CacheControl: this.props.cacheControl && serializeCacheControlOptions(this.props.cacheControl),
      },
    };
  }
}

/**
 * Options used to generate RFC 2616 compliant HTTP Cache-Control response header values
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9 RFC 2616 14.9 Cache-Control
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Cache_response_directives MDN: Cache-Control
 */
export interface CacheControlOptions {
  /**
   * Specifies the maximum amount of time a resource will be considered fresh
   */
  readonly maxAge?: Duration;

  /**
   * Forces caches to submit the request to the origin server for validation before releasing a cached copy
   */
  readonly noCache?: true;

  /**
   * The cache should not store anything about the client request or server response
   */
  readonly noStore?: true;

  /**
   * No transformations or conversions should be made to the resource
   * The Content-Encoding, Content-Range, Content-Type headers must not be modified by a proxy.
   */
  readonly noTransform?: true;

  /**
   * Indicates that once a resource has become stale (e.g. max-age has expired),
   * a cache must not use the response to satisfy subsequent requests
   * for this resource without successful validation on the origin server.
   */
  readonly mustRevalidate?: true;

  /**
   * Indicates that the response may be cached by any cache,
   * even if the response would normally be non-cacheable
   */
  readonly public?: true;

  /**
   * Indicates that the response is intended for a single user and must not be stored by a shared cache
   * A private cache may store the response.
   */
  readonly private?: true;

  /**
   * Same as must-revalidate, but it only applies to shared caches (e.g., proxies) and is ignored by a private cache.
   *
   * @see mustRevalidate
   */
  readonly proxyRevalidate?: true;

  /**
   * Takes precedence over max-age or the Expires header,
   * but it only applies to shared caches (e.g., proxies) and is ignored by a private cache.
   *
   * @see CacheControlOptions#maxAge
   */
  readonly sMaxAge?: Duration;

  /**
   * Set a Cache-Control value from an arbitrary RFC 2161 compliant Cache-Control header value
   *
   * @example {of: ['stale-while-revalidate=3600', 'custom-value']}
   */
  readonly of?: string[];
}

type CacheControlOptionsKey = keyof CacheControlOptions;
type RfcCacheControlOptionsKey = Exclude<CacheControlOptionsKey, 'of'>;
type DateCacheControlOptionsKey = Extract<RfcCacheControlOptionsKey, 'maxAge' | 'sMaxAge'>;
type BoleanCacheControlOptionsKey = Exclude<RfcCacheControlOptionsKey, DateCacheControlOptionsKey>;

const CACHE_CONTROL_HEADER_VALUE: {[key in RfcCacheControlOptionsKey]: string} = {
    maxAge: 'max-age',
    noCache: 'no-cache',
    noStore: 'no-store',
    noTransform: 'no-transform',
    mustRevalidate: 'must-revalidate',
    public: 'public',
    private: 'private',
    proxyRevalidate: 'proxy-revalidate',
    sMaxAge: 's-maxage',
};

const BOLEAN_HEADER_VALUES: BoleanCacheControlOptionsKey[] = [
    'noCache',
    'noStore',
    'noTransform',
    'mustRevalidate',
    'proxyRevalidate',
    'public',
    'private'
];
const DATE_HEADER_VALUES: DateCacheControlOptionsKey[] = ['maxAge', 'sMaxAge'];

const isBooleanKey = (key: CacheControlOptionsKey): key is BoleanCacheControlOptionsKey =>
  BOLEAN_HEADER_VALUES.includes(key as BoleanCacheControlOptionsKey);
const isDateKey = (key: CacheControlOptionsKey): key is DateCacheControlOptionsKey =>
  DATE_HEADER_VALUES.includes(key as DateCacheControlOptionsKey);

export const serializeCacheControlOptions = (options: CacheControlOptions): string => {
    const headers: string[] = [];

    const optionsKeys = Object.keys(options) as CacheControlOptionsKey[];
    const booleanKeys = optionsKeys.filter(isBooleanKey);
    const dateKeys = optionsKeys.filter(isDateKey);

    headers.push(...booleanKeys
      .filter((booleanKey) => options[booleanKey] === true)
      .map((booleanKey) => CACHE_CONTROL_HEADER_VALUE[booleanKey])
    );
    headers.push(...dateKeys
      .filter((dateKey) => options[dateKey] != null)
      .map((dateKey) => `${CACHE_CONTROL_HEADER_VALUE[dateKey]}=${(options[dateKey] as Duration).toSeconds()}`)
    );

    if (options.of) {
      headers.push(...options.of);
    }

    if (!headers.length) {
        throw new Error('A RFC 2616 compliant Cache-Control header value must contain at least one directive');
    }

    return headers.join(', ');
};

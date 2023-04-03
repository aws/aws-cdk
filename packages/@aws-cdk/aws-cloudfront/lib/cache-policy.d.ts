import { Duration, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a Cache Policy
 */
export interface ICachePolicy {
    /**
     * The ID of the cache policy
     * @attribute
     */
    readonly cachePolicyId: string;
}
/**
 * Properties for creating a Cache Policy
 */
export interface CachePolicyProps {
    /**
     * A unique name to identify the cache policy.
     * The name must only include '-', '_', or alphanumeric characters.
     * @default - generated from the `id`
     */
    readonly cachePolicyName?: string;
    /**
     * A comment to describe the cache policy.
     * @default - no comment
     */
    readonly comment?: string;
    /**
     * The default amount of time for objects to stay in the CloudFront cache.
     * Only used when the origin does not send Cache-Control or Expires headers with the object.
     * @default - The greater of 1 day and ``minTtl``
     */
    readonly defaultTtl?: Duration;
    /**
     * The minimum amount of time for objects to stay in the CloudFront cache.
     * @default Duration.seconds(0)
     */
    readonly minTtl?: Duration;
    /**
     * The maximum amount of time for objects to stay in the CloudFront cache.
     * CloudFront uses this value only when the origin sends Cache-Control or Expires headers with the object.
     * @default - The greater of 1 year and ``defaultTtl``
     */
    readonly maxTtl?: Duration;
    /**
     * Determines whether any cookies in viewer requests are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     * @default CacheCookieBehavior.none()
     */
    readonly cookieBehavior?: CacheCookieBehavior;
    /**
     * Determines whether any HTTP headers are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     * @default CacheHeaderBehavior.none()
     */
    readonly headerBehavior?: CacheHeaderBehavior;
    /**
     * Determines whether any query strings are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     * @default CacheQueryStringBehavior.none()
     */
    readonly queryStringBehavior?: CacheQueryStringBehavior;
    /**
     * Whether to normalize and include the `Accept-Encoding` header in the cache key when the `Accept-Encoding` header is 'gzip'.
     * @default false
     */
    readonly enableAcceptEncodingGzip?: boolean;
    /**
     * Whether to normalize and include the `Accept-Encoding` header in the cache key when the `Accept-Encoding` header is 'br'.
     * @default false
     */
    readonly enableAcceptEncodingBrotli?: boolean;
}
/**
 * A Cache Policy configuration.
 *
 * @resource AWS::CloudFront::CachePolicy
 * @link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
 */
export declare class CachePolicy extends Resource implements ICachePolicy {
    /**
     * This policy is designed for use with an origin that is an AWS Amplify web app.
     */
    static readonly AMPLIFY: ICachePolicy;
    /**
     * Optimize cache efficiency by minimizing the values that CloudFront includes in the cache key.
     * Query strings and cookies are not included in the cache key, and only the normalized 'Accept-Encoding' header is included.
     */
    static readonly CACHING_OPTIMIZED: ICachePolicy;
    /**
     * Optimize cache efficiency by minimizing the values that CloudFront includes in the cache key.
     * Query strings and cookies are not included in the cache key, and only the normalized 'Accept-Encoding' header is included.
     * Disables cache compression.
     */
    static readonly CACHING_OPTIMIZED_FOR_UNCOMPRESSED_OBJECTS: ICachePolicy;
    /** Disables caching. This policy is useful for dynamic content and for requests that are not cacheable. */
    static readonly CACHING_DISABLED: ICachePolicy;
    /** Designed for use with an origin that is an AWS Elemental MediaPackage endpoint. */
    static readonly ELEMENTAL_MEDIA_PACKAGE: ICachePolicy;
    /** Imports a Cache Policy from its id. */
    static fromCachePolicyId(scope: Construct, id: string, cachePolicyId: string): ICachePolicy;
    /** Use an existing managed cache policy. */
    private static fromManagedCachePolicy;
    readonly cachePolicyId: string;
    constructor(scope: Construct, id: string, props?: CachePolicyProps);
    private renderCacheKey;
}
/**
 * Determines whether any cookies in viewer requests are included in the cache key and
 * automatically included in requests that CloudFront sends to the origin.
 */
export declare class CacheCookieBehavior {
    /**
     * Cookies in viewer requests are not included in the cache key and
     * are not automatically included in requests that CloudFront sends to the origin.
     */
    static none(): CacheCookieBehavior;
    /**
     * All cookies in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.
     */
    static all(): CacheCookieBehavior;
    /**
     * Only the provided `cookies` are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     */
    static allowList(...cookies: string[]): CacheCookieBehavior;
    /**
     * All cookies except the provided `cookies` are included in the cache key and
     * automatically included in requests that CloudFront sends to the origin.
     */
    static denyList(...cookies: string[]): CacheCookieBehavior;
    /** The behavior of cookies: allow all, none, an allow list, or a deny list. */
    readonly behavior: string;
    /** The cookies to allow or deny, if the behavior is an allow or deny list. */
    readonly cookies?: string[];
    private constructor();
}
/**
 * Determines whether any HTTP headers are included in the cache key and automatically included in requests that CloudFront sends to the origin.
 */
export declare class CacheHeaderBehavior {
    /** HTTP headers are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. */
    static none(): CacheHeaderBehavior;
    /** Listed headers are included in the cache key and are automatically included in requests that CloudFront sends to the origin. */
    static allowList(...headers: string[]): CacheHeaderBehavior;
    /** If no headers will be passed, or an allow list of headers. */
    readonly behavior: string;
    /** The headers for the allow/deny list, if applicable. */
    readonly headers?: string[];
    private constructor();
}
/**
 * Determines whether any URL query strings in viewer requests are included in the cache key
 * and automatically included in requests that CloudFront sends to the origin.
 */
export declare class CacheQueryStringBehavior {
    /**
     * Query strings in viewer requests are not included in the cache key and
     * are not automatically included in requests that CloudFront sends to the origin.
     */
    static none(): CacheQueryStringBehavior;
    /**
     * All query strings in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.
     */
    static all(): CacheQueryStringBehavior;
    /**
     * Only the provided `queryStrings` are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     */
    static allowList(...queryStrings: string[]): CacheQueryStringBehavior;
    /**
     * All query strings except the provided `queryStrings` are included in the cache key and
     * automatically included in requests that CloudFront sends to the origin.
     */
    static denyList(...queryStrings: string[]): CacheQueryStringBehavior;
    /** The behavior of query strings -- allow all, none, only an allow list, or a deny list. */
    readonly behavior: string;
    /** The query strings to allow or deny, if the behavior is an allow or deny list. */
    readonly queryStrings?: string[];
    private constructor();
}

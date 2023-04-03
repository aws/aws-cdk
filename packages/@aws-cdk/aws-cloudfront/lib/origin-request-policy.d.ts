import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a Origin Request Policy
 */
export interface IOriginRequestPolicy {
    /**
     * The ID of the origin request policy
     * @attribute
     */
    readonly originRequestPolicyId: string;
}
/**
 * Properties for creating a Origin Request Policy
 */
export interface OriginRequestPolicyProps {
    /**
     * A unique name to identify the origin request policy.
     * The name must only include '-', '_', or alphanumeric characters.
     * @default - generated from the `id`
     */
    readonly originRequestPolicyName?: string;
    /**
     * A comment to describe the origin request policy.
     * @default - no comment
     */
    readonly comment?: string;
    /**
     * The cookies from viewer requests to include in origin requests.
     * @default OriginRequestCookieBehavior.none()
     */
    readonly cookieBehavior?: OriginRequestCookieBehavior;
    /**
     * The HTTP headers to include in origin requests. These can include headers from viewer requests and additional headers added by CloudFront.
     * @default OriginRequestHeaderBehavior.none()
     */
    readonly headerBehavior?: OriginRequestHeaderBehavior;
    /**
     * The URL query strings from viewer requests to include in origin requests.
     * @default OriginRequestQueryStringBehavior.none()
     */
    readonly queryStringBehavior?: OriginRequestQueryStringBehavior;
}
/**
 * A Origin Request Policy configuration.
 *
 * @resource AWS::CloudFront::OriginRequestPolicy
 */
export declare class OriginRequestPolicy extends Resource implements IOriginRequestPolicy {
    /** This policy includes only the User-Agent and Referer headers. It doesn’t include any query strings or cookies. */
    static readonly USER_AGENT_REFERER_HEADERS: IOriginRequestPolicy;
    /** This policy includes the header that enables cross-origin resource sharing (CORS) requests when the origin is a custom origin. */
    static readonly CORS_CUSTOM_ORIGIN: IOriginRequestPolicy;
    /** This policy includes the headers that enable cross-origin resource sharing (CORS) requests when the origin is an Amazon S3 bucket. */
    static readonly CORS_S3_ORIGIN: IOriginRequestPolicy;
    /** This policy includes all values (query strings, headers, and cookies) in the viewer request. */
    static readonly ALL_VIEWER: IOriginRequestPolicy;
    /** This policy is designed for use with an origin that is an AWS Elemental MediaTailor endpoint. */
    static readonly ELEMENTAL_MEDIA_TAILOR: IOriginRequestPolicy;
    /** This policy includes all values (headers, cookies, and query strings) in the viewer request, and all CloudFront headers that were released through June 2022 (CloudFront headers released after June 2022 are not included). */
    static readonly ALL_VIEWER_AND_CLOUDFRONT_2022: IOriginRequestPolicy;
    /** Imports a Origin Request Policy from its id. */
    static fromOriginRequestPolicyId(scope: Construct, id: string, originRequestPolicyId: string): IOriginRequestPolicy;
    /** Use an existing managed origin request policy. */
    private static fromManagedOriginRequestPolicy;
    readonly originRequestPolicyId: string;
    constructor(scope: Construct, id: string, props?: OriginRequestPolicyProps);
}
/**
 * Determines whether any cookies in viewer requests (and if so, which cookies)
 * are included in requests that CloudFront sends to the origin.
 */
export declare class OriginRequestCookieBehavior {
    /**
     * Cookies in viewer requests are not included in requests that CloudFront sends to the origin.
     * Any cookies that are listed in a CachePolicy are still included in origin requests.
     */
    static none(): OriginRequestCookieBehavior;
    /** All cookies in viewer requests are included in requests that CloudFront sends to the origin. */
    static all(): OriginRequestCookieBehavior;
    /** Only the provided `cookies` are included in requests that CloudFront sends to the origin. */
    static allowList(...cookies: string[]): OriginRequestCookieBehavior;
    /** The behavior of cookies: allow all, none or an allow list. */
    readonly behavior: string;
    /** The cookies to allow, if the behavior is an allow list. */
    readonly cookies?: string[];
    private constructor();
}
/**
 * Determines whether any HTTP headers (and if so, which headers) are included in requests that CloudFront sends to the origin.
 */
export declare class OriginRequestHeaderBehavior {
    /**
     * HTTP headers are not included in requests that CloudFront sends to the origin.
     * Any headers that are listed in a CachePolicy are still included in origin requests.
     */
    static none(): OriginRequestHeaderBehavior;
    /**
     * All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin.
     * Additionally, any additional CloudFront headers provided are included; the additional headers are added by CloudFront.
     * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-cloudfront-headers.html
     */
    static all(...cloudfrontHeaders: string[]): OriginRequestHeaderBehavior;
    /** Listed headers are included in requests that CloudFront sends to the origin. */
    static allowList(...headers: string[]): OriginRequestHeaderBehavior;
    /** The behavior of headers: allow all, none or an allow list. */
    readonly behavior: string;
    /** The headers for the allow list or the included CloudFront headers, if applicable. */
    readonly headers?: string[];
    private constructor();
}
/**
 * Determines whether any URL query strings in viewer requests (and if so, which query strings)
 * are included in requests that CloudFront sends to the origin.
 */
export declare class OriginRequestQueryStringBehavior {
    /**
     * Query strings in viewer requests are not included in requests that CloudFront sends to the origin.
     * Any query strings that are listed in a CachePolicy are still included in origin requests.
     */
    static none(): OriginRequestQueryStringBehavior;
    /** All query strings in viewer requests are included in requests that CloudFront sends to the origin. */
    static all(): OriginRequestQueryStringBehavior;
    /** Only the provided `queryStrings` are included in requests that CloudFront sends to the origin. */
    static allowList(...queryStrings: string[]): OriginRequestQueryStringBehavior;
    /** The behavior of query strings -- allow all, none, or only an allow list. */
    readonly behavior: string;
    /** The query strings to allow, if the behavior is an allow list. */
    readonly queryStrings?: string[];
    private constructor();
}

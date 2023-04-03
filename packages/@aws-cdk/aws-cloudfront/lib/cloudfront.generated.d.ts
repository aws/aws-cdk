import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnCachePolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html
 */
export interface CfnCachePolicyProps {
    /**
     * The cache policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html#cfn-cloudfront-cachepolicy-cachepolicyconfig
     */
    readonly cachePolicyConfig: CfnCachePolicy.CachePolicyConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::CachePolicy`
 *
 * A cache policy.
 *
 * When it's attached to a cache behavior, the cache policy determines the following:
 *
 * - The values that CloudFront includes in the cache key. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.
 * - The default, minimum, and maximum time to live (TTL) values that you want objects to stay in the CloudFront cache.
 *
 * The headers, cookies, and query strings that are included in the cache key are also included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find a valid object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
 *
 * @cloudformationResource AWS::CloudFront::CachePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html
 */
export declare class CfnCachePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::CachePolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCachePolicy;
    /**
     * The unique identifier for the cache policy. For example: `2766f7b2-75c5-41c6-8f06-bf4303a2f2f5` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The date and time when the cache policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: string;
    /**
     * The cache policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html#cfn-cloudfront-cachepolicy-cachepolicyconfig
     */
    cachePolicyConfig: CfnCachePolicy.CachePolicyConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::CachePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCachePolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnCachePolicy {
    /**
     * A cache policy configuration.
     *
     * This configuration determines the following:
     *
     * - The values that CloudFront includes in the cache key. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.
     * - The default, minimum, and maximum time to live (TTL) values that you want objects to stay in the CloudFront cache.
     *
     * The headers, cookies, and query strings that are included in the cache key are also included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find a valid object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html
     */
    interface CachePolicyConfigProperty {
        /**
         * A comment to describe the cache policy. The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-comment
         */
        readonly comment?: string;
        /**
         * The default amount of time, in seconds, that you want objects to stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated. CloudFront uses this value as the object's time to live (TTL) only when the origin does *not* send `Cache-Control` or `Expires` headers with the object. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The default value for this field is 86400 seconds (one day). If the value of `MinTTL` is more than 86400 seconds, then the default value for this field is the same as the value of `MinTTL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-defaultttl
         */
        readonly defaultTtl: number;
        /**
         * The maximum amount of time, in seconds, that objects stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated. CloudFront uses this value only when the origin sends `Cache-Control` or `Expires` headers with the object. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The default value for this field is 31536000 seconds (one year). If the value of `MinTTL` or `DefaultTTL` is more than 31536000 seconds, then the default value for this field is the same as the value of `DefaultTTL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-maxttl
         */
        readonly maxTtl: number;
        /**
         * The minimum amount of time, in seconds, that you want objects to stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-minttl
         */
        readonly minTtl: number;
        /**
         * A unique name to identify the cache policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-name
         */
        readonly name: string;
        /**
         * The HTTP headers, cookies, and URL query strings to include in the cache key. The values included in the cache key are also included in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-parametersincachekeyandforwardedtoorigin
         */
        readonly parametersInCacheKeyAndForwardedToOrigin: CfnCachePolicy.ParametersInCacheKeyAndForwardedToOriginProperty | cdk.IResolvable;
    }
}
export declare namespace CfnCachePolicy {
    /**
     * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cookiesconfig.html
     */
    interface CookiesConfigProperty {
        /**
         * Determines whether any cookies in viewer requests are included in the cache key and in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – No cookies in viewer requests are included in the cache key or in requests that CloudFront sends to the origin. Even when this field is set to `none` , any cookies that are listed in an `OriginRequestPolicy` *are* included in origin requests.
         * - `whitelist` – Only the cookies in viewer requests that are listed in the `CookieNames` type are included in the cache key and in requests that CloudFront sends to the origin.
         * - `allExcept` – All cookies in viewer requests are included in the cache key and in requests that CloudFront sends to the origin, **except** for those that are listed in the `CookieNames` type, which are not included.
         * - `all` – All cookies in viewer requests are included in the cache key and in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cookiesconfig.html#cfn-cloudfront-cachepolicy-cookiesconfig-cookiebehavior
         */
        readonly cookieBehavior: string;
        /**
         * Contains a list of cookie names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cookiesconfig.html#cfn-cloudfront-cachepolicy-cookiesconfig-cookies
         */
        readonly cookies?: string[];
    }
}
export declare namespace CfnCachePolicy {
    /**
     * An object that determines whether any HTTP headers (and if so, which headers) are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-headersconfig.html
     */
    interface HeadersConfigProperty {
        /**
         * Determines whether any HTTP headers are included in the cache key and in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – No HTTP headers are included in the cache key or in requests that CloudFront sends to the origin. Even when this field is set to `none` , any headers that are listed in an `OriginRequestPolicy` *are* included in origin requests.
         * - `whitelist` – Only the HTTP headers that are listed in the `Headers` type are included in the cache key and in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-headersconfig.html#cfn-cloudfront-cachepolicy-headersconfig-headerbehavior
         */
        readonly headerBehavior: string;
        /**
         * Contains a list of HTTP header names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-headersconfig.html#cfn-cloudfront-cachepolicy-headersconfig-headers
         */
        readonly headers?: string[];
    }
}
export declare namespace CfnCachePolicy {
    /**
     * This object determines the values that CloudFront includes in the cache key. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.
     *
     * The headers, cookies, and query strings that are included in the cache key are also included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find an object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html
     */
    interface ParametersInCacheKeyAndForwardedToOriginProperty {
        /**
         * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in the cache key and in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-cookiesconfig
         */
        readonly cookiesConfig: CfnCachePolicy.CookiesConfigProperty | cdk.IResolvable;
        /**
         * A flag that can affect whether the `Accept-Encoding` HTTP header is included in the cache key and included in requests that CloudFront sends to the origin.
         *
         * This field is related to the `EnableAcceptEncodingGzip` field. If one or both of these fields is `true` *and* the viewer request includes the `Accept-Encoding` header, then CloudFront does the following:
         *
         * - Normalizes the value of the viewer's `Accept-Encoding` header
         * - Includes the normalized header in the cache key
         * - Includes the normalized header in the request to the origin, if a request is necessary
         *
         * For more information, see [Compression support](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-policy-compressed-objects) in the *Amazon CloudFront Developer Guide* .
         *
         * If you set this value to `true` , and this cache behavior also has an origin request policy attached, do not include the `Accept-Encoding` header in the origin request policy. CloudFront always includes the `Accept-Encoding` header in origin requests when the value of this field is `true` , so including this header in an origin request policy has no effect.
         *
         * If both of these fields are `false` , then CloudFront treats the `Accept-Encoding` header the same as any other HTTP header in the viewer request. By default, it's not included in the cache key and it's not included in origin requests. In this case, you can manually add `Accept-Encoding` to the headers whitelist like any other HTTP header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-enableacceptencodingbrotli
         */
        readonly enableAcceptEncodingBrotli?: boolean | cdk.IResolvable;
        /**
         * A flag that can affect whether the `Accept-Encoding` HTTP header is included in the cache key and included in requests that CloudFront sends to the origin.
         *
         * This field is related to the `EnableAcceptEncodingBrotli` field. If one or both of these fields is `true` *and* the viewer request includes the `Accept-Encoding` header, then CloudFront does the following:
         *
         * - Normalizes the value of the viewer's `Accept-Encoding` header
         * - Includes the normalized header in the cache key
         * - Includes the normalized header in the request to the origin, if a request is necessary
         *
         * For more information, see [Compression support](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-policy-compressed-objects) in the *Amazon CloudFront Developer Guide* .
         *
         * If you set this value to `true` , and this cache behavior also has an origin request policy attached, do not include the `Accept-Encoding` header in the origin request policy. CloudFront always includes the `Accept-Encoding` header in origin requests when the value of this field is `true` , so including this header in an origin request policy has no effect.
         *
         * If both of these fields are `false` , then CloudFront treats the `Accept-Encoding` header the same as any other HTTP header in the viewer request. By default, it's not included in the cache key and it's not included in origin requests. In this case, you can manually add `Accept-Encoding` to the headers whitelist like any other HTTP header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-enableacceptencodinggzip
         */
        readonly enableAcceptEncodingGzip: boolean | cdk.IResolvable;
        /**
         * An object that determines whether any HTTP headers (and if so, which headers) are included in the cache key and in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-headersconfig
         */
        readonly headersConfig: CfnCachePolicy.HeadersConfigProperty | cdk.IResolvable;
        /**
         * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in the cache key and in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-querystringsconfig
         */
        readonly queryStringsConfig: CfnCachePolicy.QueryStringsConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnCachePolicy {
    /**
     * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-querystringsconfig.html
     */
    interface QueryStringsConfigProperty {
        /**
         * Determines whether any URL query strings in viewer requests are included in the cache key and in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – No query strings in viewer requests are included in the cache key or in requests that CloudFront sends to the origin. Even when this field is set to `none` , any query strings that are listed in an `OriginRequestPolicy` *are* included in origin requests.
         * - `whitelist` – Only the query strings in viewer requests that are listed in the `QueryStringNames` type are included in the cache key and in requests that CloudFront sends to the origin.
         * - `allExcept` – All query strings in viewer requests are included in the cache key and in requests that CloudFront sends to the origin, **except** those that are listed in the `QueryStringNames` type, which are not included.
         * - `all` – All query strings in viewer requests are included in the cache key and in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-querystringsconfig.html#cfn-cloudfront-cachepolicy-querystringsconfig-querystringbehavior
         */
        readonly queryStringBehavior: string;
        /**
         * Contains a list of query string names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-querystringsconfig.html#cfn-cloudfront-cachepolicy-querystringsconfig-querystrings
         */
        readonly queryStrings?: string[];
    }
}
/**
 * Properties for defining a `CfnCloudFrontOriginAccessIdentity`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html
 */
export interface CfnCloudFrontOriginAccessIdentityProps {
    /**
     * The current configuration information for the identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig
     */
    readonly cloudFrontOriginAccessIdentityConfig: CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::CloudFrontOriginAccessIdentity`
 *
 * The request to create a new origin access identity (OAI). An origin access identity is a special CloudFront user that you can associate with Amazon S3 origins, so that you can secure all or just some of your Amazon S3 content. For more information, see [Restricting Access to Amazon S3 Content by Using an Origin Access Identity](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::CloudFrontOriginAccessIdentity
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html
 */
export declare class CfnCloudFrontOriginAccessIdentity extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::CloudFrontOriginAccessIdentity";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCloudFrontOriginAccessIdentity;
    /**
     * The ID for the origin access identity, for example, `E74FTE3AJFJ256A` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The Amazon S3 canonical user ID for the origin access identity, used when giving the origin access identity read permission to an object in Amazon S3. For example: `b970b42360b81c8ddbd79d2f5df0069ba9033c8a79655752abe380cd6d63ba8bcf23384d568fcf89fc49700b5e11a0fd` .
     * @cloudformationAttribute S3CanonicalUserId
     */
    readonly attrS3CanonicalUserId: string;
    /**
     * The current configuration information for the identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig
     */
    cloudFrontOriginAccessIdentityConfig: CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::CloudFrontOriginAccessIdentity`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCloudFrontOriginAccessIdentityProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnCloudFrontOriginAccessIdentity {
    /**
     * Origin access identity configuration. Send a `GET` request to the `/ *CloudFront API version* /CloudFront/identity ID/config` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html
     */
    interface CloudFrontOriginAccessIdentityConfigProperty {
        /**
         * A comment to describe the origin access identity. The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig-comment
         */
        readonly comment: string;
    }
}
/**
 * Properties for defining a `CfnContinuousDeploymentPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html
 */
export interface CfnContinuousDeploymentPolicyProps {
    /**
     * Contains the configuration for a continuous deployment policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig
     */
    readonly continuousDeploymentPolicyConfig: CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::ContinuousDeploymentPolicy`
 *
 * Creates a continuous deployment policy that routes a subset of production traffic from a primary distribution to a staging distribution.
 *
 * After you create and update a staging distribution, you can use a continuous deployment policy to incrementally move traffic to the staging distribution. This enables you to test changes to a distribution's configuration before moving all of your production traffic to the new configuration.
 *
 * For more information, see [Using CloudFront continuous deployment to safely test CDN configuration changes](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/continuous-deployment.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::ContinuousDeploymentPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html
 */
export declare class CfnContinuousDeploymentPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::ContinuousDeploymentPolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContinuousDeploymentPolicy;
    /**
     * The identifier of the cotinuous deployment policy.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The date and time when the continuous deployment policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: string;
    /**
     * Contains the configuration for a continuous deployment policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig
     */
    continuousDeploymentPolicyConfig: CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::ContinuousDeploymentPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContinuousDeploymentPolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnContinuousDeploymentPolicy {
    /**
     * Contains the configuration for a continuous deployment policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html
     */
    interface ContinuousDeploymentPolicyConfigProperty {
        /**
         * A Boolean that indicates whether this continuous deployment policy is enabled (in effect). When this value is `true` , this policy is enabled and in effect. When this value is `false` , this policy is not enabled and has no effect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The CloudFront domain name of the staging distribution. For example: `d111111abcdef8.cloudfront.net` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-stagingdistributiondnsnames
         */
        readonly stagingDistributionDnsNames: string[];
        /**
         * Contains the parameters for routing production traffic from your primary to staging distributions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-trafficconfig
         */
        readonly trafficConfig?: CfnContinuousDeploymentPolicy.TrafficConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnContinuousDeploymentPolicy {
    /**
     * Session stickiness provides the ability to define multiple requests from a single viewer as a single session. This prevents the potentially inconsistent experience of sending some of a given user's requests to your staging distribution, while others are sent to your primary distribution. Define the session duration using TTL values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig.html
     */
    interface SessionStickinessConfigProperty {
        /**
         * The amount of time after which you want sessions to cease if no requests are received. Allowed values are 300–3600 seconds (5–60 minutes).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig.html#cfn-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig-idlettl
         */
        readonly idleTtl: number;
        /**
         * The maximum amount of time to consider requests from the viewer as being part of the same session. Allowed values are 300–3600 seconds (5–60 minutes).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig.html#cfn-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig-maximumttl
         */
        readonly maximumTtl: number;
    }
}
export declare namespace CfnContinuousDeploymentPolicy {
    /**
     * Determines which HTTP requests are sent to the staging distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderconfig.html
     */
    interface SingleHeaderConfigProperty {
        /**
         * The request header name that you want CloudFront to send to your staging distribution. The header must contain the prefix `aws-cf-cd-` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleheaderconfig-header
         */
        readonly header: string;
        /**
         * The request header value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleheaderconfig-value
         */
        readonly value: string;
    }
}
export declare namespace CfnContinuousDeploymentPolicy {
    /**
     * This configuration determines the percentage of HTTP requests that are sent to the staging distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightconfig.html
     */
    interface SingleWeightConfigProperty {
        /**
         * Session stickiness provides the ability to define multiple requests from a single viewer as a single session. This prevents the potentially inconsistent experience of sending some of a given user's requests to your staging distribution, while others are sent to your primary distribution. Define the session duration using TTL values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleweightconfig-sessionstickinessconfig
         */
        readonly sessionStickinessConfig?: CfnContinuousDeploymentPolicy.SessionStickinessConfigProperty | cdk.IResolvable;
        /**
         * The percentage of traffic to send to a staging distribution, expressed as a decimal number between 0 and .15.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleweightconfig-weight
         */
        readonly weight: number;
    }
}
export declare namespace CfnContinuousDeploymentPolicy {
    /**
     * The traffic configuration of your continuous deployment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html
     */
    interface TrafficConfigProperty {
        /**
         * Determines which HTTP requests are sent to the staging distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html#cfn-cloudfront-continuousdeploymentpolicy-trafficconfig-singleheaderconfig
         */
        readonly singleHeaderConfig?: CfnContinuousDeploymentPolicy.SingleHeaderConfigProperty | cdk.IResolvable;
        /**
         * Contains the percentage of traffic to send to the staging distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html#cfn-cloudfront-continuousdeploymentpolicy-trafficconfig-singleweightconfig
         */
        readonly singleWeightConfig?: CfnContinuousDeploymentPolicy.SingleWeightConfigProperty | cdk.IResolvable;
        /**
         * The type of traffic configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html#cfn-cloudfront-continuousdeploymentpolicy-trafficconfig-type
         */
        readonly type: string;
    }
}
/**
 * Properties for defining a `CfnDistribution`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html
 */
export interface CfnDistributionProps {
    /**
     * The distribution's configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-distributionconfig
     */
    readonly distributionConfig: CfnDistribution.DistributionConfigProperty | cdk.IResolvable;
    /**
     * A complex type that contains zero or more `Tag` elements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::CloudFront::Distribution`
 *
 * A distribution tells CloudFront where you want content to be delivered from, and the details about how to track and manage content delivery.
 *
 * @cloudformationResource AWS::CloudFront::Distribution
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html
 */
export declare class CfnDistribution extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::Distribution";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDistribution;
    /**
     * The domain name of the resource, such as `d111111abcdef8.cloudfront.net` .
     * @cloudformationAttribute DomainName
     */
    readonly attrDomainName: string;
    /**
     * The identifier for the distribution, for example `EDFDVBD632BHDS5` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The distribution's configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-distributionconfig
     */
    distributionConfig: CfnDistribution.DistributionConfigProperty | cdk.IResolvable;
    /**
     * A complex type that contains zero or more `Tag` elements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::CloudFront::Distribution`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDistributionProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnDistribution {
    /**
     * A complex type that describes how CloudFront processes requests.
     *
     * You must create at least as many cache behaviors (including the default cache behavior) as you have origins if you want CloudFront to serve objects from all of the origins. Each cache behavior specifies the one origin from which you want CloudFront to get objects. If you have two origins and only the default cache behavior, the default cache behavior will cause CloudFront to get objects from one of the origins, but the other origin is never used.
     *
     * For the current quota (formerly known as limit) on the number of cache behaviors that you can add to a distribution, see [Quotas](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html) in the *Amazon CloudFront Developer Guide* .
     *
     * If you don't want to specify any cache behaviors, include only an empty `CacheBehaviors` element. Don't include an empty `CacheBehavior` element because this is invalid.
     *
     * To delete all cache behaviors in an existing distribution, update the distribution configuration and include only an empty `CacheBehaviors` element.
     *
     * To add, change, or remove one or more cache behaviors, update the distribution configuration and specify all of the cache behaviors that you want to include in the updated distribution.
     *
     * For more information about cache behaviors, see [Cache Behavior Settings](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCacheBehavior) in the *Amazon CloudFront Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html
     */
    interface CacheBehaviorProperty {
        /**
         * A complex type that controls which HTTP methods CloudFront processes and forwards to your Amazon S3 bucket or your custom origin. There are three choices:
         *
         * - CloudFront forwards only `GET` and `HEAD` requests.
         * - CloudFront forwards only `GET` , `HEAD` , and `OPTIONS` requests.
         * - CloudFront forwards `GET, HEAD, OPTIONS, PUT, PATCH, POST` , and `DELETE` requests.
         *
         * If you pick the third choice, you may need to restrict access to your Amazon S3 bucket or to your custom origin so users can't perform operations that you don't want them to. For example, you might not want users to have permissions to delete objects from your origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-allowedmethods
         */
        readonly allowedMethods?: string[];
        /**
         * The unique identifier of the cache policy that is attached to this cache behavior. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * A `CacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-cachepolicyid
         */
        readonly cachePolicyId?: string;
        /**
         * A complex type that controls whether CloudFront caches the response to requests using the specified HTTP methods. There are two choices:
         *
         * - CloudFront caches responses to `GET` and `HEAD` requests.
         * - CloudFront caches responses to `GET` , `HEAD` , and `OPTIONS` requests.
         *
         * If you pick the second choice for your Amazon S3 Origin, you may need to forward Access-Control-Request-Method, Access-Control-Request-Headers, and Origin headers for the responses to be cached correctly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-cachedmethods
         */
        readonly cachedMethods?: string[];
        /**
         * Whether you want CloudFront to automatically compress certain files for this cache behavior. If so, specify true; if not, specify false. For more information, see [Serving Compressed Files](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-compress
         */
        readonly compress?: boolean | cdk.IResolvable;
        /**
         * This field is deprecated. We recommend that you use the `DefaultTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The default amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin does not add HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-defaultttl
         */
        readonly defaultTtl?: number;
        /**
         * The value of `ID` for the field-level encryption configuration that you want CloudFront to use for encrypting specific fields of data for this cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-fieldlevelencryptionid
         */
        readonly fieldLevelEncryptionId?: string;
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. For more information, see [Working with policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/working-with-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to include values in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * A `CacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
         *
         * A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-forwardedvalues
         */
        readonly forwardedValues?: CfnDistribution.ForwardedValuesProperty | cdk.IResolvable;
        /**
         * A list of CloudFront functions that are associated with this cache behavior. CloudFront functions must be published to the `LIVE` stage to associate them with a cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-functionassociations
         */
        readonly functionAssociations?: Array<CfnDistribution.FunctionAssociationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A complex type that contains zero or more Lambda@Edge function associations for a cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-lambdafunctionassociations
         */
        readonly lambdaFunctionAssociations?: Array<CfnDistribution.LambdaFunctionAssociationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * This field is deprecated. We recommend that you use the `MaxTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The maximum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin adds HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-maxttl
         */
        readonly maxTtl?: number;
        /**
         * This field is deprecated. We recommend that you use the `MinTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The minimum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * You must specify `0` for `MinTTL` if you configure CloudFront to forward all headers to your origin (under `Headers` , if you specify `1` for `Quantity` and `*` for `Name` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-minttl
         */
        readonly minTtl?: number;
        /**
         * The unique identifier of the origin request policy that is attached to this cache behavior. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-originrequestpolicyid
         */
        readonly originRequestPolicyId?: string;
        /**
         * The pattern (for example, `images/*.jpg` ) that specifies which requests to apply the behavior to. When CloudFront receives a viewer request, the requested path is compared with path patterns in the order in which cache behaviors are listed in the distribution.
         *
         * > You can optionally include a slash ( `/` ) at the beginning of the path pattern. For example, `/images/*.jpg` . CloudFront behavior is the same with or without the leading `/` .
         *
         * The path pattern for the default cache behavior is `*` and cannot be changed. If the request for an object does not match the path pattern for any cache behaviors, CloudFront applies the behavior in the default cache behavior.
         *
         * For more information, see [Path Pattern](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesPathPattern) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-pathpattern
         */
        readonly pathPattern: string;
        /**
         * The Amazon Resource Name (ARN) of the real-time log configuration that is attached to this cache behavior. For more information, see [Real-time logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-realtimelogconfigarn
         */
        readonly realtimeLogConfigArn?: string;
        /**
         * The identifier for a response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-responseheaderspolicyid
         */
        readonly responseHeadersPolicyId?: string;
        /**
         * Indicates whether you want to distribute media files in the Microsoft Smooth Streaming format using the origin that is associated with this cache behavior. If so, specify `true` ; if not, specify `false` . If you specify `true` for `SmoothStreaming` , you can still distribute other content using this cache behavior if the content matches the value of `PathPattern` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-smoothstreaming
         */
        readonly smoothStreaming?: boolean | cdk.IResolvable;
        /**
         * The value of `ID` for the origin that you want CloudFront to route requests to when they match this cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-targetoriginid
         */
        readonly targetOriginId: string;
        /**
         * A list of key groups that CloudFront can use to validate signed URLs or signed cookies.
         *
         * When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-trustedkeygroups
         */
        readonly trustedKeyGroups?: string[];
        /**
         * > We recommend using `TrustedKeyGroups` instead of `TrustedSigners` .
         *
         * A list of AWS account IDs whose public keys CloudFront can use to validate signed URLs or signed cookies.
         *
         * When a cache behavior contains trusted signers, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with the private key of a CloudFront key pair in the trusted signer's AWS account . The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-trustedsigners
         */
        readonly trustedSigners?: string[];
        /**
         * The protocol that viewers can use to access the files in the origin specified by `TargetOriginId` when a request matches the path pattern in `PathPattern` . You can specify the following options:
         *
         * - `allow-all` : Viewers can use HTTP or HTTPS.
         * - `redirect-to-https` : If a viewer submits an HTTP request, CloudFront returns an HTTP status code of 301 (Moved Permanently) to the viewer along with the HTTPS URL. The viewer then resubmits the request using the new URL.
         * - `https-only` : If a viewer sends an HTTP request, CloudFront returns an HTTP status code of 403 (Forbidden).
         *
         * For more information about requiring the HTTPS protocol, see [Requiring HTTPS Between Viewers and CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-viewers-to-cloudfront.html) in the *Amazon CloudFront Developer Guide* .
         *
         * > The only way to guarantee that viewers retrieve an object that was fetched from the origin using HTTPS is never to use any other protocol to fetch the object. If you have recently changed from HTTP to HTTPS, we recommend that you clear your objects' cache because cached objects are protocol agnostic. That means that an edge location will return an object from the cache regardless of whether the current request protocol matches the protocol used previously. For more information, see [Managing Cache Expiration](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-viewerprotocolpolicy
         */
        readonly viewerProtocolPolicy: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
     *
     * If you want to include cookies in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send cookies to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * A complex type that specifies whether you want CloudFront to forward cookies to the origin and, if so, which ones. For more information about forwarding cookies to the origin, see [How CloudFront Forwards, Caches, and Logs Cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Cookies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html
     */
    interface CookiesProperty {
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
         *
         * If you want to include cookies in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send cookies to the origin but not include them in the cache key, use origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * Specifies which cookies to forward to the origin for this cache behavior: all, none, or the list of cookies specified in the `WhitelistedNames` complex type.
         *
         * Amazon S3 doesn't process cookies. When the cache behavior is forwarding requests to an Amazon S3 origin, specify none for the `Forward` element.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-forward
         */
        readonly forward: string;
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
         *
         * If you want to include cookies in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send cookies to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * Required if you specify `whitelist` for the value of `Forward` . A complex type that specifies how many different cookies you want CloudFront to forward to the origin for this cache behavior and, if you want to forward selected cookies, the names of those cookies.
         *
         * If you specify `all` or `none` for the value of `Forward` , omit `WhitelistedNames` . If you change the value of `Forward` from `whitelist` to `all` or `none` and you don't delete the `WhitelistedNames` element and its child elements, CloudFront deletes them automatically.
         *
         * For the current limit on the number of cookie names that you can whitelist for each cache behavior, see [CloudFront Limits](https://docs.aws.amazon.com/general/latest/gr/xrefaws_service_limits.html#limits_cloudfront) in the *AWS General Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-whitelistednames
         */
        readonly whitelistedNames?: string[];
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that controls:
     *
     * - Whether CloudFront replaces HTTP status codes in the 4xx and 5xx range with custom error messages before returning the response to the viewer.
     * - How long CloudFront caches HTTP status codes in the 4xx and 5xx range.
     *
     * For more information about custom error pages, see [Customizing Error Responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html
     */
    interface CustomErrorResponseProperty {
        /**
         * The minimum amount of time, in seconds, that you want CloudFront to cache the HTTP status code specified in `ErrorCode` . When this time period has elapsed, CloudFront queries your origin to see whether the problem that caused the error has been resolved and the requested object is now available.
         *
         * For more information, see [Customizing Error Responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcachingminttl
         */
        readonly errorCachingMinTtl?: number;
        /**
         * The HTTP status code for which you want to specify a custom error page and/or a caching duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcode
         */
        readonly errorCode: number;
        /**
         * The HTTP status code that you want CloudFront to return to the viewer along with the custom error page. There are a variety of reasons that you might want CloudFront to return a status code different from the status code that your origin returned to CloudFront, for example:
         *
         * - Some Internet devices (some firewalls and corporate proxies, for example) intercept HTTP 4xx and 5xx and prevent the response from being returned to the viewer. If you substitute `200` , the response typically won't be intercepted.
         * - If you don't care about distinguishing among different client errors or server errors, you can specify `400` or `500` as the `ResponseCode` for all 4xx or 5xx errors.
         * - You might want to return a `200` status code (OK) and static website so your customers don't know that your website is down.
         *
         * If you specify a value for `ResponseCode` , you must also specify a value for `ResponsePagePath` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-responsecode
         */
        readonly responseCode?: number;
        /**
         * The path to the custom error page that you want CloudFront to return to a viewer when your origin returns the HTTP status code specified by `ErrorCode` , for example, `/4xx-errors/403-forbidden.html` . If you want to store your objects and your custom error pages in different locations, your distribution must include a cache behavior for which the following is true:
         *
         * - The value of `PathPattern` matches the path to your custom error messages. For example, suppose you saved custom error pages for 4xx errors in an Amazon S3 bucket in a directory named `/4xx-errors` . Your distribution must include a cache behavior for which the path pattern routes requests for your custom error pages to that location, for example, `/4xx-errors/*` .
         * - The value of `TargetOriginId` specifies the value of the `ID` element for the origin that contains your custom error pages.
         *
         * If you specify a value for `ResponsePagePath` , you must also specify a value for `ResponseCode` .
         *
         * We recommend that you store custom error pages in an Amazon S3 bucket. If you store custom error pages on an HTTP server and the server starts to return 5xx errors, CloudFront can't get the files that you want to return to viewers because the origin server is unavailable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-responsepagepath
         */
        readonly responsePagePath?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A custom origin. A custom origin is any origin that is *not* an Amazon S3 bucket, with one exception. An Amazon S3 bucket that is [configured with static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) *is* a custom origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html
     */
    interface CustomOriginConfigProperty {
        /**
         * The HTTP port that CloudFront uses to connect to the origin. Specify the HTTP port that the origin listens on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-httpport
         */
        readonly httpPort?: number;
        /**
         * The HTTPS port that CloudFront uses to connect to the origin. Specify the HTTPS port that the origin listens on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-httpsport
         */
        readonly httpsPort?: number;
        /**
         * Specifies how long, in seconds, CloudFront persists its connection to the origin. The minimum timeout is 1 second, the maximum is 60 seconds, and the default (if you don't specify otherwise) is 5 seconds.
         *
         * For more information, see [Origin Keep-alive Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginKeepaliveTimeout) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originkeepalivetimeout
         */
        readonly originKeepaliveTimeout?: number;
        /**
         * Specifies the protocol (HTTP or HTTPS) that CloudFront uses to connect to the origin. Valid values are:
         *
         * - `http-only` – CloudFront always uses HTTP to connect to the origin.
         * - `match-viewer` – CloudFront connects to the origin using the same protocol that the viewer used to connect to CloudFront.
         * - `https-only` – CloudFront always uses HTTPS to connect to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originprotocolpolicy
         */
        readonly originProtocolPolicy: string;
        /**
         * Specifies how long, in seconds, CloudFront waits for a response from the origin. This is also known as the *origin response timeout* . The minimum timeout is 1 second, the maximum is 60 seconds, and the default (if you don't specify otherwise) is 30 seconds.
         *
         * For more information, see [Origin Response Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginResponseTimeout) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originreadtimeout
         */
        readonly originReadTimeout?: number;
        /**
         * Specifies the minimum SSL/TLS protocol that CloudFront uses when connecting to your origin over HTTPS. Valid values include `SSLv3` , `TLSv1` , `TLSv1.1` , and `TLSv1.2` .
         *
         * For more information, see [Minimum Origin SSL Protocol](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginSSLProtocols) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originsslprotocols
         */
        readonly originSslProtocols?: string[];
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that describes the default cache behavior if you don't specify a `CacheBehavior` element or if request URLs don't match any of the values of `PathPattern` in `CacheBehavior` elements. You must create exactly one default cache behavior.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html
     */
    interface DefaultCacheBehaviorProperty {
        /**
         * A complex type that controls which HTTP methods CloudFront processes and forwards to your Amazon S3 bucket or your custom origin. There are three choices:
         *
         * - CloudFront forwards only `GET` and `HEAD` requests.
         * - CloudFront forwards only `GET` , `HEAD` , and `OPTIONS` requests.
         * - CloudFront forwards `GET, HEAD, OPTIONS, PUT, PATCH, POST` , and `DELETE` requests.
         *
         * If you pick the third choice, you may need to restrict access to your Amazon S3 bucket or to your custom origin so users can't perform operations that you don't want them to. For example, you might not want users to have permissions to delete objects from your origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-allowedmethods
         */
        readonly allowedMethods?: string[];
        /**
         * The unique identifier of the cache policy that is attached to the default cache behavior. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * A `DefaultCacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-cachepolicyid
         */
        readonly cachePolicyId?: string;
        /**
         * A complex type that controls whether CloudFront caches the response to requests using the specified HTTP methods. There are two choices:
         *
         * - CloudFront caches responses to `GET` and `HEAD` requests.
         * - CloudFront caches responses to `GET` , `HEAD` , and `OPTIONS` requests.
         *
         * If you pick the second choice for your Amazon S3 Origin, you may need to forward Access-Control-Request-Method, Access-Control-Request-Headers, and Origin headers for the responses to be cached correctly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-cachedmethods
         */
        readonly cachedMethods?: string[];
        /**
         * Whether you want CloudFront to automatically compress certain files for this cache behavior. If so, specify `true` ; if not, specify `false` . For more information, see [Serving Compressed Files](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-compress
         */
        readonly compress?: boolean | cdk.IResolvable;
        /**
         * This field is deprecated. We recommend that you use the `DefaultTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The default amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin does not add HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-defaultttl
         */
        readonly defaultTtl?: number;
        /**
         * The value of `ID` for the field-level encryption configuration that you want CloudFront to use for encrypting specific fields of data for the default cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-fieldlevelencryptionid
         */
        readonly fieldLevelEncryptionId?: string;
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. For more information, see [Working with policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/working-with-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to include values in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * A `DefaultCacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
         *
         * A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-forwardedvalues
         */
        readonly forwardedValues?: CfnDistribution.ForwardedValuesProperty | cdk.IResolvable;
        /**
         * A list of CloudFront functions that are associated with this cache behavior. CloudFront functions must be published to the `LIVE` stage to associate them with a cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-functionassociations
         */
        readonly functionAssociations?: Array<CfnDistribution.FunctionAssociationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A complex type that contains zero or more Lambda@Edge function associations for a cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-lambdafunctionassociations
         */
        readonly lambdaFunctionAssociations?: Array<CfnDistribution.LambdaFunctionAssociationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * This field is deprecated. We recommend that you use the `MaxTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The maximum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin adds HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-maxttl
         */
        readonly maxTtl?: number;
        /**
         * This field is deprecated. We recommend that you use the `MinTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * The minimum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * You must specify `0` for `MinTTL` if you configure CloudFront to forward all headers to your origin (under `Headers` , if you specify `1` for `Quantity` and `*` for `Name` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-minttl
         */
        readonly minTtl?: number;
        /**
         * The unique identifier of the origin request policy that is attached to the default cache behavior. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-originrequestpolicyid
         */
        readonly originRequestPolicyId?: string;
        /**
         * The Amazon Resource Name (ARN) of the real-time log configuration that is attached to this cache behavior. For more information, see [Real-time logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-realtimelogconfigarn
         */
        readonly realtimeLogConfigArn?: string;
        /**
         * The identifier for a response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-responseheaderspolicyid
         */
        readonly responseHeadersPolicyId?: string;
        /**
         * Indicates whether you want to distribute media files in the Microsoft Smooth Streaming format using the origin that is associated with this cache behavior. If so, specify `true` ; if not, specify `false` . If you specify `true` for `SmoothStreaming` , you can still distribute other content using this cache behavior if the content matches the value of `PathPattern` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-smoothstreaming
         */
        readonly smoothStreaming?: boolean | cdk.IResolvable;
        /**
         * The value of `ID` for the origin that you want CloudFront to route requests to when they use the default cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-targetoriginid
         */
        readonly targetOriginId: string;
        /**
         * A list of key groups that CloudFront can use to validate signed URLs or signed cookies.
         *
         * When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-trustedkeygroups
         */
        readonly trustedKeyGroups?: string[];
        /**
         * > We recommend using `TrustedKeyGroups` instead of `TrustedSigners` .
         *
         * A list of AWS account IDs whose public keys CloudFront can use to validate signed URLs or signed cookies.
         *
         * When a cache behavior contains trusted signers, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with the private key of a CloudFront key pair in a trusted signer's AWS account . The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-trustedsigners
         */
        readonly trustedSigners?: string[];
        /**
         * The protocol that viewers can use to access the files in the origin specified by `TargetOriginId` when a request matches the path pattern in `PathPattern` . You can specify the following options:
         *
         * - `allow-all` : Viewers can use HTTP or HTTPS.
         * - `redirect-to-https` : If a viewer submits an HTTP request, CloudFront returns an HTTP status code of 301 (Moved Permanently) to the viewer along with the HTTPS URL. The viewer then resubmits the request using the new URL.
         * - `https-only` : If a viewer sends an HTTP request, CloudFront returns an HTTP status code of 403 (Forbidden).
         *
         * For more information about requiring the HTTPS protocol, see [Requiring HTTPS Between Viewers and CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-viewers-to-cloudfront.html) in the *Amazon CloudFront Developer Guide* .
         *
         * > The only way to guarantee that viewers retrieve an object that was fetched from the origin using HTTPS is never to use any other protocol to fetch the object. If you have recently changed from HTTP to HTTPS, we recommend that you clear your objects' cache because cached objects are protocol agnostic. That means that an edge location will return an object from the cache regardless of whether the current request protocol matches the protocol used previously. For more information, see [Managing Cache Expiration](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-viewerprotocolpolicy
         */
        readonly viewerProtocolPolicy: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A distribution configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html
     */
    interface DistributionConfigProperty {
        /**
         * A complex type that contains information about CNAMEs (alternate domain names), if any, for this distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-aliases
         */
        readonly aliases?: string[];
        /**
         * `CfnDistribution.DistributionConfigProperty.CNAMEs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-cnames
         */
        readonly cnamEs?: string[];
        /**
         * A complex type that contains zero or more `CacheBehavior` elements.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-cachebehaviors
         */
        readonly cacheBehaviors?: Array<CfnDistribution.CacheBehaviorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A comment to describe the distribution. The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-comment
         */
        readonly comment?: string;
        /**
         * The identifier of a continuous deployment policy. For more information, see `CreateContinuousDeploymentPolicy` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-continuousdeploymentpolicyid
         */
        readonly continuousDeploymentPolicyId?: string;
        /**
         * A complex type that controls the following:
         *
         * - Whether CloudFront replaces HTTP status codes in the 4xx and 5xx range with custom error messages before returning the response to the viewer.
         * - How long CloudFront caches HTTP status codes in the 4xx and 5xx range.
         *
         * For more information about custom error pages, see [Customizing Error Responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-customerrorresponses
         */
        readonly customErrorResponses?: Array<CfnDistribution.CustomErrorResponseProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnDistribution.DistributionConfigProperty.CustomOrigin`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-customorigin
         */
        readonly customOrigin?: CfnDistribution.LegacyCustomOriginProperty | cdk.IResolvable;
        /**
         * A complex type that describes the default cache behavior if you don't specify a `CacheBehavior` element or if files don't match any of the values of `PathPattern` in `CacheBehavior` elements. You must create exactly one default cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-defaultcachebehavior
         */
        readonly defaultCacheBehavior: CfnDistribution.DefaultCacheBehaviorProperty | cdk.IResolvable;
        /**
         * The object that you want CloudFront to request from your origin (for example, `index.html` ) when a viewer requests the root URL for your distribution ( `https://www.example.com` ) instead of an object in your distribution ( `https://www.example.com/product-description.html` ). Specifying a default root object avoids exposing the contents of your distribution.
         *
         * Specify only the object name, for example, `index.html` . Don't add a `/` before the object name.
         *
         * If you don't want to specify a default root object when you create a distribution, include an empty `DefaultRootObject` element.
         *
         * To delete the default root object from an existing distribution, update the distribution configuration and include an empty `DefaultRootObject` element.
         *
         * To replace the default root object, update the distribution configuration and specify the new object.
         *
         * For more information about the default root object, see [Creating a Default Root Object](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-defaultrootobject
         */
        readonly defaultRootObject?: string;
        /**
         * From this field, you can enable or disable the selected distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * (Optional) Specify the maximum HTTP version(s) that you want viewers to use to communicate with CloudFront . The default value for new distributions is `http1.1` .
         *
         * For viewers and CloudFront to use HTTP/2, viewers must support TLSv1.2 or later, and must support Server Name Indication (SNI).
         *
         * For viewers and CloudFront to use HTTP/3, viewers must support TLSv1.3 and Server Name Indication (SNI). CloudFront supports HTTP/3 connection migration to allow the viewer to switch networks without losing connection. For more information about connection migration, see [Connection Migration](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc9000.html#name-connection-migration) at RFC 9000. For more information about supported TLSv1.3 ciphers, see [Supported protocols and ciphers between viewers and CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-httpversion
         */
        readonly httpVersion?: string;
        /**
         * If you want CloudFront to respond to IPv6 DNS requests with an IPv6 address for your distribution, specify `true` . If you specify `false` , CloudFront responds to IPv6 DNS requests with the DNS response code `NOERROR` and with no IP addresses. This allows viewers to submit a second request, for an IPv4 address for your distribution.
         *
         * In general, you should enable IPv6 if you have users on IPv6 networks who want to access your content. However, if you're using signed URLs or signed cookies to restrict access to your content, and if you're using a custom policy that includes the `IpAddress` parameter to restrict the IP addresses that can access your content, don't enable IPv6. If you want to restrict access to some content by IP address and not restrict access to other content (or restrict access but not by IP address), you can create two distributions. For more information, see [Creating a Signed URL Using a Custom Policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-custom-policy.html) in the *Amazon CloudFront Developer Guide* .
         *
         * If you're using an Amazon Route 53 AWS Integration alias resource record set to route traffic to your CloudFront distribution, you need to create a second alias resource record set when both of the following are true:
         *
         * - You enable IPv6 for the distribution
         * - You're using alternate domain names in the URLs for your objects
         *
         * For more information, see [Routing Traffic to an Amazon CloudFront Web Distribution by Using Your Domain Name](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html) in the *Amazon Route 53 AWS Integration Developer Guide* .
         *
         * If you created a CNAME resource record set, either with Amazon Route 53 AWS Integration or with another DNS service, you don't need to make any changes. A CNAME record will route traffic to your distribution regardless of the IP address format of the viewer request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-ipv6enabled
         */
        readonly ipv6Enabled?: boolean | cdk.IResolvable;
        /**
         * A complex type that controls whether access logs are written for the distribution.
         *
         * For more information about logging, see [Access Logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-logging
         */
        readonly logging?: CfnDistribution.LoggingProperty | cdk.IResolvable;
        /**
         * A complex type that contains information about origin groups for this distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-origingroups
         */
        readonly originGroups?: CfnDistribution.OriginGroupsProperty | cdk.IResolvable;
        /**
         * A complex type that contains information about origins for this distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-origins
         */
        readonly origins?: Array<CfnDistribution.OriginProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The price class that corresponds with the maximum price that you want to pay for CloudFront service. If you specify `PriceClass_All` , CloudFront responds to requests for your objects from all CloudFront edge locations.
         *
         * If you specify a price class other than `PriceClass_All` , CloudFront serves your objects from the CloudFront edge location that has the lowest latency among the edge locations in your price class. Viewers who are in or near regions that are excluded from your specified price class may encounter slower performance.
         *
         * For more information about price classes, see [Choosing the Price Class for a CloudFront Distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html) in the *Amazon CloudFront Developer Guide* . For information about CloudFront pricing, including how price classes (such as Price Class 100) map to CloudFront regions, see [Amazon CloudFront Pricing](https://docs.aws.amazon.com/cloudfront/pricing/) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-priceclass
         */
        readonly priceClass?: string;
        /**
         * A complex type that identifies ways in which you want to restrict distribution of your content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions
         */
        readonly restrictions?: CfnDistribution.RestrictionsProperty | cdk.IResolvable;
        /**
         * `CfnDistribution.DistributionConfigProperty.S3Origin`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-s3origin
         */
        readonly s3Origin?: CfnDistribution.LegacyS3OriginProperty | cdk.IResolvable;
        /**
         * A Boolean that indicates whether this is a staging distribution. When this value is `true` , this is a staging distribution. When this value is `false` , this is not a staging distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-staging
         */
        readonly staging?: boolean | cdk.IResolvable;
        /**
         * A complex type that determines the distribution's SSL/TLS configuration for communicating with viewers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-viewercertificate
         */
        readonly viewerCertificate?: CfnDistribution.ViewerCertificateProperty | cdk.IResolvable;
        /**
         * A unique identifier that specifies the AWS WAF web ACL, if any, to associate with this distribution. To specify a web ACL created using the latest version of AWS WAF , use the ACL ARN, for example `arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a` . To specify a web ACL created using AWS WAF Classic, use the ACL ID, for example `473e64fd-f30b-4765-81a0-62ad96dd167a` .
         *
         * AWS WAF is a web application firewall that lets you monitor the HTTP and HTTPS requests that are forwarded to CloudFront, and lets you control access to your content. Based on conditions that you specify, such as the IP addresses that requests originate from or the values of query strings, CloudFront responds to requests either with the requested content or with an HTTP 403 status code (Forbidden). You can also configure CloudFront to return a custom error page when a request is blocked. For more information about AWS WAF , see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-webaclid
         */
        readonly webAclId?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
     *
     * If you want to include values in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html
     */
    interface ForwardedValuesProperty {
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
         *
         * If you want to include cookies in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send cookies to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * A complex type that specifies whether you want CloudFront to forward cookies to the origin and, if so, which ones. For more information about forwarding cookies to the origin, see [How CloudFront Forwards, Caches, and Logs Cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Cookies.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-cookies
         */
        readonly cookies?: CfnDistribution.CookiesProperty | cdk.IResolvable;
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
         *
         * If you want to include headers in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send headers to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * A complex type that specifies the `Headers` , if any, that you want CloudFront to forward to the origin for this cache behavior (whitelisted headers). For the headers that you specify, CloudFront also caches separate versions of a specified object that is based on the header values in viewer requests.
         *
         * For more information, see [Caching Content Based on Request Headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-headers
         */
        readonly headers?: string[];
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
         *
         * If you want to include query strings in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send query strings to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * Indicates whether you want CloudFront to forward query strings to the origin that is associated with this cache behavior and cache based on the query string parameters. CloudFront behavior depends on the value of `QueryString` and on the values that you specify for `QueryStringCacheKeys` , if any:
         *
         * If you specify true for `QueryString` and you don't specify any values for `QueryStringCacheKeys` , CloudFront forwards all query string parameters to the origin and caches based on all query string parameters. Depending on how many query string parameters and values you have, this can adversely affect performance because CloudFront must forward more requests to the origin.
         *
         * If you specify true for `QueryString` and you specify one or more values for `QueryStringCacheKeys` , CloudFront forwards all query string parameters to the origin, but it only caches based on the query string parameters that you specify.
         *
         * If you specify false for `QueryString` , CloudFront doesn't forward any query string parameters to the origin, and doesn't cache based on query string parameters.
         *
         * For more information, see [Configuring CloudFront to Cache Based on Query String Parameters](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/QueryStringParameters.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-querystring
         */
        readonly queryString: boolean | cdk.IResolvable;
        /**
         * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field.
         *
         * If you want to include query strings in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * If you want to send query strings to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
         *
         * A complex type that contains information about the query string parameters that you want CloudFront to use for caching for this cache behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-querystringcachekeys
         */
        readonly queryStringCacheKeys?: string[];
    }
}
export declare namespace CfnDistribution {
    /**
     * A CloudFront function that is associated with a cache behavior in a CloudFront distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-functionassociation.html
     */
    interface FunctionAssociationProperty {
        /**
         * The event type of the function, either `viewer-request` or `viewer-response` . You cannot use origin-facing event types ( `origin-request` and `origin-response` ) with a CloudFront function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-functionassociation.html#cfn-cloudfront-distribution-functionassociation-eventtype
         */
        readonly eventType?: string;
        /**
         * The Amazon Resource Name (ARN) of the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-functionassociation.html#cfn-cloudfront-distribution-functionassociation-functionarn
         */
        readonly functionArn?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that controls the countries in which your content is distributed. CloudFront determines the location of your users using `MaxMind` GeoIP databases. To disable geo restriction, remove the [Restrictions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions) property from your stack template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html
     */
    interface GeoRestrictionProperty {
        /**
         * A complex type that contains a `Location` element for each country in which you want CloudFront either to distribute your content ( `whitelist` ) or not distribute your content ( `blacklist` ).
         *
         * The `Location` element is a two-letter, uppercase country code for a country that you want to include in your `blacklist` or `whitelist` . Include one `Location` element for each country.
         *
         * CloudFront and `MaxMind` both use `ISO 3166` country codes. For the current list of countries and the corresponding codes, see `ISO 3166-1-alpha-2` code on the *International Organization for Standardization* website. You can also refer to the country list on the CloudFront console, which includes both country names and codes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html#cfn-cloudfront-distribution-georestriction-locations
         */
        readonly locations?: string[];
        /**
         * The method that you want to use to restrict distribution of your content by country:
         *
         * - `none` : No geo restriction is enabled, meaning access to content is not restricted by client geo location.
         * - `blacklist` : The `Location` elements specify the countries in which you don't want CloudFront to distribute your content.
         * - `whitelist` : The `Location` elements specify the countries in which you want CloudFront to distribute your content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html#cfn-cloudfront-distribution-georestriction-restrictiontype
         */
        readonly restrictionType: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that contains a Lambda@Edge function association.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html
     */
    interface LambdaFunctionAssociationProperty {
        /**
         * Specifies the event type that triggers a Lambda@Edge function invocation. You can specify the following values:
         *
         * - `viewer-request` : The function executes when CloudFront receives a request from a viewer and before it checks to see whether the requested object is in the edge cache.
         * - `origin-request` : The function executes only when CloudFront sends a request to your origin. When the requested object is in the edge cache, the function doesn't execute.
         * - `origin-response` : The function executes after CloudFront receives a response from the origin and before it caches the object in the response. When the requested object is in the edge cache, the function doesn't execute.
         * - `viewer-response` : The function executes before CloudFront returns the requested object to the viewer. The function executes regardless of whether the object was already in the edge cache.
         *
         * If the origin returns an HTTP status code other than HTTP 200 (OK), the function doesn't execute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-eventtype
         */
        readonly eventType?: string;
        /**
         * A flag that allows a Lambda@Edge function to have read access to the body content. For more information, see [Accessing the Request Body by Choosing the Include Body Option](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-include-body-access.html) in the Amazon CloudFront Developer Guide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-includebody
         */
        readonly includeBody?: boolean | cdk.IResolvable;
        /**
         * The ARN of the Lambda@Edge function. You must specify the ARN of a function version; you can't specify an alias or $LATEST.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-lambdafunctionarn
         */
        readonly lambdaFunctionArn?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html
     */
    interface LegacyCustomOriginProperty {
        /**
         * `CfnDistribution.LegacyCustomOriginProperty.DNSName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-dnsname
         */
        readonly dnsName: string;
        /**
         * `CfnDistribution.LegacyCustomOriginProperty.HTTPPort`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-httpport
         */
        readonly httpPort?: number;
        /**
         * `CfnDistribution.LegacyCustomOriginProperty.HTTPSPort`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-httpsport
         */
        readonly httpsPort?: number;
        /**
         * `CfnDistribution.LegacyCustomOriginProperty.OriginProtocolPolicy`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-originprotocolpolicy
         */
        readonly originProtocolPolicy: string;
        /**
         * `CfnDistribution.LegacyCustomOriginProperty.OriginSSLProtocols`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-originsslprotocols
         */
        readonly originSslProtocols: string[];
    }
}
export declare namespace CfnDistribution {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacys3origin.html
     */
    interface LegacyS3OriginProperty {
        /**
         * `CfnDistribution.LegacyS3OriginProperty.DNSName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacys3origin.html#cfn-cloudfront-distribution-legacys3origin-dnsname
         */
        readonly dnsName: string;
        /**
         * `CfnDistribution.LegacyS3OriginProperty.OriginAccessIdentity`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacys3origin.html#cfn-cloudfront-distribution-legacys3origin-originaccessidentity
         */
        readonly originAccessIdentity?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that controls whether access logs are written for the distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html
     */
    interface LoggingProperty {
        /**
         * The Amazon S3 bucket to store the access logs in, for example, `myawslogbucket.s3.amazonaws.com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-bucket
         */
        readonly bucket: string;
        /**
         * Specifies whether you want CloudFront to include cookies in access logs, specify `true` for `IncludeCookies` . If you choose to include cookies in logs, CloudFront logs all cookies regardless of how you configure the cache behaviors for this distribution. If you don't want to include cookies when you create a distribution or if you want to disable include cookies for an existing distribution, specify `false` for `IncludeCookies` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-includecookies
         */
        readonly includeCookies?: boolean | cdk.IResolvable;
        /**
         * An optional string that you want CloudFront to prefix to the access log `filenames` for this distribution, for example, `myprefix/` . If you want to enable logging, but you don't want to specify a prefix, you still must include an empty `Prefix` element in the `Logging` element.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-prefix
         */
        readonly prefix?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * An origin.
     *
     * An origin is the location where content is stored, and from which CloudFront gets content to serve to viewers. To specify an origin:
     *
     * - Use `S3OriginConfig` to specify an Amazon S3 bucket that is not configured with static website hosting.
     * - Use `CustomOriginConfig` to specify all other kinds of origins, including:
     *
     * - An Amazon S3 bucket that is configured with static website hosting
     * - An Elastic Load Balancing load balancer
     * - An AWS Elemental MediaPackage endpoint
     * - An AWS Elemental MediaStore container
     * - Any other HTTP server, running on an Amazon EC2 instance or any other kind of host
     *
     * For the current maximum number of origins that you can specify per distribution, see [General Quotas on Web Distributions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-web-distributions) in the *Amazon CloudFront Developer Guide* (quotas were formerly referred to as limits).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html
     */
    interface OriginProperty {
        /**
         * The number of times that CloudFront attempts to connect to the origin. The minimum number is 1, the maximum is 3, and the default (if you don't specify otherwise) is 3.
         *
         * For a custom origin (including an Amazon S3 bucket that's configured with static website hosting), this value also specifies the number of times that CloudFront attempts to get a response from the origin, in the case of an [Origin Response Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginResponseTimeout) .
         *
         * For more information, see [Origin Connection Attempts](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-attempts) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-connectionattempts
         */
        readonly connectionAttempts?: number;
        /**
         * The number of seconds that CloudFront waits when trying to establish a connection to the origin. The minimum timeout is 1 second, the maximum is 10 seconds, and the default (if you don't specify otherwise) is 10 seconds.
         *
         * For more information, see [Origin Connection Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-timeout) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-connectiontimeout
         */
        readonly connectionTimeout?: number;
        /**
         * Use this type to specify an origin that is not an Amazon S3 bucket, with one exception. If the Amazon S3 bucket is configured with static website hosting, use this type. If the Amazon S3 bucket is not configured with static website hosting, use the `S3OriginConfig` type instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-customoriginconfig
         */
        readonly customOriginConfig?: CfnDistribution.CustomOriginConfigProperty | cdk.IResolvable;
        /**
         * The domain name for the origin.
         *
         * For more information, see [Origin Domain Name](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesDomainName) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-domainname
         */
        readonly domainName: string;
        /**
         * A unique identifier for the origin. This value must be unique within the distribution.
         *
         * Use this value to specify the `TargetOriginId` in a `CacheBehavior` or `DefaultCacheBehavior` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-id
         */
        readonly id: string;
        /**
         * The unique identifier of an origin access control for this origin.
         *
         * For more information, see [Restricting access to an Amazon S3 origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-originaccesscontrolid
         */
        readonly originAccessControlId?: string;
        /**
         * A list of HTTP header names and values that CloudFront adds to the requests that it sends to the origin.
         *
         * For more information, see [Adding Custom Headers to Origin Requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-origincustomheaders
         */
        readonly originCustomHeaders?: Array<CfnDistribution.OriginCustomHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * An optional path that CloudFront appends to the origin domain name when CloudFront requests content from the origin.
         *
         * For more information, see [Origin Path](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginPath) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-originpath
         */
        readonly originPath?: string;
        /**
         * CloudFront Origin Shield. Using Origin Shield can help reduce the load on your origin.
         *
         * For more information, see [Using Origin Shield](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-originshield
         */
        readonly originShield?: CfnDistribution.OriginShieldProperty | cdk.IResolvable;
        /**
         * Use this type to specify an origin that is an Amazon S3 bucket that is not configured with static website hosting. To specify any other type of origin, including an Amazon S3 bucket that is configured with static website hosting, use the `CustomOriginConfig` type instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-s3originconfig
         */
        readonly s3OriginConfig?: CfnDistribution.S3OriginConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that contains `HeaderName` and `HeaderValue` elements, if any, for this distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html
     */
    interface OriginCustomHeaderProperty {
        /**
         * The name of a header that you want CloudFront to send to your origin. For more information, see [Adding Custom Headers to Origin Requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/forward-custom-headers.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html#cfn-cloudfront-distribution-origincustomheader-headername
         */
        readonly headerName: string;
        /**
         * The value for the header that you specified in the `HeaderName` field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html#cfn-cloudfront-distribution-origincustomheader-headervalue
         */
        readonly headerValue: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * An origin group includes two origins (a primary origin and a second origin to failover to) and a failover criteria that you specify. You create an origin group to support origin failover in CloudFront. When you create or update a distribution, you can specifiy the origin group instead of a single origin, and CloudFront will failover from the primary origin to the second origin under the failover conditions that you've chosen.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html
     */
    interface OriginGroupProperty {
        /**
         * A complex type that contains information about the failover criteria for an origin group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html#cfn-cloudfront-distribution-origingroup-failovercriteria
         */
        readonly failoverCriteria: CfnDistribution.OriginGroupFailoverCriteriaProperty | cdk.IResolvable;
        /**
         * The origin group's ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html#cfn-cloudfront-distribution-origingroup-id
         */
        readonly id: string;
        /**
         * A complex type that contains information about the origins in an origin group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html#cfn-cloudfront-distribution-origingroup-members
         */
        readonly members: CfnDistribution.OriginGroupMembersProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex data type that includes information about the failover criteria for an origin group, including the status codes for which CloudFront will failover from the primary origin to the second origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupfailovercriteria.html
     */
    interface OriginGroupFailoverCriteriaProperty {
        /**
         * The status codes that, when returned from the primary origin, will trigger CloudFront to failover to the second origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupfailovercriteria.html#cfn-cloudfront-distribution-origingroupfailovercriteria-statuscodes
         */
        readonly statusCodes: CfnDistribution.StatusCodesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDistribution {
    /**
     * An origin in an origin group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmember.html
     */
    interface OriginGroupMemberProperty {
        /**
         * The ID for an origin in an origin group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmember.html#cfn-cloudfront-distribution-origingroupmember-originid
         */
        readonly originId: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex data type for the origins included in an origin group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmembers.html
     */
    interface OriginGroupMembersProperty {
        /**
         * Items (origins) in an origin group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmembers.html#cfn-cloudfront-distribution-origingroupmembers-items
         */
        readonly items: Array<CfnDistribution.OriginGroupMemberProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The number of origins in an origin group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmembers.html#cfn-cloudfront-distribution-origingroupmembers-quantity
         */
        readonly quantity: number;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex data type for the origin groups specified for a distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroups.html
     */
    interface OriginGroupsProperty {
        /**
         * The items (origin groups) in a distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroups.html#cfn-cloudfront-distribution-origingroups-items
         */
        readonly items?: Array<CfnDistribution.OriginGroupProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The number of origin groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroups.html#cfn-cloudfront-distribution-origingroups-quantity
         */
        readonly quantity: number;
    }
}
export declare namespace CfnDistribution {
    /**
     * CloudFront Origin Shield.
     *
     * Using Origin Shield can help reduce the load on your origin. For more information, see [Using Origin Shield](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-originshield.html
     */
    interface OriginShieldProperty {
        /**
         * A flag that specifies whether Origin Shield is enabled.
         *
         * When it's enabled, CloudFront routes all requests through Origin Shield, which can help protect your origin. When it's disabled, CloudFront might send requests directly to your origin from multiple edge locations or regional edge caches.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-originshield.html#cfn-cloudfront-distribution-originshield-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The AWS Region for Origin Shield.
         *
         * Specify the AWS Region that has the lowest latency to your origin. To specify a region, use the region code, not the region name. For example, specify the US East (Ohio) region as `us-east-2` .
         *
         * When you enable CloudFront Origin Shield, you must specify the AWS Region for Origin Shield. For the list of AWS Regions that you can specify, and for help choosing the best Region for your origin, see [Choosing the AWS Region for Origin Shield](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html#choose-origin-shield-region) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-originshield.html#cfn-cloudfront-distribution-originshield-originshieldregion
         */
        readonly originShieldRegion?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that identifies ways in which you want to restrict distribution of your content.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html
     */
    interface RestrictionsProperty {
        /**
         * A complex type that controls the countries in which your content is distributed. CloudFront determines the location of your users using `MaxMind` GeoIP databases. To disable geo restriction, remove the [Restrictions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions) property from your stack template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html#cfn-cloudfront-distribution-restrictions-georestriction
         */
        readonly geoRestriction: CfnDistribution.GeoRestrictionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that contains information about the Amazon S3 origin. If the origin is a custom origin or an S3 bucket that is configured as a website endpoint, use the `CustomOriginConfig` element instead.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html
     */
    interface S3OriginConfigProperty {
        /**
         * The CloudFront origin access identity to associate with the origin. Use an origin access identity to configure the origin so that viewers can *only* access objects in an Amazon S3 bucket through CloudFront. The format of the value is:
         *
         * origin-access-identity/cloudfront/ *ID-of-origin-access-identity*
         *
         * where `*ID-of-origin-access-identity*` is the value that CloudFront returned in the `ID` element when you created the origin access identity.
         *
         * If you want viewers to be able to access objects using either the CloudFront URL or the Amazon S3 URL, specify an empty `OriginAccessIdentity` element.
         *
         * To delete the origin access identity from an existing distribution, update the distribution configuration and include an empty `OriginAccessIdentity` element.
         *
         * To replace the origin access identity, update the distribution configuration and specify the new origin access identity.
         *
         * For more information about the origin access identity, see [Serving Private Content through CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html#cfn-cloudfront-distribution-s3originconfig-originaccessidentity
         */
        readonly originAccessIdentity?: string;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex data type for the status codes that you specify that, when returned by a primary origin, trigger CloudFront to failover to a second origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-statuscodes.html
     */
    interface StatusCodesProperty {
        /**
         * The items (status codes) for an origin group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-statuscodes.html#cfn-cloudfront-distribution-statuscodes-items
         */
        readonly items: number[] | cdk.IResolvable;
        /**
         * The number of status codes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-statuscodes.html#cfn-cloudfront-distribution-statuscodes-quantity
         */
        readonly quantity: number;
    }
}
export declare namespace CfnDistribution {
    /**
     * A complex type that determines the distribution's SSL/TLS configuration for communicating with viewers.
     *
     * If the distribution doesn't use `Aliases` (also known as alternate domain names or CNAMEs)—that is, if the distribution uses the CloudFront domain name such as `d111111abcdef8.cloudfront.net` —set `CloudFrontDefaultCertificate` to `true` and leave all other fields empty.
     *
     * If the distribution uses `Aliases` (alternate domain names or CNAMEs), use the fields in this type to specify the following settings:
     *
     * - Which viewers the distribution accepts HTTPS connections from: only viewers that support [server name indication (SNI)](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Server_Name_Indication) (recommended), or all viewers including those that don't support SNI.
     *
     * - To accept HTTPS connections from only viewers that support SNI, set `SSLSupportMethod` to `sni-only` . This is recommended. Most browsers and clients support SNI. (In CloudFormation, the field name is `SslSupportMethod` . Note the different capitalization.)
     * - To accept HTTPS connections from all viewers, including those that don't support SNI, set `SSLSupportMethod` to `vip` . This is not recommended, and results in additional monthly charges from CloudFront. (In CloudFormation, the field name is `SslSupportMethod` . Note the different capitalization.)
     * - The minimum SSL/TLS protocol version that the distribution can use to communicate with viewers. To specify a minimum version, choose a value for `MinimumProtocolVersion` . For more information, see [Security Policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValues-security-policy) in the *Amazon CloudFront Developer Guide* .
     * - The location of the SSL/TLS certificate, [AWS Certificate Manager (ACM)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) (recommended) or [AWS Identity and Access Management (IAM)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html) . You specify the location by setting a value in one of the following fields (not both):
     *
     * - `ACMCertificateArn` (In CloudFormation, this field name is `AcmCertificateArn` . Note the different capitalization.)
     * - `IAMCertificateId` (In CloudFormation, this field name is `IamCertificateId` . Note the different capitalization.)
     *
     * All distributions support HTTPS connections from viewers. To require viewers to use HTTPS only, or to redirect them from HTTP to HTTPS, use `ViewerProtocolPolicy` in the `CacheBehavior` or `DefaultCacheBehavior` . To specify how CloudFront should use SSL/TLS to communicate with your custom origin, use `CustomOriginConfig` .
     *
     * For more information, see [Using HTTPS with CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https.html) and [Using Alternate Domain Names and HTTPS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-alternate-domain-names.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html
     */
    interface ViewerCertificateProperty {
        /**
         * > In CloudFormation, this field name is `AcmCertificateArn` . Note the different capitalization.
         *
         * If the distribution uses `Aliases` (alternate domain names or CNAMEs) and the SSL/TLS certificate is stored in [AWS Certificate Manager (ACM)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) , provide the Amazon Resource Name (ARN) of the ACM certificate. CloudFront only supports ACM certificates in the US East (N. Virginia) Region ( `us-east-1` ).
         *
         * If you specify an ACM certificate ARN, you must also specify values for `MinimumProtocolVersion` and `SSLSupportMethod` . (In CloudFormation, the field name is `SslSupportMethod` . Note the different capitalization.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-acmcertificatearn
         */
        readonly acmCertificateArn?: string;
        /**
         * If the distribution uses the CloudFront domain name such as `d111111abcdef8.cloudfront.net` , set this field to `true` .
         *
         * If the distribution uses `Aliases` (alternate domain names or CNAMEs), set this field to `false` and specify values for the following fields:
         *
         * - `ACMCertificateArn` or `IAMCertificateId` (specify a value for one, not both)
         *
         * In CloudFormation, these field names are `AcmCertificateArn` and `IamCertificateId` . Note the different capitalization.
         * - `MinimumProtocolVersion`
         * - `SSLSupportMethod` (In CloudFormation, this field name is `SslSupportMethod` . Note the different capitalization.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-cloudfrontdefaultcertificate
         */
        readonly cloudFrontDefaultCertificate?: boolean | cdk.IResolvable;
        /**
         * > In CloudFormation, this field name is `IamCertificateId` . Note the different capitalization.
         *
         * If the distribution uses `Aliases` (alternate domain names or CNAMEs) and the SSL/TLS certificate is stored in [AWS Identity and Access Management (IAM)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html) , provide the ID of the IAM certificate.
         *
         * If you specify an IAM certificate ID, you must also specify values for `MinimumProtocolVersion` and `SSLSupportMethod` . (In CloudFormation, the field name is `SslSupportMethod` . Note the different capitalization.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-iamcertificateid
         */
        readonly iamCertificateId?: string;
        /**
         * If the distribution uses `Aliases` (alternate domain names or CNAMEs), specify the security policy that you want CloudFront to use for HTTPS connections with viewers. The security policy determines two settings:
         *
         * - The minimum SSL/TLS protocol that CloudFront can use to communicate with viewers.
         * - The ciphers that CloudFront can use to encrypt the content that it returns to viewers.
         *
         * For more information, see [Security Policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValues-security-policy) and [Supported Protocols and Ciphers Between Viewers and CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html#secure-connections-supported-ciphers) in the *Amazon CloudFront Developer Guide* .
         *
         * > On the CloudFront console, this setting is called *Security Policy* .
         *
         * When you're using SNI only (you set `SSLSupportMethod` to `sni-only` ), you must specify `TLSv1` or higher. (In CloudFormation, the field name is `SslSupportMethod` . Note the different capitalization.)
         *
         * If the distribution uses the CloudFront domain name such as `d111111abcdef8.cloudfront.net` (you set `CloudFrontDefaultCertificate` to `true` ), CloudFront automatically sets the security policy to `TLSv1` regardless of the value that you set here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-minimumprotocolversion
         */
        readonly minimumProtocolVersion?: string;
        /**
         * > In CloudFormation, this field name is `SslSupportMethod` . Note the different capitalization.
         *
         * If the distribution uses `Aliases` (alternate domain names or CNAMEs), specify which viewers the distribution accepts HTTPS connections from.
         *
         * - `sni-only` – The distribution accepts HTTPS connections from only viewers that support [server name indication (SNI)](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Server_Name_Indication) . This is recommended. Most browsers and clients support SNI.
         * - `vip` – The distribution accepts HTTPS connections from all viewers including those that don't support SNI. This is not recommended, and results in additional monthly charges from CloudFront.
         * - `static-ip` - Do not specify this value unless your distribution has been enabled for this feature by the CloudFront team. If you have a use case that requires static IP addresses for a distribution, contact CloudFront through the [AWS Support Center](https://docs.aws.amazon.com/support/home) .
         *
         * If the distribution uses the CloudFront domain name such as `d111111abcdef8.cloudfront.net` , don't set a value for this field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-sslsupportmethod
         */
        readonly sslSupportMethod?: string;
    }
}
/**
 * Properties for defining a `CfnFunction`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html
 */
export interface CfnFunctionProps {
    /**
     * The function code. For more information about writing a CloudFront function, see [Writing function code for CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/writing-function-code.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functioncode
     */
    readonly functionCode: string;
    /**
     * Contains configuration information about a CloudFront function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionconfig
     */
    readonly functionConfig: CfnFunction.FunctionConfigProperty | cdk.IResolvable;
    /**
     * A name to identify the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-name
     */
    readonly name: string;
    /**
     * A flag that determines whether to automatically publish the function to the `LIVE` stage when it’s created. To automatically publish to the `LIVE` stage, set this property to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-autopublish
     */
    readonly autoPublish?: boolean | cdk.IResolvable;
    /**
     * Contains metadata about a CloudFront function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionmetadata
     */
    readonly functionMetadata?: CfnFunction.FunctionMetadataProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::Function`
 *
 * Creates a CloudFront function.
 *
 * To create a function, you provide the function code and some configuration information about the function. The response contains an Amazon Resource Name (ARN) that uniquely identifies the function, and the function’s stage.
 *
 * By default, when you create a function, it’s in the `DEVELOPMENT` stage. In this stage, you can [test the function](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/test-function.html) in the CloudFront console (or with `TestFunction` in the CloudFront API).
 *
 * When you’re ready to use your function with a CloudFront distribution, publish the function to the `LIVE` stage. You can do this in the CloudFront console, with `PublishFunction` in the CloudFront API, or by updating the `AWS::CloudFront::Function` resource with the `AutoPublish` property set to `true` . When the function is published to the `LIVE` stage, you can attach it to a distribution’s cache behavior, using the function’s ARN.
 *
 * To automatically publish the function to the `LIVE` stage when it’s created, set the `AutoPublish` property to `true` .
 *
 * @cloudformationResource AWS::CloudFront::Function
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html
 */
export declare class CfnFunction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::Function";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunction;
    /**
     * The ARN of the function. For example:
     *
     * `arn:aws:cloudfront::123456789012:function/ExampleFunction` .
     *
     * To get the function ARN, use the following syntax:
     *
     * `!GetAtt *Function_Logical_ID* .FunctionMetadata.FunctionARN`
     * @cloudformationAttribute FunctionARN
     */
    readonly attrFunctionArn: string;
    /**
     * The Amazon Resource Name (ARN) of the function. The ARN uniquely identifies the function.
     * @cloudformationAttribute FunctionMetadata.FunctionARN
     */
    readonly attrFunctionMetadataFunctionArn: string;
    /**
     *
     * @cloudformationAttribute Stage
     */
    readonly attrStage: string;
    /**
     * The function code. For more information about writing a CloudFront function, see [Writing function code for CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/writing-function-code.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functioncode
     */
    functionCode: string;
    /**
     * Contains configuration information about a CloudFront function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionconfig
     */
    functionConfig: CfnFunction.FunctionConfigProperty | cdk.IResolvable;
    /**
     * A name to identify the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-name
     */
    name: string;
    /**
     * A flag that determines whether to automatically publish the function to the `LIVE` stage when it’s created. To automatically publish to the `LIVE` stage, set this property to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-autopublish
     */
    autoPublish: boolean | cdk.IResolvable | undefined;
    /**
     * Contains metadata about a CloudFront function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionmetadata
     */
    functionMetadata: CfnFunction.FunctionMetadataProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::CloudFront::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFunctionProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnFunction {
    /**
     * Contains configuration information about a CloudFront function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html
     */
    interface FunctionConfigProperty {
        /**
         * A comment to describe the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html#cfn-cloudfront-function-functionconfig-comment
         */
        readonly comment: string;
        /**
         * The function's runtime environment. The only valid value is `cloudfront-js-1.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html#cfn-cloudfront-function-functionconfig-runtime
         */
        readonly runtime: string;
    }
}
export declare namespace CfnFunction {
    /**
     * Contains metadata about a CloudFront function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionmetadata.html
     */
    interface FunctionMetadataProperty {
        /**
         * The Amazon Resource Name (ARN) of the function. The ARN uniquely identifies the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionmetadata.html#cfn-cloudfront-function-functionmetadata-functionarn
         */
        readonly functionArn?: string;
    }
}
/**
 * Properties for defining a `CfnKeyGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html
 */
export interface CfnKeyGroupProps {
    /**
     * The key group configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html#cfn-cloudfront-keygroup-keygroupconfig
     */
    readonly keyGroupConfig: CfnKeyGroup.KeyGroupConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::KeyGroup`
 *
 * A key group.
 *
 * A key group contains a list of public keys that you can use with [CloudFront signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) .
 *
 * @cloudformationResource AWS::CloudFront::KeyGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html
 */
export declare class CfnKeyGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::KeyGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnKeyGroup;
    /**
     * The identifier for the key group.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The date and time when the key group was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: string;
    /**
     * The key group configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html#cfn-cloudfront-keygroup-keygroupconfig
     */
    keyGroupConfig: CfnKeyGroup.KeyGroupConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::KeyGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnKeyGroupProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnKeyGroup {
    /**
     * A key group configuration.
     *
     * A key group contains a list of public keys that you can use with [CloudFront signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html
     */
    interface KeyGroupConfigProperty {
        /**
         * A comment to describe the key group. The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html#cfn-cloudfront-keygroup-keygroupconfig-comment
         */
        readonly comment?: string;
        /**
         * A list of the identifiers of the public keys in the key group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html#cfn-cloudfront-keygroup-keygroupconfig-items
         */
        readonly items: string[];
        /**
         * A name to identify the key group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html#cfn-cloudfront-keygroup-keygroupconfig-name
         */
        readonly name: string;
    }
}
/**
 * Properties for defining a `CfnMonitoringSubscription`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html
 */
export interface CfnMonitoringSubscriptionProps {
    /**
     * The ID of the distribution that you are enabling metrics for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-distributionid
     */
    readonly distributionId: string;
    /**
     * A subscription configuration for additional CloudWatch metrics.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-monitoringsubscription
     */
    readonly monitoringSubscription: CfnMonitoringSubscription.MonitoringSubscriptionProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::MonitoringSubscription`
 *
 * A monitoring subscription. This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
 *
 * @cloudformationResource AWS::CloudFront::MonitoringSubscription
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html
 */
export declare class CfnMonitoringSubscription extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::MonitoringSubscription";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMonitoringSubscription;
    /**
     * The ID of the distribution that you are enabling metrics for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-distributionid
     */
    distributionId: string;
    /**
     * A subscription configuration for additional CloudWatch metrics.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-monitoringsubscription
     */
    monitoringSubscription: CfnMonitoringSubscription.MonitoringSubscriptionProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::MonitoringSubscription`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMonitoringSubscriptionProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnMonitoringSubscription {
    /**
     * A monitoring subscription. This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-monitoringsubscription.html
     */
    interface MonitoringSubscriptionProperty {
        /**
         * A subscription configuration for additional CloudWatch metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-monitoringsubscription-realtimemetricssubscriptionconfig
         */
        readonly realtimeMetricsSubscriptionConfig?: CfnMonitoringSubscription.RealtimeMetricsSubscriptionConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnMonitoringSubscription {
    /**
     * A subscription configuration for additional CloudWatch metrics.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig.html
     */
    interface RealtimeMetricsSubscriptionConfigProperty {
        /**
         * A flag that indicates whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig.html#cfn-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig-realtimemetricssubscriptionstatus
         */
        readonly realtimeMetricsSubscriptionStatus: string;
    }
}
/**
 * Properties for defining a `CfnOriginAccessControl`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export interface CfnOriginAccessControlProps {
    /**
     * The origin access control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig
     */
    readonly originAccessControlConfig: CfnOriginAccessControl.OriginAccessControlConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::OriginAccessControl`
 *
 * Creates a new origin access control in CloudFront. After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
 *
 * This makes it possible to block public access to the origin, allowing viewers (users) to access the origin's content only through CloudFront.
 *
 * For more information about using a CloudFront origin access control, see [Restricting access to an AWS origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-origin.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::OriginAccessControl
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export declare class CfnOriginAccessControl extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::OriginAccessControl";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginAccessControl;
    /**
     * The unique identifier of the origin access control.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The origin access control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig
     */
    originAccessControlConfig: CfnOriginAccessControl.OriginAccessControlConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::OriginAccessControl`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOriginAccessControlProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnOriginAccessControl {
    /**
     * Creates a new origin access control in CloudFront. After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
     *
     * This makes it possible to block public access to the origin, allowing viewers (users) to access the origin's content only through CloudFront.
     *
     * For more information about using a CloudFront origin access control, see [Restricting access to an AWS origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-origin.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html
     */
    interface OriginAccessControlConfigProperty {
        /**
         * A description of the origin access control.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-description
         */
        readonly description?: string;
        /**
         * A name to identify the origin access control.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-name
         */
        readonly name: string;
        /**
         * The type of origin that this origin access control is for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-originaccesscontrolorigintype
         */
        readonly originAccessControlOriginType: string;
        /**
         * Specifies which requests CloudFront signs (adds authentication information to). Specify `always` for the most common use case. For more information, see [origin access control advanced settings](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html#oac-advanced-settings) in the *Amazon CloudFront Developer Guide* .
         *
         * This field can have one of the following values:
         *
         * - `always` – CloudFront signs all origin requests, overwriting the `Authorization` header from the viewer request if one exists.
         * - `never` – CloudFront doesn't sign any origin requests. This value turns off origin access control for all origins in all distributions that use this origin access control.
         * - `no-override` – If the viewer request doesn't contain the `Authorization` header, then CloudFront signs the origin request. If the viewer request contains the `Authorization` header, then CloudFront doesn't sign the origin request and instead passes along the `Authorization` header from the viewer request. *WARNING: To pass along the `Authorization` header from the viewer request, you *must* add the `Authorization` header to a [cache policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html) for all cache behaviors that use origins associated with this origin access control.*
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-signingbehavior
         */
        readonly signingBehavior: string;
        /**
         * The signing protocol of the origin access control, which determines how CloudFront signs (authenticates) requests. The only valid value is `sigv4` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-signingprotocol
         */
        readonly signingProtocol: string;
    }
}
/**
 * Properties for defining a `CfnOriginRequestPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html
 */
export interface CfnOriginRequestPolicyProps {
    /**
     * The origin request policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig
     */
    readonly originRequestPolicyConfig: CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::OriginRequestPolicy`
 *
 * An origin request policy.
 *
 * When it's attached to a cache behavior, the origin request policy determines the values that CloudFront includes in requests that it sends to the origin. Each request that CloudFront sends to the origin includes the following:
 *
 * - The request body and the URL path (without the domain name) from the viewer request.
 * - The headers that CloudFront automatically includes in every origin request, including `Host` , `User-Agent` , and `X-Amz-Cf-Id` .
 * - All HTTP headers, cookies, and URL query strings that are specified in the cache policy or the origin request policy. These can include items from the viewer request and, in the case of headers, additional ones that are added by CloudFront.
 *
 * CloudFront sends a request when it can't find an object in its cache that matches the request. If you want to send values to the origin and also include them in the cache key, use `CachePolicy` .
 *
 * @cloudformationResource AWS::CloudFront::OriginRequestPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html
 */
export declare class CfnOriginRequestPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::OriginRequestPolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginRequestPolicy;
    /**
     * The unique identifier for the origin request policy. For example: `befd7079-9bbc-4ebf-8ade-498a3694176c` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The date and time when the origin request policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: string;
    /**
     * The origin request policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig
     */
    originRequestPolicyConfig: CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::OriginRequestPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOriginRequestPolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnOriginRequestPolicy {
    /**
     * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-cookiesconfig.html
     */
    interface CookiesConfigProperty {
        /**
         * Determines whether cookies in viewer requests are included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – No cookies in viewer requests are included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any cookies that are listed in a `CachePolicy` *are* included in origin requests.
         * - `whitelist` – Only the cookies in viewer requests that are listed in the `CookieNames` type are included in requests that CloudFront sends to the origin.
         * - `all` – All cookies in viewer requests are included in requests that CloudFront sends to the origin.
         * - `allExcept` – All cookies in viewer requests are included in requests that CloudFront sends to the origin, **except** for those listed in the `CookieNames` type, which are not included.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-cookiesconfig.html#cfn-cloudfront-originrequestpolicy-cookiesconfig-cookiebehavior
         */
        readonly cookieBehavior: string;
        /**
         * Contains a list of cookie names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-cookiesconfig.html#cfn-cloudfront-originrequestpolicy-cookiesconfig-cookies
         */
        readonly cookies?: string[];
    }
}
export declare namespace CfnOriginRequestPolicy {
    /**
     * An object that determines whether any HTTP headers (and if so, which headers) are included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-headersconfig.html
     */
    interface HeadersConfigProperty {
        /**
         * Determines whether any HTTP headers are included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – No HTTP headers in viewer requests are included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any headers that are listed in a `CachePolicy` *are* included in origin requests.
         * - `whitelist` – Only the HTTP headers that are listed in the `Headers` type are included in requests that CloudFront sends to the origin.
         * - `allViewer` – All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin.
         * - `allViewerAndWhitelistCloudFront` – All HTTP headers in viewer requests and the additional CloudFront headers that are listed in the `Headers` type are included in requests that CloudFront sends to the origin. The additional headers are added by CloudFront.
         * - `allExcept` – All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin, **except** for those listed in the `Headers` type, which are not included.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-headersconfig.html#cfn-cloudfront-originrequestpolicy-headersconfig-headerbehavior
         */
        readonly headerBehavior: string;
        /**
         * Contains a list of HTTP header names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-headersconfig.html#cfn-cloudfront-originrequestpolicy-headersconfig-headers
         */
        readonly headers?: string[];
    }
}
export declare namespace CfnOriginRequestPolicy {
    /**
     * An origin request policy configuration.
     *
     * This configuration determines the values that CloudFront includes in requests that it sends to the origin. Each request that CloudFront sends to the origin includes the following:
     *
     * - The request body and the URL path (without the domain name) from the viewer request.
     * - The headers that CloudFront automatically includes in every origin request, including `Host` , `User-Agent` , and `X-Amz-Cf-Id` .
     * - All HTTP headers, cookies, and URL query strings that are specified in the cache policy or the origin request policy. These can include items from the viewer request and, in the case of headers, additional ones that are added by CloudFront.
     *
     * CloudFront sends a request when it can't find an object in its cache that matches the request. If you want to send values to the origin and also include them in the cache key, use `CachePolicy` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html
     */
    interface OriginRequestPolicyConfigProperty {
        /**
         * A comment to describe the origin request policy. The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-comment
         */
        readonly comment?: string;
        /**
         * The cookies from viewer requests to include in origin requests.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-cookiesconfig
         */
        readonly cookiesConfig: CfnOriginRequestPolicy.CookiesConfigProperty | cdk.IResolvable;
        /**
         * The HTTP headers to include in origin requests. These can include headers from viewer requests and additional headers added by CloudFront.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-headersconfig
         */
        readonly headersConfig: CfnOriginRequestPolicy.HeadersConfigProperty | cdk.IResolvable;
        /**
         * A unique name to identify the origin request policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-name
         */
        readonly name: string;
        /**
         * The URL query strings from viewer requests to include in origin requests.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-querystringsconfig
         */
        readonly queryStringsConfig: CfnOriginRequestPolicy.QueryStringsConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnOriginRequestPolicy {
    /**
     * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-querystringsconfig.html
     */
    interface QueryStringsConfigProperty {
        /**
         * Determines whether any URL query strings in viewer requests are included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – No query strings in viewer requests are included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any query strings that are listed in a `CachePolicy` *are* included in origin requests.
         * - `whitelist` – Only the query strings in viewer requests that are listed in the `QueryStringNames` type are included in requests that CloudFront sends to the origin.
         * - `all` – All query strings in viewer requests are included in requests that CloudFront sends to the origin.
         * - `allExcept` – All query strings in viewer requests are included in requests that CloudFront sends to the origin, **except** for those listed in the `QueryStringNames` type, which are not included.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-querystringsconfig.html#cfn-cloudfront-originrequestpolicy-querystringsconfig-querystringbehavior
         */
        readonly queryStringBehavior: string;
        /**
         * Contains a list of query string names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-querystringsconfig.html#cfn-cloudfront-originrequestpolicy-querystringsconfig-querystrings
         */
        readonly queryStrings?: string[];
    }
}
/**
 * Properties for defining a `CfnPublicKey`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html
 */
export interface CfnPublicKeyProps {
    /**
     * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html#cfn-cloudfront-publickey-publickeyconfig
     */
    readonly publicKeyConfig: CfnPublicKey.PublicKeyConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::PublicKey`
 *
 * A public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
 *
 * @cloudformationResource AWS::CloudFront::PublicKey
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html
 */
export declare class CfnPublicKey extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::PublicKey";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublicKey;
    /**
     * The date and time when the public key was uploaded.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The identifier of the public key.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html#cfn-cloudfront-publickey-publickeyconfig
     */
    publicKeyConfig: CfnPublicKey.PublicKeyConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::PublicKey`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPublicKeyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnPublicKey {
    /**
     * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html
     */
    interface PublicKeyConfigProperty {
        /**
         * A string included in the request to help make sure that the request can't be replayed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-callerreference
         */
        readonly callerReference: string;
        /**
         * A comment to describe the public key. The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-comment
         */
        readonly comment?: string;
        /**
         * The public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-encodedkey
         */
        readonly encodedKey: string;
        /**
         * A name to help identify the public key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-name
         */
        readonly name: string;
    }
}
/**
 * Properties for defining a `CfnRealtimeLogConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html
 */
export interface CfnRealtimeLogConfigProps {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data for this real-time log configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-endpoints
     */
    readonly endPoints: Array<CfnRealtimeLogConfig.EndPointProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A list of fields that are included in each real-time log record. In an API response, the fields are provided in the same order in which they are sent to the Amazon Kinesis data stream.
     *
     * For more information about fields, see [Real-time log configuration fields](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html#understand-real-time-log-config-fields) in the *Amazon CloudFront Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-fields
     */
    readonly fields: string[];
    /**
     * The unique name of this real-time log configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-name
     */
    readonly name: string;
    /**
     * The sampling rate for this real-time log configuration. The sampling rate determines the percentage of viewer requests that are represented in the real-time log data. The sampling rate is an integer between 1 and 100, inclusive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-samplingrate
     */
    readonly samplingRate: number;
}
/**
 * A CloudFormation `AWS::CloudFront::RealtimeLogConfig`
 *
 * A real-time log configuration.
 *
 * @cloudformationResource AWS::CloudFront::RealtimeLogConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html
 */
export declare class CfnRealtimeLogConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::RealtimeLogConfig";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRealtimeLogConfig;
    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration. For example: `arn:aws:cloudfront::111122223333:realtime-log-config/ExampleNameForRealtimeLogConfig` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data for this real-time log configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-endpoints
     */
    endPoints: Array<CfnRealtimeLogConfig.EndPointProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A list of fields that are included in each real-time log record. In an API response, the fields are provided in the same order in which they are sent to the Amazon Kinesis data stream.
     *
     * For more information about fields, see [Real-time log configuration fields](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html#understand-real-time-log-config-fields) in the *Amazon CloudFront Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-fields
     */
    fields: string[];
    /**
     * The unique name of this real-time log configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-name
     */
    name: string;
    /**
     * The sampling rate for this real-time log configuration. The sampling rate determines the percentage of viewer requests that are represented in the real-time log data. The sampling rate is an integer between 1 and 100, inclusive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-samplingrate
     */
    samplingRate: number;
    /**
     * Create a new `AWS::CloudFront::RealtimeLogConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRealtimeLogConfigProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnRealtimeLogConfig {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data in a real-time log configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-endpoint.html
     */
    interface EndPointProperty {
        /**
         * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-endpoint.html#cfn-cloudfront-realtimelogconfig-endpoint-kinesisstreamconfig
         */
        readonly kinesisStreamConfig: CfnRealtimeLogConfig.KinesisStreamConfigProperty | cdk.IResolvable;
        /**
         * The type of data stream where you are sending real-time log data. The only valid value is `Kinesis` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-endpoint.html#cfn-cloudfront-realtimelogconfig-endpoint-streamtype
         */
        readonly streamType: string;
    }
}
export declare namespace CfnRealtimeLogConfig {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-kinesisstreamconfig.html
     */
    interface KinesisStreamConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of an AWS Identity and Access Management (IAM) role that CloudFront can use to send real-time log data to your Kinesis data stream.
         *
         * For more information the IAM role, see [Real-time log configuration IAM role](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html#understand-real-time-log-config-iam-role) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-kinesisstreamconfig.html#cfn-cloudfront-realtimelogconfig-kinesisstreamconfig-rolearn
         */
        readonly roleArn: string;
        /**
         * The Amazon Resource Name (ARN) of the Kinesis data stream where you are sending real-time log data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-kinesisstreamconfig.html#cfn-cloudfront-realtimelogconfig-kinesisstreamconfig-streamarn
         */
        readonly streamArn: string;
    }
}
/**
 * Properties for defining a `CfnResponseHeadersPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html
 */
export interface CfnResponseHeadersPolicyProps {
    /**
     * A response headers policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig
     */
    readonly responseHeadersPolicyConfig: CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFront::ResponseHeadersPolicy`
 *
 * A response headers policy.
 *
 * A response headers policy contains information about a set of HTTP response headers.
 *
 * After you create a response headers policy, you can use its ID to attach it to one or more cache behaviors in a CloudFront distribution. When it's attached to a cache behavior, the response headers policy affects the HTTP headers that CloudFront includes in HTTP responses to requests that match the cache behavior. CloudFront adds or removes response headers according to the configuration of the response headers policy.
 *
 * For more information, see [Adding or removing HTTP headers in CloudFront responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/modifying-response-headers.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::ResponseHeadersPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html
 */
export declare class CfnResponseHeadersPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::ResponseHeadersPolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResponseHeadersPolicy;
    /**
     * The unique identifier for the response headers policy. For example: `57f99797-3b20-4e1b-a728-27972a74082a` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The date and time when the response headers policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: string;
    /**
     * A response headers policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig
     */
    responseHeadersPolicyConfig: CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::CloudFront::ResponseHeadersPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResponseHeadersPolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A list of HTTP header names that CloudFront includes as values for the `Access-Control-Allow-Headers` HTTP response header.
     *
     * For more information about the `Access-Control-Allow-Headers` HTTP response header, see [Access-Control-Allow-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowheaders.html
     */
    interface AccessControlAllowHeadersProperty {
        /**
         * The list of HTTP header names. You can specify `*` to allow all headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowheaders.html#cfn-cloudfront-responseheaderspolicy-accesscontrolallowheaders-items
         */
        readonly items: string[];
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A list of HTTP methods that CloudFront includes as values for the `Access-Control-Allow-Methods` HTTP response header.
     *
     * For more information about the `Access-Control-Allow-Methods` HTTP response header, see [Access-Control-Allow-Methods](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowmethods.html
     */
    interface AccessControlAllowMethodsProperty {
        /**
         * The list of HTTP methods. Valid values are:
         *
         * - `GET`
         * - `DELETE`
         * - `HEAD`
         * - `OPTIONS`
         * - `PATCH`
         * - `POST`
         * - `PUT`
         * - `ALL`
         *
         * `ALL` is a special value that includes all of the listed HTTP methods.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowmethods.html#cfn-cloudfront-responseheaderspolicy-accesscontrolallowmethods-items
         */
        readonly items: string[];
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A list of origins (domain names) that CloudFront can use as the value for the `Access-Control-Allow-Origin` HTTP response header.
     *
     * For more information about the `Access-Control-Allow-Origin` HTTP response header, see [Access-Control-Allow-Origin](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolalloworigins.html
     */
    interface AccessControlAllowOriginsProperty {
        /**
         * The list of origins (domain names). You can specify `*` to allow all origins.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolalloworigins.html#cfn-cloudfront-responseheaderspolicy-accesscontrolalloworigins-items
         */
        readonly items: string[];
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A list of HTTP headers that CloudFront includes as values for the `Access-Control-Expose-Headers` HTTP response header.
     *
     * For more information about the `Access-Control-Expose-Headers` HTTP response header, see [Access-Control-Expose-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolexposeheaders.html
     */
    interface AccessControlExposeHeadersProperty {
        /**
         * The list of HTTP headers. You can specify `*` to expose all headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolexposeheaders.html#cfn-cloudfront-responseheaderspolicy-accesscontrolexposeheaders-items
         */
        readonly items: string[];
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * The policy directives and their values that CloudFront includes as values for the `Content-Security-Policy` HTTP response header.
     *
     * For more information about the `Content-Security-Policy` HTTP response header, see [Content-Security-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contentsecuritypolicy.html
     */
    interface ContentSecurityPolicyProperty {
        /**
         * The policy directives and their values that CloudFront includes as values for the `Content-Security-Policy` HTTP response header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contentsecuritypolicy.html#cfn-cloudfront-responseheaderspolicy-contentsecuritypolicy-contentsecuritypolicy
         */
        readonly contentSecurityPolicy: string;
        /**
         * A Boolean that determines whether CloudFront overrides the `Content-Security-Policy` HTTP response header received from the origin with the one specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contentsecuritypolicy.html#cfn-cloudfront-responseheaderspolicy-contentsecuritypolicy-override
         */
        readonly override: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * Determines whether CloudFront includes the `X-Content-Type-Options` HTTP response header with its value set to `nosniff` .
     *
     * For more information about the `X-Content-Type-Options` HTTP response header, see [X-Content-Type-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contenttypeoptions.html
     */
    interface ContentTypeOptionsProperty {
        /**
         * A Boolean that determines whether CloudFront overrides the `X-Content-Type-Options` HTTP response header received from the origin with the one specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contenttypeoptions.html#cfn-cloudfront-responseheaderspolicy-contenttypeoptions-override
         */
        readonly override: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A configuration for a set of HTTP response headers that are used for cross-origin resource sharing (CORS). CloudFront adds these headers to HTTP responses that it sends for CORS requests that match a cache behavior associated with this response headers policy.
     *
     * For more information about CORS, see [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html
     */
    interface CorsConfigProperty {
        /**
         * A Boolean that CloudFront uses as the value for the `Access-Control-Allow-Credentials` HTTP response header.
         *
         * For more information about the `Access-Control-Allow-Credentials` HTTP response header, see [Access-Control-Allow-Credentials](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolallowcredentials
         */
        readonly accessControlAllowCredentials: boolean | cdk.IResolvable;
        /**
         * A list of HTTP header names that CloudFront includes as values for the `Access-Control-Allow-Headers` HTTP response header.
         *
         * For more information about the `Access-Control-Allow-Headers` HTTP response header, see [Access-Control-Allow-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolallowheaders
         */
        readonly accessControlAllowHeaders: CfnResponseHeadersPolicy.AccessControlAllowHeadersProperty | cdk.IResolvable;
        /**
         * A list of HTTP methods that CloudFront includes as values for the `Access-Control-Allow-Methods` HTTP response header.
         *
         * For more information about the `Access-Control-Allow-Methods` HTTP response header, see [Access-Control-Allow-Methods](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolallowmethods
         */
        readonly accessControlAllowMethods: CfnResponseHeadersPolicy.AccessControlAllowMethodsProperty | cdk.IResolvable;
        /**
         * A list of origins (domain names) that CloudFront can use as the value for the `Access-Control-Allow-Origin` HTTP response header.
         *
         * For more information about the `Access-Control-Allow-Origin` HTTP response header, see [Access-Control-Allow-Origin](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolalloworigins
         */
        readonly accessControlAllowOrigins: CfnResponseHeadersPolicy.AccessControlAllowOriginsProperty | cdk.IResolvable;
        /**
         * A list of HTTP headers that CloudFront includes as values for the `Access-Control-Expose-Headers` HTTP response header.
         *
         * For more information about the `Access-Control-Expose-Headers` HTTP response header, see [Access-Control-Expose-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolexposeheaders
         */
        readonly accessControlExposeHeaders?: CfnResponseHeadersPolicy.AccessControlExposeHeadersProperty | cdk.IResolvable;
        /**
         * A number that CloudFront uses as the value for the `Access-Control-Max-Age` HTTP response header.
         *
         * For more information about the `Access-Control-Max-Age` HTTP response header, see [Access-Control-Max-Age](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolmaxagesec
         */
        readonly accessControlMaxAgeSec?: number;
        /**
         * A Boolean that determines whether CloudFront overrides HTTP response headers received from the origin with the ones specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-originoverride
         */
        readonly originOverride: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * An HTTP response header name and its value. CloudFront includes this header in HTTP responses that it sends for requests that match a cache behavior that's associated with this response headers policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html
     */
    interface CustomHeaderProperty {
        /**
         * The HTTP response header name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html#cfn-cloudfront-responseheaderspolicy-customheader-header
         */
        readonly header: string;
        /**
         * A Boolean that determines whether CloudFront overrides a response header with the same name received from the origin with the header specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html#cfn-cloudfront-responseheaderspolicy-customheader-override
         */
        readonly override: boolean | cdk.IResolvable;
        /**
         * The value for the HTTP response header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html#cfn-cloudfront-responseheaderspolicy-customheader-value
         */
        readonly value: string;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A list of HTTP response header names and their values. CloudFront includes these headers in HTTP responses that it sends for requests that match a cache behavior that's associated with this response headers policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheadersconfig.html
     */
    interface CustomHeadersConfigProperty {
        /**
         * The list of HTTP response headers and their values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheadersconfig.html#cfn-cloudfront-responseheaderspolicy-customheadersconfig-items
         */
        readonly items: Array<CfnResponseHeadersPolicy.CustomHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * Determines whether CloudFront includes the `X-Frame-Options` HTTP response header and the header's value.
     *
     * For more information about the `X-Frame-Options` HTTP response header, see [X-Frame-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-frameoptions.html
     */
    interface FrameOptionsProperty {
        /**
         * The value of the `X-Frame-Options` HTTP response header. Valid values are `DENY` and `SAMEORIGIN` .
         *
         * For more information about these values, see [X-Frame-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-frameoptions.html#cfn-cloudfront-responseheaderspolicy-frameoptions-frameoption
         */
        readonly frameOption: string;
        /**
         * A Boolean that determines whether CloudFront overrides the `X-Frame-Options` HTTP response header received from the origin with the one specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-frameoptions.html#cfn-cloudfront-responseheaderspolicy-frameoptions-override
         */
        readonly override: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * Determines whether CloudFront includes the `Referrer-Policy` HTTP response header and the header's value.
     *
     * For more information about the `Referrer-Policy` HTTP response header, see [Referrer-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-referrerpolicy.html
     */
    interface ReferrerPolicyProperty {
        /**
         * A Boolean that determines whether CloudFront overrides the `Referrer-Policy` HTTP response header received from the origin with the one specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-referrerpolicy.html#cfn-cloudfront-responseheaderspolicy-referrerpolicy-override
         */
        readonly override: boolean | cdk.IResolvable;
        /**
         * The value of the `Referrer-Policy` HTTP response header. Valid values are:
         *
         * - `no-referrer`
         * - `no-referrer-when-downgrade`
         * - `origin`
         * - `origin-when-cross-origin`
         * - `same-origin`
         * - `strict-origin`
         * - `strict-origin-when-cross-origin`
         * - `unsafe-url`
         *
         * For more information about these values, see [Referrer-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-referrerpolicy.html#cfn-cloudfront-responseheaderspolicy-referrerpolicy-referrerpolicy
         */
        readonly referrerPolicy: string;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * The name of an HTTP header that CloudFront removes from HTTP responses to requests that match the cache behavior that this response headers policy is attached to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheader.html
     */
    interface RemoveHeaderProperty {
        /**
         * The HTTP header name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheader.html#cfn-cloudfront-responseheaderspolicy-removeheader-header
         */
        readonly header: string;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A list of HTTP header names that CloudFront removes from HTTP responses to requests that match the cache behavior that this response headers policy is attached to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheadersconfig.html
     */
    interface RemoveHeadersConfigProperty {
        /**
         * The list of HTTP header names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheadersconfig.html#cfn-cloudfront-responseheaderspolicy-removeheadersconfig-items
         */
        readonly items: Array<CfnResponseHeadersPolicy.RemoveHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A response headers policy configuration.
     *
     * A response headers policy configuration contains metadata about the response headers policy, and configurations for sets of HTTP response headers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html
     */
    interface ResponseHeadersPolicyConfigProperty {
        /**
         * A comment to describe the response headers policy.
         *
         * The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-comment
         */
        readonly comment?: string;
        /**
         * A configuration for a set of HTTP response headers that are used for cross-origin resource sharing (CORS).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-corsconfig
         */
        readonly corsConfig?: CfnResponseHeadersPolicy.CorsConfigProperty | cdk.IResolvable;
        /**
         * A configuration for a set of custom HTTP response headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-customheadersconfig
         */
        readonly customHeadersConfig?: CfnResponseHeadersPolicy.CustomHeadersConfigProperty | cdk.IResolvable;
        /**
         * A name to identify the response headers policy.
         *
         * The name must be unique for response headers policies in this AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-name
         */
        readonly name: string;
        /**
         * A configuration for a set of HTTP headers to remove from the HTTP response.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-removeheadersconfig
         */
        readonly removeHeadersConfig?: CfnResponseHeadersPolicy.RemoveHeadersConfigProperty | cdk.IResolvable;
        /**
         * A configuration for a set of security-related HTTP response headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-securityheadersconfig
         */
        readonly securityHeadersConfig?: CfnResponseHeadersPolicy.SecurityHeadersConfigProperty | cdk.IResolvable;
        /**
         * A configuration for enabling the `Server-Timing` header in HTTP responses sent from CloudFront.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-servertimingheadersconfig
         */
        readonly serverTimingHeadersConfig?: CfnResponseHeadersPolicy.ServerTimingHeadersConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A configuration for a set of security-related HTTP response headers. CloudFront adds these headers to HTTP responses that it sends for requests that match a cache behavior associated with this response headers policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html
     */
    interface SecurityHeadersConfigProperty {
        /**
         * The policy directives and their values that CloudFront includes as values for the `Content-Security-Policy` HTTP response header.
         *
         * For more information about the `Content-Security-Policy` HTTP response header, see [Content-Security-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-contentsecuritypolicy
         */
        readonly contentSecurityPolicy?: CfnResponseHeadersPolicy.ContentSecurityPolicyProperty | cdk.IResolvable;
        /**
         * Determines whether CloudFront includes the `X-Content-Type-Options` HTTP response header with its value set to `nosniff` .
         *
         * For more information about the `X-Content-Type-Options` HTTP response header, see [X-Content-Type-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-contenttypeoptions
         */
        readonly contentTypeOptions?: CfnResponseHeadersPolicy.ContentTypeOptionsProperty | cdk.IResolvable;
        /**
         * Determines whether CloudFront includes the `X-Frame-Options` HTTP response header and the header's value.
         *
         * For more information about the `X-Frame-Options` HTTP response header, see [X-Frame-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-frameoptions
         */
        readonly frameOptions?: CfnResponseHeadersPolicy.FrameOptionsProperty | cdk.IResolvable;
        /**
         * Determines whether CloudFront includes the `Referrer-Policy` HTTP response header and the header's value.
         *
         * For more information about the `Referrer-Policy` HTTP response header, see [Referrer-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-referrerpolicy
         */
        readonly referrerPolicy?: CfnResponseHeadersPolicy.ReferrerPolicyProperty | cdk.IResolvable;
        /**
         * Determines whether CloudFront includes the `Strict-Transport-Security` HTTP response header and the header's value.
         *
         * For more information about the `Strict-Transport-Security` HTTP response header, see [Strict-Transport-Security](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-stricttransportsecurity
         */
        readonly strictTransportSecurity?: CfnResponseHeadersPolicy.StrictTransportSecurityProperty | cdk.IResolvable;
        /**
         * Determines whether CloudFront includes the `X-XSS-Protection` HTTP response header and the header's value.
         *
         * For more information about the `X-XSS-Protection` HTTP response header, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-xssprotection
         */
        readonly xssProtection?: CfnResponseHeadersPolicy.XSSProtectionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * A configuration for enabling the `Server-Timing` header in HTTP responses sent from CloudFront.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-servertimingheadersconfig.html
     */
    interface ServerTimingHeadersConfigProperty {
        /**
         * A Boolean that determines whether CloudFront adds the `Server-Timing` header to HTTP responses that it sends in response to requests that match a cache behavior that's associated with this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-servertimingheadersconfig.html#cfn-cloudfront-responseheaderspolicy-servertimingheadersconfig-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * A number 0–100 (inclusive) that specifies the percentage of responses that you want CloudFront to add the `Server-Timing` header to. When you set the sampling rate to 100, CloudFront adds the `Server-Timing` header to the HTTP response for every request that matches the cache behavior that this response headers policy is attached to. When you set it to 50, CloudFront adds the header to 50% of the responses for requests that match the cache behavior. You can set the sampling rate to any number 0–100 with up to four decimal places.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-servertimingheadersconfig.html#cfn-cloudfront-responseheaderspolicy-servertimingheadersconfig-samplingrate
         */
        readonly samplingRate?: number;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * Determines whether CloudFront includes the `Strict-Transport-Security` HTTP response header and the header's value.
     *
     * For more information about the `Strict-Transport-Security` HTTP response header, see [Strict-Transport-Security](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html
     */
    interface StrictTransportSecurityProperty {
        /**
         * A number that CloudFront uses as the value for the `max-age` directive in the `Strict-Transport-Security` HTTP response header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-accesscontrolmaxagesec
         */
        readonly accessControlMaxAgeSec: number;
        /**
         * A Boolean that determines whether CloudFront includes the `includeSubDomains` directive in the `Strict-Transport-Security` HTTP response header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-includesubdomains
         */
        readonly includeSubdomains?: boolean | cdk.IResolvable;
        /**
         * A Boolean that determines whether CloudFront overrides the `Strict-Transport-Security` HTTP response header received from the origin with the one specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-override
         */
        readonly override: boolean | cdk.IResolvable;
        /**
         * A Boolean that determines whether CloudFront includes the `preload` directive in the `Strict-Transport-Security` HTTP response header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-preload
         */
        readonly preload?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnResponseHeadersPolicy {
    /**
     * Determines whether CloudFront includes the `X-XSS-Protection` HTTP response header and the header's value.
     *
     * For more information about the `X-XSS-Protection` HTTP response header, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html
     */
    interface XSSProtectionProperty {
        /**
         * A Boolean that determines whether CloudFront includes the `mode=block` directive in the `X-XSS-Protection` header.
         *
         * For more information about this directive, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-modeblock
         */
        readonly modeBlock?: boolean | cdk.IResolvable;
        /**
         * A Boolean that determines whether CloudFront overrides the `X-XSS-Protection` HTTP response header received from the origin with the one specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-override
         */
        readonly override: boolean | cdk.IResolvable;
        /**
         * A Boolean that determines the value of the `X-XSS-Protection` HTTP response header. When this setting is `true` , the value of the `X-XSS-Protection` header is `1` . When this setting is `false` , the value of the `X-XSS-Protection` header is `0` .
         *
         * For more information about these settings, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-protection
         */
        readonly protection: boolean | cdk.IResolvable;
        /**
         * A reporting URI, which CloudFront uses as the value of the `report` directive in the `X-XSS-Protection` header.
         *
         * You cannot specify a `ReportUri` when `ModeBlock` is `true` .
         *
         * For more information about using a reporting URL, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-reporturi
         */
        readonly reportUri?: string;
    }
}
/**
 * Properties for defining a `CfnStreamingDistribution`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html
 */
export interface CfnStreamingDistributionProps {
    /**
     * The current configuration information for the RTMP distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig
     */
    readonly streamingDistributionConfig: CfnStreamingDistribution.StreamingDistributionConfigProperty | cdk.IResolvable;
    /**
     * A complex type that contains zero or more `Tag` elements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-tags
     */
    readonly tags: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::CloudFront::StreamingDistribution`
 *
 * This resource is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, [read the announcement](https://docs.aws.amazon.com/ann.jspa?annID=7356) on the Amazon CloudFront discussion forum.
 *
 * @cloudformationResource AWS::CloudFront::StreamingDistribution
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html
 */
export declare class CfnStreamingDistribution extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::StreamingDistribution";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamingDistribution;
    /**
     * The domain name of the resource, such as `d111111abcdef8.cloudfront.net` .
     * @cloudformationAttribute DomainName
     */
    readonly attrDomainName: string;
    /**
     * The current configuration information for the RTMP distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig
     */
    streamingDistributionConfig: CfnStreamingDistribution.StreamingDistributionConfigProperty | cdk.IResolvable;
    /**
     * A complex type that contains zero or more `Tag` elements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::CloudFront::StreamingDistribution`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamingDistributionProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnStreamingDistribution {
    /**
     * A complex type that controls whether access logs are written for the streaming distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html
     */
    interface LoggingProperty {
        /**
         * The Amazon S3 bucket to store the access logs in, for example, `myawslogbucket.s3.amazonaws.com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html#cfn-cloudfront-streamingdistribution-logging-bucket
         */
        readonly bucket: string;
        /**
         * Specifies whether you want CloudFront to save access logs to an Amazon S3 bucket. If you don't want to enable logging when you create a streaming distribution or if you want to disable logging for an existing streaming distribution, specify `false` for `Enabled` , and specify `empty Bucket` and `Prefix` elements. If you specify `false` for `Enabled` but you specify values for `Bucket` and `Prefix` , the values are automatically deleted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html#cfn-cloudfront-streamingdistribution-logging-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * An optional string that you want CloudFront to prefix to the access log filenames for this streaming distribution, for example, `myprefix/` . If you want to enable logging, but you don't want to specify a prefix, you still must include an empty `Prefix` element in the `Logging` element.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html#cfn-cloudfront-streamingdistribution-logging-prefix
         */
        readonly prefix: string;
    }
}
export declare namespace CfnStreamingDistribution {
    /**
     * A complex type that contains information about the Amazon S3 bucket from which you want CloudFront to get your media files for distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html
     */
    interface S3OriginProperty {
        /**
         * The DNS name of the Amazon S3 origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html#cfn-cloudfront-streamingdistribution-s3origin-domainname
         */
        readonly domainName: string;
        /**
         * The CloudFront origin access identity to associate with the distribution. Use an origin access identity to configure the distribution so that end users can only access objects in an Amazon S3 bucket through CloudFront.
         *
         * If you want end users to be able to access objects using either the CloudFront URL or the Amazon S3 URL, specify an empty `OriginAccessIdentity` element.
         *
         * To delete the origin access identity from an existing distribution, update the distribution configuration and include an empty `OriginAccessIdentity` element.
         *
         * To replace the origin access identity, update the distribution configuration and specify the new origin access identity.
         *
         * For more information, see [Using an Origin Access Identity to Restrict Access to Your Amazon S3 Content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html#cfn-cloudfront-streamingdistribution-s3origin-originaccessidentity
         */
        readonly originAccessIdentity: string;
    }
}
export declare namespace CfnStreamingDistribution {
    /**
     * The RTMP distribution's configuration information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html
     */
    interface StreamingDistributionConfigProperty {
        /**
         * A complex type that contains information about CNAMEs (alternate domain names), if any, for this streaming distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-aliases
         */
        readonly aliases?: string[];
        /**
         * Any comments you want to include about the streaming distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-comment
         */
        readonly comment: string;
        /**
         * Whether the streaming distribution is enabled to accept user requests for content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * A complex type that controls whether access logs are written for the streaming distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-logging
         */
        readonly logging?: CfnStreamingDistribution.LoggingProperty | cdk.IResolvable;
        /**
         * A complex type that contains information about price class for this streaming distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-priceclass
         */
        readonly priceClass?: string;
        /**
         * A complex type that contains information about the Amazon S3 bucket from which you want CloudFront to get your media files for distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-s3origin
         */
        readonly s3Origin: CfnStreamingDistribution.S3OriginProperty | cdk.IResolvable;
        /**
         * A complex type that specifies any AWS accounts that you want to permit to create signed URLs for private content. If you want the distribution to use signed URLs, include this element; if you want the distribution to use public URLs, remove this element. For more information, see [Serving Private Content through CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-trustedsigners
         */
        readonly trustedSigners: CfnStreamingDistribution.TrustedSignersProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStreamingDistribution {
    /**
     * A list of AWS accounts whose public keys CloudFront can use to verify the signatures of signed URLs and signed cookies.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-trustedsigners.html
     */
    interface TrustedSignersProperty {
        /**
         * An AWS account number that contains active CloudFront key pairs that CloudFront can use to verify the signatures of signed URLs and signed cookies. If the AWS account that owns the key pairs is the same account that owns the CloudFront distribution, the value of this field is `self` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-trustedsigners.html#cfn-cloudfront-streamingdistribution-trustedsigners-awsaccountnumbers
         */
        readonly awsAccountNumbers?: string[];
        /**
         * This field is `true` if any of the AWS accounts have public keys that CloudFront can use to verify the signatures of signed URLs and signed cookies. If not, this field is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-trustedsigners.html#cfn-cloudfront-streamingdistribution-trustedsigners-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

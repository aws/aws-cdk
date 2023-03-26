// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:39:59.834Z","fingerprint":"aAsa4RY6X/dsJMdK8jycyv477KzgWItCQ3ps2BWl2kI="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

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
 * Determine whether the given properties match those of a `CfnCachePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnCachePolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnCachePolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cachePolicyConfig', cdk.requiredValidator)(properties.cachePolicyConfig));
    errors.collect(cdk.propertyValidator('cachePolicyConfig', CfnCachePolicy_CachePolicyConfigPropertyValidator)(properties.cachePolicyConfig));
    return errors.wrap('supplied properties not correct for "CfnCachePolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnCachePolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy` resource.
 */
// @ts-ignore TS6133
function cfnCachePolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCachePolicyPropsValidator(properties).assertSuccess();
    return {
        CachePolicyConfig: cfnCachePolicyCachePolicyConfigPropertyToCloudFormation(properties.cachePolicyConfig),
    };
}

// @ts-ignore TS6133
function CfnCachePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicyProps>();
    ret.addPropertyResult('cachePolicyConfig', 'CachePolicyConfig', CfnCachePolicyCachePolicyConfigPropertyFromCloudFormation(properties.CachePolicyConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * The headers, cookies, and query strings that are included in the cache key are automatically included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find a valid object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
 *
 * @cloudformationResource AWS::CloudFront::CachePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html
 */
export class CfnCachePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::CachePolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCachePolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCachePolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCachePolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the cache policy. For example: `2766f7b2-75c5-41c6-8f06-bf4303a2f2f5` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The date and time when the cache policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: string;

    /**
     * The cache policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html#cfn-cloudfront-cachepolicy-cachepolicyconfig
     */
    public cachePolicyConfig: CfnCachePolicy.CachePolicyConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::CachePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCachePolicyProps) {
        super(scope, id, { type: CfnCachePolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'cachePolicyConfig', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLastModifiedTime = cdk.Token.asString(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.STRING));

        this.cachePolicyConfig = props.cachePolicyConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCachePolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cachePolicyConfig: this.cachePolicyConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCachePolicyPropsToCloudFormation(props);
    }
}

export namespace CfnCachePolicy {
    /**
     * A cache policy configuration.
     *
     * This configuration determines the following:
     *
     * - The values that CloudFront includes in the cache key. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.
     * - The default, minimum, and maximum time to live (TTL) values that you want objects to stay in the CloudFront cache.
     *
     * The headers, cookies, and query strings that are included in the cache key are automatically included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find a valid object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html
     */
    export interface CachePolicyConfigProperty {
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
         * The HTTP headers, cookies, and URL query strings to include in the cache key. The values included in the cache key are automatically included in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-parametersincachekeyandforwardedtoorigin
         */
        readonly parametersInCacheKeyAndForwardedToOrigin: CfnCachePolicy.ParametersInCacheKeyAndForwardedToOriginProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CachePolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CachePolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCachePolicy_CachePolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('defaultTtl', cdk.requiredValidator)(properties.defaultTtl));
    errors.collect(cdk.propertyValidator('defaultTtl', cdk.validateNumber)(properties.defaultTtl));
    errors.collect(cdk.propertyValidator('maxTtl', cdk.requiredValidator)(properties.maxTtl));
    errors.collect(cdk.propertyValidator('maxTtl', cdk.validateNumber)(properties.maxTtl));
    errors.collect(cdk.propertyValidator('minTtl', cdk.requiredValidator)(properties.minTtl));
    errors.collect(cdk.propertyValidator('minTtl', cdk.validateNumber)(properties.minTtl));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parametersInCacheKeyAndForwardedToOrigin', cdk.requiredValidator)(properties.parametersInCacheKeyAndForwardedToOrigin));
    errors.collect(cdk.propertyValidator('parametersInCacheKeyAndForwardedToOrigin', CfnCachePolicy_ParametersInCacheKeyAndForwardedToOriginPropertyValidator)(properties.parametersInCacheKeyAndForwardedToOrigin));
    return errors.wrap('supplied properties not correct for "CachePolicyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.CachePolicyConfig` resource
 *
 * @param properties - the TypeScript properties of a `CachePolicyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.CachePolicyConfig` resource.
 */
// @ts-ignore TS6133
function cfnCachePolicyCachePolicyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCachePolicy_CachePolicyConfigPropertyValidator(properties).assertSuccess();
    return {
        Comment: cdk.stringToCloudFormation(properties.comment),
        DefaultTTL: cdk.numberToCloudFormation(properties.defaultTtl),
        MaxTTL: cdk.numberToCloudFormation(properties.maxTtl),
        MinTTL: cdk.numberToCloudFormation(properties.minTtl),
        Name: cdk.stringToCloudFormation(properties.name),
        ParametersInCacheKeyAndForwardedToOrigin: cfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyToCloudFormation(properties.parametersInCacheKeyAndForwardedToOrigin),
    };
}

// @ts-ignore TS6133
function CfnCachePolicyCachePolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.CachePolicyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.CachePolicyConfigProperty>();
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('defaultTtl', 'DefaultTTL', cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL));
    ret.addPropertyResult('maxTtl', 'MaxTTL', cfn_parse.FromCloudFormation.getNumber(properties.MaxTTL));
    ret.addPropertyResult('minTtl', 'MinTTL', cfn_parse.FromCloudFormation.getNumber(properties.MinTTL));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('parametersInCacheKeyAndForwardedToOrigin', 'ParametersInCacheKeyAndForwardedToOrigin', CfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyFromCloudFormation(properties.ParametersInCacheKeyAndForwardedToOrigin));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCachePolicy {
    /**
     * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cookiesconfig.html
     */
    export interface CookiesConfigProperty {
        /**
         * Determines whether any cookies in viewer requests are included in the cache key and automatically included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – Cookies in viewer requests are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any cookies that are listed in an `OriginRequestPolicy` *are* included in origin requests.
         * - `whitelist` – The cookies in viewer requests that are listed in the `CookieNames` type are included in the cache key and automatically included in requests that CloudFront sends to the origin.
         * - `allExcept` – All cookies in viewer requests that are **not** listed in the `CookieNames` type are included in the cache key and automatically included in requests that CloudFront sends to the origin.
         * - `all` – All cookies in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.
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

/**
 * Determine whether the given properties match those of a `CookiesConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCachePolicy_CookiesConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cookieBehavior', cdk.requiredValidator)(properties.cookieBehavior));
    errors.collect(cdk.propertyValidator('cookieBehavior', cdk.validateString)(properties.cookieBehavior));
    errors.collect(cdk.propertyValidator('cookies', cdk.listValidator(cdk.validateString))(properties.cookies));
    return errors.wrap('supplied properties not correct for "CookiesConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.CookiesConfig` resource
 *
 * @param properties - the TypeScript properties of a `CookiesConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.CookiesConfig` resource.
 */
// @ts-ignore TS6133
function cfnCachePolicyCookiesConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCachePolicy_CookiesConfigPropertyValidator(properties).assertSuccess();
    return {
        CookieBehavior: cdk.stringToCloudFormation(properties.cookieBehavior),
        Cookies: cdk.listMapper(cdk.stringToCloudFormation)(properties.cookies),
    };
}

// @ts-ignore TS6133
function CfnCachePolicyCookiesConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.CookiesConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.CookiesConfigProperty>();
    ret.addPropertyResult('cookieBehavior', 'CookieBehavior', cfn_parse.FromCloudFormation.getString(properties.CookieBehavior));
    ret.addPropertyResult('cookies', 'Cookies', properties.Cookies != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Cookies) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCachePolicy {
    /**
     * An object that determines whether any HTTP headers (and if so, which headers) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-headersconfig.html
     */
    export interface HeadersConfigProperty {
        /**
         * Determines whether any HTTP headers are included in the cache key and automatically included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – HTTP headers are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any headers that are listed in an `OriginRequestPolicy` *are* included in origin requests.
         * - `whitelist` – The HTTP headers that are listed in the `Headers` type are included in the cache key and are automatically included in requests that CloudFront sends to the origin.
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

/**
 * Determine whether the given properties match those of a `HeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCachePolicy_HeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headerBehavior', cdk.requiredValidator)(properties.headerBehavior));
    errors.collect(cdk.propertyValidator('headerBehavior', cdk.validateString)(properties.headerBehavior));
    errors.collect(cdk.propertyValidator('headers', cdk.listValidator(cdk.validateString))(properties.headers));
    return errors.wrap('supplied properties not correct for "HeadersConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.HeadersConfig` resource
 *
 * @param properties - the TypeScript properties of a `HeadersConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.HeadersConfig` resource.
 */
// @ts-ignore TS6133
function cfnCachePolicyHeadersConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCachePolicy_HeadersConfigPropertyValidator(properties).assertSuccess();
    return {
        HeaderBehavior: cdk.stringToCloudFormation(properties.headerBehavior),
        Headers: cdk.listMapper(cdk.stringToCloudFormation)(properties.headers),
    };
}

// @ts-ignore TS6133
function CfnCachePolicyHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.HeadersConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.HeadersConfigProperty>();
    ret.addPropertyResult('headerBehavior', 'HeaderBehavior', cfn_parse.FromCloudFormation.getString(properties.HeaderBehavior));
    ret.addPropertyResult('headers', 'Headers', properties.Headers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Headers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCachePolicy {
    /**
     * This object determines the values that CloudFront includes in the cache key. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.
     *
     * The headers, cookies, and query strings that are included in the cache key are automatically included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find an object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html
     */
    export interface ParametersInCacheKeyAndForwardedToOriginProperty {
        /**
         * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
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
         * An object that determines whether any HTTP headers (and if so, which headers) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-headersconfig
         */
        readonly headersConfig: CfnCachePolicy.HeadersConfigProperty | cdk.IResolvable;
        /**
         * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-querystringsconfig
         */
        readonly queryStringsConfig: CfnCachePolicy.QueryStringsConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ParametersInCacheKeyAndForwardedToOriginProperty`
 *
 * @param properties - the TypeScript properties of a `ParametersInCacheKeyAndForwardedToOriginProperty`
 *
 * @returns the result of the validation.
 */
function CfnCachePolicy_ParametersInCacheKeyAndForwardedToOriginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cookiesConfig', cdk.requiredValidator)(properties.cookiesConfig));
    errors.collect(cdk.propertyValidator('cookiesConfig', CfnCachePolicy_CookiesConfigPropertyValidator)(properties.cookiesConfig));
    errors.collect(cdk.propertyValidator('enableAcceptEncodingBrotli', cdk.validateBoolean)(properties.enableAcceptEncodingBrotli));
    errors.collect(cdk.propertyValidator('enableAcceptEncodingGzip', cdk.requiredValidator)(properties.enableAcceptEncodingGzip));
    errors.collect(cdk.propertyValidator('enableAcceptEncodingGzip', cdk.validateBoolean)(properties.enableAcceptEncodingGzip));
    errors.collect(cdk.propertyValidator('headersConfig', cdk.requiredValidator)(properties.headersConfig));
    errors.collect(cdk.propertyValidator('headersConfig', CfnCachePolicy_HeadersConfigPropertyValidator)(properties.headersConfig));
    errors.collect(cdk.propertyValidator('queryStringsConfig', cdk.requiredValidator)(properties.queryStringsConfig));
    errors.collect(cdk.propertyValidator('queryStringsConfig', CfnCachePolicy_QueryStringsConfigPropertyValidator)(properties.queryStringsConfig));
    return errors.wrap('supplied properties not correct for "ParametersInCacheKeyAndForwardedToOriginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.ParametersInCacheKeyAndForwardedToOrigin` resource
 *
 * @param properties - the TypeScript properties of a `ParametersInCacheKeyAndForwardedToOriginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.ParametersInCacheKeyAndForwardedToOrigin` resource.
 */
// @ts-ignore TS6133
function cfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCachePolicy_ParametersInCacheKeyAndForwardedToOriginPropertyValidator(properties).assertSuccess();
    return {
        CookiesConfig: cfnCachePolicyCookiesConfigPropertyToCloudFormation(properties.cookiesConfig),
        EnableAcceptEncodingBrotli: cdk.booleanToCloudFormation(properties.enableAcceptEncodingBrotli),
        EnableAcceptEncodingGzip: cdk.booleanToCloudFormation(properties.enableAcceptEncodingGzip),
        HeadersConfig: cfnCachePolicyHeadersConfigPropertyToCloudFormation(properties.headersConfig),
        QueryStringsConfig: cfnCachePolicyQueryStringsConfigPropertyToCloudFormation(properties.queryStringsConfig),
    };
}

// @ts-ignore TS6133
function CfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.ParametersInCacheKeyAndForwardedToOriginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.ParametersInCacheKeyAndForwardedToOriginProperty>();
    ret.addPropertyResult('cookiesConfig', 'CookiesConfig', CfnCachePolicyCookiesConfigPropertyFromCloudFormation(properties.CookiesConfig));
    ret.addPropertyResult('enableAcceptEncodingBrotli', 'EnableAcceptEncodingBrotli', properties.EnableAcceptEncodingBrotli != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAcceptEncodingBrotli) : undefined);
    ret.addPropertyResult('enableAcceptEncodingGzip', 'EnableAcceptEncodingGzip', cfn_parse.FromCloudFormation.getBoolean(properties.EnableAcceptEncodingGzip));
    ret.addPropertyResult('headersConfig', 'HeadersConfig', CfnCachePolicyHeadersConfigPropertyFromCloudFormation(properties.HeadersConfig));
    ret.addPropertyResult('queryStringsConfig', 'QueryStringsConfig', CfnCachePolicyQueryStringsConfigPropertyFromCloudFormation(properties.QueryStringsConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCachePolicy {
    /**
     * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-querystringsconfig.html
     */
    export interface QueryStringsConfigProperty {
        /**
         * Determines whether any URL query strings in viewer requests are included in the cache key and automatically included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – Query strings in viewer requests are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any query strings that are listed in an `OriginRequestPolicy` *are* included in origin requests.
         * - `whitelist` – The query strings in viewer requests that are listed in the `QueryStringNames` type are included in the cache key and automatically included in requests that CloudFront sends to the origin.
         * - `allExcept` – All query strings in viewer requests that are **not** listed in the `QueryStringNames` type are included in the cache key and automatically included in requests that CloudFront sends to the origin.
         * - `all` – All query strings in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.
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
 * Determine whether the given properties match those of a `QueryStringsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringsConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCachePolicy_QueryStringsConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('queryStringBehavior', cdk.requiredValidator)(properties.queryStringBehavior));
    errors.collect(cdk.propertyValidator('queryStringBehavior', cdk.validateString)(properties.queryStringBehavior));
    errors.collect(cdk.propertyValidator('queryStrings', cdk.listValidator(cdk.validateString))(properties.queryStrings));
    return errors.wrap('supplied properties not correct for "QueryStringsConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.QueryStringsConfig` resource
 *
 * @param properties - the TypeScript properties of a `QueryStringsConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CachePolicy.QueryStringsConfig` resource.
 */
// @ts-ignore TS6133
function cfnCachePolicyQueryStringsConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCachePolicy_QueryStringsConfigPropertyValidator(properties).assertSuccess();
    return {
        QueryStringBehavior: cdk.stringToCloudFormation(properties.queryStringBehavior),
        QueryStrings: cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStrings),
    };
}

// @ts-ignore TS6133
function CfnCachePolicyQueryStringsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.QueryStringsConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.QueryStringsConfigProperty>();
    ret.addPropertyResult('queryStringBehavior', 'QueryStringBehavior', cfn_parse.FromCloudFormation.getString(properties.QueryStringBehavior));
    ret.addPropertyResult('queryStrings', 'QueryStrings', properties.QueryStrings != null ? cfn_parse.FromCloudFormation.getStringArray(properties.QueryStrings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnCloudFrontOriginAccessIdentityProps`
 *
 * @param properties - the TypeScript properties of a `CfnCloudFrontOriginAccessIdentityProps`
 *
 * @returns the result of the validation.
 */
function CfnCloudFrontOriginAccessIdentityPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudFrontOriginAccessIdentityConfig', cdk.requiredValidator)(properties.cloudFrontOriginAccessIdentityConfig));
    errors.collect(cdk.propertyValidator('cloudFrontOriginAccessIdentityConfig', CfnCloudFrontOriginAccessIdentity_CloudFrontOriginAccessIdentityConfigPropertyValidator)(properties.cloudFrontOriginAccessIdentityConfig));
    return errors.wrap('supplied properties not correct for "CfnCloudFrontOriginAccessIdentityProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CloudFrontOriginAccessIdentity` resource
 *
 * @param properties - the TypeScript properties of a `CfnCloudFrontOriginAccessIdentityProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CloudFrontOriginAccessIdentity` resource.
 */
// @ts-ignore TS6133
function cfnCloudFrontOriginAccessIdentityPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCloudFrontOriginAccessIdentityPropsValidator(properties).assertSuccess();
    return {
        CloudFrontOriginAccessIdentityConfig: cfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyToCloudFormation(properties.cloudFrontOriginAccessIdentityConfig),
    };
}

// @ts-ignore TS6133
function CfnCloudFrontOriginAccessIdentityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFrontOriginAccessIdentityProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFrontOriginAccessIdentityProps>();
    ret.addPropertyResult('cloudFrontOriginAccessIdentityConfig', 'CloudFrontOriginAccessIdentityConfig', CfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyFromCloudFormation(properties.CloudFrontOriginAccessIdentityConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnCloudFrontOriginAccessIdentity extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::CloudFrontOriginAccessIdentity";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCloudFrontOriginAccessIdentity {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCloudFrontOriginAccessIdentityPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCloudFrontOriginAccessIdentity(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID for the origin access identity, for example, `E74FTE3AJFJ256A` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The Amazon S3 canonical user ID for the origin access identity, used when giving the origin access identity read permission to an object in Amazon S3. For example: `b970b42360b81c8ddbd79d2f5df0069ba9033c8a79655752abe380cd6d63ba8bcf23384d568fcf89fc49700b5e11a0fd` .
     * @cloudformationAttribute S3CanonicalUserId
     */
    public readonly attrS3CanonicalUserId: string;

    /**
     * The current configuration information for the identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig
     */
    public cloudFrontOriginAccessIdentityConfig: CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::CloudFrontOriginAccessIdentity`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCloudFrontOriginAccessIdentityProps) {
        super(scope, id, { type: CfnCloudFrontOriginAccessIdentity.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'cloudFrontOriginAccessIdentityConfig', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrS3CanonicalUserId = cdk.Token.asString(this.getAtt('S3CanonicalUserId', cdk.ResolutionTypeHint.STRING));

        this.cloudFrontOriginAccessIdentityConfig = props.cloudFrontOriginAccessIdentityConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCloudFrontOriginAccessIdentity.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cloudFrontOriginAccessIdentityConfig: this.cloudFrontOriginAccessIdentityConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCloudFrontOriginAccessIdentityPropsToCloudFormation(props);
    }
}

export namespace CfnCloudFrontOriginAccessIdentity {
    /**
     * Origin access identity configuration. Send a `GET` request to the `/ *CloudFront API version* /CloudFront/identity ID/config` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html
     */
    export interface CloudFrontOriginAccessIdentityConfigProperty {
        /**
         * A comment to describe the origin access identity. The comment cannot be longer than 128 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig-comment
         */
        readonly comment: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudFrontOriginAccessIdentityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CloudFrontOriginAccessIdentityConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCloudFrontOriginAccessIdentity_CloudFrontOriginAccessIdentityConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comment', cdk.requiredValidator)(properties.comment));
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    return errors.wrap('supplied properties not correct for "CloudFrontOriginAccessIdentityConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::CloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfig` resource
 *
 * @param properties - the TypeScript properties of a `CloudFrontOriginAccessIdentityConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::CloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfig` resource.
 */
// @ts-ignore TS6133
function cfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCloudFrontOriginAccessIdentity_CloudFrontOriginAccessIdentityConfigPropertyValidator(properties).assertSuccess();
    return {
        Comment: cdk.stringToCloudFormation(properties.comment),
    };
}

// @ts-ignore TS6133
function CfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty>();
    ret.addPropertyResult('comment', 'Comment', cfn_parse.FromCloudFormation.getString(properties.Comment));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnContinuousDeploymentPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnContinuousDeploymentPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnContinuousDeploymentPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('continuousDeploymentPolicyConfig', cdk.requiredValidator)(properties.continuousDeploymentPolicyConfig));
    errors.collect(cdk.propertyValidator('continuousDeploymentPolicyConfig', CfnContinuousDeploymentPolicy_ContinuousDeploymentPolicyConfigPropertyValidator)(properties.continuousDeploymentPolicyConfig));
    return errors.wrap('supplied properties not correct for "CfnContinuousDeploymentPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnContinuousDeploymentPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy` resource.
 */
// @ts-ignore TS6133
function cfnContinuousDeploymentPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContinuousDeploymentPolicyPropsValidator(properties).assertSuccess();
    return {
        ContinuousDeploymentPolicyConfig: cfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyToCloudFormation(properties.continuousDeploymentPolicyConfig),
    };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicyProps>();
    ret.addPropertyResult('continuousDeploymentPolicyConfig', 'ContinuousDeploymentPolicyConfig', CfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyFromCloudFormation(properties.ContinuousDeploymentPolicyConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnContinuousDeploymentPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::ContinuousDeploymentPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContinuousDeploymentPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnContinuousDeploymentPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnContinuousDeploymentPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The identifier of the cotinuous deployment policy.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The date and time when the continuous deployment policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: string;

    /**
     * Contains the configuration for a continuous deployment policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig
     */
    public continuousDeploymentPolicyConfig: CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::ContinuousDeploymentPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContinuousDeploymentPolicyProps) {
        super(scope, id, { type: CfnContinuousDeploymentPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'continuousDeploymentPolicyConfig', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLastModifiedTime = cdk.Token.asString(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.STRING));

        this.continuousDeploymentPolicyConfig = props.continuousDeploymentPolicyConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnContinuousDeploymentPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            continuousDeploymentPolicyConfig: this.continuousDeploymentPolicyConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnContinuousDeploymentPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnContinuousDeploymentPolicy {
    /**
     * Contains the configuration for a continuous deployment policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html
     */
    export interface ContinuousDeploymentPolicyConfigProperty {
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

/**
 * Determine whether the given properties match those of a `ContinuousDeploymentPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ContinuousDeploymentPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnContinuousDeploymentPolicy_ContinuousDeploymentPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('stagingDistributionDnsNames', cdk.requiredValidator)(properties.stagingDistributionDnsNames));
    errors.collect(cdk.propertyValidator('stagingDistributionDnsNames', cdk.listValidator(cdk.validateString))(properties.stagingDistributionDnsNames));
    errors.collect(cdk.propertyValidator('trafficConfig', CfnContinuousDeploymentPolicy_TrafficConfigPropertyValidator)(properties.trafficConfig));
    return errors.wrap('supplied properties not correct for "ContinuousDeploymentPolicyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfig` resource
 *
 * @param properties - the TypeScript properties of a `ContinuousDeploymentPolicyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfig` resource.
 */
// @ts-ignore TS6133
function cfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContinuousDeploymentPolicy_ContinuousDeploymentPolicyConfigPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        StagingDistributionDnsNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.stagingDistributionDnsNames),
        TrafficConfig: cfnContinuousDeploymentPolicyTrafficConfigPropertyToCloudFormation(properties.trafficConfig),
    };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('stagingDistributionDnsNames', 'StagingDistributionDnsNames', cfn_parse.FromCloudFormation.getStringArray(properties.StagingDistributionDnsNames));
    ret.addPropertyResult('trafficConfig', 'TrafficConfig', properties.TrafficConfig != null ? CfnContinuousDeploymentPolicyTrafficConfigPropertyFromCloudFormation(properties.TrafficConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContinuousDeploymentPolicy {
    /**
     * Session stickiness provides the ability to define multiple requests from a single viewer as a single session. This prevents the potentially inconsistent experience of sending some of a given user's requests to your staging distribution, while others are sent to your primary distribution. Define the session duration using TTL values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig.html
     */
    export interface SessionStickinessConfigProperty {
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

/**
 * Determine whether the given properties match those of a `SessionStickinessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SessionStickinessConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnContinuousDeploymentPolicy_SessionStickinessConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idleTtl', cdk.requiredValidator)(properties.idleTtl));
    errors.collect(cdk.propertyValidator('idleTtl', cdk.validateNumber)(properties.idleTtl));
    errors.collect(cdk.propertyValidator('maximumTtl', cdk.requiredValidator)(properties.maximumTtl));
    errors.collect(cdk.propertyValidator('maximumTtl', cdk.validateNumber)(properties.maximumTtl));
    return errors.wrap('supplied properties not correct for "SessionStickinessConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.SessionStickinessConfig` resource
 *
 * @param properties - the TypeScript properties of a `SessionStickinessConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.SessionStickinessConfig` resource.
 */
// @ts-ignore TS6133
function cfnContinuousDeploymentPolicySessionStickinessConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContinuousDeploymentPolicy_SessionStickinessConfigPropertyValidator(properties).assertSuccess();
    return {
        IdleTTL: cdk.numberToCloudFormation(properties.idleTtl),
        MaximumTTL: cdk.numberToCloudFormation(properties.maximumTtl),
    };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySessionStickinessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicy.SessionStickinessConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SessionStickinessConfigProperty>();
    ret.addPropertyResult('idleTtl', 'IdleTTL', cfn_parse.FromCloudFormation.getNumber(properties.IdleTTL));
    ret.addPropertyResult('maximumTtl', 'MaximumTTL', cfn_parse.FromCloudFormation.getNumber(properties.MaximumTTL));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContinuousDeploymentPolicy {
    /**
     * Determines which HTTP requests are sent to the staging distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderconfig.html
     */
    export interface SingleHeaderConfigProperty {
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

/**
 * Determine whether the given properties match those of a `SingleHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnContinuousDeploymentPolicy_SingleHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('header', cdk.requiredValidator)(properties.header));
    errors.collect(cdk.propertyValidator('header', cdk.validateString)(properties.header));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "SingleHeaderConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.SingleHeaderConfig` resource
 *
 * @param properties - the TypeScript properties of a `SingleHeaderConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.SingleHeaderConfig` resource.
 */
// @ts-ignore TS6133
function cfnContinuousDeploymentPolicySingleHeaderConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContinuousDeploymentPolicy_SingleHeaderConfigPropertyValidator(properties).assertSuccess();
    return {
        Header: cdk.stringToCloudFormation(properties.header),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicy.SingleHeaderConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SingleHeaderConfigProperty>();
    ret.addPropertyResult('header', 'Header', cfn_parse.FromCloudFormation.getString(properties.Header));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContinuousDeploymentPolicy {
    /**
     * This configuration determines the percentage of HTTP requests that are sent to the staging distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightconfig.html
     */
    export interface SingleWeightConfigProperty {
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

/**
 * Determine whether the given properties match those of a `SingleWeightConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SingleWeightConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnContinuousDeploymentPolicy_SingleWeightConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sessionStickinessConfig', CfnContinuousDeploymentPolicy_SessionStickinessConfigPropertyValidator)(properties.sessionStickinessConfig));
    errors.collect(cdk.propertyValidator('weight', cdk.requiredValidator)(properties.weight));
    errors.collect(cdk.propertyValidator('weight', cdk.validateNumber)(properties.weight));
    return errors.wrap('supplied properties not correct for "SingleWeightConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.SingleWeightConfig` resource
 *
 * @param properties - the TypeScript properties of a `SingleWeightConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.SingleWeightConfig` resource.
 */
// @ts-ignore TS6133
function cfnContinuousDeploymentPolicySingleWeightConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContinuousDeploymentPolicy_SingleWeightConfigPropertyValidator(properties).assertSuccess();
    return {
        SessionStickinessConfig: cfnContinuousDeploymentPolicySessionStickinessConfigPropertyToCloudFormation(properties.sessionStickinessConfig),
        Weight: cdk.numberToCloudFormation(properties.weight),
    };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleWeightConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicy.SingleWeightConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SingleWeightConfigProperty>();
    ret.addPropertyResult('sessionStickinessConfig', 'SessionStickinessConfig', properties.SessionStickinessConfig != null ? CfnContinuousDeploymentPolicySessionStickinessConfigPropertyFromCloudFormation(properties.SessionStickinessConfig) : undefined);
    ret.addPropertyResult('weight', 'Weight', cfn_parse.FromCloudFormation.getNumber(properties.Weight));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContinuousDeploymentPolicy {
    /**
     * The traffic configuration of your continuous deployment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html
     */
    export interface TrafficConfigProperty {
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
 * Determine whether the given properties match those of a `TrafficConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TrafficConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnContinuousDeploymentPolicy_TrafficConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('singleHeaderConfig', CfnContinuousDeploymentPolicy_SingleHeaderConfigPropertyValidator)(properties.singleHeaderConfig));
    errors.collect(cdk.propertyValidator('singleWeightConfig', CfnContinuousDeploymentPolicy_SingleWeightConfigPropertyValidator)(properties.singleWeightConfig));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "TrafficConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.TrafficConfig` resource
 *
 * @param properties - the TypeScript properties of a `TrafficConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ContinuousDeploymentPolicy.TrafficConfig` resource.
 */
// @ts-ignore TS6133
function cfnContinuousDeploymentPolicyTrafficConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContinuousDeploymentPolicy_TrafficConfigPropertyValidator(properties).assertSuccess();
    return {
        SingleHeaderConfig: cfnContinuousDeploymentPolicySingleHeaderConfigPropertyToCloudFormation(properties.singleHeaderConfig),
        SingleWeightConfig: cfnContinuousDeploymentPolicySingleWeightConfigPropertyToCloudFormation(properties.singleWeightConfig),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyTrafficConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicy.TrafficConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.TrafficConfigProperty>();
    ret.addPropertyResult('singleHeaderConfig', 'SingleHeaderConfig', properties.SingleHeaderConfig != null ? CfnContinuousDeploymentPolicySingleHeaderConfigPropertyFromCloudFormation(properties.SingleHeaderConfig) : undefined);
    ret.addPropertyResult('singleWeightConfig', 'SingleWeightConfig', properties.SingleWeightConfig != null ? CfnContinuousDeploymentPolicySingleWeightConfigPropertyFromCloudFormation(properties.SingleWeightConfig) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnDistributionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDistributionProps`
 *
 * @returns the result of the validation.
 */
function CfnDistributionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('distributionConfig', cdk.requiredValidator)(properties.distributionConfig));
    errors.collect(cdk.propertyValidator('distributionConfig', CfnDistribution_DistributionConfigPropertyValidator)(properties.distributionConfig));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDistributionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution` resource
 *
 * @param properties - the TypeScript properties of a `CfnDistributionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution` resource.
 */
// @ts-ignore TS6133
function cfnDistributionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionPropsValidator(properties).assertSuccess();
    return {
        DistributionConfig: cfnDistributionDistributionConfigPropertyToCloudFormation(properties.distributionConfig),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDistributionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionProps>();
    ret.addPropertyResult('distributionConfig', 'DistributionConfig', CfnDistributionDistributionConfigPropertyFromCloudFormation(properties.DistributionConfig));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnDistribution extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::Distribution";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDistribution {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDistributionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDistribution(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The domain name of the resource, such as `d111111abcdef8.cloudfront.net` .
     * @cloudformationAttribute DomainName
     */
    public readonly attrDomainName: string;

    /**
     * The identifier for the distribution, for example `EDFDVBD632BHDS5` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The distribution's configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-distributionconfig
     */
    public distributionConfig: CfnDistribution.DistributionConfigProperty | cdk.IResolvable;

    /**
     * A complex type that contains zero or more `Tag` elements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CloudFront::Distribution`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDistributionProps) {
        super(scope, id, { type: CfnDistribution.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'distributionConfig', this);
        this.attrDomainName = cdk.Token.asString(this.getAtt('DomainName', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.distributionConfig = props.distributionConfig;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudFront::Distribution", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDistribution.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            distributionConfig: this.distributionConfig,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDistributionPropsToCloudFormation(props);
    }
}

export namespace CfnDistribution {
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
    export interface CacheBehaviorProperty {
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

/**
 * Determine whether the given properties match those of a `CacheBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CacheBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedMethods', cdk.listValidator(cdk.validateString))(properties.allowedMethods));
    errors.collect(cdk.propertyValidator('cachePolicyId', cdk.validateString)(properties.cachePolicyId));
    errors.collect(cdk.propertyValidator('cachedMethods', cdk.listValidator(cdk.validateString))(properties.cachedMethods));
    errors.collect(cdk.propertyValidator('compress', cdk.validateBoolean)(properties.compress));
    errors.collect(cdk.propertyValidator('defaultTtl', cdk.validateNumber)(properties.defaultTtl));
    errors.collect(cdk.propertyValidator('fieldLevelEncryptionId', cdk.validateString)(properties.fieldLevelEncryptionId));
    errors.collect(cdk.propertyValidator('forwardedValues', CfnDistribution_ForwardedValuesPropertyValidator)(properties.forwardedValues));
    errors.collect(cdk.propertyValidator('functionAssociations', cdk.listValidator(CfnDistribution_FunctionAssociationPropertyValidator))(properties.functionAssociations));
    errors.collect(cdk.propertyValidator('lambdaFunctionAssociations', cdk.listValidator(CfnDistribution_LambdaFunctionAssociationPropertyValidator))(properties.lambdaFunctionAssociations));
    errors.collect(cdk.propertyValidator('maxTtl', cdk.validateNumber)(properties.maxTtl));
    errors.collect(cdk.propertyValidator('minTtl', cdk.validateNumber)(properties.minTtl));
    errors.collect(cdk.propertyValidator('originRequestPolicyId', cdk.validateString)(properties.originRequestPolicyId));
    errors.collect(cdk.propertyValidator('pathPattern', cdk.requiredValidator)(properties.pathPattern));
    errors.collect(cdk.propertyValidator('pathPattern', cdk.validateString)(properties.pathPattern));
    errors.collect(cdk.propertyValidator('realtimeLogConfigArn', cdk.validateString)(properties.realtimeLogConfigArn));
    errors.collect(cdk.propertyValidator('responseHeadersPolicyId', cdk.validateString)(properties.responseHeadersPolicyId));
    errors.collect(cdk.propertyValidator('smoothStreaming', cdk.validateBoolean)(properties.smoothStreaming));
    errors.collect(cdk.propertyValidator('targetOriginId', cdk.requiredValidator)(properties.targetOriginId));
    errors.collect(cdk.propertyValidator('targetOriginId', cdk.validateString)(properties.targetOriginId));
    errors.collect(cdk.propertyValidator('trustedKeyGroups', cdk.listValidator(cdk.validateString))(properties.trustedKeyGroups));
    errors.collect(cdk.propertyValidator('trustedSigners', cdk.listValidator(cdk.validateString))(properties.trustedSigners));
    errors.collect(cdk.propertyValidator('viewerProtocolPolicy', cdk.requiredValidator)(properties.viewerProtocolPolicy));
    errors.collect(cdk.propertyValidator('viewerProtocolPolicy', cdk.validateString)(properties.viewerProtocolPolicy));
    return errors.wrap('supplied properties not correct for "CacheBehaviorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.CacheBehavior` resource
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.CacheBehavior` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCacheBehaviorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CacheBehaviorPropertyValidator(properties).assertSuccess();
    return {
        AllowedMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedMethods),
        CachePolicyId: cdk.stringToCloudFormation(properties.cachePolicyId),
        CachedMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.cachedMethods),
        Compress: cdk.booleanToCloudFormation(properties.compress),
        DefaultTTL: cdk.numberToCloudFormation(properties.defaultTtl),
        FieldLevelEncryptionId: cdk.stringToCloudFormation(properties.fieldLevelEncryptionId),
        ForwardedValues: cfnDistributionForwardedValuesPropertyToCloudFormation(properties.forwardedValues),
        FunctionAssociations: cdk.listMapper(cfnDistributionFunctionAssociationPropertyToCloudFormation)(properties.functionAssociations),
        LambdaFunctionAssociations: cdk.listMapper(cfnDistributionLambdaFunctionAssociationPropertyToCloudFormation)(properties.lambdaFunctionAssociations),
        MaxTTL: cdk.numberToCloudFormation(properties.maxTtl),
        MinTTL: cdk.numberToCloudFormation(properties.minTtl),
        OriginRequestPolicyId: cdk.stringToCloudFormation(properties.originRequestPolicyId),
        PathPattern: cdk.stringToCloudFormation(properties.pathPattern),
        RealtimeLogConfigArn: cdk.stringToCloudFormation(properties.realtimeLogConfigArn),
        ResponseHeadersPolicyId: cdk.stringToCloudFormation(properties.responseHeadersPolicyId),
        SmoothStreaming: cdk.booleanToCloudFormation(properties.smoothStreaming),
        TargetOriginId: cdk.stringToCloudFormation(properties.targetOriginId),
        TrustedKeyGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedKeyGroups),
        TrustedSigners: cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedSigners),
        ViewerProtocolPolicy: cdk.stringToCloudFormation(properties.viewerProtocolPolicy),
    };
}

// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheBehaviorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheBehaviorProperty>();
    ret.addPropertyResult('allowedMethods', 'AllowedMethods', properties.AllowedMethods != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedMethods) : undefined);
    ret.addPropertyResult('cachePolicyId', 'CachePolicyId', properties.CachePolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.CachePolicyId) : undefined);
    ret.addPropertyResult('cachedMethods', 'CachedMethods', properties.CachedMethods != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CachedMethods) : undefined);
    ret.addPropertyResult('compress', 'Compress', properties.Compress != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Compress) : undefined);
    ret.addPropertyResult('defaultTtl', 'DefaultTTL', properties.DefaultTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL) : undefined);
    ret.addPropertyResult('fieldLevelEncryptionId', 'FieldLevelEncryptionId', properties.FieldLevelEncryptionId != null ? cfn_parse.FromCloudFormation.getString(properties.FieldLevelEncryptionId) : undefined);
    ret.addPropertyResult('forwardedValues', 'ForwardedValues', properties.ForwardedValues != null ? CfnDistributionForwardedValuesPropertyFromCloudFormation(properties.ForwardedValues) : undefined);
    ret.addPropertyResult('functionAssociations', 'FunctionAssociations', properties.FunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionFunctionAssociationPropertyFromCloudFormation)(properties.FunctionAssociations) : undefined);
    ret.addPropertyResult('lambdaFunctionAssociations', 'LambdaFunctionAssociations', properties.LambdaFunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionLambdaFunctionAssociationPropertyFromCloudFormation)(properties.LambdaFunctionAssociations) : undefined);
    ret.addPropertyResult('maxTtl', 'MaxTTL', properties.MaxTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTTL) : undefined);
    ret.addPropertyResult('minTtl', 'MinTTL', properties.MinTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinTTL) : undefined);
    ret.addPropertyResult('originRequestPolicyId', 'OriginRequestPolicyId', properties.OriginRequestPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.OriginRequestPolicyId) : undefined);
    ret.addPropertyResult('pathPattern', 'PathPattern', cfn_parse.FromCloudFormation.getString(properties.PathPattern));
    ret.addPropertyResult('realtimeLogConfigArn', 'RealtimeLogConfigArn', properties.RealtimeLogConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.RealtimeLogConfigArn) : undefined);
    ret.addPropertyResult('responseHeadersPolicyId', 'ResponseHeadersPolicyId', properties.ResponseHeadersPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseHeadersPolicyId) : undefined);
    ret.addPropertyResult('smoothStreaming', 'SmoothStreaming', properties.SmoothStreaming != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SmoothStreaming) : undefined);
    ret.addPropertyResult('targetOriginId', 'TargetOriginId', cfn_parse.FromCloudFormation.getString(properties.TargetOriginId));
    ret.addPropertyResult('trustedKeyGroups', 'TrustedKeyGroups', properties.TrustedKeyGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TrustedKeyGroups) : undefined);
    ret.addPropertyResult('trustedSigners', 'TrustedSigners', properties.TrustedSigners != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TrustedSigners) : undefined);
    ret.addPropertyResult('viewerProtocolPolicy', 'ViewerProtocolPolicy', cfn_parse.FromCloudFormation.getString(properties.ViewerProtocolPolicy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
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
    export interface CookiesProperty {
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

/**
 * Determine whether the given properties match those of a `CookiesProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CookiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('forward', cdk.requiredValidator)(properties.forward));
    errors.collect(cdk.propertyValidator('forward', cdk.validateString)(properties.forward));
    errors.collect(cdk.propertyValidator('whitelistedNames', cdk.listValidator(cdk.validateString))(properties.whitelistedNames));
    return errors.wrap('supplied properties not correct for "CookiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Cookies` resource
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Cookies` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCookiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CookiesPropertyValidator(properties).assertSuccess();
    return {
        Forward: cdk.stringToCloudFormation(properties.forward),
        WhitelistedNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.whitelistedNames),
    };
}

// @ts-ignore TS6133
function CfnDistributionCookiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CookiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CookiesProperty>();
    ret.addPropertyResult('forward', 'Forward', cfn_parse.FromCloudFormation.getString(properties.Forward));
    ret.addPropertyResult('whitelistedNames', 'WhitelistedNames', properties.WhitelistedNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.WhitelistedNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
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
    export interface CustomErrorResponseProperty {
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

/**
 * Determine whether the given properties match those of a `CustomErrorResponseProperty`
 *
 * @param properties - the TypeScript properties of a `CustomErrorResponseProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CustomErrorResponsePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('errorCachingMinTtl', cdk.validateNumber)(properties.errorCachingMinTtl));
    errors.collect(cdk.propertyValidator('errorCode', cdk.requiredValidator)(properties.errorCode));
    errors.collect(cdk.propertyValidator('errorCode', cdk.validateNumber)(properties.errorCode));
    errors.collect(cdk.propertyValidator('responseCode', cdk.validateNumber)(properties.responseCode));
    errors.collect(cdk.propertyValidator('responsePagePath', cdk.validateString)(properties.responsePagePath));
    return errors.wrap('supplied properties not correct for "CustomErrorResponseProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.CustomErrorResponse` resource
 *
 * @param properties - the TypeScript properties of a `CustomErrorResponseProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.CustomErrorResponse` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCustomErrorResponsePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CustomErrorResponsePropertyValidator(properties).assertSuccess();
    return {
        ErrorCachingMinTTL: cdk.numberToCloudFormation(properties.errorCachingMinTtl),
        ErrorCode: cdk.numberToCloudFormation(properties.errorCode),
        ResponseCode: cdk.numberToCloudFormation(properties.responseCode),
        ResponsePagePath: cdk.stringToCloudFormation(properties.responsePagePath),
    };
}

// @ts-ignore TS6133
function CfnDistributionCustomErrorResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CustomErrorResponseProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CustomErrorResponseProperty>();
    ret.addPropertyResult('errorCachingMinTtl', 'ErrorCachingMinTTL', properties.ErrorCachingMinTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorCachingMinTTL) : undefined);
    ret.addPropertyResult('errorCode', 'ErrorCode', cfn_parse.FromCloudFormation.getNumber(properties.ErrorCode));
    ret.addPropertyResult('responseCode', 'ResponseCode', properties.ResponseCode != null ? cfn_parse.FromCloudFormation.getNumber(properties.ResponseCode) : undefined);
    ret.addPropertyResult('responsePagePath', 'ResponsePagePath', properties.ResponsePagePath != null ? cfn_parse.FromCloudFormation.getString(properties.ResponsePagePath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A custom origin. A custom origin is any origin that is *not* an Amazon S3 bucket, with one exception. An Amazon S3 bucket that is [configured with static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) *is* a custom origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html
     */
    export interface CustomOriginConfigProperty {
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

/**
 * Determine whether the given properties match those of a `CustomOriginConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CustomOriginConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CustomOriginConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('httpPort', cdk.validateNumber)(properties.httpPort));
    errors.collect(cdk.propertyValidator('httpsPort', cdk.validateNumber)(properties.httpsPort));
    errors.collect(cdk.propertyValidator('originKeepaliveTimeout', cdk.validateNumber)(properties.originKeepaliveTimeout));
    errors.collect(cdk.propertyValidator('originProtocolPolicy', cdk.requiredValidator)(properties.originProtocolPolicy));
    errors.collect(cdk.propertyValidator('originProtocolPolicy', cdk.validateString)(properties.originProtocolPolicy));
    errors.collect(cdk.propertyValidator('originReadTimeout', cdk.validateNumber)(properties.originReadTimeout));
    errors.collect(cdk.propertyValidator('originSslProtocols', cdk.listValidator(cdk.validateString))(properties.originSslProtocols));
    return errors.wrap('supplied properties not correct for "CustomOriginConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.CustomOriginConfig` resource
 *
 * @param properties - the TypeScript properties of a `CustomOriginConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.CustomOriginConfig` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCustomOriginConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CustomOriginConfigPropertyValidator(properties).assertSuccess();
    return {
        HTTPPort: cdk.numberToCloudFormation(properties.httpPort),
        HTTPSPort: cdk.numberToCloudFormation(properties.httpsPort),
        OriginKeepaliveTimeout: cdk.numberToCloudFormation(properties.originKeepaliveTimeout),
        OriginProtocolPolicy: cdk.stringToCloudFormation(properties.originProtocolPolicy),
        OriginReadTimeout: cdk.numberToCloudFormation(properties.originReadTimeout),
        OriginSSLProtocols: cdk.listMapper(cdk.stringToCloudFormation)(properties.originSslProtocols),
    };
}

// @ts-ignore TS6133
function CfnDistributionCustomOriginConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CustomOriginConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CustomOriginConfigProperty>();
    ret.addPropertyResult('httpPort', 'HTTPPort', properties.HTTPPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPPort) : undefined);
    ret.addPropertyResult('httpsPort', 'HTTPSPort', properties.HTTPSPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPSPort) : undefined);
    ret.addPropertyResult('originKeepaliveTimeout', 'OriginKeepaliveTimeout', properties.OriginKeepaliveTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.OriginKeepaliveTimeout) : undefined);
    ret.addPropertyResult('originProtocolPolicy', 'OriginProtocolPolicy', cfn_parse.FromCloudFormation.getString(properties.OriginProtocolPolicy));
    ret.addPropertyResult('originReadTimeout', 'OriginReadTimeout', properties.OriginReadTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.OriginReadTimeout) : undefined);
    ret.addPropertyResult('originSslProtocols', 'OriginSSLProtocols', properties.OriginSSLProtocols != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OriginSSLProtocols) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex type that describes the default cache behavior if you don't specify a `CacheBehavior` element or if request URLs don't match any of the values of `PathPattern` in `CacheBehavior` elements. You must create exactly one default cache behavior.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html
     */
    export interface DefaultCacheBehaviorProperty {
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

/**
 * Determine whether the given properties match those of a `DefaultCacheBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultCacheBehaviorProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_DefaultCacheBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedMethods', cdk.listValidator(cdk.validateString))(properties.allowedMethods));
    errors.collect(cdk.propertyValidator('cachePolicyId', cdk.validateString)(properties.cachePolicyId));
    errors.collect(cdk.propertyValidator('cachedMethods', cdk.listValidator(cdk.validateString))(properties.cachedMethods));
    errors.collect(cdk.propertyValidator('compress', cdk.validateBoolean)(properties.compress));
    errors.collect(cdk.propertyValidator('defaultTtl', cdk.validateNumber)(properties.defaultTtl));
    errors.collect(cdk.propertyValidator('fieldLevelEncryptionId', cdk.validateString)(properties.fieldLevelEncryptionId));
    errors.collect(cdk.propertyValidator('forwardedValues', CfnDistribution_ForwardedValuesPropertyValidator)(properties.forwardedValues));
    errors.collect(cdk.propertyValidator('functionAssociations', cdk.listValidator(CfnDistribution_FunctionAssociationPropertyValidator))(properties.functionAssociations));
    errors.collect(cdk.propertyValidator('lambdaFunctionAssociations', cdk.listValidator(CfnDistribution_LambdaFunctionAssociationPropertyValidator))(properties.lambdaFunctionAssociations));
    errors.collect(cdk.propertyValidator('maxTtl', cdk.validateNumber)(properties.maxTtl));
    errors.collect(cdk.propertyValidator('minTtl', cdk.validateNumber)(properties.minTtl));
    errors.collect(cdk.propertyValidator('originRequestPolicyId', cdk.validateString)(properties.originRequestPolicyId));
    errors.collect(cdk.propertyValidator('realtimeLogConfigArn', cdk.validateString)(properties.realtimeLogConfigArn));
    errors.collect(cdk.propertyValidator('responseHeadersPolicyId', cdk.validateString)(properties.responseHeadersPolicyId));
    errors.collect(cdk.propertyValidator('smoothStreaming', cdk.validateBoolean)(properties.smoothStreaming));
    errors.collect(cdk.propertyValidator('targetOriginId', cdk.requiredValidator)(properties.targetOriginId));
    errors.collect(cdk.propertyValidator('targetOriginId', cdk.validateString)(properties.targetOriginId));
    errors.collect(cdk.propertyValidator('trustedKeyGroups', cdk.listValidator(cdk.validateString))(properties.trustedKeyGroups));
    errors.collect(cdk.propertyValidator('trustedSigners', cdk.listValidator(cdk.validateString))(properties.trustedSigners));
    errors.collect(cdk.propertyValidator('viewerProtocolPolicy', cdk.requiredValidator)(properties.viewerProtocolPolicy));
    errors.collect(cdk.propertyValidator('viewerProtocolPolicy', cdk.validateString)(properties.viewerProtocolPolicy));
    return errors.wrap('supplied properties not correct for "DefaultCacheBehaviorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.DefaultCacheBehavior` resource
 *
 * @param properties - the TypeScript properties of a `DefaultCacheBehaviorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.DefaultCacheBehavior` resource.
 */
// @ts-ignore TS6133
function cfnDistributionDefaultCacheBehaviorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_DefaultCacheBehaviorPropertyValidator(properties).assertSuccess();
    return {
        AllowedMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedMethods),
        CachePolicyId: cdk.stringToCloudFormation(properties.cachePolicyId),
        CachedMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.cachedMethods),
        Compress: cdk.booleanToCloudFormation(properties.compress),
        DefaultTTL: cdk.numberToCloudFormation(properties.defaultTtl),
        FieldLevelEncryptionId: cdk.stringToCloudFormation(properties.fieldLevelEncryptionId),
        ForwardedValues: cfnDistributionForwardedValuesPropertyToCloudFormation(properties.forwardedValues),
        FunctionAssociations: cdk.listMapper(cfnDistributionFunctionAssociationPropertyToCloudFormation)(properties.functionAssociations),
        LambdaFunctionAssociations: cdk.listMapper(cfnDistributionLambdaFunctionAssociationPropertyToCloudFormation)(properties.lambdaFunctionAssociations),
        MaxTTL: cdk.numberToCloudFormation(properties.maxTtl),
        MinTTL: cdk.numberToCloudFormation(properties.minTtl),
        OriginRequestPolicyId: cdk.stringToCloudFormation(properties.originRequestPolicyId),
        RealtimeLogConfigArn: cdk.stringToCloudFormation(properties.realtimeLogConfigArn),
        ResponseHeadersPolicyId: cdk.stringToCloudFormation(properties.responseHeadersPolicyId),
        SmoothStreaming: cdk.booleanToCloudFormation(properties.smoothStreaming),
        TargetOriginId: cdk.stringToCloudFormation(properties.targetOriginId),
        TrustedKeyGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedKeyGroups),
        TrustedSigners: cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedSigners),
        ViewerProtocolPolicy: cdk.stringToCloudFormation(properties.viewerProtocolPolicy),
    };
}

// @ts-ignore TS6133
function CfnDistributionDefaultCacheBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.DefaultCacheBehaviorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.DefaultCacheBehaviorProperty>();
    ret.addPropertyResult('allowedMethods', 'AllowedMethods', properties.AllowedMethods != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedMethods) : undefined);
    ret.addPropertyResult('cachePolicyId', 'CachePolicyId', properties.CachePolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.CachePolicyId) : undefined);
    ret.addPropertyResult('cachedMethods', 'CachedMethods', properties.CachedMethods != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CachedMethods) : undefined);
    ret.addPropertyResult('compress', 'Compress', properties.Compress != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Compress) : undefined);
    ret.addPropertyResult('defaultTtl', 'DefaultTTL', properties.DefaultTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL) : undefined);
    ret.addPropertyResult('fieldLevelEncryptionId', 'FieldLevelEncryptionId', properties.FieldLevelEncryptionId != null ? cfn_parse.FromCloudFormation.getString(properties.FieldLevelEncryptionId) : undefined);
    ret.addPropertyResult('forwardedValues', 'ForwardedValues', properties.ForwardedValues != null ? CfnDistributionForwardedValuesPropertyFromCloudFormation(properties.ForwardedValues) : undefined);
    ret.addPropertyResult('functionAssociations', 'FunctionAssociations', properties.FunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionFunctionAssociationPropertyFromCloudFormation)(properties.FunctionAssociations) : undefined);
    ret.addPropertyResult('lambdaFunctionAssociations', 'LambdaFunctionAssociations', properties.LambdaFunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionLambdaFunctionAssociationPropertyFromCloudFormation)(properties.LambdaFunctionAssociations) : undefined);
    ret.addPropertyResult('maxTtl', 'MaxTTL', properties.MaxTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTTL) : undefined);
    ret.addPropertyResult('minTtl', 'MinTTL', properties.MinTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinTTL) : undefined);
    ret.addPropertyResult('originRequestPolicyId', 'OriginRequestPolicyId', properties.OriginRequestPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.OriginRequestPolicyId) : undefined);
    ret.addPropertyResult('realtimeLogConfigArn', 'RealtimeLogConfigArn', properties.RealtimeLogConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.RealtimeLogConfigArn) : undefined);
    ret.addPropertyResult('responseHeadersPolicyId', 'ResponseHeadersPolicyId', properties.ResponseHeadersPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseHeadersPolicyId) : undefined);
    ret.addPropertyResult('smoothStreaming', 'SmoothStreaming', properties.SmoothStreaming != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SmoothStreaming) : undefined);
    ret.addPropertyResult('targetOriginId', 'TargetOriginId', cfn_parse.FromCloudFormation.getString(properties.TargetOriginId));
    ret.addPropertyResult('trustedKeyGroups', 'TrustedKeyGroups', properties.TrustedKeyGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TrustedKeyGroups) : undefined);
    ret.addPropertyResult('trustedSigners', 'TrustedSigners', properties.TrustedSigners != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TrustedSigners) : undefined);
    ret.addPropertyResult('viewerProtocolPolicy', 'ViewerProtocolPolicy', cfn_parse.FromCloudFormation.getString(properties.ViewerProtocolPolicy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A distribution configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html
     */
    export interface DistributionConfigProperty {
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

/**
 * Determine whether the given properties match those of a `DistributionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DistributionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_DistributionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aliases', cdk.listValidator(cdk.validateString))(properties.aliases));
    errors.collect(cdk.propertyValidator('cnamEs', cdk.listValidator(cdk.validateString))(properties.cnamEs));
    errors.collect(cdk.propertyValidator('cacheBehaviors', cdk.listValidator(CfnDistribution_CacheBehaviorPropertyValidator))(properties.cacheBehaviors));
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('continuousDeploymentPolicyId', cdk.validateString)(properties.continuousDeploymentPolicyId));
    errors.collect(cdk.propertyValidator('customErrorResponses', cdk.listValidator(CfnDistribution_CustomErrorResponsePropertyValidator))(properties.customErrorResponses));
    errors.collect(cdk.propertyValidator('customOrigin', CfnDistribution_LegacyCustomOriginPropertyValidator)(properties.customOrigin));
    errors.collect(cdk.propertyValidator('defaultCacheBehavior', cdk.requiredValidator)(properties.defaultCacheBehavior));
    errors.collect(cdk.propertyValidator('defaultCacheBehavior', CfnDistribution_DefaultCacheBehaviorPropertyValidator)(properties.defaultCacheBehavior));
    errors.collect(cdk.propertyValidator('defaultRootObject', cdk.validateString)(properties.defaultRootObject));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('httpVersion', cdk.validateString)(properties.httpVersion));
    errors.collect(cdk.propertyValidator('ipv6Enabled', cdk.validateBoolean)(properties.ipv6Enabled));
    errors.collect(cdk.propertyValidator('logging', CfnDistribution_LoggingPropertyValidator)(properties.logging));
    errors.collect(cdk.propertyValidator('originGroups', CfnDistribution_OriginGroupsPropertyValidator)(properties.originGroups));
    errors.collect(cdk.propertyValidator('origins', cdk.listValidator(CfnDistribution_OriginPropertyValidator))(properties.origins));
    errors.collect(cdk.propertyValidator('priceClass', cdk.validateString)(properties.priceClass));
    errors.collect(cdk.propertyValidator('restrictions', CfnDistribution_RestrictionsPropertyValidator)(properties.restrictions));
    errors.collect(cdk.propertyValidator('s3Origin', CfnDistribution_LegacyS3OriginPropertyValidator)(properties.s3Origin));
    errors.collect(cdk.propertyValidator('staging', cdk.validateBoolean)(properties.staging));
    errors.collect(cdk.propertyValidator('viewerCertificate', CfnDistribution_ViewerCertificatePropertyValidator)(properties.viewerCertificate));
    errors.collect(cdk.propertyValidator('webAclId', cdk.validateString)(properties.webAclId));
    return errors.wrap('supplied properties not correct for "DistributionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.DistributionConfig` resource
 *
 * @param properties - the TypeScript properties of a `DistributionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.DistributionConfig` resource.
 */
// @ts-ignore TS6133
function cfnDistributionDistributionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_DistributionConfigPropertyValidator(properties).assertSuccess();
    return {
        Aliases: cdk.listMapper(cdk.stringToCloudFormation)(properties.aliases),
        CNAMEs: cdk.listMapper(cdk.stringToCloudFormation)(properties.cnamEs),
        CacheBehaviors: cdk.listMapper(cfnDistributionCacheBehaviorPropertyToCloudFormation)(properties.cacheBehaviors),
        Comment: cdk.stringToCloudFormation(properties.comment),
        ContinuousDeploymentPolicyId: cdk.stringToCloudFormation(properties.continuousDeploymentPolicyId),
        CustomErrorResponses: cdk.listMapper(cfnDistributionCustomErrorResponsePropertyToCloudFormation)(properties.customErrorResponses),
        CustomOrigin: cfnDistributionLegacyCustomOriginPropertyToCloudFormation(properties.customOrigin),
        DefaultCacheBehavior: cfnDistributionDefaultCacheBehaviorPropertyToCloudFormation(properties.defaultCacheBehavior),
        DefaultRootObject: cdk.stringToCloudFormation(properties.defaultRootObject),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        HttpVersion: cdk.stringToCloudFormation(properties.httpVersion),
        IPV6Enabled: cdk.booleanToCloudFormation(properties.ipv6Enabled),
        Logging: cfnDistributionLoggingPropertyToCloudFormation(properties.logging),
        OriginGroups: cfnDistributionOriginGroupsPropertyToCloudFormation(properties.originGroups),
        Origins: cdk.listMapper(cfnDistributionOriginPropertyToCloudFormation)(properties.origins),
        PriceClass: cdk.stringToCloudFormation(properties.priceClass),
        Restrictions: cfnDistributionRestrictionsPropertyToCloudFormation(properties.restrictions),
        S3Origin: cfnDistributionLegacyS3OriginPropertyToCloudFormation(properties.s3Origin),
        Staging: cdk.booleanToCloudFormation(properties.staging),
        ViewerCertificate: cfnDistributionViewerCertificatePropertyToCloudFormation(properties.viewerCertificate),
        WebACLId: cdk.stringToCloudFormation(properties.webAclId),
    };
}

// @ts-ignore TS6133
function CfnDistributionDistributionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.DistributionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.DistributionConfigProperty>();
    ret.addPropertyResult('aliases', 'Aliases', properties.Aliases != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Aliases) : undefined);
    ret.addPropertyResult('cnamEs', 'CNAMEs', properties.CNAMEs != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CNAMEs) : undefined);
    ret.addPropertyResult('cacheBehaviors', 'CacheBehaviors', properties.CacheBehaviors != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionCacheBehaviorPropertyFromCloudFormation)(properties.CacheBehaviors) : undefined);
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('continuousDeploymentPolicyId', 'ContinuousDeploymentPolicyId', properties.ContinuousDeploymentPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.ContinuousDeploymentPolicyId) : undefined);
    ret.addPropertyResult('customErrorResponses', 'CustomErrorResponses', properties.CustomErrorResponses != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionCustomErrorResponsePropertyFromCloudFormation)(properties.CustomErrorResponses) : undefined);
    ret.addPropertyResult('customOrigin', 'CustomOrigin', properties.CustomOrigin != null ? CfnDistributionLegacyCustomOriginPropertyFromCloudFormation(properties.CustomOrigin) : undefined);
    ret.addPropertyResult('defaultCacheBehavior', 'DefaultCacheBehavior', CfnDistributionDefaultCacheBehaviorPropertyFromCloudFormation(properties.DefaultCacheBehavior));
    ret.addPropertyResult('defaultRootObject', 'DefaultRootObject', properties.DefaultRootObject != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultRootObject) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('httpVersion', 'HttpVersion', properties.HttpVersion != null ? cfn_parse.FromCloudFormation.getString(properties.HttpVersion) : undefined);
    ret.addPropertyResult('ipv6Enabled', 'IPV6Enabled', properties.IPV6Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IPV6Enabled) : undefined);
    ret.addPropertyResult('logging', 'Logging', properties.Logging != null ? CfnDistributionLoggingPropertyFromCloudFormation(properties.Logging) : undefined);
    ret.addPropertyResult('originGroups', 'OriginGroups', properties.OriginGroups != null ? CfnDistributionOriginGroupsPropertyFromCloudFormation(properties.OriginGroups) : undefined);
    ret.addPropertyResult('origins', 'Origins', properties.Origins != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginPropertyFromCloudFormation)(properties.Origins) : undefined);
    ret.addPropertyResult('priceClass', 'PriceClass', properties.PriceClass != null ? cfn_parse.FromCloudFormation.getString(properties.PriceClass) : undefined);
    ret.addPropertyResult('restrictions', 'Restrictions', properties.Restrictions != null ? CfnDistributionRestrictionsPropertyFromCloudFormation(properties.Restrictions) : undefined);
    ret.addPropertyResult('s3Origin', 'S3Origin', properties.S3Origin != null ? CfnDistributionLegacyS3OriginPropertyFromCloudFormation(properties.S3Origin) : undefined);
    ret.addPropertyResult('staging', 'Staging', properties.Staging != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Staging) : undefined);
    ret.addPropertyResult('viewerCertificate', 'ViewerCertificate', properties.ViewerCertificate != null ? CfnDistributionViewerCertificatePropertyFromCloudFormation(properties.ViewerCertificate) : undefined);
    ret.addPropertyResult('webAclId', 'WebACLId', properties.WebACLId != null ? cfn_parse.FromCloudFormation.getString(properties.WebACLId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
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
    export interface ForwardedValuesProperty {
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

/**
 * Determine whether the given properties match those of a `ForwardedValuesProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardedValuesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_ForwardedValuesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cookies', CfnDistribution_CookiesPropertyValidator)(properties.cookies));
    errors.collect(cdk.propertyValidator('headers', cdk.listValidator(cdk.validateString))(properties.headers));
    errors.collect(cdk.propertyValidator('queryString', cdk.requiredValidator)(properties.queryString));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateBoolean)(properties.queryString));
    errors.collect(cdk.propertyValidator('queryStringCacheKeys', cdk.listValidator(cdk.validateString))(properties.queryStringCacheKeys));
    return errors.wrap('supplied properties not correct for "ForwardedValuesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.ForwardedValues` resource
 *
 * @param properties - the TypeScript properties of a `ForwardedValuesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.ForwardedValues` resource.
 */
// @ts-ignore TS6133
function cfnDistributionForwardedValuesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_ForwardedValuesPropertyValidator(properties).assertSuccess();
    return {
        Cookies: cfnDistributionCookiesPropertyToCloudFormation(properties.cookies),
        Headers: cdk.listMapper(cdk.stringToCloudFormation)(properties.headers),
        QueryString: cdk.booleanToCloudFormation(properties.queryString),
        QueryStringCacheKeys: cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStringCacheKeys),
    };
}

// @ts-ignore TS6133
function CfnDistributionForwardedValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.ForwardedValuesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.ForwardedValuesProperty>();
    ret.addPropertyResult('cookies', 'Cookies', properties.Cookies != null ? CfnDistributionCookiesPropertyFromCloudFormation(properties.Cookies) : undefined);
    ret.addPropertyResult('headers', 'Headers', properties.Headers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Headers) : undefined);
    ret.addPropertyResult('queryString', 'QueryString', cfn_parse.FromCloudFormation.getBoolean(properties.QueryString));
    ret.addPropertyResult('queryStringCacheKeys', 'QueryStringCacheKeys', properties.QueryStringCacheKeys != null ? cfn_parse.FromCloudFormation.getStringArray(properties.QueryStringCacheKeys) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A CloudFront function that is associated with a cache behavior in a CloudFront distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-functionassociation.html
     */
    export interface FunctionAssociationProperty {
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

/**
 * Determine whether the given properties match those of a `FunctionAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionAssociationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_FunctionAssociationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventType', cdk.validateString)(properties.eventType));
    errors.collect(cdk.propertyValidator('functionArn', cdk.validateString)(properties.functionArn));
    return errors.wrap('supplied properties not correct for "FunctionAssociationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.FunctionAssociation` resource
 *
 * @param properties - the TypeScript properties of a `FunctionAssociationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.FunctionAssociation` resource.
 */
// @ts-ignore TS6133
function cfnDistributionFunctionAssociationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_FunctionAssociationPropertyValidator(properties).assertSuccess();
    return {
        EventType: cdk.stringToCloudFormation(properties.eventType),
        FunctionARN: cdk.stringToCloudFormation(properties.functionArn),
    };
}

// @ts-ignore TS6133
function CfnDistributionFunctionAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.FunctionAssociationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.FunctionAssociationProperty>();
    ret.addPropertyResult('eventType', 'EventType', properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined);
    ret.addPropertyResult('functionArn', 'FunctionARN', properties.FunctionARN != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionARN) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex type that controls the countries in which your content is distributed. CloudFront determines the location of your users using `MaxMind` GeoIP databases. To disable geo restriction, remove the [Restrictions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions) property from your stack template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html
     */
    export interface GeoRestrictionProperty {
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

/**
 * Determine whether the given properties match those of a `GeoRestrictionProperty`
 *
 * @param properties - the TypeScript properties of a `GeoRestrictionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_GeoRestrictionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('locations', cdk.listValidator(cdk.validateString))(properties.locations));
    errors.collect(cdk.propertyValidator('restrictionType', cdk.requiredValidator)(properties.restrictionType));
    errors.collect(cdk.propertyValidator('restrictionType', cdk.validateString)(properties.restrictionType));
    return errors.wrap('supplied properties not correct for "GeoRestrictionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.GeoRestriction` resource
 *
 * @param properties - the TypeScript properties of a `GeoRestrictionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.GeoRestriction` resource.
 */
// @ts-ignore TS6133
function cfnDistributionGeoRestrictionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_GeoRestrictionPropertyValidator(properties).assertSuccess();
    return {
        Locations: cdk.listMapper(cdk.stringToCloudFormation)(properties.locations),
        RestrictionType: cdk.stringToCloudFormation(properties.restrictionType),
    };
}

// @ts-ignore TS6133
function CfnDistributionGeoRestrictionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.GeoRestrictionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.GeoRestrictionProperty>();
    ret.addPropertyResult('locations', 'Locations', properties.Locations != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Locations) : undefined);
    ret.addPropertyResult('restrictionType', 'RestrictionType', cfn_parse.FromCloudFormation.getString(properties.RestrictionType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex type that contains a Lambda@Edge function association.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html
     */
    export interface LambdaFunctionAssociationProperty {
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

/**
 * Determine whether the given properties match those of a `LambdaFunctionAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionAssociationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_LambdaFunctionAssociationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventType', cdk.validateString)(properties.eventType));
    errors.collect(cdk.propertyValidator('includeBody', cdk.validateBoolean)(properties.includeBody));
    errors.collect(cdk.propertyValidator('lambdaFunctionArn', cdk.validateString)(properties.lambdaFunctionArn));
    return errors.wrap('supplied properties not correct for "LambdaFunctionAssociationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.LambdaFunctionAssociation` resource
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionAssociationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.LambdaFunctionAssociation` resource.
 */
// @ts-ignore TS6133
function cfnDistributionLambdaFunctionAssociationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_LambdaFunctionAssociationPropertyValidator(properties).assertSuccess();
    return {
        EventType: cdk.stringToCloudFormation(properties.eventType),
        IncludeBody: cdk.booleanToCloudFormation(properties.includeBody),
        LambdaFunctionARN: cdk.stringToCloudFormation(properties.lambdaFunctionArn),
    };
}

// @ts-ignore TS6133
function CfnDistributionLambdaFunctionAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.LambdaFunctionAssociationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LambdaFunctionAssociationProperty>();
    ret.addPropertyResult('eventType', 'EventType', properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined);
    ret.addPropertyResult('includeBody', 'IncludeBody', properties.IncludeBody != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeBody) : undefined);
    ret.addPropertyResult('lambdaFunctionArn', 'LambdaFunctionARN', properties.LambdaFunctionARN != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionARN) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html
     */
    export interface LegacyCustomOriginProperty {
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

/**
 * Determine whether the given properties match those of a `LegacyCustomOriginProperty`
 *
 * @param properties - the TypeScript properties of a `LegacyCustomOriginProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_LegacyCustomOriginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dnsName', cdk.requiredValidator)(properties.dnsName));
    errors.collect(cdk.propertyValidator('dnsName', cdk.validateString)(properties.dnsName));
    errors.collect(cdk.propertyValidator('httpPort', cdk.validateNumber)(properties.httpPort));
    errors.collect(cdk.propertyValidator('httpsPort', cdk.validateNumber)(properties.httpsPort));
    errors.collect(cdk.propertyValidator('originProtocolPolicy', cdk.requiredValidator)(properties.originProtocolPolicy));
    errors.collect(cdk.propertyValidator('originProtocolPolicy', cdk.validateString)(properties.originProtocolPolicy));
    errors.collect(cdk.propertyValidator('originSslProtocols', cdk.requiredValidator)(properties.originSslProtocols));
    errors.collect(cdk.propertyValidator('originSslProtocols', cdk.listValidator(cdk.validateString))(properties.originSslProtocols));
    return errors.wrap('supplied properties not correct for "LegacyCustomOriginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.LegacyCustomOrigin` resource
 *
 * @param properties - the TypeScript properties of a `LegacyCustomOriginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.LegacyCustomOrigin` resource.
 */
// @ts-ignore TS6133
function cfnDistributionLegacyCustomOriginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_LegacyCustomOriginPropertyValidator(properties).assertSuccess();
    return {
        DNSName: cdk.stringToCloudFormation(properties.dnsName),
        HTTPPort: cdk.numberToCloudFormation(properties.httpPort),
        HTTPSPort: cdk.numberToCloudFormation(properties.httpsPort),
        OriginProtocolPolicy: cdk.stringToCloudFormation(properties.originProtocolPolicy),
        OriginSSLProtocols: cdk.listMapper(cdk.stringToCloudFormation)(properties.originSslProtocols),
    };
}

// @ts-ignore TS6133
function CfnDistributionLegacyCustomOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.LegacyCustomOriginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LegacyCustomOriginProperty>();
    ret.addPropertyResult('dnsName', 'DNSName', cfn_parse.FromCloudFormation.getString(properties.DNSName));
    ret.addPropertyResult('httpPort', 'HTTPPort', properties.HTTPPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPPort) : undefined);
    ret.addPropertyResult('httpsPort', 'HTTPSPort', properties.HTTPSPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPSPort) : undefined);
    ret.addPropertyResult('originProtocolPolicy', 'OriginProtocolPolicy', cfn_parse.FromCloudFormation.getString(properties.OriginProtocolPolicy));
    ret.addPropertyResult('originSslProtocols', 'OriginSSLProtocols', cfn_parse.FromCloudFormation.getStringArray(properties.OriginSSLProtocols));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacys3origin.html
     */
    export interface LegacyS3OriginProperty {
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

/**
 * Determine whether the given properties match those of a `LegacyS3OriginProperty`
 *
 * @param properties - the TypeScript properties of a `LegacyS3OriginProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_LegacyS3OriginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dnsName', cdk.requiredValidator)(properties.dnsName));
    errors.collect(cdk.propertyValidator('dnsName', cdk.validateString)(properties.dnsName));
    errors.collect(cdk.propertyValidator('originAccessIdentity', cdk.validateString)(properties.originAccessIdentity));
    return errors.wrap('supplied properties not correct for "LegacyS3OriginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.LegacyS3Origin` resource
 *
 * @param properties - the TypeScript properties of a `LegacyS3OriginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.LegacyS3Origin` resource.
 */
// @ts-ignore TS6133
function cfnDistributionLegacyS3OriginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_LegacyS3OriginPropertyValidator(properties).assertSuccess();
    return {
        DNSName: cdk.stringToCloudFormation(properties.dnsName),
        OriginAccessIdentity: cdk.stringToCloudFormation(properties.originAccessIdentity),
    };
}

// @ts-ignore TS6133
function CfnDistributionLegacyS3OriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.LegacyS3OriginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LegacyS3OriginProperty>();
    ret.addPropertyResult('dnsName', 'DNSName', cfn_parse.FromCloudFormation.getString(properties.DNSName));
    ret.addPropertyResult('originAccessIdentity', 'OriginAccessIdentity', properties.OriginAccessIdentity != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessIdentity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex type that controls whether access logs are written for the distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html
     */
    export interface LoggingProperty {
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

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_LoggingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('includeCookies', cdk.validateBoolean)(properties.includeCookies));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    return errors.wrap('supplied properties not correct for "LoggingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Logging` resource
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Logging` resource.
 */
// @ts-ignore TS6133
function cfnDistributionLoggingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_LoggingPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        IncludeCookies: cdk.booleanToCloudFormation(properties.includeCookies),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
    };
}

// @ts-ignore TS6133
function CfnDistributionLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.LoggingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LoggingProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('includeCookies', 'IncludeCookies', properties.IncludeCookies != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeCookies) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
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
    export interface OriginProperty {
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

/**
 * Determine whether the given properties match those of a `OriginProperty`
 *
 * @param properties - the TypeScript properties of a `OriginProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionAttempts', cdk.validateNumber)(properties.connectionAttempts));
    errors.collect(cdk.propertyValidator('connectionTimeout', cdk.validateNumber)(properties.connectionTimeout));
    errors.collect(cdk.propertyValidator('customOriginConfig', CfnDistribution_CustomOriginConfigPropertyValidator)(properties.customOriginConfig));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('originAccessControlId', cdk.validateString)(properties.originAccessControlId));
    errors.collect(cdk.propertyValidator('originCustomHeaders', cdk.listValidator(CfnDistribution_OriginCustomHeaderPropertyValidator))(properties.originCustomHeaders));
    errors.collect(cdk.propertyValidator('originPath', cdk.validateString)(properties.originPath));
    errors.collect(cdk.propertyValidator('originShield', CfnDistribution_OriginShieldPropertyValidator)(properties.originShield));
    errors.collect(cdk.propertyValidator('s3OriginConfig', CfnDistribution_S3OriginConfigPropertyValidator)(properties.s3OriginConfig));
    return errors.wrap('supplied properties not correct for "OriginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Origin` resource
 *
 * @param properties - the TypeScript properties of a `OriginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Origin` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginPropertyValidator(properties).assertSuccess();
    return {
        ConnectionAttempts: cdk.numberToCloudFormation(properties.connectionAttempts),
        ConnectionTimeout: cdk.numberToCloudFormation(properties.connectionTimeout),
        CustomOriginConfig: cfnDistributionCustomOriginConfigPropertyToCloudFormation(properties.customOriginConfig),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        Id: cdk.stringToCloudFormation(properties.id),
        OriginAccessControlId: cdk.stringToCloudFormation(properties.originAccessControlId),
        OriginCustomHeaders: cdk.listMapper(cfnDistributionOriginCustomHeaderPropertyToCloudFormation)(properties.originCustomHeaders),
        OriginPath: cdk.stringToCloudFormation(properties.originPath),
        OriginShield: cfnDistributionOriginShieldPropertyToCloudFormation(properties.originShield),
        S3OriginConfig: cfnDistributionS3OriginConfigPropertyToCloudFormation(properties.s3OriginConfig),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginProperty>();
    ret.addPropertyResult('connectionAttempts', 'ConnectionAttempts', properties.ConnectionAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionAttempts) : undefined);
    ret.addPropertyResult('connectionTimeout', 'ConnectionTimeout', properties.ConnectionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionTimeout) : undefined);
    ret.addPropertyResult('customOriginConfig', 'CustomOriginConfig', properties.CustomOriginConfig != null ? CfnDistributionCustomOriginConfigPropertyFromCloudFormation(properties.CustomOriginConfig) : undefined);
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('originAccessControlId', 'OriginAccessControlId', properties.OriginAccessControlId != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessControlId) : undefined);
    ret.addPropertyResult('originCustomHeaders', 'OriginCustomHeaders', properties.OriginCustomHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginCustomHeaderPropertyFromCloudFormation)(properties.OriginCustomHeaders) : undefined);
    ret.addPropertyResult('originPath', 'OriginPath', properties.OriginPath != null ? cfn_parse.FromCloudFormation.getString(properties.OriginPath) : undefined);
    ret.addPropertyResult('originShield', 'OriginShield', properties.OriginShield != null ? CfnDistributionOriginShieldPropertyFromCloudFormation(properties.OriginShield) : undefined);
    ret.addPropertyResult('s3OriginConfig', 'S3OriginConfig', properties.S3OriginConfig != null ? CfnDistributionS3OriginConfigPropertyFromCloudFormation(properties.S3OriginConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex type that contains `HeaderName` and `HeaderValue` elements, if any, for this distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html
     */
    export interface OriginCustomHeaderProperty {
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

/**
 * Determine whether the given properties match those of a `OriginCustomHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `OriginCustomHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginCustomHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headerName', cdk.requiredValidator)(properties.headerName));
    errors.collect(cdk.propertyValidator('headerName', cdk.validateString)(properties.headerName));
    errors.collect(cdk.propertyValidator('headerValue', cdk.requiredValidator)(properties.headerValue));
    errors.collect(cdk.propertyValidator('headerValue', cdk.validateString)(properties.headerValue));
    return errors.wrap('supplied properties not correct for "OriginCustomHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginCustomHeader` resource
 *
 * @param properties - the TypeScript properties of a `OriginCustomHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginCustomHeader` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginCustomHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginCustomHeaderPropertyValidator(properties).assertSuccess();
    return {
        HeaderName: cdk.stringToCloudFormation(properties.headerName),
        HeaderValue: cdk.stringToCloudFormation(properties.headerValue),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginCustomHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginCustomHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginCustomHeaderProperty>();
    ret.addPropertyResult('headerName', 'HeaderName', cfn_parse.FromCloudFormation.getString(properties.HeaderName));
    ret.addPropertyResult('headerValue', 'HeaderValue', cfn_parse.FromCloudFormation.getString(properties.HeaderValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * An origin group includes two origins (a primary origin and a second origin to failover to) and a failover criteria that you specify. You create an origin group to support origin failover in CloudFront. When you create or update a distribution, you can specifiy the origin group instead of a single origin, and CloudFront will failover from the primary origin to the second origin under the failover conditions that you've chosen.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html
     */
    export interface OriginGroupProperty {
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

/**
 * Determine whether the given properties match those of a `OriginGroupProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('failoverCriteria', cdk.requiredValidator)(properties.failoverCriteria));
    errors.collect(cdk.propertyValidator('failoverCriteria', CfnDistribution_OriginGroupFailoverCriteriaPropertyValidator)(properties.failoverCriteria));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('members', cdk.requiredValidator)(properties.members));
    errors.collect(cdk.propertyValidator('members', CfnDistribution_OriginGroupMembersPropertyValidator)(properties.members));
    return errors.wrap('supplied properties not correct for "OriginGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroup` resource
 *
 * @param properties - the TypeScript properties of a `OriginGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroup` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginGroupPropertyValidator(properties).assertSuccess();
    return {
        FailoverCriteria: cfnDistributionOriginGroupFailoverCriteriaPropertyToCloudFormation(properties.failoverCriteria),
        Id: cdk.stringToCloudFormation(properties.id),
        Members: cfnDistributionOriginGroupMembersPropertyToCloudFormation(properties.members),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupProperty>();
    ret.addPropertyResult('failoverCriteria', 'FailoverCriteria', CfnDistributionOriginGroupFailoverCriteriaPropertyFromCloudFormation(properties.FailoverCriteria));
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('members', 'Members', CfnDistributionOriginGroupMembersPropertyFromCloudFormation(properties.Members));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex data type that includes information about the failover criteria for an origin group, including the status codes for which CloudFront will failover from the primary origin to the second origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupfailovercriteria.html
     */
    export interface OriginGroupFailoverCriteriaProperty {
        /**
         * The status codes that, when returned from the primary origin, will trigger CloudFront to failover to the second origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupfailovercriteria.html#cfn-cloudfront-distribution-origingroupfailovercriteria-statuscodes
         */
        readonly statusCodes: CfnDistribution.StatusCodesProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OriginGroupFailoverCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupFailoverCriteriaProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginGroupFailoverCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statusCodes', cdk.requiredValidator)(properties.statusCodes));
    errors.collect(cdk.propertyValidator('statusCodes', CfnDistribution_StatusCodesPropertyValidator)(properties.statusCodes));
    return errors.wrap('supplied properties not correct for "OriginGroupFailoverCriteriaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroupFailoverCriteria` resource
 *
 * @param properties - the TypeScript properties of a `OriginGroupFailoverCriteriaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroupFailoverCriteria` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginGroupFailoverCriteriaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginGroupFailoverCriteriaPropertyValidator(properties).assertSuccess();
    return {
        StatusCodes: cfnDistributionStatusCodesPropertyToCloudFormation(properties.statusCodes),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupFailoverCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginGroupFailoverCriteriaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupFailoverCriteriaProperty>();
    ret.addPropertyResult('statusCodes', 'StatusCodes', CfnDistributionStatusCodesPropertyFromCloudFormation(properties.StatusCodes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * An origin in an origin group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmember.html
     */
    export interface OriginGroupMemberProperty {
        /**
         * The ID for an origin in an origin group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmember.html#cfn-cloudfront-distribution-origingroupmember-originid
         */
        readonly originId: string;
    }
}

/**
 * Determine whether the given properties match those of a `OriginGroupMemberProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupMemberProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginGroupMemberPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('originId', cdk.requiredValidator)(properties.originId));
    errors.collect(cdk.propertyValidator('originId', cdk.validateString)(properties.originId));
    return errors.wrap('supplied properties not correct for "OriginGroupMemberProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroupMember` resource
 *
 * @param properties - the TypeScript properties of a `OriginGroupMemberProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroupMember` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginGroupMemberPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginGroupMemberPropertyValidator(properties).assertSuccess();
    return {
        OriginId: cdk.stringToCloudFormation(properties.originId),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupMemberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginGroupMemberProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupMemberProperty>();
    ret.addPropertyResult('originId', 'OriginId', cfn_parse.FromCloudFormation.getString(properties.OriginId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex data type for the origins included in an origin group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmembers.html
     */
    export interface OriginGroupMembersProperty {
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

/**
 * Determine whether the given properties match those of a `OriginGroupMembersProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupMembersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginGroupMembersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(CfnDistribution_OriginGroupMemberPropertyValidator))(properties.items));
    errors.collect(cdk.propertyValidator('quantity', cdk.requiredValidator)(properties.quantity));
    errors.collect(cdk.propertyValidator('quantity', cdk.validateNumber)(properties.quantity));
    return errors.wrap('supplied properties not correct for "OriginGroupMembersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroupMembers` resource
 *
 * @param properties - the TypeScript properties of a `OriginGroupMembersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroupMembers` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginGroupMembersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginGroupMembersPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cfnDistributionOriginGroupMemberPropertyToCloudFormation)(properties.items),
        Quantity: cdk.numberToCloudFormation(properties.quantity),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupMembersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginGroupMembersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupMembersProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginGroupMemberPropertyFromCloudFormation)(properties.Items));
    ret.addPropertyResult('quantity', 'Quantity', cfn_parse.FromCloudFormation.getNumber(properties.Quantity));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex data type for the origin groups specified for a distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroups.html
     */
    export interface OriginGroupsProperty {
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

/**
 * Determine whether the given properties match those of a `OriginGroupsProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginGroupsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(CfnDistribution_OriginGroupPropertyValidator))(properties.items));
    errors.collect(cdk.propertyValidator('quantity', cdk.requiredValidator)(properties.quantity));
    errors.collect(cdk.propertyValidator('quantity', cdk.validateNumber)(properties.quantity));
    return errors.wrap('supplied properties not correct for "OriginGroupsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroups` resource
 *
 * @param properties - the TypeScript properties of a `OriginGroupsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginGroups` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginGroupsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginGroupsPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cfnDistributionOriginGroupPropertyToCloudFormation)(properties.items),
        Quantity: cdk.numberToCloudFormation(properties.quantity),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginGroupsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupsProperty>();
    ret.addPropertyResult('items', 'Items', properties.Items != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginGroupPropertyFromCloudFormation)(properties.Items) : undefined);
    ret.addPropertyResult('quantity', 'Quantity', cfn_parse.FromCloudFormation.getNumber(properties.Quantity));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
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
    export interface OriginShieldProperty {
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

/**
 * Determine whether the given properties match those of a `OriginShieldProperty`
 *
 * @param properties - the TypeScript properties of a `OriginShieldProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_OriginShieldPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('originShieldRegion', cdk.validateString)(properties.originShieldRegion));
    return errors.wrap('supplied properties not correct for "OriginShieldProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginShield` resource
 *
 * @param properties - the TypeScript properties of a `OriginShieldProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.OriginShield` resource.
 */
// @ts-ignore TS6133
function cfnDistributionOriginShieldPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_OriginShieldPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        OriginShieldRegion: cdk.stringToCloudFormation(properties.originShieldRegion),
    };
}

// @ts-ignore TS6133
function CfnDistributionOriginShieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.OriginShieldProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginShieldProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('originShieldRegion', 'OriginShieldRegion', properties.OriginShieldRegion != null ? cfn_parse.FromCloudFormation.getString(properties.OriginShieldRegion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex type that identifies ways in which you want to restrict distribution of your content.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html
     */
    export interface RestrictionsProperty {
        /**
         * A complex type that controls the countries in which your content is distributed. CloudFront determines the location of your users using `MaxMind` GeoIP databases. To disable geo restriction, remove the [Restrictions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions) property from your stack template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html#cfn-cloudfront-distribution-restrictions-georestriction
         */
        readonly geoRestriction: CfnDistribution.GeoRestrictionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RestrictionsProperty`
 *
 * @param properties - the TypeScript properties of a `RestrictionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_RestrictionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('geoRestriction', cdk.requiredValidator)(properties.geoRestriction));
    errors.collect(cdk.propertyValidator('geoRestriction', CfnDistribution_GeoRestrictionPropertyValidator)(properties.geoRestriction));
    return errors.wrap('supplied properties not correct for "RestrictionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Restrictions` resource
 *
 * @param properties - the TypeScript properties of a `RestrictionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.Restrictions` resource.
 */
// @ts-ignore TS6133
function cfnDistributionRestrictionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_RestrictionsPropertyValidator(properties).assertSuccess();
    return {
        GeoRestriction: cfnDistributionGeoRestrictionPropertyToCloudFormation(properties.geoRestriction),
    };
}

// @ts-ignore TS6133
function CfnDistributionRestrictionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.RestrictionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.RestrictionsProperty>();
    ret.addPropertyResult('geoRestriction', 'GeoRestriction', CfnDistributionGeoRestrictionPropertyFromCloudFormation(properties.GeoRestriction));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex type that contains information about the Amazon S3 origin. If the origin is a custom origin or an S3 bucket that is configured as a website endpoint, use the `CustomOriginConfig` element instead.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html
     */
    export interface S3OriginConfigProperty {
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

/**
 * Determine whether the given properties match those of a `S3OriginConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3OriginConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_S3OriginConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('originAccessIdentity', cdk.validateString)(properties.originAccessIdentity));
    return errors.wrap('supplied properties not correct for "S3OriginConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.S3OriginConfig` resource
 *
 * @param properties - the TypeScript properties of a `S3OriginConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.S3OriginConfig` resource.
 */
// @ts-ignore TS6133
function cfnDistributionS3OriginConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_S3OriginConfigPropertyValidator(properties).assertSuccess();
    return {
        OriginAccessIdentity: cdk.stringToCloudFormation(properties.originAccessIdentity),
    };
}

// @ts-ignore TS6133
function CfnDistributionS3OriginConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.S3OriginConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.S3OriginConfigProperty>();
    ret.addPropertyResult('originAccessIdentity', 'OriginAccessIdentity', properties.OriginAccessIdentity != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessIdentity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * A complex data type for the status codes that you specify that, when returned by a primary origin, trigger CloudFront to failover to a second origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-statuscodes.html
     */
    export interface StatusCodesProperty {
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

/**
 * Determine whether the given properties match those of a `StatusCodesProperty`
 *
 * @param properties - the TypeScript properties of a `StatusCodesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_StatusCodesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(cdk.validateNumber))(properties.items));
    errors.collect(cdk.propertyValidator('quantity', cdk.requiredValidator)(properties.quantity));
    errors.collect(cdk.propertyValidator('quantity', cdk.validateNumber)(properties.quantity));
    return errors.wrap('supplied properties not correct for "StatusCodesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.StatusCodes` resource
 *
 * @param properties - the TypeScript properties of a `StatusCodesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.StatusCodes` resource.
 */
// @ts-ignore TS6133
function cfnDistributionStatusCodesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_StatusCodesPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cdk.numberToCloudFormation)(properties.items),
        Quantity: cdk.numberToCloudFormation(properties.quantity),
    };
}

// @ts-ignore TS6133
function CfnDistributionStatusCodesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.StatusCodesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.StatusCodesProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Items));
    ret.addPropertyResult('quantity', 'Quantity', cfn_parse.FromCloudFormation.getNumber(properties.Quantity));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
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
    export interface ViewerCertificateProperty {
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
 * Determine whether the given properties match those of a `ViewerCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ViewerCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_ViewerCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acmCertificateArn', cdk.validateString)(properties.acmCertificateArn));
    errors.collect(cdk.propertyValidator('cloudFrontDefaultCertificate', cdk.validateBoolean)(properties.cloudFrontDefaultCertificate));
    errors.collect(cdk.propertyValidator('iamCertificateId', cdk.validateString)(properties.iamCertificateId));
    errors.collect(cdk.propertyValidator('minimumProtocolVersion', cdk.validateString)(properties.minimumProtocolVersion));
    errors.collect(cdk.propertyValidator('sslSupportMethod', cdk.validateString)(properties.sslSupportMethod));
    return errors.wrap('supplied properties not correct for "ViewerCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.ViewerCertificate` resource
 *
 * @param properties - the TypeScript properties of a `ViewerCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Distribution.ViewerCertificate` resource.
 */
// @ts-ignore TS6133
function cfnDistributionViewerCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_ViewerCertificatePropertyValidator(properties).assertSuccess();
    return {
        AcmCertificateArn: cdk.stringToCloudFormation(properties.acmCertificateArn),
        CloudFrontDefaultCertificate: cdk.booleanToCloudFormation(properties.cloudFrontDefaultCertificate),
        IamCertificateId: cdk.stringToCloudFormation(properties.iamCertificateId),
        MinimumProtocolVersion: cdk.stringToCloudFormation(properties.minimumProtocolVersion),
        SslSupportMethod: cdk.stringToCloudFormation(properties.sslSupportMethod),
    };
}

// @ts-ignore TS6133
function CfnDistributionViewerCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.ViewerCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.ViewerCertificateProperty>();
    ret.addPropertyResult('acmCertificateArn', 'AcmCertificateArn', properties.AcmCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.AcmCertificateArn) : undefined);
    ret.addPropertyResult('cloudFrontDefaultCertificate', 'CloudFrontDefaultCertificate', properties.CloudFrontDefaultCertificate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudFrontDefaultCertificate) : undefined);
    ret.addPropertyResult('iamCertificateId', 'IamCertificateId', properties.IamCertificateId != null ? cfn_parse.FromCloudFormation.getString(properties.IamCertificateId) : undefined);
    ret.addPropertyResult('minimumProtocolVersion', 'MinimumProtocolVersion', properties.MinimumProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.MinimumProtocolVersion) : undefined);
    ret.addPropertyResult('sslSupportMethod', 'SslSupportMethod', properties.SslSupportMethod != null ? cfn_parse.FromCloudFormation.getString(properties.SslSupportMethod) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnFunctionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the result of the validation.
 */
function CfnFunctionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoPublish', cdk.validateBoolean)(properties.autoPublish));
    errors.collect(cdk.propertyValidator('functionCode', cdk.requiredValidator)(properties.functionCode));
    errors.collect(cdk.propertyValidator('functionCode', cdk.validateString)(properties.functionCode));
    errors.collect(cdk.propertyValidator('functionConfig', cdk.requiredValidator)(properties.functionConfig));
    errors.collect(cdk.propertyValidator('functionConfig', CfnFunction_FunctionConfigPropertyValidator)(properties.functionConfig));
    errors.collect(cdk.propertyValidator('functionMetadata', CfnFunction_FunctionMetadataPropertyValidator)(properties.functionMetadata));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnFunctionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Function` resource
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Function` resource.
 */
// @ts-ignore TS6133
function cfnFunctionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunctionPropsValidator(properties).assertSuccess();
    return {
        FunctionCode: cdk.stringToCloudFormation(properties.functionCode),
        FunctionConfig: cfnFunctionFunctionConfigPropertyToCloudFormation(properties.functionConfig),
        Name: cdk.stringToCloudFormation(properties.name),
        AutoPublish: cdk.booleanToCloudFormation(properties.autoPublish),
        FunctionMetadata: cfnFunctionFunctionMetadataPropertyToCloudFormation(properties.functionMetadata),
    };
}

// @ts-ignore TS6133
function CfnFunctionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionProps>();
    ret.addPropertyResult('functionCode', 'FunctionCode', cfn_parse.FromCloudFormation.getString(properties.FunctionCode));
    ret.addPropertyResult('functionConfig', 'FunctionConfig', CfnFunctionFunctionConfigPropertyFromCloudFormation(properties.FunctionConfig));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('autoPublish', 'AutoPublish', properties.AutoPublish != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoPublish) : undefined);
    ret.addPropertyResult('functionMetadata', 'FunctionMetadata', properties.FunctionMetadata != null ? CfnFunctionFunctionMetadataPropertyFromCloudFormation(properties.FunctionMetadata) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnFunction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::Function";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunction {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFunctionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFunction(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

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
    public readonly attrFunctionArn: string;

    /**
     * The Amazon Resource Name (ARN) of the function. The ARN uniquely identifies the function.
     * @cloudformationAttribute FunctionMetadata.FunctionARN
     */
    public readonly attrFunctionMetadataFunctionArn: string;

    /**
     *
     * @cloudformationAttribute Stage
     */
    public readonly attrStage: string;

    /**
     * The function code. For more information about writing a CloudFront function, see [Writing function code for CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/writing-function-code.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functioncode
     */
    public functionCode: string;

    /**
     * Contains configuration information about a CloudFront function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionconfig
     */
    public functionConfig: CfnFunction.FunctionConfigProperty | cdk.IResolvable;

    /**
     * A name to identify the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-name
     */
    public name: string;

    /**
     * A flag that determines whether to automatically publish the function to the `LIVE` stage when it’s created. To automatically publish to the `LIVE` stage, set this property to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-autopublish
     */
    public autoPublish: boolean | cdk.IResolvable | undefined;

    /**
     * Contains metadata about a CloudFront function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionmetadata
     */
    public functionMetadata: CfnFunction.FunctionMetadataProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::CloudFront::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFunctionProps) {
        super(scope, id, { type: CfnFunction.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'functionCode', this);
        cdk.requireProperty(props, 'functionConfig', this);
        cdk.requireProperty(props, 'name', this);
        this.attrFunctionArn = cdk.Token.asString(this.getAtt('FunctionARN', cdk.ResolutionTypeHint.STRING));
        this.attrFunctionMetadataFunctionArn = cdk.Token.asString(this.getAtt('FunctionMetadata.FunctionARN', cdk.ResolutionTypeHint.STRING));
        this.attrStage = cdk.Token.asString(this.getAtt('Stage', cdk.ResolutionTypeHint.STRING));

        this.functionCode = props.functionCode;
        this.functionConfig = props.functionConfig;
        this.name = props.name;
        this.autoPublish = props.autoPublish;
        this.functionMetadata = props.functionMetadata;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunction.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            functionCode: this.functionCode,
            functionConfig: this.functionConfig,
            name: this.name,
            autoPublish: this.autoPublish,
            functionMetadata: this.functionMetadata,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFunctionPropsToCloudFormation(props);
    }
}

export namespace CfnFunction {
    /**
     * Contains configuration information about a CloudFront function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html
     */
    export interface FunctionConfigProperty {
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

/**
 * Determine whether the given properties match those of a `FunctionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_FunctionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comment', cdk.requiredValidator)(properties.comment));
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('runtime', cdk.requiredValidator)(properties.runtime));
    errors.collect(cdk.propertyValidator('runtime', cdk.validateString)(properties.runtime));
    return errors.wrap('supplied properties not correct for "FunctionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Function.FunctionConfig` resource
 *
 * @param properties - the TypeScript properties of a `FunctionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Function.FunctionConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionFunctionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_FunctionConfigPropertyValidator(properties).assertSuccess();
    return {
        Comment: cdk.stringToCloudFormation(properties.comment),
        Runtime: cdk.stringToCloudFormation(properties.runtime),
    };
}

// @ts-ignore TS6133
function CfnFunctionFunctionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionConfigProperty>();
    ret.addPropertyResult('comment', 'Comment', cfn_parse.FromCloudFormation.getString(properties.Comment));
    ret.addPropertyResult('runtime', 'Runtime', cfn_parse.FromCloudFormation.getString(properties.Runtime));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * Contains metadata about a CloudFront function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionmetadata.html
     */
    export interface FunctionMetadataProperty {
        /**
         * The Amazon Resource Name (ARN) of the function. The ARN uniquely identifies the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionmetadata.html#cfn-cloudfront-function-functionmetadata-functionarn
         */
        readonly functionArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FunctionMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_FunctionMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('functionArn', cdk.validateString)(properties.functionArn));
    return errors.wrap('supplied properties not correct for "FunctionMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::Function.FunctionMetadata` resource
 *
 * @param properties - the TypeScript properties of a `FunctionMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::Function.FunctionMetadata` resource.
 */
// @ts-ignore TS6133
function cfnFunctionFunctionMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_FunctionMetadataPropertyValidator(properties).assertSuccess();
    return {
        FunctionARN: cdk.stringToCloudFormation(properties.functionArn),
    };
}

// @ts-ignore TS6133
function CfnFunctionFunctionMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionMetadataProperty>();
    ret.addPropertyResult('functionArn', 'FunctionARN', properties.FunctionARN != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionARN) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnKeyGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnKeyGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnKeyGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyGroupConfig', cdk.requiredValidator)(properties.keyGroupConfig));
    errors.collect(cdk.propertyValidator('keyGroupConfig', CfnKeyGroup_KeyGroupConfigPropertyValidator)(properties.keyGroupConfig));
    return errors.wrap('supplied properties not correct for "CfnKeyGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::KeyGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnKeyGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::KeyGroup` resource.
 */
// @ts-ignore TS6133
function cfnKeyGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKeyGroupPropsValidator(properties).assertSuccess();
    return {
        KeyGroupConfig: cfnKeyGroupKeyGroupConfigPropertyToCloudFormation(properties.keyGroupConfig),
    };
}

// @ts-ignore TS6133
function CfnKeyGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKeyGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyGroupProps>();
    ret.addPropertyResult('keyGroupConfig', 'KeyGroupConfig', CfnKeyGroupKeyGroupConfigPropertyFromCloudFormation(properties.KeyGroupConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnKeyGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::KeyGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnKeyGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnKeyGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnKeyGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The identifier for the key group.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The date and time when the key group was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: string;

    /**
     * The key group configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html#cfn-cloudfront-keygroup-keygroupconfig
     */
    public keyGroupConfig: CfnKeyGroup.KeyGroupConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::KeyGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnKeyGroupProps) {
        super(scope, id, { type: CfnKeyGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'keyGroupConfig', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLastModifiedTime = cdk.Token.asString(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.STRING));

        this.keyGroupConfig = props.keyGroupConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnKeyGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            keyGroupConfig: this.keyGroupConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnKeyGroupPropsToCloudFormation(props);
    }
}

export namespace CfnKeyGroup {
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
    export interface KeyGroupConfigProperty {
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
 * Determine whether the given properties match those of a `KeyGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KeyGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnKeyGroup_KeyGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(cdk.validateString))(properties.items));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "KeyGroupConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::KeyGroup.KeyGroupConfig` resource
 *
 * @param properties - the TypeScript properties of a `KeyGroupConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::KeyGroup.KeyGroupConfig` resource.
 */
// @ts-ignore TS6133
function cfnKeyGroupKeyGroupConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKeyGroup_KeyGroupConfigPropertyValidator(properties).assertSuccess();
    return {
        Comment: cdk.stringToCloudFormation(properties.comment),
        Items: cdk.listMapper(cdk.stringToCloudFormation)(properties.items),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnKeyGroupKeyGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKeyGroup.KeyGroupConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyGroup.KeyGroupConfigProperty>();
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getStringArray(properties.Items));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnMonitoringSubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnMonitoringSubscriptionProps`
 *
 * @returns the result of the validation.
 */
function CfnMonitoringSubscriptionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('distributionId', cdk.requiredValidator)(properties.distributionId));
    errors.collect(cdk.propertyValidator('distributionId', cdk.validateString)(properties.distributionId));
    errors.collect(cdk.propertyValidator('monitoringSubscription', cdk.requiredValidator)(properties.monitoringSubscription));
    errors.collect(cdk.propertyValidator('monitoringSubscription', CfnMonitoringSubscription_MonitoringSubscriptionPropertyValidator)(properties.monitoringSubscription));
    return errors.wrap('supplied properties not correct for "CfnMonitoringSubscriptionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::MonitoringSubscription` resource
 *
 * @param properties - the TypeScript properties of a `CfnMonitoringSubscriptionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::MonitoringSubscription` resource.
 */
// @ts-ignore TS6133
function cfnMonitoringSubscriptionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMonitoringSubscriptionPropsValidator(properties).assertSuccess();
    return {
        DistributionId: cdk.stringToCloudFormation(properties.distributionId),
        MonitoringSubscription: cfnMonitoringSubscriptionMonitoringSubscriptionPropertyToCloudFormation(properties.monitoringSubscription),
    };
}

// @ts-ignore TS6133
function CfnMonitoringSubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMonitoringSubscriptionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitoringSubscriptionProps>();
    ret.addPropertyResult('distributionId', 'DistributionId', cfn_parse.FromCloudFormation.getString(properties.DistributionId));
    ret.addPropertyResult('monitoringSubscription', 'MonitoringSubscription', CfnMonitoringSubscriptionMonitoringSubscriptionPropertyFromCloudFormation(properties.MonitoringSubscription));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnMonitoringSubscription extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::MonitoringSubscription";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMonitoringSubscription {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMonitoringSubscriptionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMonitoringSubscription(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the distribution that you are enabling metrics for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-distributionid
     */
    public distributionId: string;

    /**
     * A subscription configuration for additional CloudWatch metrics.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-monitoringsubscription
     */
    public monitoringSubscription: CfnMonitoringSubscription.MonitoringSubscriptionProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::MonitoringSubscription`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMonitoringSubscriptionProps) {
        super(scope, id, { type: CfnMonitoringSubscription.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'distributionId', this);
        cdk.requireProperty(props, 'monitoringSubscription', this);

        this.distributionId = props.distributionId;
        this.monitoringSubscription = props.monitoringSubscription;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMonitoringSubscription.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            distributionId: this.distributionId,
            monitoringSubscription: this.monitoringSubscription,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMonitoringSubscriptionPropsToCloudFormation(props);
    }
}

export namespace CfnMonitoringSubscription {
    /**
     * A monitoring subscription. This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-monitoringsubscription.html
     */
    export interface MonitoringSubscriptionProperty {
        /**
         * A subscription configuration for additional CloudWatch metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-monitoringsubscription-realtimemetricssubscriptionconfig
         */
        readonly realtimeMetricsSubscriptionConfig?: CfnMonitoringSubscription.RealtimeMetricsSubscriptionConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MonitoringSubscriptionProperty`
 *
 * @param properties - the TypeScript properties of a `MonitoringSubscriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnMonitoringSubscription_MonitoringSubscriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('realtimeMetricsSubscriptionConfig', CfnMonitoringSubscription_RealtimeMetricsSubscriptionConfigPropertyValidator)(properties.realtimeMetricsSubscriptionConfig));
    return errors.wrap('supplied properties not correct for "MonitoringSubscriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::MonitoringSubscription.MonitoringSubscription` resource
 *
 * @param properties - the TypeScript properties of a `MonitoringSubscriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::MonitoringSubscription.MonitoringSubscription` resource.
 */
// @ts-ignore TS6133
function cfnMonitoringSubscriptionMonitoringSubscriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMonitoringSubscription_MonitoringSubscriptionPropertyValidator(properties).assertSuccess();
    return {
        RealtimeMetricsSubscriptionConfig: cfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyToCloudFormation(properties.realtimeMetricsSubscriptionConfig),
    };
}

// @ts-ignore TS6133
function CfnMonitoringSubscriptionMonitoringSubscriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMonitoringSubscription.MonitoringSubscriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitoringSubscription.MonitoringSubscriptionProperty>();
    ret.addPropertyResult('realtimeMetricsSubscriptionConfig', 'RealtimeMetricsSubscriptionConfig', properties.RealtimeMetricsSubscriptionConfig != null ? CfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyFromCloudFormation(properties.RealtimeMetricsSubscriptionConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMonitoringSubscription {
    /**
     * A subscription configuration for additional CloudWatch metrics.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig.html
     */
    export interface RealtimeMetricsSubscriptionConfigProperty {
        /**
         * A flag that indicates whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig.html#cfn-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig-realtimemetricssubscriptionstatus
         */
        readonly realtimeMetricsSubscriptionStatus: string;
    }
}

/**
 * Determine whether the given properties match those of a `RealtimeMetricsSubscriptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RealtimeMetricsSubscriptionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnMonitoringSubscription_RealtimeMetricsSubscriptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('realtimeMetricsSubscriptionStatus', cdk.requiredValidator)(properties.realtimeMetricsSubscriptionStatus));
    errors.collect(cdk.propertyValidator('realtimeMetricsSubscriptionStatus', cdk.validateString)(properties.realtimeMetricsSubscriptionStatus));
    return errors.wrap('supplied properties not correct for "RealtimeMetricsSubscriptionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::MonitoringSubscription.RealtimeMetricsSubscriptionConfig` resource
 *
 * @param properties - the TypeScript properties of a `RealtimeMetricsSubscriptionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::MonitoringSubscription.RealtimeMetricsSubscriptionConfig` resource.
 */
// @ts-ignore TS6133
function cfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMonitoringSubscription_RealtimeMetricsSubscriptionConfigPropertyValidator(properties).assertSuccess();
    return {
        RealtimeMetricsSubscriptionStatus: cdk.stringToCloudFormation(properties.realtimeMetricsSubscriptionStatus),
    };
}

// @ts-ignore TS6133
function CfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMonitoringSubscription.RealtimeMetricsSubscriptionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitoringSubscription.RealtimeMetricsSubscriptionConfigProperty>();
    ret.addPropertyResult('realtimeMetricsSubscriptionStatus', 'RealtimeMetricsSubscriptionStatus', cfn_parse.FromCloudFormation.getString(properties.RealtimeMetricsSubscriptionStatus));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnOriginAccessControlProps`
 *
 * @param properties - the TypeScript properties of a `CfnOriginAccessControlProps`
 *
 * @returns the result of the validation.
 */
function CfnOriginAccessControlPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('originAccessControlConfig', cdk.requiredValidator)(properties.originAccessControlConfig));
    errors.collect(cdk.propertyValidator('originAccessControlConfig', CfnOriginAccessControl_OriginAccessControlConfigPropertyValidator)(properties.originAccessControlConfig));
    return errors.wrap('supplied properties not correct for "CfnOriginAccessControlProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::OriginAccessControl` resource
 *
 * @param properties - the TypeScript properties of a `CfnOriginAccessControlProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::OriginAccessControl` resource.
 */
// @ts-ignore TS6133
function cfnOriginAccessControlPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginAccessControlPropsValidator(properties).assertSuccess();
    return {
        OriginAccessControlConfig: cfnOriginAccessControlOriginAccessControlConfigPropertyToCloudFormation(properties.originAccessControlConfig),
    };
}

// @ts-ignore TS6133
function CfnOriginAccessControlPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginAccessControlProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginAccessControlProps>();
    ret.addPropertyResult('originAccessControlConfig', 'OriginAccessControlConfig', CfnOriginAccessControlOriginAccessControlConfigPropertyFromCloudFormation(properties.OriginAccessControlConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CloudFront::OriginAccessControl`
 *
 * Creates a new origin access control in CloudFront. After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
 *
 * For an Amazon S3 origin, this makes it possible to block public access to the Amazon S3 bucket so that viewers (users) can access the content in the bucket only through CloudFront.
 *
 * For more information about using a CloudFront origin access control, see [Restricting access to an Amazon S3 origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::OriginAccessControl
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export class CfnOriginAccessControl extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::OriginAccessControl";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginAccessControl {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnOriginAccessControlPropsFromCloudFormation(resourceProperties);
        const ret = new CfnOriginAccessControl(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier of the origin access control.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The origin access control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig
     */
    public originAccessControlConfig: CfnOriginAccessControl.OriginAccessControlConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::OriginAccessControl`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOriginAccessControlProps) {
        super(scope, id, { type: CfnOriginAccessControl.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'originAccessControlConfig', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.originAccessControlConfig = props.originAccessControlConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnOriginAccessControl.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            originAccessControlConfig: this.originAccessControlConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnOriginAccessControlPropsToCloudFormation(props);
    }
}

export namespace CfnOriginAccessControl {
    /**
     * Creates a new origin access control in CloudFront. After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
     *
     * For an Amazon S3 origin, this makes it possible to block public access to the Amazon S3 bucket so that viewers (users) can access the content in the bucket only through CloudFront.
     *
     * For more information about using a CloudFront origin access control, see [Restricting access to an Amazon S3 origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html
     */
    export interface OriginAccessControlConfigProperty {
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
         * The type of origin that this origin access control is for. The only valid value is `s3` .
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
 * Determine whether the given properties match those of a `OriginAccessControlConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OriginAccessControlConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginAccessControl_OriginAccessControlConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('originAccessControlOriginType', cdk.requiredValidator)(properties.originAccessControlOriginType));
    errors.collect(cdk.propertyValidator('originAccessControlOriginType', cdk.validateString)(properties.originAccessControlOriginType));
    errors.collect(cdk.propertyValidator('signingBehavior', cdk.requiredValidator)(properties.signingBehavior));
    errors.collect(cdk.propertyValidator('signingBehavior', cdk.validateString)(properties.signingBehavior));
    errors.collect(cdk.propertyValidator('signingProtocol', cdk.requiredValidator)(properties.signingProtocol));
    errors.collect(cdk.propertyValidator('signingProtocol', cdk.validateString)(properties.signingProtocol));
    return errors.wrap('supplied properties not correct for "OriginAccessControlConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::OriginAccessControl.OriginAccessControlConfig` resource
 *
 * @param properties - the TypeScript properties of a `OriginAccessControlConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::OriginAccessControl.OriginAccessControlConfig` resource.
 */
// @ts-ignore TS6133
function cfnOriginAccessControlOriginAccessControlConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginAccessControl_OriginAccessControlConfigPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        OriginAccessControlOriginType: cdk.stringToCloudFormation(properties.originAccessControlOriginType),
        SigningBehavior: cdk.stringToCloudFormation(properties.signingBehavior),
        SigningProtocol: cdk.stringToCloudFormation(properties.signingProtocol),
    };
}

// @ts-ignore TS6133
function CfnOriginAccessControlOriginAccessControlConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginAccessControl.OriginAccessControlConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginAccessControl.OriginAccessControlConfigProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('originAccessControlOriginType', 'OriginAccessControlOriginType', cfn_parse.FromCloudFormation.getString(properties.OriginAccessControlOriginType));
    ret.addPropertyResult('signingBehavior', 'SigningBehavior', cfn_parse.FromCloudFormation.getString(properties.SigningBehavior));
    ret.addPropertyResult('signingProtocol', 'SigningProtocol', cfn_parse.FromCloudFormation.getString(properties.SigningProtocol));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnOriginRequestPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnOriginRequestPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnOriginRequestPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('originRequestPolicyConfig', cdk.requiredValidator)(properties.originRequestPolicyConfig));
    errors.collect(cdk.propertyValidator('originRequestPolicyConfig', CfnOriginRequestPolicy_OriginRequestPolicyConfigPropertyValidator)(properties.originRequestPolicyConfig));
    return errors.wrap('supplied properties not correct for "CfnOriginRequestPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnOriginRequestPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy` resource.
 */
// @ts-ignore TS6133
function cfnOriginRequestPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginRequestPolicyPropsValidator(properties).assertSuccess();
    return {
        OriginRequestPolicyConfig: cfnOriginRequestPolicyOriginRequestPolicyConfigPropertyToCloudFormation(properties.originRequestPolicyConfig),
    };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicyProps>();
    ret.addPropertyResult('originRequestPolicyConfig', 'OriginRequestPolicyConfig', CfnOriginRequestPolicyOriginRequestPolicyConfigPropertyFromCloudFormation(properties.OriginRequestPolicyConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnOriginRequestPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::OriginRequestPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginRequestPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnOriginRequestPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnOriginRequestPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the origin request policy. For example: `befd7079-9bbc-4ebf-8ade-498a3694176c` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The date and time when the origin request policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: string;

    /**
     * The origin request policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig
     */
    public originRequestPolicyConfig: CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::OriginRequestPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOriginRequestPolicyProps) {
        super(scope, id, { type: CfnOriginRequestPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'originRequestPolicyConfig', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLastModifiedTime = cdk.Token.asString(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.STRING));

        this.originRequestPolicyConfig = props.originRequestPolicyConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnOriginRequestPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            originRequestPolicyConfig: this.originRequestPolicyConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnOriginRequestPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnOriginRequestPolicy {
    /**
     * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-cookiesconfig.html
     */
    export interface CookiesConfigProperty {
        /**
         * Determines whether cookies in viewer requests are included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – Cookies in viewer requests are not included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any cookies that are listed in a `CachePolicy` *are* included in origin requests.
         * - `whitelist` – The cookies in viewer requests that are listed in the `CookieNames` type are included in requests that CloudFront sends to the origin.
         * - `all` – All cookies in viewer requests are included in requests that CloudFront sends to the origin.
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

/**
 * Determine whether the given properties match those of a `CookiesConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginRequestPolicy_CookiesConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cookieBehavior', cdk.requiredValidator)(properties.cookieBehavior));
    errors.collect(cdk.propertyValidator('cookieBehavior', cdk.validateString)(properties.cookieBehavior));
    errors.collect(cdk.propertyValidator('cookies', cdk.listValidator(cdk.validateString))(properties.cookies));
    return errors.wrap('supplied properties not correct for "CookiesConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.CookiesConfig` resource
 *
 * @param properties - the TypeScript properties of a `CookiesConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.CookiesConfig` resource.
 */
// @ts-ignore TS6133
function cfnOriginRequestPolicyCookiesConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginRequestPolicy_CookiesConfigPropertyValidator(properties).assertSuccess();
    return {
        CookieBehavior: cdk.stringToCloudFormation(properties.cookieBehavior),
        Cookies: cdk.listMapper(cdk.stringToCloudFormation)(properties.cookies),
    };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyCookiesConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicy.CookiesConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.CookiesConfigProperty>();
    ret.addPropertyResult('cookieBehavior', 'CookieBehavior', cfn_parse.FromCloudFormation.getString(properties.CookieBehavior));
    ret.addPropertyResult('cookies', 'Cookies', properties.Cookies != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Cookies) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginRequestPolicy {
    /**
     * An object that determines whether any HTTP headers (and if so, which headers) are included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-headersconfig.html
     */
    export interface HeadersConfigProperty {
        /**
         * Determines whether any HTTP headers are included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – HTTP headers are not included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any headers that are listed in a `CachePolicy` *are* included in origin requests.
         * - `whitelist` – The HTTP headers that are listed in the `Headers` type are included in requests that CloudFront sends to the origin.
         * - `allViewer` – All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin.
         * - `allViewerAndWhitelistCloudFront` – All HTTP headers in viewer requests and the additional CloudFront headers that are listed in the `Headers` type are included in requests that CloudFront sends to the origin. The additional headers are added by CloudFront.
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

/**
 * Determine whether the given properties match those of a `HeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginRequestPolicy_HeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headerBehavior', cdk.requiredValidator)(properties.headerBehavior));
    errors.collect(cdk.propertyValidator('headerBehavior', cdk.validateString)(properties.headerBehavior));
    errors.collect(cdk.propertyValidator('headers', cdk.listValidator(cdk.validateString))(properties.headers));
    return errors.wrap('supplied properties not correct for "HeadersConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.HeadersConfig` resource
 *
 * @param properties - the TypeScript properties of a `HeadersConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.HeadersConfig` resource.
 */
// @ts-ignore TS6133
function cfnOriginRequestPolicyHeadersConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginRequestPolicy_HeadersConfigPropertyValidator(properties).assertSuccess();
    return {
        HeaderBehavior: cdk.stringToCloudFormation(properties.headerBehavior),
        Headers: cdk.listMapper(cdk.stringToCloudFormation)(properties.headers),
    };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicy.HeadersConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.HeadersConfigProperty>();
    ret.addPropertyResult('headerBehavior', 'HeaderBehavior', cfn_parse.FromCloudFormation.getString(properties.HeaderBehavior));
    ret.addPropertyResult('headers', 'Headers', properties.Headers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Headers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginRequestPolicy {
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
    export interface OriginRequestPolicyConfigProperty {
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

/**
 * Determine whether the given properties match those of a `OriginRequestPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OriginRequestPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginRequestPolicy_OriginRequestPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('cookiesConfig', cdk.requiredValidator)(properties.cookiesConfig));
    errors.collect(cdk.propertyValidator('cookiesConfig', CfnOriginRequestPolicy_CookiesConfigPropertyValidator)(properties.cookiesConfig));
    errors.collect(cdk.propertyValidator('headersConfig', cdk.requiredValidator)(properties.headersConfig));
    errors.collect(cdk.propertyValidator('headersConfig', CfnOriginRequestPolicy_HeadersConfigPropertyValidator)(properties.headersConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('queryStringsConfig', cdk.requiredValidator)(properties.queryStringsConfig));
    errors.collect(cdk.propertyValidator('queryStringsConfig', CfnOriginRequestPolicy_QueryStringsConfigPropertyValidator)(properties.queryStringsConfig));
    return errors.wrap('supplied properties not correct for "OriginRequestPolicyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.OriginRequestPolicyConfig` resource
 *
 * @param properties - the TypeScript properties of a `OriginRequestPolicyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.OriginRequestPolicyConfig` resource.
 */
// @ts-ignore TS6133
function cfnOriginRequestPolicyOriginRequestPolicyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginRequestPolicy_OriginRequestPolicyConfigPropertyValidator(properties).assertSuccess();
    return {
        Comment: cdk.stringToCloudFormation(properties.comment),
        CookiesConfig: cfnOriginRequestPolicyCookiesConfigPropertyToCloudFormation(properties.cookiesConfig),
        HeadersConfig: cfnOriginRequestPolicyHeadersConfigPropertyToCloudFormation(properties.headersConfig),
        Name: cdk.stringToCloudFormation(properties.name),
        QueryStringsConfig: cfnOriginRequestPolicyQueryStringsConfigPropertyToCloudFormation(properties.queryStringsConfig),
    };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyOriginRequestPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty>();
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('cookiesConfig', 'CookiesConfig', CfnOriginRequestPolicyCookiesConfigPropertyFromCloudFormation(properties.CookiesConfig));
    ret.addPropertyResult('headersConfig', 'HeadersConfig', CfnOriginRequestPolicyHeadersConfigPropertyFromCloudFormation(properties.HeadersConfig));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('queryStringsConfig', 'QueryStringsConfig', CfnOriginRequestPolicyQueryStringsConfigPropertyFromCloudFormation(properties.QueryStringsConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginRequestPolicy {
    /**
     * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in requests that CloudFront sends to the origin.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-querystringsconfig.html
     */
    export interface QueryStringsConfigProperty {
        /**
         * Determines whether any URL query strings in viewer requests are included in requests that CloudFront sends to the origin. Valid values are:
         *
         * - `none` – Query strings in viewer requests are not included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any query strings that are listed in a `CachePolicy` *are* included in origin requests.
         * - `whitelist` – The query strings in viewer requests that are listed in the `QueryStringNames` type are included in requests that CloudFront sends to the origin.
         * - `all` – All query strings in viewer requests are included in requests that CloudFront sends to the origin.
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
 * Determine whether the given properties match those of a `QueryStringsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringsConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginRequestPolicy_QueryStringsConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('queryStringBehavior', cdk.requiredValidator)(properties.queryStringBehavior));
    errors.collect(cdk.propertyValidator('queryStringBehavior', cdk.validateString)(properties.queryStringBehavior));
    errors.collect(cdk.propertyValidator('queryStrings', cdk.listValidator(cdk.validateString))(properties.queryStrings));
    return errors.wrap('supplied properties not correct for "QueryStringsConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.QueryStringsConfig` resource
 *
 * @param properties - the TypeScript properties of a `QueryStringsConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::OriginRequestPolicy.QueryStringsConfig` resource.
 */
// @ts-ignore TS6133
function cfnOriginRequestPolicyQueryStringsConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginRequestPolicy_QueryStringsConfigPropertyValidator(properties).assertSuccess();
    return {
        QueryStringBehavior: cdk.stringToCloudFormation(properties.queryStringBehavior),
        QueryStrings: cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStrings),
    };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyQueryStringsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicy.QueryStringsConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.QueryStringsConfigProperty>();
    ret.addPropertyResult('queryStringBehavior', 'QueryStringBehavior', cfn_parse.FromCloudFormation.getString(properties.QueryStringBehavior));
    ret.addPropertyResult('queryStrings', 'QueryStrings', properties.QueryStrings != null ? cfn_parse.FromCloudFormation.getStringArray(properties.QueryStrings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnPublicKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnPublicKeyProps`
 *
 * @returns the result of the validation.
 */
function CfnPublicKeyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('publicKeyConfig', cdk.requiredValidator)(properties.publicKeyConfig));
    errors.collect(cdk.propertyValidator('publicKeyConfig', CfnPublicKey_PublicKeyConfigPropertyValidator)(properties.publicKeyConfig));
    return errors.wrap('supplied properties not correct for "CfnPublicKeyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::PublicKey` resource
 *
 * @param properties - the TypeScript properties of a `CfnPublicKeyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::PublicKey` resource.
 */
// @ts-ignore TS6133
function cfnPublicKeyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPublicKeyPropsValidator(properties).assertSuccess();
    return {
        PublicKeyConfig: cfnPublicKeyPublicKeyConfigPropertyToCloudFormation(properties.publicKeyConfig),
    };
}

// @ts-ignore TS6133
function CfnPublicKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublicKeyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicKeyProps>();
    ret.addPropertyResult('publicKeyConfig', 'PublicKeyConfig', CfnPublicKeyPublicKeyConfigPropertyFromCloudFormation(properties.PublicKeyConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnPublicKey extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::PublicKey";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublicKey {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPublicKeyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPublicKey(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The date and time when the public key was uploaded.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The identifier of the public key.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html#cfn-cloudfront-publickey-publickeyconfig
     */
    public publicKeyConfig: CfnPublicKey.PublicKeyConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::PublicKey`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPublicKeyProps) {
        super(scope, id, { type: CfnPublicKey.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'publicKeyConfig', this);
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.publicKeyConfig = props.publicKeyConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPublicKey.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            publicKeyConfig: this.publicKeyConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPublicKeyPropsToCloudFormation(props);
    }
}

export namespace CfnPublicKey {
    /**
     * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html
     */
    export interface PublicKeyConfigProperty {
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
 * Determine whether the given properties match those of a `PublicKeyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PublicKeyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnPublicKey_PublicKeyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('callerReference', cdk.requiredValidator)(properties.callerReference));
    errors.collect(cdk.propertyValidator('callerReference', cdk.validateString)(properties.callerReference));
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('encodedKey', cdk.requiredValidator)(properties.encodedKey));
    errors.collect(cdk.propertyValidator('encodedKey', cdk.validateString)(properties.encodedKey));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "PublicKeyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::PublicKey.PublicKeyConfig` resource
 *
 * @param properties - the TypeScript properties of a `PublicKeyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::PublicKey.PublicKeyConfig` resource.
 */
// @ts-ignore TS6133
function cfnPublicKeyPublicKeyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPublicKey_PublicKeyConfigPropertyValidator(properties).assertSuccess();
    return {
        CallerReference: cdk.stringToCloudFormation(properties.callerReference),
        Comment: cdk.stringToCloudFormation(properties.comment),
        EncodedKey: cdk.stringToCloudFormation(properties.encodedKey),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPublicKeyPublicKeyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublicKey.PublicKeyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicKey.PublicKeyConfigProperty>();
    ret.addPropertyResult('callerReference', 'CallerReference', cfn_parse.FromCloudFormation.getString(properties.CallerReference));
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('encodedKey', 'EncodedKey', cfn_parse.FromCloudFormation.getString(properties.EncodedKey));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnRealtimeLogConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnRealtimeLogConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnRealtimeLogConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endPoints', cdk.requiredValidator)(properties.endPoints));
    errors.collect(cdk.propertyValidator('endPoints', cdk.listValidator(CfnRealtimeLogConfig_EndPointPropertyValidator))(properties.endPoints));
    errors.collect(cdk.propertyValidator('fields', cdk.requiredValidator)(properties.fields));
    errors.collect(cdk.propertyValidator('fields', cdk.listValidator(cdk.validateString))(properties.fields));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('samplingRate', cdk.requiredValidator)(properties.samplingRate));
    errors.collect(cdk.propertyValidator('samplingRate', cdk.validateNumber)(properties.samplingRate));
    return errors.wrap('supplied properties not correct for "CfnRealtimeLogConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::RealtimeLogConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnRealtimeLogConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::RealtimeLogConfig` resource.
 */
// @ts-ignore TS6133
function cfnRealtimeLogConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRealtimeLogConfigPropsValidator(properties).assertSuccess();
    return {
        EndPoints: cdk.listMapper(cfnRealtimeLogConfigEndPointPropertyToCloudFormation)(properties.endPoints),
        Fields: cdk.listMapper(cdk.stringToCloudFormation)(properties.fields),
        Name: cdk.stringToCloudFormation(properties.name),
        SamplingRate: cdk.numberToCloudFormation(properties.samplingRate),
    };
}

// @ts-ignore TS6133
function CfnRealtimeLogConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRealtimeLogConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRealtimeLogConfigProps>();
    ret.addPropertyResult('endPoints', 'EndPoints', cfn_parse.FromCloudFormation.getArray(CfnRealtimeLogConfigEndPointPropertyFromCloudFormation)(properties.EndPoints));
    ret.addPropertyResult('fields', 'Fields', cfn_parse.FromCloudFormation.getStringArray(properties.Fields));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('samplingRate', 'SamplingRate', cfn_parse.FromCloudFormation.getNumber(properties.SamplingRate));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnRealtimeLogConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::RealtimeLogConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRealtimeLogConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRealtimeLogConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRealtimeLogConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration. For example: `arn:aws:cloudfront::111122223333:realtime-log-config/ExampleNameForRealtimeLogConfig` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data for this real-time log configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-endpoints
     */
    public endPoints: Array<CfnRealtimeLogConfig.EndPointProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of fields that are included in each real-time log record. In an API response, the fields are provided in the same order in which they are sent to the Amazon Kinesis data stream.
     *
     * For more information about fields, see [Real-time log configuration fields](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html#understand-real-time-log-config-fields) in the *Amazon CloudFront Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-fields
     */
    public fields: string[];

    /**
     * The unique name of this real-time log configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-name
     */
    public name: string;

    /**
     * The sampling rate for this real-time log configuration. The sampling rate determines the percentage of viewer requests that are represented in the real-time log data. The sampling rate is an integer between 1 and 100, inclusive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-samplingrate
     */
    public samplingRate: number;

    /**
     * Create a new `AWS::CloudFront::RealtimeLogConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRealtimeLogConfigProps) {
        super(scope, id, { type: CfnRealtimeLogConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'endPoints', this);
        cdk.requireProperty(props, 'fields', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'samplingRate', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.endPoints = props.endPoints;
        this.fields = props.fields;
        this.name = props.name;
        this.samplingRate = props.samplingRate;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRealtimeLogConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            endPoints: this.endPoints,
            fields: this.fields,
            name: this.name,
            samplingRate: this.samplingRate,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRealtimeLogConfigPropsToCloudFormation(props);
    }
}

export namespace CfnRealtimeLogConfig {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data in a real-time log configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-endpoint.html
     */
    export interface EndPointProperty {
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

/**
 * Determine whether the given properties match those of a `EndPointProperty`
 *
 * @param properties - the TypeScript properties of a `EndPointProperty`
 *
 * @returns the result of the validation.
 */
function CfnRealtimeLogConfig_EndPointPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kinesisStreamConfig', cdk.requiredValidator)(properties.kinesisStreamConfig));
    errors.collect(cdk.propertyValidator('kinesisStreamConfig', CfnRealtimeLogConfig_KinesisStreamConfigPropertyValidator)(properties.kinesisStreamConfig));
    errors.collect(cdk.propertyValidator('streamType', cdk.requiredValidator)(properties.streamType));
    errors.collect(cdk.propertyValidator('streamType', cdk.validateString)(properties.streamType));
    return errors.wrap('supplied properties not correct for "EndPointProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::RealtimeLogConfig.EndPoint` resource
 *
 * @param properties - the TypeScript properties of a `EndPointProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::RealtimeLogConfig.EndPoint` resource.
 */
// @ts-ignore TS6133
function cfnRealtimeLogConfigEndPointPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRealtimeLogConfig_EndPointPropertyValidator(properties).assertSuccess();
    return {
        KinesisStreamConfig: cfnRealtimeLogConfigKinesisStreamConfigPropertyToCloudFormation(properties.kinesisStreamConfig),
        StreamType: cdk.stringToCloudFormation(properties.streamType),
    };
}

// @ts-ignore TS6133
function CfnRealtimeLogConfigEndPointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRealtimeLogConfig.EndPointProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRealtimeLogConfig.EndPointProperty>();
    ret.addPropertyResult('kinesisStreamConfig', 'KinesisStreamConfig', CfnRealtimeLogConfigKinesisStreamConfigPropertyFromCloudFormation(properties.KinesisStreamConfig));
    ret.addPropertyResult('streamType', 'StreamType', cfn_parse.FromCloudFormation.getString(properties.StreamType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRealtimeLogConfig {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-kinesisstreamconfig.html
     */
    export interface KinesisStreamConfigProperty {
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
 * Determine whether the given properties match those of a `KinesisStreamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnRealtimeLogConfig_KinesisStreamConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('streamArn', cdk.requiredValidator)(properties.streamArn));
    errors.collect(cdk.propertyValidator('streamArn', cdk.validateString)(properties.streamArn));
    return errors.wrap('supplied properties not correct for "KinesisStreamConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::RealtimeLogConfig.KinesisStreamConfig` resource
 *
 * @param properties - the TypeScript properties of a `KinesisStreamConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::RealtimeLogConfig.KinesisStreamConfig` resource.
 */
// @ts-ignore TS6133
function cfnRealtimeLogConfigKinesisStreamConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRealtimeLogConfig_KinesisStreamConfigPropertyValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        StreamArn: cdk.stringToCloudFormation(properties.streamArn),
    };
}

// @ts-ignore TS6133
function CfnRealtimeLogConfigKinesisStreamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRealtimeLogConfig.KinesisStreamConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRealtimeLogConfig.KinesisStreamConfigProperty>();
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('streamArn', 'StreamArn', cfn_parse.FromCloudFormation.getString(properties.StreamArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnResponseHeadersPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResponseHeadersPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('responseHeadersPolicyConfig', cdk.requiredValidator)(properties.responseHeadersPolicyConfig));
    errors.collect(cdk.propertyValidator('responseHeadersPolicyConfig', CfnResponseHeadersPolicy_ResponseHeadersPolicyConfigPropertyValidator)(properties.responseHeadersPolicyConfig));
    return errors.wrap('supplied properties not correct for "CfnResponseHeadersPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnResponseHeadersPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicyPropsValidator(properties).assertSuccess();
    return {
        ResponseHeadersPolicyConfig: cfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyToCloudFormation(properties.responseHeadersPolicyConfig),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicyProps>();
    ret.addPropertyResult('responseHeadersPolicyConfig', 'ResponseHeadersPolicyConfig', CfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyFromCloudFormation(properties.ResponseHeadersPolicyConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnResponseHeadersPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::ResponseHeadersPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResponseHeadersPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResponseHeadersPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResponseHeadersPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the response headers policy. For example: `57f99797-3b20-4e1b-a728-27972a74082a` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The date and time when the response headers policy was last modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: string;

    /**
     * A response headers policy configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig
     */
    public responseHeadersPolicyConfig: CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::CloudFront::ResponseHeadersPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResponseHeadersPolicyProps) {
        super(scope, id, { type: CfnResponseHeadersPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'responseHeadersPolicyConfig', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLastModifiedTime = cdk.Token.asString(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.STRING));

        this.responseHeadersPolicyConfig = props.responseHeadersPolicyConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResponseHeadersPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            responseHeadersPolicyConfig: this.responseHeadersPolicyConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResponseHeadersPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnResponseHeadersPolicy {
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
    export interface AccessControlAllowHeadersProperty {
        /**
         * The list of HTTP header names. You can specify `*` to allow all headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowheaders.html#cfn-cloudfront-responseheaderspolicy-accesscontrolallowheaders-items
         */
        readonly items: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AccessControlAllowHeadersProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowHeadersProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_AccessControlAllowHeadersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(cdk.validateString))(properties.items));
    return errors.wrap('supplied properties not correct for "AccessControlAllowHeadersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlAllowHeaders` resource
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowHeadersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlAllowHeaders` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyAccessControlAllowHeadersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_AccessControlAllowHeadersPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cdk.stringToCloudFormation)(properties.items),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlAllowHeadersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlAllowHeadersProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getStringArray(properties.Items));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface AccessControlAllowMethodsProperty {
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

/**
 * Determine whether the given properties match those of a `AccessControlAllowMethodsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowMethodsProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_AccessControlAllowMethodsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(cdk.validateString))(properties.items));
    return errors.wrap('supplied properties not correct for "AccessControlAllowMethodsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlAllowMethods` resource
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowMethodsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlAllowMethods` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyAccessControlAllowMethodsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_AccessControlAllowMethodsPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cdk.stringToCloudFormation)(properties.items),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowMethodsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlAllowMethodsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlAllowMethodsProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getStringArray(properties.Items));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface AccessControlAllowOriginsProperty {
        /**
         * The list of origins (domain names). You can specify `*` to allow all origins.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolalloworigins.html#cfn-cloudfront-responseheaderspolicy-accesscontrolalloworigins-items
         */
        readonly items: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AccessControlAllowOriginsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowOriginsProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_AccessControlAllowOriginsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(cdk.validateString))(properties.items));
    return errors.wrap('supplied properties not correct for "AccessControlAllowOriginsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlAllowOrigins` resource
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowOriginsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlAllowOrigins` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyAccessControlAllowOriginsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_AccessControlAllowOriginsPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cdk.stringToCloudFormation)(properties.items),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowOriginsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlAllowOriginsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlAllowOriginsProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getStringArray(properties.Items));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface AccessControlExposeHeadersProperty {
        /**
         * The list of HTTP headers. You can specify `*` to expose all headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolexposeheaders.html#cfn-cloudfront-responseheaderspolicy-accesscontrolexposeheaders-items
         */
        readonly items: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AccessControlExposeHeadersProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlExposeHeadersProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_AccessControlExposeHeadersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(cdk.validateString))(properties.items));
    return errors.wrap('supplied properties not correct for "AccessControlExposeHeadersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlExposeHeaders` resource
 *
 * @param properties - the TypeScript properties of a `AccessControlExposeHeadersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.AccessControlExposeHeaders` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyAccessControlExposeHeadersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_AccessControlExposeHeadersPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cdk.stringToCloudFormation)(properties.items),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlExposeHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlExposeHeadersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlExposeHeadersProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getStringArray(properties.Items));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface ContentSecurityPolicyProperty {
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

/**
 * Determine whether the given properties match those of a `ContentSecurityPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ContentSecurityPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_ContentSecurityPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contentSecurityPolicy', cdk.requiredValidator)(properties.contentSecurityPolicy));
    errors.collect(cdk.propertyValidator('contentSecurityPolicy', cdk.validateString)(properties.contentSecurityPolicy));
    errors.collect(cdk.propertyValidator('override', cdk.requiredValidator)(properties.override));
    errors.collect(cdk.propertyValidator('override', cdk.validateBoolean)(properties.override));
    return errors.wrap('supplied properties not correct for "ContentSecurityPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ContentSecurityPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ContentSecurityPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ContentSecurityPolicy` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyContentSecurityPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_ContentSecurityPolicyPropertyValidator(properties).assertSuccess();
    return {
        ContentSecurityPolicy: cdk.stringToCloudFormation(properties.contentSecurityPolicy),
        Override: cdk.booleanToCloudFormation(properties.override),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyContentSecurityPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.ContentSecurityPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ContentSecurityPolicyProperty>();
    ret.addPropertyResult('contentSecurityPolicy', 'ContentSecurityPolicy', cfn_parse.FromCloudFormation.getString(properties.ContentSecurityPolicy));
    ret.addPropertyResult('override', 'Override', cfn_parse.FromCloudFormation.getBoolean(properties.Override));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface ContentTypeOptionsProperty {
        /**
         * A Boolean that determines whether CloudFront overrides the `X-Content-Type-Options` HTTP response header received from the origin with the one specified in this response headers policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contenttypeoptions.html#cfn-cloudfront-responseheaderspolicy-contenttypeoptions-override
         */
        readonly override: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContentTypeOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ContentTypeOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_ContentTypeOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('override', cdk.requiredValidator)(properties.override));
    errors.collect(cdk.propertyValidator('override', cdk.validateBoolean)(properties.override));
    return errors.wrap('supplied properties not correct for "ContentTypeOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ContentTypeOptions` resource
 *
 * @param properties - the TypeScript properties of a `ContentTypeOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ContentTypeOptions` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyContentTypeOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_ContentTypeOptionsPropertyValidator(properties).assertSuccess();
    return {
        Override: cdk.booleanToCloudFormation(properties.override),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyContentTypeOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.ContentTypeOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ContentTypeOptionsProperty>();
    ret.addPropertyResult('override', 'Override', cfn_parse.FromCloudFormation.getBoolean(properties.Override));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface CorsConfigProperty {
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

/**
 * Determine whether the given properties match those of a `CorsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_CorsConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessControlAllowCredentials', cdk.requiredValidator)(properties.accessControlAllowCredentials));
    errors.collect(cdk.propertyValidator('accessControlAllowCredentials', cdk.validateBoolean)(properties.accessControlAllowCredentials));
    errors.collect(cdk.propertyValidator('accessControlAllowHeaders', cdk.requiredValidator)(properties.accessControlAllowHeaders));
    errors.collect(cdk.propertyValidator('accessControlAllowHeaders', CfnResponseHeadersPolicy_AccessControlAllowHeadersPropertyValidator)(properties.accessControlAllowHeaders));
    errors.collect(cdk.propertyValidator('accessControlAllowMethods', cdk.requiredValidator)(properties.accessControlAllowMethods));
    errors.collect(cdk.propertyValidator('accessControlAllowMethods', CfnResponseHeadersPolicy_AccessControlAllowMethodsPropertyValidator)(properties.accessControlAllowMethods));
    errors.collect(cdk.propertyValidator('accessControlAllowOrigins', cdk.requiredValidator)(properties.accessControlAllowOrigins));
    errors.collect(cdk.propertyValidator('accessControlAllowOrigins', CfnResponseHeadersPolicy_AccessControlAllowOriginsPropertyValidator)(properties.accessControlAllowOrigins));
    errors.collect(cdk.propertyValidator('accessControlExposeHeaders', CfnResponseHeadersPolicy_AccessControlExposeHeadersPropertyValidator)(properties.accessControlExposeHeaders));
    errors.collect(cdk.propertyValidator('accessControlMaxAgeSec', cdk.validateNumber)(properties.accessControlMaxAgeSec));
    errors.collect(cdk.propertyValidator('originOverride', cdk.requiredValidator)(properties.originOverride));
    errors.collect(cdk.propertyValidator('originOverride', cdk.validateBoolean)(properties.originOverride));
    return errors.wrap('supplied properties not correct for "CorsConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.CorsConfig` resource
 *
 * @param properties - the TypeScript properties of a `CorsConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.CorsConfig` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyCorsConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_CorsConfigPropertyValidator(properties).assertSuccess();
    return {
        AccessControlAllowCredentials: cdk.booleanToCloudFormation(properties.accessControlAllowCredentials),
        AccessControlAllowHeaders: cfnResponseHeadersPolicyAccessControlAllowHeadersPropertyToCloudFormation(properties.accessControlAllowHeaders),
        AccessControlAllowMethods: cfnResponseHeadersPolicyAccessControlAllowMethodsPropertyToCloudFormation(properties.accessControlAllowMethods),
        AccessControlAllowOrigins: cfnResponseHeadersPolicyAccessControlAllowOriginsPropertyToCloudFormation(properties.accessControlAllowOrigins),
        AccessControlExposeHeaders: cfnResponseHeadersPolicyAccessControlExposeHeadersPropertyToCloudFormation(properties.accessControlExposeHeaders),
        AccessControlMaxAgeSec: cdk.numberToCloudFormation(properties.accessControlMaxAgeSec),
        OriginOverride: cdk.booleanToCloudFormation(properties.originOverride),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyCorsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.CorsConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.CorsConfigProperty>();
    ret.addPropertyResult('accessControlAllowCredentials', 'AccessControlAllowCredentials', cfn_parse.FromCloudFormation.getBoolean(properties.AccessControlAllowCredentials));
    ret.addPropertyResult('accessControlAllowHeaders', 'AccessControlAllowHeaders', CfnResponseHeadersPolicyAccessControlAllowHeadersPropertyFromCloudFormation(properties.AccessControlAllowHeaders));
    ret.addPropertyResult('accessControlAllowMethods', 'AccessControlAllowMethods', CfnResponseHeadersPolicyAccessControlAllowMethodsPropertyFromCloudFormation(properties.AccessControlAllowMethods));
    ret.addPropertyResult('accessControlAllowOrigins', 'AccessControlAllowOrigins', CfnResponseHeadersPolicyAccessControlAllowOriginsPropertyFromCloudFormation(properties.AccessControlAllowOrigins));
    ret.addPropertyResult('accessControlExposeHeaders', 'AccessControlExposeHeaders', properties.AccessControlExposeHeaders != null ? CfnResponseHeadersPolicyAccessControlExposeHeadersPropertyFromCloudFormation(properties.AccessControlExposeHeaders) : undefined);
    ret.addPropertyResult('accessControlMaxAgeSec', 'AccessControlMaxAgeSec', properties.AccessControlMaxAgeSec != null ? cfn_parse.FromCloudFormation.getNumber(properties.AccessControlMaxAgeSec) : undefined);
    ret.addPropertyResult('originOverride', 'OriginOverride', cfn_parse.FromCloudFormation.getBoolean(properties.OriginOverride));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
    /**
     * An HTTP response header name and its value. CloudFront includes this header in HTTP responses that it sends for requests that match a cache behavior that's associated with this response headers policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html
     */
    export interface CustomHeaderProperty {
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

/**
 * Determine whether the given properties match those of a `CustomHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_CustomHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('header', cdk.requiredValidator)(properties.header));
    errors.collect(cdk.propertyValidator('header', cdk.validateString)(properties.header));
    errors.collect(cdk.propertyValidator('override', cdk.requiredValidator)(properties.override));
    errors.collect(cdk.propertyValidator('override', cdk.validateBoolean)(properties.override));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CustomHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.CustomHeader` resource
 *
 * @param properties - the TypeScript properties of a `CustomHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.CustomHeader` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyCustomHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_CustomHeaderPropertyValidator(properties).assertSuccess();
    return {
        Header: cdk.stringToCloudFormation(properties.header),
        Override: cdk.booleanToCloudFormation(properties.override),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyCustomHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.CustomHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.CustomHeaderProperty>();
    ret.addPropertyResult('header', 'Header', cfn_parse.FromCloudFormation.getString(properties.Header));
    ret.addPropertyResult('override', 'Override', cfn_parse.FromCloudFormation.getBoolean(properties.Override));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
    /**
     * A list of HTTP response header names and their values. CloudFront includes these headers in HTTP responses that it sends for requests that match a cache behavior that's associated with this response headers policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheadersconfig.html
     */
    export interface CustomHeadersConfigProperty {
        /**
         * The list of HTTP response headers and their values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheadersconfig.html#cfn-cloudfront-responseheaderspolicy-customheadersconfig-items
         */
        readonly items: Array<CfnResponseHeadersPolicy.CustomHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CustomHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_CustomHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(CfnResponseHeadersPolicy_CustomHeaderPropertyValidator))(properties.items));
    return errors.wrap('supplied properties not correct for "CustomHeadersConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.CustomHeadersConfig` resource
 *
 * @param properties - the TypeScript properties of a `CustomHeadersConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.CustomHeadersConfig` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyCustomHeadersConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_CustomHeadersConfigPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cfnResponseHeadersPolicyCustomHeaderPropertyToCloudFormation)(properties.items),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyCustomHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.CustomHeadersConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.CustomHeadersConfigProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getArray(CfnResponseHeadersPolicyCustomHeaderPropertyFromCloudFormation)(properties.Items));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface FrameOptionsProperty {
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

/**
 * Determine whether the given properties match those of a `FrameOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_FrameOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('frameOption', cdk.requiredValidator)(properties.frameOption));
    errors.collect(cdk.propertyValidator('frameOption', cdk.validateString)(properties.frameOption));
    errors.collect(cdk.propertyValidator('override', cdk.requiredValidator)(properties.override));
    errors.collect(cdk.propertyValidator('override', cdk.validateBoolean)(properties.override));
    return errors.wrap('supplied properties not correct for "FrameOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.FrameOptions` resource
 *
 * @param properties - the TypeScript properties of a `FrameOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.FrameOptions` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyFrameOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_FrameOptionsPropertyValidator(properties).assertSuccess();
    return {
        FrameOption: cdk.stringToCloudFormation(properties.frameOption),
        Override: cdk.booleanToCloudFormation(properties.override),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyFrameOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.FrameOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.FrameOptionsProperty>();
    ret.addPropertyResult('frameOption', 'FrameOption', cfn_parse.FromCloudFormation.getString(properties.FrameOption));
    ret.addPropertyResult('override', 'Override', cfn_parse.FromCloudFormation.getBoolean(properties.Override));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface ReferrerPolicyProperty {
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

/**
 * Determine whether the given properties match those of a `ReferrerPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ReferrerPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_ReferrerPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('override', cdk.requiredValidator)(properties.override));
    errors.collect(cdk.propertyValidator('override', cdk.validateBoolean)(properties.override));
    errors.collect(cdk.propertyValidator('referrerPolicy', cdk.requiredValidator)(properties.referrerPolicy));
    errors.collect(cdk.propertyValidator('referrerPolicy', cdk.validateString)(properties.referrerPolicy));
    return errors.wrap('supplied properties not correct for "ReferrerPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ReferrerPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ReferrerPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ReferrerPolicy` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyReferrerPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_ReferrerPolicyPropertyValidator(properties).assertSuccess();
    return {
        Override: cdk.booleanToCloudFormation(properties.override),
        ReferrerPolicy: cdk.stringToCloudFormation(properties.referrerPolicy),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyReferrerPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.ReferrerPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ReferrerPolicyProperty>();
    ret.addPropertyResult('override', 'Override', cfn_parse.FromCloudFormation.getBoolean(properties.Override));
    ret.addPropertyResult('referrerPolicy', 'ReferrerPolicy', cfn_parse.FromCloudFormation.getString(properties.ReferrerPolicy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
    /**
     * The name of an HTTP header that CloudFront removes from HTTP responses to requests that match the cache behavior that this response headers policy is attached to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheader.html
     */
    export interface RemoveHeaderProperty {
        /**
         * The HTTP header name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheader.html#cfn-cloudfront-responseheaderspolicy-removeheader-header
         */
        readonly header: string;
    }
}

/**
 * Determine whether the given properties match those of a `RemoveHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `RemoveHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_RemoveHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('header', cdk.requiredValidator)(properties.header));
    errors.collect(cdk.propertyValidator('header', cdk.validateString)(properties.header));
    return errors.wrap('supplied properties not correct for "RemoveHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.RemoveHeader` resource
 *
 * @param properties - the TypeScript properties of a `RemoveHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.RemoveHeader` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyRemoveHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_RemoveHeaderPropertyValidator(properties).assertSuccess();
    return {
        Header: cdk.stringToCloudFormation(properties.header),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyRemoveHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.RemoveHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.RemoveHeaderProperty>();
    ret.addPropertyResult('header', 'Header', cfn_parse.FromCloudFormation.getString(properties.Header));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
    /**
     * A list of HTTP header names that CloudFront removes from HTTP responses to requests that match the cache behavior that this response headers policy is attached to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheadersconfig.html
     */
    export interface RemoveHeadersConfigProperty {
        /**
         * The list of HTTP header names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheadersconfig.html#cfn-cloudfront-responseheaderspolicy-removeheadersconfig-items
         */
        readonly items: Array<CfnResponseHeadersPolicy.RemoveHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RemoveHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RemoveHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_RemoveHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('items', cdk.requiredValidator)(properties.items));
    errors.collect(cdk.propertyValidator('items', cdk.listValidator(CfnResponseHeadersPolicy_RemoveHeaderPropertyValidator))(properties.items));
    return errors.wrap('supplied properties not correct for "RemoveHeadersConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.RemoveHeadersConfig` resource
 *
 * @param properties - the TypeScript properties of a `RemoveHeadersConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.RemoveHeadersConfig` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyRemoveHeadersConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_RemoveHeadersConfigPropertyValidator(properties).assertSuccess();
    return {
        Items: cdk.listMapper(cfnResponseHeadersPolicyRemoveHeaderPropertyToCloudFormation)(properties.items),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyRemoveHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.RemoveHeadersConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.RemoveHeadersConfigProperty>();
    ret.addPropertyResult('items', 'Items', cfn_parse.FromCloudFormation.getArray(CfnResponseHeadersPolicyRemoveHeaderPropertyFromCloudFormation)(properties.Items));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface ResponseHeadersPolicyConfigProperty {
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

/**
 * Determine whether the given properties match those of a `ResponseHeadersPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseHeadersPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_ResponseHeadersPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('corsConfig', CfnResponseHeadersPolicy_CorsConfigPropertyValidator)(properties.corsConfig));
    errors.collect(cdk.propertyValidator('customHeadersConfig', CfnResponseHeadersPolicy_CustomHeadersConfigPropertyValidator)(properties.customHeadersConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('removeHeadersConfig', CfnResponseHeadersPolicy_RemoveHeadersConfigPropertyValidator)(properties.removeHeadersConfig));
    errors.collect(cdk.propertyValidator('securityHeadersConfig', CfnResponseHeadersPolicy_SecurityHeadersConfigPropertyValidator)(properties.securityHeadersConfig));
    errors.collect(cdk.propertyValidator('serverTimingHeadersConfig', CfnResponseHeadersPolicy_ServerTimingHeadersConfigPropertyValidator)(properties.serverTimingHeadersConfig));
    return errors.wrap('supplied properties not correct for "ResponseHeadersPolicyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ResponseHeadersPolicyConfig` resource
 *
 * @param properties - the TypeScript properties of a `ResponseHeadersPolicyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ResponseHeadersPolicyConfig` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_ResponseHeadersPolicyConfigPropertyValidator(properties).assertSuccess();
    return {
        Comment: cdk.stringToCloudFormation(properties.comment),
        CorsConfig: cfnResponseHeadersPolicyCorsConfigPropertyToCloudFormation(properties.corsConfig),
        CustomHeadersConfig: cfnResponseHeadersPolicyCustomHeadersConfigPropertyToCloudFormation(properties.customHeadersConfig),
        Name: cdk.stringToCloudFormation(properties.name),
        RemoveHeadersConfig: cfnResponseHeadersPolicyRemoveHeadersConfigPropertyToCloudFormation(properties.removeHeadersConfig),
        SecurityHeadersConfig: cfnResponseHeadersPolicySecurityHeadersConfigPropertyToCloudFormation(properties.securityHeadersConfig),
        ServerTimingHeadersConfig: cfnResponseHeadersPolicyServerTimingHeadersConfigPropertyToCloudFormation(properties.serverTimingHeadersConfig),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty>();
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('corsConfig', 'CorsConfig', properties.CorsConfig != null ? CfnResponseHeadersPolicyCorsConfigPropertyFromCloudFormation(properties.CorsConfig) : undefined);
    ret.addPropertyResult('customHeadersConfig', 'CustomHeadersConfig', properties.CustomHeadersConfig != null ? CfnResponseHeadersPolicyCustomHeadersConfigPropertyFromCloudFormation(properties.CustomHeadersConfig) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('removeHeadersConfig', 'RemoveHeadersConfig', properties.RemoveHeadersConfig != null ? CfnResponseHeadersPolicyRemoveHeadersConfigPropertyFromCloudFormation(properties.RemoveHeadersConfig) : undefined);
    ret.addPropertyResult('securityHeadersConfig', 'SecurityHeadersConfig', properties.SecurityHeadersConfig != null ? CfnResponseHeadersPolicySecurityHeadersConfigPropertyFromCloudFormation(properties.SecurityHeadersConfig) : undefined);
    ret.addPropertyResult('serverTimingHeadersConfig', 'ServerTimingHeadersConfig', properties.ServerTimingHeadersConfig != null ? CfnResponseHeadersPolicyServerTimingHeadersConfigPropertyFromCloudFormation(properties.ServerTimingHeadersConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
    /**
     * A configuration for a set of security-related HTTP response headers. CloudFront adds these headers to HTTP responses that it sends for requests that match a cache behavior associated with this response headers policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html
     */
    export interface SecurityHeadersConfigProperty {
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

/**
 * Determine whether the given properties match those of a `SecurityHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SecurityHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_SecurityHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contentSecurityPolicy', CfnResponseHeadersPolicy_ContentSecurityPolicyPropertyValidator)(properties.contentSecurityPolicy));
    errors.collect(cdk.propertyValidator('contentTypeOptions', CfnResponseHeadersPolicy_ContentTypeOptionsPropertyValidator)(properties.contentTypeOptions));
    errors.collect(cdk.propertyValidator('frameOptions', CfnResponseHeadersPolicy_FrameOptionsPropertyValidator)(properties.frameOptions));
    errors.collect(cdk.propertyValidator('referrerPolicy', CfnResponseHeadersPolicy_ReferrerPolicyPropertyValidator)(properties.referrerPolicy));
    errors.collect(cdk.propertyValidator('strictTransportSecurity', CfnResponseHeadersPolicy_StrictTransportSecurityPropertyValidator)(properties.strictTransportSecurity));
    errors.collect(cdk.propertyValidator('xssProtection', CfnResponseHeadersPolicy_XSSProtectionPropertyValidator)(properties.xssProtection));
    return errors.wrap('supplied properties not correct for "SecurityHeadersConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.SecurityHeadersConfig` resource
 *
 * @param properties - the TypeScript properties of a `SecurityHeadersConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.SecurityHeadersConfig` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicySecurityHeadersConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_SecurityHeadersConfigPropertyValidator(properties).assertSuccess();
    return {
        ContentSecurityPolicy: cfnResponseHeadersPolicyContentSecurityPolicyPropertyToCloudFormation(properties.contentSecurityPolicy),
        ContentTypeOptions: cfnResponseHeadersPolicyContentTypeOptionsPropertyToCloudFormation(properties.contentTypeOptions),
        FrameOptions: cfnResponseHeadersPolicyFrameOptionsPropertyToCloudFormation(properties.frameOptions),
        ReferrerPolicy: cfnResponseHeadersPolicyReferrerPolicyPropertyToCloudFormation(properties.referrerPolicy),
        StrictTransportSecurity: cfnResponseHeadersPolicyStrictTransportSecurityPropertyToCloudFormation(properties.strictTransportSecurity),
        XSSProtection: cfnResponseHeadersPolicyXSSProtectionPropertyToCloudFormation(properties.xssProtection),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicySecurityHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.SecurityHeadersConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.SecurityHeadersConfigProperty>();
    ret.addPropertyResult('contentSecurityPolicy', 'ContentSecurityPolicy', properties.ContentSecurityPolicy != null ? CfnResponseHeadersPolicyContentSecurityPolicyPropertyFromCloudFormation(properties.ContentSecurityPolicy) : undefined);
    ret.addPropertyResult('contentTypeOptions', 'ContentTypeOptions', properties.ContentTypeOptions != null ? CfnResponseHeadersPolicyContentTypeOptionsPropertyFromCloudFormation(properties.ContentTypeOptions) : undefined);
    ret.addPropertyResult('frameOptions', 'FrameOptions', properties.FrameOptions != null ? CfnResponseHeadersPolicyFrameOptionsPropertyFromCloudFormation(properties.FrameOptions) : undefined);
    ret.addPropertyResult('referrerPolicy', 'ReferrerPolicy', properties.ReferrerPolicy != null ? CfnResponseHeadersPolicyReferrerPolicyPropertyFromCloudFormation(properties.ReferrerPolicy) : undefined);
    ret.addPropertyResult('strictTransportSecurity', 'StrictTransportSecurity', properties.StrictTransportSecurity != null ? CfnResponseHeadersPolicyStrictTransportSecurityPropertyFromCloudFormation(properties.StrictTransportSecurity) : undefined);
    ret.addPropertyResult('xssProtection', 'XSSProtection', properties.XSSProtection != null ? CfnResponseHeadersPolicyXSSProtectionPropertyFromCloudFormation(properties.XSSProtection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
    /**
     * A configuration for enabling the `Server-Timing` header in HTTP responses sent from CloudFront.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-servertimingheadersconfig.html
     */
    export interface ServerTimingHeadersConfigProperty {
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

/**
 * Determine whether the given properties match those of a `ServerTimingHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ServerTimingHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_ServerTimingHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('samplingRate', cdk.validateNumber)(properties.samplingRate));
    return errors.wrap('supplied properties not correct for "ServerTimingHeadersConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ServerTimingHeadersConfig` resource
 *
 * @param properties - the TypeScript properties of a `ServerTimingHeadersConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.ServerTimingHeadersConfig` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyServerTimingHeadersConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_ServerTimingHeadersConfigPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        SamplingRate: cdk.numberToCloudFormation(properties.samplingRate),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyServerTimingHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.ServerTimingHeadersConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ServerTimingHeadersConfigProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('samplingRate', 'SamplingRate', properties.SamplingRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SamplingRate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface StrictTransportSecurityProperty {
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

/**
 * Determine whether the given properties match those of a `StrictTransportSecurityProperty`
 *
 * @param properties - the TypeScript properties of a `StrictTransportSecurityProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_StrictTransportSecurityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessControlMaxAgeSec', cdk.requiredValidator)(properties.accessControlMaxAgeSec));
    errors.collect(cdk.propertyValidator('accessControlMaxAgeSec', cdk.validateNumber)(properties.accessControlMaxAgeSec));
    errors.collect(cdk.propertyValidator('includeSubdomains', cdk.validateBoolean)(properties.includeSubdomains));
    errors.collect(cdk.propertyValidator('override', cdk.requiredValidator)(properties.override));
    errors.collect(cdk.propertyValidator('override', cdk.validateBoolean)(properties.override));
    errors.collect(cdk.propertyValidator('preload', cdk.validateBoolean)(properties.preload));
    return errors.wrap('supplied properties not correct for "StrictTransportSecurityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.StrictTransportSecurity` resource
 *
 * @param properties - the TypeScript properties of a `StrictTransportSecurityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.StrictTransportSecurity` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyStrictTransportSecurityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_StrictTransportSecurityPropertyValidator(properties).assertSuccess();
    return {
        AccessControlMaxAgeSec: cdk.numberToCloudFormation(properties.accessControlMaxAgeSec),
        IncludeSubdomains: cdk.booleanToCloudFormation(properties.includeSubdomains),
        Override: cdk.booleanToCloudFormation(properties.override),
        Preload: cdk.booleanToCloudFormation(properties.preload),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyStrictTransportSecurityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.StrictTransportSecurityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.StrictTransportSecurityProperty>();
    ret.addPropertyResult('accessControlMaxAgeSec', 'AccessControlMaxAgeSec', cfn_parse.FromCloudFormation.getNumber(properties.AccessControlMaxAgeSec));
    ret.addPropertyResult('includeSubdomains', 'IncludeSubdomains', properties.IncludeSubdomains != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSubdomains) : undefined);
    ret.addPropertyResult('override', 'Override', cfn_parse.FromCloudFormation.getBoolean(properties.Override));
    ret.addPropertyResult('preload', 'Preload', properties.Preload != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Preload) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponseHeadersPolicy {
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
    export interface XSSProtectionProperty {
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
 * Determine whether the given properties match those of a `XSSProtectionProperty`
 *
 * @param properties - the TypeScript properties of a `XSSProtectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponseHeadersPolicy_XSSProtectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('modeBlock', cdk.validateBoolean)(properties.modeBlock));
    errors.collect(cdk.propertyValidator('override', cdk.requiredValidator)(properties.override));
    errors.collect(cdk.propertyValidator('override', cdk.validateBoolean)(properties.override));
    errors.collect(cdk.propertyValidator('protection', cdk.requiredValidator)(properties.protection));
    errors.collect(cdk.propertyValidator('protection', cdk.validateBoolean)(properties.protection));
    errors.collect(cdk.propertyValidator('reportUri', cdk.validateString)(properties.reportUri));
    return errors.wrap('supplied properties not correct for "XSSProtectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.XSSProtection` resource
 *
 * @param properties - the TypeScript properties of a `XSSProtectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::ResponseHeadersPolicy.XSSProtection` resource.
 */
// @ts-ignore TS6133
function cfnResponseHeadersPolicyXSSProtectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponseHeadersPolicy_XSSProtectionPropertyValidator(properties).assertSuccess();
    return {
        ModeBlock: cdk.booleanToCloudFormation(properties.modeBlock),
        Override: cdk.booleanToCloudFormation(properties.override),
        Protection: cdk.booleanToCloudFormation(properties.protection),
        ReportUri: cdk.stringToCloudFormation(properties.reportUri),
    };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyXSSProtectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.XSSProtectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.XSSProtectionProperty>();
    ret.addPropertyResult('modeBlock', 'ModeBlock', properties.ModeBlock != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ModeBlock) : undefined);
    ret.addPropertyResult('override', 'Override', cfn_parse.FromCloudFormation.getBoolean(properties.Override));
    ret.addPropertyResult('protection', 'Protection', cfn_parse.FromCloudFormation.getBoolean(properties.Protection));
    ret.addPropertyResult('reportUri', 'ReportUri', properties.ReportUri != null ? cfn_parse.FromCloudFormation.getString(properties.ReportUri) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnStreamingDistributionProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamingDistributionProps`
 *
 * @returns the result of the validation.
 */
function CfnStreamingDistributionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamingDistributionConfig', cdk.requiredValidator)(properties.streamingDistributionConfig));
    errors.collect(cdk.propertyValidator('streamingDistributionConfig', CfnStreamingDistribution_StreamingDistributionConfigPropertyValidator)(properties.streamingDistributionConfig));
    errors.collect(cdk.propertyValidator('tags', cdk.requiredValidator)(properties.tags));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStreamingDistributionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution` resource
 *
 * @param properties - the TypeScript properties of a `CfnStreamingDistributionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution` resource.
 */
// @ts-ignore TS6133
function cfnStreamingDistributionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamingDistributionPropsValidator(properties).assertSuccess();
    return {
        StreamingDistributionConfig: cfnStreamingDistributionStreamingDistributionConfigPropertyToCloudFormation(properties.streamingDistributionConfig),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStreamingDistributionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingDistributionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistributionProps>();
    ret.addPropertyResult('streamingDistributionConfig', 'StreamingDistributionConfig', CfnStreamingDistributionStreamingDistributionConfigPropertyFromCloudFormation(properties.StreamingDistributionConfig));
    ret.addPropertyResult('tags', 'Tags', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnStreamingDistribution extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFront::StreamingDistribution";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamingDistribution {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStreamingDistributionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStreamingDistribution(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The domain name of the resource, such as `d111111abcdef8.cloudfront.net` .
     * @cloudformationAttribute DomainName
     */
    public readonly attrDomainName: string;

    /**
     * The current configuration information for the RTMP distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig
     */
    public streamingDistributionConfig: CfnStreamingDistribution.StreamingDistributionConfigProperty | cdk.IResolvable;

    /**
     * A complex type that contains zero or more `Tag` elements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CloudFront::StreamingDistribution`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamingDistributionProps) {
        super(scope, id, { type: CfnStreamingDistribution.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'streamingDistributionConfig', this);
        cdk.requireProperty(props, 'tags', this);
        this.attrDomainName = cdk.Token.asString(this.getAtt('DomainName', cdk.ResolutionTypeHint.STRING));

        this.streamingDistributionConfig = props.streamingDistributionConfig;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudFront::StreamingDistribution", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamingDistribution.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            streamingDistributionConfig: this.streamingDistributionConfig,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStreamingDistributionPropsToCloudFormation(props);
    }
}

export namespace CfnStreamingDistribution {
    /**
     * A complex type that controls whether access logs are written for the streaming distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html
     */
    export interface LoggingProperty {
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

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamingDistribution_LoggingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('prefix', cdk.requiredValidator)(properties.prefix));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    return errors.wrap('supplied properties not correct for "LoggingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.Logging` resource
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.Logging` resource.
 */
// @ts-ignore TS6133
function cfnStreamingDistributionLoggingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamingDistribution_LoggingPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
    };
}

// @ts-ignore TS6133
function CfnStreamingDistributionLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingDistribution.LoggingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.LoggingProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('prefix', 'Prefix', cfn_parse.FromCloudFormation.getString(properties.Prefix));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamingDistribution {
    /**
     * A complex type that contains information about the Amazon S3 bucket from which you want CloudFront to get your media files for distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html
     */
    export interface S3OriginProperty {
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

/**
 * Determine whether the given properties match those of a `S3OriginProperty`
 *
 * @param properties - the TypeScript properties of a `S3OriginProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamingDistribution_S3OriginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('originAccessIdentity', cdk.requiredValidator)(properties.originAccessIdentity));
    errors.collect(cdk.propertyValidator('originAccessIdentity', cdk.validateString)(properties.originAccessIdentity));
    return errors.wrap('supplied properties not correct for "S3OriginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.S3Origin` resource
 *
 * @param properties - the TypeScript properties of a `S3OriginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.S3Origin` resource.
 */
// @ts-ignore TS6133
function cfnStreamingDistributionS3OriginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamingDistribution_S3OriginPropertyValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        OriginAccessIdentity: cdk.stringToCloudFormation(properties.originAccessIdentity),
    };
}

// @ts-ignore TS6133
function CfnStreamingDistributionS3OriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingDistribution.S3OriginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.S3OriginProperty>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('originAccessIdentity', 'OriginAccessIdentity', cfn_parse.FromCloudFormation.getString(properties.OriginAccessIdentity));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamingDistribution {
    /**
     * The RTMP distribution's configuration information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html
     */
    export interface StreamingDistributionConfigProperty {
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

/**
 * Determine whether the given properties match those of a `StreamingDistributionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `StreamingDistributionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamingDistribution_StreamingDistributionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aliases', cdk.listValidator(cdk.validateString))(properties.aliases));
    errors.collect(cdk.propertyValidator('comment', cdk.requiredValidator)(properties.comment));
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('logging', CfnStreamingDistribution_LoggingPropertyValidator)(properties.logging));
    errors.collect(cdk.propertyValidator('priceClass', cdk.validateString)(properties.priceClass));
    errors.collect(cdk.propertyValidator('s3Origin', cdk.requiredValidator)(properties.s3Origin));
    errors.collect(cdk.propertyValidator('s3Origin', CfnStreamingDistribution_S3OriginPropertyValidator)(properties.s3Origin));
    errors.collect(cdk.propertyValidator('trustedSigners', cdk.requiredValidator)(properties.trustedSigners));
    errors.collect(cdk.propertyValidator('trustedSigners', CfnStreamingDistribution_TrustedSignersPropertyValidator)(properties.trustedSigners));
    return errors.wrap('supplied properties not correct for "StreamingDistributionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.StreamingDistributionConfig` resource
 *
 * @param properties - the TypeScript properties of a `StreamingDistributionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.StreamingDistributionConfig` resource.
 */
// @ts-ignore TS6133
function cfnStreamingDistributionStreamingDistributionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamingDistribution_StreamingDistributionConfigPropertyValidator(properties).assertSuccess();
    return {
        Aliases: cdk.listMapper(cdk.stringToCloudFormation)(properties.aliases),
        Comment: cdk.stringToCloudFormation(properties.comment),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Logging: cfnStreamingDistributionLoggingPropertyToCloudFormation(properties.logging),
        PriceClass: cdk.stringToCloudFormation(properties.priceClass),
        S3Origin: cfnStreamingDistributionS3OriginPropertyToCloudFormation(properties.s3Origin),
        TrustedSigners: cfnStreamingDistributionTrustedSignersPropertyToCloudFormation(properties.trustedSigners),
    };
}

// @ts-ignore TS6133
function CfnStreamingDistributionStreamingDistributionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingDistribution.StreamingDistributionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.StreamingDistributionConfigProperty>();
    ret.addPropertyResult('aliases', 'Aliases', properties.Aliases != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Aliases) : undefined);
    ret.addPropertyResult('comment', 'Comment', cfn_parse.FromCloudFormation.getString(properties.Comment));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('logging', 'Logging', properties.Logging != null ? CfnStreamingDistributionLoggingPropertyFromCloudFormation(properties.Logging) : undefined);
    ret.addPropertyResult('priceClass', 'PriceClass', properties.PriceClass != null ? cfn_parse.FromCloudFormation.getString(properties.PriceClass) : undefined);
    ret.addPropertyResult('s3Origin', 'S3Origin', CfnStreamingDistributionS3OriginPropertyFromCloudFormation(properties.S3Origin));
    ret.addPropertyResult('trustedSigners', 'TrustedSigners', CfnStreamingDistributionTrustedSignersPropertyFromCloudFormation(properties.TrustedSigners));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamingDistribution {
    /**
     * A list of AWS accounts whose public keys CloudFront can use to verify the signatures of signed URLs and signed cookies.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-trustedsigners.html
     */
    export interface TrustedSignersProperty {
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

/**
 * Determine whether the given properties match those of a `TrustedSignersProperty`
 *
 * @param properties - the TypeScript properties of a `TrustedSignersProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamingDistribution_TrustedSignersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccountNumbers', cdk.listValidator(cdk.validateString))(properties.awsAccountNumbers));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TrustedSignersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.TrustedSigners` resource
 *
 * @param properties - the TypeScript properties of a `TrustedSignersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudFront::StreamingDistribution.TrustedSigners` resource.
 */
// @ts-ignore TS6133
function cfnStreamingDistributionTrustedSignersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamingDistribution_TrustedSignersPropertyValidator(properties).assertSuccess();
    return {
        AwsAccountNumbers: cdk.listMapper(cdk.stringToCloudFormation)(properties.awsAccountNumbers),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnStreamingDistributionTrustedSignersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingDistribution.TrustedSignersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.TrustedSignersProperty>();
    ret.addPropertyResult('awsAccountNumbers', 'AwsAccountNumbers', properties.AwsAccountNumbers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AwsAccountNumbers) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

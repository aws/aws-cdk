/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html
 */
export class CfnCachePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::CachePolicy";

  /**
   * Build a CfnCachePolicy from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCachePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for the cache policy. For example: `2766f7b2-75c5-41c6-8f06-bf4303a2f2f5` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time when the cache policy was last modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: string;

  /**
   * The cache policy configuration.
   */
  public cachePolicyConfig: CfnCachePolicy.CachePolicyConfigProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCachePolicyProps) {
    super(scope, id, {
      "type": CfnCachePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "cachePolicyConfig", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asString(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.STRING));
    this.cachePolicyConfig = props.cachePolicyConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cachePolicyConfig": this.cachePolicyConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCachePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCachePolicyPropsToCloudFormation(props);
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
   * The headers, cookies, and query strings that are included in the cache key are also included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find a valid object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html
   */
  export interface CachePolicyConfigProperty {
    /**
     * A comment to describe the cache policy.
     *
     * The comment cannot be longer than 128 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-comment
     */
    readonly comment?: string;

    /**
     * The default amount of time, in seconds, that you want objects to stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated.
     *
     * CloudFront uses this value as the object's time to live (TTL) only when the origin does *not* send `Cache-Control` or `Expires` headers with the object. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The default value for this field is 86400 seconds (one day). If the value of `MinTTL` is more than 86400 seconds, then the default value for this field is the same as the value of `MinTTL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-defaultttl
     */
    readonly defaultTtl: number;

    /**
     * The maximum amount of time, in seconds, that objects stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated.
     *
     * CloudFront uses this value only when the origin sends `Cache-Control` or `Expires` headers with the object. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The default value for this field is 31536000 seconds (one year). If the value of `MinTTL` or `DefaultTTL` is more than 31536000 seconds, then the default value for this field is the same as the value of `DefaultTTL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-maxttl
     */
    readonly maxTtl: number;

    /**
     * The minimum amount of time, in seconds, that you want objects to stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated.
     *
     * For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-minttl
     */
    readonly minTtl: number;

    /**
     * A unique name to identify the cache policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-name
     */
    readonly name: string;

    /**
     * The HTTP headers, cookies, and URL query strings to include in the cache key.
     *
     * The values included in the cache key are also included in requests that CloudFront sends to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cachepolicyconfig.html#cfn-cloudfront-cachepolicy-cachepolicyconfig-parametersincachekeyandforwardedtoorigin
     */
    readonly parametersInCacheKeyAndForwardedToOrigin: cdk.IResolvable | CfnCachePolicy.ParametersInCacheKeyAndForwardedToOriginProperty;
  }

  /**
   * This object determines the values that CloudFront includes in the cache key.
   *
   * These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.
   *
   * The headers, cookies, and query strings that are included in the cache key are also included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find an object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html
   */
  export interface ParametersInCacheKeyAndForwardedToOriginProperty {
    /**
     * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-cookiesconfig
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-enableacceptencodingbrotli
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-enableacceptencodinggzip
     */
    readonly enableAcceptEncodingGzip: boolean | cdk.IResolvable;

    /**
     * An object that determines whether any HTTP headers (and if so, which headers) are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-headersconfig
     */
    readonly headersConfig: CfnCachePolicy.HeadersConfigProperty | cdk.IResolvable;

    /**
     * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin.html#cfn-cloudfront-cachepolicy-parametersincachekeyandforwardedtoorigin-querystringsconfig
     */
    readonly queryStringsConfig: cdk.IResolvable | CfnCachePolicy.QueryStringsConfigProperty;
  }

  /**
   * An object that determines whether any HTTP headers (and if so, which headers) are included in the cache key and in requests that CloudFront sends to the origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-headersconfig.html
   */
  export interface HeadersConfigProperty {
    /**
     * Determines whether any HTTP headers are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * Valid values are:
     *
     * - `none` – No HTTP headers are included in the cache key or in requests that CloudFront sends to the origin. Even when this field is set to `none` , any headers that are listed in an `OriginRequestPolicy` *are* included in origin requests.
     * - `whitelist` – Only the HTTP headers that are listed in the `Headers` type are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-headersconfig.html#cfn-cloudfront-cachepolicy-headersconfig-headerbehavior
     */
    readonly headerBehavior: string;

    /**
     * Contains a list of HTTP header names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-headersconfig.html#cfn-cloudfront-cachepolicy-headersconfig-headers
     */
    readonly headers?: Array<string>;
  }

  /**
   * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in the cache key and in requests that CloudFront sends to the origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cookiesconfig.html
   */
  export interface CookiesConfigProperty {
    /**
     * Determines whether any cookies in viewer requests are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * Valid values are:
     *
     * - `none` – No cookies in viewer requests are included in the cache key or in requests that CloudFront sends to the origin. Even when this field is set to `none` , any cookies that are listed in an `OriginRequestPolicy` *are* included in origin requests.
     * - `whitelist` – Only the cookies in viewer requests that are listed in the `CookieNames` type are included in the cache key and in requests that CloudFront sends to the origin.
     * - `allExcept` – All cookies in viewer requests are included in the cache key and in requests that CloudFront sends to the origin, **except** for those that are listed in the `CookieNames` type, which are not included.
     * - `all` – All cookies in viewer requests are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cookiesconfig.html#cfn-cloudfront-cachepolicy-cookiesconfig-cookiebehavior
     */
    readonly cookieBehavior: string;

    /**
     * Contains a list of cookie names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-cookiesconfig.html#cfn-cloudfront-cachepolicy-cookiesconfig-cookies
     */
    readonly cookies?: Array<string>;
  }

  /**
   * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in the cache key and in requests that CloudFront sends to the origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-querystringsconfig.html
   */
  export interface QueryStringsConfigProperty {
    /**
     * Determines whether any URL query strings in viewer requests are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * Valid values are:
     *
     * - `none` – No query strings in viewer requests are included in the cache key or in requests that CloudFront sends to the origin. Even when this field is set to `none` , any query strings that are listed in an `OriginRequestPolicy` *are* included in origin requests.
     * - `whitelist` – Only the query strings in viewer requests that are listed in the `QueryStringNames` type are included in the cache key and in requests that CloudFront sends to the origin.
     * - `allExcept` – All query strings in viewer requests are included in the cache key and in requests that CloudFront sends to the origin, **except** those that are listed in the `QueryStringNames` type, which are not included.
     * - `all` – All query strings in viewer requests are included in the cache key and in requests that CloudFront sends to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-querystringsconfig.html#cfn-cloudfront-cachepolicy-querystringsconfig-querystringbehavior
     */
    readonly queryStringBehavior: string;

    /**
     * Contains a list of query string names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cachepolicy-querystringsconfig.html#cfn-cloudfront-cachepolicy-querystringsconfig-querystrings
     */
    readonly queryStrings?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnCachePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html
 */
export interface CfnCachePolicyProps {
  /**
   * The cache policy configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cachepolicy.html#cfn-cloudfront-cachepolicy-cachepolicyconfig
   */
  readonly cachePolicyConfig: CfnCachePolicy.CachePolicyConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `HeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCachePolicyHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerBehavior", cdk.requiredValidator)(properties.headerBehavior));
  errors.collect(cdk.propertyValidator("headerBehavior", cdk.validateString)(properties.headerBehavior));
  errors.collect(cdk.propertyValidator("headers", cdk.listValidator(cdk.validateString))(properties.headers));
  return errors.wrap("supplied properties not correct for \"HeadersConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCachePolicyHeadersConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCachePolicyHeadersConfigPropertyValidator(properties).assertSuccess();
  return {
    "HeaderBehavior": cdk.stringToCloudFormation(properties.headerBehavior),
    "Headers": cdk.listMapper(cdk.stringToCloudFormation)(properties.headers)
  };
}

// @ts-ignore TS6133
function CfnCachePolicyHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.HeadersConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.HeadersConfigProperty>();
  ret.addPropertyResult("headerBehavior", "HeaderBehavior", (properties.HeaderBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderBehavior) : undefined));
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Headers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookiesConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCachePolicyCookiesConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookieBehavior", cdk.requiredValidator)(properties.cookieBehavior));
  errors.collect(cdk.propertyValidator("cookieBehavior", cdk.validateString)(properties.cookieBehavior));
  errors.collect(cdk.propertyValidator("cookies", cdk.listValidator(cdk.validateString))(properties.cookies));
  return errors.wrap("supplied properties not correct for \"CookiesConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCachePolicyCookiesConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCachePolicyCookiesConfigPropertyValidator(properties).assertSuccess();
  return {
    "CookieBehavior": cdk.stringToCloudFormation(properties.cookieBehavior),
    "Cookies": cdk.listMapper(cdk.stringToCloudFormation)(properties.cookies)
  };
}

// @ts-ignore TS6133
function CfnCachePolicyCookiesConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.CookiesConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.CookiesConfigProperty>();
  ret.addPropertyResult("cookieBehavior", "CookieBehavior", (properties.CookieBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.CookieBehavior) : undefined));
  ret.addPropertyResult("cookies", "Cookies", (properties.Cookies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Cookies) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryStringsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringsConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCachePolicyQueryStringsConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queryStringBehavior", cdk.requiredValidator)(properties.queryStringBehavior));
  errors.collect(cdk.propertyValidator("queryStringBehavior", cdk.validateString)(properties.queryStringBehavior));
  errors.collect(cdk.propertyValidator("queryStrings", cdk.listValidator(cdk.validateString))(properties.queryStrings));
  return errors.wrap("supplied properties not correct for \"QueryStringsConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCachePolicyQueryStringsConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCachePolicyQueryStringsConfigPropertyValidator(properties).assertSuccess();
  return {
    "QueryStringBehavior": cdk.stringToCloudFormation(properties.queryStringBehavior),
    "QueryStrings": cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStrings)
  };
}

// @ts-ignore TS6133
function CfnCachePolicyQueryStringsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCachePolicy.QueryStringsConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.QueryStringsConfigProperty>();
  ret.addPropertyResult("queryStringBehavior", "QueryStringBehavior", (properties.QueryStringBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.QueryStringBehavior) : undefined));
  ret.addPropertyResult("queryStrings", "QueryStrings", (properties.QueryStrings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.QueryStrings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ParametersInCacheKeyAndForwardedToOriginProperty`
 *
 * @param properties - the TypeScript properties of a `ParametersInCacheKeyAndForwardedToOriginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookiesConfig", cdk.requiredValidator)(properties.cookiesConfig));
  errors.collect(cdk.propertyValidator("cookiesConfig", CfnCachePolicyCookiesConfigPropertyValidator)(properties.cookiesConfig));
  errors.collect(cdk.propertyValidator("enableAcceptEncodingBrotli", cdk.validateBoolean)(properties.enableAcceptEncodingBrotli));
  errors.collect(cdk.propertyValidator("enableAcceptEncodingGzip", cdk.requiredValidator)(properties.enableAcceptEncodingGzip));
  errors.collect(cdk.propertyValidator("enableAcceptEncodingGzip", cdk.validateBoolean)(properties.enableAcceptEncodingGzip));
  errors.collect(cdk.propertyValidator("headersConfig", cdk.requiredValidator)(properties.headersConfig));
  errors.collect(cdk.propertyValidator("headersConfig", CfnCachePolicyHeadersConfigPropertyValidator)(properties.headersConfig));
  errors.collect(cdk.propertyValidator("queryStringsConfig", cdk.requiredValidator)(properties.queryStringsConfig));
  errors.collect(cdk.propertyValidator("queryStringsConfig", CfnCachePolicyQueryStringsConfigPropertyValidator)(properties.queryStringsConfig));
  return errors.wrap("supplied properties not correct for \"ParametersInCacheKeyAndForwardedToOriginProperty\"");
}

// @ts-ignore TS6133
function convertCfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyValidator(properties).assertSuccess();
  return {
    "CookiesConfig": convertCfnCachePolicyCookiesConfigPropertyToCloudFormation(properties.cookiesConfig),
    "EnableAcceptEncodingBrotli": cdk.booleanToCloudFormation(properties.enableAcceptEncodingBrotli),
    "EnableAcceptEncodingGzip": cdk.booleanToCloudFormation(properties.enableAcceptEncodingGzip),
    "HeadersConfig": convertCfnCachePolicyHeadersConfigPropertyToCloudFormation(properties.headersConfig),
    "QueryStringsConfig": convertCfnCachePolicyQueryStringsConfigPropertyToCloudFormation(properties.queryStringsConfig)
  };
}

// @ts-ignore TS6133
function CfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCachePolicy.ParametersInCacheKeyAndForwardedToOriginProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.ParametersInCacheKeyAndForwardedToOriginProperty>();
  ret.addPropertyResult("cookiesConfig", "CookiesConfig", (properties.CookiesConfig != null ? CfnCachePolicyCookiesConfigPropertyFromCloudFormation(properties.CookiesConfig) : undefined));
  ret.addPropertyResult("enableAcceptEncodingBrotli", "EnableAcceptEncodingBrotli", (properties.EnableAcceptEncodingBrotli != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAcceptEncodingBrotli) : undefined));
  ret.addPropertyResult("enableAcceptEncodingGzip", "EnableAcceptEncodingGzip", (properties.EnableAcceptEncodingGzip != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAcceptEncodingGzip) : undefined));
  ret.addPropertyResult("headersConfig", "HeadersConfig", (properties.HeadersConfig != null ? CfnCachePolicyHeadersConfigPropertyFromCloudFormation(properties.HeadersConfig) : undefined));
  ret.addPropertyResult("queryStringsConfig", "QueryStringsConfig", (properties.QueryStringsConfig != null ? CfnCachePolicyQueryStringsConfigPropertyFromCloudFormation(properties.QueryStringsConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CachePolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CachePolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCachePolicyCachePolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("defaultTtl", cdk.requiredValidator)(properties.defaultTtl));
  errors.collect(cdk.propertyValidator("defaultTtl", cdk.validateNumber)(properties.defaultTtl));
  errors.collect(cdk.propertyValidator("maxTtl", cdk.requiredValidator)(properties.maxTtl));
  errors.collect(cdk.propertyValidator("maxTtl", cdk.validateNumber)(properties.maxTtl));
  errors.collect(cdk.propertyValidator("minTtl", cdk.requiredValidator)(properties.minTtl));
  errors.collect(cdk.propertyValidator("minTtl", cdk.validateNumber)(properties.minTtl));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parametersInCacheKeyAndForwardedToOrigin", cdk.requiredValidator)(properties.parametersInCacheKeyAndForwardedToOrigin));
  errors.collect(cdk.propertyValidator("parametersInCacheKeyAndForwardedToOrigin", CfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyValidator)(properties.parametersInCacheKeyAndForwardedToOrigin));
  return errors.wrap("supplied properties not correct for \"CachePolicyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCachePolicyCachePolicyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCachePolicyCachePolicyConfigPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "DefaultTTL": cdk.numberToCloudFormation(properties.defaultTtl),
    "MaxTTL": cdk.numberToCloudFormation(properties.maxTtl),
    "MinTTL": cdk.numberToCloudFormation(properties.minTtl),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ParametersInCacheKeyAndForwardedToOrigin": convertCfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyToCloudFormation(properties.parametersInCacheKeyAndForwardedToOrigin)
  };
}

// @ts-ignore TS6133
function CfnCachePolicyCachePolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicy.CachePolicyConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicy.CachePolicyConfigProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("defaultTtl", "DefaultTTL", (properties.DefaultTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL) : undefined));
  ret.addPropertyResult("maxTtl", "MaxTTL", (properties.MaxTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTTL) : undefined));
  ret.addPropertyResult("minTtl", "MinTTL", (properties.MinTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinTTL) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parametersInCacheKeyAndForwardedToOrigin", "ParametersInCacheKeyAndForwardedToOrigin", (properties.ParametersInCacheKeyAndForwardedToOrigin != null ? CfnCachePolicyParametersInCacheKeyAndForwardedToOriginPropertyFromCloudFormation(properties.ParametersInCacheKeyAndForwardedToOrigin) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCachePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnCachePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCachePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cachePolicyConfig", cdk.requiredValidator)(properties.cachePolicyConfig));
  errors.collect(cdk.propertyValidator("cachePolicyConfig", CfnCachePolicyCachePolicyConfigPropertyValidator)(properties.cachePolicyConfig));
  return errors.wrap("supplied properties not correct for \"CfnCachePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnCachePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCachePolicyPropsValidator(properties).assertSuccess();
  return {
    "CachePolicyConfig": convertCfnCachePolicyCachePolicyConfigPropertyToCloudFormation(properties.cachePolicyConfig)
  };
}

// @ts-ignore TS6133
function CfnCachePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCachePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCachePolicyProps>();
  ret.addPropertyResult("cachePolicyConfig", "CachePolicyConfig", (properties.CachePolicyConfig != null ? CfnCachePolicyCachePolicyConfigPropertyFromCloudFormation(properties.CachePolicyConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The request to create a new origin access identity (OAI).
 *
 * An origin access identity is a special CloudFront user that you can associate with Amazon S3 origins, so that you can secure all or just some of your Amazon S3 content. For more information, see [Restricting Access to Amazon S3 Content by Using an Origin Access Identity](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::CloudFrontOriginAccessIdentity
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html
 */
export class CfnCloudFrontOriginAccessIdentity extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::CloudFrontOriginAccessIdentity";

  /**
   * Build a CfnCloudFrontOriginAccessIdentity from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCloudFrontOriginAccessIdentity(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the origin access identity, for example, `E74FTE3AJFJ256A` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon S3 canonical user ID for the origin access identity, used when giving the origin access identity read permission to an object in Amazon S3. For example: `b970b42360b81c8ddbd79d2f5df0069ba9033c8a79655752abe380cd6d63ba8bcf23384d568fcf89fc49700b5e11a0fd` .
   *
   * @cloudformationAttribute S3CanonicalUserId
   */
  public readonly attrS3CanonicalUserId: string;

  /**
   * The current configuration information for the identity.
   */
  public cloudFrontOriginAccessIdentityConfig: CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCloudFrontOriginAccessIdentityProps) {
    super(scope, id, {
      "type": CfnCloudFrontOriginAccessIdentity.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "cloudFrontOriginAccessIdentityConfig", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrS3CanonicalUserId = cdk.Token.asString(this.getAtt("S3CanonicalUserId", cdk.ResolutionTypeHint.STRING));
    this.cloudFrontOriginAccessIdentityConfig = props.cloudFrontOriginAccessIdentityConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cloudFrontOriginAccessIdentityConfig": this.cloudFrontOriginAccessIdentityConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCloudFrontOriginAccessIdentity.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCloudFrontOriginAccessIdentityPropsToCloudFormation(props);
  }
}

export namespace CfnCloudFrontOriginAccessIdentity {
  /**
   * Origin access identity configuration.
   *
   * Send a `GET` request to the `/ *CloudFront API version* /CloudFront/identity ID/config` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html
   */
  export interface CloudFrontOriginAccessIdentityConfigProperty {
    /**
     * A comment to describe the origin access identity.
     *
     * The comment cannot be longer than 128 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig-comment
     */
    readonly comment: string;
  }
}

/**
 * Properties for defining a `CfnCloudFrontOriginAccessIdentity`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html
 */
export interface CfnCloudFrontOriginAccessIdentityProps {
  /**
   * The current configuration information for the identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig
   */
  readonly cloudFrontOriginAccessIdentityConfig: CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CloudFrontOriginAccessIdentityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CloudFrontOriginAccessIdentityConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.requiredValidator)(properties.comment));
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  return errors.wrap("supplied properties not correct for \"CloudFrontOriginAccessIdentityConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment)
  };
}

// @ts-ignore TS6133
function CfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfigProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCloudFrontOriginAccessIdentityProps`
 *
 * @param properties - the TypeScript properties of a `CfnCloudFrontOriginAccessIdentityProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFrontOriginAccessIdentityPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudFrontOriginAccessIdentityConfig", cdk.requiredValidator)(properties.cloudFrontOriginAccessIdentityConfig));
  errors.collect(cdk.propertyValidator("cloudFrontOriginAccessIdentityConfig", CfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyValidator)(properties.cloudFrontOriginAccessIdentityConfig));
  return errors.wrap("supplied properties not correct for \"CfnCloudFrontOriginAccessIdentityProps\"");
}

// @ts-ignore TS6133
function convertCfnCloudFrontOriginAccessIdentityPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFrontOriginAccessIdentityPropsValidator(properties).assertSuccess();
  return {
    "CloudFrontOriginAccessIdentityConfig": convertCfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyToCloudFormation(properties.cloudFrontOriginAccessIdentityConfig)
  };
}

// @ts-ignore TS6133
function CfnCloudFrontOriginAccessIdentityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFrontOriginAccessIdentityProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFrontOriginAccessIdentityProps>();
  ret.addPropertyResult("cloudFrontOriginAccessIdentityConfig", "CloudFrontOriginAccessIdentityConfig", (properties.CloudFrontOriginAccessIdentityConfig != null ? CfnCloudFrontOriginAccessIdentityCloudFrontOriginAccessIdentityConfigPropertyFromCloudFormation(properties.CloudFrontOriginAccessIdentityConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a continuous deployment policy that routes a subset of production traffic from a primary distribution to a staging distribution.
 *
 * After you create and update a staging distribution, you can use a continuous deployment policy to incrementally move traffic to the staging distribution. This enables you to test changes to a distribution's configuration before moving all of your production traffic to the new configuration.
 *
 * For more information, see [Using CloudFront continuous deployment to safely test CDN configuration changes](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/continuous-deployment.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::ContinuousDeploymentPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html
 */
export class CfnContinuousDeploymentPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::ContinuousDeploymentPolicy";

  /**
   * Build a CfnContinuousDeploymentPolicy from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContinuousDeploymentPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier of the cotinuous deployment policy.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time when the continuous deployment policy was last modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: string;

  /**
   * Contains the configuration for a continuous deployment policy.
   */
  public continuousDeploymentPolicyConfig: CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContinuousDeploymentPolicyProps) {
    super(scope, id, {
      "type": CfnContinuousDeploymentPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "continuousDeploymentPolicyConfig", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asString(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.STRING));
    this.continuousDeploymentPolicyConfig = props.continuousDeploymentPolicyConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "continuousDeploymentPolicyConfig": this.continuousDeploymentPolicyConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContinuousDeploymentPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContinuousDeploymentPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnContinuousDeploymentPolicy {
  /**
   * Contains the configuration for a continuous deployment policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html
   */
  export interface ContinuousDeploymentPolicyConfigProperty {
    /**
     * A Boolean that indicates whether this continuous deployment policy is enabled (in effect).
     *
     * When this value is `true` , this policy is enabled and in effect. When this value is `false` , this policy is not enabled and has no effect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * This configuration determines which HTTP requests are sent to the staging distribution.
     *
     * If the HTTP request contains a header and value that matches what you specify here, the request is sent to the staging distribution. Otherwise the request is sent to the primary distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-singleheaderpolicyconfig
     */
    readonly singleHeaderPolicyConfig?: cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleHeaderPolicyConfigProperty;

    /**
     * This configuration determines the percentage of HTTP requests that are sent to the staging distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-singleweightpolicyconfig
     */
    readonly singleWeightPolicyConfig?: cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleWeightPolicyConfigProperty;

    /**
     * The CloudFront domain name of the staging distribution.
     *
     * For example: `d111111abcdef8.cloudfront.net` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-stagingdistributiondnsnames
     */
    readonly stagingDistributionDnsNames: Array<string>;

    /**
     * Contains the parameters for routing production traffic from your primary to staging distributions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-trafficconfig
     */
    readonly trafficConfig?: cdk.IResolvable | CfnContinuousDeploymentPolicy.TrafficConfigProperty;

    /**
     * The type of traffic configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig-type
     */
    readonly type?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderpolicyconfig.html
   */
  export interface SingleHeaderPolicyConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleheaderpolicyconfig-header
     */
    readonly header: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleheaderpolicyconfig-value
     */
    readonly value: string;
  }

  /**
   * The traffic configuration of your continuous deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html
   */
  export interface TrafficConfigProperty {
    /**
     * Determines which HTTP requests are sent to the staging distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html#cfn-cloudfront-continuousdeploymentpolicy-trafficconfig-singleheaderconfig
     */
    readonly singleHeaderConfig?: cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleHeaderConfigProperty;

    /**
     * Contains the percentage of traffic to send to the staging distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html#cfn-cloudfront-continuousdeploymentpolicy-trafficconfig-singleweightconfig
     */
    readonly singleWeightConfig?: cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleWeightConfigProperty;

    /**
     * The type of traffic configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-trafficconfig.html#cfn-cloudfront-continuousdeploymentpolicy-trafficconfig-type
     */
    readonly type: string;
  }

  /**
   * This configuration determines the percentage of HTTP requests that are sent to the staging distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightconfig.html
   */
  export interface SingleWeightConfigProperty {
    /**
     * Session stickiness provides the ability to define multiple requests from a single viewer as a single session.
     *
     * This prevents the potentially inconsistent experience of sending some of a given user's requests to your staging distribution, while others are sent to your primary distribution. Define the session duration using TTL values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleweightconfig-sessionstickinessconfig
     */
    readonly sessionStickinessConfig?: cdk.IResolvable | CfnContinuousDeploymentPolicy.SessionStickinessConfigProperty;

    /**
     * The percentage of traffic to send to a staging distribution, expressed as a decimal number between 0 and .15.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleweightconfig-weight
     */
    readonly weight: number;
  }

  /**
   * Session stickiness provides the ability to define multiple requests from a single viewer as a single session.
   *
   * This prevents the potentially inconsistent experience of sending some of a given user's requests to your staging distribution, while others are sent to your primary distribution. Define the session duration using TTL values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig.html
   */
  export interface SessionStickinessConfigProperty {
    /**
     * The amount of time after which you want sessions to cease if no requests are received.
     *
     * Allowed values are 300–3600 seconds (5–60 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig.html#cfn-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig-idlettl
     */
    readonly idleTtl: number;

    /**
     * The maximum amount of time to consider requests from the viewer as being part of the same session.
     *
     * Allowed values are 300–3600 seconds (5–60 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig.html#cfn-cloudfront-continuousdeploymentpolicy-sessionstickinessconfig-maximumttl
     */
    readonly maximumTtl: number;
  }

  /**
   * Determines which HTTP requests are sent to the staging distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderconfig.html
   */
  export interface SingleHeaderConfigProperty {
    /**
     * The request header name that you want CloudFront to send to your staging distribution.
     *
     * The header must contain the prefix `aws-cf-cd-` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleheaderconfig-header
     */
    readonly header: string;

    /**
     * The request header value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleheaderconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleheaderconfig-value
     */
    readonly value: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightpolicyconfig.html
   */
  export interface SingleWeightPolicyConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleweightpolicyconfig-sessionstickinessconfig
     */
    readonly sessionStickinessConfig?: cdk.IResolvable | CfnContinuousDeploymentPolicy.SessionStickinessConfigProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-continuousdeploymentpolicy-singleweightpolicyconfig.html#cfn-cloudfront-continuousdeploymentpolicy-singleweightpolicyconfig-weight
     */
    readonly weight: number;
  }
}

/**
 * Properties for defining a `CfnContinuousDeploymentPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html
 */
export interface CfnContinuousDeploymentPolicyProps {
  /**
   * Contains the configuration for a continuous deployment policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-continuousdeploymentpolicy.html#cfn-cloudfront-continuousdeploymentpolicy-continuousdeploymentpolicyconfig
   */
  readonly continuousDeploymentPolicyConfig: CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SingleHeaderPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleHeaderPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("header", cdk.requiredValidator)(properties.header));
  errors.collect(cdk.propertyValidator("header", cdk.validateString)(properties.header));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SingleHeaderPolicyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicySingleHeaderPolicyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicySingleHeaderPolicyConfigPropertyValidator(properties).assertSuccess();
  return {
    "Header": cdk.stringToCloudFormation(properties.header),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleHeaderPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleHeaderPolicyConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SingleHeaderPolicyConfigProperty>();
  ret.addPropertyResult("header", "Header", (properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SessionStickinessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SessionStickinessConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySessionStickinessConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idleTtl", cdk.requiredValidator)(properties.idleTtl));
  errors.collect(cdk.propertyValidator("idleTtl", cdk.validateNumber)(properties.idleTtl));
  errors.collect(cdk.propertyValidator("maximumTtl", cdk.requiredValidator)(properties.maximumTtl));
  errors.collect(cdk.propertyValidator("maximumTtl", cdk.validateNumber)(properties.maximumTtl));
  return errors.wrap("supplied properties not correct for \"SessionStickinessConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicySessionStickinessConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicySessionStickinessConfigPropertyValidator(properties).assertSuccess();
  return {
    "IdleTTL": cdk.numberToCloudFormation(properties.idleTtl),
    "MaximumTTL": cdk.numberToCloudFormation(properties.maximumTtl)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySessionStickinessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContinuousDeploymentPolicy.SessionStickinessConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SessionStickinessConfigProperty>();
  ret.addPropertyResult("idleTtl", "IdleTTL", (properties.IdleTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleTTL) : undefined));
  ret.addPropertyResult("maximumTtl", "MaximumTTL", (properties.MaximumTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumTTL) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleWeightConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SingleWeightConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleWeightConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sessionStickinessConfig", CfnContinuousDeploymentPolicySessionStickinessConfigPropertyValidator)(properties.sessionStickinessConfig));
  errors.collect(cdk.propertyValidator("weight", cdk.requiredValidator)(properties.weight));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"SingleWeightConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicySingleWeightConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicySingleWeightConfigPropertyValidator(properties).assertSuccess();
  return {
    "SessionStickinessConfig": convertCfnContinuousDeploymentPolicySessionStickinessConfigPropertyToCloudFormation(properties.sessionStickinessConfig),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleWeightConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleWeightConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SingleWeightConfigProperty>();
  ret.addPropertyResult("sessionStickinessConfig", "SessionStickinessConfig", (properties.SessionStickinessConfig != null ? CfnContinuousDeploymentPolicySessionStickinessConfigPropertyFromCloudFormation(properties.SessionStickinessConfig) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("header", cdk.requiredValidator)(properties.header));
  errors.collect(cdk.propertyValidator("header", cdk.validateString)(properties.header));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SingleHeaderConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicySingleHeaderConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicySingleHeaderConfigPropertyValidator(properties).assertSuccess();
  return {
    "Header": cdk.stringToCloudFormation(properties.header),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleHeaderConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SingleHeaderConfigProperty>();
  ret.addPropertyResult("header", "Header", (properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrafficConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TrafficConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyTrafficConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("singleHeaderConfig", CfnContinuousDeploymentPolicySingleHeaderConfigPropertyValidator)(properties.singleHeaderConfig));
  errors.collect(cdk.propertyValidator("singleWeightConfig", CfnContinuousDeploymentPolicySingleWeightConfigPropertyValidator)(properties.singleWeightConfig));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"TrafficConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicyTrafficConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicyTrafficConfigPropertyValidator(properties).assertSuccess();
  return {
    "SingleHeaderConfig": convertCfnContinuousDeploymentPolicySingleHeaderConfigPropertyToCloudFormation(properties.singleHeaderConfig),
    "SingleWeightConfig": convertCfnContinuousDeploymentPolicySingleWeightConfigPropertyToCloudFormation(properties.singleWeightConfig),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyTrafficConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContinuousDeploymentPolicy.TrafficConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.TrafficConfigProperty>();
  ret.addPropertyResult("singleHeaderConfig", "SingleHeaderConfig", (properties.SingleHeaderConfig != null ? CfnContinuousDeploymentPolicySingleHeaderConfigPropertyFromCloudFormation(properties.SingleHeaderConfig) : undefined));
  ret.addPropertyResult("singleWeightConfig", "SingleWeightConfig", (properties.SingleWeightConfig != null ? CfnContinuousDeploymentPolicySingleWeightConfigPropertyFromCloudFormation(properties.SingleWeightConfig) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleWeightPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SingleWeightPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleWeightPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sessionStickinessConfig", CfnContinuousDeploymentPolicySessionStickinessConfigPropertyValidator)(properties.sessionStickinessConfig));
  errors.collect(cdk.propertyValidator("weight", cdk.requiredValidator)(properties.weight));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"SingleWeightPolicyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicySingleWeightPolicyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicySingleWeightPolicyConfigPropertyValidator(properties).assertSuccess();
  return {
    "SessionStickinessConfig": convertCfnContinuousDeploymentPolicySessionStickinessConfigPropertyToCloudFormation(properties.sessionStickinessConfig),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicySingleWeightPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContinuousDeploymentPolicy.SingleWeightPolicyConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.SingleWeightPolicyConfigProperty>();
  ret.addPropertyResult("sessionStickinessConfig", "SessionStickinessConfig", (properties.SessionStickinessConfig != null ? CfnContinuousDeploymentPolicySessionStickinessConfigPropertyFromCloudFormation(properties.SessionStickinessConfig) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContinuousDeploymentPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ContinuousDeploymentPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("singleHeaderPolicyConfig", CfnContinuousDeploymentPolicySingleHeaderPolicyConfigPropertyValidator)(properties.singleHeaderPolicyConfig));
  errors.collect(cdk.propertyValidator("singleWeightPolicyConfig", CfnContinuousDeploymentPolicySingleWeightPolicyConfigPropertyValidator)(properties.singleWeightPolicyConfig));
  errors.collect(cdk.propertyValidator("stagingDistributionDnsNames", cdk.requiredValidator)(properties.stagingDistributionDnsNames));
  errors.collect(cdk.propertyValidator("stagingDistributionDnsNames", cdk.listValidator(cdk.validateString))(properties.stagingDistributionDnsNames));
  errors.collect(cdk.propertyValidator("trafficConfig", CfnContinuousDeploymentPolicyTrafficConfigPropertyValidator)(properties.trafficConfig));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ContinuousDeploymentPolicyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "SingleHeaderPolicyConfig": convertCfnContinuousDeploymentPolicySingleHeaderPolicyConfigPropertyToCloudFormation(properties.singleHeaderPolicyConfig),
    "SingleWeightPolicyConfig": convertCfnContinuousDeploymentPolicySingleWeightPolicyConfigPropertyToCloudFormation(properties.singleWeightPolicyConfig),
    "StagingDistributionDnsNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.stagingDistributionDnsNames),
    "TrafficConfig": convertCfnContinuousDeploymentPolicyTrafficConfigPropertyToCloudFormation(properties.trafficConfig),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicy.ContinuousDeploymentPolicyConfigProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("singleHeaderPolicyConfig", "SingleHeaderPolicyConfig", (properties.SingleHeaderPolicyConfig != null ? CfnContinuousDeploymentPolicySingleHeaderPolicyConfigPropertyFromCloudFormation(properties.SingleHeaderPolicyConfig) : undefined));
  ret.addPropertyResult("singleWeightPolicyConfig", "SingleWeightPolicyConfig", (properties.SingleWeightPolicyConfig != null ? CfnContinuousDeploymentPolicySingleWeightPolicyConfigPropertyFromCloudFormation(properties.SingleWeightPolicyConfig) : undefined));
  ret.addPropertyResult("stagingDistributionDnsNames", "StagingDistributionDnsNames", (properties.StagingDistributionDnsNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StagingDistributionDnsNames) : undefined));
  ret.addPropertyResult("trafficConfig", "TrafficConfig", (properties.TrafficConfig != null ? CfnContinuousDeploymentPolicyTrafficConfigPropertyFromCloudFormation(properties.TrafficConfig) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnContinuousDeploymentPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnContinuousDeploymentPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("continuousDeploymentPolicyConfig", cdk.requiredValidator)(properties.continuousDeploymentPolicyConfig));
  errors.collect(cdk.propertyValidator("continuousDeploymentPolicyConfig", CfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyValidator)(properties.continuousDeploymentPolicyConfig));
  return errors.wrap("supplied properties not correct for \"CfnContinuousDeploymentPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnContinuousDeploymentPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContinuousDeploymentPolicyPropsValidator(properties).assertSuccess();
  return {
    "ContinuousDeploymentPolicyConfig": convertCfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyToCloudFormation(properties.continuousDeploymentPolicyConfig)
  };
}

// @ts-ignore TS6133
function CfnContinuousDeploymentPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContinuousDeploymentPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContinuousDeploymentPolicyProps>();
  ret.addPropertyResult("continuousDeploymentPolicyConfig", "ContinuousDeploymentPolicyConfig", (properties.ContinuousDeploymentPolicyConfig != null ? CfnContinuousDeploymentPolicyContinuousDeploymentPolicyConfigPropertyFromCloudFormation(properties.ContinuousDeploymentPolicyConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A distribution tells CloudFront where you want content to be delivered from, and the details about how to track and manage content delivery.
 *
 * @cloudformationResource AWS::CloudFront::Distribution
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html
 */
export class CfnDistribution extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::Distribution";

  /**
   * Build a CfnDistribution from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDistribution(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The domain name of the resource, such as `d111111abcdef8.cloudfront.net` .
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * The distribution's identifier. For example: `E1U5RQF7T870K0` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The distribution's configuration.
   */
  public distributionConfig: CfnDistribution.DistributionConfigProperty | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A complex type that contains zero or more `Tag` elements.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDistributionProps) {
    super(scope, id, {
      "type": CfnDistribution.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "distributionConfig", this);

    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.distributionConfig = props.distributionConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudFront::Distribution", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "distributionConfig": this.distributionConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDistribution.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDistributionPropsToCloudFormation(props);
  }
}

export namespace CfnDistribution {
  /**
   * A distribution configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html
   */
  export interface DistributionConfigProperty {
    /**
     * A complex type that contains information about CNAMEs (alternate domain names), if any, for this distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-aliases
     */
    readonly aliases?: Array<string>;

    /**
     * A complex type that contains zero or more `CacheBehavior` elements.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-cachebehaviors
     */
    readonly cacheBehaviors?: Array<CfnDistribution.CacheBehaviorProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-cnames
     */
    readonly cnamEs?: Array<string>;

    /**
     * A comment to describe the distribution.
     *
     * The comment cannot be longer than 128 characters.
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-comment
     */
    readonly comment?: string;

    /**
     * The identifier of a continuous deployment policy.
     *
     * For more information, see `CreateContinuousDeploymentPolicy` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-continuousdeploymentpolicyid
     */
    readonly continuousDeploymentPolicyId?: string;

    /**
     * A complex type that controls the following:.
     *
     * - Whether CloudFront replaces HTTP status codes in the 4xx and 5xx range with custom error messages before returning the response to the viewer.
     * - How long CloudFront caches HTTP status codes in the 4xx and 5xx range.
     *
     * For more information about custom error pages, see [Customizing Error Responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-customerrorresponses
     */
    readonly customErrorResponses?: Array<CfnDistribution.CustomErrorResponseProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-customorigin
     */
    readonly customOrigin?: cdk.IResolvable | CfnDistribution.LegacyCustomOriginProperty;

    /**
     * A complex type that describes the default cache behavior if you don't specify a `CacheBehavior` element or if files don't match any of the values of `PathPattern` in `CacheBehavior` elements.
     *
     * You must create exactly one default cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-defaultcachebehavior
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
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-defaultrootobject
     */
    readonly defaultRootObject?: string;

    /**
     * From this field, you can enable or disable the selected distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * (Optional) Specify the maximum HTTP version(s) that you want viewers to use to communicate with CloudFront .
     *
     * The default value for new distributions is `http1.1` .
     *
     * For viewers and CloudFront to use HTTP/2, viewers must support TLSv1.2 or later, and must support Server Name Indication (SNI).
     *
     * For viewers and CloudFront to use HTTP/3, viewers must support TLSv1.3 and Server Name Indication (SNI). CloudFront supports HTTP/3 connection migration to allow the viewer to switch networks without losing connection. For more information about connection migration, see [Connection Migration](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc9000.html#name-connection-migration) at RFC 9000. For more information about supported TLSv1.3 ciphers, see [Supported protocols and ciphers between viewers and CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html) .
     *
     * @default - "http1.1"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-httpversion
     */
    readonly httpVersion?: string;

    /**
     * If you want CloudFront to respond to IPv6 DNS requests with an IPv6 address for your distribution, specify `true` .
     *
     * If you specify `false` , CloudFront responds to IPv6 DNS requests with the DNS response code `NOERROR` and with no IP addresses. This allows viewers to submit a second request, for an IPv4 address for your distribution.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-ipv6enabled
     */
    readonly ipv6Enabled?: boolean | cdk.IResolvable;

    /**
     * A complex type that controls whether access logs are written for the distribution.
     *
     * For more information about logging, see [Access Logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-logging
     */
    readonly logging?: cdk.IResolvable | CfnDistribution.LoggingProperty;

    /**
     * A complex type that contains information about origin groups for this distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-origingroups
     */
    readonly originGroups?: cdk.IResolvable | CfnDistribution.OriginGroupsProperty;

    /**
     * A complex type that contains information about origins for this distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-origins
     */
    readonly origins?: Array<cdk.IResolvable | CfnDistribution.OriginProperty> | cdk.IResolvable;

    /**
     * The price class that corresponds with the maximum price that you want to pay for CloudFront service.
     *
     * If you specify `PriceClass_All` , CloudFront responds to requests for your objects from all CloudFront edge locations.
     *
     * If you specify a price class other than `PriceClass_All` , CloudFront serves your objects from the CloudFront edge location that has the lowest latency among the edge locations in your price class. Viewers who are in or near regions that are excluded from your specified price class may encounter slower performance.
     *
     * For more information about price classes, see [Choosing the Price Class for a CloudFront Distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html) in the *Amazon CloudFront Developer Guide* . For information about CloudFront pricing, including how price classes (such as Price Class 100) map to CloudFront regions, see [Amazon CloudFront Pricing](https://docs.aws.amazon.com/cloudfront/pricing/) .
     *
     * @default - "PriceClass_All"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-priceclass
     */
    readonly priceClass?: string;

    /**
     * A complex type that identifies ways in which you want to restrict distribution of your content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions
     */
    readonly restrictions?: cdk.IResolvable | CfnDistribution.RestrictionsProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-s3origin
     */
    readonly s3Origin?: cdk.IResolvable | CfnDistribution.LegacyS3OriginProperty;

    /**
     * A Boolean that indicates whether this is a staging distribution.
     *
     * When this value is `true` , this is a staging distribution. When this value is `false` , this is not a staging distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-staging
     */
    readonly staging?: boolean | cdk.IResolvable;

    /**
     * A complex type that determines the distribution's SSL/TLS configuration for communicating with viewers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-viewercertificate
     */
    readonly viewerCertificate?: cdk.IResolvable | CfnDistribution.ViewerCertificateProperty;

    /**
     * A unique identifier that specifies the AWS WAF web ACL, if any, to associate with this distribution.
     *
     * To specify a web ACL created using the latest version of AWS WAF , use the ACL ARN, for example `arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a` . To specify a web ACL created using AWS WAF Classic, use the ACL ID, for example `473e64fd-f30b-4765-81a0-62ad96dd167a` .
     *
     * AWS WAF is a web application firewall that lets you monitor the HTTP and HTTPS requests that are forwarded to CloudFront, and lets you control access to your content. Based on conditions that you specify, such as the IP addresses that requests originate from or the values of query strings, CloudFront responds to requests either with the requested content or with an HTTP 403 status code (Forbidden). You can also configure CloudFront to return a custom error page when a request is blocked. For more information about AWS WAF , see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html) .
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-webaclid
     */
    readonly webAclId?: string;
  }

  /**
   * A complex type that controls whether access logs are written for the distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html
   */
  export interface LoggingProperty {
    /**
     * The Amazon S3 bucket to store the access logs in, for example, `myawslogbucket.s3.amazonaws.com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-bucket
     */
    readonly bucket: string;

    /**
     * Specifies whether you want CloudFront to include cookies in access logs, specify `true` for `IncludeCookies` .
     *
     * If you choose to include cookies in logs, CloudFront logs all cookies regardless of how you configure the cache behaviors for this distribution. If you don't want to include cookies when you create a distribution or if you want to disable include cookies for an existing distribution, specify `false` for `IncludeCookies` .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-includecookies
     */
    readonly includeCookies?: boolean | cdk.IResolvable;

    /**
     * An optional string that you want CloudFront to prefix to the access log `filenames` for this distribution, for example, `myprefix/` .
     *
     * If you want to enable logging, but you don't want to specify a prefix, you still must include an empty `Prefix` element in the `Logging` element.
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-prefix
     */
    readonly prefix?: string;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html
   */
  export interface OriginProperty {
    /**
     * The number of times that CloudFront attempts to connect to the origin.
     *
     * The minimum number is 1, the maximum is 3, and the default (if you don't specify otherwise) is 3.
     *
     * For a custom origin (including an Amazon S3 bucket that's configured with static website hosting), this value also specifies the number of times that CloudFront attempts to get a response from the origin, in the case of an [Origin Response Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginResponseTimeout) .
     *
     * For more information, see [Origin Connection Attempts](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-attempts) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-connectionattempts
     */
    readonly connectionAttempts?: number;

    /**
     * The number of seconds that CloudFront waits when trying to establish a connection to the origin.
     *
     * The minimum timeout is 1 second, the maximum is 10 seconds, and the default (if you don't specify otherwise) is 10 seconds.
     *
     * For more information, see [Origin Connection Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-timeout) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-connectiontimeout
     */
    readonly connectionTimeout?: number;

    /**
     * Use this type to specify an origin that is not an Amazon S3 bucket, with one exception.
     *
     * If the Amazon S3 bucket is configured with static website hosting, use this type. If the Amazon S3 bucket is not configured with static website hosting, use the `S3OriginConfig` type instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-customoriginconfig
     */
    readonly customOriginConfig?: CfnDistribution.CustomOriginConfigProperty | cdk.IResolvable;

    /**
     * The domain name for the origin.
     *
     * For more information, see [Origin Domain Name](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesDomainName) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-domainname
     */
    readonly domainName: string;

    /**
     * A unique identifier for the origin. This value must be unique within the distribution.
     *
     * Use this value to specify the `TargetOriginId` in a `CacheBehavior` or `DefaultCacheBehavior` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-id
     */
    readonly id: string;

    /**
     * The unique identifier of an origin access control for this origin.
     *
     * For more information, see [Restricting access to an Amazon S3 origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-originaccesscontrolid
     */
    readonly originAccessControlId?: string;

    /**
     * A list of HTTP header names and values that CloudFront adds to the requests that it sends to the origin.
     *
     * For more information, see [Adding Custom Headers to Origin Requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-origincustomheaders
     */
    readonly originCustomHeaders?: Array<cdk.IResolvable | CfnDistribution.OriginCustomHeaderProperty> | cdk.IResolvable;

    /**
     * An optional path that CloudFront appends to the origin domain name when CloudFront requests content from the origin.
     *
     * For more information, see [Origin Path](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginPath) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-originpath
     */
    readonly originPath?: string;

    /**
     * CloudFront Origin Shield. Using Origin Shield can help reduce the load on your origin.
     *
     * For more information, see [Using Origin Shield](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-originshield
     */
    readonly originShield?: cdk.IResolvable | CfnDistribution.OriginShieldProperty;

    /**
     * Use this type to specify an origin that is an Amazon S3 bucket that is not configured with static website hosting.
     *
     * To specify any other type of origin, including an Amazon S3 bucket that is configured with static website hosting, use the `CustomOriginConfig` type instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-s3originconfig
     */
    readonly s3OriginConfig?: cdk.IResolvable | CfnDistribution.S3OriginConfigProperty;
  }

  /**
   * A complex type that contains `HeaderName` and `HeaderValue` elements, if any, for this distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html
   */
  export interface OriginCustomHeaderProperty {
    /**
     * The name of a header that you want CloudFront to send to your origin.
     *
     * For more information, see [Adding Custom Headers to Origin Requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/forward-custom-headers.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html#cfn-cloudfront-distribution-origincustomheader-headername
     */
    readonly headerName: string;

    /**
     * The value for the header that you specified in the `HeaderName` field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html#cfn-cloudfront-distribution-origincustomheader-headervalue
     */
    readonly headerValue: string;
  }

  /**
   * CloudFront Origin Shield.
   *
   * Using Origin Shield can help reduce the load on your origin. For more information, see [Using Origin Shield](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html) in the *Amazon CloudFront Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-originshield.html
   */
  export interface OriginShieldProperty {
    /**
     * A flag that specifies whether Origin Shield is enabled.
     *
     * When it's enabled, CloudFront routes all requests through Origin Shield, which can help protect your origin. When it's disabled, CloudFront might send requests directly to your origin from multiple edge locations or regional edge caches.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-originshield.html#cfn-cloudfront-distribution-originshield-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The AWS Region for Origin Shield.
     *
     * Specify the AWS Region that has the lowest latency to your origin. To specify a region, use the region code, not the region name. For example, specify the US East (Ohio) region as `us-east-2` .
     *
     * When you enable CloudFront Origin Shield, you must specify the AWS Region for Origin Shield. For the list of AWS Regions that you can specify, and for help choosing the best Region for your origin, see [Choosing the AWS Region for Origin Shield](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html#choose-origin-shield-region) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-originshield.html#cfn-cloudfront-distribution-originshield-originshieldregion
     */
    readonly originShieldRegion?: string;
  }

  /**
   * A complex type that contains information about the Amazon S3 origin.
   *
   * If the origin is a custom origin or an S3 bucket that is configured as a website endpoint, use the `CustomOriginConfig` element instead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html
   */
  export interface S3OriginConfigProperty {
    /**
     * The CloudFront origin access identity to associate with the origin.
     *
     * Use an origin access identity to configure the origin so that viewers can *only* access objects in an Amazon S3 bucket through CloudFront. The format of the value is:
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
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html#cfn-cloudfront-distribution-s3originconfig-originaccessidentity
     */
    readonly originAccessIdentity?: string;
  }

  /**
   * A custom origin.
   *
   * A custom origin is any origin that is *not* an Amazon S3 bucket, with one exception. An Amazon S3 bucket that is [configured with static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) *is* a custom origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html
   */
  export interface CustomOriginConfigProperty {
    /**
     * The HTTP port that CloudFront uses to connect to the origin.
     *
     * Specify the HTTP port that the origin listens on.
     *
     * @default - 80
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-httpport
     */
    readonly httpPort?: number;

    /**
     * The HTTPS port that CloudFront uses to connect to the origin.
     *
     * Specify the HTTPS port that the origin listens on.
     *
     * @default - 443
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-httpsport
     */
    readonly httpsPort?: number;

    /**
     * Specifies how long, in seconds, CloudFront persists its connection to the origin.
     *
     * The minimum timeout is 1 second, the maximum is 60 seconds, and the default (if you don't specify otherwise) is 5 seconds.
     *
     * For more information, see [Origin Keep-alive Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginKeepaliveTimeout) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - 5
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originkeepalivetimeout
     */
    readonly originKeepaliveTimeout?: number;

    /**
     * Specifies the protocol (HTTP or HTTPS) that CloudFront uses to connect to the origin. Valid values are:.
     *
     * - `http-only` – CloudFront always uses HTTP to connect to the origin.
     * - `match-viewer` – CloudFront connects to the origin using the same protocol that the viewer used to connect to CloudFront.
     * - `https-only` – CloudFront always uses HTTPS to connect to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originprotocolpolicy
     */
    readonly originProtocolPolicy: string;

    /**
     * Specifies how long, in seconds, CloudFront waits for a response from the origin.
     *
     * This is also known as the *origin response timeout* . The minimum timeout is 1 second, the maximum is 60 seconds, and the default (if you don't specify otherwise) is 30 seconds.
     *
     * For more information, see [Origin Response Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginResponseTimeout) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - 30
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originreadtimeout
     */
    readonly originReadTimeout?: number;

    /**
     * Specifies the minimum SSL/TLS protocol that CloudFront uses when connecting to your origin over HTTPS.
     *
     * Valid values include `SSLv3` , `TLSv1` , `TLSv1.1` , and `TLSv1.2` .
     *
     * For more information, see [Minimum Origin SSL Protocol](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginSSLProtocols) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originsslprotocols
     */
    readonly originSslProtocols?: Array<string>;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html
   */
  export interface ViewerCertificateProperty {
    /**
     * > In CloudFormation, this field name is `AcmCertificateArn` . Note the different capitalization.
     *
     * If the distribution uses `Aliases` (alternate domain names or CNAMEs) and the SSL/TLS certificate is stored in [AWS Certificate Manager (ACM)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) , provide the Amazon Resource Name (ARN) of the ACM certificate. CloudFront only supports ACM certificates in the US East (N. Virginia) Region ( `us-east-1` ).
     *
     * If you specify an ACM certificate ARN, you must also specify values for `MinimumProtocolVersion` and `SSLSupportMethod` . (In CloudFormation, the field name is `SslSupportMethod` . Note the different capitalization.)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-acmcertificatearn
     */
    readonly acmCertificateArn?: string;

    /**
     * If the distribution uses the CloudFront domain name such as `d111111abcdef8.cloudfront.net` , set this field to `true` .
     *
     * If the distribution uses `Aliases` (alternate domain names or CNAMEs), omit this field and specify values for the following fields:
     *
     * - `AcmCertificateArn` or `IamCertificateId` (specify a value for one, not both)
     * - `MinimumProtocolVersion`
     * - `SslSupportMethod`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-cloudfrontdefaultcertificate
     */
    readonly cloudFrontDefaultCertificate?: boolean | cdk.IResolvable;

    /**
     * > In CloudFormation, this field name is `IamCertificateId` . Note the different capitalization.
     *
     * If the distribution uses `Aliases` (alternate domain names or CNAMEs) and the SSL/TLS certificate is stored in [AWS Identity and Access Management (IAM)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html) , provide the ID of the IAM certificate.
     *
     * If you specify an IAM certificate ID, you must also specify values for `MinimumProtocolVersion` and `SSLSupportMethod` . (In CloudFormation, the field name is `SslSupportMethod` . Note the different capitalization.)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-iamcertificateid
     */
    readonly iamCertificateId?: string;

    /**
     * If the distribution uses `Aliases` (alternate domain names or CNAMEs), specify the security policy that you want CloudFront to use for HTTPS connections with viewers.
     *
     * The security policy determines two settings:
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-minimumprotocolversion
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-sslsupportmethod
     */
    readonly sslSupportMethod?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html
   */
  export interface LegacyCustomOriginProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-dnsname
     */
    readonly dnsName: string;

    /**
     * @default - 80
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-httpport
     */
    readonly httpPort?: number;

    /**
     * @default - 443
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-httpsport
     */
    readonly httpsPort?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-originprotocolpolicy
     */
    readonly originProtocolPolicy: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacycustomorigin.html#cfn-cloudfront-distribution-legacycustomorigin-originsslprotocols
     */
    readonly originSslProtocols: Array<string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacys3origin.html
   */
  export interface LegacyS3OriginProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacys3origin.html#cfn-cloudfront-distribution-legacys3origin-dnsname
     */
    readonly dnsName: string;

    /**
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-legacys3origin.html#cfn-cloudfront-distribution-legacys3origin-originaccessidentity
     */
    readonly originAccessIdentity?: string;
  }

  /**
   * A complex type that describes the default cache behavior if you don't specify a `CacheBehavior` element or if request URLs don't match any of the values of `PathPattern` in `CacheBehavior` elements.
   *
   * You must create exactly one default cache behavior.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html
   */
  export interface DefaultCacheBehaviorProperty {
    /**
     * A complex type that controls which HTTP methods CloudFront processes and forwards to your Amazon S3 bucket or your custom origin.
     *
     * There are three choices:
     *
     * - CloudFront forwards only `GET` and `HEAD` requests.
     * - CloudFront forwards only `GET` , `HEAD` , and `OPTIONS` requests.
     * - CloudFront forwards `GET, HEAD, OPTIONS, PUT, PATCH, POST` , and `DELETE` requests.
     *
     * If you pick the third choice, you may need to restrict access to your Amazon S3 bucket or to your custom origin so users can't perform operations that you don't want them to. For example, you might not want users to have permissions to delete objects from your origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-allowedmethods
     */
    readonly allowedMethods?: Array<string>;

    /**
     * A complex type that controls whether CloudFront caches the response to requests using the specified HTTP methods.
     *
     * There are two choices:
     *
     * - CloudFront caches responses to `GET` and `HEAD` requests.
     * - CloudFront caches responses to `GET` , `HEAD` , and `OPTIONS` requests.
     *
     * If you pick the second choice for your Amazon S3 Origin, you may need to forward Access-Control-Request-Method, Access-Control-Request-Headers, and Origin headers for the responses to be cached correctly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-cachedmethods
     */
    readonly cachedMethods?: Array<string>;

    /**
     * The unique identifier of the cache policy that is attached to the default cache behavior.
     *
     * For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * A `DefaultCacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-cachepolicyid
     */
    readonly cachePolicyId?: string;

    /**
     * Whether you want CloudFront to automatically compress certain files for this cache behavior.
     *
     * If so, specify `true` ; if not, specify `false` . For more information, see [Serving Compressed Files](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-compress
     */
    readonly compress?: boolean | cdk.IResolvable;

    /**
     * This field is deprecated.
     *
     * We recommend that you use the `DefaultTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The default amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin does not add HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - 86400
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-defaultttl
     */
    readonly defaultTtl?: number;

    /**
     * The value of `ID` for the field-level encryption configuration that you want CloudFront to use for encrypting specific fields of data for the default cache behavior.
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-fieldlevelencryptionid
     */
    readonly fieldLevelEncryptionId?: string;

    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field. For more information, see [Working with policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/working-with-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to include values in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * A `DefaultCacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
     *
     * A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-forwardedvalues
     */
    readonly forwardedValues?: CfnDistribution.ForwardedValuesProperty | cdk.IResolvable;

    /**
     * A list of CloudFront functions that are associated with this cache behavior.
     *
     * CloudFront functions must be published to the `LIVE` stage to associate them with a cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-functionassociations
     */
    readonly functionAssociations?: Array<CfnDistribution.FunctionAssociationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A complex type that contains zero or more Lambda@Edge function associations for a cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-lambdafunctionassociations
     */
    readonly lambdaFunctionAssociations?: Array<cdk.IResolvable | CfnDistribution.LambdaFunctionAssociationProperty> | cdk.IResolvable;

    /**
     * This field is deprecated.
     *
     * We recommend that you use the `MaxTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The maximum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin adds HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - 31536000
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-maxttl
     */
    readonly maxTtl?: number;

    /**
     * This field is deprecated.
     *
     * We recommend that you use the `MinTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The minimum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * You must specify `0` for `MinTTL` if you configure CloudFront to forward all headers to your origin (under `Headers` , if you specify `1` for `Quantity` and `*` for `Name` ).
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-minttl
     */
    readonly minTtl?: number;

    /**
     * The unique identifier of the origin request policy that is attached to the default cache behavior.
     *
     * For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-originrequestpolicyid
     */
    readonly originRequestPolicyId?: string;

    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration that is attached to this cache behavior.
     *
     * For more information, see [Real-time logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-realtimelogconfigarn
     */
    readonly realtimeLogConfigArn?: string;

    /**
     * The identifier for a response headers policy.
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-responseheaderspolicyid
     */
    readonly responseHeadersPolicyId?: string;

    /**
     * Indicates whether you want to distribute media files in the Microsoft Smooth Streaming format using the origin that is associated with this cache behavior.
     *
     * If so, specify `true` ; if not, specify `false` . If you specify `true` for `SmoothStreaming` , you can still distribute other content using this cache behavior if the content matches the value of `PathPattern` .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-smoothstreaming
     */
    readonly smoothStreaming?: boolean | cdk.IResolvable;

    /**
     * The value of `ID` for the origin that you want CloudFront to route requests to when they use the default cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-targetoriginid
     */
    readonly targetOriginId: string;

    /**
     * A list of key groups that CloudFront can use to validate signed URLs or signed cookies.
     *
     * When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-trustedkeygroups
     */
    readonly trustedKeyGroups?: Array<string>;

    /**
     * > We recommend using `TrustedKeyGroups` instead of `TrustedSigners` .
     *
     * A list of AWS account IDs whose public keys CloudFront can use to validate signed URLs or signed cookies.
     *
     * When a cache behavior contains trusted signers, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with the private key of a CloudFront key pair in a trusted signer's AWS account . The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-trustedsigners
     */
    readonly trustedSigners?: Array<string>;

    /**
     * The protocol that viewers can use to access the files in the origin specified by `TargetOriginId` when a request matches the path pattern in `PathPattern` .
     *
     * You can specify the following options:
     *
     * - `allow-all` : Viewers can use HTTP or HTTPS.
     * - `redirect-to-https` : If a viewer submits an HTTP request, CloudFront returns an HTTP status code of 301 (Moved Permanently) to the viewer along with the HTTPS URL. The viewer then resubmits the request using the new URL.
     * - `https-only` : If a viewer sends an HTTP request, CloudFront returns an HTTP status code of 403 (Forbidden).
     *
     * For more information about requiring the HTTPS protocol, see [Requiring HTTPS Between Viewers and CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-viewers-to-cloudfront.html) in the *Amazon CloudFront Developer Guide* .
     *
     * > The only way to guarantee that viewers retrieve an object that was fetched from the origin using HTTPS is never to use any other protocol to fetch the object. If you have recently changed from HTTP to HTTPS, we recommend that you clear your objects' cache because cached objects are protocol agnostic. That means that an edge location will return an object from the cache regardless of whether the current request protocol matches the protocol used previously. For more information, see [Managing Cache Expiration](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-defaultcachebehavior.html#cfn-cloudfront-distribution-defaultcachebehavior-viewerprotocolpolicy
     */
    readonly viewerProtocolPolicy: string;
  }

  /**
   * A CloudFront function that is associated with a cache behavior in a CloudFront distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-functionassociation.html
   */
  export interface FunctionAssociationProperty {
    /**
     * The event type of the function, either `viewer-request` or `viewer-response` .
     *
     * You cannot use origin-facing event types ( `origin-request` and `origin-response` ) with a CloudFront function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-functionassociation.html#cfn-cloudfront-distribution-functionassociation-eventtype
     */
    readonly eventType?: string;

    /**
     * The Amazon Resource Name (ARN) of the function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-functionassociation.html#cfn-cloudfront-distribution-functionassociation-functionarn
     */
    readonly functionArn?: string;
  }

  /**
   * A complex type that contains a Lambda@Edge function association.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html
   */
  export interface LambdaFunctionAssociationProperty {
    /**
     * Specifies the event type that triggers a Lambda@Edge function invocation. You can specify the following values:.
     *
     * - `viewer-request` : The function executes when CloudFront receives a request from a viewer and before it checks to see whether the requested object is in the edge cache.
     * - `origin-request` : The function executes only when CloudFront sends a request to your origin. When the requested object is in the edge cache, the function doesn't execute.
     * - `origin-response` : The function executes after CloudFront receives a response from the origin and before it caches the object in the response. When the requested object is in the edge cache, the function doesn't execute.
     * - `viewer-response` : The function executes before CloudFront returns the requested object to the viewer. The function executes regardless of whether the object was already in the edge cache.
     *
     * If the origin returns an HTTP status code other than HTTP 200 (OK), the function doesn't execute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-eventtype
     */
    readonly eventType?: string;

    /**
     * A flag that allows a Lambda@Edge function to have read access to the body content.
     *
     * For more information, see [Accessing the Request Body by Choosing the Include Body Option](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-include-body-access.html) in the Amazon CloudFront Developer Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-includebody
     */
    readonly includeBody?: boolean | cdk.IResolvable;

    /**
     * The ARN of the Lambda@Edge function.
     *
     * You must specify the ARN of a function version; you can't specify an alias or $LATEST.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-lambdafunctionarn
     */
    readonly lambdaFunctionArn?: string;
  }

  /**
   * This field is deprecated.
   *
   * We recommend that you use a cache policy or an origin request policy instead of this field.
   *
   * If you want to include values in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
   *
   * If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
   *
   * A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html
   */
  export interface ForwardedValuesProperty {
    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field.
     *
     * If you want to include cookies in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send cookies to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * A complex type that specifies whether you want CloudFront to forward cookies to the origin and, if so, which ones. For more information about forwarding cookies to the origin, see [How CloudFront Forwards, Caches, and Logs Cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Cookies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-cookies
     */
    readonly cookies?: CfnDistribution.CookiesProperty | cdk.IResolvable;

    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field.
     *
     * If you want to include headers in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send headers to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * A complex type that specifies the `Headers` , if any, that you want CloudFront to forward to the origin for this cache behavior (whitelisted headers). For the headers that you specify, CloudFront also caches separate versions of a specified object that is based on the header values in viewer requests.
     *
     * For more information, see [Caching Content Based on Request Headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-headers
     */
    readonly headers?: Array<string>;

    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-querystring
     */
    readonly queryString: boolean | cdk.IResolvable;

    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field.
     *
     * If you want to include query strings in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send query strings to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * A complex type that contains information about the query string parameters that you want CloudFront to use for caching for this cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-forwardedvalues.html#cfn-cloudfront-distribution-forwardedvalues-querystringcachekeys
     */
    readonly queryStringCacheKeys?: Array<string>;
  }

  /**
   * This field is deprecated.
   *
   * We recommend that you use a cache policy or an origin request policy instead of this field.
   *
   * If you want to include cookies in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
   *
   * If you want to send cookies to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
   *
   * A complex type that specifies whether you want CloudFront to forward cookies to the origin and, if so, which ones. For more information about forwarding cookies to the origin, see [How CloudFront Forwards, Caches, and Logs Cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Cookies.html) in the *Amazon CloudFront Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html
   */
  export interface CookiesProperty {
    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field.
     *
     * If you want to include cookies in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send cookies to the origin but not include them in the cache key, use origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) in the *Amazon CloudFront Developer Guide* .
     *
     * Specifies which cookies to forward to the origin for this cache behavior: all, none, or the list of cookies specified in the `WhitelistedNames` complex type.
     *
     * Amazon S3 doesn't process cookies. When the cache behavior is forwarding requests to an Amazon S3 origin, specify none for the `Forward` element.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-forward
     */
    readonly forward: string;

    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-whitelistednames
     */
    readonly whitelistedNames?: Array<string>;
  }

  /**
   * A complex type that controls:.
   *
   * - Whether CloudFront replaces HTTP status codes in the 4xx and 5xx range with custom error messages before returning the response to the viewer.
   * - How long CloudFront caches HTTP status codes in the 4xx and 5xx range.
   *
   * For more information about custom error pages, see [Customizing Error Responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html) in the *Amazon CloudFront Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html
   */
  export interface CustomErrorResponseProperty {
    /**
     * The minimum amount of time, in seconds, that you want CloudFront to cache the HTTP status code specified in `ErrorCode` .
     *
     * When this time period has elapsed, CloudFront queries your origin to see whether the problem that caused the error has been resolved and the requested object is now available.
     *
     * For more information, see [Customizing Error Responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - 300
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcachingminttl
     */
    readonly errorCachingMinTtl?: number;

    /**
     * The HTTP status code for which you want to specify a custom error page and/or a caching duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcode
     */
    readonly errorCode: number;

    /**
     * The HTTP status code that you want CloudFront to return to the viewer along with the custom error page.
     *
     * There are a variety of reasons that you might want CloudFront to return a status code different from the status code that your origin returned to CloudFront, for example:
     *
     * - Some Internet devices (some firewalls and corporate proxies, for example) intercept HTTP 4xx and 5xx and prevent the response from being returned to the viewer. If you substitute `200` , the response typically won't be intercepted.
     * - If you don't care about distinguishing among different client errors or server errors, you can specify `400` or `500` as the `ResponseCode` for all 4xx or 5xx errors.
     * - You might want to return a `200` status code (OK) and static website so your customers don't know that your website is down.
     *
     * If you specify a value for `ResponseCode` , you must also specify a value for `ResponsePagePath` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-responsecode
     */
    readonly responseCode?: number;

    /**
     * The path to the custom error page that you want CloudFront to return to a viewer when your origin returns the HTTP status code specified by `ErrorCode` , for example, `/4xx-errors/403-forbidden.html` . If you want to store your objects and your custom error pages in different locations, your distribution must include a cache behavior for which the following is true:.
     *
     * - The value of `PathPattern` matches the path to your custom error messages. For example, suppose you saved custom error pages for 4xx errors in an Amazon S3 bucket in a directory named `/4xx-errors` . Your distribution must include a cache behavior for which the path pattern routes requests for your custom error pages to that location, for example, `/4xx-errors/*` .
     * - The value of `TargetOriginId` specifies the value of the `ID` element for the origin that contains your custom error pages.
     *
     * If you specify a value for `ResponsePagePath` , you must also specify a value for `ResponseCode` .
     *
     * We recommend that you store custom error pages in an Amazon S3 bucket. If you store custom error pages on an HTTP server and the server starts to return 5xx errors, CloudFront can't get the files that you want to return to viewers because the origin server is unavailable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-responsepagepath
     */
    readonly responsePagePath?: string;
  }

  /**
   * A complex data type for the origin groups specified for a distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroups.html
   */
  export interface OriginGroupsProperty {
    /**
     * The items (origin groups) in a distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroups.html#cfn-cloudfront-distribution-origingroups-items
     */
    readonly items?: Array<cdk.IResolvable | CfnDistribution.OriginGroupProperty> | cdk.IResolvable;

    /**
     * The number of origin groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroups.html#cfn-cloudfront-distribution-origingroups-quantity
     */
    readonly quantity: number;
  }

  /**
   * An origin group includes two origins (a primary origin and a second origin to failover to) and a failover criteria that you specify.
   *
   * You create an origin group to support origin failover in CloudFront. When you create or update a distribution, you can specify the origin group instead of a single origin, and CloudFront will failover from the primary origin to the second origin under the failover conditions that you've chosen.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html
   */
  export interface OriginGroupProperty {
    /**
     * A complex type that contains information about the failover criteria for an origin group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html#cfn-cloudfront-distribution-origingroup-failovercriteria
     */
    readonly failoverCriteria: cdk.IResolvable | CfnDistribution.OriginGroupFailoverCriteriaProperty;

    /**
     * The origin group's ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html#cfn-cloudfront-distribution-origingroup-id
     */
    readonly id: string;

    /**
     * A complex type that contains information about the origins in an origin group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroup.html#cfn-cloudfront-distribution-origingroup-members
     */
    readonly members: cdk.IResolvable | CfnDistribution.OriginGroupMembersProperty;
  }

  /**
   * A complex data type that includes information about the failover criteria for an origin group, including the status codes for which CloudFront will failover from the primary origin to the second origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupfailovercriteria.html
   */
  export interface OriginGroupFailoverCriteriaProperty {
    /**
     * The status codes that, when returned from the primary origin, will trigger CloudFront to failover to the second origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupfailovercriteria.html#cfn-cloudfront-distribution-origingroupfailovercriteria-statuscodes
     */
    readonly statusCodes: cdk.IResolvable | CfnDistribution.StatusCodesProperty;
  }

  /**
   * A complex data type for the status codes that you specify that, when returned by a primary origin, trigger CloudFront to failover to a second origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-statuscodes.html
   */
  export interface StatusCodesProperty {
    /**
     * The items (status codes) for an origin group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-statuscodes.html#cfn-cloudfront-distribution-statuscodes-items
     */
    readonly items: Array<number> | cdk.IResolvable;

    /**
     * The number of status codes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-statuscodes.html#cfn-cloudfront-distribution-statuscodes-quantity
     */
    readonly quantity: number;
  }

  /**
   * A complex data type for the origins included in an origin group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmembers.html
   */
  export interface OriginGroupMembersProperty {
    /**
     * Items (origins) in an origin group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmembers.html#cfn-cloudfront-distribution-origingroupmembers-items
     */
    readonly items: Array<cdk.IResolvable | CfnDistribution.OriginGroupMemberProperty> | cdk.IResolvable;

    /**
     * The number of origins in an origin group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmembers.html#cfn-cloudfront-distribution-origingroupmembers-quantity
     */
    readonly quantity: number;
  }

  /**
   * An origin in an origin group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmember.html
   */
  export interface OriginGroupMemberProperty {
    /**
     * The ID for an origin in an origin group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origingroupmember.html#cfn-cloudfront-distribution-origingroupmember-originid
     */
    readonly originId: string;
  }

  /**
   * A complex type that identifies ways in which you want to restrict distribution of your content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html
   */
  export interface RestrictionsProperty {
    /**
     * A complex type that controls the countries in which your content is distributed.
     *
     * CloudFront determines the location of your users using `MaxMind` GeoIP databases. To disable geo restriction, remove the [Restrictions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions) property from your stack template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html#cfn-cloudfront-distribution-restrictions-georestriction
     */
    readonly geoRestriction: CfnDistribution.GeoRestrictionProperty | cdk.IResolvable;
  }

  /**
   * A complex type that controls the countries in which your content is distributed.
   *
   * CloudFront determines the location of your users using `MaxMind` GeoIP databases. To disable geo restriction, remove the [Restrictions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions) property from your stack template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html
   */
  export interface GeoRestrictionProperty {
    /**
     * A complex type that contains a `Location` element for each country in which you want CloudFront either to distribute your content ( `whitelist` ) or not distribute your content ( `blacklist` ).
     *
     * The `Location` element is a two-letter, uppercase country code for a country that you want to include in your `blacklist` or `whitelist` . Include one `Location` element for each country.
     *
     * CloudFront and `MaxMind` both use `ISO 3166` country codes. For the current list of countries and the corresponding codes, see `ISO 3166-1-alpha-2` code on the *International Organization for Standardization* website. You can also refer to the country list on the CloudFront console, which includes both country names and codes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html#cfn-cloudfront-distribution-georestriction-locations
     */
    readonly locations?: Array<string>;

    /**
     * The method that you want to use to restrict distribution of your content by country:.
     *
     * - `none` : No geo restriction is enabled, meaning access to content is not restricted by client geo location.
     * - `blacklist` : The `Location` elements specify the countries in which you don't want CloudFront to distribute your content.
     * - `whitelist` : The `Location` elements specify the countries in which you want CloudFront to distribute your content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html#cfn-cloudfront-distribution-georestriction-restrictiontype
     */
    readonly restrictionType: string;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html
   */
  export interface CacheBehaviorProperty {
    /**
     * A complex type that controls which HTTP methods CloudFront processes and forwards to your Amazon S3 bucket or your custom origin.
     *
     * There are three choices:
     *
     * - CloudFront forwards only `GET` and `HEAD` requests.
     * - CloudFront forwards only `GET` , `HEAD` , and `OPTIONS` requests.
     * - CloudFront forwards `GET, HEAD, OPTIONS, PUT, PATCH, POST` , and `DELETE` requests.
     *
     * If you pick the third choice, you may need to restrict access to your Amazon S3 bucket or to your custom origin so users can't perform operations that you don't want them to. For example, you might not want users to have permissions to delete objects from your origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-allowedmethods
     */
    readonly allowedMethods?: Array<string>;

    /**
     * A complex type that controls whether CloudFront caches the response to requests using the specified HTTP methods.
     *
     * There are two choices:
     *
     * - CloudFront caches responses to `GET` and `HEAD` requests.
     * - CloudFront caches responses to `GET` , `HEAD` , and `OPTIONS` requests.
     *
     * If you pick the second choice for your Amazon S3 Origin, you may need to forward Access-Control-Request-Method, Access-Control-Request-Headers, and Origin headers for the responses to be cached correctly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-cachedmethods
     */
    readonly cachedMethods?: Array<string>;

    /**
     * The unique identifier of the cache policy that is attached to this cache behavior.
     *
     * For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * A `CacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-cachepolicyid
     */
    readonly cachePolicyId?: string;

    /**
     * Whether you want CloudFront to automatically compress certain files for this cache behavior.
     *
     * If so, specify true; if not, specify false. For more information, see [Serving Compressed Files](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-compress
     */
    readonly compress?: boolean | cdk.IResolvable;

    /**
     * This field is deprecated.
     *
     * We recommend that you use the `DefaultTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The default amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin does not add HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - 86400
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-defaultttl
     */
    readonly defaultTtl?: number;

    /**
     * The value of `ID` for the field-level encryption configuration that you want CloudFront to use for encrypting specific fields of data for this cache behavior.
     *
     * @default - ""
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-fieldlevelencryptionid
     */
    readonly fieldLevelEncryptionId?: string;

    /**
     * This field is deprecated.
     *
     * We recommend that you use a cache policy or an origin request policy instead of this field. For more information, see [Working with policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/working-with-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to include values in the cache key, use a cache policy. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * A `CacheBehavior` must include either a `CachePolicyId` or `ForwardedValues` . We recommend that you use a `CachePolicyId` .
     *
     * A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-forwardedvalues
     */
    readonly forwardedValues?: CfnDistribution.ForwardedValuesProperty | cdk.IResolvable;

    /**
     * A list of CloudFront functions that are associated with this cache behavior.
     *
     * CloudFront functions must be published to the `LIVE` stage to associate them with a cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-functionassociations
     */
    readonly functionAssociations?: Array<CfnDistribution.FunctionAssociationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A complex type that contains zero or more Lambda@Edge function associations for a cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-lambdafunctionassociations
     */
    readonly lambdaFunctionAssociations?: Array<cdk.IResolvable | CfnDistribution.LambdaFunctionAssociationProperty> | cdk.IResolvable;

    /**
     * This field is deprecated.
     *
     * We recommend that you use the `MaxTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The maximum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin adds HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @default - 31536000
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-maxttl
     */
    readonly maxTtl?: number;

    /**
     * This field is deprecated.
     *
     * We recommend that you use the `MinTTL` field in a cache policy instead of this field. For more information, see [Creating cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-key-create-cache-policy) or [Using the managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * The minimum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. For more information, see [Managing How Long Content Stays in an Edge Cache (Expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * You must specify `0` for `MinTTL` if you configure CloudFront to forward all headers to your origin (under `Headers` , if you specify `1` for `Quantity` and `*` for `Name` ).
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-minttl
     */
    readonly minTtl?: number;

    /**
     * The unique identifier of the origin request policy that is attached to this cache behavior.
     *
     * For more information, see [Creating origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html#origin-request-create-origin-request-policy) or [Using the managed origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-originrequestpolicyid
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-pathpattern
     */
    readonly pathPattern: string;

    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration that is attached to this cache behavior.
     *
     * For more information, see [Real-time logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-realtimelogconfigarn
     */
    readonly realtimeLogConfigArn?: string;

    /**
     * The identifier for a response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-responseheaderspolicyid
     */
    readonly responseHeadersPolicyId?: string;

    /**
     * Indicates whether you want to distribute media files in the Microsoft Smooth Streaming format using the origin that is associated with this cache behavior.
     *
     * If so, specify `true` ; if not, specify `false` . If you specify `true` for `SmoothStreaming` , you can still distribute other content using this cache behavior if the content matches the value of `PathPattern` .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-smoothstreaming
     */
    readonly smoothStreaming?: boolean | cdk.IResolvable;

    /**
     * The value of `ID` for the origin that you want CloudFront to route requests to when they match this cache behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-targetoriginid
     */
    readonly targetOriginId: string;

    /**
     * A list of key groups that CloudFront can use to validate signed URLs or signed cookies.
     *
     * When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-trustedkeygroups
     */
    readonly trustedKeyGroups?: Array<string>;

    /**
     * > We recommend using `TrustedKeyGroups` instead of `TrustedSigners` .
     *
     * A list of AWS account IDs whose public keys CloudFront can use to validate signed URLs or signed cookies.
     *
     * When a cache behavior contains trusted signers, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with the private key of a CloudFront key pair in the trusted signer's AWS account . The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see [Serving private content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-trustedsigners
     */
    readonly trustedSigners?: Array<string>;

    /**
     * The protocol that viewers can use to access the files in the origin specified by `TargetOriginId` when a request matches the path pattern in `PathPattern` .
     *
     * You can specify the following options:
     *
     * - `allow-all` : Viewers can use HTTP or HTTPS.
     * - `redirect-to-https` : If a viewer submits an HTTP request, CloudFront returns an HTTP status code of 301 (Moved Permanently) to the viewer along with the HTTPS URL. The viewer then resubmits the request using the new URL.
     * - `https-only` : If a viewer sends an HTTP request, CloudFront returns an HTTP status code of 403 (Forbidden).
     *
     * For more information about requiring the HTTPS protocol, see [Requiring HTTPS Between Viewers and CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-viewers-to-cloudfront.html) in the *Amazon CloudFront Developer Guide* .
     *
     * > The only way to guarantee that viewers retrieve an object that was fetched from the origin using HTTPS is never to use any other protocol to fetch the object. If you have recently changed from HTTP to HTTPS, we recommend that you clear your objects' cache because cached objects are protocol agnostic. That means that an edge location will return an object from the cache regardless of whether the current request protocol matches the protocol used previously. For more information, see [Managing Cache Expiration](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cachebehavior.html#cfn-cloudfront-distribution-cachebehavior-viewerprotocolpolicy
     */
    readonly viewerProtocolPolicy: string;
  }
}

/**
 * Properties for defining a `CfnDistribution`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html
 */
export interface CfnDistributionProps {
  /**
   * The distribution's configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-distributionconfig
   */
  readonly distributionConfig: CfnDistribution.DistributionConfigProperty | cdk.IResolvable;

  /**
   * A complex type that contains zero or more `Tag` elements.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionLoggingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("includeCookies", cdk.validateBoolean)(properties.includeCookies));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"LoggingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionLoggingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionLoggingPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "IncludeCookies": cdk.booleanToCloudFormation(properties.includeCookies),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnDistributionLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.LoggingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LoggingProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("includeCookies", "IncludeCookies", (properties.IncludeCookies != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeCookies) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginCustomHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `OriginCustomHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginCustomHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerName", cdk.requiredValidator)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerName", cdk.validateString)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerValue", cdk.requiredValidator)(properties.headerValue));
  errors.collect(cdk.propertyValidator("headerValue", cdk.validateString)(properties.headerValue));
  return errors.wrap("supplied properties not correct for \"OriginCustomHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginCustomHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginCustomHeaderPropertyValidator(properties).assertSuccess();
  return {
    "HeaderName": cdk.stringToCloudFormation(properties.headerName),
    "HeaderValue": cdk.stringToCloudFormation(properties.headerValue)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginCustomHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginCustomHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginCustomHeaderProperty>();
  ret.addPropertyResult("headerName", "HeaderName", (properties.HeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderName) : undefined));
  ret.addPropertyResult("headerValue", "HeaderValue", (properties.HeaderValue != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginShieldProperty`
 *
 * @param properties - the TypeScript properties of a `OriginShieldProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginShieldPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("originShieldRegion", cdk.validateString)(properties.originShieldRegion));
  return errors.wrap("supplied properties not correct for \"OriginShieldProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginShieldPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginShieldPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "OriginShieldRegion": cdk.stringToCloudFormation(properties.originShieldRegion)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginShieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginShieldProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginShieldProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("originShieldRegion", "OriginShieldRegion", (properties.OriginShieldRegion != null ? cfn_parse.FromCloudFormation.getString(properties.OriginShieldRegion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3OriginConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3OriginConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionS3OriginConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("originAccessIdentity", cdk.validateString)(properties.originAccessIdentity));
  return errors.wrap("supplied properties not correct for \"S3OriginConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionS3OriginConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionS3OriginConfigPropertyValidator(properties).assertSuccess();
  return {
    "OriginAccessIdentity": cdk.stringToCloudFormation(properties.originAccessIdentity)
  };
}

// @ts-ignore TS6133
function CfnDistributionS3OriginConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.S3OriginConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.S3OriginConfigProperty>();
  ret.addPropertyResult("originAccessIdentity", "OriginAccessIdentity", (properties.OriginAccessIdentity != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessIdentity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomOriginConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CustomOriginConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCustomOriginConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpPort", cdk.validateNumber)(properties.httpPort));
  errors.collect(cdk.propertyValidator("httpsPort", cdk.validateNumber)(properties.httpsPort));
  errors.collect(cdk.propertyValidator("originKeepaliveTimeout", cdk.validateNumber)(properties.originKeepaliveTimeout));
  errors.collect(cdk.propertyValidator("originProtocolPolicy", cdk.requiredValidator)(properties.originProtocolPolicy));
  errors.collect(cdk.propertyValidator("originProtocolPolicy", cdk.validateString)(properties.originProtocolPolicy));
  errors.collect(cdk.propertyValidator("originReadTimeout", cdk.validateNumber)(properties.originReadTimeout));
  errors.collect(cdk.propertyValidator("originSslProtocols", cdk.listValidator(cdk.validateString))(properties.originSslProtocols));
  return errors.wrap("supplied properties not correct for \"CustomOriginConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCustomOriginConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCustomOriginConfigPropertyValidator(properties).assertSuccess();
  return {
    "HTTPPort": cdk.numberToCloudFormation(properties.httpPort),
    "HTTPSPort": cdk.numberToCloudFormation(properties.httpsPort),
    "OriginKeepaliveTimeout": cdk.numberToCloudFormation(properties.originKeepaliveTimeout),
    "OriginProtocolPolicy": cdk.stringToCloudFormation(properties.originProtocolPolicy),
    "OriginReadTimeout": cdk.numberToCloudFormation(properties.originReadTimeout),
    "OriginSSLProtocols": cdk.listMapper(cdk.stringToCloudFormation)(properties.originSslProtocols)
  };
}

// @ts-ignore TS6133
function CfnDistributionCustomOriginConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CustomOriginConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CustomOriginConfigProperty>();
  ret.addPropertyResult("httpPort", "HTTPPort", (properties.HTTPPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPPort) : undefined));
  ret.addPropertyResult("httpsPort", "HTTPSPort", (properties.HTTPSPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPSPort) : undefined));
  ret.addPropertyResult("originKeepaliveTimeout", "OriginKeepaliveTimeout", (properties.OriginKeepaliveTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.OriginKeepaliveTimeout) : undefined));
  ret.addPropertyResult("originProtocolPolicy", "OriginProtocolPolicy", (properties.OriginProtocolPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.OriginProtocolPolicy) : undefined));
  ret.addPropertyResult("originReadTimeout", "OriginReadTimeout", (properties.OriginReadTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.OriginReadTimeout) : undefined));
  ret.addPropertyResult("originSslProtocols", "OriginSSLProtocols", (properties.OriginSSLProtocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OriginSSLProtocols) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginProperty`
 *
 * @param properties - the TypeScript properties of a `OriginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionAttempts", cdk.validateNumber)(properties.connectionAttempts));
  errors.collect(cdk.propertyValidator("connectionTimeout", cdk.validateNumber)(properties.connectionTimeout));
  errors.collect(cdk.propertyValidator("customOriginConfig", CfnDistributionCustomOriginConfigPropertyValidator)(properties.customOriginConfig));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("originAccessControlId", cdk.validateString)(properties.originAccessControlId));
  errors.collect(cdk.propertyValidator("originCustomHeaders", cdk.listValidator(CfnDistributionOriginCustomHeaderPropertyValidator))(properties.originCustomHeaders));
  errors.collect(cdk.propertyValidator("originPath", cdk.validateString)(properties.originPath));
  errors.collect(cdk.propertyValidator("originShield", CfnDistributionOriginShieldPropertyValidator)(properties.originShield));
  errors.collect(cdk.propertyValidator("s3OriginConfig", CfnDistributionS3OriginConfigPropertyValidator)(properties.s3OriginConfig));
  return errors.wrap("supplied properties not correct for \"OriginProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionAttempts": cdk.numberToCloudFormation(properties.connectionAttempts),
    "ConnectionTimeout": cdk.numberToCloudFormation(properties.connectionTimeout),
    "CustomOriginConfig": convertCfnDistributionCustomOriginConfigPropertyToCloudFormation(properties.customOriginConfig),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "Id": cdk.stringToCloudFormation(properties.id),
    "OriginAccessControlId": cdk.stringToCloudFormation(properties.originAccessControlId),
    "OriginCustomHeaders": cdk.listMapper(convertCfnDistributionOriginCustomHeaderPropertyToCloudFormation)(properties.originCustomHeaders),
    "OriginPath": cdk.stringToCloudFormation(properties.originPath),
    "OriginShield": convertCfnDistributionOriginShieldPropertyToCloudFormation(properties.originShield),
    "S3OriginConfig": convertCfnDistributionS3OriginConfigPropertyToCloudFormation(properties.s3OriginConfig)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginProperty>();
  ret.addPropertyResult("connectionAttempts", "ConnectionAttempts", (properties.ConnectionAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionAttempts) : undefined));
  ret.addPropertyResult("connectionTimeout", "ConnectionTimeout", (properties.ConnectionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionTimeout) : undefined));
  ret.addPropertyResult("customOriginConfig", "CustomOriginConfig", (properties.CustomOriginConfig != null ? CfnDistributionCustomOriginConfigPropertyFromCloudFormation(properties.CustomOriginConfig) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("originAccessControlId", "OriginAccessControlId", (properties.OriginAccessControlId != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessControlId) : undefined));
  ret.addPropertyResult("originCustomHeaders", "OriginCustomHeaders", (properties.OriginCustomHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginCustomHeaderPropertyFromCloudFormation)(properties.OriginCustomHeaders) : undefined));
  ret.addPropertyResult("originPath", "OriginPath", (properties.OriginPath != null ? cfn_parse.FromCloudFormation.getString(properties.OriginPath) : undefined));
  ret.addPropertyResult("originShield", "OriginShield", (properties.OriginShield != null ? CfnDistributionOriginShieldPropertyFromCloudFormation(properties.OriginShield) : undefined));
  ret.addPropertyResult("s3OriginConfig", "S3OriginConfig", (properties.S3OriginConfig != null ? CfnDistributionS3OriginConfigPropertyFromCloudFormation(properties.S3OriginConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ViewerCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ViewerCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionViewerCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acmCertificateArn", cdk.validateString)(properties.acmCertificateArn));
  errors.collect(cdk.propertyValidator("cloudFrontDefaultCertificate", cdk.validateBoolean)(properties.cloudFrontDefaultCertificate));
  errors.collect(cdk.propertyValidator("iamCertificateId", cdk.validateString)(properties.iamCertificateId));
  errors.collect(cdk.propertyValidator("minimumProtocolVersion", cdk.validateString)(properties.minimumProtocolVersion));
  errors.collect(cdk.propertyValidator("sslSupportMethod", cdk.validateString)(properties.sslSupportMethod));
  return errors.wrap("supplied properties not correct for \"ViewerCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionViewerCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionViewerCertificatePropertyValidator(properties).assertSuccess();
  return {
    "AcmCertificateArn": cdk.stringToCloudFormation(properties.acmCertificateArn),
    "CloudFrontDefaultCertificate": cdk.booleanToCloudFormation(properties.cloudFrontDefaultCertificate),
    "IamCertificateId": cdk.stringToCloudFormation(properties.iamCertificateId),
    "MinimumProtocolVersion": cdk.stringToCloudFormation(properties.minimumProtocolVersion),
    "SslSupportMethod": cdk.stringToCloudFormation(properties.sslSupportMethod)
  };
}

// @ts-ignore TS6133
function CfnDistributionViewerCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.ViewerCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.ViewerCertificateProperty>();
  ret.addPropertyResult("acmCertificateArn", "AcmCertificateArn", (properties.AcmCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.AcmCertificateArn) : undefined));
  ret.addPropertyResult("cloudFrontDefaultCertificate", "CloudFrontDefaultCertificate", (properties.CloudFrontDefaultCertificate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudFrontDefaultCertificate) : undefined));
  ret.addPropertyResult("iamCertificateId", "IamCertificateId", (properties.IamCertificateId != null ? cfn_parse.FromCloudFormation.getString(properties.IamCertificateId) : undefined));
  ret.addPropertyResult("minimumProtocolVersion", "MinimumProtocolVersion", (properties.MinimumProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.MinimumProtocolVersion) : undefined));
  ret.addPropertyResult("sslSupportMethod", "SslSupportMethod", (properties.SslSupportMethod != null ? cfn_parse.FromCloudFormation.getString(properties.SslSupportMethod) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LegacyCustomOriginProperty`
 *
 * @param properties - the TypeScript properties of a `LegacyCustomOriginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionLegacyCustomOriginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dnsName", cdk.requiredValidator)(properties.dnsName));
  errors.collect(cdk.propertyValidator("dnsName", cdk.validateString)(properties.dnsName));
  errors.collect(cdk.propertyValidator("httpPort", cdk.validateNumber)(properties.httpPort));
  errors.collect(cdk.propertyValidator("httpsPort", cdk.validateNumber)(properties.httpsPort));
  errors.collect(cdk.propertyValidator("originProtocolPolicy", cdk.requiredValidator)(properties.originProtocolPolicy));
  errors.collect(cdk.propertyValidator("originProtocolPolicy", cdk.validateString)(properties.originProtocolPolicy));
  errors.collect(cdk.propertyValidator("originSslProtocols", cdk.requiredValidator)(properties.originSslProtocols));
  errors.collect(cdk.propertyValidator("originSslProtocols", cdk.listValidator(cdk.validateString))(properties.originSslProtocols));
  return errors.wrap("supplied properties not correct for \"LegacyCustomOriginProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionLegacyCustomOriginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionLegacyCustomOriginPropertyValidator(properties).assertSuccess();
  return {
    "DNSName": cdk.stringToCloudFormation(properties.dnsName),
    "HTTPPort": cdk.numberToCloudFormation(properties.httpPort),
    "HTTPSPort": cdk.numberToCloudFormation(properties.httpsPort),
    "OriginProtocolPolicy": cdk.stringToCloudFormation(properties.originProtocolPolicy),
    "OriginSSLProtocols": cdk.listMapper(cdk.stringToCloudFormation)(properties.originSslProtocols)
  };
}

// @ts-ignore TS6133
function CfnDistributionLegacyCustomOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.LegacyCustomOriginProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LegacyCustomOriginProperty>();
  ret.addPropertyResult("dnsName", "DNSName", (properties.DNSName != null ? cfn_parse.FromCloudFormation.getString(properties.DNSName) : undefined));
  ret.addPropertyResult("httpPort", "HTTPPort", (properties.HTTPPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPPort) : undefined));
  ret.addPropertyResult("httpsPort", "HTTPSPort", (properties.HTTPSPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HTTPSPort) : undefined));
  ret.addPropertyResult("originProtocolPolicy", "OriginProtocolPolicy", (properties.OriginProtocolPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.OriginProtocolPolicy) : undefined));
  ret.addPropertyResult("originSslProtocols", "OriginSSLProtocols", (properties.OriginSSLProtocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OriginSSLProtocols) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LegacyS3OriginProperty`
 *
 * @param properties - the TypeScript properties of a `LegacyS3OriginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionLegacyS3OriginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dnsName", cdk.requiredValidator)(properties.dnsName));
  errors.collect(cdk.propertyValidator("dnsName", cdk.validateString)(properties.dnsName));
  errors.collect(cdk.propertyValidator("originAccessIdentity", cdk.validateString)(properties.originAccessIdentity));
  return errors.wrap("supplied properties not correct for \"LegacyS3OriginProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionLegacyS3OriginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionLegacyS3OriginPropertyValidator(properties).assertSuccess();
  return {
    "DNSName": cdk.stringToCloudFormation(properties.dnsName),
    "OriginAccessIdentity": cdk.stringToCloudFormation(properties.originAccessIdentity)
  };
}

// @ts-ignore TS6133
function CfnDistributionLegacyS3OriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.LegacyS3OriginProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LegacyS3OriginProperty>();
  ret.addPropertyResult("dnsName", "DNSName", (properties.DNSName != null ? cfn_parse.FromCloudFormation.getString(properties.DNSName) : undefined));
  ret.addPropertyResult("originAccessIdentity", "OriginAccessIdentity", (properties.OriginAccessIdentity != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessIdentity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionAssociationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionFunctionAssociationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventType", cdk.validateString)(properties.eventType));
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  return errors.wrap("supplied properties not correct for \"FunctionAssociationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionFunctionAssociationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionFunctionAssociationPropertyValidator(properties).assertSuccess();
  return {
    "EventType": cdk.stringToCloudFormation(properties.eventType),
    "FunctionARN": cdk.stringToCloudFormation(properties.functionArn)
  };
}

// @ts-ignore TS6133
function CfnDistributionFunctionAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.FunctionAssociationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.FunctionAssociationProperty>();
  ret.addPropertyResult("eventType", "EventType", (properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined));
  ret.addPropertyResult("functionArn", "FunctionARN", (properties.FunctionARN != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaFunctionAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionAssociationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionLambdaFunctionAssociationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventType", cdk.validateString)(properties.eventType));
  errors.collect(cdk.propertyValidator("includeBody", cdk.validateBoolean)(properties.includeBody));
  errors.collect(cdk.propertyValidator("lambdaFunctionArn", cdk.validateString)(properties.lambdaFunctionArn));
  return errors.wrap("supplied properties not correct for \"LambdaFunctionAssociationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionLambdaFunctionAssociationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionLambdaFunctionAssociationPropertyValidator(properties).assertSuccess();
  return {
    "EventType": cdk.stringToCloudFormation(properties.eventType),
    "IncludeBody": cdk.booleanToCloudFormation(properties.includeBody),
    "LambdaFunctionARN": cdk.stringToCloudFormation(properties.lambdaFunctionArn)
  };
}

// @ts-ignore TS6133
function CfnDistributionLambdaFunctionAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.LambdaFunctionAssociationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.LambdaFunctionAssociationProperty>();
  ret.addPropertyResult("eventType", "EventType", (properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined));
  ret.addPropertyResult("includeBody", "IncludeBody", (properties.IncludeBody != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeBody) : undefined));
  ret.addPropertyResult("lambdaFunctionArn", "LambdaFunctionARN", (properties.LambdaFunctionARN != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookiesProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCookiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("forward", cdk.requiredValidator)(properties.forward));
  errors.collect(cdk.propertyValidator("forward", cdk.validateString)(properties.forward));
  errors.collect(cdk.propertyValidator("whitelistedNames", cdk.listValidator(cdk.validateString))(properties.whitelistedNames));
  return errors.wrap("supplied properties not correct for \"CookiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCookiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCookiesPropertyValidator(properties).assertSuccess();
  return {
    "Forward": cdk.stringToCloudFormation(properties.forward),
    "WhitelistedNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.whitelistedNames)
  };
}

// @ts-ignore TS6133
function CfnDistributionCookiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CookiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CookiesProperty>();
  ret.addPropertyResult("forward", "Forward", (properties.Forward != null ? cfn_parse.FromCloudFormation.getString(properties.Forward) : undefined));
  ret.addPropertyResult("whitelistedNames", "WhitelistedNames", (properties.WhitelistedNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.WhitelistedNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ForwardedValuesProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardedValuesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionForwardedValuesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookies", CfnDistributionCookiesPropertyValidator)(properties.cookies));
  errors.collect(cdk.propertyValidator("headers", cdk.listValidator(cdk.validateString))(properties.headers));
  errors.collect(cdk.propertyValidator("queryString", cdk.requiredValidator)(properties.queryString));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateBoolean)(properties.queryString));
  errors.collect(cdk.propertyValidator("queryStringCacheKeys", cdk.listValidator(cdk.validateString))(properties.queryStringCacheKeys));
  return errors.wrap("supplied properties not correct for \"ForwardedValuesProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionForwardedValuesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionForwardedValuesPropertyValidator(properties).assertSuccess();
  return {
    "Cookies": convertCfnDistributionCookiesPropertyToCloudFormation(properties.cookies),
    "Headers": cdk.listMapper(cdk.stringToCloudFormation)(properties.headers),
    "QueryString": cdk.booleanToCloudFormation(properties.queryString),
    "QueryStringCacheKeys": cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStringCacheKeys)
  };
}

// @ts-ignore TS6133
function CfnDistributionForwardedValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.ForwardedValuesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.ForwardedValuesProperty>();
  ret.addPropertyResult("cookies", "Cookies", (properties.Cookies != null ? CfnDistributionCookiesPropertyFromCloudFormation(properties.Cookies) : undefined));
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Headers) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getBoolean(properties.QueryString) : undefined));
  ret.addPropertyResult("queryStringCacheKeys", "QueryStringCacheKeys", (properties.QueryStringCacheKeys != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.QueryStringCacheKeys) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultCacheBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultCacheBehaviorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionDefaultCacheBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedMethods", cdk.listValidator(cdk.validateString))(properties.allowedMethods));
  errors.collect(cdk.propertyValidator("cachePolicyId", cdk.validateString)(properties.cachePolicyId));
  errors.collect(cdk.propertyValidator("cachedMethods", cdk.listValidator(cdk.validateString))(properties.cachedMethods));
  errors.collect(cdk.propertyValidator("compress", cdk.validateBoolean)(properties.compress));
  errors.collect(cdk.propertyValidator("defaultTtl", cdk.validateNumber)(properties.defaultTtl));
  errors.collect(cdk.propertyValidator("fieldLevelEncryptionId", cdk.validateString)(properties.fieldLevelEncryptionId));
  errors.collect(cdk.propertyValidator("forwardedValues", CfnDistributionForwardedValuesPropertyValidator)(properties.forwardedValues));
  errors.collect(cdk.propertyValidator("functionAssociations", cdk.listValidator(CfnDistributionFunctionAssociationPropertyValidator))(properties.functionAssociations));
  errors.collect(cdk.propertyValidator("lambdaFunctionAssociations", cdk.listValidator(CfnDistributionLambdaFunctionAssociationPropertyValidator))(properties.lambdaFunctionAssociations));
  errors.collect(cdk.propertyValidator("maxTtl", cdk.validateNumber)(properties.maxTtl));
  errors.collect(cdk.propertyValidator("minTtl", cdk.validateNumber)(properties.minTtl));
  errors.collect(cdk.propertyValidator("originRequestPolicyId", cdk.validateString)(properties.originRequestPolicyId));
  errors.collect(cdk.propertyValidator("realtimeLogConfigArn", cdk.validateString)(properties.realtimeLogConfigArn));
  errors.collect(cdk.propertyValidator("responseHeadersPolicyId", cdk.validateString)(properties.responseHeadersPolicyId));
  errors.collect(cdk.propertyValidator("smoothStreaming", cdk.validateBoolean)(properties.smoothStreaming));
  errors.collect(cdk.propertyValidator("targetOriginId", cdk.requiredValidator)(properties.targetOriginId));
  errors.collect(cdk.propertyValidator("targetOriginId", cdk.validateString)(properties.targetOriginId));
  errors.collect(cdk.propertyValidator("trustedKeyGroups", cdk.listValidator(cdk.validateString))(properties.trustedKeyGroups));
  errors.collect(cdk.propertyValidator("trustedSigners", cdk.listValidator(cdk.validateString))(properties.trustedSigners));
  errors.collect(cdk.propertyValidator("viewerProtocolPolicy", cdk.requiredValidator)(properties.viewerProtocolPolicy));
  errors.collect(cdk.propertyValidator("viewerProtocolPolicy", cdk.validateString)(properties.viewerProtocolPolicy));
  return errors.wrap("supplied properties not correct for \"DefaultCacheBehaviorProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionDefaultCacheBehaviorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionDefaultCacheBehaviorPropertyValidator(properties).assertSuccess();
  return {
    "AllowedMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedMethods),
    "CachePolicyId": cdk.stringToCloudFormation(properties.cachePolicyId),
    "CachedMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.cachedMethods),
    "Compress": cdk.booleanToCloudFormation(properties.compress),
    "DefaultTTL": cdk.numberToCloudFormation(properties.defaultTtl),
    "FieldLevelEncryptionId": cdk.stringToCloudFormation(properties.fieldLevelEncryptionId),
    "ForwardedValues": convertCfnDistributionForwardedValuesPropertyToCloudFormation(properties.forwardedValues),
    "FunctionAssociations": cdk.listMapper(convertCfnDistributionFunctionAssociationPropertyToCloudFormation)(properties.functionAssociations),
    "LambdaFunctionAssociations": cdk.listMapper(convertCfnDistributionLambdaFunctionAssociationPropertyToCloudFormation)(properties.lambdaFunctionAssociations),
    "MaxTTL": cdk.numberToCloudFormation(properties.maxTtl),
    "MinTTL": cdk.numberToCloudFormation(properties.minTtl),
    "OriginRequestPolicyId": cdk.stringToCloudFormation(properties.originRequestPolicyId),
    "RealtimeLogConfigArn": cdk.stringToCloudFormation(properties.realtimeLogConfigArn),
    "ResponseHeadersPolicyId": cdk.stringToCloudFormation(properties.responseHeadersPolicyId),
    "SmoothStreaming": cdk.booleanToCloudFormation(properties.smoothStreaming),
    "TargetOriginId": cdk.stringToCloudFormation(properties.targetOriginId),
    "TrustedKeyGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedKeyGroups),
    "TrustedSigners": cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedSigners),
    "ViewerProtocolPolicy": cdk.stringToCloudFormation(properties.viewerProtocolPolicy)
  };
}

// @ts-ignore TS6133
function CfnDistributionDefaultCacheBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.DefaultCacheBehaviorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.DefaultCacheBehaviorProperty>();
  ret.addPropertyResult("allowedMethods", "AllowedMethods", (properties.AllowedMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedMethods) : undefined));
  ret.addPropertyResult("cachedMethods", "CachedMethods", (properties.CachedMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CachedMethods) : undefined));
  ret.addPropertyResult("cachePolicyId", "CachePolicyId", (properties.CachePolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.CachePolicyId) : undefined));
  ret.addPropertyResult("compress", "Compress", (properties.Compress != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Compress) : undefined));
  ret.addPropertyResult("defaultTtl", "DefaultTTL", (properties.DefaultTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL) : undefined));
  ret.addPropertyResult("fieldLevelEncryptionId", "FieldLevelEncryptionId", (properties.FieldLevelEncryptionId != null ? cfn_parse.FromCloudFormation.getString(properties.FieldLevelEncryptionId) : undefined));
  ret.addPropertyResult("forwardedValues", "ForwardedValues", (properties.ForwardedValues != null ? CfnDistributionForwardedValuesPropertyFromCloudFormation(properties.ForwardedValues) : undefined));
  ret.addPropertyResult("functionAssociations", "FunctionAssociations", (properties.FunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionFunctionAssociationPropertyFromCloudFormation)(properties.FunctionAssociations) : undefined));
  ret.addPropertyResult("lambdaFunctionAssociations", "LambdaFunctionAssociations", (properties.LambdaFunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionLambdaFunctionAssociationPropertyFromCloudFormation)(properties.LambdaFunctionAssociations) : undefined));
  ret.addPropertyResult("maxTtl", "MaxTTL", (properties.MaxTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTTL) : undefined));
  ret.addPropertyResult("minTtl", "MinTTL", (properties.MinTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinTTL) : undefined));
  ret.addPropertyResult("originRequestPolicyId", "OriginRequestPolicyId", (properties.OriginRequestPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.OriginRequestPolicyId) : undefined));
  ret.addPropertyResult("realtimeLogConfigArn", "RealtimeLogConfigArn", (properties.RealtimeLogConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.RealtimeLogConfigArn) : undefined));
  ret.addPropertyResult("responseHeadersPolicyId", "ResponseHeadersPolicyId", (properties.ResponseHeadersPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseHeadersPolicyId) : undefined));
  ret.addPropertyResult("smoothStreaming", "SmoothStreaming", (properties.SmoothStreaming != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SmoothStreaming) : undefined));
  ret.addPropertyResult("targetOriginId", "TargetOriginId", (properties.TargetOriginId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetOriginId) : undefined));
  ret.addPropertyResult("trustedKeyGroups", "TrustedKeyGroups", (properties.TrustedKeyGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TrustedKeyGroups) : undefined));
  ret.addPropertyResult("trustedSigners", "TrustedSigners", (properties.TrustedSigners != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TrustedSigners) : undefined));
  ret.addPropertyResult("viewerProtocolPolicy", "ViewerProtocolPolicy", (properties.ViewerProtocolPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ViewerProtocolPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomErrorResponseProperty`
 *
 * @param properties - the TypeScript properties of a `CustomErrorResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCustomErrorResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("errorCachingMinTtl", cdk.validateNumber)(properties.errorCachingMinTtl));
  errors.collect(cdk.propertyValidator("errorCode", cdk.requiredValidator)(properties.errorCode));
  errors.collect(cdk.propertyValidator("errorCode", cdk.validateNumber)(properties.errorCode));
  errors.collect(cdk.propertyValidator("responseCode", cdk.validateNumber)(properties.responseCode));
  errors.collect(cdk.propertyValidator("responsePagePath", cdk.validateString)(properties.responsePagePath));
  return errors.wrap("supplied properties not correct for \"CustomErrorResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCustomErrorResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCustomErrorResponsePropertyValidator(properties).assertSuccess();
  return {
    "ErrorCachingMinTTL": cdk.numberToCloudFormation(properties.errorCachingMinTtl),
    "ErrorCode": cdk.numberToCloudFormation(properties.errorCode),
    "ResponseCode": cdk.numberToCloudFormation(properties.responseCode),
    "ResponsePagePath": cdk.stringToCloudFormation(properties.responsePagePath)
  };
}

// @ts-ignore TS6133
function CfnDistributionCustomErrorResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CustomErrorResponseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CustomErrorResponseProperty>();
  ret.addPropertyResult("errorCachingMinTtl", "ErrorCachingMinTTL", (properties.ErrorCachingMinTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorCachingMinTTL) : undefined));
  ret.addPropertyResult("errorCode", "ErrorCode", (properties.ErrorCode != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorCode) : undefined));
  ret.addPropertyResult("responseCode", "ResponseCode", (properties.ResponseCode != null ? cfn_parse.FromCloudFormation.getNumber(properties.ResponseCode) : undefined));
  ret.addPropertyResult("responsePagePath", "ResponsePagePath", (properties.ResponsePagePath != null ? cfn_parse.FromCloudFormation.getString(properties.ResponsePagePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatusCodesProperty`
 *
 * @param properties - the TypeScript properties of a `StatusCodesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionStatusCodesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(cdk.validateNumber))(properties.items));
  errors.collect(cdk.propertyValidator("quantity", cdk.requiredValidator)(properties.quantity));
  errors.collect(cdk.propertyValidator("quantity", cdk.validateNumber)(properties.quantity));
  return errors.wrap("supplied properties not correct for \"StatusCodesProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionStatusCodesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionStatusCodesPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(cdk.numberToCloudFormation)(properties.items),
    "Quantity": cdk.numberToCloudFormation(properties.quantity)
  };
}

// @ts-ignore TS6133
function CfnDistributionStatusCodesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.StatusCodesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.StatusCodesProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Items) : undefined));
  ret.addPropertyResult("quantity", "Quantity", (properties.Quantity != null ? cfn_parse.FromCloudFormation.getNumber(properties.Quantity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginGroupFailoverCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupFailoverCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginGroupFailoverCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statusCodes", cdk.requiredValidator)(properties.statusCodes));
  errors.collect(cdk.propertyValidator("statusCodes", CfnDistributionStatusCodesPropertyValidator)(properties.statusCodes));
  return errors.wrap("supplied properties not correct for \"OriginGroupFailoverCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginGroupFailoverCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginGroupFailoverCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "StatusCodes": convertCfnDistributionStatusCodesPropertyToCloudFormation(properties.statusCodes)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupFailoverCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginGroupFailoverCriteriaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupFailoverCriteriaProperty>();
  ret.addPropertyResult("statusCodes", "StatusCodes", (properties.StatusCodes != null ? CfnDistributionStatusCodesPropertyFromCloudFormation(properties.StatusCodes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginGroupMemberProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupMemberProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginGroupMemberPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("originId", cdk.requiredValidator)(properties.originId));
  errors.collect(cdk.propertyValidator("originId", cdk.validateString)(properties.originId));
  return errors.wrap("supplied properties not correct for \"OriginGroupMemberProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginGroupMemberPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginGroupMemberPropertyValidator(properties).assertSuccess();
  return {
    "OriginId": cdk.stringToCloudFormation(properties.originId)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupMemberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginGroupMemberProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupMemberProperty>();
  ret.addPropertyResult("originId", "OriginId", (properties.OriginId != null ? cfn_parse.FromCloudFormation.getString(properties.OriginId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginGroupMembersProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupMembersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginGroupMembersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(CfnDistributionOriginGroupMemberPropertyValidator))(properties.items));
  errors.collect(cdk.propertyValidator("quantity", cdk.requiredValidator)(properties.quantity));
  errors.collect(cdk.propertyValidator("quantity", cdk.validateNumber)(properties.quantity));
  return errors.wrap("supplied properties not correct for \"OriginGroupMembersProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginGroupMembersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginGroupMembersPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(convertCfnDistributionOriginGroupMemberPropertyToCloudFormation)(properties.items),
    "Quantity": cdk.numberToCloudFormation(properties.quantity)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupMembersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginGroupMembersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupMembersProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginGroupMemberPropertyFromCloudFormation)(properties.Items) : undefined));
  ret.addPropertyResult("quantity", "Quantity", (properties.Quantity != null ? cfn_parse.FromCloudFormation.getNumber(properties.Quantity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginGroupProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failoverCriteria", cdk.requiredValidator)(properties.failoverCriteria));
  errors.collect(cdk.propertyValidator("failoverCriteria", CfnDistributionOriginGroupFailoverCriteriaPropertyValidator)(properties.failoverCriteria));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("members", cdk.requiredValidator)(properties.members));
  errors.collect(cdk.propertyValidator("members", CfnDistributionOriginGroupMembersPropertyValidator)(properties.members));
  return errors.wrap("supplied properties not correct for \"OriginGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginGroupPropertyValidator(properties).assertSuccess();
  return {
    "FailoverCriteria": convertCfnDistributionOriginGroupFailoverCriteriaPropertyToCloudFormation(properties.failoverCriteria),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Members": convertCfnDistributionOriginGroupMembersPropertyToCloudFormation(properties.members)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupProperty>();
  ret.addPropertyResult("failoverCriteria", "FailoverCriteria", (properties.FailoverCriteria != null ? CfnDistributionOriginGroupFailoverCriteriaPropertyFromCloudFormation(properties.FailoverCriteria) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("members", "Members", (properties.Members != null ? CfnDistributionOriginGroupMembersPropertyFromCloudFormation(properties.Members) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginGroupsProperty`
 *
 * @param properties - the TypeScript properties of a `OriginGroupsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionOriginGroupsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(CfnDistributionOriginGroupPropertyValidator))(properties.items));
  errors.collect(cdk.propertyValidator("quantity", cdk.requiredValidator)(properties.quantity));
  errors.collect(cdk.propertyValidator("quantity", cdk.validateNumber)(properties.quantity));
  return errors.wrap("supplied properties not correct for \"OriginGroupsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionOriginGroupsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionOriginGroupsPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(convertCfnDistributionOriginGroupPropertyToCloudFormation)(properties.items),
    "Quantity": cdk.numberToCloudFormation(properties.quantity)
  };
}

// @ts-ignore TS6133
function CfnDistributionOriginGroupsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.OriginGroupsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.OriginGroupsProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginGroupPropertyFromCloudFormation)(properties.Items) : undefined));
  ret.addPropertyResult("quantity", "Quantity", (properties.Quantity != null ? cfn_parse.FromCloudFormation.getNumber(properties.Quantity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GeoRestrictionProperty`
 *
 * @param properties - the TypeScript properties of a `GeoRestrictionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionGeoRestrictionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("locations", cdk.listValidator(cdk.validateString))(properties.locations));
  errors.collect(cdk.propertyValidator("restrictionType", cdk.requiredValidator)(properties.restrictionType));
  errors.collect(cdk.propertyValidator("restrictionType", cdk.validateString)(properties.restrictionType));
  return errors.wrap("supplied properties not correct for \"GeoRestrictionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionGeoRestrictionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionGeoRestrictionPropertyValidator(properties).assertSuccess();
  return {
    "Locations": cdk.listMapper(cdk.stringToCloudFormation)(properties.locations),
    "RestrictionType": cdk.stringToCloudFormation(properties.restrictionType)
  };
}

// @ts-ignore TS6133
function CfnDistributionGeoRestrictionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.GeoRestrictionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.GeoRestrictionProperty>();
  ret.addPropertyResult("locations", "Locations", (properties.Locations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Locations) : undefined));
  ret.addPropertyResult("restrictionType", "RestrictionType", (properties.RestrictionType != null ? cfn_parse.FromCloudFormation.getString(properties.RestrictionType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RestrictionsProperty`
 *
 * @param properties - the TypeScript properties of a `RestrictionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionRestrictionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("geoRestriction", cdk.requiredValidator)(properties.geoRestriction));
  errors.collect(cdk.propertyValidator("geoRestriction", CfnDistributionGeoRestrictionPropertyValidator)(properties.geoRestriction));
  return errors.wrap("supplied properties not correct for \"RestrictionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionRestrictionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionRestrictionsPropertyValidator(properties).assertSuccess();
  return {
    "GeoRestriction": convertCfnDistributionGeoRestrictionPropertyToCloudFormation(properties.geoRestriction)
  };
}

// @ts-ignore TS6133
function CfnDistributionRestrictionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.RestrictionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.RestrictionsProperty>();
  ret.addPropertyResult("geoRestriction", "GeoRestriction", (properties.GeoRestriction != null ? CfnDistributionGeoRestrictionPropertyFromCloudFormation(properties.GeoRestriction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CacheBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedMethods", cdk.listValidator(cdk.validateString))(properties.allowedMethods));
  errors.collect(cdk.propertyValidator("cachePolicyId", cdk.validateString)(properties.cachePolicyId));
  errors.collect(cdk.propertyValidator("cachedMethods", cdk.listValidator(cdk.validateString))(properties.cachedMethods));
  errors.collect(cdk.propertyValidator("compress", cdk.validateBoolean)(properties.compress));
  errors.collect(cdk.propertyValidator("defaultTtl", cdk.validateNumber)(properties.defaultTtl));
  errors.collect(cdk.propertyValidator("fieldLevelEncryptionId", cdk.validateString)(properties.fieldLevelEncryptionId));
  errors.collect(cdk.propertyValidator("forwardedValues", CfnDistributionForwardedValuesPropertyValidator)(properties.forwardedValues));
  errors.collect(cdk.propertyValidator("functionAssociations", cdk.listValidator(CfnDistributionFunctionAssociationPropertyValidator))(properties.functionAssociations));
  errors.collect(cdk.propertyValidator("lambdaFunctionAssociations", cdk.listValidator(CfnDistributionLambdaFunctionAssociationPropertyValidator))(properties.lambdaFunctionAssociations));
  errors.collect(cdk.propertyValidator("maxTtl", cdk.validateNumber)(properties.maxTtl));
  errors.collect(cdk.propertyValidator("minTtl", cdk.validateNumber)(properties.minTtl));
  errors.collect(cdk.propertyValidator("originRequestPolicyId", cdk.validateString)(properties.originRequestPolicyId));
  errors.collect(cdk.propertyValidator("pathPattern", cdk.requiredValidator)(properties.pathPattern));
  errors.collect(cdk.propertyValidator("pathPattern", cdk.validateString)(properties.pathPattern));
  errors.collect(cdk.propertyValidator("realtimeLogConfigArn", cdk.validateString)(properties.realtimeLogConfigArn));
  errors.collect(cdk.propertyValidator("responseHeadersPolicyId", cdk.validateString)(properties.responseHeadersPolicyId));
  errors.collect(cdk.propertyValidator("smoothStreaming", cdk.validateBoolean)(properties.smoothStreaming));
  errors.collect(cdk.propertyValidator("targetOriginId", cdk.requiredValidator)(properties.targetOriginId));
  errors.collect(cdk.propertyValidator("targetOriginId", cdk.validateString)(properties.targetOriginId));
  errors.collect(cdk.propertyValidator("trustedKeyGroups", cdk.listValidator(cdk.validateString))(properties.trustedKeyGroups));
  errors.collect(cdk.propertyValidator("trustedSigners", cdk.listValidator(cdk.validateString))(properties.trustedSigners));
  errors.collect(cdk.propertyValidator("viewerProtocolPolicy", cdk.requiredValidator)(properties.viewerProtocolPolicy));
  errors.collect(cdk.propertyValidator("viewerProtocolPolicy", cdk.validateString)(properties.viewerProtocolPolicy));
  return errors.wrap("supplied properties not correct for \"CacheBehaviorProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCacheBehaviorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCacheBehaviorPropertyValidator(properties).assertSuccess();
  return {
    "AllowedMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedMethods),
    "CachePolicyId": cdk.stringToCloudFormation(properties.cachePolicyId),
    "CachedMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.cachedMethods),
    "Compress": cdk.booleanToCloudFormation(properties.compress),
    "DefaultTTL": cdk.numberToCloudFormation(properties.defaultTtl),
    "FieldLevelEncryptionId": cdk.stringToCloudFormation(properties.fieldLevelEncryptionId),
    "ForwardedValues": convertCfnDistributionForwardedValuesPropertyToCloudFormation(properties.forwardedValues),
    "FunctionAssociations": cdk.listMapper(convertCfnDistributionFunctionAssociationPropertyToCloudFormation)(properties.functionAssociations),
    "LambdaFunctionAssociations": cdk.listMapper(convertCfnDistributionLambdaFunctionAssociationPropertyToCloudFormation)(properties.lambdaFunctionAssociations),
    "MaxTTL": cdk.numberToCloudFormation(properties.maxTtl),
    "MinTTL": cdk.numberToCloudFormation(properties.minTtl),
    "OriginRequestPolicyId": cdk.stringToCloudFormation(properties.originRequestPolicyId),
    "PathPattern": cdk.stringToCloudFormation(properties.pathPattern),
    "RealtimeLogConfigArn": cdk.stringToCloudFormation(properties.realtimeLogConfigArn),
    "ResponseHeadersPolicyId": cdk.stringToCloudFormation(properties.responseHeadersPolicyId),
    "SmoothStreaming": cdk.booleanToCloudFormation(properties.smoothStreaming),
    "TargetOriginId": cdk.stringToCloudFormation(properties.targetOriginId),
    "TrustedKeyGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedKeyGroups),
    "TrustedSigners": cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedSigners),
    "ViewerProtocolPolicy": cdk.stringToCloudFormation(properties.viewerProtocolPolicy)
  };
}

// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheBehaviorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheBehaviorProperty>();
  ret.addPropertyResult("allowedMethods", "AllowedMethods", (properties.AllowedMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedMethods) : undefined));
  ret.addPropertyResult("cachedMethods", "CachedMethods", (properties.CachedMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CachedMethods) : undefined));
  ret.addPropertyResult("cachePolicyId", "CachePolicyId", (properties.CachePolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.CachePolicyId) : undefined));
  ret.addPropertyResult("compress", "Compress", (properties.Compress != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Compress) : undefined));
  ret.addPropertyResult("defaultTtl", "DefaultTTL", (properties.DefaultTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL) : undefined));
  ret.addPropertyResult("fieldLevelEncryptionId", "FieldLevelEncryptionId", (properties.FieldLevelEncryptionId != null ? cfn_parse.FromCloudFormation.getString(properties.FieldLevelEncryptionId) : undefined));
  ret.addPropertyResult("forwardedValues", "ForwardedValues", (properties.ForwardedValues != null ? CfnDistributionForwardedValuesPropertyFromCloudFormation(properties.ForwardedValues) : undefined));
  ret.addPropertyResult("functionAssociations", "FunctionAssociations", (properties.FunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionFunctionAssociationPropertyFromCloudFormation)(properties.FunctionAssociations) : undefined));
  ret.addPropertyResult("lambdaFunctionAssociations", "LambdaFunctionAssociations", (properties.LambdaFunctionAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionLambdaFunctionAssociationPropertyFromCloudFormation)(properties.LambdaFunctionAssociations) : undefined));
  ret.addPropertyResult("maxTtl", "MaxTTL", (properties.MaxTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTTL) : undefined));
  ret.addPropertyResult("minTtl", "MinTTL", (properties.MinTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinTTL) : undefined));
  ret.addPropertyResult("originRequestPolicyId", "OriginRequestPolicyId", (properties.OriginRequestPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.OriginRequestPolicyId) : undefined));
  ret.addPropertyResult("pathPattern", "PathPattern", (properties.PathPattern != null ? cfn_parse.FromCloudFormation.getString(properties.PathPattern) : undefined));
  ret.addPropertyResult("realtimeLogConfigArn", "RealtimeLogConfigArn", (properties.RealtimeLogConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.RealtimeLogConfigArn) : undefined));
  ret.addPropertyResult("responseHeadersPolicyId", "ResponseHeadersPolicyId", (properties.ResponseHeadersPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseHeadersPolicyId) : undefined));
  ret.addPropertyResult("smoothStreaming", "SmoothStreaming", (properties.SmoothStreaming != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SmoothStreaming) : undefined));
  ret.addPropertyResult("targetOriginId", "TargetOriginId", (properties.TargetOriginId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetOriginId) : undefined));
  ret.addPropertyResult("trustedKeyGroups", "TrustedKeyGroups", (properties.TrustedKeyGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TrustedKeyGroups) : undefined));
  ret.addPropertyResult("trustedSigners", "TrustedSigners", (properties.TrustedSigners != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TrustedSigners) : undefined));
  ret.addPropertyResult("viewerProtocolPolicy", "ViewerProtocolPolicy", (properties.ViewerProtocolPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ViewerProtocolPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DistributionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DistributionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionDistributionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aliases", cdk.listValidator(cdk.validateString))(properties.aliases));
  errors.collect(cdk.propertyValidator("cnamEs", cdk.listValidator(cdk.validateString))(properties.cnamEs));
  errors.collect(cdk.propertyValidator("cacheBehaviors", cdk.listValidator(CfnDistributionCacheBehaviorPropertyValidator))(properties.cacheBehaviors));
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("continuousDeploymentPolicyId", cdk.validateString)(properties.continuousDeploymentPolicyId));
  errors.collect(cdk.propertyValidator("customErrorResponses", cdk.listValidator(CfnDistributionCustomErrorResponsePropertyValidator))(properties.customErrorResponses));
  errors.collect(cdk.propertyValidator("customOrigin", CfnDistributionLegacyCustomOriginPropertyValidator)(properties.customOrigin));
  errors.collect(cdk.propertyValidator("defaultCacheBehavior", cdk.requiredValidator)(properties.defaultCacheBehavior));
  errors.collect(cdk.propertyValidator("defaultCacheBehavior", CfnDistributionDefaultCacheBehaviorPropertyValidator)(properties.defaultCacheBehavior));
  errors.collect(cdk.propertyValidator("defaultRootObject", cdk.validateString)(properties.defaultRootObject));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("httpVersion", cdk.validateString)(properties.httpVersion));
  errors.collect(cdk.propertyValidator("ipv6Enabled", cdk.validateBoolean)(properties.ipv6Enabled));
  errors.collect(cdk.propertyValidator("logging", CfnDistributionLoggingPropertyValidator)(properties.logging));
  errors.collect(cdk.propertyValidator("originGroups", CfnDistributionOriginGroupsPropertyValidator)(properties.originGroups));
  errors.collect(cdk.propertyValidator("origins", cdk.listValidator(CfnDistributionOriginPropertyValidator))(properties.origins));
  errors.collect(cdk.propertyValidator("priceClass", cdk.validateString)(properties.priceClass));
  errors.collect(cdk.propertyValidator("restrictions", CfnDistributionRestrictionsPropertyValidator)(properties.restrictions));
  errors.collect(cdk.propertyValidator("s3Origin", CfnDistributionLegacyS3OriginPropertyValidator)(properties.s3Origin));
  errors.collect(cdk.propertyValidator("staging", cdk.validateBoolean)(properties.staging));
  errors.collect(cdk.propertyValidator("viewerCertificate", CfnDistributionViewerCertificatePropertyValidator)(properties.viewerCertificate));
  errors.collect(cdk.propertyValidator("webAclId", cdk.validateString)(properties.webAclId));
  return errors.wrap("supplied properties not correct for \"DistributionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionDistributionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionDistributionConfigPropertyValidator(properties).assertSuccess();
  return {
    "Aliases": cdk.listMapper(cdk.stringToCloudFormation)(properties.aliases),
    "CNAMEs": cdk.listMapper(cdk.stringToCloudFormation)(properties.cnamEs),
    "CacheBehaviors": cdk.listMapper(convertCfnDistributionCacheBehaviorPropertyToCloudFormation)(properties.cacheBehaviors),
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "ContinuousDeploymentPolicyId": cdk.stringToCloudFormation(properties.continuousDeploymentPolicyId),
    "CustomErrorResponses": cdk.listMapper(convertCfnDistributionCustomErrorResponsePropertyToCloudFormation)(properties.customErrorResponses),
    "CustomOrigin": convertCfnDistributionLegacyCustomOriginPropertyToCloudFormation(properties.customOrigin),
    "DefaultCacheBehavior": convertCfnDistributionDefaultCacheBehaviorPropertyToCloudFormation(properties.defaultCacheBehavior),
    "DefaultRootObject": cdk.stringToCloudFormation(properties.defaultRootObject),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "HttpVersion": cdk.stringToCloudFormation(properties.httpVersion),
    "IPV6Enabled": cdk.booleanToCloudFormation(properties.ipv6Enabled),
    "Logging": convertCfnDistributionLoggingPropertyToCloudFormation(properties.logging),
    "OriginGroups": convertCfnDistributionOriginGroupsPropertyToCloudFormation(properties.originGroups),
    "Origins": cdk.listMapper(convertCfnDistributionOriginPropertyToCloudFormation)(properties.origins),
    "PriceClass": cdk.stringToCloudFormation(properties.priceClass),
    "Restrictions": convertCfnDistributionRestrictionsPropertyToCloudFormation(properties.restrictions),
    "S3Origin": convertCfnDistributionLegacyS3OriginPropertyToCloudFormation(properties.s3Origin),
    "Staging": cdk.booleanToCloudFormation(properties.staging),
    "ViewerCertificate": convertCfnDistributionViewerCertificatePropertyToCloudFormation(properties.viewerCertificate),
    "WebACLId": cdk.stringToCloudFormation(properties.webAclId)
  };
}

// @ts-ignore TS6133
function CfnDistributionDistributionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.DistributionConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.DistributionConfigProperty>();
  ret.addPropertyResult("aliases", "Aliases", (properties.Aliases != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Aliases) : undefined));
  ret.addPropertyResult("cacheBehaviors", "CacheBehaviors", (properties.CacheBehaviors != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionCacheBehaviorPropertyFromCloudFormation)(properties.CacheBehaviors) : undefined));
  ret.addPropertyResult("cnamEs", "CNAMEs", (properties.CNAMEs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CNAMEs) : undefined));
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("continuousDeploymentPolicyId", "ContinuousDeploymentPolicyId", (properties.ContinuousDeploymentPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.ContinuousDeploymentPolicyId) : undefined));
  ret.addPropertyResult("customErrorResponses", "CustomErrorResponses", (properties.CustomErrorResponses != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionCustomErrorResponsePropertyFromCloudFormation)(properties.CustomErrorResponses) : undefined));
  ret.addPropertyResult("customOrigin", "CustomOrigin", (properties.CustomOrigin != null ? CfnDistributionLegacyCustomOriginPropertyFromCloudFormation(properties.CustomOrigin) : undefined));
  ret.addPropertyResult("defaultCacheBehavior", "DefaultCacheBehavior", (properties.DefaultCacheBehavior != null ? CfnDistributionDefaultCacheBehaviorPropertyFromCloudFormation(properties.DefaultCacheBehavior) : undefined));
  ret.addPropertyResult("defaultRootObject", "DefaultRootObject", (properties.DefaultRootObject != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultRootObject) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("httpVersion", "HttpVersion", (properties.HttpVersion != null ? cfn_parse.FromCloudFormation.getString(properties.HttpVersion) : undefined));
  ret.addPropertyResult("ipv6Enabled", "IPV6Enabled", (properties.IPV6Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IPV6Enabled) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? CfnDistributionLoggingPropertyFromCloudFormation(properties.Logging) : undefined));
  ret.addPropertyResult("originGroups", "OriginGroups", (properties.OriginGroups != null ? CfnDistributionOriginGroupsPropertyFromCloudFormation(properties.OriginGroups) : undefined));
  ret.addPropertyResult("origins", "Origins", (properties.Origins != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionOriginPropertyFromCloudFormation)(properties.Origins) : undefined));
  ret.addPropertyResult("priceClass", "PriceClass", (properties.PriceClass != null ? cfn_parse.FromCloudFormation.getString(properties.PriceClass) : undefined));
  ret.addPropertyResult("restrictions", "Restrictions", (properties.Restrictions != null ? CfnDistributionRestrictionsPropertyFromCloudFormation(properties.Restrictions) : undefined));
  ret.addPropertyResult("s3Origin", "S3Origin", (properties.S3Origin != null ? CfnDistributionLegacyS3OriginPropertyFromCloudFormation(properties.S3Origin) : undefined));
  ret.addPropertyResult("staging", "Staging", (properties.Staging != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Staging) : undefined));
  ret.addPropertyResult("viewerCertificate", "ViewerCertificate", (properties.ViewerCertificate != null ? CfnDistributionViewerCertificatePropertyFromCloudFormation(properties.ViewerCertificate) : undefined));
  ret.addPropertyResult("webAclId", "WebACLId", (properties.WebACLId != null ? cfn_parse.FromCloudFormation.getString(properties.WebACLId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDistributionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDistributionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("distributionConfig", cdk.requiredValidator)(properties.distributionConfig));
  errors.collect(cdk.propertyValidator("distributionConfig", CfnDistributionDistributionConfigPropertyValidator)(properties.distributionConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDistributionProps\"");
}

// @ts-ignore TS6133
function convertCfnDistributionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionPropsValidator(properties).assertSuccess();
  return {
    "DistributionConfig": convertCfnDistributionDistributionConfigPropertyToCloudFormation(properties.distributionConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDistributionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionProps>();
  ret.addPropertyResult("distributionConfig", "DistributionConfig", (properties.DistributionConfig != null ? CfnDistributionDistributionConfigPropertyFromCloudFormation(properties.DistributionConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html
 */
export class CfnFunction extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::Function";

  /**
   * Build a CfnFunction from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFunction(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
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
   *
   * @cloudformationAttribute FunctionARN
   */
  public readonly attrFunctionArn: string;

  /**
   * @cloudformationAttribute FunctionMetadata.FunctionARN
   */
  public readonly attrFunctionMetadataFunctionArn: string;

  /**
   * @cloudformationAttribute Stage
   */
  public readonly attrStage: string;

  /**
   * A flag that determines whether to automatically publish the function to the `LIVE` stage when it’s created.
   */
  public autoPublish?: boolean | cdk.IResolvable;

  /**
   * The function code.
   */
  public functionCode: string;

  /**
   * Contains configuration information about a CloudFront function.
   */
  public functionConfig: CfnFunction.FunctionConfigProperty | cdk.IResolvable;

  /**
   * Contains metadata about a CloudFront function.
   */
  public functionMetadata?: CfnFunction.FunctionMetadataProperty | cdk.IResolvable;

  /**
   * A name to identify the function.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFunctionProps) {
    super(scope, id, {
      "type": CfnFunction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "functionCode", this);
    cdk.requireProperty(props, "functionConfig", this);
    cdk.requireProperty(props, "name", this);

    this.attrFunctionArn = cdk.Token.asString(this.getAtt("FunctionARN", cdk.ResolutionTypeHint.STRING));
    this.attrFunctionMetadataFunctionArn = cdk.Token.asString(this.getAtt("FunctionMetadata.FunctionARN", cdk.ResolutionTypeHint.STRING));
    this.attrStage = cdk.Token.asString(this.getAtt("Stage", cdk.ResolutionTypeHint.STRING));
    this.autoPublish = props.autoPublish;
    this.functionCode = props.functionCode;
    this.functionConfig = props.functionConfig;
    this.functionMetadata = props.functionMetadata;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoPublish": this.autoPublish,
      "functionCode": this.functionCode,
      "functionConfig": this.functionConfig,
      "functionMetadata": this.functionMetadata,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFunctionPropsToCloudFormation(props);
  }
}

export namespace CfnFunction {
  /**
   * Contains configuration information about a CloudFront function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html
   */
  export interface FunctionConfigProperty {
    /**
     * A comment to describe the function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html#cfn-cloudfront-function-functionconfig-comment
     */
    readonly comment: string;

    /**
     * The configuration for the Key Value Store associations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html#cfn-cloudfront-function-functionconfig-keyvaluestoreassociations
     */
    readonly keyValueStoreAssociations?: Array<cdk.IResolvable | CfnFunction.KeyValueStoreAssociationProperty> | cdk.IResolvable;

    /**
     * The function's runtime environment version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionconfig.html#cfn-cloudfront-function-functionconfig-runtime
     */
    readonly runtime: string;
  }

  /**
   * The Key Value Store association.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-keyvaluestoreassociation.html
   */
  export interface KeyValueStoreAssociationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Key Value Store association.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-keyvaluestoreassociation.html#cfn-cloudfront-function-keyvaluestoreassociation-keyvaluestorearn
     */
    readonly keyValueStoreArn: string;
  }

  /**
   * Contains metadata about a CloudFront function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionmetadata.html
   */
  export interface FunctionMetadataProperty {
    /**
     * The Amazon Resource Name (ARN) of the function.
     *
     * The ARN uniquely identifies the function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-function-functionmetadata.html#cfn-cloudfront-function-functionmetadata-functionarn
     */
    readonly functionArn?: string;
  }
}

/**
 * Properties for defining a `CfnFunction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html
 */
export interface CfnFunctionProps {
  /**
   * A flag that determines whether to automatically publish the function to the `LIVE` stage when it’s created.
   *
   * To automatically publish to the `LIVE` stage, set this property to `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-autopublish
   */
  readonly autoPublish?: boolean | cdk.IResolvable;

  /**
   * The function code.
   *
   * For more information about writing a CloudFront function, see [Writing function code for CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/writing-function-code.html) in the *Amazon CloudFront Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functioncode
   */
  readonly functionCode: string;

  /**
   * Contains configuration information about a CloudFront function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionconfig
   */
  readonly functionConfig: CfnFunction.FunctionConfigProperty | cdk.IResolvable;

  /**
   * Contains metadata about a CloudFront function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-functionmetadata
   */
  readonly functionMetadata?: CfnFunction.FunctionMetadataProperty | cdk.IResolvable;

  /**
   * A name to identify the function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-function.html#cfn-cloudfront-function-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `KeyValueStoreAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValueStoreAssociationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionKeyValueStoreAssociationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyValueStoreArn", cdk.requiredValidator)(properties.keyValueStoreArn));
  errors.collect(cdk.propertyValidator("keyValueStoreArn", cdk.validateString)(properties.keyValueStoreArn));
  return errors.wrap("supplied properties not correct for \"KeyValueStoreAssociationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionKeyValueStoreAssociationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionKeyValueStoreAssociationPropertyValidator(properties).assertSuccess();
  return {
    "KeyValueStoreARN": cdk.stringToCloudFormation(properties.keyValueStoreArn)
  };
}

// @ts-ignore TS6133
function CfnFunctionKeyValueStoreAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.KeyValueStoreAssociationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.KeyValueStoreAssociationProperty>();
  ret.addPropertyResult("keyValueStoreArn", "KeyValueStoreARN", (properties.KeyValueStoreARN != null ? cfn_parse.FromCloudFormation.getString(properties.KeyValueStoreARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionFunctionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.requiredValidator)(properties.comment));
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("keyValueStoreAssociations", cdk.listValidator(CfnFunctionKeyValueStoreAssociationPropertyValidator))(properties.keyValueStoreAssociations));
  errors.collect(cdk.propertyValidator("runtime", cdk.requiredValidator)(properties.runtime));
  errors.collect(cdk.propertyValidator("runtime", cdk.validateString)(properties.runtime));
  return errors.wrap("supplied properties not correct for \"FunctionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionFunctionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionFunctionConfigPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "KeyValueStoreAssociations": cdk.listMapper(convertCfnFunctionKeyValueStoreAssociationPropertyToCloudFormation)(properties.keyValueStoreAssociations),
    "Runtime": cdk.stringToCloudFormation(properties.runtime)
  };
}

// @ts-ignore TS6133
function CfnFunctionFunctionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionConfigProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("keyValueStoreAssociations", "KeyValueStoreAssociations", (properties.KeyValueStoreAssociations != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionKeyValueStoreAssociationPropertyFromCloudFormation)(properties.KeyValueStoreAssociations) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionFunctionMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  return errors.wrap("supplied properties not correct for \"FunctionMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionFunctionMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionFunctionMetadataPropertyValidator(properties).assertSuccess();
  return {
    "FunctionARN": cdk.stringToCloudFormation(properties.functionArn)
  };
}

// @ts-ignore TS6133
function CfnFunctionFunctionMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionMetadataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionMetadataProperty>();
  ret.addPropertyResult("functionArn", "FunctionARN", (properties.FunctionARN != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoPublish", cdk.validateBoolean)(properties.autoPublish));
  errors.collect(cdk.propertyValidator("functionCode", cdk.requiredValidator)(properties.functionCode));
  errors.collect(cdk.propertyValidator("functionCode", cdk.validateString)(properties.functionCode));
  errors.collect(cdk.propertyValidator("functionConfig", cdk.requiredValidator)(properties.functionConfig));
  errors.collect(cdk.propertyValidator("functionConfig", CfnFunctionFunctionConfigPropertyValidator)(properties.functionConfig));
  errors.collect(cdk.propertyValidator("functionMetadata", CfnFunctionFunctionMetadataPropertyValidator)(properties.functionMetadata));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnFunctionProps\"");
}

// @ts-ignore TS6133
function convertCfnFunctionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionPropsValidator(properties).assertSuccess();
  return {
    "AutoPublish": cdk.booleanToCloudFormation(properties.autoPublish),
    "FunctionCode": cdk.stringToCloudFormation(properties.functionCode),
    "FunctionConfig": convertCfnFunctionFunctionConfigPropertyToCloudFormation(properties.functionConfig),
    "FunctionMetadata": convertCfnFunctionFunctionMetadataPropertyToCloudFormation(properties.functionMetadata),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnFunctionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionProps>();
  ret.addPropertyResult("autoPublish", "AutoPublish", (properties.AutoPublish != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoPublish) : undefined));
  ret.addPropertyResult("functionCode", "FunctionCode", (properties.FunctionCode != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionCode) : undefined));
  ret.addPropertyResult("functionConfig", "FunctionConfig", (properties.FunctionConfig != null ? CfnFunctionFunctionConfigPropertyFromCloudFormation(properties.FunctionConfig) : undefined));
  ret.addPropertyResult("functionMetadata", "FunctionMetadata", (properties.FunctionMetadata != null ? CfnFunctionFunctionMetadataPropertyFromCloudFormation(properties.FunctionMetadata) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A key group.
 *
 * A key group contains a list of public keys that you can use with [CloudFront signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) .
 *
 * @cloudformationResource AWS::CloudFront::KeyGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html
 */
export class CfnKeyGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::KeyGroup";

  /**
   * Build a CfnKeyGroup from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnKeyGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier for the key group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time when the key group was last modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: string;

  /**
   * The key group configuration.
   */
  public keyGroupConfig: cdk.IResolvable | CfnKeyGroup.KeyGroupConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnKeyGroupProps) {
    super(scope, id, {
      "type": CfnKeyGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "keyGroupConfig", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asString(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.STRING));
    this.keyGroupConfig = props.keyGroupConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "keyGroupConfig": this.keyGroupConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnKeyGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnKeyGroupPropsToCloudFormation(props);
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html
   */
  export interface KeyGroupConfigProperty {
    /**
     * A comment to describe the key group.
     *
     * The comment cannot be longer than 128 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html#cfn-cloudfront-keygroup-keygroupconfig-comment
     */
    readonly comment?: string;

    /**
     * A list of the identifiers of the public keys in the key group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html#cfn-cloudfront-keygroup-keygroupconfig-items
     */
    readonly items: Array<string>;

    /**
     * A name to identify the key group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keygroup-keygroupconfig.html#cfn-cloudfront-keygroup-keygroupconfig-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnKeyGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html
 */
export interface CfnKeyGroupProps {
  /**
   * The key group configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keygroup.html#cfn-cloudfront-keygroup-keygroupconfig
   */
  readonly keyGroupConfig: cdk.IResolvable | CfnKeyGroup.KeyGroupConfigProperty;
}

/**
 * Determine whether the given properties match those of a `KeyGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KeyGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKeyGroupKeyGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(cdk.validateString))(properties.items));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"KeyGroupConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnKeyGroupKeyGroupConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKeyGroupKeyGroupConfigPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "Items": cdk.listMapper(cdk.stringToCloudFormation)(properties.items),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnKeyGroupKeyGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnKeyGroup.KeyGroupConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyGroup.KeyGroupConfigProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Items) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnKeyGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnKeyGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKeyGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyGroupConfig", cdk.requiredValidator)(properties.keyGroupConfig));
  errors.collect(cdk.propertyValidator("keyGroupConfig", CfnKeyGroupKeyGroupConfigPropertyValidator)(properties.keyGroupConfig));
  return errors.wrap("supplied properties not correct for \"CfnKeyGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnKeyGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKeyGroupPropsValidator(properties).assertSuccess();
  return {
    "KeyGroupConfig": convertCfnKeyGroupKeyGroupConfigPropertyToCloudFormation(properties.keyGroupConfig)
  };
}

// @ts-ignore TS6133
function CfnKeyGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKeyGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyGroupProps>();
  ret.addPropertyResult("keyGroupConfig", "KeyGroupConfig", (properties.KeyGroupConfig != null ? CfnKeyGroupKeyGroupConfigPropertyFromCloudFormation(properties.KeyGroupConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A monitoring subscription.
 *
 * This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
 *
 * @cloudformationResource AWS::CloudFront::MonitoringSubscription
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html
 */
export class CfnMonitoringSubscription extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::MonitoringSubscription";

  /**
   * Build a CfnMonitoringSubscription from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMonitoringSubscription(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the distribution that you are enabling metrics for.
   */
  public distributionId: string;

  /**
   * A subscription configuration for additional CloudWatch metrics.
   */
  public monitoringSubscription: cdk.IResolvable | CfnMonitoringSubscription.MonitoringSubscriptionProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMonitoringSubscriptionProps) {
    super(scope, id, {
      "type": CfnMonitoringSubscription.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "distributionId", this);
    cdk.requireProperty(props, "monitoringSubscription", this);

    this.distributionId = props.distributionId;
    this.monitoringSubscription = props.monitoringSubscription;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "distributionId": this.distributionId,
      "monitoringSubscription": this.monitoringSubscription
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMonitoringSubscription.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMonitoringSubscriptionPropsToCloudFormation(props);
  }
}

export namespace CfnMonitoringSubscription {
  /**
   * A monitoring subscription.
   *
   * This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-monitoringsubscription.html
   */
  export interface MonitoringSubscriptionProperty {
    /**
     * A subscription configuration for additional CloudWatch metrics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-monitoringsubscription-realtimemetricssubscriptionconfig
     */
    readonly realtimeMetricsSubscriptionConfig?: cdk.IResolvable | CfnMonitoringSubscription.RealtimeMetricsSubscriptionConfigProperty;
  }

  /**
   * A subscription configuration for additional CloudWatch metrics.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig.html
   */
  export interface RealtimeMetricsSubscriptionConfigProperty {
    /**
     * A flag that indicates whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig.html#cfn-cloudfront-monitoringsubscription-realtimemetricssubscriptionconfig-realtimemetricssubscriptionstatus
     */
    readonly realtimeMetricsSubscriptionStatus: string;
  }
}

/**
 * Properties for defining a `CfnMonitoringSubscription`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html
 */
export interface CfnMonitoringSubscriptionProps {
  /**
   * The ID of the distribution that you are enabling metrics for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-distributionid
   */
  readonly distributionId: string;

  /**
   * A subscription configuration for additional CloudWatch metrics.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-monitoringsubscription.html#cfn-cloudfront-monitoringsubscription-monitoringsubscription
   */
  readonly monitoringSubscription: cdk.IResolvable | CfnMonitoringSubscription.MonitoringSubscriptionProperty;
}

/**
 * Determine whether the given properties match those of a `RealtimeMetricsSubscriptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RealtimeMetricsSubscriptionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("realtimeMetricsSubscriptionStatus", cdk.requiredValidator)(properties.realtimeMetricsSubscriptionStatus));
  errors.collect(cdk.propertyValidator("realtimeMetricsSubscriptionStatus", cdk.validateString)(properties.realtimeMetricsSubscriptionStatus));
  return errors.wrap("supplied properties not correct for \"RealtimeMetricsSubscriptionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyValidator(properties).assertSuccess();
  return {
    "RealtimeMetricsSubscriptionStatus": cdk.stringToCloudFormation(properties.realtimeMetricsSubscriptionStatus)
  };
}

// @ts-ignore TS6133
function CfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMonitoringSubscription.RealtimeMetricsSubscriptionConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitoringSubscription.RealtimeMetricsSubscriptionConfigProperty>();
  ret.addPropertyResult("realtimeMetricsSubscriptionStatus", "RealtimeMetricsSubscriptionStatus", (properties.RealtimeMetricsSubscriptionStatus != null ? cfn_parse.FromCloudFormation.getString(properties.RealtimeMetricsSubscriptionStatus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MonitoringSubscriptionProperty`
 *
 * @param properties - the TypeScript properties of a `MonitoringSubscriptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitoringSubscriptionMonitoringSubscriptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("realtimeMetricsSubscriptionConfig", CfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyValidator)(properties.realtimeMetricsSubscriptionConfig));
  return errors.wrap("supplied properties not correct for \"MonitoringSubscriptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnMonitoringSubscriptionMonitoringSubscriptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitoringSubscriptionMonitoringSubscriptionPropertyValidator(properties).assertSuccess();
  return {
    "RealtimeMetricsSubscriptionConfig": convertCfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyToCloudFormation(properties.realtimeMetricsSubscriptionConfig)
  };
}

// @ts-ignore TS6133
function CfnMonitoringSubscriptionMonitoringSubscriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMonitoringSubscription.MonitoringSubscriptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitoringSubscription.MonitoringSubscriptionProperty>();
  ret.addPropertyResult("realtimeMetricsSubscriptionConfig", "RealtimeMetricsSubscriptionConfig", (properties.RealtimeMetricsSubscriptionConfig != null ? CfnMonitoringSubscriptionRealtimeMetricsSubscriptionConfigPropertyFromCloudFormation(properties.RealtimeMetricsSubscriptionConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMonitoringSubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnMonitoringSubscriptionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitoringSubscriptionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("distributionId", cdk.requiredValidator)(properties.distributionId));
  errors.collect(cdk.propertyValidator("distributionId", cdk.validateString)(properties.distributionId));
  errors.collect(cdk.propertyValidator("monitoringSubscription", cdk.requiredValidator)(properties.monitoringSubscription));
  errors.collect(cdk.propertyValidator("monitoringSubscription", CfnMonitoringSubscriptionMonitoringSubscriptionPropertyValidator)(properties.monitoringSubscription));
  return errors.wrap("supplied properties not correct for \"CfnMonitoringSubscriptionProps\"");
}

// @ts-ignore TS6133
function convertCfnMonitoringSubscriptionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitoringSubscriptionPropsValidator(properties).assertSuccess();
  return {
    "DistributionId": cdk.stringToCloudFormation(properties.distributionId),
    "MonitoringSubscription": convertCfnMonitoringSubscriptionMonitoringSubscriptionPropertyToCloudFormation(properties.monitoringSubscription)
  };
}

// @ts-ignore TS6133
function CfnMonitoringSubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMonitoringSubscriptionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitoringSubscriptionProps>();
  ret.addPropertyResult("distributionId", "DistributionId", (properties.DistributionId != null ? cfn_parse.FromCloudFormation.getString(properties.DistributionId) : undefined));
  ret.addPropertyResult("monitoringSubscription", "MonitoringSubscription", (properties.MonitoringSubscription != null ? CfnMonitoringSubscriptionMonitoringSubscriptionPropertyFromCloudFormation(properties.MonitoringSubscription) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new origin access control in CloudFront.
 *
 * After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
 *
 * This makes it possible to block public access to the origin, allowing viewers (users) to access the origin's content only through CloudFront.
 *
 * For more information about using a CloudFront origin access control, see [Restricting access to an AWS origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-origin.html) in the *Amazon CloudFront Developer Guide* .
 *
 * @cloudformationResource AWS::CloudFront::OriginAccessControl
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export class CfnOriginAccessControl extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::OriginAccessControl";

  /**
   * Build a CfnOriginAccessControl from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOriginAccessControl(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier of the origin access control.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The origin access control.
   */
  public originAccessControlConfig: cdk.IResolvable | CfnOriginAccessControl.OriginAccessControlConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOriginAccessControlProps) {
    super(scope, id, {
      "type": CfnOriginAccessControl.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "originAccessControlConfig", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.originAccessControlConfig = props.originAccessControlConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "originAccessControlConfig": this.originAccessControlConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOriginAccessControl.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOriginAccessControlPropsToCloudFormation(props);
  }
}

export namespace CfnOriginAccessControl {
  /**
   * Creates a new origin access control in CloudFront.
   *
   * After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
   *
   * This makes it possible to block public access to the origin, allowing viewers (users) to access the origin's content only through CloudFront.
   *
   * For more information about using a CloudFront origin access control, see [Restricting access to an AWS origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-origin.html) in the *Amazon CloudFront Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html
   */
  export interface OriginAccessControlConfigProperty {
    /**
     * A description of the origin access control.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-description
     */
    readonly description?: string;

    /**
     * A name to identify the origin access control.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-name
     */
    readonly name: string;

    /**
     * The type of origin that this origin access control is for.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-originaccesscontrolorigintype
     */
    readonly originAccessControlOriginType: string;

    /**
     * Specifies which requests CloudFront signs (adds authentication information to).
     *
     * Specify `always` for the most common use case. For more information, see [origin access control advanced settings](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html#oac-advanced-settings) in the *Amazon CloudFront Developer Guide* .
     *
     * This field can have one of the following values:
     *
     * - `always` – CloudFront signs all origin requests, overwriting the `Authorization` header from the viewer request if one exists.
     * - `never` – CloudFront doesn't sign any origin requests. This value turns off origin access control for all origins in all distributions that use this origin access control.
     * - `no-override` – If the viewer request doesn't contain the `Authorization` header, then CloudFront signs the origin request. If the viewer request contains the `Authorization` header, then CloudFront doesn't sign the origin request and instead passes along the `Authorization` header from the viewer request. *WARNING: To pass along the `Authorization` header from the viewer request, you *must* add the `Authorization` header to a [cache policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html) for all cache behaviors that use origins associated with this origin access control.*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-signingbehavior
     */
    readonly signingBehavior: string;

    /**
     * The signing protocol of the origin access control, which determines how CloudFront signs (authenticates) requests.
     *
     * The only valid value is `sigv4` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-signingprotocol
     */
    readonly signingProtocol: string;
  }
}

/**
 * Properties for defining a `CfnOriginAccessControl`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export interface CfnOriginAccessControlProps {
  /**
   * The origin access control.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig
   */
  readonly originAccessControlConfig: cdk.IResolvable | CfnOriginAccessControl.OriginAccessControlConfigProperty;
}

/**
 * Determine whether the given properties match those of a `OriginAccessControlConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OriginAccessControlConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginAccessControlOriginAccessControlConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("originAccessControlOriginType", cdk.requiredValidator)(properties.originAccessControlOriginType));
  errors.collect(cdk.propertyValidator("originAccessControlOriginType", cdk.validateString)(properties.originAccessControlOriginType));
  errors.collect(cdk.propertyValidator("signingBehavior", cdk.requiredValidator)(properties.signingBehavior));
  errors.collect(cdk.propertyValidator("signingBehavior", cdk.validateString)(properties.signingBehavior));
  errors.collect(cdk.propertyValidator("signingProtocol", cdk.requiredValidator)(properties.signingProtocol));
  errors.collect(cdk.propertyValidator("signingProtocol", cdk.validateString)(properties.signingProtocol));
  return errors.wrap("supplied properties not correct for \"OriginAccessControlConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginAccessControlOriginAccessControlConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginAccessControlOriginAccessControlConfigPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OriginAccessControlOriginType": cdk.stringToCloudFormation(properties.originAccessControlOriginType),
    "SigningBehavior": cdk.stringToCloudFormation(properties.signingBehavior),
    "SigningProtocol": cdk.stringToCloudFormation(properties.signingProtocol)
  };
}

// @ts-ignore TS6133
function CfnOriginAccessControlOriginAccessControlConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginAccessControl.OriginAccessControlConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginAccessControl.OriginAccessControlConfigProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("originAccessControlOriginType", "OriginAccessControlOriginType", (properties.OriginAccessControlOriginType != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessControlOriginType) : undefined));
  ret.addPropertyResult("signingBehavior", "SigningBehavior", (properties.SigningBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.SigningBehavior) : undefined));
  ret.addPropertyResult("signingProtocol", "SigningProtocol", (properties.SigningProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.SigningProtocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnOriginAccessControlProps`
 *
 * @param properties - the TypeScript properties of a `CfnOriginAccessControlProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginAccessControlPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("originAccessControlConfig", cdk.requiredValidator)(properties.originAccessControlConfig));
  errors.collect(cdk.propertyValidator("originAccessControlConfig", CfnOriginAccessControlOriginAccessControlConfigPropertyValidator)(properties.originAccessControlConfig));
  return errors.wrap("supplied properties not correct for \"CfnOriginAccessControlProps\"");
}

// @ts-ignore TS6133
function convertCfnOriginAccessControlPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginAccessControlPropsValidator(properties).assertSuccess();
  return {
    "OriginAccessControlConfig": convertCfnOriginAccessControlOriginAccessControlConfigPropertyToCloudFormation(properties.originAccessControlConfig)
  };
}

// @ts-ignore TS6133
function CfnOriginAccessControlPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginAccessControlProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginAccessControlProps>();
  ret.addPropertyResult("originAccessControlConfig", "OriginAccessControlConfig", (properties.OriginAccessControlConfig != null ? CfnOriginAccessControlOriginAccessControlConfigPropertyFromCloudFormation(properties.OriginAccessControlConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html
 */
export class CfnOriginRequestPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::OriginRequestPolicy";

  /**
   * Build a CfnOriginRequestPolicy from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOriginRequestPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for the origin request policy. For example: `befd7079-9bbc-4ebf-8ade-498a3694176c` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time when the origin request policy was last modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: string;

  /**
   * The origin request policy configuration.
   */
  public originRequestPolicyConfig: cdk.IResolvable | CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOriginRequestPolicyProps) {
    super(scope, id, {
      "type": CfnOriginRequestPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "originRequestPolicyConfig", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asString(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.STRING));
    this.originRequestPolicyConfig = props.originRequestPolicyConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "originRequestPolicyConfig": this.originRequestPolicyConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOriginRequestPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOriginRequestPolicyPropsToCloudFormation(props);
  }
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html
   */
  export interface OriginRequestPolicyConfigProperty {
    /**
     * A comment to describe the origin request policy.
     *
     * The comment cannot be longer than 128 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-comment
     */
    readonly comment?: string;

    /**
     * The cookies from viewer requests to include in origin requests.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-cookiesconfig
     */
    readonly cookiesConfig: CfnOriginRequestPolicy.CookiesConfigProperty | cdk.IResolvable;

    /**
     * The HTTP headers to include in origin requests.
     *
     * These can include headers from viewer requests and additional headers added by CloudFront.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-headersconfig
     */
    readonly headersConfig: CfnOriginRequestPolicy.HeadersConfigProperty | cdk.IResolvable;

    /**
     * A unique name to identify the origin request policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-name
     */
    readonly name: string;

    /**
     * The URL query strings from viewer requests to include in origin requests.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-originrequestpolicyconfig.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig-querystringsconfig
     */
    readonly queryStringsConfig: cdk.IResolvable | CfnOriginRequestPolicy.QueryStringsConfigProperty;
  }

  /**
   * An object that determines whether any HTTP headers (and if so, which headers) are included in requests that CloudFront sends to the origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-headersconfig.html
   */
  export interface HeadersConfigProperty {
    /**
     * Determines whether any HTTP headers are included in requests that CloudFront sends to the origin. Valid values are:.
     *
     * - `none` – No HTTP headers in viewer requests are included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any headers that are listed in a `CachePolicy` *are* included in origin requests.
     * - `whitelist` – Only the HTTP headers that are listed in the `Headers` type are included in requests that CloudFront sends to the origin.
     * - `allViewer` – All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin.
     * - `allViewerAndWhitelistCloudFront` – All HTTP headers in viewer requests and the additional CloudFront headers that are listed in the `Headers` type are included in requests that CloudFront sends to the origin. The additional headers are added by CloudFront.
     * - `allExcept` – All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin, **except** for those listed in the `Headers` type, which are not included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-headersconfig.html#cfn-cloudfront-originrequestpolicy-headersconfig-headerbehavior
     */
    readonly headerBehavior: string;

    /**
     * Contains a list of HTTP header names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-headersconfig.html#cfn-cloudfront-originrequestpolicy-headersconfig-headers
     */
    readonly headers?: Array<string>;
  }

  /**
   * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in requests that CloudFront sends to the origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-cookiesconfig.html
   */
  export interface CookiesConfigProperty {
    /**
     * Determines whether cookies in viewer requests are included in requests that CloudFront sends to the origin. Valid values are:.
     *
     * - `none` – No cookies in viewer requests are included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any cookies that are listed in a `CachePolicy` *are* included in origin requests.
     * - `whitelist` – Only the cookies in viewer requests that are listed in the `CookieNames` type are included in requests that CloudFront sends to the origin.
     * - `all` – All cookies in viewer requests are included in requests that CloudFront sends to the origin.
     * - `allExcept` – All cookies in viewer requests are included in requests that CloudFront sends to the origin, **except** for those listed in the `CookieNames` type, which are not included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-cookiesconfig.html#cfn-cloudfront-originrequestpolicy-cookiesconfig-cookiebehavior
     */
    readonly cookieBehavior: string;

    /**
     * Contains a list of cookie names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-cookiesconfig.html#cfn-cloudfront-originrequestpolicy-cookiesconfig-cookies
     */
    readonly cookies?: Array<string>;
  }

  /**
   * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in requests that CloudFront sends to the origin.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-querystringsconfig.html
   */
  export interface QueryStringsConfigProperty {
    /**
     * Determines whether any URL query strings in viewer requests are included in requests that CloudFront sends to the origin.
     *
     * Valid values are:
     *
     * - `none` – No query strings in viewer requests are included in requests that CloudFront sends to the origin. Even when this field is set to `none` , any query strings that are listed in a `CachePolicy` *are* included in origin requests.
     * - `whitelist` – Only the query strings in viewer requests that are listed in the `QueryStringNames` type are included in requests that CloudFront sends to the origin.
     * - `all` – All query strings in viewer requests are included in requests that CloudFront sends to the origin.
     * - `allExcept` – All query strings in viewer requests are included in requests that CloudFront sends to the origin, **except** for those listed in the `QueryStringNames` type, which are not included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-querystringsconfig.html#cfn-cloudfront-originrequestpolicy-querystringsconfig-querystringbehavior
     */
    readonly queryStringBehavior: string;

    /**
     * Contains a list of query string names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originrequestpolicy-querystringsconfig.html#cfn-cloudfront-originrequestpolicy-querystringsconfig-querystrings
     */
    readonly queryStrings?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnOriginRequestPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html
 */
export interface CfnOriginRequestPolicyProps {
  /**
   * The origin request policy configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originrequestpolicy.html#cfn-cloudfront-originrequestpolicy-originrequestpolicyconfig
   */
  readonly originRequestPolicyConfig: cdk.IResolvable | CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty;
}

/**
 * Determine whether the given properties match those of a `HeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginRequestPolicyHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerBehavior", cdk.requiredValidator)(properties.headerBehavior));
  errors.collect(cdk.propertyValidator("headerBehavior", cdk.validateString)(properties.headerBehavior));
  errors.collect(cdk.propertyValidator("headers", cdk.listValidator(cdk.validateString))(properties.headers));
  return errors.wrap("supplied properties not correct for \"HeadersConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginRequestPolicyHeadersConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginRequestPolicyHeadersConfigPropertyValidator(properties).assertSuccess();
  return {
    "HeaderBehavior": cdk.stringToCloudFormation(properties.headerBehavior),
    "Headers": cdk.listMapper(cdk.stringToCloudFormation)(properties.headers)
  };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicy.HeadersConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.HeadersConfigProperty>();
  ret.addPropertyResult("headerBehavior", "HeaderBehavior", (properties.HeaderBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderBehavior) : undefined));
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Headers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookiesConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginRequestPolicyCookiesConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookieBehavior", cdk.requiredValidator)(properties.cookieBehavior));
  errors.collect(cdk.propertyValidator("cookieBehavior", cdk.validateString)(properties.cookieBehavior));
  errors.collect(cdk.propertyValidator("cookies", cdk.listValidator(cdk.validateString))(properties.cookies));
  return errors.wrap("supplied properties not correct for \"CookiesConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginRequestPolicyCookiesConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginRequestPolicyCookiesConfigPropertyValidator(properties).assertSuccess();
  return {
    "CookieBehavior": cdk.stringToCloudFormation(properties.cookieBehavior),
    "Cookies": cdk.listMapper(cdk.stringToCloudFormation)(properties.cookies)
  };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyCookiesConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicy.CookiesConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.CookiesConfigProperty>();
  ret.addPropertyResult("cookieBehavior", "CookieBehavior", (properties.CookieBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.CookieBehavior) : undefined));
  ret.addPropertyResult("cookies", "Cookies", (properties.Cookies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Cookies) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryStringsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringsConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginRequestPolicyQueryStringsConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queryStringBehavior", cdk.requiredValidator)(properties.queryStringBehavior));
  errors.collect(cdk.propertyValidator("queryStringBehavior", cdk.validateString)(properties.queryStringBehavior));
  errors.collect(cdk.propertyValidator("queryStrings", cdk.listValidator(cdk.validateString))(properties.queryStrings));
  return errors.wrap("supplied properties not correct for \"QueryStringsConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginRequestPolicyQueryStringsConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginRequestPolicyQueryStringsConfigPropertyValidator(properties).assertSuccess();
  return {
    "QueryStringBehavior": cdk.stringToCloudFormation(properties.queryStringBehavior),
    "QueryStrings": cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStrings)
  };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyQueryStringsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginRequestPolicy.QueryStringsConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.QueryStringsConfigProperty>();
  ret.addPropertyResult("queryStringBehavior", "QueryStringBehavior", (properties.QueryStringBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.QueryStringBehavior) : undefined));
  ret.addPropertyResult("queryStrings", "QueryStrings", (properties.QueryStrings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.QueryStrings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OriginRequestPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OriginRequestPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginRequestPolicyOriginRequestPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("cookiesConfig", cdk.requiredValidator)(properties.cookiesConfig));
  errors.collect(cdk.propertyValidator("cookiesConfig", CfnOriginRequestPolicyCookiesConfigPropertyValidator)(properties.cookiesConfig));
  errors.collect(cdk.propertyValidator("headersConfig", cdk.requiredValidator)(properties.headersConfig));
  errors.collect(cdk.propertyValidator("headersConfig", CfnOriginRequestPolicyHeadersConfigPropertyValidator)(properties.headersConfig));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("queryStringsConfig", cdk.requiredValidator)(properties.queryStringsConfig));
  errors.collect(cdk.propertyValidator("queryStringsConfig", CfnOriginRequestPolicyQueryStringsConfigPropertyValidator)(properties.queryStringsConfig));
  return errors.wrap("supplied properties not correct for \"OriginRequestPolicyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginRequestPolicyOriginRequestPolicyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginRequestPolicyOriginRequestPolicyConfigPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "CookiesConfig": convertCfnOriginRequestPolicyCookiesConfigPropertyToCloudFormation(properties.cookiesConfig),
    "HeadersConfig": convertCfnOriginRequestPolicyHeadersConfigPropertyToCloudFormation(properties.headersConfig),
    "Name": cdk.stringToCloudFormation(properties.name),
    "QueryStringsConfig": convertCfnOriginRequestPolicyQueryStringsConfigPropertyToCloudFormation(properties.queryStringsConfig)
  };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyOriginRequestPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicy.OriginRequestPolicyConfigProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("cookiesConfig", "CookiesConfig", (properties.CookiesConfig != null ? CfnOriginRequestPolicyCookiesConfigPropertyFromCloudFormation(properties.CookiesConfig) : undefined));
  ret.addPropertyResult("headersConfig", "HeadersConfig", (properties.HeadersConfig != null ? CfnOriginRequestPolicyHeadersConfigPropertyFromCloudFormation(properties.HeadersConfig) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("queryStringsConfig", "QueryStringsConfig", (properties.QueryStringsConfig != null ? CfnOriginRequestPolicyQueryStringsConfigPropertyFromCloudFormation(properties.QueryStringsConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnOriginRequestPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnOriginRequestPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginRequestPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("originRequestPolicyConfig", cdk.requiredValidator)(properties.originRequestPolicyConfig));
  errors.collect(cdk.propertyValidator("originRequestPolicyConfig", CfnOriginRequestPolicyOriginRequestPolicyConfigPropertyValidator)(properties.originRequestPolicyConfig));
  return errors.wrap("supplied properties not correct for \"CfnOriginRequestPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnOriginRequestPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginRequestPolicyPropsValidator(properties).assertSuccess();
  return {
    "OriginRequestPolicyConfig": convertCfnOriginRequestPolicyOriginRequestPolicyConfigPropertyToCloudFormation(properties.originRequestPolicyConfig)
  };
}

// @ts-ignore TS6133
function CfnOriginRequestPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginRequestPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginRequestPolicyProps>();
  ret.addPropertyResult("originRequestPolicyConfig", "OriginRequestPolicyConfig", (properties.OriginRequestPolicyConfig != null ? CfnOriginRequestPolicyOriginRequestPolicyConfigPropertyFromCloudFormation(properties.OriginRequestPolicyConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
 *
 * @cloudformationResource AWS::CloudFront::PublicKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html
 */
export class CfnPublicKey extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::PublicKey";

  /**
   * Build a CfnPublicKey from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPublicKey(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The date and time when the public key was uploaded.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: string;

  /**
   * The identifier of the public key.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
   */
  public publicKeyConfig: cdk.IResolvable | CfnPublicKey.PublicKeyConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPublicKeyProps) {
    super(scope, id, {
      "type": CfnPublicKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "publicKeyConfig", this);

    this.attrCreatedTime = cdk.Token.asString(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.publicKeyConfig = props.publicKeyConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "publicKeyConfig": this.publicKeyConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPublicKey.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPublicKeyPropsToCloudFormation(props);
  }
}

export namespace CfnPublicKey {
  /**
   * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html
   */
  export interface PublicKeyConfigProperty {
    /**
     * A string included in the request to help make sure that the request can't be replayed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-callerreference
     */
    readonly callerReference: string;

    /**
     * A comment to describe the public key.
     *
     * The comment cannot be longer than 128 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-comment
     */
    readonly comment?: string;

    /**
     * The public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-encodedkey
     */
    readonly encodedKey: string;

    /**
     * A name to help identify the public key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-publickey-publickeyconfig.html#cfn-cloudfront-publickey-publickeyconfig-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnPublicKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html
 */
export interface CfnPublicKeyProps {
  /**
   * Configuration information about a public key that you can use with [signed URLs and signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) , or with [field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-publickey.html#cfn-cloudfront-publickey-publickeyconfig
   */
  readonly publicKeyConfig: cdk.IResolvable | CfnPublicKey.PublicKeyConfigProperty;
}

/**
 * Determine whether the given properties match those of a `PublicKeyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PublicKeyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPublicKeyPublicKeyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("callerReference", cdk.requiredValidator)(properties.callerReference));
  errors.collect(cdk.propertyValidator("callerReference", cdk.validateString)(properties.callerReference));
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("encodedKey", cdk.requiredValidator)(properties.encodedKey));
  errors.collect(cdk.propertyValidator("encodedKey", cdk.validateString)(properties.encodedKey));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"PublicKeyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnPublicKeyPublicKeyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPublicKeyPublicKeyConfigPropertyValidator(properties).assertSuccess();
  return {
    "CallerReference": cdk.stringToCloudFormation(properties.callerReference),
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "EncodedKey": cdk.stringToCloudFormation(properties.encodedKey),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPublicKeyPublicKeyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPublicKey.PublicKeyConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicKey.PublicKeyConfigProperty>();
  ret.addPropertyResult("callerReference", "CallerReference", (properties.CallerReference != null ? cfn_parse.FromCloudFormation.getString(properties.CallerReference) : undefined));
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("encodedKey", "EncodedKey", (properties.EncodedKey != null ? cfn_parse.FromCloudFormation.getString(properties.EncodedKey) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPublicKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnPublicKeyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPublicKeyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("publicKeyConfig", cdk.requiredValidator)(properties.publicKeyConfig));
  errors.collect(cdk.propertyValidator("publicKeyConfig", CfnPublicKeyPublicKeyConfigPropertyValidator)(properties.publicKeyConfig));
  return errors.wrap("supplied properties not correct for \"CfnPublicKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnPublicKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPublicKeyPropsValidator(properties).assertSuccess();
  return {
    "PublicKeyConfig": convertCfnPublicKeyPublicKeyConfigPropertyToCloudFormation(properties.publicKeyConfig)
  };
}

// @ts-ignore TS6133
function CfnPublicKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublicKeyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicKeyProps>();
  ret.addPropertyResult("publicKeyConfig", "PublicKeyConfig", (properties.PublicKeyConfig != null ? CfnPublicKeyPublicKeyConfigPropertyFromCloudFormation(properties.PublicKeyConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A real-time log configuration.
 *
 * @cloudformationResource AWS::CloudFront::RealtimeLogConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html
 */
export class CfnRealtimeLogConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::RealtimeLogConfig";

  /**
   * Build a CfnRealtimeLogConfig from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRealtimeLogConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the real-time log configuration. For example: `arn:aws:cloudfront::111122223333:realtime-log-config/ExampleNameForRealtimeLogConfig` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Contains information about the Amazon Kinesis data stream where you are sending real-time log data for this real-time log configuration.
   */
  public endPoints: Array<CfnRealtimeLogConfig.EndPointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of fields that are included in each real-time log record.
   */
  public fields: Array<string>;

  /**
   * The unique name of this real-time log configuration.
   */
  public name: string;

  /**
   * The sampling rate for this real-time log configuration.
   */
  public samplingRate: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRealtimeLogConfigProps) {
    super(scope, id, {
      "type": CfnRealtimeLogConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "endPoints", this);
    cdk.requireProperty(props, "fields", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "samplingRate", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.endPoints = props.endPoints;
    this.fields = props.fields;
    this.name = props.name;
    this.samplingRate = props.samplingRate;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "endPoints": this.endPoints,
      "fields": this.fields,
      "name": this.name,
      "samplingRate": this.samplingRate
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRealtimeLogConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRealtimeLogConfigPropsToCloudFormation(props);
  }
}

export namespace CfnRealtimeLogConfig {
  /**
   * Contains information about the Amazon Kinesis data stream where you are sending real-time log data in a real-time log configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-endpoint.html
   */
  export interface EndPointProperty {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-endpoint.html#cfn-cloudfront-realtimelogconfig-endpoint-kinesisstreamconfig
     */
    readonly kinesisStreamConfig: cdk.IResolvable | CfnRealtimeLogConfig.KinesisStreamConfigProperty;

    /**
     * The type of data stream where you are sending real-time log data.
     *
     * The only valid value is `Kinesis` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-endpoint.html#cfn-cloudfront-realtimelogconfig-endpoint-streamtype
     */
    readonly streamType: string;
  }

  /**
   * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-kinesisstreamconfig.html
   */
  export interface KinesisStreamConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of an AWS Identity and Access Management (IAM) role that CloudFront can use to send real-time log data to your Kinesis data stream.
     *
     * For more information the IAM role, see [Real-time log configuration IAM role](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html#understand-real-time-log-config-iam-role) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-kinesisstreamconfig.html#cfn-cloudfront-realtimelogconfig-kinesisstreamconfig-rolearn
     */
    readonly roleArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Kinesis data stream where you are sending real-time log data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-realtimelogconfig-kinesisstreamconfig.html#cfn-cloudfront-realtimelogconfig-kinesisstreamconfig-streamarn
     */
    readonly streamArn: string;
  }
}

/**
 * Properties for defining a `CfnRealtimeLogConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html
 */
export interface CfnRealtimeLogConfigProps {
  /**
   * Contains information about the Amazon Kinesis data stream where you are sending real-time log data for this real-time log configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-endpoints
   */
  readonly endPoints: Array<CfnRealtimeLogConfig.EndPointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of fields that are included in each real-time log record.
   *
   * In an API response, the fields are provided in the same order in which they are sent to the Amazon Kinesis data stream.
   *
   * For more information about fields, see [Real-time log configuration fields](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html#understand-real-time-log-config-fields) in the *Amazon CloudFront Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-fields
   */
  readonly fields: Array<string>;

  /**
   * The unique name of this real-time log configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-name
   */
  readonly name: string;

  /**
   * The sampling rate for this real-time log configuration.
   *
   * The sampling rate determines the percentage of viewer requests that are represented in the real-time log data. The sampling rate is an integer between 1 and 100, inclusive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-realtimelogconfig.html#cfn-cloudfront-realtimelogconfig-samplingrate
   */
  readonly samplingRate: number;
}

/**
 * Determine whether the given properties match those of a `KinesisStreamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRealtimeLogConfigKinesisStreamConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("streamArn", cdk.requiredValidator)(properties.streamArn));
  errors.collect(cdk.propertyValidator("streamArn", cdk.validateString)(properties.streamArn));
  return errors.wrap("supplied properties not correct for \"KinesisStreamConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnRealtimeLogConfigKinesisStreamConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRealtimeLogConfigKinesisStreamConfigPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StreamArn": cdk.stringToCloudFormation(properties.streamArn)
  };
}

// @ts-ignore TS6133
function CfnRealtimeLogConfigKinesisStreamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRealtimeLogConfig.KinesisStreamConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRealtimeLogConfig.KinesisStreamConfigProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("streamArn", "StreamArn", (properties.StreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.StreamArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndPointProperty`
 *
 * @param properties - the TypeScript properties of a `EndPointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRealtimeLogConfigEndPointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kinesisStreamConfig", cdk.requiredValidator)(properties.kinesisStreamConfig));
  errors.collect(cdk.propertyValidator("kinesisStreamConfig", CfnRealtimeLogConfigKinesisStreamConfigPropertyValidator)(properties.kinesisStreamConfig));
  errors.collect(cdk.propertyValidator("streamType", cdk.requiredValidator)(properties.streamType));
  errors.collect(cdk.propertyValidator("streamType", cdk.validateString)(properties.streamType));
  return errors.wrap("supplied properties not correct for \"EndPointProperty\"");
}

// @ts-ignore TS6133
function convertCfnRealtimeLogConfigEndPointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRealtimeLogConfigEndPointPropertyValidator(properties).assertSuccess();
  return {
    "KinesisStreamConfig": convertCfnRealtimeLogConfigKinesisStreamConfigPropertyToCloudFormation(properties.kinesisStreamConfig),
    "StreamType": cdk.stringToCloudFormation(properties.streamType)
  };
}

// @ts-ignore TS6133
function CfnRealtimeLogConfigEndPointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRealtimeLogConfig.EndPointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRealtimeLogConfig.EndPointProperty>();
  ret.addPropertyResult("kinesisStreamConfig", "KinesisStreamConfig", (properties.KinesisStreamConfig != null ? CfnRealtimeLogConfigKinesisStreamConfigPropertyFromCloudFormation(properties.KinesisStreamConfig) : undefined));
  ret.addPropertyResult("streamType", "StreamType", (properties.StreamType != null ? cfn_parse.FromCloudFormation.getString(properties.StreamType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRealtimeLogConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnRealtimeLogConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRealtimeLogConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endPoints", cdk.requiredValidator)(properties.endPoints));
  errors.collect(cdk.propertyValidator("endPoints", cdk.listValidator(CfnRealtimeLogConfigEndPointPropertyValidator))(properties.endPoints));
  errors.collect(cdk.propertyValidator("fields", cdk.requiredValidator)(properties.fields));
  errors.collect(cdk.propertyValidator("fields", cdk.listValidator(cdk.validateString))(properties.fields));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("samplingRate", cdk.requiredValidator)(properties.samplingRate));
  errors.collect(cdk.propertyValidator("samplingRate", cdk.validateNumber)(properties.samplingRate));
  return errors.wrap("supplied properties not correct for \"CfnRealtimeLogConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnRealtimeLogConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRealtimeLogConfigPropsValidator(properties).assertSuccess();
  return {
    "EndPoints": cdk.listMapper(convertCfnRealtimeLogConfigEndPointPropertyToCloudFormation)(properties.endPoints),
    "Fields": cdk.listMapper(cdk.stringToCloudFormation)(properties.fields),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SamplingRate": cdk.numberToCloudFormation(properties.samplingRate)
  };
}

// @ts-ignore TS6133
function CfnRealtimeLogConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRealtimeLogConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRealtimeLogConfigProps>();
  ret.addPropertyResult("endPoints", "EndPoints", (properties.EndPoints != null ? cfn_parse.FromCloudFormation.getArray(CfnRealtimeLogConfigEndPointPropertyFromCloudFormation)(properties.EndPoints) : undefined));
  ret.addPropertyResult("fields", "Fields", (properties.Fields != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Fields) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("samplingRate", "SamplingRate", (properties.SamplingRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SamplingRate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html
 */
export class CfnResponseHeadersPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::ResponseHeadersPolicy";

  /**
   * Build a CfnResponseHeadersPolicy from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResponseHeadersPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for the response headers policy. For example: `57f99797-3b20-4e1b-a728-27972a74082a` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time when the response headers policy was last modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: string;

  /**
   * A response headers policy configuration.
   */
  public responseHeadersPolicyConfig: cdk.IResolvable | CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResponseHeadersPolicyProps) {
    super(scope, id, {
      "type": CfnResponseHeadersPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "responseHeadersPolicyConfig", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asString(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.STRING));
    this.responseHeadersPolicyConfig = props.responseHeadersPolicyConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "responseHeadersPolicyConfig": this.responseHeadersPolicyConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResponseHeadersPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResponseHeadersPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnResponseHeadersPolicy {
  /**
   * A response headers policy configuration.
   *
   * A response headers policy configuration contains metadata about the response headers policy, and configurations for sets of HTTP response headers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html
   */
  export interface ResponseHeadersPolicyConfigProperty {
    /**
     * A comment to describe the response headers policy.
     *
     * The comment cannot be longer than 128 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-comment
     */
    readonly comment?: string;

    /**
     * A configuration for a set of HTTP response headers that are used for cross-origin resource sharing (CORS).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-corsconfig
     */
    readonly corsConfig?: CfnResponseHeadersPolicy.CorsConfigProperty | cdk.IResolvable;

    /**
     * A configuration for a set of custom HTTP response headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-customheadersconfig
     */
    readonly customHeadersConfig?: CfnResponseHeadersPolicy.CustomHeadersConfigProperty | cdk.IResolvable;

    /**
     * A name to identify the response headers policy.
     *
     * The name must be unique for response headers policies in this AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-name
     */
    readonly name: string;

    /**
     * A configuration for a set of HTTP headers to remove from the HTTP response.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-removeheadersconfig
     */
    readonly removeHeadersConfig?: cdk.IResolvable | CfnResponseHeadersPolicy.RemoveHeadersConfigProperty;

    /**
     * A configuration for a set of security-related HTTP response headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-securityheadersconfig
     */
    readonly securityHeadersConfig?: cdk.IResolvable | CfnResponseHeadersPolicy.SecurityHeadersConfigProperty;

    /**
     * A configuration for enabling the `Server-Timing` header in HTTP responses sent from CloudFront.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-responseheaderspolicyconfig.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig-servertimingheadersconfig
     */
    readonly serverTimingHeadersConfig?: cdk.IResolvable | CfnResponseHeadersPolicy.ServerTimingHeadersConfigProperty;
  }

  /**
   * A configuration for a set of security-related HTTP response headers.
   *
   * CloudFront adds these headers to HTTP responses that it sends for requests that match a cache behavior associated with this response headers policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html
   */
  export interface SecurityHeadersConfigProperty {
    /**
     * The policy directives and their values that CloudFront includes as values for the `Content-Security-Policy` HTTP response header.
     *
     * For more information about the `Content-Security-Policy` HTTP response header, see [Content-Security-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-contentsecuritypolicy
     */
    readonly contentSecurityPolicy?: CfnResponseHeadersPolicy.ContentSecurityPolicyProperty | cdk.IResolvable;

    /**
     * Determines whether CloudFront includes the `X-Content-Type-Options` HTTP response header with its value set to `nosniff` .
     *
     * For more information about the `X-Content-Type-Options` HTTP response header, see [X-Content-Type-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-contenttypeoptions
     */
    readonly contentTypeOptions?: CfnResponseHeadersPolicy.ContentTypeOptionsProperty | cdk.IResolvable;

    /**
     * Determines whether CloudFront includes the `X-Frame-Options` HTTP response header and the header's value.
     *
     * For more information about the `X-Frame-Options` HTTP response header, see [X-Frame-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-frameoptions
     */
    readonly frameOptions?: CfnResponseHeadersPolicy.FrameOptionsProperty | cdk.IResolvable;

    /**
     * Determines whether CloudFront includes the `Referrer-Policy` HTTP response header and the header's value.
     *
     * For more information about the `Referrer-Policy` HTTP response header, see [Referrer-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-referrerpolicy
     */
    readonly referrerPolicy?: cdk.IResolvable | CfnResponseHeadersPolicy.ReferrerPolicyProperty;

    /**
     * Determines whether CloudFront includes the `Strict-Transport-Security` HTTP response header and the header's value.
     *
     * For more information about the `Strict-Transport-Security` HTTP response header, see [Strict-Transport-Security](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-stricttransportsecurity
     */
    readonly strictTransportSecurity?: cdk.IResolvable | CfnResponseHeadersPolicy.StrictTransportSecurityProperty;

    /**
     * Determines whether CloudFront includes the `X-XSS-Protection` HTTP response header and the header's value.
     *
     * For more information about the `X-XSS-Protection` HTTP response header, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-securityheadersconfig.html#cfn-cloudfront-responseheaderspolicy-securityheadersconfig-xssprotection
     */
    readonly xssProtection?: cdk.IResolvable | CfnResponseHeadersPolicy.XSSProtectionProperty;
  }

  /**
   * The policy directives and their values that CloudFront includes as values for the `Content-Security-Policy` HTTP response header.
   *
   * For more information about the `Content-Security-Policy` HTTP response header, see [Content-Security-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contentsecuritypolicy.html
   */
  export interface ContentSecurityPolicyProperty {
    /**
     * The policy directives and their values that CloudFront includes as values for the `Content-Security-Policy` HTTP response header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contentsecuritypolicy.html#cfn-cloudfront-responseheaderspolicy-contentsecuritypolicy-contentsecuritypolicy
     */
    readonly contentSecurityPolicy: string;

    /**
     * A Boolean that determines whether CloudFront overrides the `Content-Security-Policy` HTTP response header received from the origin with the one specified in this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contentsecuritypolicy.html#cfn-cloudfront-responseheaderspolicy-contentsecuritypolicy-override
     */
    readonly override: boolean | cdk.IResolvable;
  }

  /**
   * Determines whether CloudFront includes the `X-Frame-Options` HTTP response header and the header's value.
   *
   * For more information about the `X-Frame-Options` HTTP response header, see [X-Frame-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-frameoptions.html
   */
  export interface FrameOptionsProperty {
    /**
     * The value of the `X-Frame-Options` HTTP response header. Valid values are `DENY` and `SAMEORIGIN` .
     *
     * For more information about these values, see [X-Frame-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-frameoptions.html#cfn-cloudfront-responseheaderspolicy-frameoptions-frameoption
     */
    readonly frameOption: string;

    /**
     * A Boolean that determines whether CloudFront overrides the `X-Frame-Options` HTTP response header received from the origin with the one specified in this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-frameoptions.html#cfn-cloudfront-responseheaderspolicy-frameoptions-override
     */
    readonly override: boolean | cdk.IResolvable;
  }

  /**
   * Determines whether CloudFront includes the `X-Content-Type-Options` HTTP response header with its value set to `nosniff` .
   *
   * For more information about the `X-Content-Type-Options` HTTP response header, see [X-Content-Type-Options](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contenttypeoptions.html
   */
  export interface ContentTypeOptionsProperty {
    /**
     * A Boolean that determines whether CloudFront overrides the `X-Content-Type-Options` HTTP response header received from the origin with the one specified in this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-contenttypeoptions.html#cfn-cloudfront-responseheaderspolicy-contenttypeoptions-override
     */
    readonly override: boolean | cdk.IResolvable;
  }

  /**
   * Determines whether CloudFront includes the `Strict-Transport-Security` HTTP response header and the header's value.
   *
   * For more information about the `Strict-Transport-Security` HTTP response header, see [Strict-Transport-Security](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html
   */
  export interface StrictTransportSecurityProperty {
    /**
     * A number that CloudFront uses as the value for the `max-age` directive in the `Strict-Transport-Security` HTTP response header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-accesscontrolmaxagesec
     */
    readonly accessControlMaxAgeSec: number;

    /**
     * A Boolean that determines whether CloudFront includes the `includeSubDomains` directive in the `Strict-Transport-Security` HTTP response header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-includesubdomains
     */
    readonly includeSubdomains?: boolean | cdk.IResolvable;

    /**
     * A Boolean that determines whether CloudFront overrides the `Strict-Transport-Security` HTTP response header received from the origin with the one specified in this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-override
     */
    readonly override: boolean | cdk.IResolvable;

    /**
     * A Boolean that determines whether CloudFront includes the `preload` directive in the `Strict-Transport-Security` HTTP response header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-stricttransportsecurity.html#cfn-cloudfront-responseheaderspolicy-stricttransportsecurity-preload
     */
    readonly preload?: boolean | cdk.IResolvable;
  }

  /**
   * Determines whether CloudFront includes the `X-XSS-Protection` HTTP response header and the header's value.
   *
   * For more information about the `X-XSS-Protection` HTTP response header, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html
   */
  export interface XSSProtectionProperty {
    /**
     * A Boolean that determines whether CloudFront includes the `mode=block` directive in the `X-XSS-Protection` header.
     *
     * For more information about this directive, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-modeblock
     */
    readonly modeBlock?: boolean | cdk.IResolvable;

    /**
     * A Boolean that determines whether CloudFront overrides the `X-XSS-Protection` HTTP response header received from the origin with the one specified in this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-override
     */
    readonly override: boolean | cdk.IResolvable;

    /**
     * A Boolean that determines the value of the `X-XSS-Protection` HTTP response header.
     *
     * When this setting is `true` , the value of the `X-XSS-Protection` header is `1` . When this setting is `false` , the value of the `X-XSS-Protection` header is `0` .
     *
     * For more information about these settings, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-protection
     */
    readonly protection: boolean | cdk.IResolvable;

    /**
     * A reporting URI, which CloudFront uses as the value of the `report` directive in the `X-XSS-Protection` header.
     *
     * You cannot specify a `ReportUri` when `ModeBlock` is `true` .
     *
     * For more information about using a reporting URL, see [X-XSS-Protection](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-xssprotection.html#cfn-cloudfront-responseheaderspolicy-xssprotection-reporturi
     */
    readonly reportUri?: string;
  }

  /**
   * Determines whether CloudFront includes the `Referrer-Policy` HTTP response header and the header's value.
   *
   * For more information about the `Referrer-Policy` HTTP response header, see [Referrer-Policy](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-referrerpolicy.html
   */
  export interface ReferrerPolicyProperty {
    /**
     * A Boolean that determines whether CloudFront overrides the `Referrer-Policy` HTTP response header received from the origin with the one specified in this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-referrerpolicy.html#cfn-cloudfront-responseheaderspolicy-referrerpolicy-override
     */
    readonly override: boolean | cdk.IResolvable;

    /**
     * The value of the `Referrer-Policy` HTTP response header. Valid values are:.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-referrerpolicy.html#cfn-cloudfront-responseheaderspolicy-referrerpolicy-referrerpolicy
     */
    readonly referrerPolicy: string;
  }

  /**
   * A list of HTTP header names that CloudFront removes from HTTP responses to requests that match the cache behavior that this response headers policy is attached to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheadersconfig.html
   */
  export interface RemoveHeadersConfigProperty {
    /**
     * The list of HTTP header names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheadersconfig.html#cfn-cloudfront-responseheaderspolicy-removeheadersconfig-items
     */
    readonly items: Array<cdk.IResolvable | CfnResponseHeadersPolicy.RemoveHeaderProperty> | cdk.IResolvable;
  }

  /**
   * The name of an HTTP header that CloudFront removes from HTTP responses to requests that match the cache behavior that this response headers policy is attached to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheader.html
   */
  export interface RemoveHeaderProperty {
    /**
     * The HTTP header name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-removeheader.html#cfn-cloudfront-responseheaderspolicy-removeheader-header
     */
    readonly header: string;
  }

  /**
   * A configuration for a set of HTTP response headers that are used for cross-origin resource sharing (CORS).
   *
   * CloudFront adds these headers to HTTP responses that it sends for CORS requests that match a cache behavior associated with this response headers policy.
   *
   * For more information about CORS, see [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html
   */
  export interface CorsConfigProperty {
    /**
     * A Boolean that CloudFront uses as the value for the `Access-Control-Allow-Credentials` HTTP response header.
     *
     * For more information about the `Access-Control-Allow-Credentials` HTTP response header, see [Access-Control-Allow-Credentials](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolallowcredentials
     */
    readonly accessControlAllowCredentials: boolean | cdk.IResolvable;

    /**
     * A list of HTTP header names that CloudFront includes as values for the `Access-Control-Allow-Headers` HTTP response header.
     *
     * For more information about the `Access-Control-Allow-Headers` HTTP response header, see [Access-Control-Allow-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolallowheaders
     */
    readonly accessControlAllowHeaders: CfnResponseHeadersPolicy.AccessControlAllowHeadersProperty | cdk.IResolvable;

    /**
     * A list of HTTP methods that CloudFront includes as values for the `Access-Control-Allow-Methods` HTTP response header.
     *
     * For more information about the `Access-Control-Allow-Methods` HTTP response header, see [Access-Control-Allow-Methods](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolallowmethods
     */
    readonly accessControlAllowMethods: CfnResponseHeadersPolicy.AccessControlAllowMethodsProperty | cdk.IResolvable;

    /**
     * A list of origins (domain names) that CloudFront can use as the value for the `Access-Control-Allow-Origin` HTTP response header.
     *
     * For more information about the `Access-Control-Allow-Origin` HTTP response header, see [Access-Control-Allow-Origin](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolalloworigins
     */
    readonly accessControlAllowOrigins: CfnResponseHeadersPolicy.AccessControlAllowOriginsProperty | cdk.IResolvable;

    /**
     * A list of HTTP headers that CloudFront includes as values for the `Access-Control-Expose-Headers` HTTP response header.
     *
     * For more information about the `Access-Control-Expose-Headers` HTTP response header, see [Access-Control-Expose-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolexposeheaders
     */
    readonly accessControlExposeHeaders?: CfnResponseHeadersPolicy.AccessControlExposeHeadersProperty | cdk.IResolvable;

    /**
     * A number that CloudFront uses as the value for the `Access-Control-Max-Age` HTTP response header.
     *
     * For more information about the `Access-Control-Max-Age` HTTP response header, see [Access-Control-Max-Age](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age) in the MDN Web Docs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-accesscontrolmaxagesec
     */
    readonly accessControlMaxAgeSec?: number;

    /**
     * A Boolean that determines whether CloudFront overrides HTTP response headers received from the origin with the ones specified in this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-corsconfig.html#cfn-cloudfront-responseheaderspolicy-corsconfig-originoverride
     */
    readonly originOverride: boolean | cdk.IResolvable;
  }

  /**
   * A list of HTTP header names that CloudFront includes as values for the `Access-Control-Allow-Headers` HTTP response header.
   *
   * For more information about the `Access-Control-Allow-Headers` HTTP response header, see [Access-Control-Allow-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowheaders.html
   */
  export interface AccessControlAllowHeadersProperty {
    /**
     * The list of HTTP header names.
     *
     * You can specify `*` to allow all headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowheaders.html#cfn-cloudfront-responseheaderspolicy-accesscontrolallowheaders-items
     */
    readonly items: Array<string>;
  }

  /**
   * A list of HTTP methods that CloudFront includes as values for the `Access-Control-Allow-Methods` HTTP response header.
   *
   * For more information about the `Access-Control-Allow-Methods` HTTP response header, see [Access-Control-Allow-Methods](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowmethods.html
   */
  export interface AccessControlAllowMethodsProperty {
    /**
     * The list of HTTP methods. Valid values are:.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolallowmethods.html#cfn-cloudfront-responseheaderspolicy-accesscontrolallowmethods-items
     */
    readonly items: Array<string>;
  }

  /**
   * A list of HTTP headers that CloudFront includes as values for the `Access-Control-Expose-Headers` HTTP response header.
   *
   * For more information about the `Access-Control-Expose-Headers` HTTP response header, see [Access-Control-Expose-Headers](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolexposeheaders.html
   */
  export interface AccessControlExposeHeadersProperty {
    /**
     * The list of HTTP headers.
     *
     * You can specify `*` to expose all headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolexposeheaders.html#cfn-cloudfront-responseheaderspolicy-accesscontrolexposeheaders-items
     */
    readonly items: Array<string>;
  }

  /**
   * A list of origins (domain names) that CloudFront can use as the value for the `Access-Control-Allow-Origin` HTTP response header.
   *
   * For more information about the `Access-Control-Allow-Origin` HTTP response header, see [Access-Control-Allow-Origin](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) in the MDN Web Docs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolalloworigins.html
   */
  export interface AccessControlAllowOriginsProperty {
    /**
     * The list of origins (domain names).
     *
     * You can specify `*` to allow all origins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-accesscontrolalloworigins.html#cfn-cloudfront-responseheaderspolicy-accesscontrolalloworigins-items
     */
    readonly items: Array<string>;
  }

  /**
   * A configuration for enabling the `Server-Timing` header in HTTP responses sent from CloudFront.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-servertimingheadersconfig.html
   */
  export interface ServerTimingHeadersConfigProperty {
    /**
     * A Boolean that determines whether CloudFront adds the `Server-Timing` header to HTTP responses that it sends in response to requests that match a cache behavior that's associated with this response headers policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-servertimingheadersconfig.html#cfn-cloudfront-responseheaderspolicy-servertimingheadersconfig-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * A number 0–100 (inclusive) that specifies the percentage of responses that you want CloudFront to add the `Server-Timing` header to.
     *
     * When you set the sampling rate to 100, CloudFront adds the `Server-Timing` header to the HTTP response for every request that matches the cache behavior that this response headers policy is attached to. When you set it to 50, CloudFront adds the header to 50% of the responses for requests that match the cache behavior. You can set the sampling rate to any number 0–100 with up to four decimal places.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-servertimingheadersconfig.html#cfn-cloudfront-responseheaderspolicy-servertimingheadersconfig-samplingrate
     */
    readonly samplingRate?: number;
  }

  /**
   * A list of HTTP response header names and their values.
   *
   * CloudFront includes these headers in HTTP responses that it sends for requests that match a cache behavior that's associated with this response headers policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheadersconfig.html
   */
  export interface CustomHeadersConfigProperty {
    /**
     * The list of HTTP response headers and their values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheadersconfig.html#cfn-cloudfront-responseheaderspolicy-customheadersconfig-items
     */
    readonly items: Array<CfnResponseHeadersPolicy.CustomHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * An HTTP response header name and its value.
   *
   * CloudFront includes this header in HTTP responses that it sends for requests that match a cache behavior that's associated with this response headers policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html
   */
  export interface CustomHeaderProperty {
    /**
     * The HTTP response header name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html#cfn-cloudfront-responseheaderspolicy-customheader-header
     */
    readonly header: string;

    /**
     * A Boolean that determines whether CloudFront overrides a response header with the same name received from the origin with the header specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html#cfn-cloudfront-responseheaderspolicy-customheader-override
     */
    readonly override: boolean | cdk.IResolvable;

    /**
     * The value for the HTTP response header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-responseheaderspolicy-customheader.html#cfn-cloudfront-responseheaderspolicy-customheader-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnResponseHeadersPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html
 */
export interface CfnResponseHeadersPolicyProps {
  /**
   * A response headers policy configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-responseheaderspolicy.html#cfn-cloudfront-responseheaderspolicy-responseheaderspolicyconfig
   */
  readonly responseHeadersPolicyConfig: cdk.IResolvable | CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty;
}

/**
 * Determine whether the given properties match those of a `ContentSecurityPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ContentSecurityPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyContentSecurityPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentSecurityPolicy", cdk.requiredValidator)(properties.contentSecurityPolicy));
  errors.collect(cdk.propertyValidator("contentSecurityPolicy", cdk.validateString)(properties.contentSecurityPolicy));
  errors.collect(cdk.propertyValidator("override", cdk.requiredValidator)(properties.override));
  errors.collect(cdk.propertyValidator("override", cdk.validateBoolean)(properties.override));
  return errors.wrap("supplied properties not correct for \"ContentSecurityPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyContentSecurityPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyContentSecurityPolicyPropertyValidator(properties).assertSuccess();
  return {
    "ContentSecurityPolicy": cdk.stringToCloudFormation(properties.contentSecurityPolicy),
    "Override": cdk.booleanToCloudFormation(properties.override)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyContentSecurityPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.ContentSecurityPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ContentSecurityPolicyProperty>();
  ret.addPropertyResult("contentSecurityPolicy", "ContentSecurityPolicy", (properties.ContentSecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ContentSecurityPolicy) : undefined));
  ret.addPropertyResult("override", "Override", (properties.Override != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Override) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FrameOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyFrameOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("frameOption", cdk.requiredValidator)(properties.frameOption));
  errors.collect(cdk.propertyValidator("frameOption", cdk.validateString)(properties.frameOption));
  errors.collect(cdk.propertyValidator("override", cdk.requiredValidator)(properties.override));
  errors.collect(cdk.propertyValidator("override", cdk.validateBoolean)(properties.override));
  return errors.wrap("supplied properties not correct for \"FrameOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyFrameOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyFrameOptionsPropertyValidator(properties).assertSuccess();
  return {
    "FrameOption": cdk.stringToCloudFormation(properties.frameOption),
    "Override": cdk.booleanToCloudFormation(properties.override)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyFrameOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.FrameOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.FrameOptionsProperty>();
  ret.addPropertyResult("frameOption", "FrameOption", (properties.FrameOption != null ? cfn_parse.FromCloudFormation.getString(properties.FrameOption) : undefined));
  ret.addPropertyResult("override", "Override", (properties.Override != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Override) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContentTypeOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ContentTypeOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyContentTypeOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("override", cdk.requiredValidator)(properties.override));
  errors.collect(cdk.propertyValidator("override", cdk.validateBoolean)(properties.override));
  return errors.wrap("supplied properties not correct for \"ContentTypeOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyContentTypeOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyContentTypeOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Override": cdk.booleanToCloudFormation(properties.override)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyContentTypeOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.ContentTypeOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ContentTypeOptionsProperty>();
  ret.addPropertyResult("override", "Override", (properties.Override != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Override) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StrictTransportSecurityProperty`
 *
 * @param properties - the TypeScript properties of a `StrictTransportSecurityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyStrictTransportSecurityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessControlMaxAgeSec", cdk.requiredValidator)(properties.accessControlMaxAgeSec));
  errors.collect(cdk.propertyValidator("accessControlMaxAgeSec", cdk.validateNumber)(properties.accessControlMaxAgeSec));
  errors.collect(cdk.propertyValidator("includeSubdomains", cdk.validateBoolean)(properties.includeSubdomains));
  errors.collect(cdk.propertyValidator("override", cdk.requiredValidator)(properties.override));
  errors.collect(cdk.propertyValidator("override", cdk.validateBoolean)(properties.override));
  errors.collect(cdk.propertyValidator("preload", cdk.validateBoolean)(properties.preload));
  return errors.wrap("supplied properties not correct for \"StrictTransportSecurityProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyStrictTransportSecurityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyStrictTransportSecurityPropertyValidator(properties).assertSuccess();
  return {
    "AccessControlMaxAgeSec": cdk.numberToCloudFormation(properties.accessControlMaxAgeSec),
    "IncludeSubdomains": cdk.booleanToCloudFormation(properties.includeSubdomains),
    "Override": cdk.booleanToCloudFormation(properties.override),
    "Preload": cdk.booleanToCloudFormation(properties.preload)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyStrictTransportSecurityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.StrictTransportSecurityProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.StrictTransportSecurityProperty>();
  ret.addPropertyResult("accessControlMaxAgeSec", "AccessControlMaxAgeSec", (properties.AccessControlMaxAgeSec != null ? cfn_parse.FromCloudFormation.getNumber(properties.AccessControlMaxAgeSec) : undefined));
  ret.addPropertyResult("includeSubdomains", "IncludeSubdomains", (properties.IncludeSubdomains != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSubdomains) : undefined));
  ret.addPropertyResult("override", "Override", (properties.Override != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Override) : undefined));
  ret.addPropertyResult("preload", "Preload", (properties.Preload != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Preload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `XSSProtectionProperty`
 *
 * @param properties - the TypeScript properties of a `XSSProtectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyXSSProtectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("modeBlock", cdk.validateBoolean)(properties.modeBlock));
  errors.collect(cdk.propertyValidator("override", cdk.requiredValidator)(properties.override));
  errors.collect(cdk.propertyValidator("override", cdk.validateBoolean)(properties.override));
  errors.collect(cdk.propertyValidator("protection", cdk.requiredValidator)(properties.protection));
  errors.collect(cdk.propertyValidator("protection", cdk.validateBoolean)(properties.protection));
  errors.collect(cdk.propertyValidator("reportUri", cdk.validateString)(properties.reportUri));
  return errors.wrap("supplied properties not correct for \"XSSProtectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyXSSProtectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyXSSProtectionPropertyValidator(properties).assertSuccess();
  return {
    "ModeBlock": cdk.booleanToCloudFormation(properties.modeBlock),
    "Override": cdk.booleanToCloudFormation(properties.override),
    "Protection": cdk.booleanToCloudFormation(properties.protection),
    "ReportUri": cdk.stringToCloudFormation(properties.reportUri)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyXSSProtectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.XSSProtectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.XSSProtectionProperty>();
  ret.addPropertyResult("modeBlock", "ModeBlock", (properties.ModeBlock != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ModeBlock) : undefined));
  ret.addPropertyResult("override", "Override", (properties.Override != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Override) : undefined));
  ret.addPropertyResult("protection", "Protection", (properties.Protection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Protection) : undefined));
  ret.addPropertyResult("reportUri", "ReportUri", (properties.ReportUri != null ? cfn_parse.FromCloudFormation.getString(properties.ReportUri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReferrerPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ReferrerPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyReferrerPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("override", cdk.requiredValidator)(properties.override));
  errors.collect(cdk.propertyValidator("override", cdk.validateBoolean)(properties.override));
  errors.collect(cdk.propertyValidator("referrerPolicy", cdk.requiredValidator)(properties.referrerPolicy));
  errors.collect(cdk.propertyValidator("referrerPolicy", cdk.validateString)(properties.referrerPolicy));
  return errors.wrap("supplied properties not correct for \"ReferrerPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyReferrerPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyReferrerPolicyPropertyValidator(properties).assertSuccess();
  return {
    "Override": cdk.booleanToCloudFormation(properties.override),
    "ReferrerPolicy": cdk.stringToCloudFormation(properties.referrerPolicy)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyReferrerPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.ReferrerPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ReferrerPolicyProperty>();
  ret.addPropertyResult("override", "Override", (properties.Override != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Override) : undefined));
  ret.addPropertyResult("referrerPolicy", "ReferrerPolicy", (properties.ReferrerPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ReferrerPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecurityHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SecurityHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicySecurityHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentSecurityPolicy", CfnResponseHeadersPolicyContentSecurityPolicyPropertyValidator)(properties.contentSecurityPolicy));
  errors.collect(cdk.propertyValidator("contentTypeOptions", CfnResponseHeadersPolicyContentTypeOptionsPropertyValidator)(properties.contentTypeOptions));
  errors.collect(cdk.propertyValidator("frameOptions", CfnResponseHeadersPolicyFrameOptionsPropertyValidator)(properties.frameOptions));
  errors.collect(cdk.propertyValidator("referrerPolicy", CfnResponseHeadersPolicyReferrerPolicyPropertyValidator)(properties.referrerPolicy));
  errors.collect(cdk.propertyValidator("strictTransportSecurity", CfnResponseHeadersPolicyStrictTransportSecurityPropertyValidator)(properties.strictTransportSecurity));
  errors.collect(cdk.propertyValidator("xssProtection", CfnResponseHeadersPolicyXSSProtectionPropertyValidator)(properties.xssProtection));
  return errors.wrap("supplied properties not correct for \"SecurityHeadersConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicySecurityHeadersConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicySecurityHeadersConfigPropertyValidator(properties).assertSuccess();
  return {
    "ContentSecurityPolicy": convertCfnResponseHeadersPolicyContentSecurityPolicyPropertyToCloudFormation(properties.contentSecurityPolicy),
    "ContentTypeOptions": convertCfnResponseHeadersPolicyContentTypeOptionsPropertyToCloudFormation(properties.contentTypeOptions),
    "FrameOptions": convertCfnResponseHeadersPolicyFrameOptionsPropertyToCloudFormation(properties.frameOptions),
    "ReferrerPolicy": convertCfnResponseHeadersPolicyReferrerPolicyPropertyToCloudFormation(properties.referrerPolicy),
    "StrictTransportSecurity": convertCfnResponseHeadersPolicyStrictTransportSecurityPropertyToCloudFormation(properties.strictTransportSecurity),
    "XSSProtection": convertCfnResponseHeadersPolicyXSSProtectionPropertyToCloudFormation(properties.xssProtection)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicySecurityHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.SecurityHeadersConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.SecurityHeadersConfigProperty>();
  ret.addPropertyResult("contentSecurityPolicy", "ContentSecurityPolicy", (properties.ContentSecurityPolicy != null ? CfnResponseHeadersPolicyContentSecurityPolicyPropertyFromCloudFormation(properties.ContentSecurityPolicy) : undefined));
  ret.addPropertyResult("contentTypeOptions", "ContentTypeOptions", (properties.ContentTypeOptions != null ? CfnResponseHeadersPolicyContentTypeOptionsPropertyFromCloudFormation(properties.ContentTypeOptions) : undefined));
  ret.addPropertyResult("frameOptions", "FrameOptions", (properties.FrameOptions != null ? CfnResponseHeadersPolicyFrameOptionsPropertyFromCloudFormation(properties.FrameOptions) : undefined));
  ret.addPropertyResult("referrerPolicy", "ReferrerPolicy", (properties.ReferrerPolicy != null ? CfnResponseHeadersPolicyReferrerPolicyPropertyFromCloudFormation(properties.ReferrerPolicy) : undefined));
  ret.addPropertyResult("strictTransportSecurity", "StrictTransportSecurity", (properties.StrictTransportSecurity != null ? CfnResponseHeadersPolicyStrictTransportSecurityPropertyFromCloudFormation(properties.StrictTransportSecurity) : undefined));
  ret.addPropertyResult("xssProtection", "XSSProtection", (properties.XSSProtection != null ? CfnResponseHeadersPolicyXSSProtectionPropertyFromCloudFormation(properties.XSSProtection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RemoveHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `RemoveHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyRemoveHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("header", cdk.requiredValidator)(properties.header));
  errors.collect(cdk.propertyValidator("header", cdk.validateString)(properties.header));
  return errors.wrap("supplied properties not correct for \"RemoveHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyRemoveHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyRemoveHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Header": cdk.stringToCloudFormation(properties.header)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyRemoveHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.RemoveHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.RemoveHeaderProperty>();
  ret.addPropertyResult("header", "Header", (properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RemoveHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RemoveHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyRemoveHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(CfnResponseHeadersPolicyRemoveHeaderPropertyValidator))(properties.items));
  return errors.wrap("supplied properties not correct for \"RemoveHeadersConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyRemoveHeadersConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyRemoveHeadersConfigPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(convertCfnResponseHeadersPolicyRemoveHeaderPropertyToCloudFormation)(properties.items)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyRemoveHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.RemoveHeadersConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.RemoveHeadersConfigProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(CfnResponseHeadersPolicyRemoveHeaderPropertyFromCloudFormation)(properties.Items) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessControlAllowHeadersProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowHeadersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowHeadersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(cdk.validateString))(properties.items));
  return errors.wrap("supplied properties not correct for \"AccessControlAllowHeadersProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyAccessControlAllowHeadersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyAccessControlAllowHeadersPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(cdk.stringToCloudFormation)(properties.items)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlAllowHeadersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlAllowHeadersProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Items) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessControlAllowMethodsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowMethodsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowMethodsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(cdk.validateString))(properties.items));
  return errors.wrap("supplied properties not correct for \"AccessControlAllowMethodsProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyAccessControlAllowMethodsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyAccessControlAllowMethodsPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(cdk.stringToCloudFormation)(properties.items)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowMethodsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlAllowMethodsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlAllowMethodsProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Items) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessControlExposeHeadersProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlExposeHeadersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlExposeHeadersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(cdk.validateString))(properties.items));
  return errors.wrap("supplied properties not correct for \"AccessControlExposeHeadersProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyAccessControlExposeHeadersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyAccessControlExposeHeadersPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(cdk.stringToCloudFormation)(properties.items)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlExposeHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlExposeHeadersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlExposeHeadersProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Items) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessControlAllowOriginsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAllowOriginsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowOriginsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(cdk.validateString))(properties.items));
  return errors.wrap("supplied properties not correct for \"AccessControlAllowOriginsProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyAccessControlAllowOriginsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyAccessControlAllowOriginsPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(cdk.stringToCloudFormation)(properties.items)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyAccessControlAllowOriginsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.AccessControlAllowOriginsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.AccessControlAllowOriginsProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Items) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyCorsConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessControlAllowCredentials", cdk.requiredValidator)(properties.accessControlAllowCredentials));
  errors.collect(cdk.propertyValidator("accessControlAllowCredentials", cdk.validateBoolean)(properties.accessControlAllowCredentials));
  errors.collect(cdk.propertyValidator("accessControlAllowHeaders", cdk.requiredValidator)(properties.accessControlAllowHeaders));
  errors.collect(cdk.propertyValidator("accessControlAllowHeaders", CfnResponseHeadersPolicyAccessControlAllowHeadersPropertyValidator)(properties.accessControlAllowHeaders));
  errors.collect(cdk.propertyValidator("accessControlAllowMethods", cdk.requiredValidator)(properties.accessControlAllowMethods));
  errors.collect(cdk.propertyValidator("accessControlAllowMethods", CfnResponseHeadersPolicyAccessControlAllowMethodsPropertyValidator)(properties.accessControlAllowMethods));
  errors.collect(cdk.propertyValidator("accessControlAllowOrigins", cdk.requiredValidator)(properties.accessControlAllowOrigins));
  errors.collect(cdk.propertyValidator("accessControlAllowOrigins", CfnResponseHeadersPolicyAccessControlAllowOriginsPropertyValidator)(properties.accessControlAllowOrigins));
  errors.collect(cdk.propertyValidator("accessControlExposeHeaders", CfnResponseHeadersPolicyAccessControlExposeHeadersPropertyValidator)(properties.accessControlExposeHeaders));
  errors.collect(cdk.propertyValidator("accessControlMaxAgeSec", cdk.validateNumber)(properties.accessControlMaxAgeSec));
  errors.collect(cdk.propertyValidator("originOverride", cdk.requiredValidator)(properties.originOverride));
  errors.collect(cdk.propertyValidator("originOverride", cdk.validateBoolean)(properties.originOverride));
  return errors.wrap("supplied properties not correct for \"CorsConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyCorsConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyCorsConfigPropertyValidator(properties).assertSuccess();
  return {
    "AccessControlAllowCredentials": cdk.booleanToCloudFormation(properties.accessControlAllowCredentials),
    "AccessControlAllowHeaders": convertCfnResponseHeadersPolicyAccessControlAllowHeadersPropertyToCloudFormation(properties.accessControlAllowHeaders),
    "AccessControlAllowMethods": convertCfnResponseHeadersPolicyAccessControlAllowMethodsPropertyToCloudFormation(properties.accessControlAllowMethods),
    "AccessControlAllowOrigins": convertCfnResponseHeadersPolicyAccessControlAllowOriginsPropertyToCloudFormation(properties.accessControlAllowOrigins),
    "AccessControlExposeHeaders": convertCfnResponseHeadersPolicyAccessControlExposeHeadersPropertyToCloudFormation(properties.accessControlExposeHeaders),
    "AccessControlMaxAgeSec": cdk.numberToCloudFormation(properties.accessControlMaxAgeSec),
    "OriginOverride": cdk.booleanToCloudFormation(properties.originOverride)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyCorsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.CorsConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.CorsConfigProperty>();
  ret.addPropertyResult("accessControlAllowCredentials", "AccessControlAllowCredentials", (properties.AccessControlAllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AccessControlAllowCredentials) : undefined));
  ret.addPropertyResult("accessControlAllowHeaders", "AccessControlAllowHeaders", (properties.AccessControlAllowHeaders != null ? CfnResponseHeadersPolicyAccessControlAllowHeadersPropertyFromCloudFormation(properties.AccessControlAllowHeaders) : undefined));
  ret.addPropertyResult("accessControlAllowMethods", "AccessControlAllowMethods", (properties.AccessControlAllowMethods != null ? CfnResponseHeadersPolicyAccessControlAllowMethodsPropertyFromCloudFormation(properties.AccessControlAllowMethods) : undefined));
  ret.addPropertyResult("accessControlAllowOrigins", "AccessControlAllowOrigins", (properties.AccessControlAllowOrigins != null ? CfnResponseHeadersPolicyAccessControlAllowOriginsPropertyFromCloudFormation(properties.AccessControlAllowOrigins) : undefined));
  ret.addPropertyResult("accessControlExposeHeaders", "AccessControlExposeHeaders", (properties.AccessControlExposeHeaders != null ? CfnResponseHeadersPolicyAccessControlExposeHeadersPropertyFromCloudFormation(properties.AccessControlExposeHeaders) : undefined));
  ret.addPropertyResult("accessControlMaxAgeSec", "AccessControlMaxAgeSec", (properties.AccessControlMaxAgeSec != null ? cfn_parse.FromCloudFormation.getNumber(properties.AccessControlMaxAgeSec) : undefined));
  ret.addPropertyResult("originOverride", "OriginOverride", (properties.OriginOverride != null ? cfn_parse.FromCloudFormation.getBoolean(properties.OriginOverride) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerTimingHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ServerTimingHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyServerTimingHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("samplingRate", cdk.validateNumber)(properties.samplingRate));
  return errors.wrap("supplied properties not correct for \"ServerTimingHeadersConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyServerTimingHeadersConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyServerTimingHeadersConfigPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "SamplingRate": cdk.numberToCloudFormation(properties.samplingRate)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyServerTimingHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.ServerTimingHeadersConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ServerTimingHeadersConfigProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("samplingRate", "SamplingRate", (properties.SamplingRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SamplingRate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyCustomHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("header", cdk.requiredValidator)(properties.header));
  errors.collect(cdk.propertyValidator("header", cdk.validateString)(properties.header));
  errors.collect(cdk.propertyValidator("override", cdk.requiredValidator)(properties.override));
  errors.collect(cdk.propertyValidator("override", cdk.validateBoolean)(properties.override));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CustomHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyCustomHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyCustomHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Header": cdk.stringToCloudFormation(properties.header),
    "Override": cdk.booleanToCloudFormation(properties.override),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyCustomHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.CustomHeaderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.CustomHeaderProperty>();
  ret.addPropertyResult("header", "Header", (properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined));
  ret.addPropertyResult("override", "Override", (properties.Override != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Override) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomHeadersConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHeadersConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyCustomHeadersConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(CfnResponseHeadersPolicyCustomHeaderPropertyValidator))(properties.items));
  return errors.wrap("supplied properties not correct for \"CustomHeadersConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyCustomHeadersConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyCustomHeadersConfigPropertyValidator(properties).assertSuccess();
  return {
    "Items": cdk.listMapper(convertCfnResponseHeadersPolicyCustomHeaderPropertyToCloudFormation)(properties.items)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyCustomHeadersConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicy.CustomHeadersConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.CustomHeadersConfigProperty>();
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(CfnResponseHeadersPolicyCustomHeaderPropertyFromCloudFormation)(properties.Items) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseHeadersPolicyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseHeadersPolicyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("corsConfig", CfnResponseHeadersPolicyCorsConfigPropertyValidator)(properties.corsConfig));
  errors.collect(cdk.propertyValidator("customHeadersConfig", CfnResponseHeadersPolicyCustomHeadersConfigPropertyValidator)(properties.customHeadersConfig));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("removeHeadersConfig", CfnResponseHeadersPolicyRemoveHeadersConfigPropertyValidator)(properties.removeHeadersConfig));
  errors.collect(cdk.propertyValidator("securityHeadersConfig", CfnResponseHeadersPolicySecurityHeadersConfigPropertyValidator)(properties.securityHeadersConfig));
  errors.collect(cdk.propertyValidator("serverTimingHeadersConfig", CfnResponseHeadersPolicyServerTimingHeadersConfigPropertyValidator)(properties.serverTimingHeadersConfig));
  return errors.wrap("supplied properties not correct for \"ResponseHeadersPolicyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "CorsConfig": convertCfnResponseHeadersPolicyCorsConfigPropertyToCloudFormation(properties.corsConfig),
    "CustomHeadersConfig": convertCfnResponseHeadersPolicyCustomHeadersConfigPropertyToCloudFormation(properties.customHeadersConfig),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RemoveHeadersConfig": convertCfnResponseHeadersPolicyRemoveHeadersConfigPropertyToCloudFormation(properties.removeHeadersConfig),
    "SecurityHeadersConfig": convertCfnResponseHeadersPolicySecurityHeadersConfigPropertyToCloudFormation(properties.securityHeadersConfig),
    "ServerTimingHeadersConfig": convertCfnResponseHeadersPolicyServerTimingHeadersConfigPropertyToCloudFormation(properties.serverTimingHeadersConfig)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicy.ResponseHeadersPolicyConfigProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("corsConfig", "CorsConfig", (properties.CorsConfig != null ? CfnResponseHeadersPolicyCorsConfigPropertyFromCloudFormation(properties.CorsConfig) : undefined));
  ret.addPropertyResult("customHeadersConfig", "CustomHeadersConfig", (properties.CustomHeadersConfig != null ? CfnResponseHeadersPolicyCustomHeadersConfigPropertyFromCloudFormation(properties.CustomHeadersConfig) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("removeHeadersConfig", "RemoveHeadersConfig", (properties.RemoveHeadersConfig != null ? CfnResponseHeadersPolicyRemoveHeadersConfigPropertyFromCloudFormation(properties.RemoveHeadersConfig) : undefined));
  ret.addPropertyResult("securityHeadersConfig", "SecurityHeadersConfig", (properties.SecurityHeadersConfig != null ? CfnResponseHeadersPolicySecurityHeadersConfigPropertyFromCloudFormation(properties.SecurityHeadersConfig) : undefined));
  ret.addPropertyResult("serverTimingHeadersConfig", "ServerTimingHeadersConfig", (properties.ServerTimingHeadersConfig != null ? CfnResponseHeadersPolicyServerTimingHeadersConfigPropertyFromCloudFormation(properties.ServerTimingHeadersConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResponseHeadersPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResponseHeadersPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponseHeadersPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("responseHeadersPolicyConfig", cdk.requiredValidator)(properties.responseHeadersPolicyConfig));
  errors.collect(cdk.propertyValidator("responseHeadersPolicyConfig", CfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyValidator)(properties.responseHeadersPolicyConfig));
  return errors.wrap("supplied properties not correct for \"CfnResponseHeadersPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResponseHeadersPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponseHeadersPolicyPropsValidator(properties).assertSuccess();
  return {
    "ResponseHeadersPolicyConfig": convertCfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyToCloudFormation(properties.responseHeadersPolicyConfig)
  };
}

// @ts-ignore TS6133
function CfnResponseHeadersPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponseHeadersPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponseHeadersPolicyProps>();
  ret.addPropertyResult("responseHeadersPolicyConfig", "ResponseHeadersPolicyConfig", (properties.ResponseHeadersPolicyConfig != null ? CfnResponseHeadersPolicyResponseHeadersPolicyConfigPropertyFromCloudFormation(properties.ResponseHeadersPolicyConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource is deprecated.
 *
 * Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, [read the announcement](https://docs.aws.amazon.com/ann.jspa?annID=7356) on the Amazon CloudFront discussion forum.
 *
 * @cloudformationResource AWS::CloudFront::StreamingDistribution
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html
 */
export class CfnStreamingDistribution extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::StreamingDistribution";

  /**
   * Build a CfnStreamingDistribution from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStreamingDistribution(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The domain name of the resource, such as `d111111abcdef8.cloudfront.net` .
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * The identifier for the RTMP distribution. For example: `EGTXBD79EXAMPLE` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The current configuration information for the RTMP distribution.
   */
  public streamingDistributionConfig: cdk.IResolvable | CfnStreamingDistribution.StreamingDistributionConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A complex type that contains zero or more `Tag` elements.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStreamingDistributionProps) {
    super(scope, id, {
      "type": CfnStreamingDistribution.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "streamingDistributionConfig", this);

    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.streamingDistributionConfig = props.streamingDistributionConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudFront::StreamingDistribution", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "streamingDistributionConfig": this.streamingDistributionConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamingDistribution.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStreamingDistributionPropsToCloudFormation(props);
  }
}

export namespace CfnStreamingDistribution {
  /**
   * The RTMP distribution's configuration information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html
   */
  export interface StreamingDistributionConfigProperty {
    /**
     * A complex type that contains information about CNAMEs (alternate domain names), if any, for this streaming distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-aliases
     */
    readonly aliases?: Array<string>;

    /**
     * Any comments you want to include about the streaming distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-comment
     */
    readonly comment: string;

    /**
     * Whether the streaming distribution is enabled to accept user requests for content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * A complex type that controls whether access logs are written for the streaming distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-logging
     */
    readonly logging?: cdk.IResolvable | CfnStreamingDistribution.LoggingProperty;

    /**
     * A complex type that contains information about price class for this streaming distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-priceclass
     */
    readonly priceClass?: string;

    /**
     * A complex type that contains information about the Amazon S3 bucket from which you want CloudFront to get your media files for distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-s3origin
     */
    readonly s3Origin: cdk.IResolvable | CfnStreamingDistribution.S3OriginProperty;

    /**
     * A complex type that specifies any AWS accounts that you want to permit to create signed URLs for private content.
     *
     * If you want the distribution to use signed URLs, include this element; if you want the distribution to use public URLs, remove this element. For more information, see [Serving Private Content through CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-trustedsigners
     */
    readonly trustedSigners: cdk.IResolvable | CfnStreamingDistribution.TrustedSignersProperty;
  }

  /**
   * A complex type that controls whether access logs are written for the streaming distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html
   */
  export interface LoggingProperty {
    /**
     * The Amazon S3 bucket to store the access logs in, for example, `myawslogbucket.s3.amazonaws.com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html#cfn-cloudfront-streamingdistribution-logging-bucket
     */
    readonly bucket: string;

    /**
     * Specifies whether you want CloudFront to save access logs to an Amazon S3 bucket.
     *
     * If you don't want to enable logging when you create a streaming distribution or if you want to disable logging for an existing streaming distribution, specify `false` for `Enabled` , and specify `empty Bucket` and `Prefix` elements. If you specify `false` for `Enabled` but you specify values for `Bucket` and `Prefix` , the values are automatically deleted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html#cfn-cloudfront-streamingdistribution-logging-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * An optional string that you want CloudFront to prefix to the access log filenames for this streaming distribution, for example, `myprefix/` .
     *
     * If you want to enable logging, but you don't want to specify a prefix, you still must include an empty `Prefix` element in the `Logging` element.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-logging.html#cfn-cloudfront-streamingdistribution-logging-prefix
     */
    readonly prefix: string;
  }

  /**
   * A complex type that contains information about the Amazon S3 bucket from which you want CloudFront to get your media files for distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html
   */
  export interface S3OriginProperty {
    /**
     * The DNS name of the Amazon S3 origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html#cfn-cloudfront-streamingdistribution-s3origin-domainname
     */
    readonly domainName: string;

    /**
     * The CloudFront origin access identity to associate with the distribution.
     *
     * Use an origin access identity to configure the distribution so that end users can only access objects in an Amazon S3 bucket through CloudFront.
     *
     * If you want end users to be able to access objects using either the CloudFront URL or the Amazon S3 URL, specify an empty `OriginAccessIdentity` element.
     *
     * To delete the origin access identity from an existing distribution, update the distribution configuration and include an empty `OriginAccessIdentity` element.
     *
     * To replace the origin access identity, update the distribution configuration and specify the new origin access identity.
     *
     * For more information, see [Using an Origin Access Identity to Restrict Access to Your Amazon S3 Content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) in the *Amazon CloudFront Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html#cfn-cloudfront-streamingdistribution-s3origin-originaccessidentity
     */
    readonly originAccessIdentity: string;
  }

  /**
   * A list of AWS accounts whose public keys CloudFront can use to verify the signatures of signed URLs and signed cookies.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-trustedsigners.html
   */
  export interface TrustedSignersProperty {
    /**
     * An AWS account number that contains active CloudFront key pairs that CloudFront can use to verify the signatures of signed URLs and signed cookies.
     *
     * If the AWS account that owns the key pairs is the same account that owns the CloudFront distribution, the value of this field is `self` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-trustedsigners.html#cfn-cloudfront-streamingdistribution-trustedsigners-awsaccountnumbers
     */
    readonly awsAccountNumbers?: Array<string>;

    /**
     * This field is `true` if any of the AWS accounts in the list are configured as trusted signers.
     *
     * If not, this field is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-trustedsigners.html#cfn-cloudfront-streamingdistribution-trustedsigners-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnStreamingDistribution`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html
 */
export interface CfnStreamingDistributionProps {
  /**
   * The current configuration information for the RTMP distribution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig
   */
  readonly streamingDistributionConfig: cdk.IResolvable | CfnStreamingDistribution.StreamingDistributionConfigProperty;

  /**
   * A complex type that contains zero or more `Tag` elements.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamingDistributionLoggingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("prefix", cdk.requiredValidator)(properties.prefix));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"LoggingProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamingDistributionLoggingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamingDistributionLoggingPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnStreamingDistributionLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStreamingDistribution.LoggingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.LoggingProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3OriginProperty`
 *
 * @param properties - the TypeScript properties of a `S3OriginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamingDistributionS3OriginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("originAccessIdentity", cdk.requiredValidator)(properties.originAccessIdentity));
  errors.collect(cdk.propertyValidator("originAccessIdentity", cdk.validateString)(properties.originAccessIdentity));
  return errors.wrap("supplied properties not correct for \"S3OriginProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamingDistributionS3OriginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamingDistributionS3OriginPropertyValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "OriginAccessIdentity": cdk.stringToCloudFormation(properties.originAccessIdentity)
  };
}

// @ts-ignore TS6133
function CfnStreamingDistributionS3OriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStreamingDistribution.S3OriginProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.S3OriginProperty>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("originAccessIdentity", "OriginAccessIdentity", (properties.OriginAccessIdentity != null ? cfn_parse.FromCloudFormation.getString(properties.OriginAccessIdentity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrustedSignersProperty`
 *
 * @param properties - the TypeScript properties of a `TrustedSignersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamingDistributionTrustedSignersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsAccountNumbers", cdk.listValidator(cdk.validateString))(properties.awsAccountNumbers));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TrustedSignersProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamingDistributionTrustedSignersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamingDistributionTrustedSignersPropertyValidator(properties).assertSuccess();
  return {
    "AwsAccountNumbers": cdk.listMapper(cdk.stringToCloudFormation)(properties.awsAccountNumbers),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnStreamingDistributionTrustedSignersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStreamingDistribution.TrustedSignersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.TrustedSignersProperty>();
  ret.addPropertyResult("awsAccountNumbers", "AwsAccountNumbers", (properties.AwsAccountNumbers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AwsAccountNumbers) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StreamingDistributionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `StreamingDistributionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamingDistributionStreamingDistributionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aliases", cdk.listValidator(cdk.validateString))(properties.aliases));
  errors.collect(cdk.propertyValidator("comment", cdk.requiredValidator)(properties.comment));
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("logging", CfnStreamingDistributionLoggingPropertyValidator)(properties.logging));
  errors.collect(cdk.propertyValidator("priceClass", cdk.validateString)(properties.priceClass));
  errors.collect(cdk.propertyValidator("s3Origin", cdk.requiredValidator)(properties.s3Origin));
  errors.collect(cdk.propertyValidator("s3Origin", CfnStreamingDistributionS3OriginPropertyValidator)(properties.s3Origin));
  errors.collect(cdk.propertyValidator("trustedSigners", cdk.requiredValidator)(properties.trustedSigners));
  errors.collect(cdk.propertyValidator("trustedSigners", CfnStreamingDistributionTrustedSignersPropertyValidator)(properties.trustedSigners));
  return errors.wrap("supplied properties not correct for \"StreamingDistributionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamingDistributionStreamingDistributionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamingDistributionStreamingDistributionConfigPropertyValidator(properties).assertSuccess();
  return {
    "Aliases": cdk.listMapper(cdk.stringToCloudFormation)(properties.aliases),
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Logging": convertCfnStreamingDistributionLoggingPropertyToCloudFormation(properties.logging),
    "PriceClass": cdk.stringToCloudFormation(properties.priceClass),
    "S3Origin": convertCfnStreamingDistributionS3OriginPropertyToCloudFormation(properties.s3Origin),
    "TrustedSigners": convertCfnStreamingDistributionTrustedSignersPropertyToCloudFormation(properties.trustedSigners)
  };
}

// @ts-ignore TS6133
function CfnStreamingDistributionStreamingDistributionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStreamingDistribution.StreamingDistributionConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistribution.StreamingDistributionConfigProperty>();
  ret.addPropertyResult("aliases", "Aliases", (properties.Aliases != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Aliases) : undefined));
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? CfnStreamingDistributionLoggingPropertyFromCloudFormation(properties.Logging) : undefined));
  ret.addPropertyResult("priceClass", "PriceClass", (properties.PriceClass != null ? cfn_parse.FromCloudFormation.getString(properties.PriceClass) : undefined));
  ret.addPropertyResult("s3Origin", "S3Origin", (properties.S3Origin != null ? CfnStreamingDistributionS3OriginPropertyFromCloudFormation(properties.S3Origin) : undefined));
  ret.addPropertyResult("trustedSigners", "TrustedSigners", (properties.TrustedSigners != null ? CfnStreamingDistributionTrustedSignersPropertyFromCloudFormation(properties.TrustedSigners) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStreamingDistributionProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamingDistributionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamingDistributionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("streamingDistributionConfig", cdk.requiredValidator)(properties.streamingDistributionConfig));
  errors.collect(cdk.propertyValidator("streamingDistributionConfig", CfnStreamingDistributionStreamingDistributionConfigPropertyValidator)(properties.streamingDistributionConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStreamingDistributionProps\"");
}

// @ts-ignore TS6133
function convertCfnStreamingDistributionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamingDistributionPropsValidator(properties).assertSuccess();
  return {
    "StreamingDistributionConfig": convertCfnStreamingDistributionStreamingDistributionConfigPropertyToCloudFormation(properties.streamingDistributionConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStreamingDistributionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingDistributionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingDistributionProps>();
  ret.addPropertyResult("streamingDistributionConfig", "StreamingDistributionConfig", (properties.StreamingDistributionConfig != null ? CfnStreamingDistributionStreamingDistributionConfigPropertyFromCloudFormation(properties.StreamingDistributionConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The Key Value Store.
 *
 * Use this to separate data from function code, allowing you to update data without having to publish a new version of a function. The Key Value Store holds keys and their corresponding values.
 *
 * @cloudformationResource AWS::CloudFront::KeyValueStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keyvaluestore.html
 */
export class CfnKeyValueStore extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFront::KeyValueStore";

  /**
   * Build a CfnKeyValueStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnKeyValueStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnKeyValueStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnKeyValueStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the Key Value Store.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique Id for the Key Value Store.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The status of the Key Value Store.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * A comment for the Key Value Store.
   */
  public comment?: string;

  /**
   * The import source for the Key Value Store.
   */
  public importSource?: CfnKeyValueStore.ImportSourceProperty | cdk.IResolvable;

  /**
   * The name of the Key Value Store.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnKeyValueStoreProps) {
    super(scope, id, {
      "type": CfnKeyValueStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.comment = props.comment;
    this.importSource = props.importSource;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "comment": this.comment,
      "importSource": this.importSource,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnKeyValueStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnKeyValueStorePropsToCloudFormation(props);
  }
}

export namespace CfnKeyValueStore {
  /**
   * The import source for the Key Value Store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keyvaluestore-importsource.html
   */
  export interface ImportSourceProperty {
    /**
     * The Amazon Resource Name (ARN) of the import source for the Key Value Store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keyvaluestore-importsource.html#cfn-cloudfront-keyvaluestore-importsource-sourcearn
     */
    readonly sourceArn: string;

    /**
     * The source type of the import source for the Key Value Store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-keyvaluestore-importsource.html#cfn-cloudfront-keyvaluestore-importsource-sourcetype
     */
    readonly sourceType: string;
  }
}

/**
 * Properties for defining a `CfnKeyValueStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keyvaluestore.html
 */
export interface CfnKeyValueStoreProps {
  /**
   * A comment for the Key Value Store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keyvaluestore.html#cfn-cloudfront-keyvaluestore-comment
   */
  readonly comment?: string;

  /**
   * The import source for the Key Value Store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keyvaluestore.html#cfn-cloudfront-keyvaluestore-importsource
   */
  readonly importSource?: CfnKeyValueStore.ImportSourceProperty | cdk.IResolvable;

  /**
   * The name of the Key Value Store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-keyvaluestore.html#cfn-cloudfront-keyvaluestore-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `ImportSourceProperty`
 *
 * @param properties - the TypeScript properties of a `ImportSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKeyValueStoreImportSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sourceArn", cdk.requiredValidator)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceType", cdk.requiredValidator)(properties.sourceType));
  errors.collect(cdk.propertyValidator("sourceType", cdk.validateString)(properties.sourceType));
  return errors.wrap("supplied properties not correct for \"ImportSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnKeyValueStoreImportSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKeyValueStoreImportSourcePropertyValidator(properties).assertSuccess();
  return {
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn),
    "SourceType": cdk.stringToCloudFormation(properties.sourceType)
  };
}

// @ts-ignore TS6133
function CfnKeyValueStoreImportSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKeyValueStore.ImportSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyValueStore.ImportSourceProperty>();
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addPropertyResult("sourceType", "SourceType", (properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnKeyValueStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnKeyValueStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKeyValueStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("importSource", CfnKeyValueStoreImportSourcePropertyValidator)(properties.importSource));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnKeyValueStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnKeyValueStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKeyValueStorePropsValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "ImportSource": convertCfnKeyValueStoreImportSourcePropertyToCloudFormation(properties.importSource),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnKeyValueStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKeyValueStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyValueStoreProps>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("importSource", "ImportSource", (properties.ImportSource != null ? CfnKeyValueStoreImportSourcePropertyFromCloudFormation(properties.ImportSource) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}
/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * The `AWS::WAFRegional::ByteMatchSet` resource creates an AWS WAF `ByteMatchSet` that identifies a part of a web request that you want to inspect.
 *
 * @cloudformationResource AWS::WAFRegional::ByteMatchSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html
 */
export class CfnByteMatchSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::ByteMatchSet";

  /**
   * Build a CfnByteMatchSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnByteMatchSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnByteMatchSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnByteMatchSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Specifies the bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
   */
  public byteMatchTuples?: Array<CfnByteMatchSet.ByteMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A friendly name or description of the `ByteMatchSet` .
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnByteMatchSetProps) {
    super(scope, id, {
      "type": CfnByteMatchSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.byteMatchTuples = props.byteMatchTuples;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "byteMatchTuples": this.byteMatchTuples,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnByteMatchSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnByteMatchSetPropsToCloudFormation(props);
  }
}

export namespace CfnByteMatchSet {
  /**
   * > This is *AWS WAF Classic* documentation.
   *
   * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
   * >
   * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
   *
   * The bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html
   */
  export interface ByteMatchTupleProperty {
    /**
     * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-fieldtomatch
     */
    readonly fieldToMatch: CfnByteMatchSet.FieldToMatchProperty | cdk.IResolvable;

    /**
     * Within the portion of a web request that you want to search (for example, in the query string, if any), specify where you want AWS WAF to search.
     *
     * Valid values include the following:
     *
     * *CONTAINS*
     *
     * The specified part of the web request must include the value of `TargetString` , but the location doesn't matter.
     *
     * *CONTAINS_WORD*
     *
     * The specified part of the web request must include the value of `TargetString` , and `TargetString` must contain only alphanumeric characters or underscore (A-Z, a-z, 0-9, or _). In addition, `TargetString` must be a word, which means one of the following:
     *
     * - `TargetString` exactly matches the value of the specified part of the web request, such as the value of a header.
     * - `TargetString` is at the beginning of the specified part of the web request and is followed by a character other than an alphanumeric character or underscore (_), for example, `BadBot;` .
     * - `TargetString` is at the end of the specified part of the web request and is preceded by a character other than an alphanumeric character or underscore (_), for example, `;BadBot` .
     * - `TargetString` is in the middle of the specified part of the web request and is preceded and followed by characters other than alphanumeric characters or underscore (_), for example, `-BadBot;` .
     *
     * *EXACTLY*
     *
     * The value of the specified part of the web request must exactly match the value of `TargetString` .
     *
     * *STARTS_WITH*
     *
     * The value of `TargetString` must appear at the beginning of the specified part of the web request.
     *
     * *ENDS_WITH*
     *
     * The value of `TargetString` must appear at the end of the specified part of the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-positionalconstraint
     */
    readonly positionalConstraint: string;

    /**
     * The value that you want AWS WAF to search for.
     *
     * AWS WAF searches for the specified string in the part of web requests that you specified in `FieldToMatch` . The maximum length of the value is 50 bytes.
     *
     * You must specify this property or the `TargetStringBase64` property.
     *
     * Valid values depend on the values that you specified for `FieldToMatch` :
     *
     * - `HEADER` : The value that you want AWS WAF to search for in the request header that you specified in `FieldToMatch` , for example, the value of the `User-Agent` or `Referer` header.
     * - `METHOD` : The HTTP method, which indicates the type of operation specified in the request.
     * - `QUERY_STRING` : The value that you want AWS WAF to search for in the query string, which is the part of a URL that appears after a `?` character.
     * - `URI` : The value that you want AWS WAF to search for in the part of a URL that identifies a resource, for example, `/images/daily-ad.jpg` .
     * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
     * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
     * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but instead of inspecting a single parameter, AWS WAF inspects all parameters within the query string for the value or regex pattern that you specify in `TargetString` .
     *
     * If `TargetString` includes alphabetic characters A-Z and a-z, note that the value is case sensitive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-targetstring
     */
    readonly targetString?: string;

    /**
     * The base64-encoded value that AWS WAF searches for. AWS CloudFormation sends this value to AWS WAF without encoding it.
     *
     * You must specify this property or the `TargetString` property.
     *
     * AWS WAF searches for this value in a specific part of web requests, which you define in the `FieldToMatch` property.
     *
     * Valid values depend on the Type value in the `FieldToMatch` property. For example, for a `METHOD` type, you must specify HTTP methods such as `DELETE, GET, HEAD, OPTIONS, PATCH, POST` , and `PUT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-targetstringbase64
     */
    readonly targetStringBase64?: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF .
     *
     * If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting it for a match.
     *
     * You can only specify a single type of TextTransformation.
     *
     * *CMD_LINE*
     *
     * When you're concerned that attackers are injecting an operating system command line command and using unusual formatting to disguise some or all of the command, use this option to perform the following transformations:
     *
     * - Delete the following characters: \ " ' ^
     * - Delete spaces before the following characters: / (
     * - Replace the following characters with a space: , ;
     * - Replace multiple spaces with one space
     * - Convert uppercase letters (A-Z) to lowercase (a-z)
     *
     * *COMPRESS_WHITE_SPACE*
     *
     * Use this option to replace the following characters with a space character (decimal 32):
     *
     * - \f, formfeed, decimal 12
     * - \t, tab, decimal 9
     * - \n, newline, decimal 10
     * - \r, carriage return, decimal 13
     * - \v, vertical tab, decimal 11
     * - non-breaking space, decimal 160
     *
     * `COMPRESS_WHITE_SPACE` also replaces multiple spaces with one space.
     *
     * *HTML_ENTITY_DECODE*
     *
     * Use this option to replace HTML-encoded characters with unencoded characters. `HTML_ENTITY_DECODE` performs the following operations:
     *
     * - Replaces `(ampersand)quot;` with `"`
     * - Replaces `(ampersand)nbsp;` with a non-breaking space, decimal 160
     * - Replaces `(ampersand)lt;` with a "less than" symbol
     * - Replaces `(ampersand)gt;` with `>`
     * - Replaces characters that are represented in hexadecimal format, `(ampersand)#xhhhh;` , with the corresponding characters
     * - Replaces characters that are represented in decimal format, `(ampersand)#nnnn;` , with the corresponding characters
     *
     * *LOWERCASE*
     *
     * Use this option to convert uppercase letters (A-Z) to lowercase (a-z).
     *
     * *URL_DECODE*
     *
     * Use this option to decode a URL-encoded value.
     *
     * *NONE*
     *
     * Specify `NONE` if you don't want to perform any text transformations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-texttransformation
     */
    readonly textTransformation: string;
  }

  /**
   * > This is *AWS WAF Classic* documentation.
   *
   * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
   * >
   * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
   *
   * Specifies where in a web request to look for `TargetString` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-fieldtomatch.html
   */
  export interface FieldToMatchProperty {
    /**
     * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` .
     *
     * The name of the header is not case sensitive.
     *
     * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
     *
     * If the value of `Type` is any other value, omit `Data` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-fieldtomatch.html#cfn-wafregional-bytematchset-fieldtomatch-data
     */
    readonly data?: string;

    /**
     * The part of the web request that you want AWS WAF to search for a specified string.
     *
     * Parts of a request that you can search include the following:
     *
     * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
     * - `METHOD` : The HTTP method, which indicated the type of operation that the request is asking the origin to perform.
     * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
     * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
     * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
     * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
     * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-fieldtomatch.html#cfn-wafregional-bytematchset-fieldtomatch-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnByteMatchSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html
 */
export interface CfnByteMatchSetProps {
  /**
   * Specifies the bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-bytematchtuples
   */
  readonly byteMatchTuples?: Array<CfnByteMatchSet.ByteMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A friendly name or description of the `ByteMatchSet` .
   *
   * You can't change `Name` after you create a `ByteMatchSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnByteMatchSetFieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"FieldToMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnByteMatchSetFieldToMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnByteMatchSetFieldToMatchPropertyValidator(properties).assertSuccess();
  return {
    "Data": cdk.stringToCloudFormation(properties.data),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnByteMatchSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnByteMatchSet.FieldToMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnByteMatchSet.FieldToMatchProperty>();
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ByteMatchTupleProperty`
 *
 * @param properties - the TypeScript properties of a `ByteMatchTupleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnByteMatchSetByteMatchTuplePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnByteMatchSetFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("positionalConstraint", cdk.requiredValidator)(properties.positionalConstraint));
  errors.collect(cdk.propertyValidator("positionalConstraint", cdk.validateString)(properties.positionalConstraint));
  errors.collect(cdk.propertyValidator("targetString", cdk.validateString)(properties.targetString));
  errors.collect(cdk.propertyValidator("targetStringBase64", cdk.validateString)(properties.targetStringBase64));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.requiredValidator)(properties.textTransformation));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.validateString)(properties.textTransformation));
  return errors.wrap("supplied properties not correct for \"ByteMatchTupleProperty\"");
}

// @ts-ignore TS6133
function convertCfnByteMatchSetByteMatchTuplePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnByteMatchSetByteMatchTuplePropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnByteMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "PositionalConstraint": cdk.stringToCloudFormation(properties.positionalConstraint),
    "TargetString": cdk.stringToCloudFormation(properties.targetString),
    "TargetStringBase64": cdk.stringToCloudFormation(properties.targetStringBase64),
    "TextTransformation": cdk.stringToCloudFormation(properties.textTransformation)
  };
}

// @ts-ignore TS6133
function CfnByteMatchSetByteMatchTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnByteMatchSet.ByteMatchTupleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnByteMatchSet.ByteMatchTupleProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnByteMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("positionalConstraint", "PositionalConstraint", (properties.PositionalConstraint != null ? cfn_parse.FromCloudFormation.getString(properties.PositionalConstraint) : undefined));
  ret.addPropertyResult("targetString", "TargetString", (properties.TargetString != null ? cfn_parse.FromCloudFormation.getString(properties.TargetString) : undefined));
  ret.addPropertyResult("targetStringBase64", "TargetStringBase64", (properties.TargetStringBase64 != null ? cfn_parse.FromCloudFormation.getString(properties.TargetStringBase64) : undefined));
  ret.addPropertyResult("textTransformation", "TextTransformation", (properties.TextTransformation != null ? cfn_parse.FromCloudFormation.getString(properties.TextTransformation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnByteMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnByteMatchSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnByteMatchSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("byteMatchTuples", cdk.listValidator(CfnByteMatchSetByteMatchTuplePropertyValidator))(properties.byteMatchTuples));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnByteMatchSetProps\"");
}

// @ts-ignore TS6133
function convertCfnByteMatchSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnByteMatchSetPropsValidator(properties).assertSuccess();
  return {
    "ByteMatchTuples": cdk.listMapper(convertCfnByteMatchSetByteMatchTuplePropertyToCloudFormation)(properties.byteMatchTuples),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnByteMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnByteMatchSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnByteMatchSetProps>();
  ret.addPropertyResult("byteMatchTuples", "ByteMatchTuples", (properties.ByteMatchTuples != null ? cfn_parse.FromCloudFormation.getArray(CfnByteMatchSetByteMatchTuplePropertyFromCloudFormation)(properties.ByteMatchTuples) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains one or more countries that AWS WAF will search for.
 *
 * @cloudformationResource AWS::WAFRegional::GeoMatchSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html
 */
export class CfnGeoMatchSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::GeoMatchSet";

  /**
   * Build a CfnGeoMatchSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGeoMatchSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGeoMatchSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGeoMatchSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * An array of `GeoMatchConstraint` objects, which contain the country that you want AWS WAF to search for.
   */
  public geoMatchConstraints?: Array<CfnGeoMatchSet.GeoMatchConstraintProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A friendly name or description of the `GeoMatchSet` .
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGeoMatchSetProps) {
    super(scope, id, {
      "type": CfnGeoMatchSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.geoMatchConstraints = props.geoMatchConstraints;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "geoMatchConstraints": this.geoMatchConstraints,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGeoMatchSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGeoMatchSetPropsToCloudFormation(props);
  }
}

export namespace CfnGeoMatchSet {
  /**
   * > This is *AWS WAF Classic* documentation.
   *
   * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
   * >
   * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
   *
   * The country from which web requests originate that you want AWS WAF to search for.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-geomatchset-geomatchconstraint.html
   */
  export interface GeoMatchConstraintProperty {
    /**
     * The type of geographical area you want AWS WAF to search for.
     *
     * Currently `Country` is the only valid value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-geomatchset-geomatchconstraint.html#cfn-wafregional-geomatchset-geomatchconstraint-type
     */
    readonly type: string;

    /**
     * The country that you want AWS WAF to search for.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-geomatchset-geomatchconstraint.html#cfn-wafregional-geomatchset-geomatchconstraint-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnGeoMatchSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html
 */
export interface CfnGeoMatchSetProps {
  /**
   * An array of `GeoMatchConstraint` objects, which contain the country that you want AWS WAF to search for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html#cfn-wafregional-geomatchset-geomatchconstraints
   */
  readonly geoMatchConstraints?: Array<CfnGeoMatchSet.GeoMatchConstraintProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A friendly name or description of the `GeoMatchSet` .
   *
   * You can't change the name of an `GeoMatchSet` after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html#cfn-wafregional-geomatchset-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `GeoMatchConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `GeoMatchConstraintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGeoMatchSetGeoMatchConstraintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"GeoMatchConstraintProperty\"");
}

// @ts-ignore TS6133
function convertCfnGeoMatchSetGeoMatchConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGeoMatchSetGeoMatchConstraintPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnGeoMatchSetGeoMatchConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGeoMatchSet.GeoMatchConstraintProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGeoMatchSet.GeoMatchConstraintProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGeoMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnGeoMatchSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGeoMatchSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("geoMatchConstraints", cdk.listValidator(CfnGeoMatchSetGeoMatchConstraintPropertyValidator))(properties.geoMatchConstraints));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnGeoMatchSetProps\"");
}

// @ts-ignore TS6133
function convertCfnGeoMatchSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGeoMatchSetPropsValidator(properties).assertSuccess();
  return {
    "GeoMatchConstraints": cdk.listMapper(convertCfnGeoMatchSetGeoMatchConstraintPropertyToCloudFormation)(properties.geoMatchConstraints),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnGeoMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGeoMatchSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGeoMatchSetProps>();
  ret.addPropertyResult("geoMatchConstraints", "GeoMatchConstraints", (properties.GeoMatchConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnGeoMatchSetGeoMatchConstraintPropertyFromCloudFormation)(properties.GeoMatchConstraints) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains one or more IP addresses or blocks of IP addresses specified in Classless Inter-Domain Routing (CIDR) notation. AWS WAF supports IPv4 address ranges: /8 and any range between /16 through /32. AWS WAF supports IPv6 address ranges: /24, /32, /48, /56, /64, and /128.
 *
 * To specify an individual IP address, you specify the four-part IP address followed by a `/32` , for example, 192.0.2.0/32. To block a range of IP addresses, you can specify /8 or any range between /16 through /32 (for IPv4) or /24, /32, /48, /56, /64, or /128 (for IPv6). For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
 *
 * @cloudformationResource AWS::WAFRegional::IPSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html
 */
export class CfnIPSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::IPSet";

  /**
   * Build a CfnIPSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIPSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIPSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIPSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR notation) that web requests originate from.
   */
  public ipSetDescriptors?: Array<CfnIPSet.IPSetDescriptorProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A friendly name or description of the `IPSet` .
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIPSetProps) {
    super(scope, id, {
      "type": CfnIPSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.ipSetDescriptors = props.ipSetDescriptors;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ipSetDescriptors": this.ipSetDescriptors,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIPSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIPSetPropsToCloudFormation(props);
  }
}

export namespace CfnIPSet {
  /**
   * > This is *AWS WAF Classic* documentation.
   *
   * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
   * >
   * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
   *
   * Specifies the IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR format) that web requests originate from.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ipset-ipsetdescriptor.html
   */
  export interface IPSetDescriptorProperty {
    /**
     * Specify `IPV4` or `IPV6` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ipset-ipsetdescriptor.html#cfn-wafregional-ipset-ipsetdescriptor-type
     */
    readonly type: string;

    /**
     * Specify an IPv4 address by using CIDR notation. For example:.
     *
     * - To configure AWS WAF to allow, block, or count requests that originated from the IP address 192.0.2.44, specify `192.0.2.44/32` .
     * - To configure AWS WAF to allow, block, or count requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
     *
     * For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
     *
     * Specify an IPv6 address by using CIDR notation. For example:
     *
     * - To configure AWS WAF to allow, block, or count requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
     * - To configure AWS WAF to allow, block, or count requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ipset-ipsetdescriptor.html#cfn-wafregional-ipset-ipsetdescriptor-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnIPSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html
 */
export interface CfnIPSetProps {
  /**
   * The IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR notation) that web requests originate from.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-ipsetdescriptors
   */
  readonly ipSetDescriptors?: Array<CfnIPSet.IPSetDescriptorProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A friendly name or description of the `IPSet` .
   *
   * You can't change the name of an `IPSet` after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `IPSetDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetDescriptorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIPSetIPSetDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"IPSetDescriptorProperty\"");
}

// @ts-ignore TS6133
function convertCfnIPSetIPSetDescriptorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIPSetIPSetDescriptorPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnIPSetIPSetDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIPSet.IPSetDescriptorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIPSet.IPSetDescriptorProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIPSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIPSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipSetDescriptors", cdk.listValidator(CfnIPSetIPSetDescriptorPropertyValidator))(properties.ipSetDescriptors));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnIPSetProps\"");
}

// @ts-ignore TS6133
function convertCfnIPSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIPSetPropsValidator(properties).assertSuccess();
  return {
    "IPSetDescriptors": cdk.listMapper(convertCfnIPSetIPSetDescriptorPropertyToCloudFormation)(properties.ipSetDescriptors),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnIPSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIPSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIPSetProps>();
  ret.addPropertyResult("ipSetDescriptors", "IPSetDescriptors", (properties.IPSetDescriptors != null ? cfn_parse.FromCloudFormation.getArray(CfnIPSetIPSetDescriptorPropertyFromCloudFormation)(properties.IPSetDescriptors) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A `RateBasedRule` is identical to a regular `Rule` , with one addition: a `RateBasedRule` counts the number of requests that arrive from a specified IP address every five minutes. For example, based on recent requests that you've seen from an attacker, you might create a `RateBasedRule` that includes the following conditions:
 *
 * - The requests come from 192.0.2.44.
 * - They contain the value `BadBot` in the `User-Agent` header.
 *
 * In the rule, you also define the rate limit as 15,000.
 *
 * Requests that meet both of these conditions and exceed 15,000 requests every five minutes trigger the rule's action (block or count), which is defined in the web ACL.
 *
 * Note you can only create rate-based rules using an AWS CloudFormation template. To add the rate-based rules created through AWS CloudFormation to a web ACL, use the AWS WAF console, API, or command line interface (CLI). For more information, see [UpdateWebACL](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_UpdateWebACL.html) .
 *
 * @cloudformationResource AWS::WAFRegional::RateBasedRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html
 */
export class CfnRateBasedRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::RateBasedRule";

  /**
   * Build a CfnRateBasedRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRateBasedRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRateBasedRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRateBasedRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet>` object that you want to include in a `RateBasedRule` .
   */
  public matchPredicates?: Array<cdk.IResolvable | CfnRateBasedRule.PredicateProperty> | cdk.IResolvable;

  /**
   * A name for the metrics for a `RateBasedRule` .
   */
  public metricName: string;

  /**
   * A friendly name or description for a `RateBasedRule` .
   */
  public name: string;

  /**
   * The field that AWS WAF uses to determine if requests are likely arriving from single source and thus subject to rate monitoring.
   */
  public rateKey: string;

  /**
   * The maximum number of requests, which have an identical value in the field specified by the `RateKey` , allowed in a five-minute period.
   */
  public rateLimit: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRateBasedRuleProps) {
    super(scope, id, {
      "type": CfnRateBasedRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "metricName", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "rateKey", this);
    cdk.requireProperty(props, "rateLimit", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.matchPredicates = props.matchPredicates;
    this.metricName = props.metricName;
    this.name = props.name;
    this.rateKey = props.rateKey;
    this.rateLimit = props.rateLimit;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "matchPredicates": this.matchPredicates,
      "metricName": this.metricName,
      "name": this.name,
      "rateKey": this.rateKey,
      "rateLimit": this.rateLimit
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRateBasedRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRateBasedRulePropsToCloudFormation(props);
  }
}

export namespace CfnRateBasedRule {
  /**
   * Specifies the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , and `SizeConstraintSet` objects that you want to add to a `Rule` and, for each object, indicates whether you want to negate the settings, for example, requests that do NOT originate from the IP address 192.0.2.44.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html
   */
  export interface PredicateProperty {
    /**
     * A unique identifier for a predicate in a `Rule` , such as `ByteMatchSetId` or `IPSetId` .
     *
     * The ID is returned by the corresponding `Create` or `List` command.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html#cfn-wafregional-ratebasedrule-predicate-dataid
     */
    readonly dataId: string;

    /**
     * Set `Negated` to `False` if you want AWS WAF to allow, block, or count requests based on the settings in the specified `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` .
     *
     * For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow or block requests based on that IP address.
     *
     * Set `Negated` to `True` if you want AWS WAF to allow or block a request based on the negation of the settings in the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` >. For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow, block, or count requests based on all IP addresses *except* `192.0.2.44` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html#cfn-wafregional-ratebasedrule-predicate-negated
     */
    readonly negated: boolean | cdk.IResolvable;

    /**
     * The type of predicate in a `Rule` , such as `ByteMatch` or `IPSet` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html#cfn-wafregional-ratebasedrule-predicate-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnRateBasedRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html
 */
export interface CfnRateBasedRuleProps {
  /**
   * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet>` object that you want to include in a `RateBasedRule` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-matchpredicates
   */
  readonly matchPredicates?: Array<cdk.IResolvable | CfnRateBasedRule.PredicateProperty> | cdk.IResolvable;

  /**
   * A name for the metrics for a `RateBasedRule` .
   *
   * The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF , including "All" and "Default_Action." You can't change the name of the metric after you create the `RateBasedRule` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-metricname
   */
  readonly metricName: string;

  /**
   * A friendly name or description for a `RateBasedRule` .
   *
   * You can't change the name of a `RateBasedRule` after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-name
   */
  readonly name: string;

  /**
   * The field that AWS WAF uses to determine if requests are likely arriving from single source and thus subject to rate monitoring.
   *
   * The only valid value for `RateKey` is `IP` . `IP` indicates that requests arriving from the same IP address are subject to the `RateLimit` that is specified in the `RateBasedRule` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-ratekey
   */
  readonly rateKey: string;

  /**
   * The maximum number of requests, which have an identical value in the field specified by the `RateKey` , allowed in a five-minute period.
   *
   * If the number of requests exceeds the `RateLimit` and the other predicates specified in the rule are also met, AWS WAF triggers the action that is specified for this rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-ratelimit
   */
  readonly rateLimit: number;
}

/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRateBasedRulePredicatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataId", cdk.requiredValidator)(properties.dataId));
  errors.collect(cdk.propertyValidator("dataId", cdk.validateString)(properties.dataId));
  errors.collect(cdk.propertyValidator("negated", cdk.requiredValidator)(properties.negated));
  errors.collect(cdk.propertyValidator("negated", cdk.validateBoolean)(properties.negated));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PredicateProperty\"");
}

// @ts-ignore TS6133
function convertCfnRateBasedRulePredicatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRateBasedRulePredicatePropertyValidator(properties).assertSuccess();
  return {
    "DataId": cdk.stringToCloudFormation(properties.dataId),
    "Negated": cdk.booleanToCloudFormation(properties.negated),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnRateBasedRulePredicatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRateBasedRule.PredicateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRateBasedRule.PredicateProperty>();
  ret.addPropertyResult("dataId", "DataId", (properties.DataId != null ? cfn_parse.FromCloudFormation.getString(properties.DataId) : undefined));
  ret.addPropertyResult("negated", "Negated", (properties.Negated != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Negated) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRateBasedRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRateBasedRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRateBasedRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchPredicates", cdk.listValidator(CfnRateBasedRulePredicatePropertyValidator))(properties.matchPredicates));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rateKey", cdk.requiredValidator)(properties.rateKey));
  errors.collect(cdk.propertyValidator("rateKey", cdk.validateString)(properties.rateKey));
  errors.collect(cdk.propertyValidator("rateLimit", cdk.requiredValidator)(properties.rateLimit));
  errors.collect(cdk.propertyValidator("rateLimit", cdk.validateNumber)(properties.rateLimit));
  return errors.wrap("supplied properties not correct for \"CfnRateBasedRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnRateBasedRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRateBasedRulePropsValidator(properties).assertSuccess();
  return {
    "MatchPredicates": cdk.listMapper(convertCfnRateBasedRulePredicatePropertyToCloudFormation)(properties.matchPredicates),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RateKey": cdk.stringToCloudFormation(properties.rateKey),
    "RateLimit": cdk.numberToCloudFormation(properties.rateLimit)
  };
}

// @ts-ignore TS6133
function CfnRateBasedRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRateBasedRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRateBasedRuleProps>();
  ret.addPropertyResult("matchPredicates", "MatchPredicates", (properties.MatchPredicates != null ? cfn_parse.FromCloudFormation.getArray(CfnRateBasedRulePredicatePropertyFromCloudFormation)(properties.MatchPredicates) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rateKey", "RateKey", (properties.RateKey != null ? cfn_parse.FromCloudFormation.getString(properties.RateKey) : undefined));
  ret.addPropertyResult("rateLimit", "RateLimit", (properties.RateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.RateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `RegexPatternSet` specifies the regular expression (regex) pattern that you want AWS WAF to search for, such as `B[a@]dB[o0]t` .
 *
 * You can then configure AWS WAF to reject those requests.
 *
 * Note that you can only create regex pattern sets using a AWS CloudFormation template. To add the regex pattern sets created through AWS CloudFormation to a RegexMatchSet, use the AWS WAF console, API, or command line interface (CLI). For more information, see [UpdateRegexMatchSet](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_UpdateRegexMatchSet.html) .
 *
 * @cloudformationResource AWS::WAFRegional::RegexPatternSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html
 */
export class CfnRegexPatternSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::RegexPatternSet";

  /**
   * Build a CfnRegexPatternSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegexPatternSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRegexPatternSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRegexPatternSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A friendly name or description of the `RegexPatternSet` .
   */
  public name: string;

  /**
   * Specifies the regular expression (regex) patterns that you want AWS WAF to search for, such as `B[a@]dB[o0]t` .
   */
  public regexPatternStrings: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRegexPatternSetProps) {
    super(scope, id, {
      "type": CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "regexPatternStrings", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.regexPatternStrings = props.regexPatternStrings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "regexPatternStrings": this.regexPatternStrings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRegexPatternSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRegexPatternSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html
 */
export interface CfnRegexPatternSetProps {
  /**
   * A friendly name or description of the `RegexPatternSet` .
   *
   * You can't change `Name` after you create a `RegexPatternSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html#cfn-wafregional-regexpatternset-name
   */
  readonly name: string;

  /**
   * Specifies the regular expression (regex) patterns that you want AWS WAF to search for, such as `B[a@]dB[o0]t` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html#cfn-wafregional-regexpatternset-regexpatternstrings
   */
  readonly regexPatternStrings: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnRegexPatternSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegexPatternSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRegexPatternSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("regexPatternStrings", cdk.requiredValidator)(properties.regexPatternStrings));
  errors.collect(cdk.propertyValidator("regexPatternStrings", cdk.listValidator(cdk.validateString))(properties.regexPatternStrings));
  return errors.wrap("supplied properties not correct for \"CfnRegexPatternSetProps\"");
}

// @ts-ignore TS6133
function convertCfnRegexPatternSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRegexPatternSetPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "RegexPatternStrings": cdk.listMapper(cdk.stringToCloudFormation)(properties.regexPatternStrings)
  };
}

// @ts-ignore TS6133
function CfnRegexPatternSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegexPatternSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegexPatternSetProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("regexPatternStrings", "RegexPatternStrings", (properties.RegexPatternStrings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RegexPatternStrings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A combination of `ByteMatchSet` , `IPSet` , and/or `SqlInjectionMatchSet` objects that identify the web requests that you want to allow, block, or count. For example, you might create a `Rule` that includes the following predicates:
 *
 * - An `IPSet` that causes AWS WAF to search for web requests that originate from the IP address `192.0.2.44`
 * - A `ByteMatchSet` that causes AWS WAF to search for web requests for which the value of the `User-Agent` header is `BadBot` .
 *
 * To match the settings in this `Rule` , a request must originate from `192.0.2.44` AND include a `User-Agent` header for which the value is `BadBot` .
 *
 * @cloudformationResource AWS::WAFRegional::Rule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html
 */
export class CfnRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::Rule";

  /**
   * Build a CfnRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A name for the metrics for this `Rule` .
   */
  public metricName: string;

  /**
   * The friendly name or description for the `Rule` .
   */
  public name: string;

  /**
   * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet` object that you want to include in a `Rule` .
   */
  public predicates?: Array<cdk.IResolvable | CfnRule.PredicateProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRuleProps) {
    super(scope, id, {
      "type": CfnRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "metricName", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.metricName = props.metricName;
    this.name = props.name;
    this.predicates = props.predicates;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "metricName": this.metricName,
      "name": this.name,
      "predicates": this.predicates
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRulePropsToCloudFormation(props);
  }
}

export namespace CfnRule {
  /**
   * Specifies the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , and `SizeConstraintSet` objects that you want to add to a `Rule` and, for each object, indicates whether you want to negate the settings, for example, requests that do NOT originate from the IP address 192.0.2.44.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html
   */
  export interface PredicateProperty {
    /**
     * A unique identifier for a predicate in a `Rule` , such as `ByteMatchSetId` or `IPSetId` .
     *
     * The ID is returned by the corresponding `Create` or `List` command.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html#cfn-wafregional-rule-predicate-dataid
     */
    readonly dataId: string;

    /**
     * Set `Negated` to `False` if you want AWS WAF to allow, block, or count requests based on the settings in the specified `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` .
     *
     * For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow or block requests based on that IP address.
     *
     * Set `Negated` to `True` if you want AWS WAF to allow or block a request based on the negation of the settings in the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` . For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow, block, or count requests based on all IP addresses *except* `192.0.2.44` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html#cfn-wafregional-rule-predicate-negated
     */
    readonly negated: boolean | cdk.IResolvable;

    /**
     * The type of predicate in a `Rule` , such as `ByteMatch` or `IPSet` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html#cfn-wafregional-rule-predicate-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html
 */
export interface CfnRuleProps {
  /**
   * A name for the metrics for this `Rule` .
   *
   * The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF, including "All" and "Default_Action." You can't change `MetricName` after you create the `Rule` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-metricname
   */
  readonly metricName: string;

  /**
   * The friendly name or description for the `Rule` .
   *
   * You can't change the name of a `Rule` after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-name
   */
  readonly name: string;

  /**
   * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet` object that you want to include in a `Rule` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-predicates
   */
  readonly predicates?: Array<cdk.IResolvable | CfnRule.PredicateProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePredicatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataId", cdk.requiredValidator)(properties.dataId));
  errors.collect(cdk.propertyValidator("dataId", cdk.validateString)(properties.dataId));
  errors.collect(cdk.propertyValidator("negated", cdk.requiredValidator)(properties.negated));
  errors.collect(cdk.propertyValidator("negated", cdk.validateBoolean)(properties.negated));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PredicateProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulePredicatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePredicatePropertyValidator(properties).assertSuccess();
  return {
    "DataId": cdk.stringToCloudFormation(properties.dataId),
    "Negated": cdk.booleanToCloudFormation(properties.negated),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnRulePredicatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.PredicateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.PredicateProperty>();
  ret.addPropertyResult("dataId", "DataId", (properties.DataId != null ? cfn_parse.FromCloudFormation.getString(properties.DataId) : undefined));
  ret.addPropertyResult("negated", "Negated", (properties.Negated != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Negated) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("predicates", cdk.listValidator(CfnRulePredicatePropertyValidator))(properties.predicates));
  return errors.wrap("supplied properties not correct for \"CfnRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePropsValidator(properties).assertSuccess();
  return {
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Predicates": cdk.listMapper(convertCfnRulePredicatePropertyToCloudFormation)(properties.predicates)
  };
}

// @ts-ignore TS6133
function CfnRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleProps>();
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("predicates", "Predicates", (properties.Predicates != null ? cfn_parse.FromCloudFormation.getArray(CfnRulePredicatePropertyFromCloudFormation)(properties.Predicates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `SizeConstraint` objects, which specify the parts of web requests that you want AWS WAF to inspect the size of. If a `SizeConstraintSet` contains more than one `SizeConstraint` object, a request only needs to match one constraint to be considered a match.
 *
 * @cloudformationResource AWS::WAFRegional::SizeConstraintSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html
 */
export class CfnSizeConstraintSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::SizeConstraintSet";

  /**
   * Build a CfnSizeConstraintSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSizeConstraintSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSizeConstraintSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSizeConstraintSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name, if any, of the `SizeConstraintSet` .
   */
  public name: string;

  /**
   * The size constraint and the part of the web request to check.
   */
  public sizeConstraints?: Array<cdk.IResolvable | CfnSizeConstraintSet.SizeConstraintProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSizeConstraintSetProps) {
    super(scope, id, {
      "type": CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.sizeConstraints = props.sizeConstraints;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "sizeConstraints": this.sizeConstraints
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSizeConstraintSetPropsToCloudFormation(props);
  }
}

export namespace CfnSizeConstraintSet {
  /**
   * > This is *AWS WAF Classic* documentation.
   *
   * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
   * >
   * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
   *
   * Specifies a constraint on the size of a part of the web request. AWS WAF uses the `Size` , `ComparisonOperator` , and `FieldToMatch` to build an expression in the form of " `Size` `ComparisonOperator` size in bytes of `FieldToMatch` ". If that expression is true, the `SizeConstraint` is considered to match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html
   */
  export interface SizeConstraintProperty {
    /**
     * The type of comparison you want AWS WAF to perform.
     *
     * AWS WAF uses this in combination with the provided `Size` and `FieldToMatch` to build an expression in the form of " `Size` `ComparisonOperator` size in bytes of `FieldToMatch` ". If that expression is true, the `SizeConstraint` is considered to match.
     *
     * *EQ* : Used to test if the `Size` is equal to the size of the `FieldToMatch`
     *
     * *NE* : Used to test if the `Size` is not equal to the size of the `FieldToMatch`
     *
     * *LE* : Used to test if the `Size` is less than or equal to the size of the `FieldToMatch`
     *
     * *LT* : Used to test if the `Size` is strictly less than the size of the `FieldToMatch`
     *
     * *GE* : Used to test if the `Size` is greater than or equal to the size of the `FieldToMatch`
     *
     * *GT* : Used to test if the `Size` is strictly greater than the size of the `FieldToMatch`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-fieldtomatch
     */
    readonly fieldToMatch: CfnSizeConstraintSet.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The size in bytes that you want AWS WAF to compare against the size of the specified `FieldToMatch` .
     *
     * AWS WAF uses this in combination with `ComparisonOperator` and `FieldToMatch` to build an expression in the form of " `Size` `ComparisonOperator` size in bytes of `FieldToMatch` ". If that expression is true, the `SizeConstraint` is considered to match.
     *
     * Valid values for size are 0 - 21474836480 bytes (0 - 20 GB).
     *
     * If you specify `URI` for the value of `Type` , the / in the URI path that you specify counts as one character. For example, the URI `/logo.jpg` is nine characters long.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-size
     */
    readonly size: number;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF .
     *
     * If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting a request for a match.
     *
     * You can only specify a single type of TextTransformation.
     *
     * Note that if you choose `BODY` for the value of `Type` , you must choose `NONE` for `TextTransformation` because the API Gateway API or Application Load Balancer forward only the first 8192 bytes for inspection.
     *
     * *NONE*
     *
     * Specify `NONE` if you don't want to perform any text transformations.
     *
     * *CMD_LINE*
     *
     * When you're concerned that attackers are injecting an operating system command line command and using unusual formatting to disguise some or all of the command, use this option to perform the following transformations:
     *
     * - Delete the following characters: \ " ' ^
     * - Delete spaces before the following characters: / (
     * - Replace the following characters with a space: , ;
     * - Replace multiple spaces with one space
     * - Convert uppercase letters (A-Z) to lowercase (a-z)
     *
     * *COMPRESS_WHITE_SPACE*
     *
     * Use this option to replace the following characters with a space character (decimal 32):
     *
     * - \f, formfeed, decimal 12
     * - \t, tab, decimal 9
     * - \n, newline, decimal 10
     * - \r, carriage return, decimal 13
     * - \v, vertical tab, decimal 11
     * - non-breaking space, decimal 160
     *
     * `COMPRESS_WHITE_SPACE` also replaces multiple spaces with one space.
     *
     * *HTML_ENTITY_DECODE*
     *
     * Use this option to replace HTML-encoded characters with unencoded characters. `HTML_ENTITY_DECODE` performs the following operations:
     *
     * - Replaces `(ampersand)quot;` with `"`
     * - Replaces `(ampersand)nbsp;` with a non-breaking space, decimal 160
     * - Replaces `(ampersand)lt;` with a "less than" symbol
     * - Replaces `(ampersand)gt;` with `>`
     * - Replaces characters that are represented in hexadecimal format, `(ampersand)#xhhhh;` , with the corresponding characters
     * - Replaces characters that are represented in decimal format, `(ampersand)#nnnn;` , with the corresponding characters
     *
     * *LOWERCASE*
     *
     * Use this option to convert uppercase letters (A-Z) to lowercase (a-z).
     *
     * *URL_DECODE*
     *
     * Use this option to decode a URL-encoded value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-texttransformation
     */
    readonly textTransformation: string;
  }

  /**
   * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-fieldtomatch.html
   */
  export interface FieldToMatchProperty {
    /**
     * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` .
     *
     * The name of the header is not case sensitive.
     *
     * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
     *
     * If the value of `Type` is any other value, omit `Data` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-fieldtomatch.html#cfn-wafregional-sizeconstraintset-fieldtomatch-data
     */
    readonly data?: string;

    /**
     * The part of the web request that you want AWS WAF to search for a specified string.
     *
     * Parts of a request that you can search include the following:
     *
     * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
     * - `METHOD` : The HTTP method, which indicates the type of operation that the request is asking the origin to perform.
     * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
     * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
     * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
     * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
     * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-fieldtomatch.html#cfn-wafregional-sizeconstraintset-fieldtomatch-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnSizeConstraintSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html
 */
export interface CfnSizeConstraintSetProps {
  /**
   * The name, if any, of the `SizeConstraintSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-name
   */
  readonly name: string;

  /**
   * The size constraint and the part of the web request to check.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-sizeconstraints
   */
  readonly sizeConstraints?: Array<cdk.IResolvable | CfnSizeConstraintSet.SizeConstraintProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSizeConstraintSetFieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"FieldToMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnSizeConstraintSetFieldToMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSizeConstraintSetFieldToMatchPropertyValidator(properties).assertSuccess();
  return {
    "Data": cdk.stringToCloudFormation(properties.data),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSizeConstraintSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSizeConstraintSet.FieldToMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSizeConstraintSet.FieldToMatchProperty>();
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SizeConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `SizeConstraintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSizeConstraintSetSizeConstraintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnSizeConstraintSetFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.requiredValidator)(properties.textTransformation));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.validateString)(properties.textTransformation));
  return errors.wrap("supplied properties not correct for \"SizeConstraintProperty\"");
}

// @ts-ignore TS6133
function convertCfnSizeConstraintSetSizeConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSizeConstraintSetSizeConstraintPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "FieldToMatch": convertCfnSizeConstraintSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "Size": cdk.numberToCloudFormation(properties.size),
    "TextTransformation": cdk.stringToCloudFormation(properties.textTransformation)
  };
}

// @ts-ignore TS6133
function CfnSizeConstraintSetSizeConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSizeConstraintSet.SizeConstraintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSizeConstraintSet.SizeConstraintProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnSizeConstraintSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addPropertyResult("textTransformation", "TextTransformation", (properties.TextTransformation != null ? cfn_parse.FromCloudFormation.getString(properties.TextTransformation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSizeConstraintSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnSizeConstraintSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSizeConstraintSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sizeConstraints", cdk.listValidator(CfnSizeConstraintSetSizeConstraintPropertyValidator))(properties.sizeConstraints));
  return errors.wrap("supplied properties not correct for \"CfnSizeConstraintSetProps\"");
}

// @ts-ignore TS6133
function convertCfnSizeConstraintSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSizeConstraintSetPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SizeConstraints": cdk.listMapper(convertCfnSizeConstraintSetSizeConstraintPropertyToCloudFormation)(properties.sizeConstraints)
  };
}

// @ts-ignore TS6133
function CfnSizeConstraintSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSizeConstraintSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSizeConstraintSetProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sizeConstraints", "SizeConstraints", (properties.SizeConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnSizeConstraintSetSizeConstraintPropertyFromCloudFormation)(properties.SizeConstraints) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `SqlInjectionMatchTuple` objects, which specify the parts of web requests that you want AWS WAF to inspect for snippets of malicious SQL code and, if you want AWS WAF to inspect a header, the name of the header. If a `SqlInjectionMatchSet` contains more than one `SqlInjectionMatchTuple` object, a request needs to include snippets of SQL code in only one of the specified parts of the request to be considered a match.
 *
 * @cloudformationResource AWS::WAFRegional::SqlInjectionMatchSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html
 */
export class CfnSqlInjectionMatchSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::SqlInjectionMatchSet";

  /**
   * Build a CfnSqlInjectionMatchSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSqlInjectionMatchSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSqlInjectionMatchSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSqlInjectionMatchSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name, if any, of the `SqlInjectionMatchSet` .
   */
  public name: string;

  /**
   * Specifies the parts of web requests that you want to inspect for snippets of malicious SQL code.
   */
  public sqlInjectionMatchTuples?: Array<cdk.IResolvable | CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSqlInjectionMatchSetProps) {
    super(scope, id, {
      "type": CfnSqlInjectionMatchSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.sqlInjectionMatchTuples = props.sqlInjectionMatchTuples;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "sqlInjectionMatchTuples": this.sqlInjectionMatchTuples
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSqlInjectionMatchSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSqlInjectionMatchSetPropsToCloudFormation(props);
  }
}

export namespace CfnSqlInjectionMatchSet {
  /**
   * > This is *AWS WAF Classic* documentation.
   *
   * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
   * >
   * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
   *
   * Specifies the part of a web request that you want AWS WAF to inspect for snippets of malicious SQL code and, if you want AWS WAF to inspect a header, the name of the header.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html
   */
  export interface SqlInjectionMatchTupleProperty {
    /**
     * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple-fieldtomatch
     */
    readonly fieldToMatch: CfnSqlInjectionMatchSet.FieldToMatchProperty | cdk.IResolvable;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF .
     *
     * If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting it for a match.
     *
     * You can only specify a single type of TextTransformation.
     *
     * *CMD_LINE*
     *
     * When you're concerned that attackers are injecting an operating system command line command and using unusual formatting to disguise some or all of the command, use this option to perform the following transformations:
     *
     * - Delete the following characters: \ " ' ^
     * - Delete spaces before the following characters: / (
     * - Replace the following characters with a space: , ;
     * - Replace multiple spaces with one space
     * - Convert uppercase letters (A-Z) to lowercase (a-z)
     *
     * *COMPRESS_WHITE_SPACE*
     *
     * Use this option to replace the following characters with a space character (decimal 32):
     *
     * - \f, formfeed, decimal 12
     * - \t, tab, decimal 9
     * - \n, newline, decimal 10
     * - \r, carriage return, decimal 13
     * - \v, vertical tab, decimal 11
     * - non-breaking space, decimal 160
     *
     * `COMPRESS_WHITE_SPACE` also replaces multiple spaces with one space.
     *
     * *HTML_ENTITY_DECODE*
     *
     * Use this option to replace HTML-encoded characters with unencoded characters. `HTML_ENTITY_DECODE` performs the following operations:
     *
     * - Replaces `(ampersand)quot;` with `"`
     * - Replaces `(ampersand)nbsp;` with a non-breaking space, decimal 160
     * - Replaces `(ampersand)lt;` with a "less than" symbol
     * - Replaces `(ampersand)gt;` with `>`
     * - Replaces characters that are represented in hexadecimal format, `(ampersand)#xhhhh;` , with the corresponding characters
     * - Replaces characters that are represented in decimal format, `(ampersand)#nnnn;` , with the corresponding characters
     *
     * *LOWERCASE*
     *
     * Use this option to convert uppercase letters (A-Z) to lowercase (a-z).
     *
     * *URL_DECODE*
     *
     * Use this option to decode a URL-encoded value.
     *
     * *NONE*
     *
     * Specify `NONE` if you don't want to perform any text transformations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple-texttransformation
     */
    readonly textTransformation: string;
  }

  /**
   * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html
   */
  export interface FieldToMatchProperty {
    /**
     * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` .
     *
     * The name of the header is not case sensitive.
     *
     * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
     *
     * If the value of `Type` is any other value, omit `Data` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html#cfn-wafregional-sqlinjectionmatchset-fieldtomatch-data
     */
    readonly data?: string;

    /**
     * The part of the web request that you want AWS WAF to search for a specified string.
     *
     * Parts of a request that you can search include the following:
     *
     * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
     * - `METHOD` : The HTTP method, which indicates the type of operation that the request is asking the origin to perform.
     * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
     * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
     * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
     * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
     * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html#cfn-wafregional-sqlinjectionmatchset-fieldtomatch-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnSqlInjectionMatchSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html
 */
export interface CfnSqlInjectionMatchSetProps {
  /**
   * The name, if any, of the `SqlInjectionMatchSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-name
   */
  readonly name: string;

  /**
   * Specifies the parts of web requests that you want to inspect for snippets of malicious SQL code.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuples
   */
  readonly sqlInjectionMatchTuples?: Array<cdk.IResolvable | CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSqlInjectionMatchSetFieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"FieldToMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnSqlInjectionMatchSetFieldToMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSqlInjectionMatchSetFieldToMatchPropertyValidator(properties).assertSuccess();
  return {
    "Data": cdk.stringToCloudFormation(properties.data),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSqlInjectionMatchSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSqlInjectionMatchSet.FieldToMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSqlInjectionMatchSet.FieldToMatchProperty>();
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqlInjectionMatchTupleProperty`
 *
 * @param properties - the TypeScript properties of a `SqlInjectionMatchTupleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnSqlInjectionMatchSetFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.requiredValidator)(properties.textTransformation));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.validateString)(properties.textTransformation));
  return errors.wrap("supplied properties not correct for \"SqlInjectionMatchTupleProperty\"");
}

// @ts-ignore TS6133
function convertCfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnSqlInjectionMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "TextTransformation": cdk.stringToCloudFormation(properties.textTransformation)
  };
}

// @ts-ignore TS6133
function CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnSqlInjectionMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("textTransformation", "TextTransformation", (properties.TextTransformation != null ? cfn_parse.FromCloudFormation.getString(properties.TextTransformation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSqlInjectionMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnSqlInjectionMatchSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSqlInjectionMatchSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sqlInjectionMatchTuples", cdk.listValidator(CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyValidator))(properties.sqlInjectionMatchTuples));
  return errors.wrap("supplied properties not correct for \"CfnSqlInjectionMatchSetProps\"");
}

// @ts-ignore TS6133
function convertCfnSqlInjectionMatchSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSqlInjectionMatchSetPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SqlInjectionMatchTuples": cdk.listMapper(convertCfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyToCloudFormation)(properties.sqlInjectionMatchTuples)
  };
}

// @ts-ignore TS6133
function CfnSqlInjectionMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSqlInjectionMatchSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSqlInjectionMatchSetProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sqlInjectionMatchTuples", "SqlInjectionMatchTuples", (properties.SqlInjectionMatchTuples != null ? cfn_parse.FromCloudFormation.getArray(CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyFromCloudFormation)(properties.SqlInjectionMatchTuples) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains the `Rules` that identify the requests that you want to allow, block, or count. In a `WebACL` , you also specify a default action ( `ALLOW` or `BLOCK` ), and the action for each `Rule` that you add to a `WebACL` , for example, block requests from specified IP addresses or block requests from specified referrers. If you add more than one `Rule` to a `WebACL` , a request needs to match only one of the specifications to be allowed, blocked, or counted.
 *
 * To identify the requests that you want AWS WAF to filter, you associate the `WebACL` with an API Gateway API or an Application Load Balancer.
 *
 * @cloudformationResource AWS::WAFRegional::WebACL
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html
 */
export class CfnWebACL extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::WebACL";

  /**
   * Build a CfnWebACL from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWebACL {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWebACLPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWebACL(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The action to perform if none of the `Rules` contained in the `WebACL` match.
   */
  public defaultAction: CfnWebACL.ActionProperty | cdk.IResolvable;

  /**
   * A name for the metrics for this `WebACL` .
   */
  public metricName: string;

  /**
   * A friendly name or description of the `WebACL` .
   */
  public name: string;

  /**
   * An array that contains the action for each `Rule` in a `WebACL` , the priority of the `Rule` , and the ID of the `Rule` .
   */
  public rules?: Array<cdk.IResolvable | CfnWebACL.RuleProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWebACLProps) {
    super(scope, id, {
      "type": CfnWebACL.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "defaultAction", this);
    cdk.requireProperty(props, "metricName", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.defaultAction = props.defaultAction;
    this.metricName = props.metricName;
    this.name = props.name;
    this.rules = props.rules;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultAction": this.defaultAction,
      "metricName": this.metricName,
      "name": this.name,
      "rules": this.rules
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACL.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWebACLPropsToCloudFormation(props);
  }
}

export namespace CfnWebACL {
  /**
   * Specifies the action AWS WAF takes when a web request matches or doesn't match all rule conditions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-action.html
   */
  export interface ActionProperty {
    /**
     * For actions that are associated with a rule, the action that AWS WAF takes when a web request matches all conditions in a rule.
     *
     * For the default action of a web access control list (ACL), the action that AWS WAF takes when a web request doesn't match all conditions in any rule.
     *
     * Valid settings include the following:
     *
     * - `ALLOW` : AWS WAF allows requests
     * - `BLOCK` : AWS WAF blocks requests
     * - `COUNT` : AWS WAF increments a counter of the requests that match all of the conditions in the rule. AWS WAF then continues to inspect the web request based on the remaining rules in the web ACL. You can't specify `COUNT` for the default action for a WebACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-action.html#cfn-wafregional-webacl-action-type
     */
    readonly type: string;
  }

  /**
   * A combination of `ByteMatchSet` , `IPSet` , and/or `SqlInjectionMatchSet` objects that identify the web requests that you want to allow, block, or count.
   *
   * For example, you might create a `Rule` that includes the following predicates:
   *
   * - An `IPSet` that causes AWS WAF to search for web requests that originate from the IP address `192.0.2.44`
   * - A `ByteMatchSet` that causes AWS WAF to search for web requests for which the value of the `User-Agent` header is `BadBot` .
   *
   * To match the settings in this `Rule` , a request must originate from `192.0.2.44` AND include a `User-Agent` header for which the value is `BadBot` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html
   */
  export interface RuleProperty {
    /**
     * The action that AWS WAF takes when a web request matches all conditions in the rule, such as allow, block, or count the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html#cfn-wafregional-webacl-rule-action
     */
    readonly action: CfnWebACL.ActionProperty | cdk.IResolvable;

    /**
     * The order in which AWS WAF evaluates the rules in a web ACL.
     *
     * AWS WAF evaluates rules with a lower value before rules with a higher value. The value must be a unique integer. If you have multiple rules in a web ACL, the priority numbers do not need to be consecutive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html#cfn-wafregional-webacl-rule-priority
     */
    readonly priority: number;

    /**
     * The ID of an AWS WAF Regional rule to associate with a web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html#cfn-wafregional-webacl-rule-ruleid
     */
    readonly ruleId: string;
  }
}

/**
 * Properties for defining a `CfnWebACL`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html
 */
export interface CfnWebACLProps {
  /**
   * The action to perform if none of the `Rules` contained in the `WebACL` match.
   *
   * The action is specified by the `WafAction` object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-defaultaction
   */
  readonly defaultAction: CfnWebACL.ActionProperty | cdk.IResolvable;

  /**
   * A name for the metrics for this `WebACL` .
   *
   * The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF, including "All" and "Default_Action." You can't change `MetricName` after you create the `WebACL` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-metricname
   */
  readonly metricName: string;

  /**
   * A friendly name or description of the `WebACL` .
   *
   * You can't change the name of a `WebACL` after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-name
   */
  readonly name: string;

  /**
   * An array that contains the action for each `Rule` in a `WebACL` , the priority of the `Rule` , and the ID of the `Rule` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-rules
   */
  readonly rules?: Array<cdk.IResolvable | CfnWebACL.RuleProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLActionPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnWebACLActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ActionProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnWebACLActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("ruleId", cdk.requiredValidator)(properties.ruleId));
  errors.collect(cdk.propertyValidator("ruleId", cdk.validateString)(properties.ruleId));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRulePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnWebACLActionPropertyToCloudFormation(properties.action),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "RuleId": cdk.stringToCloudFormation(properties.ruleId)
  };
}

// @ts-ignore TS6133
function CfnWebACLRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnWebACLActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("ruleId", "RuleId", (properties.RuleId != null ? cfn_parse.FromCloudFormation.getString(properties.RuleId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWebACLProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebACLProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultAction", cdk.requiredValidator)(properties.defaultAction));
  errors.collect(cdk.propertyValidator("defaultAction", CfnWebACLActionPropertyValidator)(properties.defaultAction));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnWebACLRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"CfnWebACLProps\"");
}

// @ts-ignore TS6133
function convertCfnWebACLPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLPropsValidator(properties).assertSuccess();
  return {
    "DefaultAction": convertCfnWebACLActionPropertyToCloudFormation(properties.defaultAction),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Rules": cdk.listMapper(convertCfnWebACLRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnWebACLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLProps>();
  ret.addPropertyResult("defaultAction", "DefaultAction", (properties.DefaultAction != null ? CfnWebACLActionPropertyFromCloudFormation(properties.DefaultAction) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * The AWS::WAFRegional::WebACLAssociation resource associates an AWS WAF Regional web access control group (ACL) with a resource.
 *
 * @cloudformationResource AWS::WAFRegional::WebACLAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html
 */
export class CfnWebACLAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::WebACLAssociation";

  /**
   * Build a CfnWebACLAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWebACLAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWebACLAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWebACLAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon Resource Name (ARN) of the resource to protect with the web ACL.
   */
  public resourceArn: string;

  /**
   * A unique identifier (ID) for the web ACL.
   */
  public webAclId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWebACLAssociationProps) {
    super(scope, id, {
      "type": CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceArn", this);
    cdk.requireProperty(props, "webAclId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.resourceArn = props.resourceArn;
    this.webAclId = props.webAclId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "resourceArn": this.resourceArn,
      "webAclId": this.webAclId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWebACLAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWebACLAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html
 */
export interface CfnWebACLAssociationProps {
  /**
   * The Amazon Resource Name (ARN) of the resource to protect with the web ACL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-resourcearn
   */
  readonly resourceArn: string;

  /**
   * A unique identifier (ID) for the web ACL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-webaclid
   */
  readonly webAclId: string;
}

/**
 * Determine whether the given properties match those of a `CfnWebACLAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebACLAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("webAclId", cdk.requiredValidator)(properties.webAclId));
  errors.collect(cdk.propertyValidator("webAclId", cdk.validateString)(properties.webAclId));
  return errors.wrap("supplied properties not correct for \"CfnWebACLAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAssociationPropsValidator(properties).assertSuccess();
  return {
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn),
    "WebACLId": cdk.stringToCloudFormation(properties.webAclId)
  };
}

// @ts-ignore TS6133
function CfnWebACLAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLAssociationProps>();
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addPropertyResult("webAclId", "WebACLId", (properties.WebACLId != null ? cfn_parse.FromCloudFormation.getString(properties.WebACLId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is *AWS WAF Classic* documentation.
 *
 * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `XssMatchTuple` objects, which specify the parts of web requests that you want AWS WAF to inspect for cross-site scripting attacks and, if you want AWS WAF to inspect a header, the name of the header. If a `XssMatchSet` contains more than one `XssMatchTuple` object, a request needs to include cross-site scripting attacks in only one of the specified parts of the request to be considered a match.
 *
 * @cloudformationResource AWS::WAFRegional::XssMatchSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html
 */
export class CfnXssMatchSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFRegional::XssMatchSet";

  /**
   * Build a CfnXssMatchSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnXssMatchSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnXssMatchSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnXssMatchSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name, if any, of the `XssMatchSet` .
   */
  public name: string;

  /**
   * Specifies the parts of web requests that you want to inspect for cross-site scripting attacks.
   */
  public xssMatchTuples?: Array<cdk.IResolvable | CfnXssMatchSet.XssMatchTupleProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnXssMatchSetProps) {
    super(scope, id, {
      "type": CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.xssMatchTuples = props.xssMatchTuples;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "xssMatchTuples": this.xssMatchTuples
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnXssMatchSetPropsToCloudFormation(props);
  }
}

export namespace CfnXssMatchSet {
  /**
   * > This is *AWS WAF Classic* documentation.
   *
   * For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
   * >
   * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
   *
   * Specifies the part of a web request that you want AWS WAF to inspect for cross-site scripting attacks and, if you want AWS WAF to inspect a header, the name of the header.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-xssmatchtuple.html
   */
  export interface XssMatchTupleProperty {
    /**
     * The part of a web request that you want AWS WAF to inspect, such as a specified header or a query string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-xssmatchtuple.html#cfn-wafregional-xssmatchset-xssmatchtuple-fieldtomatch
     */
    readonly fieldToMatch: CfnXssMatchSet.FieldToMatchProperty | cdk.IResolvable;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF .
     *
     * If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting it for a match.
     *
     * You can only specify a single type of TextTransformation.
     *
     * *CMD_LINE*
     *
     * When you're concerned that attackers are injecting an operating system command line command and using unusual formatting to disguise some or all of the command, use this option to perform the following transformations:
     *
     * - Delete the following characters: \ " ' ^
     * - Delete spaces before the following characters: / (
     * - Replace the following characters with a space: , ;
     * - Replace multiple spaces with one space
     * - Convert uppercase letters (A-Z) to lowercase (a-z)
     *
     * *COMPRESS_WHITE_SPACE*
     *
     * Use this option to replace the following characters with a space character (decimal 32):
     *
     * - \f, formfeed, decimal 12
     * - \t, tab, decimal 9
     * - \n, newline, decimal 10
     * - \r, carriage return, decimal 13
     * - \v, vertical tab, decimal 11
     * - non-breaking space, decimal 160
     *
     * `COMPRESS_WHITE_SPACE` also replaces multiple spaces with one space.
     *
     * *HTML_ENTITY_DECODE*
     *
     * Use this option to replace HTML-encoded characters with unencoded characters. `HTML_ENTITY_DECODE` performs the following operations:
     *
     * - Replaces `(ampersand)quot;` with `"`
     * - Replaces `(ampersand)nbsp;` with a non-breaking space, decimal 160
     * - Replaces `(ampersand)lt;` with a "less than" symbol
     * - Replaces `(ampersand)gt;` with `>`
     * - Replaces characters that are represented in hexadecimal format, `(ampersand)#xhhhh;` , with the corresponding characters
     * - Replaces characters that are represented in decimal format, `(ampersand)#nnnn;` , with the corresponding characters
     *
     * *LOWERCASE*
     *
     * Use this option to convert uppercase letters (A-Z) to lowercase (a-z).
     *
     * *URL_DECODE*
     *
     * Use this option to decode a URL-encoded value.
     *
     * *NONE*
     *
     * Specify `NONE` if you don't want to perform any text transformations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-xssmatchtuple.html#cfn-wafregional-xssmatchset-xssmatchtuple-texttransformation
     */
    readonly textTransformation: string;
  }

  /**
   * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-fieldtomatch.html
   */
  export interface FieldToMatchProperty {
    /**
     * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` .
     *
     * The name of the header is not case sensitive.
     *
     * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
     *
     * If the value of `Type` is any other value, omit `Data` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-fieldtomatch.html#cfn-wafregional-xssmatchset-fieldtomatch-data
     */
    readonly data?: string;

    /**
     * The part of the web request that you want AWS WAF to search for a specified string.
     *
     * Parts of a request that you can search include the following:
     *
     * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
     * - `METHOD` : The HTTP method, which indicates the type of operation that the request is asking the origin to perform.
     * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
     * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
     * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
     * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
     * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-fieldtomatch.html#cfn-wafregional-xssmatchset-fieldtomatch-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnXssMatchSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html
 */
export interface CfnXssMatchSetProps {
  /**
   * The name, if any, of the `XssMatchSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-name
   */
  readonly name: string;

  /**
   * Specifies the parts of web requests that you want to inspect for cross-site scripting attacks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-xssmatchtuples
   */
  readonly xssMatchTuples?: Array<cdk.IResolvable | CfnXssMatchSet.XssMatchTupleProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnXssMatchSetFieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"FieldToMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnXssMatchSetFieldToMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnXssMatchSetFieldToMatchPropertyValidator(properties).assertSuccess();
  return {
    "Data": cdk.stringToCloudFormation(properties.data),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnXssMatchSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnXssMatchSet.FieldToMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnXssMatchSet.FieldToMatchProperty>();
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `XssMatchTupleProperty`
 *
 * @param properties - the TypeScript properties of a `XssMatchTupleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnXssMatchSetXssMatchTuplePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnXssMatchSetFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.requiredValidator)(properties.textTransformation));
  errors.collect(cdk.propertyValidator("textTransformation", cdk.validateString)(properties.textTransformation));
  return errors.wrap("supplied properties not correct for \"XssMatchTupleProperty\"");
}

// @ts-ignore TS6133
function convertCfnXssMatchSetXssMatchTuplePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnXssMatchSetXssMatchTuplePropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnXssMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "TextTransformation": cdk.stringToCloudFormation(properties.textTransformation)
  };
}

// @ts-ignore TS6133
function CfnXssMatchSetXssMatchTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnXssMatchSet.XssMatchTupleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnXssMatchSet.XssMatchTupleProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnXssMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("textTransformation", "TextTransformation", (properties.TextTransformation != null ? cfn_parse.FromCloudFormation.getString(properties.TextTransformation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnXssMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnXssMatchSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnXssMatchSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("xssMatchTuples", cdk.listValidator(CfnXssMatchSetXssMatchTuplePropertyValidator))(properties.xssMatchTuples));
  return errors.wrap("supplied properties not correct for \"CfnXssMatchSetProps\"");
}

// @ts-ignore TS6133
function convertCfnXssMatchSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnXssMatchSetPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "XssMatchTuples": cdk.listMapper(convertCfnXssMatchSetXssMatchTuplePropertyToCloudFormation)(properties.xssMatchTuples)
  };
}

// @ts-ignore TS6133
function CfnXssMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnXssMatchSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnXssMatchSetProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("xssMatchTuples", "XssMatchTuples", (properties.XssMatchTuples != null ? cfn_parse.FromCloudFormation.getArray(CfnXssMatchSetXssMatchTuplePropertyFromCloudFormation)(properties.XssMatchTuples) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}
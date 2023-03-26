// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:30.656Z","fingerprint":"lminQUM1IzMgcHP+HO4cViMtcYx/9t0znD1tCYu8MXA="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnByteMatchSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html
 */
export interface CfnByteMatchSetProps {

    /**
     * A friendly name or description of the `ByteMatchSet` . You can't change `Name` after you create a `ByteMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-name
     */
    readonly name: string;

    /**
     * Specifies the bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-bytematchtuples
     */
    readonly byteMatchTuples?: Array<CfnByteMatchSet.ByteMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnByteMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnByteMatchSetProps`
 *
 * @returns the result of the validation.
 */
function CfnByteMatchSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('byteMatchTuples', cdk.listValidator(CfnByteMatchSet_ByteMatchTuplePropertyValidator))(properties.byteMatchTuples));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnByteMatchSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::ByteMatchSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnByteMatchSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::ByteMatchSet` resource.
 */
// @ts-ignore TS6133
function cfnByteMatchSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnByteMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ByteMatchTuples: cdk.listMapper(cfnByteMatchSetByteMatchTuplePropertyToCloudFormation)(properties.byteMatchTuples),
    };
}

// @ts-ignore TS6133
function CfnByteMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnByteMatchSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnByteMatchSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('byteMatchTuples', 'ByteMatchTuples', properties.ByteMatchTuples != null ? cfn_parse.FromCloudFormation.getArray(CfnByteMatchSetByteMatchTuplePropertyFromCloudFormation)(properties.ByteMatchTuples) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::ByteMatchSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * The `AWS::WAFRegional::ByteMatchSet` resource creates an AWS WAF `ByteMatchSet` that identifies a part of a web request that you want to inspect.
 *
 * @cloudformationResource AWS::WAFRegional::ByteMatchSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html
 */
export class CfnByteMatchSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::ByteMatchSet";

    /**
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
        const ret = new CfnByteMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A friendly name or description of the `ByteMatchSet` . You can't change `Name` after you create a `ByteMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-name
     */
    public name: string;

    /**
     * Specifies the bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-bytematchtuples
     */
    public byteMatchTuples: Array<CfnByteMatchSet.ByteMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::ByteMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnByteMatchSetProps) {
        super(scope, id, { type: CfnByteMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.byteMatchTuples = props.byteMatchTuples;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnByteMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            byteMatchTuples: this.byteMatchTuples,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnByteMatchSetPropsToCloudFormation(props);
    }
}

export namespace CfnByteMatchSet {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * The bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html
     */
    export interface ByteMatchTupleProperty {
        /**
         * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-fieldtomatch
         */
        readonly fieldToMatch: CfnByteMatchSet.FieldToMatchProperty | cdk.IResolvable;
        /**
         * Within the portion of a web request that you want to search (for example, in the query string, if any), specify where you want AWS WAF to search. Valid values include the following:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-positionalconstraint
         */
        readonly positionalConstraint: string;
        /**
         * The value that you want AWS WAF to search for. AWS WAF searches for the specified string in the part of web requests that you specified in `FieldToMatch` . The maximum length of the value is 50 bytes.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-targetstring
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-targetstringbase64
         */
        readonly targetStringBase64?: string;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF . If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting it for a match.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-bytematchtuple.html#cfn-wafregional-bytematchset-bytematchtuple-texttransformation
         */
        readonly textTransformation: string;
    }
}

/**
 * Determine whether the given properties match those of a `ByteMatchTupleProperty`
 *
 * @param properties - the TypeScript properties of a `ByteMatchTupleProperty`
 *
 * @returns the result of the validation.
 */
function CfnByteMatchSet_ByteMatchTuplePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnByteMatchSet_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('positionalConstraint', cdk.requiredValidator)(properties.positionalConstraint));
    errors.collect(cdk.propertyValidator('positionalConstraint', cdk.validateString)(properties.positionalConstraint));
    errors.collect(cdk.propertyValidator('targetString', cdk.validateString)(properties.targetString));
    errors.collect(cdk.propertyValidator('targetStringBase64', cdk.validateString)(properties.targetStringBase64));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.requiredValidator)(properties.textTransformation));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.validateString)(properties.textTransformation));
    return errors.wrap('supplied properties not correct for "ByteMatchTupleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::ByteMatchSet.ByteMatchTuple` resource
 *
 * @param properties - the TypeScript properties of a `ByteMatchTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::ByteMatchSet.ByteMatchTuple` resource.
 */
// @ts-ignore TS6133
function cfnByteMatchSetByteMatchTuplePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnByteMatchSet_ByteMatchTuplePropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnByteMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        PositionalConstraint: cdk.stringToCloudFormation(properties.positionalConstraint),
        TargetString: cdk.stringToCloudFormation(properties.targetString),
        TargetStringBase64: cdk.stringToCloudFormation(properties.targetStringBase64),
        TextTransformation: cdk.stringToCloudFormation(properties.textTransformation),
    };
}

// @ts-ignore TS6133
function CfnByteMatchSetByteMatchTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnByteMatchSet.ByteMatchTupleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnByteMatchSet.ByteMatchTupleProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnByteMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('positionalConstraint', 'PositionalConstraint', cfn_parse.FromCloudFormation.getString(properties.PositionalConstraint));
    ret.addPropertyResult('targetString', 'TargetString', properties.TargetString != null ? cfn_parse.FromCloudFormation.getString(properties.TargetString) : undefined);
    ret.addPropertyResult('targetStringBase64', 'TargetStringBase64', properties.TargetStringBase64 != null ? cfn_parse.FromCloudFormation.getString(properties.TargetStringBase64) : undefined);
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnByteMatchSet {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * Specifies where in a web request to look for `TargetString` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-fieldtomatch.html#cfn-wafregional-bytematchset-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicated the type of operation that the request is asking the origin to perform.
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-bytematchset-fieldtomatch.html#cfn-wafregional-bytematchset-fieldtomatch-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnByteMatchSet_FieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "FieldToMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::ByteMatchSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::ByteMatchSet.FieldToMatch` resource.
 */
// @ts-ignore TS6133
function cfnByteMatchSetFieldToMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnByteMatchSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnByteMatchSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnByteMatchSet.FieldToMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnByteMatchSet.FieldToMatchProperty>();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnGeoMatchSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html
 */
export interface CfnGeoMatchSetProps {

    /**
     * A friendly name or description of the `GeoMatchSet` . You can't change the name of an `GeoMatchSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html#cfn-wafregional-geomatchset-name
     */
    readonly name: string;

    /**
     * An array of `GeoMatchConstraint` objects, which contain the country that you want AWS WAF to search for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html#cfn-wafregional-geomatchset-geomatchconstraints
     */
    readonly geoMatchConstraints?: Array<CfnGeoMatchSet.GeoMatchConstraintProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnGeoMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnGeoMatchSetProps`
 *
 * @returns the result of the validation.
 */
function CfnGeoMatchSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('geoMatchConstraints', cdk.listValidator(CfnGeoMatchSet_GeoMatchConstraintPropertyValidator))(properties.geoMatchConstraints));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnGeoMatchSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::GeoMatchSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnGeoMatchSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::GeoMatchSet` resource.
 */
// @ts-ignore TS6133
function cfnGeoMatchSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGeoMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        GeoMatchConstraints: cdk.listMapper(cfnGeoMatchSetGeoMatchConstraintPropertyToCloudFormation)(properties.geoMatchConstraints),
    };
}

// @ts-ignore TS6133
function CfnGeoMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGeoMatchSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGeoMatchSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('geoMatchConstraints', 'GeoMatchConstraints', properties.GeoMatchConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnGeoMatchSetGeoMatchConstraintPropertyFromCloudFormation)(properties.GeoMatchConstraints) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::GeoMatchSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains one or more countries that AWS WAF will search for.
 *
 * @cloudformationResource AWS::WAFRegional::GeoMatchSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html
 */
export class CfnGeoMatchSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::GeoMatchSet";

    /**
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
        const ret = new CfnGeoMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A friendly name or description of the `GeoMatchSet` . You can't change the name of an `GeoMatchSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html#cfn-wafregional-geomatchset-name
     */
    public name: string;

    /**
     * An array of `GeoMatchConstraint` objects, which contain the country that you want AWS WAF to search for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-geomatchset.html#cfn-wafregional-geomatchset-geomatchconstraints
     */
    public geoMatchConstraints: Array<CfnGeoMatchSet.GeoMatchConstraintProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::GeoMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGeoMatchSetProps) {
        super(scope, id, { type: CfnGeoMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.geoMatchConstraints = props.geoMatchConstraints;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGeoMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            geoMatchConstraints: this.geoMatchConstraints,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGeoMatchSetPropsToCloudFormation(props);
    }
}

export namespace CfnGeoMatchSet {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * The country from which web requests originate that you want AWS WAF to search for.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-geomatchset-geomatchconstraint.html
     */
    export interface GeoMatchConstraintProperty {
        /**
         * The type of geographical area you want AWS WAF to search for. Currently `Country` is the only valid value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-geomatchset-geomatchconstraint.html#cfn-wafregional-geomatchset-geomatchconstraint-type
         */
        readonly type: string;
        /**
         * The country that you want AWS WAF to search for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-geomatchset-geomatchconstraint.html#cfn-wafregional-geomatchset-geomatchconstraint-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `GeoMatchConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `GeoMatchConstraintProperty`
 *
 * @returns the result of the validation.
 */
function CfnGeoMatchSet_GeoMatchConstraintPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "GeoMatchConstraintProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::GeoMatchSet.GeoMatchConstraint` resource
 *
 * @param properties - the TypeScript properties of a `GeoMatchConstraintProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::GeoMatchSet.GeoMatchConstraint` resource.
 */
// @ts-ignore TS6133
function cfnGeoMatchSetGeoMatchConstraintPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGeoMatchSet_GeoMatchConstraintPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnGeoMatchSetGeoMatchConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGeoMatchSet.GeoMatchConstraintProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGeoMatchSet.GeoMatchConstraintProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnIPSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html
 */
export interface CfnIPSetProps {

    /**
     * A friendly name or description of the `IPSet` . You can't change the name of an `IPSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-name
     */
    readonly name: string;

    /**
     * The IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR notation) that web requests originate from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-ipsetdescriptors
     */
    readonly ipSetDescriptors?: Array<CfnIPSet.IPSetDescriptorProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnIPSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the result of the validation.
 */
function CfnIPSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ipSetDescriptors', cdk.listValidator(CfnIPSet_IPSetDescriptorPropertyValidator))(properties.ipSetDescriptors));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnIPSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::IPSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::IPSet` resource.
 */
// @ts-ignore TS6133
function cfnIPSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIPSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        IPSetDescriptors: cdk.listMapper(cfnIPSetIPSetDescriptorPropertyToCloudFormation)(properties.ipSetDescriptors),
    };
}

// @ts-ignore TS6133
function CfnIPSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIPSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIPSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('ipSetDescriptors', 'IPSetDescriptors', properties.IPSetDescriptors != null ? cfn_parse.FromCloudFormation.getArray(CfnIPSetIPSetDescriptorPropertyFromCloudFormation)(properties.IPSetDescriptors) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::IPSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains one or more IP addresses or blocks of IP addresses specified in Classless Inter-Domain Routing (CIDR) notation. AWS WAF supports IPv4 address ranges: /8 and any range between /16 through /32. AWS WAF supports IPv6 address ranges: /24, /32, /48, /56, /64, and /128.
 *
 * To specify an individual IP address, you specify the four-part IP address followed by a `/32` , for example, 192.0.2.0/32. To block a range of IP addresses, you can specify /8 or any range between /16 through /32 (for IPv4) or /24, /32, /48, /56, /64, or /128 (for IPv6). For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
 *
 * @cloudformationResource AWS::WAFRegional::IPSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html
 */
export class CfnIPSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::IPSet";

    /**
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
        const ret = new CfnIPSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A friendly name or description of the `IPSet` . You can't change the name of an `IPSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-name
     */
    public name: string;

    /**
     * The IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR notation) that web requests originate from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-ipsetdescriptors
     */
    public ipSetDescriptors: Array<CfnIPSet.IPSetDescriptorProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::IPSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIPSetProps) {
        super(scope, id, { type: CfnIPSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.ipSetDescriptors = props.ipSetDescriptors;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIPSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            ipSetDescriptors: this.ipSetDescriptors,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnIPSetPropsToCloudFormation(props);
    }
}

export namespace CfnIPSet {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * Specifies the IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR format) that web requests originate from.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ipset-ipsetdescriptor.html
     */
    export interface IPSetDescriptorProperty {
        /**
         * Specify `IPV4` or `IPV6` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ipset-ipsetdescriptor.html#cfn-wafregional-ipset-ipsetdescriptor-type
         */
        readonly type: string;
        /**
         * Specify an IPv4 address by using CIDR notation. For example:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ipset-ipsetdescriptor.html#cfn-wafregional-ipset-ipsetdescriptor-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `IPSetDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetDescriptorProperty`
 *
 * @returns the result of the validation.
 */
function CfnIPSet_IPSetDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "IPSetDescriptorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::IPSet.IPSetDescriptor` resource
 *
 * @param properties - the TypeScript properties of a `IPSetDescriptorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::IPSet.IPSetDescriptor` resource.
 */
// @ts-ignore TS6133
function cfnIPSetIPSetDescriptorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIPSet_IPSetDescriptorPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnIPSetIPSetDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIPSet.IPSetDescriptorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIPSet.IPSetDescriptorProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRateBasedRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html
 */
export interface CfnRateBasedRuleProps {

    /**
     * A name for the metrics for a `RateBasedRule` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF , including "All" and "Default_Action." You can't change the name of the metric after you create the `RateBasedRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-metricname
     */
    readonly metricName: string;

    /**
     * A friendly name or description for a `RateBasedRule` . You can't change the name of a `RateBasedRule` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-name
     */
    readonly name: string;

    /**
     * The field that AWS WAF uses to determine if requests are likely arriving from single source and thus subject to rate monitoring. The only valid value for `RateKey` is `IP` . `IP` indicates that requests arriving from the same IP address are subject to the `RateLimit` that is specified in the `RateBasedRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-ratekey
     */
    readonly rateKey: string;

    /**
     * The maximum number of requests, which have an identical value in the field specified by the `RateKey` , allowed in a five-minute period. If the number of requests exceeds the `RateLimit` and the other predicates specified in the rule are also met, AWS WAF triggers the action that is specified for this rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-ratelimit
     */
    readonly rateLimit: number;

    /**
     * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet>` object that you want to include in a `RateBasedRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-matchpredicates
     */
    readonly matchPredicates?: Array<CfnRateBasedRule.PredicateProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnRateBasedRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRateBasedRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnRateBasedRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('matchPredicates', cdk.listValidator(CfnRateBasedRule_PredicatePropertyValidator))(properties.matchPredicates));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rateKey', cdk.requiredValidator)(properties.rateKey));
    errors.collect(cdk.propertyValidator('rateKey', cdk.validateString)(properties.rateKey));
    errors.collect(cdk.propertyValidator('rateLimit', cdk.requiredValidator)(properties.rateLimit));
    errors.collect(cdk.propertyValidator('rateLimit', cdk.validateNumber)(properties.rateLimit));
    return errors.wrap('supplied properties not correct for "CfnRateBasedRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::RateBasedRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnRateBasedRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::RateBasedRule` resource.
 */
// @ts-ignore TS6133
function cfnRateBasedRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRateBasedRulePropsValidator(properties).assertSuccess();
    return {
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Name: cdk.stringToCloudFormation(properties.name),
        RateKey: cdk.stringToCloudFormation(properties.rateKey),
        RateLimit: cdk.numberToCloudFormation(properties.rateLimit),
        MatchPredicates: cdk.listMapper(cfnRateBasedRulePredicatePropertyToCloudFormation)(properties.matchPredicates),
    };
}

// @ts-ignore TS6133
function CfnRateBasedRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRateBasedRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRateBasedRuleProps>();
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('rateKey', 'RateKey', cfn_parse.FromCloudFormation.getString(properties.RateKey));
    ret.addPropertyResult('rateLimit', 'RateLimit', cfn_parse.FromCloudFormation.getNumber(properties.RateLimit));
    ret.addPropertyResult('matchPredicates', 'MatchPredicates', properties.MatchPredicates != null ? cfn_parse.FromCloudFormation.getArray(CfnRateBasedRulePredicatePropertyFromCloudFormation)(properties.MatchPredicates) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::RateBasedRule`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
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
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html
 */
export class CfnRateBasedRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::RateBasedRule";

    /**
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
        const ret = new CfnRateBasedRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A name for the metrics for a `RateBasedRule` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF , including "All" and "Default_Action." You can't change the name of the metric after you create the `RateBasedRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-metricname
     */
    public metricName: string;

    /**
     * A friendly name or description for a `RateBasedRule` . You can't change the name of a `RateBasedRule` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-name
     */
    public name: string;

    /**
     * The field that AWS WAF uses to determine if requests are likely arriving from single source and thus subject to rate monitoring. The only valid value for `RateKey` is `IP` . `IP` indicates that requests arriving from the same IP address are subject to the `RateLimit` that is specified in the `RateBasedRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-ratekey
     */
    public rateKey: string;

    /**
     * The maximum number of requests, which have an identical value in the field specified by the `RateKey` , allowed in a five-minute period. If the number of requests exceeds the `RateLimit` and the other predicates specified in the rule are also met, AWS WAF triggers the action that is specified for this rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-ratelimit
     */
    public rateLimit: number;

    /**
     * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet>` object that you want to include in a `RateBasedRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ratebasedrule.html#cfn-wafregional-ratebasedrule-matchpredicates
     */
    public matchPredicates: Array<CfnRateBasedRule.PredicateProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::RateBasedRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRateBasedRuleProps) {
        super(scope, id, { type: CfnRateBasedRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'metricName', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'rateKey', this);
        cdk.requireProperty(props, 'rateLimit', this);

        this.metricName = props.metricName;
        this.name = props.name;
        this.rateKey = props.rateKey;
        this.rateLimit = props.rateLimit;
        this.matchPredicates = props.matchPredicates;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRateBasedRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            metricName: this.metricName,
            name: this.name,
            rateKey: this.rateKey,
            rateLimit: this.rateLimit,
            matchPredicates: this.matchPredicates,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRateBasedRulePropsToCloudFormation(props);
    }
}

export namespace CfnRateBasedRule {
    /**
     * Specifies the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , and `SizeConstraintSet` objects that you want to add to a `Rule` and, for each object, indicates whether you want to negate the settings, for example, requests that do NOT originate from the IP address 192.0.2.44.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html
     */
    export interface PredicateProperty {
        /**
         * A unique identifier for a predicate in a `Rule` , such as `ByteMatchSetId` or `IPSetId` . The ID is returned by the corresponding `Create` or `List` command.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html#cfn-wafregional-ratebasedrule-predicate-dataid
         */
        readonly dataId: string;
        /**
         * Set `Negated` to `False` if you want AWS WAF to allow, block, or count requests based on the settings in the specified `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` . For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow or block requests based on that IP address.
         *
         * Set `Negated` to `True` if you want AWS WAF to allow or block a request based on the negation of the settings in the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` >. For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow, block, or count requests based on all IP addresses *except* `192.0.2.44` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html#cfn-wafregional-ratebasedrule-predicate-negated
         */
        readonly negated: boolean | cdk.IResolvable;
        /**
         * The type of predicate in a `Rule` , such as `ByteMatch` or `IPSet` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-ratebasedrule-predicate.html#cfn-wafregional-ratebasedrule-predicate-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
function CfnRateBasedRule_PredicatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataId', cdk.requiredValidator)(properties.dataId));
    errors.collect(cdk.propertyValidator('dataId', cdk.validateString)(properties.dataId));
    errors.collect(cdk.propertyValidator('negated', cdk.requiredValidator)(properties.negated));
    errors.collect(cdk.propertyValidator('negated', cdk.validateBoolean)(properties.negated));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PredicateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::RateBasedRule.Predicate` resource
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::RateBasedRule.Predicate` resource.
 */
// @ts-ignore TS6133
function cfnRateBasedRulePredicatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRateBasedRule_PredicatePropertyValidator(properties).assertSuccess();
    return {
        DataId: cdk.stringToCloudFormation(properties.dataId),
        Negated: cdk.booleanToCloudFormation(properties.negated),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnRateBasedRulePredicatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRateBasedRule.PredicateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRateBasedRule.PredicateProperty>();
    ret.addPropertyResult('dataId', 'DataId', cfn_parse.FromCloudFormation.getString(properties.DataId));
    ret.addPropertyResult('negated', 'Negated', cfn_parse.FromCloudFormation.getBoolean(properties.Negated));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRegexPatternSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html
 */
export interface CfnRegexPatternSetProps {

    /**
     * A friendly name or description of the `RegexPatternSet` . You can't change `Name` after you create a `RegexPatternSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html#cfn-wafregional-regexpatternset-name
     */
    readonly name: string;

    /**
     * Specifies the regular expression (regex) patterns that you want AWS WAF to search for, such as `B[a@]dB[o0]t` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html#cfn-wafregional-regexpatternset-regexpatternstrings
     */
    readonly regexPatternStrings: string[];
}

/**
 * Determine whether the given properties match those of a `CfnRegexPatternSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegexPatternSetProps`
 *
 * @returns the result of the validation.
 */
function CfnRegexPatternSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('regexPatternStrings', cdk.requiredValidator)(properties.regexPatternStrings));
    errors.collect(cdk.propertyValidator('regexPatternStrings', cdk.listValidator(cdk.validateString))(properties.regexPatternStrings));
    return errors.wrap('supplied properties not correct for "CfnRegexPatternSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::RegexPatternSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnRegexPatternSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::RegexPatternSet` resource.
 */
// @ts-ignore TS6133
function cfnRegexPatternSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRegexPatternSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        RegexPatternStrings: cdk.listMapper(cdk.stringToCloudFormation)(properties.regexPatternStrings),
    };
}

// @ts-ignore TS6133
function CfnRegexPatternSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegexPatternSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegexPatternSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('regexPatternStrings', 'RegexPatternStrings', cfn_parse.FromCloudFormation.getStringArray(properties.RegexPatternStrings));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::RegexPatternSet`
 *
 * The `RegexPatternSet` specifies the regular expression (regex) pattern that you want AWS WAF to search for, such as `B[a@]dB[o0]t` . You can then configure AWS WAF to reject those requests.
 *
 * Note that you can only create regex pattern sets using a AWS CloudFormation template. To add the regex pattern sets created through AWS CloudFormation to a RegexMatchSet, use the AWS WAF console, API, or command line interface (CLI). For more information, see [UpdateRegexMatchSet](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_UpdateRegexMatchSet.html) .
 *
 * @cloudformationResource AWS::WAFRegional::RegexPatternSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html
 */
export class CfnRegexPatternSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::RegexPatternSet";

    /**
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
        const ret = new CfnRegexPatternSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A friendly name or description of the `RegexPatternSet` . You can't change `Name` after you create a `RegexPatternSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html#cfn-wafregional-regexpatternset-name
     */
    public name: string;

    /**
     * Specifies the regular expression (regex) patterns that you want AWS WAF to search for, such as `B[a@]dB[o0]t` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-regexpatternset.html#cfn-wafregional-regexpatternset-regexpatternstrings
     */
    public regexPatternStrings: string[];

    /**
     * Create a new `AWS::WAFRegional::RegexPatternSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRegexPatternSetProps) {
        super(scope, id, { type: CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'regexPatternStrings', this);

        this.name = props.name;
        this.regexPatternStrings = props.regexPatternStrings;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            regexPatternStrings: this.regexPatternStrings,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRegexPatternSetPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html
 */
export interface CfnRuleProps {

    /**
     * A name for the metrics for this `Rule` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF, including "All" and "Default_Action." You can't change `MetricName` after you create the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-metricname
     */
    readonly metricName: string;

    /**
     * The friendly name or description for the `Rule` . You can't change the name of a `Rule` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-name
     */
    readonly name: string;

    /**
     * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet` object that you want to include in a `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-predicates
     */
    readonly predicates?: Array<CfnRule.PredicateProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('predicates', cdk.listValidator(CfnRule_PredicatePropertyValidator))(properties.predicates));
    return errors.wrap('supplied properties not correct for "CfnRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::Rule` resource
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::Rule` resource.
 */
// @ts-ignore TS6133
function cfnRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRulePropsValidator(properties).assertSuccess();
    return {
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Name: cdk.stringToCloudFormation(properties.name),
        Predicates: cdk.listMapper(cfnRulePredicatePropertyToCloudFormation)(properties.predicates),
    };
}

// @ts-ignore TS6133
function CfnRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleProps>();
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('predicates', 'Predicates', properties.Predicates != null ? cfn_parse.FromCloudFormation.getArray(CfnRulePredicatePropertyFromCloudFormation)(properties.Predicates) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::Rule`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
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
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html
 */
export class CfnRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::Rule";

    /**
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
        const ret = new CfnRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A name for the metrics for this `Rule` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF, including "All" and "Default_Action." You can't change `MetricName` after you create the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-metricname
     */
    public metricName: string;

    /**
     * The friendly name or description for the `Rule` . You can't change the name of a `Rule` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-name
     */
    public name: string;

    /**
     * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet` object that you want to include in a `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-predicates
     */
    public predicates: Array<CfnRule.PredicateProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::Rule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRuleProps) {
        super(scope, id, { type: CfnRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'metricName', this);
        cdk.requireProperty(props, 'name', this);

        this.metricName = props.metricName;
        this.name = props.name;
        this.predicates = props.predicates;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            metricName: this.metricName,
            name: this.name,
            predicates: this.predicates,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRulePropsToCloudFormation(props);
    }
}

export namespace CfnRule {
    /**
     * Specifies the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , and `SizeConstraintSet` objects that you want to add to a `Rule` and, for each object, indicates whether you want to negate the settings, for example, requests that do NOT originate from the IP address 192.0.2.44.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html
     */
    export interface PredicateProperty {
        /**
         * A unique identifier for a predicate in a `Rule` , such as `ByteMatchSetId` or `IPSetId` . The ID is returned by the corresponding `Create` or `List` command.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html#cfn-wafregional-rule-predicate-dataid
         */
        readonly dataId: string;
        /**
         * Set `Negated` to `False` if you want AWS WAF to allow, block, or count requests based on the settings in the specified `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` . For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow or block requests based on that IP address.
         *
         * Set `Negated` to `True` if you want AWS WAF to allow or block a request based on the negation of the settings in the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` . For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow, block, or count requests based on all IP addresses *except* `192.0.2.44` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html#cfn-wafregional-rule-predicate-negated
         */
        readonly negated: boolean | cdk.IResolvable;
        /**
         * The type of predicate in a `Rule` , such as `ByteMatch` or `IPSet` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-rule-predicate.html#cfn-wafregional-rule-predicate-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_PredicatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataId', cdk.requiredValidator)(properties.dataId));
    errors.collect(cdk.propertyValidator('dataId', cdk.validateString)(properties.dataId));
    errors.collect(cdk.propertyValidator('negated', cdk.requiredValidator)(properties.negated));
    errors.collect(cdk.propertyValidator('negated', cdk.validateBoolean)(properties.negated));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PredicateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::Rule.Predicate` resource
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::Rule.Predicate` resource.
 */
// @ts-ignore TS6133
function cfnRulePredicatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_PredicatePropertyValidator(properties).assertSuccess();
    return {
        DataId: cdk.stringToCloudFormation(properties.dataId),
        Negated: cdk.booleanToCloudFormation(properties.negated),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnRulePredicatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.PredicateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.PredicateProperty>();
    ret.addPropertyResult('dataId', 'DataId', cfn_parse.FromCloudFormation.getString(properties.DataId));
    ret.addPropertyResult('negated', 'Negated', cfn_parse.FromCloudFormation.getBoolean(properties.Negated));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSizeConstraintSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html
 */
export interface CfnSizeConstraintSetProps {

    /**
     * The name, if any, of the `SizeConstraintSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-name
     */
    readonly name: string;

    /**
     * The size constraint and the part of the web request to check.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-sizeconstraints
     */
    readonly sizeConstraints?: Array<CfnSizeConstraintSet.SizeConstraintProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnSizeConstraintSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnSizeConstraintSetProps`
 *
 * @returns the result of the validation.
 */
function CfnSizeConstraintSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sizeConstraints', cdk.listValidator(CfnSizeConstraintSet_SizeConstraintPropertyValidator))(properties.sizeConstraints));
    return errors.wrap('supplied properties not correct for "CfnSizeConstraintSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::SizeConstraintSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnSizeConstraintSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::SizeConstraintSet` resource.
 */
// @ts-ignore TS6133
function cfnSizeConstraintSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSizeConstraintSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SizeConstraints: cdk.listMapper(cfnSizeConstraintSetSizeConstraintPropertyToCloudFormation)(properties.sizeConstraints),
    };
}

// @ts-ignore TS6133
function CfnSizeConstraintSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSizeConstraintSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSizeConstraintSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('sizeConstraints', 'SizeConstraints', properties.SizeConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnSizeConstraintSetSizeConstraintPropertyFromCloudFormation)(properties.SizeConstraints) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::SizeConstraintSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `SizeConstraint` objects, which specify the parts of web requests that you want AWS WAF to inspect the size of. If a `SizeConstraintSet` contains more than one `SizeConstraint` object, a request only needs to match one constraint to be considered a match.
 *
 * @cloudformationResource AWS::WAFRegional::SizeConstraintSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html
 */
export class CfnSizeConstraintSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::SizeConstraintSet";

    /**
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
        const ret = new CfnSizeConstraintSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name, if any, of the `SizeConstraintSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-name
     */
    public name: string;

    /**
     * The size constraint and the part of the web request to check.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-sizeconstraints
     */
    public sizeConstraints: Array<CfnSizeConstraintSet.SizeConstraintProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::SizeConstraintSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSizeConstraintSetProps) {
        super(scope, id, { type: CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.sizeConstraints = props.sizeConstraints;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            sizeConstraints: this.sizeConstraints,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSizeConstraintSetPropsToCloudFormation(props);
    }
}

export namespace CfnSizeConstraintSet {
    /**
     * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-fieldtomatch.html#cfn-wafregional-sizeconstraintset-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicates the type of operation that the request is asking the origin to perform.
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-fieldtomatch.html#cfn-wafregional-sizeconstraintset-fieldtomatch-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnSizeConstraintSet_FieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "FieldToMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::SizeConstraintSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::SizeConstraintSet.FieldToMatch` resource.
 */
// @ts-ignore TS6133
function cfnSizeConstraintSetFieldToMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSizeConstraintSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSizeConstraintSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSizeConstraintSet.FieldToMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSizeConstraintSet.FieldToMatchProperty>();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSizeConstraintSet {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * Specifies a constraint on the size of a part of the web request. AWS WAF uses the `Size` , `ComparisonOperator` , and `FieldToMatch` to build an expression in the form of " `Size` `ComparisonOperator` size in bytes of `FieldToMatch` ". If that expression is true, the `SizeConstraint` is considered to match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html
     */
    export interface SizeConstraintProperty {
        /**
         * The type of comparison you want AWS WAF to perform. AWS WAF uses this in combination with the provided `Size` and `FieldToMatch` to build an expression in the form of " `Size` `ComparisonOperator` size in bytes of `FieldToMatch` ". If that expression is true, the `SizeConstraint` is considered to match.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-comparisonoperator
         */
        readonly comparisonOperator: string;
        /**
         * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-fieldtomatch
         */
        readonly fieldToMatch: CfnSizeConstraintSet.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The size in bytes that you want AWS WAF to compare against the size of the specified `FieldToMatch` . AWS WAF uses this in combination with `ComparisonOperator` and `FieldToMatch` to build an expression in the form of " `Size` `ComparisonOperator` size in bytes of `FieldToMatch` ". If that expression is true, the `SizeConstraint` is considered to match.
         *
         * Valid values for size are 0 - 21474836480 bytes (0 - 20 GB).
         *
         * If you specify `URI` for the value of `Type` , the / in the URI path that you specify counts as one character. For example, the URI `/logo.jpg` is nine characters long.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-size
         */
        readonly size: number;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF . If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting a request for a match.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-texttransformation
         */
        readonly textTransformation: string;
    }
}

/**
 * Determine whether the given properties match those of a `SizeConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `SizeConstraintProperty`
 *
 * @returns the result of the validation.
 */
function CfnSizeConstraintSet_SizeConstraintPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnSizeConstraintSet_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('size', cdk.requiredValidator)(properties.size));
    errors.collect(cdk.propertyValidator('size', cdk.validateNumber)(properties.size));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.requiredValidator)(properties.textTransformation));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.validateString)(properties.textTransformation));
    return errors.wrap('supplied properties not correct for "SizeConstraintProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::SizeConstraintSet.SizeConstraint` resource
 *
 * @param properties - the TypeScript properties of a `SizeConstraintProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::SizeConstraintSet.SizeConstraint` resource.
 */
// @ts-ignore TS6133
function cfnSizeConstraintSetSizeConstraintPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSizeConstraintSet_SizeConstraintPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        FieldToMatch: cfnSizeConstraintSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        Size: cdk.numberToCloudFormation(properties.size),
        TextTransformation: cdk.stringToCloudFormation(properties.textTransformation),
    };
}

// @ts-ignore TS6133
function CfnSizeConstraintSetSizeConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSizeConstraintSet.SizeConstraintProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSizeConstraintSet.SizeConstraintProperty>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnSizeConstraintSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('size', 'Size', cfn_parse.FromCloudFormation.getNumber(properties.Size));
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSqlInjectionMatchSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html
 */
export interface CfnSqlInjectionMatchSetProps {

    /**
     * The name, if any, of the `SqlInjectionMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-name
     */
    readonly name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for snippets of malicious SQL code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuples
     */
    readonly sqlInjectionMatchTuples?: Array<CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnSqlInjectionMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnSqlInjectionMatchSetProps`
 *
 * @returns the result of the validation.
 */
function CfnSqlInjectionMatchSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sqlInjectionMatchTuples', cdk.listValidator(CfnSqlInjectionMatchSet_SqlInjectionMatchTuplePropertyValidator))(properties.sqlInjectionMatchTuples));
    return errors.wrap('supplied properties not correct for "CfnSqlInjectionMatchSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::SqlInjectionMatchSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnSqlInjectionMatchSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::SqlInjectionMatchSet` resource.
 */
// @ts-ignore TS6133
function cfnSqlInjectionMatchSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSqlInjectionMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SqlInjectionMatchTuples: cdk.listMapper(cfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyToCloudFormation)(properties.sqlInjectionMatchTuples),
    };
}

// @ts-ignore TS6133
function CfnSqlInjectionMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSqlInjectionMatchSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSqlInjectionMatchSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('sqlInjectionMatchTuples', 'SqlInjectionMatchTuples', properties.SqlInjectionMatchTuples != null ? cfn_parse.FromCloudFormation.getArray(CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyFromCloudFormation)(properties.SqlInjectionMatchTuples) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::SqlInjectionMatchSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `SqlInjectionMatchTuple` objects, which specify the parts of web requests that you want AWS WAF to inspect for snippets of malicious SQL code and, if you want AWS WAF to inspect a header, the name of the header. If a `SqlInjectionMatchSet` contains more than one `SqlInjectionMatchTuple` object, a request needs to include snippets of SQL code in only one of the specified parts of the request to be considered a match.
 *
 * @cloudformationResource AWS::WAFRegional::SqlInjectionMatchSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html
 */
export class CfnSqlInjectionMatchSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::SqlInjectionMatchSet";

    /**
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
        const ret = new CfnSqlInjectionMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name, if any, of the `SqlInjectionMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-name
     */
    public name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for snippets of malicious SQL code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuples
     */
    public sqlInjectionMatchTuples: Array<CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::SqlInjectionMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSqlInjectionMatchSetProps) {
        super(scope, id, { type: CfnSqlInjectionMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.sqlInjectionMatchTuples = props.sqlInjectionMatchTuples;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSqlInjectionMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            sqlInjectionMatchTuples: this.sqlInjectionMatchTuples,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSqlInjectionMatchSetPropsToCloudFormation(props);
    }
}

export namespace CfnSqlInjectionMatchSet {
    /**
     * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html#cfn-wafregional-sqlinjectionmatchset-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicates the type of operation that the request is asking the origin to perform.
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html#cfn-wafregional-sqlinjectionmatchset-fieldtomatch-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnSqlInjectionMatchSet_FieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "FieldToMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::SqlInjectionMatchSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::SqlInjectionMatchSet.FieldToMatch` resource.
 */
// @ts-ignore TS6133
function cfnSqlInjectionMatchSetFieldToMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSqlInjectionMatchSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSqlInjectionMatchSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSqlInjectionMatchSet.FieldToMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSqlInjectionMatchSet.FieldToMatchProperty>();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSqlInjectionMatchSet {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * Specifies the part of a web request that you want AWS WAF to inspect for snippets of malicious SQL code and, if you want AWS WAF to inspect a header, the name of the header.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html
     */
    export interface SqlInjectionMatchTupleProperty {
        /**
         * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple-fieldtomatch
         */
        readonly fieldToMatch: CfnSqlInjectionMatchSet.FieldToMatchProperty | cdk.IResolvable;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF . If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting it for a match.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple-texttransformation
         */
        readonly textTransformation: string;
    }
}

/**
 * Determine whether the given properties match those of a `SqlInjectionMatchTupleProperty`
 *
 * @param properties - the TypeScript properties of a `SqlInjectionMatchTupleProperty`
 *
 * @returns the result of the validation.
 */
function CfnSqlInjectionMatchSet_SqlInjectionMatchTuplePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnSqlInjectionMatchSet_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.requiredValidator)(properties.textTransformation));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.validateString)(properties.textTransformation));
    return errors.wrap('supplied properties not correct for "SqlInjectionMatchTupleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::SqlInjectionMatchSet.SqlInjectionMatchTuple` resource
 *
 * @param properties - the TypeScript properties of a `SqlInjectionMatchTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::SqlInjectionMatchSet.SqlInjectionMatchTuple` resource.
 */
// @ts-ignore TS6133
function cfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSqlInjectionMatchSet_SqlInjectionMatchTuplePropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnSqlInjectionMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformation: cdk.stringToCloudFormation(properties.textTransformation),
    };
}

// @ts-ignore TS6133
function CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnSqlInjectionMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWebACL`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html
 */
export interface CfnWebACLProps {

    /**
     * The action to perform if none of the `Rules` contained in the `WebACL` match. The action is specified by the `WafAction` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-defaultaction
     */
    readonly defaultAction: CfnWebACL.ActionProperty | cdk.IResolvable;

    /**
     * A name for the metrics for this `WebACL` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF, including "All" and "Default_Action." You can't change `MetricName` after you create the `WebACL` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-metricname
     */
    readonly metricName: string;

    /**
     * A friendly name or description of the `WebACL` . You can't change the name of a `WebACL` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-name
     */
    readonly name: string;

    /**
     * An array that contains the action for each `Rule` in a `WebACL` , the priority of the `Rule` , and the ID of the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-rules
     */
    readonly rules?: Array<CfnWebACL.RuleProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnWebACLProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebACLProps`
 *
 * @returns the result of the validation.
 */
function CfnWebACLPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultAction', cdk.requiredValidator)(properties.defaultAction));
    errors.collect(cdk.propertyValidator('defaultAction', CfnWebACL_ActionPropertyValidator)(properties.defaultAction));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnWebACL_RulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "CfnWebACLProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::WebACL` resource
 *
 * @param properties - the TypeScript properties of a `CfnWebACLProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::WebACL` resource.
 */
// @ts-ignore TS6133
function cfnWebACLPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACLPropsValidator(properties).assertSuccess();
    return {
        DefaultAction: cfnWebACLActionPropertyToCloudFormation(properties.defaultAction),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Name: cdk.stringToCloudFormation(properties.name),
        Rules: cdk.listMapper(cfnWebACLRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnWebACLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLProps>();
    ret.addPropertyResult('defaultAction', 'DefaultAction', CfnWebACLActionPropertyFromCloudFormation(properties.DefaultAction));
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('rules', 'Rules', properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRulePropertyFromCloudFormation)(properties.Rules) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::WebACL`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains the `Rules` that identify the requests that you want to allow, block, or count. In a `WebACL` , you also specify a default action ( `ALLOW` or `BLOCK` ), and the action for each `Rule` that you add to a `WebACL` , for example, block requests from specified IP addresses or block requests from specified referrers. If you add more than one `Rule` to a `WebACL` , a request needs to match only one of the specifications to be allowed, blocked, or counted.
 *
 * To identify the requests that you want AWS WAF to filter, you associate the `WebACL` with an API Gateway API or an Application Load Balancer.
 *
 * @cloudformationResource AWS::WAFRegional::WebACL
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html
 */
export class CfnWebACL extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::WebACL";

    /**
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
        const ret = new CfnWebACL(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The action to perform if none of the `Rules` contained in the `WebACL` match. The action is specified by the `WafAction` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-defaultaction
     */
    public defaultAction: CfnWebACL.ActionProperty | cdk.IResolvable;

    /**
     * A name for the metrics for this `WebACL` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF, including "All" and "Default_Action." You can't change `MetricName` after you create the `WebACL` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-metricname
     */
    public metricName: string;

    /**
     * A friendly name or description of the `WebACL` . You can't change the name of a `WebACL` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-name
     */
    public name: string;

    /**
     * An array that contains the action for each `Rule` in a `WebACL` , the priority of the `Rule` , and the ID of the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webacl.html#cfn-wafregional-webacl-rules
     */
    public rules: Array<CfnWebACL.RuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::WebACL`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWebACLProps) {
        super(scope, id, { type: CfnWebACL.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'defaultAction', this);
        cdk.requireProperty(props, 'metricName', this);
        cdk.requireProperty(props, 'name', this);

        this.defaultAction = props.defaultAction;
        this.metricName = props.metricName;
        this.name = props.name;
        this.rules = props.rules;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACL.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            defaultAction: this.defaultAction,
            metricName: this.metricName,
            name: this.name,
            rules: this.rules,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWebACLPropsToCloudFormation(props);
    }
}

export namespace CfnWebACL {
    /**
     * Specifies the action AWS WAF takes when a web request matches or doesn't match all rule conditions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-action.html
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-action.html#cfn-wafregional-webacl-action-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::WebACL.Action` resource
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::WebACL.Action` resource.
 */
// @ts-ignore TS6133
function cfnWebACLActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ActionPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnWebACLActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ActionProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A combination of `ByteMatchSet` , `IPSet` , and/or `SqlInjectionMatchSet` objects that identify the web requests that you want to allow, block, or count. For example, you might create a `Rule` that includes the following predicates:
     *
     * - An `IPSet` that causes AWS WAF to search for web requests that originate from the IP address `192.0.2.44`
     * - A `ByteMatchSet` that causes AWS WAF to search for web requests for which the value of the `User-Agent` header is `BadBot` .
     *
     * To match the settings in this `Rule` , a request must originate from `192.0.2.44` AND include a `User-Agent` header for which the value is `BadBot` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html
     */
    export interface RuleProperty {
        /**
         * The action that AWS WAF takes when a web request matches all conditions in the rule, such as allow, block, or count the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html#cfn-wafregional-webacl-rule-action
         */
        readonly action: CfnWebACL.ActionProperty | cdk.IResolvable;
        /**
         * The order in which AWS WAF evaluates the rules in a web ACL. AWS WAF evaluates rules with a lower value before rules with a higher value. The value must be a unique integer. If you have multiple rules in a web ACL, the priority numbers do not need to be consecutive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html#cfn-wafregional-webacl-rule-priority
         */
        readonly priority: number;
        /**
         * The ID of an AWS WAF Regional rule to associate with a web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-webacl-rule.html#cfn-wafregional-webacl-rule-ruleid
         */
        readonly ruleId: string;
    }
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnWebACL_ActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('ruleId', cdk.requiredValidator)(properties.ruleId));
    errors.collect(cdk.propertyValidator('ruleId', cdk.validateString)(properties.ruleId));
    return errors.wrap('supplied properties not correct for "RuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::WebACL.Rule` resource
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::WebACL.Rule` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RulePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnWebACLActionPropertyToCloudFormation(properties.action),
        Priority: cdk.numberToCloudFormation(properties.priority),
        RuleId: cdk.stringToCloudFormation(properties.ruleId),
    };
}

// @ts-ignore TS6133
function CfnWebACLRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleProperty>();
    ret.addPropertyResult('action', 'Action', CfnWebACLActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('ruleId', 'RuleId', cfn_parse.FromCloudFormation.getString(properties.RuleId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWebACLAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html
 */
export interface CfnWebACLAssociationProps {

    /**
     * The Amazon Resource Name (ARN) of the resource to protect with the web ACL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-resourcearn
     */
    readonly resourceArn: string;

    /**
     * A unique identifier (ID) for the web ACL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-webaclid
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
function CfnWebACLAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('webAclId', cdk.requiredValidator)(properties.webAclId));
    errors.collect(cdk.propertyValidator('webAclId', cdk.validateString)(properties.webAclId));
    return errors.wrap('supplied properties not correct for "CfnWebACLAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::WebACLAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnWebACLAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::WebACLAssociation` resource.
 */
// @ts-ignore TS6133
function cfnWebACLAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACLAssociationPropsValidator(properties).assertSuccess();
    return {
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
        WebACLId: cdk.stringToCloudFormation(properties.webAclId),
    };
}

// @ts-ignore TS6133
function CfnWebACLAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLAssociationProps>();
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addPropertyResult('webAclId', 'WebACLId', cfn_parse.FromCloudFormation.getString(properties.WebACLId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::WebACLAssociation`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * The AWS::WAFRegional::WebACLAssociation resource associates an AWS WAF Regional web access control group (ACL) with a resource.
 *
 * @cloudformationResource AWS::WAFRegional::WebACLAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html
 */
export class CfnWebACLAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::WebACLAssociation";

    /**
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
        const ret = new CfnWebACLAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resource to protect with the web ACL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-resourcearn
     */
    public resourceArn: string;

    /**
     * A unique identifier (ID) for the web ACL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-webaclid
     */
    public webAclId: string;

    /**
     * Create a new `AWS::WAFRegional::WebACLAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWebACLAssociationProps) {
        super(scope, id, { type: CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceArn', this);
        cdk.requireProperty(props, 'webAclId', this);

        this.resourceArn = props.resourceArn;
        this.webAclId = props.webAclId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourceArn: this.resourceArn,
            webAclId: this.webAclId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWebACLAssociationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnXssMatchSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html
 */
export interface CfnXssMatchSetProps {

    /**
     * The name, if any, of the `XssMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-name
     */
    readonly name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for cross-site scripting attacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-xssmatchtuples
     */
    readonly xssMatchTuples?: Array<CfnXssMatchSet.XssMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnXssMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnXssMatchSetProps`
 *
 * @returns the result of the validation.
 */
function CfnXssMatchSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('xssMatchTuples', cdk.listValidator(CfnXssMatchSet_XssMatchTuplePropertyValidator))(properties.xssMatchTuples));
    return errors.wrap('supplied properties not correct for "CfnXssMatchSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::XssMatchSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnXssMatchSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::XssMatchSet` resource.
 */
// @ts-ignore TS6133
function cfnXssMatchSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnXssMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        XssMatchTuples: cdk.listMapper(cfnXssMatchSetXssMatchTuplePropertyToCloudFormation)(properties.xssMatchTuples),
    };
}

// @ts-ignore TS6133
function CfnXssMatchSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnXssMatchSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnXssMatchSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('xssMatchTuples', 'XssMatchTuples', properties.XssMatchTuples != null ? cfn_parse.FromCloudFormation.getArray(CfnXssMatchSetXssMatchTuplePropertyFromCloudFormation)(properties.XssMatchTuples) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFRegional::XssMatchSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `XssMatchTuple` objects, which specify the parts of web requests that you want AWS WAF to inspect for cross-site scripting attacks and, if you want AWS WAF to inspect a header, the name of the header. If a `XssMatchSet` contains more than one `XssMatchTuple` object, a request needs to include cross-site scripting attacks in only one of the specified parts of the request to be considered a match.
 *
 * @cloudformationResource AWS::WAFRegional::XssMatchSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html
 */
export class CfnXssMatchSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::XssMatchSet";

    /**
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
        const ret = new CfnXssMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name, if any, of the `XssMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-name
     */
    public name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for cross-site scripting attacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-xssmatchtuples
     */
    public xssMatchTuples: Array<CfnXssMatchSet.XssMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFRegional::XssMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnXssMatchSetProps) {
        super(scope, id, { type: CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.xssMatchTuples = props.xssMatchTuples;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            xssMatchTuples: this.xssMatchTuples,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnXssMatchSetPropsToCloudFormation(props);
    }
}

export namespace CfnXssMatchSet {
    /**
     * The part of a web request that you want AWS WAF to inspect, such as a specific header or a query string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-fieldtomatch.html#cfn-wafregional-xssmatchset-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicates the type of operation that the request is asking the origin to perform.
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-fieldtomatch.html#cfn-wafregional-xssmatchset-fieldtomatch-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnXssMatchSet_FieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "FieldToMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::XssMatchSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::XssMatchSet.FieldToMatch` resource.
 */
// @ts-ignore TS6133
function cfnXssMatchSetFieldToMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnXssMatchSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnXssMatchSetFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnXssMatchSet.FieldToMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnXssMatchSet.FieldToMatchProperty>();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnXssMatchSet {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * Specifies the part of a web request that you want AWS WAF to inspect for cross-site scripting attacks and, if you want AWS WAF to inspect a header, the name of the header.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-xssmatchtuple.html
     */
    export interface XssMatchTupleProperty {
        /**
         * The part of a web request that you want AWS WAF to inspect, such as a specified header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-xssmatchtuple.html#cfn-wafregional-xssmatchset-xssmatchtuple-fieldtomatch
         */
        readonly fieldToMatch: CfnXssMatchSet.FieldToMatchProperty | cdk.IResolvable;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF . If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting it for a match.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-xssmatchset-xssmatchtuple.html#cfn-wafregional-xssmatchset-xssmatchtuple-texttransformation
         */
        readonly textTransformation: string;
    }
}

/**
 * Determine whether the given properties match those of a `XssMatchTupleProperty`
 *
 * @param properties - the TypeScript properties of a `XssMatchTupleProperty`
 *
 * @returns the result of the validation.
 */
function CfnXssMatchSet_XssMatchTuplePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnXssMatchSet_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.requiredValidator)(properties.textTransformation));
    errors.collect(cdk.propertyValidator('textTransformation', cdk.validateString)(properties.textTransformation));
    return errors.wrap('supplied properties not correct for "XssMatchTupleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFRegional::XssMatchSet.XssMatchTuple` resource
 *
 * @param properties - the TypeScript properties of a `XssMatchTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFRegional::XssMatchSet.XssMatchTuple` resource.
 */
// @ts-ignore TS6133
function cfnXssMatchSetXssMatchTuplePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnXssMatchSet_XssMatchTuplePropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnXssMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformation: cdk.stringToCloudFormation(properties.textTransformation),
    };
}

// @ts-ignore TS6133
function CfnXssMatchSetXssMatchTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnXssMatchSet.XssMatchTupleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnXssMatchSet.XssMatchTupleProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnXssMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

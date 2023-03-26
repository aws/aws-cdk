// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:30.434Z","fingerprint":"86vj1GyWoqjJmL/ce2wBYy6u4gqwAGGkWxnjitJ9bWM="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html
 */
export interface CfnByteMatchSetProps {

    /**
     * The name of the `ByteMatchSet` . You can't change `Name` after you create a `ByteMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html#cfn-waf-bytematchset-name
     */
    readonly name: string;

    /**
     * Specifies the bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html#cfn-waf-bytematchset-bytematchtuples
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::ByteMatchSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnByteMatchSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::ByteMatchSet` resource.
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
 * A CloudFormation `AWS::WAF::ByteMatchSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * The `AWS::WAF::ByteMatchSet` resource creates an AWS WAF `ByteMatchSet` that identifies a part of a web request that you want to inspect.
 *
 * @cloudformationResource AWS::WAF::ByteMatchSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html
 */
export class CfnByteMatchSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAF::ByteMatchSet";

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
     * The name of the `ByteMatchSet` . You can't change `Name` after you create a `ByteMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html#cfn-waf-bytematchset-name
     */
    public name: string;

    /**
     * Specifies the bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to search for in web requests, the location in requests that you want AWS WAF to search, and other settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html#cfn-waf-bytematchset-bytematchtuples
     */
    public byteMatchTuples: Array<CfnByteMatchSet.ByteMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAF::ByteMatchSet`.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples.html
     */
    export interface ByteMatchTupleProperty {
        /**
         * The part of a web request that you want to inspect, such as a specified header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples.html#cfn-waf-bytematchset-bytematchtuples-fieldtomatch
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples.html#cfn-waf-bytematchset-bytematchtuples-positionalconstraint
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
         * - `METHOD` : The HTTP method, which indicates the type of operation specified in the request. Amazon CloudFront supports the following methods: `DELETE` , `GET` , `HEAD` , `OPTIONS` , `PATCH` , `POST` , and `PUT` .
         * - `QUERY_STRING` : The value that you want AWS WAF to search for in the query string, which is the part of a URL that appears after a `?` character.
         * - `URI` : The value that you want AWS WAF to search for in the part of a URL that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but instead of inspecting a single parameter, AWS WAF inspects all parameters within the query string for the value or regex pattern that you specify in `TargetString` .
         *
         * If `TargetString` includes alphabetic characters A-Z and a-z, note that the value is case sensitive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples.html#cfn-waf-bytematchset-bytematchtuples-targetstring
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples.html#cfn-waf-bytematchset-bytematchtuples-targetstringbase64
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples.html#cfn-waf-bytematchset-bytematchtuples-texttransformation
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::ByteMatchSet.ByteMatchTuple` resource
 *
 * @param properties - the TypeScript properties of a `ByteMatchTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::ByteMatchSet.ByteMatchTuple` resource.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples-fieldtomatch.html#cfn-waf-bytematchset-bytematchtuples-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicated the type of operation that the request is asking the origin to perform. Amazon CloudFront supports the following methods: `DELETE` , `GET` , `HEAD` , `OPTIONS` , `PATCH` , `POST` , and `PUT` .
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples-fieldtomatch.html#cfn-waf-bytematchset-bytematchtuples-fieldtomatch-type
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::ByteMatchSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::ByteMatchSet.FieldToMatch` resource.
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
 * Properties for defining a `CfnIPSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html
 */
export interface CfnIPSetProps {

    /**
     * The name of the `IPSet` . You can't change the name of an `IPSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html#cfn-waf-ipset-name
     */
    readonly name: string;

    /**
     * The IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR notation) that web requests originate from. If the `WebACL` is associated with an Amazon CloudFront distribution and the viewer did not use an HTTP proxy or a load balancer to send the request, this is the value of the c-ip field in the CloudFront access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html#cfn-waf-ipset-ipsetdescriptors
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::IPSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::IPSet` resource.
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
 * A CloudFormation `AWS::WAF::IPSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains one or more IP addresses or blocks of IP addresses specified in Classless Inter-Domain Routing (CIDR) notation. AWS WAF supports IPv4 address ranges: /8 and any range between /16 through /32. AWS WAF supports IPv6 address ranges: /24, /32, /48, /56, /64, and /128.
 *
 * To specify an individual IP address, you specify the four-part IP address followed by a `/32` , for example, 192.0.2.0/32. To block a range of IP addresses, you can specify /8 or any range between /16 through /32 (for IPv4) or /24, /32, /48, /56, /64, or /128 (for IPv6). For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
 *
 * @cloudformationResource AWS::WAF::IPSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html
 */
export class CfnIPSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAF::IPSet";

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
     * The name of the `IPSet` . You can't change the name of an `IPSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html#cfn-waf-ipset-name
     */
    public name: string;

    /**
     * The IP address type ( `IPV4` or `IPV6` ) and the IP address range (in CIDR notation) that web requests originate from. If the `WebACL` is associated with an Amazon CloudFront distribution and the viewer did not use an HTTP proxy or a load balancer to send the request, this is the value of the c-ip field in the CloudFront access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html#cfn-waf-ipset-ipsetdescriptors
     */
    public ipSetDescriptors: Array<CfnIPSet.IPSetDescriptorProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAF::IPSet`.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-ipset-ipsetdescriptors.html
     */
    export interface IPSetDescriptorProperty {
        /**
         * Specify `IPV4` or `IPV6` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-ipset-ipsetdescriptors.html#cfn-waf-ipset-ipsetdescriptors-type
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-ipset-ipsetdescriptors.html#cfn-waf-ipset-ipsetdescriptors-value
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::IPSet.IPSetDescriptor` resource
 *
 * @param properties - the TypeScript properties of a `IPSetDescriptorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::IPSet.IPSetDescriptor` resource.
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
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html
 */
export interface CfnRuleProps {

    /**
     * The name of the metrics for this `Rule` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF , including "All" and "Default_Action." You can't change `MetricName` after you create the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-metricname
     */
    readonly metricName: string;

    /**
     * The friendly name or description for the `Rule` . You can't change the name of a `Rule` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-name
     */
    readonly name: string;

    /**
     * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet` object that you want to include in a `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-predicates
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::Rule` resource
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::Rule` resource.
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
 * A CloudFormation `AWS::WAF::Rule`
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
 * @cloudformationResource AWS::WAF::Rule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html
 */
export class CfnRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAF::Rule";

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
     * The name of the metrics for this `Rule` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF , including "All" and "Default_Action." You can't change `MetricName` after you create the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-metricname
     */
    public metricName: string;

    /**
     * The friendly name or description for the `Rule` . You can't change the name of a `Rule` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-name
     */
    public name: string;

    /**
     * The `Predicates` object contains one `Predicate` element for each `ByteMatchSet` , `IPSet` , or `SqlInjectionMatchSet` object that you want to include in a `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-predicates
     */
    public predicates: Array<CfnRule.PredicateProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAF::Rule`.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-rule-predicates.html
     */
    export interface PredicateProperty {
        /**
         * A unique identifier for a predicate in a `Rule` , such as `ByteMatchSetId` or `IPSetId` . The ID is returned by the corresponding `Create` or `List` command.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-rule-predicates.html#cfn-waf-rule-predicates-dataid
         */
        readonly dataId: string;
        /**
         * Set `Negated` to `False` if you want AWS WAF to allow, block, or count requests based on the settings in the specified `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` . For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow or block requests based on that IP address.
         *
         * Set `Negated` to `True` if you want AWS WAF to allow or block a request based on the negation of the settings in the `ByteMatchSet` , `IPSet` , `SqlInjectionMatchSet` , `XssMatchSet` , `RegexMatchSet` , `GeoMatchSet` , or `SizeConstraintSet` . For example, if an `IPSet` includes the IP address `192.0.2.44` , AWS WAF will allow, block, or count requests based on all IP addresses *except* `192.0.2.44` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-rule-predicates.html#cfn-waf-rule-predicates-negated
         */
        readonly negated: boolean | cdk.IResolvable;
        /**
         * The type of predicate in a `Rule` , such as `ByteMatch` or `IPSet` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-rule-predicates.html#cfn-waf-rule-predicates-type
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::Rule.Predicate` resource
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::Rule.Predicate` resource.
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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html
 */
export interface CfnSizeConstraintSetProps {

    /**
     * The name, if any, of the `SizeConstraintSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-name
     */
    readonly name: string;

    /**
     * The size constraint and the part of the web request to check.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-sizeconstraints
     */
    readonly sizeConstraints: Array<CfnSizeConstraintSet.SizeConstraintProperty | cdk.IResolvable> | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('sizeConstraints', cdk.requiredValidator)(properties.sizeConstraints));
    errors.collect(cdk.propertyValidator('sizeConstraints', cdk.listValidator(CfnSizeConstraintSet_SizeConstraintPropertyValidator))(properties.sizeConstraints));
    return errors.wrap('supplied properties not correct for "CfnSizeConstraintSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAF::SizeConstraintSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnSizeConstraintSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::SizeConstraintSet` resource.
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
    ret.addPropertyResult('sizeConstraints', 'SizeConstraints', cfn_parse.FromCloudFormation.getArray(CfnSizeConstraintSetSizeConstraintPropertyFromCloudFormation)(properties.SizeConstraints));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAF::SizeConstraintSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `SizeConstraint` objects, which specify the parts of web requests that you want AWS WAF to inspect the size of. If a `SizeConstraintSet` contains more than one `SizeConstraint` object, a request only needs to match one constraint to be considered a match.
 *
 * @cloudformationResource AWS::WAF::SizeConstraintSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html
 */
export class CfnSizeConstraintSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAF::SizeConstraintSet";

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-name
     */
    public name: string;

    /**
     * The size constraint and the part of the web request to check.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-sizeconstraints
     */
    public sizeConstraints: Array<CfnSizeConstraintSet.SizeConstraintProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Create a new `AWS::WAF::SizeConstraintSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSizeConstraintSetProps) {
        super(scope, id, { type: CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'sizeConstraints', this);

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
     * The part of a web request that you want to inspect, such as a specified header or a query string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint-fieldtomatch.html#cfn-waf-sizeconstraintset-sizeconstraint-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicated the type of operation that the request is asking the origin to perform. Amazon CloudFront supports the following methods: `DELETE` , `GET` , `HEAD` , `OPTIONS` , `PATCH` , `POST` , and `PUT` .
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint-fieldtomatch.html#cfn-waf-sizeconstraintset-sizeconstraint-fieldtomatch-type
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::SizeConstraintSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::SizeConstraintSet.FieldToMatch` resource.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint.html
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint.html#cfn-waf-sizeconstraintset-sizeconstraint-comparisonoperator
         */
        readonly comparisonOperator: string;
        /**
         * The part of a web request that you want to inspect, such as a specified header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint.html#cfn-waf-sizeconstraintset-sizeconstraint-fieldtomatch
         */
        readonly fieldToMatch: CfnSizeConstraintSet.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The size in bytes that you want AWS WAF to compare against the size of the specified `FieldToMatch` . AWS WAF uses this in combination with `ComparisonOperator` and `FieldToMatch` to build an expression in the form of " `Size` `ComparisonOperator` size in bytes of `FieldToMatch` ". If that expression is true, the `SizeConstraint` is considered to match.
         *
         * Valid values for size are 0 - 21474836480 bytes (0 - 20 GB).
         *
         * If you specify `URI` for the value of `Type` , the / in the URI path that you specify counts as one character. For example, the URI `/logo.jpg` is nine characters long.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint.html#cfn-waf-sizeconstraintset-sizeconstraint-size
         */
        readonly size: number;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass AWS WAF . If you specify a transformation, AWS WAF performs the transformation on `FieldToMatch` before inspecting it for a match.
         *
         * You can only specify a single type of TextTransformation.
         *
         * Note that if you choose `BODY` for the value of `Type` , you must choose `NONE` for `TextTransformation` because Amazon CloudFront forwards only the first 8192 bytes for inspection.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint.html#cfn-waf-sizeconstraintset-sizeconstraint-texttransformation
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::SizeConstraintSet.SizeConstraint` resource
 *
 * @param properties - the TypeScript properties of a `SizeConstraintProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::SizeConstraintSet.SizeConstraint` resource.
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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html
 */
export interface CfnSqlInjectionMatchSetProps {

    /**
     * The name, if any, of the `SqlInjectionMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-name
     */
    readonly name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for snippets of malicious SQL code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::SqlInjectionMatchSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnSqlInjectionMatchSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::SqlInjectionMatchSet` resource.
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
 * A CloudFormation `AWS::WAF::SqlInjectionMatchSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `SqlInjectionMatchTuple` objects, which specify the parts of web requests that you want AWS WAF to inspect for snippets of malicious SQL code and, if you want AWS WAF to inspect a header, the name of the header. If a `SqlInjectionMatchSet` contains more than one `SqlInjectionMatchTuple` object, a request needs to include snippets of SQL code in only one of the specified parts of the request to be considered a match.
 *
 * @cloudformationResource AWS::WAF::SqlInjectionMatchSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html
 */
export class CfnSqlInjectionMatchSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAF::SqlInjectionMatchSet";

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-name
     */
    public name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for snippets of malicious SQL code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples
     */
    public sqlInjectionMatchTuples: Array<CfnSqlInjectionMatchSet.SqlInjectionMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAF::SqlInjectionMatchSet`.
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
     * The part of a web request that you want to inspect, such as a specified header or a query string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples-fieldtomatch.html#cfn-waf-sizeconstraintset-sizeconstraint-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicated the type of operation that the request is asking the origin to perform. Amazon CloudFront supports the following methods: `DELETE` , `GET` , `HEAD` , `OPTIONS` , `PATCH` , `POST` , and `PUT` .
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-bytematchset-bytematchtuples-fieldtomatch.html#cfn-waf-sizeconstraintset-sizeconstraint-fieldtomatch-type
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::SqlInjectionMatchSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::SqlInjectionMatchSet.FieldToMatch` resource.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sqlinjectionmatchset-sqlinjectionmatchtuples.html
     */
    export interface SqlInjectionMatchTupleProperty {
        /**
         * The part of a web request that you want to inspect, such as a specified header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sqlinjectionmatchset-sqlinjectionmatchtuples.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples-fieldtomatch
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sqlinjectionmatchset-sqlinjectionmatchtuples.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples-texttransformation
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::SqlInjectionMatchSet.SqlInjectionMatchTuple` resource
 *
 * @param properties - the TypeScript properties of a `SqlInjectionMatchTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::SqlInjectionMatchSet.SqlInjectionMatchTuple` resource.
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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html
 */
export interface CfnWebACLProps {

    /**
     * The action to perform if none of the `Rules` contained in the `WebACL` match. The action is specified by the `WafAction` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-defaultaction
     */
    readonly defaultAction: CfnWebACL.WafActionProperty | cdk.IResolvable;

    /**
     * The name of the metrics for this `WebACL` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF , including "All" and "Default_Action." You can't change `MetricName` after you create the `WebACL` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-metricname
     */
    readonly metricName: string;

    /**
     * A friendly name or description of the `WebACL` . You can't change the name of a `WebACL` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-name
     */
    readonly name: string;

    /**
     * An array that contains the action for each `Rule` in a `WebACL` , the priority of the `Rule` , and the ID of the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-rules
     */
    readonly rules?: Array<CfnWebACL.ActivatedRuleProperty | cdk.IResolvable> | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('defaultAction', CfnWebACL_WafActionPropertyValidator)(properties.defaultAction));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnWebACL_ActivatedRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "CfnWebACLProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAF::WebACL` resource
 *
 * @param properties - the TypeScript properties of a `CfnWebACLProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::WebACL` resource.
 */
// @ts-ignore TS6133
function cfnWebACLPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACLPropsValidator(properties).assertSuccess();
    return {
        DefaultAction: cfnWebACLWafActionPropertyToCloudFormation(properties.defaultAction),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Name: cdk.stringToCloudFormation(properties.name),
        Rules: cdk.listMapper(cfnWebACLActivatedRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnWebACLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLProps>();
    ret.addPropertyResult('defaultAction', 'DefaultAction', CfnWebACLWafActionPropertyFromCloudFormation(properties.DefaultAction));
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('rules', 'Rules', properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLActivatedRulePropertyFromCloudFormation)(properties.Rules) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAF::WebACL`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Contains the `Rules` that identify the requests that you want to allow, block, or count. In a `WebACL` , you also specify a default action ( `ALLOW` or `BLOCK` ), and the action for each `Rule` that you add to a `WebACL` , for example, block requests from specified IP addresses or block requests from specified referrers. You also associate the `WebACL` with a Amazon CloudFront distribution to identify the requests that you want AWS WAF to filter. If you add more than one `Rule` to a `WebACL` , a request needs to match only one of the specifications to be allowed, blocked, or counted.
 *
 * @cloudformationResource AWS::WAF::WebACL
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html
 */
export class CfnWebACL extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAF::WebACL";

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-defaultaction
     */
    public defaultAction: CfnWebACL.WafActionProperty | cdk.IResolvable;

    /**
     * The name of the metrics for this `WebACL` . The name can contain only alphanumeric characters (A-Z, a-z, 0-9), with maximum length 128 and minimum length one. It can't contain whitespace or metric names reserved for AWS WAF , including "All" and "Default_Action." You can't change `MetricName` after you create the `WebACL` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-metricname
     */
    public metricName: string;

    /**
     * A friendly name or description of the `WebACL` . You can't change the name of a `WebACL` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-name
     */
    public name: string;

    /**
     * An array that contains the action for each `Rule` in a `WebACL` , the priority of the `Rule` , and the ID of the `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-webacl.html#cfn-waf-webacl-rules
     */
    public rules: Array<CfnWebACL.ActivatedRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAF::WebACL`.
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
     * The `ActivatedRule` object in an `UpdateWebACL` request specifies a `Rule` that you want to insert or delete, the priority of the `Rule` in the `WebACL` , and the action that you want AWS WAF to take when a web request matches the `Rule` ( `ALLOW` , `BLOCK` , or `COUNT` ).
     *
     * To specify whether to insert or delete a `Rule` , use the `Action` parameter in the `WebACLUpdate` data type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html
     */
    export interface ActivatedRuleProperty {
        /**
         * Specifies the action that Amazon CloudFront or AWS WAF takes when a web request matches the conditions in the `Rule` . Valid values for `Action` include the following:
         *
         * - `ALLOW` : CloudFront responds with the requested object.
         * - `BLOCK` : CloudFront responds with an HTTP 403 (Forbidden) status code.
         * - `COUNT` : AWS WAF increments a counter of requests that match the conditions in the rule and then continues to inspect the web request based on the remaining rules in the web ACL.
         *
         * `ActivatedRule|OverrideAction` applies only when updating or adding a `RuleGroup` to a `WebACL` . In this case, you do not use `ActivatedRule|Action` . For all other update requests, `ActivatedRule|Action` is used instead of `ActivatedRule|OverrideAction` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html#cfn-waf-webacl-rules-action
         */
        readonly action?: CfnWebACL.WafActionProperty | cdk.IResolvable;
        /**
         * Specifies the order in which the `Rules` in a `WebACL` are evaluated. Rules with a lower value for `Priority` are evaluated before `Rules` with a higher value. The value must be a unique integer. If you add multiple `Rules` to a `WebACL` , the values don't need to be consecutive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html#cfn-waf-webacl-rules-priority
         */
        readonly priority: number;
        /**
         * The `RuleId` for a `Rule` . You use `RuleId` to get more information about a `Rule` , update a `Rule` , insert a `Rule` into a `WebACL` or delete a one from a `WebACL` , or delete a `Rule` from AWS WAF .
         *
         * `RuleId` is returned by `CreateRule` and by `ListRules` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html#cfn-waf-webacl-rules-ruleid
         */
        readonly ruleId: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActivatedRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ActivatedRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ActivatedRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', CfnWebACL_WafActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('ruleId', cdk.requiredValidator)(properties.ruleId));
    errors.collect(cdk.propertyValidator('ruleId', cdk.validateString)(properties.ruleId));
    return errors.wrap('supplied properties not correct for "ActivatedRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAF::WebACL.ActivatedRule` resource
 *
 * @param properties - the TypeScript properties of a `ActivatedRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::WebACL.ActivatedRule` resource.
 */
// @ts-ignore TS6133
function cfnWebACLActivatedRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ActivatedRulePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnWebACLWafActionPropertyToCloudFormation(properties.action),
        Priority: cdk.numberToCloudFormation(properties.priority),
        RuleId: cdk.stringToCloudFormation(properties.ruleId),
    };
}

// @ts-ignore TS6133
function CfnWebACLActivatedRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ActivatedRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ActivatedRuleProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? CfnWebACLWafActionPropertyFromCloudFormation(properties.Action) : undefined);
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('ruleId', 'RuleId', cfn_parse.FromCloudFormation.getString(properties.RuleId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
     * >
     * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
     *
     * For the action that is associated with a rule in a `WebACL` , specifies the action that you want AWS WAF to perform when a web request matches all of the conditions in a rule. For the default action in a `WebACL` , specifies the action that you want AWS WAF to take when a web request doesn't match all of the conditions in any of the rules in a `WebACL` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-action.html
     */
    export interface WafActionProperty {
        /**
         * Specifies how you want AWS WAF to respond to requests that match the settings in a `Rule` . Valid settings include the following:
         *
         * - `ALLOW` : AWS WAF allows requests
         * - `BLOCK` : AWS WAF blocks requests
         * - `COUNT` : AWS WAF increments a counter of the requests that match all of the conditions in the rule. AWS WAF then continues to inspect the web request based on the remaining rules in the web ACL. You can't specify `COUNT` for the default action for a `WebACL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-action.html#cfn-waf-webacl-action-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `WafActionProperty`
 *
 * @param properties - the TypeScript properties of a `WafActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_WafActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "WafActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAF::WebACL.WafAction` resource
 *
 * @param properties - the TypeScript properties of a `WafActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::WebACL.WafAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLWafActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_WafActionPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnWebACLWafActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.WafActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.WafActionProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnXssMatchSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html
 */
export interface CfnXssMatchSetProps {

    /**
     * The name, if any, of the `XssMatchSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html#cfn-waf-xssmatchset-name
     */
    readonly name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for cross-site scripting attacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html#cfn-waf-xssmatchset-xssmatchtuples
     */
    readonly xssMatchTuples: Array<CfnXssMatchSet.XssMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('xssMatchTuples', cdk.requiredValidator)(properties.xssMatchTuples));
    errors.collect(cdk.propertyValidator('xssMatchTuples', cdk.listValidator(CfnXssMatchSet_XssMatchTuplePropertyValidator))(properties.xssMatchTuples));
    return errors.wrap('supplied properties not correct for "CfnXssMatchSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAF::XssMatchSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnXssMatchSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::XssMatchSet` resource.
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
    ret.addPropertyResult('xssMatchTuples', 'XssMatchTuples', cfn_parse.FromCloudFormation.getArray(CfnXssMatchSetXssMatchTuplePropertyFromCloudFormation)(properties.XssMatchTuples));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAF::XssMatchSet`
 *
 * > This is *AWS WAF Classic* documentation. For more information, see [AWS WAF Classic](https://docs.aws.amazon.com/waf/latest/developerguide/classic-waf-chapter.html) in the developer guide.
 * >
 * > *For the latest version of AWS WAF* , use the AWS WAF V2 API and see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) . With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * A complex type that contains `XssMatchTuple` objects, which specify the parts of web requests that you want AWS WAF to inspect for cross-site scripting attacks and, if you want AWS WAF to inspect a header, the name of the header. If a `XssMatchSet` contains more than one `XssMatchTuple` object, a request needs to include cross-site scripting attacks in only one of the specified parts of the request to be considered a match.
 *
 * @cloudformationResource AWS::WAF::XssMatchSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html
 */
export class CfnXssMatchSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAF::XssMatchSet";

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html#cfn-waf-xssmatchset-name
     */
    public name: string;

    /**
     * Specifies the parts of web requests that you want to inspect for cross-site scripting attacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html#cfn-waf-xssmatchset-xssmatchtuples
     */
    public xssMatchTuples: Array<CfnXssMatchSet.XssMatchTupleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Create a new `AWS::WAF::XssMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnXssMatchSetProps) {
        super(scope, id, { type: CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'xssMatchTuples', this);

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
     * The part of a web request that you want to inspect, such as a specified header or a query string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-xssmatchset-xssmatchtuple-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * When the value of `Type` is `HEADER` , enter the name of the header that you want AWS WAF to search, for example, `User-Agent` or `Referer` . The name of the header is not case sensitive.
         *
         * When the value of `Type` is `SINGLE_QUERY_ARG` , enter the name of the parameter that you want AWS WAF to search, for example, `UserName` or `SalesRegion` . The parameter name is not case sensitive.
         *
         * If the value of `Type` is any other value, omit `Data` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-xssmatchset-xssmatchtuple-fieldtomatch.html#cfn-waf-xssmatchset-xssmatchtuple-fieldtomatch-data
         */
        readonly data?: string;
        /**
         * The part of the web request that you want AWS WAF to search for a specified string. Parts of a request that you can search include the following:
         *
         * - `HEADER` : A specified request header, for example, the value of the `User-Agent` or `Referer` header. If you choose `HEADER` for the type, specify the name of the header in `Data` .
         * - `METHOD` : The HTTP method, which indicated the type of operation that the request is asking the origin to perform. Amazon CloudFront supports the following methods: `DELETE` , `GET` , `HEAD` , `OPTIONS` , `PATCH` , `POST` , and `PUT` .
         * - `QUERY_STRING` : A query string, which is the part of a URL that appears after a `?` character, if any.
         * - `URI` : The part of a web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         * - `BODY` : The part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form. The request body immediately follows the request headers. Note that only the first `8192` bytes of the request body are forwarded to AWS WAF for inspection. To allow or block requests based on the length of the body, you can create a size constraint set.
         * - `SINGLE_QUERY_ARG` : The parameter in the query string that you will inspect, such as *UserName* or *SalesRegion* . The maximum length for `SINGLE_QUERY_ARG` is 30 characters.
         * - `ALL_QUERY_ARGS` : Similar to `SINGLE_QUERY_ARG` , but rather than inspecting a single parameter, AWS WAF will inspect all parameters within the query for the value or regex pattern that you specify in `TargetString` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-xssmatchset-xssmatchtuple-fieldtomatch.html#cfn-waf-xssmatchset-xssmatchtuple-fieldtomatch-type
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::XssMatchSet.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::XssMatchSet.FieldToMatch` resource.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-xssmatchset-xssmatchtuple.html
     */
    export interface XssMatchTupleProperty {
        /**
         * The part of a web request that you want to inspect, such as a specified header or a query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-xssmatchset-xssmatchtuple.html#cfn-waf-xssmatchset-xssmatchtuple-fieldtomatch
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-xssmatchset-xssmatchtuple.html#cfn-waf-xssmatchset-xssmatchtuple-texttransformation
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
 * Renders the AWS CloudFormation properties of an `AWS::WAF::XssMatchSet.XssMatchTuple` resource
 *
 * @param properties - the TypeScript properties of a `XssMatchTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAF::XssMatchSet.XssMatchTuple` resource.
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

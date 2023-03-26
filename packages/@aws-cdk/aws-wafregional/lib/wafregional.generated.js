"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnXssMatchSet = exports.CfnWebACLAssociation = exports.CfnWebACL = exports.CfnSqlInjectionMatchSet = exports.CfnSizeConstraintSet = exports.CfnRule = exports.CfnRegexPatternSet = exports.CfnRateBasedRule = exports.CfnIPSet = exports.CfnGeoMatchSet = exports.CfnByteMatchSet = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnByteMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnByteMatchSetProps`
 *
 * @returns the result of the validation.
 */
function CfnByteMatchSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnByteMatchSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnByteMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ByteMatchTuples: cdk.listMapper(cfnByteMatchSetByteMatchTuplePropertyToCloudFormation)(properties.byteMatchTuples),
    };
}
// @ts-ignore TS6133
function CfnByteMatchSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnByteMatchSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::ByteMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnByteMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnByteMatchSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnByteMatchSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        this.name = props.name;
        this.byteMatchTuples = props.byteMatchTuples;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnByteMatchSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnByteMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnByteMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            byteMatchTuples: this.byteMatchTuples,
        };
    }
    renderProperties(props) {
        return cfnByteMatchSetPropsToCloudFormation(props);
    }
}
exports.CfnByteMatchSet = CfnByteMatchSet;
_a = JSII_RTTI_SYMBOL_1;
CfnByteMatchSet[_a] = { fqn: "@aws-cdk/aws-wafregional.CfnByteMatchSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnByteMatchSet.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::ByteMatchSet";
/**
 * Determine whether the given properties match those of a `ByteMatchTupleProperty`
 *
 * @param properties - the TypeScript properties of a `ByteMatchTupleProperty`
 *
 * @returns the result of the validation.
 */
function CfnByteMatchSet_ByteMatchTuplePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnByteMatchSetByteMatchTuplePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
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
function CfnByteMatchSetByteMatchTuplePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnByteMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('positionalConstraint', 'PositionalConstraint', cfn_parse.FromCloudFormation.getString(properties.PositionalConstraint));
    ret.addPropertyResult('targetString', 'TargetString', properties.TargetString != null ? cfn_parse.FromCloudFormation.getString(properties.TargetString) : undefined);
    ret.addPropertyResult('targetStringBase64', 'TargetStringBase64', properties.TargetStringBase64 != null ? cfn_parse.FromCloudFormation.getString(properties.TargetStringBase64) : undefined);
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnByteMatchSet_FieldToMatchPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnByteMatchSetFieldToMatchPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnByteMatchSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnByteMatchSetFieldToMatchPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
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
function CfnGeoMatchSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnGeoMatchSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnGeoMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        GeoMatchConstraints: cdk.listMapper(cfnGeoMatchSetGeoMatchConstraintPropertyToCloudFormation)(properties.geoMatchConstraints),
    };
}
// @ts-ignore TS6133
function CfnGeoMatchSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnGeoMatchSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::GeoMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnGeoMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnGeoMatchSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnGeoMatchSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        this.name = props.name;
        this.geoMatchConstraints = props.geoMatchConstraints;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGeoMatchSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGeoMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGeoMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            geoMatchConstraints: this.geoMatchConstraints,
        };
    }
    renderProperties(props) {
        return cfnGeoMatchSetPropsToCloudFormation(props);
    }
}
exports.CfnGeoMatchSet = CfnGeoMatchSet;
_b = JSII_RTTI_SYMBOL_1;
CfnGeoMatchSet[_b] = { fqn: "@aws-cdk/aws-wafregional.CfnGeoMatchSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnGeoMatchSet.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::GeoMatchSet";
/**
 * Determine whether the given properties match those of a `GeoMatchConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `GeoMatchConstraintProperty`
 *
 * @returns the result of the validation.
 */
function CfnGeoMatchSet_GeoMatchConstraintPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnGeoMatchSetGeoMatchConstraintPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnGeoMatchSet_GeoMatchConstraintPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}
// @ts-ignore TS6133
function CfnGeoMatchSetGeoMatchConstraintPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
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
function CfnIPSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnIPSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnIPSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        IPSetDescriptors: cdk.listMapper(cfnIPSetIPSetDescriptorPropertyToCloudFormation)(properties.ipSetDescriptors),
    };
}
// @ts-ignore TS6133
function CfnIPSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnIPSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::IPSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnIPSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnIPSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnIPSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        this.name = props.name;
        this.ipSetDescriptors = props.ipSetDescriptors;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnIPSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnIPSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIPSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            ipSetDescriptors: this.ipSetDescriptors,
        };
    }
    renderProperties(props) {
        return cfnIPSetPropsToCloudFormation(props);
    }
}
exports.CfnIPSet = CfnIPSet;
_c = JSII_RTTI_SYMBOL_1;
CfnIPSet[_c] = { fqn: "@aws-cdk/aws-wafregional.CfnIPSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnIPSet.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::IPSet";
/**
 * Determine whether the given properties match those of a `IPSetDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetDescriptorProperty`
 *
 * @returns the result of the validation.
 */
function CfnIPSet_IPSetDescriptorPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnIPSetIPSetDescriptorPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnIPSet_IPSetDescriptorPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}
// @ts-ignore TS6133
function CfnIPSetIPSetDescriptorPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
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
function CfnRateBasedRulePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRateBasedRulePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
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
function CfnRateBasedRulePropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnRateBasedRule extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::RateBasedRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnRateBasedRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnRateBasedRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRateBasedRule);
            }
            throw error;
        }
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
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRateBasedRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnRateBasedRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRateBasedRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            metricName: this.metricName,
            name: this.name,
            rateKey: this.rateKey,
            rateLimit: this.rateLimit,
            matchPredicates: this.matchPredicates,
        };
    }
    renderProperties(props) {
        return cfnRateBasedRulePropsToCloudFormation(props);
    }
}
exports.CfnRateBasedRule = CfnRateBasedRule;
_d = JSII_RTTI_SYMBOL_1;
CfnRateBasedRule[_d] = { fqn: "@aws-cdk/aws-wafregional.CfnRateBasedRule", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRateBasedRule.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::RateBasedRule";
/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
function CfnRateBasedRule_PredicatePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRateBasedRulePredicatePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRateBasedRule_PredicatePropertyValidator(properties).assertSuccess();
    return {
        DataId: cdk.stringToCloudFormation(properties.dataId),
        Negated: cdk.booleanToCloudFormation(properties.negated),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnRateBasedRulePredicatePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('dataId', 'DataId', cfn_parse.FromCloudFormation.getString(properties.DataId));
    ret.addPropertyResult('negated', 'Negated', cfn_parse.FromCloudFormation.getBoolean(properties.Negated));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnRegexPatternSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegexPatternSetProps`
 *
 * @returns the result of the validation.
 */
function CfnRegexPatternSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRegexPatternSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRegexPatternSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        RegexPatternStrings: cdk.listMapper(cdk.stringToCloudFormation)(properties.regexPatternStrings),
    };
}
// @ts-ignore TS6133
function CfnRegexPatternSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnRegexPatternSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::RegexPatternSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnRegexPatternSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRegexPatternSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'regexPatternStrings', this);
        this.name = props.name;
        this.regexPatternStrings = props.regexPatternStrings;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRegexPatternSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRegexPatternSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            regexPatternStrings: this.regexPatternStrings,
        };
    }
    renderProperties(props) {
        return cfnRegexPatternSetPropsToCloudFormation(props);
    }
}
exports.CfnRegexPatternSet = CfnRegexPatternSet;
_e = JSII_RTTI_SYMBOL_1;
CfnRegexPatternSet[_e] = { fqn: "@aws-cdk/aws-wafregional.CfnRegexPatternSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::RegexPatternSet";
/**
 * Determine whether the given properties match those of a `CfnRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnRulePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRulePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRulePropsValidator(properties).assertSuccess();
    return {
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Name: cdk.stringToCloudFormation(properties.name),
        Predicates: cdk.listMapper(cfnRulePredicatePropertyToCloudFormation)(properties.predicates),
    };
}
// @ts-ignore TS6133
function CfnRulePropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnRule extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::Rule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRule);
            }
            throw error;
        }
        cdk.requireProperty(props, 'metricName', this);
        cdk.requireProperty(props, 'name', this);
        this.metricName = props.metricName;
        this.name = props.name;
        this.predicates = props.predicates;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            metricName: this.metricName,
            name: this.name,
            predicates: this.predicates,
        };
    }
    renderProperties(props) {
        return cfnRulePropsToCloudFormation(props);
    }
}
exports.CfnRule = CfnRule;
_f = JSII_RTTI_SYMBOL_1;
CfnRule[_f] = { fqn: "@aws-cdk/aws-wafregional.CfnRule", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRule.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::Rule";
/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_PredicatePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRulePredicatePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRule_PredicatePropertyValidator(properties).assertSuccess();
    return {
        DataId: cdk.stringToCloudFormation(properties.dataId),
        Negated: cdk.booleanToCloudFormation(properties.negated),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnRulePredicatePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('dataId', 'DataId', cfn_parse.FromCloudFormation.getString(properties.DataId));
    ret.addPropertyResult('negated', 'Negated', cfn_parse.FromCloudFormation.getBoolean(properties.Negated));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
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
function CfnSizeConstraintSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSizeConstraintSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSizeConstraintSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SizeConstraints: cdk.listMapper(cfnSizeConstraintSetSizeConstraintPropertyToCloudFormation)(properties.sizeConstraints),
    };
}
// @ts-ignore TS6133
function CfnSizeConstraintSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnSizeConstraintSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::SizeConstraintSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnSizeConstraintSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnSizeConstraintSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        this.name = props.name;
        this.sizeConstraints = props.sizeConstraints;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSizeConstraintSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSizeConstraintSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            sizeConstraints: this.sizeConstraints,
        };
    }
    renderProperties(props) {
        return cfnSizeConstraintSetPropsToCloudFormation(props);
    }
}
exports.CfnSizeConstraintSet = CfnSizeConstraintSet;
_g = JSII_RTTI_SYMBOL_1;
CfnSizeConstraintSet[_g] = { fqn: "@aws-cdk/aws-wafregional.CfnSizeConstraintSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSizeConstraintSet.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::SizeConstraintSet";
/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnSizeConstraintSet_FieldToMatchPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSizeConstraintSetFieldToMatchPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSizeConstraintSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnSizeConstraintSetFieldToMatchPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
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
function CfnSizeConstraintSet_SizeConstraintPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSizeConstraintSetSizeConstraintPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSizeConstraintSet_SizeConstraintPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        FieldToMatch: cfnSizeConstraintSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        Size: cdk.numberToCloudFormation(properties.size),
        TextTransformation: cdk.stringToCloudFormation(properties.textTransformation),
    };
}
// @ts-ignore TS6133
function CfnSizeConstraintSetSizeConstraintPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnSizeConstraintSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('size', 'Size', cfn_parse.FromCloudFormation.getNumber(properties.Size));
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
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
function CfnSqlInjectionMatchSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSqlInjectionMatchSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSqlInjectionMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SqlInjectionMatchTuples: cdk.listMapper(cfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyToCloudFormation)(properties.sqlInjectionMatchTuples),
    };
}
// @ts-ignore TS6133
function CfnSqlInjectionMatchSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnSqlInjectionMatchSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::SqlInjectionMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnSqlInjectionMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnSqlInjectionMatchSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnSqlInjectionMatchSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        this.name = props.name;
        this.sqlInjectionMatchTuples = props.sqlInjectionMatchTuples;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSqlInjectionMatchSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSqlInjectionMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSqlInjectionMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            sqlInjectionMatchTuples: this.sqlInjectionMatchTuples,
        };
    }
    renderProperties(props) {
        return cfnSqlInjectionMatchSetPropsToCloudFormation(props);
    }
}
exports.CfnSqlInjectionMatchSet = CfnSqlInjectionMatchSet;
_h = JSII_RTTI_SYMBOL_1;
CfnSqlInjectionMatchSet[_h] = { fqn: "@aws-cdk/aws-wafregional.CfnSqlInjectionMatchSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSqlInjectionMatchSet.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::SqlInjectionMatchSet";
/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnSqlInjectionMatchSet_FieldToMatchPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSqlInjectionMatchSetFieldToMatchPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSqlInjectionMatchSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnSqlInjectionMatchSetFieldToMatchPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
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
function CfnSqlInjectionMatchSet_SqlInjectionMatchTuplePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSqlInjectionMatchSet_SqlInjectionMatchTuplePropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnSqlInjectionMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformation: cdk.stringToCloudFormation(properties.textTransformation),
    };
}
// @ts-ignore TS6133
function CfnSqlInjectionMatchSetSqlInjectionMatchTuplePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnSqlInjectionMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
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
function CfnWebACLPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnWebACLPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnWebACLPropsValidator(properties).assertSuccess();
    return {
        DefaultAction: cfnWebACLActionPropertyToCloudFormation(properties.defaultAction),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Name: cdk.stringToCloudFormation(properties.name),
        Rules: cdk.listMapper(cfnWebACLRulePropertyToCloudFormation)(properties.rules),
    };
}
// @ts-ignore TS6133
function CfnWebACLPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnWebACL extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::WebACL`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnWebACL.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnWebACLProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnWebACL);
            }
            throw error;
        }
        cdk.requireProperty(props, 'defaultAction', this);
        cdk.requireProperty(props, 'metricName', this);
        cdk.requireProperty(props, 'name', this);
        this.defaultAction = props.defaultAction;
        this.metricName = props.metricName;
        this.name = props.name;
        this.rules = props.rules;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWebACLPropsFromCloudFormation(resourceProperties);
        const ret = new CfnWebACL(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACL.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            defaultAction: this.defaultAction,
            metricName: this.metricName,
            name: this.name,
            rules: this.rules,
        };
    }
    renderProperties(props) {
        return cfnWebACLPropsToCloudFormation(props);
    }
}
exports.CfnWebACL = CfnWebACL;
_j = JSII_RTTI_SYMBOL_1;
CfnWebACL[_j] = { fqn: "@aws-cdk/aws-wafregional.CfnWebACL", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnWebACL.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::WebACL";
/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ActionPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnWebACLActionPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnWebACL_ActionPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnWebACLActionPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
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
function CfnWebACL_RulePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnWebACLRulePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnWebACL_RulePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnWebACLActionPropertyToCloudFormation(properties.action),
        Priority: cdk.numberToCloudFormation(properties.priority),
        RuleId: cdk.stringToCloudFormation(properties.ruleId),
    };
}
// @ts-ignore TS6133
function CfnWebACLRulePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('action', 'Action', CfnWebACLActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('ruleId', 'RuleId', cfn_parse.FromCloudFormation.getString(properties.RuleId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnWebACLAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebACLAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnWebACLAssociationPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnWebACLAssociationPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnWebACLAssociationPropsValidator(properties).assertSuccess();
    return {
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
        WebACLId: cdk.stringToCloudFormation(properties.webAclId),
    };
}
// @ts-ignore TS6133
function CfnWebACLAssociationPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnWebACLAssociation extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::WebACLAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnWebACLAssociationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnWebACLAssociation);
            }
            throw error;
        }
        cdk.requireProperty(props, 'resourceArn', this);
        cdk.requireProperty(props, 'webAclId', this);
        this.resourceArn = props.resourceArn;
        this.webAclId = props.webAclId;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWebACLAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnWebACLAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            resourceArn: this.resourceArn,
            webAclId: this.webAclId,
        };
    }
    renderProperties(props) {
        return cfnWebACLAssociationPropsToCloudFormation(props);
    }
}
exports.CfnWebACLAssociation = CfnWebACLAssociation;
_k = JSII_RTTI_SYMBOL_1;
CfnWebACLAssociation[_k] = { fqn: "@aws-cdk/aws-wafregional.CfnWebACLAssociation", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::WebACLAssociation";
/**
 * Determine whether the given properties match those of a `CfnXssMatchSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnXssMatchSetProps`
 *
 * @returns the result of the validation.
 */
function CfnXssMatchSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnXssMatchSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnXssMatchSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        XssMatchTuples: cdk.listMapper(cfnXssMatchSetXssMatchTuplePropertyToCloudFormation)(properties.xssMatchTuples),
    };
}
// @ts-ignore TS6133
function CfnXssMatchSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnXssMatchSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::WAFRegional::XssMatchSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_wafregional_CfnXssMatchSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnXssMatchSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        this.name = props.name;
        this.xssMatchTuples = props.xssMatchTuples;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnXssMatchSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnXssMatchSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            xssMatchTuples: this.xssMatchTuples,
        };
    }
    renderProperties(props) {
        return cfnXssMatchSetPropsToCloudFormation(props);
    }
}
exports.CfnXssMatchSet = CfnXssMatchSet;
_l = JSII_RTTI_SYMBOL_1;
CfnXssMatchSet[_l] = { fqn: "@aws-cdk/aws-wafregional.CfnXssMatchSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnXssMatchSet.CFN_RESOURCE_TYPE_NAME = "AWS::WAFRegional::XssMatchSet";
/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnXssMatchSet_FieldToMatchPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnXssMatchSetFieldToMatchPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnXssMatchSet_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnXssMatchSetFieldToMatchPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
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
function CfnXssMatchSet_XssMatchTuplePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnXssMatchSetXssMatchTuplePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnXssMatchSet_XssMatchTuplePropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnXssMatchSetFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformation: cdk.stringToCloudFormation(properties.textTransformation),
    };
}
// @ts-ignore TS6133
function CfnXssMatchSetXssMatchTuplePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnXssMatchSetFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformation', 'TextTransformation', cfn_parse.FromCloudFormation.getString(properties.TextTransformation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FmcmVnaW9uYWwuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2FmcmVnaW9uYWwuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLHFDQUFxQztBQUNyQyxnRUFBZ0U7QUEyQmhFOzs7Ozs7R0FNRztBQUNILFNBQVMsNkJBQTZCLENBQUMsVUFBZTtJQUNsRCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDekosTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUM7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Q25HLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLG9EQUFvRCxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3JJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDekksR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIEdlbmVyYXRlZCBmcm9tIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgU3BlY2lmaWNhdGlvblxuLy8gU2VlOiBkb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvY2ZuLXJlc291cmNlLXNwZWNpZmljYXRpb24uaHRtbFxuLy8gQGNmbjJ0czptZXRhQCB7XCJnZW5lcmF0ZWRcIjpcIjIwMjMtMDEtMjJUMDk6NTQ6MzAuNjU2WlwiLFwiZmluZ2VycHJpbnRcIjpcImxtaW5RVU0xSXpNZ2NIUCtITzRjVmlNdGNZeC85dDB6bkQxdENZdThNWEE9XCJ9XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNmbl9wYXJzZSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5CeXRlTWF0Y2hTZXRgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQnl0ZU1hdGNoU2V0UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBmcmllbmRseSBuYW1lIG9yIGRlc2NyaXB0aW9uIG9mIHRoZSBgQnl0ZU1hdGNoU2V0YCAuIFlvdSBjYW4ndCBjaGFuZ2UgYE5hbWVgIGFmdGVyIHlvdSBjcmVhdGUgYSBgQnl0ZU1hdGNoU2V0YCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwtYnl0ZW1hdGNoc2V0LW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIGJ5dGVzICh0eXBpY2FsbHkgYSBzdHJpbmcgdGhhdCBjb3JyZXNwb25kcyB3aXRoIEFTQ0lJIGNoYXJhY3RlcnMpIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yIGluIHdlYiByZXF1ZXN0cywgdGhlIGxvY2F0aW9uIGluIHJlcXVlc3RzIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGFuZCBvdGhlciBzZXR0aW5ncy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQtYnl0ZW1hdGNodHVwbGVzXG4gICAgICovXG4gICAgcmVhZG9ubHkgYnl0ZU1hdGNoVHVwbGVzPzogQXJyYXk8Q2ZuQnl0ZU1hdGNoU2V0LkJ5dGVNYXRjaFR1cGxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkJ5dGVNYXRjaFNldFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5CeXRlTWF0Y2hTZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5CeXRlTWF0Y2hTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2J5dGVNYXRjaFR1cGxlcycsIGNkay5saXN0VmFsaWRhdG9yKENmbkJ5dGVNYXRjaFNldF9CeXRlTWF0Y2hUdXBsZVByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5ieXRlTWF0Y2hUdXBsZXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkJ5dGVNYXRjaFNldFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6Qnl0ZU1hdGNoU2V0YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5CeXRlTWF0Y2hTZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OkJ5dGVNYXRjaFNldGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5CeXRlTWF0Y2hTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQnl0ZU1hdGNoU2V0UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubmFtZSksXG4gICAgICAgIEJ5dGVNYXRjaFR1cGxlczogY2RrLmxpc3RNYXBwZXIoY2ZuQnl0ZU1hdGNoU2V0Qnl0ZU1hdGNoVHVwbGVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuYnl0ZU1hdGNoVHVwbGVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuQnl0ZU1hdGNoU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5CeXRlTWF0Y2hTZXRQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuQnl0ZU1hdGNoU2V0UHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2J5dGVNYXRjaFR1cGxlcycsICdCeXRlTWF0Y2hUdXBsZXMnLCBwcm9wZXJ0aWVzLkJ5dGVNYXRjaFR1cGxlcyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5CeXRlTWF0Y2hTZXRCeXRlTWF0Y2hUdXBsZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLkJ5dGVNYXRjaFR1cGxlcykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6V0FGUmVnaW9uYWw6OkJ5dGVNYXRjaFNldGBcbiAqXG4gKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gKiA+XG4gKiA+ICpGb3IgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIEFXUyBXQUYqICwgdXNlIHRoZSBBV1MgV0FGIFYyIEFQSSBhbmQgc2VlIHRoZSBbQVdTIFdBRiBEZXZlbG9wZXIgR3VpZGVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3dhZi1jaGFwdGVyLmh0bWwpIC4gV2l0aCB0aGUgbGF0ZXN0IHZlcnNpb24sIEFXUyBXQUYgaGFzIGEgc2luZ2xlIHNldCBvZiBlbmRwb2ludHMgZm9yIHJlZ2lvbmFsIGFuZCBnbG9iYWwgdXNlLlxuICpcbiAqIFRoZSBgQVdTOjpXQUZSZWdpb25hbDo6Qnl0ZU1hdGNoU2V0YCByZXNvdXJjZSBjcmVhdGVzIGFuIEFXUyBXQUYgYEJ5dGVNYXRjaFNldGAgdGhhdCBpZGVudGlmaWVzIGEgcGFydCBvZiBhIHdlYiByZXF1ZXN0IHRoYXQgeW91IHdhbnQgdG8gaW5zcGVjdC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OldBRlJlZ2lvbmFsOjpCeXRlTWF0Y2hTZXRcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQnl0ZU1hdGNoU2V0IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6V0FGUmVnaW9uYWw6OkJ5dGVNYXRjaFNldFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbkJ5dGVNYXRjaFNldCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuQnl0ZU1hdGNoU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkJ5dGVNYXRjaFNldChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGZyaWVuZGx5IG5hbWUgb3IgZGVzY3JpcHRpb24gb2YgdGhlIGBCeXRlTWF0Y2hTZXRgIC4gWW91IGNhbid0IGNoYW5nZSBgTmFtZWAgYWZ0ZXIgeW91IGNyZWF0ZSBhIGBCeXRlTWF0Y2hTZXRgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIGJ5dGVzICh0eXBpY2FsbHkgYSBzdHJpbmcgdGhhdCBjb3JyZXNwb25kcyB3aXRoIEFTQ0lJIGNoYXJhY3RlcnMpIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yIGluIHdlYiByZXF1ZXN0cywgdGhlIGxvY2F0aW9uIGluIHJlcXVlc3RzIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGFuZCBvdGhlciBzZXR0aW5ncy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQtYnl0ZW1hdGNodHVwbGVzXG4gICAgICovXG4gICAgcHVibGljIGJ5dGVNYXRjaFR1cGxlczogQXJyYXk8Q2ZuQnl0ZU1hdGNoU2V0LkJ5dGVNYXRjaFR1cGxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OldBRlJlZ2lvbmFsOjpCeXRlTWF0Y2hTZXRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5CeXRlTWF0Y2hTZXRQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuQnl0ZU1hdGNoU2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbmFtZScsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMuYnl0ZU1hdGNoVHVwbGVzID0gcHJvcHMuYnl0ZU1hdGNoVHVwbGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuQnl0ZU1hdGNoU2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBieXRlTWF0Y2hUdXBsZXM6IHRoaXMuYnl0ZU1hdGNoVHVwbGVzLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkJ5dGVNYXRjaFNldFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkJ5dGVNYXRjaFNldCB7XG4gICAgLyoqXG4gICAgICogPiBUaGlzIGlzICpBV1MgV0FGIENsYXNzaWMqIGRvY3VtZW50YXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FXUyBXQUYgQ2xhc3NpY10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY2xhc3NpYy13YWYtY2hhcHRlci5odG1sKSBpbiB0aGUgZGV2ZWxvcGVyIGd1aWRlLlxuICAgICAqID5cbiAgICAgKiA+ICpGb3IgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIEFXUyBXQUYqICwgdXNlIHRoZSBBV1MgV0FGIFYyIEFQSSBhbmQgc2VlIHRoZSBbQVdTIFdBRiBEZXZlbG9wZXIgR3VpZGVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3dhZi1jaGFwdGVyLmh0bWwpIC4gV2l0aCB0aGUgbGF0ZXN0IHZlcnNpb24sIEFXUyBXQUYgaGFzIGEgc2luZ2xlIHNldCBvZiBlbmRwb2ludHMgZm9yIHJlZ2lvbmFsIGFuZCBnbG9iYWwgdXNlLlxuICAgICAqXG4gICAgICogVGhlIGJ5dGVzICh0eXBpY2FsbHkgYSBzdHJpbmcgdGhhdCBjb3JyZXNwb25kcyB3aXRoIEFTQ0lJIGNoYXJhY3RlcnMpIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yIGluIHdlYiByZXF1ZXN0cywgdGhlIGxvY2F0aW9uIGluIHJlcXVlc3RzIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGFuZCBvdGhlciBzZXR0aW5ncy5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC1ieXRlbWF0Y2h0dXBsZS5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBCeXRlTWF0Y2hUdXBsZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYXJ0IG9mIGEgd2ViIHJlcXVlc3QgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIGluc3BlY3QsIHN1Y2ggYXMgYSBzcGVjaWZpYyBoZWFkZXIgb3IgYSBxdWVyeSBzdHJpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtYnl0ZW1hdGNoc2V0LWJ5dGVtYXRjaHR1cGxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC1ieXRlbWF0Y2h0dXBsZS1maWVsZHRvbWF0Y2hcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGZpZWxkVG9NYXRjaDogQ2ZuQnl0ZU1hdGNoU2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2l0aGluIHRoZSBwb3J0aW9uIG9mIGEgd2ViIHJlcXVlc3QgdGhhdCB5b3Ugd2FudCB0byBzZWFyY2ggKGZvciBleGFtcGxlLCBpbiB0aGUgcXVlcnkgc3RyaW5nLCBpZiBhbnkpLCBzcGVjaWZ5IHdoZXJlIHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoLiBWYWxpZCB2YWx1ZXMgaW5jbHVkZSB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKlxuICAgICAgICAgKiAqQ09OVEFJTlMqXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBzcGVjaWZpZWQgcGFydCBvZiB0aGUgd2ViIHJlcXVlc3QgbXVzdCBpbmNsdWRlIHRoZSB2YWx1ZSBvZiBgVGFyZ2V0U3RyaW5nYCAsIGJ1dCB0aGUgbG9jYXRpb24gZG9lc24ndCBtYXR0ZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqICpDT05UQUlOU19XT1JEKlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgc3BlY2lmaWVkIHBhcnQgb2YgdGhlIHdlYiByZXF1ZXN0IG11c3QgaW5jbHVkZSB0aGUgdmFsdWUgb2YgYFRhcmdldFN0cmluZ2AgLCBhbmQgYFRhcmdldFN0cmluZ2AgbXVzdCBjb250YWluIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgb3IgdW5kZXJzY29yZSAoQS1aLCBhLXosIDAtOSwgb3IgXykuIEluIGFkZGl0aW9uLCBgVGFyZ2V0U3RyaW5nYCBtdXN0IGJlIGEgd29yZCwgd2hpY2ggbWVhbnMgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAgICAgICAqXG4gICAgICAgICAqIC0gYFRhcmdldFN0cmluZ2AgZXhhY3RseSBtYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIHBhcnQgb2YgdGhlIHdlYiByZXF1ZXN0LCBzdWNoIGFzIHRoZSB2YWx1ZSBvZiBhIGhlYWRlci5cbiAgICAgICAgICogLSBgVGFyZ2V0U3RyaW5nYCBpcyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzcGVjaWZpZWQgcGFydCBvZiB0aGUgd2ViIHJlcXVlc3QgYW5kIGlzIGZvbGxvd2VkIGJ5IGEgY2hhcmFjdGVyIG90aGVyIHRoYW4gYW4gYWxwaGFudW1lcmljIGNoYXJhY3RlciBvciB1bmRlcnNjb3JlIChfKSwgZm9yIGV4YW1wbGUsIGBCYWRCb3Q7YCAuXG4gICAgICAgICAqIC0gYFRhcmdldFN0cmluZ2AgaXMgYXQgdGhlIGVuZCBvZiB0aGUgc3BlY2lmaWVkIHBhcnQgb2YgdGhlIHdlYiByZXF1ZXN0IGFuZCBpcyBwcmVjZWRlZCBieSBhIGNoYXJhY3RlciBvdGhlciB0aGFuIGFuIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXIgb3IgdW5kZXJzY29yZSAoXyksIGZvciBleGFtcGxlLCBgO0JhZEJvdGAgLlxuICAgICAgICAgKiAtIGBUYXJnZXRTdHJpbmdgIGlzIGluIHRoZSBtaWRkbGUgb2YgdGhlIHNwZWNpZmllZCBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdCBhbmQgaXMgcHJlY2VkZWQgYW5kIGZvbGxvd2VkIGJ5IGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBvciB1bmRlcnNjb3JlIChfKSwgZm9yIGV4YW1wbGUsIGAtQmFkQm90O2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqRVhBQ1RMWSpcbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIHZhbHVlIG9mIHRoZSBzcGVjaWZpZWQgcGFydCBvZiB0aGUgd2ViIHJlcXVlc3QgbXVzdCBleGFjdGx5IG1hdGNoIHRoZSB2YWx1ZSBvZiBgVGFyZ2V0U3RyaW5nYCAuXG4gICAgICAgICAqXG4gICAgICAgICAqICpTVEFSVFNfV0lUSCpcbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIHZhbHVlIG9mIGBUYXJnZXRTdHJpbmdgIG11c3QgYXBwZWFyIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNwZWNpZmllZCBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogKkVORFNfV0lUSCpcbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIHZhbHVlIG9mIGBUYXJnZXRTdHJpbmdgIG11c3QgYXBwZWFyIGF0IHRoZSBlbmQgb2YgdGhlIHNwZWNpZmllZCBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQtYnl0ZW1hdGNodHVwbGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtYnl0ZW1hdGNoc2V0LWJ5dGVtYXRjaHR1cGxlLXBvc2l0aW9uYWxjb25zdHJhaW50XG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBwb3NpdGlvbmFsQ29uc3RyYWludDogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHZhbHVlIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yLiBBV1MgV0FGIHNlYXJjaGVzIGZvciB0aGUgc3BlY2lmaWVkIHN0cmluZyBpbiB0aGUgcGFydCBvZiB3ZWIgcmVxdWVzdHMgdGhhdCB5b3Ugc3BlY2lmaWVkIGluIGBGaWVsZFRvTWF0Y2hgIC4gVGhlIG1heGltdW0gbGVuZ3RoIG9mIHRoZSB2YWx1ZSBpcyA1MCBieXRlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogWW91IG11c3Qgc3BlY2lmeSB0aGlzIHByb3BlcnR5IG9yIHRoZSBgVGFyZ2V0U3RyaW5nQmFzZTY0YCBwcm9wZXJ0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogVmFsaWQgdmFsdWVzIGRlcGVuZCBvbiB0aGUgdmFsdWVzIHRoYXQgeW91IHNwZWNpZmllZCBmb3IgYEZpZWxkVG9NYXRjaGAgOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIGBIRUFERVJgIDogVGhlIHZhbHVlIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yIGluIHRoZSByZXF1ZXN0IGhlYWRlciB0aGF0IHlvdSBzcGVjaWZpZWQgaW4gYEZpZWxkVG9NYXRjaGAgLCBmb3IgZXhhbXBsZSwgdGhlIHZhbHVlIG9mIHRoZSBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIGhlYWRlci5cbiAgICAgICAgICogLSBgTUVUSE9EYCA6IFRoZSBIVFRQIG1ldGhvZCwgd2hpY2ggaW5kaWNhdGVzIHRoZSB0eXBlIG9mIG9wZXJhdGlvbiBzcGVjaWZpZWQgaW4gdGhlIHJlcXVlc3QuXG4gICAgICAgICAqIC0gYFFVRVJZX1NUUklOR2AgOiBUaGUgdmFsdWUgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIHNlYXJjaCBmb3IgaW4gdGhlIHF1ZXJ5IHN0cmluZywgd2hpY2ggaXMgdGhlIHBhcnQgb2YgYSBVUkwgdGhhdCBhcHBlYXJzIGFmdGVyIGEgYD9gIGNoYXJhY3Rlci5cbiAgICAgICAgICogLSBgVVJJYCA6IFRoZSB2YWx1ZSB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoIGZvciBpbiB0aGUgcGFydCBvZiBhIFVSTCB0aGF0IGlkZW50aWZpZXMgYSByZXNvdXJjZSwgZm9yIGV4YW1wbGUsIGAvaW1hZ2VzL2RhaWx5LWFkLmpwZ2AgLlxuICAgICAgICAgKiAtIGBCT0RZYCA6IFRoZSBwYXJ0IG9mIGEgcmVxdWVzdCB0aGF0IGNvbnRhaW5zIGFueSBhZGRpdGlvbmFsIGRhdGEgdGhhdCB5b3Ugd2FudCB0byBzZW5kIHRvIHlvdXIgd2ViIHNlcnZlciBhcyB0aGUgSFRUUCByZXF1ZXN0IGJvZHksIHN1Y2ggYXMgZGF0YSBmcm9tIGEgZm9ybS4gVGhlIHJlcXVlc3QgYm9keSBpbW1lZGlhdGVseSBmb2xsb3dzIHRoZSByZXF1ZXN0IGhlYWRlcnMuIE5vdGUgdGhhdCBvbmx5IHRoZSBmaXJzdCBgODE5MmAgYnl0ZXMgb2YgdGhlIHJlcXVlc3QgYm9keSBhcmUgZm9yd2FyZGVkIHRvIEFXUyBXQUYgZm9yIGluc3BlY3Rpb24uIFRvIGFsbG93IG9yIGJsb2NrIHJlcXVlc3RzIGJhc2VkIG9uIHRoZSBsZW5ndGggb2YgdGhlIGJvZHksIHlvdSBjYW4gY3JlYXRlIGEgc2l6ZSBjb25zdHJhaW50IHNldC5cbiAgICAgICAgICogLSBgU0lOR0xFX1FVRVJZX0FSR2AgOiBUaGUgcGFyYW1ldGVyIGluIHRoZSBxdWVyeSBzdHJpbmcgdGhhdCB5b3Ugd2lsbCBpbnNwZWN0LCBzdWNoIGFzICpVc2VyTmFtZSogb3IgKlNhbGVzUmVnaW9uKiAuIFRoZSBtYXhpbXVtIGxlbmd0aCBmb3IgYFNJTkdMRV9RVUVSWV9BUkdgIGlzIDMwIGNoYXJhY3RlcnMuXG4gICAgICAgICAqIC0gYEFMTF9RVUVSWV9BUkdTYCA6IFNpbWlsYXIgdG8gYFNJTkdMRV9RVUVSWV9BUkdgICwgYnV0IGluc3RlYWQgb2YgaW5zcGVjdGluZyBhIHNpbmdsZSBwYXJhbWV0ZXIsIEFXUyBXQUYgaW5zcGVjdHMgYWxsIHBhcmFtZXRlcnMgd2l0aGluIHRoZSBxdWVyeSBzdHJpbmcgZm9yIHRoZSB2YWx1ZSBvciByZWdleCBwYXR0ZXJuIHRoYXQgeW91IHNwZWNpZnkgaW4gYFRhcmdldFN0cmluZ2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiBgVGFyZ2V0U3RyaW5nYCBpbmNsdWRlcyBhbHBoYWJldGljIGNoYXJhY3RlcnMgQS1aIGFuZCBhLXosIG5vdGUgdGhhdCB0aGUgdmFsdWUgaXMgY2FzZSBzZW5zaXRpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtYnl0ZW1hdGNoc2V0LWJ5dGVtYXRjaHR1cGxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC1ieXRlbWF0Y2h0dXBsZS10YXJnZXRzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHRhcmdldFN0cmluZz86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBiYXNlNjQtZW5jb2RlZCB2YWx1ZSB0aGF0IEFXUyBXQUYgc2VhcmNoZXMgZm9yLiBBV1MgQ2xvdWRGb3JtYXRpb24gc2VuZHMgdGhpcyB2YWx1ZSB0byBBV1MgV0FGIHdpdGhvdXQgZW5jb2RpbmcgaXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFlvdSBtdXN0IHNwZWNpZnkgdGhpcyBwcm9wZXJ0eSBvciB0aGUgYFRhcmdldFN0cmluZ2AgcHJvcGVydHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEFXUyBXQUYgc2VhcmNoZXMgZm9yIHRoaXMgdmFsdWUgaW4gYSBzcGVjaWZpYyBwYXJ0IG9mIHdlYiByZXF1ZXN0cywgd2hpY2ggeW91IGRlZmluZSBpbiB0aGUgYEZpZWxkVG9NYXRjaGAgcHJvcGVydHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFZhbGlkIHZhbHVlcyBkZXBlbmQgb24gdGhlIFR5cGUgdmFsdWUgaW4gdGhlIGBGaWVsZFRvTWF0Y2hgIHByb3BlcnR5LiBGb3IgZXhhbXBsZSwgZm9yIGEgYE1FVEhPRGAgdHlwZSwgeW91IG11c3Qgc3BlY2lmeSBIVFRQIG1ldGhvZHMgc3VjaCBhcyBgREVMRVRFLCBHRVQsIEhFQUQsIE9QVElPTlMsIFBBVENILCBQT1NUYCAsIGFuZCBgUFVUYCAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtYnl0ZW1hdGNoc2V0LWJ5dGVtYXRjaHR1cGxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC1ieXRlbWF0Y2h0dXBsZS10YXJnZXRzdHJpbmdiYXNlNjRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHRhcmdldFN0cmluZ0Jhc2U2ND86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRleHQgdHJhbnNmb3JtYXRpb25zIGVsaW1pbmF0ZSBzb21lIG9mIHRoZSB1bnVzdWFsIGZvcm1hdHRpbmcgdGhhdCBhdHRhY2tlcnMgdXNlIGluIHdlYiByZXF1ZXN0cyBpbiBhbiBlZmZvcnQgdG8gYnlwYXNzIEFXUyBXQUYgLiBJZiB5b3Ugc3BlY2lmeSBhIHRyYW5zZm9ybWF0aW9uLCBBV1MgV0FGIHBlcmZvcm1zIHRoZSB0cmFuc2Zvcm1hdGlvbiBvbiBgRmllbGRUb01hdGNoYCBiZWZvcmUgaW5zcGVjdGluZyBpdCBmb3IgYSBtYXRjaC5cbiAgICAgICAgICpcbiAgICAgICAgICogWW91IGNhbiBvbmx5IHNwZWNpZnkgYSBzaW5nbGUgdHlwZSBvZiBUZXh0VHJhbnNmb3JtYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqICpDTURfTElORSpcbiAgICAgICAgICpcbiAgICAgICAgICogV2hlbiB5b3UncmUgY29uY2VybmVkIHRoYXQgYXR0YWNrZXJzIGFyZSBpbmplY3RpbmcgYW4gb3BlcmF0aW5nIHN5c3RlbSBjb21tYW5kIGxpbmUgY29tbWFuZCBhbmQgdXNpbmcgdW51c3VhbCBmb3JtYXR0aW5nIHRvIGRpc2d1aXNlIHNvbWUgb3IgYWxsIG9mIHRoZSBjb21tYW5kLCB1c2UgdGhpcyBvcHRpb24gdG8gcGVyZm9ybSB0aGUgZm9sbG93aW5nIHRyYW5zZm9ybWF0aW9uczpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBEZWxldGUgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzOiBcXCBcIiAnIF5cbiAgICAgICAgICogLSBEZWxldGUgc3BhY2VzIGJlZm9yZSB0aGUgZm9sbG93aW5nIGNoYXJhY3RlcnM6IC8gKFxuICAgICAgICAgKiAtIFJlcGxhY2UgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzIHdpdGggYSBzcGFjZTogLCA7XG4gICAgICAgICAqIC0gUmVwbGFjZSBtdWx0aXBsZSBzcGFjZXMgd2l0aCBvbmUgc3BhY2VcbiAgICAgICAgICogLSBDb252ZXJ0IHVwcGVyY2FzZSBsZXR0ZXJzIChBLVopIHRvIGxvd2VyY2FzZSAoYS16KVxuICAgICAgICAgKlxuICAgICAgICAgKiAqQ09NUFJFU1NfV0hJVEVfU1BBQ0UqXG4gICAgICAgICAqXG4gICAgICAgICAqIFVzZSB0aGlzIG9wdGlvbiB0byByZXBsYWNlIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVycyB3aXRoIGEgc3BhY2UgY2hhcmFjdGVyIChkZWNpbWFsIDMyKTpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBcXGYsIGZvcm1mZWVkLCBkZWNpbWFsIDEyXG4gICAgICAgICAqIC0gXFx0LCB0YWIsIGRlY2ltYWwgOVxuICAgICAgICAgKiAtIFxcbiwgbmV3bGluZSwgZGVjaW1hbCAxMFxuICAgICAgICAgKiAtIFxcciwgY2FycmlhZ2UgcmV0dXJuLCBkZWNpbWFsIDEzXG4gICAgICAgICAqIC0gXFx2LCB2ZXJ0aWNhbCB0YWIsIGRlY2ltYWwgMTFcbiAgICAgICAgICogLSBub24tYnJlYWtpbmcgc3BhY2UsIGRlY2ltYWwgMTYwXG4gICAgICAgICAqXG4gICAgICAgICAqIGBDT01QUkVTU19XSElURV9TUEFDRWAgYWxzbyByZXBsYWNlcyBtdWx0aXBsZSBzcGFjZXMgd2l0aCBvbmUgc3BhY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqICpIVE1MX0VOVElUWV9ERUNPREUqXG4gICAgICAgICAqXG4gICAgICAgICAqIFVzZSB0aGlzIG9wdGlvbiB0byByZXBsYWNlIEhUTUwtZW5jb2RlZCBjaGFyYWN0ZXJzIHdpdGggdW5lbmNvZGVkIGNoYXJhY3RlcnMuIGBIVE1MX0VOVElUWV9ERUNPREVgIHBlcmZvcm1zIHRoZSBmb2xsb3dpbmcgb3BlcmF0aW9uczpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBSZXBsYWNlcyBgKGFtcGVyc2FuZClxdW90O2Agd2l0aCBgXCJgXG4gICAgICAgICAqIC0gUmVwbGFjZXMgYChhbXBlcnNhbmQpbmJzcDtgIHdpdGggYSBub24tYnJlYWtpbmcgc3BhY2UsIGRlY2ltYWwgMTYwXG4gICAgICAgICAqIC0gUmVwbGFjZXMgYChhbXBlcnNhbmQpbHQ7YCB3aXRoIGEgXCJsZXNzIHRoYW5cIiBzeW1ib2xcbiAgICAgICAgICogLSBSZXBsYWNlcyBgKGFtcGVyc2FuZClndDtgIHdpdGggYD5gXG4gICAgICAgICAqIC0gUmVwbGFjZXMgY2hhcmFjdGVycyB0aGF0IGFyZSByZXByZXNlbnRlZCBpbiBoZXhhZGVjaW1hbCBmb3JtYXQsIGAoYW1wZXJzYW5kKSN4aGhoaDtgICwgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzXG4gICAgICAgICAqIC0gUmVwbGFjZXMgY2hhcmFjdGVycyB0aGF0IGFyZSByZXByZXNlbnRlZCBpbiBkZWNpbWFsIGZvcm1hdCwgYChhbXBlcnNhbmQpI25ubm47YCAsIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVyc1xuICAgICAgICAgKlxuICAgICAgICAgKiAqTE9XRVJDQVNFKlxuICAgICAgICAgKlxuICAgICAgICAgKiBVc2UgdGhpcyBvcHRpb24gdG8gY29udmVydCB1cHBlcmNhc2UgbGV0dGVycyAoQS1aKSB0byBsb3dlcmNhc2UgKGEteikuXG4gICAgICAgICAqXG4gICAgICAgICAqICpVUkxfREVDT0RFKlxuICAgICAgICAgKlxuICAgICAgICAgKiBVc2UgdGhpcyBvcHRpb24gdG8gZGVjb2RlIGEgVVJMLWVuY29kZWQgdmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqICpOT05FKlxuICAgICAgICAgKlxuICAgICAgICAgKiBTcGVjaWZ5IGBOT05FYCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBwZXJmb3JtIGFueSB0ZXh0IHRyYW5zZm9ybWF0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQtYnl0ZW1hdGNodHVwbGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtYnl0ZW1hdGNoc2V0LWJ5dGVtYXRjaHR1cGxlLXRleHR0cmFuc2Zvcm1hdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdGV4dFRyYW5zZm9ybWF0aW9uOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEJ5dGVNYXRjaFR1cGxlUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEJ5dGVNYXRjaFR1cGxlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQnl0ZU1hdGNoU2V0X0J5dGVNYXRjaFR1cGxlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWVsZFRvTWF0Y2gnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZmllbGRUb01hdGNoKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWVsZFRvTWF0Y2gnLCBDZm5CeXRlTWF0Y2hTZXRfRmllbGRUb01hdGNoUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuZmllbGRUb01hdGNoKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwb3NpdGlvbmFsQ29uc3RyYWludCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5wb3NpdGlvbmFsQ29uc3RyYWludCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9zaXRpb25hbENvbnN0cmFpbnQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucG9zaXRpb25hbENvbnN0cmFpbnQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldFN0cmluZycsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50YXJnZXRTdHJpbmcpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldFN0cmluZ0Jhc2U2NCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50YXJnZXRTdHJpbmdCYXNlNjQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RleHRUcmFuc2Zvcm1hdGlvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50ZXh0VHJhbnNmb3JtYXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RleHRUcmFuc2Zvcm1hdGlvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50ZXh0VHJhbnNmb3JtYXRpb24pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQnl0ZU1hdGNoVHVwbGVQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OkJ5dGVNYXRjaFNldC5CeXRlTWF0Y2hUdXBsZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQnl0ZU1hdGNoVHVwbGVQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OkJ5dGVNYXRjaFNldC5CeXRlTWF0Y2hUdXBsZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5CeXRlTWF0Y2hTZXRCeXRlTWF0Y2hUdXBsZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5CeXRlTWF0Y2hTZXRfQnl0ZU1hdGNoVHVwbGVQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRmllbGRUb01hdGNoOiBjZm5CeXRlTWF0Y2hTZXRGaWVsZFRvTWF0Y2hQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5maWVsZFRvTWF0Y2gpLFxuICAgICAgICBQb3NpdGlvbmFsQ29uc3RyYWludDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wb3NpdGlvbmFsQ29uc3RyYWludCksXG4gICAgICAgIFRhcmdldFN0cmluZzogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50YXJnZXRTdHJpbmcpLFxuICAgICAgICBUYXJnZXRTdHJpbmdCYXNlNjQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGFyZ2V0U3RyaW5nQmFzZTY0KSxcbiAgICAgICAgVGV4dFRyYW5zZm9ybWF0aW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRleHRUcmFuc2Zvcm1hdGlvbiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkJ5dGVNYXRjaFNldEJ5dGVNYXRjaFR1cGxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5CeXRlTWF0Y2hTZXQuQnl0ZU1hdGNoVHVwbGVQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5CeXRlTWF0Y2hTZXQuQnl0ZU1hdGNoVHVwbGVQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ZpZWxkVG9NYXRjaCcsICdGaWVsZFRvTWF0Y2gnLCBDZm5CeXRlTWF0Y2hTZXRGaWVsZFRvTWF0Y2hQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkZpZWxkVG9NYXRjaCkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncG9zaXRpb25hbENvbnN0cmFpbnQnLCAnUG9zaXRpb25hbENvbnN0cmFpbnQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlBvc2l0aW9uYWxDb25zdHJhaW50KSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YXJnZXRTdHJpbmcnLCAnVGFyZ2V0U3RyaW5nJywgcHJvcGVydGllcy5UYXJnZXRTdHJpbmcgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVGFyZ2V0U3RyaW5nKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YXJnZXRTdHJpbmdCYXNlNjQnLCAnVGFyZ2V0U3RyaW5nQmFzZTY0JywgcHJvcGVydGllcy5UYXJnZXRTdHJpbmdCYXNlNjQgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVGFyZ2V0U3RyaW5nQmFzZTY0KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0ZXh0VHJhbnNmb3JtYXRpb24nLCAnVGV4dFRyYW5zZm9ybWF0aW9uJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5UZXh0VHJhbnNmb3JtYXRpb24pKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5CeXRlTWF0Y2hTZXQge1xuICAgIC8qKlxuICAgICAqID4gVGhpcyBpcyAqQVdTIFdBRiBDbGFzc2ljKiBkb2N1bWVudGF0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBV1MgV0FGIENsYXNzaWNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NsYXNzaWMtd2FmLWNoYXB0ZXIuaHRtbCkgaW4gdGhlIGRldmVsb3BlciBndWlkZS5cbiAgICAgKiA+XG4gICAgICogPiAqRm9yIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBV1MgV0FGKiAsIHVzZSB0aGUgQVdTIFdBRiBWMiBBUEkgYW5kIHNlZSB0aGUgW0FXUyBXQUYgRGV2ZWxvcGVyIEd1aWRlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS93YWYtY2hhcHRlci5odG1sKSAuIFdpdGggdGhlIGxhdGVzdCB2ZXJzaW9uLCBBV1MgV0FGIGhhcyBhIHNpbmdsZSBzZXQgb2YgZW5kcG9pbnRzIGZvciByZWdpb25hbCBhbmQgZ2xvYmFsIHVzZS5cbiAgICAgKlxuICAgICAqIFNwZWNpZmllcyB3aGVyZSBpbiBhIHdlYiByZXF1ZXN0IHRvIGxvb2sgZm9yIGBUYXJnZXRTdHJpbmdgIC5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC1maWVsZHRvbWF0Y2guaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmllbGRUb01hdGNoUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hlbiB0aGUgdmFsdWUgb2YgYFR5cGVgIGlzIGBIRUFERVJgICwgZW50ZXIgdGhlIG5hbWUgb2YgdGhlIGhlYWRlciB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoLCBmb3IgZXhhbXBsZSwgYFVzZXItQWdlbnRgIG9yIGBSZWZlcmVyYCAuIFRoZSBuYW1lIG9mIHRoZSBoZWFkZXIgaXMgbm90IGNhc2Ugc2Vuc2l0aXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBXaGVuIHRoZSB2YWx1ZSBvZiBgVHlwZWAgaXMgYFNJTkdMRV9RVUVSWV9BUkdgICwgZW50ZXIgdGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoLCBmb3IgZXhhbXBsZSwgYFVzZXJOYW1lYCBvciBgU2FsZXNSZWdpb25gIC4gVGhlIHBhcmFtZXRlciBuYW1lIGlzIG5vdCBjYXNlIHNlbnNpdGl2ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIHZhbHVlIG9mIGBUeXBlYCBpcyBhbnkgb3RoZXIgdmFsdWUsIG9taXQgYERhdGFgIC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1ieXRlbWF0Y2hzZXQtZmllbGR0b21hdGNoLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC1maWVsZHRvbWF0Y2gtZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGF0YT86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoIGZvciBhIHNwZWNpZmllZCBzdHJpbmcuIFBhcnRzIG9mIGEgcmVxdWVzdCB0aGF0IHlvdSBjYW4gc2VhcmNoIGluY2x1ZGUgdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBgSEVBREVSYCA6IEEgc3BlY2lmaWVkIHJlcXVlc3QgaGVhZGVyLCBmb3IgZXhhbXBsZSwgdGhlIHZhbHVlIG9mIHRoZSBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIGhlYWRlci4gSWYgeW91IGNob29zZSBgSEVBREVSYCBmb3IgdGhlIHR5cGUsIHNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIGhlYWRlciBpbiBgRGF0YWAgLlxuICAgICAgICAgKiAtIGBNRVRIT0RgIDogVGhlIEhUVFAgbWV0aG9kLCB3aGljaCBpbmRpY2F0ZWQgdGhlIHR5cGUgb2Ygb3BlcmF0aW9uIHRoYXQgdGhlIHJlcXVlc3QgaXMgYXNraW5nIHRoZSBvcmlnaW4gdG8gcGVyZm9ybS5cbiAgICAgICAgICogLSBgUVVFUllfU1RSSU5HYCA6IEEgcXVlcnkgc3RyaW5nLCB3aGljaCBpcyB0aGUgcGFydCBvZiBhIFVSTCB0aGF0IGFwcGVhcnMgYWZ0ZXIgYSBgP2AgY2hhcmFjdGVyLCBpZiBhbnkuXG4gICAgICAgICAqIC0gYFVSSWAgOiBUaGUgcGFydCBvZiBhIHdlYiByZXF1ZXN0IHRoYXQgaWRlbnRpZmllcyBhIHJlc291cmNlLCBmb3IgZXhhbXBsZSwgYC9pbWFnZXMvZGFpbHktYWQuanBnYCAuXG4gICAgICAgICAqIC0gYEJPRFlgIDogVGhlIHBhcnQgb2YgYSByZXF1ZXN0IHRoYXQgY29udGFpbnMgYW55IGFkZGl0aW9uYWwgZGF0YSB0aGF0IHlvdSB3YW50IHRvIHNlbmQgdG8geW91ciB3ZWIgc2VydmVyIGFzIHRoZSBIVFRQIHJlcXVlc3QgYm9keSwgc3VjaCBhcyBkYXRhIGZyb20gYSBmb3JtLiBUaGUgcmVxdWVzdCBib2R5IGltbWVkaWF0ZWx5IGZvbGxvd3MgdGhlIHJlcXVlc3QgaGVhZGVycy4gTm90ZSB0aGF0IG9ubHkgdGhlIGZpcnN0IGA4MTkyYCBieXRlcyBvZiB0aGUgcmVxdWVzdCBib2R5IGFyZSBmb3J3YXJkZWQgdG8gQVdTIFdBRiBmb3IgaW5zcGVjdGlvbi4gVG8gYWxsb3cgb3IgYmxvY2sgcmVxdWVzdHMgYmFzZWQgb24gdGhlIGxlbmd0aCBvZiB0aGUgYm9keSwgeW91IGNhbiBjcmVhdGUgYSBzaXplIGNvbnN0cmFpbnQgc2V0LlxuICAgICAgICAgKiAtIGBTSU5HTEVfUVVFUllfQVJHYCA6IFRoZSBwYXJhbWV0ZXIgaW4gdGhlIHF1ZXJ5IHN0cmluZyB0aGF0IHlvdSB3aWxsIGluc3BlY3QsIHN1Y2ggYXMgKlVzZXJOYW1lKiBvciAqU2FsZXNSZWdpb24qIC4gVGhlIG1heGltdW0gbGVuZ3RoIGZvciBgU0lOR0xFX1FVRVJZX0FSR2AgaXMgMzAgY2hhcmFjdGVycy5cbiAgICAgICAgICogLSBgQUxMX1FVRVJZX0FSR1NgIDogU2ltaWxhciB0byBgU0lOR0xFX1FVRVJZX0FSR2AgLCBidXQgcmF0aGVyIHRoYW4gaW5zcGVjdGluZyBhIHNpbmdsZSBwYXJhbWV0ZXIsIEFXUyBXQUYgd2lsbCBpbnNwZWN0IGFsbCBwYXJhbWV0ZXJzIHdpdGhpbiB0aGUgcXVlcnkgZm9yIHRoZSB2YWx1ZSBvciByZWdleCBwYXR0ZXJuIHRoYXQgeW91IHNwZWNpZnkgaW4gYFRhcmdldFN0cmluZ2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLWJ5dGVtYXRjaHNldC1maWVsZHRvbWF0Y2guaHRtbCNjZm4td2FmcmVnaW9uYWwtYnl0ZW1hdGNoc2V0LWZpZWxkdG9tYXRjaC10eXBlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEZpZWxkVG9NYXRjaFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWVsZFRvTWF0Y2hQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5CeXRlTWF0Y2hTZXRfRmllbGRUb01hdGNoUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRhdGEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkZpZWxkVG9NYXRjaFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6Qnl0ZU1hdGNoU2V0LkZpZWxkVG9NYXRjaGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRmllbGRUb01hdGNoUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpCeXRlTWF0Y2hTZXQuRmllbGRUb01hdGNoYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkJ5dGVNYXRjaFNldEZpZWxkVG9NYXRjaFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5CeXRlTWF0Y2hTZXRfRmllbGRUb01hdGNoUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIERhdGE6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGF0YSksXG4gICAgICAgIFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHlwZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkJ5dGVNYXRjaFNldEZpZWxkVG9NYXRjaFByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuQnl0ZU1hdGNoU2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkJ5dGVNYXRjaFNldC5GaWVsZFRvTWF0Y2hQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RhdGEnLCAnRGF0YScsIHByb3BlcnRpZXMuRGF0YSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5EYXRhKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0eXBlJywgJ1R5cGUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlR5cGUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5HZW9NYXRjaFNldGBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtZ2VvbWF0Y2hzZXQuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkdlb01hdGNoU2V0UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBmcmllbmRseSBuYW1lIG9yIGRlc2NyaXB0aW9uIG9mIHRoZSBgR2VvTWF0Y2hTZXRgIC4gWW91IGNhbid0IGNoYW5nZSB0aGUgbmFtZSBvZiBhbiBgR2VvTWF0Y2hTZXRgIGFmdGVyIHlvdSBjcmVhdGUgaXQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1nZW9tYXRjaHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1nZW9tYXRjaHNldC1uYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgYEdlb01hdGNoQ29uc3RyYWludGAgb2JqZWN0cywgd2hpY2ggY29udGFpbiB0aGUgY291bnRyeSB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoIGZvci5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWdlb21hdGNoc2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLWdlb21hdGNoc2V0LWdlb21hdGNoY29uc3RyYWludHNcbiAgICAgKi9cbiAgICByZWFkb25seSBnZW9NYXRjaENvbnN0cmFpbnRzPzogQXJyYXk8Q2ZuR2VvTWF0Y2hTZXQuR2VvTWF0Y2hDb25zdHJhaW50UHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkdlb01hdGNoU2V0UHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkdlb01hdGNoU2V0UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuR2VvTWF0Y2hTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2dlb01hdGNoQ29uc3RyYWludHMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5HZW9NYXRjaFNldF9HZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuZ2VvTWF0Y2hDb25zdHJhaW50cykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuR2VvTWF0Y2hTZXRQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6Okdlb01hdGNoU2V0YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5HZW9NYXRjaFNldFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6R2VvTWF0Y2hTZXRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuR2VvTWF0Y2hTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuR2VvTWF0Y2hTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgR2VvTWF0Y2hDb25zdHJhaW50czogY2RrLmxpc3RNYXBwZXIoY2ZuR2VvTWF0Y2hTZXRHZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuZ2VvTWF0Y2hDb25zdHJhaW50cyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkdlb01hdGNoU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5HZW9NYXRjaFNldFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5HZW9NYXRjaFNldFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdnZW9NYXRjaENvbnN0cmFpbnRzJywgJ0dlb01hdGNoQ29uc3RyYWludHMnLCBwcm9wZXJ0aWVzLkdlb01hdGNoQ29uc3RyYWludHMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuR2VvTWF0Y2hTZXRHZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5HZW9NYXRjaENvbnN0cmFpbnRzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpXQUZSZWdpb25hbDo6R2VvTWF0Y2hTZXRgXG4gKlxuICogPiBUaGlzIGlzICpBV1MgV0FGIENsYXNzaWMqIGRvY3VtZW50YXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FXUyBXQUYgQ2xhc3NpY10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY2xhc3NpYy13YWYtY2hhcHRlci5odG1sKSBpbiB0aGUgZGV2ZWxvcGVyIGd1aWRlLlxuICogPlxuICogPiAqRm9yIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBV1MgV0FGKiAsIHVzZSB0aGUgQVdTIFdBRiBWMiBBUEkgYW5kIHNlZSB0aGUgW0FXUyBXQUYgRGV2ZWxvcGVyIEd1aWRlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS93YWYtY2hhcHRlci5odG1sKSAuIFdpdGggdGhlIGxhdGVzdCB2ZXJzaW9uLCBBV1MgV0FGIGhhcyBhIHNpbmdsZSBzZXQgb2YgZW5kcG9pbnRzIGZvciByZWdpb25hbCBhbmQgZ2xvYmFsIHVzZS5cbiAqXG4gKiBDb250YWlucyBvbmUgb3IgbW9yZSBjb3VudHJpZXMgdGhhdCBBV1MgV0FGIHdpbGwgc2VhcmNoIGZvci5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OldBRlJlZ2lvbmFsOjpHZW9NYXRjaFNldFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWdlb21hdGNoc2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkdlb01hdGNoU2V0IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6V0FGUmVnaW9uYWw6Okdlb01hdGNoU2V0XCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuR2VvTWF0Y2hTZXQge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkdlb01hdGNoU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkdlb01hdGNoU2V0KHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZnJpZW5kbHkgbmFtZSBvciBkZXNjcmlwdGlvbiBvZiB0aGUgYEdlb01hdGNoU2V0YCAuIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgYW4gYEdlb01hdGNoU2V0YCBhZnRlciB5b3UgY3JlYXRlIGl0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtZ2VvbWF0Y2hzZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwtZ2VvbWF0Y2hzZXQtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBgR2VvTWF0Y2hDb25zdHJhaW50YCBvYmplY3RzLCB3aGljaCBjb250YWluIHRoZSBjb3VudHJ5IHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtZ2VvbWF0Y2hzZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwtZ2VvbWF0Y2hzZXQtZ2VvbWF0Y2hjb25zdHJhaW50c1xuICAgICAqL1xuICAgIHB1YmxpYyBnZW9NYXRjaENvbnN0cmFpbnRzOiBBcnJheTxDZm5HZW9NYXRjaFNldC5HZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6V0FGUmVnaW9uYWw6Okdlb01hdGNoU2V0YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuR2VvTWF0Y2hTZXRQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuR2VvTWF0Y2hTZXQuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICduYW1lJywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICAgICAgdGhpcy5nZW9NYXRjaENvbnN0cmFpbnRzID0gcHJvcHMuZ2VvTWF0Y2hDb25zdHJhaW50cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkdlb01hdGNoU2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBnZW9NYXRjaENvbnN0cmFpbnRzOiB0aGlzLmdlb01hdGNoQ29uc3RyYWludHMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuR2VvTWF0Y2hTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5HZW9NYXRjaFNldCB7XG4gICAgLyoqXG4gICAgICogPiBUaGlzIGlzICpBV1MgV0FGIENsYXNzaWMqIGRvY3VtZW50YXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FXUyBXQUYgQ2xhc3NpY10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY2xhc3NpYy13YWYtY2hhcHRlci5odG1sKSBpbiB0aGUgZGV2ZWxvcGVyIGd1aWRlLlxuICAgICAqID5cbiAgICAgKiA+ICpGb3IgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIEFXUyBXQUYqICwgdXNlIHRoZSBBV1MgV0FGIFYyIEFQSSBhbmQgc2VlIHRoZSBbQVdTIFdBRiBEZXZlbG9wZXIgR3VpZGVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3dhZi1jaGFwdGVyLmh0bWwpIC4gV2l0aCB0aGUgbGF0ZXN0IHZlcnNpb24sIEFXUyBXQUYgaGFzIGEgc2luZ2xlIHNldCBvZiBlbmRwb2ludHMgZm9yIHJlZ2lvbmFsIGFuZCBnbG9iYWwgdXNlLlxuICAgICAqXG4gICAgICogVGhlIGNvdW50cnkgZnJvbSB3aGljaCB3ZWIgcmVxdWVzdHMgb3JpZ2luYXRlIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtZ2VvbWF0Y2hzZXQtZ2VvbWF0Y2hjb25zdHJhaW50Lmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdlb01hdGNoQ29uc3RyYWludFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIGdlb2dyYXBoaWNhbCBhcmVhIHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoIGZvci4gQ3VycmVudGx5IGBDb3VudHJ5YCBpcyB0aGUgb25seSB2YWxpZCB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1nZW9tYXRjaHNldC1nZW9tYXRjaGNvbnN0cmFpbnQuaHRtbCNjZm4td2FmcmVnaW9uYWwtZ2VvbWF0Y2hzZXQtZ2VvbWF0Y2hjb25zdHJhaW50LXR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBjb3VudHJ5IHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLWdlb21hdGNoc2V0LWdlb21hdGNoY29uc3RyYWludC5odG1sI2Nmbi13YWZyZWdpb25hbC1nZW9tYXRjaHNldC1nZW9tYXRjaGNvbnN0cmFpbnQtdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEdlb01hdGNoQ29uc3RyYWludFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBHZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5HZW9NYXRjaFNldF9HZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd2YWx1ZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy52YWx1ZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmFsdWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudmFsdWUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiR2VvTWF0Y2hDb25zdHJhaW50UHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpHZW9NYXRjaFNldC5HZW9NYXRjaENvbnN0cmFpbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEdlb01hdGNoQ29uc3RyYWludFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6R2VvTWF0Y2hTZXQuR2VvTWF0Y2hDb25zdHJhaW50YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkdlb01hdGNoU2V0R2VvTWF0Y2hDb25zdHJhaW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkdlb01hdGNoU2V0X0dlb01hdGNoQ29uc3RyYWludFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnR5cGUpLFxuICAgICAgICBWYWx1ZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy52YWx1ZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkdlb01hdGNoU2V0R2VvTWF0Y2hDb25zdHJhaW50UHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5HZW9NYXRjaFNldC5HZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5HZW9NYXRjaFNldC5HZW9NYXRjaENvbnN0cmFpbnRQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3R5cGUnLCAnVHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVHlwZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndmFsdWUnLCAnVmFsdWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlZhbHVlKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuSVBTZXRgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWlwc2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5JUFNldFByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIEEgZnJpZW5kbHkgbmFtZSBvciBkZXNjcmlwdGlvbiBvZiB0aGUgYElQU2V0YCAuIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgYW4gYElQU2V0YCBhZnRlciB5b3UgY3JlYXRlIGl0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtaXBzZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwtaXBzZXQtbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBJUCBhZGRyZXNzIHR5cGUgKCBgSVBWNGAgb3IgYElQVjZgICkgYW5kIHRoZSBJUCBhZGRyZXNzIHJhbmdlIChpbiBDSURSIG5vdGF0aW9uKSB0aGF0IHdlYiByZXF1ZXN0cyBvcmlnaW5hdGUgZnJvbS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWlwc2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLWlwc2V0LWlwc2V0ZGVzY3JpcHRvcnNcbiAgICAgKi9cbiAgICByZWFkb25seSBpcFNldERlc2NyaXB0b3JzPzogQXJyYXk8Q2ZuSVBTZXQuSVBTZXREZXNjcmlwdG9yUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbklQU2V0UHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbklQU2V0UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuSVBTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2lwU2V0RGVzY3JpcHRvcnMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5JUFNldF9JUFNldERlc2NyaXB0b3JQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuaXBTZXREZXNjcmlwdG9ycykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuSVBTZXRQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OklQU2V0YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5JUFNldFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6SVBTZXRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuSVBTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuSVBTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgSVBTZXREZXNjcmlwdG9yczogY2RrLmxpc3RNYXBwZXIoY2ZuSVBTZXRJUFNldERlc2NyaXB0b3JQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuaXBTZXREZXNjcmlwdG9ycyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbklQU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5JUFNldFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5JUFNldFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdpcFNldERlc2NyaXB0b3JzJywgJ0lQU2V0RGVzY3JpcHRvcnMnLCBwcm9wZXJ0aWVzLklQU2V0RGVzY3JpcHRvcnMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuSVBTZXRJUFNldERlc2NyaXB0b3JQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5JUFNldERlc2NyaXB0b3JzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpXQUZSZWdpb25hbDo6SVBTZXRgXG4gKlxuICogPiBUaGlzIGlzICpBV1MgV0FGIENsYXNzaWMqIGRvY3VtZW50YXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FXUyBXQUYgQ2xhc3NpY10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY2xhc3NpYy13YWYtY2hhcHRlci5odG1sKSBpbiB0aGUgZGV2ZWxvcGVyIGd1aWRlLlxuICogPlxuICogPiAqRm9yIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBV1MgV0FGKiAsIHVzZSB0aGUgQVdTIFdBRiBWMiBBUEkgYW5kIHNlZSB0aGUgW0FXUyBXQUYgRGV2ZWxvcGVyIEd1aWRlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS93YWYtY2hhcHRlci5odG1sKSAuIFdpdGggdGhlIGxhdGVzdCB2ZXJzaW9uLCBBV1MgV0FGIGhhcyBhIHNpbmdsZSBzZXQgb2YgZW5kcG9pbnRzIGZvciByZWdpb25hbCBhbmQgZ2xvYmFsIHVzZS5cbiAqXG4gKiBDb250YWlucyBvbmUgb3IgbW9yZSBJUCBhZGRyZXNzZXMgb3IgYmxvY2tzIG9mIElQIGFkZHJlc3NlcyBzcGVjaWZpZWQgaW4gQ2xhc3NsZXNzIEludGVyLURvbWFpbiBSb3V0aW5nIChDSURSKSBub3RhdGlvbi4gQVdTIFdBRiBzdXBwb3J0cyBJUHY0IGFkZHJlc3MgcmFuZ2VzOiAvOCBhbmQgYW55IHJhbmdlIGJldHdlZW4gLzE2IHRocm91Z2ggLzMyLiBBV1MgV0FGIHN1cHBvcnRzIElQdjYgYWRkcmVzcyByYW5nZXM6IC8yNCwgLzMyLCAvNDgsIC81NiwgLzY0LCBhbmQgLzEyOC5cbiAqXG4gKiBUbyBzcGVjaWZ5IGFuIGluZGl2aWR1YWwgSVAgYWRkcmVzcywgeW91IHNwZWNpZnkgdGhlIGZvdXItcGFydCBJUCBhZGRyZXNzIGZvbGxvd2VkIGJ5IGEgYC8zMmAgLCBmb3IgZXhhbXBsZSwgMTkyLjAuMi4wLzMyLiBUbyBibG9jayBhIHJhbmdlIG9mIElQIGFkZHJlc3NlcywgeW91IGNhbiBzcGVjaWZ5IC84IG9yIGFueSByYW5nZSBiZXR3ZWVuIC8xNiB0aHJvdWdoIC8zMiAoZm9yIElQdjQpIG9yIC8yNCwgLzMyLCAvNDgsIC81NiwgLzY0LCBvciAvMTI4IChmb3IgSVB2NikuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IENJRFIgbm90YXRpb24sIHNlZSB0aGUgV2lraXBlZGlhIGVudHJ5IFtDbGFzc2xlc3MgSW50ZXItRG9tYWluIFJvdXRpbmddKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DbGFzc2xlc3NfSW50ZXItRG9tYWluX1JvdXRpbmcpIC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OldBRlJlZ2lvbmFsOjpJUFNldFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLWlwc2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbklQU2V0IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6V0FGUmVnaW9uYWw6OklQU2V0XCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuSVBTZXQge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbklQU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbklQU2V0KHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZnJpZW5kbHkgbmFtZSBvciBkZXNjcmlwdGlvbiBvZiB0aGUgYElQU2V0YCAuIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgYW4gYElQU2V0YCBhZnRlciB5b3UgY3JlYXRlIGl0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtaXBzZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwtaXBzZXQtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSVAgYWRkcmVzcyB0eXBlICggYElQVjRgIG9yIGBJUFY2YCApIGFuZCB0aGUgSVAgYWRkcmVzcyByYW5nZSAoaW4gQ0lEUiBub3RhdGlvbikgdGhhdCB3ZWIgcmVxdWVzdHMgb3JpZ2luYXRlIGZyb20uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1pcHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1pcHNldC1pcHNldGRlc2NyaXB0b3JzXG4gICAgICovXG4gICAgcHVibGljIGlwU2V0RGVzY3JpcHRvcnM6IEFycmF5PENmbklQU2V0LklQU2V0RGVzY3JpcHRvclByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpXQUZSZWdpb25hbDo6SVBTZXRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5JUFNldFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5JUFNldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLmlwU2V0RGVzY3JpcHRvcnMgPSBwcm9wcy5pcFNldERlc2NyaXB0b3JzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuSVBTZXQuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIGlwU2V0RGVzY3JpcHRvcnM6IHRoaXMuaXBTZXREZXNjcmlwdG9ycyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5JUFNldFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbklQU2V0IHtcbiAgICAvKipcbiAgICAgKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gICAgICogPlxuICAgICAqID4gKkZvciB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgQVdTIFdBRiogLCB1c2UgdGhlIEFXUyBXQUYgVjIgQVBJIGFuZCBzZWUgdGhlIFtBV1MgV0FGIERldmVsb3BlciBHdWlkZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2FmLWNoYXB0ZXIuaHRtbCkgLiBXaXRoIHRoZSBsYXRlc3QgdmVyc2lvbiwgQVdTIFdBRiBoYXMgYSBzaW5nbGUgc2V0IG9mIGVuZHBvaW50cyBmb3IgcmVnaW9uYWwgYW5kIGdsb2JhbCB1c2UuXG4gICAgICpcbiAgICAgKiBTcGVjaWZpZXMgdGhlIElQIGFkZHJlc3MgdHlwZSAoIGBJUFY0YCBvciBgSVBWNmAgKSBhbmQgdGhlIElQIGFkZHJlc3MgcmFuZ2UgKGluIENJRFIgZm9ybWF0KSB0aGF0IHdlYiByZXF1ZXN0cyBvcmlnaW5hdGUgZnJvbS5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLWlwc2V0LWlwc2V0ZGVzY3JpcHRvci5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUFNldERlc2NyaXB0b3JQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZ5IGBJUFY0YCBvciBgSVBWNmAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLWlwc2V0LWlwc2V0ZGVzY3JpcHRvci5odG1sI2Nmbi13YWZyZWdpb25hbC1pcHNldC1pcHNldGRlc2NyaXB0b3ItdHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogU3BlY2lmeSBhbiBJUHY0IGFkZHJlc3MgYnkgdXNpbmcgQ0lEUiBub3RhdGlvbi4gRm9yIGV4YW1wbGU6XG4gICAgICAgICAqXG4gICAgICAgICAqIC0gVG8gY29uZmlndXJlIEFXUyBXQUYgdG8gYWxsb3csIGJsb2NrLCBvciBjb3VudCByZXF1ZXN0cyB0aGF0IG9yaWdpbmF0ZWQgZnJvbSB0aGUgSVAgYWRkcmVzcyAxOTIuMC4yLjQ0LCBzcGVjaWZ5IGAxOTIuMC4yLjQ0LzMyYCAuXG4gICAgICAgICAqIC0gVG8gY29uZmlndXJlIEFXUyBXQUYgdG8gYWxsb3csIGJsb2NrLCBvciBjb3VudCByZXF1ZXN0cyB0aGF0IG9yaWdpbmF0ZWQgZnJvbSBJUCBhZGRyZXNzZXMgZnJvbSAxOTIuMC4yLjAgdG8gMTkyLjAuMi4yNTUsIHNwZWNpZnkgYDE5Mi4wLjIuMC8yNGAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBDSURSIG5vdGF0aW9uLCBzZWUgdGhlIFdpa2lwZWRpYSBlbnRyeSBbQ2xhc3NsZXNzIEludGVyLURvbWFpbiBSb3V0aW5nXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ2xhc3NsZXNzX0ludGVyLURvbWFpbl9Sb3V0aW5nKSAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFNwZWNpZnkgYW4gSVB2NiBhZGRyZXNzIGJ5IHVzaW5nIENJRFIgbm90YXRpb24uIEZvciBleGFtcGxlOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIFRvIGNvbmZpZ3VyZSBBV1MgV0FGIHRvIGFsbG93LCBibG9jaywgb3IgY291bnQgcmVxdWVzdHMgdGhhdCBvcmlnaW5hdGVkIGZyb20gdGhlIElQIGFkZHJlc3MgMTExMTowMDAwOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMTExLCBzcGVjaWZ5IGAxMTExOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMDAwOjAxMTEvMTI4YCAuXG4gICAgICAgICAqIC0gVG8gY29uZmlndXJlIEFXUyBXQUYgdG8gYWxsb3csIGJsb2NrLCBvciBjb3VudCByZXF1ZXN0cyB0aGF0IG9yaWdpbmF0ZWQgZnJvbSBJUCBhZGRyZXNzZXMgMTExMTowMDAwOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMDAwIHRvIDExMTE6MDAwMDowMDAwOjAwMDA6ZmZmZjpmZmZmOmZmZmY6ZmZmZiwgc3BlY2lmeSBgMTExMTowMDAwOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMDAwLzY0YCAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtaXBzZXQtaXBzZXRkZXNjcmlwdG9yLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLWlwc2V0LWlwc2V0ZGVzY3JpcHRvci12YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgSVBTZXREZXNjcmlwdG9yUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYElQU2V0RGVzY3JpcHRvclByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbklQU2V0X0lQU2V0RGVzY3JpcHRvclByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50eXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0eXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZhbHVlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnZhbHVlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd2YWx1ZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy52YWx1ZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJJUFNldERlc2NyaXB0b3JQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OklQU2V0LklQU2V0RGVzY3JpcHRvcmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgSVBTZXREZXNjcmlwdG9yUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpJUFNldC5JUFNldERlc2NyaXB0b3JgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuSVBTZXRJUFNldERlc2NyaXB0b3JQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuSVBTZXRfSVBTZXREZXNjcmlwdG9yUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHlwZSksXG4gICAgICAgIFZhbHVlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnZhbHVlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuSVBTZXRJUFNldERlc2NyaXB0b3JQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbklQU2V0LklQU2V0RGVzY3JpcHRvclByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbklQU2V0LklQU2V0RGVzY3JpcHRvclByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndHlwZScsICdUeXBlJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5UeXBlKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd2YWx1ZScsICdWYWx1ZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVmFsdWUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5SYXRlQmFzZWRSdWxlYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5SYXRlQmFzZWRSdWxlUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBuYW1lIGZvciB0aGUgbWV0cmljcyBmb3IgYSBgUmF0ZUJhc2VkUnVsZWAgLiBUaGUgbmFtZSBjYW4gY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChBLVosIGEteiwgMC05KSwgd2l0aCBtYXhpbXVtIGxlbmd0aCAxMjggYW5kIG1pbmltdW0gbGVuZ3RoIG9uZS4gSXQgY2FuJ3QgY29udGFpbiB3aGl0ZXNwYWNlIG9yIG1ldHJpYyBuYW1lcyByZXNlcnZlZCBmb3IgQVdTIFdBRiAsIGluY2x1ZGluZyBcIkFsbFwiIGFuZCBcIkRlZmF1bHRfQWN0aW9uLlwiIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgdGhlIG1ldHJpYyBhZnRlciB5b3UgY3JlYXRlIHRoZSBgUmF0ZUJhc2VkUnVsZWAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS5odG1sI2Nmbi13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLW1ldHJpY25hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBtZXRyaWNOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIGZyaWVuZGx5IG5hbWUgb3IgZGVzY3JpcHRpb24gZm9yIGEgYFJhdGVCYXNlZFJ1bGVgIC4gWW91IGNhbid0IGNoYW5nZSB0aGUgbmFtZSBvZiBhIGBSYXRlQmFzZWRSdWxlYCBhZnRlciB5b3UgY3JlYXRlIGl0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS5odG1sI2Nmbi13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZmllbGQgdGhhdCBBV1MgV0FGIHVzZXMgdG8gZGV0ZXJtaW5lIGlmIHJlcXVlc3RzIGFyZSBsaWtlbHkgYXJyaXZpbmcgZnJvbSBzaW5nbGUgc291cmNlIGFuZCB0aHVzIHN1YmplY3QgdG8gcmF0ZSBtb25pdG9yaW5nLiBUaGUgb25seSB2YWxpZCB2YWx1ZSBmb3IgYFJhdGVLZXlgIGlzIGBJUGAgLiBgSVBgIGluZGljYXRlcyB0aGF0IHJlcXVlc3RzIGFycml2aW5nIGZyb20gdGhlIHNhbWUgSVAgYWRkcmVzcyBhcmUgc3ViamVjdCB0byB0aGUgYFJhdGVMaW1pdGAgdGhhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIGBSYXRlQmFzZWRSdWxlYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUtcmF0ZWtleVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJhdGVLZXk6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiByZXF1ZXN0cywgd2hpY2ggaGF2ZSBhbiBpZGVudGljYWwgdmFsdWUgaW4gdGhlIGZpZWxkIHNwZWNpZmllZCBieSB0aGUgYFJhdGVLZXlgICwgYWxsb3dlZCBpbiBhIGZpdmUtbWludXRlIHBlcmlvZC4gSWYgdGhlIG51bWJlciBvZiByZXF1ZXN0cyBleGNlZWRzIHRoZSBgUmF0ZUxpbWl0YCBhbmQgdGhlIG90aGVyIHByZWRpY2F0ZXMgc3BlY2lmaWVkIGluIHRoZSBydWxlIGFyZSBhbHNvIG1ldCwgQVdTIFdBRiB0cmlnZ2VycyB0aGUgYWN0aW9uIHRoYXQgaXMgc3BlY2lmaWVkIGZvciB0aGlzIHJ1bGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUtcmF0ZWxpbWl0XG4gICAgICovXG4gICAgcmVhZG9ubHkgcmF0ZUxpbWl0OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYFByZWRpY2F0ZXNgIG9iamVjdCBjb250YWlucyBvbmUgYFByZWRpY2F0ZWAgZWxlbWVudCBmb3IgZWFjaCBgQnl0ZU1hdGNoU2V0YCAsIGBJUFNldGAgLCBvciBgU3FsSW5qZWN0aW9uTWF0Y2hTZXQ+YCBvYmplY3QgdGhhdCB5b3Ugd2FudCB0byBpbmNsdWRlIGluIGEgYFJhdGVCYXNlZFJ1bGVgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS1tYXRjaHByZWRpY2F0ZXNcbiAgICAgKi9cbiAgICByZWFkb25seSBtYXRjaFByZWRpY2F0ZXM/OiBBcnJheTxDZm5SYXRlQmFzZWRSdWxlLlByZWRpY2F0ZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5SYXRlQmFzZWRSdWxlUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJhdGVCYXNlZFJ1bGVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SYXRlQmFzZWRSdWxlUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdtYXRjaFByZWRpY2F0ZXMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5SYXRlQmFzZWRSdWxlX1ByZWRpY2F0ZVByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5tYXRjaFByZWRpY2F0ZXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY05hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubWV0cmljTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5tZXRyaWNOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmF0ZUtleScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5yYXRlS2V5KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyYXRlS2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJhdGVLZXkpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JhdGVMaW1pdCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5yYXRlTGltaXQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JhdGVMaW1pdCcsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy5yYXRlTGltaXQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuUmF0ZUJhc2VkUnVsZVByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6UmF0ZUJhc2VkUnVsZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmF0ZUJhc2VkUnVsZVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6UmF0ZUJhc2VkUnVsZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SYXRlQmFzZWRSdWxlUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJhdGVCYXNlZFJ1bGVQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTWV0cmljTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5tZXRyaWNOYW1lKSxcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgUmF0ZUtleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yYXRlS2V5KSxcbiAgICAgICAgUmF0ZUxpbWl0OiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJhdGVMaW1pdCksXG4gICAgICAgIE1hdGNoUHJlZGljYXRlczogY2RrLmxpc3RNYXBwZXIoY2ZuUmF0ZUJhc2VkUnVsZVByZWRpY2F0ZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5tYXRjaFByZWRpY2F0ZXMpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5SYXRlQmFzZWRSdWxlUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SYXRlQmFzZWRSdWxlUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblJhdGVCYXNlZFJ1bGVQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ21ldHJpY05hbWUnLCAnTWV0cmljTmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTWV0cmljTmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyYXRlS2V5JywgJ1JhdGVLZXknLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJhdGVLZXkpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JhdGVMaW1pdCcsICdSYXRlTGltaXQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLlJhdGVMaW1pdCkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbWF0Y2hQcmVkaWNhdGVzJywgJ01hdGNoUHJlZGljYXRlcycsIHByb3BlcnRpZXMuTWF0Y2hQcmVkaWNhdGVzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmblJhdGVCYXNlZFJ1bGVQcmVkaWNhdGVQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5NYXRjaFByZWRpY2F0ZXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OldBRlJlZ2lvbmFsOjpSYXRlQmFzZWRSdWxlYFxuICpcbiAqID4gVGhpcyBpcyAqQVdTIFdBRiBDbGFzc2ljKiBkb2N1bWVudGF0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBV1MgV0FGIENsYXNzaWNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NsYXNzaWMtd2FmLWNoYXB0ZXIuaHRtbCkgaW4gdGhlIGRldmVsb3BlciBndWlkZS5cbiAqID5cbiAqID4gKkZvciB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgQVdTIFdBRiogLCB1c2UgdGhlIEFXUyBXQUYgVjIgQVBJIGFuZCBzZWUgdGhlIFtBV1MgV0FGIERldmVsb3BlciBHdWlkZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2FmLWNoYXB0ZXIuaHRtbCkgLiBXaXRoIHRoZSBsYXRlc3QgdmVyc2lvbiwgQVdTIFdBRiBoYXMgYSBzaW5nbGUgc2V0IG9mIGVuZHBvaW50cyBmb3IgcmVnaW9uYWwgYW5kIGdsb2JhbCB1c2UuXG4gKlxuICogQSBgUmF0ZUJhc2VkUnVsZWAgaXMgaWRlbnRpY2FsIHRvIGEgcmVndWxhciBgUnVsZWAgLCB3aXRoIG9uZSBhZGRpdGlvbjogYSBgUmF0ZUJhc2VkUnVsZWAgY291bnRzIHRoZSBudW1iZXIgb2YgcmVxdWVzdHMgdGhhdCBhcnJpdmUgZnJvbSBhIHNwZWNpZmllZCBJUCBhZGRyZXNzIGV2ZXJ5IGZpdmUgbWludXRlcy4gRm9yIGV4YW1wbGUsIGJhc2VkIG9uIHJlY2VudCByZXF1ZXN0cyB0aGF0IHlvdSd2ZSBzZWVuIGZyb20gYW4gYXR0YWNrZXIsIHlvdSBtaWdodCBjcmVhdGUgYSBgUmF0ZUJhc2VkUnVsZWAgdGhhdCBpbmNsdWRlcyB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogLSBUaGUgcmVxdWVzdHMgY29tZSBmcm9tIDE5Mi4wLjIuNDQuXG4gKiAtIFRoZXkgY29udGFpbiB0aGUgdmFsdWUgYEJhZEJvdGAgaW4gdGhlIGBVc2VyLUFnZW50YCBoZWFkZXIuXG4gKlxuICogSW4gdGhlIHJ1bGUsIHlvdSBhbHNvIGRlZmluZSB0aGUgcmF0ZSBsaW1pdCBhcyAxNSwwMDAuXG4gKlxuICogUmVxdWVzdHMgdGhhdCBtZWV0IGJvdGggb2YgdGhlc2UgY29uZGl0aW9ucyBhbmQgZXhjZWVkIDE1LDAwMCByZXF1ZXN0cyBldmVyeSBmaXZlIG1pbnV0ZXMgdHJpZ2dlciB0aGUgcnVsZSdzIGFjdGlvbiAoYmxvY2sgb3IgY291bnQpLCB3aGljaCBpcyBkZWZpbmVkIGluIHRoZSB3ZWIgQUNMLlxuICpcbiAqIE5vdGUgeW91IGNhbiBvbmx5IGNyZWF0ZSByYXRlLWJhc2VkIHJ1bGVzIHVzaW5nIGFuIEFXUyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS4gVG8gYWRkIHRoZSByYXRlLWJhc2VkIHJ1bGVzIGNyZWF0ZWQgdGhyb3VnaCBBV1MgQ2xvdWRGb3JtYXRpb24gdG8gYSB3ZWIgQUNMLCB1c2UgdGhlIEFXUyBXQUYgY29uc29sZSwgQVBJLCBvciBjb21tYW5kIGxpbmUgaW50ZXJmYWNlIChDTEkpLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtVcGRhdGVXZWJBQ0xdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfcmVnaW9uYWxfVXBkYXRlV2ViQUNMLmh0bWwpIC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OldBRlJlZ2lvbmFsOjpSYXRlQmFzZWRSdWxlXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5SYXRlQmFzZWRSdWxlIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6V0FGUmVnaW9uYWw6OlJhdGVCYXNlZFJ1bGVcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5SYXRlQmFzZWRSdWxlIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5SYXRlQmFzZWRSdWxlUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblJhdGVCYXNlZFJ1bGUoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBuYW1lIGZvciB0aGUgbWV0cmljcyBmb3IgYSBgUmF0ZUJhc2VkUnVsZWAgLiBUaGUgbmFtZSBjYW4gY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChBLVosIGEteiwgMC05KSwgd2l0aCBtYXhpbXVtIGxlbmd0aCAxMjggYW5kIG1pbmltdW0gbGVuZ3RoIG9uZS4gSXQgY2FuJ3QgY29udGFpbiB3aGl0ZXNwYWNlIG9yIG1ldHJpYyBuYW1lcyByZXNlcnZlZCBmb3IgQVdTIFdBRiAsIGluY2x1ZGluZyBcIkFsbFwiIGFuZCBcIkRlZmF1bHRfQWN0aW9uLlwiIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgdGhlIG1ldHJpYyBhZnRlciB5b3UgY3JlYXRlIHRoZSBgUmF0ZUJhc2VkUnVsZWAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS5odG1sI2Nmbi13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLW1ldHJpY25hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgbWV0cmljTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBmcmllbmRseSBuYW1lIG9yIGRlc2NyaXB0aW9uIGZvciBhIGBSYXRlQmFzZWRSdWxlYCAuIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgYSBgUmF0ZUJhc2VkUnVsZWAgYWZ0ZXIgeW91IGNyZWF0ZSBpdC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBmaWVsZCB0aGF0IEFXUyBXQUYgdXNlcyB0byBkZXRlcm1pbmUgaWYgcmVxdWVzdHMgYXJlIGxpa2VseSBhcnJpdmluZyBmcm9tIHNpbmdsZSBzb3VyY2UgYW5kIHRodXMgc3ViamVjdCB0byByYXRlIG1vbml0b3JpbmcuIFRoZSBvbmx5IHZhbGlkIHZhbHVlIGZvciBgUmF0ZUtleWAgaXMgYElQYCAuIGBJUGAgaW5kaWNhdGVzIHRoYXQgcmVxdWVzdHMgYXJyaXZpbmcgZnJvbSB0aGUgc2FtZSBJUCBhZGRyZXNzIGFyZSBzdWJqZWN0IHRvIHRoZSBgUmF0ZUxpbWl0YCB0aGF0IGlzIHNwZWNpZmllZCBpbiB0aGUgYFJhdGVCYXNlZFJ1bGVgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS1yYXRla2V5XG4gICAgICovXG4gICAgcHVibGljIHJhdGVLZXk6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiByZXF1ZXN0cywgd2hpY2ggaGF2ZSBhbiBpZGVudGljYWwgdmFsdWUgaW4gdGhlIGZpZWxkIHNwZWNpZmllZCBieSB0aGUgYFJhdGVLZXlgICwgYWxsb3dlZCBpbiBhIGZpdmUtbWludXRlIHBlcmlvZC4gSWYgdGhlIG51bWJlciBvZiByZXF1ZXN0cyBleGNlZWRzIHRoZSBgUmF0ZUxpbWl0YCBhbmQgdGhlIG90aGVyIHByZWRpY2F0ZXMgc3BlY2lmaWVkIGluIHRoZSBydWxlIGFyZSBhbHNvIG1ldCwgQVdTIFdBRiB0cmlnZ2VycyB0aGUgYWN0aW9uIHRoYXQgaXMgc3BlY2lmaWVkIGZvciB0aGlzIHJ1bGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUtcmF0ZWxpbWl0XG4gICAgICovXG4gICAgcHVibGljIHJhdGVMaW1pdDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBQcmVkaWNhdGVzYCBvYmplY3QgY29udGFpbnMgb25lIGBQcmVkaWNhdGVgIGVsZW1lbnQgZm9yIGVhY2ggYEJ5dGVNYXRjaFNldGAgLCBgSVBTZXRgICwgb3IgYFNxbEluamVjdGlvbk1hdGNoU2V0PmAgb2JqZWN0IHRoYXQgeW91IHdhbnQgdG8gaW5jbHVkZSBpbiBhIGBSYXRlQmFzZWRSdWxlYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUtbWF0Y2hwcmVkaWNhdGVzXG4gICAgICovXG4gICAgcHVibGljIG1hdGNoUHJlZGljYXRlczogQXJyYXk8Q2ZuUmF0ZUJhc2VkUnVsZS5QcmVkaWNhdGVQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6V0FGUmVnaW9uYWw6OlJhdGVCYXNlZFJ1bGVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5SYXRlQmFzZWRSdWxlUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmblJhdGVCYXNlZFJ1bGUuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdtZXRyaWNOYW1lJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICduYW1lJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdyYXRlS2V5JywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdyYXRlTGltaXQnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLm1ldHJpY05hbWUgPSBwcm9wcy5tZXRyaWNOYW1lO1xuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLnJhdGVLZXkgPSBwcm9wcy5yYXRlS2V5O1xuICAgICAgICB0aGlzLnJhdGVMaW1pdCA9IHByb3BzLnJhdGVMaW1pdDtcbiAgICAgICAgdGhpcy5tYXRjaFByZWRpY2F0ZXMgPSBwcm9wcy5tYXRjaFByZWRpY2F0ZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5SYXRlQmFzZWRSdWxlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtZXRyaWNOYW1lOiB0aGlzLm1ldHJpY05hbWUsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICByYXRlS2V5OiB0aGlzLnJhdGVLZXksXG4gICAgICAgICAgICByYXRlTGltaXQ6IHRoaXMucmF0ZUxpbWl0LFxuICAgICAgICAgICAgbWF0Y2hQcmVkaWNhdGVzOiB0aGlzLm1hdGNoUHJlZGljYXRlcyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5SYXRlQmFzZWRSdWxlUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmF0ZUJhc2VkUnVsZSB7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSBgQnl0ZU1hdGNoU2V0YCAsIGBJUFNldGAgLCBgU3FsSW5qZWN0aW9uTWF0Y2hTZXRgICwgYFhzc01hdGNoU2V0YCAsIGBSZWdleE1hdGNoU2V0YCAsIGBHZW9NYXRjaFNldGAgLCBhbmQgYFNpemVDb25zdHJhaW50U2V0YCBvYmplY3RzIHRoYXQgeW91IHdhbnQgdG8gYWRkIHRvIGEgYFJ1bGVgIGFuZCwgZm9yIGVhY2ggb2JqZWN0LCBpbmRpY2F0ZXMgd2hldGhlciB5b3Ugd2FudCB0byBuZWdhdGUgdGhlIHNldHRpbmdzLCBmb3IgZXhhbXBsZSwgcmVxdWVzdHMgdGhhdCBkbyBOT1Qgb3JpZ2luYXRlIGZyb20gdGhlIElQIGFkZHJlc3MgMTkyLjAuMi40NC5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXJhdGViYXNlZHJ1bGUtcHJlZGljYXRlLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFByZWRpY2F0ZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIGEgcHJlZGljYXRlIGluIGEgYFJ1bGVgICwgc3VjaCBhcyBgQnl0ZU1hdGNoU2V0SWRgIG9yIGBJUFNldElkYCAuIFRoZSBJRCBpcyByZXR1cm5lZCBieSB0aGUgY29ycmVzcG9uZGluZyBgQ3JlYXRlYCBvciBgTGlzdGAgY29tbWFuZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLXByZWRpY2F0ZS5odG1sI2Nmbi13YWZyZWdpb25hbC1yYXRlYmFzZWRydWxlLXByZWRpY2F0ZS1kYXRhaWRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGRhdGFJZDogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IGBOZWdhdGVkYCB0byBgRmFsc2VgIGlmIHlvdSB3YW50IEFXUyBXQUYgdG8gYWxsb3csIGJsb2NrLCBvciBjb3VudCByZXF1ZXN0cyBiYXNlZCBvbiB0aGUgc2V0dGluZ3MgaW4gdGhlIHNwZWNpZmllZCBgQnl0ZU1hdGNoU2V0YCAsIGBJUFNldGAgLCBgU3FsSW5qZWN0aW9uTWF0Y2hTZXRgICwgYFhzc01hdGNoU2V0YCAsIGBSZWdleE1hdGNoU2V0YCAsIGBHZW9NYXRjaFNldGAgLCBvciBgU2l6ZUNvbnN0cmFpbnRTZXRgIC4gRm9yIGV4YW1wbGUsIGlmIGFuIGBJUFNldGAgaW5jbHVkZXMgdGhlIElQIGFkZHJlc3MgYDE5Mi4wLjIuNDRgICwgQVdTIFdBRiB3aWxsIGFsbG93IG9yIGJsb2NrIHJlcXVlc3RzIGJhc2VkIG9uIHRoYXQgSVAgYWRkcmVzcy5cbiAgICAgICAgICpcbiAgICAgICAgICogU2V0IGBOZWdhdGVkYCB0byBgVHJ1ZWAgaWYgeW91IHdhbnQgQVdTIFdBRiB0byBhbGxvdyBvciBibG9jayBhIHJlcXVlc3QgYmFzZWQgb24gdGhlIG5lZ2F0aW9uIG9mIHRoZSBzZXR0aW5ncyBpbiB0aGUgYEJ5dGVNYXRjaFNldGAgLCBgSVBTZXRgICwgYFNxbEluamVjdGlvbk1hdGNoU2V0YCAsIGBYc3NNYXRjaFNldGAgLCBgUmVnZXhNYXRjaFNldGAgLCBgR2VvTWF0Y2hTZXRgICwgb3IgYFNpemVDb25zdHJhaW50U2V0YCA+LiBGb3IgZXhhbXBsZSwgaWYgYW4gYElQU2V0YCBpbmNsdWRlcyB0aGUgSVAgYWRkcmVzcyBgMTkyLjAuMi40NGAgLCBBV1MgV0FGIHdpbGwgYWxsb3csIGJsb2NrLCBvciBjb3VudCByZXF1ZXN0cyBiYXNlZCBvbiBhbGwgSVAgYWRkcmVzc2VzICpleGNlcHQqIGAxOTIuMC4yLjQ0YCAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS1wcmVkaWNhdGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS1wcmVkaWNhdGUtbmVnYXRlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZDogYm9vbGVhbiB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIHByZWRpY2F0ZSBpbiBhIGBSdWxlYCAsIHN1Y2ggYXMgYEJ5dGVNYXRjaGAgb3IgYElQU2V0YCAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS1wcmVkaWNhdGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtcmF0ZWJhc2VkcnVsZS1wcmVkaWNhdGUtdHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBQcmVkaWNhdGVQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUHJlZGljYXRlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmF0ZUJhc2VkUnVsZV9QcmVkaWNhdGVQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RhdGFJZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kYXRhSWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RhdGFJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kYXRhSWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25lZ2F0ZWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmVnYXRlZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmVnYXRlZCcsIGNkay52YWxpZGF0ZUJvb2xlYW4pKHByb3BlcnRpZXMubmVnYXRlZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50eXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0eXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnR5cGUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUHJlZGljYXRlUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpSYXRlQmFzZWRSdWxlLlByZWRpY2F0ZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUHJlZGljYXRlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpSYXRlQmFzZWRSdWxlLlByZWRpY2F0ZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SYXRlQmFzZWRSdWxlUHJlZGljYXRlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJhdGVCYXNlZFJ1bGVfUHJlZGljYXRlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIERhdGFJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kYXRhSWQpLFxuICAgICAgICBOZWdhdGVkOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uZWdhdGVkKSxcbiAgICAgICAgVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50eXBlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmF0ZUJhc2VkUnVsZVByZWRpY2F0ZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmF0ZUJhc2VkUnVsZS5QcmVkaWNhdGVQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SYXRlQmFzZWRSdWxlLlByZWRpY2F0ZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGF0YUlkJywgJ0RhdGFJZCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGF0YUlkKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduZWdhdGVkJywgJ05lZ2F0ZWQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEJvb2xlYW4ocHJvcGVydGllcy5OZWdhdGVkKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0eXBlJywgJ1R5cGUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlR5cGUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5SZWdleFBhdHRlcm5TZXRgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJlZ2V4cGF0dGVybnNldC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUmVnZXhQYXR0ZXJuU2V0UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBmcmllbmRseSBuYW1lIG9yIGRlc2NyaXB0aW9uIG9mIHRoZSBgUmVnZXhQYXR0ZXJuU2V0YCAuIFlvdSBjYW4ndCBjaGFuZ2UgYE5hbWVgIGFmdGVyIHlvdSBjcmVhdGUgYSBgUmVnZXhQYXR0ZXJuU2V0YCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1yZWdleHBhdHRlcm5zZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwtcmVnZXhwYXR0ZXJuc2V0LW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiAocmVnZXgpIHBhdHRlcm5zIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yLCBzdWNoIGFzIGBCW2FAXWRCW28wXXRgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJlZ2V4cGF0dGVybnNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1yZWdleHBhdHRlcm5zZXQtcmVnZXhwYXR0ZXJuc3RyaW5nc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlZ2V4UGF0dGVyblN0cmluZ3M6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblJlZ2V4UGF0dGVyblNldFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5SZWdleFBhdHRlcm5TZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZWdleFBhdHRlcm5TZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZWdleFBhdHRlcm5TdHJpbmdzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJlZ2V4UGF0dGVyblN0cmluZ3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlZ2V4UGF0dGVyblN0cmluZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLnJlZ2V4UGF0dGVyblN0cmluZ3MpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuUmVnZXhQYXR0ZXJuU2V0UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpSZWdleFBhdHRlcm5TZXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJlZ2V4UGF0dGVyblNldFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6UmVnZXhQYXR0ZXJuU2V0YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblJlZ2V4UGF0dGVyblNldFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZWdleFBhdHRlcm5TZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgUmVnZXhQYXR0ZXJuU3RyaW5nczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMucmVnZXhQYXR0ZXJuU3RyaW5ncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlZ2V4UGF0dGVyblNldFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVnZXhQYXR0ZXJuU2V0UHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblJlZ2V4UGF0dGVyblNldFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZWdleFBhdHRlcm5TdHJpbmdzJywgJ1JlZ2V4UGF0dGVyblN0cmluZ3MnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuUmVnZXhQYXR0ZXJuU3RyaW5ncykpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6V0FGUmVnaW9uYWw6OlJlZ2V4UGF0dGVyblNldGBcbiAqXG4gKiBUaGUgYFJlZ2V4UGF0dGVyblNldGAgc3BlY2lmaWVzIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gKHJlZ2V4KSBwYXR0ZXJuIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2ggZm9yLCBzdWNoIGFzIGBCW2FAXWRCW28wXXRgIC4gWW91IGNhbiB0aGVuIGNvbmZpZ3VyZSBBV1MgV0FGIHRvIHJlamVjdCB0aG9zZSByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgeW91IGNhbiBvbmx5IGNyZWF0ZSByZWdleCBwYXR0ZXJuIHNldHMgdXNpbmcgYSBBV1MgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuIFRvIGFkZCB0aGUgcmVnZXggcGF0dGVybiBzZXRzIGNyZWF0ZWQgdGhyb3VnaCBBV1MgQ2xvdWRGb3JtYXRpb24gdG8gYSBSZWdleE1hdGNoU2V0LCB1c2UgdGhlIEFXUyBXQUYgY29uc29sZSwgQVBJLCBvciBjb21tYW5kIGxpbmUgaW50ZXJmYWNlIChDTEkpLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtVcGRhdGVSZWdleE1hdGNoU2V0XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX3JlZ2lvbmFsX1VwZGF0ZVJlZ2V4TWF0Y2hTZXQuaHRtbCkgLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6V0FGUmVnaW9uYWw6OlJlZ2V4UGF0dGVyblNldFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJlZ2V4cGF0dGVybnNldC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5SZWdleFBhdHRlcm5TZXQgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpXQUZSZWdpb25hbDo6UmVnZXhQYXR0ZXJuU2V0XCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuUmVnZXhQYXR0ZXJuU2V0IHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5SZWdleFBhdHRlcm5TZXRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuUmVnZXhQYXR0ZXJuU2V0KHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZnJpZW5kbHkgbmFtZSBvciBkZXNjcmlwdGlvbiBvZiB0aGUgYFJlZ2V4UGF0dGVyblNldGAgLiBZb3UgY2FuJ3QgY2hhbmdlIGBOYW1lYCBhZnRlciB5b3UgY3JlYXRlIGEgYFJlZ2V4UGF0dGVyblNldGAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtcmVnZXhwYXR0ZXJuc2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJlZ2V4cGF0dGVybnNldC1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNwZWNpZmllcyB0aGUgcmVndWxhciBleHByZXNzaW9uIChyZWdleCkgcGF0dGVybnMgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIHNlYXJjaCBmb3IsIHN1Y2ggYXMgYEJbYUBdZEJbbzBddGAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtcmVnZXhwYXR0ZXJuc2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJlZ2V4cGF0dGVybnNldC1yZWdleHBhdHRlcm5zdHJpbmdzXG4gICAgICovXG4gICAgcHVibGljIHJlZ2V4UGF0dGVyblN0cmluZ3M6IHN0cmluZ1tdO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OldBRlJlZ2lvbmFsOjpSZWdleFBhdHRlcm5TZXRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5SZWdleFBhdHRlcm5TZXRQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUmVnZXhQYXR0ZXJuU2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbmFtZScsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAncmVnZXhQYXR0ZXJuU3RyaW5ncycsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMucmVnZXhQYXR0ZXJuU3RyaW5ncyA9IHByb3BzLnJlZ2V4UGF0dGVyblN0cmluZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5SZWdleFBhdHRlcm5TZXQuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIHJlZ2V4UGF0dGVyblN0cmluZ3M6IHRoaXMucmVnZXhQYXR0ZXJuU3RyaW5ncyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5SZWdleFBhdHRlcm5TZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5SdWxlYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1ydWxlLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5SdWxlUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBuYW1lIGZvciB0aGUgbWV0cmljcyBmb3IgdGhpcyBgUnVsZWAgLiBUaGUgbmFtZSBjYW4gY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChBLVosIGEteiwgMC05KSwgd2l0aCBtYXhpbXVtIGxlbmd0aCAxMjggYW5kIG1pbmltdW0gbGVuZ3RoIG9uZS4gSXQgY2FuJ3QgY29udGFpbiB3aGl0ZXNwYWNlIG9yIG1ldHJpYyBuYW1lcyByZXNlcnZlZCBmb3IgQVdTIFdBRiwgaW5jbHVkaW5nIFwiQWxsXCIgYW5kIFwiRGVmYXVsdF9BY3Rpb24uXCIgWW91IGNhbid0IGNoYW5nZSBgTWV0cmljTmFtZWAgYWZ0ZXIgeW91IGNyZWF0ZSB0aGUgYFJ1bGVgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJ1bGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtcnVsZS1tZXRyaWNuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbWV0cmljTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZyaWVuZGx5IG5hbWUgb3IgZGVzY3JpcHRpb24gZm9yIHRoZSBgUnVsZWAgLiBZb3UgY2FuJ3QgY2hhbmdlIHRoZSBuYW1lIG9mIGEgYFJ1bGVgIGFmdGVyIHlvdSBjcmVhdGUgaXQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1ydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJ1bGUtbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBgUHJlZGljYXRlc2Agb2JqZWN0IGNvbnRhaW5zIG9uZSBgUHJlZGljYXRlYCBlbGVtZW50IGZvciBlYWNoIGBCeXRlTWF0Y2hTZXRgICwgYElQU2V0YCAsIG9yIGBTcWxJbmplY3Rpb25NYXRjaFNldGAgb2JqZWN0IHRoYXQgeW91IHdhbnQgdG8gaW5jbHVkZSBpbiBhIGBSdWxlYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1ydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHByZWRpY2F0ZXM/OiBBcnJheTxDZm5SdWxlLlByZWRpY2F0ZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5SdWxlUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJ1bGVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SdWxlUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdtZXRyaWNOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm1ldHJpY05hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY05hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubWV0cmljTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ByZWRpY2F0ZXMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5SdWxlX1ByZWRpY2F0ZVByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5wcmVkaWNhdGVzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblJ1bGVQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OlJ1bGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJ1bGVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OlJ1bGVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUnVsZVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SdWxlUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIE1ldHJpY05hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubWV0cmljTmFtZSksXG4gICAgICAgIE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubmFtZSksXG4gICAgICAgIFByZWRpY2F0ZXM6IGNkay5saXN0TWFwcGVyKGNmblJ1bGVQcmVkaWNhdGVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMucHJlZGljYXRlcyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJ1bGVQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJ1bGVQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUnVsZVByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbWV0cmljTmFtZScsICdNZXRyaWNOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5NZXRyaWNOYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ByZWRpY2F0ZXMnLCAnUHJlZGljYXRlcycsIHByb3BlcnRpZXMuUHJlZGljYXRlcyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5SdWxlUHJlZGljYXRlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuUHJlZGljYXRlcykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6V0FGUmVnaW9uYWw6OlJ1bGVgXG4gKlxuICogPiBUaGlzIGlzICpBV1MgV0FGIENsYXNzaWMqIGRvY3VtZW50YXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FXUyBXQUYgQ2xhc3NpY10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY2xhc3NpYy13YWYtY2hhcHRlci5odG1sKSBpbiB0aGUgZGV2ZWxvcGVyIGd1aWRlLlxuICogPlxuICogPiAqRm9yIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBV1MgV0FGKiAsIHVzZSB0aGUgQVdTIFdBRiBWMiBBUEkgYW5kIHNlZSB0aGUgW0FXUyBXQUYgRGV2ZWxvcGVyIEd1aWRlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS93YWYtY2hhcHRlci5odG1sKSAuIFdpdGggdGhlIGxhdGVzdCB2ZXJzaW9uLCBBV1MgV0FGIGhhcyBhIHNpbmdsZSBzZXQgb2YgZW5kcG9pbnRzIGZvciByZWdpb25hbCBhbmQgZ2xvYmFsIHVzZS5cbiAqXG4gKiBBIGNvbWJpbmF0aW9uIG9mIGBCeXRlTWF0Y2hTZXRgICwgYElQU2V0YCAsIGFuZC9vciBgU3FsSW5qZWN0aW9uTWF0Y2hTZXRgIG9iamVjdHMgdGhhdCBpZGVudGlmeSB0aGUgd2ViIHJlcXVlc3RzIHRoYXQgeW91IHdhbnQgdG8gYWxsb3csIGJsb2NrLCBvciBjb3VudC4gRm9yIGV4YW1wbGUsIHlvdSBtaWdodCBjcmVhdGUgYSBgUnVsZWAgdGhhdCBpbmNsdWRlcyB0aGUgZm9sbG93aW5nIHByZWRpY2F0ZXM6XG4gKlxuICogLSBBbiBgSVBTZXRgIHRoYXQgY2F1c2VzIEFXUyBXQUYgdG8gc2VhcmNoIGZvciB3ZWIgcmVxdWVzdHMgdGhhdCBvcmlnaW5hdGUgZnJvbSB0aGUgSVAgYWRkcmVzcyBgMTkyLjAuMi40NGBcbiAqIC0gQSBgQnl0ZU1hdGNoU2V0YCB0aGF0IGNhdXNlcyBBV1MgV0FGIHRvIHNlYXJjaCBmb3Igd2ViIHJlcXVlc3RzIGZvciB3aGljaCB0aGUgdmFsdWUgb2YgdGhlIGBVc2VyLUFnZW50YCBoZWFkZXIgaXMgYEJhZEJvdGAgLlxuICpcbiAqIFRvIG1hdGNoIHRoZSBzZXR0aW5ncyBpbiB0aGlzIGBSdWxlYCAsIGEgcmVxdWVzdCBtdXN0IG9yaWdpbmF0ZSBmcm9tIGAxOTIuMC4yLjQ0YCBBTkQgaW5jbHVkZSBhIGBVc2VyLUFnZW50YCBoZWFkZXIgZm9yIHdoaWNoIHRoZSB2YWx1ZSBpcyBgQmFkQm90YCAuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpXQUZSZWdpb25hbDo6UnVsZVxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJ1bGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUnVsZSBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OldBRlJlZ2lvbmFsOjpSdWxlXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuUnVsZSB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuUnVsZVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5SdWxlKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgbmFtZSBmb3IgdGhlIG1ldHJpY3MgZm9yIHRoaXMgYFJ1bGVgIC4gVGhlIG5hbWUgY2FuIGNvbnRhaW4gb25seSBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyAoQS1aLCBhLXosIDAtOSksIHdpdGggbWF4aW11bSBsZW5ndGggMTI4IGFuZCBtaW5pbXVtIGxlbmd0aCBvbmUuIEl0IGNhbid0IGNvbnRhaW4gd2hpdGVzcGFjZSBvciBtZXRyaWMgbmFtZXMgcmVzZXJ2ZWQgZm9yIEFXUyBXQUYsIGluY2x1ZGluZyBcIkFsbFwiIGFuZCBcIkRlZmF1bHRfQWN0aW9uLlwiIFlvdSBjYW4ndCBjaGFuZ2UgYE1ldHJpY05hbWVgIGFmdGVyIHlvdSBjcmVhdGUgdGhlIGBSdWxlYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1ydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJ1bGUtbWV0cmljbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBtZXRyaWNOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZnJpZW5kbHkgbmFtZSBvciBkZXNjcmlwdGlvbiBmb3IgdGhlIGBSdWxlYCAuIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgYSBgUnVsZWAgYWZ0ZXIgeW91IGNyZWF0ZSBpdC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXJ1bGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtcnVsZS1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBgUHJlZGljYXRlc2Agb2JqZWN0IGNvbnRhaW5zIG9uZSBgUHJlZGljYXRlYCBlbGVtZW50IGZvciBlYWNoIGBCeXRlTWF0Y2hTZXRgICwgYElQU2V0YCAsIG9yIGBTcWxJbmplY3Rpb25NYXRjaFNldGAgb2JqZWN0IHRoYXQgeW91IHdhbnQgdG8gaW5jbHVkZSBpbiBhIGBSdWxlYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1ydWxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlc1xuICAgICAqL1xuICAgIHB1YmxpYyBwcmVkaWNhdGVzOiBBcnJheTxDZm5SdWxlLlByZWRpY2F0ZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpXQUZSZWdpb25hbDo6UnVsZWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblJ1bGVQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUnVsZS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ21ldHJpY05hbWUnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLm1ldHJpY05hbWUgPSBwcm9wcy5tZXRyaWNOYW1lO1xuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMgPSBwcm9wcy5wcmVkaWNhdGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuUnVsZS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbWV0cmljTmFtZTogdGhpcy5tZXRyaWNOYW1lLFxuICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgICAgcHJlZGljYXRlczogdGhpcy5wcmVkaWNhdGVzLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblJ1bGVQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5SdWxlIHtcbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIGBCeXRlTWF0Y2hTZXRgICwgYElQU2V0YCAsIGBTcWxJbmplY3Rpb25NYXRjaFNldGAgLCBgWHNzTWF0Y2hTZXRgICwgYFJlZ2V4TWF0Y2hTZXRgICwgYEdlb01hdGNoU2V0YCAsIGFuZCBgU2l6ZUNvbnN0cmFpbnRTZXRgIG9iamVjdHMgdGhhdCB5b3Ugd2FudCB0byBhZGQgdG8gYSBgUnVsZWAgYW5kLCBmb3IgZWFjaCBvYmplY3QsIGluZGljYXRlcyB3aGV0aGVyIHlvdSB3YW50IHRvIG5lZ2F0ZSB0aGUgc2V0dGluZ3MsIGZvciBleGFtcGxlLCByZXF1ZXN0cyB0aGF0IGRvIE5PVCBvcmlnaW5hdGUgZnJvbSB0aGUgSVAgYWRkcmVzcyAxOTIuMC4yLjQ0LlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtcnVsZS1wcmVkaWNhdGUuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJlZGljYXRlUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgYSBwcmVkaWNhdGUgaW4gYSBgUnVsZWAgLCBzdWNoIGFzIGBCeXRlTWF0Y2hTZXRJZGAgb3IgYElQU2V0SWRgIC4gVGhlIElEIGlzIHJldHVybmVkIGJ5IHRoZSBjb3JyZXNwb25kaW5nIGBDcmVhdGVgIG9yIGBMaXN0YCBjb21tYW5kLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlLWRhdGFpZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGF0YUlkOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgYE5lZ2F0ZWRgIHRvIGBGYWxzZWAgaWYgeW91IHdhbnQgQVdTIFdBRiB0byBhbGxvdywgYmxvY2ssIG9yIGNvdW50IHJlcXVlc3RzIGJhc2VkIG9uIHRoZSBzZXR0aW5ncyBpbiB0aGUgc3BlY2lmaWVkIGBCeXRlTWF0Y2hTZXRgICwgYElQU2V0YCAsIGBTcWxJbmplY3Rpb25NYXRjaFNldGAgLCBgWHNzTWF0Y2hTZXRgICwgYFJlZ2V4TWF0Y2hTZXRgICwgYEdlb01hdGNoU2V0YCAsIG9yIGBTaXplQ29uc3RyYWludFNldGAgLiBGb3IgZXhhbXBsZSwgaWYgYW4gYElQU2V0YCBpbmNsdWRlcyB0aGUgSVAgYWRkcmVzcyBgMTkyLjAuMi40NGAgLCBBV1MgV0FGIHdpbGwgYWxsb3cgb3IgYmxvY2sgcmVxdWVzdHMgYmFzZWQgb24gdGhhdCBJUCBhZGRyZXNzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTZXQgYE5lZ2F0ZWRgIHRvIGBUcnVlYCBpZiB5b3Ugd2FudCBBV1MgV0FGIHRvIGFsbG93IG9yIGJsb2NrIGEgcmVxdWVzdCBiYXNlZCBvbiB0aGUgbmVnYXRpb24gb2YgdGhlIHNldHRpbmdzIGluIHRoZSBgQnl0ZU1hdGNoU2V0YCAsIGBJUFNldGAgLCBgU3FsSW5qZWN0aW9uTWF0Y2hTZXRgICwgYFhzc01hdGNoU2V0YCAsIGBSZWdleE1hdGNoU2V0YCAsIGBHZW9NYXRjaFNldGAgLCBvciBgU2l6ZUNvbnN0cmFpbnRTZXRgIC4gRm9yIGV4YW1wbGUsIGlmIGFuIGBJUFNldGAgaW5jbHVkZXMgdGhlIElQIGFkZHJlc3MgYDE5Mi4wLjIuNDRgICwgQVdTIFdBRiB3aWxsIGFsbG93LCBibG9jaywgb3IgY291bnQgcmVxdWVzdHMgYmFzZWQgb24gYWxsIElQIGFkZHJlc3NlcyAqZXhjZXB0KiBgMTkyLjAuMi40NGAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlLW5lZ2F0ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW4gfCBjZGsuSVJlc29sdmFibGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdHlwZSBvZiBwcmVkaWNhdGUgaW4gYSBgUnVsZWAgLCBzdWNoIGFzIGBCeXRlTWF0Y2hgIG9yIGBJUFNldGAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXJ1bGUtcHJlZGljYXRlLXR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUHJlZGljYXRlUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByZWRpY2F0ZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJ1bGVfUHJlZGljYXRlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZGF0YUlkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZGF0YUlkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduZWdhdGVkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5lZ2F0ZWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25lZ2F0ZWQnLCBjZGsudmFsaWRhdGVCb29sZWFuKShwcm9wZXJ0aWVzLm5lZ2F0ZWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlByZWRpY2F0ZVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6UnVsZS5QcmVkaWNhdGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByZWRpY2F0ZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6UnVsZS5QcmVkaWNhdGVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUnVsZVByZWRpY2F0ZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SdWxlX1ByZWRpY2F0ZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBEYXRhSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGF0YUlkKSxcbiAgICAgICAgTmVnYXRlZDogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubmVnYXRlZCksXG4gICAgICAgIFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHlwZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJ1bGVQcmVkaWNhdGVQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJ1bGUuUHJlZGljYXRlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUnVsZS5QcmVkaWNhdGVQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RhdGFJZCcsICdEYXRhSWQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRhdGFJZCkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmVnYXRlZCcsICdOZWdhdGVkJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRCb29sZWFuKHByb3BlcnRpZXMuTmVnYXRlZCkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndHlwZScsICdUeXBlJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5UeXBlKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuU2l6ZUNvbnN0cmFpbnRTZXRgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5TaXplQ29uc3RyYWludFNldFByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lLCBpZiBhbnksIG9mIHRoZSBgU2l6ZUNvbnN0cmFpbnRTZXRgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0LW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2l6ZSBjb25zdHJhaW50IGFuZCB0aGUgcGFydCBvZiB0aGUgd2ViIHJlcXVlc3QgdG8gY2hlY2suXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC1zaXplY29uc3RyYWludHNcbiAgICAgKi9cbiAgICByZWFkb25seSBzaXplQ29uc3RyYWludHM/OiBBcnJheTxDZm5TaXplQ29uc3RyYWludFNldC5TaXplQ29uc3RyYWludFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5TaXplQ29uc3RyYWludFNldFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5TaXplQ29uc3RyYWludFNldFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblNpemVDb25zdHJhaW50U2V0UHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc2l6ZUNvbnN0cmFpbnRzJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuU2l6ZUNvbnN0cmFpbnRTZXRfU2l6ZUNvbnN0cmFpbnRQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuc2l6ZUNvbnN0cmFpbnRzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblNpemVDb25zdHJhaW50U2V0UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpTaXplQ29uc3RyYWludFNldGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuU2l6ZUNvbnN0cmFpbnRTZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OlNpemVDb25zdHJhaW50U2V0YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblNpemVDb25zdHJhaW50U2V0UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblNpemVDb25zdHJhaW50U2V0UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubmFtZSksXG4gICAgICAgIFNpemVDb25zdHJhaW50czogY2RrLmxpc3RNYXBwZXIoY2ZuU2l6ZUNvbnN0cmFpbnRTZXRTaXplQ29uc3RyYWludFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5zaXplQ29uc3RyYWludHMpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5TaXplQ29uc3RyYWludFNldFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuU2l6ZUNvbnN0cmFpbnRTZXRQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU2l6ZUNvbnN0cmFpbnRTZXRQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ25hbWUnLCAnTmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnc2l6ZUNvbnN0cmFpbnRzJywgJ1NpemVDb25zdHJhaW50cycsIHByb3BlcnRpZXMuU2l6ZUNvbnN0cmFpbnRzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmblNpemVDb25zdHJhaW50U2V0U2l6ZUNvbnN0cmFpbnRQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5TaXplQ29uc3RyYWludHMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OldBRlJlZ2lvbmFsOjpTaXplQ29uc3RyYWludFNldGBcbiAqXG4gKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gKiA+XG4gKiA+ICpGb3IgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIEFXUyBXQUYqICwgdXNlIHRoZSBBV1MgV0FGIFYyIEFQSSBhbmQgc2VlIHRoZSBbQVdTIFdBRiBEZXZlbG9wZXIgR3VpZGVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3dhZi1jaGFwdGVyLmh0bWwpIC4gV2l0aCB0aGUgbGF0ZXN0IHZlcnNpb24sIEFXUyBXQUYgaGFzIGEgc2luZ2xlIHNldCBvZiBlbmRwb2ludHMgZm9yIHJlZ2lvbmFsIGFuZCBnbG9iYWwgdXNlLlxuICpcbiAqIEEgY29tcGxleCB0eXBlIHRoYXQgY29udGFpbnMgYFNpemVDb25zdHJhaW50YCBvYmplY3RzLCB3aGljaCBzcGVjaWZ5IHRoZSBwYXJ0cyBvZiB3ZWIgcmVxdWVzdHMgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIGluc3BlY3QgdGhlIHNpemUgb2YuIElmIGEgYFNpemVDb25zdHJhaW50U2V0YCBjb250YWlucyBtb3JlIHRoYW4gb25lIGBTaXplQ29uc3RyYWludGAgb2JqZWN0LCBhIHJlcXVlc3Qgb25seSBuZWVkcyB0byBtYXRjaCBvbmUgY29uc3RyYWludCB0byBiZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpXQUZSZWdpb25hbDo6U2l6ZUNvbnN0cmFpbnRTZXRcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5TaXplQ29uc3RyYWludFNldCBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OldBRlJlZ2lvbmFsOjpTaXplQ29uc3RyYWludFNldFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmblNpemVDb25zdHJhaW50U2V0IHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5TaXplQ29uc3RyYWludFNldFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5TaXplQ29uc3RyYWludFNldChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSwgaWYgYW55LCBvZiB0aGUgYFNpemVDb25zdHJhaW50U2V0YCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBzaXplIGNvbnN0cmFpbnQgYW5kIHRoZSBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdCB0byBjaGVjay5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0LXNpemVjb25zdHJhaW50c1xuICAgICAqL1xuICAgIHB1YmxpYyBzaXplQ29uc3RyYWludHM6IEFycmF5PENmblNpemVDb25zdHJhaW50U2V0LlNpemVDb25zdHJhaW50UHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OldBRlJlZ2lvbmFsOjpTaXplQ29uc3RyYWludFNldGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblNpemVDb25zdHJhaW50U2V0UHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmblNpemVDb25zdHJhaW50U2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbmFtZScsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMuc2l6ZUNvbnN0cmFpbnRzID0gcHJvcHMuc2l6ZUNvbnN0cmFpbnRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuU2l6ZUNvbnN0cmFpbnRTZXQuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIHNpemVDb25zdHJhaW50czogdGhpcy5zaXplQ29uc3RyYWludHMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuU2l6ZUNvbnN0cmFpbnRTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5TaXplQ29uc3RyYWludFNldCB7XG4gICAgLyoqXG4gICAgICogVGhlIHBhcnQgb2YgYSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCwgc3VjaCBhcyBhIHNwZWNpZmljIGhlYWRlciBvciBhIHF1ZXJ5IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0LWZpZWxkdG9tYXRjaC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBGaWVsZFRvTWF0Y2hQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVuIHRoZSB2YWx1ZSBvZiBgVHlwZWAgaXMgYEhFQURFUmAgLCBlbnRlciB0aGUgbmFtZSBvZiB0aGUgaGVhZGVyIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGZvciBleGFtcGxlLCBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIC4gVGhlIG5hbWUgb2YgdGhlIGhlYWRlciBpcyBub3QgY2FzZSBzZW5zaXRpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdoZW4gdGhlIHZhbHVlIG9mIGBUeXBlYCBpcyBgU0lOR0xFX1FVRVJZX0FSR2AgLCBlbnRlciB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGZvciBleGFtcGxlLCBgVXNlck5hbWVgIG9yIGBTYWxlc1JlZ2lvbmAgLiBUaGUgcGFyYW1ldGVyIG5hbWUgaXMgbm90IGNhc2Ugc2Vuc2l0aXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgdmFsdWUgb2YgYFR5cGVgIGlzIGFueSBvdGhlciB2YWx1ZSwgb21pdCBgRGF0YWAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0LWZpZWxkdG9tYXRjaC5odG1sI2Nmbi13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC1maWVsZHRvbWF0Y2gtZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGF0YT86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoIGZvciBhIHNwZWNpZmllZCBzdHJpbmcuIFBhcnRzIG9mIGEgcmVxdWVzdCB0aGF0IHlvdSBjYW4gc2VhcmNoIGluY2x1ZGUgdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBgSEVBREVSYCA6IEEgc3BlY2lmaWVkIHJlcXVlc3QgaGVhZGVyLCBmb3IgZXhhbXBsZSwgdGhlIHZhbHVlIG9mIHRoZSBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIGhlYWRlci4gSWYgeW91IGNob29zZSBgSEVBREVSYCBmb3IgdGhlIHR5cGUsIHNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIGhlYWRlciBpbiBgRGF0YWAgLlxuICAgICAgICAgKiAtIGBNRVRIT0RgIDogVGhlIEhUVFAgbWV0aG9kLCB3aGljaCBpbmRpY2F0ZXMgdGhlIHR5cGUgb2Ygb3BlcmF0aW9uIHRoYXQgdGhlIHJlcXVlc3QgaXMgYXNraW5nIHRoZSBvcmlnaW4gdG8gcGVyZm9ybS5cbiAgICAgICAgICogLSBgUVVFUllfU1RSSU5HYCA6IEEgcXVlcnkgc3RyaW5nLCB3aGljaCBpcyB0aGUgcGFydCBvZiBhIFVSTCB0aGF0IGFwcGVhcnMgYWZ0ZXIgYSBgP2AgY2hhcmFjdGVyLCBpZiBhbnkuXG4gICAgICAgICAqIC0gYFVSSWAgOiBUaGUgcGFydCBvZiBhIHdlYiByZXF1ZXN0IHRoYXQgaWRlbnRpZmllcyBhIHJlc291cmNlLCBmb3IgZXhhbXBsZSwgYC9pbWFnZXMvZGFpbHktYWQuanBnYCAuXG4gICAgICAgICAqIC0gYEJPRFlgIDogVGhlIHBhcnQgb2YgYSByZXF1ZXN0IHRoYXQgY29udGFpbnMgYW55IGFkZGl0aW9uYWwgZGF0YSB0aGF0IHlvdSB3YW50IHRvIHNlbmQgdG8geW91ciB3ZWIgc2VydmVyIGFzIHRoZSBIVFRQIHJlcXVlc3QgYm9keSwgc3VjaCBhcyBkYXRhIGZyb20gYSBmb3JtLiBUaGUgcmVxdWVzdCBib2R5IGltbWVkaWF0ZWx5IGZvbGxvd3MgdGhlIHJlcXVlc3QgaGVhZGVycy4gTm90ZSB0aGF0IG9ubHkgdGhlIGZpcnN0IGA4MTkyYCBieXRlcyBvZiB0aGUgcmVxdWVzdCBib2R5IGFyZSBmb3J3YXJkZWQgdG8gQVdTIFdBRiBmb3IgaW5zcGVjdGlvbi4gVG8gYWxsb3cgb3IgYmxvY2sgcmVxdWVzdHMgYmFzZWQgb24gdGhlIGxlbmd0aCBvZiB0aGUgYm9keSwgeW91IGNhbiBjcmVhdGUgYSBzaXplIGNvbnN0cmFpbnQgc2V0LlxuICAgICAgICAgKiAtIGBTSU5HTEVfUVVFUllfQVJHYCA6IFRoZSBwYXJhbWV0ZXIgaW4gdGhlIHF1ZXJ5IHN0cmluZyB0aGF0IHlvdSB3aWxsIGluc3BlY3QsIHN1Y2ggYXMgKlVzZXJOYW1lKiBvciAqU2FsZXNSZWdpb24qIC4gVGhlIG1heGltdW0gbGVuZ3RoIGZvciBgU0lOR0xFX1FVRVJZX0FSR2AgaXMgMzAgY2hhcmFjdGVycy5cbiAgICAgICAgICogLSBgQUxMX1FVRVJZX0FSR1NgIDogU2ltaWxhciB0byBgU0lOR0xFX1FVRVJZX0FSR2AgLCBidXQgcmF0aGVyIHRoYW4gaW5zcGVjdGluZyBhIHNpbmdsZSBwYXJhbWV0ZXIsIEFXUyBXQUYgd2lsbCBpbnNwZWN0IGFsbCBwYXJhbWV0ZXJzIHdpdGhpbiB0aGUgcXVlcnkgZm9yIHRoZSB2YWx1ZSBvciByZWdleCBwYXR0ZXJuIHRoYXQgeW91IHNwZWNpZnkgaW4gYFRhcmdldFN0cmluZ2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXNpemVjb25zdHJhaW50c2V0LWZpZWxkdG9tYXRjaC5odG1sI2Nmbi13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC1maWVsZHRvbWF0Y2gtdHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBGaWVsZFRvTWF0Y2hQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRmllbGRUb01hdGNoUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU2l6ZUNvbnN0cmFpbnRTZXRfRmllbGRUb01hdGNoUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRhdGEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkZpZWxkVG9NYXRjaFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6U2l6ZUNvbnN0cmFpbnRTZXQuRmllbGRUb01hdGNoYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWVsZFRvTWF0Y2hQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OlNpemVDb25zdHJhaW50U2V0LkZpZWxkVG9NYXRjaGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TaXplQ29uc3RyYWludFNldEZpZWxkVG9NYXRjaFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5TaXplQ29uc3RyYWludFNldF9GaWVsZFRvTWF0Y2hQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGF0YTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kYXRhKSxcbiAgICAgICAgVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50eXBlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuU2l6ZUNvbnN0cmFpbnRTZXRGaWVsZFRvTWF0Y2hQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblNpemVDb25zdHJhaW50U2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblNpemVDb25zdHJhaW50U2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGF0YScsICdEYXRhJywgcHJvcGVydGllcy5EYXRhICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRhdGEpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3R5cGUnLCAnVHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVHlwZSkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblNpemVDb25zdHJhaW50U2V0IHtcbiAgICAvKipcbiAgICAgKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gICAgICogPlxuICAgICAqID4gKkZvciB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgQVdTIFdBRiogLCB1c2UgdGhlIEFXUyBXQUYgVjIgQVBJIGFuZCBzZWUgdGhlIFtBV1MgV0FGIERldmVsb3BlciBHdWlkZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2FmLWNoYXB0ZXIuaHRtbCkgLiBXaXRoIHRoZSBsYXRlc3QgdmVyc2lvbiwgQVdTIFdBRiBoYXMgYSBzaW5nbGUgc2V0IG9mIGVuZHBvaW50cyBmb3IgcmVnaW9uYWwgYW5kIGdsb2JhbCB1c2UuXG4gICAgICpcbiAgICAgKiBTcGVjaWZpZXMgYSBjb25zdHJhaW50IG9uIHRoZSBzaXplIG9mIGEgcGFydCBvZiB0aGUgd2ViIHJlcXVlc3QuIEFXUyBXQUYgdXNlcyB0aGUgYFNpemVgICwgYENvbXBhcmlzb25PcGVyYXRvcmAgLCBhbmQgYEZpZWxkVG9NYXRjaGAgdG8gYnVpbGQgYW4gZXhwcmVzc2lvbiBpbiB0aGUgZm9ybSBvZiBcIiBgU2l6ZWAgYENvbXBhcmlzb25PcGVyYXRvcmAgc2l6ZSBpbiBieXRlcyBvZiBgRmllbGRUb01hdGNoYCBcIi4gSWYgdGhhdCBleHByZXNzaW9uIGlzIHRydWUsIHRoZSBgU2l6ZUNvbnN0cmFpbnRgIGlzIGNvbnNpZGVyZWQgdG8gbWF0Y2guXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC1zaXplY29uc3RyYWludC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBTaXplQ29uc3RyYWludFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIGNvbXBhcmlzb24geW91IHdhbnQgQVdTIFdBRiB0byBwZXJmb3JtLiBBV1MgV0FGIHVzZXMgdGhpcyBpbiBjb21iaW5hdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBgU2l6ZWAgYW5kIGBGaWVsZFRvTWF0Y2hgIHRvIGJ1aWxkIGFuIGV4cHJlc3Npb24gaW4gdGhlIGZvcm0gb2YgXCIgYFNpemVgIGBDb21wYXJpc29uT3BlcmF0b3JgIHNpemUgaW4gYnl0ZXMgb2YgYEZpZWxkVG9NYXRjaGAgXCIuIElmIHRoYXQgZXhwcmVzc2lvbiBpcyB0cnVlLCB0aGUgYFNpemVDb25zdHJhaW50YCBpcyBjb25zaWRlcmVkIHRvIG1hdGNoLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqRVEqIDogVXNlZCB0byB0ZXN0IGlmIHRoZSBgU2l6ZWAgaXMgZXF1YWwgdG8gdGhlIHNpemUgb2YgdGhlIGBGaWVsZFRvTWF0Y2hgXG4gICAgICAgICAqXG4gICAgICAgICAqICpORSogOiBVc2VkIHRvIHRlc3QgaWYgdGhlIGBTaXplYCBpcyBub3QgZXF1YWwgdG8gdGhlIHNpemUgb2YgdGhlIGBGaWVsZFRvTWF0Y2hgXG4gICAgICAgICAqXG4gICAgICAgICAqICpMRSogOiBVc2VkIHRvIHRlc3QgaWYgdGhlIGBTaXplYCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNpemUgb2YgdGhlIGBGaWVsZFRvTWF0Y2hgXG4gICAgICAgICAqXG4gICAgICAgICAqICpMVCogOiBVc2VkIHRvIHRlc3QgaWYgdGhlIGBTaXplYCBpcyBzdHJpY3RseSBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGBGaWVsZFRvTWF0Y2hgXG4gICAgICAgICAqXG4gICAgICAgICAqICpHRSogOiBVc2VkIHRvIHRlc3QgaWYgdGhlIGBTaXplYCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNpemUgb2YgdGhlIGBGaWVsZFRvTWF0Y2hgXG4gICAgICAgICAqXG4gICAgICAgICAqICpHVCogOiBVc2VkIHRvIHRlc3QgaWYgdGhlIGBTaXplYCBpcyBzdHJpY3RseSBncmVhdGVyIHRoYW4gdGhlIHNpemUgb2YgdGhlIGBGaWVsZFRvTWF0Y2hgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtc2l6ZWNvbnN0cmFpbnRzZXQtc2l6ZWNvbnN0cmFpbnQuaHRtbCNjZm4td2FmcmVnaW9uYWwtc2l6ZWNvbnN0cmFpbnRzZXQtc2l6ZWNvbnN0cmFpbnQtY29tcGFyaXNvbm9wZXJhdG9yXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBjb21wYXJpc29uT3BlcmF0b3I6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYXJ0IG9mIGEgd2ViIHJlcXVlc3QgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIGluc3BlY3QsIHN1Y2ggYXMgYSBzcGVjaWZpYyBoZWFkZXIgb3IgYSBxdWVyeSBzdHJpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtc2l6ZWNvbnN0cmFpbnRzZXQtc2l6ZWNvbnN0cmFpbnQuaHRtbCNjZm4td2FmcmVnaW9uYWwtc2l6ZWNvbnN0cmFpbnRzZXQtc2l6ZWNvbnN0cmFpbnQtZmllbGR0b21hdGNoXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBmaWVsZFRvTWF0Y2g6IENmblNpemVDb25zdHJhaW50U2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNpemUgaW4gYnl0ZXMgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIGNvbXBhcmUgYWdhaW5zdCB0aGUgc2l6ZSBvZiB0aGUgc3BlY2lmaWVkIGBGaWVsZFRvTWF0Y2hgIC4gQVdTIFdBRiB1c2VzIHRoaXMgaW4gY29tYmluYXRpb24gd2l0aCBgQ29tcGFyaXNvbk9wZXJhdG9yYCBhbmQgYEZpZWxkVG9NYXRjaGAgdG8gYnVpbGQgYW4gZXhwcmVzc2lvbiBpbiB0aGUgZm9ybSBvZiBcIiBgU2l6ZWAgYENvbXBhcmlzb25PcGVyYXRvcmAgc2l6ZSBpbiBieXRlcyBvZiBgRmllbGRUb01hdGNoYCBcIi4gSWYgdGhhdCBleHByZXNzaW9uIGlzIHRydWUsIHRoZSBgU2l6ZUNvbnN0cmFpbnRgIGlzIGNvbnNpZGVyZWQgdG8gbWF0Y2guXG4gICAgICAgICAqXG4gICAgICAgICAqIFZhbGlkIHZhbHVlcyBmb3Igc2l6ZSBhcmUgMCAtIDIxNDc0ODM2NDgwIGJ5dGVzICgwIC0gMjAgR0IpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB5b3Ugc3BlY2lmeSBgVVJJYCBmb3IgdGhlIHZhbHVlIG9mIGBUeXBlYCAsIHRoZSAvIGluIHRoZSBVUkkgcGF0aCB0aGF0IHlvdSBzcGVjaWZ5IGNvdW50cyBhcyBvbmUgY2hhcmFjdGVyLiBGb3IgZXhhbXBsZSwgdGhlIFVSSSBgL2xvZ28uanBnYCBpcyBuaW5lIGNoYXJhY3RlcnMgbG9uZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC1zaXplY29uc3RyYWludC5odG1sI2Nmbi13YWZyZWdpb25hbC1zaXplY29uc3RyYWludHNldC1zaXplY29uc3RyYWludC1zaXplXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBzaXplOiBudW1iZXI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZXh0IHRyYW5zZm9ybWF0aW9ucyBlbGltaW5hdGUgc29tZSBvZiB0aGUgdW51c3VhbCBmb3JtYXR0aW5nIHRoYXQgYXR0YWNrZXJzIHVzZSBpbiB3ZWIgcmVxdWVzdHMgaW4gYW4gZWZmb3J0IHRvIGJ5cGFzcyBBV1MgV0FGIC4gSWYgeW91IHNwZWNpZnkgYSB0cmFuc2Zvcm1hdGlvbiwgQVdTIFdBRiBwZXJmb3JtcyB0aGUgdHJhbnNmb3JtYXRpb24gb24gYEZpZWxkVG9NYXRjaGAgYmVmb3JlIGluc3BlY3RpbmcgYSByZXF1ZXN0IGZvciBhIG1hdGNoLlxuICAgICAgICAgKlxuICAgICAgICAgKiBZb3UgY2FuIG9ubHkgc3BlY2lmeSBhIHNpbmdsZSB0eXBlIG9mIFRleHRUcmFuc2Zvcm1hdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogTm90ZSB0aGF0IGlmIHlvdSBjaG9vc2UgYEJPRFlgIGZvciB0aGUgdmFsdWUgb2YgYFR5cGVgICwgeW91IG11c3QgY2hvb3NlIGBOT05FYCBmb3IgYFRleHRUcmFuc2Zvcm1hdGlvbmAgYmVjYXVzZSB0aGUgQVBJIEdhdGV3YXkgQVBJIG9yIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXIgZm9yd2FyZCBvbmx5IHRoZSBmaXJzdCA4MTkyIGJ5dGVzIGZvciBpbnNwZWN0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqTk9ORSpcbiAgICAgICAgICpcbiAgICAgICAgICogU3BlY2lmeSBgTk9ORWAgaWYgeW91IGRvbid0IHdhbnQgdG8gcGVyZm9ybSBhbnkgdGV4dCB0cmFuc2Zvcm1hdGlvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqICpDTURfTElORSpcbiAgICAgICAgICpcbiAgICAgICAgICogV2hlbiB5b3UncmUgY29uY2VybmVkIHRoYXQgYXR0YWNrZXJzIGFyZSBpbmplY3RpbmcgYW4gb3BlcmF0aW5nIHN5c3RlbSBjb21tYW5kIGxpbmUgY29tbWFuZCBhbmQgdXNpbmcgdW51c3VhbCBmb3JtYXR0aW5nIHRvIGRpc2d1aXNlIHNvbWUgb3IgYWxsIG9mIHRoZSBjb21tYW5kLCB1c2UgdGhpcyBvcHRpb24gdG8gcGVyZm9ybSB0aGUgZm9sbG93aW5nIHRyYW5zZm9ybWF0aW9uczpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBEZWxldGUgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzOiBcXCBcIiAnIF5cbiAgICAgICAgICogLSBEZWxldGUgc3BhY2VzIGJlZm9yZSB0aGUgZm9sbG93aW5nIGNoYXJhY3RlcnM6IC8gKFxuICAgICAgICAgKiAtIFJlcGxhY2UgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzIHdpdGggYSBzcGFjZTogLCA7XG4gICAgICAgICAqIC0gUmVwbGFjZSBtdWx0aXBsZSBzcGFjZXMgd2l0aCBvbmUgc3BhY2VcbiAgICAgICAgICogLSBDb252ZXJ0IHVwcGVyY2FzZSBsZXR0ZXJzIChBLVopIHRvIGxvd2VyY2FzZSAoYS16KVxuICAgICAgICAgKlxuICAgICAgICAgKiAqQ09NUFJFU1NfV0hJVEVfU1BBQ0UqXG4gICAgICAgICAqXG4gICAgICAgICAqIFVzZSB0aGlzIG9wdGlvbiB0byByZXBsYWNlIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVycyB3aXRoIGEgc3BhY2UgY2hhcmFjdGVyIChkZWNpbWFsIDMyKTpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBcXGYsIGZvcm1mZWVkLCBkZWNpbWFsIDEyXG4gICAgICAgICAqIC0gXFx0LCB0YWIsIGRlY2ltYWwgOVxuICAgICAgICAgKiAtIFxcbiwgbmV3bGluZSwgZGVjaW1hbCAxMFxuICAgICAgICAgKiAtIFxcciwgY2FycmlhZ2UgcmV0dXJuLCBkZWNpbWFsIDEzXG4gICAgICAgICAqIC0gXFx2LCB2ZXJ0aWNhbCB0YWIsIGRlY2ltYWwgMTFcbiAgICAgICAgICogLSBub24tYnJlYWtpbmcgc3BhY2UsIGRlY2ltYWwgMTYwXG4gICAgICAgICAqXG4gICAgICAgICAqIGBDT01QUkVTU19XSElURV9TUEFDRWAgYWxzbyByZXBsYWNlcyBtdWx0aXBsZSBzcGFjZXMgd2l0aCBvbmUgc3BhY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqICpIVE1MX0VOVElUWV9ERUNPREUqXG4gICAgICAgICAqXG4gICAgICAgICAqIFVzZSB0aGlzIG9wdGlvbiB0byByZXBsYWNlIEhUTUwtZW5jb2RlZCBjaGFyYWN0ZXJzIHdpdGggdW5lbmNvZGVkIGNoYXJhY3RlcnMuIGBIVE1MX0VOVElUWV9ERUNPREVgIHBlcmZvcm1zIHRoZSBmb2xsb3dpbmcgb3BlcmF0aW9uczpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBSZXBsYWNlcyBgKGFtcGVyc2FuZClxdW90O2Agd2l0aCBgXCJgXG4gICAgICAgICAqIC0gUmVwbGFjZXMgYChhbXBlcnNhbmQpbmJzcDtgIHdpdGggYSBub24tYnJlYWtpbmcgc3BhY2UsIGRlY2ltYWwgMTYwXG4gICAgICAgICAqIC0gUmVwbGFjZXMgYChhbXBlcnNhbmQpbHQ7YCB3aXRoIGEgXCJsZXNzIHRoYW5cIiBzeW1ib2xcbiAgICAgICAgICogLSBSZXBsYWNlcyBgKGFtcGVyc2FuZClndDtgIHdpdGggYD5gXG4gICAgICAgICAqIC0gUmVwbGFjZXMgY2hhcmFjdGVycyB0aGF0IGFyZSByZXByZXNlbnRlZCBpbiBoZXhhZGVjaW1hbCBmb3JtYXQsIGAoYW1wZXJzYW5kKSN4aGhoaDtgICwgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzXG4gICAgICAgICAqIC0gUmVwbGFjZXMgY2hhcmFjdGVycyB0aGF0IGFyZSByZXByZXNlbnRlZCBpbiBkZWNpbWFsIGZvcm1hdCwgYChhbXBlcnNhbmQpI25ubm47YCAsIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVyc1xuICAgICAgICAgKlxuICAgICAgICAgKiAqTE9XRVJDQVNFKlxuICAgICAgICAgKlxuICAgICAgICAgKiBVc2UgdGhpcyBvcHRpb24gdG8gY29udmVydCB1cHBlcmNhc2UgbGV0dGVycyAoQS1aKSB0byBsb3dlcmNhc2UgKGEteikuXG4gICAgICAgICAqXG4gICAgICAgICAqICpVUkxfREVDT0RFKlxuICAgICAgICAgKlxuICAgICAgICAgKiBVc2UgdGhpcyBvcHRpb24gdG8gZGVjb2RlIGEgVVJMLWVuY29kZWQgdmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtc2l6ZWNvbnN0cmFpbnRzZXQtc2l6ZWNvbnN0cmFpbnQuaHRtbCNjZm4td2FmcmVnaW9uYWwtc2l6ZWNvbnN0cmFpbnRzZXQtc2l6ZWNvbnN0cmFpbnQtdGV4dHRyYW5zZm9ybWF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB0ZXh0VHJhbnNmb3JtYXRpb246IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgU2l6ZUNvbnN0cmFpbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU2l6ZUNvbnN0cmFpbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TaXplQ29uc3RyYWludFNldF9TaXplQ29uc3RyYWludFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29tcGFyaXNvbk9wZXJhdG9yJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmNvbXBhcmlzb25PcGVyYXRvcikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29tcGFyaXNvbk9wZXJhdG9yJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNvbXBhcmlzb25PcGVyYXRvcikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmllbGRUb01hdGNoJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmZpZWxkVG9NYXRjaCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmllbGRUb01hdGNoJywgQ2ZuU2l6ZUNvbnN0cmFpbnRTZXRfRmllbGRUb01hdGNoUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuZmllbGRUb01hdGNoKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzaXplJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnNpemUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NpemUnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMuc2l6ZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGV4dFRyYW5zZm9ybWF0aW9uJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnRleHRUcmFuc2Zvcm1hdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGV4dFRyYW5zZm9ybWF0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnRleHRUcmFuc2Zvcm1hdGlvbikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJTaXplQ29uc3RyYWludFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6U2l6ZUNvbnN0cmFpbnRTZXQuU2l6ZUNvbnN0cmFpbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFNpemVDb25zdHJhaW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpTaXplQ29uc3RyYWludFNldC5TaXplQ29uc3RyYWludGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TaXplQ29uc3RyYWludFNldFNpemVDb25zdHJhaW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblNpemVDb25zdHJhaW50U2V0X1NpemVDb25zdHJhaW50UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIENvbXBhcmlzb25PcGVyYXRvcjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jb21wYXJpc29uT3BlcmF0b3IpLFxuICAgICAgICBGaWVsZFRvTWF0Y2g6IGNmblNpemVDb25zdHJhaW50U2V0RmllbGRUb01hdGNoUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmllbGRUb01hdGNoKSxcbiAgICAgICAgU2l6ZTogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zaXplKSxcbiAgICAgICAgVGV4dFRyYW5zZm9ybWF0aW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRleHRUcmFuc2Zvcm1hdGlvbiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblNpemVDb25zdHJhaW50U2V0U2l6ZUNvbnN0cmFpbnRQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblNpemVDb25zdHJhaW50U2V0LlNpemVDb25zdHJhaW50UHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU2l6ZUNvbnN0cmFpbnRTZXQuU2l6ZUNvbnN0cmFpbnRQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2NvbXBhcmlzb25PcGVyYXRvcicsICdDb21wYXJpc29uT3BlcmF0b3InLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkNvbXBhcmlzb25PcGVyYXRvcikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZmllbGRUb01hdGNoJywgJ0ZpZWxkVG9NYXRjaCcsIENmblNpemVDb25zdHJhaW50U2V0RmllbGRUb01hdGNoUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5GaWVsZFRvTWF0Y2gpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3NpemUnLCAnU2l6ZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHByb3BlcnRpZXMuU2l6ZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGV4dFRyYW5zZm9ybWF0aW9uJywgJ1RleHRUcmFuc2Zvcm1hdGlvbicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVGV4dFRyYW5zZm9ybWF0aW9uKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5TcWxJbmplY3Rpb25NYXRjaFNldFByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lLCBpZiBhbnksIG9mIHRoZSBgU3FsSW5qZWN0aW9uTWF0Y2hTZXRgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIHBhcnRzIG9mIHdlYiByZXF1ZXN0cyB0aGF0IHlvdSB3YW50IHRvIGluc3BlY3QgZm9yIHNuaXBwZXRzIG9mIG1hbGljaW91cyBTUUwgY29kZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LXNxbGluamVjdGlvbm1hdGNodHVwbGVzXG4gICAgICovXG4gICAgcmVhZG9ubHkgc3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXM/OiBBcnJheTxDZm5TcWxJbmplY3Rpb25NYXRjaFNldC5TcWxJbmplY3Rpb25NYXRjaFR1cGxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblNxbEluamVjdGlvbk1hdGNoU2V0UHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblNxbEluamVjdGlvbk1hdGNoU2V0UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzcWxJbmplY3Rpb25NYXRjaFR1cGxlcycsIGNkay5saXN0VmFsaWRhdG9yKENmblNxbEluamVjdGlvbk1hdGNoU2V0X1NxbEluamVjdGlvbk1hdGNoVHVwbGVQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuc3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OlNxbEluamVjdGlvbk1hdGNoU2V0YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5TcWxJbmplY3Rpb25NYXRjaFNldFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6U3FsSW5qZWN0aW9uTWF0Y2hTZXRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXM6IGNkay5saXN0TWFwcGVyKGNmblNxbEluamVjdGlvbk1hdGNoU2V0U3FsSW5qZWN0aW9uTWF0Y2hUdXBsZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5zcWxJbmplY3Rpb25NYXRjaFR1cGxlcyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblNxbEluamVjdGlvbk1hdGNoU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5TcWxJbmplY3Rpb25NYXRjaFNldFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5TcWxJbmplY3Rpb25NYXRjaFNldFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdzcWxJbmplY3Rpb25NYXRjaFR1cGxlcycsICdTcWxJbmplY3Rpb25NYXRjaFR1cGxlcycsIHByb3BlcnRpZXMuU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRTcWxJbmplY3Rpb25NYXRjaFR1cGxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OldBRlJlZ2lvbmFsOjpTcWxJbmplY3Rpb25NYXRjaFNldGBcbiAqXG4gKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gKiA+XG4gKiA+ICpGb3IgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIEFXUyBXQUYqICwgdXNlIHRoZSBBV1MgV0FGIFYyIEFQSSBhbmQgc2VlIHRoZSBbQVdTIFdBRiBEZXZlbG9wZXIgR3VpZGVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3dhZi1jaGFwdGVyLmh0bWwpIC4gV2l0aCB0aGUgbGF0ZXN0IHZlcnNpb24sIEFXUyBXQUYgaGFzIGEgc2luZ2xlIHNldCBvZiBlbmRwb2ludHMgZm9yIHJlZ2lvbmFsIGFuZCBnbG9iYWwgdXNlLlxuICpcbiAqIEEgY29tcGxleCB0eXBlIHRoYXQgY29udGFpbnMgYFNxbEluamVjdGlvbk1hdGNoVHVwbGVgIG9iamVjdHMsIHdoaWNoIHNwZWNpZnkgdGhlIHBhcnRzIG9mIHdlYiByZXF1ZXN0cyB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCBmb3Igc25pcHBldHMgb2YgbWFsaWNpb3VzIFNRTCBjb2RlIGFuZCwgaWYgeW91IHdhbnQgQVdTIFdBRiB0byBpbnNwZWN0IGEgaGVhZGVyLCB0aGUgbmFtZSBvZiB0aGUgaGVhZGVyLiBJZiBhIGBTcWxJbmplY3Rpb25NYXRjaFNldGAgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBgU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZWAgb2JqZWN0LCBhIHJlcXVlc3QgbmVlZHMgdG8gaW5jbHVkZSBzbmlwcGV0cyBvZiBTUUwgY29kZSBpbiBvbmx5IG9uZSBvZiB0aGUgc3BlY2lmaWVkIHBhcnRzIG9mIHRoZSByZXF1ZXN0IHRvIGJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OldBRlJlZ2lvbmFsOjpTcWxJbmplY3Rpb25NYXRjaFNldFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblNxbEluamVjdGlvbk1hdGNoU2V0IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6V0FGUmVnaW9uYWw6OlNxbEluamVjdGlvbk1hdGNoU2V0XCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXQge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblNxbEluamVjdGlvbk1hdGNoU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblNxbEluamVjdGlvbk1hdGNoU2V0KHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lLCBpZiBhbnksIG9mIHRoZSBgU3FsSW5qZWN0aW9uTWF0Y2hTZXRgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0Lmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSBwYXJ0cyBvZiB3ZWIgcmVxdWVzdHMgdGhhdCB5b3Ugd2FudCB0byBpbnNwZWN0IGZvciBzbmlwcGV0cyBvZiBtYWxpY2lvdXMgU1FMIGNvZGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC1zcWxpbmplY3Rpb25tYXRjaHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC1zcWxpbmplY3Rpb25tYXRjaHNldC1zcWxpbmplY3Rpb25tYXRjaHR1cGxlc1xuICAgICAqL1xuICAgIHB1YmxpYyBzcWxJbmplY3Rpb25NYXRjaFR1cGxlczogQXJyYXk8Q2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXQuU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpXQUZSZWdpb25hbDo6U3FsSW5qZWN0aW9uTWF0Y2hTZXRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5TcWxJbmplY3Rpb25NYXRjaFNldFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5TcWxJbmplY3Rpb25NYXRjaFNldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLnNxbEluamVjdGlvbk1hdGNoVHVwbGVzID0gcHJvcHMuc3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5TcWxJbmplY3Rpb25NYXRjaFNldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgICAgc3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXM6IHRoaXMuc3FsSW5qZWN0aW9uTWF0Y2hUdXBsZXMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5TcWxJbmplY3Rpb25NYXRjaFNldCB7XG4gICAgLyoqXG4gICAgICogVGhlIHBhcnQgb2YgYSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCwgc3VjaCBhcyBhIHNwZWNpZmljIGhlYWRlciBvciBhIHF1ZXJ5IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LWZpZWxkdG9tYXRjaC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBGaWVsZFRvTWF0Y2hQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVuIHRoZSB2YWx1ZSBvZiBgVHlwZWAgaXMgYEhFQURFUmAgLCBlbnRlciB0aGUgbmFtZSBvZiB0aGUgaGVhZGVyIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGZvciBleGFtcGxlLCBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIC4gVGhlIG5hbWUgb2YgdGhlIGhlYWRlciBpcyBub3QgY2FzZSBzZW5zaXRpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdoZW4gdGhlIHZhbHVlIG9mIGBUeXBlYCBpcyBgU0lOR0xFX1FVRVJZX0FSR2AgLCBlbnRlciB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGZvciBleGFtcGxlLCBgVXNlck5hbWVgIG9yIGBTYWxlc1JlZ2lvbmAgLiBUaGUgcGFyYW1ldGVyIG5hbWUgaXMgbm90IGNhc2Ugc2Vuc2l0aXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgdmFsdWUgb2YgYFR5cGVgIGlzIGFueSBvdGhlciB2YWx1ZSwgb21pdCBgRGF0YWAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LWZpZWxkdG9tYXRjaC5odG1sI2Nmbi13YWZyZWdpb25hbC1zcWxpbmplY3Rpb25tYXRjaHNldC1maWVsZHRvbWF0Y2gtZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGF0YT86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoIGZvciBhIHNwZWNpZmllZCBzdHJpbmcuIFBhcnRzIG9mIGEgcmVxdWVzdCB0aGF0IHlvdSBjYW4gc2VhcmNoIGluY2x1ZGUgdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBgSEVBREVSYCA6IEEgc3BlY2lmaWVkIHJlcXVlc3QgaGVhZGVyLCBmb3IgZXhhbXBsZSwgdGhlIHZhbHVlIG9mIHRoZSBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIGhlYWRlci4gSWYgeW91IGNob29zZSBgSEVBREVSYCBmb3IgdGhlIHR5cGUsIHNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIGhlYWRlciBpbiBgRGF0YWAgLlxuICAgICAgICAgKiAtIGBNRVRIT0RgIDogVGhlIEhUVFAgbWV0aG9kLCB3aGljaCBpbmRpY2F0ZXMgdGhlIHR5cGUgb2Ygb3BlcmF0aW9uIHRoYXQgdGhlIHJlcXVlc3QgaXMgYXNraW5nIHRoZSBvcmlnaW4gdG8gcGVyZm9ybS5cbiAgICAgICAgICogLSBgUVVFUllfU1RSSU5HYCA6IEEgcXVlcnkgc3RyaW5nLCB3aGljaCBpcyB0aGUgcGFydCBvZiBhIFVSTCB0aGF0IGFwcGVhcnMgYWZ0ZXIgYSBgP2AgY2hhcmFjdGVyLCBpZiBhbnkuXG4gICAgICAgICAqIC0gYFVSSWAgOiBUaGUgcGFydCBvZiBhIHdlYiByZXF1ZXN0IHRoYXQgaWRlbnRpZmllcyBhIHJlc291cmNlLCBmb3IgZXhhbXBsZSwgYC9pbWFnZXMvZGFpbHktYWQuanBnYCAuXG4gICAgICAgICAqIC0gYEJPRFlgIDogVGhlIHBhcnQgb2YgYSByZXF1ZXN0IHRoYXQgY29udGFpbnMgYW55IGFkZGl0aW9uYWwgZGF0YSB0aGF0IHlvdSB3YW50IHRvIHNlbmQgdG8geW91ciB3ZWIgc2VydmVyIGFzIHRoZSBIVFRQIHJlcXVlc3QgYm9keSwgc3VjaCBhcyBkYXRhIGZyb20gYSBmb3JtLiBUaGUgcmVxdWVzdCBib2R5IGltbWVkaWF0ZWx5IGZvbGxvd3MgdGhlIHJlcXVlc3QgaGVhZGVycy4gTm90ZSB0aGF0IG9ubHkgdGhlIGZpcnN0IGA4MTkyYCBieXRlcyBvZiB0aGUgcmVxdWVzdCBib2R5IGFyZSBmb3J3YXJkZWQgdG8gQVdTIFdBRiBmb3IgaW5zcGVjdGlvbi4gVG8gYWxsb3cgb3IgYmxvY2sgcmVxdWVzdHMgYmFzZWQgb24gdGhlIGxlbmd0aCBvZiB0aGUgYm9keSwgeW91IGNhbiBjcmVhdGUgYSBzaXplIGNvbnN0cmFpbnQgc2V0LlxuICAgICAgICAgKiAtIGBTSU5HTEVfUVVFUllfQVJHYCA6IFRoZSBwYXJhbWV0ZXIgaW4gdGhlIHF1ZXJ5IHN0cmluZyB0aGF0IHlvdSB3aWxsIGluc3BlY3QsIHN1Y2ggYXMgKlVzZXJOYW1lKiBvciAqU2FsZXNSZWdpb24qIC4gVGhlIG1heGltdW0gbGVuZ3RoIGZvciBgU0lOR0xFX1FVRVJZX0FSR2AgaXMgMzAgY2hhcmFjdGVycy5cbiAgICAgICAgICogLSBgQUxMX1FVRVJZX0FSR1NgIDogU2ltaWxhciB0byBgU0lOR0xFX1FVRVJZX0FSR2AgLCBidXQgcmF0aGVyIHRoYW4gaW5zcGVjdGluZyBhIHNpbmdsZSBwYXJhbWV0ZXIsIEFXUyBXQUYgd2lsbCBpbnNwZWN0IGFsbCBwYXJhbWV0ZXJzIHdpdGhpbiB0aGUgcXVlcnkgZm9yIHRoZSB2YWx1ZSBvciByZWdleCBwYXR0ZXJuIHRoYXQgeW91IHNwZWNpZnkgaW4gYFRhcmdldFN0cmluZ2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LWZpZWxkdG9tYXRjaC5odG1sI2Nmbi13YWZyZWdpb25hbC1zcWxpbmplY3Rpb25tYXRjaHNldC1maWVsZHRvbWF0Y2gtdHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBGaWVsZFRvTWF0Y2hQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRmllbGRUb01hdGNoUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRfRmllbGRUb01hdGNoUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRhdGEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkZpZWxkVG9NYXRjaFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6U3FsSW5qZWN0aW9uTWF0Y2hTZXQuRmllbGRUb01hdGNoYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWVsZFRvTWF0Y2hQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OlNxbEluamVjdGlvbk1hdGNoU2V0LkZpZWxkVG9NYXRjaGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TcWxJbmplY3Rpb25NYXRjaFNldEZpZWxkVG9NYXRjaFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5TcWxJbmplY3Rpb25NYXRjaFNldF9GaWVsZFRvTWF0Y2hQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGF0YTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kYXRhKSxcbiAgICAgICAgVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50eXBlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRGaWVsZFRvTWF0Y2hQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblNxbEluamVjdGlvbk1hdGNoU2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblNxbEluamVjdGlvbk1hdGNoU2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGF0YScsICdEYXRhJywgcHJvcGVydGllcy5EYXRhICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRhdGEpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3R5cGUnLCAnVHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVHlwZSkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblNxbEluamVjdGlvbk1hdGNoU2V0IHtcbiAgICAvKipcbiAgICAgKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gICAgICogPlxuICAgICAqID4gKkZvciB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgQVdTIFdBRiogLCB1c2UgdGhlIEFXUyBXQUYgVjIgQVBJIGFuZCBzZWUgdGhlIFtBV1MgV0FGIERldmVsb3BlciBHdWlkZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2FmLWNoYXB0ZXIuaHRtbCkgLiBXaXRoIHRoZSBsYXRlc3QgdmVyc2lvbiwgQVdTIFdBRiBoYXMgYSBzaW5nbGUgc2V0IG9mIGVuZHBvaW50cyBmb3IgcmVnaW9uYWwgYW5kIGdsb2JhbCB1c2UuXG4gICAgICpcbiAgICAgKiBTcGVjaWZpZXMgdGhlIHBhcnQgb2YgYSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCBmb3Igc25pcHBldHMgb2YgbWFsaWNpb3VzIFNRTCBjb2RlIGFuZCwgaWYgeW91IHdhbnQgQVdTIFdBRiB0byBpbnNwZWN0IGEgaGVhZGVyLCB0aGUgbmFtZSBvZiB0aGUgaGVhZGVyLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtc3FsaW5qZWN0aW9ubWF0Y2hzZXQtc3FsaW5qZWN0aW9ubWF0Y2h0dXBsZS5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBTcWxJbmplY3Rpb25NYXRjaFR1cGxlUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHBhcnQgb2YgYSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCwgc3VjaCBhcyBhIHNwZWNpZmljIGhlYWRlciBvciBhIHF1ZXJ5IHN0cmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC1zcWxpbmplY3Rpb25tYXRjaHNldC1zcWxpbmplY3Rpb25tYXRjaHR1cGxlLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LXNxbGluamVjdGlvbm1hdGNodHVwbGUtZmllbGR0b21hdGNoXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBmaWVsZFRvTWF0Y2g6IENmblNxbEluamVjdGlvbk1hdGNoU2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGV4dCB0cmFuc2Zvcm1hdGlvbnMgZWxpbWluYXRlIHNvbWUgb2YgdGhlIHVudXN1YWwgZm9ybWF0dGluZyB0aGF0IGF0dGFja2VycyB1c2UgaW4gd2ViIHJlcXVlc3RzIGluIGFuIGVmZm9ydCB0byBieXBhc3MgQVdTIFdBRiAuIElmIHlvdSBzcGVjaWZ5IGEgdHJhbnNmb3JtYXRpb24sIEFXUyBXQUYgcGVyZm9ybXMgdGhlIHRyYW5zZm9ybWF0aW9uIG9uIGBGaWVsZFRvTWF0Y2hgIGJlZm9yZSBpbnNwZWN0aW5nIGl0IGZvciBhIG1hdGNoLlxuICAgICAgICAgKlxuICAgICAgICAgKiBZb3UgY2FuIG9ubHkgc3BlY2lmeSBhIHNpbmdsZSB0eXBlIG9mIFRleHRUcmFuc2Zvcm1hdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogKkNNRF9MSU5FKlxuICAgICAgICAgKlxuICAgICAgICAgKiBXaGVuIHlvdSdyZSBjb25jZXJuZWQgdGhhdCBhdHRhY2tlcnMgYXJlIGluamVjdGluZyBhbiBvcGVyYXRpbmcgc3lzdGVtIGNvbW1hbmQgbGluZSBjb21tYW5kIGFuZCB1c2luZyB1bnVzdWFsIGZvcm1hdHRpbmcgdG8gZGlzZ3Vpc2Ugc29tZSBvciBhbGwgb2YgdGhlIGNvbW1hbmQsIHVzZSB0aGlzIG9wdGlvbiB0byBwZXJmb3JtIHRoZSBmb2xsb3dpbmcgdHJhbnNmb3JtYXRpb25zOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIERlbGV0ZSB0aGUgZm9sbG93aW5nIGNoYXJhY3RlcnM6IFxcIFwiICcgXlxuICAgICAgICAgKiAtIERlbGV0ZSBzcGFjZXMgYmVmb3JlIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVyczogLyAoXG4gICAgICAgICAqIC0gUmVwbGFjZSB0aGUgZm9sbG93aW5nIGNoYXJhY3RlcnMgd2l0aCBhIHNwYWNlOiAsIDtcbiAgICAgICAgICogLSBSZXBsYWNlIG11bHRpcGxlIHNwYWNlcyB3aXRoIG9uZSBzcGFjZVxuICAgICAgICAgKiAtIENvbnZlcnQgdXBwZXJjYXNlIGxldHRlcnMgKEEtWikgdG8gbG93ZXJjYXNlIChhLXopXG4gICAgICAgICAqXG4gICAgICAgICAqICpDT01QUkVTU19XSElURV9TUEFDRSpcbiAgICAgICAgICpcbiAgICAgICAgICogVXNlIHRoaXMgb3B0aW9uIHRvIHJlcGxhY2UgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzIHdpdGggYSBzcGFjZSBjaGFyYWN0ZXIgKGRlY2ltYWwgMzIpOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIFxcZiwgZm9ybWZlZWQsIGRlY2ltYWwgMTJcbiAgICAgICAgICogLSBcXHQsIHRhYiwgZGVjaW1hbCA5XG4gICAgICAgICAqIC0gXFxuLCBuZXdsaW5lLCBkZWNpbWFsIDEwXG4gICAgICAgICAqIC0gXFxyLCBjYXJyaWFnZSByZXR1cm4sIGRlY2ltYWwgMTNcbiAgICAgICAgICogLSBcXHYsIHZlcnRpY2FsIHRhYiwgZGVjaW1hbCAxMVxuICAgICAgICAgKiAtIG5vbi1icmVha2luZyBzcGFjZSwgZGVjaW1hbCAxNjBcbiAgICAgICAgICpcbiAgICAgICAgICogYENPTVBSRVNTX1dISVRFX1NQQUNFYCBhbHNvIHJlcGxhY2VzIG11bHRpcGxlIHNwYWNlcyB3aXRoIG9uZSBzcGFjZS5cbiAgICAgICAgICpcbiAgICAgICAgICogKkhUTUxfRU5USVRZX0RFQ09ERSpcbiAgICAgICAgICpcbiAgICAgICAgICogVXNlIHRoaXMgb3B0aW9uIHRvIHJlcGxhY2UgSFRNTC1lbmNvZGVkIGNoYXJhY3RlcnMgd2l0aCB1bmVuY29kZWQgY2hhcmFjdGVycy4gYEhUTUxfRU5USVRZX0RFQ09ERWAgcGVyZm9ybXMgdGhlIGZvbGxvd2luZyBvcGVyYXRpb25zOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIFJlcGxhY2VzIGAoYW1wZXJzYW5kKXF1b3Q7YCB3aXRoIGBcImBcbiAgICAgICAgICogLSBSZXBsYWNlcyBgKGFtcGVyc2FuZCluYnNwO2Agd2l0aCBhIG5vbi1icmVha2luZyBzcGFjZSwgZGVjaW1hbCAxNjBcbiAgICAgICAgICogLSBSZXBsYWNlcyBgKGFtcGVyc2FuZClsdDtgIHdpdGggYSBcImxlc3MgdGhhblwiIHN5bWJvbFxuICAgICAgICAgKiAtIFJlcGxhY2VzIGAoYW1wZXJzYW5kKWd0O2Agd2l0aCBgPmBcbiAgICAgICAgICogLSBSZXBsYWNlcyBjaGFyYWN0ZXJzIHRoYXQgYXJlIHJlcHJlc2VudGVkIGluIGhleGFkZWNpbWFsIGZvcm1hdCwgYChhbXBlcnNhbmQpI3hoaGhoO2AgLCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIGNoYXJhY3RlcnNcbiAgICAgICAgICogLSBSZXBsYWNlcyBjaGFyYWN0ZXJzIHRoYXQgYXJlIHJlcHJlc2VudGVkIGluIGRlY2ltYWwgZm9ybWF0LCBgKGFtcGVyc2FuZCkjbm5ubjtgICwgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzXG4gICAgICAgICAqXG4gICAgICAgICAqICpMT1dFUkNBU0UqXG4gICAgICAgICAqXG4gICAgICAgICAqIFVzZSB0aGlzIG9wdGlvbiB0byBjb252ZXJ0IHVwcGVyY2FzZSBsZXR0ZXJzIChBLVopIHRvIGxvd2VyY2FzZSAoYS16KS5cbiAgICAgICAgICpcbiAgICAgICAgICogKlVSTF9ERUNPREUqXG4gICAgICAgICAqXG4gICAgICAgICAqIFVzZSB0aGlzIG9wdGlvbiB0byBkZWNvZGUgYSBVUkwtZW5jb2RlZCB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogKk5PTkUqXG4gICAgICAgICAqXG4gICAgICAgICAqIFNwZWNpZnkgYE5PTkVgIGlmIHlvdSBkb24ndCB3YW50IHRvIHBlcmZvcm0gYW55IHRleHQgdHJhbnNmb3JtYXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXNxbGluamVjdGlvbm1hdGNoc2V0LXNxbGluamVjdGlvbm1hdGNodHVwbGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtc3FsaW5qZWN0aW9ubWF0Y2hzZXQtc3FsaW5qZWN0aW9ubWF0Y2h0dXBsZS10ZXh0dHJhbnNmb3JtYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHRleHRUcmFuc2Zvcm1hdGlvbjogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBTcWxJbmplY3Rpb25NYXRjaFR1cGxlUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFNxbEluamVjdGlvbk1hdGNoVHVwbGVQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TcWxJbmplY3Rpb25NYXRjaFNldF9TcWxJbmplY3Rpb25NYXRjaFR1cGxlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWVsZFRvTWF0Y2gnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZmllbGRUb01hdGNoKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWVsZFRvTWF0Y2gnLCBDZm5TcWxJbmplY3Rpb25NYXRjaFNldF9GaWVsZFRvTWF0Y2hQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5maWVsZFRvTWF0Y2gpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RleHRUcmFuc2Zvcm1hdGlvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50ZXh0VHJhbnNmb3JtYXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RleHRUcmFuc2Zvcm1hdGlvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50ZXh0VHJhbnNmb3JtYXRpb24pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6U3FsSW5qZWN0aW9uTWF0Y2hTZXQuU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6U3FsSW5qZWN0aW9uTWF0Y2hTZXQuU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TcWxJbmplY3Rpb25NYXRjaFNldFNxbEluamVjdGlvbk1hdGNoVHVwbGVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXRfU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBGaWVsZFRvTWF0Y2g6IGNmblNxbEluamVjdGlvbk1hdGNoU2V0RmllbGRUb01hdGNoUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmllbGRUb01hdGNoKSxcbiAgICAgICAgVGV4dFRyYW5zZm9ybWF0aW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRleHRUcmFuc2Zvcm1hdGlvbiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblNxbEluamVjdGlvbk1hdGNoU2V0U3FsSW5qZWN0aW9uTWF0Y2hUdXBsZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuU3FsSW5qZWN0aW9uTWF0Y2hTZXQuU3FsSW5qZWN0aW9uTWF0Y2hUdXBsZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblNxbEluamVjdGlvbk1hdGNoU2V0LlNxbEluamVjdGlvbk1hdGNoVHVwbGVQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ZpZWxkVG9NYXRjaCcsICdGaWVsZFRvTWF0Y2gnLCBDZm5TcWxJbmplY3Rpb25NYXRjaFNldEZpZWxkVG9NYXRjaFByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuRmllbGRUb01hdGNoKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0ZXh0VHJhbnNmb3JtYXRpb24nLCAnVGV4dFRyYW5zZm9ybWF0aW9uJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5UZXh0VHJhbnNmb3JtYXRpb24pKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5XZWJBQ0xgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXdlYmFjbC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuV2ViQUNMUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFjdGlvbiB0byBwZXJmb3JtIGlmIG5vbmUgb2YgdGhlIGBSdWxlc2AgY29udGFpbmVkIGluIHRoZSBgV2ViQUNMYCBtYXRjaC4gVGhlIGFjdGlvbiBpcyBzcGVjaWZpZWQgYnkgdGhlIGBXYWZBY3Rpb25gIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXdlYmFjbC5odG1sI2Nmbi13YWZyZWdpb25hbC13ZWJhY2wtZGVmYXVsdGFjdGlvblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRlZmF1bHRBY3Rpb246IENmbldlYkFDTC5BY3Rpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEEgbmFtZSBmb3IgdGhlIG1ldHJpY3MgZm9yIHRoaXMgYFdlYkFDTGAgLiBUaGUgbmFtZSBjYW4gY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChBLVosIGEteiwgMC05KSwgd2l0aCBtYXhpbXVtIGxlbmd0aCAxMjggYW5kIG1pbmltdW0gbGVuZ3RoIG9uZS4gSXQgY2FuJ3QgY29udGFpbiB3aGl0ZXNwYWNlIG9yIG1ldHJpYyBuYW1lcyByZXNlcnZlZCBmb3IgQVdTIFdBRiwgaW5jbHVkaW5nIFwiQWxsXCIgYW5kIFwiRGVmYXVsdF9BY3Rpb24uXCIgWW91IGNhbid0IGNoYW5nZSBgTWV0cmljTmFtZWAgYWZ0ZXIgeW91IGNyZWF0ZSB0aGUgYFdlYkFDTGAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtd2ViYWNsLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXdlYmFjbC1tZXRyaWNuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbWV0cmljTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBmcmllbmRseSBuYW1lIG9yIGRlc2NyaXB0aW9uIG9mIHRoZSBgV2ViQUNMYCAuIFlvdSBjYW4ndCBjaGFuZ2UgdGhlIG5hbWUgb2YgYSBgV2ViQUNMYCBhZnRlciB5b3UgY3JlYXRlIGl0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtd2ViYWNsLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXdlYmFjbC1uYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgYWN0aW9uIGZvciBlYWNoIGBSdWxlYCBpbiBhIGBXZWJBQ0xgICwgdGhlIHByaW9yaXR5IG9mIHRoZSBgUnVsZWAgLCBhbmQgdGhlIElEIG9mIHRoZSBgUnVsZWAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtd2ViYWNsLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXdlYmFjbC1ydWxlc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHJ1bGVzPzogQXJyYXk8Q2ZuV2ViQUNMLlJ1bGVQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuV2ViQUNMUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbldlYkFDTFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbldlYkFDTFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGVmYXVsdEFjdGlvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kZWZhdWx0QWN0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZWZhdWx0QWN0aW9uJywgQ2ZuV2ViQUNMX0FjdGlvblByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmRlZmF1bHRBY3Rpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY05hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubWV0cmljTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5tZXRyaWNOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncnVsZXMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5XZWJBQ0xfUnVsZVByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5ydWxlcykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5XZWJBQ0xQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OldlYkFDTGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuV2ViQUNMUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0xgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuV2ViQUNMUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbldlYkFDTFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBEZWZhdWx0QWN0aW9uOiBjZm5XZWJBQ0xBY3Rpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZWZhdWx0QWN0aW9uKSxcbiAgICAgICAgTWV0cmljTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5tZXRyaWNOYW1lKSxcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgUnVsZXM6IGNkay5saXN0TWFwcGVyKGNmbldlYkFDTFJ1bGVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMucnVsZXMpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5XZWJBQ0xQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbldlYkFDTFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5XZWJBQ0xQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RlZmF1bHRBY3Rpb24nLCAnRGVmYXVsdEFjdGlvbicsIENmbldlYkFDTEFjdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuRGVmYXVsdEFjdGlvbikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbWV0cmljTmFtZScsICdNZXRyaWNOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5NZXRyaWNOYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3J1bGVzJywgJ1J1bGVzJywgcHJvcGVydGllcy5SdWxlcyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5XZWJBQ0xSdWxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuUnVsZXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0xgXG4gKlxuICogPiBUaGlzIGlzICpBV1MgV0FGIENsYXNzaWMqIGRvY3VtZW50YXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FXUyBXQUYgQ2xhc3NpY10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY2xhc3NpYy13YWYtY2hhcHRlci5odG1sKSBpbiB0aGUgZGV2ZWxvcGVyIGd1aWRlLlxuICogPlxuICogPiAqRm9yIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBV1MgV0FGKiAsIHVzZSB0aGUgQVdTIFdBRiBWMiBBUEkgYW5kIHNlZSB0aGUgW0FXUyBXQUYgRGV2ZWxvcGVyIEd1aWRlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS93YWYtY2hhcHRlci5odG1sKSAuIFdpdGggdGhlIGxhdGVzdCB2ZXJzaW9uLCBBV1MgV0FGIGhhcyBhIHNpbmdsZSBzZXQgb2YgZW5kcG9pbnRzIGZvciByZWdpb25hbCBhbmQgZ2xvYmFsIHVzZS5cbiAqXG4gKiBDb250YWlucyB0aGUgYFJ1bGVzYCB0aGF0IGlkZW50aWZ5IHRoZSByZXF1ZXN0cyB0aGF0IHlvdSB3YW50IHRvIGFsbG93LCBibG9jaywgb3IgY291bnQuIEluIGEgYFdlYkFDTGAgLCB5b3UgYWxzbyBzcGVjaWZ5IGEgZGVmYXVsdCBhY3Rpb24gKCBgQUxMT1dgIG9yIGBCTE9DS2AgKSwgYW5kIHRoZSBhY3Rpb24gZm9yIGVhY2ggYFJ1bGVgIHRoYXQgeW91IGFkZCB0byBhIGBXZWJBQ0xgICwgZm9yIGV4YW1wbGUsIGJsb2NrIHJlcXVlc3RzIGZyb20gc3BlY2lmaWVkIElQIGFkZHJlc3NlcyBvciBibG9jayByZXF1ZXN0cyBmcm9tIHNwZWNpZmllZCByZWZlcnJlcnMuIElmIHlvdSBhZGQgbW9yZSB0aGFuIG9uZSBgUnVsZWAgdG8gYSBgV2ViQUNMYCAsIGEgcmVxdWVzdCBuZWVkcyB0byBtYXRjaCBvbmx5IG9uZSBvZiB0aGUgc3BlY2lmaWNhdGlvbnMgdG8gYmUgYWxsb3dlZCwgYmxvY2tlZCwgb3IgY291bnRlZC5cbiAqXG4gKiBUbyBpZGVudGlmeSB0aGUgcmVxdWVzdHMgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIGZpbHRlciwgeW91IGFzc29jaWF0ZSB0aGUgYFdlYkFDTGAgd2l0aCBhbiBBUEkgR2F0ZXdheSBBUEkgb3IgYW4gQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlci5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0xcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC13ZWJhY2wuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuV2ViQUNMIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6V0FGUmVnaW9uYWw6OldlYkFDTFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbldlYkFDTCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuV2ViQUNMUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbldlYkFDTChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWN0aW9uIHRvIHBlcmZvcm0gaWYgbm9uZSBvZiB0aGUgYFJ1bGVzYCBjb250YWluZWQgaW4gdGhlIGBXZWJBQ0xgIG1hdGNoLiBUaGUgYWN0aW9uIGlzIHNwZWNpZmllZCBieSB0aGUgYFdhZkFjdGlvbmAgb2JqZWN0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtd2ViYWNsLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXdlYmFjbC1kZWZhdWx0YWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIGRlZmF1bHRBY3Rpb246IENmbldlYkFDTC5BY3Rpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEEgbmFtZSBmb3IgdGhlIG1ldHJpY3MgZm9yIHRoaXMgYFdlYkFDTGAgLiBUaGUgbmFtZSBjYW4gY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChBLVosIGEteiwgMC05KSwgd2l0aCBtYXhpbXVtIGxlbmd0aCAxMjggYW5kIG1pbmltdW0gbGVuZ3RoIG9uZS4gSXQgY2FuJ3QgY29udGFpbiB3aGl0ZXNwYWNlIG9yIG1ldHJpYyBuYW1lcyByZXNlcnZlZCBmb3IgQVdTIFdBRiwgaW5jbHVkaW5nIFwiQWxsXCIgYW5kIFwiRGVmYXVsdF9BY3Rpb24uXCIgWW91IGNhbid0IGNoYW5nZSBgTWV0cmljTmFtZWAgYWZ0ZXIgeW91IGNyZWF0ZSB0aGUgYFdlYkFDTGAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtd2ViYWNsLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXdlYmFjbC1tZXRyaWNuYW1lXG4gICAgICovXG4gICAgcHVibGljIG1ldHJpY05hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgZnJpZW5kbHkgbmFtZSBvciBkZXNjcmlwdGlvbiBvZiB0aGUgYFdlYkFDTGAgLiBZb3UgY2FuJ3QgY2hhbmdlIHRoZSBuYW1lIG9mIGEgYFdlYkFDTGAgYWZ0ZXIgeW91IGNyZWF0ZSBpdC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXdlYmFjbC5odG1sI2Nmbi13YWZyZWdpb25hbC13ZWJhY2wtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBhY3Rpb24gZm9yIGVhY2ggYFJ1bGVgIGluIGEgYFdlYkFDTGAgLCB0aGUgcHJpb3JpdHkgb2YgdGhlIGBSdWxlYCAsIGFuZCB0aGUgSUQgb2YgdGhlIGBSdWxlYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC13ZWJhY2wuaHRtbCNjZm4td2FmcmVnaW9uYWwtd2ViYWNsLXJ1bGVzXG4gICAgICovXG4gICAgcHVibGljIHJ1bGVzOiBBcnJheTxDZm5XZWJBQ0wuUnVsZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpXQUZSZWdpb25hbDo6V2ViQUNMYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuV2ViQUNMUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbldlYkFDTC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2RlZmF1bHRBY3Rpb24nLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ21ldHJpY05hbWUnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLmRlZmF1bHRBY3Rpb24gPSBwcm9wcy5kZWZhdWx0QWN0aW9uO1xuICAgICAgICB0aGlzLm1ldHJpY05hbWUgPSBwcm9wcy5tZXRyaWNOYW1lO1xuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLnJ1bGVzID0gcHJvcHMucnVsZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5XZWJBQ0wuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlZmF1bHRBY3Rpb246IHRoaXMuZGVmYXVsdEFjdGlvbixcbiAgICAgICAgICAgIG1ldHJpY05hbWU6IHRoaXMubWV0cmljTmFtZSxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIHJ1bGVzOiB0aGlzLnJ1bGVzLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbldlYkFDTFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbldlYkFDTCB7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSBhY3Rpb24gQVdTIFdBRiB0YWtlcyB3aGVuIGEgd2ViIHJlcXVlc3QgbWF0Y2hlcyBvciBkb2Vzbid0IG1hdGNoIGFsbCBydWxlIGNvbmRpdGlvbnMuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC13ZWJhY2wtYWN0aW9uLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEFjdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZvciBhY3Rpb25zIHRoYXQgYXJlIGFzc29jaWF0ZWQgd2l0aCBhIHJ1bGUsIHRoZSBhY3Rpb24gdGhhdCBBV1MgV0FGIHRha2VzIHdoZW4gYSB3ZWIgcmVxdWVzdCBtYXRjaGVzIGFsbCBjb25kaXRpb25zIGluIGEgcnVsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogRm9yIHRoZSBkZWZhdWx0IGFjdGlvbiBvZiBhIHdlYiBhY2Nlc3MgY29udHJvbCBsaXN0IChBQ0wpLCB0aGUgYWN0aW9uIHRoYXQgQVdTIFdBRiB0YWtlcyB3aGVuIGEgd2ViIHJlcXVlc3QgZG9lc24ndCBtYXRjaCBhbGwgY29uZGl0aW9ucyBpbiBhbnkgcnVsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVmFsaWQgc2V0dGluZ3MgaW5jbHVkZSB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIGBBTExPV2AgOiBBV1MgV0FGIGFsbG93cyByZXF1ZXN0c1xuICAgICAgICAgKiAtIGBCTE9DS2AgOiBBV1MgV0FGIGJsb2NrcyByZXF1ZXN0c1xuICAgICAgICAgKiAtIGBDT1VOVGAgOiBBV1MgV0FGIGluY3JlbWVudHMgYSBjb3VudGVyIG9mIHRoZSByZXF1ZXN0cyB0aGF0IG1hdGNoIGFsbCBvZiB0aGUgY29uZGl0aW9ucyBpbiB0aGUgcnVsZS4gQVdTIFdBRiB0aGVuIGNvbnRpbnVlcyB0byBpbnNwZWN0IHRoZSB3ZWIgcmVxdWVzdCBiYXNlZCBvbiB0aGUgcmVtYWluaW5nIHJ1bGVzIGluIHRoZSB3ZWIgQUNMLiBZb3UgY2FuJ3Qgc3BlY2lmeSBgQ09VTlRgIGZvciB0aGUgZGVmYXVsdCBhY3Rpb24gZm9yIGEgV2ViQUNMLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXdlYmFjbC1hY3Rpb24uaHRtbCNjZm4td2FmcmVnaW9uYWwtd2ViYWNsLWFjdGlvbi10eXBlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEFjdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBY3Rpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5XZWJBQ0xfQWN0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0eXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJBY3Rpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OldlYkFDTC5BY3Rpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEFjdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6V2ViQUNMLkFjdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5XZWJBQ0xBY3Rpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuV2ViQUNMX0FjdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnR5cGUpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5XZWJBQ0xBY3Rpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbldlYkFDTC5BY3Rpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5XZWJBQ0wuQWN0aW9uUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0eXBlJywgJ1R5cGUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlR5cGUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5XZWJBQ0wge1xuICAgIC8qKlxuICAgICAqIEEgY29tYmluYXRpb24gb2YgYEJ5dGVNYXRjaFNldGAgLCBgSVBTZXRgICwgYW5kL29yIGBTcWxJbmplY3Rpb25NYXRjaFNldGAgb2JqZWN0cyB0aGF0IGlkZW50aWZ5IHRoZSB3ZWIgcmVxdWVzdHMgdGhhdCB5b3Ugd2FudCB0byBhbGxvdywgYmxvY2ssIG9yIGNvdW50LiBGb3IgZXhhbXBsZSwgeW91IG1pZ2h0IGNyZWF0ZSBhIGBSdWxlYCB0aGF0IGluY2x1ZGVzIHRoZSBmb2xsb3dpbmcgcHJlZGljYXRlczpcbiAgICAgKlxuICAgICAqIC0gQW4gYElQU2V0YCB0aGF0IGNhdXNlcyBBV1MgV0FGIHRvIHNlYXJjaCBmb3Igd2ViIHJlcXVlc3RzIHRoYXQgb3JpZ2luYXRlIGZyb20gdGhlIElQIGFkZHJlc3MgYDE5Mi4wLjIuNDRgXG4gICAgICogLSBBIGBCeXRlTWF0Y2hTZXRgIHRoYXQgY2F1c2VzIEFXUyBXQUYgdG8gc2VhcmNoIGZvciB3ZWIgcmVxdWVzdHMgZm9yIHdoaWNoIHRoZSB2YWx1ZSBvZiB0aGUgYFVzZXItQWdlbnRgIGhlYWRlciBpcyBgQmFkQm90YCAuXG4gICAgICpcbiAgICAgKiBUbyBtYXRjaCB0aGUgc2V0dGluZ3MgaW4gdGhpcyBgUnVsZWAgLCBhIHJlcXVlc3QgbXVzdCBvcmlnaW5hdGUgZnJvbSBgMTkyLjAuMi40NGAgQU5EIGluY2x1ZGUgYSBgVXNlci1BZ2VudGAgaGVhZGVyIGZvciB3aGljaCB0aGUgdmFsdWUgaXMgYEJhZEJvdGAgLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtd2ViYWNsLXJ1bGUuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUnVsZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBhY3Rpb24gdGhhdCBBV1MgV0FGIHRha2VzIHdoZW4gYSB3ZWIgcmVxdWVzdCBtYXRjaGVzIGFsbCBjb25kaXRpb25zIGluIHRoZSBydWxlLCBzdWNoIGFzIGFsbG93LCBibG9jaywgb3IgY291bnQgdGhlIHJlcXVlc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtd2ViYWNsLXJ1bGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtd2ViYWNsLXJ1bGUtYWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBhY3Rpb246IENmbldlYkFDTC5BY3Rpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBvcmRlciBpbiB3aGljaCBBV1MgV0FGIGV2YWx1YXRlcyB0aGUgcnVsZXMgaW4gYSB3ZWIgQUNMLiBBV1MgV0FGIGV2YWx1YXRlcyBydWxlcyB3aXRoIGEgbG93ZXIgdmFsdWUgYmVmb3JlIHJ1bGVzIHdpdGggYSBoaWdoZXIgdmFsdWUuIFRoZSB2YWx1ZSBtdXN0IGJlIGEgdW5pcXVlIGludGVnZXIuIElmIHlvdSBoYXZlIG11bHRpcGxlIHJ1bGVzIGluIGEgd2ViIEFDTCwgdGhlIHByaW9yaXR5IG51bWJlcnMgZG8gbm90IG5lZWQgdG8gYmUgY29uc2VjdXRpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwtd2ViYWNsLXJ1bGUuaHRtbCNjZm4td2FmcmVnaW9uYWwtd2ViYWNsLXJ1bGUtcHJpb3JpdHlcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHByaW9yaXR5OiBudW1iZXI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgSUQgb2YgYW4gQVdTIFdBRiBSZWdpb25hbCBydWxlIHRvIGFzc29jaWF0ZSB3aXRoIGEgd2ViIEFDTC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy13YWZyZWdpb25hbC13ZWJhY2wtcnVsZS5odG1sI2Nmbi13YWZyZWdpb25hbC13ZWJhY2wtcnVsZS1ydWxlaWRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHJ1bGVJZDogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBSdWxlUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJ1bGVQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5XZWJBQ0xfUnVsZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYWN0aW9uJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFjdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYWN0aW9uJywgQ2ZuV2ViQUNMX0FjdGlvblByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFjdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncHJpb3JpdHknLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucHJpb3JpdHkpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ByaW9yaXR5JywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLnByaW9yaXR5KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdydWxlSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucnVsZUlkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdydWxlSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucnVsZUlkKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlJ1bGVQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OldlYkFDTC5SdWxlYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSdWxlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0wuUnVsZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5XZWJBQ0xSdWxlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbldlYkFDTF9SdWxlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEFjdGlvbjogY2ZuV2ViQUNMQWN0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYWN0aW9uKSxcbiAgICAgICAgUHJpb3JpdHk6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucHJpb3JpdHkpLFxuICAgICAgICBSdWxlSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucnVsZUlkKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuV2ViQUNMUnVsZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuV2ViQUNMLlJ1bGVQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5XZWJBQ0wuUnVsZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYWN0aW9uJywgJ0FjdGlvbicsIENmbldlYkFDTEFjdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuQWN0aW9uKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdwcmlvcml0eScsICdQcmlvcml0eScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHByb3BlcnRpZXMuUHJpb3JpdHkpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3J1bGVJZCcsICdSdWxlSWQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJ1bGVJZCkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbldlYkFDTEFzc29jaWF0aW9uYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC13ZWJhY2xhc3NvY2lhdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuV2ViQUNMQXNzb2NpYXRpb25Qcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIHJlc291cmNlIHRvIHByb3RlY3Qgd2l0aCB0aGUgd2ViIEFDTC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXdlYmFjbGFzc29jaWF0aW9uLmh0bWwjY2ZuLXdhZnJlZ2lvbmFsLXdlYmFjbGFzc29jaWF0aW9uLXJlc291cmNlYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgcmVzb3VyY2VBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgdW5pcXVlIGlkZW50aWZpZXIgKElEKSBmb3IgdGhlIHdlYiBBQ0wuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC13ZWJhY2xhc3NvY2lhdGlvbi5odG1sI2Nmbi13YWZyZWdpb25hbC13ZWJhY2xhc3NvY2lhdGlvbi13ZWJhY2xpZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IHdlYkFjbElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuV2ViQUNMQXNzb2NpYXRpb25Qcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuV2ViQUNMQXNzb2NpYXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5XZWJBQ0xBc3NvY2lhdGlvblByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzb3VyY2VBcm4nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucmVzb3VyY2VBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Jlc291cmNlQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlc291cmNlQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd3ZWJBY2xJZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy53ZWJBY2xJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignd2ViQWNsSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMud2ViQWNsSWQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuV2ViQUNMQXNzb2NpYXRpb25Qcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6OldlYkFDTEFzc29jaWF0aW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5XZWJBQ0xBc3NvY2lhdGlvblByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6V2ViQUNMQXNzb2NpYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuV2ViQUNMQXNzb2NpYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuV2ViQUNMQXNzb2NpYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgUmVzb3VyY2VBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVzb3VyY2VBcm4pLFxuICAgICAgICBXZWJBQ0xJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy53ZWJBY2xJZCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbldlYkFDTEFzc29jaWF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5XZWJBQ0xBc3NvY2lhdGlvblByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5XZWJBQ0xBc3NvY2lhdGlvblByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVzb3VyY2VBcm4nLCAnUmVzb3VyY2VBcm4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJlc291cmNlQXJuKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd3ZWJBY2xJZCcsICdXZWJBQ0xJZCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuV2ViQUNMSWQpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0xBc3NvY2lhdGlvbmBcbiAqXG4gKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gKiA+XG4gKiA+ICpGb3IgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIEFXUyBXQUYqICwgdXNlIHRoZSBBV1MgV0FGIFYyIEFQSSBhbmQgc2VlIHRoZSBbQVdTIFdBRiBEZXZlbG9wZXIgR3VpZGVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3dhZi1jaGFwdGVyLmh0bWwpIC4gV2l0aCB0aGUgbGF0ZXN0IHZlcnNpb24sIEFXUyBXQUYgaGFzIGEgc2luZ2xlIHNldCBvZiBlbmRwb2ludHMgZm9yIHJlZ2lvbmFsIGFuZCBnbG9iYWwgdXNlLlxuICpcbiAqIFRoZSBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0xBc3NvY2lhdGlvbiByZXNvdXJjZSBhc3NvY2lhdGVzIGFuIEFXUyBXQUYgUmVnaW9uYWwgd2ViIGFjY2VzcyBjb250cm9sIGdyb3VwIChBQ0wpIHdpdGggYSByZXNvdXJjZS5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0xBc3NvY2lhdGlvblxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXdhZnJlZ2lvbmFsLXdlYmFjbGFzc29jaWF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbldlYkFDTEFzc29jaWF0aW9uIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6V0FGUmVnaW9uYWw6OldlYkFDTEFzc29jaWF0aW9uXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuV2ViQUNMQXNzb2NpYXRpb24ge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbldlYkFDTEFzc29jaWF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbldlYkFDTEFzc29jaWF0aW9uKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcmVzb3VyY2UgdG8gcHJvdGVjdCB3aXRoIHRoZSB3ZWIgQUNMLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwtd2ViYWNsYXNzb2NpYXRpb24uaHRtbCNjZm4td2FmcmVnaW9uYWwtd2ViYWNsYXNzb2NpYXRpb24tcmVzb3VyY2Vhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzb3VyY2VBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgdW5pcXVlIGlkZW50aWZpZXIgKElEKSBmb3IgdGhlIHdlYiBBQ0wuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC13ZWJhY2xhc3NvY2lhdGlvbi5odG1sI2Nmbi13YWZyZWdpb25hbC13ZWJhY2xhc3NvY2lhdGlvbi13ZWJhY2xpZFxuICAgICAqL1xuICAgIHB1YmxpYyB3ZWJBY2xJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OldBRlJlZ2lvbmFsOjpXZWJBQ0xBc3NvY2lhdGlvbmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbldlYkFDTEFzc29jaWF0aW9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbldlYkFDTEFzc29jaWF0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAncmVzb3VyY2VBcm4nLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3dlYkFjbElkJywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yZXNvdXJjZUFybiA9IHByb3BzLnJlc291cmNlQXJuO1xuICAgICAgICB0aGlzLndlYkFjbElkID0gcHJvcHMud2ViQWNsSWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5XZWJBQ0xBc3NvY2lhdGlvbi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzb3VyY2VBcm46IHRoaXMucmVzb3VyY2VBcm4sXG4gICAgICAgICAgICB3ZWJBY2xJZDogdGhpcy53ZWJBY2xJZCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5XZWJBQ0xBc3NvY2lhdGlvblByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblhzc01hdGNoU2V0YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC14c3NtYXRjaHNldC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuWHNzTWF0Y2hTZXRQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSwgaWYgYW55LCBvZiB0aGUgYFhzc01hdGNoU2V0YCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC14c3NtYXRjaHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC14c3NtYXRjaHNldC1uYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSBwYXJ0cyBvZiB3ZWIgcmVxdWVzdHMgdGhhdCB5b3Ugd2FudCB0byBpbnNwZWN0IGZvciBjcm9zcy1zaXRlIHNjcmlwdGluZyBhdHRhY2tzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwteHNzbWF0Y2hzZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwteHNzbWF0Y2hzZXQteHNzbWF0Y2h0dXBsZXNcbiAgICAgKi9cbiAgICByZWFkb25seSB4c3NNYXRjaFR1cGxlcz86IEFycmF5PENmblhzc01hdGNoU2V0Llhzc01hdGNoVHVwbGVQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuWHNzTWF0Y2hTZXRQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuWHNzTWF0Y2hTZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5Yc3NNYXRjaFNldFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3hzc01hdGNoVHVwbGVzJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuWHNzTWF0Y2hTZXRfWHNzTWF0Y2hUdXBsZVByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy54c3NNYXRjaFR1cGxlcykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5Yc3NNYXRjaFNldFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6WHNzTWF0Y2hTZXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblhzc01hdGNoU2V0UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpYc3NNYXRjaFNldGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Yc3NNYXRjaFNldFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5Yc3NNYXRjaFNldFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbWUpLFxuICAgICAgICBYc3NNYXRjaFR1cGxlczogY2RrLmxpc3RNYXBwZXIoY2ZuWHNzTWF0Y2hTZXRYc3NNYXRjaFR1cGxlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnhzc01hdGNoVHVwbGVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuWHNzTWF0Y2hTZXRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblhzc01hdGNoU2V0UHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblhzc01hdGNoU2V0UHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3hzc01hdGNoVHVwbGVzJywgJ1hzc01hdGNoVHVwbGVzJywgcHJvcGVydGllcy5Yc3NNYXRjaFR1cGxlcyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5Yc3NNYXRjaFNldFhzc01hdGNoVHVwbGVQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5Yc3NNYXRjaFR1cGxlcykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6V0FGUmVnaW9uYWw6Olhzc01hdGNoU2V0YFxuICpcbiAqID4gVGhpcyBpcyAqQVdTIFdBRiBDbGFzc2ljKiBkb2N1bWVudGF0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBV1MgV0FGIENsYXNzaWNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS93YWYvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NsYXNzaWMtd2FmLWNoYXB0ZXIuaHRtbCkgaW4gdGhlIGRldmVsb3BlciBndWlkZS5cbiAqID5cbiAqID4gKkZvciB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgQVdTIFdBRiogLCB1c2UgdGhlIEFXUyBXQUYgVjIgQVBJIGFuZCBzZWUgdGhlIFtBV1MgV0FGIERldmVsb3BlciBHdWlkZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2FmLWNoYXB0ZXIuaHRtbCkgLiBXaXRoIHRoZSBsYXRlc3QgdmVyc2lvbiwgQVdTIFdBRiBoYXMgYSBzaW5nbGUgc2V0IG9mIGVuZHBvaW50cyBmb3IgcmVnaW9uYWwgYW5kIGdsb2JhbCB1c2UuXG4gKlxuICogQSBjb21wbGV4IHR5cGUgdGhhdCBjb250YWlucyBgWHNzTWF0Y2hUdXBsZWAgb2JqZWN0cywgd2hpY2ggc3BlY2lmeSB0aGUgcGFydHMgb2Ygd2ViIHJlcXVlc3RzIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBpbnNwZWN0IGZvciBjcm9zcy1zaXRlIHNjcmlwdGluZyBhdHRhY2tzIGFuZCwgaWYgeW91IHdhbnQgQVdTIFdBRiB0byBpbnNwZWN0IGEgaGVhZGVyLCB0aGUgbmFtZSBvZiB0aGUgaGVhZGVyLiBJZiBhIGBYc3NNYXRjaFNldGAgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBgWHNzTWF0Y2hUdXBsZWAgb2JqZWN0LCBhIHJlcXVlc3QgbmVlZHMgdG8gaW5jbHVkZSBjcm9zcy1zaXRlIHNjcmlwdGluZyBhdHRhY2tzIGluIG9ubHkgb25lIG9mIHRoZSBzcGVjaWZpZWQgcGFydHMgb2YgdGhlIHJlcXVlc3QgdG8gYmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6V0FGUmVnaW9uYWw6Olhzc01hdGNoU2V0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwteHNzbWF0Y2hzZXQuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuWHNzTWF0Y2hTZXQgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpXQUZSZWdpb25hbDo6WHNzTWF0Y2hTZXRcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5Yc3NNYXRjaFNldCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuWHNzTWF0Y2hTZXRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuWHNzTWF0Y2hTZXQoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUsIGlmIGFueSwgb2YgdGhlIGBYc3NNYXRjaFNldGAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utd2FmcmVnaW9uYWwteHNzbWF0Y2hzZXQuaHRtbCNjZm4td2FmcmVnaW9uYWwteHNzbWF0Y2hzZXQtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIHBhcnRzIG9mIHdlYiByZXF1ZXN0cyB0aGF0IHlvdSB3YW50IHRvIGluc3BlY3QgZm9yIGNyb3NzLXNpdGUgc2NyaXB0aW5nIGF0dGFja3MuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS13YWZyZWdpb25hbC14c3NtYXRjaHNldC5odG1sI2Nmbi13YWZyZWdpb25hbC14c3NtYXRjaHNldC14c3NtYXRjaHR1cGxlc1xuICAgICAqL1xuICAgIHB1YmxpYyB4c3NNYXRjaFR1cGxlczogQXJyYXk8Q2ZuWHNzTWF0Y2hTZXQuWHNzTWF0Y2hUdXBsZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpXQUZSZWdpb25hbDo6WHNzTWF0Y2hTZXRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5Yc3NNYXRjaFNldFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5Yc3NNYXRjaFNldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLnhzc01hdGNoVHVwbGVzID0gcHJvcHMueHNzTWF0Y2hUdXBsZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5Yc3NNYXRjaFNldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgICAgeHNzTWF0Y2hUdXBsZXM6IHRoaXMueHNzTWF0Y2hUdXBsZXMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuWHNzTWF0Y2hTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5Yc3NNYXRjaFNldCB7XG4gICAgLyoqXG4gICAgICogVGhlIHBhcnQgb2YgYSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCwgc3VjaCBhcyBhIHNwZWNpZmljIGhlYWRlciBvciBhIHF1ZXJ5IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXhzc21hdGNoc2V0LWZpZWxkdG9tYXRjaC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBGaWVsZFRvTWF0Y2hQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVuIHRoZSB2YWx1ZSBvZiBgVHlwZWAgaXMgYEhFQURFUmAgLCBlbnRlciB0aGUgbmFtZSBvZiB0aGUgaGVhZGVyIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGZvciBleGFtcGxlLCBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIC4gVGhlIG5hbWUgb2YgdGhlIGhlYWRlciBpcyBub3QgY2FzZSBzZW5zaXRpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdoZW4gdGhlIHZhbHVlIG9mIGBUeXBlYCBpcyBgU0lOR0xFX1FVRVJZX0FSR2AgLCBlbnRlciB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIHRoYXQgeW91IHdhbnQgQVdTIFdBRiB0byBzZWFyY2gsIGZvciBleGFtcGxlLCBgVXNlck5hbWVgIG9yIGBTYWxlc1JlZ2lvbmAgLiBUaGUgcGFyYW1ldGVyIG5hbWUgaXMgbm90IGNhc2Ugc2Vuc2l0aXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgdmFsdWUgb2YgYFR5cGVgIGlzIGFueSBvdGhlciB2YWx1ZSwgb21pdCBgRGF0YWAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXhzc21hdGNoc2V0LWZpZWxkdG9tYXRjaC5odG1sI2Nmbi13YWZyZWdpb25hbC14c3NtYXRjaHNldC1maWVsZHRvbWF0Y2gtZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGF0YT86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYXJ0IG9mIHRoZSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gc2VhcmNoIGZvciBhIHNwZWNpZmllZCBzdHJpbmcuIFBhcnRzIG9mIGEgcmVxdWVzdCB0aGF0IHlvdSBjYW4gc2VhcmNoIGluY2x1ZGUgdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBgSEVBREVSYCA6IEEgc3BlY2lmaWVkIHJlcXVlc3QgaGVhZGVyLCBmb3IgZXhhbXBsZSwgdGhlIHZhbHVlIG9mIHRoZSBgVXNlci1BZ2VudGAgb3IgYFJlZmVyZXJgIGhlYWRlci4gSWYgeW91IGNob29zZSBgSEVBREVSYCBmb3IgdGhlIHR5cGUsIHNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIGhlYWRlciBpbiBgRGF0YWAgLlxuICAgICAgICAgKiAtIGBNRVRIT0RgIDogVGhlIEhUVFAgbWV0aG9kLCB3aGljaCBpbmRpY2F0ZXMgdGhlIHR5cGUgb2Ygb3BlcmF0aW9uIHRoYXQgdGhlIHJlcXVlc3QgaXMgYXNraW5nIHRoZSBvcmlnaW4gdG8gcGVyZm9ybS5cbiAgICAgICAgICogLSBgUVVFUllfU1RSSU5HYCA6IEEgcXVlcnkgc3RyaW5nLCB3aGljaCBpcyB0aGUgcGFydCBvZiBhIFVSTCB0aGF0IGFwcGVhcnMgYWZ0ZXIgYSBgP2AgY2hhcmFjdGVyLCBpZiBhbnkuXG4gICAgICAgICAqIC0gYFVSSWAgOiBUaGUgcGFydCBvZiBhIHdlYiByZXF1ZXN0IHRoYXQgaWRlbnRpZmllcyBhIHJlc291cmNlLCBmb3IgZXhhbXBsZSwgYC9pbWFnZXMvZGFpbHktYWQuanBnYCAuXG4gICAgICAgICAqIC0gYEJPRFlgIDogVGhlIHBhcnQgb2YgYSByZXF1ZXN0IHRoYXQgY29udGFpbnMgYW55IGFkZGl0aW9uYWwgZGF0YSB0aGF0IHlvdSB3YW50IHRvIHNlbmQgdG8geW91ciB3ZWIgc2VydmVyIGFzIHRoZSBIVFRQIHJlcXVlc3QgYm9keSwgc3VjaCBhcyBkYXRhIGZyb20gYSBmb3JtLiBUaGUgcmVxdWVzdCBib2R5IGltbWVkaWF0ZWx5IGZvbGxvd3MgdGhlIHJlcXVlc3QgaGVhZGVycy4gTm90ZSB0aGF0IG9ubHkgdGhlIGZpcnN0IGA4MTkyYCBieXRlcyBvZiB0aGUgcmVxdWVzdCBib2R5IGFyZSBmb3J3YXJkZWQgdG8gQVdTIFdBRiBmb3IgaW5zcGVjdGlvbi4gVG8gYWxsb3cgb3IgYmxvY2sgcmVxdWVzdHMgYmFzZWQgb24gdGhlIGxlbmd0aCBvZiB0aGUgYm9keSwgeW91IGNhbiBjcmVhdGUgYSBzaXplIGNvbnN0cmFpbnQgc2V0LlxuICAgICAgICAgKiAtIGBTSU5HTEVfUVVFUllfQVJHYCA6IFRoZSBwYXJhbWV0ZXIgaW4gdGhlIHF1ZXJ5IHN0cmluZyB0aGF0IHlvdSB3aWxsIGluc3BlY3QsIHN1Y2ggYXMgKlVzZXJOYW1lKiBvciAqU2FsZXNSZWdpb24qIC4gVGhlIG1heGltdW0gbGVuZ3RoIGZvciBgU0lOR0xFX1FVRVJZX0FSR2AgaXMgMzAgY2hhcmFjdGVycy5cbiAgICAgICAgICogLSBgQUxMX1FVRVJZX0FSR1NgIDogU2ltaWxhciB0byBgU0lOR0xFX1FVRVJZX0FSR2AgLCBidXQgcmF0aGVyIHRoYW4gaW5zcGVjdGluZyBhIHNpbmdsZSBwYXJhbWV0ZXIsIEFXUyBXQUYgd2lsbCBpbnNwZWN0IGFsbCBwYXJhbWV0ZXJzIHdpdGhpbiB0aGUgcXVlcnkgZm9yIHRoZSB2YWx1ZSBvciByZWdleCBwYXR0ZXJuIHRoYXQgeW91IHNwZWNpZnkgaW4gYFRhcmdldFN0cmluZ2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXhzc21hdGNoc2V0LWZpZWxkdG9tYXRjaC5odG1sI2Nmbi13YWZyZWdpb25hbC14c3NtYXRjaHNldC1maWVsZHRvbWF0Y2gtdHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBGaWVsZFRvTWF0Y2hQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRmllbGRUb01hdGNoUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuWHNzTWF0Y2hTZXRfRmllbGRUb01hdGNoUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRhdGEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkZpZWxkVG9NYXRjaFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpXQUZSZWdpb25hbDo6WHNzTWF0Y2hTZXQuRmllbGRUb01hdGNoYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWVsZFRvTWF0Y2hQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6V0FGUmVnaW9uYWw6Olhzc01hdGNoU2V0LkZpZWxkVG9NYXRjaGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Yc3NNYXRjaFNldEZpZWxkVG9NYXRjaFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5Yc3NNYXRjaFNldF9GaWVsZFRvTWF0Y2hQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGF0YTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kYXRhKSxcbiAgICAgICAgVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50eXBlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuWHNzTWF0Y2hTZXRGaWVsZFRvTWF0Y2hQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblhzc01hdGNoU2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblhzc01hdGNoU2V0LkZpZWxkVG9NYXRjaFByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGF0YScsICdEYXRhJywgcHJvcGVydGllcy5EYXRhICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRhdGEpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3R5cGUnLCAnVHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVHlwZSkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblhzc01hdGNoU2V0IHtcbiAgICAvKipcbiAgICAgKiA+IFRoaXMgaXMgKkFXUyBXQUYgQ2xhc3NpYyogZG9jdW1lbnRhdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQVdTIFdBRiBDbGFzc2ljXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vd2FmL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbGFzc2ljLXdhZi1jaGFwdGVyLmh0bWwpIGluIHRoZSBkZXZlbG9wZXIgZ3VpZGUuXG4gICAgICogPlxuICAgICAqID4gKkZvciB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgQVdTIFdBRiogLCB1c2UgdGhlIEFXUyBXQUYgVjIgQVBJIGFuZCBzZWUgdGhlIFtBV1MgV0FGIERldmVsb3BlciBHdWlkZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2FmLWNoYXB0ZXIuaHRtbCkgLiBXaXRoIHRoZSBsYXRlc3QgdmVyc2lvbiwgQVdTIFdBRiBoYXMgYSBzaW5nbGUgc2V0IG9mIGVuZHBvaW50cyBmb3IgcmVnaW9uYWwgYW5kIGdsb2JhbCB1c2UuXG4gICAgICpcbiAgICAgKiBTcGVjaWZpZXMgdGhlIHBhcnQgb2YgYSB3ZWIgcmVxdWVzdCB0aGF0IHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCBmb3IgY3Jvc3Mtc2l0ZSBzY3JpcHRpbmcgYXR0YWNrcyBhbmQsIGlmIHlvdSB3YW50IEFXUyBXQUYgdG8gaW5zcGVjdCBhIGhlYWRlciwgdGhlIG5hbWUgb2YgdGhlIGhlYWRlci5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXhzc21hdGNoc2V0LXhzc21hdGNodHVwbGUuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgWHNzTWF0Y2hUdXBsZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYXJ0IG9mIGEgd2ViIHJlcXVlc3QgdGhhdCB5b3Ugd2FudCBBV1MgV0FGIHRvIGluc3BlY3QsIHN1Y2ggYXMgYSBzcGVjaWZpZWQgaGVhZGVyIG9yIGEgcXVlcnkgc3RyaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXdhZnJlZ2lvbmFsLXhzc21hdGNoc2V0LXhzc21hdGNodHVwbGUuaHRtbCNjZm4td2FmcmVnaW9uYWwteHNzbWF0Y2hzZXQteHNzbWF0Y2h0dXBsZS1maWVsZHRvbWF0Y2hcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGZpZWxkVG9NYXRjaDogQ2ZuWHNzTWF0Y2hTZXQuRmllbGRUb01hdGNoUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZXh0IHRyYW5zZm9ybWF0aW9ucyBlbGltaW5hdGUgc29tZSBvZiB0aGUgdW51c3VhbCBmb3JtYXR0aW5nIHRoYXQgYXR0YWNrZXJzIHVzZSBpbiB3ZWIgcmVxdWVzdHMgaW4gYW4gZWZmb3J0IHRvIGJ5cGFzcyBBV1MgV0FGIC4gSWYgeW91IHNwZWNpZnkgYSB0cmFuc2Zvcm1hdGlvbiwgQVdTIFdBRiBwZXJmb3JtcyB0aGUgdHJhbnNmb3JtYXRpb24gb24gYEZpZWxkVG9NYXRjaGAgYmVmb3JlIGluc3BlY3RpbmcgaXQgZm9yIGEgbWF0Y2guXG4gICAgICAgICAqXG4gICAgICAgICAqIFlvdSBjYW4gb25seSBzcGVjaWZ5IGEgc2luZ2xlIHR5cGUgb2YgVGV4dFRyYW5zZm9ybWF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqQ01EX0xJTkUqXG4gICAgICAgICAqXG4gICAgICAgICAqIFdoZW4geW91J3JlIGNvbmNlcm5lZCB0aGF0IGF0dGFja2VycyBhcmUgaW5qZWN0aW5nIGFuIG9wZXJhdGluZyBzeXN0ZW0gY29tbWFuZCBsaW5lIGNvbW1hbmQgYW5kIHVzaW5nIHVudXN1YWwgZm9ybWF0dGluZyB0byBkaXNndWlzZSBzb21lIG9yIGFsbCBvZiB0aGUgY29tbWFuZCwgdXNlIHRoaXMgb3B0aW9uIHRvIHBlcmZvcm0gdGhlIGZvbGxvd2luZyB0cmFuc2Zvcm1hdGlvbnM6XG4gICAgICAgICAqXG4gICAgICAgICAqIC0gRGVsZXRlIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVyczogXFwgXCIgJyBeXG4gICAgICAgICAqIC0gRGVsZXRlIHNwYWNlcyBiZWZvcmUgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzOiAvIChcbiAgICAgICAgICogLSBSZXBsYWNlIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVycyB3aXRoIGEgc3BhY2U6ICwgO1xuICAgICAgICAgKiAtIFJlcGxhY2UgbXVsdGlwbGUgc3BhY2VzIHdpdGggb25lIHNwYWNlXG4gICAgICAgICAqIC0gQ29udmVydCB1cHBlcmNhc2UgbGV0dGVycyAoQS1aKSB0byBsb3dlcmNhc2UgKGEteilcbiAgICAgICAgICpcbiAgICAgICAgICogKkNPTVBSRVNTX1dISVRFX1NQQUNFKlxuICAgICAgICAgKlxuICAgICAgICAgKiBVc2UgdGhpcyBvcHRpb24gdG8gcmVwbGFjZSB0aGUgZm9sbG93aW5nIGNoYXJhY3RlcnMgd2l0aCBhIHNwYWNlIGNoYXJhY3RlciAoZGVjaW1hbCAzMik6XG4gICAgICAgICAqXG4gICAgICAgICAqIC0gXFxmLCBmb3JtZmVlZCwgZGVjaW1hbCAxMlxuICAgICAgICAgKiAtIFxcdCwgdGFiLCBkZWNpbWFsIDlcbiAgICAgICAgICogLSBcXG4sIG5ld2xpbmUsIGRlY2ltYWwgMTBcbiAgICAgICAgICogLSBcXHIsIGNhcnJpYWdlIHJldHVybiwgZGVjaW1hbCAxM1xuICAgICAgICAgKiAtIFxcdiwgdmVydGljYWwgdGFiLCBkZWNpbWFsIDExXG4gICAgICAgICAqIC0gbm9uLWJyZWFraW5nIHNwYWNlLCBkZWNpbWFsIDE2MFxuICAgICAgICAgKlxuICAgICAgICAgKiBgQ09NUFJFU1NfV0hJVEVfU1BBQ0VgIGFsc28gcmVwbGFjZXMgbXVsdGlwbGUgc3BhY2VzIHdpdGggb25lIHNwYWNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqSFRNTF9FTlRJVFlfREVDT0RFKlxuICAgICAgICAgKlxuICAgICAgICAgKiBVc2UgdGhpcyBvcHRpb24gdG8gcmVwbGFjZSBIVE1MLWVuY29kZWQgY2hhcmFjdGVycyB3aXRoIHVuZW5jb2RlZCBjaGFyYWN0ZXJzLiBgSFRNTF9FTlRJVFlfREVDT0RFYCBwZXJmb3JtcyB0aGUgZm9sbG93aW5nIG9wZXJhdGlvbnM6XG4gICAgICAgICAqXG4gICAgICAgICAqIC0gUmVwbGFjZXMgYChhbXBlcnNhbmQpcXVvdDtgIHdpdGggYFwiYFxuICAgICAgICAgKiAtIFJlcGxhY2VzIGAoYW1wZXJzYW5kKW5ic3A7YCB3aXRoIGEgbm9uLWJyZWFraW5nIHNwYWNlLCBkZWNpbWFsIDE2MFxuICAgICAgICAgKiAtIFJlcGxhY2VzIGAoYW1wZXJzYW5kKWx0O2Agd2l0aCBhIFwibGVzcyB0aGFuXCIgc3ltYm9sXG4gICAgICAgICAqIC0gUmVwbGFjZXMgYChhbXBlcnNhbmQpZ3Q7YCB3aXRoIGA+YFxuICAgICAgICAgKiAtIFJlcGxhY2VzIGNoYXJhY3RlcnMgdGhhdCBhcmUgcmVwcmVzZW50ZWQgaW4gaGV4YWRlY2ltYWwgZm9ybWF0LCBgKGFtcGVyc2FuZCkjeGhoaGg7YCAsIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVyc1xuICAgICAgICAgKiAtIFJlcGxhY2VzIGNoYXJhY3RlcnMgdGhhdCBhcmUgcmVwcmVzZW50ZWQgaW4gZGVjaW1hbCBmb3JtYXQsIGAoYW1wZXJzYW5kKSNubm5uO2AgLCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIGNoYXJhY3RlcnNcbiAgICAgICAgICpcbiAgICAgICAgICogKkxPV0VSQ0FTRSpcbiAgICAgICAgICpcbiAgICAgICAgICogVXNlIHRoaXMgb3B0aW9uIHRvIGNvbnZlcnQgdXBwZXJjYXNlIGxldHRlcnMgKEEtWikgdG8gbG93ZXJjYXNlIChhLXopLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqVVJMX0RFQ09ERSpcbiAgICAgICAgICpcbiAgICAgICAgICogVXNlIHRoaXMgb3B0aW9uIHRvIGRlY29kZSBhIFVSTC1lbmNvZGVkIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqTk9ORSpcbiAgICAgICAgICpcbiAgICAgICAgICogU3BlY2lmeSBgTk9ORWAgaWYgeW91IGRvbid0IHdhbnQgdG8gcGVyZm9ybSBhbnkgdGV4dCB0cmFuc2Zvcm1hdGlvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtd2FmcmVnaW9uYWwteHNzbWF0Y2hzZXQteHNzbWF0Y2h0dXBsZS5odG1sI2Nmbi13YWZyZWdpb25hbC14c3NtYXRjaHNldC14c3NtYXRjaHR1cGxlLXRleHR0cmFuc2Zvcm1hdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdGV4dFRyYW5zZm9ybWF0aW9uOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYFhzc01hdGNoVHVwbGVQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgWHNzTWF0Y2hUdXBsZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblhzc01hdGNoU2V0X1hzc01hdGNoVHVwbGVQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpZWxkVG9NYXRjaCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5maWVsZFRvTWF0Y2gpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpZWxkVG9NYXRjaCcsIENmblhzc01hdGNoU2V0X0ZpZWxkVG9NYXRjaFByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmZpZWxkVG9NYXRjaCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGV4dFRyYW5zZm9ybWF0aW9uJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnRleHRUcmFuc2Zvcm1hdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGV4dFRyYW5zZm9ybWF0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnRleHRUcmFuc2Zvcm1hdGlvbikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJYc3NNYXRjaFR1cGxlUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpYc3NNYXRjaFNldC5Yc3NNYXRjaFR1cGxlYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBYc3NNYXRjaFR1cGxlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OldBRlJlZ2lvbmFsOjpYc3NNYXRjaFNldC5Yc3NNYXRjaFR1cGxlYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblhzc01hdGNoU2V0WHNzTWF0Y2hUdXBsZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5Yc3NNYXRjaFNldF9Yc3NNYXRjaFR1cGxlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEZpZWxkVG9NYXRjaDogY2ZuWHNzTWF0Y2hTZXRGaWVsZFRvTWF0Y2hQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5maWVsZFRvTWF0Y2gpLFxuICAgICAgICBUZXh0VHJhbnNmb3JtYXRpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGV4dFRyYW5zZm9ybWF0aW9uKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuWHNzTWF0Y2hTZXRYc3NNYXRjaFR1cGxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5Yc3NNYXRjaFNldC5Yc3NNYXRjaFR1cGxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuWHNzTWF0Y2hTZXQuWHNzTWF0Y2hUdXBsZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZmllbGRUb01hdGNoJywgJ0ZpZWxkVG9NYXRjaCcsIENmblhzc01hdGNoU2V0RmllbGRUb01hdGNoUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5GaWVsZFRvTWF0Y2gpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RleHRUcmFuc2Zvcm1hdGlvbicsICdUZXh0VHJhbnNmb3JtYXRpb24nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlRleHRUcmFuc2Zvcm1hdGlvbikpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19
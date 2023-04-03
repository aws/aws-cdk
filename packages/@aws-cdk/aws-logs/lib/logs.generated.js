"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnSubscriptionFilter = exports.CfnResourcePolicy = exports.CfnQueryDefinition = exports.CfnMetricFilter = exports.CfnLogStream = exports.CfnLogGroup = exports.CfnDestination = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the result of the validation.
 */
function CfnDestinationPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationName', cdk.requiredValidator)(properties.destinationName));
    errors.collect(cdk.propertyValidator('destinationName', cdk.validateString)(properties.destinationName));
    errors.collect(cdk.propertyValidator('destinationPolicy', cdk.validateString)(properties.destinationPolicy));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.requiredValidator)(properties.targetArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.validateString)(properties.targetArn));
    return errors.wrap('supplied properties not correct for "CfnDestinationProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::Destination` resource
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::Destination` resource.
 */
// @ts-ignore TS6133
function cfnDestinationPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDestinationPropsValidator(properties).assertSuccess();
    return {
        DestinationName: cdk.stringToCloudFormation(properties.destinationName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
        DestinationPolicy: cdk.stringToCloudFormation(properties.destinationPolicy),
    };
}
// @ts-ignore TS6133
function CfnDestinationPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('destinationName', 'DestinationName', cfn_parse.FromCloudFormation.getString(properties.DestinationName));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('targetArn', 'TargetArn', cfn_parse.FromCloudFormation.getString(properties.TargetArn));
    ret.addPropertyResult('destinationPolicy', 'DestinationPolicy', properties.DestinationPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Logs::Destination`
 *
 * The AWS::Logs::Destination resource specifies a CloudWatch Logs destination. A destination encapsulates a physical resource (such as an Amazon Kinesis data stream) and enables you to subscribe that resource to a stream of log events.
 *
 * @cloudformationResource AWS::Logs::Destination
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html
 */
class CfnDestination extends cdk.CfnResource {
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
        const propsResult = CfnDestinationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDestination(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Create a new `AWS::Logs::Destination`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnDestination.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CfnDestinationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnDestination);
            }
            throw error;
        }
        cdk.requireProperty(props, 'destinationName', this);
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'targetArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.destinationName = props.destinationName;
        this.roleArn = props.roleArn;
        this.targetArn = props.targetArn;
        this.destinationPolicy = props.destinationPolicy;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDestination.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            destinationName: this.destinationName,
            roleArn: this.roleArn,
            targetArn: this.targetArn,
            destinationPolicy: this.destinationPolicy,
        };
    }
    renderProperties(props) {
        return cfnDestinationPropsToCloudFormation(props);
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnDestination[_a] = { fqn: "@aws-cdk/aws-logs.CfnDestination", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnDestination.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::Destination";
exports.CfnDestination = CfnDestination;
/**
 * Determine whether the given properties match those of a `CfnLogGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnLogGroupPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataProtectionPolicy', cdk.validateObject)(properties.dataProtectionPolicy));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('retentionInDays', cdk.validateNumber)(properties.retentionInDays));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLogGroupProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::LogGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnLogGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::LogGroup` resource.
 */
// @ts-ignore TS6133
function cfnLogGroupPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnLogGroupPropsValidator(properties).assertSuccess();
    return {
        DataProtectionPolicy: cdk.objectToCloudFormation(properties.dataProtectionPolicy),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        RetentionInDays: cdk.numberToCloudFormation(properties.retentionInDays),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnLogGroupPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('dataProtectionPolicy', 'DataProtectionPolicy', properties.DataProtectionPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DataProtectionPolicy) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('logGroupName', 'LogGroupName', properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined);
    ret.addPropertyResult('retentionInDays', 'RetentionInDays', properties.RetentionInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetentionInDays) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Logs::LogGroup`
 *
 * The `AWS::Logs::LogGroup` resource specifies a log group. A log group defines common properties for log streams, such as their retention and access control rules. Each log stream must belong to one log group.
 *
 * You can create up to 1,000,000 log groups per Region per account. You must use the following guidelines when naming a log group:
 *
 * - Log group names must be unique within a Region for an AWS account.
 * - Log group names can be between 1 and 512 characters long.
 * - Log group names consist of the following characters: a-z, A-Z, 0-9, '_' (underscore), '-' (hyphen), '/' (forward slash), and '.' (period).
 *
 * @cloudformationResource AWS::Logs::LogGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html
 */
class CfnLogGroup extends cdk.CfnResource {
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
        const propsResult = CfnLogGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLogGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Create a new `AWS::Logs::LogGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnLogGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CfnLogGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnLogGroup);
            }
            throw error;
        }
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.dataProtectionPolicy = props.dataProtectionPolicy;
        this.kmsKeyId = props.kmsKeyId;
        this.logGroupName = props.logGroupName;
        this.retentionInDays = props.retentionInDays;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Logs::LogGroup", props.tags, { tagPropertyName: 'tags' });
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
                    ? ['\'AWS::Logs::LogGroup\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
                    : [] });
        }
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            dataProtectionPolicy: this.dataProtectionPolicy,
            kmsKeyId: this.kmsKeyId,
            logGroupName: this.logGroupName,
            retentionInDays: this.retentionInDays,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnLogGroupPropsToCloudFormation(props);
    }
}
_b = JSII_RTTI_SYMBOL_1;
CfnLogGroup[_b] = { fqn: "@aws-cdk/aws-logs.CfnLogGroup", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnLogGroup.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::LogGroup";
exports.CfnLogGroup = CfnLogGroup;
/**
 * Determine whether the given properties match those of a `CfnLogStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogStreamProps`
 *
 * @returns the result of the validation.
 */
function CfnLogStreamPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logStreamName', cdk.validateString)(properties.logStreamName));
    return errors.wrap('supplied properties not correct for "CfnLogStreamProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::LogStream` resource
 *
 * @param properties - the TypeScript properties of a `CfnLogStreamProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::LogStream` resource.
 */
// @ts-ignore TS6133
function cfnLogStreamPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnLogStreamPropsValidator(properties).assertSuccess();
    return {
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        LogStreamName: cdk.stringToCloudFormation(properties.logStreamName),
    };
}
// @ts-ignore TS6133
function CfnLogStreamPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addPropertyResult('logStreamName', 'LogStreamName', properties.LogStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.LogStreamName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Logs::LogStream`
 *
 * The `AWS::Logs::LogStream` resource specifies an Amazon CloudWatch Logs log stream in a specific log group. A log stream represents the sequence of events coming from an application instance or resource that you are monitoring.
 *
 * There is no limit on the number of log streams that you can create for a log group.
 *
 * You must use the following guidelines when naming a log stream:
 *
 * - Log stream names must be unique within the log group.
 * - Log stream names can be between 1 and 512 characters long.
 * - The ':' (colon) and '*' (asterisk) characters are not allowed.
 *
 * @cloudformationResource AWS::Logs::LogStream
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html
 */
class CfnLogStream extends cdk.CfnResource {
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
        const propsResult = CfnLogStreamPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLogStream(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Create a new `AWS::Logs::LogStream`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnLogStream.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CfnLogStreamProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnLogStream);
            }
            throw error;
        }
        cdk.requireProperty(props, 'logGroupName', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.logGroupName = props.logGroupName;
        this.logStreamName = props.logStreamName;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogStream.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
        };
    }
    renderProperties(props) {
        return cfnLogStreamPropsToCloudFormation(props);
    }
}
_c = JSII_RTTI_SYMBOL_1;
CfnLogStream[_c] = { fqn: "@aws-cdk/aws-logs.CfnLogStream", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnLogStream.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::LogStream";
exports.CfnLogStream = CfnLogStream;
/**
 * Determine whether the given properties match those of a `CfnMetricFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnMetricFilterProps`
 *
 * @returns the result of the validation.
 */
function CfnMetricFilterPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filterName', cdk.validateString)(properties.filterName));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.requiredValidator)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.validateString)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('metricTransformations', cdk.requiredValidator)(properties.metricTransformations));
    errors.collect(cdk.propertyValidator('metricTransformations', cdk.listValidator(CfnMetricFilter_MetricTransformationPropertyValidator))(properties.metricTransformations));
    return errors.wrap('supplied properties not correct for "CfnMetricFilterProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::MetricFilter` resource
 *
 * @param properties - the TypeScript properties of a `CfnMetricFilterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::MetricFilter` resource.
 */
// @ts-ignore TS6133
function cfnMetricFilterPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnMetricFilterPropsValidator(properties).assertSuccess();
    return {
        FilterPattern: cdk.stringToCloudFormation(properties.filterPattern),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        MetricTransformations: cdk.listMapper(cfnMetricFilterMetricTransformationPropertyToCloudFormation)(properties.metricTransformations),
        FilterName: cdk.stringToCloudFormation(properties.filterName),
    };
}
// @ts-ignore TS6133
function CfnMetricFilterPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('filterPattern', 'FilterPattern', cfn_parse.FromCloudFormation.getString(properties.FilterPattern));
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addPropertyResult('metricTransformations', 'MetricTransformations', cfn_parse.FromCloudFormation.getArray(CfnMetricFilterMetricTransformationPropertyFromCloudFormation)(properties.MetricTransformations));
    ret.addPropertyResult('filterName', 'FilterName', properties.FilterName != null ? cfn_parse.FromCloudFormation.getString(properties.FilterName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Logs::MetricFilter`
 *
 * The `AWS::Logs::MetricFilter` resource specifies a metric filter that describes how CloudWatch Logs extracts information from logs and transforms it into Amazon CloudWatch metrics. If you have multiple metric filters that are associated with a log group, all the filters are applied to the log streams in that group.
 *
 * The maximum number of metric filters that can be associated with a log group is 100.
 *
 * @cloudformationResource AWS::Logs::MetricFilter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
 */
class CfnMetricFilter extends cdk.CfnResource {
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
        const propsResult = CfnMetricFilterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMetricFilter(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Create a new `AWS::Logs::MetricFilter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnMetricFilter.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CfnMetricFilterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnMetricFilter);
            }
            throw error;
        }
        cdk.requireProperty(props, 'filterPattern', this);
        cdk.requireProperty(props, 'logGroupName', this);
        cdk.requireProperty(props, 'metricTransformations', this);
        this.filterPattern = props.filterPattern;
        this.logGroupName = props.logGroupName;
        this.metricTransformations = props.metricTransformations;
        this.filterName = props.filterName;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMetricFilter.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            filterPattern: this.filterPattern,
            logGroupName: this.logGroupName,
            metricTransformations: this.metricTransformations,
            filterName: this.filterName,
        };
    }
    renderProperties(props) {
        return cfnMetricFilterPropsToCloudFormation(props);
    }
}
_d = JSII_RTTI_SYMBOL_1;
CfnMetricFilter[_d] = { fqn: "@aws-cdk/aws-logs.CfnMetricFilter", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnMetricFilter.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::MetricFilter";
exports.CfnMetricFilter = CfnMetricFilter;
/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnMetricFilter_DimensionPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "DimensionProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.Dimension` resource
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.Dimension` resource.
 */
// @ts-ignore TS6133
function cfnMetricFilterDimensionPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnMetricFilter_DimensionPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}
// @ts-ignore TS6133
function CfnMetricFilterDimensionPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `MetricTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricTransformationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMetricFilter_MetricTransformationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateNumber)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnMetricFilter_DimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricNamespace', cdk.requiredValidator)(properties.metricNamespace));
    errors.collect(cdk.propertyValidator('metricNamespace', cdk.validateString)(properties.metricNamespace));
    errors.collect(cdk.propertyValidator('metricValue', cdk.requiredValidator)(properties.metricValue));
    errors.collect(cdk.propertyValidator('metricValue', cdk.validateString)(properties.metricValue));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "MetricTransformationProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.MetricTransformation` resource
 *
 * @param properties - the TypeScript properties of a `MetricTransformationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.MetricTransformation` resource.
 */
// @ts-ignore TS6133
function cfnMetricFilterMetricTransformationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnMetricFilter_MetricTransformationPropertyValidator(properties).assertSuccess();
    return {
        DefaultValue: cdk.numberToCloudFormation(properties.defaultValue),
        Dimensions: cdk.listMapper(cfnMetricFilterDimensionPropertyToCloudFormation)(properties.dimensions),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        MetricNamespace: cdk.stringToCloudFormation(properties.metricNamespace),
        MetricValue: cdk.stringToCloudFormation(properties.metricValue),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}
// @ts-ignore TS6133
function CfnMetricFilterMetricTransformationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultValue) : undefined);
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnMetricFilterDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('metricNamespace', 'MetricNamespace', cfn_parse.FromCloudFormation.getString(properties.MetricNamespace));
    ret.addPropertyResult('metricValue', 'MetricValue', cfn_parse.FromCloudFormation.getString(properties.MetricValue));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnQueryDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnQueryDefinitionProps`
 *
 * @returns the result of the validation.
 */
function CfnQueryDefinitionPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupNames', cdk.listValidator(cdk.validateString))(properties.logGroupNames));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('queryString', cdk.requiredValidator)(properties.queryString));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateString)(properties.queryString));
    return errors.wrap('supplied properties not correct for "CfnQueryDefinitionProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::QueryDefinition` resource
 *
 * @param properties - the TypeScript properties of a `CfnQueryDefinitionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::QueryDefinition` resource.
 */
// @ts-ignore TS6133
function cfnQueryDefinitionPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnQueryDefinitionPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        QueryString: cdk.stringToCloudFormation(properties.queryString),
        LogGroupNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.logGroupNames),
    };
}
// @ts-ignore TS6133
function CfnQueryDefinitionPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('queryString', 'QueryString', cfn_parse.FromCloudFormation.getString(properties.QueryString));
    ret.addPropertyResult('logGroupNames', 'LogGroupNames', properties.LogGroupNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.LogGroupNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Logs::QueryDefinition`
 *
 * Creates a query definition for CloudWatch Logs Insights. For more information, see [Analyzing Log Data with CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) .
 *
 * @cloudformationResource AWS::Logs::QueryDefinition
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html
 */
class CfnQueryDefinition extends cdk.CfnResource {
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
        const propsResult = CfnQueryDefinitionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnQueryDefinition(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Create a new `AWS::Logs::QueryDefinition`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CfnQueryDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnQueryDefinition);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'queryString', this);
        this.attrQueryDefinitionId = cdk.Token.asString(this.getAtt('QueryDefinitionId', cdk.ResolutionTypeHint.STRING));
        this.name = props.name;
        this.queryString = props.queryString;
        this.logGroupNames = props.logGroupNames;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            queryString: this.queryString,
            logGroupNames: this.logGroupNames,
        };
    }
    renderProperties(props) {
        return cfnQueryDefinitionPropsToCloudFormation(props);
    }
}
_e = JSII_RTTI_SYMBOL_1;
CfnQueryDefinition[_e] = { fqn: "@aws-cdk/aws-logs.CfnQueryDefinition", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::QueryDefinition";
exports.CfnQueryDefinition = CfnQueryDefinition;
/**
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnResourcePolicyPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policyDocument', cdk.requiredValidator)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.validateString)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    return errors.wrap('supplied properties not correct for "CfnResourcePolicyProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::ResourcePolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::ResourcePolicy` resource.
 */
// @ts-ignore TS6133
function cfnResourcePolicyPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourcePolicyPropsValidator(properties).assertSuccess();
    return {
        PolicyDocument: cdk.stringToCloudFormation(properties.policyDocument),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
    };
}
// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('policyDocument', 'PolicyDocument', cfn_parse.FromCloudFormation.getString(properties.PolicyDocument));
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Logs::ResourcePolicy`
 *
 * Creates or updates a resource policy that allows other AWS services to put log events to this account. An account can have up to 10 resource policies per AWS Region.
 *
 * @cloudformationResource AWS::Logs::ResourcePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html
 */
class CfnResourcePolicy extends cdk.CfnResource {
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
        const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourcePolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Create a new `AWS::Logs::ResourcePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CfnResourcePolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnResourcePolicy);
            }
            throw error;
        }
        cdk.requireProperty(props, 'policyDocument', this);
        cdk.requireProperty(props, 'policyName', this);
        this.policyDocument = props.policyDocument;
        this.policyName = props.policyName;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            policyDocument: this.policyDocument,
            policyName: this.policyName,
        };
    }
    renderProperties(props) {
        return cfnResourcePolicyPropsToCloudFormation(props);
    }
}
_f = JSII_RTTI_SYMBOL_1;
CfnResourcePolicy[_f] = { fqn: "@aws-cdk/aws-logs.CfnResourcePolicy", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::ResourcePolicy";
exports.CfnResourcePolicy = CfnResourcePolicy;
/**
 * Determine whether the given properties match those of a `CfnSubscriptionFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionFilterProps`
 *
 * @returns the result of the validation.
 */
function CfnSubscriptionFilterPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationArn', cdk.requiredValidator)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('distribution', cdk.validateString)(properties.distribution));
    errors.collect(cdk.propertyValidator('filterName', cdk.validateString)(properties.filterName));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.requiredValidator)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.validateString)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CfnSubscriptionFilterProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::SubscriptionFilter` resource
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionFilterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::SubscriptionFilter` resource.
 */
// @ts-ignore TS6133
function cfnSubscriptionFilterPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSubscriptionFilterPropsValidator(properties).assertSuccess();
    return {
        DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
        FilterPattern: cdk.stringToCloudFormation(properties.filterPattern),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        Distribution: cdk.stringToCloudFormation(properties.distribution),
        FilterName: cdk.stringToCloudFormation(properties.filterName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}
// @ts-ignore TS6133
function CfnSubscriptionFilterPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('destinationArn', 'DestinationArn', cfn_parse.FromCloudFormation.getString(properties.DestinationArn));
    ret.addPropertyResult('filterPattern', 'FilterPattern', cfn_parse.FromCloudFormation.getString(properties.FilterPattern));
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addPropertyResult('distribution', 'Distribution', properties.Distribution != null ? cfn_parse.FromCloudFormation.getString(properties.Distribution) : undefined);
    ret.addPropertyResult('filterName', 'FilterName', properties.FilterName != null ? cfn_parse.FromCloudFormation.getString(properties.FilterName) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Logs::SubscriptionFilter`
 *
 * The `AWS::Logs::SubscriptionFilter` resource specifies a subscription filter and associates it with the specified log group. Subscription filters allow you to subscribe to a real-time stream of log events and have them delivered to a specific destination. Currently, the supported destinations are:
 *
 * - An Amazon Kinesis data stream belonging to the same account as the subscription filter, for same-account delivery.
 * - A logical destination that belongs to a different account, for cross-account delivery.
 * - An Amazon Kinesis Firehose delivery stream that belongs to the same account as the subscription filter, for same-account delivery.
 * - An AWS Lambda function that belongs to the same account as the subscription filter, for same-account delivery.
 *
 * There can be as many as two subscription filters associated with a log group.
 *
 * @cloudformationResource AWS::Logs::SubscriptionFilter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html
 */
class CfnSubscriptionFilter extends cdk.CfnResource {
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
        const propsResult = CfnSubscriptionFilterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSubscriptionFilter(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Create a new `AWS::Logs::SubscriptionFilter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CfnSubscriptionFilterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnSubscriptionFilter);
            }
            throw error;
        }
        cdk.requireProperty(props, 'destinationArn', this);
        cdk.requireProperty(props, 'filterPattern', this);
        cdk.requireProperty(props, 'logGroupName', this);
        this.destinationArn = props.destinationArn;
        this.filterPattern = props.filterPattern;
        this.logGroupName = props.logGroupName;
        this.distribution = props.distribution;
        this.filterName = props.filterName;
        this.roleArn = props.roleArn;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            destinationArn: this.destinationArn,
            filterPattern: this.filterPattern,
            logGroupName: this.logGroupName,
            distribution: this.distribution,
            filterName: this.filterName,
            roleArn: this.roleArn,
        };
    }
    renderProperties(props) {
        return cfnSubscriptionFilterPropsToCloudFormation(props);
    }
}
_g = JSII_RTTI_SYMBOL_1;
CfnSubscriptionFilter[_g] = { fqn: "@aws-cdk/aws-logs.CfnSubscriptionFilter", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::SubscriptionFilter";
exports.CfnSubscriptionFilter = CfnSubscriptionFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBeUNoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLDRCQUE0QixDQUFDLFVBQWU7SUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzVHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN6RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUM3RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLGlCQUFp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NkIsRUFBRSxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3BHLFNBQVMsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzlFO0lBRUQsSUFBdUIsYUFBYTtRQUNoQyxPQUFPO1lBQ0gsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ25DLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDeEIsQ0FBQztLQUNMO0lBRWtCLGdCQUFnQixDQUFDLEtBQTJCO1FBQzNELE9BQU8sMENBQTBDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUQ7Ozs7QUEvR0Q7O0dBRUc7QUFDb0IsNENBQXNCLEdBQUcsK0JBQStCLENBQUM7QUFKdkUsc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gR2VuZXJhdGVkIGZyb20gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBTcGVjaWZpY2F0aW9uXG4vLyBTZWU6IGRvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9jZm4tcmVzb3VyY2Utc3BlY2lmaWNhdGlvbi5odG1sXG4vLyBAY2ZuMnRzOm1ldGFAIHtcImdlbmVyYXRlZFwiOlwiMjAyMy0wMy0zMFQxMzo0NDoxNy43MDRaXCIsXCJmaW5nZXJwcmludFwiOlwieVROU3JBc25mV3lmMWp0cjU4L3JWNmpwbGJIanllOGNwZzJDWTNiSEQ0az1cIn1cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2ZuX3BhcnNlIGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkRlc3RpbmF0aW9uYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5EZXN0aW5hdGlvblByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBkZXN0aW5hdGlvbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtZGVzdGluYXRpb24uaHRtbCNjZm4tbG9ncy1kZXN0aW5hdGlvbi1kZXN0aW5hdGlvbm5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBkZXN0aW5hdGlvbk5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgYW4gSUFNIHJvbGUgdGhhdCBwZXJtaXRzIENsb3VkV2F0Y2ggTG9ncyB0byBzZW5kIGRhdGEgdG8gdGhlIHNwZWNpZmllZCBBV1MgcmVzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tcm9sZWFyblxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJvbGVBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcGh5c2ljYWwgdGFyZ2V0IHdoZXJlIHRoZSBsb2cgZXZlbnRzIGFyZSBkZWxpdmVyZWQgKGZvciBleGFtcGxlLCBhIEtpbmVzaXMgc3RyZWFtKS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtZGVzdGluYXRpb24uaHRtbCNjZm4tbG9ncy1kZXN0aW5hdGlvbi10YXJnZXRhcm5cbiAgICAgKi9cbiAgICByZWFkb25seSB0YXJnZXRBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFuIElBTSBwb2xpY3kgZG9jdW1lbnQgdGhhdCBnb3Zlcm5zIHdoaWNoIEFXUyBhY2NvdW50cyBjYW4gY3JlYXRlIHN1YnNjcmlwdGlvbiBmaWx0ZXJzIGFnYWluc3QgdGhpcyBkZXN0aW5hdGlvbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtZGVzdGluYXRpb24uaHRtbCNjZm4tbG9ncy1kZXN0aW5hdGlvbi1kZXN0aW5hdGlvbnBvbGljeVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRlc3RpbmF0aW9uUG9saWN5Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkRlc3RpbmF0aW9uUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRlc3RpbmF0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRGVzdGluYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc3RpbmF0aW9uTmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kZXN0aW5hdGlvbk5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc3RpbmF0aW9uTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kZXN0aW5hdGlvbk5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc3RpbmF0aW9uUG9saWN5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRlc3RpbmF0aW9uUG9saWN5KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyb2xlQXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJvbGVBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvbGVBcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucm9sZUFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFyZ2V0QXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnRhcmdldEFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFyZ2V0QXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnRhcmdldEFybikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5EZXN0aW5hdGlvblByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpEZXN0aW5hdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuRGVzdGluYXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6RGVzdGluYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRGVzdGluYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRGVzdGluYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVzdGluYXRpb25OYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRlc3RpbmF0aW9uTmFtZSksXG4gICAgICAgIFJvbGVBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucm9sZUFybiksXG4gICAgICAgIFRhcmdldEFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50YXJnZXRBcm4pLFxuICAgICAgICBEZXN0aW5hdGlvblBvbGljeTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZXN0aW5hdGlvblBvbGljeSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkRlc3RpbmF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5EZXN0aW5hdGlvblByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5EZXN0aW5hdGlvblByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGVzdGluYXRpb25OYW1lJywgJ0Rlc3RpbmF0aW9uTmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGVzdGluYXRpb25OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyb2xlQXJuJywgJ1JvbGVBcm4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJvbGVBcm4pKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RhcmdldEFybicsICdUYXJnZXRBcm4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlRhcmdldEFybikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGVzdGluYXRpb25Qb2xpY3knLCAnRGVzdGluYXRpb25Qb2xpY3knLCBwcm9wZXJ0aWVzLkRlc3RpbmF0aW9uUG9saWN5ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRlc3RpbmF0aW9uUG9saWN5KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpMb2dzOjpEZXN0aW5hdGlvbmBcbiAqXG4gKiBUaGUgQVdTOjpMb2dzOjpEZXN0aW5hdGlvbiByZXNvdXJjZSBzcGVjaWZpZXMgYSBDbG91ZFdhdGNoIExvZ3MgZGVzdGluYXRpb24uIEEgZGVzdGluYXRpb24gZW5jYXBzdWxhdGVzIGEgcGh5c2ljYWwgcmVzb3VyY2UgKHN1Y2ggYXMgYW4gQW1hem9uIEtpbmVzaXMgZGF0YSBzdHJlYW0pIGFuZCBlbmFibGVzIHlvdSB0byBzdWJzY3JpYmUgdGhhdCByZXNvdXJjZSB0byBhIHN0cmVhbSBvZiBsb2cgZXZlbnRzLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6TG9nczo6RGVzdGluYXRpb25cbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkRlc3RpbmF0aW9uIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6TG9nczo6RGVzdGluYXRpb25cIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5EZXN0aW5hdGlvbiB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuRGVzdGluYXRpb25Qcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuRGVzdGluYXRpb24oc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEFSTiBvZiB0aGUgQ2xvdWRXYXRjaCBMb2dzIGRlc3RpbmF0aW9uLCBzdWNoIGFzIGBhcm46YXdzOmxvZ3M6dXMtd2VzdC0xOjEyMzQ1Njc4OTAxMjpkZXN0aW5hdGlvbjpNeURlc3RpbmF0aW9uYCAuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZGVzdGluYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tZGVzdGluYXRpb25uYW1lXG4gICAgICovXG4gICAgcHVibGljIGRlc3RpbmF0aW9uTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFSTiBvZiBhbiBJQU0gcm9sZSB0aGF0IHBlcm1pdHMgQ2xvdWRXYXRjaCBMb2dzIHRvIHNlbmQgZGF0YSB0byB0aGUgc3BlY2lmaWVkIEFXUyByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtZGVzdGluYXRpb24uaHRtbCNjZm4tbG9ncy1kZXN0aW5hdGlvbi1yb2xlYXJuXG4gICAgICovXG4gICAgcHVibGljIHJvbGVBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcGh5c2ljYWwgdGFyZ2V0IHdoZXJlIHRoZSBsb2cgZXZlbnRzIGFyZSBkZWxpdmVyZWQgKGZvciBleGFtcGxlLCBhIEtpbmVzaXMgc3RyZWFtKS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtZGVzdGluYXRpb24uaHRtbCNjZm4tbG9ncy1kZXN0aW5hdGlvbi10YXJnZXRhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgdGFyZ2V0QXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBJQU0gcG9saWN5IGRvY3VtZW50IHRoYXQgZ292ZXJucyB3aGljaCBBV1MgYWNjb3VudHMgY2FuIGNyZWF0ZSBzdWJzY3JpcHRpb24gZmlsdGVycyBhZ2FpbnN0IHRoaXMgZGVzdGluYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tZGVzdGluYXRpb25wb2xpY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzdGluYXRpb25Qb2xpY3k6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpMb2dzOjpEZXN0aW5hdGlvbmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkRlc3RpbmF0aW9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkRlc3RpbmF0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnZGVzdGluYXRpb25OYW1lJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdyb2xlQXJuJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICd0YXJnZXRBcm4nLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25OYW1lID0gcHJvcHMuZGVzdGluYXRpb25OYW1lO1xuICAgICAgICB0aGlzLnJvbGVBcm4gPSBwcm9wcy5yb2xlQXJuO1xuICAgICAgICB0aGlzLnRhcmdldEFybiA9IHByb3BzLnRhcmdldEFybjtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvblBvbGljeSA9IHByb3BzLmRlc3RpbmF0aW9uUG9saWN5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuRGVzdGluYXRpb24uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uTmFtZTogdGhpcy5kZXN0aW5hdGlvbk5hbWUsXG4gICAgICAgICAgICByb2xlQXJuOiB0aGlzLnJvbGVBcm4sXG4gICAgICAgICAgICB0YXJnZXRBcm46IHRoaXMudGFyZ2V0QXJuLFxuICAgICAgICAgICAgZGVzdGluYXRpb25Qb2xpY3k6IHRoaXMuZGVzdGluYXRpb25Qb2xpY3ksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuRGVzdGluYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5Mb2dHcm91cGBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuTG9nR3JvdXBQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZGF0YSBwcm90ZWN0aW9uIHBvbGljeSBhbmQgYXNzaWducyBpdCB0byB0aGUgbG9nIGdyb3VwLiBBIGRhdGEgcHJvdGVjdGlvbiBwb2xpY3kgY2FuIGhlbHAgc2FmZWd1YXJkIHNlbnNpdGl2ZSBkYXRhIHRoYXQncyBpbmdlc3RlZCBieSB0aGUgbG9nIGdyb3VwIGJ5IGF1ZGl0aW5nIGFuZCBtYXNraW5nIHRoZSBzZW5zaXRpdmUgbG9nIGRhdGEuIFdoZW4gYSB1c2VyIHdobyBkb2VzIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gdmlldyBtYXNrZWQgZGF0YSB2aWV3cyBhIGxvZyBldmVudCB0aGF0IGluY2x1ZGVzIG1hc2tlZCBkYXRhLCB0aGUgc2Vuc2l0aXZlIGRhdGEgaXMgcmVwbGFjZWQgYnkgYXN0ZXJpc2tzLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIGluY2x1ZGluZyBhIGxpc3Qgb2YgdHlwZXMgb2YgZGF0YSB0aGF0IGNhbiBiZSBhdWRpdGVkIGFuZCBtYXNrZWQsIHNlZSBbUHJvdGVjdCBzZW5zaXRpdmUgbG9nIGRhdGEgd2l0aCBtYXNraW5nXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9tYXNrLXNlbnNpdGl2ZS1sb2ctZGF0YS5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWxvZ2dyb3VwLmh0bWwjY2ZuLWxvZ3MtbG9nZ3JvdXAtZGF0YXByb3RlY3Rpb25wb2xpY3lcbiAgICAgKi9cbiAgICByZWFkb25seSBkYXRhUHJvdGVjdGlvblBvbGljeT86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgQVdTIEtNUyBrZXkgdG8gdXNlIHdoZW4gZW5jcnlwdGluZyBsb2cgZGF0YS5cbiAgICAgKlxuICAgICAqIFRvIGFzc29jaWF0ZSBhbiBBV1MgS01TIGtleSB3aXRoIHRoZSBsb2cgZ3JvdXAsIHNwZWNpZnkgdGhlIEFSTiBvZiB0aGF0IEtNUyBrZXkgaGVyZS4gSWYgeW91IGRvIHNvLCBpbmdlc3RlZCBkYXRhIGlzIGVuY3J5cHRlZCB1c2luZyB0aGlzIGtleS4gVGhpcyBhc3NvY2lhdGlvbiBpcyBzdG9yZWQgYXMgbG9uZyBhcyB0aGUgZGF0YSBlbmNyeXB0ZWQgd2l0aCB0aGUgS01TIGtleSBpcyBzdGlsbCB3aXRoaW4gQ2xvdWRXYXRjaCBMb2dzIC4gVGhpcyBlbmFibGVzIENsb3VkV2F0Y2ggTG9ncyB0byBkZWNyeXB0IHRoaXMgZGF0YSB3aGVuZXZlciBpdCBpcyByZXF1ZXN0ZWQuXG4gICAgICpcbiAgICAgKiBJZiB5b3UgYXR0ZW1wdCB0byBhc3NvY2lhdGUgYSBLTVMga2V5IHdpdGggdGhlIGxvZyBncm91cCBidXQgdGhlIEtNUyBrZXkgZG9lc24ndCBleGlzdCBvciBpcyBkZWFjdGl2YXRlZCwgeW91IHdpbGwgcmVjZWl2ZSBhbiBgSW52YWxpZFBhcmFtZXRlckV4Y2VwdGlvbmAgZXJyb3IuXG4gICAgICpcbiAgICAgKiBMb2cgZ3JvdXAgZGF0YSBpcyBhbHdheXMgZW5jcnlwdGVkIGluIENsb3VkV2F0Y2ggTG9ncyAuIElmIHlvdSBvbWl0IHRoaXMga2V5LCB0aGUgZW5jcnlwdGlvbiBkb2VzIG5vdCB1c2UgQVdTIEtNUyAuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0VuY3J5cHQgbG9nIGRhdGEgaW4gQ2xvdWRXYXRjaCBMb2dzIHVzaW5nIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9lbmNyeXB0LWxvZy1kYXRhLWttcy5odG1sKVxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLWttc2tleWlkXG4gICAgICovXG4gICAgcmVhZG9ubHkga21zS2V5SWQ/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwLiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIG5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWUgSUQgZm9yIHRoZSBsb2cgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWxvZ2dyb3VwLmh0bWwjY2ZuLWxvZ3MtbG9nZ3JvdXAtbG9nZ3JvdXBuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbG9nR3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBkYXlzIHRvIHJldGFpbiB0aGUgbG9nIGV2ZW50cyBpbiB0aGUgc3BlY2lmaWVkIGxvZyBncm91cC4gUG9zc2libGUgdmFsdWVzIGFyZTogMSwgMywgNSwgNywgMTQsIDMwLCA2MCwgOTAsIDEyMCwgMTUwLCAxODAsIDM2NSwgNDAwLCA1NDUsIDczMSwgMTA5NiwgMTgyNywgMjE5MiwgMjU1NywgMjkyMiwgMzI4OCwgYW5kIDM2NTMuXG4gICAgICpcbiAgICAgKiBUbyBzZXQgYSBsb2cgZ3JvdXAgc28gdGhhdCBpdHMgbG9nIGV2ZW50cyBkbyBub3QgZXhwaXJlLCB1c2UgW0RlbGV0ZVJldGVudGlvblBvbGljeV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2hMb2dzL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX0RlbGV0ZVJldGVudGlvblBvbGljeS5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWxvZ2dyb3VwLmh0bWwjY2ZuLWxvZ3MtbG9nZ3JvdXAtcmV0ZW50aW9uaW5kYXlzXG4gICAgICovXG4gICAgcmVhZG9ubHkgcmV0ZW50aW9uSW5EYXlzPzogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2Yga2V5LXZhbHVlIHBhaXJzIHRvIGFwcGx5IHRvIHRoZSBsb2cgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtUYWddKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJlc291cmNlLXRhZ3MuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogY2RrLkNmblRhZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkxvZ0dyb3VwUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkxvZ0dyb3VwUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTG9nR3JvdXBQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RhdGFQcm90ZWN0aW9uUG9saWN5JywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLmRhdGFQcm90ZWN0aW9uUG9saWN5KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdrbXNLZXlJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5rbXNLZXlJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmV0ZW50aW9uSW5EYXlzJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLnJldGVudGlvbkluRGF5cykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFncycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZUNmblRhZykpKHByb3BlcnRpZXMudGFncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5Mb2dHcm91cFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpMb2dHcm91cGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuTG9nR3JvdXBQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TG9nR3JvdXBgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuTG9nR3JvdXBQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTG9nR3JvdXBQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGF0YVByb3RlY3Rpb25Qb2xpY3k6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGF0YVByb3RlY3Rpb25Qb2xpY3kpLFxuICAgICAgICBLbXNLZXlJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5rbXNLZXlJZCksXG4gICAgICAgIExvZ0dyb3VwTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5sb2dHcm91cE5hbWUpLFxuICAgICAgICBSZXRlbnRpb25JbkRheXM6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmV0ZW50aW9uSW5EYXlzKSxcbiAgICAgICAgVGFnczogY2RrLmxpc3RNYXBwZXIoY2RrLmNmblRhZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkxvZ0dyb3VwUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5Mb2dHcm91cFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5Mb2dHcm91cFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGF0YVByb3RlY3Rpb25Qb2xpY3knLCAnRGF0YVByb3RlY3Rpb25Qb2xpY3knLCBwcm9wZXJ0aWVzLkRhdGFQcm90ZWN0aW9uUG9saWN5ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFueShwcm9wZXJ0aWVzLkRhdGFQcm90ZWN0aW9uUG9saWN5KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdrbXNLZXlJZCcsICdLbXNLZXlJZCcsIHByb3BlcnRpZXMuS21zS2V5SWQgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuS21zS2V5SWQpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2xvZ0dyb3VwTmFtZScsICdMb2dHcm91cE5hbWUnLCBwcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Mb2dHcm91cE5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JldGVudGlvbkluRGF5cycsICdSZXRlbnRpb25JbkRheXMnLCBwcm9wZXJ0aWVzLlJldGVudGlvbkluRGF5cyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXROdW1iZXIocHJvcGVydGllcy5SZXRlbnRpb25JbkRheXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RhZ3MnLCAnVGFncycsIHByb3BlcnRpZXMuVGFncyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldENmblRhZykocHJvcGVydGllcy5UYWdzKSA6IHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6TG9nczo6TG9nR3JvdXBgXG4gKlxuICogVGhlIGBBV1M6OkxvZ3M6OkxvZ0dyb3VwYCByZXNvdXJjZSBzcGVjaWZpZXMgYSBsb2cgZ3JvdXAuIEEgbG9nIGdyb3VwIGRlZmluZXMgY29tbW9uIHByb3BlcnRpZXMgZm9yIGxvZyBzdHJlYW1zLCBzdWNoIGFzIHRoZWlyIHJldGVudGlvbiBhbmQgYWNjZXNzIGNvbnRyb2wgcnVsZXMuIEVhY2ggbG9nIHN0cmVhbSBtdXN0IGJlbG9uZyB0byBvbmUgbG9nIGdyb3VwLlxuICpcbiAqIFlvdSBjYW4gY3JlYXRlIHVwIHRvIDEsMDAwLDAwMCBsb2cgZ3JvdXBzIHBlciBSZWdpb24gcGVyIGFjY291bnQuIFlvdSBtdXN0IHVzZSB0aGUgZm9sbG93aW5nIGd1aWRlbGluZXMgd2hlbiBuYW1pbmcgYSBsb2cgZ3JvdXA6XG4gKlxuICogLSBMb2cgZ3JvdXAgbmFtZXMgbXVzdCBiZSB1bmlxdWUgd2l0aGluIGEgUmVnaW9uIGZvciBhbiBBV1MgYWNjb3VudC5cbiAqIC0gTG9nIGdyb3VwIG5hbWVzIGNhbiBiZSBiZXR3ZWVuIDEgYW5kIDUxMiBjaGFyYWN0ZXJzIGxvbmcuXG4gKiAtIExvZyBncm91cCBuYW1lcyBjb25zaXN0IG9mIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVyczogYS16LCBBLVosIDAtOSwgJ18nICh1bmRlcnNjb3JlKSwgJy0nIChoeXBoZW4pLCAnLycgKGZvcndhcmQgc2xhc2gpLCBhbmQgJy4nIChwZXJpb2QpLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6TG9nczo6TG9nR3JvdXBcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWxvZ2dyb3VwLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkxvZ0dyb3VwIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6TG9nczo6TG9nR3JvdXBcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5Mb2dHcm91cCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuTG9nR3JvdXBQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuTG9nR3JvdXAoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEFSTiBvZiB0aGUgbG9nIGdyb3VwLCBzdWNoIGFzIGBhcm46YXdzOmxvZ3M6dXMtd2VzdC0xOjEyMzQ1Njc4OTAxMjpsb2ctZ3JvdXA6L215c3RhY2stdGVzdGdyb3VwLTEyQUJDMUFCMTJBMToqYFxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBBcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGRhdGEgcHJvdGVjdGlvbiBwb2xpY3kgYW5kIGFzc2lnbnMgaXQgdG8gdGhlIGxvZyBncm91cC4gQSBkYXRhIHByb3RlY3Rpb24gcG9saWN5IGNhbiBoZWxwIHNhZmVndWFyZCBzZW5zaXRpdmUgZGF0YSB0aGF0J3MgaW5nZXN0ZWQgYnkgdGhlIGxvZyBncm91cCBieSBhdWRpdGluZyBhbmQgbWFza2luZyB0aGUgc2Vuc2l0aXZlIGxvZyBkYXRhLiBXaGVuIGEgdXNlciB3aG8gZG9lcyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIHZpZXcgbWFza2VkIGRhdGEgdmlld3MgYSBsb2cgZXZlbnQgdGhhdCBpbmNsdWRlcyBtYXNrZWQgZGF0YSwgdGhlIHNlbnNpdGl2ZSBkYXRhIGlzIHJlcGxhY2VkIGJ5IGFzdGVyaXNrcy5cbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBpbmNsdWRpbmcgYSBsaXN0IG9mIHR5cGVzIG9mIGRhdGEgdGhhdCBjYW4gYmUgYXVkaXRlZCBhbmQgbWFza2VkLCBzZWUgW1Byb3RlY3Qgc2Vuc2l0aXZlIGxvZyBkYXRhIHdpdGggbWFza2luZ10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvbWFzay1zZW5zaXRpdmUtbG9nLWRhdGEuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLWRhdGFwcm90ZWN0aW9ucG9saWN5XG4gICAgICovXG4gICAgcHVibGljIGRhdGFQcm90ZWN0aW9uUG9saWN5OiBhbnkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIEFXUyBLTVMga2V5IHRvIHVzZSB3aGVuIGVuY3J5cHRpbmcgbG9nIGRhdGEuXG4gICAgICpcbiAgICAgKiBUbyBhc3NvY2lhdGUgYW4gQVdTIEtNUyBrZXkgd2l0aCB0aGUgbG9nIGdyb3VwLCBzcGVjaWZ5IHRoZSBBUk4gb2YgdGhhdCBLTVMga2V5IGhlcmUuIElmIHlvdSBkbyBzbywgaW5nZXN0ZWQgZGF0YSBpcyBlbmNyeXB0ZWQgdXNpbmcgdGhpcyBrZXkuIFRoaXMgYXNzb2NpYXRpb24gaXMgc3RvcmVkIGFzIGxvbmcgYXMgdGhlIGRhdGEgZW5jcnlwdGVkIHdpdGggdGhlIEtNUyBrZXkgaXMgc3RpbGwgd2l0aGluIENsb3VkV2F0Y2ggTG9ncyAuIFRoaXMgZW5hYmxlcyBDbG91ZFdhdGNoIExvZ3MgdG8gZGVjcnlwdCB0aGlzIGRhdGEgd2hlbmV2ZXIgaXQgaXMgcmVxdWVzdGVkLlxuICAgICAqXG4gICAgICogSWYgeW91IGF0dGVtcHQgdG8gYXNzb2NpYXRlIGEgS01TIGtleSB3aXRoIHRoZSBsb2cgZ3JvdXAgYnV0IHRoZSBLTVMga2V5IGRvZXNuJ3QgZXhpc3Qgb3IgaXMgZGVhY3RpdmF0ZWQsIHlvdSB3aWxsIHJlY2VpdmUgYW4gYEludmFsaWRQYXJhbWV0ZXJFeGNlcHRpb25gIGVycm9yLlxuICAgICAqXG4gICAgICogTG9nIGdyb3VwIGRhdGEgaXMgYWx3YXlzIGVuY3J5cHRlZCBpbiBDbG91ZFdhdGNoIExvZ3MgLiBJZiB5b3Ugb21pdCB0aGlzIGtleSwgdGhlIGVuY3J5cHRpb24gZG9lcyBub3QgdXNlIEFXUyBLTVMgLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtFbmNyeXB0IGxvZyBkYXRhIGluIENsb3VkV2F0Y2ggTG9ncyB1c2luZyBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvZW5jcnlwdC1sb2ctZGF0YS1rbXMuaHRtbClcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNjZm4tbG9ncy1sb2dncm91cC1rbXNrZXlpZFxuICAgICAqL1xuICAgIHB1YmxpYyBrbXNLZXlJZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBncm91cC4gSWYgeW91IGRvbid0IHNwZWNpZnkgYSBuYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGEgdW5pcXVlIElEIGZvciB0aGUgbG9nIGdyb3VwLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLWxvZ2dyb3VwbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dHcm91cE5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgZGF5cyB0byByZXRhaW4gdGhlIGxvZyBldmVudHMgaW4gdGhlIHNwZWNpZmllZCBsb2cgZ3JvdXAuIFBvc3NpYmxlIHZhbHVlcyBhcmU6IDEsIDMsIDUsIDcsIDE0LCAzMCwgNjAsIDkwLCAxMjAsIDE1MCwgMTgwLCAzNjUsIDQwMCwgNTQ1LCA3MzEsIDEwOTYsIDE4MjcsIDIxOTIsIDI1NTcsIDI5MjIsIDMyODgsIGFuZCAzNjUzLlxuICAgICAqXG4gICAgICogVG8gc2V0IGEgbG9nIGdyb3VwIHNvIHRoYXQgaXRzIGxvZyBldmVudHMgZG8gbm90IGV4cGlyZSwgdXNlIFtEZWxldGVSZXRlbnRpb25Qb2xpY3ldKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoTG9ncy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9EZWxldGVSZXRlbnRpb25Qb2xpY3kuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLXJldGVudGlvbmluZGF5c1xuICAgICAqL1xuICAgIHB1YmxpYyByZXRlbnRpb25JbkRheXM6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGUgbG9nIGdyb3VwLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVGFnXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yZXNvdXJjZS10YWdzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNjZm4tbG9ncy1sb2dncm91cC10YWdzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkxvZ3M6OkxvZ0dyb3VwYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuTG9nR3JvdXBQcm9wcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5Mb2dHcm91cC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgdGhpcy5hdHRyQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMuZGF0YVByb3RlY3Rpb25Qb2xpY3kgPSBwcm9wcy5kYXRhUHJvdGVjdGlvblBvbGljeTtcbiAgICAgICAgdGhpcy5rbXNLZXlJZCA9IHByb3BzLmttc0tleUlkO1xuICAgICAgICB0aGlzLmxvZ0dyb3VwTmFtZSA9IHByb3BzLmxvZ0dyb3VwTmFtZTtcbiAgICAgICAgdGhpcy5yZXRlbnRpb25JbkRheXMgPSBwcm9wcy5yZXRlbnRpb25JbkRheXM7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OkxvZ3M6OkxvZ0dyb3VwXCIsIHByb3BzLnRhZ3MsIHsgdGFnUHJvcGVydHlOYW1lOiAndGFncycgfSk7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuc2NvcGUgJiYgY2RrLlJlc291cmNlLmlzUmVzb3VyY2UodGhpcy5ub2RlLnNjb3BlKSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy5jZm5PcHRpb25zLmRlbGV0aW9uUG9saWN5ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgPyBbJ1xcJ0FXUzo6TG9nczo6TG9nR3JvdXBcXCcgaXMgYSBzdGF0ZWZ1bCByZXNvdXJjZSB0eXBlLCBhbmQgeW91IG11c3Qgc3BlY2lmeSBhIFJlbW92YWwgUG9saWN5IGZvciBpdC4gQ2FsbCBcXCdyZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3koKVxcJy4nXVxuICAgICAgICAgICAgICA6IFtdIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5Mb2dHcm91cC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YVByb3RlY3Rpb25Qb2xpY3k6IHRoaXMuZGF0YVByb3RlY3Rpb25Qb2xpY3ksXG4gICAgICAgICAgICBrbXNLZXlJZDogdGhpcy5rbXNLZXlJZCxcbiAgICAgICAgICAgIGxvZ0dyb3VwTmFtZTogdGhpcy5sb2dHcm91cE5hbWUsXG4gICAgICAgICAgICByZXRlbnRpb25JbkRheXM6IHRoaXMucmV0ZW50aW9uSW5EYXlzLFxuICAgICAgICAgICAgdGFnczogdGhpcy50YWdzLnJlbmRlclRhZ3MoKSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5Mb2dHcm91cFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkxvZ1N0cmVhbWBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dzdHJlYW0uaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkxvZ1N0cmVhbVByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgd2hlcmUgdGhlIGxvZyBzdHJlYW0gaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nc3RyZWFtLmh0bWwjY2ZuLWxvZ3MtbG9nc3RyZWFtLWxvZ2dyb3VwbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGxvZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBzdHJlYW0uIFRoZSBuYW1lIG11c3QgYmUgdW5pcXVlIHdpdGhpbiB0aGUgbG9nIGdyb3VwLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dzdHJlYW0uaHRtbCNjZm4tbG9ncy1sb2dzdHJlYW0tbG9nc3RyZWFtbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGxvZ1N0cmVhbU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuTG9nU3RyZWFtUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkxvZ1N0cmVhbVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkxvZ1N0cmVhbVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nU3RyZWFtTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5sb2dTdHJlYW1OYW1lKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkxvZ1N0cmVhbVByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpMb2dTdHJlYW1gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkxvZ1N0cmVhbVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpMb2dTdHJlYW1gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuTG9nU3RyZWFtUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkxvZ1N0cmVhbVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBMb2dHcm91cE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubG9nR3JvdXBOYW1lKSxcbiAgICAgICAgTG9nU3RyZWFtTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5sb2dTdHJlYW1OYW1lKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuTG9nU3RyZWFtUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5Mb2dTdHJlYW1Qcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuTG9nU3RyZWFtUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdsb2dHcm91cE5hbWUnLCAnTG9nR3JvdXBOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Mb2dHcm91cE5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2xvZ1N0cmVhbU5hbWUnLCAnTG9nU3RyZWFtTmFtZScsIHByb3BlcnRpZXMuTG9nU3RyZWFtTmFtZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Mb2dTdHJlYW1OYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpMb2dzOjpMb2dTdHJlYW1gXG4gKlxuICogVGhlIGBBV1M6OkxvZ3M6OkxvZ1N0cmVhbWAgcmVzb3VyY2Ugc3BlY2lmaWVzIGFuIEFtYXpvbiBDbG91ZFdhdGNoIExvZ3MgbG9nIHN0cmVhbSBpbiBhIHNwZWNpZmljIGxvZyBncm91cC4gQSBsb2cgc3RyZWFtIHJlcHJlc2VudHMgdGhlIHNlcXVlbmNlIG9mIGV2ZW50cyBjb21pbmcgZnJvbSBhbiBhcHBsaWNhdGlvbiBpbnN0YW5jZSBvciByZXNvdXJjZSB0aGF0IHlvdSBhcmUgbW9uaXRvcmluZy5cbiAqXG4gKiBUaGVyZSBpcyBubyBsaW1pdCBvbiB0aGUgbnVtYmVyIG9mIGxvZyBzdHJlYW1zIHRoYXQgeW91IGNhbiBjcmVhdGUgZm9yIGEgbG9nIGdyb3VwLlxuICpcbiAqIFlvdSBtdXN0IHVzZSB0aGUgZm9sbG93aW5nIGd1aWRlbGluZXMgd2hlbiBuYW1pbmcgYSBsb2cgc3RyZWFtOlxuICpcbiAqIC0gTG9nIHN0cmVhbSBuYW1lcyBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIGxvZyBncm91cC5cbiAqIC0gTG9nIHN0cmVhbSBuYW1lcyBjYW4gYmUgYmV0d2VlbiAxIGFuZCA1MTIgY2hhcmFjdGVycyBsb25nLlxuICogLSBUaGUgJzonIChjb2xvbikgYW5kICcqJyAoYXN0ZXJpc2spIGNoYXJhY3RlcnMgYXJlIG5vdCBhbGxvd2VkLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6TG9nczo6TG9nU3RyZWFtXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dzdHJlYW0uaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuTG9nU3RyZWFtIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6TG9nczo6TG9nU3RyZWFtXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuTG9nU3RyZWFtIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5Mb2dTdHJlYW1Qcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuTG9nU3RyZWFtKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIElkXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBncm91cCB3aGVyZSB0aGUgbG9nIHN0cmVhbSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dzdHJlYW0uaHRtbCNjZm4tbG9ncy1sb2dzdHJlYW0tbG9nZ3JvdXBuYW1lXG4gICAgICovXG4gICAgcHVibGljIGxvZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBzdHJlYW0uIFRoZSBuYW1lIG11c3QgYmUgdW5pcXVlIHdpdGhpbiB0aGUgbG9nIGdyb3VwLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dzdHJlYW0uaHRtbCNjZm4tbG9ncy1sb2dzdHJlYW0tbG9nc3RyZWFtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dTdHJlYW1OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6TG9nczo6TG9nU3RyZWFtYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuTG9nU3RyZWFtUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkxvZ1N0cmVhbS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2xvZ0dyb3VwTmFtZScsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJJZCA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnSWQnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMubG9nR3JvdXBOYW1lID0gcHJvcHMubG9nR3JvdXBOYW1lO1xuICAgICAgICB0aGlzLmxvZ1N0cmVhbU5hbWUgPSBwcm9wcy5sb2dTdHJlYW1OYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuTG9nU3RyZWFtLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2dHcm91cE5hbWU6IHRoaXMubG9nR3JvdXBOYW1lLFxuICAgICAgICAgICAgbG9nU3RyZWFtTmFtZTogdGhpcy5sb2dTdHJlYW1OYW1lLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkxvZ1N0cmVhbVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbk1ldHJpY0ZpbHRlcmBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbk1ldHJpY0ZpbHRlclByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIEEgZmlsdGVyIHBhdHRlcm4gZm9yIGV4dHJhY3RpbmcgbWV0cmljIGRhdGEgb3V0IG9mIGluZ2VzdGVkIGxvZyBldmVudHMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0ZpbHRlciBhbmQgUGF0dGVybiBTeW50YXhdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0ZpbHRlckFuZFBhdHRlcm5TeW50YXguaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItZmlsdGVycGF0dGVyblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGZpbHRlclBhdHRlcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIGFuIGV4aXN0aW5nIGxvZyBncm91cCB0aGF0IHlvdSB3YW50IHRvIGFzc29jaWF0ZSB3aXRoIHRoaXMgbWV0cmljIGZpbHRlci5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLWxvZ2dyb3VwbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGxvZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1ldHJpYyB0cmFuc2Zvcm1hdGlvbnMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLW1ldHJpY2ZpbHRlci5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbnNcbiAgICAgKi9cbiAgICByZWFkb25seSBtZXRyaWNUcmFuc2Zvcm1hdGlvbnM6IEFycmF5PENmbk1ldHJpY0ZpbHRlci5NZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBtZXRyaWMgZmlsdGVyLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItZmlsdGVybmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGZpbHRlck5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuTWV0cmljRmlsdGVyUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbk1ldHJpY0ZpbHRlclByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbk1ldHJpY0ZpbHRlclByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5maWx0ZXJOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJQYXR0ZXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmZpbHRlclBhdHRlcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpbHRlclBhdHRlcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZmlsdGVyUGF0dGVybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljVHJhbnNmb3JtYXRpb25zJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm1ldHJpY1RyYW5zZm9ybWF0aW9ucykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljVHJhbnNmb3JtYXRpb25zJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuTWV0cmljRmlsdGVyX01ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlWYWxpZGF0b3IpKShwcm9wZXJ0aWVzLm1ldHJpY1RyYW5zZm9ybWF0aW9ucykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5NZXRyaWNGaWx0ZXJQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5NZXRyaWNGaWx0ZXJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbk1ldHJpY0ZpbHRlclByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5NZXRyaWNGaWx0ZXJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRmlsdGVyUGF0dGVybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5maWx0ZXJQYXR0ZXJuKSxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSksXG4gICAgICAgIE1ldHJpY1RyYW5zZm9ybWF0aW9uczogY2RrLmxpc3RNYXBwZXIoY2ZuTWV0cmljRmlsdGVyTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMubWV0cmljVHJhbnNmb3JtYXRpb25zKSxcbiAgICAgICAgRmlsdGVyTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5maWx0ZXJOYW1lKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuTWV0cmljRmlsdGVyUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5NZXRyaWNGaWx0ZXJQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuTWV0cmljRmlsdGVyUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdmaWx0ZXJQYXR0ZXJuJywgJ0ZpbHRlclBhdHRlcm4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkZpbHRlclBhdHRlcm4pKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2xvZ0dyb3VwTmFtZScsICdMb2dHcm91cE5hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbWV0cmljVHJhbnNmb3JtYXRpb25zJywgJ01ldHJpY1RyYW5zZm9ybWF0aW9ucycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuTWV0cmljRmlsdGVyTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5NZXRyaWNUcmFuc2Zvcm1hdGlvbnMpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ZpbHRlck5hbWUnLCAnRmlsdGVyTmFtZScsIHByb3BlcnRpZXMuRmlsdGVyTmFtZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5GaWx0ZXJOYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpMb2dzOjpNZXRyaWNGaWx0ZXJgXG4gKlxuICogVGhlIGBBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlcmAgcmVzb3VyY2Ugc3BlY2lmaWVzIGEgbWV0cmljIGZpbHRlciB0aGF0IGRlc2NyaWJlcyBob3cgQ2xvdWRXYXRjaCBMb2dzIGV4dHJhY3RzIGluZm9ybWF0aW9uIGZyb20gbG9ncyBhbmQgdHJhbnNmb3JtcyBpdCBpbnRvIEFtYXpvbiBDbG91ZFdhdGNoIG1ldHJpY3MuIElmIHlvdSBoYXZlIG11bHRpcGxlIG1ldHJpYyBmaWx0ZXJzIHRoYXQgYXJlIGFzc29jaWF0ZWQgd2l0aCBhIGxvZyBncm91cCwgYWxsIHRoZSBmaWx0ZXJzIGFyZSBhcHBsaWVkIHRvIHRoZSBsb2cgc3RyZWFtcyBpbiB0aGF0IGdyb3VwLlxuICpcbiAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBtZXRyaWMgZmlsdGVycyB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBsb2cgZ3JvdXAgaXMgMTAwLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6TG9nczo6TWV0cmljRmlsdGVyXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuTWV0cmljRmlsdGVyIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6TG9nczo6TWV0cmljRmlsdGVyXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuTWV0cmljRmlsdGVyIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5NZXRyaWNGaWx0ZXJQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuTWV0cmljRmlsdGVyKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZmlsdGVyIHBhdHRlcm4gZm9yIGV4dHJhY3RpbmcgbWV0cmljIGRhdGEgb3V0IG9mIGluZ2VzdGVkIGxvZyBldmVudHMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0ZpbHRlciBhbmQgUGF0dGVybiBTeW50YXhdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0ZpbHRlckFuZFBhdHRlcm5TeW50YXguaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItZmlsdGVycGF0dGVyblxuICAgICAqL1xuICAgIHB1YmxpYyBmaWx0ZXJQYXR0ZXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiBhbiBleGlzdGluZyBsb2cgZ3JvdXAgdGhhdCB5b3Ugd2FudCB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIG1ldHJpYyBmaWx0ZXIuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLW1ldHJpY2ZpbHRlci5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1sb2dncm91cG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWV0cmljIHRyYW5zZm9ybWF0aW9ucy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uc1xuICAgICAqL1xuICAgIHB1YmxpYyBtZXRyaWNUcmFuc2Zvcm1hdGlvbnM6IEFycmF5PENmbk1ldHJpY0ZpbHRlci5NZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBtZXRyaWMgZmlsdGVyLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItZmlsdGVybmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBmaWx0ZXJOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuTWV0cmljRmlsdGVyUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbk1ldHJpY0ZpbHRlci5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2ZpbHRlclBhdHRlcm4nLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2xvZ0dyb3VwTmFtZScsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbWV0cmljVHJhbnNmb3JtYXRpb25zJywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5maWx0ZXJQYXR0ZXJuID0gcHJvcHMuZmlsdGVyUGF0dGVybjtcbiAgICAgICAgdGhpcy5sb2dHcm91cE5hbWUgPSBwcm9wcy5sb2dHcm91cE5hbWU7XG4gICAgICAgIHRoaXMubWV0cmljVHJhbnNmb3JtYXRpb25zID0gcHJvcHMubWV0cmljVHJhbnNmb3JtYXRpb25zO1xuICAgICAgICB0aGlzLmZpbHRlck5hbWUgPSBwcm9wcy5maWx0ZXJOYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuTWV0cmljRmlsdGVyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWx0ZXJQYXR0ZXJuOiB0aGlzLmZpbHRlclBhdHRlcm4sXG4gICAgICAgICAgICBsb2dHcm91cE5hbWU6IHRoaXMubG9nR3JvdXBOYW1lLFxuICAgICAgICAgICAgbWV0cmljVHJhbnNmb3JtYXRpb25zOiB0aGlzLm1ldHJpY1RyYW5zZm9ybWF0aW9ucyxcbiAgICAgICAgICAgIGZpbHRlck5hbWU6IHRoaXMuZmlsdGVyTmFtZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5NZXRyaWNGaWx0ZXJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5NZXRyaWNGaWx0ZXIge1xuICAgIC8qKlxuICAgICAqIFNwZWNpZmllcyB0aGUgQ2xvdWRXYXRjaCBtZXRyaWMgZGltZW5zaW9ucyB0byBwdWJsaXNoIHdpdGggdGhpcyBtZXRyaWMuXG4gICAgICpcbiAgICAgKiBCZWNhdXNlIGRpbWVuc2lvbnMgYXJlIHBhcnQgb2YgdGhlIHVuaXF1ZSBpZGVudGlmaWVyIGZvciBhIG1ldHJpYywgd2hlbmV2ZXIgYSB1bmlxdWUgZGltZW5zaW9uIG5hbWUvdmFsdWUgcGFpciBpcyBleHRyYWN0ZWQgZnJvbSB5b3VyIGxvZ3MsIHlvdSBhcmUgY3JlYXRpbmcgYSBuZXcgdmFyaWF0aW9uIG9mIHRoYXQgbWV0cmljLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgcHVibGlzaGluZyBkaW1lbnNpb25zIHdpdGggbWV0cmljcyBjcmVhdGVkIGJ5IG1ldHJpYyBmaWx0ZXJzLCBzZWUgW1B1Ymxpc2hpbmcgZGltZW5zaW9ucyB3aXRoIG1ldHJpY3MgZnJvbSB2YWx1ZXMgaW4gSlNPTiBvciBzcGFjZS1kZWxpbWl0ZWQgbG9nIGV2ZW50c10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvRmlsdGVyQW5kUGF0dGVyblN5bnRheC5odG1sI2xvZ3MtbWV0cmljLWZpbHRlcnMtZGltZW5zaW9ucykgLlxuICAgICAqXG4gICAgICogPiBNZXRyaWNzIGV4dHJhY3RlZCBmcm9tIGxvZyBldmVudHMgYXJlIGNoYXJnZWQgYXMgY3VzdG9tIG1ldHJpY3MuIFRvIHByZXZlbnQgdW5leHBlY3RlZCBoaWdoIGNoYXJnZXMsIGRvIG5vdCBzcGVjaWZ5IGhpZ2gtY2FyZGluYWxpdHkgZmllbGRzIHN1Y2ggYXMgYElQQWRkcmVzc2Agb3IgYHJlcXVlc3RJRGAgYXMgZGltZW5zaW9ucy4gRWFjaCBkaWZmZXJlbnQgdmFsdWUgZm91bmQgZm9yIGEgZGltZW5zaW9uIGlzIHRyZWF0ZWQgYXMgYSBzZXBhcmF0ZSBtZXRyaWMgYW5kIGFjY3J1ZXMgY2hhcmdlcyBhcyBhIHNlcGFyYXRlIGN1c3RvbSBtZXRyaWMuXG4gICAgICogPlxuICAgICAqID4gVG8gaGVscCBwcmV2ZW50IGFjY2lkZW50YWwgaGlnaCBjaGFyZ2VzLCBBbWF6b24gZGlzYWJsZXMgYSBtZXRyaWMgZmlsdGVyIGlmIGl0IGdlbmVyYXRlcyAxMDAwIGRpZmZlcmVudCBuYW1lL3ZhbHVlIHBhaXJzIGZvciB0aGUgZGltZW5zaW9ucyB0aGF0IHlvdSBoYXZlIHNwZWNpZmllZCB3aXRoaW4gYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lLlxuICAgICAqID5cbiAgICAgKiA+IFlvdSBjYW4gYWxzbyBzZXQgdXAgYSBiaWxsaW5nIGFsYXJtIHRvIGFsZXJ0IHlvdSBpZiB5b3VyIGNoYXJnZXMgYXJlIGhpZ2hlciB0aGFuIGV4cGVjdGVkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtDcmVhdGluZyBhIEJpbGxpbmcgQWxhcm0gdG8gTW9uaXRvciBZb3VyIEVzdGltYXRlZCBBV1MgQ2hhcmdlc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvbW9uaXRvcl9lc3RpbWF0ZWRfY2hhcmdlc193aXRoX2Nsb3Vkd2F0Y2guaHRtbCkgLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItZGltZW5zaW9uLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIERpbWVuc2lvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBuYW1lIGZvciB0aGUgQ2xvdWRXYXRjaCBtZXRyaWMgZGltZW5zaW9uIHRoYXQgdGhlIG1ldHJpYyBmaWx0ZXIgY3JlYXRlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogRGltZW5zaW9uIG5hbWVzIG11c3QgY29udGFpbiBvbmx5IEFTQ0lJIGNoYXJhY3RlcnMsIG11c3QgaW5jbHVkZSBhdCBsZWFzdCBvbmUgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyLCBhbmQgY2Fubm90IHN0YXJ0IHdpdGggYSBjb2xvbiAoOikuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItZGltZW5zaW9uLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLWRpbWVuc2lvbi1rZXlcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGtleTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGxvZyBldmVudCBmaWVsZCB0aGF0IHdpbGwgY29udGFpbiB0aGUgdmFsdWUgZm9yIHRoaXMgZGltZW5zaW9uLiBUaGlzIGRpbWVuc2lvbiB3aWxsIG9ubHkgYmUgcHVibGlzaGVkIGZvciBhIG1ldHJpYyBpZiB0aGUgdmFsdWUgaXMgZm91bmQgaW4gdGhlIGxvZyBldmVudC4gRm9yIGV4YW1wbGUsIGAkLmV2ZW50VHlwZWAgZm9yIEpTT04gbG9nIGV2ZW50cywgb3IgYCRzZXJ2ZXJgIGZvciBzcGFjZS1kZWxpbWl0ZWQgbG9nIGV2ZW50cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1sb2dzLW1ldHJpY2ZpbHRlci1kaW1lbnNpb24uaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItZGltZW5zaW9uLXZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB2YWx1ZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBEaW1lbnNpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRGltZW5zaW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTWV0cmljRmlsdGVyX0RpbWVuc2lvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmFsdWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudmFsdWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZhbHVlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnZhbHVlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkRpbWVuc2lvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpNZXRyaWNGaWx0ZXIuRGltZW5zaW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBEaW1lbnNpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyLkRpbWVuc2lvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5NZXRyaWNGaWx0ZXJEaW1lbnNpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTWV0cmljRmlsdGVyX0RpbWVuc2lvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBLZXk6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua2V5KSxcbiAgICAgICAgVmFsdWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudmFsdWUpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5NZXRyaWNGaWx0ZXJEaW1lbnNpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbk1ldHJpY0ZpbHRlci5EaW1lbnNpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5NZXRyaWNGaWx0ZXIuRGltZW5zaW9uUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdrZXknLCAnS2V5JywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5LZXkpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ZhbHVlJywgJ1ZhbHVlJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5WYWx1ZSkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbk1ldHJpY0ZpbHRlciB7XG4gICAgLyoqXG4gICAgICogYE1ldHJpY1RyYW5zZm9ybWF0aW9uYCBpcyBhIHByb3BlcnR5IG9mIHRoZSBgQVdTOjpMb2dzOjpNZXRyaWNGaWx0ZXJgIHJlc291cmNlIHRoYXQgZGVzY3JpYmVzIGhvdyB0byB0cmFuc2Zvcm0gbG9nIHN0cmVhbXMgaW50byBhIENsb3VkV2F0Y2ggbWV0cmljLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24uaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAoT3B0aW9uYWwpIFRoZSB2YWx1ZSB0byBlbWl0IHdoZW4gYSBmaWx0ZXIgcGF0dGVybiBkb2VzIG5vdCBtYXRjaCBhIGxvZyBldmVudC4gVGhpcyB2YWx1ZSBjYW4gYmUgbnVsbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi1kZWZhdWx0dmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGRlZmF1bHRWYWx1ZT86IG51bWJlcjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBmaWVsZHMgdG8gdXNlIGFzIGRpbWVuc2lvbnMgZm9yIHRoZSBtZXRyaWMuIE9uZSBtZXRyaWMgZmlsdGVyIGNhbiBpbmNsdWRlIGFzIG1hbnkgYXMgdGhyZWUgZGltZW5zaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogPiBNZXRyaWNzIGV4dHJhY3RlZCBmcm9tIGxvZyBldmVudHMgYXJlIGNoYXJnZWQgYXMgY3VzdG9tIG1ldHJpY3MuIFRvIHByZXZlbnQgdW5leHBlY3RlZCBoaWdoIGNoYXJnZXMsIGRvIG5vdCBzcGVjaWZ5IGhpZ2gtY2FyZGluYWxpdHkgZmllbGRzIHN1Y2ggYXMgYElQQWRkcmVzc2Agb3IgYHJlcXVlc3RJRGAgYXMgZGltZW5zaW9ucy4gRWFjaCBkaWZmZXJlbnQgdmFsdWUgZm91bmQgZm9yIGEgZGltZW5zaW9uIGlzIHRyZWF0ZWQgYXMgYSBzZXBhcmF0ZSBtZXRyaWMgYW5kIGFjY3J1ZXMgY2hhcmdlcyBhcyBhIHNlcGFyYXRlIGN1c3RvbSBtZXRyaWMuXG4gICAgICAgICAqID5cbiAgICAgICAgICogPiBDbG91ZFdhdGNoIExvZ3MgZGlzYWJsZXMgYSBtZXRyaWMgZmlsdGVyIGlmIGl0IGdlbmVyYXRlcyAxMDAwIGRpZmZlcmVudCBuYW1lL3ZhbHVlIHBhaXJzIGZvciB5b3VyIHNwZWNpZmllZCBkaW1lbnNpb25zIHdpdGhpbiBhIGNlcnRhaW4gYW1vdW50IG9mIHRpbWUuIFRoaXMgaGVscHMgdG8gcHJldmVudCBhY2NpZGVudGFsIGhpZ2ggY2hhcmdlcy5cbiAgICAgICAgICogPlxuICAgICAgICAgKiA+IFlvdSBjYW4gYWxzbyBzZXQgdXAgYSBiaWxsaW5nIGFsYXJtIHRvIGFsZXJ0IHlvdSBpZiB5b3VyIGNoYXJnZXMgYXJlIGhpZ2hlciB0aGFuIGV4cGVjdGVkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtDcmVhdGluZyBhIEJpbGxpbmcgQWxhcm0gdG8gTW9uaXRvciBZb3VyIEVzdGltYXRlZCBBV1MgQ2hhcmdlc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvbW9uaXRvcl9lc3RpbWF0ZWRfY2hhcmdlc193aXRoX2Nsb3Vkd2F0Y2guaHRtbCkgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLWRpbWVuc2lvbnNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGRpbWVuc2lvbnM/OiBBcnJheTxDZm5NZXRyaWNGaWx0ZXIuRGltZW5zaW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG5hbWUgb2YgdGhlIENsb3VkV2F0Y2ggbWV0cmljLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLW1ldHJpY25hbWVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IG1ldHJpY05hbWU6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgY3VzdG9tIG5hbWVzcGFjZSB0byBjb250YWluIHlvdXIgbWV0cmljIGluIENsb3VkV2F0Y2guIFVzZSBuYW1lc3BhY2VzIHRvIGdyb3VwIHRvZ2V0aGVyIG1ldHJpY3MgdGhhdCBhcmUgc2ltaWxhci4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbTmFtZXNwYWNlc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvY2xvdWR3YXRjaF9jb25jZXB0cy5odG1sI05hbWVzcGFjZSkgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLW1ldHJpY25hbWVzcGFjZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgbWV0cmljTmFtZXNwYWNlOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdmFsdWUgdGhhdCBpcyBwdWJsaXNoZWQgdG8gdGhlIENsb3VkV2F0Y2ggbWV0cmljLiBGb3IgZXhhbXBsZSwgaWYgeW91J3JlIGNvdW50aW5nIHRoZSBvY2N1cnJlbmNlcyBvZiBhIHBhcnRpY3VsYXIgdGVybSBsaWtlIGBFcnJvcmAgLCBzcGVjaWZ5IDEgZm9yIHRoZSBtZXRyaWMgdmFsdWUuIElmIHlvdSdyZSBjb3VudGluZyB0aGUgbnVtYmVyIG9mIGJ5dGVzIHRyYW5zZmVycmVkLCByZWZlcmVuY2UgdGhlIHZhbHVlIHRoYXQgaXMgaW4gdGhlIGxvZyBldmVudCBieSB1c2luZyAkLiBmb2xsb3dlZCBieSB0aGUgbmFtZSBvZiB0aGUgZmllbGQgdGhhdCB5b3Ugc3BlY2lmaWVkIGluIHRoZSBmaWx0ZXIgcGF0dGVybiwgc3VjaCBhcyBgJC5zaXplYCAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24uaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24tbWV0cmljdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IG1ldHJpY1ZhbHVlOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdW5pdCB0byBhc3NpZ24gdG8gdGhlIG1ldHJpYy4gSWYgeW91IG9taXQgdGhpcywgdGhlIHVuaXQgaXMgc2V0IGFzIGBOb25lYCAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24uaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24tdW5pdFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdW5pdD86IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5NZXRyaWNGaWx0ZXJfTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RlZmF1bHRWYWx1ZScsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy5kZWZhdWx0VmFsdWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RpbWVuc2lvbnMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5NZXRyaWNGaWx0ZXJfRGltZW5zaW9uUHJvcGVydHlWYWxpZGF0b3IpKShwcm9wZXJ0aWVzLmRpbWVuc2lvbnMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY05hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubWV0cmljTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5tZXRyaWNOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdtZXRyaWNOYW1lc3BhY2UnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubWV0cmljTmFtZXNwYWNlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdtZXRyaWNOYW1lc3BhY2UnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubWV0cmljTmFtZXNwYWNlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdtZXRyaWNWYWx1ZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5tZXRyaWNWYWx1ZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljVmFsdWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubWV0cmljVmFsdWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3VuaXQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudW5pdCkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJNZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpNZXRyaWNGaWx0ZXIuTWV0cmljVHJhbnNmb3JtYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYE1ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlci5NZXRyaWNUcmFuc2Zvcm1hdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5NZXRyaWNGaWx0ZXJNZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5NZXRyaWNGaWx0ZXJfTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVmYXVsdFZhbHVlOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRlZmF1bHRWYWx1ZSksXG4gICAgICAgIERpbWVuc2lvbnM6IGNkay5saXN0TWFwcGVyKGNmbk1ldHJpY0ZpbHRlckRpbWVuc2lvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5kaW1lbnNpb25zKSxcbiAgICAgICAgTWV0cmljTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5tZXRyaWNOYW1lKSxcbiAgICAgICAgTWV0cmljTmFtZXNwYWNlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm1ldHJpY05hbWVzcGFjZSksXG4gICAgICAgIE1ldHJpY1ZhbHVlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm1ldHJpY1ZhbHVlKSxcbiAgICAgICAgVW5pdDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy51bml0KSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuTWV0cmljRmlsdGVyTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbk1ldHJpY0ZpbHRlci5NZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbk1ldHJpY0ZpbHRlci5NZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGVmYXVsdFZhbHVlJywgJ0RlZmF1bHRWYWx1ZScsIHByb3BlcnRpZXMuRGVmYXVsdFZhbHVlICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLkRlZmF1bHRWYWx1ZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGltZW5zaW9ucycsICdEaW1lbnNpb25zJywgcHJvcGVydGllcy5EaW1lbnNpb25zICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmbk1ldHJpY0ZpbHRlckRpbWVuc2lvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLkRpbWVuc2lvbnMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ21ldHJpY05hbWUnLCAnTWV0cmljTmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTWV0cmljTmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbWV0cmljTmFtZXNwYWNlJywgJ01ldHJpY05hbWVzcGFjZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTWV0cmljTmFtZXNwYWNlKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdtZXRyaWNWYWx1ZScsICdNZXRyaWNWYWx1ZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTWV0cmljVmFsdWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3VuaXQnLCAnVW5pdCcsIHByb3BlcnRpZXMuVW5pdCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Vbml0KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuUXVlcnlEZWZpbml0aW9uYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUXVlcnlEZWZpbml0aW9uUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBuYW1lIGZvciB0aGUgcXVlcnkgZGVmaW5pdGlvbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtcXVlcnlkZWZpbml0aW9uLmh0bWwjY2ZuLWxvZ3MtcXVlcnlkZWZpbml0aW9uLW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcXVlcnkgc3RyaW5nIHRvIHVzZSBmb3IgdGhpcyBxdWVyeSBkZWZpbml0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtDbG91ZFdhdGNoIExvZ3MgSW5zaWdodHMgUXVlcnkgU3ludGF4XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9DV0xfUXVlcnlTeW50YXguaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1xdWVyeWRlZmluaXRpb24uaHRtbCNjZm4tbG9ncy1xdWVyeWRlZmluaXRpb24tcXVlcnlzdHJpbmdcbiAgICAgKi9cbiAgICByZWFkb25seSBxdWVyeVN0cmluZzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVXNlIHRoaXMgcGFyYW1ldGVyIGlmIHlvdSB3YW50IHRoZSBxdWVyeSB0byBxdWVyeSBvbmx5IGNlcnRhaW4gbG9nIGdyb3Vwcy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtcXVlcnlkZWZpbml0aW9uLmh0bWwjY2ZuLWxvZ3MtcXVlcnlkZWZpbml0aW9uLWxvZ2dyb3VwbmFtZXNcbiAgICAgKi9cbiAgICByZWFkb25seSBsb2dHcm91cE5hbWVzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuUXVlcnlEZWZpbml0aW9uUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblF1ZXJ5RGVmaW5pdGlvblByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblF1ZXJ5RGVmaW5pdGlvblByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lcycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMubG9nR3JvdXBOYW1lcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3F1ZXJ5U3RyaW5nJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnF1ZXJ5U3RyaW5nKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdxdWVyeVN0cmluZycsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5xdWVyeVN0cmluZykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5RdWVyeURlZmluaXRpb25Qcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5RdWVyeURlZmluaXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblF1ZXJ5RGVmaW5pdGlvblByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5RdWVyeURlZmluaXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgUXVlcnlTdHJpbmc6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucXVlcnlTdHJpbmcpLFxuICAgICAgICBMb2dHcm91cE5hbWVzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5sb2dHcm91cE5hbWVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUXVlcnlEZWZpbml0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5RdWVyeURlZmluaXRpb25Qcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUXVlcnlEZWZpbml0aW9uUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3F1ZXJ5U3RyaW5nJywgJ1F1ZXJ5U3RyaW5nJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5RdWVyeVN0cmluZykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbG9nR3JvdXBOYW1lcycsICdMb2dHcm91cE5hbWVzJywgcHJvcGVydGllcy5Mb2dHcm91cE5hbWVzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuTG9nR3JvdXBOYW1lcykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uYFxuICpcbiAqIENyZWF0ZXMgYSBxdWVyeSBkZWZpbml0aW9uIGZvciBDbG91ZFdhdGNoIExvZ3MgSW5zaWdodHMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FuYWx5emluZyBMb2cgRGF0YSB3aXRoIENsb3VkV2F0Y2ggTG9ncyBJbnNpZ2h0c10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvQW5hbHl6aW5nTG9nRGF0YS5odG1sKSAuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpMb2dzOjpRdWVyeURlZmluaXRpb25cbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5RdWVyeURlZmluaXRpb24gZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpMb2dzOjpRdWVyeURlZmluaXRpb25cIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5RdWVyeURlZmluaXRpb24ge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblF1ZXJ5RGVmaW5pdGlvblByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5RdWVyeURlZmluaXRpb24oc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIElEIG9mIHRoZSBxdWVyeSBkZWZpbml0aW9uLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBRdWVyeURlZmluaXRpb25JZFxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyUXVlcnlEZWZpbml0aW9uSWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgbmFtZSBmb3IgdGhlIHF1ZXJ5IGRlZmluaXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi5odG1sI2Nmbi1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBxdWVyeSBzdHJpbmcgdG8gdXNlIGZvciB0aGlzIHF1ZXJ5IGRlZmluaXRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0Nsb3VkV2F0Y2ggTG9ncyBJbnNpZ2h0cyBRdWVyeSBTeW50YXhdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0NXTF9RdWVyeVN5bnRheC5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi5odG1sI2Nmbi1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi1xdWVyeXN0cmluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBxdWVyeVN0cmluZzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVXNlIHRoaXMgcGFyYW1ldGVyIGlmIHlvdSB3YW50IHRoZSBxdWVyeSB0byBxdWVyeSBvbmx5IGNlcnRhaW4gbG9nIGdyb3Vwcy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtcXVlcnlkZWZpbml0aW9uLmh0bWwjY2ZuLWxvZ3MtcXVlcnlkZWZpbml0aW9uLWxvZ2dyb3VwbmFtZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9nR3JvdXBOYW1lczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUXVlcnlEZWZpbml0aW9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmblF1ZXJ5RGVmaW5pdGlvbi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3F1ZXJ5U3RyaW5nJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0clF1ZXJ5RGVmaW5pdGlvbklkID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdRdWVyeURlZmluaXRpb25JZCcsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICAgICAgdGhpcy5xdWVyeVN0cmluZyA9IHByb3BzLnF1ZXJ5U3RyaW5nO1xuICAgICAgICB0aGlzLmxvZ0dyb3VwTmFtZXMgPSBwcm9wcy5sb2dHcm91cE5hbWVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuUXVlcnlEZWZpbml0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBxdWVyeVN0cmluZzogdGhpcy5xdWVyeVN0cmluZyxcbiAgICAgICAgICAgIGxvZ0dyb3VwTmFtZXM6IHRoaXMubG9nR3JvdXBOYW1lcyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5RdWVyeURlZmluaXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5SZXNvdXJjZVBvbGljeWBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1yZXNvdXJjZXBvbGljeS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUmVzb3VyY2VQb2xpY3lQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGV0YWlscyBvZiB0aGUgcG9saWN5LiBJdCBtdXN0IGJlIGZvcm1hdHRlZCBpbiBKU09OLCBhbmQgeW91IG11c3QgdXNlIGJhY2tzbGFzaGVzIHRvIGVzY2FwZSBjaGFyYWN0ZXJzIHRoYXQgbmVlZCB0byBiZSBlc2NhcGVkIGluIEpTT04gc3RyaW5ncywgc3VjaCBhcyBkb3VibGUgcXVvdGUgbWFya3MuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXJlc291cmNlcG9saWN5Lmh0bWwjY2ZuLWxvZ3MtcmVzb3VyY2Vwb2xpY3ktcG9saWN5ZG9jdW1lbnRcbiAgICAgKi9cbiAgICByZWFkb25seSBwb2xpY3lEb2N1bWVudDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlIHBvbGljeS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtcmVzb3VyY2Vwb2xpY3kuaHRtbCNjZm4tbG9ncy1yZXNvdXJjZXBvbGljeS1wb2xpY3luYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgcG9saWN5TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblJlc291cmNlUG9saWN5UHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJlc291cmNlUG9saWN5UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VQb2xpY3lQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3BvbGljeURvY3VtZW50JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnBvbGljeURvY3VtZW50KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwb2xpY3lEb2N1bWVudCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5wb2xpY3lEb2N1bWVudCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9saWN5TmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5wb2xpY3lOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwb2xpY3lOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnBvbGljeU5hbWUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuUmVzb3VyY2VQb2xpY3lQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3lgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJlc291cmNlUG9saWN5UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6OlJlc291cmNlUG9saWN5YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblJlc291cmNlUG9saWN5UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJlc291cmNlUG9saWN5UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnBvbGljeURvY3VtZW50KSxcbiAgICAgICAgUG9saWN5TmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wb2xpY3lOYW1lKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VQb2xpY3lQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlc291cmNlUG9saWN5UHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblJlc291cmNlUG9saWN5UHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdwb2xpY3lEb2N1bWVudCcsICdQb2xpY3lEb2N1bWVudCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUG9saWN5RG9jdW1lbnQpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3BvbGljeU5hbWUnLCAnUG9saWN5TmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUG9saWN5TmFtZSkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3lgXG4gKlxuICogQ3JlYXRlcyBvciB1cGRhdGVzIGEgcmVzb3VyY2UgcG9saWN5IHRoYXQgYWxsb3dzIG90aGVyIEFXUyBzZXJ2aWNlcyB0byBwdXQgbG9nIGV2ZW50cyB0byB0aGlzIGFjY291bnQuIEFuIGFjY291bnQgY2FuIGhhdmUgdXAgdG8gMTAgcmVzb3VyY2UgcG9saWNpZXMgcGVyIEFXUyBSZWdpb24uXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpMb2dzOjpSZXNvdXJjZVBvbGljeVxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtcmVzb3VyY2Vwb2xpY3kuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUmVzb3VyY2VQb2xpY3kgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpMb2dzOjpSZXNvdXJjZVBvbGljeVwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmblJlc291cmNlUG9saWN5IHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5SZXNvdXJjZVBvbGljeVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5SZXNvdXJjZVBvbGljeShzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGV0YWlscyBvZiB0aGUgcG9saWN5LiBJdCBtdXN0IGJlIGZvcm1hdHRlZCBpbiBKU09OLCBhbmQgeW91IG11c3QgdXNlIGJhY2tzbGFzaGVzIHRvIGVzY2FwZSBjaGFyYWN0ZXJzIHRoYXQgbmVlZCB0byBiZSBlc2NhcGVkIGluIEpTT04gc3RyaW5ncywgc3VjaCBhcyBkb3VibGUgcXVvdGUgbWFya3MuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXJlc291cmNlcG9saWN5Lmh0bWwjY2ZuLWxvZ3MtcmVzb3VyY2Vwb2xpY3ktcG9saWN5ZG9jdW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgcG9saWN5RG9jdW1lbnQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSByZXNvdXJjZSBwb2xpY3kuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXJlc291cmNlcG9saWN5Lmh0bWwjY2ZuLWxvZ3MtcmVzb3VyY2Vwb2xpY3ktcG9saWN5bmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBwb2xpY3lOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3lgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5SZXNvdXJjZVBvbGljeVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5SZXNvdXJjZVBvbGljeS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3BvbGljeURvY3VtZW50JywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdwb2xpY3lOYW1lJywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5wb2xpY3lEb2N1bWVudCA9IHByb3BzLnBvbGljeURvY3VtZW50O1xuICAgICAgICB0aGlzLnBvbGljeU5hbWUgPSBwcm9wcy5wb2xpY3lOYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuUmVzb3VyY2VQb2xpY3kuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBvbGljeURvY3VtZW50OiB0aGlzLnBvbGljeURvY3VtZW50LFxuICAgICAgICAgICAgcG9saWN5TmFtZTogdGhpcy5wb2xpY3lOYW1lLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblJlc291cmNlUG9saWN5UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBkZXN0aW5hdGlvbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLWRlc3RpbmF0aW9uYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgZGVzdGluYXRpb25Bcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBmaWx0ZXJpbmcgZXhwcmVzc2lvbnMgdGhhdCByZXN0cmljdCB3aGF0IGdldHMgZGVsaXZlcmVkIHRvIHRoZSBkZXN0aW5hdGlvbiBBV1MgcmVzb3VyY2UuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBmaWx0ZXIgcGF0dGVybiBzeW50YXgsIHNlZSBbRmlsdGVyIGFuZCBQYXR0ZXJuIFN5bnRheF0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvRmlsdGVyQW5kUGF0dGVyblN5bnRheC5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1maWx0ZXJwYXR0ZXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgZmlsdGVyUGF0dGVybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGxvZyBncm91cCB0byBhc3NvY2lhdGUgd2l0aCB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlci4gQWxsIGxvZyBldmVudHMgdGhhdCBhcmUgdXBsb2FkZWQgdG8gdGhpcyBsb2cgZ3JvdXAgYXJlIGZpbHRlcmVkIGFuZCBkZWxpdmVyZWQgdG8gdGhlIHNwZWNpZmllZCBBV1MgcmVzb3VyY2UgaWYgdGhlIGZpbHRlciBwYXR0ZXJuIG1hdGNoZXMgdGhlIGxvZyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1sb2dncm91cG5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIGBBV1M6OkxvZ3M6OlN1YnNjcmlwdGlvbkZpbHRlci5EaXN0cmlidXRpb25gXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1kaXN0cmlidXRpb25cbiAgICAgKi9cbiAgICByZWFkb25seSBkaXN0cmlidXRpb24/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlci5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLWZpbHRlcm5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBmaWx0ZXJOYW1lPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFSTiBvZiBhbiBJQU0gcm9sZSB0aGF0IGdyYW50cyBDbG91ZFdhdGNoIExvZ3MgcGVybWlzc2lvbnMgdG8gZGVsaXZlciBpbmdlc3RlZCBsb2cgZXZlbnRzIHRvIHRoZSBkZXN0aW5hdGlvbiBzdHJlYW0uIFlvdSBkb24ndCBuZWVkIHRvIHByb3ZpZGUgdGhlIEFSTiB3aGVuIHlvdSBhcmUgd29ya2luZyB3aXRoIGEgbG9naWNhbCBkZXN0aW5hdGlvbiBmb3IgY3Jvc3MtYWNjb3VudCBkZWxpdmVyeS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLXJvbGVhcm5cbiAgICAgKi9cbiAgICByZWFkb25seSByb2xlQXJuPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc3RpbmF0aW9uQXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmRlc3RpbmF0aW9uQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXN0aW5hdGlvbkFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kZXN0aW5hdGlvbkFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGlzdHJpYnV0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRpc3RyaWJ1dGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5maWx0ZXJOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJQYXR0ZXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmZpbHRlclBhdHRlcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpbHRlclBhdHRlcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZmlsdGVyUGF0dGVybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbG9nR3JvdXBOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncm9sZUFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yb2xlQXJuKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXJgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXJgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBEZXN0aW5hdGlvbkFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZXN0aW5hdGlvbkFybiksXG4gICAgICAgIEZpbHRlclBhdHRlcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmlsdGVyUGF0dGVybiksXG4gICAgICAgIExvZ0dyb3VwTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5sb2dHcm91cE5hbWUpLFxuICAgICAgICBEaXN0cmlidXRpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGlzdHJpYnV0aW9uKSxcbiAgICAgICAgRmlsdGVyTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5maWx0ZXJOYW1lKSxcbiAgICAgICAgUm9sZUFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yb2xlQXJuKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkZXN0aW5hdGlvbkFybicsICdEZXN0aW5hdGlvbkFybicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGVzdGluYXRpb25Bcm4pKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ZpbHRlclBhdHRlcm4nLCAnRmlsdGVyUGF0dGVybicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRmlsdGVyUGF0dGVybikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbG9nR3JvdXBOYW1lJywgJ0xvZ0dyb3VwTmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkaXN0cmlidXRpb24nLCAnRGlzdHJpYnV0aW9uJywgcHJvcGVydGllcy5EaXN0cmlidXRpb24gIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGlzdHJpYnV0aW9uKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdmaWx0ZXJOYW1lJywgJ0ZpbHRlck5hbWUnLCBwcm9wZXJ0aWVzLkZpbHRlck5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRmlsdGVyTmFtZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncm9sZUFybicsICdSb2xlQXJuJywgcHJvcGVydGllcy5Sb2xlQXJuICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJvbGVBcm4pIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkxvZ3M6OlN1YnNjcmlwdGlvbkZpbHRlcmBcbiAqXG4gKiBUaGUgYEFXUzo6TG9nczo6U3Vic2NyaXB0aW9uRmlsdGVyYCByZXNvdXJjZSBzcGVjaWZpZXMgYSBzdWJzY3JpcHRpb24gZmlsdGVyIGFuZCBhc3NvY2lhdGVzIGl0IHdpdGggdGhlIHNwZWNpZmllZCBsb2cgZ3JvdXAuIFN1YnNjcmlwdGlvbiBmaWx0ZXJzIGFsbG93IHlvdSB0byBzdWJzY3JpYmUgdG8gYSByZWFsLXRpbWUgc3RyZWFtIG9mIGxvZyBldmVudHMgYW5kIGhhdmUgdGhlbSBkZWxpdmVyZWQgdG8gYSBzcGVjaWZpYyBkZXN0aW5hdGlvbi4gQ3VycmVudGx5LCB0aGUgc3VwcG9ydGVkIGRlc3RpbmF0aW9ucyBhcmU6XG4gKlxuICogLSBBbiBBbWF6b24gS2luZXNpcyBkYXRhIHN0cmVhbSBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgYWNjb3VudCBhcyB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlciwgZm9yIHNhbWUtYWNjb3VudCBkZWxpdmVyeS5cbiAqIC0gQSBsb2dpY2FsIGRlc3RpbmF0aW9uIHRoYXQgYmVsb25ncyB0byBhIGRpZmZlcmVudCBhY2NvdW50LCBmb3IgY3Jvc3MtYWNjb3VudCBkZWxpdmVyeS5cbiAqIC0gQW4gQW1hem9uIEtpbmVzaXMgRmlyZWhvc2UgZGVsaXZlcnkgc3RyZWFtIHRoYXQgYmVsb25ncyB0byB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBzdWJzY3JpcHRpb24gZmlsdGVyLCBmb3Igc2FtZS1hY2NvdW50IGRlbGl2ZXJ5LlxuICogLSBBbiBBV1MgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgYmVsb25ncyB0byB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBzdWJzY3JpcHRpb24gZmlsdGVyLCBmb3Igc2FtZS1hY2NvdW50IGRlbGl2ZXJ5LlxuICpcbiAqIFRoZXJlIGNhbiBiZSBhcyBtYW55IGFzIHR3byBzdWJzY3JpcHRpb24gZmlsdGVycyBhc3NvY2lhdGVkIHdpdGggYSBsb2cgZ3JvdXAuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXJcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5TdWJzY3JpcHRpb25GaWx0ZXIgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXJcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5TdWJzY3JpcHRpb25GaWx0ZXIge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5TdWJzY3JpcHRpb25GaWx0ZXIoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBkZXN0aW5hdGlvbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLWRlc3RpbmF0aW9uYXJuXG4gICAgICovXG4gICAgcHVibGljIGRlc3RpbmF0aW9uQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZmlsdGVyaW5nIGV4cHJlc3Npb25zIHRoYXQgcmVzdHJpY3Qgd2hhdCBnZXRzIGRlbGl2ZXJlZCB0byB0aGUgZGVzdGluYXRpb24gQVdTIHJlc291cmNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZmlsdGVyIHBhdHRlcm4gc3ludGF4LCBzZWUgW0ZpbHRlciBhbmQgUGF0dGVybiBTeW50YXhdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0ZpbHRlckFuZFBhdHRlcm5TeW50YXguaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1zdWJzY3JpcHRpb25maWx0ZXIuaHRtbCNjZm4tbG9ncy1zdWJzY3JpcHRpb25maWx0ZXItZmlsdGVycGF0dGVyblxuICAgICAqL1xuICAgIHB1YmxpYyBmaWx0ZXJQYXR0ZXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbG9nIGdyb3VwIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBzdWJzY3JpcHRpb24gZmlsdGVyLiBBbGwgbG9nIGV2ZW50cyB0aGF0IGFyZSB1cGxvYWRlZCB0byB0aGlzIGxvZyBncm91cCBhcmUgZmlsdGVyZWQgYW5kIGRlbGl2ZXJlZCB0byB0aGUgc3BlY2lmaWVkIEFXUyByZXNvdXJjZSBpZiB0aGUgZmlsdGVyIHBhdHRlcm4gbWF0Y2hlcyB0aGUgbG9nIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLWxvZ2dyb3VwbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIGBBV1M6OkxvZ3M6OlN1YnNjcmlwdGlvbkZpbHRlci5EaXN0cmlidXRpb25gXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1kaXN0cmlidXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgZGlzdHJpYnV0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlci5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLWZpbHRlcm5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlsdGVyTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFSTiBvZiBhbiBJQU0gcm9sZSB0aGF0IGdyYW50cyBDbG91ZFdhdGNoIExvZ3MgcGVybWlzc2lvbnMgdG8gZGVsaXZlciBpbmdlc3RlZCBsb2cgZXZlbnRzIHRvIHRoZSBkZXN0aW5hdGlvbiBzdHJlYW0uIFlvdSBkb24ndCBuZWVkIHRvIHByb3ZpZGUgdGhlIEFSTiB3aGVuIHlvdSBhcmUgd29ya2luZyB3aXRoIGEgbG9naWNhbCBkZXN0aW5hdGlvbiBmb3IgY3Jvc3MtYWNjb3VudCBkZWxpdmVyeS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLXJvbGVhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcm9sZUFybjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkxvZ3M6OlN1YnNjcmlwdGlvbkZpbHRlcmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5TdWJzY3JpcHRpb25GaWx0ZXIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdkZXN0aW5hdGlvbkFybicsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnZmlsdGVyUGF0dGVybicsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbG9nR3JvdXBOYW1lJywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbkFybiA9IHByb3BzLmRlc3RpbmF0aW9uQXJuO1xuICAgICAgICB0aGlzLmZpbHRlclBhdHRlcm4gPSBwcm9wcy5maWx0ZXJQYXR0ZXJuO1xuICAgICAgICB0aGlzLmxvZ0dyb3VwTmFtZSA9IHByb3BzLmxvZ0dyb3VwTmFtZTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRpb24gPSBwcm9wcy5kaXN0cmlidXRpb247XG4gICAgICAgIHRoaXMuZmlsdGVyTmFtZSA9IHByb3BzLmZpbHRlck5hbWU7XG4gICAgICAgIHRoaXMucm9sZUFybiA9IHByb3BzLnJvbGVBcm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5TdWJzY3JpcHRpb25GaWx0ZXIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uQXJuOiB0aGlzLmRlc3RpbmF0aW9uQXJuLFxuICAgICAgICAgICAgZmlsdGVyUGF0dGVybjogdGhpcy5maWx0ZXJQYXR0ZXJuLFxuICAgICAgICAgICAgbG9nR3JvdXBOYW1lOiB0aGlzLmxvZ0dyb3VwTmFtZSxcbiAgICAgICAgICAgIGRpc3RyaWJ1dGlvbjogdGhpcy5kaXN0cmlidXRpb24sXG4gICAgICAgICAgICBmaWx0ZXJOYW1lOiB0aGlzLmZpbHRlck5hbWUsXG4gICAgICAgICAgICByb2xlQXJuOiB0aGlzLnJvbGVBcm4sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG4iXX0=
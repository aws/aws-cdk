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
exports.CfnDestination = CfnDestination;
_a = JSII_RTTI_SYMBOL_1;
CfnDestination[_a] = { fqn: "@aws-cdk/aws-logs.CfnDestination", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnDestination.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::Destination";
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
exports.CfnLogGroup = CfnLogGroup;
_b = JSII_RTTI_SYMBOL_1;
CfnLogGroup[_b] = { fqn: "@aws-cdk/aws-logs.CfnLogGroup", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnLogGroup.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::LogGroup";
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
exports.CfnLogStream = CfnLogStream;
_c = JSII_RTTI_SYMBOL_1;
CfnLogStream[_c] = { fqn: "@aws-cdk/aws-logs.CfnLogStream", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnLogStream.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::LogStream";
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
exports.CfnMetricFilter = CfnMetricFilter;
_d = JSII_RTTI_SYMBOL_1;
CfnMetricFilter[_d] = { fqn: "@aws-cdk/aws-logs.CfnMetricFilter", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnMetricFilter.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::MetricFilter";
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
exports.CfnQueryDefinition = CfnQueryDefinition;
_e = JSII_RTTI_SYMBOL_1;
CfnQueryDefinition[_e] = { fqn: "@aws-cdk/aws-logs.CfnQueryDefinition", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::QueryDefinition";
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
exports.CfnResourcePolicy = CfnResourcePolicy;
_f = JSII_RTTI_SYMBOL_1;
CfnResourcePolicy[_f] = { fqn: "@aws-cdk/aws-logs.CfnResourcePolicy", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::ResourcePolicy";
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
exports.CfnSubscriptionFilter = CfnSubscriptionFilter;
_g = JSII_RTTI_SYMBOL_1;
CfnSubscriptionFilter[_g] = { fqn: "@aws-cdk/aws-logs.CfnSubscriptionFilter", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME = "AWS::Logs::SubscriptionFilter";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBeUNoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLDRCQUE0QixDQUFDLFVBQWU7SUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzVHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN6RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUM3RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDNUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6RixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDaEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM3RixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQztBQUNwRixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsbUNBQW1DLENBQUMsVUFBZTtJQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQsNEJBQTRCLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekQsT0FBTztRQUNILGVBQWUsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztRQUN2RSxPQUFPLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDdkQsU0FBUyxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1FBQzNELGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7S0FDOUUsQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUyxxQ0FBcUMsQ0FBQyxVQUFlO0lBQzFELFVBQVUsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNsRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsZ0NBQWdDLEVBQXVCLENBQUM7SUFDbEYsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDaEksR0FBRyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RyxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6TCxHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsR0FBRyxDQUFDLFdBQVc7SUEyRC9DOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDM0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLHNCQUFzQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBbkVoRixjQUFjOzs7O1FBb0VuQixHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFckYsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztLQUNwRDtJQXZFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBMkIsRUFBRSxFQUFVLEVBQUUsa0JBQXVCLEVBQUUsT0FBNEM7UUFDNUksa0JBQWtCLEdBQUcsa0JBQWtCLElBQUksRUFBRSxDQUFDO1FBQzlDLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEYsTUFBTSxXQUFXLEdBQUcscUNBQXFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RSxNQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3RCxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUc7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUF3REQ7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBNEI7UUFDdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxjQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM3RixTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5RTtJQUVELElBQWMsYUFBYTtRQUN2QixPQUFPO1lBQ0gsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1lBQ3JDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtTQUM1QyxDQUFDO0tBQ0w7SUFFUyxnQkFBZ0IsQ0FBQyxLQUEyQjtRQUNsRCxPQUFPLG1DQUFtQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3JEOztBQXJHTCx3Q0FzR0M7OztBQXJHRzs7R0FFRztBQUNvQixxQ0FBc0IsR0FBRyx3QkFBd0IsQ0FBQztBQThKN0U7Ozs7OztHQU1HO0FBQ0gsU0FBUyx5QkFBeUIsQ0FBQyxVQUFlO0lBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUNuSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzNGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbkcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3pHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUyxnQ0FBZ0MsQ0FBQyxVQUFlO0lBQ3JELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENBQUM7S0FBRTtJQUN2RCx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0RCxPQUFPO1FBQ0gsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQztRQUNqRixRQUFRLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDekQsWUFBWSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQ2pFLGVBQWUsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztRQUN2RSxJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0tBQ3BFLENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsa0NBQWtDLENBQUMsVUFBZTtJQUN2RCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUFvQixDQUFDO0lBQy9FLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0IsRUFBRSxVQUFVLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsTSxHQUFHLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JKLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckssR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakwsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBZ0IsQ0FBQyxDQUFDO0lBQ25MLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFhLFdBQVksU0FBUSxHQUFHLENBQUMsV0FBVztJQThFNUM7Ozs7OztPQU1HO0lBQ0gsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxRQUEwQixFQUFFO1FBQzdFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXRGN0UsV0FBVzs7OztRQXVGaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVyRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDO1FBQ3ZELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNySCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEtBQUssU0FBUztvQkFDcEYsQ0FBQyxDQUFDLENBQUMsNElBQTRJLENBQUM7b0JBQ2hKLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2I7S0FDSjtJQTdGRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBMkIsRUFBRSxFQUFVLEVBQUUsa0JBQXVCLEVBQUUsT0FBNEM7UUFDNUksa0JBQWtCLEdBQUcsa0JBQWtCLElBQUksRUFBRSxDQUFDO1FBQzlDLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEYsTUFBTSxXQUFXLEdBQUcsa0NBQWtDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMzRSxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRCxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUc7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUE4RUQ7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBNEI7UUFDdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMxRixTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5RTtJQUVELElBQWMsYUFBYTtRQUN2QixPQUFPO1lBQ0gsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtZQUMvQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtZQUNyQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7U0FDL0IsQ0FBQztLQUNMO0lBRVMsZ0JBQWdCLENBQUMsS0FBMkI7UUFDbEQsT0FBTyxnQ0FBZ0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNsRDs7QUE1SEwsa0NBNkhDOzs7QUE1SEc7O0dBRUc7QUFDb0Isa0NBQXNCLEdBQUcscUJBQXFCLENBQUM7QUFvSjFFOzs7Ozs7R0FNRztBQUNILFNBQVMsMEJBQTBCLENBQUMsVUFBZTtJQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbkcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNyRyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQztBQUNsRixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsaUNBQWlDLENBQUMsVUFBZTtJQUN0RCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQsMEJBQTBCLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkQsT0FBTztRQUNILFlBQVksRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztRQUNqRSxhQUFhLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7S0FDdEUsQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUyxtQ0FBbUMsQ0FBQyxVQUFlO0lBQ3hELFVBQVUsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNsRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsZ0NBQWdDLEVBQXFCLENBQUM7SUFDaEYsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN2SCxHQUFHLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pLLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsV0FBVztJQTZDN0M7Ozs7OztPQU1HO0lBQ0gsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FyRDlFLFlBQVk7Ozs7UUFzRGpCLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRW5GLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUN2QyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7S0FDNUM7SUFyREQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLGtCQUF1QixFQUFFLE9BQTRDO1FBQzVJLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sV0FBVyxHQUFHLG1DQUFtQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDNUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0QsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFHO1lBQzNFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNkO0lBc0NEOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLFNBQTRCO1FBQ3ZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDM0YsU0FBUyxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDOUU7SUFFRCxJQUFjLGFBQWE7UUFDdkIsT0FBTztZQUNILFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMvQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7U0FDcEMsQ0FBQztLQUNMO0lBRVMsZ0JBQWdCLENBQUMsS0FBMkI7UUFDbEQsT0FBTyxpQ0FBaUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNuRDs7QUFqRkwsb0NBa0ZDOzs7QUFqRkc7O0dBRUc7QUFDb0IsbUNBQXNCLEdBQUcsc0JBQXNCLENBQUM7QUF1SDNFOzs7Ozs7R0FNRztBQUNILFNBQVMsNkJBQTZCLENBQUMsVUFBZTtJQUNsRCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMvRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDeEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNyRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDdEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNuRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0lBQ3hILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMscURBQXFELENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDM0ssT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLG9DQUFvQyxDQUFDLFVBQWU7SUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFELE9BQU87UUFDSCxhQUFhLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDbkUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQ2pFLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsMkRBQTJELENBQUMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUM7UUFDcEksVUFBVSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO0tBQ2hFLENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsc0NBQXNDLENBQUMsVUFBZTtJQUMzRCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUF3QixDQUFDO0lBQ25GLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDMUgsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN2SCxHQUFHLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDaE4sR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3SixHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFhLGVBQWdCLFNBQVEsR0FBRyxDQUFDLFdBQVc7SUFxRGhEOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDNUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLHNCQUFzQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBN0RqRixlQUFlOzs7O1FBOERwQixHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUN6QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztRQUN6RCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDdEM7SUFoRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLGtCQUF1QixFQUFFLE9BQTRDO1FBQzVJLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sV0FBVyxHQUFHLHNDQUFzQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDL0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUQsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFHO1lBQzNFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNkO0lBaUREOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLFNBQTRCO1FBQ3ZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDOUYsU0FBUyxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDOUU7SUFFRCxJQUFjLGFBQWE7UUFDdkIsT0FBTztZQUNILGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtZQUNqRCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDOUIsQ0FBQztLQUNMO0lBRVMsZ0JBQWdCLENBQUMsS0FBMkI7UUFDbEQsT0FBTyxvQ0FBb0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0RDs7QUE5RkwsMENBK0ZDOzs7QUE5Rkc7O0dBRUc7QUFDb0Isc0NBQXNCLEdBQUcseUJBQXlCLENBQUM7QUFrSTlFOzs7Ozs7R0FNRztBQUNILFNBQVMsMENBQTBDLENBQUMsVUFBZTtJQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLHlEQUF5RCxDQUFDLENBQUM7QUFDbEYsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLGdEQUFnRCxDQUFDLFVBQWU7SUFDckUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELDBDQUEwQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZFLE9BQU87UUFDSCxHQUFHLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFDL0MsS0FBSyxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO0tBQ3RELENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsa0RBQWtELENBQUMsVUFBZTtJQUN2RSxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBcUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVGLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEcsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQXlERDs7Ozs7O0dBTUc7QUFDSCxTQUFTLHFEQUFxRCxDQUFDLFVBQWU7SUFDMUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbkcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNsRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9GLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzVHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN6RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDcEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNqRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25GLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO0FBQzdGLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUywyREFBMkQsQ0FBQyxVQUFlO0lBQ2hGLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENBQUM7S0FBRTtJQUN2RCxxREFBcUQsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNsRixPQUFPO1FBQ0gsWUFBWSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQ2pFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLGdEQUFnRCxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUNuRyxVQUFVLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFDN0QsZUFBZSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ3ZFLFdBQVcsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztRQUMvRCxJQUFJLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7S0FDcEQsQ0FBQztBQUNOLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsU0FBUyw2REFBNkQsQ0FBQyxVQUFlO0lBQ2xGLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUFnRCxDQUFDO0lBQzNHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckssR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsa0RBQWtELENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hOLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDakgsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDaEksR0FBRyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNwSCxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JJLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFrQ0Q7Ozs7OztHQU1HO0FBQ0gsU0FBUyxnQ0FBZ0MsQ0FBQyxVQUFlO0lBQ3JELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUN4SCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDcEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNqRyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0RBQStELENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsdUNBQXVDLENBQUMsVUFBZTtJQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0QsT0FBTztRQUNILElBQUksRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNqRCxXQUFXLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7UUFDL0QsYUFBYSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztLQUN0RixDQUFDO0FBQ04sQ0FBQztBQUVELG9CQUFvQjtBQUNwQixTQUFTLHlDQUF5QyxDQUFDLFVBQWU7SUFDOUQsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBMkIsQ0FBQztJQUN0RixHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9GLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDcEgsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsVUFBVSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5SyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsV0FBVztJQW9EbkQ7Ozs7OztPQU1HO0lBQ0gsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxLQUE4QjtRQUMvRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQTVEcEYsa0JBQWtCOzs7O1FBNkR2QixHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRWpILElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0tBQzVDO0lBOUREOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUEyQixFQUFFLEVBQVUsRUFBRSxrQkFBdUIsRUFBRSxPQUE0QztRQUM1SSxrQkFBa0IsR0FBRyxrQkFBa0IsSUFBSSxFQUFFLENBQUM7UUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRixNQUFNLFdBQVcsR0FBRyx5Q0FBeUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xGLE1BQU0sR0FBRyxHQUFHLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakUsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFHO1lBQzNFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNkO0lBK0NEOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLFNBQTRCO1FBQ3ZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNqRyxTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5RTtJQUVELElBQWMsYUFBYTtRQUN2QixPQUFPO1lBQ0gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtTQUNwQyxDQUFDO0tBQ0w7SUFFUyxnQkFBZ0IsQ0FBQyxLQUEyQjtRQUNsRCxPQUFPLHVDQUF1QyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pEOztBQTNGTCxnREE0RkM7OztBQTNGRzs7R0FFRztBQUNvQix5Q0FBc0IsR0FBRyw0QkFBNEIsQ0FBQztBQW1IakY7Ozs7OztHQU1HO0FBQ0gsU0FBUywrQkFBK0IsQ0FBQyxVQUFlO0lBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUMxRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDdkcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7QUFDdkYsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLHNDQUFzQyxDQUFDLFVBQWU7SUFDM0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELCtCQUErQixDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzVELE9BQU87UUFDSCxjQUFjLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDckUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO0tBQ2hFLENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsd0NBQXdDLENBQUMsVUFBZTtJQUM3RCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUEwQixDQUFDO0lBQ3JGLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzdILEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDakgsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLFdBQVc7SUF1Q2xEOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDOUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0EvQ25GLGlCQUFpQjs7OztRQWdEdEIsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztRQUMzQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDdEM7SUEvQ0Q7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLGtCQUF1QixFQUFFLE9BQTRDO1FBQzVJLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sV0FBVyxHQUFHLHdDQUF3QyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakYsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUc7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUFnQ0Q7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBNEI7UUFDdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2hHLFNBQVMsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzlFO0lBRUQsSUFBYyxhQUFhO1FBQ3ZCLE9BQU87WUFDSCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQzlCLENBQUM7S0FDTDtJQUVTLGdCQUFnQixDQUFDLEtBQTJCO1FBQ2xELE9BQU8sc0NBQXNDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDeEQ7O0FBM0VMLDhDQTRFQzs7O0FBM0VHOztHQUVHO0FBQ29CLHdDQUFzQixHQUFHLDJCQUEyQixDQUFDO0FBK0hoRjs7Ozs7O0dBTUc7QUFDSCxTQUFTLG1DQUFtQyxDQUFDLFVBQWU7SUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN2RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ25HLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3hHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDckcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbkcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6RixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0VBQWtFLENBQUMsQ0FBQztBQUMzRixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsMENBQTBDLENBQUMsVUFBZTtJQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQsbUNBQW1DLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDaEUsT0FBTztRQUNILGNBQWMsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUNyRSxhQUFhLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDbkUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQ2pFLFlBQVksRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztRQUNqRSxVQUFVLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFDN0QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO0tBQzFELENBQUM7QUFDTixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLFNBQVMsNENBQTRDLENBQUMsVUFBZTtJQUNqRSxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUE4QixDQUFDO0lBQ3pGLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzdILEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDMUgsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN2SCxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JLLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0osR0FBRyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqSixHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxXQUFXO0lBbUV0RDs7Ozs7O09BTUc7SUFDSCxZQUFZLEtBQTJCLEVBQUUsRUFBVSxFQUFFLEtBQWlDO1FBQ2xGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBM0V2RixxQkFBcUI7Ozs7UUE0RTFCLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUN6QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7S0FDaEM7SUFoRkQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLGtCQUF1QixFQUFFLE9BQTRDO1FBQzVJLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sV0FBVyxHQUFHLDRDQUE0QyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDckYsTUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRSxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUc7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUFpRUQ7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBNEI7UUFDdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3BHLFNBQVMsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzlFO0lBRUQsSUFBYyxhQUFhO1FBQ3ZCLE9BQU87WUFDSCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2pDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMvQixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN4QixDQUFDO0tBQ0w7SUFFUyxnQkFBZ0IsQ0FBQyxLQUEyQjtRQUNsRCxPQUFPLDBDQUEwQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzVEOztBQWhITCxzREFpSEM7OztBQWhIRzs7R0FFRztBQUNvQiw0Q0FBc0IsR0FBRywrQkFBK0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIEdlbmVyYXRlZCBmcm9tIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgU3BlY2lmaWNhdGlvblxuLy8gU2VlOiBkb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvY2ZuLXJlc291cmNlLXNwZWNpZmljYXRpb24uaHRtbFxuLy8gQGNmbjJ0czptZXRhQCB7XCJnZW5lcmF0ZWRcIjpcIjIwMjMtMDMtMDlUMDM6NTI6NTYuOTQwWlwiLFwiZmluZ2VycHJpbnRcIjpcImlrZWVHbXhJakdES0VwZU1iMVBtNHpOTEo2WkRac2N4TGFOZVFONUFNZGM9XCJ9XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNmbl9wYXJzZSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5EZXN0aW5hdGlvbmBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1kZXN0aW5hdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuRGVzdGluYXRpb25Qcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZGVzdGluYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tZGVzdGluYXRpb25uYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgZGVzdGluYXRpb25OYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQVJOIG9mIGFuIElBTSByb2xlIHRoYXQgcGVybWl0cyBDbG91ZFdhdGNoIExvZ3MgdG8gc2VuZCBkYXRhIHRvIHRoZSBzcGVjaWZpZWQgQVdTIHJlc291cmNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1kZXN0aW5hdGlvbi5odG1sI2Nmbi1sb2dzLWRlc3RpbmF0aW9uLXJvbGVhcm5cbiAgICAgKi9cbiAgICByZWFkb25seSByb2xlQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIHBoeXNpY2FsIHRhcmdldCB3aGVyZSB0aGUgbG9nIGV2ZW50cyBhcmUgZGVsaXZlcmVkIChmb3IgZXhhbXBsZSwgYSBLaW5lc2lzIHN0cmVhbSkuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tdGFyZ2V0YXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGFyZ2V0QXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBJQU0gcG9saWN5IGRvY3VtZW50IHRoYXQgZ292ZXJucyB3aGljaCBBV1MgYWNjb3VudHMgY2FuIGNyZWF0ZSBzdWJzY3JpcHRpb24gZmlsdGVycyBhZ2FpbnN0IHRoaXMgZGVzdGluYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tZGVzdGluYXRpb25wb2xpY3lcbiAgICAgKi9cbiAgICByZWFkb25seSBkZXN0aW5hdGlvblBvbGljeT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5EZXN0aW5hdGlvblByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5EZXN0aW5hdGlvblByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkRlc3RpbmF0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXN0aW5hdGlvbk5hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZGVzdGluYXRpb25OYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXN0aW5hdGlvbk5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZGVzdGluYXRpb25OYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXN0aW5hdGlvblBvbGljeScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kZXN0aW5hdGlvblBvbGljeSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncm9sZUFybicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5yb2xlQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyb2xlQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJvbGVBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldEFybicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50YXJnZXRBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldEFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50YXJnZXRBcm4pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuRGVzdGluYXRpb25Qcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6RGVzdGluYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRlc3RpbmF0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6OkRlc3RpbmF0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkRlc3RpbmF0aW9uUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkRlc3RpbmF0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIERlc3RpbmF0aW9uTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZXN0aW5hdGlvbk5hbWUpLFxuICAgICAgICBSb2xlQXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJvbGVBcm4pLFxuICAgICAgICBUYXJnZXRBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGFyZ2V0QXJuKSxcbiAgICAgICAgRGVzdGluYXRpb25Qb2xpY3k6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVzdGluYXRpb25Qb2xpY3kpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5EZXN0aW5hdGlvblByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuRGVzdGluYXRpb25Qcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuRGVzdGluYXRpb25Qcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2Rlc3RpbmF0aW9uTmFtZScsICdEZXN0aW5hdGlvbk5hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRlc3RpbmF0aW9uTmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncm9sZUFybicsICdSb2xlQXJuJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Sb2xlQXJuKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YXJnZXRBcm4nLCAnVGFyZ2V0QXJuJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5UYXJnZXRBcm4pKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2Rlc3RpbmF0aW9uUG9saWN5JywgJ0Rlc3RpbmF0aW9uUG9saWN5JywgcHJvcGVydGllcy5EZXN0aW5hdGlvblBvbGljeSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5EZXN0aW5hdGlvblBvbGljeSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6TG9nczo6RGVzdGluYXRpb25gXG4gKlxuICogVGhlIEFXUzo6TG9nczo6RGVzdGluYXRpb24gcmVzb3VyY2Ugc3BlY2lmaWVzIGEgQ2xvdWRXYXRjaCBMb2dzIGRlc3RpbmF0aW9uLiBBIGRlc3RpbmF0aW9uIGVuY2Fwc3VsYXRlcyBhIHBoeXNpY2FsIHJlc291cmNlIChzdWNoIGFzIGFuIEFtYXpvbiBLaW5lc2lzIGRhdGEgc3RyZWFtKSBhbmQgZW5hYmxlcyB5b3UgdG8gc3Vic2NyaWJlIHRoYXQgcmVzb3VyY2UgdG8gYSBzdHJlYW0gb2YgbG9nIGV2ZW50cy5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkxvZ3M6OkRlc3RpbmF0aW9uXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1kZXN0aW5hdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5EZXN0aW5hdGlvbiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OkxvZ3M6OkRlc3RpbmF0aW9uXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuRGVzdGluYXRpb24ge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkRlc3RpbmF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkRlc3RpbmF0aW9uKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgdGhlIENsb3VkV2F0Y2ggTG9ncyBkZXN0aW5hdGlvbiwgc3VjaCBhcyBgYXJuOmF3czpsb2dzOnVzLXdlc3QtMToxMjM0NTY3ODkwMTI6ZGVzdGluYXRpb246TXlEZXN0aW5hdGlvbmAgLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBBcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGRlc3RpbmF0aW9uLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1kZXN0aW5hdGlvbi5odG1sI2Nmbi1sb2dzLWRlc3RpbmF0aW9uLWRlc3RpbmF0aW9ubmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBkZXN0aW5hdGlvbk5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgYW4gSUFNIHJvbGUgdGhhdCBwZXJtaXRzIENsb3VkV2F0Y2ggTG9ncyB0byBzZW5kIGRhdGEgdG8gdGhlIHNwZWNpZmllZCBBV1MgcmVzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tcm9sZWFyblxuICAgICAqL1xuICAgIHB1YmxpYyByb2xlQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIHBoeXNpY2FsIHRhcmdldCB3aGVyZSB0aGUgbG9nIGV2ZW50cyBhcmUgZGVsaXZlcmVkIChmb3IgZXhhbXBsZSwgYSBLaW5lc2lzIHN0cmVhbSkuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWRlc3RpbmF0aW9uLmh0bWwjY2ZuLWxvZ3MtZGVzdGluYXRpb24tdGFyZ2V0YXJuXG4gICAgICovXG4gICAgcHVibGljIHRhcmdldEFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gSUFNIHBvbGljeSBkb2N1bWVudCB0aGF0IGdvdmVybnMgd2hpY2ggQVdTIGFjY291bnRzIGNhbiBjcmVhdGUgc3Vic2NyaXB0aW9uIGZpbHRlcnMgYWdhaW5zdCB0aGlzIGRlc3RpbmF0aW9uLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1kZXN0aW5hdGlvbi5odG1sI2Nmbi1sb2dzLWRlc3RpbmF0aW9uLWRlc3RpbmF0aW9ucG9saWN5XG4gICAgICovXG4gICAgcHVibGljIGRlc3RpbmF0aW9uUG9saWN5OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6TG9nczo6RGVzdGluYXRpb25gLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5EZXN0aW5hdGlvblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5EZXN0aW5hdGlvbi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2Rlc3RpbmF0aW9uTmFtZScsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAncm9sZUFybicsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAndGFyZ2V0QXJuJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0ckFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uTmFtZSA9IHByb3BzLmRlc3RpbmF0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5yb2xlQXJuID0gcHJvcHMucm9sZUFybjtcbiAgICAgICAgdGhpcy50YXJnZXRBcm4gPSBwcm9wcy50YXJnZXRBcm47XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25Qb2xpY3kgPSBwcm9wcy5kZXN0aW5hdGlvblBvbGljeTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkRlc3RpbmF0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbk5hbWU6IHRoaXMuZGVzdGluYXRpb25OYW1lLFxuICAgICAgICAgICAgcm9sZUFybjogdGhpcy5yb2xlQXJuLFxuICAgICAgICAgICAgdGFyZ2V0QXJuOiB0aGlzLnRhcmdldEFybixcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uUG9saWN5OiB0aGlzLmRlc3RpbmF0aW9uUG9saWN5LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkRlc3RpbmF0aW9uUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuTG9nR3JvdXBgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkxvZ0dyb3VwUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGRhdGEgcHJvdGVjdGlvbiBwb2xpY3kgYW5kIGFzc2lnbnMgaXQgdG8gdGhlIGxvZyBncm91cC4gQSBkYXRhIHByb3RlY3Rpb24gcG9saWN5IGNhbiBoZWxwIHNhZmVndWFyZCBzZW5zaXRpdmUgZGF0YSB0aGF0J3MgaW5nZXN0ZWQgYnkgdGhlIGxvZyBncm91cCBieSBhdWRpdGluZyBhbmQgbWFza2luZyB0aGUgc2Vuc2l0aXZlIGxvZyBkYXRhLiBXaGVuIGEgdXNlciB3aG8gZG9lcyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIHZpZXcgbWFza2VkIGRhdGEgdmlld3MgYSBsb2cgZXZlbnQgdGhhdCBpbmNsdWRlcyBtYXNrZWQgZGF0YSwgdGhlIHNlbnNpdGl2ZSBkYXRhIGlzIHJlcGxhY2VkIGJ5IGFzdGVyaXNrcy5cbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBpbmNsdWRpbmcgYSBsaXN0IG9mIHR5cGVzIG9mIGRhdGEgdGhhdCBjYW4gYmUgYXVkaXRlZCBhbmQgbWFza2VkLCBzZWUgW1Byb3RlY3Qgc2Vuc2l0aXZlIGxvZyBkYXRhIHdpdGggbWFza2luZ10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvbWFzay1zZW5zaXRpdmUtbG9nLWRhdGEuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLWRhdGFwcm90ZWN0aW9ucG9saWN5XG4gICAgICovXG4gICAgcmVhZG9ubHkgZGF0YVByb3RlY3Rpb25Qb2xpY3k/OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIEFXUyBLTVMga2V5IHRvIHVzZSB3aGVuIGVuY3J5cHRpbmcgbG9nIGRhdGEuXG4gICAgICpcbiAgICAgKiBUbyBhc3NvY2lhdGUgYW4gQVdTIEtNUyBrZXkgd2l0aCB0aGUgbG9nIGdyb3VwLCBzcGVjaWZ5IHRoZSBBUk4gb2YgdGhhdCBLTVMga2V5IGhlcmUuIElmIHlvdSBkbyBzbywgaW5nZXN0ZWQgZGF0YSBpcyBlbmNyeXB0ZWQgdXNpbmcgdGhpcyBrZXkuIFRoaXMgYXNzb2NpYXRpb24gaXMgc3RvcmVkIGFzIGxvbmcgYXMgdGhlIGRhdGEgZW5jcnlwdGVkIHdpdGggdGhlIEtNUyBrZXkgaXMgc3RpbGwgd2l0aGluIENsb3VkV2F0Y2ggTG9ncyAuIFRoaXMgZW5hYmxlcyBDbG91ZFdhdGNoIExvZ3MgdG8gZGVjcnlwdCB0aGlzIGRhdGEgd2hlbmV2ZXIgaXQgaXMgcmVxdWVzdGVkLlxuICAgICAqXG4gICAgICogSWYgeW91IGF0dGVtcHQgdG8gYXNzb2NpYXRlIGEgS01TIGtleSB3aXRoIHRoZSBsb2cgZ3JvdXAgYnV0IHRoZSBLTVMga2V5IGRvZXNuJ3QgZXhpc3Qgb3IgaXMgZGVhY3RpdmF0ZWQsIHlvdSB3aWxsIHJlY2VpdmUgYW4gYEludmFsaWRQYXJhbWV0ZXJFeGNlcHRpb25gIGVycm9yLlxuICAgICAqXG4gICAgICogTG9nIGdyb3VwIGRhdGEgaXMgYWx3YXlzIGVuY3J5cHRlZCBpbiBDbG91ZFdhdGNoIExvZ3MgLiBJZiB5b3Ugb21pdCB0aGlzIGtleSwgdGhlIGVuY3J5cHRpb24gZG9lcyBub3QgdXNlIEFXUyBLTVMgLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtFbmNyeXB0IGxvZyBkYXRhIGluIENsb3VkV2F0Y2ggTG9ncyB1c2luZyBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvZW5jcnlwdC1sb2ctZGF0YS1rbXMuaHRtbClcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNjZm4tbG9ncy1sb2dncm91cC1rbXNrZXlpZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IGttc0tleUlkPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBncm91cC4gSWYgeW91IGRvbid0IHNwZWNpZnkgYSBuYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGEgdW5pcXVlIElEIGZvciB0aGUgbG9nIGdyb3VwLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLWxvZ2dyb3VwbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGxvZ0dyb3VwTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgZGF5cyB0byByZXRhaW4gdGhlIGxvZyBldmVudHMgaW4gdGhlIHNwZWNpZmllZCBsb2cgZ3JvdXAuIFBvc3NpYmxlIHZhbHVlcyBhcmU6IDEsIDMsIDUsIDcsIDE0LCAzMCwgNjAsIDkwLCAxMjAsIDE1MCwgMTgwLCAzNjUsIDQwMCwgNTQ1LCA3MzEsIDE4MjcsIDIxOTIsIDI1NTcsIDI5MjIsIDMyODgsIGFuZCAzNjUzLlxuICAgICAqXG4gICAgICogVG8gc2V0IGEgbG9nIGdyb3VwIHNvIHRoYXQgaXRzIGxvZyBldmVudHMgZG8gbm90IGV4cGlyZSwgdXNlIFtEZWxldGVSZXRlbnRpb25Qb2xpY3ldKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoTG9ncy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9EZWxldGVSZXRlbnRpb25Qb2xpY3kuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2Nmbi1sb2dzLWxvZ2dyb3VwLXJldGVudGlvbmluZGF5c1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHJldGVudGlvbkluRGF5cz86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGUgbG9nIGdyb3VwLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVGFnXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yZXNvdXJjZS10YWdzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNjZm4tbG9ncy1sb2dncm91cC10YWdzXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGFncz86IGNkay5DZm5UYWdbXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5Mb2dHcm91cFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5Mb2dHcm91cFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkxvZ0dyb3VwUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhUHJvdGVjdGlvblBvbGljeScsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5kYXRhUHJvdGVjdGlvblBvbGljeSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna21zS2V5SWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMua21zS2V5SWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5sb2dHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JldGVudGlvbkluRGF5cycsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy5yZXRlbnRpb25JbkRheXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVDZm5UYWcpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuTG9nR3JvdXBQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TG9nR3JvdXBgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkxvZ0dyb3VwUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6OkxvZ0dyb3VwYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkxvZ0dyb3VwUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkxvZ0dyb3VwUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIERhdGFQcm90ZWN0aW9uUG9saWN5OiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRhdGFQcm90ZWN0aW9uUG9saWN5KSxcbiAgICAgICAgS21zS2V5SWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua21zS2V5SWQpLFxuICAgICAgICBMb2dHcm91cE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubG9nR3JvdXBOYW1lKSxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJldGVudGlvbkluRGF5cyksXG4gICAgICAgIFRhZ3M6IGNkay5saXN0TWFwcGVyKGNkay5jZm5UYWdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnRhZ3MpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5Mb2dHcm91cFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuTG9nR3JvdXBQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuTG9nR3JvdXBQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RhdGFQcm90ZWN0aW9uUG9saWN5JywgJ0RhdGFQcm90ZWN0aW9uUG9saWN5JywgcHJvcGVydGllcy5EYXRhUHJvdGVjdGlvblBvbGljeSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBbnkocHJvcGVydGllcy5EYXRhUHJvdGVjdGlvblBvbGljeSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgna21zS2V5SWQnLCAnS21zS2V5SWQnLCBwcm9wZXJ0aWVzLkttc0tleUlkICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkttc0tleUlkKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdsb2dHcm91cE5hbWUnLCAnTG9nR3JvdXBOYW1lJywgcHJvcGVydGllcy5Mb2dHcm91cE5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZXRlbnRpb25JbkRheXMnLCAnUmV0ZW50aW9uSW5EYXlzJywgcHJvcGVydGllcy5SZXRlbnRpb25JbkRheXMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHByb3BlcnRpZXMuUmV0ZW50aW9uSW5EYXlzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRDZm5UYWcpKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkxvZ3M6OkxvZ0dyb3VwYFxuICpcbiAqIFRoZSBgQVdTOjpMb2dzOjpMb2dHcm91cGAgcmVzb3VyY2Ugc3BlY2lmaWVzIGEgbG9nIGdyb3VwLiBBIGxvZyBncm91cCBkZWZpbmVzIGNvbW1vbiBwcm9wZXJ0aWVzIGZvciBsb2cgc3RyZWFtcywgc3VjaCBhcyB0aGVpciByZXRlbnRpb24gYW5kIGFjY2VzcyBjb250cm9sIHJ1bGVzLiBFYWNoIGxvZyBzdHJlYW0gbXVzdCBiZWxvbmcgdG8gb25lIGxvZyBncm91cC5cbiAqXG4gKiBZb3UgY2FuIGNyZWF0ZSB1cCB0byAxLDAwMCwwMDAgbG9nIGdyb3VwcyBwZXIgUmVnaW9uIHBlciBhY2NvdW50LiBZb3UgbXVzdCB1c2UgdGhlIGZvbGxvd2luZyBndWlkZWxpbmVzIHdoZW4gbmFtaW5nIGEgbG9nIGdyb3VwOlxuICpcbiAqIC0gTG9nIGdyb3VwIG5hbWVzIG11c3QgYmUgdW5pcXVlIHdpdGhpbiBhIFJlZ2lvbiBmb3IgYW4gQVdTIGFjY291bnQuXG4gKiAtIExvZyBncm91cCBuYW1lcyBjYW4gYmUgYmV0d2VlbiAxIGFuZCA1MTIgY2hhcmFjdGVycyBsb25nLlxuICogLSBMb2cgZ3JvdXAgbmFtZXMgY29uc2lzdCBvZiB0aGUgZm9sbG93aW5nIGNoYXJhY3RlcnM6IGEteiwgQS1aLCAwLTksICdfJyAodW5kZXJzY29yZSksICctJyAoaHlwaGVuKSwgJy8nIChmb3J3YXJkIHNsYXNoKSwgYW5kICcuJyAocGVyaW9kKS5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkxvZ3M6OkxvZ0dyb3VwXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5Mb2dHcm91cCBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OkxvZ3M6OkxvZ0dyb3VwXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuTG9nR3JvdXAge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkxvZ0dyb3VwUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkxvZ0dyb3VwKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgdGhlIGxvZyBncm91cCwgc3VjaCBhcyBgYXJuOmF3czpsb2dzOnVzLXdlc3QtMToxMjM0NTY3ODkwMTI6bG9nLWdyb3VwOi9teXN0YWNrLXRlc3Rncm91cC0xMkFCQzFBQjEyQTE6KmBcbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBkYXRhIHByb3RlY3Rpb24gcG9saWN5IGFuZCBhc3NpZ25zIGl0IHRvIHRoZSBsb2cgZ3JvdXAuIEEgZGF0YSBwcm90ZWN0aW9uIHBvbGljeSBjYW4gaGVscCBzYWZlZ3VhcmQgc2Vuc2l0aXZlIGRhdGEgdGhhdCdzIGluZ2VzdGVkIGJ5IHRoZSBsb2cgZ3JvdXAgYnkgYXVkaXRpbmcgYW5kIG1hc2tpbmcgdGhlIHNlbnNpdGl2ZSBsb2cgZGF0YS4gV2hlbiBhIHVzZXIgd2hvIGRvZXMgbm90IGhhdmUgcGVybWlzc2lvbiB0byB2aWV3IG1hc2tlZCBkYXRhIHZpZXdzIGEgbG9nIGV2ZW50IHRoYXQgaW5jbHVkZXMgbWFza2VkIGRhdGEsIHRoZSBzZW5zaXRpdmUgZGF0YSBpcyByZXBsYWNlZCBieSBhc3Rlcmlza3MuXG4gICAgICpcbiAgICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgaW5jbHVkaW5nIGEgbGlzdCBvZiB0eXBlcyBvZiBkYXRhIHRoYXQgY2FuIGJlIGF1ZGl0ZWQgYW5kIG1hc2tlZCwgc2VlIFtQcm90ZWN0IHNlbnNpdGl2ZSBsb2cgZGF0YSB3aXRoIG1hc2tpbmddKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL21hc2stc2Vuc2l0aXZlLWxvZy1kYXRhLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNjZm4tbG9ncy1sb2dncm91cC1kYXRhcHJvdGVjdGlvbnBvbGljeVxuICAgICAqL1xuICAgIHB1YmxpYyBkYXRhUHJvdGVjdGlvblBvbGljeTogYW55IHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBBV1MgS01TIGtleSB0byB1c2Ugd2hlbiBlbmNyeXB0aW5nIGxvZyBkYXRhLlxuICAgICAqXG4gICAgICogVG8gYXNzb2NpYXRlIGFuIEFXUyBLTVMga2V5IHdpdGggdGhlIGxvZyBncm91cCwgc3BlY2lmeSB0aGUgQVJOIG9mIHRoYXQgS01TIGtleSBoZXJlLiBJZiB5b3UgZG8gc28sIGluZ2VzdGVkIGRhdGEgaXMgZW5jcnlwdGVkIHVzaW5nIHRoaXMga2V5LiBUaGlzIGFzc29jaWF0aW9uIGlzIHN0b3JlZCBhcyBsb25nIGFzIHRoZSBkYXRhIGVuY3J5cHRlZCB3aXRoIHRoZSBLTVMga2V5IGlzIHN0aWxsIHdpdGhpbiBDbG91ZFdhdGNoIExvZ3MgLiBUaGlzIGVuYWJsZXMgQ2xvdWRXYXRjaCBMb2dzIHRvIGRlY3J5cHQgdGhpcyBkYXRhIHdoZW5ldmVyIGl0IGlzIHJlcXVlc3RlZC5cbiAgICAgKlxuICAgICAqIElmIHlvdSBhdHRlbXB0IHRvIGFzc29jaWF0ZSBhIEtNUyBrZXkgd2l0aCB0aGUgbG9nIGdyb3VwIGJ1dCB0aGUgS01TIGtleSBkb2Vzbid0IGV4aXN0IG9yIGlzIGRlYWN0aXZhdGVkLCB5b3Ugd2lsbCByZWNlaXZlIGFuIGBJbnZhbGlkUGFyYW1ldGVyRXhjZXB0aW9uYCBlcnJvci5cbiAgICAgKlxuICAgICAqIExvZyBncm91cCBkYXRhIGlzIGFsd2F5cyBlbmNyeXB0ZWQgaW4gQ2xvdWRXYXRjaCBMb2dzIC4gSWYgeW91IG9taXQgdGhpcyBrZXksIHRoZSBlbmNyeXB0aW9uIGRvZXMgbm90IHVzZSBBV1MgS01TIC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbRW5jcnlwdCBsb2cgZGF0YSBpbiBDbG91ZFdhdGNoIExvZ3MgdXNpbmcgQVdTIEtleSBNYW5hZ2VtZW50IFNlcnZpY2VdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL2VuY3J5cHQtbG9nLWRhdGEta21zLmh0bWwpXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWxvZ2dyb3VwLmh0bWwjY2ZuLWxvZ3MtbG9nZ3JvdXAta21za2V5aWRcbiAgICAgKi9cbiAgICBwdWJsaWMga21zS2V5SWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAuIElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgbmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhIHVuaXF1ZSBJRCBmb3IgdGhlIGxvZyBncm91cC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNjZm4tbG9ncy1sb2dncm91cC1sb2dncm91cG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9nR3JvdXBOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgdG8gcmV0YWluIHRoZSBsb2cgZXZlbnRzIGluIHRoZSBzcGVjaWZpZWQgbG9nIGdyb3VwLiBQb3NzaWJsZSB2YWx1ZXMgYXJlOiAxLCAzLCA1LCA3LCAxNCwgMzAsIDYwLCA5MCwgMTIwLCAxNTAsIDE4MCwgMzY1LCA0MDAsIDU0NSwgNzMxLCAxODI3LCAyMTkyLCAyNTU3LCAyOTIyLCAzMjg4LCBhbmQgMzY1My5cbiAgICAgKlxuICAgICAqIFRvIHNldCBhIGxvZyBncm91cCBzbyB0aGF0IGl0cyBsb2cgZXZlbnRzIGRvIG5vdCBleHBpcmUsIHVzZSBbRGVsZXRlUmV0ZW50aW9uUG9saWN5XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaExvZ3MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfRGVsZXRlUmV0ZW50aW9uUG9saWN5Lmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNjZm4tbG9ncy1sb2dncm91cC1yZXRlbnRpb25pbmRheXNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmV0ZW50aW9uSW5EYXlzOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYXBwbHkgdG8gdGhlIGxvZyBncm91cC5cbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1RhZ10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcmVzb3VyY2UtdGFncy5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWxvZ2dyb3VwLmh0bWwjY2ZuLWxvZ3MtbG9nZ3JvdXAtdGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpMb2dzOjpMb2dHcm91cGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkxvZ0dyb3VwUHJvcHMgPSB7fSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuTG9nR3JvdXAuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIHRoaXMuYXR0ckFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLmRhdGFQcm90ZWN0aW9uUG9saWN5ID0gcHJvcHMuZGF0YVByb3RlY3Rpb25Qb2xpY3k7XG4gICAgICAgIHRoaXMua21zS2V5SWQgPSBwcm9wcy5rbXNLZXlJZDtcbiAgICAgICAgdGhpcy5sb2dHcm91cE5hbWUgPSBwcm9wcy5sb2dHcm91cE5hbWU7XG4gICAgICAgIHRoaXMucmV0ZW50aW9uSW5EYXlzID0gcHJvcHMucmV0ZW50aW9uSW5EYXlzO1xuICAgICAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuU1RBTkRBUkQsIFwiQVdTOjpMb2dzOjpMb2dHcm91cFwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgICAgICBpZiAodGhpcy5ub2RlLnNjb3BlICYmIGNkay5SZXNvdXJjZS5pc1Jlc291cmNlKHRoaXMubm9kZS5zY29wZSkpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMuY2ZuT3B0aW9ucy5kZWxldGlvblBvbGljeSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgID8gWydcXCdBV1M6OkxvZ3M6OkxvZ0dyb3VwXFwnIGlzIGEgc3RhdGVmdWwgcmVzb3VyY2UgdHlwZSwgYW5kIHlvdSBtdXN0IHNwZWNpZnkgYSBSZW1vdmFsIFBvbGljeSBmb3IgaXQuIENhbGwgXFwncmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KClcXCcuJ11cbiAgICAgICAgICAgICAgOiBbXSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuTG9nR3JvdXAuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGFQcm90ZWN0aW9uUG9saWN5OiB0aGlzLmRhdGFQcm90ZWN0aW9uUG9saWN5LFxuICAgICAgICAgICAga21zS2V5SWQ6IHRoaXMua21zS2V5SWQsXG4gICAgICAgICAgICBsb2dHcm91cE5hbWU6IHRoaXMubG9nR3JvdXBOYW1lLFxuICAgICAgICAgICAgcmV0ZW50aW9uSW5EYXlzOiB0aGlzLnJldGVudGlvbkluRGF5cyxcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuTG9nR3JvdXBQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5Mb2dTdHJlYW1gXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nc3RyZWFtLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Mb2dTdHJlYW1Qcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHdoZXJlIHRoZSBsb2cgc3RyZWFtIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLWxvZ3N0cmVhbS5odG1sI2Nmbi1sb2dzLWxvZ3N0cmVhbS1sb2dncm91cG5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBsb2cgc3RyZWFtLiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIGxvZyBncm91cC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nc3RyZWFtLmh0bWwjY2ZuLWxvZ3MtbG9nc3RyZWFtLWxvZ3N0cmVhbW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBsb2dTdHJlYW1OYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkxvZ1N0cmVhbVByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5Mb2dTdHJlYW1Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5Mb2dTdHJlYW1Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5sb2dHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5sb2dHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ1N0cmVhbU5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubG9nU3RyZWFtTmFtZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5Mb2dTdHJlYW1Qcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TG9nU3RyZWFtYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5Mb2dTdHJlYW1Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TG9nU3RyZWFtYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkxvZ1N0cmVhbVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5Mb2dTdHJlYW1Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTG9nR3JvdXBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZSksXG4gICAgICAgIExvZ1N0cmVhbU5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubG9nU3RyZWFtTmFtZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkxvZ1N0cmVhbVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuTG9nU3RyZWFtUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkxvZ1N0cmVhbVByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbG9nR3JvdXBOYW1lJywgJ0xvZ0dyb3VwTmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdsb2dTdHJlYW1OYW1lJywgJ0xvZ1N0cmVhbU5hbWUnLCBwcm9wZXJ0aWVzLkxvZ1N0cmVhbU5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTG9nU3RyZWFtTmFtZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6TG9nczo6TG9nU3RyZWFtYFxuICpcbiAqIFRoZSBgQVdTOjpMb2dzOjpMb2dTdHJlYW1gIHJlc291cmNlIHNwZWNpZmllcyBhbiBBbWF6b24gQ2xvdWRXYXRjaCBMb2dzIGxvZyBzdHJlYW0gaW4gYSBzcGVjaWZpYyBsb2cgZ3JvdXAuIEEgbG9nIHN0cmVhbSByZXByZXNlbnRzIHRoZSBzZXF1ZW5jZSBvZiBldmVudHMgY29taW5nIGZyb20gYW4gYXBwbGljYXRpb24gaW5zdGFuY2Ugb3IgcmVzb3VyY2UgdGhhdCB5b3UgYXJlIG1vbml0b3JpbmcuXG4gKlxuICogVGhlcmUgaXMgbm8gbGltaXQgb24gdGhlIG51bWJlciBvZiBsb2cgc3RyZWFtcyB0aGF0IHlvdSBjYW4gY3JlYXRlIGZvciBhIGxvZyBncm91cC5cbiAqXG4gKiBZb3UgbXVzdCB1c2UgdGhlIGZvbGxvd2luZyBndWlkZWxpbmVzIHdoZW4gbmFtaW5nIGEgbG9nIHN0cmVhbTpcbiAqXG4gKiAtIExvZyBzdHJlYW0gbmFtZXMgbXVzdCBiZSB1bmlxdWUgd2l0aGluIHRoZSBsb2cgZ3JvdXAuXG4gKiAtIExvZyBzdHJlYW0gbmFtZXMgY2FuIGJlIGJldHdlZW4gMSBhbmQgNTEyIGNoYXJhY3RlcnMgbG9uZy5cbiAqIC0gVGhlICc6JyAoY29sb24pIGFuZCAnKicgKGFzdGVyaXNrKSBjaGFyYWN0ZXJzIGFyZSBub3QgYWxsb3dlZC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkxvZ3M6OkxvZ1N0cmVhbVxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nc3RyZWFtLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkxvZ1N0cmVhbSBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OkxvZ3M6OkxvZ1N0cmVhbVwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbkxvZ1N0cmVhbSB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuTG9nU3RyZWFtUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkxvZ1N0cmVhbShzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBJZFxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRySWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgd2hlcmUgdGhlIGxvZyBzdHJlYW0gaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nc3RyZWFtLmh0bWwjY2ZuLWxvZ3MtbG9nc3RyZWFtLWxvZ2dyb3VwbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBsb2cgc3RyZWFtLiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIGxvZyBncm91cC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nc3RyZWFtLmh0bWwjY2ZuLWxvZ3MtbG9nc3RyZWFtLWxvZ3N0cmVhbW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9nU3RyZWFtTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkxvZ3M6OkxvZ1N0cmVhbWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkxvZ1N0cmVhbVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5Mb2dTdHJlYW0uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdsb2dHcm91cE5hbWUnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRySWQgPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0lkJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLmxvZ0dyb3VwTmFtZSA9IHByb3BzLmxvZ0dyb3VwTmFtZTtcbiAgICAgICAgdGhpcy5sb2dTdHJlYW1OYW1lID0gcHJvcHMubG9nU3RyZWFtTmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkxvZ1N0cmVhbS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9nR3JvdXBOYW1lOiB0aGlzLmxvZ0dyb3VwTmFtZSxcbiAgICAgICAgICAgIGxvZ1N0cmVhbU5hbWU6IHRoaXMubG9nU3RyZWFtTmFtZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5Mb2dTdHJlYW1Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5NZXRyaWNGaWx0ZXJgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5NZXRyaWNGaWx0ZXJQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBBIGZpbHRlciBwYXR0ZXJuIGZvciBleHRyYWN0aW5nIG1ldHJpYyBkYXRhIG91dCBvZiBpbmdlc3RlZCBsb2cgZXZlbnRzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtGaWx0ZXIgYW5kIFBhdHRlcm4gU3ludGF4XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9GaWx0ZXJBbmRQYXR0ZXJuU3ludGF4Lmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLWZpbHRlcnBhdHRlcm5cbiAgICAgKi9cbiAgICByZWFkb25seSBmaWx0ZXJQYXR0ZXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiBhbiBleGlzdGluZyBsb2cgZ3JvdXAgdGhhdCB5b3Ugd2FudCB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIG1ldHJpYyBmaWx0ZXIuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLW1ldHJpY2ZpbHRlci5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1sb2dncm91cG5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBtZXRyaWMgdHJhbnNmb3JtYXRpb25zLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb25zXG4gICAgICovXG4gICAgcmVhZG9ubHkgbWV0cmljVHJhbnNmb3JtYXRpb25zOiBBcnJheTxDZm5NZXRyaWNGaWx0ZXIuTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbWV0cmljIGZpbHRlci5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLWZpbHRlcm5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBmaWx0ZXJOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbk1ldHJpY0ZpbHRlclByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5NZXRyaWNGaWx0ZXJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5NZXRyaWNGaWx0ZXJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpbHRlck5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZmlsdGVyTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyUGF0dGVybicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5maWx0ZXJQYXR0ZXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJQYXR0ZXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmZpbHRlclBhdHRlcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5sb2dHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5sb2dHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY1RyYW5zZm9ybWF0aW9ucycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5tZXRyaWNUcmFuc2Zvcm1hdGlvbnMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY1RyYW5zZm9ybWF0aW9ucycsIGNkay5saXN0VmFsaWRhdG9yKENmbk1ldHJpY0ZpbHRlcl9NZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5tZXRyaWNUcmFuc2Zvcm1hdGlvbnMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuTWV0cmljRmlsdGVyUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlcmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuTWV0cmljRmlsdGVyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlcmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5NZXRyaWNGaWx0ZXJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTWV0cmljRmlsdGVyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEZpbHRlclBhdHRlcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmlsdGVyUGF0dGVybiksXG4gICAgICAgIExvZ0dyb3VwTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5sb2dHcm91cE5hbWUpLFxuICAgICAgICBNZXRyaWNUcmFuc2Zvcm1hdGlvbnM6IGNkay5saXN0TWFwcGVyKGNmbk1ldHJpY0ZpbHRlck1ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLm1ldHJpY1RyYW5zZm9ybWF0aW9ucyksXG4gICAgICAgIEZpbHRlck5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmlsdGVyTmFtZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbk1ldHJpY0ZpbHRlclByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuTWV0cmljRmlsdGVyUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbk1ldHJpY0ZpbHRlclByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZmlsdGVyUGF0dGVybicsICdGaWx0ZXJQYXR0ZXJuJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5GaWx0ZXJQYXR0ZXJuKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdsb2dHcm91cE5hbWUnLCAnTG9nR3JvdXBOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Mb2dHcm91cE5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ21ldHJpY1RyYW5zZm9ybWF0aW9ucycsICdNZXRyaWNUcmFuc2Zvcm1hdGlvbnMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmbk1ldHJpY0ZpbHRlck1ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuTWV0cmljVHJhbnNmb3JtYXRpb25zKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdmaWx0ZXJOYW1lJywgJ0ZpbHRlck5hbWUnLCBwcm9wZXJ0aWVzLkZpbHRlck5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRmlsdGVyTmFtZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyYFxuICpcbiAqIFRoZSBgQVdTOjpMb2dzOjpNZXRyaWNGaWx0ZXJgIHJlc291cmNlIHNwZWNpZmllcyBhIG1ldHJpYyBmaWx0ZXIgdGhhdCBkZXNjcmliZXMgaG93IENsb3VkV2F0Y2ggTG9ncyBleHRyYWN0cyBpbmZvcm1hdGlvbiBmcm9tIGxvZ3MgYW5kIHRyYW5zZm9ybXMgaXQgaW50byBBbWF6b24gQ2xvdWRXYXRjaCBtZXRyaWNzLiBJZiB5b3UgaGF2ZSBtdWx0aXBsZSBtZXRyaWMgZmlsdGVycyB0aGF0IGFyZSBhc3NvY2lhdGVkIHdpdGggYSBsb2cgZ3JvdXAsIGFsbCB0aGUgZmlsdGVycyBhcmUgYXBwbGllZCB0byB0aGUgbG9nIHN0cmVhbXMgaW4gdGhhdCBncm91cC5cbiAqXG4gKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgbWV0cmljIGZpbHRlcnMgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgbG9nIGdyb3VwIGlzIDEwMC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlclxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbk1ldHJpY0ZpbHRlciBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlclwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbk1ldHJpY0ZpbHRlciB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuTWV0cmljRmlsdGVyUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbk1ldHJpY0ZpbHRlcihzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGZpbHRlciBwYXR0ZXJuIGZvciBleHRyYWN0aW5nIG1ldHJpYyBkYXRhIG91dCBvZiBpbmdlc3RlZCBsb2cgZXZlbnRzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtGaWx0ZXIgYW5kIFBhdHRlcm4gU3ludGF4XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9GaWx0ZXJBbmRQYXR0ZXJuU3ludGF4Lmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLWZpbHRlcnBhdHRlcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgZmlsdGVyUGF0dGVybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgYW4gZXhpc3RpbmcgbG9nIGdyb3VwIHRoYXQgeW91IHdhbnQgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBtZXRyaWMgZmlsdGVyLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1tZXRyaWNmaWx0ZXIuaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItbG9nZ3JvdXBuYW1lXG4gICAgICovXG4gICAgcHVibGljIGxvZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1ldHJpYyB0cmFuc2Zvcm1hdGlvbnMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLW1ldHJpY2ZpbHRlci5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbnNcbiAgICAgKi9cbiAgICBwdWJsaWMgbWV0cmljVHJhbnNmb3JtYXRpb25zOiBBcnJheTxDZm5NZXRyaWNGaWx0ZXIuTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbWV0cmljIGZpbHRlci5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLWZpbHRlcm5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlsdGVyTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlcmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbk1ldHJpY0ZpbHRlclByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5NZXRyaWNGaWx0ZXIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdmaWx0ZXJQYXR0ZXJuJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdsb2dHcm91cE5hbWUnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ21ldHJpY1RyYW5zZm9ybWF0aW9ucycsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZmlsdGVyUGF0dGVybiA9IHByb3BzLmZpbHRlclBhdHRlcm47XG4gICAgICAgIHRoaXMubG9nR3JvdXBOYW1lID0gcHJvcHMubG9nR3JvdXBOYW1lO1xuICAgICAgICB0aGlzLm1ldHJpY1RyYW5zZm9ybWF0aW9ucyA9IHByb3BzLm1ldHJpY1RyYW5zZm9ybWF0aW9ucztcbiAgICAgICAgdGhpcy5maWx0ZXJOYW1lID0gcHJvcHMuZmlsdGVyTmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbk1ldHJpY0ZpbHRlci5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlsdGVyUGF0dGVybjogdGhpcy5maWx0ZXJQYXR0ZXJuLFxuICAgICAgICAgICAgbG9nR3JvdXBOYW1lOiB0aGlzLmxvZ0dyb3VwTmFtZSxcbiAgICAgICAgICAgIG1ldHJpY1RyYW5zZm9ybWF0aW9uczogdGhpcy5tZXRyaWNUcmFuc2Zvcm1hdGlvbnMsXG4gICAgICAgICAgICBmaWx0ZXJOYW1lOiB0aGlzLmZpbHRlck5hbWUsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuTWV0cmljRmlsdGVyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuTWV0cmljRmlsdGVyIHtcbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIENsb3VkV2F0Y2ggbWV0cmljIGRpbWVuc2lvbnMgdG8gcHVibGlzaCB3aXRoIHRoaXMgbWV0cmljLlxuICAgICAqXG4gICAgICogQmVjYXVzZSBkaW1lbnNpb25zIGFyZSBwYXJ0IG9mIHRoZSB1bmlxdWUgaWRlbnRpZmllciBmb3IgYSBtZXRyaWMsIHdoZW5ldmVyIGEgdW5pcXVlIGRpbWVuc2lvbiBuYW1lL3ZhbHVlIHBhaXIgaXMgZXh0cmFjdGVkIGZyb20geW91ciBsb2dzLCB5b3UgYXJlIGNyZWF0aW5nIGEgbmV3IHZhcmlhdGlvbiBvZiB0aGF0IG1ldHJpYy5cbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHB1Ymxpc2hpbmcgZGltZW5zaW9ucyB3aXRoIG1ldHJpY3MgY3JlYXRlZCBieSBtZXRyaWMgZmlsdGVycywgc2VlIFtQdWJsaXNoaW5nIGRpbWVuc2lvbnMgd2l0aCBtZXRyaWNzIGZyb20gdmFsdWVzIGluIEpTT04gb3Igc3BhY2UtZGVsaW1pdGVkIGxvZyBldmVudHNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0ZpbHRlckFuZFBhdHRlcm5TeW50YXguaHRtbCNsb2dzLW1ldHJpYy1maWx0ZXJzLWRpbWVuc2lvbnMpIC5cbiAgICAgKlxuICAgICAqID4gTWV0cmljcyBleHRyYWN0ZWQgZnJvbSBsb2cgZXZlbnRzIGFyZSBjaGFyZ2VkIGFzIGN1c3RvbSBtZXRyaWNzLiBUbyBwcmV2ZW50IHVuZXhwZWN0ZWQgaGlnaCBjaGFyZ2VzLCBkbyBub3Qgc3BlY2lmeSBoaWdoLWNhcmRpbmFsaXR5IGZpZWxkcyBzdWNoIGFzIGBJUEFkZHJlc3NgIG9yIGByZXF1ZXN0SURgIGFzIGRpbWVuc2lvbnMuIEVhY2ggZGlmZmVyZW50IHZhbHVlIGZvdW5kIGZvciBhIGRpbWVuc2lvbiBpcyB0cmVhdGVkIGFzIGEgc2VwYXJhdGUgbWV0cmljIGFuZCBhY2NydWVzIGNoYXJnZXMgYXMgYSBzZXBhcmF0ZSBjdXN0b20gbWV0cmljLlxuICAgICAqID5cbiAgICAgKiA+IFRvIGhlbHAgcHJldmVudCBhY2NpZGVudGFsIGhpZ2ggY2hhcmdlcywgQW1hem9uIGRpc2FibGVzIGEgbWV0cmljIGZpbHRlciBpZiBpdCBnZW5lcmF0ZXMgMTAwMCBkaWZmZXJlbnQgbmFtZS92YWx1ZSBwYWlycyBmb3IgdGhlIGRpbWVuc2lvbnMgdGhhdCB5b3UgaGF2ZSBzcGVjaWZpZWQgd2l0aGluIGEgY2VydGFpbiBhbW91bnQgb2YgdGltZS5cbiAgICAgKiA+XG4gICAgICogPiBZb3UgY2FuIGFsc28gc2V0IHVwIGEgYmlsbGluZyBhbGFybSB0byBhbGVydCB5b3UgaWYgeW91ciBjaGFyZ2VzIGFyZSBoaWdoZXIgdGhhbiBleHBlY3RlZC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQ3JlYXRpbmcgYSBCaWxsaW5nIEFsYXJtIHRvIE1vbml0b3IgWW91ciBFc3RpbWF0ZWQgQVdTIENoYXJnZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL21vbml0b3JfZXN0aW1hdGVkX2NoYXJnZXNfd2l0aF9jbG91ZHdhdGNoLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLWRpbWVuc2lvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBEaW1lbnNpb25Qcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmFtZSBmb3IgdGhlIENsb3VkV2F0Y2ggbWV0cmljIGRpbWVuc2lvbiB0aGF0IHRoZSBtZXRyaWMgZmlsdGVyIGNyZWF0ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIERpbWVuc2lvbiBuYW1lcyBtdXN0IGNvbnRhaW4gb25seSBBU0NJSSBjaGFyYWN0ZXJzLCBtdXN0IGluY2x1ZGUgYXQgbGVhc3Qgb25lIG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciwgYW5kIGNhbm5vdCBzdGFydCB3aXRoIGEgY29sb24gKDopLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLWRpbWVuc2lvbi5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1kaW1lbnNpb24ta2V5XG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBrZXk6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsb2cgZXZlbnQgZmllbGQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIHZhbHVlIGZvciB0aGlzIGRpbWVuc2lvbi4gVGhpcyBkaW1lbnNpb24gd2lsbCBvbmx5IGJlIHB1Ymxpc2hlZCBmb3IgYSBtZXRyaWMgaWYgdGhlIHZhbHVlIGlzIGZvdW5kIGluIHRoZSBsb2cgZXZlbnQuIEZvciBleGFtcGxlLCBgJC5ldmVudFR5cGVgIGZvciBKU09OIGxvZyBldmVudHMsIG9yIGAkc2VydmVyYCBmb3Igc3BhY2UtZGVsaW1pdGVkIGxvZyBldmVudHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItZGltZW5zaW9uLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLWRpbWVuc2lvbi12YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgRGltZW5zaW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYERpbWVuc2lvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbk1ldHJpY0ZpbHRlcl9EaW1lbnNpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2tleScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5rZXkpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2tleScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5rZXkpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZhbHVlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnZhbHVlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd2YWx1ZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy52YWx1ZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJEaW1lbnNpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyLkRpbWVuc2lvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRGltZW5zaW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlci5EaW1lbnNpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuTWV0cmljRmlsdGVyRGltZW5zaW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbk1ldHJpY0ZpbHRlcl9EaW1lbnNpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgS2V5OiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmtleSksXG4gICAgICAgIFZhbHVlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnZhbHVlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuTWV0cmljRmlsdGVyRGltZW5zaW9uUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5NZXRyaWNGaWx0ZXIuRGltZW5zaW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuTWV0cmljRmlsdGVyLkRpbWVuc2lvblByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgna2V5JywgJ0tleScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuS2V5KSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd2YWx1ZScsICdWYWx1ZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVmFsdWUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5NZXRyaWNGaWx0ZXIge1xuICAgIC8qKlxuICAgICAqIGBNZXRyaWNUcmFuc2Zvcm1hdGlvbmAgaXMgYSBwcm9wZXJ0eSBvZiB0aGUgYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyYCByZXNvdXJjZSB0aGF0IGRlc2NyaWJlcyBob3cgdG8gdHJhbnNmb3JtIGxvZyBzdHJlYW1zIGludG8gYSBDbG91ZFdhdGNoIG1ldHJpYy5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIE1ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogKE9wdGlvbmFsKSBUaGUgdmFsdWUgdG8gZW1pdCB3aGVuIGEgZmlsdGVyIHBhdHRlcm4gZG9lcyBub3QgbWF0Y2ggYSBsb2cgZXZlbnQuIFRoaXMgdmFsdWUgY2FuIGJlIG51bGwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24uaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24tZGVmYXVsdHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBkZWZhdWx0VmFsdWU/OiBudW1iZXI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZmllbGRzIHRvIHVzZSBhcyBkaW1lbnNpb25zIGZvciB0aGUgbWV0cmljLiBPbmUgbWV0cmljIGZpbHRlciBjYW4gaW5jbHVkZSBhcyBtYW55IGFzIHRocmVlIGRpbWVuc2lvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqID4gTWV0cmljcyBleHRyYWN0ZWQgZnJvbSBsb2cgZXZlbnRzIGFyZSBjaGFyZ2VkIGFzIGN1c3RvbSBtZXRyaWNzLiBUbyBwcmV2ZW50IHVuZXhwZWN0ZWQgaGlnaCBjaGFyZ2VzLCBkbyBub3Qgc3BlY2lmeSBoaWdoLWNhcmRpbmFsaXR5IGZpZWxkcyBzdWNoIGFzIGBJUEFkZHJlc3NgIG9yIGByZXF1ZXN0SURgIGFzIGRpbWVuc2lvbnMuIEVhY2ggZGlmZmVyZW50IHZhbHVlIGZvdW5kIGZvciBhIGRpbWVuc2lvbiBpcyB0cmVhdGVkIGFzIGEgc2VwYXJhdGUgbWV0cmljIGFuZCBhY2NydWVzIGNoYXJnZXMgYXMgYSBzZXBhcmF0ZSBjdXN0b20gbWV0cmljLlxuICAgICAgICAgKiA+XG4gICAgICAgICAqID4gQ2xvdWRXYXRjaCBMb2dzIGRpc2FibGVzIGEgbWV0cmljIGZpbHRlciBpZiBpdCBnZW5lcmF0ZXMgMTAwMCBkaWZmZXJlbnQgbmFtZS92YWx1ZSBwYWlycyBmb3IgeW91ciBzcGVjaWZpZWQgZGltZW5zaW9ucyB3aXRoaW4gYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lLiBUaGlzIGhlbHBzIHRvIHByZXZlbnQgYWNjaWRlbnRhbCBoaWdoIGNoYXJnZXMuXG4gICAgICAgICAqID5cbiAgICAgICAgICogPiBZb3UgY2FuIGFsc28gc2V0IHVwIGEgYmlsbGluZyBhbGFybSB0byBhbGVydCB5b3UgaWYgeW91ciBjaGFyZ2VzIGFyZSBoaWdoZXIgdGhhbiBleHBlY3RlZC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQ3JlYXRpbmcgYSBCaWxsaW5nIEFsYXJtIHRvIE1vbml0b3IgWW91ciBFc3RpbWF0ZWQgQVdTIENoYXJnZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL21vbml0b3JfZXN0aW1hdGVkX2NoYXJnZXNfd2l0aF9jbG91ZHdhdGNoLmh0bWwpIC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi1kaW1lbnNpb25zXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBkaW1lbnNpb25zPzogQXJyYXk8Q2ZuTWV0cmljRmlsdGVyLkRpbWVuc2lvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBDbG91ZFdhdGNoIG1ldHJpYy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi1tZXRyaWNuYW1lXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGN1c3RvbSBuYW1lc3BhY2UgdG8gY29udGFpbiB5b3VyIG1ldHJpYyBpbiBDbG91ZFdhdGNoLiBVc2UgbmFtZXNwYWNlcyB0byBncm91cCB0b2dldGhlciBtZXRyaWNzIHRoYXQgYXJlIHNpbWlsYXIuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW05hbWVzcGFjZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL2Nsb3Vkd2F0Y2hfY29uY2VwdHMuaHRtbCNOYW1lc3BhY2UpIC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi1tZXRyaWNuYW1lc3BhY2VcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IG1ldHJpY05hbWVzcGFjZTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHZhbHVlIHRoYXQgaXMgcHVibGlzaGVkIHRvIHRoZSBDbG91ZFdhdGNoIG1ldHJpYy4gRm9yIGV4YW1wbGUsIGlmIHlvdSdyZSBjb3VudGluZyB0aGUgb2NjdXJyZW5jZXMgb2YgYSBwYXJ0aWN1bGFyIHRlcm0gbGlrZSBgRXJyb3JgICwgc3BlY2lmeSAxIGZvciB0aGUgbWV0cmljIHZhbHVlLiBJZiB5b3UncmUgY291bnRpbmcgdGhlIG51bWJlciBvZiBieXRlcyB0cmFuc2ZlcnJlZCwgcmVmZXJlbmNlIHRoZSB2YWx1ZSB0aGF0IGlzIGluIHRoZSBsb2cgZXZlbnQgYnkgdXNpbmcgJC4gZm9sbG93ZWQgYnkgdGhlIG5hbWUgb2YgdGhlIGZpZWxkIHRoYXQgeW91IHNwZWNpZmllZCBpbiB0aGUgZmlsdGVyIHBhdHRlcm4sIHN1Y2ggYXMgYCQuc2l6ZWAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLW1ldHJpY3ZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBtZXRyaWNWYWx1ZTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHVuaXQgdG8gYXNzaWduIHRvIHRoZSBtZXRyaWMuIElmIHlvdSBvbWl0IHRoaXMsIHRoZSB1bml0IGlzIHNldCBhcyBgTm9uZWAgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLmh0bWwjY2ZuLWxvZ3MtbWV0cmljZmlsdGVyLW1ldHJpY3RyYW5zZm9ybWF0aW9uLXVuaXRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHVuaXQ/OiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYE1ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYE1ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTWV0cmljRmlsdGVyX01ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZWZhdWx0VmFsdWUnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMuZGVmYXVsdFZhbHVlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkaW1lbnNpb25zJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuTWV0cmljRmlsdGVyX0RpbWVuc2lvblByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5kaW1lbnNpb25zKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdtZXRyaWNOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm1ldHJpY05hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY05hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubWV0cmljTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljTmFtZXNwYWNlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm1ldHJpY05hbWVzcGFjZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljTmFtZXNwYWNlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm1ldHJpY05hbWVzcGFjZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0cmljVmFsdWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubWV0cmljVmFsdWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21ldHJpY1ZhbHVlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm1ldHJpY1ZhbHVlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd1bml0JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnVuaXQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6TWV0cmljRmlsdGVyLk1ldHJpY1RyYW5zZm9ybWF0aW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBNZXRyaWNUcmFuc2Zvcm1hdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpNZXRyaWNGaWx0ZXIuTWV0cmljVHJhbnNmb3JtYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuTWV0cmljRmlsdGVyTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTWV0cmljRmlsdGVyX01ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIERlZmF1bHRWYWx1ZTogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZWZhdWx0VmFsdWUpLFxuICAgICAgICBEaW1lbnNpb25zOiBjZGsubGlzdE1hcHBlcihjZm5NZXRyaWNGaWx0ZXJEaW1lbnNpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuZGltZW5zaW9ucyksXG4gICAgICAgIE1ldHJpY05hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubWV0cmljTmFtZSksXG4gICAgICAgIE1ldHJpY05hbWVzcGFjZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5tZXRyaWNOYW1lc3BhY2UpLFxuICAgICAgICBNZXRyaWNWYWx1ZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5tZXRyaWNWYWx1ZSksXG4gICAgICAgIFVuaXQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudW5pdCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbk1ldHJpY0ZpbHRlck1ldHJpY1RyYW5zZm9ybWF0aW9uUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5NZXRyaWNGaWx0ZXIuTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5NZXRyaWNGaWx0ZXIuTWV0cmljVHJhbnNmb3JtYXRpb25Qcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RlZmF1bHRWYWx1ZScsICdEZWZhdWx0VmFsdWUnLCBwcm9wZXJ0aWVzLkRlZmF1bHRWYWx1ZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXROdW1iZXIocHJvcGVydGllcy5EZWZhdWx0VmFsdWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RpbWVuc2lvbnMnLCAnRGltZW5zaW9ucycsIHByb3BlcnRpZXMuRGltZW5zaW9ucyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5NZXRyaWNGaWx0ZXJEaW1lbnNpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5EaW1lbnNpb25zKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdtZXRyaWNOYW1lJywgJ01ldHJpY05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk1ldHJpY05hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ21ldHJpY05hbWVzcGFjZScsICdNZXRyaWNOYW1lc3BhY2UnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk1ldHJpY05hbWVzcGFjZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbWV0cmljVmFsdWUnLCAnTWV0cmljVmFsdWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk1ldHJpY1ZhbHVlKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd1bml0JywgJ1VuaXQnLCBwcm9wZXJ0aWVzLlVuaXQgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVW5pdCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblF1ZXJ5RGVmaW5pdGlvbmBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1xdWVyeWRlZmluaXRpb24uaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblF1ZXJ5RGVmaW5pdGlvblByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIEEgbmFtZSBmb3IgdGhlIHF1ZXJ5IGRlZmluaXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi5odG1sI2Nmbi1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi1uYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHF1ZXJ5IHN0cmluZyB0byB1c2UgZm9yIHRoaXMgcXVlcnkgZGVmaW5pdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQ2xvdWRXYXRjaCBMb2dzIEluc2lnaHRzIFF1ZXJ5IFN5bnRheF0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvQ1dMX1F1ZXJ5U3ludGF4Lmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtcXVlcnlkZWZpbml0aW9uLmh0bWwjY2ZuLWxvZ3MtcXVlcnlkZWZpbml0aW9uLXF1ZXJ5c3RyaW5nXG4gICAgICovXG4gICAgcmVhZG9ubHkgcXVlcnlTdHJpbmc6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzIHBhcmFtZXRlciBpZiB5b3Ugd2FudCB0aGUgcXVlcnkgdG8gcXVlcnkgb25seSBjZXJ0YWluIGxvZyBncm91cHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi5odG1sI2Nmbi1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi1sb2dncm91cG5hbWVzXG4gICAgICovXG4gICAgcmVhZG9ubHkgbG9nR3JvdXBOYW1lcz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblF1ZXJ5RGVmaW5pdGlvblByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5RdWVyeURlZmluaXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5RdWVyeURlZmluaXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZXMnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLmxvZ0dyb3VwTmFtZXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdxdWVyeVN0cmluZycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5xdWVyeVN0cmluZykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncXVlcnlTdHJpbmcnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucXVlcnlTdHJpbmcpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuUXVlcnlEZWZpbml0aW9uUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUXVlcnlEZWZpbml0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5RdWVyeURlZmluaXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUXVlcnlEZWZpbml0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubmFtZSksXG4gICAgICAgIFF1ZXJ5U3RyaW5nOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnF1ZXJ5U3RyaW5nKSxcbiAgICAgICAgTG9nR3JvdXBOYW1lczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMubG9nR3JvdXBOYW1lcyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblF1ZXJ5RGVmaW5pdGlvblByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUXVlcnlEZWZpbml0aW9uUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblF1ZXJ5RGVmaW5pdGlvblByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdxdWVyeVN0cmluZycsICdRdWVyeVN0cmluZycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUXVlcnlTdHJpbmcpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2xvZ0dyb3VwTmFtZXMnLCAnTG9nR3JvdXBOYW1lcycsIHByb3BlcnRpZXMuTG9nR3JvdXBOYW1lcyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmdBcnJheShwcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbmBcbiAqXG4gKiBDcmVhdGVzIGEgcXVlcnkgZGVmaW5pdGlvbiBmb3IgQ2xvdWRXYXRjaCBMb2dzIEluc2lnaHRzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBbmFseXppbmcgTG9nIERhdGEgd2l0aCBDbG91ZFdhdGNoIExvZ3MgSW5zaWdodHNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0FuYWx5emluZ0xvZ0RhdGEuaHRtbCkgLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1xdWVyeWRlZmluaXRpb24uaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUXVlcnlEZWZpbml0aW9uIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuUXVlcnlEZWZpbml0aW9uIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5RdWVyeURlZmluaXRpb25Qcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuUXVlcnlEZWZpbml0aW9uKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgcXVlcnkgZGVmaW5pdGlvbi5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgUXVlcnlEZWZpbml0aW9uSWRcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0clF1ZXJ5RGVmaW5pdGlvbklkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIG5hbWUgZm9yIHRoZSBxdWVyeSBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1xdWVyeWRlZmluaXRpb24uaHRtbCNjZm4tbG9ncy1xdWVyeWRlZmluaXRpb24tbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcXVlcnkgc3RyaW5nIHRvIHVzZSBmb3IgdGhpcyBxdWVyeSBkZWZpbml0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtDbG91ZFdhdGNoIExvZ3MgSW5zaWdodHMgUXVlcnkgU3ludGF4XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9DV0xfUXVlcnlTeW50YXguaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1xdWVyeWRlZmluaXRpb24uaHRtbCNjZm4tbG9ncy1xdWVyeWRlZmluaXRpb24tcXVlcnlzdHJpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgcXVlcnlTdHJpbmc6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzIHBhcmFtZXRlciBpZiB5b3Ugd2FudCB0aGUgcXVlcnkgdG8gcXVlcnkgb25seSBjZXJ0YWluIGxvZyBncm91cHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi5odG1sI2Nmbi1sb2dzLXF1ZXJ5ZGVmaW5pdGlvbi1sb2dncm91cG5hbWVzXG4gICAgICovXG4gICAgcHVibGljIGxvZ0dyb3VwTmFtZXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblF1ZXJ5RGVmaW5pdGlvblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5RdWVyeURlZmluaXRpb24uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICduYW1lJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdxdWVyeVN0cmluZycsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJRdWVyeURlZmluaXRpb25JZCA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnUXVlcnlEZWZpbml0aW9uSWQnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMucXVlcnlTdHJpbmcgPSBwcm9wcy5xdWVyeVN0cmluZztcbiAgICAgICAgdGhpcy5sb2dHcm91cE5hbWVzID0gcHJvcHMubG9nR3JvdXBOYW1lcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmblF1ZXJ5RGVmaW5pdGlvbi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgICAgcXVlcnlTdHJpbmc6IHRoaXMucXVlcnlTdHJpbmcsXG4gICAgICAgICAgICBsb2dHcm91cE5hbWVzOiB0aGlzLmxvZ0dyb3VwTmFtZXMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuUXVlcnlEZWZpbml0aW9uUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuUmVzb3VyY2VQb2xpY3lgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtcmVzb3VyY2Vwb2xpY3kuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblJlc291cmNlUG9saWN5UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRldGFpbHMgb2YgdGhlIHBvbGljeS4gSXQgbXVzdCBiZSBmb3JtYXR0ZWQgaW4gSlNPTiwgYW5kIHlvdSBtdXN0IHVzZSBiYWNrc2xhc2hlcyB0byBlc2NhcGUgY2hhcmFjdGVycyB0aGF0IG5lZWQgdG8gYmUgZXNjYXBlZCBpbiBKU09OIHN0cmluZ3MsIHN1Y2ggYXMgZG91YmxlIHF1b3RlIG1hcmtzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1yZXNvdXJjZXBvbGljeS5odG1sI2Nmbi1sb2dzLXJlc291cmNlcG9saWN5LXBvbGljeWRvY3VtZW50XG4gICAgICovXG4gICAgcmVhZG9ubHkgcG9saWN5RG9jdW1lbnQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSByZXNvdXJjZSBwb2xpY3kuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXJlc291cmNlcG9saWN5Lmh0bWwjY2ZuLWxvZ3MtcmVzb3VyY2Vwb2xpY3ktcG9saWN5bmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHBvbGljeU5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5SZXNvdXJjZVBvbGljeVByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5SZXNvdXJjZVBvbGljeVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJlc291cmNlUG9saWN5UHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwb2xpY3lEb2N1bWVudCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5wb2xpY3lEb2N1bWVudCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9saWN5RG9jdW1lbnQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucG9saWN5RG9jdW1lbnQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3BvbGljeU5hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucG9saWN5TmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9saWN5TmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5wb2xpY3lOYW1lKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblJlc291cmNlUG9saWN5UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkxvZ3M6OlJlc291cmNlUG9saWN5YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5SZXNvdXJjZVBvbGljeVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpMb2dzOjpSZXNvdXJjZVBvbGljeWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SZXNvdXJjZVBvbGljeVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXNvdXJjZVBvbGljeVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wb2xpY3lEb2N1bWVudCksXG4gICAgICAgIFBvbGljeU5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucG9saWN5TmFtZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlc291cmNlUG9saWN5UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SZXNvdXJjZVBvbGljeVByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXNvdXJjZVBvbGljeVByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncG9saWN5RG9jdW1lbnQnLCAnUG9saWN5RG9jdW1lbnQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlBvbGljeURvY3VtZW50KSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdwb2xpY3lOYW1lJywgJ1BvbGljeU5hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlBvbGljeU5hbWUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkxvZ3M6OlJlc291cmNlUG9saWN5YFxuICpcbiAqIENyZWF0ZXMgb3IgdXBkYXRlcyBhIHJlc291cmNlIHBvbGljeSB0aGF0IGFsbG93cyBvdGhlciBBV1Mgc2VydmljZXMgdG8gcHV0IGxvZyBldmVudHMgdG8gdGhpcyBhY2NvdW50LiBBbiBhY2NvdW50IGNhbiBoYXZlIHVwIHRvIDEwIHJlc291cmNlIHBvbGljaWVzIHBlciBBV1MgUmVnaW9uLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3lcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXJlc291cmNlcG9saWN5Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblJlc291cmNlUG9saWN5IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3lcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5SZXNvdXJjZVBvbGljeSB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuUmVzb3VyY2VQb2xpY3lQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuUmVzb3VyY2VQb2xpY3koc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGRldGFpbHMgb2YgdGhlIHBvbGljeS4gSXQgbXVzdCBiZSBmb3JtYXR0ZWQgaW4gSlNPTiwgYW5kIHlvdSBtdXN0IHVzZSBiYWNrc2xhc2hlcyB0byBlc2NhcGUgY2hhcmFjdGVycyB0aGF0IG5lZWQgdG8gYmUgZXNjYXBlZCBpbiBKU09OIHN0cmluZ3MsIHN1Y2ggYXMgZG91YmxlIHF1b3RlIG1hcmtzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1yZXNvdXJjZXBvbGljeS5odG1sI2Nmbi1sb2dzLXJlc291cmNlcG9saWN5LXBvbGljeWRvY3VtZW50XG4gICAgICovXG4gICAgcHVibGljIHBvbGljeURvY3VtZW50OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcmVzb3VyY2UgcG9saWN5LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1yZXNvdXJjZXBvbGljeS5odG1sI2Nmbi1sb2dzLXJlc291cmNlcG9saWN5LXBvbGljeW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgcG9saWN5TmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkxvZ3M6OlJlc291cmNlUG9saWN5YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVzb3VyY2VQb2xpY3lQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUmVzb3VyY2VQb2xpY3kuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdwb2xpY3lEb2N1bWVudCcsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAncG9saWN5TmFtZScsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucG9saWN5RG9jdW1lbnQgPSBwcm9wcy5wb2xpY3lEb2N1bWVudDtcbiAgICAgICAgdGhpcy5wb2xpY3lOYW1lID0gcHJvcHMucG9saWN5TmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmblJlc291cmNlUG9saWN5LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwb2xpY3lEb2N1bWVudDogdGhpcy5wb2xpY3lEb2N1bWVudCxcbiAgICAgICAgICAgIHBvbGljeU5hbWU6IHRoaXMucG9saWN5TmFtZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5SZXNvdXJjZVBvbGljeVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblN1YnNjcmlwdGlvbkZpbHRlcmBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1zdWJzY3JpcHRpb25maWx0ZXIuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgZGVzdGluYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1kZXN0aW5hdGlvbmFyblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRlc3RpbmF0aW9uQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZmlsdGVyaW5nIGV4cHJlc3Npb25zIHRoYXQgcmVzdHJpY3Qgd2hhdCBnZXRzIGRlbGl2ZXJlZCB0byB0aGUgZGVzdGluYXRpb24gQVdTIHJlc291cmNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZmlsdGVyIHBhdHRlcm4gc3ludGF4LCBzZWUgW0ZpbHRlciBhbmQgUGF0dGVybiBTeW50YXhdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0ZpbHRlckFuZFBhdHRlcm5TeW50YXguaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1zdWJzY3JpcHRpb25maWx0ZXIuaHRtbCNjZm4tbG9ncy1zdWJzY3JpcHRpb25maWx0ZXItZmlsdGVycGF0dGVyblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGZpbHRlclBhdHRlcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBsb2cgZ3JvdXAgdG8gYXNzb2NpYXRlIHdpdGggdGhlIHN1YnNjcmlwdGlvbiBmaWx0ZXIuIEFsbCBsb2cgZXZlbnRzIHRoYXQgYXJlIHVwbG9hZGVkIHRvIHRoaXMgbG9nIGdyb3VwIGFyZSBmaWx0ZXJlZCBhbmQgZGVsaXZlcmVkIHRvIHRoZSBzcGVjaWZpZWQgQVdTIHJlc291cmNlIGlmIHRoZSBmaWx0ZXIgcGF0dGVybiBtYXRjaGVzIHRoZSBsb2cgZXZlbnRzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1zdWJzY3JpcHRpb25maWx0ZXIuaHRtbCNjZm4tbG9ncy1zdWJzY3JpcHRpb25maWx0ZXItbG9nZ3JvdXBuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbG9nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBgQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXIuRGlzdHJpYnV0aW9uYFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1zdWJzY3JpcHRpb25maWx0ZXIuaHRtbCNjZm4tbG9ncy1zdWJzY3JpcHRpb25maWx0ZXItZGlzdHJpYnV0aW9uXG4gICAgICovXG4gICAgcmVhZG9ubHkgZGlzdHJpYnV0aW9uPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHN1YnNjcmlwdGlvbiBmaWx0ZXIuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1maWx0ZXJuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgZmlsdGVyTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgYW4gSUFNIHJvbGUgdGhhdCBncmFudHMgQ2xvdWRXYXRjaCBMb2dzIHBlcm1pc3Npb25zIHRvIGRlbGl2ZXIgaW5nZXN0ZWQgbG9nIGV2ZW50cyB0byB0aGUgZGVzdGluYXRpb24gc3RyZWFtLiBZb3UgZG9uJ3QgbmVlZCB0byBwcm92aWRlIHRoZSBBUk4gd2hlbiB5b3UgYXJlIHdvcmtpbmcgd2l0aCBhIGxvZ2ljYWwgZGVzdGluYXRpb24gZm9yIGNyb3NzLWFjY291bnQgZGVsaXZlcnkuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1yb2xlYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgcm9sZUFybj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXN0aW5hdGlvbkFybicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kZXN0aW5hdGlvbkFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGVzdGluYXRpb25Bcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZGVzdGluYXRpb25Bcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rpc3RyaWJ1dGlvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kaXN0cmlidXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpbHRlck5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZmlsdGVyTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyUGF0dGVybicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5maWx0ZXJQYXR0ZXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJQYXR0ZXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmZpbHRlclBhdHRlcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5sb2dHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ0dyb3VwTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5sb2dHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvbGVBcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucm9sZUFybikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6U3Vic2NyaXB0aW9uRmlsdGVyYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6TG9nczo6U3Vic2NyaXB0aW9uRmlsdGVyYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVzdGluYXRpb25Bcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVzdGluYXRpb25Bcm4pLFxuICAgICAgICBGaWx0ZXJQYXR0ZXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmZpbHRlclBhdHRlcm4pLFxuICAgICAgICBMb2dHcm91cE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubG9nR3JvdXBOYW1lKSxcbiAgICAgICAgRGlzdHJpYnV0aW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRpc3RyaWJ1dGlvbiksXG4gICAgICAgIEZpbHRlck5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmlsdGVyTmFtZSksXG4gICAgICAgIFJvbGVBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucm9sZUFybiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuU3Vic2NyaXB0aW9uRmlsdGVyUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGVzdGluYXRpb25Bcm4nLCAnRGVzdGluYXRpb25Bcm4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRlc3RpbmF0aW9uQXJuKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdmaWx0ZXJQYXR0ZXJuJywgJ0ZpbHRlclBhdHRlcm4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkZpbHRlclBhdHRlcm4pKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2xvZ0dyb3VwTmFtZScsICdMb2dHcm91cE5hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGlzdHJpYnV0aW9uJywgJ0Rpc3RyaWJ1dGlvbicsIHByb3BlcnRpZXMuRGlzdHJpYnV0aW9uICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRpc3RyaWJ1dGlvbikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZmlsdGVyTmFtZScsICdGaWx0ZXJOYW1lJywgcHJvcGVydGllcy5GaWx0ZXJOYW1lICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkZpbHRlck5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JvbGVBcm4nLCAnUm9sZUFybicsIHByb3BlcnRpZXMuUm9sZUFybiAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Sb2xlQXJuKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXJgXG4gKlxuICogVGhlIGBBV1M6OkxvZ3M6OlN1YnNjcmlwdGlvbkZpbHRlcmAgcmVzb3VyY2Ugc3BlY2lmaWVzIGEgc3Vic2NyaXB0aW9uIGZpbHRlciBhbmQgYXNzb2NpYXRlcyBpdCB3aXRoIHRoZSBzcGVjaWZpZWQgbG9nIGdyb3VwLiBTdWJzY3JpcHRpb24gZmlsdGVycyBhbGxvdyB5b3UgdG8gc3Vic2NyaWJlIHRvIGEgcmVhbC10aW1lIHN0cmVhbSBvZiBsb2cgZXZlbnRzIGFuZCBoYXZlIHRoZW0gZGVsaXZlcmVkIHRvIGEgc3BlY2lmaWMgZGVzdGluYXRpb24uIEN1cnJlbnRseSwgdGhlIHN1cHBvcnRlZCBkZXN0aW5hdGlvbnMgYXJlOlxuICpcbiAqIC0gQW4gQW1hem9uIEtpbmVzaXMgZGF0YSBzdHJlYW0gYmVsb25naW5nIHRvIHRoZSBzYW1lIGFjY291bnQgYXMgdGhlIHN1YnNjcmlwdGlvbiBmaWx0ZXIsIGZvciBzYW1lLWFjY291bnQgZGVsaXZlcnkuXG4gKiAtIEEgbG9naWNhbCBkZXN0aW5hdGlvbiB0aGF0IGJlbG9uZ3MgdG8gYSBkaWZmZXJlbnQgYWNjb3VudCwgZm9yIGNyb3NzLWFjY291bnQgZGVsaXZlcnkuXG4gKiAtIEFuIEFtYXpvbiBLaW5lc2lzIEZpcmVob3NlIGRlbGl2ZXJ5IHN0cmVhbSB0aGF0IGJlbG9uZ3MgdG8gdGhlIHNhbWUgYWNjb3VudCBhcyB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlciwgZm9yIHNhbWUtYWNjb3VudCBkZWxpdmVyeS5cbiAqIC0gQW4gQVdTIExhbWJkYSBmdW5jdGlvbiB0aGF0IGJlbG9uZ3MgdG8gdGhlIHNhbWUgYWNjb3VudCBhcyB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlciwgZm9yIHNhbWUtYWNjb3VudCBkZWxpdmVyeS5cbiAqXG4gKiBUaGVyZSBjYW4gYmUgYXMgbWFueSBhcyB0d28gc3Vic2NyaXB0aW9uIGZpbHRlcnMgYXNzb2NpYXRlZCB3aXRoIGEgbG9nIGdyb3VwLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6TG9nczo6U3Vic2NyaXB0aW9uRmlsdGVyXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1zdWJzY3JpcHRpb25maWx0ZXIuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6TG9nczo6U3Vic2NyaXB0aW9uRmlsdGVyXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgZGVzdGluYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1kZXN0aW5hdGlvbmFyblxuICAgICAqL1xuICAgIHB1YmxpYyBkZXN0aW5hdGlvbkFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZpbHRlcmluZyBleHByZXNzaW9ucyB0aGF0IHJlc3RyaWN0IHdoYXQgZ2V0cyBkZWxpdmVyZWQgdG8gdGhlIGRlc3RpbmF0aW9uIEFXUyByZXNvdXJjZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGZpbHRlciBwYXR0ZXJuIHN5bnRheCwgc2VlIFtGaWx0ZXIgYW5kIFBhdHRlcm4gU3ludGF4XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9GaWx0ZXJBbmRQYXR0ZXJuU3ludGF4Lmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLmh0bWwjY2ZuLWxvZ3Mtc3Vic2NyaXB0aW9uZmlsdGVyLWZpbHRlcnBhdHRlcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgZmlsdGVyUGF0dGVybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGxvZyBncm91cCB0byBhc3NvY2lhdGUgd2l0aCB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlci4gQWxsIGxvZyBldmVudHMgdGhhdCBhcmUgdXBsb2FkZWQgdG8gdGhpcyBsb2cgZ3JvdXAgYXJlIGZpbHRlcmVkIGFuZCBkZWxpdmVyZWQgdG8gdGhlIHNwZWNpZmllZCBBV1MgcmVzb3VyY2UgaWYgdGhlIGZpbHRlciBwYXR0ZXJuIG1hdGNoZXMgdGhlIGxvZyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1sb2dncm91cG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBgQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXIuRGlzdHJpYnV0aW9uYFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1zdWJzY3JpcHRpb25maWx0ZXIuaHRtbCNjZm4tbG9ncy1zdWJzY3JpcHRpb25maWx0ZXItZGlzdHJpYnV0aW9uXG4gICAgICovXG4gICAgcHVibGljIGRpc3RyaWJ1dGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHN1YnNjcmlwdGlvbiBmaWx0ZXIuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1maWx0ZXJuYW1lXG4gICAgICovXG4gICAgcHVibGljIGZpbHRlck5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgYW4gSUFNIHJvbGUgdGhhdCBncmFudHMgQ2xvdWRXYXRjaCBMb2dzIHBlcm1pc3Npb25zIHRvIGRlbGl2ZXIgaW5nZXN0ZWQgbG9nIGV2ZW50cyB0byB0aGUgZGVzdGluYXRpb24gc3RyZWFtLiBZb3UgZG9uJ3QgbmVlZCB0byBwcm92aWRlIHRoZSBBUk4gd2hlbiB5b3UgYXJlIHdvcmtpbmcgd2l0aCBhIGxvZ2ljYWwgZGVzdGluYXRpb24gZm9yIGNyb3NzLWFjY291bnQgZGVsaXZlcnkuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci5odG1sI2Nmbi1sb2dzLXN1YnNjcmlwdGlvbmZpbHRlci1yb2xlYXJuXG4gICAgICovXG4gICAgcHVibGljIHJvbGVBcm46IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXJgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5TdWJzY3JpcHRpb25GaWx0ZXJQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnZGVzdGluYXRpb25Bcm4nLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2ZpbHRlclBhdHRlcm4nLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2xvZ0dyb3VwTmFtZScsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25Bcm4gPSBwcm9wcy5kZXN0aW5hdGlvbkFybjtcbiAgICAgICAgdGhpcy5maWx0ZXJQYXR0ZXJuID0gcHJvcHMuZmlsdGVyUGF0dGVybjtcbiAgICAgICAgdGhpcy5sb2dHcm91cE5hbWUgPSBwcm9wcy5sb2dHcm91cE5hbWU7XG4gICAgICAgIHRoaXMuZGlzdHJpYnV0aW9uID0gcHJvcHMuZGlzdHJpYnV0aW9uO1xuICAgICAgICB0aGlzLmZpbHRlck5hbWUgPSBwcm9wcy5maWx0ZXJOYW1lO1xuICAgICAgICB0aGlzLnJvbGVBcm4gPSBwcm9wcy5yb2xlQXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuU3Vic2NyaXB0aW9uRmlsdGVyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbkFybjogdGhpcy5kZXN0aW5hdGlvbkFybixcbiAgICAgICAgICAgIGZpbHRlclBhdHRlcm46IHRoaXMuZmlsdGVyUGF0dGVybixcbiAgICAgICAgICAgIGxvZ0dyb3VwTmFtZTogdGhpcy5sb2dHcm91cE5hbWUsXG4gICAgICAgICAgICBkaXN0cmlidXRpb246IHRoaXMuZGlzdHJpYnV0aW9uLFxuICAgICAgICAgICAgZmlsdGVyTmFtZTogdGhpcy5maWx0ZXJOYW1lLFxuICAgICAgICAgICAgcm9sZUFybjogdGhpcy5yb2xlQXJuLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblN1YnNjcmlwdGlvbkZpbHRlclByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuIl19
"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnResourceCollection = exports.CfnNotificationChannel = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnNotificationChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnNotificationChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannelPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('config', cdk.requiredValidator)(properties.config));
    errors.collect(cdk.propertyValidator('config', CfnNotificationChannel_NotificationChannelConfigPropertyValidator)(properties.config));
    return errors.wrap('supplied properties not correct for "CfnNotificationChannelProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnNotificationChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel` resource.
 */
// @ts-ignore TS6133
function cfnNotificationChannelPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnNotificationChannelPropsValidator(properties).assertSuccess();
    return {
        Config: cfnNotificationChannelNotificationChannelConfigPropertyToCloudFormation(properties.config),
    };
}
// @ts-ignore TS6133
function CfnNotificationChannelPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('config', 'Config', CfnNotificationChannelNotificationChannelConfigPropertyFromCloudFormation(properties.Config));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::DevOpsGuru::NotificationChannel`
 *
 * Adds a notification channel to DevOps Guru. A notification channel is used to notify you about important DevOps Guru events, such as when an insight is generated.
 *
 * If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. DevOps Guru only supports standard SNS topics. For more information, see [Permissions for cross account Amazon SNS topics](https://docs.aws.amazon.com/devops-guru/latest/userguide/sns-required-permissions.html) .
 *
 * If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. For more information, see Permissions for cross account Amazon SNS topics.
 *
 * If you use an Amazon SNS topic that is encrypted by an AWS Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see [Permissions for AWS KMS–encrypted Amazon SNS topics](https://docs.aws.amazon.com/devops-guru/latest/userguide/sns-kms-permissions.html) .
 *
 * @cloudformationResource AWS::DevOpsGuru::NotificationChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-notificationchannel.html
 */
class CfnNotificationChannel extends cdk.CfnResource {
    /**
     * Create a new `AWS::DevOpsGuru::NotificationChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnNotificationChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_devopsguru_CfnNotificationChannelProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnNotificationChannel);
            }
            throw error;
        }
        cdk.requireProperty(props, 'config', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.config = props.config;
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
        const propsResult = CfnNotificationChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnNotificationChannel(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNotificationChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            config: this.config,
        };
    }
    renderProperties(props) {
        return cfnNotificationChannelPropsToCloudFormation(props);
    }
}
exports.CfnNotificationChannel = CfnNotificationChannel;
_a = JSII_RTTI_SYMBOL_1;
CfnNotificationChannel[_a] = { fqn: "@aws-cdk/aws-devopsguru.CfnNotificationChannel", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnNotificationChannel.CFN_RESOURCE_TYPE_NAME = "AWS::DevOpsGuru::NotificationChannel";
/**
 * Determine whether the given properties match those of a `NotificationChannelConfigProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationChannelConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannel_NotificationChannelConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filters', CfnNotificationChannel_NotificationFilterConfigPropertyValidator)(properties.filters));
    errors.collect(cdk.propertyValidator('sns', CfnNotificationChannel_SnsChannelConfigPropertyValidator)(properties.sns));
    return errors.wrap('supplied properties not correct for "NotificationChannelConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel.NotificationChannelConfig` resource
 *
 * @param properties - the TypeScript properties of a `NotificationChannelConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel.NotificationChannelConfig` resource.
 */
// @ts-ignore TS6133
function cfnNotificationChannelNotificationChannelConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnNotificationChannel_NotificationChannelConfigPropertyValidator(properties).assertSuccess();
    return {
        Filters: cfnNotificationChannelNotificationFilterConfigPropertyToCloudFormation(properties.filters),
        Sns: cfnNotificationChannelSnsChannelConfigPropertyToCloudFormation(properties.sns),
    };
}
// @ts-ignore TS6133
function CfnNotificationChannelNotificationChannelConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? CfnNotificationChannelNotificationFilterConfigPropertyFromCloudFormation(properties.Filters) : undefined);
    ret.addPropertyResult('sns', 'Sns', properties.Sns != null ? CfnNotificationChannelSnsChannelConfigPropertyFromCloudFormation(properties.Sns) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `NotificationFilterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationFilterConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannel_NotificationFilterConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('messageTypes', cdk.listValidator(cdk.validateString))(properties.messageTypes));
    errors.collect(cdk.propertyValidator('severities', cdk.listValidator(cdk.validateString))(properties.severities));
    return errors.wrap('supplied properties not correct for "NotificationFilterConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel.NotificationFilterConfig` resource
 *
 * @param properties - the TypeScript properties of a `NotificationFilterConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel.NotificationFilterConfig` resource.
 */
// @ts-ignore TS6133
function cfnNotificationChannelNotificationFilterConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnNotificationChannel_NotificationFilterConfigPropertyValidator(properties).assertSuccess();
    return {
        MessageTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.messageTypes),
        Severities: cdk.listMapper(cdk.stringToCloudFormation)(properties.severities),
    };
}
// @ts-ignore TS6133
function CfnNotificationChannelNotificationFilterConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('messageTypes', 'MessageTypes', properties.MessageTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.MessageTypes) : undefined);
    ret.addPropertyResult('severities', 'Severities', properties.Severities != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Severities) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `SnsChannelConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SnsChannelConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannel_SnsChannelConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('topicArn', cdk.validateString)(properties.topicArn));
    return errors.wrap('supplied properties not correct for "SnsChannelConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel.SnsChannelConfig` resource
 *
 * @param properties - the TypeScript properties of a `SnsChannelConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::NotificationChannel.SnsChannelConfig` resource.
 */
// @ts-ignore TS6133
function cfnNotificationChannelSnsChannelConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnNotificationChannel_SnsChannelConfigPropertyValidator(properties).assertSuccess();
    return {
        TopicArn: cdk.stringToCloudFormation(properties.topicArn),
    };
}
// @ts-ignore TS6133
function CfnNotificationChannelSnsChannelConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('topicArn', 'TopicArn', properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnResourceCollectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceCollectionProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollectionPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceCollectionFilter', cdk.requiredValidator)(properties.resourceCollectionFilter));
    errors.collect(cdk.propertyValidator('resourceCollectionFilter', CfnResourceCollection_ResourceCollectionFilterPropertyValidator)(properties.resourceCollectionFilter));
    return errors.wrap('supplied properties not correct for "CfnResourceCollectionProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceCollectionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection` resource.
 */
// @ts-ignore TS6133
function cfnResourceCollectionPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceCollectionPropsValidator(properties).assertSuccess();
    return {
        ResourceCollectionFilter: cfnResourceCollectionResourceCollectionFilterPropertyToCloudFormation(properties.resourceCollectionFilter),
    };
}
// @ts-ignore TS6133
function CfnResourceCollectionPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('resourceCollectionFilter', 'ResourceCollectionFilter', CfnResourceCollectionResourceCollectionFilterPropertyFromCloudFormation(properties.ResourceCollectionFilter));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::DevOpsGuru::ResourceCollection`
 *
 * A collection of AWS resources supported by DevOps Guru. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks.
 *
 * @cloudformationResource AWS::DevOpsGuru::ResourceCollection
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-resourcecollection.html
 */
class CfnResourceCollection extends cdk.CfnResource {
    /**
     * Create a new `AWS::DevOpsGuru::ResourceCollection`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnResourceCollection.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_devopsguru_CfnResourceCollectionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnResourceCollection);
            }
            throw error;
        }
        cdk.requireProperty(props, 'resourceCollectionFilter', this);
        this.attrResourceCollectionType = cdk.Token.asString(this.getAtt('ResourceCollectionType', cdk.ResolutionTypeHint.STRING));
        this.resourceCollectionFilter = props.resourceCollectionFilter;
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
        const propsResult = CfnResourceCollectionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourceCollection(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceCollection.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            resourceCollectionFilter: this.resourceCollectionFilter,
        };
    }
    renderProperties(props) {
        return cfnResourceCollectionPropsToCloudFormation(props);
    }
}
exports.CfnResourceCollection = CfnResourceCollection;
_b = JSII_RTTI_SYMBOL_1;
CfnResourceCollection[_b] = { fqn: "@aws-cdk/aws-devopsguru.CfnResourceCollection", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnResourceCollection.CFN_RESOURCE_TYPE_NAME = "AWS::DevOpsGuru::ResourceCollection";
/**
 * Determine whether the given properties match those of a `CloudFormationCollectionFilterProperty`
 *
 * @param properties - the TypeScript properties of a `CloudFormationCollectionFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollection_CloudFormationCollectionFilterPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('stackNames', cdk.listValidator(cdk.validateString))(properties.stackNames));
    return errors.wrap('supplied properties not correct for "CloudFormationCollectionFilterProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection.CloudFormationCollectionFilter` resource
 *
 * @param properties - the TypeScript properties of a `CloudFormationCollectionFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection.CloudFormationCollectionFilter` resource.
 */
// @ts-ignore TS6133
function cfnResourceCollectionCloudFormationCollectionFilterPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceCollection_CloudFormationCollectionFilterPropertyValidator(properties).assertSuccess();
    return {
        StackNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.stackNames),
    };
}
// @ts-ignore TS6133
function CfnResourceCollectionCloudFormationCollectionFilterPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('stackNames', 'StackNames', properties.StackNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StackNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `ResourceCollectionFilterProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceCollectionFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollection_ResourceCollectionFilterPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudFormation', CfnResourceCollection_CloudFormationCollectionFilterPropertyValidator)(properties.cloudFormation));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnResourceCollection_TagCollectionPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "ResourceCollectionFilterProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection.ResourceCollectionFilter` resource
 *
 * @param properties - the TypeScript properties of a `ResourceCollectionFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection.ResourceCollectionFilter` resource.
 */
// @ts-ignore TS6133
function cfnResourceCollectionResourceCollectionFilterPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceCollection_ResourceCollectionFilterPropertyValidator(properties).assertSuccess();
    return {
        CloudFormation: cfnResourceCollectionCloudFormationCollectionFilterPropertyToCloudFormation(properties.cloudFormation),
        Tags: cdk.listMapper(cfnResourceCollectionTagCollectionPropertyToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnResourceCollectionResourceCollectionFilterPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('cloudFormation', 'CloudFormation', properties.CloudFormation != null ? CfnResourceCollectionCloudFormationCollectionFilterPropertyFromCloudFormation(properties.CloudFormation) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnResourceCollectionTagCollectionPropertyFromCloudFormation)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `TagCollectionProperty`
 *
 * @param properties - the TypeScript properties of a `TagCollectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollection_TagCollectionPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appBoundaryKey', cdk.validateString)(properties.appBoundaryKey));
    errors.collect(cdk.propertyValidator('tagValues', cdk.listValidator(cdk.validateString))(properties.tagValues));
    return errors.wrap('supplied properties not correct for "TagCollectionProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection.TagCollection` resource
 *
 * @param properties - the TypeScript properties of a `TagCollectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DevOpsGuru::ResourceCollection.TagCollection` resource.
 */
// @ts-ignore TS6133
function cfnResourceCollectionTagCollectionPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceCollection_TagCollectionPropertyValidator(properties).assertSuccess();
    return {
        AppBoundaryKey: cdk.stringToCloudFormation(properties.appBoundaryKey),
        TagValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues),
    };
}
// @ts-ignore TS6133
function CfnResourceCollectionTagCollectionPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('appBoundaryKey', 'AppBoundaryKey', properties.AppBoundaryKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppBoundaryKey) : undefined);
    ret.addPropertyResult('tagValues', 'TagValues', properties.TagValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TagValues) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2b3BzZ3VydS5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXZvcHNndXJ1LmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBb0JoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLG9DQUFvQyxDQUFDLFVBQWU7SUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsaUVBQWlFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN0SSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUVBQW1FLENBQUMsQ0FBQztBQUM1RixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsMkNBQTJDLENBQUMsVUFBZTtJQUNoRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7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LFdBQVcsRUFBRSxVQUFVLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlKLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBHZW5lcmF0ZWQgZnJvbSB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIFNwZWNpZmljYXRpb25cbi8vIFNlZTogZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2Nmbi1yZXNvdXJjZS1zcGVjaWZpY2F0aW9uLmh0bWxcbi8vIEBjZm4ydHM6bWV0YUAge1wiZ2VuZXJhdGVkXCI6XCIyMDIzLTAxLTIyVDA5OjUxOjU0LjYzOFpcIixcImZpbmdlcnByaW50XCI6XCJYelBOYlkvNkZxbVF3THhzOU5GU0FaN1hYSGxFQms0eEphZWdiMDVlSWEwPVwifVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjZm5fcGFyc2UgZnJvbSAnQGF3cy1jZGsvY29yZS9saWIvaGVscGVycy1pbnRlcm5hbCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbGBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Ob3RpZmljYXRpb25DaGFubmVsUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBgTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ2Agb2JqZWN0IHRoYXQgY29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgY29uZmlndXJlZCBub3RpZmljYXRpb24gY2hhbm5lbHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1kZXZvcHNndXJ1LW5vdGlmaWNhdGlvbmNoYW5uZWwuaHRtbCNjZm4tZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLWNvbmZpZ1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGNvbmZpZzogQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbC5Ob3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5Ob3RpZmljYXRpb25DaGFubmVsUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29uZmlnJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmNvbmZpZykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29uZmlnJywgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbF9Ob3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuY29uZmlnKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbk5vdGlmaWNhdGlvbkNoYW5uZWxQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RGV2T3BzR3VydTo6Tm90aWZpY2F0aW9uQ2hhbm5lbGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEZXZPcHNHdXJ1OjpOb3RpZmljYXRpb25DaGFubmVsYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbk5vdGlmaWNhdGlvbkNoYW5uZWxQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBDb25maWc6IGNmbk5vdGlmaWNhdGlvbkNoYW5uZWxOb3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY29uZmlnKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5Ob3RpZmljYXRpb25DaGFubmVsUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdjb25maWcnLCAnQ29uZmlnJywgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbE5vdGlmaWNhdGlvbkNoYW5uZWxDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkNvbmZpZykpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6RGV2T3BzR3VydTo6Tm90aWZpY2F0aW9uQ2hhbm5lbGBcbiAqXG4gKiBBZGRzIGEgbm90aWZpY2F0aW9uIGNoYW5uZWwgdG8gRGV2T3BzIEd1cnUuIEEgbm90aWZpY2F0aW9uIGNoYW5uZWwgaXMgdXNlZCB0byBub3RpZnkgeW91IGFib3V0IGltcG9ydGFudCBEZXZPcHMgR3VydSBldmVudHMsIHN1Y2ggYXMgd2hlbiBhbiBpbnNpZ2h0IGlzIGdlbmVyYXRlZC5cbiAqXG4gKiBJZiB5b3UgdXNlIGFuIEFtYXpvbiBTTlMgdG9waWMgaW4gYW5vdGhlciBhY2NvdW50LCB5b3UgbXVzdCBhdHRhY2ggYSBwb2xpY3kgdG8gaXQgdGhhdCBncmFudHMgRGV2T3BzIEd1cnUgcGVybWlzc2lvbiB0byBpdCBub3RpZmljYXRpb25zLiBEZXZPcHMgR3VydSBhZGRzIHRoZSByZXF1aXJlZCBwb2xpY3kgb24geW91ciBiZWhhbGYgdG8gc2VuZCBub3RpZmljYXRpb25zIHVzaW5nIEFtYXpvbiBTTlMgaW4geW91ciBhY2NvdW50LiBEZXZPcHMgR3VydSBvbmx5IHN1cHBvcnRzIHN0YW5kYXJkIFNOUyB0b3BpY3MuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1Blcm1pc3Npb25zIGZvciBjcm9zcyBhY2NvdW50IEFtYXpvbiBTTlMgdG9waWNzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZGV2b3BzLWd1cnUvbGF0ZXN0L3VzZXJndWlkZS9zbnMtcmVxdWlyZWQtcGVybWlzc2lvbnMuaHRtbCkgLlxuICpcbiAqIElmIHlvdSB1c2UgYW4gQW1hem9uIFNOUyB0b3BpYyBpbiBhbm90aGVyIGFjY291bnQsIHlvdSBtdXN0IGF0dGFjaCBhIHBvbGljeSB0byBpdCB0aGF0IGdyYW50cyBEZXZPcHMgR3VydSBwZXJtaXNzaW9uIHRvIGl0IG5vdGlmaWNhdGlvbnMuIERldk9wcyBHdXJ1IGFkZHMgdGhlIHJlcXVpcmVkIHBvbGljeSBvbiB5b3VyIGJlaGFsZiB0byBzZW5kIG5vdGlmaWNhdGlvbnMgdXNpbmcgQW1hem9uIFNOUyBpbiB5b3VyIGFjY291bnQuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgUGVybWlzc2lvbnMgZm9yIGNyb3NzIGFjY291bnQgQW1hem9uIFNOUyB0b3BpY3MuXG4gKlxuICogSWYgeW91IHVzZSBhbiBBbWF6b24gU05TIHRvcGljIHRoYXQgaXMgZW5jcnlwdGVkIGJ5IGFuIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlIGN1c3RvbWVyLW1hbmFnZWQga2V5IChDTUspLCB0aGVuIHlvdSBtdXN0IGFkZCBwZXJtaXNzaW9ucyB0byB0aGUgQ01LLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtQZXJtaXNzaW9ucyBmb3IgQVdTIEtNU+KAk2VuY3J5cHRlZCBBbWF6b24gU05TIHRvcGljc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Rldm9wcy1ndXJ1L2xhdGVzdC91c2VyZ3VpZGUvc25zLWttcy1wZXJtaXNzaW9ucy5odG1sKSAuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpEZXZPcHNHdXJ1OjpOb3RpZmljYXRpb25DaGFubmVsXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbk5vdGlmaWNhdGlvbkNoYW5uZWwgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpEZXZPcHNHdXJ1OjpOb3RpZmljYXRpb25DaGFubmVsXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5Ob3RpZmljYXRpb25DaGFubmVsKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgbm90aWZpY2F0aW9uIGNoYW5uZWwuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIElkXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBgTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ2Agb2JqZWN0IHRoYXQgY29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgY29uZmlndXJlZCBub3RpZmljYXRpb24gY2hhbm5lbHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1kZXZvcHNndXJ1LW5vdGlmaWNhdGlvbmNoYW5uZWwuaHRtbCNjZm4tZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLWNvbmZpZ1xuICAgICAqL1xuICAgIHB1YmxpYyBjb25maWc6IENmbk5vdGlmaWNhdGlvbkNoYW5uZWwuTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkRldk9wc0d1cnU6Ok5vdGlmaWNhdGlvbkNoYW5uZWxgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5Ob3RpZmljYXRpb25DaGFubmVsUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbk5vdGlmaWNhdGlvbkNoYW5uZWwuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdjb25maWcnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRySWQgPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0lkJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IHByb3BzLmNvbmZpZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbk5vdGlmaWNhdGlvbkNoYW5uZWwuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbk5vdGlmaWNhdGlvbkNoYW5uZWwge1xuICAgIC8qKlxuICAgICAqIEluZm9ybWF0aW9uIGFib3V0IG5vdGlmaWNhdGlvbiBjaGFubmVscyB5b3UgaGF2ZSBjb25maWd1cmVkIHdpdGggRGV2T3BzIEd1cnUuIFRoZSBvbmUgc3VwcG9ydGVkIG5vdGlmaWNhdGlvbiBjaGFubmVsIGlzIEFtYXpvbiBTaW1wbGUgTm90aWZpY2F0aW9uIFNlcnZpY2UgKEFtYXpvbiBTTlMpLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLW5vdGlmaWNhdGlvbmNoYW5uZWxjb25maWcuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ1Byb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBmaWx0ZXIgY29uZmlndXJhdGlvbnMgZm9yIHRoZSBBbWF6b24gU05TIG5vdGlmaWNhdGlvbiB0b3BpYyB5b3UgdXNlIHdpdGggRGV2T3BzIEd1cnUuIElmIHlvdSBkbyBub3QgcHJvdmlkZSBmaWx0ZXIgY29uZmlndXJhdGlvbnMsIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25zIGFyZSB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgZm9yIGFsbCBtZXNzYWdlIHR5cGVzIG9mIGBIaWdoYCBvciBgTWVkaXVtYCBzZXZlcml0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1kZXZvcHNndXJ1LW5vdGlmaWNhdGlvbmNoYW5uZWwtbm90aWZpY2F0aW9uY2hhbm5lbGNvbmZpZy5odG1sI2Nmbi1kZXZvcHNndXJ1LW5vdGlmaWNhdGlvbmNoYW5uZWwtbm90aWZpY2F0aW9uY2hhbm5lbGNvbmZpZy1maWx0ZXJzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBmaWx0ZXJzPzogQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbC5Ob3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZm9ybWF0aW9uIGFib3V0IGEgbm90aWZpY2F0aW9uIGNoYW5uZWwgY29uZmlndXJlZCBpbiBEZXZPcHMgR3VydSB0byBzZW5kIG5vdGlmaWNhdGlvbnMgd2hlbiBpbnNpZ2h0cyBhcmUgY3JlYXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgeW91IHVzZSBhbiBBbWF6b24gU05TIHRvcGljIGluIGFub3RoZXIgYWNjb3VudCwgeW91IG11c3QgYXR0YWNoIGEgcG9saWN5IHRvIGl0IHRoYXQgZ3JhbnRzIERldk9wcyBHdXJ1IHBlcm1pc3Npb24gdG8gaXQgbm90aWZpY2F0aW9ucy4gRGV2T3BzIEd1cnUgYWRkcyB0aGUgcmVxdWlyZWQgcG9saWN5IG9uIHlvdXIgYmVoYWxmIHRvIHNlbmQgbm90aWZpY2F0aW9ucyB1c2luZyBBbWF6b24gU05TIGluIHlvdXIgYWNjb3VudC4gRGV2T3BzIEd1cnUgb25seSBzdXBwb3J0cyBzdGFuZGFyZCBTTlMgdG9waWNzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtQZXJtaXNzaW9ucyBmb3IgY3Jvc3MgYWNjb3VudCBBbWF6b24gU05TIHRvcGljc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Rldm9wcy1ndXJ1L2xhdGVzdC91c2VyZ3VpZGUvc25zLXJlcXVpcmVkLXBlcm1pc3Npb25zLmh0bWwpIC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgeW91IHVzZSBhbiBBbWF6b24gU05TIHRvcGljIGluIGFub3RoZXIgYWNjb3VudCwgeW91IG11c3QgYXR0YWNoIGEgcG9saWN5IHRvIGl0IHRoYXQgZ3JhbnRzIERldk9wcyBHdXJ1IHBlcm1pc3Npb24gdG8gaXQgbm90aWZpY2F0aW9ucy4gRGV2T3BzIEd1cnUgYWRkcyB0aGUgcmVxdWlyZWQgcG9saWN5IG9uIHlvdXIgYmVoYWxmIHRvIHNlbmQgbm90aWZpY2F0aW9ucyB1c2luZyBBbWF6b24gU05TIGluIHlvdXIgYWNjb3VudC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBQZXJtaXNzaW9ucyBmb3IgY3Jvc3MgYWNjb3VudCBBbWF6b24gU05TIHRvcGljcy5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgeW91IHVzZSBhbiBBbWF6b24gU05TIHRvcGljIHRoYXQgaXMgZW5jcnlwdGVkIGJ5IGFuIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlIGN1c3RvbWVyLW1hbmFnZWQga2V5IChDTUspLCB0aGVuIHlvdSBtdXN0IGFkZCBwZXJtaXNzaW9ucyB0byB0aGUgQ01LLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtQZXJtaXNzaW9ucyBmb3IgQVdTIEtNU+KAk2VuY3J5cHRlZCBBbWF6b24gU05TIHRvcGljc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Rldm9wcy1ndXJ1L2xhdGVzdC91c2VyZ3VpZGUvc25zLWttcy1wZXJtaXNzaW9ucy5odG1sKSAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLW5vdGlmaWNhdGlvbmNoYW5uZWxjb25maWcuaHRtbCNjZm4tZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLW5vdGlmaWNhdGlvbmNoYW5uZWxjb25maWctc25zXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBzbnM/OiBDZm5Ob3RpZmljYXRpb25DaGFubmVsLlNuc0NoYW5uZWxDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBOb3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbF9Ob3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJzJywgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbF9Ob3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5maWx0ZXJzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzbnMnLCBDZm5Ob3RpZmljYXRpb25DaGFubmVsX1Nuc0NoYW5uZWxDb25maWdQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5zbnMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEZXZPcHNHdXJ1OjpOb3RpZmljYXRpb25DaGFubmVsLk5vdGlmaWNhdGlvbkNoYW5uZWxDb25maWdgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYE5vdGlmaWNhdGlvbkNoYW5uZWxDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RGV2T3BzR3VydTo6Tm90aWZpY2F0aW9uQ2hhbm5lbC5Ob3RpZmljYXRpb25DaGFubmVsQ29uZmlnYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbk5vdGlmaWNhdGlvbkNoYW5uZWxOb3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbk5vdGlmaWNhdGlvbkNoYW5uZWxfTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBGaWx0ZXJzOiBjZm5Ob3RpZmljYXRpb25DaGFubmVsTm90aWZpY2F0aW9uRmlsdGVyQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmlsdGVycyksXG4gICAgICAgIFNuczogY2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFNuc0NoYW5uZWxDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zbnMpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5Ob3RpZmljYXRpb25DaGFubmVsTm90aWZpY2F0aW9uQ2hhbm5lbENvbmZpZ1Byb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuTm90aWZpY2F0aW9uQ2hhbm5lbC5Ob3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuTm90aWZpY2F0aW9uQ2hhbm5lbC5Ob3RpZmljYXRpb25DaGFubmVsQ29uZmlnUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdmaWx0ZXJzJywgJ0ZpbHRlcnMnLCBwcm9wZXJ0aWVzLkZpbHRlcnMgIT0gbnVsbCA/IENmbk5vdGlmaWNhdGlvbkNoYW5uZWxOb3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkZpbHRlcnMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3NucycsICdTbnMnLCBwcm9wZXJ0aWVzLlNucyAhPSBudWxsID8gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFNuc0NoYW5uZWxDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLlNucykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbk5vdGlmaWNhdGlvbkNoYW5uZWwge1xuICAgIC8qKlxuICAgICAqIFRoZSBmaWx0ZXIgY29uZmlndXJhdGlvbnMgZm9yIHRoZSBBbWF6b24gU05TIG5vdGlmaWNhdGlvbiB0b3BpYyB5b3UgdXNlIHdpdGggRGV2T3BzIEd1cnUuIFlvdSBjYW4gY2hvb3NlIHRvIHNwZWNpZnkgd2hpY2ggZXZlbnRzIG9yIG1lc3NhZ2UgdHlwZXMgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIGZvci4gWW91IGNhbiBhbHNvIGNob29zZSB0byBzcGVjaWZ5IHdoaWNoIHNldmVyaXR5IGxldmVscyB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgZm9yLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLW5vdGlmaWNhdGlvbmZpbHRlcmNvbmZpZy5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBOb3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZXZlbnRzIHRoYXQgeW91IHdhbnQgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIGZvci4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gY2hvb3NlIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBvbmx5IHdoZW4gdGhlIHNldmVyaXR5IGxldmVsIGlzIHVwZ3JhZGVkIG9yIGEgbmV3IGluc2lnaHQgaXMgY3JlYXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1kZXZvcHNndXJ1LW5vdGlmaWNhdGlvbmNoYW5uZWwtbm90aWZpY2F0aW9uZmlsdGVyY29uZmlnLmh0bWwjY2ZuLWRldm9wc2d1cnUtbm90aWZpY2F0aW9uY2hhbm5lbC1ub3RpZmljYXRpb25maWx0ZXJjb25maWctbWVzc2FnZXR5cGVzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBtZXNzYWdlVHlwZXM/OiBzdHJpbmdbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZXZlcml0eSBsZXZlbHMgdGhhdCB5b3Ugd2FudCB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgZm9yLiBGb3IgZXhhbXBsZSwgeW91IGNhbiBjaG9vc2UgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIG9ubHkgZm9yIGluc2lnaHRzIHdpdGggYEhJR0hgIGFuZCBgTUVESVVNYCBzZXZlcml0eSBsZXZlbHMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1VuZGVyc3RhbmRpbmcgaW5zaWdodCBzZXZlcml0aWVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZGV2b3BzLWd1cnUvbGF0ZXN0L3VzZXJndWlkZS93b3JraW5nLXdpdGgtaW5zaWdodHMuaHRtbCN1bmRlcnN0YW5kaW5nLWluc2lnaHRzLXNldmVyaXRpZXMpIC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1kZXZvcHNndXJ1LW5vdGlmaWNhdGlvbmNoYW5uZWwtbm90aWZpY2F0aW9uZmlsdGVyY29uZmlnLmh0bWwjY2ZuLWRldm9wc2d1cnUtbm90aWZpY2F0aW9uY2hhbm5lbC1ub3RpZmljYXRpb25maWx0ZXJjb25maWctc2V2ZXJpdGllc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgc2V2ZXJpdGllcz86IHN0cmluZ1tdO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBOb3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgTm90aWZpY2F0aW9uRmlsdGVyQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbF9Ob3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21lc3NhZ2VUeXBlcycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMubWVzc2FnZVR5cGVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzZXZlcml0aWVzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5zZXZlcml0aWVzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIk5vdGlmaWNhdGlvbkZpbHRlckNvbmZpZ1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEZXZPcHNHdXJ1OjpOb3RpZmljYXRpb25DaGFubmVsLk5vdGlmaWNhdGlvbkZpbHRlckNvbmZpZ2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgTm90aWZpY2F0aW9uRmlsdGVyQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkRldk9wc0d1cnU6Ok5vdGlmaWNhdGlvbkNoYW5uZWwuTm90aWZpY2F0aW9uRmlsdGVyQ29uZmlnYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbk5vdGlmaWNhdGlvbkNoYW5uZWxOb3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbF9Ob3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTWVzc2FnZVR5cGVzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5tZXNzYWdlVHlwZXMpLFxuICAgICAgICBTZXZlcml0aWVzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5zZXZlcml0aWVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbE5vdGlmaWNhdGlvbkZpbHRlckNvbmZpZ1Byb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuTm90aWZpY2F0aW9uQ2hhbm5lbC5Ob3RpZmljYXRpb25GaWx0ZXJDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5Ob3RpZmljYXRpb25DaGFubmVsLk5vdGlmaWNhdGlvbkZpbHRlckNvbmZpZ1Byb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbWVzc2FnZVR5cGVzJywgJ01lc3NhZ2VUeXBlcycsIHByb3BlcnRpZXMuTWVzc2FnZVR5cGVzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuTWVzc2FnZVR5cGVzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdzZXZlcml0aWVzJywgJ1NldmVyaXRpZXMnLCBwcm9wZXJ0aWVzLlNldmVyaXRpZXMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nQXJyYXkocHJvcGVydGllcy5TZXZlcml0aWVzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbCB7XG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgdGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIGFuIEFtYXpvbiBTaW1wbGUgTm90aWZpY2F0aW9uIFNlcnZpY2UgdG9waWMuXG4gICAgICpcbiAgICAgKiBJZiB5b3UgdXNlIGFuIEFtYXpvbiBTTlMgdG9waWMgaW4gYW5vdGhlciBhY2NvdW50LCB5b3UgbXVzdCBhdHRhY2ggYSBwb2xpY3kgdG8gaXQgdGhhdCBncmFudHMgRGV2T3BzIEd1cnUgcGVybWlzc2lvbiB0byBpdCBub3RpZmljYXRpb25zLiBEZXZPcHMgR3VydSBhZGRzIHRoZSByZXF1aXJlZCBwb2xpY3kgb24geW91ciBiZWhhbGYgdG8gc2VuZCBub3RpZmljYXRpb25zIHVzaW5nIEFtYXpvbiBTTlMgaW4geW91ciBhY2NvdW50LiBEZXZPcHMgR3VydSBvbmx5IHN1cHBvcnRzIHN0YW5kYXJkIFNOUyB0b3BpY3MuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1Blcm1pc3Npb25zIGZvciBjcm9zcyBhY2NvdW50IEFtYXpvbiBTTlMgdG9waWNzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZGV2b3BzLWd1cnUvbGF0ZXN0L3VzZXJndWlkZS9zbnMtcmVxdWlyZWQtcGVybWlzc2lvbnMuaHRtbCkgLlxuICAgICAqXG4gICAgICogSWYgeW91IHVzZSBhbiBBbWF6b24gU05TIHRvcGljIGluIGFub3RoZXIgYWNjb3VudCwgeW91IG11c3QgYXR0YWNoIGEgcG9saWN5IHRvIGl0IHRoYXQgZ3JhbnRzIERldk9wcyBHdXJ1IHBlcm1pc3Npb24gdG8gaXQgbm90aWZpY2F0aW9ucy4gRGV2T3BzIEd1cnUgYWRkcyB0aGUgcmVxdWlyZWQgcG9saWN5IG9uIHlvdXIgYmVoYWxmIHRvIHNlbmQgbm90aWZpY2F0aW9ucyB1c2luZyBBbWF6b24gU05TIGluIHlvdXIgYWNjb3VudC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBQZXJtaXNzaW9ucyBmb3IgY3Jvc3MgYWNjb3VudCBBbWF6b24gU05TIHRvcGljcy5cbiAgICAgKlxuICAgICAqIElmIHlvdSB1c2UgYW4gQW1hem9uIFNOUyB0b3BpYyB0aGF0IGlzIGVuY3J5cHRlZCBieSBhbiBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSBjdXN0b21lci1tYW5hZ2VkIGtleSAoQ01LKSwgdGhlbiB5b3UgbXVzdCBhZGQgcGVybWlzc2lvbnMgdG8gdGhlIENNSy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbUGVybWlzc2lvbnMgZm9yIEFXUyBLTVPigJNlbmNyeXB0ZWQgQW1hem9uIFNOUyB0b3BpY3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9kZXZvcHMtZ3VydS9sYXRlc3QvdXNlcmd1aWRlL3Nucy1rbXMtcGVybWlzc2lvbnMuaHRtbCkgLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZGV2b3BzZ3VydS1ub3RpZmljYXRpb25jaGFubmVsLXNuc2NoYW5uZWxjb25maWcuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgU25zQ2hhbm5lbENvbmZpZ1Byb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiBhbiBBbWF6b24gU2ltcGxlIE5vdGlmaWNhdGlvbiBTZXJ2aWNlIHRvcGljLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWRldm9wc2d1cnUtbm90aWZpY2F0aW9uY2hhbm5lbC1zbnNjaGFubmVsY29uZmlnLmh0bWwjY2ZuLWRldm9wc2d1cnUtbm90aWZpY2F0aW9uY2hhbm5lbC1zbnNjaGFubmVsY29uZmlnLXRvcGljYXJuXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB0b3BpY0Fybj86IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgU25zQ2hhbm5lbENvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTbnNDaGFubmVsQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbF9TbnNDaGFubmVsQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0b3BpY0FybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50b3BpY0FybikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJTbnNDaGFubmVsQ29uZmlnUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkRldk9wc0d1cnU6Ok5vdGlmaWNhdGlvbkNoYW5uZWwuU25zQ2hhbm5lbENvbmZpZ2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU25zQ2hhbm5lbENvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEZXZPcHNHdXJ1OjpOb3RpZmljYXRpb25DaGFubmVsLlNuc0NoYW5uZWxDb25maWdgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFNuc0NoYW5uZWxDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbF9TbnNDaGFubmVsQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFRvcGljQXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRvcGljQXJuKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuTm90aWZpY2F0aW9uQ2hhbm5lbFNuc0NoYW5uZWxDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbk5vdGlmaWNhdGlvbkNoYW5uZWwuU25zQ2hhbm5lbENvbmZpZ1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbk5vdGlmaWNhdGlvbkNoYW5uZWwuU25zQ2hhbm5lbENvbmZpZ1Byb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndG9waWNBcm4nLCAnVG9waWNBcm4nLCBwcm9wZXJ0aWVzLlRvcGljQXJuICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlRvcGljQXJuKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogSW5mb3JtYXRpb24gYWJvdXQgYSBmaWx0ZXIgdXNlZCB0byBzcGVjaWZ5IHdoaWNoIEFXUyByZXNvdXJjZXMgYXJlIGFuYWx5emVkIGZvciBhbm9tYWxvdXMgYmVoYXZpb3IgYnkgRGV2T3BzIEd1cnUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi5odG1sI2Nmbi1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi1yZXNvdXJjZWNvbGxlY3Rpb25maWx0ZXJcbiAgICAgKi9cbiAgICByZWFkb25seSByZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXI6IENmblJlc291cmNlQ29sbGVjdGlvbi5SZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5SZXNvdXJjZUNvbGxlY3Rpb25Qcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXInLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXInLCBDZm5SZXNvdXJjZUNvbGxlY3Rpb25fUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMucmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblJlc291cmNlQ29sbGVjdGlvblByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEZXZPcHNHdXJ1OjpSZXNvdXJjZUNvbGxlY3Rpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJlc291cmNlQ29sbGVjdGlvblByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEZXZPcHNHdXJ1OjpSZXNvdXJjZUNvbGxlY3Rpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VDb2xsZWN0aW9uUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJlc291cmNlQ29sbGVjdGlvblByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBSZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXI6IGNmblJlc291cmNlQ29sbGVjdGlvblJlc291cmNlQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlc291cmNlQ29sbGVjdGlvbkZpbHRlciksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlc291cmNlQ29sbGVjdGlvblByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVzb3VyY2VDb2xsZWN0aW9uUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblJlc291cmNlQ29sbGVjdGlvblByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyJywgJ1Jlc291cmNlQ29sbGVjdGlvbkZpbHRlcicsIENmblJlc291cmNlQ29sbGVjdGlvblJlc291cmNlQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpEZXZPcHNHdXJ1OjpSZXNvdXJjZUNvbGxlY3Rpb25gXG4gKlxuICogQSBjb2xsZWN0aW9uIG9mIEFXUyByZXNvdXJjZXMgc3VwcG9ydGVkIGJ5IERldk9wcyBHdXJ1LiBUaGUgb25lIHR5cGUgb2YgQVdTIHJlc291cmNlIGNvbGxlY3Rpb24gc3VwcG9ydGVkIGlzIEFXUyBDbG91ZEZvcm1hdGlvbiBzdGFja3MuIERldk9wcyBHdXJ1IGNhbiBiZSBjb25maWd1cmVkIHRvIGFuYWx5emUgb25seSB0aGUgQVdTIHJlc291cmNlcyB0aGF0IGFyZSBkZWZpbmVkIGluIHRoZSBzdGFja3MuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpEZXZPcHNHdXJ1OjpSZXNvdXJjZUNvbGxlY3Rpb25cbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5SZXNvdXJjZUNvbGxlY3Rpb24gZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpEZXZPcHNHdXJ1OjpSZXNvdXJjZUNvbGxlY3Rpb25cIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5SZXNvdXJjZUNvbGxlY3Rpb24ge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblJlc291cmNlQ29sbGVjdGlvblByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5SZXNvdXJjZUNvbGxlY3Rpb24oc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgQVdTIHJlc291cmNlIGNvbGxlY3Rpb25zIHRvIHJldHVybi4gVGhlIG9uZSB2YWxpZCB2YWx1ZSBpcyBgQ0xPVURfRk9STUFUSU9OYCBmb3IgQVdTIENsb3VkRm9ybWF0aW9uIHN0YWNrcy5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgUmVzb3VyY2VDb2xsZWN0aW9uVHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyUmVzb3VyY2VDb2xsZWN0aW9uVHlwZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogSW5mb3JtYXRpb24gYWJvdXQgYSBmaWx0ZXIgdXNlZCB0byBzcGVjaWZ5IHdoaWNoIEFXUyByZXNvdXJjZXMgYXJlIGFuYWx5emVkIGZvciBhbm9tYWxvdXMgYmVoYXZpb3IgYnkgRGV2T3BzIEd1cnUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi5odG1sI2Nmbi1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi1yZXNvdXJjZWNvbGxlY3Rpb25maWx0ZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyOiBDZm5SZXNvdXJjZUNvbGxlY3Rpb24uUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6RGV2T3BzR3VydTo6UmVzb3VyY2VDb2xsZWN0aW9uYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmblJlc291cmNlQ29sbGVjdGlvbi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3Jlc291cmNlQ29sbGVjdGlvbkZpbHRlcicsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJSZXNvdXJjZUNvbGxlY3Rpb25UeXBlID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdSZXNvdXJjZUNvbGxlY3Rpb25UeXBlJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLnJlc291cmNlQ29sbGVjdGlvbkZpbHRlciA9IHByb3BzLnJlc291cmNlQ29sbGVjdGlvbkZpbHRlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmblJlc291cmNlQ29sbGVjdGlvbi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyOiB0aGlzLnJlc291cmNlQ29sbGVjdGlvbkZpbHRlcixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5SZXNvdXJjZUNvbGxlY3Rpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5SZXNvdXJjZUNvbGxlY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEluZm9ybWF0aW9uIGFib3V0IEFXUyBDbG91ZEZvcm1hdGlvbiBzdGFja3MuIFlvdSBjYW4gdXNlIHVwIHRvIDUwMCBzdGFja3MgdG8gc3BlY2lmeSB3aGljaCBBV1MgcmVzb3VyY2VzIGluIHlvdXIgYWNjb3VudCB0byBhbmFseXplLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtTdGFja3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL3N0YWNrcy5odG1sKSBpbiB0aGUgKkFXUyBDbG91ZEZvcm1hdGlvbiBVc2VyIEd1aWRlKiAuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi1jbG91ZGZvcm1hdGlvbmNvbGxlY3Rpb25maWx0ZXIuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRGb3JtYXRpb25Db2xsZWN0aW9uRmlsdGVyUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQW4gYXJyYXkgb2YgQ2xvdWRGb3JtYXRpb24gc3RhY2sgbmFtZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZGV2b3BzZ3VydS1yZXNvdXJjZWNvbGxlY3Rpb24tY2xvdWRmb3JtYXRpb25jb2xsZWN0aW9uZmlsdGVyLmh0bWwjY2ZuLWRldm9wc2d1cnUtcmVzb3VyY2Vjb2xsZWN0aW9uLWNsb3VkZm9ybWF0aW9uY29sbGVjdGlvbmZpbHRlci1zdGFja25hbWVzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBzdGFja05hbWVzPzogc3RyaW5nW107XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENsb3VkRm9ybWF0aW9uQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDbG91ZEZvcm1hdGlvbkNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZXNvdXJjZUNvbGxlY3Rpb25fQ2xvdWRGb3JtYXRpb25Db2xsZWN0aW9uRmlsdGVyUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdGFja05hbWVzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5zdGFja05hbWVzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNsb3VkRm9ybWF0aW9uQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEZXZPcHNHdXJ1OjpSZXNvdXJjZUNvbGxlY3Rpb24uQ2xvdWRGb3JtYXRpb25Db2xsZWN0aW9uRmlsdGVyYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDbG91ZEZvcm1hdGlvbkNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RGV2T3BzR3VydTo6UmVzb3VyY2VDb2xsZWN0aW9uLkNsb3VkRm9ybWF0aW9uQ29sbGVjdGlvbkZpbHRlcmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SZXNvdXJjZUNvbGxlY3Rpb25DbG91ZEZvcm1hdGlvbkNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uX0Nsb3VkRm9ybWF0aW9uQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBTdGFja05hbWVzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5zdGFja05hbWVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uQ2xvdWRGb3JtYXRpb25Db2xsZWN0aW9uRmlsdGVyUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SZXNvdXJjZUNvbGxlY3Rpb24uQ2xvdWRGb3JtYXRpb25Db2xsZWN0aW9uRmlsdGVyUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVzb3VyY2VDb2xsZWN0aW9uLkNsb3VkRm9ybWF0aW9uQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnc3RhY2tOYW1lcycsICdTdGFja05hbWVzJywgcHJvcGVydGllcy5TdGFja05hbWVzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuU3RhY2tOYW1lcykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblJlc291cmNlQ29sbGVjdGlvbiB7XG4gICAgLyoqXG4gICAgICogSW5mb3JtYXRpb24gYWJvdXQgYSBmaWx0ZXIgdXNlZCB0byBzcGVjaWZ5IHdoaWNoIEFXUyByZXNvdXJjZXMgYXJlIGFuYWx5emVkIGZvciBhbm9tYWxvdXMgYmVoYXZpb3IgYnkgRGV2T3BzIEd1cnUuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi1yZXNvdXJjZWNvbGxlY3Rpb25maWx0ZXIuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogSW5mb3JtYXRpb24gYWJvdXQgQVdTIENsb3VkRm9ybWF0aW9uIHN0YWNrcy4gWW91IGNhbiB1c2UgdXAgdG8gNTAwIHN0YWNrcyB0byBzcGVjaWZ5IHdoaWNoIEFXUyByZXNvdXJjZXMgaW4geW91ciBhY2NvdW50IHRvIGFuYWx5emUuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1N0YWNrc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvc3RhY2tzLmh0bWwpIGluIHRoZSAqQVdTIENsb3VkRm9ybWF0aW9uIFVzZXIgR3VpZGUqIC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi1yZXNvdXJjZWNvbGxlY3Rpb25maWx0ZXIuaHRtbCNjZm4tZGV2b3BzZ3VydS1yZXNvdXJjZWNvbGxlY3Rpb24tcmVzb3VyY2Vjb2xsZWN0aW9uZmlsdGVyLWNsb3VkZm9ybWF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBjbG91ZEZvcm1hdGlvbj86IENmblJlc291cmNlQ29sbGVjdGlvbi5DbG91ZEZvcm1hdGlvbkNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBBV1MgdGFncyB1c2VkIHRvIGZpbHRlciB0aGUgcmVzb3VyY2VzIGluIHRoZSByZXNvdXJjZSBjb2xsZWN0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUYWdzIGhlbHAgeW91IGlkZW50aWZ5IGFuZCBvcmdhbml6ZSB5b3VyIEFXUyByZXNvdXJjZXMuIE1hbnkgQVdTIHNlcnZpY2VzIHN1cHBvcnQgdGFnZ2luZywgc28geW91IGNhbiBhc3NpZ24gdGhlIHNhbWUgdGFnIHRvIHJlc291cmNlcyBmcm9tIGRpZmZlcmVudCBzZXJ2aWNlcyB0byBpbmRpY2F0ZSB0aGF0IHRoZSByZXNvdXJjZXMgYXJlIHJlbGF0ZWQuIEZvciBleGFtcGxlLCB5b3UgY2FuIGFzc2lnbiB0aGUgc2FtZSB0YWcgdG8gYW4gQW1hem9uIER5bmFtb0RCIHRhYmxlIHJlc291cmNlIHRoYXQgeW91IGFzc2lnbiB0byBhbiBBV1MgTGFtYmRhIGZ1bmN0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB1c2luZyB0YWdzLCBzZWUgdGhlIFtUYWdnaW5nIGJlc3QgcHJhY3RpY2VzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vaHR0cHM6Ly9kMS5hd3NzdGF0aWMuY29tL3doaXRlcGFwZXJzL2F3cy10YWdnaW5nLWJlc3QtcHJhY3RpY2VzLnBkZikgd2hpdGVwYXBlci5cbiAgICAgICAgICpcbiAgICAgICAgICogRWFjaCBBV1MgdGFnIGhhcyB0d28gcGFydHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIC0gQSB0YWcgKmtleSogKGZvciBleGFtcGxlLCBgQ29zdENlbnRlcmAgLCBgRW52aXJvbm1lbnRgICwgYFByb2plY3RgICwgb3IgYFNlY3JldGAgKS4gVGFnICprZXlzKiBhcmUgY2FzZS1zZW5zaXRpdmUuXG4gICAgICAgICAqIC0gQW4gb3B0aW9uYWwgZmllbGQga25vd24gYXMgYSB0YWcgKnZhbHVlKiAoZm9yIGV4YW1wbGUsIGAxMTExMjIyMjMzMzNgICwgYFByb2R1Y3Rpb25gICwgb3IgYSB0ZWFtIG5hbWUpLiBPbWl0dGluZyB0aGUgdGFnICp2YWx1ZSogaXMgdGhlIHNhbWUgYXMgdXNpbmcgYW4gZW1wdHkgc3RyaW5nLiBMaWtlIHRhZyAqa2V5cyogLCB0YWcgKnZhbHVlcyogYXJlIGNhc2Utc2Vuc2l0aXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUb2dldGhlciB0aGVzZSBhcmUga25vd24gYXMgKmtleSogLSAqdmFsdWUqIHBhaXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiA+IFRoZSBzdHJpbmcgdXNlZCBmb3IgYSAqa2V5KiBpbiBhIHRhZyB0aGF0IHlvdSB1c2UgdG8gZGVmaW5lIHlvdXIgcmVzb3VyY2UgY292ZXJhZ2UgbXVzdCBiZWdpbiB3aXRoIHRoZSBwcmVmaXggYERldm9wcy1ndXJ1LWAgLiBUaGUgdGFnICprZXkqIG1pZ2h0IGJlIGBEZXZPcHMtR3VydS1kZXBsb3ltZW50LWFwcGxpY2F0aW9uYCBvciBgZGV2b3BzLWd1cnUtcmRzLWFwcGxpY2F0aW9uYCAuIFdoZW4geW91IGNyZWF0ZSBhICprZXkqICwgdGhlIGNhc2Ugb2YgY2hhcmFjdGVycyBpbiB0aGUgKmtleSogY2FuIGJlIHdoYXRldmVyIHlvdSBjaG9vc2UuIEFmdGVyIHlvdSBjcmVhdGUgYSAqa2V5KiAsIGl0IGlzIGNhc2Utc2Vuc2l0aXZlLiBGb3IgZXhhbXBsZSwgRGV2T3BzIEd1cnUgd29ya3Mgd2l0aCBhICprZXkqIG5hbWVkIGBkZXZvcHMtZ3VydS1yZHNgIGFuZCBhICprZXkqIG5hbWVkIGBEZXZPcHMtR3VydS1SRFNgICwgYW5kIHRoZXNlIGFjdCBhcyB0d28gZGlmZmVyZW50ICprZXlzKiAuIFBvc3NpYmxlICprZXkqIC8gKnZhbHVlKiBwYWlycyBpbiB5b3VyIGFwcGxpY2F0aW9uIG1pZ2h0IGJlIGBEZXZvcHMtR3VydS1wcm9kdWN0aW9uLWFwcGxpY2F0aW9uL1JEU2Agb3IgYERldm9wcy1HdXJ1LXByb2R1Y3Rpb24tYXBwbGljYXRpb24vY29udGFpbmVyc2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWRldm9wc2d1cnUtcmVzb3VyY2Vjb2xsZWN0aW9uLXJlc291cmNlY29sbGVjdGlvbmZpbHRlci5odG1sI2Nmbi1kZXZvcHNndXJ1LXJlc291cmNlY29sbGVjdGlvbi1yZXNvdXJjZWNvbGxlY3Rpb25maWx0ZXItdGFnc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdGFncz86IENmblJlc291cmNlQ29sbGVjdGlvbi5UYWdDb2xsZWN0aW9uUHJvcGVydHlbXTtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJlc291cmNlQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJlc291cmNlQ29sbGVjdGlvbl9SZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Nsb3VkRm9ybWF0aW9uJywgQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uX0Nsb3VkRm9ybWF0aW9uQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmNsb3VkRm9ybWF0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uX1RhZ0NvbGxlY3Rpb25Qcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMudGFncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJSZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RGV2T3BzR3VydTo6UmVzb3VyY2VDb2xsZWN0aW9uLlJlc291cmNlQ29sbGVjdGlvbkZpbHRlcmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkRldk9wc0d1cnU6OlJlc291cmNlQ29sbGVjdGlvbi5SZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXJgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VDb2xsZWN0aW9uUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJlc291cmNlQ29sbGVjdGlvbl9SZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQ2xvdWRGb3JtYXRpb246IGNmblJlc291cmNlQ29sbGVjdGlvbkNsb3VkRm9ybWF0aW9uQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNsb3VkRm9ybWF0aW9uKSxcbiAgICAgICAgVGFnczogY2RrLmxpc3RNYXBwZXIoY2ZuUmVzb3VyY2VDb2xsZWN0aW9uVGFnQ29sbGVjdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SZXNvdXJjZUNvbGxlY3Rpb24uUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVzb3VyY2VDb2xsZWN0aW9uLlJlc291cmNlQ29sbGVjdGlvbkZpbHRlclByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY2xvdWRGb3JtYXRpb24nLCAnQ2xvdWRGb3JtYXRpb24nLCBwcm9wZXJ0aWVzLkNsb3VkRm9ybWF0aW9uICE9IG51bGwgPyBDZm5SZXNvdXJjZUNvbGxlY3Rpb25DbG91ZEZvcm1hdGlvbkNvbGxlY3Rpb25GaWx0ZXJQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkNsb3VkRm9ybWF0aW9uKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uVGFnQ29sbGVjdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLlRhZ3MpIDogdW5kZWZpbmVkIGFzIGFueSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBBIGNvbGxlY3Rpb24gb2YgQVdTIHRhZ3MuXG4gICAgICpcbiAgICAgKiBUYWdzIGhlbHAgeW91IGlkZW50aWZ5IGFuZCBvcmdhbml6ZSB5b3VyIEFXUyByZXNvdXJjZXMuIE1hbnkgQVdTIHNlcnZpY2VzIHN1cHBvcnQgdGFnZ2luZywgc28geW91IGNhbiBhc3NpZ24gdGhlIHNhbWUgdGFnIHRvIHJlc291cmNlcyBmcm9tIGRpZmZlcmVudCBzZXJ2aWNlcyB0byBpbmRpY2F0ZSB0aGF0IHRoZSByZXNvdXJjZXMgYXJlIHJlbGF0ZWQuIEZvciBleGFtcGxlLCB5b3UgY2FuIGFzc2lnbiB0aGUgc2FtZSB0YWcgdG8gYW4gQW1hem9uIER5bmFtb0RCIHRhYmxlIHJlc291cmNlIHRoYXQgeW91IGFzc2lnbiB0byBhbiBBV1MgTGFtYmRhIGZ1bmN0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB1c2luZyB0YWdzLCBzZWUgdGhlIFtUYWdnaW5nIGJlc3QgcHJhY3RpY2VzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vaHR0cHM6Ly9kMS5hd3NzdGF0aWMuY29tL3doaXRlcGFwZXJzL2F3cy10YWdnaW5nLWJlc3QtcHJhY3RpY2VzLnBkZikgd2hpdGVwYXBlci5cbiAgICAgKlxuICAgICAqIEVhY2ggQVdTIHRhZyBoYXMgdHdvIHBhcnRzLlxuICAgICAqXG4gICAgICogLSBBIHRhZyAqa2V5KiAoZm9yIGV4YW1wbGUsIGBDb3N0Q2VudGVyYCAsIGBFbnZpcm9ubWVudGAgLCBgUHJvamVjdGAgLCBvciBgU2VjcmV0YCApLiBUYWcgKmtleXMqIGFyZSBjYXNlLXNlbnNpdGl2ZS5cbiAgICAgKiAtIEFuIG9wdGlvbmFsIGZpZWxkIGtub3duIGFzIGEgdGFnICp2YWx1ZSogKGZvciBleGFtcGxlLCBgMTExMTIyMjIzMzMzYCAsIGBQcm9kdWN0aW9uYCAsIG9yIGEgdGVhbSBuYW1lKS4gT21pdHRpbmcgdGhlIHRhZyAqdmFsdWUqIGlzIHRoZSBzYW1lIGFzIHVzaW5nIGFuIGVtcHR5IHN0cmluZy4gTGlrZSB0YWcgKmtleXMqICwgdGFnICp2YWx1ZXMqIGFyZSBjYXNlLXNlbnNpdGl2ZS5cbiAgICAgKlxuICAgICAqIFRvZ2V0aGVyIHRoZXNlIGFyZSBrbm93biBhcyAqa2V5KiAtICp2YWx1ZSogcGFpcnMuXG4gICAgICpcbiAgICAgKiA+IFRoZSBzdHJpbmcgdXNlZCBmb3IgYSAqa2V5KiBpbiBhIHRhZyB0aGF0IHlvdSB1c2UgdG8gZGVmaW5lIHlvdXIgcmVzb3VyY2UgY292ZXJhZ2UgbXVzdCBiZWdpbiB3aXRoIHRoZSBwcmVmaXggYERldm9wcy1ndXJ1LWAgLiBUaGUgdGFnICprZXkqIG1pZ2h0IGJlIGBEZXZPcHMtR3VydS1kZXBsb3ltZW50LWFwcGxpY2F0aW9uYCBvciBgZGV2b3BzLWd1cnUtcmRzLWFwcGxpY2F0aW9uYCAuIFdoZW4geW91IGNyZWF0ZSBhICprZXkqICwgdGhlIGNhc2Ugb2YgY2hhcmFjdGVycyBpbiB0aGUgKmtleSogY2FuIGJlIHdoYXRldmVyIHlvdSBjaG9vc2UuIEFmdGVyIHlvdSBjcmVhdGUgYSAqa2V5KiAsIGl0IGlzIGNhc2Utc2Vuc2l0aXZlLiBGb3IgZXhhbXBsZSwgRGV2T3BzIEd1cnUgd29ya3Mgd2l0aCBhICprZXkqIG5hbWVkIGBkZXZvcHMtZ3VydS1yZHNgIGFuZCBhICprZXkqIG5hbWVkIGBEZXZPcHMtR3VydS1SRFNgICwgYW5kIHRoZXNlIGFjdCBhcyB0d28gZGlmZmVyZW50ICprZXlzKiAuIFBvc3NpYmxlICprZXkqIC8gKnZhbHVlKiBwYWlycyBpbiB5b3VyIGFwcGxpY2F0aW9uIG1pZ2h0IGJlIGBEZXZvcHMtR3VydS1wcm9kdWN0aW9uLWFwcGxpY2F0aW9uL1JEU2Agb3IgYERldm9wcy1HdXJ1LXByb2R1Y3Rpb24tYXBwbGljYXRpb24vY29udGFpbmVyc2AgLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZGV2b3BzZ3VydS1yZXNvdXJjZWNvbGxlY3Rpb24tdGFnY29sbGVjdGlvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBUYWdDb2xsZWN0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQW4gQVdTIHRhZyAqa2V5KiB0aGF0IGlzIHVzZWQgdG8gaWRlbnRpZnkgdGhlIEFXUyByZXNvdXJjZXMgdGhhdCBEZXZPcHMgR3VydSBhbmFseXplcy4gQWxsIEFXUyByZXNvdXJjZXMgaW4geW91ciBhY2NvdW50IGFuZCBSZWdpb24gdGFnZ2VkIHdpdGggdGhpcyAqa2V5KiBtYWtlIHVwIHlvdXIgRGV2T3BzIEd1cnUgYXBwbGljYXRpb24gYW5kIGFuYWx5c2lzIGJvdW5kYXJ5LlxuICAgICAgICAgKlxuICAgICAgICAgKiA+IFRoZSBzdHJpbmcgdXNlZCBmb3IgYSAqa2V5KiBpbiBhIHRhZyB0aGF0IHlvdSB1c2UgdG8gZGVmaW5lIHlvdXIgcmVzb3VyY2UgY292ZXJhZ2UgbXVzdCBiZWdpbiB3aXRoIHRoZSBwcmVmaXggYERldm9wcy1ndXJ1LWAgLiBUaGUgdGFnICprZXkqIG1pZ2h0IGJlIGBEZXZPcHMtR3VydS1kZXBsb3ltZW50LWFwcGxpY2F0aW9uYCBvciBgZGV2b3BzLWd1cnUtcmRzLWFwcGxpY2F0aW9uYCAuIFdoZW4geW91IGNyZWF0ZSBhICprZXkqICwgdGhlIGNhc2Ugb2YgY2hhcmFjdGVycyBpbiB0aGUgKmtleSogY2FuIGJlIHdoYXRldmVyIHlvdSBjaG9vc2UuIEFmdGVyIHlvdSBjcmVhdGUgYSAqa2V5KiAsIGl0IGlzIGNhc2Utc2Vuc2l0aXZlLiBGb3IgZXhhbXBsZSwgRGV2T3BzIEd1cnUgd29ya3Mgd2l0aCBhICprZXkqIG5hbWVkIGBkZXZvcHMtZ3VydS1yZHNgIGFuZCBhICprZXkqIG5hbWVkIGBEZXZPcHMtR3VydS1SRFNgICwgYW5kIHRoZXNlIGFjdCBhcyB0d28gZGlmZmVyZW50ICprZXlzKiAuIFBvc3NpYmxlICprZXkqIC8gKnZhbHVlKiBwYWlycyBpbiB5b3VyIGFwcGxpY2F0aW9uIG1pZ2h0IGJlIGBEZXZvcHMtR3VydS1wcm9kdWN0aW9uLWFwcGxpY2F0aW9uL1JEU2Agb3IgYERldm9wcy1HdXJ1LXByb2R1Y3Rpb24tYXBwbGljYXRpb24vY29udGFpbmVyc2AgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWRldm9wc2d1cnUtcmVzb3VyY2Vjb2xsZWN0aW9uLXRhZ2NvbGxlY3Rpb24uaHRtbCNjZm4tZGV2b3BzZ3VydS1yZXNvdXJjZWNvbGxlY3Rpb24tdGFnY29sbGVjdGlvbi1hcHBib3VuZGFyeWtleVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgYXBwQm91bmRhcnlLZXk/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdmFsdWVzIGluIGFuIEFXUyB0YWcgY29sbGVjdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIHRhZydzICp2YWx1ZSogaXMgYW4gb3B0aW9uYWwgZmllbGQgdXNlZCB0byBhc3NvY2lhdGUgYSBzdHJpbmcgd2l0aCB0aGUgdGFnICprZXkqIChmb3IgZXhhbXBsZSwgYDExMTEyMjIyMzMzM2AgLCBgUHJvZHVjdGlvbmAgLCBvciBhIHRlYW0gbmFtZSkuIFRoZSAqa2V5KiBhbmQgKnZhbHVlKiBhcmUgdGhlIHRhZydzICprZXkqIHBhaXIuIE9taXR0aW5nIHRoZSB0YWcgKnZhbHVlKiBpcyB0aGUgc2FtZSBhcyB1c2luZyBhbiBlbXB0eSBzdHJpbmcuIExpa2UgdGFnICprZXlzKiAsIHRhZyAqdmFsdWVzKiBhcmUgY2FzZS1zZW5zaXRpdmUuIFlvdSBjYW4gc3BlY2lmeSBhIG1heGltdW0gb2YgMjU2IGNoYXJhY3RlcnMgZm9yIGEgdGFnIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWRldm9wc2d1cnUtcmVzb3VyY2Vjb2xsZWN0aW9uLXRhZ2NvbGxlY3Rpb24uaHRtbCNjZm4tZGV2b3BzZ3VydS1yZXNvdXJjZWNvbGxlY3Rpb24tdGFnY29sbGVjdGlvbi10YWd2YWx1ZXNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHRhZ1ZhbHVlcz86IHN0cmluZ1tdO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBUYWdDb2xsZWN0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFRhZ0NvbGxlY3Rpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZXNvdXJjZUNvbGxlY3Rpb25fVGFnQ29sbGVjdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBwQm91bmRhcnlLZXknLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXBwQm91bmRhcnlLZXkpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ1ZhbHVlcycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMudGFnVmFsdWVzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlRhZ0NvbGxlY3Rpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RGV2T3BzR3VydTo6UmVzb3VyY2VDb2xsZWN0aW9uLlRhZ0NvbGxlY3Rpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFRhZ0NvbGxlY3Rpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RGV2T3BzR3VydTo6UmVzb3VyY2VDb2xsZWN0aW9uLlRhZ0NvbGxlY3Rpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VDb2xsZWN0aW9uVGFnQ29sbGVjdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXNvdXJjZUNvbGxlY3Rpb25fVGFnQ29sbGVjdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBBcHBCb3VuZGFyeUtleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hcHBCb3VuZGFyeUtleSksXG4gICAgICAgIFRhZ1ZhbHVlczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFnVmFsdWVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uVGFnQ29sbGVjdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVzb3VyY2VDb2xsZWN0aW9uLlRhZ0NvbGxlY3Rpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXNvdXJjZUNvbGxlY3Rpb24uVGFnQ29sbGVjdGlvblByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYXBwQm91bmRhcnlLZXknLCAnQXBwQm91bmRhcnlLZXknLCBwcm9wZXJ0aWVzLkFwcEJvdW5kYXJ5S2V5ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkFwcEJvdW5kYXJ5S2V5KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdWYWx1ZXMnLCAnVGFnVmFsdWVzJywgcHJvcGVydGllcy5UYWdWYWx1ZXMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nQXJyYXkocHJvcGVydGllcy5UYWdWYWx1ZXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==
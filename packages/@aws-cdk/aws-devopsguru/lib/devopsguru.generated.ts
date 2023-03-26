// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:51:54.638Z","fingerprint":"XzPNbY/6FqmQwLxs9NFSAZ7XXHlEBk4xJaegb05eIa0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnNotificationChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-notificationchannel.html
 */
export interface CfnNotificationChannelProps {

    /**
     * A `NotificationChannelConfig` object that contains information about configured notification channels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-notificationchannel.html#cfn-devopsguru-notificationchannel-config
     */
    readonly config: CfnNotificationChannel.NotificationChannelConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnNotificationChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnNotificationChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnNotificationChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNotificationChannelPropsValidator(properties).assertSuccess();
    return {
        Config: cfnNotificationChannelNotificationChannelConfigPropertyToCloudFormation(properties.config),
    };
}

// @ts-ignore TS6133
function CfnNotificationChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationChannelProps>();
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
export class CfnNotificationChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DevOpsGuru::NotificationChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNotificationChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnNotificationChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnNotificationChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the notification channel.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * A `NotificationChannelConfig` object that contains information about configured notification channels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-notificationchannel.html#cfn-devopsguru-notificationchannel-config
     */
    public config: CfnNotificationChannel.NotificationChannelConfigProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::DevOpsGuru::NotificationChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNotificationChannelProps) {
        super(scope, id, { type: CfnNotificationChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'config', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.config = props.config;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNotificationChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            config: this.config,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnNotificationChannelPropsToCloudFormation(props);
    }
}

export namespace CfnNotificationChannel {
    /**
     * Information about notification channels you have configured with DevOps Guru. The one supported notification channel is Amazon Simple Notification Service (Amazon SNS).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-notificationchannelconfig.html
     */
    export interface NotificationChannelConfigProperty {
        /**
         * The filter configurations for the Amazon SNS notification topic you use with DevOps Guru. If you do not provide filter configurations, the default configurations are to receive notifications for all message types of `High` or `Medium` severity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-notificationchannelconfig.html#cfn-devopsguru-notificationchannel-notificationchannelconfig-filters
         */
        readonly filters?: CfnNotificationChannel.NotificationFilterConfigProperty | cdk.IResolvable;
        /**
         * Information about a notification channel configured in DevOps Guru to send notifications when insights are created.
         *
         * If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. DevOps Guru only supports standard SNS topics. For more information, see [Permissions for cross account Amazon SNS topics](https://docs.aws.amazon.com/devops-guru/latest/userguide/sns-required-permissions.html) .
         *
         * If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. For more information, see Permissions for cross account Amazon SNS topics.
         *
         * If you use an Amazon SNS topic that is encrypted by an AWS Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see [Permissions for AWS KMS–encrypted Amazon SNS topics](https://docs.aws.amazon.com/devops-guru/latest/userguide/sns-kms-permissions.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-notificationchannelconfig.html#cfn-devopsguru-notificationchannel-notificationchannelconfig-sns
         */
        readonly sns?: CfnNotificationChannel.SnsChannelConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationChannelConfigProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationChannelConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannel_NotificationChannelConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnNotificationChannelNotificationChannelConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNotificationChannel_NotificationChannelConfigPropertyValidator(properties).assertSuccess();
    return {
        Filters: cfnNotificationChannelNotificationFilterConfigPropertyToCloudFormation(properties.filters),
        Sns: cfnNotificationChannelSnsChannelConfigPropertyToCloudFormation(properties.sns),
    };
}

// @ts-ignore TS6133
function CfnNotificationChannelNotificationChannelConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationChannel.NotificationChannelConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationChannel.NotificationChannelConfigProperty>();
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? CfnNotificationChannelNotificationFilterConfigPropertyFromCloudFormation(properties.Filters) : undefined);
    ret.addPropertyResult('sns', 'Sns', properties.Sns != null ? CfnNotificationChannelSnsChannelConfigPropertyFromCloudFormation(properties.Sns) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnNotificationChannel {
    /**
     * The filter configurations for the Amazon SNS notification topic you use with DevOps Guru. You can choose to specify which events or message types to receive notifications for. You can also choose to specify which severity levels to receive notifications for.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-notificationfilterconfig.html
     */
    export interface NotificationFilterConfigProperty {
        /**
         * The events that you want to receive notifications for. For example, you can choose to receive notifications only when the severity level is upgraded or a new insight is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-notificationfilterconfig.html#cfn-devopsguru-notificationchannel-notificationfilterconfig-messagetypes
         */
        readonly messageTypes?: string[];
        /**
         * The severity levels that you want to receive notifications for. For example, you can choose to receive notifications only for insights with `HIGH` and `MEDIUM` severity levels. For more information, see [Understanding insight severities](https://docs.aws.amazon.com/devops-guru/latest/userguide/working-with-insights.html#understanding-insights-severities) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-notificationfilterconfig.html#cfn-devopsguru-notificationchannel-notificationfilterconfig-severities
         */
        readonly severities?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `NotificationFilterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationFilterConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannel_NotificationFilterConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnNotificationChannelNotificationFilterConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNotificationChannel_NotificationFilterConfigPropertyValidator(properties).assertSuccess();
    return {
        MessageTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.messageTypes),
        Severities: cdk.listMapper(cdk.stringToCloudFormation)(properties.severities),
    };
}

// @ts-ignore TS6133
function CfnNotificationChannelNotificationFilterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationChannel.NotificationFilterConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationChannel.NotificationFilterConfigProperty>();
    ret.addPropertyResult('messageTypes', 'MessageTypes', properties.MessageTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.MessageTypes) : undefined);
    ret.addPropertyResult('severities', 'Severities', properties.Severities != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Severities) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnNotificationChannel {
    /**
     * Contains the Amazon Resource Name (ARN) of an Amazon Simple Notification Service topic.
     *
     * If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. DevOps Guru only supports standard SNS topics. For more information, see [Permissions for cross account Amazon SNS topics](https://docs.aws.amazon.com/devops-guru/latest/userguide/sns-required-permissions.html) .
     *
     * If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. For more information, see Permissions for cross account Amazon SNS topics.
     *
     * If you use an Amazon SNS topic that is encrypted by an AWS Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see [Permissions for AWS KMS–encrypted Amazon SNS topics](https://docs.aws.amazon.com/devops-guru/latest/userguide/sns-kms-permissions.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-snschannelconfig.html
     */
    export interface SnsChannelConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of an Amazon Simple Notification Service topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-notificationchannel-snschannelconfig.html#cfn-devopsguru-notificationchannel-snschannelconfig-topicarn
         */
        readonly topicArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SnsChannelConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SnsChannelConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNotificationChannel_SnsChannelConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnNotificationChannelSnsChannelConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNotificationChannel_SnsChannelConfigPropertyValidator(properties).assertSuccess();
    return {
        TopicArn: cdk.stringToCloudFormation(properties.topicArn),
    };
}

// @ts-ignore TS6133
function CfnNotificationChannelSnsChannelConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationChannel.SnsChannelConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationChannel.SnsChannelConfigProperty>();
    ret.addPropertyResult('topicArn', 'TopicArn', properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnResourceCollection`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-resourcecollection.html
 */
export interface CfnResourceCollectionProps {

    /**
     * Information about a filter used to specify which AWS resources are analyzed for anomalous behavior by DevOps Guru.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-resourcecollection.html#cfn-devopsguru-resourcecollection-resourcecollectionfilter
     */
    readonly resourceCollectionFilter: CfnResourceCollection.ResourceCollectionFilterProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnResourceCollectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceCollectionProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollectionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnResourceCollectionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceCollectionPropsValidator(properties).assertSuccess();
    return {
        ResourceCollectionFilter: cfnResourceCollectionResourceCollectionFilterPropertyToCloudFormation(properties.resourceCollectionFilter),
    };
}

// @ts-ignore TS6133
function CfnResourceCollectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceCollectionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceCollectionProps>();
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
export class CfnResourceCollection extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DevOpsGuru::ResourceCollection";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceCollection {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourceCollectionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourceCollection(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The type of AWS resource collections to return. The one valid value is `CLOUD_FORMATION` for AWS CloudFormation stacks.
     * @cloudformationAttribute ResourceCollectionType
     */
    public readonly attrResourceCollectionType: string;

    /**
     * Information about a filter used to specify which AWS resources are analyzed for anomalous behavior by DevOps Guru.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devopsguru-resourcecollection.html#cfn-devopsguru-resourcecollection-resourcecollectionfilter
     */
    public resourceCollectionFilter: CfnResourceCollection.ResourceCollectionFilterProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::DevOpsGuru::ResourceCollection`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceCollectionProps) {
        super(scope, id, { type: CfnResourceCollection.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceCollectionFilter', this);
        this.attrResourceCollectionType = cdk.Token.asString(this.getAtt('ResourceCollectionType', cdk.ResolutionTypeHint.STRING));

        this.resourceCollectionFilter = props.resourceCollectionFilter;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceCollection.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourceCollectionFilter: this.resourceCollectionFilter,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourceCollectionPropsToCloudFormation(props);
    }
}

export namespace CfnResourceCollection {
    /**
     * Information about AWS CloudFormation stacks. You can use up to 500 stacks to specify which AWS resources in your account to analyze. For more information, see [Stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html) in the *AWS CloudFormation User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-cloudformationcollectionfilter.html
     */
    export interface CloudFormationCollectionFilterProperty {
        /**
         * An array of CloudFormation stack names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-cloudformationcollectionfilter.html#cfn-devopsguru-resourcecollection-cloudformationcollectionfilter-stacknames
         */
        readonly stackNames?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CloudFormationCollectionFilterProperty`
 *
 * @param properties - the TypeScript properties of a `CloudFormationCollectionFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollection_CloudFormationCollectionFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnResourceCollectionCloudFormationCollectionFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceCollection_CloudFormationCollectionFilterPropertyValidator(properties).assertSuccess();
    return {
        StackNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.stackNames),
    };
}

// @ts-ignore TS6133
function CfnResourceCollectionCloudFormationCollectionFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceCollection.CloudFormationCollectionFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceCollection.CloudFormationCollectionFilterProperty>();
    ret.addPropertyResult('stackNames', 'StackNames', properties.StackNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StackNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceCollection {
    /**
     * Information about a filter used to specify which AWS resources are analyzed for anomalous behavior by DevOps Guru.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-resourcecollectionfilter.html
     */
    export interface ResourceCollectionFilterProperty {
        /**
         * Information about AWS CloudFormation stacks. You can use up to 500 stacks to specify which AWS resources in your account to analyze. For more information, see [Stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html) in the *AWS CloudFormation User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-resourcecollectionfilter.html#cfn-devopsguru-resourcecollection-resourcecollectionfilter-cloudformation
         */
        readonly cloudFormation?: CfnResourceCollection.CloudFormationCollectionFilterProperty | cdk.IResolvable;
        /**
         * The AWS tags used to filter the resources in the resource collection.
         *
         * Tags help you identify and organize your AWS resources. Many AWS services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an AWS Lambda function. For more information about using tags, see the [Tagging best practices](https://docs.aws.amazon.com/https://d1.awsstatic.com/whitepapers/aws-tagging-best-practices.pdf) whitepaper.
         *
         * Each AWS tag has two parts.
         *
         * - A tag *key* (for example, `CostCenter` , `Environment` , `Project` , or `Secret` ). Tag *keys* are case-sensitive.
         * - An optional field known as a tag *value* (for example, `111122223333` , `Production` , or a team name). Omitting the tag *value* is the same as using an empty string. Like tag *keys* , tag *values* are case-sensitive.
         *
         * Together these are known as *key* - *value* pairs.
         *
         * > The string used for a *key* in a tag that you use to define your resource coverage must begin with the prefix `Devops-guru-` . The tag *key* might be `DevOps-Guru-deployment-application` or `devops-guru-rds-application` . When you create a *key* , the case of characters in the *key* can be whatever you choose. After you create a *key* , it is case-sensitive. For example, DevOps Guru works with a *key* named `devops-guru-rds` and a *key* named `DevOps-Guru-RDS` , and these act as two different *keys* . Possible *key* / *value* pairs in your application might be `Devops-Guru-production-application/RDS` or `Devops-Guru-production-application/containers` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-resourcecollectionfilter.html#cfn-devopsguru-resourcecollection-resourcecollectionfilter-tags
         */
        readonly tags?: CfnResourceCollection.TagCollectionProperty[];
    }
}

/**
 * Determine whether the given properties match those of a `ResourceCollectionFilterProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceCollectionFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollection_ResourceCollectionFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnResourceCollectionResourceCollectionFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceCollection_ResourceCollectionFilterPropertyValidator(properties).assertSuccess();
    return {
        CloudFormation: cfnResourceCollectionCloudFormationCollectionFilterPropertyToCloudFormation(properties.cloudFormation),
        Tags: cdk.listMapper(cfnResourceCollectionTagCollectionPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnResourceCollectionResourceCollectionFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceCollection.ResourceCollectionFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceCollection.ResourceCollectionFilterProperty>();
    ret.addPropertyResult('cloudFormation', 'CloudFormation', properties.CloudFormation != null ? CfnResourceCollectionCloudFormationCollectionFilterPropertyFromCloudFormation(properties.CloudFormation) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnResourceCollectionTagCollectionPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceCollection {
    /**
     * A collection of AWS tags.
     *
     * Tags help you identify and organize your AWS resources. Many AWS services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an AWS Lambda function. For more information about using tags, see the [Tagging best practices](https://docs.aws.amazon.com/https://d1.awsstatic.com/whitepapers/aws-tagging-best-practices.pdf) whitepaper.
     *
     * Each AWS tag has two parts.
     *
     * - A tag *key* (for example, `CostCenter` , `Environment` , `Project` , or `Secret` ). Tag *keys* are case-sensitive.
     * - An optional field known as a tag *value* (for example, `111122223333` , `Production` , or a team name). Omitting the tag *value* is the same as using an empty string. Like tag *keys* , tag *values* are case-sensitive.
     *
     * Together these are known as *key* - *value* pairs.
     *
     * > The string used for a *key* in a tag that you use to define your resource coverage must begin with the prefix `Devops-guru-` . The tag *key* might be `DevOps-Guru-deployment-application` or `devops-guru-rds-application` . When you create a *key* , the case of characters in the *key* can be whatever you choose. After you create a *key* , it is case-sensitive. For example, DevOps Guru works with a *key* named `devops-guru-rds` and a *key* named `DevOps-Guru-RDS` , and these act as two different *keys* . Possible *key* / *value* pairs in your application might be `Devops-Guru-production-application/RDS` or `Devops-Guru-production-application/containers` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-tagcollection.html
     */
    export interface TagCollectionProperty {
        /**
         * An AWS tag *key* that is used to identify the AWS resources that DevOps Guru analyzes. All AWS resources in your account and Region tagged with this *key* make up your DevOps Guru application and analysis boundary.
         *
         * > The string used for a *key* in a tag that you use to define your resource coverage must begin with the prefix `Devops-guru-` . The tag *key* might be `DevOps-Guru-deployment-application` or `devops-guru-rds-application` . When you create a *key* , the case of characters in the *key* can be whatever you choose. After you create a *key* , it is case-sensitive. For example, DevOps Guru works with a *key* named `devops-guru-rds` and a *key* named `DevOps-Guru-RDS` , and these act as two different *keys* . Possible *key* / *value* pairs in your application might be `Devops-Guru-production-application/RDS` or `Devops-Guru-production-application/containers` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-tagcollection.html#cfn-devopsguru-resourcecollection-tagcollection-appboundarykey
         */
        readonly appBoundaryKey?: string;
        /**
         * The values in an AWS tag collection.
         *
         * The tag's *value* is an optional field used to associate a string with the tag *key* (for example, `111122223333` , `Production` , or a team name). The *key* and *value* are the tag's *key* pair. Omitting the tag *value* is the same as using an empty string. Like tag *keys* , tag *values* are case-sensitive. You can specify a maximum of 256 characters for a tag value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devopsguru-resourcecollection-tagcollection.html#cfn-devopsguru-resourcecollection-tagcollection-tagvalues
         */
        readonly tagValues?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `TagCollectionProperty`
 *
 * @param properties - the TypeScript properties of a `TagCollectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceCollection_TagCollectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnResourceCollectionTagCollectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceCollection_TagCollectionPropertyValidator(properties).assertSuccess();
    return {
        AppBoundaryKey: cdk.stringToCloudFormation(properties.appBoundaryKey),
        TagValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues),
    };
}

// @ts-ignore TS6133
function CfnResourceCollectionTagCollectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceCollection.TagCollectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceCollection.TagCollectionProperty>();
    ret.addPropertyResult('appBoundaryKey', 'AppBoundaryKey', properties.AppBoundaryKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppBoundaryKey) : undefined);
    ret.addPropertyResult('tagValues', 'TagValues', properties.TagValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TagValues) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

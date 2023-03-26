// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:34.531Z","fingerprint":"3Fs2ToJTvWgAxdnlcyzRwsO+MMpmBfK34P7mmNLyPDk="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html
 */
export interface CfnChannelProps {

    /**
     * The name of the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelname
     */
    readonly channelName?: string;

    /**
     * Where channel data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelstorage
     */
    readonly channelStorage?: CfnChannel.ChannelStorageProperty | cdk.IResolvable;

    /**
     * How long, in days, message data is kept for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-retentionperiod
     */
    readonly retentionPeriod?: CfnChannel.RetentionPeriodProperty | cdk.IResolvable;

    /**
     * Metadata which can be used to manage the channel.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelName', cdk.validateString)(properties.channelName));
    errors.collect(cdk.propertyValidator('channelStorage', CfnChannel_ChannelStoragePropertyValidator)(properties.channelStorage));
    errors.collect(cdk.propertyValidator('retentionPeriod', CfnChannel_RetentionPeriodPropertyValidator)(properties.retentionPeriod));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel` resource
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel` resource.
 */
// @ts-ignore TS6133
function cfnChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannelPropsValidator(properties).assertSuccess();
    return {
        ChannelName: cdk.stringToCloudFormation(properties.channelName),
        ChannelStorage: cfnChannelChannelStoragePropertyToCloudFormation(properties.channelStorage),
        RetentionPeriod: cfnChannelRetentionPeriodPropertyToCloudFormation(properties.retentionPeriod),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelProps>();
    ret.addPropertyResult('channelName', 'ChannelName', properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined);
    ret.addPropertyResult('channelStorage', 'ChannelStorage', properties.ChannelStorage != null ? CfnChannelChannelStoragePropertyFromCloudFormation(properties.ChannelStorage) : undefined);
    ret.addPropertyResult('retentionPeriod', 'RetentionPeriod', properties.RetentionPeriod != null ? CfnChannelRetentionPeriodPropertyFromCloudFormation(properties.RetentionPeriod) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTAnalytics::Channel`
 *
 * The AWS::IoTAnalytics::Channel resource collects data from an MQTT topic and archives the raw, unprocessed messages before publishing the data to a pipeline. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Channel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Channel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name of the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelname
     */
    public channelName: string | undefined;

    /**
     * Where channel data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelstorage
     */
    public channelStorage: CfnChannel.ChannelStorageProperty | cdk.IResolvable | undefined;

    /**
     * How long, in days, message data is kept for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-retentionperiod
     */
    public retentionPeriod: CfnChannel.RetentionPeriodProperty | cdk.IResolvable | undefined;

    /**
     * Metadata which can be used to manage the channel.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTAnalytics::Channel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnChannelProps = {}) {
        super(scope, id, { type: CfnChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.channelName = props.channelName;
        this.channelStorage = props.channelStorage;
        this.retentionPeriod = props.retentionPeriod;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Channel", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            channelName: this.channelName,
            channelStorage: this.channelStorage,
            retentionPeriod: this.retentionPeriod,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnChannelPropsToCloudFormation(props);
    }
}

export namespace CfnChannel {
    /**
     * Where channel data is stored. You may choose one of `serviceManagedS3` , `customerManagedS3` storage. If not specified, the default is `serviceManagedS3` . This can't be changed after creation of the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-channelstorage.html
     */
    export interface ChannelStorageProperty {
        /**
         * Used to store channel data in an S3 bucket that you manage. If customer managed storage is selected, the `retentionPeriod` parameter is ignored. You can't change the choice of S3 storage after the data store is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-channelstorage.html#cfn-iotanalytics-channel-channelstorage-customermanageds3
         */
        readonly customerManagedS3?: CfnChannel.CustomerManagedS3Property | cdk.IResolvable;
        /**
         * Used to store channel data in an S3 bucket managed by AWS IoT Analytics . You can't change the choice of S3 storage after the data store is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-channelstorage.html#cfn-iotanalytics-channel-channelstorage-servicemanageds3
         */
        readonly serviceManagedS3?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ChannelStorageProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelStorageProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_ChannelStoragePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customerManagedS3', CfnChannel_CustomerManagedS3PropertyValidator)(properties.customerManagedS3));
    errors.collect(cdk.propertyValidator('serviceManagedS3', cdk.validateObject)(properties.serviceManagedS3));
    return errors.wrap('supplied properties not correct for "ChannelStorageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel.ChannelStorage` resource
 *
 * @param properties - the TypeScript properties of a `ChannelStorageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel.ChannelStorage` resource.
 */
// @ts-ignore TS6133
function cfnChannelChannelStoragePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_ChannelStoragePropertyValidator(properties).assertSuccess();
    return {
        CustomerManagedS3: cfnChannelCustomerManagedS3PropertyToCloudFormation(properties.customerManagedS3),
        ServiceManagedS3: cdk.objectToCloudFormation(properties.serviceManagedS3),
    };
}

// @ts-ignore TS6133
function CfnChannelChannelStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ChannelStorageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ChannelStorageProperty>();
    ret.addPropertyResult('customerManagedS3', 'CustomerManagedS3', properties.CustomerManagedS3 != null ? CfnChannelCustomerManagedS3PropertyFromCloudFormation(properties.CustomerManagedS3) : undefined);
    ret.addPropertyResult('serviceManagedS3', 'ServiceManagedS3', properties.ServiceManagedS3 != null ? cfn_parse.FromCloudFormation.getAny(properties.ServiceManagedS3) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Used to store channel data in an S3 bucket that you manage.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html
     */
    export interface CustomerManagedS3Property {
        /**
         * The name of the S3 bucket in which channel data is stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html#cfn-iotanalytics-channel-customermanageds3-bucket
         */
        readonly bucket: string;
        /**
         * (Optional) The prefix used to create the keys of the channel data objects. Each object in an S3 bucket has a key that is its unique identifier within the bucket (each object in a bucket has exactly one key). The prefix must end with a forward slash (/).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html#cfn-iotanalytics-channel-customermanageds3-keyprefix
         */
        readonly keyPrefix?: string;
        /**
         * The ARN of the role that grants AWS IoT Analytics permission to interact with your Amazon S3 resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html#cfn-iotanalytics-channel-customermanageds3-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomerManagedS3Property`
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3Property`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CustomerManagedS3PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('keyPrefix', cdk.validateString)(properties.keyPrefix));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CustomerManagedS3Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel.CustomerManagedS3` resource
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel.CustomerManagedS3` resource.
 */
// @ts-ignore TS6133
function cfnChannelCustomerManagedS3PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CustomerManagedS3PropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        KeyPrefix: cdk.stringToCloudFormation(properties.keyPrefix),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnChannelCustomerManagedS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CustomerManagedS3Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CustomerManagedS3Property>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('keyPrefix', 'KeyPrefix', properties.KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefix) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * How long, in days, message data is kept.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-retentionperiod.html
     */
    export interface RetentionPeriodProperty {
        /**
         * The number of days that message data is kept. The `unlimited` parameter must be false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-retentionperiod.html#cfn-iotanalytics-channel-retentionperiod-numberofdays
         */
        readonly numberOfDays?: number;
        /**
         * If true, message data is kept indefinitely.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-retentionperiod.html#cfn-iotanalytics-channel-retentionperiod-unlimited
         */
        readonly unlimited?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RetentionPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_RetentionPeriodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('numberOfDays', cdk.validateNumber)(properties.numberOfDays));
    errors.collect(cdk.propertyValidator('unlimited', cdk.validateBoolean)(properties.unlimited));
    return errors.wrap('supplied properties not correct for "RetentionPeriodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel.RetentionPeriod` resource
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Channel.RetentionPeriod` resource.
 */
// @ts-ignore TS6133
function cfnChannelRetentionPeriodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_RetentionPeriodPropertyValidator(properties).assertSuccess();
    return {
        NumberOfDays: cdk.numberToCloudFormation(properties.numberOfDays),
        Unlimited: cdk.booleanToCloudFormation(properties.unlimited),
    };
}

// @ts-ignore TS6133
function CfnChannelRetentionPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.RetentionPeriodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RetentionPeriodProperty>();
    ret.addPropertyResult('numberOfDays', 'NumberOfDays', properties.NumberOfDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDays) : undefined);
    ret.addPropertyResult('unlimited', 'Unlimited', properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDataset`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html
 */
export interface CfnDatasetProps {

    /**
     * The `DatasetAction` objects that automatically create the dataset contents.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-actions
     */
    readonly actions: Array<CfnDataset.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * When dataset contents are created they are delivered to destinations specified here.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-contentdeliveryrules
     */
    readonly contentDeliveryRules?: Array<CfnDataset.DatasetContentDeliveryRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-datasetname
     */
    readonly datasetName?: string;

    /**
     * A list of data rules that send notifications to CloudWatch, when data arrives late. To specify `lateDataRules` , the dataset must use a [DeltaTimer](https://docs.aws.amazon.com/iotanalytics/latest/APIReference/API_DeltaTime.html) filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-latedatarules
     */
    readonly lateDataRules?: Array<CfnDataset.LateDataRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Optional. How long, in days, message data is kept for the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-retentionperiod
     */
    readonly retentionPeriod?: CfnDataset.RetentionPeriodProperty | cdk.IResolvable;

    /**
     * Metadata which can be used to manage the data set.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The `DatasetTrigger` objects that specify when the dataset is automatically updated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-triggers
     */
    readonly triggers?: Array<CfnDataset.TriggerProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Optional. How many versions of dataset contents are kept. If not specified or set to null, only the latest version plus the latest succeeded version (if they are different) are kept for the time period specified by the `retentionPeriod` parameter. For more information, see [Keeping Multiple Versions of AWS IoT Analytics datasets](https://docs.aws.amazon.com/iotanalytics/latest/userguide/getting-started.html#aws-iot-analytics-dataset-versions) in the *AWS IoT Analytics User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-versioningconfiguration
     */
    readonly versioningConfiguration?: CfnDataset.VersioningConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnDatasetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the result of the validation.
 */
function CfnDatasetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(CfnDataset_ActionPropertyValidator))(properties.actions));
    errors.collect(cdk.propertyValidator('contentDeliveryRules', cdk.listValidator(CfnDataset_DatasetContentDeliveryRulePropertyValidator))(properties.contentDeliveryRules));
    errors.collect(cdk.propertyValidator('datasetName', cdk.validateString)(properties.datasetName));
    errors.collect(cdk.propertyValidator('lateDataRules', cdk.listValidator(CfnDataset_LateDataRulePropertyValidator))(properties.lateDataRules));
    errors.collect(cdk.propertyValidator('retentionPeriod', CfnDataset_RetentionPeriodPropertyValidator)(properties.retentionPeriod));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('triggers', cdk.listValidator(CfnDataset_TriggerPropertyValidator))(properties.triggers));
    errors.collect(cdk.propertyValidator('versioningConfiguration', CfnDataset_VersioningConfigurationPropertyValidator)(properties.versioningConfiguration));
    return errors.wrap('supplied properties not correct for "CfnDatasetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset` resource.
 */
// @ts-ignore TS6133
function cfnDatasetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatasetPropsValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cfnDatasetActionPropertyToCloudFormation)(properties.actions),
        ContentDeliveryRules: cdk.listMapper(cfnDatasetDatasetContentDeliveryRulePropertyToCloudFormation)(properties.contentDeliveryRules),
        DatasetName: cdk.stringToCloudFormation(properties.datasetName),
        LateDataRules: cdk.listMapper(cfnDatasetLateDataRulePropertyToCloudFormation)(properties.lateDataRules),
        RetentionPeriod: cfnDatasetRetentionPeriodPropertyToCloudFormation(properties.retentionPeriod),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Triggers: cdk.listMapper(cfnDatasetTriggerPropertyToCloudFormation)(properties.triggers),
        VersioningConfiguration: cfnDatasetVersioningConfigurationPropertyToCloudFormation(properties.versioningConfiguration),
    };
}

// @ts-ignore TS6133
function CfnDatasetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetProps>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getArray(CfnDatasetActionPropertyFromCloudFormation)(properties.Actions));
    ret.addPropertyResult('contentDeliveryRules', 'ContentDeliveryRules', properties.ContentDeliveryRules != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetDatasetContentDeliveryRulePropertyFromCloudFormation)(properties.ContentDeliveryRules) : undefined);
    ret.addPropertyResult('datasetName', 'DatasetName', properties.DatasetName != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetName) : undefined);
    ret.addPropertyResult('lateDataRules', 'LateDataRules', properties.LateDataRules != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetLateDataRulePropertyFromCloudFormation)(properties.LateDataRules) : undefined);
    ret.addPropertyResult('retentionPeriod', 'RetentionPeriod', properties.RetentionPeriod != null ? CfnDatasetRetentionPeriodPropertyFromCloudFormation(properties.RetentionPeriod) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('triggers', 'Triggers', properties.Triggers != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetTriggerPropertyFromCloudFormation)(properties.Triggers) : undefined);
    ret.addPropertyResult('versioningConfiguration', 'VersioningConfiguration', properties.VersioningConfiguration != null ? CfnDatasetVersioningConfigurationPropertyFromCloudFormation(properties.VersioningConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTAnalytics::Dataset`
 *
 * The AWS::IoTAnalytics::Dataset resource stores data retrieved from a data store by applying a `queryAction` (an SQL query) or a `containerAction` (executing a containerized application). The data set can be populated manually by calling `CreateDatasetContent` or automatically according to a `trigger` you specify. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Dataset
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html
 */
export class CfnDataset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Dataset";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataset {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatasetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataset(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The `DatasetAction` objects that automatically create the dataset contents.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-actions
     */
    public actions: Array<CfnDataset.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * When dataset contents are created they are delivered to destinations specified here.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-contentdeliveryrules
     */
    public contentDeliveryRules: Array<CfnDataset.DatasetContentDeliveryRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-datasetname
     */
    public datasetName: string | undefined;

    /**
     * A list of data rules that send notifications to CloudWatch, when data arrives late. To specify `lateDataRules` , the dataset must use a [DeltaTimer](https://docs.aws.amazon.com/iotanalytics/latest/APIReference/API_DeltaTime.html) filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-latedatarules
     */
    public lateDataRules: Array<CfnDataset.LateDataRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Optional. How long, in days, message data is kept for the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-retentionperiod
     */
    public retentionPeriod: CfnDataset.RetentionPeriodProperty | cdk.IResolvable | undefined;

    /**
     * Metadata which can be used to manage the data set.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The `DatasetTrigger` objects that specify when the dataset is automatically updated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-triggers
     */
    public triggers: Array<CfnDataset.TriggerProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Optional. How many versions of dataset contents are kept. If not specified or set to null, only the latest version plus the latest succeeded version (if they are different) are kept for the time period specified by the `retentionPeriod` parameter. For more information, see [Keeping Multiple Versions of AWS IoT Analytics datasets](https://docs.aws.amazon.com/iotanalytics/latest/userguide/getting-started.html#aws-iot-analytics-dataset-versions) in the *AWS IoT Analytics User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-versioningconfiguration
     */
    public versioningConfiguration: CfnDataset.VersioningConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::IoTAnalytics::Dataset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps) {
        super(scope, id, { type: CfnDataset.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'actions', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.actions = props.actions;
        this.contentDeliveryRules = props.contentDeliveryRules;
        this.datasetName = props.datasetName;
        this.lateDataRules = props.lateDataRules;
        this.retentionPeriod = props.retentionPeriod;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Dataset", props.tags, { tagPropertyName: 'tags' });
        this.triggers = props.triggers;
        this.versioningConfiguration = props.versioningConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataset.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            actions: this.actions,
            contentDeliveryRules: this.contentDeliveryRules,
            datasetName: this.datasetName,
            lateDataRules: this.lateDataRules,
            retentionPeriod: this.retentionPeriod,
            tags: this.tags.renderTags(),
            triggers: this.triggers,
            versioningConfiguration: this.versioningConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatasetPropsToCloudFormation(props);
    }
}

export namespace CfnDataset {
    /**
     * Information needed to run the "containerAction" to produce data set contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html
     */
    export interface ActionProperty {
        /**
         * The name of the data set action by which data set contents are automatically created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html#cfn-iotanalytics-dataset-action-actionname
         */
        readonly actionName: string;
        /**
         * Information which allows the system to run a containerized application in order to create the data set contents. The application must be in a Docker container along with any needed support libraries.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html#cfn-iotanalytics-dataset-action-containeraction
         */
        readonly containerAction?: CfnDataset.ContainerActionProperty | cdk.IResolvable;
        /**
         * An "SqlQueryDatasetAction" object that uses an SQL query to automatically create data set contents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html#cfn-iotanalytics-dataset-action-queryaction
         */
        readonly queryAction?: CfnDataset.QueryActionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_ActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionName', cdk.requiredValidator)(properties.actionName));
    errors.collect(cdk.propertyValidator('actionName', cdk.validateString)(properties.actionName));
    errors.collect(cdk.propertyValidator('containerAction', CfnDataset_ContainerActionPropertyValidator)(properties.containerAction));
    errors.collect(cdk.propertyValidator('queryAction', CfnDataset_QueryActionPropertyValidator)(properties.queryAction));
    return errors.wrap('supplied properties not correct for "ActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Action` resource
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Action` resource.
 */
// @ts-ignore TS6133
function cfnDatasetActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_ActionPropertyValidator(properties).assertSuccess();
    return {
        ActionName: cdk.stringToCloudFormation(properties.actionName),
        ContainerAction: cfnDatasetContainerActionPropertyToCloudFormation(properties.containerAction),
        QueryAction: cfnDatasetQueryActionPropertyToCloudFormation(properties.queryAction),
    };
}

// @ts-ignore TS6133
function CfnDatasetActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.ActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ActionProperty>();
    ret.addPropertyResult('actionName', 'ActionName', cfn_parse.FromCloudFormation.getString(properties.ActionName));
    ret.addPropertyResult('containerAction', 'ContainerAction', properties.ContainerAction != null ? CfnDatasetContainerActionPropertyFromCloudFormation(properties.ContainerAction) : undefined);
    ret.addPropertyResult('queryAction', 'QueryAction', properties.QueryAction != null ? CfnDatasetQueryActionPropertyFromCloudFormation(properties.QueryAction) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Information needed to run the "containerAction" to produce data set contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html
     */
    export interface ContainerActionProperty {
        /**
         * The ARN of the role which gives permission to the system to access needed resources in order to run the "containerAction". This includes, at minimum, permission to retrieve the data set contents which are the input to the containerized application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-executionrolearn
         */
        readonly executionRoleArn: string;
        /**
         * The ARN of the Docker container stored in your account. The Docker container contains an application and needed support libraries and is used to generate data set contents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-image
         */
        readonly image: string;
        /**
         * Configuration of the resource which executes the "containerAction".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-resourceconfiguration
         */
        readonly resourceConfiguration: CfnDataset.ResourceConfigurationProperty | cdk.IResolvable;
        /**
         * The values of variables used within the context of the execution of the containerized application (basically, parameters passed to the application). Each variable must have a name and a value given by one of "stringValue", "datasetContentVersionValue", or "outputFileUriValue".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-variables
         */
        readonly variables?: Array<CfnDataset.VariableProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContainerActionProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_ContainerActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('executionRoleArn', cdk.requiredValidator)(properties.executionRoleArn));
    errors.collect(cdk.propertyValidator('executionRoleArn', cdk.validateString)(properties.executionRoleArn));
    errors.collect(cdk.propertyValidator('image', cdk.requiredValidator)(properties.image));
    errors.collect(cdk.propertyValidator('image', cdk.validateString)(properties.image));
    errors.collect(cdk.propertyValidator('resourceConfiguration', cdk.requiredValidator)(properties.resourceConfiguration));
    errors.collect(cdk.propertyValidator('resourceConfiguration', CfnDataset_ResourceConfigurationPropertyValidator)(properties.resourceConfiguration));
    errors.collect(cdk.propertyValidator('variables', cdk.listValidator(CfnDataset_VariablePropertyValidator))(properties.variables));
    return errors.wrap('supplied properties not correct for "ContainerActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.ContainerAction` resource
 *
 * @param properties - the TypeScript properties of a `ContainerActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.ContainerAction` resource.
 */
// @ts-ignore TS6133
function cfnDatasetContainerActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_ContainerActionPropertyValidator(properties).assertSuccess();
    return {
        ExecutionRoleArn: cdk.stringToCloudFormation(properties.executionRoleArn),
        Image: cdk.stringToCloudFormation(properties.image),
        ResourceConfiguration: cfnDatasetResourceConfigurationPropertyToCloudFormation(properties.resourceConfiguration),
        Variables: cdk.listMapper(cfnDatasetVariablePropertyToCloudFormation)(properties.variables),
    };
}

// @ts-ignore TS6133
function CfnDatasetContainerActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.ContainerActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ContainerActionProperty>();
    ret.addPropertyResult('executionRoleArn', 'ExecutionRoleArn', cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn));
    ret.addPropertyResult('image', 'Image', cfn_parse.FromCloudFormation.getString(properties.Image));
    ret.addPropertyResult('resourceConfiguration', 'ResourceConfiguration', CfnDatasetResourceConfigurationPropertyFromCloudFormation(properties.ResourceConfiguration));
    ret.addPropertyResult('variables', 'Variables', properties.Variables != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetVariablePropertyFromCloudFormation)(properties.Variables) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * When dataset contents are created, they are delivered to destination specified here.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryrule.html
     */
    export interface DatasetContentDeliveryRuleProperty {
        /**
         * The destination to which dataset contents are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryrule.html#cfn-iotanalytics-dataset-datasetcontentdeliveryrule-destination
         */
        readonly destination: CfnDataset.DatasetContentDeliveryRuleDestinationProperty | cdk.IResolvable;
        /**
         * The name of the dataset content delivery rules entry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryrule.html#cfn-iotanalytics-dataset-datasetcontentdeliveryrule-entryname
         */
        readonly entryName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatasetContentDeliveryRuleProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetContentDeliveryRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_DatasetContentDeliveryRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnDataset_DatasetContentDeliveryRuleDestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('entryName', cdk.validateString)(properties.entryName));
    return errors.wrap('supplied properties not correct for "DatasetContentDeliveryRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DatasetContentDeliveryRule` resource
 *
 * @param properties - the TypeScript properties of a `DatasetContentDeliveryRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DatasetContentDeliveryRule` resource.
 */
// @ts-ignore TS6133
function cfnDatasetDatasetContentDeliveryRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_DatasetContentDeliveryRulePropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnDatasetDatasetContentDeliveryRuleDestinationPropertyToCloudFormation(properties.destination),
        EntryName: cdk.stringToCloudFormation(properties.entryName),
    };
}

// @ts-ignore TS6133
function CfnDatasetDatasetContentDeliveryRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetContentDeliveryRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetContentDeliveryRuleProperty>();
    ret.addPropertyResult('destination', 'Destination', CfnDatasetDatasetContentDeliveryRuleDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('entryName', 'EntryName', properties.EntryName != null ? cfn_parse.FromCloudFormation.getString(properties.EntryName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * The destination to which dataset contents are delivered.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryruledestination.html
     */
    export interface DatasetContentDeliveryRuleDestinationProperty {
        /**
         * Configuration information for delivery of dataset contents to AWS IoT Events .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryruledestination.html#cfn-iotanalytics-dataset-datasetcontentdeliveryruledestination-ioteventsdestinationconfiguration
         */
        readonly iotEventsDestinationConfiguration?: CfnDataset.IotEventsDestinationConfigurationProperty | cdk.IResolvable;
        /**
         * Configuration information for delivery of dataset contents to Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryruledestination.html#cfn-iotanalytics-dataset-datasetcontentdeliveryruledestination-s3destinationconfiguration
         */
        readonly s3DestinationConfiguration?: CfnDataset.S3DestinationConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DatasetContentDeliveryRuleDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetContentDeliveryRuleDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_DatasetContentDeliveryRuleDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iotEventsDestinationConfiguration', CfnDataset_IotEventsDestinationConfigurationPropertyValidator)(properties.iotEventsDestinationConfiguration));
    errors.collect(cdk.propertyValidator('s3DestinationConfiguration', CfnDataset_S3DestinationConfigurationPropertyValidator)(properties.s3DestinationConfiguration));
    return errors.wrap('supplied properties not correct for "DatasetContentDeliveryRuleDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DatasetContentDeliveryRuleDestination` resource
 *
 * @param properties - the TypeScript properties of a `DatasetContentDeliveryRuleDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DatasetContentDeliveryRuleDestination` resource.
 */
// @ts-ignore TS6133
function cfnDatasetDatasetContentDeliveryRuleDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_DatasetContentDeliveryRuleDestinationPropertyValidator(properties).assertSuccess();
    return {
        IotEventsDestinationConfiguration: cfnDatasetIotEventsDestinationConfigurationPropertyToCloudFormation(properties.iotEventsDestinationConfiguration),
        S3DestinationConfiguration: cfnDatasetS3DestinationConfigurationPropertyToCloudFormation(properties.s3DestinationConfiguration),
    };
}

// @ts-ignore TS6133
function CfnDatasetDatasetContentDeliveryRuleDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetContentDeliveryRuleDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetContentDeliveryRuleDestinationProperty>();
    ret.addPropertyResult('iotEventsDestinationConfiguration', 'IotEventsDestinationConfiguration', properties.IotEventsDestinationConfiguration != null ? CfnDatasetIotEventsDestinationConfigurationPropertyFromCloudFormation(properties.IotEventsDestinationConfiguration) : undefined);
    ret.addPropertyResult('s3DestinationConfiguration', 'S3DestinationConfiguration', properties.S3DestinationConfiguration != null ? CfnDatasetS3DestinationConfigurationPropertyFromCloudFormation(properties.S3DestinationConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * The dataset whose latest contents are used as input to the notebook or application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentversionvalue.html
     */
    export interface DatasetContentVersionValueProperty {
        /**
         * The name of the dataset whose latest contents are used as input to the notebook or application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentversionvalue.html#cfn-iotanalytics-dataset-datasetcontentversionvalue-datasetname
         */
        readonly datasetName: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatasetContentVersionValueProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetContentVersionValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_DatasetContentVersionValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datasetName', cdk.requiredValidator)(properties.datasetName));
    errors.collect(cdk.propertyValidator('datasetName', cdk.validateString)(properties.datasetName));
    return errors.wrap('supplied properties not correct for "DatasetContentVersionValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DatasetContentVersionValue` resource
 *
 * @param properties - the TypeScript properties of a `DatasetContentVersionValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DatasetContentVersionValue` resource.
 */
// @ts-ignore TS6133
function cfnDatasetDatasetContentVersionValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_DatasetContentVersionValuePropertyValidator(properties).assertSuccess();
    return {
        DatasetName: cdk.stringToCloudFormation(properties.datasetName),
    };
}

// @ts-ignore TS6133
function CfnDatasetDatasetContentVersionValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetContentVersionValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetContentVersionValueProperty>();
    ret.addPropertyResult('datasetName', 'DatasetName', cfn_parse.FromCloudFormation.getString(properties.DatasetName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Used to limit data to that which has arrived since the last execution of the action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatime.html
     */
    export interface DeltaTimeProperty {
        /**
         * The number of seconds of estimated in-flight lag time of message data. When you create dataset contents using message data from a specified timeframe, some message data might still be in flight when processing begins, and so do not arrive in time to be processed. Use this field to make allowances for the in flight time of your message data, so that data not processed from a previous timeframe is included with the next timeframe. Otherwise, missed message data would be excluded from processing during the next timeframe too, because its timestamp places it within the previous timeframe.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatime.html#cfn-iotanalytics-dataset-deltatime-offsetseconds
         */
        readonly offsetSeconds: number;
        /**
         * An expression by which the time of the message data might be determined. This can be the name of a timestamp field or a SQL expression that is used to derive the time the message data was generated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatime.html#cfn-iotanalytics-dataset-deltatime-timeexpression
         */
        readonly timeExpression: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeltaTimeProperty`
 *
 * @param properties - the TypeScript properties of a `DeltaTimeProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_DeltaTimePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('offsetSeconds', cdk.requiredValidator)(properties.offsetSeconds));
    errors.collect(cdk.propertyValidator('offsetSeconds', cdk.validateNumber)(properties.offsetSeconds));
    errors.collect(cdk.propertyValidator('timeExpression', cdk.requiredValidator)(properties.timeExpression));
    errors.collect(cdk.propertyValidator('timeExpression', cdk.validateString)(properties.timeExpression));
    return errors.wrap('supplied properties not correct for "DeltaTimeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DeltaTime` resource
 *
 * @param properties - the TypeScript properties of a `DeltaTimeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DeltaTime` resource.
 */
// @ts-ignore TS6133
function cfnDatasetDeltaTimePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_DeltaTimePropertyValidator(properties).assertSuccess();
    return {
        OffsetSeconds: cdk.numberToCloudFormation(properties.offsetSeconds),
        TimeExpression: cdk.stringToCloudFormation(properties.timeExpression),
    };
}

// @ts-ignore TS6133
function CfnDatasetDeltaTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DeltaTimeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DeltaTimeProperty>();
    ret.addPropertyResult('offsetSeconds', 'OffsetSeconds', cfn_parse.FromCloudFormation.getNumber(properties.OffsetSeconds));
    ret.addPropertyResult('timeExpression', 'TimeExpression', cfn_parse.FromCloudFormation.getString(properties.TimeExpression));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * A structure that contains the configuration information of a delta time session window.
     *
     * [`DeltaTime`](https://docs.aws.amazon.com/iotanalytics/latest/APIReference/API_DeltaTime.html) specifies a time interval. You can use `DeltaTime` to create dataset contents with data that has arrived in the data store since the last execution. For an example of `DeltaTime` , see [Creating a SQL dataset with a delta window (CLI)](https://docs.aws.amazon.com/iotanalytics/latest/userguide/automate-create-dataset.html#automate-example6) in the *AWS IoT Analytics User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatimesessionwindowconfiguration.html
     */
    export interface DeltaTimeSessionWindowConfigurationProperty {
        /**
         * A time interval. You can use `timeoutInMinutes` so that AWS IoT Analytics can batch up late data notifications that have been generated since the last execution. AWS IoT Analytics sends one batch of notifications to Amazon CloudWatch Events at one time.
         *
         * For more information about how to write a timestamp expression, see [Date and Time Functions and Operators](https://docs.aws.amazon.com/https://prestodb.io/docs/0.172/functions/datetime.html) , in the *Presto 0.172 Documentation* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatimesessionwindowconfiguration.html#cfn-iotanalytics-dataset-deltatimesessionwindowconfiguration-timeoutinminutes
         */
        readonly timeoutInMinutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `DeltaTimeSessionWindowConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DeltaTimeSessionWindowConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_DeltaTimeSessionWindowConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('timeoutInMinutes', cdk.requiredValidator)(properties.timeoutInMinutes));
    errors.collect(cdk.propertyValidator('timeoutInMinutes', cdk.validateNumber)(properties.timeoutInMinutes));
    return errors.wrap('supplied properties not correct for "DeltaTimeSessionWindowConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DeltaTimeSessionWindowConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DeltaTimeSessionWindowConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.DeltaTimeSessionWindowConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatasetDeltaTimeSessionWindowConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_DeltaTimeSessionWindowConfigurationPropertyValidator(properties).assertSuccess();
    return {
        TimeoutInMinutes: cdk.numberToCloudFormation(properties.timeoutInMinutes),
    };
}

// @ts-ignore TS6133
function CfnDatasetDeltaTimeSessionWindowConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DeltaTimeSessionWindowConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DeltaTimeSessionWindowConfigurationProperty>();
    ret.addPropertyResult('timeoutInMinutes', 'TimeoutInMinutes', cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMinutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Information which is used to filter message data, to segregate it according to the time frame in which it arrives.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-filter.html
     */
    export interface FilterProperty {
        /**
         * Used to limit data to that which has arrived since the last execution of the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-filter.html#cfn-iotanalytics-dataset-filter-deltatime
         */
        readonly deltaTime?: CfnDataset.DeltaTimeProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_FilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deltaTime', CfnDataset_DeltaTimePropertyValidator)(properties.deltaTime));
    return errors.wrap('supplied properties not correct for "FilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Filter` resource
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Filter` resource.
 */
// @ts-ignore TS6133
function cfnDatasetFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_FilterPropertyValidator(properties).assertSuccess();
    return {
        DeltaTime: cfnDatasetDeltaTimePropertyToCloudFormation(properties.deltaTime),
    };
}

// @ts-ignore TS6133
function CfnDatasetFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.FilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.FilterProperty>();
    ret.addPropertyResult('deltaTime', 'DeltaTime', properties.DeltaTime != null ? CfnDatasetDeltaTimePropertyFromCloudFormation(properties.DeltaTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Configuration information for coordination with AWS Glue , a fully managed extract, transform and load (ETL) service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-glueconfiguration.html
     */
    export interface GlueConfigurationProperty {
        /**
         * The name of the database in your AWS Glue Data Catalog in which the table is located. An AWS Glue Data Catalog database contains metadata tables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-glueconfiguration.html#cfn-iotanalytics-dataset-glueconfiguration-databasename
         */
        readonly databaseName: string;
        /**
         * The name of the table in your AWS Glue Data Catalog that is used to perform the ETL operations. An AWS Glue Data Catalog table contains partitioned data and descriptions of data sources and targets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-glueconfiguration.html#cfn-iotanalytics-dataset-glueconfiguration-tablename
         */
        readonly tableName: string;
    }
}

/**
 * Determine whether the given properties match those of a `GlueConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `GlueConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_GlueConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    return errors.wrap('supplied properties not correct for "GlueConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.GlueConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `GlueConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.GlueConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatasetGlueConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_GlueConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        TableName: cdk.stringToCloudFormation(properties.tableName),
    };
}

// @ts-ignore TS6133
function CfnDatasetGlueConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.GlueConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.GlueConfigurationProperty>();
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Configuration information for delivery of dataset contents to AWS IoT Events .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-ioteventsdestinationconfiguration.html
     */
    export interface IotEventsDestinationConfigurationProperty {
        /**
         * The name of the AWS IoT Events input to which dataset contents are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-ioteventsdestinationconfiguration.html#cfn-iotanalytics-dataset-ioteventsdestinationconfiguration-inputname
         */
        readonly inputName: string;
        /**
         * The ARN of the role that grants AWS IoT Analytics permission to deliver dataset contents to an AWS IoT Events input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-ioteventsdestinationconfiguration.html#cfn-iotanalytics-dataset-ioteventsdestinationconfiguration-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `IotEventsDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IotEventsDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_IotEventsDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputName', cdk.requiredValidator)(properties.inputName));
    errors.collect(cdk.propertyValidator('inputName', cdk.validateString)(properties.inputName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "IotEventsDestinationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.IotEventsDestinationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `IotEventsDestinationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.IotEventsDestinationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatasetIotEventsDestinationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_IotEventsDestinationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        InputName: cdk.stringToCloudFormation(properties.inputName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnDatasetIotEventsDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.IotEventsDestinationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.IotEventsDestinationConfigurationProperty>();
    ret.addPropertyResult('inputName', 'InputName', cfn_parse.FromCloudFormation.getString(properties.InputName));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * A structure that contains the name and configuration information of a late data rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedatarule.html
     */
    export interface LateDataRuleProperty {
        /**
         * The information needed to configure the late data rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedatarule.html#cfn-iotanalytics-dataset-latedatarule-ruleconfiguration
         */
        readonly ruleConfiguration: CfnDataset.LateDataRuleConfigurationProperty | cdk.IResolvable;
        /**
         * The name of the late data rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedatarule.html#cfn-iotanalytics-dataset-latedatarule-rulename
         */
        readonly ruleName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LateDataRuleProperty`
 *
 * @param properties - the TypeScript properties of a `LateDataRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_LateDataRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ruleConfiguration', cdk.requiredValidator)(properties.ruleConfiguration));
    errors.collect(cdk.propertyValidator('ruleConfiguration', CfnDataset_LateDataRuleConfigurationPropertyValidator)(properties.ruleConfiguration));
    errors.collect(cdk.propertyValidator('ruleName', cdk.validateString)(properties.ruleName));
    return errors.wrap('supplied properties not correct for "LateDataRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.LateDataRule` resource
 *
 * @param properties - the TypeScript properties of a `LateDataRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.LateDataRule` resource.
 */
// @ts-ignore TS6133
function cfnDatasetLateDataRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_LateDataRulePropertyValidator(properties).assertSuccess();
    return {
        RuleConfiguration: cfnDatasetLateDataRuleConfigurationPropertyToCloudFormation(properties.ruleConfiguration),
        RuleName: cdk.stringToCloudFormation(properties.ruleName),
    };
}

// @ts-ignore TS6133
function CfnDatasetLateDataRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.LateDataRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.LateDataRuleProperty>();
    ret.addPropertyResult('ruleConfiguration', 'RuleConfiguration', CfnDatasetLateDataRuleConfigurationPropertyFromCloudFormation(properties.RuleConfiguration));
    ret.addPropertyResult('ruleName', 'RuleName', properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * The information needed to configure a delta time session window.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedataruleconfiguration.html
     */
    export interface LateDataRuleConfigurationProperty {
        /**
         * The information needed to configure a delta time session window.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedataruleconfiguration.html#cfn-iotanalytics-dataset-latedataruleconfiguration-deltatimesessionwindowconfiguration
         */
        readonly deltaTimeSessionWindowConfiguration?: CfnDataset.DeltaTimeSessionWindowConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LateDataRuleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LateDataRuleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_LateDataRuleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deltaTimeSessionWindowConfiguration', CfnDataset_DeltaTimeSessionWindowConfigurationPropertyValidator)(properties.deltaTimeSessionWindowConfiguration));
    return errors.wrap('supplied properties not correct for "LateDataRuleConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.LateDataRuleConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LateDataRuleConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.LateDataRuleConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatasetLateDataRuleConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_LateDataRuleConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DeltaTimeSessionWindowConfiguration: cfnDatasetDeltaTimeSessionWindowConfigurationPropertyToCloudFormation(properties.deltaTimeSessionWindowConfiguration),
    };
}

// @ts-ignore TS6133
function CfnDatasetLateDataRuleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.LateDataRuleConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.LateDataRuleConfigurationProperty>();
    ret.addPropertyResult('deltaTimeSessionWindowConfiguration', 'DeltaTimeSessionWindowConfiguration', properties.DeltaTimeSessionWindowConfiguration != null ? CfnDatasetDeltaTimeSessionWindowConfigurationPropertyFromCloudFormation(properties.DeltaTimeSessionWindowConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * The value of the variable as a structure that specifies an output file URI.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-outputfileurivalue.html
     */
    export interface OutputFileUriValueProperty {
        /**
         * The URI of the location where dataset contents are stored, usually the URI of a file in an S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-outputfileurivalue.html#cfn-iotanalytics-dataset-outputfileurivalue-filename
         */
        readonly fileName: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputFileUriValueProperty`
 *
 * @param properties - the TypeScript properties of a `OutputFileUriValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_OutputFileUriValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fileName', cdk.requiredValidator)(properties.fileName));
    errors.collect(cdk.propertyValidator('fileName', cdk.validateString)(properties.fileName));
    return errors.wrap('supplied properties not correct for "OutputFileUriValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.OutputFileUriValue` resource
 *
 * @param properties - the TypeScript properties of a `OutputFileUriValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.OutputFileUriValue` resource.
 */
// @ts-ignore TS6133
function cfnDatasetOutputFileUriValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_OutputFileUriValuePropertyValidator(properties).assertSuccess();
    return {
        FileName: cdk.stringToCloudFormation(properties.fileName),
    };
}

// @ts-ignore TS6133
function CfnDatasetOutputFileUriValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.OutputFileUriValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.OutputFileUriValueProperty>();
    ret.addPropertyResult('fileName', 'FileName', cfn_parse.FromCloudFormation.getString(properties.FileName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * An "SqlQueryDatasetAction" object that uses an SQL query to automatically create data set contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-queryaction.html
     */
    export interface QueryActionProperty {
        /**
         * Pre-filters applied to message data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-queryaction.html#cfn-iotanalytics-dataset-queryaction-filters
         */
        readonly filters?: Array<CfnDataset.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * An "SqlQueryDatasetAction" object that uses an SQL query to automatically create data set contents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-queryaction.html#cfn-iotanalytics-dataset-queryaction-sqlquery
         */
        readonly sqlQuery: string;
    }
}

/**
 * Determine whether the given properties match those of a `QueryActionProperty`
 *
 * @param properties - the TypeScript properties of a `QueryActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_QueryActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filters', cdk.listValidator(CfnDataset_FilterPropertyValidator))(properties.filters));
    errors.collect(cdk.propertyValidator('sqlQuery', cdk.requiredValidator)(properties.sqlQuery));
    errors.collect(cdk.propertyValidator('sqlQuery', cdk.validateString)(properties.sqlQuery));
    return errors.wrap('supplied properties not correct for "QueryActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.QueryAction` resource
 *
 * @param properties - the TypeScript properties of a `QueryActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.QueryAction` resource.
 */
// @ts-ignore TS6133
function cfnDatasetQueryActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_QueryActionPropertyValidator(properties).assertSuccess();
    return {
        Filters: cdk.listMapper(cfnDatasetFilterPropertyToCloudFormation)(properties.filters),
        SqlQuery: cdk.stringToCloudFormation(properties.sqlQuery),
    };
}

// @ts-ignore TS6133
function CfnDatasetQueryActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.QueryActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.QueryActionProperty>();
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetFilterPropertyFromCloudFormation)(properties.Filters) : undefined);
    ret.addPropertyResult('sqlQuery', 'SqlQuery', cfn_parse.FromCloudFormation.getString(properties.SqlQuery));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * The configuration of the resource used to execute the `containerAction` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-resourceconfiguration.html
     */
    export interface ResourceConfigurationProperty {
        /**
         * The type of the compute resource used to execute the `containerAction` . Possible values are: `ACU_1` (vCPU=4, memory=16 GiB) or `ACU_2` (vCPU=8, memory=32 GiB).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-resourceconfiguration.html#cfn-iotanalytics-dataset-resourceconfiguration-computetype
         */
        readonly computeType: string;
        /**
         * The size, in GB, of the persistent storage available to the resource instance used to execute the `containerAction` (min: 1, max: 50).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-resourceconfiguration.html#cfn-iotanalytics-dataset-resourceconfiguration-volumesizeingb
         */
        readonly volumeSizeInGb: number;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_ResourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('computeType', cdk.requiredValidator)(properties.computeType));
    errors.collect(cdk.propertyValidator('computeType', cdk.validateString)(properties.computeType));
    errors.collect(cdk.propertyValidator('volumeSizeInGb', cdk.requiredValidator)(properties.volumeSizeInGb));
    errors.collect(cdk.propertyValidator('volumeSizeInGb', cdk.validateNumber)(properties.volumeSizeInGb));
    return errors.wrap('supplied properties not correct for "ResourceConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.ResourceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ResourceConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.ResourceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatasetResourceConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_ResourceConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ComputeType: cdk.stringToCloudFormation(properties.computeType),
        VolumeSizeInGB: cdk.numberToCloudFormation(properties.volumeSizeInGb),
    };
}

// @ts-ignore TS6133
function CfnDatasetResourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.ResourceConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ResourceConfigurationProperty>();
    ret.addPropertyResult('computeType', 'ComputeType', cfn_parse.FromCloudFormation.getString(properties.ComputeType));
    ret.addPropertyResult('volumeSizeInGb', 'VolumeSizeInGB', cfn_parse.FromCloudFormation.getNumber(properties.VolumeSizeInGB));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * How long, in days, message data is kept.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-retentionperiod.html
     */
    export interface RetentionPeriodProperty {
        /**
         * The number of days that message data is kept. The `unlimited` parameter must be false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-retentionperiod.html#cfn-iotanalytics-dataset-retentionperiod-numberofdays
         */
        readonly numberOfDays?: number;
        /**
         * If true, message data is kept indefinitely.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-retentionperiod.html#cfn-iotanalytics-dataset-retentionperiod-unlimited
         */
        readonly unlimited?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RetentionPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_RetentionPeriodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('numberOfDays', cdk.validateNumber)(properties.numberOfDays));
    errors.collect(cdk.propertyValidator('unlimited', cdk.validateBoolean)(properties.unlimited));
    return errors.wrap('supplied properties not correct for "RetentionPeriodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.RetentionPeriod` resource
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.RetentionPeriod` resource.
 */
// @ts-ignore TS6133
function cfnDatasetRetentionPeriodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_RetentionPeriodPropertyValidator(properties).assertSuccess();
    return {
        NumberOfDays: cdk.numberToCloudFormation(properties.numberOfDays),
        Unlimited: cdk.booleanToCloudFormation(properties.unlimited),
    };
}

// @ts-ignore TS6133
function CfnDatasetRetentionPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.RetentionPeriodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.RetentionPeriodProperty>();
    ret.addPropertyResult('numberOfDays', 'NumberOfDays', properties.NumberOfDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDays) : undefined);
    ret.addPropertyResult('unlimited', 'Unlimited', properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Configuration information for delivery of dataset contents to Amazon Simple Storage Service (Amazon S3).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html
     */
    export interface S3DestinationConfigurationProperty {
        /**
         * The name of the S3 bucket to which dataset contents are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-bucket
         */
        readonly bucket: string;
        /**
         * Configuration information for coordination with AWS Glue , a fully managed extract, transform and load (ETL) service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-glueconfiguration
         */
        readonly glueConfiguration?: CfnDataset.GlueConfigurationProperty | cdk.IResolvable;
        /**
         * The key of the dataset contents object in an S3 bucket. Each object has a key that is a unique identifier. Each object has exactly one key.
         *
         * You can create a unique key with the following options:
         *
         * - Use `!{iotanalytics:scheduleTime}` to insert the time of a scheduled SQL query run.
         * - Use `!{iotanalytics:versionId}` to insert a unique hash that identifies a dataset content.
         * - Use `!{iotanalytics:creationTime}` to insert the creation time of a dataset content.
         *
         * The following example creates a unique key for a CSV file: `dataset/mydataset/!{iotanalytics:scheduleTime}/!{iotanalytics:versionId}.csv`
         *
         * > If you don't use `!{iotanalytics:versionId}` to specify the key, you might get duplicate keys. For example, you might have two dataset contents with the same `scheduleTime` but different `versionId` s. This means that one dataset content overwrites the other.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-key
         */
        readonly key: string;
        /**
         * The ARN of the role that grants AWS IoT Analytics permission to interact with your Amazon S3 and AWS Glue resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_S3DestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('glueConfiguration', CfnDataset_GlueConfigurationPropertyValidator)(properties.glueConfiguration));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "S3DestinationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.S3DestinationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `S3DestinationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.S3DestinationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatasetS3DestinationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_S3DestinationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        GlueConfiguration: cfnDatasetGlueConfigurationPropertyToCloudFormation(properties.glueConfiguration),
        Key: cdk.stringToCloudFormation(properties.key),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnDatasetS3DestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.S3DestinationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.S3DestinationConfigurationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('glueConfiguration', 'GlueConfiguration', properties.GlueConfiguration != null ? CfnDatasetGlueConfigurationPropertyFromCloudFormation(properties.GlueConfiguration) : undefined);
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * The schedule for when to trigger an update.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-schedule.html
     */
    export interface ScheduleProperty {
        /**
         * The expression that defines when to trigger an update. For more information, see [Schedule Expressions for Rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) in the Amazon CloudWatch documentation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-schedule.html#cfn-iotanalytics-dataset-schedule-scheduleexpression
         */
        readonly scheduleExpression: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_SchedulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.requiredValidator)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    return errors.wrap('supplied properties not correct for "ScheduleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Schedule` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Schedule` resource.
 */
// @ts-ignore TS6133
function cfnDatasetSchedulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_SchedulePropertyValidator(properties).assertSuccess();
    return {
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
    };
}

// @ts-ignore TS6133
function CfnDatasetSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.ScheduleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ScheduleProperty>();
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * The "DatasetTrigger" that specifies when the data set is automatically updated.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-trigger.html
     */
    export interface TriggerProperty {
        /**
         * The "Schedule" when the trigger is initiated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-trigger.html#cfn-iotanalytics-dataset-trigger-schedule
         */
        readonly schedule?: CfnDataset.ScheduleProperty | cdk.IResolvable;
        /**
         * Information about the data set whose content generation triggers the new data set content generation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-trigger.html#cfn-iotanalytics-dataset-trigger-triggeringdataset
         */
        readonly triggeringDataset?: CfnDataset.TriggeringDatasetProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TriggerProperty`
 *
 * @param properties - the TypeScript properties of a `TriggerProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_TriggerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('schedule', CfnDataset_SchedulePropertyValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('triggeringDataset', CfnDataset_TriggeringDatasetPropertyValidator)(properties.triggeringDataset));
    return errors.wrap('supplied properties not correct for "TriggerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Trigger` resource
 *
 * @param properties - the TypeScript properties of a `TriggerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Trigger` resource.
 */
// @ts-ignore TS6133
function cfnDatasetTriggerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_TriggerPropertyValidator(properties).assertSuccess();
    return {
        Schedule: cfnDatasetSchedulePropertyToCloudFormation(properties.schedule),
        TriggeringDataset: cfnDatasetTriggeringDatasetPropertyToCloudFormation(properties.triggeringDataset),
    };
}

// @ts-ignore TS6133
function CfnDatasetTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.TriggerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.TriggerProperty>();
    ret.addPropertyResult('schedule', 'Schedule', properties.Schedule != null ? CfnDatasetSchedulePropertyFromCloudFormation(properties.Schedule) : undefined);
    ret.addPropertyResult('triggeringDataset', 'TriggeringDataset', properties.TriggeringDataset != null ? CfnDatasetTriggeringDatasetPropertyFromCloudFormation(properties.TriggeringDataset) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Information about the dataset whose content generation triggers the new dataset content generation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-triggeringdataset.html
     */
    export interface TriggeringDatasetProperty {
        /**
         * The name of the data set whose content generation triggers the new data set content generation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-triggeringdataset.html#cfn-iotanalytics-dataset-triggeringdataset-datasetname
         */
        readonly datasetName: string;
    }
}

/**
 * Determine whether the given properties match those of a `TriggeringDatasetProperty`
 *
 * @param properties - the TypeScript properties of a `TriggeringDatasetProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_TriggeringDatasetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datasetName', cdk.requiredValidator)(properties.datasetName));
    errors.collect(cdk.propertyValidator('datasetName', cdk.validateString)(properties.datasetName));
    return errors.wrap('supplied properties not correct for "TriggeringDatasetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.TriggeringDataset` resource
 *
 * @param properties - the TypeScript properties of a `TriggeringDatasetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.TriggeringDataset` resource.
 */
// @ts-ignore TS6133
function cfnDatasetTriggeringDatasetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_TriggeringDatasetPropertyValidator(properties).assertSuccess();
    return {
        DatasetName: cdk.stringToCloudFormation(properties.datasetName),
    };
}

// @ts-ignore TS6133
function CfnDatasetTriggeringDatasetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.TriggeringDatasetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.TriggeringDatasetProperty>();
    ret.addPropertyResult('datasetName', 'DatasetName', cfn_parse.FromCloudFormation.getString(properties.DatasetName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * An instance of a variable to be passed to the `containerAction` execution. Each variable must have a name and a value given by one of `stringValue` , `datasetContentVersionValue` , or `outputFileUriValue` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html
     */
    export interface VariableProperty {
        /**
         * The value of the variable as a structure that specifies a dataset content version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-datasetcontentversionvalue
         */
        readonly datasetContentVersionValue?: CfnDataset.DatasetContentVersionValueProperty | cdk.IResolvable;
        /**
         * The value of the variable as a double (numeric).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-doublevalue
         */
        readonly doubleValue?: number;
        /**
         * The value of the variable as a structure that specifies an output file URI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-outputfileurivalue
         */
        readonly outputFileUriValue?: CfnDataset.OutputFileUriValueProperty | cdk.IResolvable;
        /**
         * The value of the variable as a string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-stringvalue
         */
        readonly stringValue?: string;
        /**
         * The name of the variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-variablename
         */
        readonly variableName: string;
    }
}

/**
 * Determine whether the given properties match those of a `VariableProperty`
 *
 * @param properties - the TypeScript properties of a `VariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_VariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datasetContentVersionValue', CfnDataset_DatasetContentVersionValuePropertyValidator)(properties.datasetContentVersionValue));
    errors.collect(cdk.propertyValidator('doubleValue', cdk.validateNumber)(properties.doubleValue));
    errors.collect(cdk.propertyValidator('outputFileUriValue', CfnDataset_OutputFileUriValuePropertyValidator)(properties.outputFileUriValue));
    errors.collect(cdk.propertyValidator('stringValue', cdk.validateString)(properties.stringValue));
    errors.collect(cdk.propertyValidator('variableName', cdk.requiredValidator)(properties.variableName));
    errors.collect(cdk.propertyValidator('variableName', cdk.validateString)(properties.variableName));
    return errors.wrap('supplied properties not correct for "VariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Variable` resource
 *
 * @param properties - the TypeScript properties of a `VariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.Variable` resource.
 */
// @ts-ignore TS6133
function cfnDatasetVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_VariablePropertyValidator(properties).assertSuccess();
    return {
        DatasetContentVersionValue: cfnDatasetDatasetContentVersionValuePropertyToCloudFormation(properties.datasetContentVersionValue),
        DoubleValue: cdk.numberToCloudFormation(properties.doubleValue),
        OutputFileUriValue: cfnDatasetOutputFileUriValuePropertyToCloudFormation(properties.outputFileUriValue),
        StringValue: cdk.stringToCloudFormation(properties.stringValue),
        VariableName: cdk.stringToCloudFormation(properties.variableName),
    };
}

// @ts-ignore TS6133
function CfnDatasetVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.VariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.VariableProperty>();
    ret.addPropertyResult('datasetContentVersionValue', 'DatasetContentVersionValue', properties.DatasetContentVersionValue != null ? CfnDatasetDatasetContentVersionValuePropertyFromCloudFormation(properties.DatasetContentVersionValue) : undefined);
    ret.addPropertyResult('doubleValue', 'DoubleValue', properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined);
    ret.addPropertyResult('outputFileUriValue', 'OutputFileUriValue', properties.OutputFileUriValue != null ? CfnDatasetOutputFileUriValuePropertyFromCloudFormation(properties.OutputFileUriValue) : undefined);
    ret.addPropertyResult('stringValue', 'StringValue', properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined);
    ret.addPropertyResult('variableName', 'VariableName', cfn_parse.FromCloudFormation.getString(properties.VariableName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Information about the versioning of dataset contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-versioningconfiguration.html
     */
    export interface VersioningConfigurationProperty {
        /**
         * How many versions of dataset contents are kept. The `unlimited` parameter must be `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-versioningconfiguration.html#cfn-iotanalytics-dataset-versioningconfiguration-maxversions
         */
        readonly maxVersions?: number;
        /**
         * If true, unlimited versions of dataset contents are kept.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-versioningconfiguration.html#cfn-iotanalytics-dataset-versioningconfiguration-unlimited
         */
        readonly unlimited?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VersioningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VersioningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_VersioningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxVersions', cdk.validateNumber)(properties.maxVersions));
    errors.collect(cdk.propertyValidator('unlimited', cdk.validateBoolean)(properties.unlimited));
    return errors.wrap('supplied properties not correct for "VersioningConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.VersioningConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VersioningConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Dataset.VersioningConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatasetVersioningConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_VersioningConfigurationPropertyValidator(properties).assertSuccess();
    return {
        MaxVersions: cdk.numberToCloudFormation(properties.maxVersions),
        Unlimited: cdk.booleanToCloudFormation(properties.unlimited),
    };
}

// @ts-ignore TS6133
function CfnDatasetVersioningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.VersioningConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.VersioningConfigurationProperty>();
    ret.addPropertyResult('maxVersions', 'MaxVersions', properties.MaxVersions != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxVersions) : undefined);
    ret.addPropertyResult('unlimited', 'Unlimited', properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDatastore`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html
 */
export interface CfnDatastoreProps {

    /**
     * The name of the data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorename
     */
    readonly datastoreName?: string;

    /**
     * Information about the partition dimensions in a data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorepartitions
     */
    readonly datastorePartitions?: CfnDatastore.DatastorePartitionsProperty | cdk.IResolvable;

    /**
     * Where data store data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorestorage
     */
    readonly datastoreStorage?: CfnDatastore.DatastoreStorageProperty | cdk.IResolvable;

    /**
     * Contains the configuration information of file formats. AWS IoT Analytics data stores support JSON and [Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/) .
     *
     * The default file format is JSON. You can specify only one format.
     *
     * You can't change the file format after you create the data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-fileformatconfiguration
     */
    readonly fileFormatConfiguration?: CfnDatastore.FileFormatConfigurationProperty | cdk.IResolvable;

    /**
     * How long, in days, message data is kept for the data store. When `customerManagedS3` storage is selected, this parameter is ignored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-retentionperiod
     */
    readonly retentionPeriod?: CfnDatastore.RetentionPeriodProperty | cdk.IResolvable;

    /**
     * Metadata which can be used to manage the data store.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDatastoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatastoreProps`
 *
 * @returns the result of the validation.
 */
function CfnDatastorePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datastoreName', cdk.validateString)(properties.datastoreName));
    errors.collect(cdk.propertyValidator('datastorePartitions', CfnDatastore_DatastorePartitionsPropertyValidator)(properties.datastorePartitions));
    errors.collect(cdk.propertyValidator('datastoreStorage', CfnDatastore_DatastoreStoragePropertyValidator)(properties.datastoreStorage));
    errors.collect(cdk.propertyValidator('fileFormatConfiguration', CfnDatastore_FileFormatConfigurationPropertyValidator)(properties.fileFormatConfiguration));
    errors.collect(cdk.propertyValidator('retentionPeriod', CfnDatastore_RetentionPeriodPropertyValidator)(properties.retentionPeriod));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDatastoreProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatastoreProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore` resource.
 */
// @ts-ignore TS6133
function cfnDatastorePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastorePropsValidator(properties).assertSuccess();
    return {
        DatastoreName: cdk.stringToCloudFormation(properties.datastoreName),
        DatastorePartitions: cfnDatastoreDatastorePartitionsPropertyToCloudFormation(properties.datastorePartitions),
        DatastoreStorage: cfnDatastoreDatastoreStoragePropertyToCloudFormation(properties.datastoreStorage),
        FileFormatConfiguration: cfnDatastoreFileFormatConfigurationPropertyToCloudFormation(properties.fileFormatConfiguration),
        RetentionPeriod: cfnDatastoreRetentionPeriodPropertyToCloudFormation(properties.retentionPeriod),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDatastorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastoreProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastoreProps>();
    ret.addPropertyResult('datastoreName', 'DatastoreName', properties.DatastoreName != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreName) : undefined);
    ret.addPropertyResult('datastorePartitions', 'DatastorePartitions', properties.DatastorePartitions != null ? CfnDatastoreDatastorePartitionsPropertyFromCloudFormation(properties.DatastorePartitions) : undefined);
    ret.addPropertyResult('datastoreStorage', 'DatastoreStorage', properties.DatastoreStorage != null ? CfnDatastoreDatastoreStoragePropertyFromCloudFormation(properties.DatastoreStorage) : undefined);
    ret.addPropertyResult('fileFormatConfiguration', 'FileFormatConfiguration', properties.FileFormatConfiguration != null ? CfnDatastoreFileFormatConfigurationPropertyFromCloudFormation(properties.FileFormatConfiguration) : undefined);
    ret.addPropertyResult('retentionPeriod', 'RetentionPeriod', properties.RetentionPeriod != null ? CfnDatastoreRetentionPeriodPropertyFromCloudFormation(properties.RetentionPeriod) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTAnalytics::Datastore`
 *
 * AWS::IoTAnalytics::Datastore resource is a repository for messages. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Datastore
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html
 */
export class CfnDatastore extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Datastore";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatastore {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatastorePropsFromCloudFormation(resourceProperties);
        const ret = new CfnDatastore(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name of the data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorename
     */
    public datastoreName: string | undefined;

    /**
     * Information about the partition dimensions in a data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorepartitions
     */
    public datastorePartitions: CfnDatastore.DatastorePartitionsProperty | cdk.IResolvable | undefined;

    /**
     * Where data store data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorestorage
     */
    public datastoreStorage: CfnDatastore.DatastoreStorageProperty | cdk.IResolvable | undefined;

    /**
     * Contains the configuration information of file formats. AWS IoT Analytics data stores support JSON and [Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/) .
     *
     * The default file format is JSON. You can specify only one format.
     *
     * You can't change the file format after you create the data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-fileformatconfiguration
     */
    public fileFormatConfiguration: CfnDatastore.FileFormatConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * How long, in days, message data is kept for the data store. When `customerManagedS3` storage is selected, this parameter is ignored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-retentionperiod
     */
    public retentionPeriod: CfnDatastore.RetentionPeriodProperty | cdk.IResolvable | undefined;

    /**
     * Metadata which can be used to manage the data store.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTAnalytics::Datastore`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatastoreProps = {}) {
        super(scope, id, { type: CfnDatastore.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.datastoreName = props.datastoreName;
        this.datastorePartitions = props.datastorePartitions;
        this.datastoreStorage = props.datastoreStorage;
        this.fileFormatConfiguration = props.fileFormatConfiguration;
        this.retentionPeriod = props.retentionPeriod;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Datastore", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatastore.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            datastoreName: this.datastoreName,
            datastorePartitions: this.datastorePartitions,
            datastoreStorage: this.datastoreStorage,
            fileFormatConfiguration: this.fileFormatConfiguration,
            retentionPeriod: this.retentionPeriod,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatastorePropsToCloudFormation(props);
    }
}

export namespace CfnDatastore {
    /**
     * Contains information about a column that stores your data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-column.html
     */
    export interface ColumnProperty {
        /**
         * The name of the column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-column.html#cfn-iotanalytics-datastore-column-name
         */
        readonly name: string;
        /**
         * The type of data. For more information about the supported data types, see [Common data types](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-common.html) in the *AWS Glue Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-column.html#cfn-iotanalytics-datastore-column-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_ColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.Column` resource
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.Column` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_ColumnPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDatastoreColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.ColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.ColumnProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * S3-customer-managed; When you choose customer-managed storage, the `retentionPeriod` parameter is ignored. You can't change the choice of Amazon S3 storage after your data store is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html
     */
    export interface CustomerManagedS3Property {
        /**
         * The name of the Amazon S3 bucket where your data is stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html#cfn-iotanalytics-datastore-customermanageds3-bucket
         */
        readonly bucket: string;
        /**
         * (Optional) The prefix used to create the keys of the data store data objects. Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html#cfn-iotanalytics-datastore-customermanageds3-keyprefix
         */
        readonly keyPrefix?: string;
        /**
         * The ARN of the role that grants AWS IoT Analytics permission to interact with your Amazon S3 resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html#cfn-iotanalytics-datastore-customermanageds3-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomerManagedS3Property`
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3Property`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_CustomerManagedS3PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('keyPrefix', cdk.validateString)(properties.keyPrefix));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CustomerManagedS3Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.CustomerManagedS3` resource
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.CustomerManagedS3` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreCustomerManagedS3PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_CustomerManagedS3PropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        KeyPrefix: cdk.stringToCloudFormation(properties.keyPrefix),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnDatastoreCustomerManagedS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.CustomerManagedS3Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.CustomerManagedS3Property>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('keyPrefix', 'KeyPrefix', properties.KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefix) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * Amazon S3 -customer-managed; When you choose customer-managed storage, the `retentionPeriod` parameter is ignored. You can't change the choice of Amazon S3 storage after your data store is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3storage.html
     */
    export interface CustomerManagedS3StorageProperty {
        /**
         * The name of the Amazon S3 bucket where your data is stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3storage.html#cfn-iotanalytics-datastore-customermanageds3storage-bucket
         */
        readonly bucket: string;
        /**
         * (Optional) The prefix used to create the keys of the data store data objects. Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3storage.html#cfn-iotanalytics-datastore-customermanageds3storage-keyprefix
         */
        readonly keyPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomerManagedS3StorageProperty`
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3StorageProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_CustomerManagedS3StoragePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('keyPrefix', cdk.validateString)(properties.keyPrefix));
    return errors.wrap('supplied properties not correct for "CustomerManagedS3StorageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.CustomerManagedS3Storage` resource
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3StorageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.CustomerManagedS3Storage` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreCustomerManagedS3StoragePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_CustomerManagedS3StoragePropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        KeyPrefix: cdk.stringToCloudFormation(properties.keyPrefix),
    };
}

// @ts-ignore TS6133
function CfnDatastoreCustomerManagedS3StoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.CustomerManagedS3StorageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.CustomerManagedS3StorageProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('keyPrefix', 'KeyPrefix', properties.KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * A single dimension to partition a data store. The dimension must be an `AttributePartition` or a `TimestampPartition` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartition.html
     */
    export interface DatastorePartitionProperty {
        /**
         * A partition dimension defined by an attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartition.html#cfn-iotanalytics-datastore-datastorepartition-partition
         */
        readonly partition?: CfnDatastore.PartitionProperty | cdk.IResolvable;
        /**
         * A partition dimension defined by a timestamp attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartition.html#cfn-iotanalytics-datastore-datastorepartition-timestamppartition
         */
        readonly timestampPartition?: CfnDatastore.TimestampPartitionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DatastorePartitionProperty`
 *
 * @param properties - the TypeScript properties of a `DatastorePartitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_DatastorePartitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('partition', CfnDatastore_PartitionPropertyValidator)(properties.partition));
    errors.collect(cdk.propertyValidator('timestampPartition', CfnDatastore_TimestampPartitionPropertyValidator)(properties.timestampPartition));
    return errors.wrap('supplied properties not correct for "DatastorePartitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.DatastorePartition` resource
 *
 * @param properties - the TypeScript properties of a `DatastorePartitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.DatastorePartition` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreDatastorePartitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_DatastorePartitionPropertyValidator(properties).assertSuccess();
    return {
        Partition: cfnDatastorePartitionPropertyToCloudFormation(properties.partition),
        TimestampPartition: cfnDatastoreTimestampPartitionPropertyToCloudFormation(properties.timestampPartition),
    };
}

// @ts-ignore TS6133
function CfnDatastoreDatastorePartitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.DatastorePartitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.DatastorePartitionProperty>();
    ret.addPropertyResult('partition', 'Partition', properties.Partition != null ? CfnDatastorePartitionPropertyFromCloudFormation(properties.Partition) : undefined);
    ret.addPropertyResult('timestampPartition', 'TimestampPartition', properties.TimestampPartition != null ? CfnDatastoreTimestampPartitionPropertyFromCloudFormation(properties.TimestampPartition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * Information about the partition dimensions in a data store.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartitions.html
     */
    export interface DatastorePartitionsProperty {
        /**
         * A list of partition dimensions in a data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartitions.html#cfn-iotanalytics-datastore-datastorepartitions-partitions
         */
        readonly partitions?: Array<CfnDatastore.DatastorePartitionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DatastorePartitionsProperty`
 *
 * @param properties - the TypeScript properties of a `DatastorePartitionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_DatastorePartitionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('partitions', cdk.listValidator(CfnDatastore_DatastorePartitionPropertyValidator))(properties.partitions));
    return errors.wrap('supplied properties not correct for "DatastorePartitionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.DatastorePartitions` resource
 *
 * @param properties - the TypeScript properties of a `DatastorePartitionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.DatastorePartitions` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreDatastorePartitionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_DatastorePartitionsPropertyValidator(properties).assertSuccess();
    return {
        Partitions: cdk.listMapper(cfnDatastoreDatastorePartitionPropertyToCloudFormation)(properties.partitions),
    };
}

// @ts-ignore TS6133
function CfnDatastoreDatastorePartitionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.DatastorePartitionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.DatastorePartitionsProperty>();
    ret.addPropertyResult('partitions', 'Partitions', properties.Partitions != null ? cfn_parse.FromCloudFormation.getArray(CfnDatastoreDatastorePartitionPropertyFromCloudFormation)(properties.Partitions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * Where data store data is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html
     */
    export interface DatastoreStorageProperty {
        /**
         * Use this to store data store data in an S3 bucket that you manage. The choice of service-managed or customer-managed S3 storage cannot be changed after creation of the data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html#cfn-iotanalytics-datastore-datastorestorage-customermanageds3
         */
        readonly customerManagedS3?: CfnDatastore.CustomerManagedS3Property | cdk.IResolvable;
        /**
         * Use this to store data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage. You can't change the choice of Amazon S3 storage after your data store is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html#cfn-iotanalytics-datastore-datastorestorage-iotsitewisemultilayerstorage
         */
        readonly iotSiteWiseMultiLayerStorage?: CfnDatastore.IotSiteWiseMultiLayerStorageProperty | cdk.IResolvable;
        /**
         * Use this to store data store data in an S3 bucket managed by the AWS IoT Analytics service. The choice of service-managed or customer-managed S3 storage cannot be changed after creation of the data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html#cfn-iotanalytics-datastore-datastorestorage-servicemanageds3
         */
        readonly serviceManagedS3?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DatastoreStorageProperty`
 *
 * @param properties - the TypeScript properties of a `DatastoreStorageProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_DatastoreStoragePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customerManagedS3', CfnDatastore_CustomerManagedS3PropertyValidator)(properties.customerManagedS3));
    errors.collect(cdk.propertyValidator('iotSiteWiseMultiLayerStorage', CfnDatastore_IotSiteWiseMultiLayerStoragePropertyValidator)(properties.iotSiteWiseMultiLayerStorage));
    errors.collect(cdk.propertyValidator('serviceManagedS3', cdk.validateObject)(properties.serviceManagedS3));
    return errors.wrap('supplied properties not correct for "DatastoreStorageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.DatastoreStorage` resource
 *
 * @param properties - the TypeScript properties of a `DatastoreStorageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.DatastoreStorage` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreDatastoreStoragePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_DatastoreStoragePropertyValidator(properties).assertSuccess();
    return {
        CustomerManagedS3: cfnDatastoreCustomerManagedS3PropertyToCloudFormation(properties.customerManagedS3),
        IotSiteWiseMultiLayerStorage: cfnDatastoreIotSiteWiseMultiLayerStoragePropertyToCloudFormation(properties.iotSiteWiseMultiLayerStorage),
        ServiceManagedS3: cdk.objectToCloudFormation(properties.serviceManagedS3),
    };
}

// @ts-ignore TS6133
function CfnDatastoreDatastoreStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.DatastoreStorageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.DatastoreStorageProperty>();
    ret.addPropertyResult('customerManagedS3', 'CustomerManagedS3', properties.CustomerManagedS3 != null ? CfnDatastoreCustomerManagedS3PropertyFromCloudFormation(properties.CustomerManagedS3) : undefined);
    ret.addPropertyResult('iotSiteWiseMultiLayerStorage', 'IotSiteWiseMultiLayerStorage', properties.IotSiteWiseMultiLayerStorage != null ? CfnDatastoreIotSiteWiseMultiLayerStoragePropertyFromCloudFormation(properties.IotSiteWiseMultiLayerStorage) : undefined);
    ret.addPropertyResult('serviceManagedS3', 'ServiceManagedS3', properties.ServiceManagedS3 != null ? cfn_parse.FromCloudFormation.getAny(properties.ServiceManagedS3) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * Contains the configuration information of file formats. AWS IoT Analytics data stores support JSON and [Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/) .
     *
     * The default file format is JSON. You can specify only one format.
     *
     * You can't change the file format after you create the data store.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-fileformatconfiguration.html
     */
    export interface FileFormatConfigurationProperty {
        /**
         * Contains the configuration information of the JSON format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-fileformatconfiguration.html#cfn-iotanalytics-datastore-fileformatconfiguration-jsonconfiguration
         */
        readonly jsonConfiguration?: any | cdk.IResolvable;
        /**
         * Contains the configuration information of the Parquet format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-fileformatconfiguration.html#cfn-iotanalytics-datastore-fileformatconfiguration-parquetconfiguration
         */
        readonly parquetConfiguration?: CfnDatastore.ParquetConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FileFormatConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FileFormatConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_FileFormatConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('jsonConfiguration', cdk.validateObject)(properties.jsonConfiguration));
    errors.collect(cdk.propertyValidator('parquetConfiguration', CfnDatastore_ParquetConfigurationPropertyValidator)(properties.parquetConfiguration));
    return errors.wrap('supplied properties not correct for "FileFormatConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.FileFormatConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `FileFormatConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.FileFormatConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreFileFormatConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_FileFormatConfigurationPropertyValidator(properties).assertSuccess();
    return {
        JsonConfiguration: cdk.objectToCloudFormation(properties.jsonConfiguration),
        ParquetConfiguration: cfnDatastoreParquetConfigurationPropertyToCloudFormation(properties.parquetConfiguration),
    };
}

// @ts-ignore TS6133
function CfnDatastoreFileFormatConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.FileFormatConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.FileFormatConfigurationProperty>();
    ret.addPropertyResult('jsonConfiguration', 'JsonConfiguration', properties.JsonConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.JsonConfiguration) : undefined);
    ret.addPropertyResult('parquetConfiguration', 'ParquetConfiguration', properties.ParquetConfiguration != null ? CfnDatastoreParquetConfigurationPropertyFromCloudFormation(properties.ParquetConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * Stores data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage. You can't change the choice of Amazon S3 storage after your data store is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-iotsitewisemultilayerstorage.html
     */
    export interface IotSiteWiseMultiLayerStorageProperty {
        /**
         * Stores data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-iotsitewisemultilayerstorage.html#cfn-iotanalytics-datastore-iotsitewisemultilayerstorage-customermanageds3storage
         */
        readonly customerManagedS3Storage?: CfnDatastore.CustomerManagedS3StorageProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IotSiteWiseMultiLayerStorageProperty`
 *
 * @param properties - the TypeScript properties of a `IotSiteWiseMultiLayerStorageProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_IotSiteWiseMultiLayerStoragePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customerManagedS3Storage', CfnDatastore_CustomerManagedS3StoragePropertyValidator)(properties.customerManagedS3Storage));
    return errors.wrap('supplied properties not correct for "IotSiteWiseMultiLayerStorageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.IotSiteWiseMultiLayerStorage` resource
 *
 * @param properties - the TypeScript properties of a `IotSiteWiseMultiLayerStorageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.IotSiteWiseMultiLayerStorage` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreIotSiteWiseMultiLayerStoragePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_IotSiteWiseMultiLayerStoragePropertyValidator(properties).assertSuccess();
    return {
        CustomerManagedS3Storage: cfnDatastoreCustomerManagedS3StoragePropertyToCloudFormation(properties.customerManagedS3Storage),
    };
}

// @ts-ignore TS6133
function CfnDatastoreIotSiteWiseMultiLayerStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.IotSiteWiseMultiLayerStorageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.IotSiteWiseMultiLayerStorageProperty>();
    ret.addPropertyResult('customerManagedS3Storage', 'CustomerManagedS3Storage', properties.CustomerManagedS3Storage != null ? CfnDatastoreCustomerManagedS3StoragePropertyFromCloudFormation(properties.CustomerManagedS3Storage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * Contains the configuration information of the Parquet format.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-parquetconfiguration.html
     */
    export interface ParquetConfigurationProperty {
        /**
         * Information needed to define a schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-parquetconfiguration.html#cfn-iotanalytics-datastore-parquetconfiguration-schemadefinition
         */
        readonly schemaDefinition?: CfnDatastore.SchemaDefinitionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ParquetConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ParquetConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_ParquetConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('schemaDefinition', CfnDatastore_SchemaDefinitionPropertyValidator)(properties.schemaDefinition));
    return errors.wrap('supplied properties not correct for "ParquetConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.ParquetConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ParquetConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.ParquetConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreParquetConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_ParquetConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SchemaDefinition: cfnDatastoreSchemaDefinitionPropertyToCloudFormation(properties.schemaDefinition),
    };
}

// @ts-ignore TS6133
function CfnDatastoreParquetConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.ParquetConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.ParquetConfigurationProperty>();
    ret.addPropertyResult('schemaDefinition', 'SchemaDefinition', properties.SchemaDefinition != null ? CfnDatastoreSchemaDefinitionPropertyFromCloudFormation(properties.SchemaDefinition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * A single dimension to partition a data store. The dimension must be an `AttributePartition` or a `TimestampPartition` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-partition.html
     */
    export interface PartitionProperty {
        /**
         * The name of the attribute that defines a partition dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-partition.html#cfn-iotanalytics-datastore-partition-attributename
         */
        readonly attributeName: string;
    }
}

/**
 * Determine whether the given properties match those of a `PartitionProperty`
 *
 * @param properties - the TypeScript properties of a `PartitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_PartitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.requiredValidator)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    return errors.wrap('supplied properties not correct for "PartitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.Partition` resource
 *
 * @param properties - the TypeScript properties of a `PartitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.Partition` resource.
 */
// @ts-ignore TS6133
function cfnDatastorePartitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_PartitionPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
    };
}

// @ts-ignore TS6133
function CfnDatastorePartitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.PartitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.PartitionProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', cfn_parse.FromCloudFormation.getString(properties.AttributeName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * How long, in days, message data is kept.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-retentionperiod.html
     */
    export interface RetentionPeriodProperty {
        /**
         * The number of days that message data is kept. The `unlimited` parameter must be false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-retentionperiod.html#cfn-iotanalytics-datastore-retentionperiod-numberofdays
         */
        readonly numberOfDays?: number;
        /**
         * If true, message data is kept indefinitely.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-retentionperiod.html#cfn-iotanalytics-datastore-retentionperiod-unlimited
         */
        readonly unlimited?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RetentionPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_RetentionPeriodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('numberOfDays', cdk.validateNumber)(properties.numberOfDays));
    errors.collect(cdk.propertyValidator('unlimited', cdk.validateBoolean)(properties.unlimited));
    return errors.wrap('supplied properties not correct for "RetentionPeriodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.RetentionPeriod` resource
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.RetentionPeriod` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreRetentionPeriodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_RetentionPeriodPropertyValidator(properties).assertSuccess();
    return {
        NumberOfDays: cdk.numberToCloudFormation(properties.numberOfDays),
        Unlimited: cdk.booleanToCloudFormation(properties.unlimited),
    };
}

// @ts-ignore TS6133
function CfnDatastoreRetentionPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.RetentionPeriodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.RetentionPeriodProperty>();
    ret.addPropertyResult('numberOfDays', 'NumberOfDays', properties.NumberOfDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDays) : undefined);
    ret.addPropertyResult('unlimited', 'Unlimited', properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * Information needed to define a schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-schemadefinition.html
     */
    export interface SchemaDefinitionProperty {
        /**
         * Specifies one or more columns that store your data.
         *
         * Each schema can have up to 100 columns. Each column can have up to 100 nested types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-schemadefinition.html#cfn-iotanalytics-datastore-schemadefinition-columns
         */
        readonly columns?: Array<CfnDatastore.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SchemaDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_SchemaDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columns', cdk.listValidator(CfnDatastore_ColumnPropertyValidator))(properties.columns));
    return errors.wrap('supplied properties not correct for "SchemaDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.SchemaDefinition` resource
 *
 * @param properties - the TypeScript properties of a `SchemaDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.SchemaDefinition` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreSchemaDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_SchemaDefinitionPropertyValidator(properties).assertSuccess();
    return {
        Columns: cdk.listMapper(cfnDatastoreColumnPropertyToCloudFormation)(properties.columns),
    };
}

// @ts-ignore TS6133
function CfnDatastoreSchemaDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.SchemaDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.SchemaDefinitionProperty>();
    ret.addPropertyResult('columns', 'Columns', properties.Columns != null ? cfn_parse.FromCloudFormation.getArray(CfnDatastoreColumnPropertyFromCloudFormation)(properties.Columns) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDatastore {
    /**
     * A partition dimension defined by a timestamp attribute.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-timestamppartition.html
     */
    export interface TimestampPartitionProperty {
        /**
         * The attribute name of the partition defined by a timestamp.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-timestamppartition.html#cfn-iotanalytics-datastore-timestamppartition-attributename
         */
        readonly attributeName: string;
        /**
         * The timestamp format of a partition defined by a timestamp. The default format is seconds since epoch (January 1, 1970 at midnight UTC time).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-timestamppartition.html#cfn-iotanalytics-datastore-timestamppartition-timestampformat
         */
        readonly timestampFormat?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TimestampPartitionProperty`
 *
 * @param properties - the TypeScript properties of a `TimestampPartitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatastore_TimestampPartitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.requiredValidator)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('timestampFormat', cdk.validateString)(properties.timestampFormat));
    return errors.wrap('supplied properties not correct for "TimestampPartitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.TimestampPartition` resource
 *
 * @param properties - the TypeScript properties of a `TimestampPartitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Datastore.TimestampPartition` resource.
 */
// @ts-ignore TS6133
function cfnDatastoreTimestampPartitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatastore_TimestampPartitionPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        TimestampFormat: cdk.stringToCloudFormation(properties.timestampFormat),
    };
}

// @ts-ignore TS6133
function CfnDatastoreTimestampPartitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.TimestampPartitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.TimestampPartitionProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', cfn_parse.FromCloudFormation.getString(properties.AttributeName));
    ret.addPropertyResult('timestampFormat', 'TimestampFormat', properties.TimestampFormat != null ? cfn_parse.FromCloudFormation.getString(properties.TimestampFormat) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPipeline`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html
 */
export interface CfnPipelineProps {

    /**
     * A list of "PipelineActivity" objects. Activities perform transformations on your messages, such as removing, renaming or adding message attributes; filtering messages based on attribute values; invoking your Lambda functions on messages for advanced processing; or performing mathematical transformations to normalize device data.
     *
     * The list can be 2-25 *PipelineActivity* objects and must contain both a `channel` and a `datastore` activity. Each entry in the list must contain only one activity, for example:
     *
     * `pipelineActivities = [ { "channel": { ... } }, { "lambda": { ... } }, ... ]`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelineactivities
     */
    readonly pipelineActivities: Array<CfnPipeline.ActivityProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelinename
     */
    readonly pipelineName?: string;

    /**
     * Metadata which can be used to manage the pipeline.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the result of the validation.
 */
function CfnPipelinePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pipelineActivities', cdk.requiredValidator)(properties.pipelineActivities));
    errors.collect(cdk.propertyValidator('pipelineActivities', cdk.listValidator(CfnPipeline_ActivityPropertyValidator))(properties.pipelineActivities));
    errors.collect(cdk.propertyValidator('pipelineName', cdk.validateString)(properties.pipelineName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPipelineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline` resource
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline` resource.
 */
// @ts-ignore TS6133
function cfnPipelinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipelinePropsValidator(properties).assertSuccess();
    return {
        PipelineActivities: cdk.listMapper(cfnPipelineActivityPropertyToCloudFormation)(properties.pipelineActivities),
        PipelineName: cdk.stringToCloudFormation(properties.pipelineName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipelineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipelineProps>();
    ret.addPropertyResult('pipelineActivities', 'PipelineActivities', cfn_parse.FromCloudFormation.getArray(CfnPipelineActivityPropertyFromCloudFormation)(properties.PipelineActivities));
    ret.addPropertyResult('pipelineName', 'PipelineName', properties.PipelineName != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTAnalytics::Pipeline`
 *
 * The AWS::IoTAnalytics::Pipeline resource consumes messages from one or more channels and allows you to process the messages before storing them in a data store. You must specify both a `channel` and a `datastore` activity and, optionally, as many as 23 additional activities in the `pipelineActivities` array. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Pipeline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html
 */
export class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Pipeline";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPipelinePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPipeline(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * A list of "PipelineActivity" objects. Activities perform transformations on your messages, such as removing, renaming or adding message attributes; filtering messages based on attribute values; invoking your Lambda functions on messages for advanced processing; or performing mathematical transformations to normalize device data.
     *
     * The list can be 2-25 *PipelineActivity* objects and must contain both a `channel` and a `datastore` activity. Each entry in the list must contain only one activity, for example:
     *
     * `pipelineActivities = [ { "channel": { ... } }, { "lambda": { ... } }, ... ]`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelineactivities
     */
    public pipelineActivities: Array<CfnPipeline.ActivityProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelinename
     */
    public pipelineName: string | undefined;

    /**
     * Metadata which can be used to manage the pipeline.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTAnalytics::Pipeline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps) {
        super(scope, id, { type: CfnPipeline.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'pipelineActivities', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.pipelineActivities = props.pipelineActivities;
        this.pipelineName = props.pipelineName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Pipeline", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipeline.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            pipelineActivities: this.pipelineActivities,
            pipelineName: this.pipelineName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPipelinePropsToCloudFormation(props);
    }
}

export namespace CfnPipeline {
    /**
     * An activity that performs a transformation on a message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html
     */
    export interface ActivityProperty {
        /**
         * Adds other attributes based on existing attributes in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-addattributes
         */
        readonly addAttributes?: CfnPipeline.AddAttributesProperty | cdk.IResolvable;
        /**
         * Determines the source of the messages to be processed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-channel
         */
        readonly channel?: CfnPipeline.ChannelProperty | cdk.IResolvable;
        /**
         * Specifies where to store the processed message data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-datastore
         */
        readonly datastore?: CfnPipeline.DatastoreProperty | cdk.IResolvable;
        /**
         * Adds data from the AWS IoT device registry to your message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-deviceregistryenrich
         */
        readonly deviceRegistryEnrich?: CfnPipeline.DeviceRegistryEnrichProperty | cdk.IResolvable;
        /**
         * Adds information from the AWS IoT Device Shadows service to a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-deviceshadowenrich
         */
        readonly deviceShadowEnrich?: CfnPipeline.DeviceShadowEnrichProperty | cdk.IResolvable;
        /**
         * Filters a message based on its attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-filter
         */
        readonly filter?: CfnPipeline.FilterProperty | cdk.IResolvable;
        /**
         * Runs a Lambda function to modify the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-lambda
         */
        readonly lambda?: CfnPipeline.LambdaProperty | cdk.IResolvable;
        /**
         * Computes an arithmetic expression using the message's attributes and adds it to the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-math
         */
        readonly math?: CfnPipeline.MathProperty | cdk.IResolvable;
        /**
         * Removes attributes from a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-removeattributes
         */
        readonly removeAttributes?: CfnPipeline.RemoveAttributesProperty | cdk.IResolvable;
        /**
         * Creates a new message using only the specified attributes from the original message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-selectattributes
         */
        readonly selectAttributes?: CfnPipeline.SelectAttributesProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActivityProperty`
 *
 * @param properties - the TypeScript properties of a `ActivityProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ActivityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addAttributes', CfnPipeline_AddAttributesPropertyValidator)(properties.addAttributes));
    errors.collect(cdk.propertyValidator('channel', CfnPipeline_ChannelPropertyValidator)(properties.channel));
    errors.collect(cdk.propertyValidator('datastore', CfnPipeline_DatastorePropertyValidator)(properties.datastore));
    errors.collect(cdk.propertyValidator('deviceRegistryEnrich', CfnPipeline_DeviceRegistryEnrichPropertyValidator)(properties.deviceRegistryEnrich));
    errors.collect(cdk.propertyValidator('deviceShadowEnrich', CfnPipeline_DeviceShadowEnrichPropertyValidator)(properties.deviceShadowEnrich));
    errors.collect(cdk.propertyValidator('filter', CfnPipeline_FilterPropertyValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('lambda', CfnPipeline_LambdaPropertyValidator)(properties.lambda));
    errors.collect(cdk.propertyValidator('math', CfnPipeline_MathPropertyValidator)(properties.math));
    errors.collect(cdk.propertyValidator('removeAttributes', CfnPipeline_RemoveAttributesPropertyValidator)(properties.removeAttributes));
    errors.collect(cdk.propertyValidator('selectAttributes', CfnPipeline_SelectAttributesPropertyValidator)(properties.selectAttributes));
    return errors.wrap('supplied properties not correct for "ActivityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Activity` resource
 *
 * @param properties - the TypeScript properties of a `ActivityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Activity` resource.
 */
// @ts-ignore TS6133
function cfnPipelineActivityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ActivityPropertyValidator(properties).assertSuccess();
    return {
        AddAttributes: cfnPipelineAddAttributesPropertyToCloudFormation(properties.addAttributes),
        Channel: cfnPipelineChannelPropertyToCloudFormation(properties.channel),
        Datastore: cfnPipelineDatastorePropertyToCloudFormation(properties.datastore),
        DeviceRegistryEnrich: cfnPipelineDeviceRegistryEnrichPropertyToCloudFormation(properties.deviceRegistryEnrich),
        DeviceShadowEnrich: cfnPipelineDeviceShadowEnrichPropertyToCloudFormation(properties.deviceShadowEnrich),
        Filter: cfnPipelineFilterPropertyToCloudFormation(properties.filter),
        Lambda: cfnPipelineLambdaPropertyToCloudFormation(properties.lambda),
        Math: cfnPipelineMathPropertyToCloudFormation(properties.math),
        RemoveAttributes: cfnPipelineRemoveAttributesPropertyToCloudFormation(properties.removeAttributes),
        SelectAttributes: cfnPipelineSelectAttributesPropertyToCloudFormation(properties.selectAttributes),
    };
}

// @ts-ignore TS6133
function CfnPipelineActivityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ActivityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ActivityProperty>();
    ret.addPropertyResult('addAttributes', 'AddAttributes', properties.AddAttributes != null ? CfnPipelineAddAttributesPropertyFromCloudFormation(properties.AddAttributes) : undefined);
    ret.addPropertyResult('channel', 'Channel', properties.Channel != null ? CfnPipelineChannelPropertyFromCloudFormation(properties.Channel) : undefined);
    ret.addPropertyResult('datastore', 'Datastore', properties.Datastore != null ? CfnPipelineDatastorePropertyFromCloudFormation(properties.Datastore) : undefined);
    ret.addPropertyResult('deviceRegistryEnrich', 'DeviceRegistryEnrich', properties.DeviceRegistryEnrich != null ? CfnPipelineDeviceRegistryEnrichPropertyFromCloudFormation(properties.DeviceRegistryEnrich) : undefined);
    ret.addPropertyResult('deviceShadowEnrich', 'DeviceShadowEnrich', properties.DeviceShadowEnrich != null ? CfnPipelineDeviceShadowEnrichPropertyFromCloudFormation(properties.DeviceShadowEnrich) : undefined);
    ret.addPropertyResult('filter', 'Filter', properties.Filter != null ? CfnPipelineFilterPropertyFromCloudFormation(properties.Filter) : undefined);
    ret.addPropertyResult('lambda', 'Lambda', properties.Lambda != null ? CfnPipelineLambdaPropertyFromCloudFormation(properties.Lambda) : undefined);
    ret.addPropertyResult('math', 'Math', properties.Math != null ? CfnPipelineMathPropertyFromCloudFormation(properties.Math) : undefined);
    ret.addPropertyResult('removeAttributes', 'RemoveAttributes', properties.RemoveAttributes != null ? CfnPipelineRemoveAttributesPropertyFromCloudFormation(properties.RemoveAttributes) : undefined);
    ret.addPropertyResult('selectAttributes', 'SelectAttributes', properties.SelectAttributes != null ? CfnPipelineSelectAttributesPropertyFromCloudFormation(properties.SelectAttributes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * An activity that adds other attributes based on existing attributes in the message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html
     */
    export interface AddAttributesProperty {
        /**
         * A list of 1-50 "AttributeNameMapping" objects that map an existing attribute to a new attribute.
         *
         * > The existing attributes remain in the message, so if you want to remove the originals, use "RemoveAttributeActivity".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html#cfn-iotanalytics-pipeline-addattributes-attributes
         */
        readonly attributes: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The name of the 'addAttributes' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html#cfn-iotanalytics-pipeline-addattributes-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html#cfn-iotanalytics-pipeline-addattributes-next
         */
        readonly next?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AddAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `AddAttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_AddAttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.requiredValidator)(properties.attributes));
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    return errors.wrap('supplied properties not correct for "AddAttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.AddAttributes` resource
 *
 * @param properties - the TypeScript properties of a `AddAttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.AddAttributes` resource.
 */
// @ts-ignore TS6133
function cfnPipelineAddAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_AddAttributesPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
    };
}

// @ts-ignore TS6133
function CfnPipelineAddAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.AddAttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.AddAttributesProperty>();
    ret.addPropertyResult('attributes', 'Attributes', cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Determines the source of the messages to be processed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html
     */
    export interface ChannelProperty {
        /**
         * The name of the channel from which the messages are processed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html#cfn-iotanalytics-pipeline-channel-channelname
         */
        readonly channelName: string;
        /**
         * The name of the 'channel' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html#cfn-iotanalytics-pipeline-channel-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html#cfn-iotanalytics-pipeline-channel-next
         */
        readonly next?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ChannelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelName', cdk.requiredValidator)(properties.channelName));
    errors.collect(cdk.propertyValidator('channelName', cdk.validateString)(properties.channelName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    return errors.wrap('supplied properties not correct for "ChannelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Channel` resource
 *
 * @param properties - the TypeScript properties of a `ChannelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Channel` resource.
 */
// @ts-ignore TS6133
function cfnPipelineChannelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ChannelPropertyValidator(properties).assertSuccess();
    return {
        ChannelName: cdk.stringToCloudFormation(properties.channelName),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
    };
}

// @ts-ignore TS6133
function CfnPipelineChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ChannelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ChannelProperty>();
    ret.addPropertyResult('channelName', 'ChannelName', cfn_parse.FromCloudFormation.getString(properties.ChannelName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * The datastore activity that specifies where to store the processed data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-datastore.html
     */
    export interface DatastoreProperty {
        /**
         * The name of the data store where processed messages are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-datastore.html#cfn-iotanalytics-pipeline-datastore-datastorename
         */
        readonly datastoreName: string;
        /**
         * The name of the datastore activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-datastore.html#cfn-iotanalytics-pipeline-datastore-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatastoreProperty`
 *
 * @param properties - the TypeScript properties of a `DatastoreProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_DatastorePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datastoreName', cdk.requiredValidator)(properties.datastoreName));
    errors.collect(cdk.propertyValidator('datastoreName', cdk.validateString)(properties.datastoreName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "DatastoreProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Datastore` resource
 *
 * @param properties - the TypeScript properties of a `DatastoreProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Datastore` resource.
 */
// @ts-ignore TS6133
function cfnPipelineDatastorePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_DatastorePropertyValidator(properties).assertSuccess();
    return {
        DatastoreName: cdk.stringToCloudFormation(properties.datastoreName),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPipelineDatastorePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.DatastoreProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.DatastoreProperty>();
    ret.addPropertyResult('datastoreName', 'DatastoreName', cfn_parse.FromCloudFormation.getString(properties.DatastoreName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * An activity that adds data from the AWS IoT device registry to your message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html
     */
    export interface DeviceRegistryEnrichProperty {
        /**
         * The name of the attribute that is added to the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-attribute
         */
        readonly attribute: string;
        /**
         * The name of the 'deviceRegistryEnrich' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-next
         */
        readonly next?: string;
        /**
         * The ARN of the role that allows access to the device's registry information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-rolearn
         */
        readonly roleArn: string;
        /**
         * The name of the IoT device whose registry information is added to the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-thingname
         */
        readonly thingName: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeviceRegistryEnrichProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceRegistryEnrichProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_DeviceRegistryEnrichPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attribute', cdk.requiredValidator)(properties.attribute));
    errors.collect(cdk.propertyValidator('attribute', cdk.validateString)(properties.attribute));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('thingName', cdk.requiredValidator)(properties.thingName));
    errors.collect(cdk.propertyValidator('thingName', cdk.validateString)(properties.thingName));
    return errors.wrap('supplied properties not correct for "DeviceRegistryEnrichProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.DeviceRegistryEnrich` resource
 *
 * @param properties - the TypeScript properties of a `DeviceRegistryEnrichProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.DeviceRegistryEnrich` resource.
 */
// @ts-ignore TS6133
function cfnPipelineDeviceRegistryEnrichPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_DeviceRegistryEnrichPropertyValidator(properties).assertSuccess();
    return {
        Attribute: cdk.stringToCloudFormation(properties.attribute),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        ThingName: cdk.stringToCloudFormation(properties.thingName),
    };
}

// @ts-ignore TS6133
function CfnPipelineDeviceRegistryEnrichPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.DeviceRegistryEnrichProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.DeviceRegistryEnrichProperty>();
    ret.addPropertyResult('attribute', 'Attribute', cfn_parse.FromCloudFormation.getString(properties.Attribute));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('thingName', 'ThingName', cfn_parse.FromCloudFormation.getString(properties.ThingName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * An activity that adds information from the AWS IoT Device Shadows service to a message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html
     */
    export interface DeviceShadowEnrichProperty {
        /**
         * The name of the attribute that is added to the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-attribute
         */
        readonly attribute: string;
        /**
         * The name of the 'deviceShadowEnrich' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-next
         */
        readonly next?: string;
        /**
         * The ARN of the role that allows access to the device's shadow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-rolearn
         */
        readonly roleArn: string;
        /**
         * The name of the IoT device whose shadow information is added to the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-thingname
         */
        readonly thingName: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeviceShadowEnrichProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceShadowEnrichProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_DeviceShadowEnrichPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attribute', cdk.requiredValidator)(properties.attribute));
    errors.collect(cdk.propertyValidator('attribute', cdk.validateString)(properties.attribute));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('thingName', cdk.requiredValidator)(properties.thingName));
    errors.collect(cdk.propertyValidator('thingName', cdk.validateString)(properties.thingName));
    return errors.wrap('supplied properties not correct for "DeviceShadowEnrichProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.DeviceShadowEnrich` resource
 *
 * @param properties - the TypeScript properties of a `DeviceShadowEnrichProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.DeviceShadowEnrich` resource.
 */
// @ts-ignore TS6133
function cfnPipelineDeviceShadowEnrichPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_DeviceShadowEnrichPropertyValidator(properties).assertSuccess();
    return {
        Attribute: cdk.stringToCloudFormation(properties.attribute),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        ThingName: cdk.stringToCloudFormation(properties.thingName),
    };
}

// @ts-ignore TS6133
function CfnPipelineDeviceShadowEnrichPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.DeviceShadowEnrichProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.DeviceShadowEnrichProperty>();
    ret.addPropertyResult('attribute', 'Attribute', cfn_parse.FromCloudFormation.getString(properties.Attribute));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('thingName', 'ThingName', cfn_parse.FromCloudFormation.getString(properties.ThingName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * An activity that filters a message based on its attributes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html
     */
    export interface FilterProperty {
        /**
         * An expression that looks like an SQL WHERE clause that must return a Boolean value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html#cfn-iotanalytics-pipeline-filter-filter
         */
        readonly filter: string;
        /**
         * The name of the 'filter' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html#cfn-iotanalytics-pipeline-filter-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html#cfn-iotanalytics-pipeline-filter-next
         */
        readonly next?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_FilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filter', cdk.requiredValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('filter', cdk.validateString)(properties.filter));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    return errors.wrap('supplied properties not correct for "FilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Filter` resource
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Filter` resource.
 */
// @ts-ignore TS6133
function cfnPipelineFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_FilterPropertyValidator(properties).assertSuccess();
    return {
        Filter: cdk.stringToCloudFormation(properties.filter),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
    };
}

// @ts-ignore TS6133
function CfnPipelineFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.FilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.FilterProperty>();
    ret.addPropertyResult('filter', 'Filter', cfn_parse.FromCloudFormation.getString(properties.Filter));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * An activity that runs a Lambda function to modify the message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html
     */
    export interface LambdaProperty {
        /**
         * The number of messages passed to the Lambda function for processing.
         *
         * The AWS Lambda function must be able to process all of these messages within five minutes, which is the maximum timeout duration for Lambda functions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-batchsize
         */
        readonly batchSize: number;
        /**
         * The name of the Lambda function that is run on the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-lambdaname
         */
        readonly lambdaName: string;
        /**
         * The name of the 'lambda' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-next
         */
        readonly next?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_LambdaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.requiredValidator)(properties.batchSize));
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('lambdaName', cdk.requiredValidator)(properties.lambdaName));
    errors.collect(cdk.propertyValidator('lambdaName', cdk.validateString)(properties.lambdaName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    return errors.wrap('supplied properties not correct for "LambdaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Lambda` resource
 *
 * @param properties - the TypeScript properties of a `LambdaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Lambda` resource.
 */
// @ts-ignore TS6133
function cfnPipelineLambdaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_LambdaPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        LambdaName: cdk.stringToCloudFormation(properties.lambdaName),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
    };
}

// @ts-ignore TS6133
function CfnPipelineLambdaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.LambdaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.LambdaProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', cfn_parse.FromCloudFormation.getNumber(properties.BatchSize));
    ret.addPropertyResult('lambdaName', 'LambdaName', cfn_parse.FromCloudFormation.getString(properties.LambdaName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * An activity that computes an arithmetic expression using the message's attributes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html
     */
    export interface MathProperty {
        /**
         * The name of the attribute that contains the result of the math operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-attribute
         */
        readonly attribute: string;
        /**
         * An expression that uses one or more existing attributes and must return an integer value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-math
         */
        readonly math: string;
        /**
         * The name of the 'math' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-next
         */
        readonly next?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MathProperty`
 *
 * @param properties - the TypeScript properties of a `MathProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_MathPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attribute', cdk.requiredValidator)(properties.attribute));
    errors.collect(cdk.propertyValidator('attribute', cdk.validateString)(properties.attribute));
    errors.collect(cdk.propertyValidator('math', cdk.requiredValidator)(properties.math));
    errors.collect(cdk.propertyValidator('math', cdk.validateString)(properties.math));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    return errors.wrap('supplied properties not correct for "MathProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Math` resource
 *
 * @param properties - the TypeScript properties of a `MathProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.Math` resource.
 */
// @ts-ignore TS6133
function cfnPipelineMathPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_MathPropertyValidator(properties).assertSuccess();
    return {
        Attribute: cdk.stringToCloudFormation(properties.attribute),
        Math: cdk.stringToCloudFormation(properties.math),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
    };
}

// @ts-ignore TS6133
function CfnPipelineMathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.MathProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.MathProperty>();
    ret.addPropertyResult('attribute', 'Attribute', cfn_parse.FromCloudFormation.getString(properties.Attribute));
    ret.addPropertyResult('math', 'Math', cfn_parse.FromCloudFormation.getString(properties.Math));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * An activity that removes attributes from a message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html
     */
    export interface RemoveAttributesProperty {
        /**
         * A list of 1-50 attributes to remove from the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html#cfn-iotanalytics-pipeline-removeattributes-attributes
         */
        readonly attributes: string[];
        /**
         * The name of the 'removeAttributes' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html#cfn-iotanalytics-pipeline-removeattributes-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html#cfn-iotanalytics-pipeline-removeattributes-next
         */
        readonly next?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RemoveAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `RemoveAttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_RemoveAttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.requiredValidator)(properties.attributes));
    errors.collect(cdk.propertyValidator('attributes', cdk.listValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    return errors.wrap('supplied properties not correct for "RemoveAttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.RemoveAttributes` resource
 *
 * @param properties - the TypeScript properties of a `RemoveAttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.RemoveAttributes` resource.
 */
// @ts-ignore TS6133
function cfnPipelineRemoveAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_RemoveAttributesPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.listMapper(cdk.stringToCloudFormation)(properties.attributes),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
    };
}

// @ts-ignore TS6133
function CfnPipelineRemoveAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.RemoveAttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.RemoveAttributesProperty>();
    ret.addPropertyResult('attributes', 'Attributes', cfn_parse.FromCloudFormation.getStringArray(properties.Attributes));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Creates a new message using only the specified attributes from the original message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html
     */
    export interface SelectAttributesProperty {
        /**
         * A list of the attributes to select from the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html#cfn-iotanalytics-pipeline-selectattributes-attributes
         */
        readonly attributes: string[];
        /**
         * The name of the 'selectAttributes' activity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html#cfn-iotanalytics-pipeline-selectattributes-name
         */
        readonly name: string;
        /**
         * The next activity in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html#cfn-iotanalytics-pipeline-selectattributes-next
         */
        readonly next?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SelectAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `SelectAttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_SelectAttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.requiredValidator)(properties.attributes));
    errors.collect(cdk.propertyValidator('attributes', cdk.listValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('next', cdk.validateString)(properties.next));
    return errors.wrap('supplied properties not correct for "SelectAttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.SelectAttributes` resource
 *
 * @param properties - the TypeScript properties of a `SelectAttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTAnalytics::Pipeline.SelectAttributes` resource.
 */
// @ts-ignore TS6133
function cfnPipelineSelectAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_SelectAttributesPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.listMapper(cdk.stringToCloudFormation)(properties.attributes),
        Name: cdk.stringToCloudFormation(properties.name),
        Next: cdk.stringToCloudFormation(properties.next),
    };
}

// @ts-ignore TS6133
function CfnPipelineSelectAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.SelectAttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.SelectAttributesProperty>();
    ret.addPropertyResult('attributes', 'Attributes', cfn_parse.FromCloudFormation.getStringArray(properties.Attributes));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('next', 'Next', properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

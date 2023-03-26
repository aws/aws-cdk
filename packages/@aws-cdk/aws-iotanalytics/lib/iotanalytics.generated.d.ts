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
 * A CloudFormation `AWS::IoTAnalytics::Channel`
 *
 * The AWS::IoTAnalytics::Channel resource collects data from an MQTT topic and archives the raw, unprocessed messages before publishing the data to a pipeline. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Channel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html
 */
export declare class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Channel";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannel;
    /**
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The name of the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelname
     */
    channelName: string | undefined;
    /**
     * Where channel data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelstorage
     */
    channelStorage: CfnChannel.ChannelStorageProperty | cdk.IResolvable | undefined;
    /**
     * How long, in days, message data is kept for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-retentionperiod
     */
    retentionPeriod: CfnChannel.RetentionPeriodProperty | cdk.IResolvable | undefined;
    /**
     * Metadata which can be used to manage the channel.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTAnalytics::Channel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnChannelProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnChannel {
    /**
     * Where channel data is stored. You may choose one of `serviceManagedS3` , `customerManagedS3` storage. If not specified, the default is `serviceManagedS3` . This can't be changed after creation of the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-channelstorage.html
     */
    interface ChannelStorageProperty {
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
export declare namespace CfnChannel {
    /**
     * Used to store channel data in an S3 bucket that you manage.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html
     */
    interface CustomerManagedS3Property {
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
export declare namespace CfnChannel {
    /**
     * How long, in days, message data is kept.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-retentionperiod.html
     */
    interface RetentionPeriodProperty {
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
 * A CloudFormation `AWS::IoTAnalytics::Dataset`
 *
 * The AWS::IoTAnalytics::Dataset resource stores data retrieved from a data store by applying a `queryAction` (an SQL query) or a `containerAction` (executing a containerized application). The data set can be populated manually by calling `CreateDatasetContent` or automatically according to a `trigger` you specify. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Dataset
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html
 */
export declare class CfnDataset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Dataset";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataset;
    /**
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The `DatasetAction` objects that automatically create the dataset contents.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-actions
     */
    actions: Array<CfnDataset.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * When dataset contents are created they are delivered to destinations specified here.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-contentdeliveryrules
     */
    contentDeliveryRules: Array<CfnDataset.DatasetContentDeliveryRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-datasetname
     */
    datasetName: string | undefined;
    /**
     * A list of data rules that send notifications to CloudWatch, when data arrives late. To specify `lateDataRules` , the dataset must use a [DeltaTimer](https://docs.aws.amazon.com/iotanalytics/latest/APIReference/API_DeltaTime.html) filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-latedatarules
     */
    lateDataRules: Array<CfnDataset.LateDataRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Optional. How long, in days, message data is kept for the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-retentionperiod
     */
    retentionPeriod: CfnDataset.RetentionPeriodProperty | cdk.IResolvable | undefined;
    /**
     * Metadata which can be used to manage the data set.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The `DatasetTrigger` objects that specify when the dataset is automatically updated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-triggers
     */
    triggers: Array<CfnDataset.TriggerProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Optional. How many versions of dataset contents are kept. If not specified or set to null, only the latest version plus the latest succeeded version (if they are different) are kept for the time period specified by the `retentionPeriod` parameter. For more information, see [Keeping Multiple Versions of AWS IoT Analytics datasets](https://docs.aws.amazon.com/iotanalytics/latest/userguide/getting-started.html#aws-iot-analytics-dataset-versions) in the *AWS IoT Analytics User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-versioningconfiguration
     */
    versioningConfiguration: CfnDataset.VersioningConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::IoTAnalytics::Dataset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnDataset {
    /**
     * Information needed to run the "containerAction" to produce data set contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html
     */
    interface ActionProperty {
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
export declare namespace CfnDataset {
    /**
     * Information needed to run the "containerAction" to produce data set contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html
     */
    interface ContainerActionProperty {
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
export declare namespace CfnDataset {
    /**
     * When dataset contents are created, they are delivered to destination specified here.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryrule.html
     */
    interface DatasetContentDeliveryRuleProperty {
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
export declare namespace CfnDataset {
    /**
     * The destination to which dataset contents are delivered.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryruledestination.html
     */
    interface DatasetContentDeliveryRuleDestinationProperty {
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
export declare namespace CfnDataset {
    /**
     * The dataset whose latest contents are used as input to the notebook or application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentversionvalue.html
     */
    interface DatasetContentVersionValueProperty {
        /**
         * The name of the dataset whose latest contents are used as input to the notebook or application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentversionvalue.html#cfn-iotanalytics-dataset-datasetcontentversionvalue-datasetname
         */
        readonly datasetName: string;
    }
}
export declare namespace CfnDataset {
    /**
     * Used to limit data to that which has arrived since the last execution of the action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatime.html
     */
    interface DeltaTimeProperty {
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
export declare namespace CfnDataset {
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
    interface DeltaTimeSessionWindowConfigurationProperty {
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
export declare namespace CfnDataset {
    /**
     * Information which is used to filter message data, to segregate it according to the time frame in which it arrives.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-filter.html
     */
    interface FilterProperty {
        /**
         * Used to limit data to that which has arrived since the last execution of the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-filter.html#cfn-iotanalytics-dataset-filter-deltatime
         */
        readonly deltaTime?: CfnDataset.DeltaTimeProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataset {
    /**
     * Configuration information for coordination with AWS Glue , a fully managed extract, transform and load (ETL) service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-glueconfiguration.html
     */
    interface GlueConfigurationProperty {
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
export declare namespace CfnDataset {
    /**
     * Configuration information for delivery of dataset contents to AWS IoT Events .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-ioteventsdestinationconfiguration.html
     */
    interface IotEventsDestinationConfigurationProperty {
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
export declare namespace CfnDataset {
    /**
     * A structure that contains the name and configuration information of a late data rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedatarule.html
     */
    interface LateDataRuleProperty {
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
export declare namespace CfnDataset {
    /**
     * The information needed to configure a delta time session window.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedataruleconfiguration.html
     */
    interface LateDataRuleConfigurationProperty {
        /**
         * The information needed to configure a delta time session window.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedataruleconfiguration.html#cfn-iotanalytics-dataset-latedataruleconfiguration-deltatimesessionwindowconfiguration
         */
        readonly deltaTimeSessionWindowConfiguration?: CfnDataset.DeltaTimeSessionWindowConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataset {
    /**
     * The value of the variable as a structure that specifies an output file URI.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-outputfileurivalue.html
     */
    interface OutputFileUriValueProperty {
        /**
         * The URI of the location where dataset contents are stored, usually the URI of a file in an S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-outputfileurivalue.html#cfn-iotanalytics-dataset-outputfileurivalue-filename
         */
        readonly fileName: string;
    }
}
export declare namespace CfnDataset {
    /**
     * An "SqlQueryDatasetAction" object that uses an SQL query to automatically create data set contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-queryaction.html
     */
    interface QueryActionProperty {
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
export declare namespace CfnDataset {
    /**
     * The configuration of the resource used to execute the `containerAction` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-resourceconfiguration.html
     */
    interface ResourceConfigurationProperty {
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
export declare namespace CfnDataset {
    /**
     * How long, in days, message data is kept.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-retentionperiod.html
     */
    interface RetentionPeriodProperty {
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
export declare namespace CfnDataset {
    /**
     * Configuration information for delivery of dataset contents to Amazon Simple Storage Service (Amazon S3).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html
     */
    interface S3DestinationConfigurationProperty {
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
export declare namespace CfnDataset {
    /**
     * The schedule for when to trigger an update.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-schedule.html
     */
    interface ScheduleProperty {
        /**
         * The expression that defines when to trigger an update. For more information, see [Schedule Expressions for Rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) in the Amazon CloudWatch documentation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-schedule.html#cfn-iotanalytics-dataset-schedule-scheduleexpression
         */
        readonly scheduleExpression: string;
    }
}
export declare namespace CfnDataset {
    /**
     * The "DatasetTrigger" that specifies when the data set is automatically updated.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-trigger.html
     */
    interface TriggerProperty {
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
export declare namespace CfnDataset {
    /**
     * Information about the dataset whose content generation triggers the new dataset content generation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-triggeringdataset.html
     */
    interface TriggeringDatasetProperty {
        /**
         * The name of the data set whose content generation triggers the new data set content generation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-triggeringdataset.html#cfn-iotanalytics-dataset-triggeringdataset-datasetname
         */
        readonly datasetName: string;
    }
}
export declare namespace CfnDataset {
    /**
     * An instance of a variable to be passed to the `containerAction` execution. Each variable must have a name and a value given by one of `stringValue` , `datasetContentVersionValue` , or `outputFileUriValue` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html
     */
    interface VariableProperty {
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
export declare namespace CfnDataset {
    /**
     * Information about the versioning of dataset contents.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-versioningconfiguration.html
     */
    interface VersioningConfigurationProperty {
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
 * A CloudFormation `AWS::IoTAnalytics::Datastore`
 *
 * AWS::IoTAnalytics::Datastore resource is a repository for messages. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Datastore
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html
 */
export declare class CfnDatastore extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Datastore";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatastore;
    /**
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The name of the data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorename
     */
    datastoreName: string | undefined;
    /**
     * Information about the partition dimensions in a data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorepartitions
     */
    datastorePartitions: CfnDatastore.DatastorePartitionsProperty | cdk.IResolvable | undefined;
    /**
     * Where data store data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorestorage
     */
    datastoreStorage: CfnDatastore.DatastoreStorageProperty | cdk.IResolvable | undefined;
    /**
     * Contains the configuration information of file formats. AWS IoT Analytics data stores support JSON and [Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/) .
     *
     * The default file format is JSON. You can specify only one format.
     *
     * You can't change the file format after you create the data store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-fileformatconfiguration
     */
    fileFormatConfiguration: CfnDatastore.FileFormatConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * How long, in days, message data is kept for the data store. When `customerManagedS3` storage is selected, this parameter is ignored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-retentionperiod
     */
    retentionPeriod: CfnDatastore.RetentionPeriodProperty | cdk.IResolvable | undefined;
    /**
     * Metadata which can be used to manage the data store.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTAnalytics::Datastore`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnDatastoreProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnDatastore {
    /**
     * Contains information about a column that stores your data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-column.html
     */
    interface ColumnProperty {
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
export declare namespace CfnDatastore {
    /**
     * S3-customer-managed; When you choose customer-managed storage, the `retentionPeriod` parameter is ignored. You can't change the choice of Amazon S3 storage after your data store is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html
     */
    interface CustomerManagedS3Property {
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
export declare namespace CfnDatastore {
    /**
     * Amazon S3 -customer-managed; When you choose customer-managed storage, the `retentionPeriod` parameter is ignored. You can't change the choice of Amazon S3 storage after your data store is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3storage.html
     */
    interface CustomerManagedS3StorageProperty {
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
export declare namespace CfnDatastore {
    /**
     * A single dimension to partition a data store. The dimension must be an `AttributePartition` or a `TimestampPartition` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartition.html
     */
    interface DatastorePartitionProperty {
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
export declare namespace CfnDatastore {
    /**
     * Information about the partition dimensions in a data store.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartitions.html
     */
    interface DatastorePartitionsProperty {
        /**
         * A list of partition dimensions in a data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartitions.html#cfn-iotanalytics-datastore-datastorepartitions-partitions
         */
        readonly partitions?: Array<CfnDatastore.DatastorePartitionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnDatastore {
    /**
     * Where data store data is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html
     */
    interface DatastoreStorageProperty {
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
export declare namespace CfnDatastore {
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
    interface FileFormatConfigurationProperty {
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
export declare namespace CfnDatastore {
    /**
     * Stores data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage. You can't change the choice of Amazon S3 storage after your data store is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-iotsitewisemultilayerstorage.html
     */
    interface IotSiteWiseMultiLayerStorageProperty {
        /**
         * Stores data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-iotsitewisemultilayerstorage.html#cfn-iotanalytics-datastore-iotsitewisemultilayerstorage-customermanageds3storage
         */
        readonly customerManagedS3Storage?: CfnDatastore.CustomerManagedS3StorageProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDatastore {
    /**
     * Contains the configuration information of the Parquet format.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-parquetconfiguration.html
     */
    interface ParquetConfigurationProperty {
        /**
         * Information needed to define a schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-parquetconfiguration.html#cfn-iotanalytics-datastore-parquetconfiguration-schemadefinition
         */
        readonly schemaDefinition?: CfnDatastore.SchemaDefinitionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDatastore {
    /**
     * A single dimension to partition a data store. The dimension must be an `AttributePartition` or a `TimestampPartition` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-partition.html
     */
    interface PartitionProperty {
        /**
         * The name of the attribute that defines a partition dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-partition.html#cfn-iotanalytics-datastore-partition-attributename
         */
        readonly attributeName: string;
    }
}
export declare namespace CfnDatastore {
    /**
     * How long, in days, message data is kept.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-retentionperiod.html
     */
    interface RetentionPeriodProperty {
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
export declare namespace CfnDatastore {
    /**
     * Information needed to define a schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-schemadefinition.html
     */
    interface SchemaDefinitionProperty {
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
export declare namespace CfnDatastore {
    /**
     * A partition dimension defined by a timestamp attribute.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-timestamppartition.html
     */
    interface TimestampPartitionProperty {
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
 * A CloudFormation `AWS::IoTAnalytics::Pipeline`
 *
 * The AWS::IoTAnalytics::Pipeline resource consumes messages from one or more channels and allows you to process the messages before storing them in a data store. You must specify both a `channel` and a `datastore` activity and, optionally, as many as 23 additional activities in the `pipelineActivities` array. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Pipeline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html
 */
export declare class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTAnalytics::Pipeline";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline;
    /**
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * A list of "PipelineActivity" objects. Activities perform transformations on your messages, such as removing, renaming or adding message attributes; filtering messages based on attribute values; invoking your Lambda functions on messages for advanced processing; or performing mathematical transformations to normalize device data.
     *
     * The list can be 2-25 *PipelineActivity* objects and must contain both a `channel` and a `datastore` activity. Each entry in the list must contain only one activity, for example:
     *
     * `pipelineActivities = [ { "channel": { ... } }, { "lambda": { ... } }, ... ]`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelineactivities
     */
    pipelineActivities: Array<CfnPipeline.ActivityProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelinename
     */
    pipelineName: string | undefined;
    /**
     * Metadata which can be used to manage the pipeline.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTAnalytics::Pipeline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnPipeline {
    /**
     * An activity that performs a transformation on a message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html
     */
    interface ActivityProperty {
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
export declare namespace CfnPipeline {
    /**
     * An activity that adds other attributes based on existing attributes in the message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html
     */
    interface AddAttributesProperty {
        /**
         * A list of 1-50 "AttributeNameMapping" objects that map an existing attribute to a new attribute.
         *
         * > The existing attributes remain in the message, so if you want to remove the originals, use "RemoveAttributeActivity".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html#cfn-iotanalytics-pipeline-addattributes-attributes
         */
        readonly attributes: {
            [key: string]: (string);
        } | cdk.IResolvable;
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
export declare namespace CfnPipeline {
    /**
     * Determines the source of the messages to be processed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html
     */
    interface ChannelProperty {
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
export declare namespace CfnPipeline {
    /**
     * The datastore activity that specifies where to store the processed data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-datastore.html
     */
    interface DatastoreProperty {
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
export declare namespace CfnPipeline {
    /**
     * An activity that adds data from the AWS IoT device registry to your message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html
     */
    interface DeviceRegistryEnrichProperty {
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
export declare namespace CfnPipeline {
    /**
     * An activity that adds information from the AWS IoT Device Shadows service to a message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html
     */
    interface DeviceShadowEnrichProperty {
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
export declare namespace CfnPipeline {
    /**
     * An activity that filters a message based on its attributes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html
     */
    interface FilterProperty {
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
export declare namespace CfnPipeline {
    /**
     * An activity that runs a Lambda function to modify the message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html
     */
    interface LambdaProperty {
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
export declare namespace CfnPipeline {
    /**
     * An activity that computes an arithmetic expression using the message's attributes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html
     */
    interface MathProperty {
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
export declare namespace CfnPipeline {
    /**
     * An activity that removes attributes from a message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html
     */
    interface RemoveAttributesProperty {
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
export declare namespace CfnPipeline {
    /**
     * Creates a new message using only the specified attributes from the original message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html
     */
    interface SelectAttributesProperty {
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

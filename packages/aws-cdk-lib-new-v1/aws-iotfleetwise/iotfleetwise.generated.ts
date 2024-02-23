/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an orchestration of data collection rules.
 *
 * The AWS IoT FleetWise Edge Agent software running in vehicles uses campaigns to decide how to collect and transfer data to the cloud. You create campaigns in the cloud. After you or your team approve campaigns, AWS IoT FleetWise automatically deploys them to vehicles.
 *
 * For more information, see [Collect and transfer data with campaigns](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/campaigns.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Campaign
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html
 */
export class CfnCampaign extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTFleetWise::Campaign";

  /**
   * Build a CfnCampaign from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCampaign {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCampaignPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCampaign(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the campaign.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the campaign was created in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The last time the campaign was modified.
   *
   * @cloudformationAttribute LastModificationTime
   */
  public readonly attrLastModificationTime: string;

  /**
   * The state of the campaign. The status can be one of: `CREATING` , `WAITING_FOR_APPROVAL` , `RUNNING` , and `SUSPENDED` .
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * Specifies how to update a campaign. The action can be one of the following:.
   */
  public action: string;

  /**
   * The data collection scheme associated with the campaign.
   */
  public collectionScheme: CfnCampaign.CollectionSchemeProperty | cdk.IResolvable;

  /**
   * (Optional) Whether to compress signals before transmitting data to AWS IoT FleetWise .
   */
  public compression?: string;

  /**
   * (Optional) The destination where the campaign sends data.
   */
  public dataDestinationConfigs?: Array<CfnCampaign.DataDestinationConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * (Optional) A list of vehicle attributes to associate with a campaign.
   */
  public dataExtraDimensions?: Array<string>;

  /**
   * (Optional) The description of the campaign.
   */
  public description?: string;

  /**
   * (Optional) Option for a vehicle to send diagnostic trouble codes to AWS IoT FleetWise .
   */
  public diagnosticsMode?: string;

  /**
   * (Optional) The time the campaign expires, in seconds since epoch (January 1, 1970 at midnight UTC time).
   */
  public expiryTime?: string;

  /**
   * The name of a campaign.
   */
  public name: string;

  /**
   * (Optional) How long (in milliseconds) to collect raw data after a triggering event initiates the collection.
   */
  public postTriggerCollectionDuration?: number;

  /**
   * (Optional) A number indicating the priority of one campaign over another campaign for a certain vehicle or fleet.
   */
  public priority?: number;

  /**
   * The Amazon Resource Name (ARN) of the signal catalog associated with the campaign.
   */
  public signalCatalogArn: string;

  /**
   * (Optional) A list of information about signals to collect.
   */
  public signalsToCollect?: Array<cdk.IResolvable | CfnCampaign.SignalInformationProperty> | cdk.IResolvable;

  /**
   * (Optional) Whether to store collected data after a vehicle lost a connection with the cloud.
   */
  public spoolingMode?: string;

  /**
   * (Optional) The time, in milliseconds, to deliver a campaign after it was approved.
   */
  public startTime?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * (Optional) Metadata that can be used to manage the campaign.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The Amazon Resource Name (ARN) of a vehicle or fleet to which the campaign is deployed.
   */
  public targetArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCampaignProps) {
    super(scope, id, {
      "type": CfnCampaign.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "action", this);
    cdk.requireProperty(props, "collectionScheme", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "signalCatalogArn", this);
    cdk.requireProperty(props, "targetArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastModificationTime = cdk.Token.asString(this.getAtt("LastModificationTime", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.collectionScheme = props.collectionScheme;
    this.compression = props.compression;
    this.dataDestinationConfigs = props.dataDestinationConfigs;
    this.dataExtraDimensions = props.dataExtraDimensions;
    this.description = props.description;
    this.diagnosticsMode = props.diagnosticsMode;
    this.expiryTime = props.expiryTime;
    this.name = props.name;
    this.postTriggerCollectionDuration = props.postTriggerCollectionDuration;
    this.priority = props.priority;
    this.signalCatalogArn = props.signalCatalogArn;
    this.signalsToCollect = props.signalsToCollect;
    this.spoolingMode = props.spoolingMode;
    this.startTime = props.startTime;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::Campaign", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetArn = props.targetArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "collectionScheme": this.collectionScheme,
      "compression": this.compression,
      "dataDestinationConfigs": this.dataDestinationConfigs,
      "dataExtraDimensions": this.dataExtraDimensions,
      "description": this.description,
      "diagnosticsMode": this.diagnosticsMode,
      "expiryTime": this.expiryTime,
      "name": this.name,
      "postTriggerCollectionDuration": this.postTriggerCollectionDuration,
      "priority": this.priority,
      "signalCatalogArn": this.signalCatalogArn,
      "signalsToCollect": this.signalsToCollect,
      "spoolingMode": this.spoolingMode,
      "startTime": this.startTime,
      "tags": this.tags.renderTags(),
      "targetArn": this.targetArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCampaign.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCampaignPropsToCloudFormation(props);
  }
}

export namespace CfnCampaign {
  /**
   * Information about a signal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html
   */
  export interface SignalInformationProperty {
    /**
     * (Optional) The maximum number of samples to collect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-maxsamplecount
     */
    readonly maxSampleCount?: number;

    /**
     * (Optional) The minimum duration of time (in milliseconds) between two triggering events to collect data.
     *
     * > If a signal changes often, you might want to collect data at a slower rate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-minimumsamplingintervalms
     */
    readonly minimumSamplingIntervalMs?: number;

    /**
     * The name of the signal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-name
     */
    readonly name: string;
  }

  /**
   * The destination where the AWS IoT FleetWise campaign sends data.
   *
   * You can send data to be stored in Amazon S3 or Amazon Timestream .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-datadestinationconfig.html
   */
  export interface DataDestinationConfigProperty {
    /**
     * (Optional) The Amazon S3 bucket where the AWS IoT FleetWise campaign sends data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-datadestinationconfig.html#cfn-iotfleetwise-campaign-datadestinationconfig-s3config
     */
    readonly s3Config?: cdk.IResolvable | CfnCampaign.S3ConfigProperty;

    /**
     * (Optional) The Amazon Timestream table where the campaign sends data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-datadestinationconfig.html#cfn-iotfleetwise-campaign-datadestinationconfig-timestreamconfig
     */
    readonly timestreamConfig?: cdk.IResolvable | CfnCampaign.TimestreamConfigProperty;
  }

  /**
   * The Amazon S3 bucket where the AWS IoT FleetWise campaign sends data.
   *
   * Amazon S3 is an object storage service that stores data as objects within buckets. For more information, see [Creating, configuring, and working with Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-buckets-s3.html) in the *Amazon Simple Storage Service User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-s3config.html
   */
  export interface S3ConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-s3config.html#cfn-iotfleetwise-campaign-s3config-bucketarn
     */
    readonly bucketArn: string;

    /**
     * (Optional) Specify the format that files are saved in the Amazon S3 bucket.
     *
     * You can save files in an Apache Parquet or JSON format.
     *
     * - Parquet - Store data in a columnar storage file format. Parquet is optimal for fast data retrieval and can reduce costs. This option is selected by default.
     * - JSON - Store data in a standard text-based JSON file format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-s3config.html#cfn-iotfleetwise-campaign-s3config-dataformat
     */
    readonly dataFormat?: string;

    /**
     * (Optional) Enter an S3 bucket prefix.
     *
     * The prefix is the string of characters after the bucket name and before the object name. You can use the prefix to organize data stored in Amazon S3 buckets. For more information, see [Organizing objects using prefixes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) in the *Amazon Simple Storage Service User Guide* .
     *
     * By default, AWS IoT FleetWise sets the prefix `processed-data/year=YY/month=MM/date=DD/hour=HH/` (in UTC) to data it delivers to Amazon S3 . You can enter a prefix to append it to this default prefix. For example, if you enter the prefix `vehicles` , the prefix will be `vehicles/processed-data/year=YY/month=MM/date=DD/hour=HH/` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-s3config.html#cfn-iotfleetwise-campaign-s3config-prefix
     */
    readonly prefix?: string;

    /**
     * (Optional) By default, stored data is compressed as a .gzip file. Compressed files have a reduced file size, which can optimize the cost of data storage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-s3config.html#cfn-iotfleetwise-campaign-s3config-storagecompressionformat
     */
    readonly storageCompressionFormat?: string;
  }

  /**
   * The Amazon Timestream table where the AWS IoT FleetWise campaign sends data.
   *
   * Timestream stores and organizes data to optimize query processing time and to reduce storage costs. For more information, see [Data modeling](https://docs.aws.amazon.com/timestream/latest/developerguide/data-modeling.html) in the *Amazon Timestream Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timestreamconfig.html
   */
  export interface TimestreamConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the task execution role that grants AWS IoT FleetWise permission to deliver data to the Amazon Timestream table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timestreamconfig.html#cfn-iotfleetwise-campaign-timestreamconfig-executionrolearn
     */
    readonly executionRoleArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Timestream table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timestreamconfig.html#cfn-iotfleetwise-campaign-timestreamconfig-timestreamtablearn
     */
    readonly timestreamTableArn: string;
  }

  /**
   * Specifies what data to collect and how often or when to collect it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html
   */
  export interface CollectionSchemeProperty {
    /**
     * (Optional) Information about a collection scheme that uses a simple logical expression to recognize what data to collect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html#cfn-iotfleetwise-campaign-collectionscheme-conditionbasedcollectionscheme
     */
    readonly conditionBasedCollectionScheme?: CfnCampaign.ConditionBasedCollectionSchemeProperty | cdk.IResolvable;

    /**
     * (Optional) Information about a collection scheme that uses a time period to decide how often to collect data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html#cfn-iotfleetwise-campaign-collectionscheme-timebasedcollectionscheme
     */
    readonly timeBasedCollectionScheme?: cdk.IResolvable | CfnCampaign.TimeBasedCollectionSchemeProperty;
  }

  /**
   * Information about a collection scheme that uses a time period to decide how often to collect data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timebasedcollectionscheme.html
   */
  export interface TimeBasedCollectionSchemeProperty {
    /**
     * The time period (in milliseconds) to decide how often to collect data.
     *
     * For example, if the time period is `60000` , the Edge Agent software collects data once every minute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timebasedcollectionscheme.html#cfn-iotfleetwise-campaign-timebasedcollectionscheme-periodms
     */
    readonly periodMs: number;
  }

  /**
   * Information about a collection scheme that uses a simple logical expression to recognize what data to collect.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html
   */
  export interface ConditionBasedCollectionSchemeProperty {
    /**
     * (Optional) Specifies the version of the conditional expression language.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-conditionlanguageversion
     */
    readonly conditionLanguageVersion?: number;

    /**
     * The logical expression used to recognize what data to collect.
     *
     * For example, `$variable.Vehicle.OutsideAirTemperature >= 105.0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-expression
     */
    readonly expression: string;

    /**
     * (Optional) The minimum duration of time between two triggering events to collect data, in milliseconds.
     *
     * > If a signal changes often, you might want to collect data at a slower rate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-minimumtriggerintervalms
     */
    readonly minimumTriggerIntervalMs?: number;

    /**
     * (Optional) Whether to collect data for all triggering events ( `ALWAYS` ).
     *
     * Specify ( `RISING_EDGE` ), or specify only when the condition first evaluates to false. For example, triggering on "AirbagDeployed"; Users aren't interested on triggering when the airbag is already exploded; they only care about the change from not deployed => deployed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-triggermode
     */
    readonly triggerMode?: string;
  }
}

/**
 * Properties for defining a `CfnCampaign`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html
 */
export interface CfnCampaignProps {
  /**
   * Specifies how to update a campaign. The action can be one of the following:.
   *
   * - `APPROVE` - To approve delivering a data collection scheme to vehicles.
   * - `SUSPEND` - To suspend collecting signal data. The campaign is deleted from vehicles and all vehicles in the suspended campaign will stop sending data.
   * - `RESUME` - To reactivate the `SUSPEND` campaign. The campaign is redeployed to all vehicles and the vehicles will resume sending data.
   * - `UPDATE` - To update a campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-action
   */
  readonly action: string;

  /**
   * The data collection scheme associated with the campaign.
   *
   * You can specify a scheme that collects data based on time or an event.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-collectionscheme
   */
  readonly collectionScheme: CfnCampaign.CollectionSchemeProperty | cdk.IResolvable;

  /**
   * (Optional) Whether to compress signals before transmitting data to AWS IoT FleetWise .
   *
   * If you don't want to compress the signals, use `OFF` . If it's not specified, `SNAPPY` is used.
   *
   * Default: `SNAPPY`
   *
   * @default - "OFF"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-compression
   */
  readonly compression?: string;

  /**
   * (Optional) The destination where the campaign sends data.
   *
   * You can choose to send data to be stored in Amazon S3 or Amazon Timestream .
   *
   * Amazon S3 optimizes the cost of data storage and provides additional mechanisms to use vehicle data, such as data lakes, centralized data storage, data processing pipelines, and analytics. AWS IoT FleetWise supports at-least-once file delivery to S3. Your vehicle data is stored on multiple AWS IoT FleetWise servers for redundancy and high availability.
   *
   * You can use Amazon Timestream to access and analyze time series data, and Timestream to query vehicle data so that you can identify trends and patterns.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-datadestinationconfigs
   */
  readonly dataDestinationConfigs?: Array<CfnCampaign.DataDestinationConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * (Optional) A list of vehicle attributes to associate with a campaign.
   *
   * Enrich the data with specified vehicle attributes. For example, add `make` and `model` to the campaign, and AWS IoT FleetWise will associate the data with those attributes as dimensions in Amazon Timestream . You can then query the data against `make` and `model` .
   *
   * Default: An empty array
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-dataextradimensions
   */
  readonly dataExtraDimensions?: Array<string>;

  /**
   * (Optional) The description of the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-description
   */
  readonly description?: string;

  /**
   * (Optional) Option for a vehicle to send diagnostic trouble codes to AWS IoT FleetWise .
   *
   * If you want to send diagnostic trouble codes, use `SEND_ACTIVE_DTCS` . If it's not specified, `OFF` is used.
   *
   * Default: `OFF`
   *
   * @default - "OFF"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-diagnosticsmode
   */
  readonly diagnosticsMode?: string;

  /**
   * (Optional) The time the campaign expires, in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * Vehicle data isn't collected after the campaign expires.
   *
   * Default: 253402214400 (December 31, 9999, 00:00:00 UTC)
   *
   * @default - "253402214400"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-expirytime
   */
  readonly expiryTime?: string;

  /**
   * The name of a campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-name
   */
  readonly name: string;

  /**
   * (Optional) How long (in milliseconds) to collect raw data after a triggering event initiates the collection.
   *
   * If it's not specified, `0` is used.
   *
   * Default: `0`
   *
   * @default - 0
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-posttriggercollectionduration
   */
  readonly postTriggerCollectionDuration?: number;

  /**
   * (Optional) A number indicating the priority of one campaign over another campaign for a certain vehicle or fleet.
   *
   * A campaign with the lowest value is deployed to vehicles before any other campaigns. If it's not specified, `0` is used.
   *
   * Default: `0`
   *
   * @default - 0
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-priority
   */
  readonly priority?: number;

  /**
   * The Amazon Resource Name (ARN) of the signal catalog associated with the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalcatalogarn
   */
  readonly signalCatalogArn: string;

  /**
   * (Optional) A list of information about signals to collect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalstocollect
   */
  readonly signalsToCollect?: Array<cdk.IResolvable | CfnCampaign.SignalInformationProperty> | cdk.IResolvable;

  /**
   * (Optional) Whether to store collected data after a vehicle lost a connection with the cloud.
   *
   * After a connection is re-established, the data is automatically forwarded to AWS IoT FleetWise . If you want to store collected data when a vehicle loses connection with the cloud, use `TO_DISK` . If it's not specified, `OFF` is used.
   *
   * Default: `OFF`
   *
   * @default - "OFF"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-spoolingmode
   */
  readonly spoolingMode?: string;

  /**
   * (Optional) The time, in milliseconds, to deliver a campaign after it was approved.
   *
   * If it's not specified, `0` is used.
   *
   * Default: `0`
   *
   * @default - "0"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-starttime
   */
  readonly startTime?: string;

  /**
   * (Optional) Metadata that can be used to manage the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The Amazon Resource Name (ARN) of a vehicle or fleet to which the campaign is deployed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-targetarn
   */
  readonly targetArn: string;
}

/**
 * Determine whether the given properties match those of a `SignalInformationProperty`
 *
 * @param properties - the TypeScript properties of a `SignalInformationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignSignalInformationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxSampleCount", cdk.validateNumber)(properties.maxSampleCount));
  errors.collect(cdk.propertyValidator("minimumSamplingIntervalMs", cdk.validateNumber)(properties.minimumSamplingIntervalMs));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SignalInformationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignSignalInformationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignSignalInformationPropertyValidator(properties).assertSuccess();
  return {
    "MaxSampleCount": cdk.numberToCloudFormation(properties.maxSampleCount),
    "MinimumSamplingIntervalMs": cdk.numberToCloudFormation(properties.minimumSamplingIntervalMs),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnCampaignSignalInformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.SignalInformationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.SignalInformationProperty>();
  ret.addPropertyResult("maxSampleCount", "MaxSampleCount", (properties.MaxSampleCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSampleCount) : undefined));
  ret.addPropertyResult("minimumSamplingIntervalMs", "MinimumSamplingIntervalMs", (properties.MinimumSamplingIntervalMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumSamplingIntervalMs) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignS3ConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketArn", cdk.requiredValidator)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("bucketArn", cdk.validateString)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("dataFormat", cdk.validateString)(properties.dataFormat));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("storageCompressionFormat", cdk.validateString)(properties.storageCompressionFormat));
  return errors.wrap("supplied properties not correct for \"S3ConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignS3ConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignS3ConfigPropertyValidator(properties).assertSuccess();
  return {
    "BucketArn": cdk.stringToCloudFormation(properties.bucketArn),
    "DataFormat": cdk.stringToCloudFormation(properties.dataFormat),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "StorageCompressionFormat": cdk.stringToCloudFormation(properties.storageCompressionFormat)
  };
}

// @ts-ignore TS6133
function CfnCampaignS3ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.S3ConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.S3ConfigProperty>();
  ret.addPropertyResult("bucketArn", "BucketArn", (properties.BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.BucketArn) : undefined));
  ret.addPropertyResult("dataFormat", "DataFormat", (properties.DataFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DataFormat) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("storageCompressionFormat", "StorageCompressionFormat", (properties.StorageCompressionFormat != null ? cfn_parse.FromCloudFormation.getString(properties.StorageCompressionFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestreamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TimestreamConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignTimestreamConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.requiredValidator)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("timestreamTableArn", cdk.requiredValidator)(properties.timestreamTableArn));
  errors.collect(cdk.propertyValidator("timestreamTableArn", cdk.validateString)(properties.timestreamTableArn));
  return errors.wrap("supplied properties not correct for \"TimestreamConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignTimestreamConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignTimestreamConfigPropertyValidator(properties).assertSuccess();
  return {
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "TimestreamTableArn": cdk.stringToCloudFormation(properties.timestreamTableArn)
  };
}

// @ts-ignore TS6133
function CfnCampaignTimestreamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.TimestreamConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.TimestreamConfigProperty>();
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("timestreamTableArn", "TimestreamTableArn", (properties.TimestreamTableArn != null ? cfn_parse.FromCloudFormation.getString(properties.TimestreamTableArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataDestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DataDestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignDataDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Config", CfnCampaignS3ConfigPropertyValidator)(properties.s3Config));
  errors.collect(cdk.propertyValidator("timestreamConfig", CfnCampaignTimestreamConfigPropertyValidator)(properties.timestreamConfig));
  return errors.wrap("supplied properties not correct for \"DataDestinationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignDataDestinationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignDataDestinationConfigPropertyValidator(properties).assertSuccess();
  return {
    "S3Config": convertCfnCampaignS3ConfigPropertyToCloudFormation(properties.s3Config),
    "TimestreamConfig": convertCfnCampaignTimestreamConfigPropertyToCloudFormation(properties.timestreamConfig)
  };
}

// @ts-ignore TS6133
function CfnCampaignDataDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.DataDestinationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.DataDestinationConfigProperty>();
  ret.addPropertyResult("s3Config", "S3Config", (properties.S3Config != null ? CfnCampaignS3ConfigPropertyFromCloudFormation(properties.S3Config) : undefined));
  ret.addPropertyResult("timestreamConfig", "TimestreamConfig", (properties.TimestreamConfig != null ? CfnCampaignTimestreamConfigPropertyFromCloudFormation(properties.TimestreamConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimeBasedCollectionSchemeProperty`
 *
 * @param properties - the TypeScript properties of a `TimeBasedCollectionSchemeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignTimeBasedCollectionSchemePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("periodMs", cdk.requiredValidator)(properties.periodMs));
  errors.collect(cdk.propertyValidator("periodMs", cdk.validateNumber)(properties.periodMs));
  return errors.wrap("supplied properties not correct for \"TimeBasedCollectionSchemeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignTimeBasedCollectionSchemePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignTimeBasedCollectionSchemePropertyValidator(properties).assertSuccess();
  return {
    "PeriodMs": cdk.numberToCloudFormation(properties.periodMs)
  };
}

// @ts-ignore TS6133
function CfnCampaignTimeBasedCollectionSchemePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.TimeBasedCollectionSchemeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.TimeBasedCollectionSchemeProperty>();
  ret.addPropertyResult("periodMs", "PeriodMs", (properties.PeriodMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.PeriodMs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionBasedCollectionSchemeProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionBasedCollectionSchemeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignConditionBasedCollectionSchemePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditionLanguageVersion", cdk.validateNumber)(properties.conditionLanguageVersion));
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("minimumTriggerIntervalMs", cdk.validateNumber)(properties.minimumTriggerIntervalMs));
  errors.collect(cdk.propertyValidator("triggerMode", cdk.validateString)(properties.triggerMode));
  return errors.wrap("supplied properties not correct for \"ConditionBasedCollectionSchemeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignConditionBasedCollectionSchemePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignConditionBasedCollectionSchemePropertyValidator(properties).assertSuccess();
  return {
    "ConditionLanguageVersion": cdk.numberToCloudFormation(properties.conditionLanguageVersion),
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "MinimumTriggerIntervalMs": cdk.numberToCloudFormation(properties.minimumTriggerIntervalMs),
    "TriggerMode": cdk.stringToCloudFormation(properties.triggerMode)
  };
}

// @ts-ignore TS6133
function CfnCampaignConditionBasedCollectionSchemePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.ConditionBasedCollectionSchemeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.ConditionBasedCollectionSchemeProperty>();
  ret.addPropertyResult("conditionLanguageVersion", "ConditionLanguageVersion", (properties.ConditionLanguageVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConditionLanguageVersion) : undefined));
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("minimumTriggerIntervalMs", "MinimumTriggerIntervalMs", (properties.MinimumTriggerIntervalMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumTriggerIntervalMs) : undefined));
  ret.addPropertyResult("triggerMode", "TriggerMode", (properties.TriggerMode != null ? cfn_parse.FromCloudFormation.getString(properties.TriggerMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CollectionSchemeProperty`
 *
 * @param properties - the TypeScript properties of a `CollectionSchemeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCollectionSchemePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditionBasedCollectionScheme", CfnCampaignConditionBasedCollectionSchemePropertyValidator)(properties.conditionBasedCollectionScheme));
  errors.collect(cdk.propertyValidator("timeBasedCollectionScheme", CfnCampaignTimeBasedCollectionSchemePropertyValidator)(properties.timeBasedCollectionScheme));
  return errors.wrap("supplied properties not correct for \"CollectionSchemeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCollectionSchemePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCollectionSchemePropertyValidator(properties).assertSuccess();
  return {
    "ConditionBasedCollectionScheme": convertCfnCampaignConditionBasedCollectionSchemePropertyToCloudFormation(properties.conditionBasedCollectionScheme),
    "TimeBasedCollectionScheme": convertCfnCampaignTimeBasedCollectionSchemePropertyToCloudFormation(properties.timeBasedCollectionScheme)
  };
}

// @ts-ignore TS6133
function CfnCampaignCollectionSchemePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CollectionSchemeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CollectionSchemeProperty>();
  ret.addPropertyResult("conditionBasedCollectionScheme", "ConditionBasedCollectionScheme", (properties.ConditionBasedCollectionScheme != null ? CfnCampaignConditionBasedCollectionSchemePropertyFromCloudFormation(properties.ConditionBasedCollectionScheme) : undefined));
  ret.addPropertyResult("timeBasedCollectionScheme", "TimeBasedCollectionScheme", (properties.TimeBasedCollectionScheme != null ? CfnCampaignTimeBasedCollectionSchemePropertyFromCloudFormation(properties.TimeBasedCollectionScheme) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCampaignProps`
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("collectionScheme", cdk.requiredValidator)(properties.collectionScheme));
  errors.collect(cdk.propertyValidator("collectionScheme", CfnCampaignCollectionSchemePropertyValidator)(properties.collectionScheme));
  errors.collect(cdk.propertyValidator("compression", cdk.validateString)(properties.compression));
  errors.collect(cdk.propertyValidator("dataDestinationConfigs", cdk.listValidator(CfnCampaignDataDestinationConfigPropertyValidator))(properties.dataDestinationConfigs));
  errors.collect(cdk.propertyValidator("dataExtraDimensions", cdk.listValidator(cdk.validateString))(properties.dataExtraDimensions));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("diagnosticsMode", cdk.validateString)(properties.diagnosticsMode));
  errors.collect(cdk.propertyValidator("expiryTime", cdk.validateString)(properties.expiryTime));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("postTriggerCollectionDuration", cdk.validateNumber)(properties.postTriggerCollectionDuration));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("signalCatalogArn", cdk.requiredValidator)(properties.signalCatalogArn));
  errors.collect(cdk.propertyValidator("signalCatalogArn", cdk.validateString)(properties.signalCatalogArn));
  errors.collect(cdk.propertyValidator("signalsToCollect", cdk.listValidator(CfnCampaignSignalInformationPropertyValidator))(properties.signalsToCollect));
  errors.collect(cdk.propertyValidator("spoolingMode", cdk.validateString)(properties.spoolingMode));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"CfnCampaignProps\"");
}

// @ts-ignore TS6133
function convertCfnCampaignPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignPropsValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "CollectionScheme": convertCfnCampaignCollectionSchemePropertyToCloudFormation(properties.collectionScheme),
    "Compression": cdk.stringToCloudFormation(properties.compression),
    "DataDestinationConfigs": cdk.listMapper(convertCfnCampaignDataDestinationConfigPropertyToCloudFormation)(properties.dataDestinationConfigs),
    "DataExtraDimensions": cdk.listMapper(cdk.stringToCloudFormation)(properties.dataExtraDimensions),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DiagnosticsMode": cdk.stringToCloudFormation(properties.diagnosticsMode),
    "ExpiryTime": cdk.stringToCloudFormation(properties.expiryTime),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PostTriggerCollectionDuration": cdk.numberToCloudFormation(properties.postTriggerCollectionDuration),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "SignalCatalogArn": cdk.stringToCloudFormation(properties.signalCatalogArn),
    "SignalsToCollect": cdk.listMapper(convertCfnCampaignSignalInformationPropertyToCloudFormation)(properties.signalsToCollect),
    "SpoolingMode": cdk.stringToCloudFormation(properties.spoolingMode),
    "StartTime": cdk.stringToCloudFormation(properties.startTime),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnCampaignPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaignProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaignProps>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("collectionScheme", "CollectionScheme", (properties.CollectionScheme != null ? CfnCampaignCollectionSchemePropertyFromCloudFormation(properties.CollectionScheme) : undefined));
  ret.addPropertyResult("compression", "Compression", (properties.Compression != null ? cfn_parse.FromCloudFormation.getString(properties.Compression) : undefined));
  ret.addPropertyResult("dataDestinationConfigs", "DataDestinationConfigs", (properties.DataDestinationConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnCampaignDataDestinationConfigPropertyFromCloudFormation)(properties.DataDestinationConfigs) : undefined));
  ret.addPropertyResult("dataExtraDimensions", "DataExtraDimensions", (properties.DataExtraDimensions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DataExtraDimensions) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("diagnosticsMode", "DiagnosticsMode", (properties.DiagnosticsMode != null ? cfn_parse.FromCloudFormation.getString(properties.DiagnosticsMode) : undefined));
  ret.addPropertyResult("expiryTime", "ExpiryTime", (properties.ExpiryTime != null ? cfn_parse.FromCloudFormation.getString(properties.ExpiryTime) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("postTriggerCollectionDuration", "PostTriggerCollectionDuration", (properties.PostTriggerCollectionDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.PostTriggerCollectionDuration) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("signalCatalogArn", "SignalCatalogArn", (properties.SignalCatalogArn != null ? cfn_parse.FromCloudFormation.getString(properties.SignalCatalogArn) : undefined));
  ret.addPropertyResult("signalsToCollect", "SignalsToCollect", (properties.SignalsToCollect != null ? cfn_parse.FromCloudFormation.getArray(CfnCampaignSignalInformationPropertyFromCloudFormation)(properties.SignalsToCollect) : undefined));
  ret.addPropertyResult("spoolingMode", "SpoolingMode", (properties.SpoolingMode != null ? cfn_parse.FromCloudFormation.getString(properties.SpoolingMode) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates the decoder manifest associated with a model manifest. To create a decoder manifest, the following must be true:.
 *
 * - Every signal decoder has a unique name.
 * - Each signal decoder is associated with a network interface.
 * - Each network interface has a unique ID.
 * - The signal decoders are specified in the model manifest.
 *
 * @cloudformationResource AWS::IoTFleetWise::DecoderManifest
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html
 */
export class CfnDecoderManifest extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTFleetWise::DecoderManifest";

  /**
   * Build a CfnDecoderManifest from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDecoderManifest {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDecoderManifestPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDecoderManifest(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the decoder manifest.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the decoder manifest was created in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The time the decoder manifest was last updated in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute LastModificationTime
   */
  public readonly attrLastModificationTime: string;

  /**
   * (Optional) A brief description of the decoder manifest.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of a vehicle model (model manifest) associated with the decoder manifest.
   */
  public modelManifestArn: string;

  /**
   * The name of the decoder manifest.
   */
  public name: string;

  /**
   * (Optional) A list of information about available network interfaces.
   */
  public networkInterfaces?: Array<cdk.IResolvable | CfnDecoderManifest.NetworkInterfacesItemsProperty> | cdk.IResolvable;

  /**
   * (Optional) A list of information about signal decoders.
   */
  public signalDecoders?: Array<cdk.IResolvable | CfnDecoderManifest.SignalDecodersItemsProperty> | cdk.IResolvable;

  /**
   * (Optional) The state of the decoder manifest.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * (Optional) Metadata that can be used to manage the decoder manifest.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDecoderManifestProps) {
    super(scope, id, {
      "type": CfnDecoderManifest.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "modelManifestArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastModificationTime = cdk.Token.asString(this.getAtt("LastModificationTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.modelManifestArn = props.modelManifestArn;
    this.name = props.name;
    this.networkInterfaces = props.networkInterfaces;
    this.signalDecoders = props.signalDecoders;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::DecoderManifest", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "modelManifestArn": this.modelManifestArn,
      "name": this.name,
      "networkInterfaces": this.networkInterfaces,
      "signalDecoders": this.signalDecoders,
      "status": this.status,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDecoderManifest.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDecoderManifestPropsToCloudFormation(props);
  }
}

export namespace CfnDecoderManifest {
  /**
   * Information about signal decoder using the Controller Area Network (CAN) protocol.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignaldecoder.html
   */
  export interface CanSignalDecoderProperty {
    /**
     * Information about a single controller area network (CAN) signal and the messages it receives and transmits.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignaldecoder.html#cfn-iotfleetwise-decodermanifest-cansignaldecoder-cansignal
     */
    readonly canSignal: CfnDecoderManifest.CanSignalProperty | cdk.IResolvable;

    /**
     * The fully qualified name of a signal decoder as defined in a vehicle model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignaldecoder.html#cfn-iotfleetwise-decodermanifest-cansignaldecoder-fullyqualifiedname
     */
    readonly fullyQualifiedName: string;

    /**
     * The ID of a network interface that specifies what network protocol a vehicle follows.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignaldecoder.html#cfn-iotfleetwise-decodermanifest-cansignaldecoder-interfaceid
     */
    readonly interfaceId: string;

    /**
     * The network protocol for the vehicle.
     *
     * For example, `CAN_SIGNAL` specifies a protocol that defines how data is communicated between electronic control units (ECUs). `OBD_SIGNAL` specifies a protocol that defines how self-diagnostic data is communicated between ECUs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignaldecoder.html#cfn-iotfleetwise-decodermanifest-cansignaldecoder-type
     */
    readonly type: string;
  }

  /**
   * (Optional) Information about a single controller area network (CAN) signal and the messages it receives and transmits.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html
   */
  export interface CanSignalProperty {
    /**
     * A multiplier used to decode the CAN message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-factor
     */
    readonly factor: string;

    /**
     * Whether the byte ordering of a CAN message is big-endian.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-isbigendian
     */
    readonly isBigEndian: string;

    /**
     * Whether the message data is specified as a signed value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-issigned
     */
    readonly isSigned: string;

    /**
     * How many bytes of data are in the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-length
     */
    readonly length: string;

    /**
     * The ID of the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-messageid
     */
    readonly messageId: string;

    /**
     * (Optional) The name of the signal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-name
     */
    readonly name?: string;

    /**
     * The offset used to calculate the signal value.
     *
     * Combined with factor, the calculation is `value = raw_value * factor + offset` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-offset
     */
    readonly offset: string;

    /**
     * Indicates the beginning of the CAN message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-startbit
     */
    readonly startBit: string;
  }

  /**
   * A list of information about signal decoders.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignaldecoder.html
   */
  export interface ObdSignalDecoderProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignaldecoder.html#cfn-iotfleetwise-decodermanifest-obdsignaldecoder-fullyqualifiedname
     */
    readonly fullyQualifiedName: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignaldecoder.html#cfn-iotfleetwise-decodermanifest-obdsignaldecoder-interfaceid
     */
    readonly interfaceId: string;

    /**
     * Information about signal messages using the on-board diagnostics (OBD) II protocol in a vehicle.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignaldecoder.html#cfn-iotfleetwise-decodermanifest-obdsignaldecoder-obdsignal
     */
    readonly obdSignal: cdk.IResolvable | CfnDecoderManifest.ObdSignalProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignaldecoder.html#cfn-iotfleetwise-decodermanifest-obdsignaldecoder-type
     */
    readonly type: string;
  }

  /**
   * Information about signal messages using the on-board diagnostics (OBD) II protocol in a vehicle.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html
   */
  export interface ObdSignalProperty {
    /**
     * (Optional) The number of bits to mask in a message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bitmasklength
     */
    readonly bitMaskLength?: string;

    /**
     * (Optional) The number of positions to shift bits in the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bitrightshift
     */
    readonly bitRightShift?: string;

    /**
     * The length of a message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bytelength
     */
    readonly byteLength: string;

    /**
     * The offset used to calculate the signal value.
     *
     * Combined with scaling, the calculation is `value = raw_value * scaling + offset` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-offset
     */
    readonly offset: string;

    /**
     * The diagnostic code used to request data from a vehicle for this signal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-pid
     */
    readonly pid: string;

    /**
     * The length of the requested data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-pidresponselength
     */
    readonly pidResponseLength: string;

    /**
     * A multiplier used to decode the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-scaling
     */
    readonly scaling: string;

    /**
     * The mode of operation (diagnostic service) in a message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-servicemode
     */
    readonly serviceMode: string;

    /**
     * Indicates the beginning of the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-startbyte
     */
    readonly startByte: string;
  }

  /**
   * Information about a signal decoder.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html
   */
  export interface SignalDecodersItemsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-cansignal
     */
    readonly canSignal?: CfnDecoderManifest.CanSignalProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-fullyqualifiedname
     */
    readonly fullyQualifiedName: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-interfaceid
     */
    readonly interfaceId: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-obdsignal
     */
    readonly obdSignal?: cdk.IResolvable | CfnDecoderManifest.ObdSignalProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-type
     */
    readonly type: string;
  }

  /**
   * Represents a node and its specifications in an in-vehicle communication network.
   *
   * All signal decoders must be associated with a network node.
   *
   * To return this information about all the network interfaces specified in a decoder manifest, use the [ListDecoderManifestNetworkInterfaces](https://docs.aws.amazon.com/iot-fleetwise/latest/APIReference/API_ListDecoderManifestNetworkInterfaces.html) in the *AWS IoT FleetWise API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cannetworkinterface.html
   */
  export interface CanNetworkInterfaceProperty {
    /**
     * Information about a network interface specified by the Controller Area Network (CAN) protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cannetworkinterface.html#cfn-iotfleetwise-decodermanifest-cannetworkinterface-caninterface
     */
    readonly canInterface: CfnDecoderManifest.CanInterfaceProperty | cdk.IResolvable;

    /**
     * The ID of the network interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cannetworkinterface.html#cfn-iotfleetwise-decodermanifest-cannetworkinterface-interfaceid
     */
    readonly interfaceId: string;

    /**
     * The network protocol for the vehicle.
     *
     * For example, `CAN_SIGNAL` specifies a protocol that defines how data is communicated between electronic control units (ECUs). `OBD_SIGNAL` specifies a protocol that defines how self-diagnostic data is communicated between ECUs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cannetworkinterface.html#cfn-iotfleetwise-decodermanifest-cannetworkinterface-type
     */
    readonly type: string;
  }

  /**
   * A single controller area network (CAN) device interface.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html
   */
  export interface CanInterfaceProperty {
    /**
     * The unique name of the interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-name
     */
    readonly name: string;

    /**
     * (Optional) The name of the communication protocol for the interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-protocolname
     */
    readonly protocolName?: string;

    /**
     * (Optional) The version of the communication protocol for the interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-protocolversion
     */
    readonly protocolVersion?: string;
  }

  /**
   * Information about a network interface specified by the On-board diagnostic (OBD) II protocol.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdnetworkinterface.html
   */
  export interface ObdNetworkInterfaceProperty {
    /**
     * The ID of the network interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdnetworkinterface.html#cfn-iotfleetwise-decodermanifest-obdnetworkinterface-interfaceid
     */
    readonly interfaceId: string;

    /**
     * (Optional) Information about a network interface specified by the On-board diagnostic (OBD) II protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdnetworkinterface.html#cfn-iotfleetwise-decodermanifest-obdnetworkinterface-obdinterface
     */
    readonly obdInterface: cdk.IResolvable | CfnDecoderManifest.ObdInterfaceProperty;

    /**
     * The network protocol for the vehicle.
     *
     * For example, `CAN_SIGNAL` specifies a protocol that defines how data is communicated between electronic control units (ECUs). `OBD_SIGNAL` specifies a protocol that defines how self-diagnostic data is communicated between ECUs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdnetworkinterface.html#cfn-iotfleetwise-decodermanifest-obdnetworkinterface-type
     */
    readonly type: string;
  }

  /**
   * A network interface that specifies the On-board diagnostic (OBD) II network protocol.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html
   */
  export interface ObdInterfaceProperty {
    /**
     * (Optional) The maximum number message requests per diagnostic trouble code per second.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-dtcrequestintervalseconds
     */
    readonly dtcRequestIntervalSeconds?: string;

    /**
     * (Optional) Whether the vehicle has a transmission control module (TCM).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-hastransmissionecu
     */
    readonly hasTransmissionEcu?: string;

    /**
     * The name of the interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-name
     */
    readonly name: string;

    /**
     * (Optional) The standard OBD II PID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-obdstandard
     */
    readonly obdStandard?: string;

    /**
     * (Optional) The maximum number message requests per second.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-pidrequestintervalseconds
     */
    readonly pidRequestIntervalSeconds?: string;

    /**
     * The ID of the message requesting vehicle data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-requestmessageid
     */
    readonly requestMessageId: string;

    /**
     * (Optional) Whether to use extended IDs in the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-useextendedids
     */
    readonly useExtendedIds?: string;
  }

  /**
   * (Optional) A list of information about available network interfaces.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html
   */
  export interface NetworkInterfacesItemsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-caninterface
     */
    readonly canInterface?: CfnDecoderManifest.CanInterfaceProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-interfaceid
     */
    readonly interfaceId: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-obdinterface
     */
    readonly obdInterface?: cdk.IResolvable | CfnDecoderManifest.ObdInterfaceProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnDecoderManifest`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html
 */
export interface CfnDecoderManifestProps {
  /**
   * (Optional) A brief description of the decoder manifest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of a vehicle model (model manifest) associated with the decoder manifest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-modelmanifestarn
   */
  readonly modelManifestArn: string;

  /**
   * The name of the decoder manifest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-name
   */
  readonly name: string;

  /**
   * (Optional) A list of information about available network interfaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-networkinterfaces
   */
  readonly networkInterfaces?: Array<cdk.IResolvable | CfnDecoderManifest.NetworkInterfacesItemsProperty> | cdk.IResolvable;

  /**
   * (Optional) A list of information about signal decoders.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-signaldecoders
   */
  readonly signalDecoders?: Array<cdk.IResolvable | CfnDecoderManifest.SignalDecodersItemsProperty> | cdk.IResolvable;

  /**
   * (Optional) The state of the decoder manifest.
   *
   * If the status is `ACTIVE` , the decoder manifest can't be edited. If the status is marked `DRAFT` , you can edit the decoder manifest.
   *
   * @default - "DRAFT"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-status
   */
  readonly status?: string;

  /**
   * (Optional) Metadata that can be used to manage the decoder manifest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CanSignalProperty`
 *
 * @param properties - the TypeScript properties of a `CanSignalProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestCanSignalPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("factor", cdk.requiredValidator)(properties.factor));
  errors.collect(cdk.propertyValidator("factor", cdk.validateString)(properties.factor));
  errors.collect(cdk.propertyValidator("isBigEndian", cdk.requiredValidator)(properties.isBigEndian));
  errors.collect(cdk.propertyValidator("isBigEndian", cdk.validateString)(properties.isBigEndian));
  errors.collect(cdk.propertyValidator("isSigned", cdk.requiredValidator)(properties.isSigned));
  errors.collect(cdk.propertyValidator("isSigned", cdk.validateString)(properties.isSigned));
  errors.collect(cdk.propertyValidator("length", cdk.requiredValidator)(properties.length));
  errors.collect(cdk.propertyValidator("length", cdk.validateString)(properties.length));
  errors.collect(cdk.propertyValidator("messageId", cdk.requiredValidator)(properties.messageId));
  errors.collect(cdk.propertyValidator("messageId", cdk.validateString)(properties.messageId));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("offset", cdk.requiredValidator)(properties.offset));
  errors.collect(cdk.propertyValidator("offset", cdk.validateString)(properties.offset));
  errors.collect(cdk.propertyValidator("startBit", cdk.requiredValidator)(properties.startBit));
  errors.collect(cdk.propertyValidator("startBit", cdk.validateString)(properties.startBit));
  return errors.wrap("supplied properties not correct for \"CanSignalProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestCanSignalPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestCanSignalPropertyValidator(properties).assertSuccess();
  return {
    "Factor": cdk.stringToCloudFormation(properties.factor),
    "IsBigEndian": cdk.stringToCloudFormation(properties.isBigEndian),
    "IsSigned": cdk.stringToCloudFormation(properties.isSigned),
    "Length": cdk.stringToCloudFormation(properties.length),
    "MessageId": cdk.stringToCloudFormation(properties.messageId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Offset": cdk.stringToCloudFormation(properties.offset),
    "StartBit": cdk.stringToCloudFormation(properties.startBit)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestCanSignalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.CanSignalProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.CanSignalProperty>();
  ret.addPropertyResult("factor", "Factor", (properties.Factor != null ? cfn_parse.FromCloudFormation.getString(properties.Factor) : undefined));
  ret.addPropertyResult("isBigEndian", "IsBigEndian", (properties.IsBigEndian != null ? cfn_parse.FromCloudFormation.getString(properties.IsBigEndian) : undefined));
  ret.addPropertyResult("isSigned", "IsSigned", (properties.IsSigned != null ? cfn_parse.FromCloudFormation.getString(properties.IsSigned) : undefined));
  ret.addPropertyResult("length", "Length", (properties.Length != null ? cfn_parse.FromCloudFormation.getString(properties.Length) : undefined));
  ret.addPropertyResult("messageId", "MessageId", (properties.MessageId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("offset", "Offset", (properties.Offset != null ? cfn_parse.FromCloudFormation.getString(properties.Offset) : undefined));
  ret.addPropertyResult("startBit", "StartBit", (properties.StartBit != null ? cfn_parse.FromCloudFormation.getString(properties.StartBit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CanSignalDecoderProperty`
 *
 * @param properties - the TypeScript properties of a `CanSignalDecoderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestCanSignalDecoderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("canSignal", cdk.requiredValidator)(properties.canSignal));
  errors.collect(cdk.propertyValidator("canSignal", CfnDecoderManifestCanSignalPropertyValidator)(properties.canSignal));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.requiredValidator)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.validateString)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.requiredValidator)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.validateString)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CanSignalDecoderProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestCanSignalDecoderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestCanSignalDecoderPropertyValidator(properties).assertSuccess();
  return {
    "CanSignal": convertCfnDecoderManifestCanSignalPropertyToCloudFormation(properties.canSignal),
    "FullyQualifiedName": cdk.stringToCloudFormation(properties.fullyQualifiedName),
    "InterfaceId": cdk.stringToCloudFormation(properties.interfaceId),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestCanSignalDecoderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.CanSignalDecoderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.CanSignalDecoderProperty>();
  ret.addPropertyResult("canSignal", "CanSignal", (properties.CanSignal != null ? CfnDecoderManifestCanSignalPropertyFromCloudFormation(properties.CanSignal) : undefined));
  ret.addPropertyResult("fullyQualifiedName", "FullyQualifiedName", (properties.FullyQualifiedName != null ? cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName) : undefined));
  ret.addPropertyResult("interfaceId", "InterfaceId", (properties.InterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.InterfaceId) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObdSignalProperty`
 *
 * @param properties - the TypeScript properties of a `ObdSignalProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestObdSignalPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bitMaskLength", cdk.validateString)(properties.bitMaskLength));
  errors.collect(cdk.propertyValidator("bitRightShift", cdk.validateString)(properties.bitRightShift));
  errors.collect(cdk.propertyValidator("byteLength", cdk.requiredValidator)(properties.byteLength));
  errors.collect(cdk.propertyValidator("byteLength", cdk.validateString)(properties.byteLength));
  errors.collect(cdk.propertyValidator("offset", cdk.requiredValidator)(properties.offset));
  errors.collect(cdk.propertyValidator("offset", cdk.validateString)(properties.offset));
  errors.collect(cdk.propertyValidator("pid", cdk.requiredValidator)(properties.pid));
  errors.collect(cdk.propertyValidator("pid", cdk.validateString)(properties.pid));
  errors.collect(cdk.propertyValidator("pidResponseLength", cdk.requiredValidator)(properties.pidResponseLength));
  errors.collect(cdk.propertyValidator("pidResponseLength", cdk.validateString)(properties.pidResponseLength));
  errors.collect(cdk.propertyValidator("scaling", cdk.requiredValidator)(properties.scaling));
  errors.collect(cdk.propertyValidator("scaling", cdk.validateString)(properties.scaling));
  errors.collect(cdk.propertyValidator("serviceMode", cdk.requiredValidator)(properties.serviceMode));
  errors.collect(cdk.propertyValidator("serviceMode", cdk.validateString)(properties.serviceMode));
  errors.collect(cdk.propertyValidator("startByte", cdk.requiredValidator)(properties.startByte));
  errors.collect(cdk.propertyValidator("startByte", cdk.validateString)(properties.startByte));
  return errors.wrap("supplied properties not correct for \"ObdSignalProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestObdSignalPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestObdSignalPropertyValidator(properties).assertSuccess();
  return {
    "BitMaskLength": cdk.stringToCloudFormation(properties.bitMaskLength),
    "BitRightShift": cdk.stringToCloudFormation(properties.bitRightShift),
    "ByteLength": cdk.stringToCloudFormation(properties.byteLength),
    "Offset": cdk.stringToCloudFormation(properties.offset),
    "Pid": cdk.stringToCloudFormation(properties.pid),
    "PidResponseLength": cdk.stringToCloudFormation(properties.pidResponseLength),
    "Scaling": cdk.stringToCloudFormation(properties.scaling),
    "ServiceMode": cdk.stringToCloudFormation(properties.serviceMode),
    "StartByte": cdk.stringToCloudFormation(properties.startByte)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestObdSignalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDecoderManifest.ObdSignalProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.ObdSignalProperty>();
  ret.addPropertyResult("bitMaskLength", "BitMaskLength", (properties.BitMaskLength != null ? cfn_parse.FromCloudFormation.getString(properties.BitMaskLength) : undefined));
  ret.addPropertyResult("bitRightShift", "BitRightShift", (properties.BitRightShift != null ? cfn_parse.FromCloudFormation.getString(properties.BitRightShift) : undefined));
  ret.addPropertyResult("byteLength", "ByteLength", (properties.ByteLength != null ? cfn_parse.FromCloudFormation.getString(properties.ByteLength) : undefined));
  ret.addPropertyResult("offset", "Offset", (properties.Offset != null ? cfn_parse.FromCloudFormation.getString(properties.Offset) : undefined));
  ret.addPropertyResult("pid", "Pid", (properties.Pid != null ? cfn_parse.FromCloudFormation.getString(properties.Pid) : undefined));
  ret.addPropertyResult("pidResponseLength", "PidResponseLength", (properties.PidResponseLength != null ? cfn_parse.FromCloudFormation.getString(properties.PidResponseLength) : undefined));
  ret.addPropertyResult("scaling", "Scaling", (properties.Scaling != null ? cfn_parse.FromCloudFormation.getString(properties.Scaling) : undefined));
  ret.addPropertyResult("serviceMode", "ServiceMode", (properties.ServiceMode != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceMode) : undefined));
  ret.addPropertyResult("startByte", "StartByte", (properties.StartByte != null ? cfn_parse.FromCloudFormation.getString(properties.StartByte) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObdSignalDecoderProperty`
 *
 * @param properties - the TypeScript properties of a `ObdSignalDecoderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestObdSignalDecoderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.requiredValidator)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.validateString)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.requiredValidator)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.validateString)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("obdSignal", cdk.requiredValidator)(properties.obdSignal));
  errors.collect(cdk.propertyValidator("obdSignal", CfnDecoderManifestObdSignalPropertyValidator)(properties.obdSignal));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ObdSignalDecoderProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestObdSignalDecoderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestObdSignalDecoderPropertyValidator(properties).assertSuccess();
  return {
    "FullyQualifiedName": cdk.stringToCloudFormation(properties.fullyQualifiedName),
    "InterfaceId": cdk.stringToCloudFormation(properties.interfaceId),
    "ObdSignal": convertCfnDecoderManifestObdSignalPropertyToCloudFormation(properties.obdSignal),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestObdSignalDecoderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDecoderManifest.ObdSignalDecoderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.ObdSignalDecoderProperty>();
  ret.addPropertyResult("fullyQualifiedName", "FullyQualifiedName", (properties.FullyQualifiedName != null ? cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName) : undefined));
  ret.addPropertyResult("interfaceId", "InterfaceId", (properties.InterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.InterfaceId) : undefined));
  ret.addPropertyResult("obdSignal", "ObdSignal", (properties.ObdSignal != null ? CfnDecoderManifestObdSignalPropertyFromCloudFormation(properties.ObdSignal) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SignalDecodersItemsProperty`
 *
 * @param properties - the TypeScript properties of a `SignalDecodersItemsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestSignalDecodersItemsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("canSignal", CfnDecoderManifestCanSignalPropertyValidator)(properties.canSignal));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.requiredValidator)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.validateString)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.requiredValidator)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.validateString)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("obdSignal", CfnDecoderManifestObdSignalPropertyValidator)(properties.obdSignal));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SignalDecodersItemsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestSignalDecodersItemsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestSignalDecodersItemsPropertyValidator(properties).assertSuccess();
  return {
    "CanSignal": convertCfnDecoderManifestCanSignalPropertyToCloudFormation(properties.canSignal),
    "FullyQualifiedName": cdk.stringToCloudFormation(properties.fullyQualifiedName),
    "InterfaceId": cdk.stringToCloudFormation(properties.interfaceId),
    "ObdSignal": convertCfnDecoderManifestObdSignalPropertyToCloudFormation(properties.obdSignal),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestSignalDecodersItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDecoderManifest.SignalDecodersItemsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.SignalDecodersItemsProperty>();
  ret.addPropertyResult("canSignal", "CanSignal", (properties.CanSignal != null ? CfnDecoderManifestCanSignalPropertyFromCloudFormation(properties.CanSignal) : undefined));
  ret.addPropertyResult("fullyQualifiedName", "FullyQualifiedName", (properties.FullyQualifiedName != null ? cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName) : undefined));
  ret.addPropertyResult("interfaceId", "InterfaceId", (properties.InterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.InterfaceId) : undefined));
  ret.addPropertyResult("obdSignal", "ObdSignal", (properties.ObdSignal != null ? CfnDecoderManifestObdSignalPropertyFromCloudFormation(properties.ObdSignal) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CanInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `CanInterfaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestCanInterfacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("protocolName", cdk.validateString)(properties.protocolName));
  errors.collect(cdk.propertyValidator("protocolVersion", cdk.validateString)(properties.protocolVersion));
  return errors.wrap("supplied properties not correct for \"CanInterfaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestCanInterfacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestCanInterfacePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProtocolName": cdk.stringToCloudFormation(properties.protocolName),
    "ProtocolVersion": cdk.stringToCloudFormation(properties.protocolVersion)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestCanInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.CanInterfaceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.CanInterfaceProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("protocolName", "ProtocolName", (properties.ProtocolName != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolName) : undefined));
  ret.addPropertyResult("protocolVersion", "ProtocolVersion", (properties.ProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CanNetworkInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `CanNetworkInterfaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestCanNetworkInterfacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("canInterface", cdk.requiredValidator)(properties.canInterface));
  errors.collect(cdk.propertyValidator("canInterface", CfnDecoderManifestCanInterfacePropertyValidator)(properties.canInterface));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.requiredValidator)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.validateString)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CanNetworkInterfaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestCanNetworkInterfacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestCanNetworkInterfacePropertyValidator(properties).assertSuccess();
  return {
    "CanInterface": convertCfnDecoderManifestCanInterfacePropertyToCloudFormation(properties.canInterface),
    "InterfaceId": cdk.stringToCloudFormation(properties.interfaceId),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestCanNetworkInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.CanNetworkInterfaceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.CanNetworkInterfaceProperty>();
  ret.addPropertyResult("canInterface", "CanInterface", (properties.CanInterface != null ? CfnDecoderManifestCanInterfacePropertyFromCloudFormation(properties.CanInterface) : undefined));
  ret.addPropertyResult("interfaceId", "InterfaceId", (properties.InterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.InterfaceId) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObdInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `ObdInterfaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestObdInterfacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dtcRequestIntervalSeconds", cdk.validateString)(properties.dtcRequestIntervalSeconds));
  errors.collect(cdk.propertyValidator("hasTransmissionEcu", cdk.validateString)(properties.hasTransmissionEcu));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("obdStandard", cdk.validateString)(properties.obdStandard));
  errors.collect(cdk.propertyValidator("pidRequestIntervalSeconds", cdk.validateString)(properties.pidRequestIntervalSeconds));
  errors.collect(cdk.propertyValidator("requestMessageId", cdk.requiredValidator)(properties.requestMessageId));
  errors.collect(cdk.propertyValidator("requestMessageId", cdk.validateString)(properties.requestMessageId));
  errors.collect(cdk.propertyValidator("useExtendedIds", cdk.validateString)(properties.useExtendedIds));
  return errors.wrap("supplied properties not correct for \"ObdInterfaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestObdInterfacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestObdInterfacePropertyValidator(properties).assertSuccess();
  return {
    "DtcRequestIntervalSeconds": cdk.stringToCloudFormation(properties.dtcRequestIntervalSeconds),
    "HasTransmissionEcu": cdk.stringToCloudFormation(properties.hasTransmissionEcu),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ObdStandard": cdk.stringToCloudFormation(properties.obdStandard),
    "PidRequestIntervalSeconds": cdk.stringToCloudFormation(properties.pidRequestIntervalSeconds),
    "RequestMessageId": cdk.stringToCloudFormation(properties.requestMessageId),
    "UseExtendedIds": cdk.stringToCloudFormation(properties.useExtendedIds)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestObdInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDecoderManifest.ObdInterfaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.ObdInterfaceProperty>();
  ret.addPropertyResult("dtcRequestIntervalSeconds", "DtcRequestIntervalSeconds", (properties.DtcRequestIntervalSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.DtcRequestIntervalSeconds) : undefined));
  ret.addPropertyResult("hasTransmissionEcu", "HasTransmissionEcu", (properties.HasTransmissionEcu != null ? cfn_parse.FromCloudFormation.getString(properties.HasTransmissionEcu) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("obdStandard", "ObdStandard", (properties.ObdStandard != null ? cfn_parse.FromCloudFormation.getString(properties.ObdStandard) : undefined));
  ret.addPropertyResult("pidRequestIntervalSeconds", "PidRequestIntervalSeconds", (properties.PidRequestIntervalSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.PidRequestIntervalSeconds) : undefined));
  ret.addPropertyResult("requestMessageId", "RequestMessageId", (properties.RequestMessageId != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMessageId) : undefined));
  ret.addPropertyResult("useExtendedIds", "UseExtendedIds", (properties.UseExtendedIds != null ? cfn_parse.FromCloudFormation.getString(properties.UseExtendedIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObdNetworkInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `ObdNetworkInterfaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestObdNetworkInterfacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("interfaceId", cdk.requiredValidator)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.validateString)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("obdInterface", cdk.requiredValidator)(properties.obdInterface));
  errors.collect(cdk.propertyValidator("obdInterface", CfnDecoderManifestObdInterfacePropertyValidator)(properties.obdInterface));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ObdNetworkInterfaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestObdNetworkInterfacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestObdNetworkInterfacePropertyValidator(properties).assertSuccess();
  return {
    "InterfaceId": cdk.stringToCloudFormation(properties.interfaceId),
    "ObdInterface": convertCfnDecoderManifestObdInterfacePropertyToCloudFormation(properties.obdInterface),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestObdNetworkInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDecoderManifest.ObdNetworkInterfaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.ObdNetworkInterfaceProperty>();
  ret.addPropertyResult("interfaceId", "InterfaceId", (properties.InterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.InterfaceId) : undefined));
  ret.addPropertyResult("obdInterface", "ObdInterface", (properties.ObdInterface != null ? CfnDecoderManifestObdInterfacePropertyFromCloudFormation(properties.ObdInterface) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkInterfacesItemsProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfacesItemsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestNetworkInterfacesItemsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("canInterface", CfnDecoderManifestCanInterfacePropertyValidator)(properties.canInterface));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.requiredValidator)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("interfaceId", cdk.validateString)(properties.interfaceId));
  errors.collect(cdk.propertyValidator("obdInterface", CfnDecoderManifestObdInterfacePropertyValidator)(properties.obdInterface));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"NetworkInterfacesItemsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestNetworkInterfacesItemsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestNetworkInterfacesItemsPropertyValidator(properties).assertSuccess();
  return {
    "CanInterface": convertCfnDecoderManifestCanInterfacePropertyToCloudFormation(properties.canInterface),
    "InterfaceId": cdk.stringToCloudFormation(properties.interfaceId),
    "ObdInterface": convertCfnDecoderManifestObdInterfacePropertyToCloudFormation(properties.obdInterface),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestNetworkInterfacesItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDecoderManifest.NetworkInterfacesItemsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.NetworkInterfacesItemsProperty>();
  ret.addPropertyResult("canInterface", "CanInterface", (properties.CanInterface != null ? CfnDecoderManifestCanInterfacePropertyFromCloudFormation(properties.CanInterface) : undefined));
  ret.addPropertyResult("interfaceId", "InterfaceId", (properties.InterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.InterfaceId) : undefined));
  ret.addPropertyResult("obdInterface", "ObdInterface", (properties.ObdInterface != null ? CfnDecoderManifestObdInterfacePropertyFromCloudFormation(properties.ObdInterface) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDecoderManifestProps`
 *
 * @param properties - the TypeScript properties of a `CfnDecoderManifestProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDecoderManifestPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("modelManifestArn", cdk.requiredValidator)(properties.modelManifestArn));
  errors.collect(cdk.propertyValidator("modelManifestArn", cdk.validateString)(properties.modelManifestArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkInterfaces", cdk.listValidator(CfnDecoderManifestNetworkInterfacesItemsPropertyValidator))(properties.networkInterfaces));
  errors.collect(cdk.propertyValidator("signalDecoders", cdk.listValidator(CfnDecoderManifestSignalDecodersItemsPropertyValidator))(properties.signalDecoders));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDecoderManifestProps\"");
}

// @ts-ignore TS6133
function convertCfnDecoderManifestPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDecoderManifestPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ModelManifestArn": cdk.stringToCloudFormation(properties.modelManifestArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkInterfaces": cdk.listMapper(convertCfnDecoderManifestNetworkInterfacesItemsPropertyToCloudFormation)(properties.networkInterfaces),
    "SignalDecoders": cdk.listMapper(convertCfnDecoderManifestSignalDecodersItemsPropertyToCloudFormation)(properties.signalDecoders),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDecoderManifestPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifestProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifestProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("modelManifestArn", "ModelManifestArn", (properties.ModelManifestArn != null ? cfn_parse.FromCloudFormation.getString(properties.ModelManifestArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkInterfaces", "NetworkInterfaces", (properties.NetworkInterfaces != null ? cfn_parse.FromCloudFormation.getArray(CfnDecoderManifestNetworkInterfacesItemsPropertyFromCloudFormation)(properties.NetworkInterfaces) : undefined));
  ret.addPropertyResult("signalDecoders", "SignalDecoders", (properties.SignalDecoders != null ? cfn_parse.FromCloudFormation.getArray(CfnDecoderManifestSignalDecodersItemsPropertyFromCloudFormation)(properties.SignalDecoders) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a fleet that represents a group of vehicles.
 *
 * > You must create both a signal catalog and vehicles before you can create a fleet.
 *
 * For more information, see [Fleets](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/fleets.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Fleet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html
 */
export class CfnFleet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTFleetWise::Fleet";

  /**
   * Build a CfnFleet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFleetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFleet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the created fleet.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the fleet was created in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The time the fleet was last updated, in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute LastModificationTime
   */
  public readonly attrLastModificationTime: string;

  /**
   * (Optional) A brief description of the fleet.
   */
  public description?: string;

  /**
   * The unique ID of the fleet.
   */
  public id: string;

  /**
   * The ARN of the signal catalog associated with the fleet.
   */
  public signalCatalogArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * (Optional) Metadata that can be used to manage the fleet.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFleetProps) {
    super(scope, id, {
      "type": CfnFleet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "id", this);
    cdk.requireProperty(props, "signalCatalogArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastModificationTime = cdk.Token.asString(this.getAtt("LastModificationTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.id = props.id;
    this.signalCatalogArn = props.signalCatalogArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::Fleet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "id": this.id,
      "signalCatalogArn": this.signalCatalogArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFleet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFleetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html
 */
export interface CfnFleetProps {
  /**
   * (Optional) A brief description of the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-description
   */
  readonly description?: string;

  /**
   * The unique ID of the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-id
   */
  readonly id: string;

  /**
   * The ARN of the signal catalog associated with the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-signalcatalogarn
   */
  readonly signalCatalogArn: string;

  /**
   * (Optional) Metadata that can be used to manage the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnFleetProps`
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("signalCatalogArn", cdk.requiredValidator)(properties.signalCatalogArn));
  errors.collect(cdk.propertyValidator("signalCatalogArn", cdk.validateString)(properties.signalCatalogArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFleetProps\"");
}

// @ts-ignore TS6133
function convertCfnFleetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Id": cdk.stringToCloudFormation(properties.id),
    "SignalCatalogArn": cdk.stringToCloudFormation(properties.signalCatalogArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFleetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("signalCatalogArn", "SignalCatalogArn", (properties.SignalCatalogArn != null ? cfn_parse.FromCloudFormation.getString(properties.SignalCatalogArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a vehicle model (model manifest) that specifies signals (attributes, branches, sensors, and actuators).
 *
 * For more information, see [Vehicle models](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/vehicle-models.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::ModelManifest
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html
 */
export class CfnModelManifest extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTFleetWise::ModelManifest";

  /**
   * Build a CfnModelManifest from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModelManifest {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnModelManifestPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnModelManifest(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the vehicle model.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the vehicle model was created, in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The time the vehicle model was last updated, in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute LastModificationTime
   */
  public readonly attrLastModificationTime: string;

  /**
   * (Optional) A brief description of the vehicle model.
   */
  public description?: string;

  /**
   * The name of the vehicle model.
   */
  public name: string;

  /**
   * (Optional) A list of nodes, which are a general abstraction of signals.
   */
  public nodes?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the signal catalog associated with the vehicle model.
   */
  public signalCatalogArn: string;

  /**
   * (Optional) The state of the vehicle model.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * (Optional) Metadata that can be used to manage the vehicle model.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnModelManifestProps) {
    super(scope, id, {
      "type": CfnModelManifest.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "signalCatalogArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastModificationTime = cdk.Token.asString(this.getAtt("LastModificationTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.nodes = props.nodes;
    this.signalCatalogArn = props.signalCatalogArn;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::ModelManifest", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "nodes": this.nodes,
      "signalCatalogArn": this.signalCatalogArn,
      "status": this.status,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnModelManifest.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnModelManifestPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnModelManifest`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html
 */
export interface CfnModelManifestProps {
  /**
   * (Optional) A brief description of the vehicle model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-description
   */
  readonly description?: string;

  /**
   * The name of the vehicle model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-name
   */
  readonly name: string;

  /**
   * (Optional) A list of nodes, which are a general abstraction of signals.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-nodes
   */
  readonly nodes?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the signal catalog associated with the vehicle model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-signalcatalogarn
   */
  readonly signalCatalogArn: string;

  /**
   * (Optional) The state of the vehicle model.
   *
   * If the status is `ACTIVE` , the vehicle model can't be edited. If the status is `DRAFT` , you can edit the vehicle model.
   *
   * @default - "DRAFT"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-status
   */
  readonly status?: string;

  /**
   * (Optional) Metadata that can be used to manage the vehicle model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnModelManifestProps`
 *
 * @param properties - the TypeScript properties of a `CfnModelManifestProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnModelManifestPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("nodes", cdk.listValidator(cdk.validateString))(properties.nodes));
  errors.collect(cdk.propertyValidator("signalCatalogArn", cdk.requiredValidator)(properties.signalCatalogArn));
  errors.collect(cdk.propertyValidator("signalCatalogArn", cdk.validateString)(properties.signalCatalogArn));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnModelManifestProps\"");
}

// @ts-ignore TS6133
function convertCfnModelManifestPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnModelManifestPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Nodes": cdk.listMapper(cdk.stringToCloudFormation)(properties.nodes),
    "SignalCatalogArn": cdk.stringToCloudFormation(properties.signalCatalogArn),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnModelManifestPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnModelManifestProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnModelManifestProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("nodes", "Nodes", (properties.Nodes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Nodes) : undefined));
  ret.addPropertyResult("signalCatalogArn", "SignalCatalogArn", (properties.SignalCatalogArn != null ? cfn_parse.FromCloudFormation.getString(properties.SignalCatalogArn) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a collection of standardized signals that can be reused to create vehicle models.
 *
 * @cloudformationResource AWS::IoTFleetWise::SignalCatalog
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html
 */
export class CfnSignalCatalog extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTFleetWise::SignalCatalog";

  /**
   * Build a CfnSignalCatalog from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSignalCatalog {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSignalCatalogPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSignalCatalog(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the signal catalog.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the signal catalog was created in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The time the signal catalog was last updated in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute LastModificationTime
   */
  public readonly attrLastModificationTime: string;

  /**
   * @cloudformationAttribute NodeCounts.TotalActuators
   */
  public readonly attrNodeCountsTotalActuators: cdk.IResolvable;

  /**
   * @cloudformationAttribute NodeCounts.TotalAttributes
   */
  public readonly attrNodeCountsTotalAttributes: cdk.IResolvable;

  /**
   * @cloudformationAttribute NodeCounts.TotalBranches
   */
  public readonly attrNodeCountsTotalBranches: cdk.IResolvable;

  /**
   * @cloudformationAttribute NodeCounts.TotalNodes
   */
  public readonly attrNodeCountsTotalNodes: cdk.IResolvable;

  /**
   * @cloudformationAttribute NodeCounts.TotalSensors
   */
  public readonly attrNodeCountsTotalSensors: cdk.IResolvable;

  /**
   * (Optional) A brief description of the signal catalog.
   */
  public description?: string;

  /**
   * (Optional) The name of the signal catalog.
   */
  public name?: string;

  /**
   * (Optional) Information about the number of nodes and node types in a vehicle network.
   */
  public nodeCounts?: cdk.IResolvable | CfnSignalCatalog.NodeCountsProperty;

  /**
   * (Optional) A list of information about nodes, which are a general abstraction of signals.
   */
  public nodes?: Array<cdk.IResolvable | CfnSignalCatalog.NodeProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * (Optional) Metadata that can be used to manage the signal catalog.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSignalCatalogProps = {}) {
    super(scope, id, {
      "type": CfnSignalCatalog.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastModificationTime = cdk.Token.asString(this.getAtt("LastModificationTime", cdk.ResolutionTypeHint.STRING));
    this.attrNodeCountsTotalActuators = this.getAtt("NodeCounts.TotalActuators", cdk.ResolutionTypeHint.NUMBER);
    this.attrNodeCountsTotalAttributes = this.getAtt("NodeCounts.TotalAttributes", cdk.ResolutionTypeHint.NUMBER);
    this.attrNodeCountsTotalBranches = this.getAtt("NodeCounts.TotalBranches", cdk.ResolutionTypeHint.NUMBER);
    this.attrNodeCountsTotalNodes = this.getAtt("NodeCounts.TotalNodes", cdk.ResolutionTypeHint.NUMBER);
    this.attrNodeCountsTotalSensors = this.getAtt("NodeCounts.TotalSensors", cdk.ResolutionTypeHint.NUMBER);
    this.description = props.description;
    this.name = props.name;
    this.nodeCounts = props.nodeCounts;
    this.nodes = props.nodes;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::SignalCatalog", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "nodeCounts": this.nodeCounts,
      "nodes": this.nodes,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSignalCatalog.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSignalCatalogPropsToCloudFormation(props);
  }
}

export namespace CfnSignalCatalog {
  /**
   * Information about the number of nodes and node types in a vehicle network.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html
   */
  export interface NodeCountsProperty {
    /**
     * (Optional) The total number of nodes in a vehicle network that represent actuators.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalactuators
     */
    readonly totalActuators?: number;

    /**
     * (Optional) The total number of nodes in a vehicle network that represent attributes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalattributes
     */
    readonly totalAttributes?: number;

    /**
     * (Optional) The total number of nodes in a vehicle network that represent branches.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalbranches
     */
    readonly totalBranches?: number;

    /**
     * (Optional) The total number of nodes in a vehicle network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalnodes
     */
    readonly totalNodes?: number;

    /**
     * (Optional) The total number of nodes in a vehicle network that represent sensors.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalsensors
     */
    readonly totalSensors?: number;
  }

  /**
   * A general abstraction of a signal.
   *
   * A node can be specified as an actuator, attribute, branch, or sensor.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html
   */
  export interface NodeProperty {
    /**
     * (Optional) Information about a node specified as an actuator.
     *
     * > An actuator is a digital representation of a vehicle device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-actuator
     */
    readonly actuator?: CfnSignalCatalog.ActuatorProperty | cdk.IResolvable;

    /**
     * (Optional) Information about a node specified as an attribute.
     *
     * > An attribute represents static information about a vehicle.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-attribute
     */
    readonly attribute?: CfnSignalCatalog.AttributeProperty | cdk.IResolvable;

    /**
     * (Optional) Information about a node specified as a branch.
     *
     * > A group of signals that are defined in a hierarchical structure.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-branch
     */
    readonly branch?: CfnSignalCatalog.BranchProperty | cdk.IResolvable;

    /**
     * (Optional) An input component that reports the environmental condition of a vehicle.
     *
     * > You can collect data about fluid levels, temperatures, vibrations, or battery voltage from sensors.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-sensor
     */
    readonly sensor?: cdk.IResolvable | CfnSignalCatalog.SensorProperty;
  }

  /**
   * A signal that represents static information about the vehicle, such as engine type or manufacturing date.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html
   */
  export interface AttributeProperty {
    /**
     * (Optional) A list of possible values an attribute can be assigned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-allowedvalues
     */
    readonly allowedValues?: Array<string>;

    /**
     * (Optional) A specified value for the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-assignedvalue
     */
    readonly assignedValue?: string;

    /**
     * The specified data type of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-datatype
     */
    readonly dataType: string;

    /**
     * (Optional) The default value of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * (Optional) A brief description of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-description
     */
    readonly description?: string;

    /**
     * The fully qualified name of the attribute.
     *
     * For example, the fully qualified name of an attribute might be `Vehicle.Body.Engine.Type` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-fullyqualifiedname
     */
    readonly fullyQualifiedName: string;

    /**
     * (Optional) The specified possible maximum value of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-max
     */
    readonly max?: number;

    /**
     * (Optional) The specified possible minimum value of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-min
     */
    readonly min?: number;

    /**
     * (Optional) The scientific unit for the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-unit
     */
    readonly unit?: string;
  }

  /**
   * A group of signals that are defined in a hierarchical structure.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html
   */
  export interface BranchProperty {
    /**
     * (Optional) A brief description of the branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html#cfn-iotfleetwise-signalcatalog-branch-description
     */
    readonly description?: string;

    /**
     * The fully qualified name of the branch.
     *
     * For example, the fully qualified name of a branch might be `Vehicle.Body.Engine` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html#cfn-iotfleetwise-signalcatalog-branch-fullyqualifiedname
     */
    readonly fullyQualifiedName: string;
  }

  /**
   * An input component that reports the environmental condition of a vehicle.
   *
   * > You can collect data about fluid levels, temperatures, vibrations, or battery voltage from sensors.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html
   */
  export interface SensorProperty {
    /**
     * (Optional) A list of possible values a sensor can take.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-allowedvalues
     */
    readonly allowedValues?: Array<string>;

    /**
     * The specified data type of the sensor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-datatype
     */
    readonly dataType: string;

    /**
     * (Optional) A brief description of a sensor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-description
     */
    readonly description?: string;

    /**
     * The fully qualified name of the sensor.
     *
     * For example, the fully qualified name of a sensor might be `Vehicle.Body.Engine.Battery` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-fullyqualifiedname
     */
    readonly fullyQualifiedName: string;

    /**
     * (Optional) The specified possible maximum value of the sensor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-max
     */
    readonly max?: number;

    /**
     * (Optional) The specified possible minimum value of the sensor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-min
     */
    readonly min?: number;

    /**
     * (Optional) The scientific unit of measurement for data collected by the sensor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-unit
     */
    readonly unit?: string;
  }

  /**
   * A signal that represents a vehicle device such as the engine, heater, and door locks.
   *
   * Data from an actuator reports the state of a certain vehicle device.
   *
   * > Updating actuator data can change the state of a device. For example, you can turn on or off the heater by updating its actuator data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html
   */
  export interface ActuatorProperty {
    /**
     * (Optional) A list of possible values an actuator can take.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-allowedvalues
     */
    readonly allowedValues?: Array<string>;

    /**
     * (Optional) A specified value for the actuator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-assignedvalue
     */
    readonly assignedValue?: string;

    /**
     * The specified data type of the actuator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-datatype
     */
    readonly dataType: string;

    /**
     * (Optional) A brief description of the actuator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-description
     */
    readonly description?: string;

    /**
     * The fully qualified name of the actuator.
     *
     * For example, the fully qualified name of an actuator might be `Vehicle.Front.Left.Door.Lock` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-fullyqualifiedname
     */
    readonly fullyQualifiedName: string;

    /**
     * (Optional) The specified possible maximum value of an actuator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-max
     */
    readonly max?: number;

    /**
     * (Optional) The specified possible minimum value of an actuator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-min
     */
    readonly min?: number;

    /**
     * (Optional) The scientific unit for the actuator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-unit
     */
    readonly unit?: string;
  }
}

/**
 * Properties for defining a `CfnSignalCatalog`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html
 */
export interface CfnSignalCatalogProps {
  /**
   * (Optional) A brief description of the signal catalog.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-description
   */
  readonly description?: string;

  /**
   * (Optional) The name of the signal catalog.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-name
   */
  readonly name?: string;

  /**
   * (Optional) Information about the number of nodes and node types in a vehicle network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodecounts
   */
  readonly nodeCounts?: cdk.IResolvable | CfnSignalCatalog.NodeCountsProperty;

  /**
   * (Optional) A list of information about nodes, which are a general abstraction of signals.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodes
   */
  readonly nodes?: Array<cdk.IResolvable | CfnSignalCatalog.NodeProperty> | cdk.IResolvable;

  /**
   * (Optional) Metadata that can be used to manage the signal catalog.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `NodeCountsProperty`
 *
 * @param properties - the TypeScript properties of a `NodeCountsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalCatalogNodeCountsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("totalActuators", cdk.validateNumber)(properties.totalActuators));
  errors.collect(cdk.propertyValidator("totalAttributes", cdk.validateNumber)(properties.totalAttributes));
  errors.collect(cdk.propertyValidator("totalBranches", cdk.validateNumber)(properties.totalBranches));
  errors.collect(cdk.propertyValidator("totalNodes", cdk.validateNumber)(properties.totalNodes));
  errors.collect(cdk.propertyValidator("totalSensors", cdk.validateNumber)(properties.totalSensors));
  return errors.wrap("supplied properties not correct for \"NodeCountsProperty\"");
}

// @ts-ignore TS6133
function convertCfnSignalCatalogNodeCountsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalCatalogNodeCountsPropertyValidator(properties).assertSuccess();
  return {
    "TotalActuators": cdk.numberToCloudFormation(properties.totalActuators),
    "TotalAttributes": cdk.numberToCloudFormation(properties.totalAttributes),
    "TotalBranches": cdk.numberToCloudFormation(properties.totalBranches),
    "TotalNodes": cdk.numberToCloudFormation(properties.totalNodes),
    "TotalSensors": cdk.numberToCloudFormation(properties.totalSensors)
  };
}

// @ts-ignore TS6133
function CfnSignalCatalogNodeCountsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSignalCatalog.NodeCountsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.NodeCountsProperty>();
  ret.addPropertyResult("totalActuators", "TotalActuators", (properties.TotalActuators != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalActuators) : undefined));
  ret.addPropertyResult("totalAttributes", "TotalAttributes", (properties.TotalAttributes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalAttributes) : undefined));
  ret.addPropertyResult("totalBranches", "TotalBranches", (properties.TotalBranches != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalBranches) : undefined));
  ret.addPropertyResult("totalNodes", "TotalNodes", (properties.TotalNodes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalNodes) : undefined));
  ret.addPropertyResult("totalSensors", "TotalSensors", (properties.TotalSensors != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalSensors) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalCatalogAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedValues", cdk.listValidator(cdk.validateString))(properties.allowedValues));
  errors.collect(cdk.propertyValidator("assignedValue", cdk.validateString)(properties.assignedValue));
  errors.collect(cdk.propertyValidator("dataType", cdk.requiredValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("dataType", cdk.validateString)(properties.dataType));
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.requiredValidator)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.validateString)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"AttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnSignalCatalogAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalCatalogAttributePropertyValidator(properties).assertSuccess();
  return {
    "AllowedValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedValues),
    "AssignedValue": cdk.stringToCloudFormation(properties.assignedValue),
    "DataType": cdk.stringToCloudFormation(properties.dataType),
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FullyQualifiedName": cdk.stringToCloudFormation(properties.fullyQualifiedName),
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnSignalCatalogAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.AttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.AttributeProperty>();
  ret.addPropertyResult("allowedValues", "AllowedValues", (properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedValues) : undefined));
  ret.addPropertyResult("assignedValue", "AssignedValue", (properties.AssignedValue != null ? cfn_parse.FromCloudFormation.getString(properties.AssignedValue) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined));
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fullyQualifiedName", "FullyQualifiedName", (properties.FullyQualifiedName != null ? cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName) : undefined));
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BranchProperty`
 *
 * @param properties - the TypeScript properties of a `BranchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalCatalogBranchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.requiredValidator)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.validateString)(properties.fullyQualifiedName));
  return errors.wrap("supplied properties not correct for \"BranchProperty\"");
}

// @ts-ignore TS6133
function convertCfnSignalCatalogBranchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalCatalogBranchPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FullyQualifiedName": cdk.stringToCloudFormation(properties.fullyQualifiedName)
  };
}

// @ts-ignore TS6133
function CfnSignalCatalogBranchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.BranchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.BranchProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fullyQualifiedName", "FullyQualifiedName", (properties.FullyQualifiedName != null ? cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SensorProperty`
 *
 * @param properties - the TypeScript properties of a `SensorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalCatalogSensorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedValues", cdk.listValidator(cdk.validateString))(properties.allowedValues));
  errors.collect(cdk.propertyValidator("dataType", cdk.requiredValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("dataType", cdk.validateString)(properties.dataType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.requiredValidator)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.validateString)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"SensorProperty\"");
}

// @ts-ignore TS6133
function convertCfnSignalCatalogSensorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalCatalogSensorPropertyValidator(properties).assertSuccess();
  return {
    "AllowedValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedValues),
    "DataType": cdk.stringToCloudFormation(properties.dataType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FullyQualifiedName": cdk.stringToCloudFormation(properties.fullyQualifiedName),
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnSignalCatalogSensorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSignalCatalog.SensorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.SensorProperty>();
  ret.addPropertyResult("allowedValues", "AllowedValues", (properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedValues) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fullyQualifiedName", "FullyQualifiedName", (properties.FullyQualifiedName != null ? cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName) : undefined));
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActuatorProperty`
 *
 * @param properties - the TypeScript properties of a `ActuatorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalCatalogActuatorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedValues", cdk.listValidator(cdk.validateString))(properties.allowedValues));
  errors.collect(cdk.propertyValidator("assignedValue", cdk.validateString)(properties.assignedValue));
  errors.collect(cdk.propertyValidator("dataType", cdk.requiredValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("dataType", cdk.validateString)(properties.dataType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.requiredValidator)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("fullyQualifiedName", cdk.validateString)(properties.fullyQualifiedName));
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"ActuatorProperty\"");
}

// @ts-ignore TS6133
function convertCfnSignalCatalogActuatorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalCatalogActuatorPropertyValidator(properties).assertSuccess();
  return {
    "AllowedValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedValues),
    "AssignedValue": cdk.stringToCloudFormation(properties.assignedValue),
    "DataType": cdk.stringToCloudFormation(properties.dataType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FullyQualifiedName": cdk.stringToCloudFormation(properties.fullyQualifiedName),
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnSignalCatalogActuatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.ActuatorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.ActuatorProperty>();
  ret.addPropertyResult("allowedValues", "AllowedValues", (properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedValues) : undefined));
  ret.addPropertyResult("assignedValue", "AssignedValue", (properties.AssignedValue != null ? cfn_parse.FromCloudFormation.getString(properties.AssignedValue) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fullyQualifiedName", "FullyQualifiedName", (properties.FullyQualifiedName != null ? cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName) : undefined));
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NodeProperty`
 *
 * @param properties - the TypeScript properties of a `NodeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalCatalogNodePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actuator", CfnSignalCatalogActuatorPropertyValidator)(properties.actuator));
  errors.collect(cdk.propertyValidator("attribute", CfnSignalCatalogAttributePropertyValidator)(properties.attribute));
  errors.collect(cdk.propertyValidator("branch", CfnSignalCatalogBranchPropertyValidator)(properties.branch));
  errors.collect(cdk.propertyValidator("sensor", CfnSignalCatalogSensorPropertyValidator)(properties.sensor));
  return errors.wrap("supplied properties not correct for \"NodeProperty\"");
}

// @ts-ignore TS6133
function convertCfnSignalCatalogNodePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalCatalogNodePropertyValidator(properties).assertSuccess();
  return {
    "Actuator": convertCfnSignalCatalogActuatorPropertyToCloudFormation(properties.actuator),
    "Attribute": convertCfnSignalCatalogAttributePropertyToCloudFormation(properties.attribute),
    "Branch": convertCfnSignalCatalogBranchPropertyToCloudFormation(properties.branch),
    "Sensor": convertCfnSignalCatalogSensorPropertyToCloudFormation(properties.sensor)
  };
}

// @ts-ignore TS6133
function CfnSignalCatalogNodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSignalCatalog.NodeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.NodeProperty>();
  ret.addPropertyResult("actuator", "Actuator", (properties.Actuator != null ? CfnSignalCatalogActuatorPropertyFromCloudFormation(properties.Actuator) : undefined));
  ret.addPropertyResult("attribute", "Attribute", (properties.Attribute != null ? CfnSignalCatalogAttributePropertyFromCloudFormation(properties.Attribute) : undefined));
  ret.addPropertyResult("branch", "Branch", (properties.Branch != null ? CfnSignalCatalogBranchPropertyFromCloudFormation(properties.Branch) : undefined));
  ret.addPropertyResult("sensor", "Sensor", (properties.Sensor != null ? CfnSignalCatalogSensorPropertyFromCloudFormation(properties.Sensor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSignalCatalogProps`
 *
 * @param properties - the TypeScript properties of a `CfnSignalCatalogProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalCatalogPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("nodeCounts", CfnSignalCatalogNodeCountsPropertyValidator)(properties.nodeCounts));
  errors.collect(cdk.propertyValidator("nodes", cdk.listValidator(CfnSignalCatalogNodePropertyValidator))(properties.nodes));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSignalCatalogProps\"");
}

// @ts-ignore TS6133
function convertCfnSignalCatalogPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalCatalogPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NodeCounts": convertCfnSignalCatalogNodeCountsPropertyToCloudFormation(properties.nodeCounts),
    "Nodes": cdk.listMapper(convertCfnSignalCatalogNodePropertyToCloudFormation)(properties.nodes),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSignalCatalogPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalogProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalogProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("nodeCounts", "NodeCounts", (properties.NodeCounts != null ? CfnSignalCatalogNodeCountsPropertyFromCloudFormation(properties.NodeCounts) : undefined));
  ret.addPropertyResult("nodes", "Nodes", (properties.Nodes != null ? cfn_parse.FromCloudFormation.getArray(CfnSignalCatalogNodePropertyFromCloudFormation)(properties.Nodes) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a vehicle, which is an instance of a vehicle model (model manifest).
 *
 * Vehicles created from the same vehicle model consist of the same signals inherited from the vehicle model.
 *
 * > If you have an existing AWS IoT thing, you can use AWS IoT FleetWise to create a vehicle and collect data from your thing.
 *
 * For more information, see [Create a vehicle (console)](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/create-vehicle-console.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Vehicle
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html
 */
export class CfnVehicle extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTFleetWise::Vehicle";

  /**
   * Build a CfnVehicle from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVehicle {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVehiclePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVehicle(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the vehicle.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the vehicle was created in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The time the vehicle was last updated in seconds since epoch (January 1, 1970 at midnight UTC time).
   *
   * @cloudformationAttribute LastModificationTime
   */
  public readonly attrLastModificationTime: string;

  /**
   * (Optional) An option to create a new AWS IoT thing when creating a vehicle, or to validate an existing thing as a vehicle.
   */
  public associationBehavior?: string;

  /**
   * (Optional) Static information about a vehicle in a key-value pair.
   */
  public attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * The Amazon Resource Name (ARN) of a decoder manifest associated with the vehicle to create.
   */
  public decoderManifestArn: string;

  /**
   * The Amazon Resource Name (ARN) of the vehicle model (model manifest) to create the vehicle from.
   */
  public modelManifestArn: string;

  /**
   * The unique ID of the vehicle.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * (Optional) Metadata which can be used to manage the vehicle.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVehicleProps) {
    super(scope, id, {
      "type": CfnVehicle.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "decoderManifestArn", this);
    cdk.requireProperty(props, "modelManifestArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastModificationTime = cdk.Token.asString(this.getAtt("LastModificationTime", cdk.ResolutionTypeHint.STRING));
    this.associationBehavior = props.associationBehavior;
    this.attributes = props.attributes;
    this.decoderManifestArn = props.decoderManifestArn;
    this.modelManifestArn = props.modelManifestArn;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::Vehicle", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associationBehavior": this.associationBehavior,
      "attributes": this.attributes,
      "decoderManifestArn": this.decoderManifestArn,
      "modelManifestArn": this.modelManifestArn,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVehicle.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVehiclePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVehicle`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html
 */
export interface CfnVehicleProps {
  /**
   * (Optional) An option to create a new AWS IoT thing when creating a vehicle, or to validate an existing thing as a vehicle.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-associationbehavior
   */
  readonly associationBehavior?: string;

  /**
   * (Optional) Static information about a vehicle in a key-value pair.
   *
   * For example: `"engine Type"` : `"v6"`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-attributes
   */
  readonly attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * The Amazon Resource Name (ARN) of a decoder manifest associated with the vehicle to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-decodermanifestarn
   */
  readonly decoderManifestArn: string;

  /**
   * The Amazon Resource Name (ARN) of the vehicle model (model manifest) to create the vehicle from.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-modelmanifestarn
   */
  readonly modelManifestArn: string;

  /**
   * The unique ID of the vehicle.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-name
   */
  readonly name: string;

  /**
   * (Optional) Metadata which can be used to manage the vehicle.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnVehicleProps`
 *
 * @param properties - the TypeScript properties of a `CfnVehicleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVehiclePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associationBehavior", cdk.validateString)(properties.associationBehavior));
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("decoderManifestArn", cdk.requiredValidator)(properties.decoderManifestArn));
  errors.collect(cdk.propertyValidator("decoderManifestArn", cdk.validateString)(properties.decoderManifestArn));
  errors.collect(cdk.propertyValidator("modelManifestArn", cdk.requiredValidator)(properties.modelManifestArn));
  errors.collect(cdk.propertyValidator("modelManifestArn", cdk.validateString)(properties.modelManifestArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnVehicleProps\"");
}

// @ts-ignore TS6133
function convertCfnVehiclePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVehiclePropsValidator(properties).assertSuccess();
  return {
    "AssociationBehavior": cdk.stringToCloudFormation(properties.associationBehavior),
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "DecoderManifestArn": cdk.stringToCloudFormation(properties.decoderManifestArn),
    "ModelManifestArn": cdk.stringToCloudFormation(properties.modelManifestArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnVehiclePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVehicleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVehicleProps>();
  ret.addPropertyResult("associationBehavior", "AssociationBehavior", (properties.AssociationBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.AssociationBehavior) : undefined));
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("decoderManifestArn", "DecoderManifestArn", (properties.DecoderManifestArn != null ? cfn_parse.FromCloudFormation.getString(properties.DecoderManifestArn) : undefined));
  ret.addPropertyResult("modelManifestArn", "ModelManifestArn", (properties.ModelManifestArn != null ? cfn_parse.FromCloudFormation.getString(properties.ModelManifestArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}
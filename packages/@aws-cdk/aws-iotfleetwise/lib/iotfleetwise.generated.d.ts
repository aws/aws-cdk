import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnCampaign`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html
 */
export interface CfnCampaignProps {
    /**
     * `AWS::IoTFleetWise::Campaign.Action`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-action
     */
    readonly action: string;
    /**
     * `AWS::IoTFleetWise::Campaign.CollectionScheme`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-collectionscheme
     */
    readonly collectionScheme: CfnCampaign.CollectionSchemeProperty | cdk.IResolvable;
    /**
     * The name of a campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-name
     */
    readonly name: string;
    /**
     * The ARN of the signal catalog associated with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalcatalogarn
     */
    readonly signalCatalogArn: string;
    /**
     * The ARN of a vehicle or fleet to which the campaign is deployed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-targetarn
     */
    readonly targetArn: string;
    /**
     * `AWS::IoTFleetWise::Campaign.Compression`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-compression
     */
    readonly compression?: string;
    /**
     * `AWS::IoTFleetWise::Campaign.DataExtraDimensions`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-dataextradimensions
     */
    readonly dataExtraDimensions?: string[];
    /**
     * The description of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-description
     */
    readonly description?: string;
    /**
     * `AWS::IoTFleetWise::Campaign.DiagnosticsMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-diagnosticsmode
     */
    readonly diagnosticsMode?: string;
    /**
     * `AWS::IoTFleetWise::Campaign.ExpiryTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-expirytime
     */
    readonly expiryTime?: string;
    /**
     * `AWS::IoTFleetWise::Campaign.PostTriggerCollectionDuration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-posttriggercollectionduration
     */
    readonly postTriggerCollectionDuration?: number;
    /**
     * `AWS::IoTFleetWise::Campaign.Priority`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-priority
     */
    readonly priority?: number;
    /**
     * `AWS::IoTFleetWise::Campaign.SignalsToCollect`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalstocollect
     */
    readonly signalsToCollect?: Array<CfnCampaign.SignalInformationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * `AWS::IoTFleetWise::Campaign.SpoolingMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-spoolingmode
     */
    readonly spoolingMode?: string;
    /**
     * `AWS::IoTFleetWise::Campaign.StartTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-starttime
     */
    readonly startTime?: string;
    /**
     * `AWS::IoTFleetWise::Campaign.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTFleetWise::Campaign`
 *
 * Creates an orchestration of data collection rules. The AWS IoT FleetWise Edge Agent software running in vehicles uses campaigns to decide how to collect and transfer data to the cloud. You create campaigns in the cloud. After you or your team approve campaigns, AWS IoT FleetWise automatically deploys them to vehicles.
 *
 * For more information, see [Collect and transfer data with campaigns](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/campaigns.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Campaign
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html
 */
export declare class CfnCampaign extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::Campaign";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCampaign;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: string;
    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    readonly attrLastModificationTime: string;
    /**
     *
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * `AWS::IoTFleetWise::Campaign.Action`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-action
     */
    action: string;
    /**
     * `AWS::IoTFleetWise::Campaign.CollectionScheme`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-collectionscheme
     */
    collectionScheme: CfnCampaign.CollectionSchemeProperty | cdk.IResolvable;
    /**
     * The name of a campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-name
     */
    name: string;
    /**
     * The ARN of the signal catalog associated with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalcatalogarn
     */
    signalCatalogArn: string;
    /**
     * The ARN of a vehicle or fleet to which the campaign is deployed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-targetarn
     */
    targetArn: string;
    /**
     * `AWS::IoTFleetWise::Campaign.Compression`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-compression
     */
    compression: string | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.DataExtraDimensions`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-dataextradimensions
     */
    dataExtraDimensions: string[] | undefined;
    /**
     * The description of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-description
     */
    description: string | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.DiagnosticsMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-diagnosticsmode
     */
    diagnosticsMode: string | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.ExpiryTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-expirytime
     */
    expiryTime: string | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.PostTriggerCollectionDuration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-posttriggercollectionduration
     */
    postTriggerCollectionDuration: number | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.Priority`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-priority
     */
    priority: number | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.SignalsToCollect`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalstocollect
     */
    signalsToCollect: Array<CfnCampaign.SignalInformationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.SpoolingMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-spoolingmode
     */
    spoolingMode: string | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.StartTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-starttime
     */
    startTime: string | undefined;
    /**
     * `AWS::IoTFleetWise::Campaign.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTFleetWise::Campaign`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCampaignProps);
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
export declare namespace CfnCampaign {
    /**
     * Specifies what data to collect and how often or when to collect it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html
     */
    interface CollectionSchemeProperty {
        /**
         * Information about a collection scheme that uses a simple logical expression to recognize what data to collect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html#cfn-iotfleetwise-campaign-collectionscheme-conditionbasedcollectionscheme
         */
        readonly conditionBasedCollectionScheme?: CfnCampaign.ConditionBasedCollectionSchemeProperty | cdk.IResolvable;
        /**
         * Information about a collection scheme that uses a time period to decide how often to collect data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html#cfn-iotfleetwise-campaign-collectionscheme-timebasedcollectionscheme
         */
        readonly timeBasedCollectionScheme?: CfnCampaign.TimeBasedCollectionSchemeProperty | cdk.IResolvable;
    }
}
export declare namespace CfnCampaign {
    /**
     * Information about a collection scheme that uses a simple logical expression to recognize what data to collect.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html
     */
    interface ConditionBasedCollectionSchemeProperty {
        /**
         * Specifies the version of the conditional expression language.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-conditionlanguageversion
         */
        readonly conditionLanguageVersion?: number;
        /**
         * The logical expression used to recognize what data to collect. For example, `$variable.Vehicle.OutsideAirTemperature >= 105.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-expression
         */
        readonly expression: string;
        /**
         * The minimum duration of time between two triggering events to collect data, in milliseconds.
         *
         * > If a signal changes often, you might want to collect data at a slower rate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-minimumtriggerintervalms
         */
        readonly minimumTriggerIntervalMs?: number;
        /**
         * Whether to collect data for all triggering events ( `ALWAYS` ). Specify ( `RISING_EDGE` ), or specify only when the condition first evaluates to false. For example, triggering on "AirbagDeployed"; Users aren't interested on triggering when the airbag is already exploded; they only care about the change from not deployed => deployed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-triggermode
         */
        readonly triggerMode?: string;
    }
}
export declare namespace CfnCampaign {
    /**
     * Information about a signal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html
     */
    interface SignalInformationProperty {
        /**
         * The maximum number of samples to collect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-maxsamplecount
         */
        readonly maxSampleCount?: number;
        /**
         * The minimum duration of time (in milliseconds) between two triggering events to collect data.
         *
         * > If a signal changes often, you might want to collect data at a slower rate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-minimumsamplingintervalms
         */
        readonly minimumSamplingIntervalMs?: number;
        /**
         * The name of the signal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-name
         */
        readonly name: string;
    }
}
export declare namespace CfnCampaign {
    /**
     * Information about a collection scheme that uses a time period to decide how often to collect data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timebasedcollectionscheme.html
     */
    interface TimeBasedCollectionSchemeProperty {
        /**
         * The time period (in milliseconds) to decide how often to collect data. For example, if the time period is `60000` , the Edge Agent software collects data once every minute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timebasedcollectionscheme.html#cfn-iotfleetwise-campaign-timebasedcollectionscheme-periodms
         */
        readonly periodMs: number;
    }
}
/**
 * Properties for defining a `CfnDecoderManifest`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html
 */
export interface CfnDecoderManifestProps {
    /**
     * The ARN of a vehicle model (model manifest) associated with the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-modelmanifestarn
     */
    readonly modelManifestArn: string;
    /**
     * The name of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-name
     */
    readonly name: string;
    /**
     * A brief description of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-description
     */
    readonly description?: string;
    /**
     * `AWS::IoTFleetWise::DecoderManifest.NetworkInterfaces`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-networkinterfaces
     */
    readonly networkInterfaces?: Array<CfnDecoderManifest.NetworkInterfacesItemsProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * `AWS::IoTFleetWise::DecoderManifest.SignalDecoders`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-signaldecoders
     */
    readonly signalDecoders?: Array<CfnDecoderManifest.SignalDecodersItemsProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The state of the decoder manifest. If the status is `ACTIVE` , the decoder manifest can't be edited. If the status is marked `DRAFT` , you can edit the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-status
     */
    readonly status?: string;
    /**
     * `AWS::IoTFleetWise::DecoderManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTFleetWise::DecoderManifest`
 *
 * Creates the decoder manifest associated with a model manifest. To create a decoder manifest, the following must be true:
 *
 * - Every signal decoder has a unique name.
 * - Each signal decoder is associated with a network interface.
 * - Each network interface has a unique ID.
 * - The signal decoders are specified in the model manifest.
 *
 * @cloudformationResource AWS::IoTFleetWise::DecoderManifest
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html
 */
export declare class CfnDecoderManifest extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::DecoderManifest";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDecoderManifest;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: string;
    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    readonly attrLastModificationTime: string;
    /**
     * The ARN of a vehicle model (model manifest) associated with the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-modelmanifestarn
     */
    modelManifestArn: string;
    /**
     * The name of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-name
     */
    name: string;
    /**
     * A brief description of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-description
     */
    description: string | undefined;
    /**
     * `AWS::IoTFleetWise::DecoderManifest.NetworkInterfaces`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-networkinterfaces
     */
    networkInterfaces: Array<CfnDecoderManifest.NetworkInterfacesItemsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * `AWS::IoTFleetWise::DecoderManifest.SignalDecoders`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-signaldecoders
     */
    signalDecoders: Array<CfnDecoderManifest.SignalDecodersItemsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The state of the decoder manifest. If the status is `ACTIVE` , the decoder manifest can't be edited. If the status is marked `DRAFT` , you can edit the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-status
     */
    status: string | undefined;
    /**
     * `AWS::IoTFleetWise::DecoderManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTFleetWise::DecoderManifest`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDecoderManifestProps);
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
export declare namespace CfnDecoderManifest {
    /**
     * A single controller area network (CAN) device interface.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html
     */
    interface CanInterfaceProperty {
        /**
         * The unique name of the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-name
         */
        readonly name: string;
        /**
         * The name of the communication protocol for the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-protocolname
         */
        readonly protocolName?: string;
        /**
         * The version of the communication protocol for the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-protocolversion
         */
        readonly protocolVersion?: string;
    }
}
export declare namespace CfnDecoderManifest {
    /**
     * Information about a single controller area network (CAN) signal and the messages it receives and transmits.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html
     */
    interface CanSignalProperty {
        /**
         * A multiplier used to decode the CAN message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-factor
         */
        readonly factor: string;
        /**
         * Whether the byte ordering of a CAN message is big-endian.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-isbigendian
         */
        readonly isBigEndian: string;
        /**
         * Whether the message data is specified as a signed value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-issigned
         */
        readonly isSigned: string;
        /**
         * How many bytes of data are in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-length
         */
        readonly length: string;
        /**
         * The ID of the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-messageid
         */
        readonly messageId: string;
        /**
         * The name of the signal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-name
         */
        readonly name?: string;
        /**
         * Indicates where data appears in the CAN message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-offset
         */
        readonly offset: string;
        /**
         * Indicates the beginning of the CAN message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-startbit
         */
        readonly startBit: string;
    }
}
export declare namespace CfnDecoderManifest {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html
     */
    interface NetworkInterfacesItemsProperty {
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.CanInterface`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-caninterface
         */
        readonly canInterface?: CfnDecoderManifest.CanInterfaceProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.InterfaceId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-interfaceid
         */
        readonly interfaceId: string;
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.ObdInterface`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-obdinterface
         */
        readonly obdInterface?: CfnDecoderManifest.ObdInterfaceProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.Type`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-type
         */
        readonly type: string;
    }
}
export declare namespace CfnDecoderManifest {
    /**
     * A network interface that specifies the On-board diagnostic (OBD) II network protocol.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html
     */
    interface ObdInterfaceProperty {
        /**
         * The maximum number message requests per diagnostic trouble code per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-dtcrequestintervalseconds
         */
        readonly dtcRequestIntervalSeconds?: string;
        /**
         * Whether the vehicle has a transmission control module (TCM).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-hastransmissionecu
         */
        readonly hasTransmissionEcu?: string;
        /**
         * The name of the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-name
         */
        readonly name: string;
        /**
         * The standard OBD II PID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-obdstandard
         */
        readonly obdStandard?: string;
        /**
         * The maximum number message requests per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-pidrequestintervalseconds
         */
        readonly pidRequestIntervalSeconds?: string;
        /**
         * The ID of the message requesting vehicle data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-requestmessageid
         */
        readonly requestMessageId: string;
        /**
         * Whether to use extended IDs in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-useextendedids
         */
        readonly useExtendedIds?: string;
    }
}
export declare namespace CfnDecoderManifest {
    /**
     * Information about signal messages using the on-board diagnostics (OBD) II protocol in a vehicle.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html
     */
    interface ObdSignalProperty {
        /**
         * The number of bits to mask in a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bitmasklength
         */
        readonly bitMaskLength?: string;
        /**
         * The number of positions to shift bits in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bitrightshift
         */
        readonly bitRightShift?: string;
        /**
         * The length of a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bytelength
         */
        readonly byteLength: string;
        /**
         * Indicates where data appears in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-offset
         */
        readonly offset: string;
        /**
         * The diagnostic code used to request data from a vehicle for this signal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-pid
         */
        readonly pid: string;
        /**
         * The length of the requested data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-pidresponselength
         */
        readonly pidResponseLength: string;
        /**
         * A multiplier used to decode the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-scaling
         */
        readonly scaling: string;
        /**
         * The mode of operation (diagnostic service) in a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-servicemode
         */
        readonly serviceMode: string;
        /**
         * Indicates the beginning of the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-startbyte
         */
        readonly startByte: string;
    }
}
export declare namespace CfnDecoderManifest {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html
     */
    interface SignalDecodersItemsProperty {
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.CanSignal`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-cansignal
         */
        readonly canSignal?: CfnDecoderManifest.CanSignalProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.FullyQualifiedName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.InterfaceId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-interfaceid
         */
        readonly interfaceId: string;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.ObdSignal`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-obdsignal
         */
        readonly obdSignal?: CfnDecoderManifest.ObdSignalProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.Type`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-type
         */
        readonly type: string;
    }
}
/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html
 */
export interface CfnFleetProps {
    /**
     * The unique ID of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-id
     */
    readonly id: string;
    /**
     * The ARN of the signal catalog associated with the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-signalcatalogarn
     */
    readonly signalCatalogArn: string;
    /**
     * A brief description of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-description
     */
    readonly description?: string;
    /**
     * `AWS::IoTFleetWise::Fleet.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTFleetWise::Fleet`
 *
 * Creates a fleet that represents a group of vehicles.
 *
 * > You must create both a signal catalog and vehicles before you can create a fleet.
 *
 * For more information, see [Fleets](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/fleets.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Fleet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html
 */
export declare class CfnFleet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::Fleet";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: string;
    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    readonly attrLastModificationTime: string;
    /**
     * The unique ID of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-id
     */
    id: string;
    /**
     * The ARN of the signal catalog associated with the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-signalcatalogarn
     */
    signalCatalogArn: string;
    /**
     * A brief description of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-description
     */
    description: string | undefined;
    /**
     * `AWS::IoTFleetWise::Fleet.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTFleetWise::Fleet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFleetProps);
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
/**
 * Properties for defining a `CfnModelManifest`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html
 */
export interface CfnModelManifestProps {
    /**
     * The name of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-name
     */
    readonly name: string;
    /**
     * The ARN of the signal catalog associated with the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-signalcatalogarn
     */
    readonly signalCatalogArn: string;
    /**
     * A brief description of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-description
     */
    readonly description?: string;
    /**
     * `AWS::IoTFleetWise::ModelManifest.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-nodes
     */
    readonly nodes?: string[];
    /**
     * The state of the vehicle model. If the status is `ACTIVE` , the vehicle model can't be edited. If the status is `DRAFT` , you can edit the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-status
     */
    readonly status?: string;
    /**
     * `AWS::IoTFleetWise::ModelManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTFleetWise::ModelManifest`
 *
 * Creates a vehicle model (model manifest) that specifies signals (attributes, branches, sensors, and actuators).
 *
 * For more information, see [Vehicle models](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/vehicle-models.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::ModelManifest
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html
 */
export declare class CfnModelManifest extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::ModelManifest";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModelManifest;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: string;
    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    readonly attrLastModificationTime: string;
    /**
     * The name of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-name
     */
    name: string;
    /**
     * The ARN of the signal catalog associated with the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-signalcatalogarn
     */
    signalCatalogArn: string;
    /**
     * A brief description of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-description
     */
    description: string | undefined;
    /**
     * `AWS::IoTFleetWise::ModelManifest.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-nodes
     */
    nodes: string[] | undefined;
    /**
     * The state of the vehicle model. If the status is `ACTIVE` , the vehicle model can't be edited. If the status is `DRAFT` , you can edit the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-status
     */
    status: string | undefined;
    /**
     * `AWS::IoTFleetWise::ModelManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTFleetWise::ModelManifest`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnModelManifestProps);
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
/**
 * Properties for defining a `CfnSignalCatalog`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html
 */
export interface CfnSignalCatalogProps {
    /**
     * `AWS::IoTFleetWise::SignalCatalog.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-description
     */
    readonly description?: string;
    /**
     * The name of the signal catalog.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-name
     */
    readonly name?: string;
    /**
     * `AWS::IoTFleetWise::SignalCatalog.NodeCounts`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodecounts
     */
    readonly nodeCounts?: CfnSignalCatalog.NodeCountsProperty | cdk.IResolvable;
    /**
     * `AWS::IoTFleetWise::SignalCatalog.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodes
     */
    readonly nodes?: Array<CfnSignalCatalog.NodeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * `AWS::IoTFleetWise::SignalCatalog.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTFleetWise::SignalCatalog`
 *
 * Creates a collection of standardized signals that can be reused to create vehicle models.
 *
 * @cloudformationResource AWS::IoTFleetWise::SignalCatalog
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html
 */
export declare class CfnSignalCatalog extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::SignalCatalog";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSignalCatalog;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: string;
    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    readonly attrLastModificationTime: string;
    /**
     *
     * @cloudformationAttribute NodeCounts.TotalActuators
     */
    readonly attrNodeCountsTotalActuators: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute NodeCounts.TotalAttributes
     */
    readonly attrNodeCountsTotalAttributes: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute NodeCounts.TotalBranches
     */
    readonly attrNodeCountsTotalBranches: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute NodeCounts.TotalNodes
     */
    readonly attrNodeCountsTotalNodes: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute NodeCounts.TotalSensors
     */
    readonly attrNodeCountsTotalSensors: cdk.IResolvable;
    /**
     * `AWS::IoTFleetWise::SignalCatalog.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-description
     */
    description: string | undefined;
    /**
     * The name of the signal catalog.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-name
     */
    name: string | undefined;
    /**
     * `AWS::IoTFleetWise::SignalCatalog.NodeCounts`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodecounts
     */
    nodeCounts: CfnSignalCatalog.NodeCountsProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::IoTFleetWise::SignalCatalog.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodes
     */
    nodes: Array<CfnSignalCatalog.NodeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * `AWS::IoTFleetWise::SignalCatalog.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTFleetWise::SignalCatalog`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnSignalCatalogProps);
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
export declare namespace CfnSignalCatalog {
    /**
     * A signal that represents a vehicle device such as the engine, heater, and door locks. Data from an actuator reports the state of a certain vehicle device.
     *
     * > Updating actuator data can change the state of a device. For example, you can turn on or off the heater by updating its actuator data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html
     */
    interface ActuatorProperty {
        /**
         * A list of possible values an actuator can take.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-allowedvalues
         */
        readonly allowedValues?: string[];
        /**
         * A specified value for the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-assignedvalue
         */
        readonly assignedValue?: string;
        /**
         * The specified data type of the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-datatype
         */
        readonly dataType: string;
        /**
         * A brief description of the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the actuator. For example, the fully qualified name of an actuator might be `Vehicle.Front.Left.Door.Lock` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * The specified possible maximum value of an actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-max
         */
        readonly max?: number;
        /**
         * The specified possible minimum value of an actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-min
         */
        readonly min?: number;
        /**
         * The scientific unit for the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-unit
         */
        readonly unit?: string;
    }
}
export declare namespace CfnSignalCatalog {
    /**
     * A signal that represents static information about the vehicle, such as engine type or manufacturing date.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html
     */
    interface AttributeProperty {
        /**
         * A list of possible values an attribute can be assigned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-allowedvalues
         */
        readonly allowedValues?: string[];
        /**
         * A specified value for the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-assignedvalue
         */
        readonly assignedValue?: string;
        /**
         * The specified data type of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-datatype
         */
        readonly dataType: string;
        /**
         * The default value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * A brief description of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the attribute. For example, the fully qualified name of an attribute might be `Vehicle.Body.Engine.Type` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * The specified possible maximum value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-max
         */
        readonly max?: number;
        /**
         * The specified possible minimum value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-min
         */
        readonly min?: number;
        /**
         * The scientific unit for the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-unit
         */
        readonly unit?: string;
    }
}
export declare namespace CfnSignalCatalog {
    /**
     * A group of signals that are defined in a hierarchical structure.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html
     */
    interface BranchProperty {
        /**
         * A brief description of the branch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html#cfn-iotfleetwise-signalcatalog-branch-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the branch. For example, the fully qualified name of a branch might be `Vehicle.Body.Engine` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html#cfn-iotfleetwise-signalcatalog-branch-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
    }
}
export declare namespace CfnSignalCatalog {
    /**
     * A general abstraction of a signal. A node can be specified as an actuator, attribute, branch, or sensor.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html
     */
    interface NodeProperty {
        /**
         * Information about a node specified as an actuator.
         *
         * > An actuator is a digital representation of a vehicle device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-actuator
         */
        readonly actuator?: CfnSignalCatalog.ActuatorProperty | cdk.IResolvable;
        /**
         * Information about a node specified as an attribute.
         *
         * > An attribute represents static information about a vehicle.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-attribute
         */
        readonly attribute?: CfnSignalCatalog.AttributeProperty | cdk.IResolvable;
        /**
         * Information about a node specified as a branch.
         *
         * > A group of signals that are defined in a hierarchical structure.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-branch
         */
        readonly branch?: CfnSignalCatalog.BranchProperty | cdk.IResolvable;
        /**
         * `CfnSignalCatalog.NodeProperty.Sensor`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-sensor
         */
        readonly sensor?: CfnSignalCatalog.SensorProperty | cdk.IResolvable;
    }
}
export declare namespace CfnSignalCatalog {
    /**
     * Information about the number of nodes and node types in a vehicle network.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html
     */
    interface NodeCountsProperty {
        /**
         * The total number of nodes in a vehicle network that represent actuators.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalactuators
         */
        readonly totalActuators?: number;
        /**
         * The total number of nodes in a vehicle network that represent attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalattributes
         */
        readonly totalAttributes?: number;
        /**
         * The total number of nodes in a vehicle network that represent branches.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalbranches
         */
        readonly totalBranches?: number;
        /**
         * The total number of nodes in a vehicle network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalnodes
         */
        readonly totalNodes?: number;
        /**
         * The total number of nodes in a vehicle network that represent sensors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalsensors
         */
        readonly totalSensors?: number;
    }
}
export declare namespace CfnSignalCatalog {
    /**
     * An input component that reports the environmental condition of a vehicle.
     *
     * > You can collect data about fluid levels, temperatures, vibrations, or battery voltage from sensors.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html
     */
    interface SensorProperty {
        /**
         * A list of possible values a sensor can take.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-allowedvalues
         */
        readonly allowedValues?: string[];
        /**
         * The specified data type of the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-datatype
         */
        readonly dataType: string;
        /**
         * A brief description of a sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the sensor. For example, the fully qualified name of a sensor might be `Vehicle.Body.Engine.Battery` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * The specified possible maximum value of the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-max
         */
        readonly max?: number;
        /**
         * The specified possible minimum value of the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-min
         */
        readonly min?: number;
        /**
         * The scientific unit of measurement for data collected by the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-unit
         */
        readonly unit?: string;
    }
}
/**
 * Properties for defining a `CfnVehicle`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html
 */
export interface CfnVehicleProps {
    /**
     * The Amazon Resource Name (ARN) of a decoder manifest associated with the vehicle to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-decodermanifestarn
     */
    readonly decoderManifestArn: string;
    /**
     * The ARN of the vehicle model (model manifest) to create the vehicle from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-modelmanifestarn
     */
    readonly modelManifestArn: string;
    /**
     * `AWS::IoTFleetWise::Vehicle.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-name
     */
    readonly name: string;
    /**
     * An option to create a new AWS IoT thing when creating a vehicle, or to validate an existing thing as a vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-associationbehavior
     */
    readonly associationBehavior?: string;
    /**
     * Static information about a vehicle in a key-value pair. For example: `"engine Type"` : `"v6"`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-attributes
     */
    readonly attributes?: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * Metadata which can be used to manage the vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTFleetWise::Vehicle`
 *
 * Creates a vehicle, which is an instance of a vehicle model (model manifest). Vehicles created from the same vehicle model consist of the same signals inherited from the vehicle model.
 *
 * > If you have an existing AWS IoT Thing, you can use AWS IoT FleetWise to create a vehicle and collect data from your thing.
 *
 * For more information, see [Create a vehicle (CLI)](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/create-vehicle-cli.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Vehicle
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html
 */
export declare class CfnVehicle extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::Vehicle";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVehicle;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: string;
    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    readonly attrLastModificationTime: string;
    /**
     * The Amazon Resource Name (ARN) of a decoder manifest associated with the vehicle to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-decodermanifestarn
     */
    decoderManifestArn: string;
    /**
     * The ARN of the vehicle model (model manifest) to create the vehicle from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-modelmanifestarn
     */
    modelManifestArn: string;
    /**
     * `AWS::IoTFleetWise::Vehicle.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-name
     */
    name: string;
    /**
     * An option to create a new AWS IoT thing when creating a vehicle, or to validate an existing thing as a vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-associationbehavior
     */
    associationBehavior: string | undefined;
    /**
     * Static information about a vehicle in a key-value pair. For example: `"engine Type"` : `"v6"`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-attributes
     */
    attributes: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * Metadata which can be used to manage the vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTFleetWise::Vehicle`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVehicleProps);
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

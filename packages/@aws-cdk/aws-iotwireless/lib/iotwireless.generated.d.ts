import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnDestination`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html
 */
export interface CfnDestinationProps {
    /**
     * The rule name to send messages to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expression
     */
    readonly expression: string;
    /**
     * The type of value in `Expression` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expressiontype
     */
    readonly expressionType: string;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-name
     */
    readonly name: string;
    /**
     * The ARN of the IAM Role that authorizes the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-rolearn
     */
    readonly roleArn: string;
    /**
     * The description of the new resource. Maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-description
     */
    readonly description?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTWireless::Destination`
 *
 * Creates a new destination that maps a device message to an AWS IoT rule.
 *
 * @cloudformationResource AWS::IoTWireless::Destination
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html
 */
export declare class CfnDestination extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::Destination";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDestination;
    /**
     * The ARN of the destination created.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The rule name to send messages to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expression
     */
    expression: string;
    /**
     * The type of value in `Expression` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expressiontype
     */
    expressionType: string;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-name
     */
    name: string;
    /**
     * The ARN of the IAM Role that authorizes the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-rolearn
     */
    roleArn: string;
    /**
     * The description of the new resource. Maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-description
     */
    description: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTWireless::Destination`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDestinationProps);
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
 * Properties for defining a `CfnDeviceProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html
 */
export interface CfnDeviceProfileProps {
    /**
     * LoRaWAN device profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-lorawan
     */
    readonly loRaWan?: CfnDeviceProfile.LoRaWANDeviceProfileProperty | cdk.IResolvable;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-name
     */
    readonly name?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTWireless::DeviceProfile`
 *
 * Creates a new device profile.
 *
 * @cloudformationResource AWS::IoTWireless::DeviceProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html
 */
export declare class CfnDeviceProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::DeviceProfile";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeviceProfile;
    /**
     * The ARN of the device profile created.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the device profile created.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * LoRaWAN device profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-lorawan
     */
    loRaWan: CfnDeviceProfile.LoRaWANDeviceProfileProperty | cdk.IResolvable | undefined;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-name
     */
    name: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTWireless::DeviceProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnDeviceProfileProps);
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
export declare namespace CfnDeviceProfile {
    /**
     * LoRaWAN device profile object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html
     */
    interface LoRaWANDeviceProfileProperty {
        /**
         * The ClassBTimeout value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-classbtimeout
         */
        readonly classBTimeout?: number;
        /**
         * The ClassCTimeout value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-classctimeout
         */
        readonly classCTimeout?: number;
        /**
         * The list of values that make up the FactoryPresetFreqs value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-factorypresetfreqslist
         */
        readonly factoryPresetFreqsList?: number[] | cdk.IResolvable;
        /**
         * The MAC version (such as OTAA 1.1 or OTAA 1.0.3) to use with this device profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-macversion
         */
        readonly macVersion?: string;
        /**
         * The MaxDutyCycle value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-maxdutycycle
         */
        readonly maxDutyCycle?: number;
        /**
         * The MaxEIRP value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-maxeirp
         */
        readonly maxEirp?: number;
        /**
         * The PingSlotDR value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotdr
         */
        readonly pingSlotDr?: number;
        /**
         * The PingSlotFreq value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotfreq
         */
        readonly pingSlotFreq?: number;
        /**
         * The PingSlotPeriod value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotperiod
         */
        readonly pingSlotPeriod?: number;
        /**
         * The version of regional parameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-regparamsrevision
         */
        readonly regParamsRevision?: string;
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rfregion
         */
        readonly rfRegion?: string;
        /**
         * The RXDataRate2 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdatarate2
         */
        readonly rxDataRate2?: number;
        /**
         * The RXDelay1 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdelay1
         */
        readonly rxDelay1?: number;
        /**
         * The RXDROffset1 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdroffset1
         */
        readonly rxDrOffset1?: number;
        /**
         * The RXFreq2 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxfreq2
         */
        readonly rxFreq2?: number;
        /**
         * The Supports32BitFCnt value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supports32bitfcnt
         */
        readonly supports32BitFCnt?: boolean | cdk.IResolvable;
        /**
         * The SupportsClassB value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsclassb
         */
        readonly supportsClassB?: boolean | cdk.IResolvable;
        /**
         * The SupportsClassC value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsclassc
         */
        readonly supportsClassC?: boolean | cdk.IResolvable;
        /**
         * The SupportsJoin value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsjoin
         */
        readonly supportsJoin?: boolean | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnFuotaTask`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html
 */
export interface CfnFuotaTaskProps {
    /**
     * The S3 URI points to a firmware update image that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdateimage
     */
    readonly firmwareUpdateImage: string;
    /**
     * The firmware update role that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdaterole
     */
    readonly firmwareUpdateRole: string;
    /**
     * The LoRaWAN information used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-lorawan
     */
    readonly loRaWan: CfnFuotaTask.LoRaWANProperty | cdk.IResolvable;
    /**
     * The ID of the multicast group to associate with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatemulticastgroup
     */
    readonly associateMulticastGroup?: string;
    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatewirelessdevice
     */
    readonly associateWirelessDevice?: string;
    /**
     * The description of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-description
     */
    readonly description?: string;
    /**
     * The ID of the multicast group to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatemulticastgroup
     */
    readonly disassociateMulticastGroup?: string;
    /**
     * The ID of the wireless device to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatewirelessdevice
     */
    readonly disassociateWirelessDevice?: string;
    /**
     * The name of a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-name
     */
    readonly name?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTWireless::FuotaTask`
 *
 * A FUOTA task.
 *
 * @cloudformationResource AWS::IoTWireless::FuotaTask
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html
 */
export declare class CfnFuotaTask extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::FuotaTask";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFuotaTask;
    /**
     * The ARN of a FUOTA task
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The status of a FUOTA task.
     * @cloudformationAttribute FuotaTaskStatus
     */
    readonly attrFuotaTaskStatus: string;
    /**
     * The ID of a FUOTA task.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * Start time of a FUOTA task.
     * @cloudformationAttribute LoRaWAN.StartTime
     */
    readonly attrLoRaWanStartTime: string;
    /**
     * The S3 URI points to a firmware update image that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdateimage
     */
    firmwareUpdateImage: string;
    /**
     * The firmware update role that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdaterole
     */
    firmwareUpdateRole: string;
    /**
     * The LoRaWAN information used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-lorawan
     */
    loRaWan: CfnFuotaTask.LoRaWANProperty | cdk.IResolvable;
    /**
     * The ID of the multicast group to associate with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatemulticastgroup
     */
    associateMulticastGroup: string | undefined;
    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatewirelessdevice
     */
    associateWirelessDevice: string | undefined;
    /**
     * The description of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-description
     */
    description: string | undefined;
    /**
     * The ID of the multicast group to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatemulticastgroup
     */
    disassociateMulticastGroup: string | undefined;
    /**
     * The ID of the wireless device to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatewirelessdevice
     */
    disassociateWirelessDevice: string | undefined;
    /**
     * The name of a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-name
     */
    name: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTWireless::FuotaTask`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFuotaTaskProps);
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
export declare namespace CfnFuotaTask {
    /**
     * The LoRaWAN information used with a FUOTA task.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html
     */
    interface LoRaWANProperty {
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html#cfn-iotwireless-fuotatask-lorawan-rfregion
         */
        readonly rfRegion: string;
        /**
         * Start time of a FUOTA task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html#cfn-iotwireless-fuotatask-lorawan-starttime
         */
        readonly startTime?: string;
    }
}
/**
 * Properties for defining a `CfnMulticastGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html
 */
export interface CfnMulticastGroupProps {
    /**
     * The LoRaWAN information that is to be used with the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-lorawan
     */
    readonly loRaWan: CfnMulticastGroup.LoRaWANProperty | cdk.IResolvable;
    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-associatewirelessdevice
     */
    readonly associateWirelessDevice?: string;
    /**
     * The description of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-description
     */
    readonly description?: string;
    /**
     * The ID of the wireless device to disassociate from a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-disassociatewirelessdevice
     */
    readonly disassociateWirelessDevice?: string;
    /**
     * The name of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-name
     */
    readonly name?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTWireless::MulticastGroup`
 *
 * A multicast group.
 *
 * @cloudformationResource AWS::IoTWireless::MulticastGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html
 */
export declare class CfnMulticastGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::MulticastGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMulticastGroup;
    /**
     * The ARN of the multicast group.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the multicast group.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The number of devices that are associated to the multicast group.
     * @cloudformationAttribute LoRaWAN.NumberOfDevicesInGroup
     */
    readonly attrLoRaWanNumberOfDevicesInGroup: number;
    /**
     * The number of devices that are requested to be associated with the multicast group.
     * @cloudformationAttribute LoRaWAN.NumberOfDevicesRequested
     */
    readonly attrLoRaWanNumberOfDevicesRequested: number;
    /**
     * The status of a multicast group.
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The LoRaWAN information that is to be used with the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-lorawan
     */
    loRaWan: CfnMulticastGroup.LoRaWANProperty | cdk.IResolvable;
    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-associatewirelessdevice
     */
    associateWirelessDevice: string | undefined;
    /**
     * The description of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-description
     */
    description: string | undefined;
    /**
     * The ID of the wireless device to disassociate from a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-disassociatewirelessdevice
     */
    disassociateWirelessDevice: string | undefined;
    /**
     * The name of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-name
     */
    name: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTWireless::MulticastGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMulticastGroupProps);
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
export declare namespace CfnMulticastGroup {
    /**
     * The LoRaWAN information that is to be used with the multicast group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html
     */
    interface LoRaWANProperty {
        /**
         * DlClass for LoRaWAN. Valid values are ClassB and ClassC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-dlclass
         */
        readonly dlClass: string;
        /**
         * Number of devices that are associated to the multicast group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-numberofdevicesingroup
         */
        readonly numberOfDevicesInGroup?: number;
        /**
         * Number of devices that are requested to be associated with the multicast group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-numberofdevicesrequested
         */
        readonly numberOfDevicesRequested?: number;
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-rfregion
         */
        readonly rfRegion: string;
    }
}
/**
 * Properties for defining a `CfnNetworkAnalyzerConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html
 */
export interface CfnNetworkAnalyzerConfigurationProps {
    /**
     * Name of the network analyzer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-name
     */
    readonly name: string;
    /**
     * The description of the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-description
     */
    readonly description?: string;
    /**
     * The tags to attach to the specified resource. Tags are metadata that you can use to manage a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * Trace content for your wireless gateway and wireless device resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent
     */
    readonly traceContent?: any | cdk.IResolvable;
    /**
     * Wireless device resources to add to the network analyzer configuration. Provide the `WirelessDeviceId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessdevices
     */
    readonly wirelessDevices?: string[];
    /**
     * Wireless gateway resources to add to the network analyzer configuration. Provide the `WirelessGatewayId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessgateways
     */
    readonly wirelessGateways?: string[];
}
/**
 * A CloudFormation `AWS::IoTWireless::NetworkAnalyzerConfiguration`
 *
 * Network analyzer configuration.
 *
 * @cloudformationResource AWS::IoTWireless::NetworkAnalyzerConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html
 */
export declare class CfnNetworkAnalyzerConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::NetworkAnalyzerConfiguration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNetworkAnalyzerConfiguration;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Name of the network analyzer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-name
     */
    name: string;
    /**
     * The description of the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-description
     */
    description: string | undefined;
    /**
     * The tags to attach to the specified resource. Tags are metadata that you can use to manage a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Trace content for your wireless gateway and wireless device resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent
     */
    traceContent: any | cdk.IResolvable | undefined;
    /**
     * Wireless device resources to add to the network analyzer configuration. Provide the `WirelessDeviceId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessdevices
     */
    wirelessDevices: string[] | undefined;
    /**
     * Wireless gateway resources to add to the network analyzer configuration. Provide the `WirelessGatewayId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessgateways
     */
    wirelessGateways: string[] | undefined;
    /**
     * Create a new `AWS::IoTWireless::NetworkAnalyzerConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNetworkAnalyzerConfigurationProps);
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
export declare namespace CfnNetworkAnalyzerConfiguration {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html
     */
    interface TraceContentProperty {
        /**
         * `CfnNetworkAnalyzerConfiguration.TraceContentProperty.LogLevel`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent-loglevel
         */
        readonly logLevel?: string;
        /**
         * `CfnNetworkAnalyzerConfiguration.TraceContentProperty.WirelessDeviceFrameInfo`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent-wirelessdeviceframeinfo
         */
        readonly wirelessDeviceFrameInfo?: string;
    }
}
/**
 * Properties for defining a `CfnPartnerAccount`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html
 */
export interface CfnPartnerAccountProps {
    /**
     * `AWS::IoTWireless::PartnerAccount.AccountLinked`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-accountlinked
     */
    readonly accountLinked?: boolean | cdk.IResolvable;
    /**
     * The ID of the partner account to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partneraccountid
     */
    readonly partnerAccountId?: string;
    /**
     * `AWS::IoTWireless::PartnerAccount.PartnerType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partnertype
     */
    readonly partnerType?: string;
    /**
     * The Sidewalk account credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalk
     */
    readonly sidewalk?: CfnPartnerAccount.SidewalkAccountInfoProperty | cdk.IResolvable;
    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkResponse`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkresponse
     */
    readonly sidewalkResponse?: CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty | cdk.IResolvable;
    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkUpdate`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkupdate
     */
    readonly sidewalkUpdate?: CfnPartnerAccount.SidewalkUpdateAccountProperty | cdk.IResolvable;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTWireless::PartnerAccount`
 *
 * A partner account. If `PartnerAccountId` and `PartnerType` are `null` , returns all partner accounts.
 *
 * @cloudformationResource AWS::IoTWireless::PartnerAccount
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html
 */
export declare class CfnPartnerAccount extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::PartnerAccount";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPartnerAccount;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute Fingerprint
     */
    readonly attrFingerprint: string;
    /**
     * `AWS::IoTWireless::PartnerAccount.AccountLinked`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-accountlinked
     */
    accountLinked: boolean | cdk.IResolvable | undefined;
    /**
     * The ID of the partner account to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partneraccountid
     */
    partnerAccountId: string | undefined;
    /**
     * `AWS::IoTWireless::PartnerAccount.PartnerType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partnertype
     */
    partnerType: string | undefined;
    /**
     * The Sidewalk account credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalk
     */
    sidewalk: CfnPartnerAccount.SidewalkAccountInfoProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkResponse`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkresponse
     */
    sidewalkResponse: CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkUpdate`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkupdate
     */
    sidewalkUpdate: CfnPartnerAccount.SidewalkUpdateAccountProperty | cdk.IResolvable | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTWireless::PartnerAccount`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnPartnerAccountProps);
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
export declare namespace CfnPartnerAccount {
    /**
     * Information about a Sidewalk account.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfo.html
     */
    interface SidewalkAccountInfoProperty {
        /**
         * The Sidewalk application server private key. The application server private key is a secret key, which you should handle in a similar way as you would an application password. You can protect the application server private key by storing the value in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfo.html#cfn-iotwireless-partneraccount-sidewalkaccountinfo-appserverprivatekey
         */
        readonly appServerPrivateKey: string;
    }
}
export declare namespace CfnPartnerAccount {
    /**
     * Information about a Sidewalk account.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html
     */
    interface SidewalkAccountInfoWithFingerprintProperty {
        /**
         * The Sidewalk Amazon ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-amazonid
         */
        readonly amazonId?: string;
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-arn
         */
        readonly arn?: string;
        /**
         * The fingerprint of the Sidewalk application server private key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-fingerprint
         */
        readonly fingerprint?: string;
    }
}
export declare namespace CfnPartnerAccount {
    /**
     * Sidewalk update.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkupdateaccount.html
     */
    interface SidewalkUpdateAccountProperty {
        /**
         * The new Sidewalk application server private key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkupdateaccount.html#cfn-iotwireless-partneraccount-sidewalkupdateaccount-appserverprivatekey
         */
        readonly appServerPrivateKey?: string;
    }
}
/**
 * Properties for defining a `CfnServiceProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html
 */
export interface CfnServiceProfileProps {
    /**
     * LoRaWAN service profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-lorawan
     */
    readonly loRaWan?: CfnServiceProfile.LoRaWANServiceProfileProperty | cdk.IResolvable;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-name
     */
    readonly name?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTWireless::ServiceProfile`
 *
 * Creates a new service profile.
 *
 * @cloudformationResource AWS::IoTWireless::ServiceProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html
 */
export declare class CfnServiceProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::ServiceProfile";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceProfile;
    /**
     * The ARN of the service profile created.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the service profile created.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The ChannelMask value.
     * @cloudformationAttribute LoRaWAN.ChannelMask
     */
    readonly attrLoRaWanChannelMask: string;
    /**
     * The DevStatusReqFreq value.
     * @cloudformationAttribute LoRaWAN.DevStatusReqFreq
     */
    readonly attrLoRaWanDevStatusReqFreq: number;
    /**
     * The DLBucketSize value.
     * @cloudformationAttribute LoRaWAN.DlBucketSize
     */
    readonly attrLoRaWanDlBucketSize: number;
    /**
     * The DLRate value.
     * @cloudformationAttribute LoRaWAN.DlRate
     */
    readonly attrLoRaWanDlRate: number;
    /**
     * The DLRatePolicy value.
     * @cloudformationAttribute LoRaWAN.DlRatePolicy
     */
    readonly attrLoRaWanDlRatePolicy: string;
    /**
     * The DRMax value.
     * @cloudformationAttribute LoRaWAN.DrMax
     */
    readonly attrLoRaWanDrMax: number;
    /**
     * The DRMin value.
     * @cloudformationAttribute LoRaWAN.DrMin
     */
    readonly attrLoRaWanDrMin: number;
    /**
     * The HRAllowed value that describes whether handover roaming is allowed.
     * @cloudformationAttribute LoRaWAN.HrAllowed
     */
    readonly attrLoRaWanHrAllowed: cdk.IResolvable;
    /**
     * The MinGwDiversity value.
     * @cloudformationAttribute LoRaWAN.MinGwDiversity
     */
    readonly attrLoRaWanMinGwDiversity: number;
    /**
     * The NwkGeoLoc value.
     * @cloudformationAttribute LoRaWAN.NwkGeoLoc
     */
    readonly attrLoRaWanNwkGeoLoc: cdk.IResolvable;
    /**
     * The PRAllowed value that describes whether passive roaming is allowed.
     * @cloudformationAttribute LoRaWAN.PrAllowed
     */
    readonly attrLoRaWanPrAllowed: cdk.IResolvable;
    /**
     * The RAAllowed value that describes whether roaming activation is allowed.
     * @cloudformationAttribute LoRaWAN.RaAllowed
     */
    readonly attrLoRaWanRaAllowed: cdk.IResolvable;
    /**
     * The ReportDevStatusBattery value.
     * @cloudformationAttribute LoRaWAN.ReportDevStatusBattery
     */
    readonly attrLoRaWanReportDevStatusBattery: cdk.IResolvable;
    /**
     * The ReportDevStatusMargin value.
     * @cloudformationAttribute LoRaWAN.ReportDevStatusMargin
     */
    readonly attrLoRaWanReportDevStatusMargin: cdk.IResolvable;
    /**
     * The TargetPer value.
     * @cloudformationAttribute LoRaWAN.TargetPer
     */
    readonly attrLoRaWanTargetPer: number;
    /**
     * The UlBucketSize value.
     * @cloudformationAttribute LoRaWAN.UlBucketSize
     */
    readonly attrLoRaWanUlBucketSize: number;
    /**
     * The ULRate value.
     * @cloudformationAttribute LoRaWAN.UlRate
     */
    readonly attrLoRaWanUlRate: number;
    /**
     * The ULRatePolicy value.
     * @cloudformationAttribute LoRaWAN.UlRatePolicy
     */
    readonly attrLoRaWanUlRatePolicy: string;
    /**
     *
     * @cloudformationAttribute LoRaWANResponse
     */
    readonly attrLoRaWanResponse: cdk.IResolvable;
    /**
     * LoRaWAN service profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-lorawan
     */
    loRaWan: CfnServiceProfile.LoRaWANServiceProfileProperty | cdk.IResolvable | undefined;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-name
     */
    name: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTWireless::ServiceProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnServiceProfileProps);
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
export declare namespace CfnServiceProfile {
    /**
     * LoRaWANServiceProfile object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html
     */
    interface LoRaWANServiceProfileProperty {
        /**
         * The AddGWMetaData value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-addgwmetadata
         */
        readonly addGwMetadata?: boolean | cdk.IResolvable;
        /**
         * The ChannelMask value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-channelmask
         */
        readonly channelMask?: string;
        /**
         * The DevStatusReqFreq value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-devstatusreqfreq
         */
        readonly devStatusReqFreq?: number;
        /**
         * The DLBucketSize value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlbucketsize
         */
        readonly dlBucketSize?: number;
        /**
         * The DLRate value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlrate
         */
        readonly dlRate?: number;
        /**
         * The DLRatePolicy value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlratepolicy
         */
        readonly dlRatePolicy?: string;
        /**
         * The DRMax value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-drmax
         */
        readonly drMax?: number;
        /**
         * The DRMin value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-drmin
         */
        readonly drMin?: number;
        /**
         * The HRAllowed value that describes whether handover roaming is allowed.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-hrallowed
         */
        readonly hrAllowed?: boolean | cdk.IResolvable;
        /**
         * The MinGwDiversity value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-mingwdiversity
         */
        readonly minGwDiversity?: number;
        /**
         * The NwkGeoLoc value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-nwkgeoloc
         */
        readonly nwkGeoLoc?: boolean | cdk.IResolvable;
        /**
         * The PRAllowed value that describes whether passive roaming is allowed.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-prallowed
         */
        readonly prAllowed?: boolean | cdk.IResolvable;
        /**
         * The RAAllowed value that describes whether roaming activation is allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-raallowed
         */
        readonly raAllowed?: boolean | cdk.IResolvable;
        /**
         * The ReportDevStatusBattery value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-reportdevstatusbattery
         */
        readonly reportDevStatusBattery?: boolean | cdk.IResolvable;
        /**
         * The ReportDevStatusMargin value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-reportdevstatusmargin
         */
        readonly reportDevStatusMargin?: boolean | cdk.IResolvable;
        /**
         * The TargetPer value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-targetper
         */
        readonly targetPer?: number;
        /**
         * The UlBucketSize value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulbucketsize
         */
        readonly ulBucketSize?: number;
        /**
         * The ULRate value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulrate
         */
        readonly ulRate?: number;
        /**
         * The ULRatePolicy value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulratepolicy
         */
        readonly ulRatePolicy?: string;
    }
}
/**
 * Properties for defining a `CfnTaskDefinition`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html
 */
export interface CfnTaskDefinitionProps {
    /**
     * Whether to automatically create tasks using this task definition for all gateways with the specified current version. If `false` , the task must be created by calling `CreateWirelessGatewayTask` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-autocreatetasks
     */
    readonly autoCreateTasks: boolean | cdk.IResolvable;
    /**
     * `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskEntry`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry
     */
    readonly loRaWanUpdateGatewayTaskEntry?: CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty | cdk.IResolvable;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-name
     */
    readonly name?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * `AWS::IoTWireless::TaskDefinition.TaskDefinitionType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-taskdefinitiontype
     */
    readonly taskDefinitionType?: string;
    /**
     * Information about the gateways to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-update
     */
    readonly update?: CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::IoTWireless::TaskDefinition`
 *
 * Creates a gateway task definition.
 *
 * @cloudformationResource AWS::IoTWireless::TaskDefinition
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html
 */
export declare class CfnTaskDefinition extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::TaskDefinition";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskDefinition;
    /**
     * The Amazon Resource Name of the resource.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the new wireless gateway task definition.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * Whether to automatically create tasks using this task definition for all gateways with the specified current version. If `false` , the task must be created by calling `CreateWirelessGatewayTask` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-autocreatetasks
     */
    autoCreateTasks: boolean | cdk.IResolvable;
    /**
     * `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskEntry`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry
     */
    loRaWanUpdateGatewayTaskEntry: CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty | cdk.IResolvable | undefined;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-name
     */
    name: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * `AWS::IoTWireless::TaskDefinition.TaskDefinitionType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-taskdefinitiontype
     */
    taskDefinitionType: string | undefined;
    /**
     * Information about the gateways to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-update
     */
    update: CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::IoTWireless::TaskDefinition`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTaskDefinitionProps);
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
export declare namespace CfnTaskDefinition {
    /**
     * LoRaWANGatewayVersion object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html
     */
    interface LoRaWANGatewayVersionProperty {
        /**
         * The model number of the wireless gateway.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-model
         */
        readonly model?: string;
        /**
         * The version of the wireless gateway firmware.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-packageversion
         */
        readonly packageVersion?: string;
        /**
         * The basic station version of the wireless gateway.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-station
         */
        readonly station?: string;
    }
}
export declare namespace CfnTaskDefinition {
    /**
     * The signature used to verify the update firmware.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html
     */
    interface LoRaWANUpdateGatewayTaskCreateProperty {
        /**
         * The version of the gateways that should receive the update.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-currentversion
         */
        readonly currentVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
        /**
         * The CRC of the signature private key to check.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-sigkeycrc
         */
        readonly sigKeyCrc?: number;
        /**
         * The signature used to verify the update firmware.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-updatesignature
         */
        readonly updateSignature?: string;
        /**
         * The firmware version to update the gateway to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-updateversion
         */
        readonly updateVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTaskDefinition {
    /**
     * LoRaWANUpdateGatewayTaskEntry object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html
     */
    interface LoRaWANUpdateGatewayTaskEntryProperty {
        /**
         * The version of the gateways that should receive the update.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry-currentversion
         */
        readonly currentVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
        /**
         * The firmware version to update the gateway to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry-updateversion
         */
        readonly updateVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTaskDefinition {
    /**
     * UpdateWirelessGatewayTaskCreate object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html
     */
    interface UpdateWirelessGatewayTaskCreateProperty {
        /**
         * The properties that relate to the LoRaWAN wireless gateway.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-lorawan
         */
        readonly loRaWan?: CfnTaskDefinition.LoRaWANUpdateGatewayTaskCreateProperty | cdk.IResolvable;
        /**
         * The IAM role used to read data from the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-updatedatarole
         */
        readonly updateDataRole?: string;
        /**
         * The link to the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-updatedatasource
         */
        readonly updateDataSource?: string;
    }
}
/**
 * Properties for defining a `CfnWirelessDevice`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html
 */
export interface CfnWirelessDeviceProps {
    /**
     * The name of the destination to assign to the new wireless device. Can have only have alphanumeric, - (hyphen) and _ (underscore) characters and it can't have any spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-destinationname
     */
    readonly destinationName: string;
    /**
     * The wireless device type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-type
     */
    readonly type: string;
    /**
     * The description of the new resource. Maximum length is 2048.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-description
     */
    readonly description?: string;
    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lastuplinkreceivedat
     */
    readonly lastUplinkReceivedAt?: string;
    /**
     * The device configuration information to use to create the wireless device. Must be at least one of OtaaV10x, OtaaV11, AbpV11, or AbpV10x.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lorawan
     */
    readonly loRaWan?: CfnWirelessDevice.LoRaWANDeviceProperty | cdk.IResolvable;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-name
     */
    readonly name?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The ARN of the thing to associate with the wireless device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-thingarn
     */
    readonly thingArn?: string;
}
/**
 * A CloudFormation `AWS::IoTWireless::WirelessDevice`
 *
 * Provisions a wireless device.
 *
 * @cloudformationResource AWS::IoTWireless::WirelessDevice
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html
 */
export declare class CfnWirelessDevice extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::WirelessDevice";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWirelessDevice;
    /**
     * The ARN of the wireless device created.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the wireless device created.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The name of the thing associated with the wireless device. The value is empty if a thing isn't associated with the device.
     * @cloudformationAttribute ThingName
     */
    readonly attrThingName: string;
    /**
     * The name of the destination to assign to the new wireless device. Can have only have alphanumeric, - (hyphen) and _ (underscore) characters and it can't have any spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-destinationname
     */
    destinationName: string;
    /**
     * The wireless device type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-type
     */
    type: string;
    /**
     * The description of the new resource. Maximum length is 2048.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-description
     */
    description: string | undefined;
    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lastuplinkreceivedat
     */
    lastUplinkReceivedAt: string | undefined;
    /**
     * The device configuration information to use to create the wireless device. Must be at least one of OtaaV10x, OtaaV11, AbpV11, or AbpV10x.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lorawan
     */
    loRaWan: CfnWirelessDevice.LoRaWANDeviceProperty | cdk.IResolvable | undefined;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-name
     */
    name: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The ARN of the thing to associate with the wireless device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-thingarn
     */
    thingArn: string | undefined;
    /**
     * Create a new `AWS::IoTWireless::WirelessDevice`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWirelessDeviceProps);
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
export declare namespace CfnWirelessDevice {
    /**
     * ABP device object for LoRaWAN specification v1.0.x.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html
     */
    interface AbpV10xProperty {
        /**
         * The DevAddr value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html#cfn-iotwireless-wirelessdevice-abpv10x-devaddr
         */
        readonly devAddr: string;
        /**
         * Session keys for ABP v1.0.x
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html#cfn-iotwireless-wirelessdevice-abpv10x-sessionkeys
         */
        readonly sessionKeys: CfnWirelessDevice.SessionKeysAbpV10xProperty | cdk.IResolvable;
    }
}
export declare namespace CfnWirelessDevice {
    /**
     * ABP device object for create APIs for v1.1.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html
     */
    interface AbpV11Property {
        /**
         * The DevAddr value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html#cfn-iotwireless-wirelessdevice-abpv11-devaddr
         */
        readonly devAddr: string;
        /**
         * Session keys for ABP v1.1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html#cfn-iotwireless-wirelessdevice-abpv11-sessionkeys
         */
        readonly sessionKeys: CfnWirelessDevice.SessionKeysAbpV11Property | cdk.IResolvable;
    }
}
export declare namespace CfnWirelessDevice {
    /**
     * LoRaWAN object for create functions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html
     */
    interface LoRaWANDeviceProperty {
        /**
         * LoRaWAN object for create APIs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-abpv10x
         */
        readonly abpV10X?: CfnWirelessDevice.AbpV10xProperty | cdk.IResolvable;
        /**
         * ABP device object for create APIs for v1.1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-abpv11
         */
        readonly abpV11?: CfnWirelessDevice.AbpV11Property | cdk.IResolvable;
        /**
         * The DevEUI value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-deveui
         */
        readonly devEui?: string;
        /**
         * The ID of the device profile for the new wireless device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-deviceprofileid
         */
        readonly deviceProfileId?: string;
        /**
         * OTAA device object for create APIs for v1.0.x
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-otaav10x
         */
        readonly otaaV10X?: CfnWirelessDevice.OtaaV10xProperty | cdk.IResolvable;
        /**
         * OTAA device object for v1.1 for create APIs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-otaav11
         */
        readonly otaaV11?: CfnWirelessDevice.OtaaV11Property | cdk.IResolvable;
        /**
         * The ID of the service profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-serviceprofileid
         */
        readonly serviceProfileId?: string;
    }
}
export declare namespace CfnWirelessDevice {
    /**
     * OTAA device object for create APIs for v1.0.x.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html
     */
    interface OtaaV10xProperty {
        /**
         * The AppEUI value, with pattern of `[a-fA-F0-9]{16}` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html#cfn-iotwireless-wirelessdevice-otaav10x-appeui
         */
        readonly appEui: string;
        /**
         * The AppKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html#cfn-iotwireless-wirelessdevice-otaav10x-appkey
         */
        readonly appKey: string;
    }
}
export declare namespace CfnWirelessDevice {
    /**
     * OTAA device object for v1.1 for create APIs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html
     */
    interface OtaaV11Property {
        /**
         * The AppKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-appkey
         */
        readonly appKey: string;
        /**
         * The JoinEUI value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-joineui
         */
        readonly joinEui: string;
        /**
         * The NwkKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the NwkKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-nwkkey
         */
        readonly nwkKey: string;
    }
}
export declare namespace CfnWirelessDevice {
    /**
     * LoRaWAN object for create APIs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html
     */
    interface SessionKeysAbpV10xProperty {
        /**
         * The AppSKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppSKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv10x-appskey
         */
        readonly appSKey: string;
        /**
         * The NwkSKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the NwkSKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv10x-nwkskey
         */
        readonly nwkSKey: string;
    }
}
export declare namespace CfnWirelessDevice {
    /**
     * Session keys for ABP v1.1.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html
     */
    interface SessionKeysAbpV11Property {
        /**
         * The AppSKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppSKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-appskey
         */
        readonly appSKey: string;
        /**
         * The FNwkSIntKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the FNwkSIntKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-fnwksintkey
         */
        readonly fNwkSIntKey: string;
        /**
         * The NwkSEncKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the NwkSEncKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-nwksenckey
         */
        readonly nwkSEncKey: string;
        /**
         * The SNwkSIntKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the SNwkSIntKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-snwksintkey
         */
        readonly sNwkSIntKey: string;
    }
}
/**
 * Properties for defining a `CfnWirelessGateway`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html
 */
export interface CfnWirelessGatewayProps {
    /**
     * The gateway configuration information to use to create the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lorawan
     */
    readonly loRaWan: CfnWirelessGateway.LoRaWANGatewayProperty | cdk.IResolvable;
    /**
     * The description of the new resource. The maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-description
     */
    readonly description?: string;
    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lastuplinkreceivedat
     */
    readonly lastUplinkReceivedAt?: string;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-name
     */
    readonly name?: string;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The ARN of the thing to associate with the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingarn
     */
    readonly thingArn?: string;
    /**
     * `AWS::IoTWireless::WirelessGateway.ThingName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingname
     */
    readonly thingName?: string;
}
/**
 * A CloudFormation `AWS::IoTWireless::WirelessGateway`
 *
 * Provisions a wireless gateway.
 *
 * @cloudformationResource AWS::IoTWireless::WirelessGateway
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html
 */
export declare class CfnWirelessGateway extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::WirelessGateway";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWirelessGateway;
    /**
     * The ARN of the wireless gateway created.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the wireless gateway created.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The gateway configuration information to use to create the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lorawan
     */
    loRaWan: CfnWirelessGateway.LoRaWANGatewayProperty | cdk.IResolvable;
    /**
     * The description of the new resource. The maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-description
     */
    description: string | undefined;
    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lastuplinkreceivedat
     */
    lastUplinkReceivedAt: string | undefined;
    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-name
     */
    name: string | undefined;
    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The ARN of the thing to associate with the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingarn
     */
    thingArn: string | undefined;
    /**
     * `AWS::IoTWireless::WirelessGateway.ThingName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingname
     */
    thingName: string | undefined;
    /**
     * Create a new `AWS::IoTWireless::WirelessGateway`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWirelessGatewayProps);
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
export declare namespace CfnWirelessGateway {
    /**
     * LoRaWAN wireless gateway object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html
     */
    interface LoRaWANGatewayProperty {
        /**
         * The gateway's EUI value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html#cfn-iotwireless-wirelessgateway-lorawangateway-gatewayeui
         */
        readonly gatewayEui: string;
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html#cfn-iotwireless-wirelessgateway-lorawangateway-rfregion
         */
        readonly rfRegion: string;
    }
}

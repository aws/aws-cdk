import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html
 */
export interface CfnConfigProps {
    /**
     * Object containing the parameters of a config. Only one subtype may be specified per config. See the subtype definitions for a description of each config subtype.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-configdata
     */
    readonly configData: CfnConfig.ConfigDataProperty | cdk.IResolvable;
    /**
     * The name of the config object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-name
     */
    readonly name: string;
    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GroundStation::Config`
 *
 * Creates a `Config` with the specified parameters.
 *
 * Config objects provide Ground Station with the details necessary in order to schedule and execute satellite contacts.
 *
 * @cloudformationResource AWS::GroundStation::Config
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html
 */
export declare class CfnConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GroundStation::Config";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfig;
    /**
     * The ARN of the config, such as `arn:aws:groundstation:us-east-2:1234567890:config/tracking/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the config, such as `9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The type of the config, such as `tracking` .
     * @cloudformationAttribute Type
     */
    readonly attrType: string;
    /**
     * Object containing the parameters of a config. Only one subtype may be specified per config. See the subtype definitions for a description of each config subtype.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-configdata
     */
    configData: CfnConfig.ConfigDataProperty | cdk.IResolvable;
    /**
     * The name of the config object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-name
     */
    name: string;
    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GroundStation::Config`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigProps);
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
export declare namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should configure an antenna for downlink during a contact. Use an antenna downlink config in a mission profile to receive the downlink data in raw DigIF format.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkconfig.html
     */
    interface AntennaDownlinkConfigProperty {
        /**
         * Defines the spectrum configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkconfig.html#cfn-groundstation-config-antennadownlinkconfig-spectrumconfig
         */
        readonly spectrumConfig?: CfnConfig.SpectrumConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should configure an antenna for downlink during a contact. Use an antenna downlink demod decode config in a mission profile to receive the downlink data that has been demodulated and decoded.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html
     */
    interface AntennaDownlinkDemodDecodeConfigProperty {
        /**
         * Defines how the RF signal will be decoded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-decodeconfig
         */
        readonly decodeConfig?: CfnConfig.DecodeConfigProperty | cdk.IResolvable;
        /**
         * Defines how the RF signal will be demodulated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-demodulationconfig
         */
        readonly demodulationConfig?: CfnConfig.DemodulationConfigProperty | cdk.IResolvable;
        /**
         * Defines the spectrum configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-spectrumconfig
         */
        readonly spectrumConfig?: CfnConfig.SpectrumConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should configure an antenna for uplink during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html
     */
    interface AntennaUplinkConfigProperty {
        /**
         * Defines the spectrum configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-spectrumconfig
         */
        readonly spectrumConfig?: CfnConfig.UplinkSpectrumConfigProperty | cdk.IResolvable;
        /**
         * The equivalent isotropically radiated power (EIRP) to use for uplink transmissions. Valid values are between 20.0 to 50.0 dBW.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-targeteirp
         */
        readonly targetEirp?: CfnConfig.EirpProperty | cdk.IResolvable;
        /**
         * Whether or not uplink transmit is disabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-transmitdisabled
         */
        readonly transmitDisabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnConfig {
    /**
     * Config objects provide information to Ground Station about how to configure the antenna and how data flows during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html
     */
    interface ConfigDataProperty {
        /**
         * Provides information for an antenna downlink config object. Antenna downlink config objects are used to provide parameters for downlinks where no demodulation or decoding is performed by Ground Station (RF over IP downlinks).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennadownlinkconfig
         */
        readonly antennaDownlinkConfig?: CfnConfig.AntennaDownlinkConfigProperty | cdk.IResolvable;
        /**
         * Provides information for a downlink demod decode config object. Downlink demod decode config objects are used to provide parameters for downlinks where the Ground Station service will demodulate and decode the downlinked data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennadownlinkdemoddecodeconfig
         */
        readonly antennaDownlinkDemodDecodeConfig?: CfnConfig.AntennaDownlinkDemodDecodeConfigProperty | cdk.IResolvable;
        /**
         * Provides information for an uplink config object. Uplink config objects are used to provide parameters for uplink contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennauplinkconfig
         */
        readonly antennaUplinkConfig?: CfnConfig.AntennaUplinkConfigProperty | cdk.IResolvable;
        /**
         * Provides information for a dataflow endpoint config object. Dataflow endpoint config objects are used to provide parameters about which IP endpoint(s) to use during a contact. Dataflow endpoints are where Ground Station sends data during a downlink contact and where Ground Station receives data to send to the satellite during an uplink contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-dataflowendpointconfig
         */
        readonly dataflowEndpointConfig?: CfnConfig.DataflowEndpointConfigProperty | cdk.IResolvable;
        /**
         * Provides information for an S3 recording config object. S3 recording config objects are used to provide parameters for S3 recording during downlink contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-s3recordingconfig
         */
        readonly s3RecordingConfig?: CfnConfig.S3RecordingConfigProperty | cdk.IResolvable;
        /**
         * Provides information for a tracking config object. Tracking config objects are used to provide parameters about how to track the satellite through the sky during a contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-trackingconfig
         */
        readonly trackingConfig?: CfnConfig.TrackingConfigProperty | cdk.IResolvable;
        /**
         * Provides information for an uplink echo config object. Uplink echo config objects are used to provide parameters for uplink echo during uplink contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-uplinkechoconfig
         */
        readonly uplinkEchoConfig?: CfnConfig.UplinkEchoConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConfig {
    /**
     * Provides information to AWS Ground Station about which IP endpoints to use during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html
     */
    interface DataflowEndpointConfigProperty {
        /**
         * The name of the dataflow endpoint to use during contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html#cfn-groundstation-config-dataflowendpointconfig-dataflowendpointname
         */
        readonly dataflowEndpointName?: string;
        /**
         * The region of the dataflow endpoint to use during contacts. When omitted, Ground Station will use the region of the contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html#cfn-groundstation-config-dataflowendpointconfig-dataflowendpointregion
         */
        readonly dataflowEndpointRegion?: string;
    }
}
export declare namespace CfnConfig {
    /**
     * Defines decoding settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-decodeconfig.html
     */
    interface DecodeConfigProperty {
        /**
         * The decoding settings are in JSON format and define a set of steps to perform to decode the data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-decodeconfig.html#cfn-groundstation-config-decodeconfig-unvalidatedjson
         */
        readonly unvalidatedJson?: string;
    }
}
export declare namespace CfnConfig {
    /**
     * Defines demodulation settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-demodulationconfig.html
     */
    interface DemodulationConfigProperty {
        /**
         * The demodulation settings are in JSON format and define parameters for demodulation, for example which modulation scheme (e.g. PSK, QPSK, etc.) and matched filter to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-demodulationconfig.html#cfn-groundstation-config-demodulationconfig-unvalidatedjson
         */
        readonly unvalidatedJson?: string;
    }
}
export declare namespace CfnConfig {
    /**
     * Defines an equivalent isotropically radiated power (EIRP).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html
     */
    interface EirpProperty {
        /**
         * The units of the EIRP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html#cfn-groundstation-config-eirp-units
         */
        readonly units?: string;
        /**
         * The value of the EIRP. Valid values are between 20.0 to 50.0 dBW.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html#cfn-groundstation-config-eirp-value
         */
        readonly value?: number;
    }
}
export declare namespace CfnConfig {
    /**
     * Defines a frequency.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html
     */
    interface FrequencyProperty {
        /**
         * The units of the frequency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html#cfn-groundstation-config-frequency-units
         */
        readonly units?: string;
        /**
         * The value of the frequency. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html#cfn-groundstation-config-frequency-value
         */
        readonly value?: number;
    }
}
export declare namespace CfnConfig {
    /**
     * Defines a bandwidth.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html
     */
    interface FrequencyBandwidthProperty {
        /**
         * The units of the bandwidth.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html#cfn-groundstation-config-frequencybandwidth-units
         */
        readonly units?: string;
        /**
         * The value of the bandwidth. AWS Ground Station currently has the following bandwidth limitations:
         *
         * - For `AntennaDownlinkDemodDecodeconfig` , valid values are between 125 kHz to 650 MHz.
         * - For `AntennaDownlinkconfig` , valid values are between 10 kHz to 54 MHz.
         * - For `AntennaUplinkConfig` , valid values are between 10 kHz to 54 MHz.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html#cfn-groundstation-config-frequencybandwidth-value
         */
        readonly value?: number;
    }
}
export declare namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should save downlink data to S3.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html
     */
    interface S3RecordingConfigProperty {
        /**
         * S3 Bucket where the data is written. The name of the S3 Bucket provided must begin with `aws-groundstation` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-bucketarn
         */
        readonly bucketArn?: string;
        /**
         * The prefix of the S3 data object. If you choose to use any optional keys for substitution, these values will be replaced with the corresponding information from your contact details. For example, a prefix of `{satellite_id}/{year}/{month}/{day}/` will replaced with `fake_satellite_id/2021/01/10/`
         *
         * *Optional keys for substitution* : `{satellite_id}` | `{config-name}` | `{config-id}` | `{year}` | `{month}` | `{day}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-prefix
         */
        readonly prefix?: string;
        /**
         * Defines the ARN of the role assumed for putting archives to S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-rolearn
         */
        readonly roleArn?: string;
    }
}
export declare namespace CfnConfig {
    /**
     * Defines a spectrum.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html
     */
    interface SpectrumConfigProperty {
        /**
         * The bandwidth of the spectrum. AWS Ground Station currently has the following bandwidth limitations:
         *
         * - For `AntennaDownlinkDemodDecodeconfig` , valid values are between 125 kHz to 650 MHz.
         * - For `AntennaDownlinkconfig` , valid values are between 10 kHz to 54 MHz.
         * - For `AntennaUplinkConfig` , valid values are between 10 kHz to 54 MHz.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-bandwidth
         */
        readonly bandwidth?: CfnConfig.FrequencyBandwidthProperty | cdk.IResolvable;
        /**
         * The center frequency of the spectrum. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-centerfrequency
         */
        readonly centerFrequency?: CfnConfig.FrequencyProperty | cdk.IResolvable;
        /**
         * The polarization of the spectrum. Valid values are `"RIGHT_HAND"` and `"LEFT_HAND"` . Capturing both `"RIGHT_HAND"` and `"LEFT_HAND"` polarization requires two separate configs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-polarization
         */
        readonly polarization?: string;
    }
}
export declare namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should track the satellite through the sky during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-trackingconfig.html
     */
    interface TrackingConfigProperty {
        /**
         * Specifies whether or not to use autotrack. `REMOVED` specifies that program track should only be used during the contact. `PREFERRED` specifies that autotracking is preferred during the contact but fallback to program track if the signal is lost. `REQUIRED` specifies that autotracking is required during the contact and not to use program track if the signal is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-trackingconfig.html#cfn-groundstation-config-trackingconfig-autotrack
         */
        readonly autotrack?: string;
    }
}
export declare namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should echo back uplink transmissions to a dataflow endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html
     */
    interface UplinkEchoConfigProperty {
        /**
         * Defines the ARN of the uplink config to echo back to a dataflow endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html#cfn-groundstation-config-uplinkechoconfig-antennauplinkconfigarn
         */
        readonly antennaUplinkConfigArn?: string;
        /**
         * Whether or not uplink echo is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html#cfn-groundstation-config-uplinkechoconfig-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnConfig {
    /**
     * Defines a uplink spectrum.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html
     */
    interface UplinkSpectrumConfigProperty {
        /**
         * The center frequency of the spectrum. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html#cfn-groundstation-config-uplinkspectrumconfig-centerfrequency
         */
        readonly centerFrequency?: CfnConfig.FrequencyProperty | cdk.IResolvable;
        /**
         * The polarization of the spectrum. Valid values are `"RIGHT_HAND"` and `"LEFT_HAND"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html#cfn-groundstation-config-uplinkspectrumconfig-polarization
         */
        readonly polarization?: string;
    }
}
/**
 * Properties for defining a `CfnDataflowEndpointGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html
 */
export interface CfnDataflowEndpointGroupProps {
    /**
     * List of Endpoint Details, containing address and port for each endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-endpointdetails
     */
    readonly endpointDetails: Array<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GroundStation::DataflowEndpointGroup`
 *
 * Creates a Dataflow Endpoint Group request.
 *
 * Dataflow endpoint groups contain a list of endpoints. When the name of a dataflow endpoint group is specified in a mission profile, the Ground Station service will connect to the endpoints and flow data during a contact.
 *
 * For more information about dataflow endpoint groups, see [Dataflow Endpoint Groups](https://docs.aws.amazon.com/ground-station/latest/ug/dataflowendpointgroups.html) .
 *
 * @cloudformationResource AWS::GroundStation::DataflowEndpointGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html
 */
export declare class CfnDataflowEndpointGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GroundStation::DataflowEndpointGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataflowEndpointGroup;
    /**
     * The ARN of the dataflow endpoint group, such as `arn:aws:groundstation:us-east-2:1234567890:dataflow-endpoint-group/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * UUID of a dataflow endpoint group.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * List of Endpoint Details, containing address and port for each endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-endpointdetails
     */
    endpointDetails: Array<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GroundStation::DataflowEndpointGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataflowEndpointGroupProps);
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
export declare namespace CfnDataflowEndpointGroup {
    /**
     * Contains information such as socket address and name that defines an endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html
     */
    interface DataflowEndpointProperty {
        /**
         * The address and port of an endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-address
         */
        readonly address?: CfnDataflowEndpointGroup.SocketAddressProperty | cdk.IResolvable;
        /**
         * Maximum transmission unit (MTU) size in bytes of a dataflow endpoint. Valid values are between 1400 and 1500. A default value of 1500 is used if not set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-mtu
         */
        readonly mtu?: number;
        /**
         * The endpoint name.
         *
         * When listing available contacts for a satellite, Ground Station searches for a dataflow endpoint whose name matches the value specified by the dataflow endpoint config of the selected mission profile. If no matching dataflow endpoints are found then Ground Station will not display any available contacts for the satellite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-name
         */
        readonly name?: string;
    }
}
export declare namespace CfnDataflowEndpointGroup {
    /**
     * The security details and endpoint information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html
     */
    interface EndpointDetailsProperty {
        /**
         * Information about the endpoint such as name and the endpoint address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html#cfn-groundstation-dataflowendpointgroup-endpointdetails-endpoint
         */
        readonly endpoint?: CfnDataflowEndpointGroup.DataflowEndpointProperty | cdk.IResolvable;
        /**
         * The role ARN, and IDs for security groups and subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html#cfn-groundstation-dataflowendpointgroup-endpointdetails-securitydetails
         */
        readonly securityDetails?: CfnDataflowEndpointGroup.SecurityDetailsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataflowEndpointGroup {
    /**
     * Information about IAM roles, subnets, and security groups needed for this DataflowEndpointGroup.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html
     */
    interface SecurityDetailsProperty {
        /**
         * The ARN of a role which Ground Station has permission to assume, such as `arn:aws:iam::1234567890:role/DataDeliveryServiceRole` .
         *
         * Ground Station will assume this role and create an ENI in your VPC on the specified subnet upon creation of a dataflow endpoint group. This ENI is used as the ingress/egress point for data streamed during a satellite contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-rolearn
         */
        readonly roleArn?: string;
        /**
         * The security group Ids of the security role, such as `sg-1234567890abcdef0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * The subnet Ids of the security details, such as `subnet-12345678` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-subnetids
         */
        readonly subnetIds?: string[];
    }
}
export declare namespace CfnDataflowEndpointGroup {
    /**
     * The address of the endpoint, such as `192.168.1.1` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html
     */
    interface SocketAddressProperty {
        /**
         * The name of the endpoint, such as `Endpoint 1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html#cfn-groundstation-dataflowendpointgroup-socketaddress-name
         */
        readonly name?: string;
        /**
         * The port of the endpoint, such as `55888` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html#cfn-groundstation-dataflowendpointgroup-socketaddress-port
         */
        readonly port?: number;
    }
}
/**
 * Properties for defining a `CfnMissionProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html
 */
export interface CfnMissionProfileProps {
    /**
     * A list containing lists of config ARNs. Each list of config ARNs is an edge, with a "from" config and a "to" config.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-dataflowedges
     */
    readonly dataflowEdges: Array<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Minimum length of a contact in seconds that Ground Station will return when listing contacts. Ground Station will not return contacts shorter than this duration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-minimumviablecontactdurationseconds
     */
    readonly minimumViableContactDurationSeconds: number;
    /**
     * The name of the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-name
     */
    readonly name: string;
    /**
     * The ARN of a tracking config objects that defines how to track the satellite through the sky during a contact.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-trackingconfigarn
     */
    readonly trackingConfigArn: string;
    /**
     * Amount of time in seconds after a contact ends that you’d like to receive a CloudWatch Event indicating the pass has finished. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactpostpassdurationseconds
     */
    readonly contactPostPassDurationSeconds?: number;
    /**
     * Amount of time in seconds prior to contact start that you'd like to receive a CloudWatch Event indicating an upcoming pass. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactprepassdurationseconds
     */
    readonly contactPrePassDurationSeconds?: number;
    /**
     * Tags assigned to the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GroundStation::MissionProfile`
 *
 * Mission profiles specify parameters and provide references to config objects to define how Ground Station lists and executes contacts.
 *
 * @cloudformationResource AWS::GroundStation::MissionProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html
 */
export declare class CfnMissionProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GroundStation::MissionProfile";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMissionProfile;
    /**
     * The ARN of the mission profile, such as `arn:aws:groundstation:us-east-2:1234567890:mission-profile/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the mission profile, such as `9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The region of the mission profile.
     * @cloudformationAttribute Region
     */
    readonly attrRegion: string;
    /**
     * A list containing lists of config ARNs. Each list of config ARNs is an edge, with a "from" config and a "to" config.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-dataflowedges
     */
    dataflowEdges: Array<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Minimum length of a contact in seconds that Ground Station will return when listing contacts. Ground Station will not return contacts shorter than this duration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-minimumviablecontactdurationseconds
     */
    minimumViableContactDurationSeconds: number;
    /**
     * The name of the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-name
     */
    name: string;
    /**
     * The ARN of a tracking config objects that defines how to track the satellite through the sky during a contact.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-trackingconfigarn
     */
    trackingConfigArn: string;
    /**
     * Amount of time in seconds after a contact ends that you’d like to receive a CloudWatch Event indicating the pass has finished. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactpostpassdurationseconds
     */
    contactPostPassDurationSeconds: number | undefined;
    /**
     * Amount of time in seconds prior to contact start that you'd like to receive a CloudWatch Event indicating an upcoming pass. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactprepassdurationseconds
     */
    contactPrePassDurationSeconds: number | undefined;
    /**
     * Tags assigned to the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GroundStation::MissionProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMissionProfileProps);
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
export declare namespace CfnMissionProfile {
    /**
     * A dataflow edge defines from where and to where data will flow during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html
     */
    interface DataflowEdgeProperty {
        /**
         * The ARN of the destination for this dataflow edge. For example, specify the ARN of a dataflow endpoint config for a downlink edge or an antenna uplink config for an uplink edge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html#cfn-groundstation-missionprofile-dataflowedge-destination
         */
        readonly destination?: string;
        /**
         * The ARN of the source for this dataflow edge. For example, specify the ARN of an antenna downlink config for a downlink edge or a dataflow endpoint config for an uplink edge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html#cfn-groundstation-missionprofile-dataflowedge-source
         */
        readonly source?: string;
    }
}

/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a `Config` with the specified parameters.
 *
 * Config objects provide Ground Station with the details necessary in order to schedule and execute satellite contacts.
 *
 * @cloudformationResource AWS::GroundStation::Config
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html
 */
export class CfnConfig extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GroundStation::Config";

  /**
   * Build a CfnConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the config, such as `arn:aws:groundstation:us-east-2:1234567890:config/tracking/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the config, such as `9940bf3b-d2ba-427e-9906-842b5e5d2296` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The type of the config, such as `tracking` .
   *
   * @cloudformationAttribute Type
   */
  public readonly attrType: string;

  /**
   * Object containing the parameters of a config.
   */
  public configData: CfnConfig.ConfigDataProperty | cdk.IResolvable;

  /**
   * The name of the config object.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags assigned to a resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigProps) {
    super(scope, id, {
      "type": CfnConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configData", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrType = cdk.Token.asString(this.getAtt("Type", cdk.ResolutionTypeHint.STRING));
    this.configData = props.configData;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GroundStation::Config", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configData": this.configData,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigPropsToCloudFormation(props);
  }
}

export namespace CfnConfig {
  /**
   * Config objects provide information to Ground Station about how to configure the antenna and how data flows during a contact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html
   */
  export interface ConfigDataProperty {
    /**
     * Provides information for an antenna downlink config object.
     *
     * Antenna downlink config objects are used to provide parameters for downlinks where no demodulation or decoding is performed by Ground Station (RF over IP downlinks).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennadownlinkconfig
     */
    readonly antennaDownlinkConfig?: CfnConfig.AntennaDownlinkConfigProperty | cdk.IResolvable;

    /**
     * Provides information for a downlink demod decode config object.
     *
     * Downlink demod decode config objects are used to provide parameters for downlinks where the Ground Station service will demodulate and decode the downlinked data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennadownlinkdemoddecodeconfig
     */
    readonly antennaDownlinkDemodDecodeConfig?: CfnConfig.AntennaDownlinkDemodDecodeConfigProperty | cdk.IResolvable;

    /**
     * Provides information for an uplink config object.
     *
     * Uplink config objects are used to provide parameters for uplink contacts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennauplinkconfig
     */
    readonly antennaUplinkConfig?: CfnConfig.AntennaUplinkConfigProperty | cdk.IResolvable;

    /**
     * Provides information for a dataflow endpoint config object.
     *
     * Dataflow endpoint config objects are used to provide parameters about which IP endpoint(s) to use during a contact. Dataflow endpoints are where Ground Station sends data during a downlink contact and where Ground Station receives data to send to the satellite during an uplink contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-dataflowendpointconfig
     */
    readonly dataflowEndpointConfig?: CfnConfig.DataflowEndpointConfigProperty | cdk.IResolvable;

    /**
     * Provides information for an S3 recording config object.
     *
     * S3 recording config objects are used to provide parameters for S3 recording during downlink contacts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-s3recordingconfig
     */
    readonly s3RecordingConfig?: cdk.IResolvable | CfnConfig.S3RecordingConfigProperty;

    /**
     * Provides information for a tracking config object.
     *
     * Tracking config objects are used to provide parameters about how to track the satellite through the sky during a contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-trackingconfig
     */
    readonly trackingConfig?: cdk.IResolvable | CfnConfig.TrackingConfigProperty;

    /**
     * Provides information for an uplink echo config object.
     *
     * Uplink echo config objects are used to provide parameters for uplink echo during uplink contacts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-uplinkechoconfig
     */
    readonly uplinkEchoConfig?: cdk.IResolvable | CfnConfig.UplinkEchoConfigProperty;
  }

  /**
   * Provides information to AWS Ground Station about which IP endpoints to use during a contact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html
   */
  export interface DataflowEndpointConfigProperty {
    /**
     * The name of the dataflow endpoint to use during contacts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html#cfn-groundstation-config-dataflowendpointconfig-dataflowendpointname
     */
    readonly dataflowEndpointName?: string;

    /**
     * The region of the dataflow endpoint to use during contacts.
     *
     * When omitted, Ground Station will use the region of the contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html#cfn-groundstation-config-dataflowendpointconfig-dataflowendpointregion
     */
    readonly dataflowEndpointRegion?: string;
  }

  /**
   * Provides information about how AWS Ground Station should echo back uplink transmissions to a dataflow endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html
   */
  export interface UplinkEchoConfigProperty {
    /**
     * Defines the ARN of the uplink config to echo back to a dataflow endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html#cfn-groundstation-config-uplinkechoconfig-antennauplinkconfigarn
     */
    readonly antennaUplinkConfigArn?: string;

    /**
     * Whether or not uplink echo is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html#cfn-groundstation-config-uplinkechoconfig-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * Provides information about how AWS Ground Station should configure an antenna for downlink during a contact.
   *
   * Use an antenna downlink config in a mission profile to receive the downlink data in raw DigIF format.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkconfig.html
   */
  export interface AntennaDownlinkConfigProperty {
    /**
     * Defines the spectrum configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkconfig.html#cfn-groundstation-config-antennadownlinkconfig-spectrumconfig
     */
    readonly spectrumConfig?: cdk.IResolvable | CfnConfig.SpectrumConfigProperty;
  }

  /**
   * Defines a spectrum.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html
   */
  export interface SpectrumConfigProperty {
    /**
     * The bandwidth of the spectrum. AWS Ground Station currently has the following bandwidth limitations:.
     *
     * - For `AntennaDownlinkDemodDecodeconfig` , valid values are between 125 kHz to 650 MHz.
     * - For `AntennaDownlinkconfig` , valid values are between 10 kHz to 54 MHz.
     * - For `AntennaUplinkConfig` , valid values are between 10 kHz to 54 MHz.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-bandwidth
     */
    readonly bandwidth?: CfnConfig.FrequencyBandwidthProperty | cdk.IResolvable;

    /**
     * The center frequency of the spectrum.
     *
     * Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-centerfrequency
     */
    readonly centerFrequency?: CfnConfig.FrequencyProperty | cdk.IResolvable;

    /**
     * The polarization of the spectrum.
     *
     * Valid values are `"RIGHT_HAND"` and `"LEFT_HAND"` . Capturing both `"RIGHT_HAND"` and `"LEFT_HAND"` polarization requires two separate configs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-polarization
     */
    readonly polarization?: string;
  }

  /**
   * Defines a bandwidth.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html
   */
  export interface FrequencyBandwidthProperty {
    /**
     * The units of the bandwidth.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html#cfn-groundstation-config-frequencybandwidth-units
     */
    readonly units?: string;

    /**
     * The value of the bandwidth. AWS Ground Station currently has the following bandwidth limitations:.
     *
     * - For `AntennaDownlinkDemodDecodeconfig` , valid values are between 125 kHz to 650 MHz.
     * - For `AntennaDownlinkconfig` , valid values are between 10 kHz to 54 MHz.
     * - For `AntennaUplinkConfig` , valid values are between 10 kHz to 54 MHz.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html#cfn-groundstation-config-frequencybandwidth-value
     */
    readonly value?: number;
  }

  /**
   * Defines a frequency.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html
   */
  export interface FrequencyProperty {
    /**
     * The units of the frequency.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html#cfn-groundstation-config-frequency-units
     */
    readonly units?: string;

    /**
     * The value of the frequency.
     *
     * Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html#cfn-groundstation-config-frequency-value
     */
    readonly value?: number;
  }

  /**
   * Provides information about how AWS Ground Station should configure an antenna for downlink during a contact.
   *
   * Use an antenna downlink demod decode config in a mission profile to receive the downlink data that has been demodulated and decoded.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html
   */
  export interface AntennaDownlinkDemodDecodeConfigProperty {
    /**
     * Defines how the RF signal will be decoded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-decodeconfig
     */
    readonly decodeConfig?: CfnConfig.DecodeConfigProperty | cdk.IResolvable;

    /**
     * Defines how the RF signal will be demodulated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-demodulationconfig
     */
    readonly demodulationConfig?: CfnConfig.DemodulationConfigProperty | cdk.IResolvable;

    /**
     * Defines the spectrum configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-spectrumconfig
     */
    readonly spectrumConfig?: cdk.IResolvable | CfnConfig.SpectrumConfigProperty;
  }

  /**
   * Defines demodulation settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-demodulationconfig.html
   */
  export interface DemodulationConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-demodulationconfig.html#cfn-groundstation-config-demodulationconfig-unvalidatedjson
     */
    readonly unvalidatedJson?: string;
  }

  /**
   * Defines decoding settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-decodeconfig.html
   */
  export interface DecodeConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-decodeconfig.html#cfn-groundstation-config-decodeconfig-unvalidatedjson
     */
    readonly unvalidatedJson?: string;
  }

  /**
   * Provides information about how AWS Ground Station should track the satellite through the sky during a contact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-trackingconfig.html
   */
  export interface TrackingConfigProperty {
    /**
     * Specifies whether or not to use autotrack.
     *
     * `REMOVED` specifies that program track should only be used during the contact. `PREFERRED` specifies that autotracking is preferred during the contact but fallback to program track if the signal is lost. `REQUIRED` specifies that autotracking is required during the contact and not to use program track if the signal is lost.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-trackingconfig.html#cfn-groundstation-config-trackingconfig-autotrack
     */
    readonly autotrack?: string;
  }

  /**
   * Provides information about how AWS Ground Station should configure an antenna for uplink during a contact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html
   */
  export interface AntennaUplinkConfigProperty {
    /**
     * Defines the spectrum configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-spectrumconfig
     */
    readonly spectrumConfig?: cdk.IResolvable | CfnConfig.UplinkSpectrumConfigProperty;

    /**
     * The equivalent isotropically radiated power (EIRP) to use for uplink transmissions.
     *
     * Valid values are between 20.0 to 50.0 dBW.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-targeteirp
     */
    readonly targetEirp?: CfnConfig.EirpProperty | cdk.IResolvable;

    /**
     * Whether or not uplink transmit is disabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-transmitdisabled
     */
    readonly transmitDisabled?: boolean | cdk.IResolvable;
  }

  /**
   * Defines a uplink spectrum.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html
   */
  export interface UplinkSpectrumConfigProperty {
    /**
     * The center frequency of the spectrum.
     *
     * Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html#cfn-groundstation-config-uplinkspectrumconfig-centerfrequency
     */
    readonly centerFrequency?: CfnConfig.FrequencyProperty | cdk.IResolvable;

    /**
     * The polarization of the spectrum.
     *
     * Valid values are `"RIGHT_HAND"` and `"LEFT_HAND"` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html#cfn-groundstation-config-uplinkspectrumconfig-polarization
     */
    readonly polarization?: string;
  }

  /**
   * Defines an equivalent isotropically radiated power (EIRP).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html
   */
  export interface EirpProperty {
    /**
     * The units of the EIRP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html#cfn-groundstation-config-eirp-units
     */
    readonly units?: string;

    /**
     * The value of the EIRP.
     *
     * Valid values are between 20.0 to 50.0 dBW.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html#cfn-groundstation-config-eirp-value
     */
    readonly value?: number;
  }

  /**
   * Provides information about how AWS Ground Station should save downlink data to S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html
   */
  export interface S3RecordingConfigProperty {
    /**
     * S3 Bucket where the data is written.
     *
     * The name of the S3 Bucket provided must begin with `aws-groundstation` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-bucketarn
     */
    readonly bucketArn?: string;

    /**
     * The prefix of the S3 data object.
     *
     * If you choose to use any optional keys for substitution, these values will be replaced with the corresponding information from your contact details. For example, a prefix of `{satellite_id}/{year}/{month}/{day}/` will replaced with `fake_satellite_id/2021/01/10/`
     *
     * *Optional keys for substitution* : `{satellite_id}` | `{config-name}` | `{config-id}` | `{year}` | `{month}` | `{day}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-prefix
     */
    readonly prefix?: string;

    /**
     * Defines the ARN of the role assumed for putting archives to S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-rolearn
     */
    readonly roleArn?: string;
  }
}

/**
 * Properties for defining a `CfnConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html
 */
export interface CfnConfigProps {
  /**
   * Object containing the parameters of a config.
   *
   * Only one subtype may be specified per config. See the subtype definitions for a description of each config subtype.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-configdata
   */
  readonly configData: CfnConfig.ConfigDataProperty | cdk.IResolvable;

  /**
   * The name of the config object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-name
   */
  readonly name: string;

  /**
   * Tags assigned to a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DataflowEndpointConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DataflowEndpointConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigDataflowEndpointConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataflowEndpointName", cdk.validateString)(properties.dataflowEndpointName));
  errors.collect(cdk.propertyValidator("dataflowEndpointRegion", cdk.validateString)(properties.dataflowEndpointRegion));
  return errors.wrap("supplied properties not correct for \"DataflowEndpointConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigDataflowEndpointConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigDataflowEndpointConfigPropertyValidator(properties).assertSuccess();
  return {
    "DataflowEndpointName": cdk.stringToCloudFormation(properties.dataflowEndpointName),
    "DataflowEndpointRegion": cdk.stringToCloudFormation(properties.dataflowEndpointRegion)
  };
}

// @ts-ignore TS6133
function CfnConfigDataflowEndpointConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.DataflowEndpointConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.DataflowEndpointConfigProperty>();
  ret.addPropertyResult("dataflowEndpointName", "DataflowEndpointName", (properties.DataflowEndpointName != null ? cfn_parse.FromCloudFormation.getString(properties.DataflowEndpointName) : undefined));
  ret.addPropertyResult("dataflowEndpointRegion", "DataflowEndpointRegion", (properties.DataflowEndpointRegion != null ? cfn_parse.FromCloudFormation.getString(properties.DataflowEndpointRegion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UplinkEchoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UplinkEchoConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigUplinkEchoConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("antennaUplinkConfigArn", cdk.validateString)(properties.antennaUplinkConfigArn));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"UplinkEchoConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigUplinkEchoConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigUplinkEchoConfigPropertyValidator(properties).assertSuccess();
  return {
    "AntennaUplinkConfigArn": cdk.stringToCloudFormation(properties.antennaUplinkConfigArn),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnConfigUplinkEchoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfig.UplinkEchoConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.UplinkEchoConfigProperty>();
  ret.addPropertyResult("antennaUplinkConfigArn", "AntennaUplinkConfigArn", (properties.AntennaUplinkConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.AntennaUplinkConfigArn) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FrequencyBandwidthProperty`
 *
 * @param properties - the TypeScript properties of a `FrequencyBandwidthProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigFrequencyBandwidthPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("units", cdk.validateString)(properties.units));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"FrequencyBandwidthProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigFrequencyBandwidthPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigFrequencyBandwidthPropertyValidator(properties).assertSuccess();
  return {
    "Units": cdk.stringToCloudFormation(properties.units),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConfigFrequencyBandwidthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.FrequencyBandwidthProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.FrequencyBandwidthProperty>();
  ret.addPropertyResult("units", "Units", (properties.Units != null ? cfn_parse.FromCloudFormation.getString(properties.Units) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FrequencyProperty`
 *
 * @param properties - the TypeScript properties of a `FrequencyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigFrequencyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("units", cdk.validateString)(properties.units));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"FrequencyProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigFrequencyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigFrequencyPropertyValidator(properties).assertSuccess();
  return {
    "Units": cdk.stringToCloudFormation(properties.units),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConfigFrequencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.FrequencyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.FrequencyProperty>();
  ret.addPropertyResult("units", "Units", (properties.Units != null ? cfn_parse.FromCloudFormation.getString(properties.Units) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SpectrumConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SpectrumConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigSpectrumConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bandwidth", CfnConfigFrequencyBandwidthPropertyValidator)(properties.bandwidth));
  errors.collect(cdk.propertyValidator("centerFrequency", CfnConfigFrequencyPropertyValidator)(properties.centerFrequency));
  errors.collect(cdk.propertyValidator("polarization", cdk.validateString)(properties.polarization));
  return errors.wrap("supplied properties not correct for \"SpectrumConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigSpectrumConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigSpectrumConfigPropertyValidator(properties).assertSuccess();
  return {
    "Bandwidth": convertCfnConfigFrequencyBandwidthPropertyToCloudFormation(properties.bandwidth),
    "CenterFrequency": convertCfnConfigFrequencyPropertyToCloudFormation(properties.centerFrequency),
    "Polarization": cdk.stringToCloudFormation(properties.polarization)
  };
}

// @ts-ignore TS6133
function CfnConfigSpectrumConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfig.SpectrumConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.SpectrumConfigProperty>();
  ret.addPropertyResult("bandwidth", "Bandwidth", (properties.Bandwidth != null ? CfnConfigFrequencyBandwidthPropertyFromCloudFormation(properties.Bandwidth) : undefined));
  ret.addPropertyResult("centerFrequency", "CenterFrequency", (properties.CenterFrequency != null ? CfnConfigFrequencyPropertyFromCloudFormation(properties.CenterFrequency) : undefined));
  ret.addPropertyResult("polarization", "Polarization", (properties.Polarization != null ? cfn_parse.FromCloudFormation.getString(properties.Polarization) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AntennaDownlinkConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AntennaDownlinkConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigAntennaDownlinkConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("spectrumConfig", CfnConfigSpectrumConfigPropertyValidator)(properties.spectrumConfig));
  return errors.wrap("supplied properties not correct for \"AntennaDownlinkConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigAntennaDownlinkConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigAntennaDownlinkConfigPropertyValidator(properties).assertSuccess();
  return {
    "SpectrumConfig": convertCfnConfigSpectrumConfigPropertyToCloudFormation(properties.spectrumConfig)
  };
}

// @ts-ignore TS6133
function CfnConfigAntennaDownlinkConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.AntennaDownlinkConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.AntennaDownlinkConfigProperty>();
  ret.addPropertyResult("spectrumConfig", "SpectrumConfig", (properties.SpectrumConfig != null ? CfnConfigSpectrumConfigPropertyFromCloudFormation(properties.SpectrumConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DemodulationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DemodulationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigDemodulationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unvalidatedJson", cdk.validateString)(properties.unvalidatedJson));
  return errors.wrap("supplied properties not correct for \"DemodulationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigDemodulationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigDemodulationConfigPropertyValidator(properties).assertSuccess();
  return {
    "UnvalidatedJSON": cdk.stringToCloudFormation(properties.unvalidatedJson)
  };
}

// @ts-ignore TS6133
function CfnConfigDemodulationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.DemodulationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.DemodulationConfigProperty>();
  ret.addPropertyResult("unvalidatedJson", "UnvalidatedJSON", (properties.UnvalidatedJSON != null ? cfn_parse.FromCloudFormation.getString(properties.UnvalidatedJSON) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DecodeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DecodeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigDecodeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unvalidatedJson", cdk.validateString)(properties.unvalidatedJson));
  return errors.wrap("supplied properties not correct for \"DecodeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigDecodeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigDecodeConfigPropertyValidator(properties).assertSuccess();
  return {
    "UnvalidatedJSON": cdk.stringToCloudFormation(properties.unvalidatedJson)
  };
}

// @ts-ignore TS6133
function CfnConfigDecodeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.DecodeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.DecodeConfigProperty>();
  ret.addPropertyResult("unvalidatedJson", "UnvalidatedJSON", (properties.UnvalidatedJSON != null ? cfn_parse.FromCloudFormation.getString(properties.UnvalidatedJSON) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AntennaDownlinkDemodDecodeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AntennaDownlinkDemodDecodeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigAntennaDownlinkDemodDecodeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("decodeConfig", CfnConfigDecodeConfigPropertyValidator)(properties.decodeConfig));
  errors.collect(cdk.propertyValidator("demodulationConfig", CfnConfigDemodulationConfigPropertyValidator)(properties.demodulationConfig));
  errors.collect(cdk.propertyValidator("spectrumConfig", CfnConfigSpectrumConfigPropertyValidator)(properties.spectrumConfig));
  return errors.wrap("supplied properties not correct for \"AntennaDownlinkDemodDecodeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigAntennaDownlinkDemodDecodeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigAntennaDownlinkDemodDecodeConfigPropertyValidator(properties).assertSuccess();
  return {
    "DecodeConfig": convertCfnConfigDecodeConfigPropertyToCloudFormation(properties.decodeConfig),
    "DemodulationConfig": convertCfnConfigDemodulationConfigPropertyToCloudFormation(properties.demodulationConfig),
    "SpectrumConfig": convertCfnConfigSpectrumConfigPropertyToCloudFormation(properties.spectrumConfig)
  };
}

// @ts-ignore TS6133
function CfnConfigAntennaDownlinkDemodDecodeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.AntennaDownlinkDemodDecodeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.AntennaDownlinkDemodDecodeConfigProperty>();
  ret.addPropertyResult("decodeConfig", "DecodeConfig", (properties.DecodeConfig != null ? CfnConfigDecodeConfigPropertyFromCloudFormation(properties.DecodeConfig) : undefined));
  ret.addPropertyResult("demodulationConfig", "DemodulationConfig", (properties.DemodulationConfig != null ? CfnConfigDemodulationConfigPropertyFromCloudFormation(properties.DemodulationConfig) : undefined));
  ret.addPropertyResult("spectrumConfig", "SpectrumConfig", (properties.SpectrumConfig != null ? CfnConfigSpectrumConfigPropertyFromCloudFormation(properties.SpectrumConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrackingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TrackingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigTrackingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autotrack", cdk.validateString)(properties.autotrack));
  return errors.wrap("supplied properties not correct for \"TrackingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigTrackingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigTrackingConfigPropertyValidator(properties).assertSuccess();
  return {
    "Autotrack": cdk.stringToCloudFormation(properties.autotrack)
  };
}

// @ts-ignore TS6133
function CfnConfigTrackingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfig.TrackingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.TrackingConfigProperty>();
  ret.addPropertyResult("autotrack", "Autotrack", (properties.Autotrack != null ? cfn_parse.FromCloudFormation.getString(properties.Autotrack) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UplinkSpectrumConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UplinkSpectrumConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigUplinkSpectrumConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("centerFrequency", CfnConfigFrequencyPropertyValidator)(properties.centerFrequency));
  errors.collect(cdk.propertyValidator("polarization", cdk.validateString)(properties.polarization));
  return errors.wrap("supplied properties not correct for \"UplinkSpectrumConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigUplinkSpectrumConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigUplinkSpectrumConfigPropertyValidator(properties).assertSuccess();
  return {
    "CenterFrequency": convertCfnConfigFrequencyPropertyToCloudFormation(properties.centerFrequency),
    "Polarization": cdk.stringToCloudFormation(properties.polarization)
  };
}

// @ts-ignore TS6133
function CfnConfigUplinkSpectrumConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfig.UplinkSpectrumConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.UplinkSpectrumConfigProperty>();
  ret.addPropertyResult("centerFrequency", "CenterFrequency", (properties.CenterFrequency != null ? CfnConfigFrequencyPropertyFromCloudFormation(properties.CenterFrequency) : undefined));
  ret.addPropertyResult("polarization", "Polarization", (properties.Polarization != null ? cfn_parse.FromCloudFormation.getString(properties.Polarization) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EirpProperty`
 *
 * @param properties - the TypeScript properties of a `EirpProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigEirpPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("units", cdk.validateString)(properties.units));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"EirpProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigEirpPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigEirpPropertyValidator(properties).assertSuccess();
  return {
    "Units": cdk.stringToCloudFormation(properties.units),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConfigEirpPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.EirpProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.EirpProperty>();
  ret.addPropertyResult("units", "Units", (properties.Units != null ? cfn_parse.FromCloudFormation.getString(properties.Units) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AntennaUplinkConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AntennaUplinkConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigAntennaUplinkConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("spectrumConfig", CfnConfigUplinkSpectrumConfigPropertyValidator)(properties.spectrumConfig));
  errors.collect(cdk.propertyValidator("targetEirp", CfnConfigEirpPropertyValidator)(properties.targetEirp));
  errors.collect(cdk.propertyValidator("transmitDisabled", cdk.validateBoolean)(properties.transmitDisabled));
  return errors.wrap("supplied properties not correct for \"AntennaUplinkConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigAntennaUplinkConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigAntennaUplinkConfigPropertyValidator(properties).assertSuccess();
  return {
    "SpectrumConfig": convertCfnConfigUplinkSpectrumConfigPropertyToCloudFormation(properties.spectrumConfig),
    "TargetEirp": convertCfnConfigEirpPropertyToCloudFormation(properties.targetEirp),
    "TransmitDisabled": cdk.booleanToCloudFormation(properties.transmitDisabled)
  };
}

// @ts-ignore TS6133
function CfnConfigAntennaUplinkConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.AntennaUplinkConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.AntennaUplinkConfigProperty>();
  ret.addPropertyResult("spectrumConfig", "SpectrumConfig", (properties.SpectrumConfig != null ? CfnConfigUplinkSpectrumConfigPropertyFromCloudFormation(properties.SpectrumConfig) : undefined));
  ret.addPropertyResult("targetEirp", "TargetEirp", (properties.TargetEirp != null ? CfnConfigEirpPropertyFromCloudFormation(properties.TargetEirp) : undefined));
  ret.addPropertyResult("transmitDisabled", "TransmitDisabled", (properties.TransmitDisabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TransmitDisabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3RecordingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3RecordingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigS3RecordingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketArn", cdk.validateString)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"S3RecordingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigS3RecordingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigS3RecordingConfigPropertyValidator(properties).assertSuccess();
  return {
    "BucketArn": cdk.stringToCloudFormation(properties.bucketArn),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnConfigS3RecordingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfig.S3RecordingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.S3RecordingConfigProperty>();
  ret.addPropertyResult("bucketArn", "BucketArn", (properties.BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.BucketArn) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfigDataProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigConfigDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("antennaDownlinkConfig", CfnConfigAntennaDownlinkConfigPropertyValidator)(properties.antennaDownlinkConfig));
  errors.collect(cdk.propertyValidator("antennaDownlinkDemodDecodeConfig", CfnConfigAntennaDownlinkDemodDecodeConfigPropertyValidator)(properties.antennaDownlinkDemodDecodeConfig));
  errors.collect(cdk.propertyValidator("antennaUplinkConfig", CfnConfigAntennaUplinkConfigPropertyValidator)(properties.antennaUplinkConfig));
  errors.collect(cdk.propertyValidator("dataflowEndpointConfig", CfnConfigDataflowEndpointConfigPropertyValidator)(properties.dataflowEndpointConfig));
  errors.collect(cdk.propertyValidator("s3RecordingConfig", CfnConfigS3RecordingConfigPropertyValidator)(properties.s3RecordingConfig));
  errors.collect(cdk.propertyValidator("trackingConfig", CfnConfigTrackingConfigPropertyValidator)(properties.trackingConfig));
  errors.collect(cdk.propertyValidator("uplinkEchoConfig", CfnConfigUplinkEchoConfigPropertyValidator)(properties.uplinkEchoConfig));
  return errors.wrap("supplied properties not correct for \"ConfigDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigConfigDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigConfigDataPropertyValidator(properties).assertSuccess();
  return {
    "AntennaDownlinkConfig": convertCfnConfigAntennaDownlinkConfigPropertyToCloudFormation(properties.antennaDownlinkConfig),
    "AntennaDownlinkDemodDecodeConfig": convertCfnConfigAntennaDownlinkDemodDecodeConfigPropertyToCloudFormation(properties.antennaDownlinkDemodDecodeConfig),
    "AntennaUplinkConfig": convertCfnConfigAntennaUplinkConfigPropertyToCloudFormation(properties.antennaUplinkConfig),
    "DataflowEndpointConfig": convertCfnConfigDataflowEndpointConfigPropertyToCloudFormation(properties.dataflowEndpointConfig),
    "S3RecordingConfig": convertCfnConfigS3RecordingConfigPropertyToCloudFormation(properties.s3RecordingConfig),
    "TrackingConfig": convertCfnConfigTrackingConfigPropertyToCloudFormation(properties.trackingConfig),
    "UplinkEchoConfig": convertCfnConfigUplinkEchoConfigPropertyToCloudFormation(properties.uplinkEchoConfig)
  };
}

// @ts-ignore TS6133
function CfnConfigConfigDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.ConfigDataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.ConfigDataProperty>();
  ret.addPropertyResult("antennaDownlinkConfig", "AntennaDownlinkConfig", (properties.AntennaDownlinkConfig != null ? CfnConfigAntennaDownlinkConfigPropertyFromCloudFormation(properties.AntennaDownlinkConfig) : undefined));
  ret.addPropertyResult("antennaDownlinkDemodDecodeConfig", "AntennaDownlinkDemodDecodeConfig", (properties.AntennaDownlinkDemodDecodeConfig != null ? CfnConfigAntennaDownlinkDemodDecodeConfigPropertyFromCloudFormation(properties.AntennaDownlinkDemodDecodeConfig) : undefined));
  ret.addPropertyResult("antennaUplinkConfig", "AntennaUplinkConfig", (properties.AntennaUplinkConfig != null ? CfnConfigAntennaUplinkConfigPropertyFromCloudFormation(properties.AntennaUplinkConfig) : undefined));
  ret.addPropertyResult("dataflowEndpointConfig", "DataflowEndpointConfig", (properties.DataflowEndpointConfig != null ? CfnConfigDataflowEndpointConfigPropertyFromCloudFormation(properties.DataflowEndpointConfig) : undefined));
  ret.addPropertyResult("s3RecordingConfig", "S3RecordingConfig", (properties.S3RecordingConfig != null ? CfnConfigS3RecordingConfigPropertyFromCloudFormation(properties.S3RecordingConfig) : undefined));
  ret.addPropertyResult("trackingConfig", "TrackingConfig", (properties.TrackingConfig != null ? CfnConfigTrackingConfigPropertyFromCloudFormation(properties.TrackingConfig) : undefined));
  ret.addPropertyResult("uplinkEchoConfig", "UplinkEchoConfig", (properties.UplinkEchoConfig != null ? CfnConfigUplinkEchoConfigPropertyFromCloudFormation(properties.UplinkEchoConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configData", cdk.requiredValidator)(properties.configData));
  errors.collect(cdk.propertyValidator("configData", CfnConfigConfigDataPropertyValidator)(properties.configData));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigPropsValidator(properties).assertSuccess();
  return {
    "ConfigData": convertCfnConfigConfigDataPropertyToCloudFormation(properties.configData),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigProps>();
  ret.addPropertyResult("configData", "ConfigData", (properties.ConfigData != null ? CfnConfigConfigDataPropertyFromCloudFormation(properties.ConfigData) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a Dataflow Endpoint Group request.
 *
 * Dataflow endpoint groups contain a list of endpoints. When the name of a dataflow endpoint group is specified in a mission profile, the Ground Station service will connect to the endpoints and flow data during a contact.
 *
 * For more information about dataflow endpoint groups, see [Dataflow Endpoint Groups](https://docs.aws.amazon.com/ground-station/latest/ug/dataflowendpointgroups.html) .
 *
 * @cloudformationResource AWS::GroundStation::DataflowEndpointGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html
 */
export class CfnDataflowEndpointGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GroundStation::DataflowEndpointGroup";

  /**
   * Build a CfnDataflowEndpointGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataflowEndpointGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDataflowEndpointGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataflowEndpointGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the dataflow endpoint group, such as `arn:aws:groundstation:us-east-2:1234567890:dataflow-endpoint-group/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * UUID of a dataflow endpoint group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Amount of time, in seconds, after a contact ends that the Ground Station Dataflow Endpoint Group will be in a `POSTPASS` state.
   */
  public contactPostPassDurationSeconds?: number;

  /**
   * Amount of time, in seconds, before a contact starts that the Ground Station Dataflow Endpoint Group will be in a `PREPASS` state.
   */
  public contactPrePassDurationSeconds?: number;

  /**
   * List of Endpoint Details, containing address and port for each endpoint.
   */
  public endpointDetails: Array<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags assigned to a resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataflowEndpointGroupProps) {
    super(scope, id, {
      "type": CfnDataflowEndpointGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "endpointDetails", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.contactPostPassDurationSeconds = props.contactPostPassDurationSeconds;
    this.contactPrePassDurationSeconds = props.contactPrePassDurationSeconds;
    this.endpointDetails = props.endpointDetails;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GroundStation::DataflowEndpointGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contactPostPassDurationSeconds": this.contactPostPassDurationSeconds,
      "contactPrePassDurationSeconds": this.contactPrePassDurationSeconds,
      "endpointDetails": this.endpointDetails,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataflowEndpointGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataflowEndpointGroupPropsToCloudFormation(props);
  }
}

export namespace CfnDataflowEndpointGroup {
  /**
   * The security details and endpoint information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html
   */
  export interface EndpointDetailsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html#cfn-groundstation-dataflowendpointgroup-endpointdetails-awsgroundstationagentendpoint
     */
    readonly awsGroundStationAgentEndpoint?: CfnDataflowEndpointGroup.AwsGroundStationAgentEndpointProperty | cdk.IResolvable;

    /**
     * Information about the endpoint such as name and the endpoint address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html#cfn-groundstation-dataflowendpointgroup-endpointdetails-endpoint
     */
    readonly endpoint?: CfnDataflowEndpointGroup.DataflowEndpointProperty | cdk.IResolvable;

    /**
     * The role ARN, and IDs for security groups and subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html#cfn-groundstation-dataflowendpointgroup-endpointdetails-securitydetails
     */
    readonly securityDetails?: cdk.IResolvable | CfnDataflowEndpointGroup.SecurityDetailsProperty;
  }

  /**
   * Contains information such as socket address and name that defines an endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html
   */
  export interface DataflowEndpointProperty {
    /**
     * The address and port of an endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-address
     */
    readonly address?: cdk.IResolvable | CfnDataflowEndpointGroup.SocketAddressProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-mtu
     */
    readonly mtu?: number;

    /**
     * The endpoint name.
     *
     * When listing available contacts for a satellite, Ground Station searches for a dataflow endpoint whose name matches the value specified by the dataflow endpoint config of the selected mission profile. If no matching dataflow endpoints are found then Ground Station will not display any available contacts for the satellite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-name
     */
    readonly name?: string;
  }

  /**
   * The address of the endpoint, such as `192.168.1.1` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html
   */
  export interface SocketAddressProperty {
    /**
     * The name of the endpoint, such as `Endpoint 1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html#cfn-groundstation-dataflowendpointgroup-socketaddress-name
     */
    readonly name?: string;

    /**
     * The port of the endpoint, such as `55888` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html#cfn-groundstation-dataflowendpointgroup-socketaddress-port
     */
    readonly port?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint.html
   */
  export interface AwsGroundStationAgentEndpointProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint.html#cfn-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint-agentstatus
     */
    readonly agentStatus?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint.html#cfn-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint-auditresults
     */
    readonly auditResults?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint.html#cfn-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint-egressaddress
     */
    readonly egressAddress?: CfnDataflowEndpointGroup.ConnectionDetailsProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint.html#cfn-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint-ingressaddress
     */
    readonly ingressAddress?: cdk.IResolvable | CfnDataflowEndpointGroup.RangedConnectionDetailsProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint.html#cfn-groundstation-dataflowendpointgroup-awsgroundstationagentendpoint-name
     */
    readonly name?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-rangedconnectiondetails.html
   */
  export interface RangedConnectionDetailsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-rangedconnectiondetails.html#cfn-groundstation-dataflowendpointgroup-rangedconnectiondetails-mtu
     */
    readonly mtu?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-rangedconnectiondetails.html#cfn-groundstation-dataflowendpointgroup-rangedconnectiondetails-socketaddress
     */
    readonly socketAddress?: cdk.IResolvable | CfnDataflowEndpointGroup.RangedSocketAddressProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-rangedsocketaddress.html
   */
  export interface RangedSocketAddressProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-rangedsocketaddress.html#cfn-groundstation-dataflowendpointgroup-rangedsocketaddress-name
     */
    readonly name?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-rangedsocketaddress.html#cfn-groundstation-dataflowendpointgroup-rangedsocketaddress-portrange
     */
    readonly portRange?: CfnDataflowEndpointGroup.IntegerRangeProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-integerrange.html
   */
  export interface IntegerRangeProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-integerrange.html#cfn-groundstation-dataflowendpointgroup-integerrange-maximum
     */
    readonly maximum?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-integerrange.html#cfn-groundstation-dataflowendpointgroup-integerrange-minimum
     */
    readonly minimum?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-connectiondetails.html
   */
  export interface ConnectionDetailsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-connectiondetails.html#cfn-groundstation-dataflowendpointgroup-connectiondetails-mtu
     */
    readonly mtu?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-connectiondetails.html#cfn-groundstation-dataflowendpointgroup-connectiondetails-socketaddress
     */
    readonly socketAddress?: cdk.IResolvable | CfnDataflowEndpointGroup.SocketAddressProperty;
  }

  /**
   * Information about IAM roles, subnets, and security groups needed for this DataflowEndpointGroup.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html
   */
  export interface SecurityDetailsProperty {
    /**
     * The ARN of a role which Ground Station has permission to assume, such as `arn:aws:iam::1234567890:role/DataDeliveryServiceRole` .
     *
     * Ground Station will assume this role and create an ENI in your VPC on the specified subnet upon creation of a dataflow endpoint group. This ENI is used as the ingress/egress point for data streamed during a satellite contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-rolearn
     */
    readonly roleArn?: string;

    /**
     * The security group Ids of the security role, such as `sg-1234567890abcdef0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The subnet Ids of the security details, such as `subnet-12345678` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-subnetids
     */
    readonly subnetIds?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDataflowEndpointGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html
 */
export interface CfnDataflowEndpointGroupProps {
  /**
   * Amount of time, in seconds, after a contact ends that the Ground Station Dataflow Endpoint Group will be in a `POSTPASS` state.
   *
   * A Ground Station Dataflow Endpoint Group State Change event will be emitted when the Dataflow Endpoint Group enters and exits the `POSTPASS` state.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-contactpostpassdurationseconds
   */
  readonly contactPostPassDurationSeconds?: number;

  /**
   * Amount of time, in seconds, before a contact starts that the Ground Station Dataflow Endpoint Group will be in a `PREPASS` state.
   *
   * A Ground Station Dataflow Endpoint Group State Change event will be emitted when the Dataflow Endpoint Group enters and exits the `PREPASS` state.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-contactprepassdurationseconds
   */
  readonly contactPrePassDurationSeconds?: number;

  /**
   * List of Endpoint Details, containing address and port for each endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-endpointdetails
   */
  readonly endpointDetails: Array<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tags assigned to a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SocketAddressProperty`
 *
 * @param properties - the TypeScript properties of a `SocketAddressProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupSocketAddressPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"SocketAddressProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupSocketAddressPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupSocketAddressPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupSocketAddressPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataflowEndpointGroup.SocketAddressProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.SocketAddressProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataflowEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `DataflowEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupDataflowEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", CfnDataflowEndpointGroupSocketAddressPropertyValidator)(properties.address));
  errors.collect(cdk.propertyValidator("mtu", cdk.validateNumber)(properties.mtu));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"DataflowEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupDataflowEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupDataflowEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Address": convertCfnDataflowEndpointGroupSocketAddressPropertyToCloudFormation(properties.address),
    "Mtu": cdk.numberToCloudFormation(properties.mtu),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupDataflowEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.DataflowEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.DataflowEndpointProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? CfnDataflowEndpointGroupSocketAddressPropertyFromCloudFormation(properties.Address) : undefined));
  ret.addPropertyResult("mtu", "Mtu", (properties.Mtu != null ? cfn_parse.FromCloudFormation.getNumber(properties.Mtu) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntegerRangeProperty`
 *
 * @param properties - the TypeScript properties of a `IntegerRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupIntegerRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximum", cdk.validateNumber)(properties.maximum));
  errors.collect(cdk.propertyValidator("minimum", cdk.validateNumber)(properties.minimum));
  return errors.wrap("supplied properties not correct for \"IntegerRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupIntegerRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupIntegerRangePropertyValidator(properties).assertSuccess();
  return {
    "Maximum": cdk.numberToCloudFormation(properties.maximum),
    "Minimum": cdk.numberToCloudFormation(properties.minimum)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupIntegerRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.IntegerRangeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.IntegerRangeProperty>();
  ret.addPropertyResult("maximum", "Maximum", (properties.Maximum != null ? cfn_parse.FromCloudFormation.getNumber(properties.Maximum) : undefined));
  ret.addPropertyResult("minimum", "Minimum", (properties.Minimum != null ? cfn_parse.FromCloudFormation.getNumber(properties.Minimum) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RangedSocketAddressProperty`
 *
 * @param properties - the TypeScript properties of a `RangedSocketAddressProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupRangedSocketAddressPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("portRange", CfnDataflowEndpointGroupIntegerRangePropertyValidator)(properties.portRange));
  return errors.wrap("supplied properties not correct for \"RangedSocketAddressProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupRangedSocketAddressPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupRangedSocketAddressPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "PortRange": convertCfnDataflowEndpointGroupIntegerRangePropertyToCloudFormation(properties.portRange)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupRangedSocketAddressPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataflowEndpointGroup.RangedSocketAddressProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.RangedSocketAddressProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("portRange", "PortRange", (properties.PortRange != null ? CfnDataflowEndpointGroupIntegerRangePropertyFromCloudFormation(properties.PortRange) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RangedConnectionDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `RangedConnectionDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupRangedConnectionDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mtu", cdk.validateNumber)(properties.mtu));
  errors.collect(cdk.propertyValidator("socketAddress", CfnDataflowEndpointGroupRangedSocketAddressPropertyValidator)(properties.socketAddress));
  return errors.wrap("supplied properties not correct for \"RangedConnectionDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupRangedConnectionDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupRangedConnectionDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Mtu": cdk.numberToCloudFormation(properties.mtu),
    "SocketAddress": convertCfnDataflowEndpointGroupRangedSocketAddressPropertyToCloudFormation(properties.socketAddress)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupRangedConnectionDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataflowEndpointGroup.RangedConnectionDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.RangedConnectionDetailsProperty>();
  ret.addPropertyResult("mtu", "Mtu", (properties.Mtu != null ? cfn_parse.FromCloudFormation.getNumber(properties.Mtu) : undefined));
  ret.addPropertyResult("socketAddress", "SocketAddress", (properties.SocketAddress != null ? CfnDataflowEndpointGroupRangedSocketAddressPropertyFromCloudFormation(properties.SocketAddress) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectionDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupConnectionDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mtu", cdk.validateNumber)(properties.mtu));
  errors.collect(cdk.propertyValidator("socketAddress", CfnDataflowEndpointGroupSocketAddressPropertyValidator)(properties.socketAddress));
  return errors.wrap("supplied properties not correct for \"ConnectionDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupConnectionDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupConnectionDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Mtu": cdk.numberToCloudFormation(properties.mtu),
    "SocketAddress": convertCfnDataflowEndpointGroupSocketAddressPropertyToCloudFormation(properties.socketAddress)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupConnectionDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.ConnectionDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.ConnectionDetailsProperty>();
  ret.addPropertyResult("mtu", "Mtu", (properties.Mtu != null ? cfn_parse.FromCloudFormation.getNumber(properties.Mtu) : undefined));
  ret.addPropertyResult("socketAddress", "SocketAddress", (properties.SocketAddress != null ? CfnDataflowEndpointGroupSocketAddressPropertyFromCloudFormation(properties.SocketAddress) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsGroundStationAgentEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `AwsGroundStationAgentEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupAwsGroundStationAgentEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentStatus", cdk.validateString)(properties.agentStatus));
  errors.collect(cdk.propertyValidator("auditResults", cdk.validateString)(properties.auditResults));
  errors.collect(cdk.propertyValidator("egressAddress", CfnDataflowEndpointGroupConnectionDetailsPropertyValidator)(properties.egressAddress));
  errors.collect(cdk.propertyValidator("ingressAddress", CfnDataflowEndpointGroupRangedConnectionDetailsPropertyValidator)(properties.ingressAddress));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"AwsGroundStationAgentEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupAwsGroundStationAgentEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupAwsGroundStationAgentEndpointPropertyValidator(properties).assertSuccess();
  return {
    "AgentStatus": cdk.stringToCloudFormation(properties.agentStatus),
    "AuditResults": cdk.stringToCloudFormation(properties.auditResults),
    "EgressAddress": convertCfnDataflowEndpointGroupConnectionDetailsPropertyToCloudFormation(properties.egressAddress),
    "IngressAddress": convertCfnDataflowEndpointGroupRangedConnectionDetailsPropertyToCloudFormation(properties.ingressAddress),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupAwsGroundStationAgentEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.AwsGroundStationAgentEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.AwsGroundStationAgentEndpointProperty>();
  ret.addPropertyResult("agentStatus", "AgentStatus", (properties.AgentStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AgentStatus) : undefined));
  ret.addPropertyResult("auditResults", "AuditResults", (properties.AuditResults != null ? cfn_parse.FromCloudFormation.getString(properties.AuditResults) : undefined));
  ret.addPropertyResult("egressAddress", "EgressAddress", (properties.EgressAddress != null ? CfnDataflowEndpointGroupConnectionDetailsPropertyFromCloudFormation(properties.EgressAddress) : undefined));
  ret.addPropertyResult("ingressAddress", "IngressAddress", (properties.IngressAddress != null ? CfnDataflowEndpointGroupRangedConnectionDetailsPropertyFromCloudFormation(properties.IngressAddress) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecurityDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `SecurityDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupSecurityDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"SecurityDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupSecurityDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupSecurityDetailsPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupSecurityDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataflowEndpointGroup.SecurityDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.SecurityDetailsProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupEndpointDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsGroundStationAgentEndpoint", CfnDataflowEndpointGroupAwsGroundStationAgentEndpointPropertyValidator)(properties.awsGroundStationAgentEndpoint));
  errors.collect(cdk.propertyValidator("endpoint", CfnDataflowEndpointGroupDataflowEndpointPropertyValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("securityDetails", CfnDataflowEndpointGroupSecurityDetailsPropertyValidator)(properties.securityDetails));
  return errors.wrap("supplied properties not correct for \"EndpointDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupEndpointDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupEndpointDetailsPropertyValidator(properties).assertSuccess();
  return {
    "AwsGroundStationAgentEndpoint": convertCfnDataflowEndpointGroupAwsGroundStationAgentEndpointPropertyToCloudFormation(properties.awsGroundStationAgentEndpoint),
    "Endpoint": convertCfnDataflowEndpointGroupDataflowEndpointPropertyToCloudFormation(properties.endpoint),
    "SecurityDetails": convertCfnDataflowEndpointGroupSecurityDetailsPropertyToCloudFormation(properties.securityDetails)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupEndpointDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.EndpointDetailsProperty>();
  ret.addPropertyResult("awsGroundStationAgentEndpoint", "AwsGroundStationAgentEndpoint", (properties.AwsGroundStationAgentEndpoint != null ? CfnDataflowEndpointGroupAwsGroundStationAgentEndpointPropertyFromCloudFormation(properties.AwsGroundStationAgentEndpoint) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? CfnDataflowEndpointGroupDataflowEndpointPropertyFromCloudFormation(properties.Endpoint) : undefined));
  ret.addPropertyResult("securityDetails", "SecurityDetails", (properties.SecurityDetails != null ? CfnDataflowEndpointGroupSecurityDetailsPropertyFromCloudFormation(properties.SecurityDetails) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataflowEndpointGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataflowEndpointGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataflowEndpointGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactPostPassDurationSeconds", cdk.validateNumber)(properties.contactPostPassDurationSeconds));
  errors.collect(cdk.propertyValidator("contactPrePassDurationSeconds", cdk.validateNumber)(properties.contactPrePassDurationSeconds));
  errors.collect(cdk.propertyValidator("endpointDetails", cdk.requiredValidator)(properties.endpointDetails));
  errors.collect(cdk.propertyValidator("endpointDetails", cdk.listValidator(CfnDataflowEndpointGroupEndpointDetailsPropertyValidator))(properties.endpointDetails));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDataflowEndpointGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDataflowEndpointGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataflowEndpointGroupPropsValidator(properties).assertSuccess();
  return {
    "ContactPostPassDurationSeconds": cdk.numberToCloudFormation(properties.contactPostPassDurationSeconds),
    "ContactPrePassDurationSeconds": cdk.numberToCloudFormation(properties.contactPrePassDurationSeconds),
    "EndpointDetails": cdk.listMapper(convertCfnDataflowEndpointGroupEndpointDetailsPropertyToCloudFormation)(properties.endpointDetails),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroupProps>();
  ret.addPropertyResult("contactPostPassDurationSeconds", "ContactPostPassDurationSeconds", (properties.ContactPostPassDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContactPostPassDurationSeconds) : undefined));
  ret.addPropertyResult("contactPrePassDurationSeconds", "ContactPrePassDurationSeconds", (properties.ContactPrePassDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContactPrePassDurationSeconds) : undefined));
  ret.addPropertyResult("endpointDetails", "EndpointDetails", (properties.EndpointDetails != null ? cfn_parse.FromCloudFormation.getArray(CfnDataflowEndpointGroupEndpointDetailsPropertyFromCloudFormation)(properties.EndpointDetails) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Mission profiles specify parameters and provide references to config objects to define how Ground Station lists and executes contacts.
 *
 * @cloudformationResource AWS::GroundStation::MissionProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html
 */
export class CfnMissionProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GroundStation::MissionProfile";

  /**
   * Build a CfnMissionProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMissionProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMissionProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMissionProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the mission profile, such as `arn:aws:groundstation:us-east-2:1234567890:mission-profile/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the mission profile, such as `9940bf3b-d2ba-427e-9906-842b5e5d2296` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The region of the mission profile.
   *
   * @cloudformationAttribute Region
   */
  public readonly attrRegion: string;

  /**
   * Amount of time in seconds after a contact ends that you’d like to receive a CloudWatch Event indicating the pass has finished.
   */
  public contactPostPassDurationSeconds?: number;

  /**
   * Amount of time in seconds prior to contact start that you'd like to receive a CloudWatch Event indicating an upcoming pass.
   */
  public contactPrePassDurationSeconds?: number;

  /**
   * A list containing lists of config ARNs.
   */
  public dataflowEdges: Array<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Minimum length of a contact in seconds that Ground Station will return when listing contacts.
   */
  public minimumViableContactDurationSeconds: number;

  /**
   * The name of the mission profile.
   */
  public name: string;

  public streamsKmsKey?: cdk.IResolvable | CfnMissionProfile.StreamsKmsKeyProperty;

  /**
   * The ARN of the KMS Key or Alias Key role used to define permissions on KMS Key usage.
   */
  public streamsKmsRole?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags assigned to the mission profile.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of a tracking config objects that defines how to track the satellite through the sky during a contact.
   */
  public trackingConfigArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMissionProfileProps) {
    super(scope, id, {
      "type": CfnMissionProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataflowEdges", this);
    cdk.requireProperty(props, "minimumViableContactDurationSeconds", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "trackingConfigArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrRegion = cdk.Token.asString(this.getAtt("Region", cdk.ResolutionTypeHint.STRING));
    this.contactPostPassDurationSeconds = props.contactPostPassDurationSeconds;
    this.contactPrePassDurationSeconds = props.contactPrePassDurationSeconds;
    this.dataflowEdges = props.dataflowEdges;
    this.minimumViableContactDurationSeconds = props.minimumViableContactDurationSeconds;
    this.name = props.name;
    this.streamsKmsKey = props.streamsKmsKey;
    this.streamsKmsRole = props.streamsKmsRole;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GroundStation::MissionProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.trackingConfigArn = props.trackingConfigArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contactPostPassDurationSeconds": this.contactPostPassDurationSeconds,
      "contactPrePassDurationSeconds": this.contactPrePassDurationSeconds,
      "dataflowEdges": this.dataflowEdges,
      "minimumViableContactDurationSeconds": this.minimumViableContactDurationSeconds,
      "name": this.name,
      "streamsKmsKey": this.streamsKmsKey,
      "streamsKmsRole": this.streamsKmsRole,
      "tags": this.tags.renderTags(),
      "trackingConfigArn": this.trackingConfigArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMissionProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMissionProfilePropsToCloudFormation(props);
  }
}

export namespace CfnMissionProfile {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-streamskmskey.html
   */
  export interface StreamsKmsKeyProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-streamskmskey.html#cfn-groundstation-missionprofile-streamskmskey-kmsaliasarn
     */
    readonly kmsAliasArn?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-streamskmskey.html#cfn-groundstation-missionprofile-streamskmskey-kmskeyarn
     */
    readonly kmsKeyArn?: string;
  }

  /**
   * A dataflow edge defines from where and to where data will flow during a contact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html
   */
  export interface DataflowEdgeProperty {
    /**
     * The ARN of the destination for this dataflow edge.
     *
     * For example, specify the ARN of a dataflow endpoint config for a downlink edge or an antenna uplink config for an uplink edge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html#cfn-groundstation-missionprofile-dataflowedge-destination
     */
    readonly destination?: string;

    /**
     * The ARN of the source for this dataflow edge.
     *
     * For example, specify the ARN of an antenna downlink config for a downlink edge or a dataflow endpoint config for an uplink edge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html#cfn-groundstation-missionprofile-dataflowedge-source
     */
    readonly source?: string;
  }
}

/**
 * Properties for defining a `CfnMissionProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html
 */
export interface CfnMissionProfileProps {
  /**
   * Amount of time in seconds after a contact ends that you’d like to receive a CloudWatch Event indicating the pass has finished.
   *
   * For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactpostpassdurationseconds
   */
  readonly contactPostPassDurationSeconds?: number;

  /**
   * Amount of time in seconds prior to contact start that you'd like to receive a CloudWatch Event indicating an upcoming pass.
   *
   * For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactprepassdurationseconds
   */
  readonly contactPrePassDurationSeconds?: number;

  /**
   * A list containing lists of config ARNs.
   *
   * Each list of config ARNs is an edge, with a "from" config and a "to" config.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-dataflowedges
   */
  readonly dataflowEdges: Array<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Minimum length of a contact in seconds that Ground Station will return when listing contacts.
   *
   * Ground Station will not return contacts shorter than this duration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-minimumviablecontactdurationseconds
   */
  readonly minimumViableContactDurationSeconds: number;

  /**
   * The name of the mission profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-name
   */
  readonly name: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-streamskmskey
   */
  readonly streamsKmsKey?: cdk.IResolvable | CfnMissionProfile.StreamsKmsKeyProperty;

  /**
   * The ARN of the KMS Key or Alias Key role used to define permissions on KMS Key usage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-streamskmsrole
   */
  readonly streamsKmsRole?: string;

  /**
   * Tags assigned to the mission profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of a tracking config objects that defines how to track the satellite through the sky during a contact.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-trackingconfigarn
   */
  readonly trackingConfigArn: string;
}

/**
 * Determine whether the given properties match those of a `StreamsKmsKeyProperty`
 *
 * @param properties - the TypeScript properties of a `StreamsKmsKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMissionProfileStreamsKmsKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsAliasArn", cdk.validateString)(properties.kmsAliasArn));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  return errors.wrap("supplied properties not correct for \"StreamsKmsKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnMissionProfileStreamsKmsKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMissionProfileStreamsKmsKeyPropertyValidator(properties).assertSuccess();
  return {
    "KmsAliasArn": cdk.stringToCloudFormation(properties.kmsAliasArn),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn)
  };
}

// @ts-ignore TS6133
function CfnMissionProfileStreamsKmsKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMissionProfile.StreamsKmsKeyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMissionProfile.StreamsKmsKeyProperty>();
  ret.addPropertyResult("kmsAliasArn", "KmsAliasArn", (properties.KmsAliasArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsAliasArn) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataflowEdgeProperty`
 *
 * @param properties - the TypeScript properties of a `DataflowEdgeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMissionProfileDataflowEdgePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  return errors.wrap("supplied properties not correct for \"DataflowEdgeProperty\"");
}

// @ts-ignore TS6133
function convertCfnMissionProfileDataflowEdgePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMissionProfileDataflowEdgePropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination),
    "Source": cdk.stringToCloudFormation(properties.source)
  };
}

// @ts-ignore TS6133
function CfnMissionProfileDataflowEdgePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMissionProfile.DataflowEdgeProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMissionProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnMissionProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMissionProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactPostPassDurationSeconds", cdk.validateNumber)(properties.contactPostPassDurationSeconds));
  errors.collect(cdk.propertyValidator("contactPrePassDurationSeconds", cdk.validateNumber)(properties.contactPrePassDurationSeconds));
  errors.collect(cdk.propertyValidator("dataflowEdges", cdk.requiredValidator)(properties.dataflowEdges));
  errors.collect(cdk.propertyValidator("dataflowEdges", cdk.listValidator(CfnMissionProfileDataflowEdgePropertyValidator))(properties.dataflowEdges));
  errors.collect(cdk.propertyValidator("minimumViableContactDurationSeconds", cdk.requiredValidator)(properties.minimumViableContactDurationSeconds));
  errors.collect(cdk.propertyValidator("minimumViableContactDurationSeconds", cdk.validateNumber)(properties.minimumViableContactDurationSeconds));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("streamsKmsKey", CfnMissionProfileStreamsKmsKeyPropertyValidator)(properties.streamsKmsKey));
  errors.collect(cdk.propertyValidator("streamsKmsRole", cdk.validateString)(properties.streamsKmsRole));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("trackingConfigArn", cdk.requiredValidator)(properties.trackingConfigArn));
  errors.collect(cdk.propertyValidator("trackingConfigArn", cdk.validateString)(properties.trackingConfigArn));
  return errors.wrap("supplied properties not correct for \"CfnMissionProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnMissionProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMissionProfilePropsValidator(properties).assertSuccess();
  return {
    "ContactPostPassDurationSeconds": cdk.numberToCloudFormation(properties.contactPostPassDurationSeconds),
    "ContactPrePassDurationSeconds": cdk.numberToCloudFormation(properties.contactPrePassDurationSeconds),
    "DataflowEdges": cdk.listMapper(convertCfnMissionProfileDataflowEdgePropertyToCloudFormation)(properties.dataflowEdges),
    "MinimumViableContactDurationSeconds": cdk.numberToCloudFormation(properties.minimumViableContactDurationSeconds),
    "Name": cdk.stringToCloudFormation(properties.name),
    "StreamsKmsKey": convertCfnMissionProfileStreamsKmsKeyPropertyToCloudFormation(properties.streamsKmsKey),
    "StreamsKmsRole": cdk.stringToCloudFormation(properties.streamsKmsRole),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TrackingConfigArn": cdk.stringToCloudFormation(properties.trackingConfigArn)
  };
}

// @ts-ignore TS6133
function CfnMissionProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMissionProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMissionProfileProps>();
  ret.addPropertyResult("contactPostPassDurationSeconds", "ContactPostPassDurationSeconds", (properties.ContactPostPassDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContactPostPassDurationSeconds) : undefined));
  ret.addPropertyResult("contactPrePassDurationSeconds", "ContactPrePassDurationSeconds", (properties.ContactPrePassDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContactPrePassDurationSeconds) : undefined));
  ret.addPropertyResult("dataflowEdges", "DataflowEdges", (properties.DataflowEdges != null ? cfn_parse.FromCloudFormation.getArray(CfnMissionProfileDataflowEdgePropertyFromCloudFormation)(properties.DataflowEdges) : undefined));
  ret.addPropertyResult("minimumViableContactDurationSeconds", "MinimumViableContactDurationSeconds", (properties.MinimumViableContactDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumViableContactDurationSeconds) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("streamsKmsKey", "StreamsKmsKey", (properties.StreamsKmsKey != null ? CfnMissionProfileStreamsKmsKeyPropertyFromCloudFormation(properties.StreamsKmsKey) : undefined));
  ret.addPropertyResult("streamsKmsRole", "StreamsKmsRole", (properties.StreamsKmsRole != null ? cfn_parse.FromCloudFormation.getString(properties.StreamsKmsRole) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("trackingConfigArn", "TrackingConfigArn", (properties.TrackingConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.TrackingConfigArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}
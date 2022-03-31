import { IRole } from '@aws-cdk/aws-iam';
import { IBucket } from '@aws-cdk/aws-s3';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnConfig, CfnConfigProps } from './groundstation.generated';

/**
 * Base interface for configuration object
 */
export interface IConfig {
  /**
   * The ARN of the config
   *
   * @attribute
   */
  readonly configArn: string;

  /**
   * The logical Id of the config
   *
   * @attribute
   */
  readonly configId: string

  /**
   * The type of the config
   *
   * @attribute
   */
  readonly configType: string
}

/**
 *
 * @resource AWS::GroundStation::Config
 */
class BaseConfig extends Resource implements IConfig {
  public readonly configArn: string;
  public readonly configId: string
  public readonly configType: string

  constructor(scope: Construct, id: string, props: CfnConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });

    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
      configData: props.configData,
    });

    this.configArn = resource.attrArn;
    this.configId = resource.attrId;
    this.configType = resource.attrType;
  }
}

/**
* Units of frequency in Hertz
*/
export enum FrequencyUnits {
  /**
  * Gigahertz (GHz) - 10 ** 9
  */
  GHZ = 'GHz',
  /**
  * Megahertz (MHz) - 10 ** 6
  */
  MHZ = 'MHz',
  /**
  * Kilohertz (kHz) - 10 ** 3
  */
  KHZ = 'kHz'
}

/**
* Effective Isotropic Radiated Power
*/
export enum EripUnits {
  /**
  *  Decibel watt (dBW) - [More Info](https://en.wikipedia.org/wiki/Decibel_watt)
  */
  DBW = 'dBW'
}

/**
 * Orientation of the radio signal - [More Info](https://en.wikipedia.org/wiki/Circular_polarization)
 */
export enum Polarization {
  /**
   * Left-handed circular polarization - counter clockwise
   */
  LEFT_HAND = 'LEFT_HAND',
  /**
   * No polarization
   */
  NONE = 'NONE',
  /**
   * Right-handed circular polarization - clockwise
   */
  RIGHT_HAND = 'RIGHT_HAND'
}

/**
 * Bandwidth configuration of the signal
 */
export interface FrequencyBandwidth {
  /**
   * Units of the bandwidth
   */
  readonly units: FrequencyUnits;

  /**
   * Value of the bandwidth frequency
   */
  readonly value: number;
}

/**
 * Frequency of the radio signal
 */
export interface Frequency {

  /**
   * Units of frequency
   */
  readonly units: FrequencyUnits;

  /**
   * Value of frequency
   */
  readonly value: number;
}

/**
 * Spectrum configuration
 */
export interface UplinkSpectrumConfig {
  /**
   * Center frequency of the spectrum in Hertz
   */
  readonly centerFrequency: Frequency;

  /**
   * Polarization of the spectrum
   */
  readonly polarization: Polarization;
}

/**
 * Spectrum configuration with bandwidth
 */
export interface SpectrumConfig extends UplinkSpectrumConfig {
  /**
   * Bandwidth of the spectrum in Hertz
   */
  readonly bandwidth: FrequencyBandwidth;
}


/**
 * Basic properties for config
 */
export interface ConfigProps {
  /**
   * Friendly name of the antenna downlink config.
   */
  readonly configName: string;
}

/**
 *  Provides information about how AWS Ground Station should configure an antenna for downlink during a contact. Use an antenna downlink config in a mission profile to receive the downlink data in raw DigIF format.
 */
export interface AntennaDownlinkConfigProps extends ConfigProps {
  /**
   * Defines the spectrum configuration.
   */
  readonly spectrumConfig: SpectrumConfig
}

/**
 * Effective Isotropic Radiated Power
 */
export interface Erip {
  /**
   * units of ERIP
   */
  readonly units: EripUnits;

  /**
   * value of ERIP
   */
  readonly value: number;
}

/**
 * Configuration for Antenna Downlink
 *
 * @resource AWS::GroundStation::Config
 *
 * @param scope - scope in which this resource is defined
 * @param id - scoped id of the resource
 * @param props - resource properties
 **/
export class AntennaDownlinkConfig extends BaseConfig {
  constructor(scope: Construct, id: string, props: AntennaDownlinkConfigProps) {
    super(scope, id, {
      name: props.configName,
      configData: {
        antennaDownlinkConfig: {
          spectrumConfig: props.spectrumConfig,
        },
      },
    });
  }
}

/**
 * Unvalidated Json that goes into demod and decode configurations
 */
export interface UnvalidatedJson {
  /**
   * Unvalidated Json string
   */
  readonly unvalidatedJSON: string;
}


/**
 * Properties for Antenna Downlink Demod Decode Config
 *
 */
export interface AntennaDownlinkDemodDecodeConfigProps extends ConfigProps {
  /**
   * Defines how the RF signal will be decoded. See [AWS documentation](https://docs.aws.amazon.com/groundstation/latest/userguide/gs-antenna-downlink-demod-decode.html)
   */
  readonly decodeConfig: UnvalidatedJson

  /**
   * Defines how the RF signal will be demodulated.
   */
  readonly demodulationConfig: UnvalidatedJson

  /**
   * Defines the spectrum configuration.
   */
  readonly spectrumConfig: SpectrumConfig,


}


/**
 * Configuration for Antenna Downlink Demodulation
 *
 * Antenna downlink demod decode configs are a more complex and customizable config type that you can use to execute downlink contacts with demod or decode. If you're interested in executing these types of contacts, contact the AWS Ground Station team. We'll help you define the right config and mission profile for your use case.
 *
 * @resource AWS::GroundStation::Config
 **/
export class AntennaDownlinkDemodDecodeConfig extends BaseConfig {
  constructor(scope: Construct, id: string, props: AntennaDownlinkDemodDecodeConfigProps) {
    super(scope, id, {
      name: props.configName,
      configData: {
        antennaDownlinkDemodDecodeConfig: {
          decodeConfig: {
            unvalidatedJson: props.decodeConfig.unvalidatedJSON,
          },
          demodulationConfig: {
            unvalidatedJson: props.demodulationConfig.unvalidatedJSON,
          },
          spectrumConfig: props.spectrumConfig,
        },
      },
    });
  }
}

/**
 * Configuration for Antenna Uplink
 */
export interface AntennaUplinkConfigProps extends ConfigProps {
  /**
   * Defines the spectrum configuration.
   *
   * @default None
   */
  readonly spectrumConfig?: UplinkSpectrumConfig

  /**
   *  The equivalent isotropically radiated power (EIRP) to use for uplink transmissions. Valid values are between 20.0 to 50.0 dBW.
   *
   * @default None
   */
  readonly targetEirp?: Erip

  /**
   *  Whether or not uplink transmit is disabled.
   *
   * @default false
   */
  readonly transmitDisabled?: boolean
}


/**
 * Configuration for Antenna Uplink
 *
 *  You can use antenna uplink configs to configure the antenna for uplink during your contact. They consist of a spectrum config with frequency, polarization, and target effective isotropic radiated power (EIRP). For information about how to configure a contact for uplink loopback, see Uplink Echo Config.
 *
 * @resource AWS::GroundStation::Config
 *
 * @attribute configArn - ARN of the config
 * @attribute configId - ID of the config
 * @attribute configType - Type of the config
 **/
export class AntennaUplinkConfig extends BaseConfig {
  constructor(scope: Construct, id: string, props: AntennaUplinkConfigProps) {
    super(scope, id, {
      name: props.configName,
      configData: {
        antennaUplinkConfig: props,
      },
    });
  }
}

/**
 * Properties for Dataflow Endpoint Configuration
 */
export interface DataflowEndpointConfigProps extends ConfigProps{


  /**
   * The name of the dataflow endpoint to use during contacts.
   *
   * @default None
   */
  readonly dataflowEndpointName?: string

  /**
   * The region of the dataflow endpoint to use during contacts. When omitted, Ground Station will use the region of the contact.
   *
   * @default None
   */
  readonly dataflowEndpointRegion?: string
}


/**
 * Configuration for a Dataflow Endpoint
 *
 * You can use dataflow endpoint configs to specify which dataflow endpoint in a dataflow endpoint group from which or to which you want data to flow during a contact. The two parameters of a dataflow endpoint config specify the name and region of the dataflow endpoint. When reserving a contact, AWS Ground Station analyzes the mission profile you specified and attempts to find a dataflow endpoint group that contains all of the dataflow endpoints specified by the dataflow endpoint configs contained in your mission profile.
 *
 * @resource AWS::GroundStation::Config
 *
 * @attribute configArn - ARN of the config
 * @attribute configId - ID of the config
 * @attribute configType - Type of the config
 **/
export class DataflowEndpointConfig extends BaseConfig {
  constructor(scope: Construct, id: string, props: DataflowEndpointConfigProps) {
    super(scope, id, {
      name: props.configName,
      configData: {
        dataflowEndpointConfig: {
          dataflowEndpointName: props.dataflowEndpointName,
          dataflowEndpointRegion: props.dataflowEndpointRegion,
        },
      },
    });
  }
}


/**
 * Configuration for S3 Recording
 */
export interface S3RecordingConfigProps extends ConfigProps{
  /**
   * S3 Bucket where the data is written. The name of the S3 Bucket provided must begin with aws-groundstation.
   */
  readonly bucket: IBucket

  /**
   * The prefix of the S3 data object. If you choose to use any optional keys for substitution, these values will be replaced with the corresponding information from your contact details. For example, a prefix of {satellite_id}/{year}/{month}/{day}/ will replaced with fake_satellite_id/2021/01/10/
   *
   * @default None
   */
  readonly prefix?: string

  /**
   * Defines the ARN of the role assumed for putting archives to S3.
   */
  readonly role: IRole

}

/**
 * Configuration for a S3 Recording
 *
 * You can use S3 recording configs to specify an Amazon S3 bucket to which you want downlinked data delivered. The two parameters of an S3 recording config specify the Amazon S3 bucket and IAM role for AWS Ground Station to assume when delivering the data to your Amazon S3 bucket.
 *
 * The IAM role and Amazon S3 bucket specified must meet the following criteria:
 *  - The Amazon S3 bucket's name must begin with aws-groundstation.
 *  - The IAM role must have a trust policy that allows the groundstation.amazonaws.com service principal to assume the role. See the Example Trust Policy section below for an example. During config creation the config resource id does not exist, the trust policy must use an asterisk (*) in place of your-config-id and can be updated after creation with the config resource id.
 *  - The IAM role must have an IAM policy that allows the role to perform the s3:GetBucketLocation action on the bucket and s3:PutObject action on the bucket's objects. If the Amazon S3 bucket has a bucket policy, then the bucket policy must also allow the IAM role to perform these actions. See the Example Role Policy section below for an example.
 *
 * @resource AWS::GroundStation::Config
 **/
export class S3RecordingConfig extends BaseConfig {
  constructor(scope: Construct, id: string, props: S3RecordingConfigProps) {
    super(scope, id, {
      name: props.configName,
      configData: {
        s3RecordingConfig: {
          bucketArn: props.bucket.bucketArn,
          prefix: props.prefix,
          roleArn: props.role.roleArn,
        },
      },
    });
  }
}

/**
 * You can use tracking configs in the mission profile to determine whether autotrack should be enabled during your contacts.
 */
export enum Autotrack {
  /**
   * No autotrack should be used for your contacts.
   */
  REMOVED = 'REMOVED',

  /**
   * Autotrack is preferred for contacts, but contacts can still be executed without autotrack.
   */
  PREFERRED = 'PREFERRED',

  /**
   * Autotrack is required for your contacts.
   */
  REQUIRED = 'REQUIRED'
}

/**
 * Tracking configuration for ground station
 */
export interface TrackingConfigProps extends ConfigProps {
  /**
   * Tracking mode the dish will use
   */
  readonly autotrack: Autotrack
}


/**
 * Configuration for a Tracking
 *
 * @resource AWS::GroundStation::Config
 **/
export class TrackingConfig extends BaseConfig {
  constructor(scope: Construct, id: string, props: TrackingConfigProps) {
    super(scope, id, {
      name: props.configName,
      configData: {
        trackingConfig: {
          autotrack: props.autotrack,
        },
      },
    });
  }
}

/**
 * Configuration for an Uplink Echo
 */
export interface UplinkEchoConfigProps extends ConfigProps {


  /**
   * ARN of the antenna uplink to echo
   */
  readonly antennaUplinkConfig: IConfig

  /**
   * Enabled or disabled control of echo
   */
  readonly enabled: boolean
}

/**
 * Configuration for a Uplink Echo
 *
 * Uplink echo configs tell the antenna how to execute an uplink echo. This echoes the signal sent by the antenna back to your dataflow endpoint. An uplink echo config contains the ARN of an uplink config. The antenna uses the parameters from the uplink config pointed to by the ARN when executing an uplink echo.
 *
 * @resource AWS::GroundStation::Config
 **/
export class UplinkEchoConfig extends BaseConfig {
  constructor(scope: Construct, id: string, props: UplinkEchoConfigProps) {
    super(scope, id, {
      name: props.configName,
      configData: {
        uplinkEchoConfig: {
          antennaUplinkConfigArn: props.antennaUplinkConfig.configArn,
          enabled: props.enabled,
        },
      },
    });
  }
}
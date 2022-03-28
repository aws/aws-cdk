import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnConfig } from './groundstation.generated';

export interface IConfig {}

class BaseConfig extends Resource implements IConfig {}

export enum FrequencyUnits {
  GHZ = 'GHz',
  MHZ = 'MHz',
  KHZ = 'kHz'
}

export enum EripUnits {
  DBW = 'dBW'
}

export enum Polarization {
  LEFT_HAND = 'LEFT_HAND',
  NONE = 'NONE',
  RIGHT_HAND = 'RIGHT_HAND'
}

export interface FrequencyBandwidth {
  readonly units: FrequencyUnits;
  readonly value: number;
}

export interface Frequency {
  readonly units: FrequencyUnits;
  readonly value: number;
}

export interface BandwidthSpectrumConfig {
  readonly bandwidth: FrequencyBandwidth;
  readonly centerFrequency: Frequency;
  readonly polarization: Polarization;
}

export interface AntennaDownlinkConfigProps {
  readonly spectrumConfig: BandwidthSpectrumConfig
  readonly name: string;
}

export interface Erip {
  readonly units: EripUnits;
  readonly value: number;
}

/**
 * Configuration for Antenna Downlink
 *
 * @resource AWS::GroundStation::Config
 **/
export class AntennaDownlinkConfig extends BaseConfig {

  private readonly _resource: CfnConfig;

  public readonly arn: string;
  public readonly id: string
  public readonly type: string

  constructor(scope: Construct, id: string, props: AntennaDownlinkConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });

    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
      configData: {
        antennaDownlinkConfig: {
          spectrumConfig: props.spectrumConfig,
        },
      },
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.type = this._resource.attrType;
  }
}


export interface UnvalidatedJson {
  readonly unvalidatedJSON: string;
}


export interface AntennaDownlinkDemodConfigProps {
  readonly decodeConfig: UnvalidatedJson
  readonly demodulationConfig: UnvalidatedJson
  readonly spectrumConfig: SpectrumConfig,
  readonly name: string;
}


/**
 * Configuration for Antenna Downlink Demodulation
 *
 * @resource AWS::GroundStation::Config
 **/
export class AntennaDownlinkDemodDecodeConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  public readonly arn: string;
  public readonly id: string
  public readonly type: string

  constructor(scope: Construct, id: string, props: AntennaDownlinkDemodConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });

    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
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

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.type = this._resource.attrType;
  }
}


export interface SpectrumConfig {
  readonly centerFrequency: Frequency;
  readonly polarization: Polarization;
}

export interface AntennaUplinkConfigProps {
  readonly name: string
  readonly spectrumConfig: SpectrumConfig
  readonly targetEirp: Erip
  readonly transmitDisabled: boolean
}


/**
 * Configuration for Antenna Uplink
 *
 * @resource AWS::GroundStation::Config
 **/
export class AntennaUplinkConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  public readonly arn: string;
  public readonly id: string
  public readonly type: string

  constructor(scope: Construct, id: string, props: AntennaUplinkConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
      configData: {
        antennaUplinkConfig: props,
      },
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.type = this._resource.attrType;
  }
}

export interface DataflowEndpointConfigProps {
  readonly name: string
  readonly dataflowEndpointName: string
  readonly dataflowEndpointRegion: string
}


/**
 * Configuration for a Dataflow Endpoint
 *
 * @resource AWS::GroundStation::Config
 **/
export class DataflowEndpointConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  public readonly arn: string;
  public readonly id: string
  public readonly type: string

  constructor(scope: Construct, id: string, props: DataflowEndpointConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
      configData: {
        dataflowEndpointConfig: {
          dataflowEndpointName: props.dataflowEndpointName,
          dataflowEndpointRegion: props.dataflowEndpointRegion,
        },
      },
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.type = this._resource.attrType;
  }
}

export interface S3RecordingConfigProps {
  readonly bucketArn: string
  readonly prefix?: string
  readonly roleArn: string
  readonly name: string
}

/**
 * Configuration for a S3 Recording
 *
 * @resource AWS::GroundStation::Config
 **/
export class S3RecordingConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  public readonly arn: string;
  public readonly id: string
  public readonly type: string

  constructor(scope: Construct, id: string, props: S3RecordingConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
      configData: {
        s3RecordingConfig: {
          bucketArn: props.bucketArn,
          prefix: props.prefix,
          roleArn: props.roleArn,
        },
      },
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.type = this._resource.attrType;
  }
}

export enum Autotrack {
  REMOVED = 'REMOVED',
  PREFERRED = 'PREFERRED',
  REQUIRED = 'REQUIRED'
}

export interface TrackingConfigProps {
  readonly autotrack: Autotrack
  readonly name: string
}


/**
 * Configuration for a Tracking
 *
 * @resource AWS::GroundStation::Config
 **/
export class TrackingConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  public readonly arn: string;
  public readonly id: string
  public readonly type: string

  constructor(scope: Construct, id: string, props: TrackingConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
      configData: {
        trackingConfig: {
          autotrack: props.autotrack,
        },
      },
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.type = this._resource.attrType;
  }
}

export interface UplinkEchoConfigProps {
  readonly name: string
  readonly antennaUplinkConfigArn: string
  readonly enabled: boolean
}

/**
 * Configuration for a Uplink Echo
 *
 * @resource AWS::GroundStation::Config
 **/
export class UplinkEchoConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  public readonly arn: string;
  public readonly id: string
  public readonly type: string

  constructor(scope: Construct, id: string, props: UplinkEchoConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.name,
      configData: {
        uplinkEchoConfig: {
          antennaUplinkConfigArn: props.antennaUplinkConfigArn,
          enabled: props.enabled,
        },
      },
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.type = this._resource.attrType;
  }
}
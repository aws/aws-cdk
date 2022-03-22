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
  units: FrequencyUnits;
  value: number;
}

export interface Frequency {
  units: FrequencyUnits;
  value: number;
}

export interface SpectrumConfig {
  Bandwidth: FrequencyBandwidth;
  CenterFrequency: Frequency;
  Polarization: Polarization;
}

export interface AntennaDownlinkConfigProps {
  SpectrumConfig: SpectrumConfig
  Name: string;
}

export interface Erip {
  units: EripUnits;
  value: number;
}

export class AntennaDownlinkConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  constructor(scope: Construct, id: string, props: AntennaDownlinkConfigProps) {
    super(scope, id, {
      physicalName: props.Name,
    });

    const resource = new CfnConfig(this, 'Resource', {
      name: props.Name,
      configData: {
        antennaDownlinkConfig: {
          spectrumConfig: {
            bandwidth: props.SpectrumConfig.Bandwidth,
            centerFrequency: props.SpectrumConfig.CenterFrequency,
            polarization: props.SpectrumConfig.Polarization,
          },
        },
      },
    });

    this._resource = resource;
  }
}


export interface AntennaDownlinkDemodConfigProps {
  DecodeConfig: {
    UnvalidatedJSON: string
  }
  DemodulationConfig: {
    DemodulationConfig: string
  }
  SpectrumConfig: SpectrumConfig,
  Name: string;
}

export class AntennaDownlinkDemodDecodeConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  constructor(scope: Construct, id: string, props: AntennaDownlinkDemodConfigProps) {
    super(scope, id, {
      physicalName: props.Name,
    });

    const resource = new CfnConfig(this, 'Resource', {
      name: props.Name,
      configData: {
        antennaDownlinkDemodDecodeConfig: {
          decodeConfig: {
            unvalidatedJson: props.DecodeConfig.UnvalidatedJSON,
          },
          demodulationConfig: {
            unvalidatedJson: props.DemodulationConfig.DemodulationConfig,
          },
          spectrumConfig: {
            bandwidth: props.SpectrumConfig.Bandwidth,
            centerFrequency: props.SpectrumConfig.CenterFrequency,
            polarization: props.SpectrumConfig.Polarization,
          },
        },
      },
    });

    this._resource = resource;
  }
}


export interface AntennaUplinkConfigProps {
  Name: string
  SpectrumConfig: {
    CenterFrequency: Frequency
    Polarization: Polarization
  }
  TargetEirp: Erip
  TransmitDisabled: boolean
}

export class AntennaUplinkConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  constructor(scope: Construct, id: string, props: AntennaUplinkConfigProps) {
    super(scope, id, {
      physicalName: props.Name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.Name,
      configData: {
        antennaUplinkConfig: {
          spectrumConfig: {
            centerFrequency: props.SpectrumConfig.CenterFrequency,
            polarization: props.SpectrumConfig.Polarization,
          },
          targetEirp: {
            units: props.TargetEirp.units,
            value: props.TargetEirp.value,
          },
          transmitDisabled: props.TransmitDisabled,
        },
      },
    });

    this._resource = resource;
  }
}

export interface DataflowEndpointConfigProps {
  Name: string
  DataflowEndpointName: string
  DataflowEndpointRegion: string
}

export class DataflowEndpointConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  constructor(scope: Construct, id: string, props: DataflowEndpointConfigProps) {
    super(scope, id, {
      physicalName: props.Name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.Name,
      configData: {
        dataflowEndpointConfig: {
          dataflowEndpointName: props.DataflowEndpointName,
          dataflowEndpointRegion: props.DataflowEndpointRegion,
        },
      },
    });

    this._resource = resource;
  }
}

export interface S3RecordingConfigProps {
  BucketArn: string
  Prefix: string
  RoleArn: string
  Name: string
}

export class S3RecordingConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  constructor(scope: Construct, id: string, props: S3RecordingConfigProps) {
    super(scope, id, {
      physicalName: props.Name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.Name,
      configData: {
        s3RecordingConfig: {
          bucketArn: props.BucketArn,
          prefix: props.Prefix,
          roleArn: props.RoleArn,
        },
      },
    });

    this._resource = resource;
  }
}

export enum Autotrack {
  REMOVED = 'REMOVED',
  PREFERRED = 'PREFERRED',
  REQUIRED = 'REQUIRED'
}

export interface TrackingConfigProps {
  Autotrack: Autotrack
  Name: string
}

export class TrackingConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  public readonly trackingConfigArn: string

  constructor(scope: Construct, id: string, props: TrackingConfigProps) {
    super(scope, id, {
      physicalName: props.Name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.Name,
      configData: {
        trackingConfig: {
          autotrack: props.Autotrack,
        },
      },
    });

    this._resource = resource;

    this.trackingConfigArn = this.getResourceArnAttribute(resource.attrArn, {
      region: '',
      account: '',
      service: 'groundstation',
      resource: this.physicalName,
    });
  }
}

export interface UplinkEchoConfigProps {
  Name: string
  AntennaUplinkConfigArn: string
  Enabled: boolean
}

export class UplinkEchoConfig extends BaseConfig {
  private readonly _resource: CfnConfig;

  constructor(scope: Construct, id: string, props: UplinkEchoConfigProps) {
    super(scope, id, {
      physicalName: props.Name,
    });
    const resource = new CfnConfig(this, 'Resource', {
      name: props.Name,
      configData: {
        uplinkEchoConfig: {
          antennaUplinkConfigArn: props.AntennaUplinkConfigArn,
          enabled: props.Enabled,
        },
      },
    });

    this._resource = resource;
  }
}
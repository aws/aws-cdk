# AWS::GroundStation Construct Library

Constructs to create workflows for communicating with satellites.

```ts
import { Fn, Duration } from "aws-cdk-lib"
import { MissionProfile, Autotrack, S3RecordingConfig, TrackingConfig } from "aws-cdk-lib/aws-groundstation"
import { Bucket } from "aws-cdk-lib/aws-s3"
import { Role } from "aws-cdk-lib/aws-s3"

const bucket = new Bucket(this, "gs-bucket", {
  bucketName: `aws-groundstation-${BUCKET_NAME}`
})

const role = new Role(this, "gs-s3-role", {

})

const recordConfig = new S3RecordingConfig(this, "S3RecordingConfig", {
  bucket,
  role,
  // Optional keys for substitution: {satellite_id} | {config-name} | {config-id} | {year} | {month} | {day}
  prefix: "{satellite_id}/{year}/{month}/{day}/",
});

const trackingConfig = new TrackingConfig(this, "TrackingConfig", {
  configName: "Tracking",
  autotrack: Autotrack.PREFERRED
})

new MissionProfile(this, "MissionProfile", {
  dataflowEdges: [{
    source: Fn.join([antennaDownlinkDemodDecodeConfig.configArn, 'UncodedFramesEgress'], "/")
    destination: recordConfig.configArn
  }],
  minimumViableContactDuration: Duration.minutes(1),
  name: "Satellite #1 Mission Profile",
  trackingConfig: trackingConfig
});
```

## Creating Configurations

Configurations define how all satellite communication is handled. There are many different configuration constructs

### AntennaDownlinkConfig

Provides information about how AWS Ground Station should configure an antenna for downlink during a contact. Use an antenna downlink config in a mission profile to receive the downlink data in raw DigIF format.

```ts
new AntennaDownlinkConfig(this, "AntennaDownlinkConfig", {
  configName: "AntennaDownlink_Alpha",
  spectrumConfig: {
    bandwidth: {
      value: 30,
      units: Frequency.MHZ,
    },
    centerFrequency: {
      value: 7812,
      units: Frequency.MHZ,
    },
    polarization: Polarization.LEFT_HAND,
  },
});
```

### AntennaDownlinkDemodDecodeConfig

Provides information about how AWS Ground Station should configure an antenna for downlink during a contact. Use an antenna downlink demod decode config in a mission profile to receive the downlink data that has been demodulated and decoded.

```ts
new AntennaDownlinkDemodDecodeConfig(this, "AntennaDownlinkDemodDecodeConfig", {
  configName: "AntennaDownlinkDemodDecodeConfig_Alpha",
  spectrumConfig: {
    centerFrequency: {
      value: 7812,
      units: Frequency.MHZ,
    },
    bandwidth: {
      value: 30,
      units: Frequency.MHZ,
    },
    polarization: Polarization.RIGHT_HAND,
  },
  demodulationConfig: {
    unvalidatedJson: `
  {
        "type":"QPSK",
        "qpsk":{
          "carrierFrequencyRecovery":{
            "centerFrequency":{
              "value":7812,
              "units":"MHz"
            },
            "range":{
              "value":250,
              "units":"kHz"
            }
          },
          "symbolTimingRecovery":{
            "symbolRate":{
              "value":15,
              "units":"Msps"
          },
          "range":{
            "value":0.75,
            "units":"ksps"
          },
          "matchedFilter":{
            "type":"ROOT_RAISED_COSINE",
            "rolloffFactor":0.5
          }
        }
      }
    }
  `,
  },
  decodeConfig: {
    unvalidatedJson: `
    {
      "edges":[
        {
          "from":"I-Ingress",
          "to":"IQ-Recombiner"
        },
        {
          "from":"Q-Ingress",
          "to":"IQ-Recombiner"
        },
        {
          "from":"IQ-Recombiner",
          "to":"CcsdsViterbiDecoder"
        },
        {
          "from":"CcsdsViterbiDecoder",
          "to":"NrzmDecoder"
        },
        {
          "from":"NrzmDecoder",
          "to":"UncodedFramesEgress"
        }
      ],
      "nodeConfigs":{
        "I-Ingress":{
          "type":"CODED_SYMBOLS_INGRESS",
          "codedSymbolsIngress":{
            "source":"I"
          }
        },
        "Q-Ingress":{
          "type":"CODED_SYMBOLS_INGRESS",
          "codedSymbolsIngress":{
            "source":"Q"
          }
        },
        "IQ-Recombiner":{
          "type":"IQ_RECOMBINER"
        },
        "CcsdsViterbiDecoder":{
          "type":"CCSDS_171_133_VITERBI_DECODER",
          "ccsds171133ViterbiDecoder":{
            "codeRate":"ONE_HALF"
          }
        },
        "NrzmDecoder":{
          "type":"NRZ_M_DECODER"
        },
        "UncodedFramesEgress":{
          "type":"UNCODED_FRAMES_EGRESS"
        }
      }
    }
    `,
  },
});
```

### AntennaUplinkConfig

Provides information about how AWS Ground Station should configure an antenna for uplink during a contact.

```ts
new AntennaUplinkConfig(this, "AntennaUplinkConfig", {
  configName: "AntennaUplinkConfig_Alpha",
  spectrumConfig: {
    centerFrequency: {
      value: 2072.5
      units: Frequency.MHZ
    },
    polarization: Polarization.RIGHT_HAND
  },
  targetEirp: {
    value: 20.0
    units: EripUnits.DBW
  }
})
```

### DataflowEndpointConfig

Provides information to AWS Ground Station about which IP endpoints to use during a contact.

```ts
declare const endpoint: DataflowEndpoint;

new DataflowEndpointConfig(this, "DataflowEndpointConfig", {
  dataflowEndpointName: "Downlink Demod Decode",
  dataflowEndpointRegion: "us-east-1",
});
```

### S3RecordingConfig

Provides information about how AWS Ground Station should save downlink data to S3.

```ts
declare const bucket: s3.Bucket;
declare const role: iam.Role;

new S3RecordingConfig(this, "S3RecordingConfig", {
  bucket,
  role,
  // Optional keys for substitution: {satellite_id} | {config-name} | {config-id} | {year} | {month} | {day}
  prefix: "{satellite_id}/{year}/{month}/{day}/",
});
```

### TrackingConfig

Provides information about how AWS Ground Station should track the satellite through the sky during a contact.

```ts
new TrackingConfig(this, "TrackingConfig", {
  configName: "TrackingConfig_Alpha",
  autotrack: Autotrack.REQUIRED,
});
```

### UplinkEchoConfig

Provides information about how AWS Ground Station should echo back uplink transmissions to a dataflow endpoint.

```ts
declare const antennaUplinkConfig: AntennaUplinkConfig;

new UplinkEchoConfig(this, "UplinkEchoConfig", {
  configName: "UplinkEchoConfig_Alpha",
  antennaUplinkConfig: antennaUplinkConfig,
  enabled: true,
});
```

## Creating Endpoints

Dataflow endpoint groups contain a list of endpoints. When the name of a dataflow endpoint group is specified in a mission profile, the Ground Station service will connect to the endpoints and flow data during a contact.

```ts
new DataflowEndpointGroup(this, "DataflowEndpointGroup", {
  endpointDetails: [{
    endpoint: {
      name: 'myEndpoint',
      address: {
        name: 172.10.0.2
        port: 44720
      },
      mtu: 1500
    },
    securityDetails: {
      subnetIds: ['subnet-12345678'],
      securityGroupIds: ['sg-87654321']
      role: "arn:aws:iam::012345678910:role/groundstation-service-role-AWSServiceRoleForAmazonGroundStation-EXAMPLEABCDE"
    }
  }]
})
```

## Mission Profiles

```ts
declare const s3RecordingConfig: S3RecordingConfig
declare const antennaDownlinkDemodDecodeConfig: AntennaDownlinkDemodDecodeConfig
declare const trackingConfig: TrackingConfig

new MissionProfile(this, "MissionProfile", {
  contactPostPassDuration: Duration.seconds(10),
  contactPrePassDuration: Duration.seconds(10),
  dataflowEdges: [{
    source: Fn.join([antennaDownlinkDemodDecodeConfig.configArn, 'UncodedFramesEgress'], "/")
    destination: s3RecordingConfig.configArn
  }],
  minimumViableContactDuration: Duration.minutes(1),
  name: "Satellite #1 Mission Profile",
  trackingConfig: trackingConfig
});
```

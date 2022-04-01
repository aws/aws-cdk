import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Duration, Stack } from '@aws-cdk/core';
import { AntennaDownlinkConfig, Autotrack, FrequencyUnits, MissionProfile, Polarization, S3RecordingConfig, TrackingConfig } from '../lib';

describe('Groundstation Mission Profile', () => {
  test('', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const trackingConfig = new TrackingConfig(stack, 'TrackingConfig_1', {
      autotrack: Autotrack.REQUIRED,
      configName: 'TrackingConfig_1',
    });

    const s3RecordingConfig = new S3RecordingConfig(stack, 'S3Config', {
      bucket: new Bucket(stack, 'Bucket'),
      configName: 'S3_Config',
      role: new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('groundstation.amazonaws.com'),
      }),
    });

    const downlinkConfig = new AntennaDownlinkConfig(stack, 'AntennaDownlinkConfig_1', {
      configName: 'AntennaDownlinkConfig_1',
      spectrumConfig: {
        bandwidth: {
          value: 30,
          units: FrequencyUnits.MHZ,
        },
        centerFrequency: {
          value: 7812,
          units: FrequencyUnits.MHZ,
        },
        polarization: Polarization.RIGHT_HAND,
      },
    });

    new MissionProfile(stack, 'MissionProfile_1', {
      trackingConfig,
      minimumViableContactDuration: Duration.seconds(50),
      missionProfileName: 'Test_Profile_1',
      dataflowEdges: [{
        destination: s3RecordingConfig.configArn,
        source: downlinkConfig.configArn,
      }],
      contactPostPassDuration: Duration.seconds(10),
      contactPrePassDuration: Duration.seconds(10),
    });

    Template.fromStack(stack).templateMatches({});
  });
});

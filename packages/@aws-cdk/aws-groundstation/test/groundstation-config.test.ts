import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { AntennaDownlinkConfig, FrequencyUnits, Polarization, S3RecordingConfig } from '../lib';

describe('Groundstation Config', () => {
  test('S3RecordingConfig', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bucket = new Bucket(stack, 'Bucket');
    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('groundstation.amazonaws.com'),
    });

    new S3RecordingConfig(stack, 'S3Config', {
      bucket: bucket,
      configName: 'S3_Config',
      role: role,
    });

    Template.fromStack(stack).hasResource('AWS::GroundStation::Config', {
      Type: 'AWS::GroundStation::Config',
      Properties: {
        ConfigData: {
          S3RecordingConfig: {
            BucketArn: {
              'Fn::GetAtt': [
                'Bucket83908E77',
                'Arn',
              ],
            },
            RoleArn: {
              'Fn::GetAtt': [
                'Role1ABCC5F0',
                'Arn',
              ],
            },
          },
        },
        Name: 'S3_Config',
      },
    },
    );
  });

  test('AntennaDownlinkConfig', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new AntennaDownlinkConfig(stack, 'AntennaDownlinkConfig_1', {
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

    Template.fromStack(stack).hasResource('AWS::GroundStation::Config', {
      Type: 'AWS::GroundStation::Config',
      Properties: {
        ConfigData: {
          AntennaDownlinkConfig: {
            SpectrumConfig: {
              Bandwidth: {
                Units: 'MHz',
                Value: 30,
              },
              CenterFrequency: {
                Units: 'MHz',
                Value: 7812,
              },
              Polarization: 'RIGHT_HAND',
            },
          },
        },
        Name: 'AntennaDownlinkConfig_1',
      },
    });
  });
});

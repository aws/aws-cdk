import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Duration, Fn, Stack } from '@aws-cdk/core';
import { AntennaDownlinkConfig, Autotrack, FrequencyUnits, MissionProfile, Polarization, S3RecordingConfig, TrackingConfig } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-missionprofile');

const trackingConfig = new TrackingConfig(stack, 'TrackingConfig', {
  configName: 'TrackingConfig',
  autotrack: Autotrack.PREFERRED,
});

const demodConfig = new AntennaDownlinkConfig(stack, 'DemodConfig', {
  configName: 'DemodConfig',
  spectrumConfig: {
    centerFrequency: {
      units: FrequencyUnits.MHZ,
      value: 123,
    },
    polarization: Polarization.LEFT_HAND,
    bandwidth: {
      units: FrequencyUnits.MHZ,
      value: 10,
    },
  },
});

const bucket = new Bucket(stack, 'Bucket', {
  bucketName: `aws-groundstation-${stack.stackName}-${stack.account}`,
});

const role = new Role(stack, 'Role', {
  assumedBy: new ServicePrincipal('groundstation.amazonaws.com'),
  inlinePolicies: {
    bucketAccess: new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: ['s3:GetBucketLocation'],
          resources: [bucket.bucketArn],
          effect: Effect.ALLOW,
        }),
        new PolicyStatement({
          actions: ['s3:PutObject'],
          resources: [Fn.join('/', [bucket.bucketArn, '*'])],
          effect: Effect.ALLOW,
        }),
      ],
    }),
  },
});

const s3config = new S3RecordingConfig(stack, 'S3Config', {
  bucket,
  configName: 'S3_Config',
  role,
});

new MissionProfile(stack, 'MissionProfile', {
  contactPostPassDuration: Duration.seconds(10),
  contactPrePassDuration: Duration.seconds(10),
  dataflowEdges: [{
    source: demodConfig.configArn,
    destination: s3config.configArn,
  }],
  minimumViableContactDuration: Duration.seconds(10),
  missionProfileName: 'MissionProfile',
  trackingConfig,
});

app.synth();
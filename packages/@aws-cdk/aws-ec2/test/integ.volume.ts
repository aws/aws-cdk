import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-volume-1');

new ec2.Volume(stack, 'TestVolume', {
  availabilityZone: 'us-east-1a',
  size: cdk.Size.gibibytes(1),
  volumeType: ec2.EbsDeviceVolumeType.GP3,
  throughput: 200,
});

new integ.IntegTest(app, 'VolumeTest', {
  testCases: [stack],
});

app.synth();

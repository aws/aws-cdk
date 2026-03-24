import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Size, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new App();
const stack = new Stack(app, 'VolumeGp3LargeSizeStack', {
  env: { account: '123456789012', region: 'us-east-1' },
});

new ec2.Volume(stack, 'Volume', {
  availabilityZone: 'us-east-1a',
  size: Size.tebibytes(32),
  volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'VolumeGp3LargeSizeInteg', {
  testCases: [stack],
});

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'volume-initialization-rate-stack');

const snapshotId = process.env.SNAPSHOT_ID ?? 'snap-123456789abcdef0';

new ec2.Volume(stack, 'Volume', {
  availabilityZone: 'us-east-1a',
  size: cdk.Size.gibibytes(1),
  volumeType: ec2.EbsDeviceVolumeType.GP3,
  volumeInitializationRate: cdk.Size.mebibytes(100),
  snapshotId,
});

new integ.IntegTest(app, 'volume-initialization-rate-integ', {
  testCases: [stack],
});

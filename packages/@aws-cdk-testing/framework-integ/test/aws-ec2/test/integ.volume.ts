import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-volume-1');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

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

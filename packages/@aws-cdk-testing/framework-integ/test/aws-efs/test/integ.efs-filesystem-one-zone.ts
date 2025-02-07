import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { FileSystem } from 'aws-cdk-lib/aws-efs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-one-zone-integ');

const vpc = new ec2.Vpc(stack, 'Vpc');

new FileSystem(stack, 'FileSystem', {
  vpc,
  oneZone: true,
});

new FileSystem(stack, 'FileSystem2', {
  vpc,
  oneZone: true,
  vpcSubnets: {
    availabilityZones: [vpc.availabilityZones[1]],
  },
});

new integ.IntegTest(app, 'test-efs-one-zone-integ-test', {
  testCases: [stack],
});
app.synth();

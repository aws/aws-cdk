import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { FileSystem, ReplicationOverwriteProtection } from 'aws-cdk-lib/aws-efs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-protection-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  natGateways: 0,
});

new FileSystem(stack, 'FileSystem', {
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  replicationOverwriteProtection: ReplicationOverwriteProtection.DISABLED,
});

new integ.IntegTest(app, 'test-efs-protection-integ-test', {
  testCases: [stack],
});
app.synth();

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { FileSystem, LifecyclePolicy, OutOfInfrequentAccessPolicy } from 'aws-cdk-lib/aws-efs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-transition-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });

new FileSystem(stack, 'FileSystem', {
  vpc,
  lifecyclePolicy: LifecyclePolicy.AFTER_14_DAYS,
  transitionToArchivePolicy: LifecyclePolicy.AFTER_90_DAYS,
  outOfInfrequentAccessPolicy: OutOfInfrequentAccessPolicy.AFTER_1_ACCESS,
});

new integ.IntegTest(app, 'test-efs-integ-test', {
  testCases: [stack],
});

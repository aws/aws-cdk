import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, InstanceType } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-neptune-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new DatabaseCluster(stack, 'DatabaseCopyTagsToSnapshotDisabled', {
  vpc,
  instanceType: InstanceType.R5_LARGE,
  copyTagsToSnapshot: false,
});

new DatabaseCluster(stack, 'DatabaseCopyTagsToSnapshotEnabled', {
  vpc,
  instanceType: InstanceType.R5_LARGE,
  copyTagsToSnapshot: true,
});

new integ.IntegTest(app, 'ClusterTest', {
  testCases: [stack],
});

app.synth();

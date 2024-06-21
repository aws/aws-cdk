import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster } from 'aws-cdk-lib/aws-docdb';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-docdb-integ');

const vpc = new ec2.Vpc(stack, 'VPC');

new DatabaseCluster(stack, 'DatabaseCopyTagsToSnapshotDisabled', {
  engineVersion: '3.6.0',
  masterUser: {
    username: 'docdb',
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  copyTagsToSnapshot: false,
});

new DatabaseCluster(stack, 'DatabaseCopyTagsToSnapshotEnabled', {
  engineVersion: '3.6.0',
  masterUser: {
    username: 'docdb',
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  copyTagsToSnapshot: true,
});

new integ.IntegTest(app, 'ClusterTest', {
  testCases: [stack],
});

app.synth();

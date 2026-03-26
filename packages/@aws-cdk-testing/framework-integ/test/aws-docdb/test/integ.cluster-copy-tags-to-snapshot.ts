import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster } from 'aws-cdk-lib/aws-docdb';
import { DOCDB_ENGINE_VERSION } from './docdb-integ-test-constraints';

const app = new cdk.App({ context: { '@aws-cdk/core:disableGitSource': true } });

const stack = new cdk.Stack(app, 'aws-cdk-docdb-integ');

const vpc = new ec2.Vpc(stack, 'VPC');

new DatabaseCluster(stack, 'DatabaseCopyTagsToSnapshotDisabled', {
  engineVersion: DOCDB_ENGINE_VERSION,
  masterUser: {
    username: 'docdb',
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  copyTagsToSnapshot: false,
});

new DatabaseCluster(stack, 'DatabaseCopyTagsToSnapshotEnabled', {
  engineVersion: DOCDB_ENGINE_VERSION,
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

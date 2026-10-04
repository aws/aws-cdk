import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster } from 'aws-cdk-lib/aws-docdb';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'DocdbEngineVersionToken');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const engineVersion = new cdk.CfnParameter(stack, 'EngineVersion');

new DatabaseCluster(stack, 'Database', {
  engineVersion: engineVersion.valueAsString,
  masterUser: {
    username: 'docdb',
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'docdb-engine-version-token', {
  testCases: [stack],
});

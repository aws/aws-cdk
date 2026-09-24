import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, DatabaseInstance, EngineVersion, InstanceType } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'neptune-instance-public');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1 });

const cluster = new DatabaseCluster(stack, 'Cluster', {
  vpc,
  engineVersion: EngineVersion.V1_4_6_1,
  instanceType: InstanceType.T3_MEDIUM,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  iamAuthentication: true,
});

new DatabaseInstance(stack, 'Instance', {
  cluster,
  instanceType: InstanceType.T3_MEDIUM,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  publiclyAccessible: true,
});

new integ.IntegTest(app, 'integ-neptune-instance-public', {
  testCases: [stack],
});

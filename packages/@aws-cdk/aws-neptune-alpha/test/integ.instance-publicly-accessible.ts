import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, DatabaseInstance, InstanceType, EngineVersion } from '../lib';
import { ClusterParameterGroup, ParameterGroupFamily } from '../lib/parameter-group';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'PubliclyAccessibleInstanceStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1 });

const clusterParameterGroup = new ClusterParameterGroup(stack, 'Params', {
  description: 'A nice parameter group',
  family: ParameterGroupFamily.NEPTUNE_1_4,
  parameters: {
    neptune_enable_audit_log: '1',
    neptune_query_timeout: '100000',
  },
});

const cluster = new DatabaseCluster(stack, 'Database', {
  vpc,
  engineVersion: EngineVersion.V1_4_6_1,
  instanceType: InstanceType.R5_LARGE,
  clusterParameterGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  iamAuthentication: true,
});

new DatabaseInstance(stack, 'EnabledInstance', {
  cluster,
  instanceType: InstanceType.R5_LARGE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  publiclyAccessible: true,
});

new DatabaseInstance(stack, 'DisabledInstance', {
  cluster,
  instanceType: InstanceType.R5_LARGE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  publiclyAccessible: false,
});

new integ.IntegTest(app, 'PubliclyAccessibleInstanceInteg', {
  testCases: [stack],
});

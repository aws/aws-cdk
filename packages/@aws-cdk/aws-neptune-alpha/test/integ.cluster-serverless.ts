import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ClusterParameterGroup, DatabaseCluster, EngineVersion, InstanceType, ParameterGroupFamily } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-neptune-serverless-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const clusterParameterGroup = new ClusterParameterGroup(stack, 'Params', {
  description: 'A nice parameter group',
  family: ParameterGroupFamily.NEPTUNE_1_4,
  parameters: {
    neptune_enable_audit_log: '1',
    neptune_query_timeout: '100000',
  },
});

new DatabaseCluster(stack, 'Database', {
  vpc,
  engineVersion: EngineVersion.V1_4_6_1,
  instanceType: InstanceType.SERVERLESS,
  clusterParameterGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  serverlessScalingConfiguration: {
    minCapacity: 1,
    maxCapacity: 5,
  },
});

new integ.IntegTest(app, 'ClusterServerlessTest', {
  testCases: [stack],
});

app.synth();

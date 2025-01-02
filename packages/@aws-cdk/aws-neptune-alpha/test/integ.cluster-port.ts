import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, EngineVersion, InstanceType, ParameterGroupFamily } from '../lib';
import { ClusterParameterGroup } from '../lib/parameter-group';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'NeptuneClusterPortTestStack');

const vpc = new ec2.Vpc(stack, 'Vpc');

const clusterParameterGroup = new ClusterParameterGroup(stack, 'Params', {
  description: 'A nice parameter group',
  family: ParameterGroupFamily.NEPTUNE_1_3,
  parameters: {
    neptune_enable_audit_log: '1',
    neptune_query_timeout: '100000',
  },
});

new DatabaseCluster(stack, 'Database', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  instanceType: InstanceType.R5_LARGE,
  engineVersion: EngineVersion.V1_3_0_0,
  clusterParameterGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoMinorVersionUpgrade: true,
  port: 12345,
});

new integ.IntegTest(app, 'NeptuneClusterPortTest', {
  testCases: [stack],
});

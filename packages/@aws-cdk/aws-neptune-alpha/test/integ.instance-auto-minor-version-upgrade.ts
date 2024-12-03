import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, DatabaseInstance, InstanceType } from '../lib';
import { ClusterParameterGroup, ParameterGroupFamily } from '../lib/parameter-group';

/*
 * Test creating a cluster without specifying engine version.
 * This defaults to  engine version < 1.2.0.0 and associated parameter group with family neptune1
 *
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'AutoMinorVersionUpgradeInstanceStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1 });

const clusterParameterGroup = new ClusterParameterGroup(stack, 'Params', {
  description: 'A nice parameter group',
  family: ParameterGroupFamily.NEPTUNE_1_3,
  parameters: {
    neptune_enable_audit_log: '1',
    neptune_query_timeout: '100000',
  },
});

const cluster = new DatabaseCluster(stack, 'Database', {
  vpc,
  instanceType: InstanceType.R5_LARGE,
  clusterParameterGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new DatabaseInstance(stack, 'EnabledInstance', {
  cluster,
  instanceType: InstanceType.R5_LARGE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoMinorVersionUpgrade: true,
});

new DatabaseInstance(stack, 'DisabledInstance', {
  cluster,
  instanceType: InstanceType.R5_LARGE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoMinorVersionUpgrade: false,
});

new integ.IntegTest(app, 'AutoMinorVersionUpgradeInstanceInteg', {
  testCases: [stack],
});

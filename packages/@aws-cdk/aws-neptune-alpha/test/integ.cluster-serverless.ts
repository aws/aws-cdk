import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, InstanceType } from '../lib';
import { ClusterParameterGroup, ParameterGroupFamily } from '../lib/parameter-group';

/*
 * Test creating a cluster without specifying engine version.
 * This defaults to  engine version < 1.2.0.0 and associated parameter group with family neptune1
 *
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-neptune-serverless-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const clusterParameterGroup = new ClusterParameterGroup(stack, 'Params', {
  description: 'A nice parameter group',
  family: ParameterGroupFamily.NEPTUNE_1_2,
  parameters: {
    neptune_enable_audit_log: '1',
    neptune_query_timeout: '100000',
  },
});

new DatabaseCluster(stack, 'Database', {
  vpc,
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

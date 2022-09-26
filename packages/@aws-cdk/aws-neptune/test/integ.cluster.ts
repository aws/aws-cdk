import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { DatabaseCluster, InstanceType } from '../lib';
import { ClusterParameterGroup } from '../lib/parameter-group';

/*
 * Test creating a cluster without specifying engine version.
 * This defaults to  engine version < 1.2.0.0 and associated parameter group with family neptune1
 *
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-neptune-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

const kmsKey = new kms.Key(stack, 'DbSecurity', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const clusterParameterGroup = new ClusterParameterGroup(stack, 'Params', {
  description: 'A nice parameter group',
  parameters: {
    neptune_enable_audit_log: '1',
    neptune_query_timeout: '100000',
  },
});

const cluster = new DatabaseCluster(stack, 'Database', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  instanceType: InstanceType.R5_LARGE,
  clusterParameterGroup,
  kmsKey,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoMinorVersionUpgrade: true,
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

const metric = cluster.metric('SparqlRequestsPerSec');
new cloudwatch.Alarm(stack, 'Alarm', {
  evaluationPeriods: 1,
  threshold: 1,
  comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
  metric: metric,
});

new integ.IntegTest(app, 'ClusterTest', {
  testCases: [stack],
});

app.synth();

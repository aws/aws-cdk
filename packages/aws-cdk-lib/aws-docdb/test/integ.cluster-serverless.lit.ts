import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as docdb from '../lib';

/*
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <cluster-identifier>
 *   * verify the cluster has ServerlessV2ScalingConfiguration with MinCapacity and MaxCapacity
 *   * verify no DB instances are associated with the cluster
 * * aws docdb describe-db-instances --filters Name=db-cluster-id,Values=<cluster-identifier>
 *   * verify the result is empty (no instances)
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-docdb-cluster-serverless');

const vpc = new ec2.Vpc(stack, 'VPC');

/// !show
const cluster = new docdb.DatabaseCluster(stack, 'Database', {
  masterUser: {
    username: 'docdb',
  },
  vpc,
  serverlessV2ScalingConfiguration: {
    minCapacity: 0.5,
    maxCapacity: 2,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
/// !hide

app.synth();
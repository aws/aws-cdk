import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { IntegTestCaseStack } from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stackWithCluster = new cdk.Stack(app, 'aws-cdk-ecs-StackWithCluster', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const vpc = new ec2.Vpc(stackWithCluster, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
  vpcName: 'my-vpc-name',
});

const cluster = new ecs.Cluster(stackWithCluster, 'Cluster', {
  vpc,
  clusterName: 'my-cluster-name',
});

new cdk.CfnOutput(stackWithCluster, 'ClusterArn', {
  value: cluster.clusterArn,
  exportName: 'ClusterArn',
});

const stackLookup = new IntegTestCaseStack(app, 'aws-cdk-ecs-integ-StackUnderTest', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

// Cluster
const clusterFromLookup = ecs.Cluster.fromLookup(stackLookup, 'ClusterByHardcodedName', {
  clusterName: 'my-cluster-name',
});

new cdk.CfnOutput(stackLookup, 'LookedUpClusterArn', {
  value: `ARN fromLookup: ${clusterFromLookup.clusterArn}`,
});

new integ.IntegTest(app, 'ecs-cluster-lookup-integ', {
  testCases: [stackLookup],
  enableLookups: true,
});

app.synth();


import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { EnableEnhancedContainerInsights } from '../../../lib/services/aws-ecs/mixins';
import '../../../lib/with';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'EcsEnhancedContainerInsightsTest');

// VPC required for L2 Cluster
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 0,
});

// Test applying mixin to L1 CfnCluster
new ecs.CfnCluster(stack, 'L1Cluster', {
  clusterName: 'enhanced-insights-l1-test',
}).with(new EnableEnhancedContainerInsights());

// Test applying mixin to L2 Cluster
new ecs.Cluster(stack, 'L2Cluster', {
  vpc,
  clusterName: 'enhanced-insights-l2-test',
}).with(new EnableEnhancedContainerInsights());

new integ.IntegTest(app, 'EcsClusterTest', {
  testCases: [stack],
});

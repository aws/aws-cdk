import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ClusterSettings } from '../../../lib/services/aws-ecs/mixins';
import '../../../lib/with';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'EcsClusterSettingsMixinTest');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 0,
});

new ecs.CfnCluster(stack, 'L1Cluster', {
  clusterName: 'enhanced-insights-l1-test',
}).with(new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]));

new ecs.Cluster(stack, 'L2Cluster', {
  vpc,
  clusterName: 'enhanced-insights-l2-test',
}).with(new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]));

new integ.IntegTest(app, 'EcsClusterSettingsMixinIntegTest', {
  testCases: [stack],
});

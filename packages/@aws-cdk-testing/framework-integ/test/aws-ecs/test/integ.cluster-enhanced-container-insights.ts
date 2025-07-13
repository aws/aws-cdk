import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-ecs-enhanced-container-insights');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  containerInsightsV2: ecs.ContainerInsights.ENHANCED,
});

const testCase = new integ.IntegTest(app, 'ClusterEnhancedInsights', {
  testCases: [stack],
});

const describeClusters = testCase.assertions.awsApiCall('ECS', 'describeClusters', {
  clusters: [cluster.clusterArn],
  // Container insights is in the settings array, so it must be included.
  include: ['SETTINGS'],
});

describeClusters.assertAtPath('clusters.0.settings.0.name', integ.ExpectedResult.stringLikeRegexp('containerInsights'));
describeClusters.assertAtPath('clusters.0.settings.0.value', integ.ExpectedResult.stringLikeRegexp('enhanced'));

app.synth();

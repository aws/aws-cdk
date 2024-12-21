import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-ecs-enhanced-container-insights');

new ecs.Cluster(stack, 'Cluster', {
  containerInsightsV2: ecs.ContainerInsights.ENHANCED,
});

new integ.IntegTest(app, 'ClusterNeuronAmi', {
  testCases: [stack],
});

app.synth();

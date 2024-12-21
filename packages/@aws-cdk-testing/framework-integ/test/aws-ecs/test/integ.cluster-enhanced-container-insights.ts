import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-ecs-enhanced-container-insights');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new ecs.Cluster(stack, 'Cluster', {
  vpc,
  containerInsightsV2: ecs.ContainerInsights.ENHANCED,
});

new integ.IntegTest(app, 'ClusterNeuronAmi', {
  testCases: [stack],
});

app.synth();

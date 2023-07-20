import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'aws-ecs-cluster');
const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

new integ.IntegTest(app, 'ecsClusterTest', {
  testCases: [stack],
});

app.synth();

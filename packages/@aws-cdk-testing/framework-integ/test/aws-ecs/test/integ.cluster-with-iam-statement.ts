import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'aws-ecs-cluster');
const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: ['ec2:Describe*'],
  resources: [cluster.arnForTasks('*')],
});

new integ.IntegTest(app, 'ecsClusterTest', {
  testCases: [stack],
});

app.synth();

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecs-disable-circuit-breaker');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  circuitBreaker: {
    enable: false,
    rollback: false,
  },
});

new integ.IntegTest(app, 'integ-aws-ecs-disable-circuit-breaker', {
  testCases: [stack],
});

app.synth();

import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-capacity-provider');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'FargateCPCluster', {
  vpc,
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  environment: {},
});

const testService = new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
});

const newContainer = testService.taskDefinition.findContainer('web');
if (newContainer?.environment) {
  newContainer.environment.name = 'value';
}

app.synth();


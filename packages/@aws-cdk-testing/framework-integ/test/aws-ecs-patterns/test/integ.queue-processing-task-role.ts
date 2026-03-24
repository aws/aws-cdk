import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'QueueProcessingTaskRoleStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskRole = new iam.Role(stack, 'CustomTaskRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});

new ecsPatterns.QueueProcessingFargateService(stack, 'FargateService', {
  cluster,
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  taskRole,
});

new IntegTest(app, 'QueueProcessingTaskRoleInteg', {
  testCases: [stack],
});

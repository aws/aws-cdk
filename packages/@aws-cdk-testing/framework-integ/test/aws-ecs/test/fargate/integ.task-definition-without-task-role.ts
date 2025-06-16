import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-fargate-task-definition-without-task-role');

// Create a VPC for the Fargate cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

// Create an ECS cluster
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

// Create a Fargate task definition without a task role
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefWithoutTaskRole', {
  createTaskRole: false, // Disable task role creation
  cpu: 256,
  memoryLimitMiB: 512,
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  portMappings: [{ containerPort: 80 }],
});

// Create a service to validate that the task definition works
new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 1,
  assignPublicIp: true,
});

new IntegTest(app, 'FargateTaskDefinitionWithoutTaskRole', {
  testCases: [stack],
});

app.synth();

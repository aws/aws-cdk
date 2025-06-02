import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-ec2-task-definition-without-task-role');

// Create a VPC for the EC2 cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

// Create an ECS cluster
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
  desiredCapacity: 1,
});

// Create a task definition without a task role
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDefWithoutTaskRole', {
  createTaskRole: false, // Disable task role creation
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 256,
});

// Create a service to validate that the task definition works
new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 1,
});

new IntegTest(app, 'EC2TaskDefinitionWithoutTaskRole', {
  testCases: [stack],
});

app.synth();

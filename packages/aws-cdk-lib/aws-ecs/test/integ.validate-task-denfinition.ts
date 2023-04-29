import { aws_ecs } from '../..';
import * as cdk from '../../core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'validate-task-definition-1');

const basicNginxTask = new aws_ecs.TaskDefinition(stack, 'MyValidateTaskDefinition', {
  compatibility: aws_ecs.Compatibility.EC2_AND_FARGATE,
  cpu: '256',
  family: 'nginx',
  memoryMiB: '512',
  networkMode: aws_ecs.NetworkMode.AWS_VPC,
});
basicNginxTask.addContainer('nginxContainer', {
  containerName: 'web',
  essential: true,
  image: aws_ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:stable'),
  portMappings: [{ containerPort: 80 }],
  // uncomment this to 'fix' and compile
  //memoryReservationMiB: 512,
});

app.synth();
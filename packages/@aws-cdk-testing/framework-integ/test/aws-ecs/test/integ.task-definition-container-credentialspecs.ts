import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-container-credentialspecs');

const taskExecutionRole = new iam.Role(stack, 'task-execution-role', {
  roleName: 'aws-ecs-task-definition-container-credentialspecs-task-exec-role',
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});
taskExecutionRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'));
taskExecutionRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
  executionRole: taskExecutionRole,
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryReservationMiB: 32,
  memoryLimitMiB: 512,
  credentialSpecs: ['credentialspecdomainless:arn:aws:s3:::bucket_name/key_name'],
});

new IntegTest(app, 'TaskDefinitionContainerCredSpecs', {
  testCases: [stack],
});

app.synth();
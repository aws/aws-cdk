import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-container-credentialspecs');

const bucket = new s3.Bucket(stack, 'bucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  enforceSSL: true,
});

const parameter = new ssm.StringParameter(stack, 'parameter', {
  stringValue: 'Sample CredSpec',
});

const taskExecutionRole = new iam.Role(stack, 'task-execution-role', {
  roleName: 'aws-ecs-task-definition-container-credentialspecs-task-exec-role',
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});
taskExecutionRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'));
taskExecutionRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
  executionRole: taskExecutionRole,
});

taskDefinition.addContainer('DomainJoinedContainer', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryReservationMiB: 32,
  memoryLimitMiB: 512,
  credentialSpecs: [ecs.DomainJoinedCredentialSpec.fromSsmParameter(parameter)],
});

taskDefinition.addContainer('DomainlessContainer', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryReservationMiB: 32,
  memoryLimitMiB: 512,
  credentialSpecs: [ecs.DomainlessCredentialSpec.fromS3Bucket(bucket, 'credSpecDomainless')],
});

new IntegTest(app, 'TaskDefinitionContainerCredSpecs', {
  testCases: [stack],
});

app.synth();

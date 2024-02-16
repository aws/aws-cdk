import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DomainlessCredentialSpec } from 'aws-cdk-lib/aws-ecs/lib/credential-spec';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-container-credentialspecs');

const bucket = new s3.Bucket(app, 's3-bucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  enforceSSL: true,
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

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryReservationMiB: 32,
  memoryLimitMiB: 512,
  credentialSpecs: [DomainlessCredentialSpec.fromS3Bucket(bucket, 'credSpec')],
});

new IntegTest(app, 'TaskDefinitionContainerCredSpecs', {
  testCases: [stack],
});

app.synth();
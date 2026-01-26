import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-custom-container-image');

// Create a secret for repository credentials
const repositoryCredential = new secretsmanager.Secret(stack, 'RepositoryCredential', {
  secretStringValue: cdk.SecretValue.unsafePlainText(JSON.stringify({
    username: 'user',
    password: 'password',
  })),
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

// Test ContainerImage.fromCustomConfiguration with repository credentials
taskDefinition.addContainer('CustomImageWithCredentials', {
  image: ecs.ContainerImage.fromCustomConfiguration({
    imageName: 'custom-registry.example.com/my-app:v1.0',
    repositoryCredential: repositoryCredential,
  }),
  memoryLimitMiB: 512,
});

// Test ContainerImage.fromCustomConfiguration without credentials (public registry)
taskDefinition.addContainer('CustomImageWithoutCredentials', {
  image: ecs.ContainerImage.fromCustomConfiguration({
    imageName: 'public.ecr.aws/amazonlinux/amazonlinux:latest',
  }),
  memoryLimitMiB: 512,
});

new integ.IntegTest(app, 'aws-ecs-integ-custom-container-image-test', {
  testCases: [stack],
});

app.synth();

import * as path from 'path';
import * as ecr from '@aws-cdk/aws-ecr';
import * as assets from '@aws-cdk/aws-ecr-assets';
import * as cdk from '@aws-cdk/core';
import { Service, ContainerImage, CodeRepository, Connection, CodeRuntime } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-3');

// Create the service from ECR public
const service1 = new Service(stack, 'Service1', {
  image: ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest'),
  port: 80,
});
new cdk.CfnOutput(stack, 'URL1', { value: `https://${service1.serviceUrl}` });

// Create the service from existing ECR repository, make sure you have `nginx` ECR repo in your account.
const repo = ecr.Repository.fromRepositoryName(stack, 'NginxRepository', 'nginx');
const service2 = new Service(stack, 'Service2', {
  image: ContainerImage.fromEcrRepository(repo),
  port: 80,
});
new cdk.CfnOutput(stack, 'URL2', { value: `https://${service2.serviceUrl}` });

// Create the service from local code assets
const imageAssets = new assets.DockerImageAsset(stack, 'ImageAssets', {
  directory: path.join(__dirname, './docker.assets'),
});
const service3 = new Service(stack, 'Service3', {
  image: ContainerImage.fromDockerImageAssets(imageAssets),
  port: 80,
});
new cdk.CfnOutput(stack, 'URL3', { value: `https://${service3.serviceUrl}` });

// Create the service from Github. Make sure you specify a valid connection ARN.
const connectionArn = stack.node.tryGetContext('CONNECTION_ARN') || 'MOCK';
const service4 = new Service(stack, 'Service4', {
  connection: Connection.fromConnectionArn(connectionArn),
  code: CodeRepository.fromGithubRepository({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    runtime: CodeRuntime.PYTHON_3,
  }),
});
new cdk.CfnOutput(stack, 'URL4', { value: `https://${service4.serviceUrl}` });

app.synth();

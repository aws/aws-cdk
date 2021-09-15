import * as path from 'path';
import * as ecr from '@aws-cdk/aws-ecr';
import * as assets from '@aws-cdk/aws-ecr-assets';
import * as cdk from '@aws-cdk/core';
import { Service, Code, ContainerImage, GitHubConnection, Runtime } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner3');

let image: ContainerImage;

// Scenario 1: Create the service from ECR public
image = ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest');
const service1 = new Service(stack, 'Service1', {
  source: Code.fromImage(image, { port: 80 }),
});
new cdk.CfnOutput(stack, 'URL1', { value: `https://${service1.serviceUrl}` });

// Scenario 2: Create the service from existing ECR repository, make sure you have `nginx` ECR repo in your account.
const repo = ecr.Repository.fromRepositoryName(stack, 'NginxRepository', 'nginx');
image = ContainerImage.fromEcrRepository(repo);
const service2 = new Service(stack, 'Service2', {
  source: Code.fromImage(image, { port: 80 }),
});
new cdk.CfnOutput(stack, 'URL2', { value: `https://${service2.serviceUrl}` });

// Scenario 3: Create the service from local code assets
const imageAssets = new assets.DockerImageAsset(stack, 'ImageAssets', {
  directory: path.join(__dirname, './docker.assets'),
});
image = ContainerImage.fromDockerImageAssets(imageAssets);
const service3 = new Service(stack, 'Service3', {
  source: Code.fromImage(image, { port: 80 }),
});
new cdk.CfnOutput(stack, 'URL3', { value: `https://${service3.serviceUrl}` });

// Scenario 4: Create the service from Github. Make sure you specify a valid connection ARN.
const connectionArn = stack.node.tryGetContext('CONNECTION_ARN') || 'MOCK';
const service4 = new Service(stack, 'Service4', {
  source: Code.fromGitHub({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    runtime: Runtime.PYTHON_3,
    port: 8080,
    connection: GitHubConnection.fromConnectionArn(connectionArn),
  }),
});
new cdk.CfnOutput(stack, 'URL4', { value: `https://${service4.serviceUrl}` });

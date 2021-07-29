import * as path from 'path';
import * as assets from '@aws-cdk/aws-ecr-assets';
import * as cdk from '@aws-cdk/core';
import { Service, ContainerImage, CodeRepository, Connection, CodeRuntime } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-2');

// Create the service from ECR public
const service1 = new Service(stack, 'Service1', {
  image: ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest'),
  port: 80,
});
new cdk.CfnOutput(stack, 'URL1', { value: `https://${service1.serviceUrl}` });


// Create the service from local code assets
const imageAssets = new assets.DockerImageAsset(stack, 'ImageAssets', {
  directory: path.join(__dirname, './docker.assets'),
});
const service2 = new Service(stack, 'Service2', {
  image: ContainerImage.fromDockerImageAssets(imageAssets),
  port: 80,
});
new cdk.CfnOutput(stack, 'URL2', { value: `https://${service2.serviceUrl}` });

// Create the service from Github
const connectionArn = stack.node.tryGetContext('CONNECTION_ARN') || 'MOCK';
const service3 = new Service(stack, 'Service3', {
  connection: Connection.fromConnectionArn(connectionArn),
  code: CodeRepository.fromGithubRepository({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    runtime: CodeRuntime.PYTHON_3,
  }),
});
new cdk.CfnOutput(stack, 'URL3', { value: `https://${service3.serviceUrl}` });

app.synth();

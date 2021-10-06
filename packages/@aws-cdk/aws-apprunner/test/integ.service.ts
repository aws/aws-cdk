import * as path from 'path';
import * as ecr from '@aws-cdk/aws-ecr';
import * as assets from '@aws-cdk/aws-ecr-assets';
import * as cdk from '@aws-cdk/core';
import { Service, Source, GitHubConnection, ConfigurationSourceType, Runtime } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner');

// Scenario 1: Create the service from ECR public
const service1 = new Service(stack, 'Service1', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
});
new cdk.CfnOutput(stack, 'URL1', { value: `https://${service1.serviceUrl}` });

// Scenario 2: Create the service from existing ECR repository, make sure you have `nginx` ECR repo in your account.
const service2 = new Service(stack, 'Service2', {
  source: Source.fromEcr({
    imageConfiguration: { port: 80 },
    repository: ecr.Repository.fromRepositoryName(stack, 'NginxRepository', 'nginx'),
  }),
});
new cdk.CfnOutput(stack, 'URL2', { value: `https://${service2.serviceUrl}` });

// Scenario 3: Create the service from local code assets
const imageAsset = new assets.DockerImageAsset(stack, 'ImageAssets', {
  directory: path.join(__dirname, './docker.assets'),
});
const service3 = new Service(stack, 'Service3', {
  source: Source.fromAsset({
    imageConfiguration: { port: 8000 },
    asset: imageAsset,
  }),
});
new cdk.CfnOutput(stack, 'URL3', { value: `https://${service3.serviceUrl}` });

// Scenario 4: Create the service from Github. Make sure you specify a valid connection ARN.
const connectionArn = stack.node.tryGetContext('CONNECTION_ARN') || 'MOCK';
const service4 = new Service(stack, 'Service4', {
  source: Source.fromGitHub({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    configurationSource: ConfigurationSourceType.REPOSITORY,
    connection: GitHubConnection.fromConnectionArn(connectionArn),
  }),
});
new cdk.CfnOutput(stack, 'URL4', { value: `https://${service4.serviceUrl}` });

// Scenario 5: Create the service from Github with configuration values override.
const service5 = new Service(stack, 'Service5', {
  source: Source.fromGitHub({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    configurationSource: ConfigurationSourceType.API,
    codeConfigurationValues: {
      runtime: Runtime.PYTHON_3,
      port: '8000',
      startCommand: 'python app.py',
      buildCommand: 'yum install -y pycairo && pip install -r requirements.txt',
    },
    connection: GitHubConnection.fromConnectionArn(connectionArn),
  }),
});
new cdk.CfnOutput(stack, 'URL5', { value: `https://${service5.serviceUrl}` });

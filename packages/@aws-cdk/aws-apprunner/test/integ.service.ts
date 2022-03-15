import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as assets from '@aws-cdk/aws-ecr-assets';
import * as cdk from '@aws-cdk/core';
import { Service, Source, GitHubConnection, ConfigurationSourceType, Runtime, VpcConnector } from '../lib';


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

// Scenario 6: Create the service from ECR public with a vpcConnector
const vpc = new ec2.Vpc(stack, 'Vpc', {
  cidr: '10.0.0.0/16',
});

const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const vpcConnector = new VpcConnector(stack, 'VpcConnector', {
  subnets: vpc.publicSubnets,
  securityGroups: [securityGroup],
  vpcConnectorName: 'MyVpcConnector',
});

const service6 = new Service(stack, 'Service6', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector,
});
new cdk.CfnOutput(stack, 'URL6', { value: `https://${service6.serviceUrl}` });

// Scenario 7: Create the service from ECR public and assign it to an existing vpcConnector
const service7 = new Service(stack, 'Service7', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector: VpcConnector.fromServiceAttributes(stack, 'ImportedVpcConnector', {
    vpcConnectorArn: vpcConnector.vpcConnectorArn,
    vpcConnectorName: vpcConnector.vpcConnectorName,
    vpcConnectorRevision: vpcConnector.vpcConnectorRevision,
  }),
});
new cdk.CfnOutput(stack, 'URL7', { value: `https://${service7.serviceUrl}` });

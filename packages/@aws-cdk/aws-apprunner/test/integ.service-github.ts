import * as cdk from '@aws-cdk/core';
import { Service, Source, GitHubConnection, ConfigurationSourceType, Runtime } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner');

// Scenario 4: Create the service from Github. Make sure you specify a valid connection ARN.
const connectionArn = process.env.CONNECTION_ARN || 'MOCK';
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

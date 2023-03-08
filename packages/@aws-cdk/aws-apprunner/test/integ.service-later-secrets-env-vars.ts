import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as apprunner from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-later-secrets-env-vars');

// Scenario 9: Create the service from ECR public with secrets and environment vars added later
const laterSecret = new secretsmanager.Secret(stack, 'LaterSecret', {
  secretObjectValue: {
    password: cdk.SecretValue.unsafePlainText('mySecretPassword'),
    apikey: cdk.SecretValue.unsafePlainText('mySecretApiKey'),
  },
});

const service9 = new apprunner.Service(stack, 'Service9', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
});

service9.addSecret('LATER_SECRET', apprunner.Secret.fromSecretsManager(laterSecret, 'apikey'));
service9.addEnvironmentVariable('LATER_ENVVAR', 'testNewEnvVar');

new cdk.CfnOutput(stack, 'URL9', { value: `https://${service9.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerLaterSecretsEnvVars', {
  testCases: [stack],
});

app.synth();
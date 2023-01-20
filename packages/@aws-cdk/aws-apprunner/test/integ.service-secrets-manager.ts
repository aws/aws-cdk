import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as apprunner from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-secrets-manager');

// Scenario 8: Create the service from ECR public with secrets manager environment variable
const secret = new secretsmanager.Secret(stack, 'Secret', {
  secretObjectValue: {
    password: cdk.SecretValue.unsafePlainText('mySecretPassword'),
    apikey: cdk.SecretValue.unsafePlainText('mySecretApiKey'),
  },
});

new ssm.StringParameter(stack, 'String', {
  parameterName: '/My/Public/Parameter',
  stringValue: 'Abc123',
});

const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
  parameterName: '/My/Public/Parameter',
  version: 1,
});

const service8 = new apprunner.Service(stack, 'Service8', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
      environmentSecrets: {
        PASSWORD: apprunner.Secret.fromSecretsManager(secret, 'password'),
        PARAMETER: apprunner.Secret.fromSsmParameter(parameter),
      },
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
});

service8.addSecret('API_KEY', apprunner.Secret.fromSecretsManager(secret, 'apikey'));

new cdk.CfnOutput(stack, 'URL8', { value: `https://${service8.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerSecretsManger', {
  testCases: [stack],
});

app.synth();
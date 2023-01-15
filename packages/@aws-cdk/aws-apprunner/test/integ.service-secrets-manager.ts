import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { SecretValue } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Service, Source } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-secrets-manager');

// Scenario 8: Create the service from ECR public with secrets manager environment variable
const secret = new secretsmanager.Secret(stack, 'Secret', {
  secretObjectValue: { foo: SecretValue.unsafePlainText('fooval') },
});

const role = new iam.Role(stack, 'InstanceRole', {
  assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
});

secret.grantRead(role);

const service8 = new Service(stack, 'Service8', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
      environmentSecrets: {
        foo: secret.secretArn,
      },
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  instanceRole: role,
});

new cdk.CfnOutput(stack, 'URL8', { value: `https://${service8.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerSecretsManger', {
  testCases: [stack],
});

app.synth();
import * as cdk from 'aws-cdk-lib';
import { Service, Source } from '../lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-encryption');

const key = new kms.Key(stack, 'Key', { removalPolicy: cdk.RemovalPolicy.DESTROY });

const service = new Service(stack, 'Service', {
  serviceName: 'service',
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  autoDeploymentsEnabled: false,
  kmsKey: key,
});

new cdk.CfnOutput(stack, 'URL', { value: `https://${service.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerEncryption', {
  testCases: [stack],
});

app.synth();

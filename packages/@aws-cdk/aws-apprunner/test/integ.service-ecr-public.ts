import * as cdk from '@aws-cdk/core';
import { Service, Source } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-ecr-public');

// Scenario 1: Create the service from ECR public
const service1 = new Service(stack, 'Service1', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  autoDeploymentsEnabled: false,
});
new cdk.CfnOutput(stack, 'URL1', { value: `https://${service1.serviceUrl}` });

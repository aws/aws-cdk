import * as cdk from 'aws-cdk-lib';
import { Service, Source } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-ecr-public');

// Scenario 1: Create the service from ECR public
const service1 = new Service(stack, 'Service1', {
  serviceName: 'service1',
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  autoDeploymentsEnabled: false,
});
new cdk.CfnOutput(stack, 'URL1', { value: `https://${service1.serviceUrl}` });
new cdk.CfnOutput(stack, 'ServiceName', { value: service1.serviceName });
new cdk.CfnOutput(stack, 'ServiceId', { value: service1.serviceId });
new cdk.CfnOutput(stack, 'ServiceStatus', { value: service1.serviceStatus });
new cdk.CfnOutput(stack, 'ServiceArn', { value: service1.serviceArn });

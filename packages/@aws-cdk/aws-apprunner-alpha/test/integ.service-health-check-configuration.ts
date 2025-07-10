import * as cdk from 'aws-cdk-lib';
import { HealthCheck, Service, Source } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner');

new Service(stack, 'Service', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  healthCheck: HealthCheck.http({
    healthyThreshold: 5,
    interval: cdk.Duration.seconds(10),
    path: '/',
    timeout: cdk.Duration.seconds(10),
    unhealthyThreshold: 10,
  }),
});

new IntegTest(app, 'cdk-integ-dashboard-and-widget-with-start-and-end', {
  testCases: [stack],
});

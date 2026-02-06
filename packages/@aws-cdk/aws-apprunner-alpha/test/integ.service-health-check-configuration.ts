import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { HealthCheck, Service, Source } from '../lib';

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
  regions: ['ap-northeast-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'us-east-1', 'us-east-2', 'us-west-2'],
});

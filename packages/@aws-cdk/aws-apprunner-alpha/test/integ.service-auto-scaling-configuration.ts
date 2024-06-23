import * as cdk from 'aws-cdk-lib';
import { Service, Source, AutoScalingConfiguration } from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-auto-scaling-configuration');

const autoScalingConfiguration = new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
  maxConcurrency: 150,
  maxSize: 20,
  minSize: 5,
});

const service = new Service(stack, 'Service', {
  serviceName: 'service',
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  autoDeploymentsEnabled: false,
  autoScalingConfiguration,
});

new cdk.CfnOutput(stack, 'URL', { value: `https://${service.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerAutoScalingConfiguration', {
  testCases: [stack],
});

app.synth();

import * as cdk from '@aws-cdk/core';
import { Tags } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { ObservabilityConfiguration, Service, Source, Vendor } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner');

// Scenario 8: Create the service from ECR public with an Observabiliy Configuration
const observabilityConfiguration = new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', { traceConfiguration: Vendor.AWSXRAY });

Tags.of(observabilityConfiguration).add('mytag', 'here');

const service8 = new Service(stack, 'Service8', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  observabilityConfiguration,
});
new cdk.CfnOutput(stack, 'URL8', { value: `https://${service8.serviceUrl}` });

// Scenario 9: Create the service from ECR public and associate it with an existing Observability Configuration from ARN

const service9 = new Service(stack, 'Service9', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  observabilityConfiguration: ObservabilityConfiguration.fromObservabilityConfigurationArn(stack, 'ImportedObservabilityConfigurationFromArn', observabilityConfiguration.observabilityConfigurationArn),
});
new cdk.CfnOutput(stack, 'URL9', { value: `https://${service9.serviceUrl}` });

// Scenario 10: Create the service from ECR public and associate it with an existing Observability Configuration from name

const service10 = new Service(stack, 'Service10', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  observabilityConfiguration: ObservabilityConfiguration.fromObservabilityConfigurationName(stack, 'ImportedObservabilityConfigurationFromName', observabilityConfiguration.configurationName),
});
new cdk.CfnOutput(stack, 'URL10', { value: `https://${service10.serviceUrl}` });

new IntegTest(app, 'apprunner', {
  testCases: [stack],
});
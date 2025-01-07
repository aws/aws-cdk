import * as cdk from 'aws-cdk-lib';
import { Service, Source, ObservabilityConfiguration, TraceConfigurationVendor } from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-observability-configuration');

const observabilityConfiguration = new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
  traceConfigurationVendor: TraceConfigurationVendor.AWSXRAY,
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
  observabilityConfiguration,
});

new cdk.CfnOutput(stack, 'URL', { value: `https://${service.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerObservabilityConfiguration', {
  testCases: [stack],
});

app.synth();

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { APPRUNNER_SUPPORTED_REGIONS } from './apprunner-supported-regions';
import { Service, Source, ObservabilityConfiguration, TraceConfigurationVendor } from '../lib';

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
  regions: APPRUNNER_SUPPORTED_REGIONS,
});

app.synth();

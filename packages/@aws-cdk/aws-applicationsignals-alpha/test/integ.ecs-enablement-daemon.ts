
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as appsignals from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ecs-enablement-integration');

const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDefinition', {
  networkMode: ecs.NetworkMode.HOST,
});
ec2TaskDefinition.addContainer('app', {
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  cpu: 0,
  memoryLimitMiB: 512,
});

new appsignals.ApplicationSignalsIntegration(stack, 'TestEc2TaskDefinitionIntegration', {
  taskDefinition: ec2TaskDefinition,
  instrumentation: {
    language: appsignals.InstrumentationLanguage.PYTHON,
    sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0,
  },
  serviceName: 'demo',
  overrideEnvironments: [
    {
      name: appsignals.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT,
      value: 'http://cwagent.local:4316/v1/metrics',
    }, {
      name: appsignals.TraceExporting.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
      value: 'http://cwagent.local:4316/v1/traces',
    }, {
      name: appsignals.TraceExporting.OTEL_TRACES_SAMPLER_ARG,
      value: 'endpoint=http://ccwagent.local:2000',
    },
  ],
  cloudWatchAgent: {
    enableSidecar: false,
  },
});

new integ.IntegTest(app, 'ApplicationSignalsIntegrationECSDaemon', {
  testCases: [stack],
});

app.synth();

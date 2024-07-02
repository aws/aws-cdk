import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { ObservabilityConfiguration, TraceConfigurationVendor } from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test.each([
  ['MyObservabilityConfiguration'],
  ['my-observability-configuration_1'],
])('create a ObservabilityConfiguration with all properties (name: %s)', (observabilityConfigurationName: string) => {
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
    observabilityConfigurationName,
    traceConfigurationVendor: TraceConfigurationVendor.AWSXRAY,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: observabilityConfigurationName,
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });
});

test.each([
  ['tes'],
  ['test-observability-configuration-name-over-limitation'],
  ['-test'],
  ['test-?'],
])('observabilityConfigurationName over length limitation (name: %s)', (observabilityConfigurationName: string) => {
  expect(() => {
    new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
      observabilityConfigurationName,
      traceConfigurationVendor: TraceConfigurationVendor.AWSXRAY,
    });
  }).toThrow(`observabilityConfigurationName must match the \`^[A-Za-z0-9][A-Za-z0-9\-_]{3,31}$\` pattern, got ${observabilityConfigurationName}`);
});

test('create an Auto scaling Configuration with tags', () => {
  // WHEN
  const observabilityConfiguration = new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
    observabilityConfigurationName: 'my-autoscaling-config',
    traceConfigurationVendor: TraceConfigurationVendor.AWSXRAY,
  });

  cdk.Tags.of(observabilityConfiguration).add('Environment', 'production');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    Tags: [
      {
        Key: 'Environment',
        Value: 'production',
      },
    ],
  });
});

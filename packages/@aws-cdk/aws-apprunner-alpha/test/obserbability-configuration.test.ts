import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { ObservabilityConfiguration, Vendor } from '../lib';

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
    vendor: Vendor.AWSXRAY,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: observabilityConfigurationName,
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });
});

test('create a ObservabilityConfiguration without all properties', () => {
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: Match.absent(),
    TraceConfiguration: Match.absent(),
  });
});

test('create a Observability Configuration without all properties', () => {
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: Match.absent(),
    TraceConfiguration: Match.absent(),
  });
});

test.each([
  ['tes'],
  ['test-observability-configuration-name-over-limitation'],
])('observabilityConfigurationName over length limitation (name: %s)', (observabilityConfigurationName: string) => {
  expect(() => {
    new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
      observabilityConfigurationName,
    });
  }).toThrow(`observabilityConfigurationName must be between 4 and 32 characters long, but it has ${observabilityConfigurationName.length} characters.`);
});

test.each([
  ['-test'],
  ['test-?'],
])('invalid observabilityConfigurationName (name: %s)', (observabilityConfigurationName: string) => {
  expect(() => {
    new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
      observabilityConfigurationName,
    });
  }).toThrow(`observabilityConfigurationName ${observabilityConfigurationName} must start with a letter or number, and can contain only letters, numbers, hyphens, and underscores.`);
});

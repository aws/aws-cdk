import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { ObservabilityConfiguration } from '../lib';

test('create an observability configuration', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration');
  // we should have the observability configuration
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });
});

test('create an observability configuration with a custom name', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
    observabilityConfigurationName: 'MyObservabilityConfiguration',
  });
  // we should have the observability configuration
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: 'MyObservabilityConfiguration',
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });
});


test('create an observability configuration with xray disabled', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
    xrayTracing: false,
  });
  // we should have the observability configuration
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {});
});

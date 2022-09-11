import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { ObservabilityConfiguration, Vendor } from '../lib';

test('create an observability configuration with xray trace configuration vendor', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', { traceConfiguration: Vendor.AWSXRAY });
  // we should have the observability configuration
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });
});

test('create an observability configuration with a custom name and xray as a trace configuration vendor', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
    traceConfiguration: Vendor.AWSXRAY,
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


test('create an observability configuration with no trace configuration vendor uses default', () => {
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

import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { ObservabilityConfiguration, Vendor } from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('create a Observability Configuration with all properties', () => {
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
    observabilityConfigurationName: 'MyObservabilityConfiguration',
    vendor: Vendor.AWSXRAY,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: 'MyObservabilityConfiguration',
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });
});

test('create a Observability Configuration without all properties', () => {
  // WHEN
  new ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: Match.absent(),
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });
});

import { capitalizePropertyNames } from './utils';
import { Template } from '../../assertions';
import { Role, ServicePrincipal } from '../../aws-iam';
import { Stack } from '../../core';
import { CfnComputeEnvironmentProps, UnmanagedComputeEnvironment } from '../lib/';

const defaultExpectedProps: CfnComputeEnvironmentProps = {
  type: 'unmanaged',
  computeEnvironmentName: undefined,
  computeResources: undefined,
  eksConfiguration: undefined,
  replaceComputeEnvironment: undefined,
  serviceRole: {
    'Fn::GetAtt': ['MyCEBatchServiceRole4FDA2CB6', 'Arn'],
  } as any,
  state: 'ENABLED',
  tags: undefined,
  unmanagedvCpus: undefined,
  updatePolicy: undefined,
};

let stack = new Stack();
const pascalCaseExpectedProps = capitalizePropertyNames(stack, defaultExpectedProps);

test('default props', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
  });
});

test('respects enabled: false', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    enabled: false,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    State: 'DISABLED',
  });
});

test('respects name', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    computeEnvironmentName: 'magic',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    ComputeEnvironmentName: 'magic',
  });
});

test('respects serviceRole', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    serviceRole: new Role(stack, 'myMagicRole', {
      assumedBy: new ServicePrincipal('batch.amazonaws.com'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    ServiceRole: {
      'Fn::GetAtt': ['myMagicRole2BBD827A', 'Arn'],
    },
  });
});

test('respects unmanagedvCpus', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    unmanagedvCpus: 256,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    UnmanagedvCpus: 256,
  });
});

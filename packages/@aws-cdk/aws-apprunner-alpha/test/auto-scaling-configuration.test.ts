import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { AutoScalingConfiguration } from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test.each([
  ['MyAutoScalingConfiguration'],
  ['my-autoscaling-configuration_1'],
])('create an Auto scaling Configuration with all properties (name: %s)', (autoScalingConfigurationName: string) => {
  // WHEN
  new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
    autoScalingConfigurationName,
    maxConcurrency: 150,
    maxSize: 20,
    minSize: 5,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::AutoScalingConfiguration', {
    AutoScalingConfigurationName: autoScalingConfigurationName,
    MaxConcurrency: 150,
    MaxSize: 20,
    MinSize: 5,
  });
});

test('create an Auto scaling Configuration without all properties', () => {
  // WHEN
  new AutoScalingConfiguration(stack, 'AutoScalingConfiguration');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::AutoScalingConfiguration', {
    AutoScalingConfigurationName: Match.absent(),
    MaxConcurrency: Match.absent(),
    MaxSize: Match.absent(),
    MinSize: Match.absent(),
  });
});

test.each([-1, 0, 26])('invalid minSize', (minSize: number) => {
  expect(() => {
    new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
      minSize,
    });
  }).toThrow(`minSize must be between 1 and 25, got ${minSize}`);
});

test.each([0, 26])('invalid maxSize', (maxSize: number) => {
  expect(() => {
    new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
      maxSize,
    });
  }).toThrow(`maxSize must be between 1 and 25, got ${maxSize}`);
});

test('minSize greater than maxSize', () => {
  expect(() => {
    new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
      minSize: 5,
      maxSize: 3,
    });
  }).toThrow('maxSize must be greater than minSize.');
});

test.each([0, 201])('invalid maxConcurrency', (maxConcurrency: number) => {
  expect(() => {
    new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
      maxConcurrency,
    });
  }).toThrow(`maxConcurrency must be between 1 and 200, got ${maxConcurrency}.`);
});

test.each([
  ['tes'],
  ['test-autoscaling-configuration-name-over-limitation'],
])('autoScalingConfigurationName length is invalid(name: %s)', (autoScalingConfigurationName: string) => {
  expect(() => {
    new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
      autoScalingConfigurationName,
    });
  }).toThrow(`\`autoScalingConfigurationName\` must be between 4 and 32 characters, got: ${autoScalingConfigurationName.length} characters.`);
});

test.each([
  ['-test'],
  ['test-?'],
  ['test-\\'],
])('autoScalingConfigurationName includes invalid characters(name: %s)', (autoScalingConfigurationName: string) => {
  expect(() => {
    new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
      autoScalingConfigurationName,
    });
  }).toThrow(`\`autoScalingConfigurationName\` must start with an alphanumeric character and contain only alphanumeric characters, hyphens, or underscores after that, got: ${autoScalingConfigurationName}.`);
});

test('create an Auto scaling Configuration with tags', () => {
  // WHEN
  const autoScalingConfiguration = new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
    autoScalingConfigurationName: 'my-autoscaling-config',
    maxConcurrency: 150,
    maxSize: 20,
    minSize: 5,
  });

  cdk.Tags.of(autoScalingConfiguration).add('Environment', 'production');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::AutoScalingConfiguration', {
    Tags: [
      {
        Key: 'Environment',
        Value: 'production',
      },
    ],
  });
});

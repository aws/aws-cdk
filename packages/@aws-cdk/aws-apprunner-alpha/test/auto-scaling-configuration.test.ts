import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { AutoScalingConfiguration } from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('create an Auto scaling Configuration with all properties', () => {
  // WHEN
  new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
    autoScalingConfigurationName: 'MyAutoScalingConfiguration',
    maxConcurrency: 150,
    maxSize: 20,
    minSize: 5,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::AutoScalingConfiguration', {
    AutoScalingConfigurationName: 'MyAutoScalingConfiguration',
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

test.each([0, 26])('invalid minSize', (minSize: number) => {
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
  }).toThrow('maxSize must be greater than minSize');
});

test.each([0, 201])('invalid maxConcurrency', (maxConcurrency: number) => {
  expect(() => {
    new AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
      maxConcurrency,
    });
  }).toThrow(`maxConcurrency must be between 1 and 200, got ${maxConcurrency}`);
});

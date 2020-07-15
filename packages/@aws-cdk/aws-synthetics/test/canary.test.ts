import '@aws-cdk/assert/jest';
// import { arrayWith, objectLike } from '@aws-cdk/assert/lib/assertions';
// import * as iam from '@aws-cdk/aws-iam';
// import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as synth from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('Create a basic canary', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
  });
});
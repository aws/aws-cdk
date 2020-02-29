import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { NodejsInlineFunction } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('NodejsInlineFunction', () => {
  // WHEN
  new NodejsInlineFunction(stack, 'Inline', {
    handler: async (event: any) => {
      console.log('Event: %j', event); // tslint:disable-line:no-console
      return event;
    }
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Code: {
      ZipFile: "const AWS=require('aws-sdk');exports.handler=async event => {console.log('Event: %j', event);return event;}"
    },
  });
});

test('NodejsInlineFunction with cfn-response only', () => {
  // WHEN
  new NodejsInlineFunction(stack, 'Inline', {
    requireCfnResponse: true,
    requireAwsSdk: false,
    handler: async (event: any) => {
      console.log('Event: %j', event); // tslint:disable-line:no-console
      return event;
    },
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Code: {
      ZipFile: "const response=require('cfn-response');exports.handler=async event => {console.log('Event: %j', event);return event;}"
    },
  });
});

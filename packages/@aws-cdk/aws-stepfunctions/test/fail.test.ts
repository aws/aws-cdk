import * as cdk from '@aws-cdk/core';
import * as stepfunctions from '../lib';

describe('Fail State', () => {
  test('Props are optional', () => {
    const stack = new cdk.Stack();

    new stepfunctions.Fail(stack, 'Fail');
  });
});

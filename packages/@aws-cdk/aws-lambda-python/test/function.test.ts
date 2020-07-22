import '@aws-cdk/assert/jest';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { PythonFunction } from '../lib';
import { Bundling } from '../lib/bundling';

jest.mock('../lib/bundling', () => {
  return {
    Bundling: {
      bundle: jest.fn().mockReturnValue({
        bind: () => {
          return { inlineCode: 'code' };
        },
        bindToResource: () => { return; },
      }),
    },
  };
});

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

test('PythonFunction with .py handler', () => {
  new PythonFunction(stack, 'handler', {
    entry: 'test/lambda-handler/index.py',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-python\/test\/lambda-handler\/index.py$/),
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.handler',
  });
});

test('throws when entry is not py', () => {
  expect(() => new PythonFunction(stack, 'Fn', {
    entry: 'handler.js',
  })).toThrow(/Only Python \(\.py\) entry files are supported/);
});

test('throws when entry does not exist', () => {
  expect(() => new PythonFunction(stack, 'Fn', {
    entry: 'notfound.py',
  })).toThrow(/Cannot find entry file at/);
});

test('throws with the wrong runtime family', () => {
  expect(() => new PythonFunction(stack, 'handler1', {
    entry: 'function.test.handler.py',
    runtime: Runtime.NODEJS_12_X,
  })).toThrow(/Only `PYTHON` runtimes are supported/);
});

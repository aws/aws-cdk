import '@aws-cdk/assert/jest';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { PythonFunction } from '../lib';
import { bundle } from '../lib/bundling';

jest.mock('../lib/bundling', () => {
  return {
    bundle: jest.fn().mockReturnValue({
      bind: () => {
        return { inlineCode: 'code' };
      },
      bindToResource: () => { return; },
    }),
    hasDependencies: jest.fn().mockReturnValue(false),
  };
});

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

test('PythonFunction with defaults', () => {
  new PythonFunction(stack, 'handler', {
    entry: 'test/lambda-handler',
  });

  expect(bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-python\/test\/lambda-handler$/),
    outputPathSuffix: '.',
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.handler',
  });
});

test('PythonFunction with index in a subdirectory', () => {
  new PythonFunction(stack, 'handler', {
    entry: 'test/lambda-handler-sub',
    index: 'inner/custom_index.py',
    handler: 'custom_handler',
  });

  expect(bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-python\/test\/lambda-handler-sub$/),
    outputPathSuffix: '.',
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'inner/custom_index.custom_handler',
  });
});

test('throws when index is not py', () => {
  expect(() => new PythonFunction(stack, 'Fn', {
    entry: 'test/lambda-handler',
    index: 'index.js',
  })).toThrow(/Only Python \(\.py\) index files are supported/);
});

test('throws when entry does not exist', () => {
  expect(() => new PythonFunction(stack, 'Fn', {
    entry: 'notfound',
  })).toThrow(/Cannot find index file at/);
});

test('throws with the wrong runtime family', () => {
  expect(() => new PythonFunction(stack, 'handler1', {
    entry: 'test/lambda-handler',
    runtime: Runtime.NODEJS_12_X,
  })).toThrow(/Only `PYTHON` runtimes are supported/);
});

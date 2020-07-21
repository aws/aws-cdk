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
  // WHEN
  new PythonFunction(stack, 'handler');

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function.test.handler.py'), // Automatically finds .py handler file
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'lambda_function.lambda_handler',
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

test('throws when entry cannot be automatically found', () => {
  expect(() => new PythonFunction(stack, 'Fn')).toThrow(/Cannot find entry file./);
});

test('throws with the wrong runtime family', () => {
  expect(() => new PythonFunction(stack, 'handler1', {
    runtime: Runtime.NODEJS_12_X,
  })).toThrow(/Only `PYTHON` runtimes are supported/);
});


test('resolves entry to an absolute path', () => {
  // WHEN
  new PythonFunction(stack, 'fn', {
    entry: 'test/function.test.handler.py',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-python\/test\/function.test.handler.py$/),
  }));
});

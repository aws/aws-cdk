import '@aws-cdk/assert/jest';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { NodejsFunction } from '../lib';
import { Bundling } from '../lib/bundling';

jest.mock('../lib/bundling', () => {
  return {
    Bundling: {
      parcel: jest.fn().mockReturnValue({
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

test('NodejsFunction with .ts handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  expect(Bundling.parcel).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function.test.handler1.ts'), // Automatically finds .ts handler file
    global: 'handler',
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.handler',
  });
});

test('NodejsFunction with .js handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler2');

  // THEN
  expect(Bundling.parcel).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function.test.handler2.js'), // Automatically finds .ts handler file
  }));
});

test('NodejsFunction with container env vars', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1', {
    containerEnvironment: {
      KEY: 'VALUE',
    },
  });

  expect(Bundling.parcel).toHaveBeenCalledWith(expect.objectContaining({
    environment: {
      KEY: 'VALUE',
    },
  }));
});

test('throws when entry is not js/ts', () => {
  expect(() => new NodejsFunction(stack, 'Fn', {
    entry: 'handler.py',
  })).toThrow(/Only JavaScript or TypeScript entry files are supported/);
});

test('throws when entry does not exist', () => {
  expect(() => new NodejsFunction(stack, 'Fn', {
    entry: 'notfound.ts',
  })).toThrow(/Cannot find entry file at/);
});

test('throws when entry cannot be automatically found', () => {
  expect(() => new NodejsFunction(stack, 'Fn')).toThrow(/Cannot find entry file./);
});

test('throws with the wrong runtime family', () => {
  expect(() => new NodejsFunction(stack, 'handler1', {
    runtime: Runtime.PYTHON_3_8,
  })).toThrow(/Only `NODEJS` runtimes are supported/);
});

import '@aws-cdk/assert-internal/jest';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { GolangFunction } from '../lib';
import { Bundling } from '../lib/bundling';

jest.mock('../lib/bundling', () => {
  return {
    Bundling: {
      bundle: jest.fn().mockReturnValue({
        bind: () => {
          return { s3Location: 'code' };
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

test('GolangFunction with defaults', () => {
  // WHEN
  new GolangFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-golang\/test\/lambda-handler-vendor\/cmd\/api$/),
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'provided.al2',
  });
});

test('GolangFunction with using provided runtime', () => {
  // WHEN
  new GolangFunction(stack, 'handler', {
    entry: 'test/lambda-handler-vendor/cmd/api',
    runtime: Runtime.PROVIDED,
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-golang\/test\/lambda-handler-vendor\/cmd\/api$/),
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'provided',
  });
});

test('GolangFunction with using golang runtime', () => {
  // WHEN
  new GolangFunction(stack, 'handler', {
    entry: 'test/lambda-handler-vendor/cmd/api',
    runtime: Runtime.GO_1_X,
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-golang\/test\/lambda-handler-vendor\/cmd\/api$/),
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'go1.x',
  });
});

test('GolangFunction with container env vars', () => {
  // WHEN
  new GolangFunction(stack, 'handler', {
    entry: 'test/lambda-handler-vendor/cmd/api',
    bundling: {
      environment: {
        KEY: 'VALUE',
      },
    },
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    environment: {
      KEY: 'VALUE',
    },
  }));
});

test('throws with the wrong runtime family', () => {
  expect(() => new GolangFunction(stack, 'handler', {
    entry: 'test/lambda-handler-vendor/cmd/api',
    runtime: Runtime.PYTHON_3_8,
  })).toThrow(/Only `go` and `provided` runtimes are supported/);
});

test('resolves entry to an absolute path', () => {
  // WHEN
  new GolangFunction(stack, 'fn', {
    entry: 'test/lambda-handler-vendor/cmd/api/main.go',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-golang\/test\/lambda-handler-vendor\/cmd\/api\/main.go$/),
  }));
});

test('throws with no existing go.mod file', () => {
  expect(() => new GolangFunction(stack, 'handler', {
    entry: 'test/lambda-handler-vendor/cmd/api',
    modFilePath: '/does/not/exist.mod',
  })).toThrow(/go.mod file at \/does\/not\/exist.mod doesn't exist/);
});

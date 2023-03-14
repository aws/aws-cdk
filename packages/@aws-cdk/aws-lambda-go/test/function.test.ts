import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { GoFunction } from '../lib';
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

test('GoFunction with defaults', () => {
  // WHEN
  new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/aws-lambda-go\/test\/lambda-handler-vendor\/cmd\/api$/),
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'provided.al2',
  });
});

test('GoFunction with using provided runtime', () => {
  // WHEN
  new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
    runtime: Runtime.PROVIDED,
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/aws-lambda-go\/test\/lambda-handler-vendor\/cmd\/api$/),
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'provided',
  });
});

test('GoFunction with using golang runtime', () => {
  // WHEN
  new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
    runtime: Runtime.GO_1_X,
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/aws-lambda-go\/test\/lambda-handler-vendor\/cmd\/api$/),
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'go1.x',
  });
});

test('GoFunction with container env vars', () => {
  // WHEN
  new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
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
  expect(() => new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
    runtime: Runtime.PYTHON_3_8,
  })).toThrow(/Only `go` and `provided` runtimes are supported/);
});

test('resolves entry to an absolute path', () => {
  // WHEN
  new GoFunction(stack, 'fn', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api/main.go'),
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/aws-lambda-go\/test\/lambda-handler-vendor\/cmd\/api\/main.go$/),
  }));
});

test('throws with no existing go.mod file', () => {
  expect(() => new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
    moduleDir: '/does/not/exist/go.mod',
  })).toThrow(/go.mod file at \/does\/not\/exist\/go.mod doesn't exist/);
});

test('throws with incorrect moduleDir file', () => {
  expect(() => new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
    moduleDir: '/does/not/exist.mod',
  })).toThrow(/moduleDir is specifying a file that is not go.mod/);
});

test('custom moduleDir can be used', () => {
  new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
    moduleDir: path.join(__dirname, 'lambda-handler-vendor'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
  });
});

test('custom moduleDir with file path can be used', () => {
  new GoFunction(stack, 'handler', {
    entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
    moduleDir: path.join(__dirname, 'lambda-handler-vendor/go.mod'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
  });
});

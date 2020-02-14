import '@aws-cdk/assert/jest';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as fs from 'fs-extra';
import * as path from 'path';
import { NodejsFunction } from '../lib';
import { build, BuildOptions } from '../lib/build';

jest.mock('../lib/build', () => ({
  build: jest.fn((options: BuildOptions) => {
    require('fs-extra').ensureDirSync(options.outDir); // eslint-disable-line @typescript-eslint/no-require-imports
  })
}));

let stack: Stack;
const buildDir = path.join(__dirname, '.build');
beforeEach(() => {
  stack = new Stack();
  fs.removeSync(buildDir);
});

afterEach(() => {
  fs.removeSync(buildDir);
});

test('NodejsFunction with .ts handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  expect(build).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function.test.handler1.ts'), // Automatically finds .ts handler file
    global: 'handler',
    outDir: expect.stringContaining(buildDir)
  }));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.handler',
  });
});

test('NodejsFunction with .js handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler2');

  // THEN
  expect(build).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function.test.handler2.js'), // Automatically finds .ts handler file
  }));
});

test('throws when entry is not js/ts', () => {
  expect(() => new NodejsFunction(stack, 'Fn', {
    entry: 'handler.py'
  })).toThrow(/Only JavaScript or TypeScript entry files are supported/);
});

test('throws when entry does not exist', () => {
  expect(() => new NodejsFunction(stack, 'Fn', {
    entry: 'notfound.ts'
  })).toThrow(/Cannot find entry file at/);
});

test('throws when entry cannot be automatically found', () => {
  expect(() => new NodejsFunction(stack, 'Fn')).toThrow(/Cannot find entry file./);
});

test('throws with the wrong runtime family', () => {
  expect(() => new NodejsFunction(stack, 'handler1', {
    runtime: Runtime.PYTHON_3_8
  })).toThrow(/Only `NODEJS` runtimes are supported/);
});

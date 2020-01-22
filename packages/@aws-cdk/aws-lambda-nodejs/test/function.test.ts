import '@aws-cdk/assert/jest';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as fs from 'fs-extra';
import * as path from 'path';
import { NodejsFunction } from '../lib';

jest.mock('child_process', () => ({
  spawnSync: jest.fn((_cmd: string, args: string[]) => {
    require('fs-extra').ensureDirSync(args[3]); // eslint-disable-line @typescript-eslint/no-require-imports
    return { error: null, status: 0 };
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

test('NodejsFunction', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');
  new NodejsFunction(stack, 'handler2');

  // THEN
  const { spawnSync } = require('child_process'); // eslint-disable-line @typescript-eslint/no-require-imports

  expect(spawnSync).toHaveBeenCalledWith('parcel', expect.arrayContaining([
    'build',
    expect.stringContaining('function.test.handler1.ts'), // Automatically finds .ts handler file
    '--out-dir',
    expect.stringContaining(buildDir),
    '--out-file',
    'index.js',
    '--global',
    'handler',
    '--target',
    'node',
    '--bundle-node-modules',
    '--log-level',
    '2',
    '--no-minify',
    '--no-source-maps'
  ]));

  // Automatically finds .js handler file
  expect(spawnSync).toHaveBeenCalledWith('parcel', expect.arrayContaining([
    expect.stringContaining('function.test.handler2.js'),
  ]));

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.handler',
  });
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

import * as path from 'path';
import { Runtime } from '../../aws-lambda';
import { Stack } from '../../core';
import { CdkHandler } from '../lib/cdk-handler';

describe('cdk handler', () => {
  let stack: Stack;
  let codeDirectory: string;
  beforeAll(() => {
    stack = new Stack();
    codeDirectory = path.join(__dirname, 'test-handler');
  });

  test('code directory property is correctly set', () => {
    // WHEN
    const handler = new CdkHandler(stack, 'CdkHandler', {
      codeDirectory,
      compatibleRuntimes: [Runtime.NODEJS_LATEST],
    });

    // THEN
    expect(handler.codeDirectory).toEqual(codeDirectory);
  });

  test('runtime property is correctly set', () => {
    // WHEN
    const handler = new CdkHandler(stack, 'CdkHandler', {
      codeDirectory,
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_LATEST, Runtime.PYTHON_3_12],
    });

    // THEN
    expect(handler.runtime.runtimeEquals(Runtime.NODEJS_LATEST)).toBe(true);
  });

  test('index.handler is default entrypoint', () => {
    // WHEN
    const handler = new CdkHandler(stack, 'CdkHandler', {
      codeDirectory,
      compatibleRuntimes: [Runtime.NODEJS_LATEST],
    });

    // THEN
    expect(handler.entrypoint).toEqual('index.handler');
  });

  test('entrypoint property is set correctly for non-default entrypoint', () => {
    // WHEN
    const handler = new CdkHandler(stack, 'CdkHandler', {
      codeDirectory,
      compatibleRuntimes: [Runtime.NODEJS_LATEST],
      entrypoint: 'index.onEventHandler',
    });

    // THEN
    expect(handler.entrypoint).toEqual('index.onEventHandler');
  });
});

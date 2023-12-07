import * as path from 'path';
import { Runtime } from '../../aws-lambda';
import { Stack } from '../../core';
import { CdkHandler } from '../lib/cdk-handler';

describe('cdk handler', () => {
  let codeDirectory: string;
  beforeAll(() => {
    codeDirectory = path.join(__dirname, 'test-handler');
  });

  test('code directory property is correctly set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const handler = new CdkHandler(stack, 'CdkHandler', {
      codeDirectory,
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_LATEST, Runtime.PYTHON_3_12],
    });

    // THEN
    expect(handler.codeDirectory).toEqual(codeDirectory);
  });

  test('runtime property is correctly set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const handler = new CdkHandler(stack, 'CdkHandler', {
      codeDirectory,
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_LATEST, Runtime.PYTHON_3_12],
    });

    // THEN
    expect(handler.runtime.runtimeEquals(Runtime.NODEJS_LATEST)).toBe(true);
  });
});

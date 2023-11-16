import * as path from 'path';
import { Runtime } from '../../../aws-lambda';
import { Stack } from '../../../core';
import { CdkCode } from '../../lib/handler-framework/cdk-code';
import { CdkSingletonFunction } from '../../lib/handler-framework/cdk-singleton-function';

describe('cdk singleton function', () => {
  test('throws if no nodejs or python runtimes are specified in cdk code', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset(path.join(__dirname, 'test-handler'), {
      compatibleRuntimes: [Runtime.JAVA_11, Runtime.RUBY_3_2],
    });

    // WHEN / THEN
    expect(() => {
      new CdkSingletonFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
        uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      });
    }).toThrow('Compatible runtimes must contain either nodejs or python runtimes');
  });

  test('throws if latest nodejs runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset(path.join(__dirname, 'test-handler'), {
      compatibleRuntimes: [Runtime.NODEJS_12_X, Runtime.NODEJS_14_X],
    });

    // WHEN / THEN
    expect(() => {
      new CdkSingletonFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
        uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      });
    }).toThrow(`Latest nodejs runtime ${Runtime.NODEJS_14_X} is deprecated`);
  });

  test('throws if latest python runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset(path.join(__dirname, 'test-handler'), {
      compatibleRuntimes: [Runtime.PYTHON_2_7, Runtime.PYTHON_3_6],
    });

    // WHEN / THEN
    expect(() => {
      new CdkSingletonFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
        uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      });
    }).toThrow(`Latest python runtime ${Runtime.PYTHON_3_6} is deprecated`);
  });
});
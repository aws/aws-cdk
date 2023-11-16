import { Template } from '../../../assertions';
import { Runtime } from '../../../aws-lambda';
import { Stack } from '../../../core';
import { CdkCode } from '../../lib/handler-framework/cdk-code';
import { CdkFunction } from '../../lib/handler-framework/cdk-function';

describe('cdk function', () => {
  test('stack contains expected lambda function', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset('./test-handler', {
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
    });

    // WHEN
    new CdkFunction(stack, 'Function', {
      code,
      handler: 'index.handler',
    });

    // THEN
    /* eslint-disable no-console */
    console.log(JSON.stringify(Template.fromStack(stack), null, 4));
  });

  test('throws if no nodejs or python runtimes are specified in cdk code', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset('./test-handler', {
      compatibleRuntimes: [Runtime.JAVA_11, Runtime.RUBY_3_2],
    });

    // WHEN / THEN
    expect(() => {
      new CdkFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
      });
    }).toThrow('Compatible runtimes must contain either nodejs or python runtimes');
  });

  test('throws if latest nodejs runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset('./test-handler', {
      compatibleRuntimes: [Runtime.NODEJS_12_X, Runtime.NODEJS_14_X],
    });

    // WHEN / THEN
    expect(() => {
      new CdkFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
      });
    }).toThrow(`Latest nodejs runtime ${Runtime.NODEJS_14_X} is deprecated`);
  });

  test('throws if latest python runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset('./test-handler', {
      compatibleRuntimes: [Runtime.PYTHON_2_7, Runtime.PYTHON_3_6],
    });

    // WHEN / THEN
    expect(() => {
      new CdkFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
      });
    }).toThrow(`Latest python runtime ${Runtime.PYTHON_3_6} is deprecated`);
  });
});
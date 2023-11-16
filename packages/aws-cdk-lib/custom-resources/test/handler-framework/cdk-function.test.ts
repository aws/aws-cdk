import { Template } from '../../../assertions';
import { Runtime } from '../../../aws-lambda';
import { Stack } from '../../../core';
import { CdkCode, CdkFunction } from '../../lib/handler-framework';

describe('', () => {
  test('finds latest runtime', () => {
    const stack = new Stack(undefined, 'Stack');

    const code = CdkCode.fromAsset('', {
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_14_X],
    });

    const fn = new CdkFunction(stack, 'CdkFunction', {
      code,
      handler: 'index.handler',
    });

    /* eslint-disable no-console */
    console.log(JSON.stringify(Template.fromStack(stack), null, 4));
  });
});
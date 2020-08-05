import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import * as synthetics from '../lib';

test('can specify custom test', () => {
  // GIVEN
  const stack = new Stack(new App(), 'canaries');

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline(`
        exports.handler = async () => {
          console.log(\'hello world\');
        };`),
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Code: {
      Handler: 'index.handler',
      Script: `
        exports.handler = async () => {
          console.log(\'hello world\');
        };`,
    },
  });
});


import { App, Stack } from '../../core';
import * as lambda from '../lib';
import { DEFAULT_UNITTEST_RUNTIME } from '../lib/helpers-internal';

describe('architecture', () => {
  const app = new App();
  const stack = new Stack(app, 'stack');

  test('toString to return the architecture name', () => {
    // GIVEN
    const testLambda = new lambda.Function(stack, 'testLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: DEFAULT_UNITTEST_RUNTIME,
    },
    );

    // THEN
    expect(`${testLambda.architecture}`).toEqual(testLambda.architecture.name);
  });
});

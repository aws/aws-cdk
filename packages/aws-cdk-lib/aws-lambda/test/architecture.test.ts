
import { App, Stack } from '../../core';
import * as lambda from '../lib';

describe('architecture', () => {
  const app = new App();
  const stack = new Stack(app, 'stack');

  test('toString to return the architecture name', () => {
    // GIVEN
    const testLambda = new lambda.Function(stack, 'testLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    },
    );

    // THEN
    expect(`${testLambda.architecture}`).toEqual(testLambda.architecture.name);
  });
});

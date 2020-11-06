import { Stack } from '@aws-cdk/core';
import { Authorizer, IRestApi } from '../lib';

describe('authorizer', () => {
  test('isAuthorizer correctly detects an instance of type Authorizer', () => {
    class MyAuthorizer extends Authorizer {
      public readonly authorizerId = 'test-authorizer-id';
      public _attachToApi(_: IRestApi): void {
        // do nothing
      }
    }
    const stack = new Stack();
    const authorizer = new MyAuthorizer(stack, 'authorizer');

    expect(Authorizer.isAuthorizer(authorizer)).toEqual(true);
    expect(Authorizer.isAuthorizer(stack)).toEqual(false);
  });
});
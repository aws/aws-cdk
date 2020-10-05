import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Authorizer, IRestApi } from '../lib';

export = {
  'isAuthorizer correctly detects an instance of type Authorizer'(test: Test) {
    class MyAuthorizer extends Authorizer {
      public readonly authorizerId = 'test-authorizer-id';
      public _attachToApi(_: IRestApi): void {
        // do nothing
      }
    }
    const stack = new Stack();
    const authorizer = new MyAuthorizer(stack, 'authorizer');

    test.ok(Authorizer.isAuthorizer(authorizer), 'type Authorizer expected but is not');
    test.ok(!Authorizer.isAuthorizer(stack), 'type Authorizer found, when not expected');

    test.done();
  },
};
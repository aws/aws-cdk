import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Authorizer, IdentitySource, RequestAuthorizer, RestApi, TokenAuthorizer } from '../lib';

export = {
  'isAuthorizer correctly detects an instance of type Authorizer'(test: Test) {
    class MyAuthorizer extends Authorizer {
      public readonly authorizerId = 'test-authorizer-id';
      public _attachToApi(_: RestApi): void {
        // do nothing
      }
    }
    const stack = new Stack();
    const authorizer = new MyAuthorizer(stack, 'authorizer');

    test.ok(Authorizer.isAuthorizer(authorizer), 'type Authorizer expected but is not');
    test.ok(!Authorizer.isAuthorizer(stack), 'type Authorizer found, when not expected');

    test.done();
  },

  'token authorizer is of type Authorizer'(test: Test) {
    const stack = new Stack();

    const handler = new Function(stack, 'token', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
    });
    const authorizer = new TokenAuthorizer(stack, 'authorizer', { handler });

    test.ok(Authorizer.isAuthorizer(authorizer), 'TokenAuthorizer is not of type Authorizer');

    test.done();
  },

  'request authorizer is of type Authorizer'(test: Test) {
    const stack = new Stack();

    const handler = new Function(stack, 'token', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
    });
    const authorizer = new RequestAuthorizer(stack, 'authorizer', {
      handler,
      identitySources: [ IdentitySource.header('my-header') ],
    });

    test.ok(Authorizer.isAuthorizer(authorizer), 'RequestAuthorizer is not of type Authorizer');

    test.done();
  },
};
import { Construct, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AuthorizationType, CustomAuthorizer, RestApi } from '../lib';

export = {
  'attach authorizer to multiple RestApi'(test: Test) {
    const stack = new Stack();

    const auth = new DummyAuthorizer(stack, 'myauthorizer', 'myauthorizer');

    const restApi1 = new RestApi(stack, 'restapi-1');
    const restApi2 = new RestApi(stack, 'restapi-2');

    restApi1.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM
    });

    test.throws(() => {
      restApi2.root.addMethod('ANY', undefined, {
        authorizer: auth,
        authorizationType: AuthorizationType.CUSTOM
      });
    }, /Already attached to RestApi/);

    test.done();
  },

  'authorizer not attached to any RestApi'(test: Test) {
    const stack = new Stack();

    const auth = new DummyAuthorizer(stack, 'myauthorizer', 'myauthorizer');

    test.throws(() => stack.resolve(auth.fetchRestApiId()), /not associated with a RestApi construct/);

    test.done();
  }
};

class DummyAuthorizer extends CustomAuthorizer {

  public readonly authorizerId: string;

  constructor(scope: Construct, id: string, authorizerId: string) {
    super(scope, id);
    this.authorizerId = authorizerId;
  }

  public fetchRestApiId(): string {
    return this.restApiId;
  }
}

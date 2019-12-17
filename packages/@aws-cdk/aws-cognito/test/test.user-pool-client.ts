import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cognito from '../lib';

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const pool = new cognito.UserPool(stack, 'Pool', { });

    // WHEN
    new cognito.UserPoolClient(stack, 'Client', {
      userPool: pool
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPoolClient', {
      UserPoolId: stack.resolve(pool.userPoolId)
    }));

    test.done();
  }
};

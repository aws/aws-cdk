import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { UserPool, UserPoolClient } from '../lib';

describe('User Pool Client', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool', { });

    // WHEN
    new UserPoolClient(stack, 'Client', {
      userPool: pool
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      UserPoolId: stack.resolve(pool.userPoolId)
    });
  });
});
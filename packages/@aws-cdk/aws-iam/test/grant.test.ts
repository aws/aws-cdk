import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as iam from '../lib';

describe('IAM grant', () => {
  test('Grant.drop() returns a no-op grant', () => {
    const stack = new Stack();
    const user = new iam.User(stack, 'poo');
    const grant = iam.Grant.drop(user, 'dropping me');

    expect(grant.success).toBeFalsy();
    expect(grant.principalStatement).toBeUndefined();
    expect(grant.resourceStatement).toBeUndefined();
  });
});

/* eslint-disable quote-props */
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { CognitoIdentityPoolAuthorizer } from '../lib';

describe('Cognito identity pool authorizer', () => {
  test('Should return role, roleArn, ID pool id', () => {
    const stack = new cdk.Stack();

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('cognito-identity.amazonaws.com'),
    });
    const authorizer = new CognitoIdentityPoolAuthorizer({
      identityPoolId: 'my-identity-pool-id',
      unauthenticatedRole: role,
    });
    expect(authorizer.role).toBe(role);
    expect(authorizer.guestRoleArn).toBe(role.roleArn);
    expect(authorizer.identityPoolId).toBe('my-identity-pool-id');
  });
});
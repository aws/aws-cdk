/* eslint-disable quote-props */
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { ThirdPartyAuthorizer } from '../lib';

describe('Third party authorizer', () => {
  test('Should return role', () => {
    const stack = new cdk.Stack();

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('cognito-identity.amazonaws.com'),
    });
    const authorizer = new ThirdPartyAuthorizer({
      role: role,
    });
    expect(authorizer.role).toBe(role);
  });
});
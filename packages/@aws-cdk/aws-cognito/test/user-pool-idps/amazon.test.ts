import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { UserPool, UserPoolIdentityProviderAmazon } from '../../lib';

describe('UserPoolIdentityProvider', () => {
  describe('amazon', () => {
    test('defaults', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderAmazon(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'amzn-client-id',
        clientSecret: 'amzn-client-secret',
      });

      expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'LoginWithAmazon',
        ProviderType: 'LoginWithAmazon',
        ProviderDetails: {
          client_id: 'amzn-client-id',
          client_secret: 'amzn-client-secret',
          authorize_scopes: 'profile',
        },
      });
    });

    test('scopes', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderAmazon(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'amzn-client-id',
        clientSecret: 'amzn-client-secret',
        scopes: [ 'scope1', 'scope2' ],
      });

      expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'LoginWithAmazon',
        ProviderType: 'LoginWithAmazon',
        ProviderDetails: {
          client_id: 'amzn-client-id',
          client_secret: 'amzn-client-secret',
          authorize_scopes: 'scope1 scope2',
        },
      });
    });

    test('registered with user pool', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      const provider = new UserPoolIdentityProviderAmazon(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'amzn-client-id',
        clientSecret: 'amzn-client-secret',
      });

      // THEN
      expect(pool.identityProviders).toContain(provider);
    });
  });
});
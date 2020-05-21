import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { UserPool, UserPoolIdentityProvider } from '../lib';

describe('UserPoolIdentityProvider', () => {
  describe('facebook', () => {
    test('defaults', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      UserPoolIdentityProvider.facebook(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'fb-client-id',
        clientSecret: 'fb-client-secret',
      });

      expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'Facebook',
        ProviderType: 'Facebook',
        ProviderDetails: {
          client_id: 'fb-client-id',
          client_secret: 'fb-client-secret',
          authorize_scopes: 'public_profile',
        },
      });
    });

    test('scopes & api_version', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      UserPoolIdentityProvider.facebook(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'fb-client-id',
        clientSecret: 'fb-client-secret',
        scopes: [ 'scope1', 'scope2' ],
        apiVersion: 'version1',
      });

      expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'Facebook',
        ProviderType: 'Facebook',
        ProviderDetails: {
          client_id: 'fb-client-id',
          client_secret: 'fb-client-secret',
          authorize_scopes: 'scope1,scope2',
          api_version: 'version1',
        },
      });
    });
  });

  describe('amazon', () => {
    test('defaults', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      UserPoolIdentityProvider.amazon(stack, 'userpoolidp', {
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
      UserPoolIdentityProvider.amazon(stack, 'userpoolidp', {
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
  });

  describe('apple', () => {
    test('defaults', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      UserPoolIdentityProvider.apple(stack, 'userpoolidp', {
        userPool: pool,
        keyId: 'apple-key-id',
        privateKey: 'apple-private-key',
        servicesId: 'apple-services-id',
        teamId: 'apple-team-id',
      });

      expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'SignInWithApple',
        ProviderType: 'SignInWithApple',
        ProviderDetails: {
          key_id: 'apple-key-id',
          private_key: 'apple-private-key',
          client_id: 'apple-services-id',
          team_id: 'apple-team-id',
          authorize_scopes: 'public_profile email',
        },
      });
    });

    test('scopes', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      UserPoolIdentityProvider.apple(stack, 'userpoolidp', {
        userPool: pool,
        keyId: 'apple-key-id',
        privateKey: 'apple-private-key',
        servicesId: 'apple-services-id',
        teamId: 'apple-team-id',
        scopes: [ 'scope1', 'scope2' ],
      });

      expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'SignInWithApple',
        ProviderType: 'SignInWithApple',
        ProviderDetails: {
          key_id: 'apple-key-id',
          private_key: 'apple-private-key',
          client_id: 'apple-services-id',
          team_id: 'apple-team-id',
          authorize_scopes: 'scope1 scope2',
        },
      });
    });
  });
});
import '@aws-cdk/assert-internal/jest';
import { Stack } from '@aws-cdk/core';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderFacebook } from '../../lib';

describe('UserPoolIdentityProvider', () => {
  describe('facebook', () => {
    test('defaults', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
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
      new UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'fb-client-id',
        clientSecret: 'fb-client-secret',
        scopes: ['scope1', 'scope2'],
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

    test('registered with user pool', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      const provider = new UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'fb-client-id',
        clientSecret: 'fb-client-secret',
      });

      // THEN
      expect(pool.identityProviders).toContain(provider);
    });

    test('attribute mapping', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'fb-client-id',
        clientSecret: 'fb-client-secret',
        attributeMapping: {
          givenName: ProviderAttribute.FACEBOOK_NAME,
          address: ProviderAttribute.other('fb-address'),
          custom: {
            customAttr1: ProviderAttribute.FACEBOOK_EMAIL,
            customAttr2: ProviderAttribute.other('fb-custom-attr'),
          },
        },
      });

      // THEN
      expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
        AttributeMapping: {
          given_name: 'name',
          address: 'fb-address',
          customAttr1: 'email',
          customAttr2: 'fb-custom-attr',
        },
      });
    });
  });
});
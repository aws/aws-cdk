import { Template } from '@aws-cdk/assertions';
import { SecretValue, Stack } from '@aws-cdk/core';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderGoogle } from '../../lib';

describe('UserPoolIdentityProvider', () => {
  describe('google', () => {
    test('defaults', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'google-client-id',
        clientSecretValue: SecretValue.unsafePlainText('google-client-secret'),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'Google',
        ProviderType: 'Google',
        ProviderDetails: {
          client_id: 'google-client-id',
          client_secret: 'google-client-secret',
          authorize_scopes: 'profile',
        },
      });
    });

    test('scopes', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'google-client-id',
        clientSecretValue: SecretValue.unsafePlainText('google-client-secret'),
        scopes: ['scope1', 'scope2'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'Google',
        ProviderType: 'Google',
        ProviderDetails: {
          client_id: 'google-client-id',
          client_secret: 'google-client-secret',
          authorize_scopes: 'scope1 scope2',
        },
      });
    });

    test('registered with user pool', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      const provider = new UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'google-client-id',
        clientSecretValue: SecretValue.unsafePlainText('google-client-secret'),
      });

      // THEN
      expect(pool.identityProviders).toContain(provider);
    });

    test('attribute mapping', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'google-client-id',
        clientSecretValue: SecretValue.unsafePlainText('google-client-secret'),
        attributeMapping: {
          givenName: ProviderAttribute.GOOGLE_NAME,
          address: ProviderAttribute.other('google-address'),
          custom: {
            customAttr1: ProviderAttribute.GOOGLE_EMAIL,
            customAttr2: ProviderAttribute.other('google-custom-attr'),
          },
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        AttributeMapping: {
          given_name: 'name',
          address: 'google-address',
          customAttr1: 'email',
          customAttr2: 'google-custom-attr',
        },
      });
    });
  });
});

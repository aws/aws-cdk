import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Template } from '../../../assertions';
import { SecretValue, Stack } from '../../../core';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderOidc } from '../../lib';

describe('UserPoolIdentityProvider', () => {
  describe('oidc', () => {
    test('defaults', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'userpoolidp',
        ProviderType: 'OIDC',
        ProviderDetails: {
          client_id: 'client-id',
          client_secret: 'client-secret',
          authorize_scopes: 'openid',
          attributes_request_method: 'GET',
          oidc_issuer: 'https://my-issuer-url.com',
        },
      });
    });

    test('client secret from clientSecretValue', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.secretsManager('my-oidc-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderDetails: {
          client_id: 'client-id',
          client_secret: '{{resolve:secretsmanager:my-oidc-secret:SecretString:::}}',
        },
      });
    });

    testDeprecated('client secret from deprecated clientSecret', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        issuerUrl: 'https://my-issuer-url.com',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderDetails: {
          client_id: 'client-id',
          client_secret: 'client-secret',
        },
      });
    });

    testDeprecated('fails when both clientSecret and clientSecretValue are configured', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // THEN
      expect(() => new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      })).toThrow('exactly one of "clientSecret" or "clientSecretValue" must be configured, specify "clientSecretValue"');
    });

    test('fails when neither clientSecret nor clientSecretValue is configured', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // THEN
      expect(() => new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        issuerUrl: 'https://my-issuer-url.com',
      })).toThrow('exactly one of "clientSecret" or "clientSecretValue" must be configured, specify "clientSecretValue"');
    });

    test('endpoints', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
        endpoints: {
          authorization: 'https://my-issuer-url.com/authorize',
          token: 'https://my-issuer-url.com/token',
          userInfo: 'https://my-issuer-url.com/userinfo',
          jwksUri: 'https://my-issuer-url.com/jwks',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderDetails: {
          client_id: 'client-id',
          client_secret: 'client-secret',
          authorize_scopes: 'openid',
          attributes_request_method: 'GET',
          oidc_issuer: 'https://my-issuer-url.com',
          authorize_url: 'https://my-issuer-url.com/authorize',
          token_url: 'https://my-issuer-url.com/token',
          attributes_url: 'https://my-issuer-url.com/userinfo',
          jwks_uri: 'https://my-issuer-url.com/jwks',
        },
      });
    });

    test('scopes', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
        scopes: ['scope1', 'scope2'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderDetails: {
          client_id: 'client-id',
          client_secret: 'client-secret',
          authorize_scopes: 'scope1 scope2',
          attributes_request_method: 'GET',
          oidc_issuer: 'https://my-issuer-url.com',
        },
      });
    });

    test('registered with user pool', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      const provider = new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      });

      // THEN
      expect(pool.identityProviders).toContain(provider);
    });

    test('attribute mapping', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
        attributeMapping: {
          familyName: ProviderAttribute.other('family_name'),
          givenName: ProviderAttribute.other('given_name'),
          custom: {
            customAttr1: ProviderAttribute.other('email'),
            customAttr2: ProviderAttribute.other('sub'),
          },
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        AttributeMapping: {
          family_name: 'family_name',
          given_name: 'given_name',
          customAttr1: 'email',
          customAttr2: 'sub',
        },
      });
    });

    test('with provider name', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        name: 'my-provider',
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'my-provider',
      });
    });

    test('throws with invalid provider name', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // THEN
      expect(() => new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        name: 'xy',
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      })).toThrow(/Expected provider name to be between 3 and 32 characters/);
    });

    test('throws with provider name that doesn\'t match pattern', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');
      const name = ' thisisabadname';

      // THEN
      expect(() => new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        name,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      })).toThrow(`Expected provider name must match [^_\p{Z}][\p{L}\p{M}\p{S}\p{N}\p{P}][^_\p{Z}]+, received ${name}`);
    });

    test('generates a valid name when unique id is too short', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'xy', {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'xyoidc',
      });
    });

    test('generates a valid name when unique id is too long', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, `${'oidc'.repeat(10)}xyz`, {
        userPool: pool,
        clientId: 'client-id',
        clientSecretValue: SecretValue.unsafePlainText('client-secret'),
        issuerUrl: 'https://my-issuer-url.com',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'oidcoidcoidcoidccoidcoidcoidcxyz',
      });
    });
  });
});

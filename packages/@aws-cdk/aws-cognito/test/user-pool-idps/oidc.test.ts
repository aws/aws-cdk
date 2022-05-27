import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
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
        clientSecret: 'client-secret',
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

    test('endpoints', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
        userPool: pool,
        name: 'my-provider',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        issuerUrl: 'https://my-issuer-url.com',
        endpoints: {
          authorization: 'https://my-issuer-url.com/authorize',
          token: 'https://my-issuer-url.com/token',
          userInfo: 'https://my-issuer-url.com/userinfo',
          jwksUri: 'https://my-issuer-url.com/jwks',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'my-provider',
        ProviderType: 'OIDC',
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
        name: 'my-provider',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        issuerUrl: 'https://my-issuer-url.com',
        scopes: ['scope1', 'scope2'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'my-provider',
        ProviderType: 'OIDC',
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
        name: 'my-provider',
        clientId: 'client-id',
        clientSecret: 'client-secret',
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
        name: 'my-provider',
        clientId: 'client-id',
        clientSecret: 'client-secret',
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
  });
});

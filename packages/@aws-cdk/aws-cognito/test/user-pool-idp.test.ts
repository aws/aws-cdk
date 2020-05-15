import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { SocialIdentityProvider, UserPool, UserPoolIdentityProvider } from '../lib';

describe('UserPoolIdentityProvider', () => {
  test('facebook integration - defaults', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.facebook({
        clientId: 'fb-client-id',
        clientSecret: 'fb-client-secret',
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
      ProviderType: 'Facebook',
      ProviderDetails: {
        client_id: 'fb-client-id',
        client_secret: 'fb-client-secret',
        authorize_scopes: 'public_profile',
      },
    });
  });

  test('facebook integration - authorize scopes', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.facebook({
        clientId: 'fb-client-id',
        clientSecret: 'fb-client-secret',
        scopes: [ 'scope1', 'scope2' ],
        apiVersion: 'version1',
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
      ProviderType: 'Facebook',
      ProviderDetails: {
        client_id: 'fb-client-id',
        client_secret: 'fb-client-secret',
        authorize_scopes: 'scope1,scope2',
        api_version: 'version1',
      },
    });
  });

  test('amazon integration - defaults', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.amazon({
        clientId: 'amzn-client-id',
        clientSecret: 'amzn-client-secret',
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
      ProviderType: 'LoginWithAmazon',
      ProviderDetails: {
        client_id: 'amzn-client-id',
        client_secret: 'amzn-client-secret',
        authorize_scopes: 'profile',
      },
    });
  });

  test('amazon integration - scopes', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.amazon({
        clientId: 'amzn-client-id',
        clientSecret: 'amzn-client-secret',
        scopes: [ 'scope1', 'scope2' ],
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
      ProviderType: 'LoginWithAmazon',
      ProviderDetails: {
        client_id: 'amzn-client-id',
        client_secret: 'amzn-client-secret',
        authorize_scopes: 'scope1 scope2',
      },
    });
  });

  test('google integration - defaults', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.google({
        clientId: 'goog-client-id',
        clientSecret: 'goog-client-secret',
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
      ProviderType: 'Google',
      ProviderDetails: {
        client_id: 'goog-client-id',
        client_secret: 'goog-client-secret',
        authorize_scopes: 'profile email openid',
      },
    });
  });

  test('google integration - scopes', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.google({
        clientId: 'goog-client-id',
        clientSecret: 'goog-client-secret',
        scopes: [ 'scope1', 'scope2' ],
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
      ProviderType: 'Google',
      ProviderDetails: {
        client_id: 'goog-client-id',
        client_secret: 'goog-client-secret',
        authorize_scopes: 'scope1 scope2',
      },
    });
  });

  test('apple integration - defaults', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.apple({
        keyId: 'apple-key-id',
        privateKey: 'apple-private-key',
        servicesId: 'apple-services-id',
        teamId: 'apple-team-id',
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
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

  test('apple integration - scopes', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'userpool');

    // WHEN
    new UserPoolIdentityProvider(stack, 'userpoolidp', {
      userPool: pool,
      userPoolIdentityProviderName: 'userpoolidp',
      socialIdentity: SocialIdentityProvider.apple({
        keyId: 'apple-key-id',
        privateKey: 'apple-private-key',
        servicesId: 'apple-services-id',
        teamId: 'apple-team-id',
        scopes: [ 'scope1', 'scope2' ],
      }),
    });

    expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
      ProviderName: 'userpoolidp',
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
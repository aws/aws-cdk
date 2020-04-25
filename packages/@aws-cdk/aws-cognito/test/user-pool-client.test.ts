import { ABSENT } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { OAuthScope, StandardAttribute, UserPool, UserPoolClient } from '../lib';

describe('User Pool Client', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    new UserPoolClient(stack, 'Client', {
      userPool: pool,
    });

    // THEN
    expect(stack).toHaveResource('AWS::Cognito::UserPoolClient', {
      UserPoolId: stack.resolve(pool.userPoolId),
    });
  });

  test('client name', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    const client1 = new UserPoolClient(stack, 'Client1', {
      userPool: pool,
      userPoolClientName: 'myclient',
    });
    const client2 = new UserPoolClient(stack, 'Client2', {
      userPool: pool,
    });

    // THEN
    expect(client1.userPoolClientName).toEqual('myclient');
    expect(() => client2.userPoolClientName).toThrow(/available only if specified on the UserPoolClient during initialization/);
  });

  test('import', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const client = UserPoolClient.fromUserPoolClientId(stack, 'Client', 'client-id-1');

    // THEN
    expect(client.userPoolClientId).toEqual('client-id-1');
  });

  test('ExplicitAuthFlows is absent by default', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client');

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ExplicitAuthFlows: ABSENT,
    });
  });

  test('ExplicitAuthFlows are correctly named', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client', {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        refreshToken: true,
        userPassword: true,
        userSrp: true,
      },
    });

    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ExplicitAuthFlows: [
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_ADMIN_USER_PASSWORD_AUTH',
        'ALLOW_CUSTOM_AUTH',
        'ALLOW_USER_SRP_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
      ],
    });
  });

  test('AllowedOAuthFlows is absent by default', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client');

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: ABSENT,
      // AllowedOAuthFlowsUserPoolClient: ABSENT,
    });
  });

  test('AllowedOAuthFlows are correctly named', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client1', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        callbackUrls: [ 'redirect-url' ],
        scopes: [ OAuthScope.PHONE ],
      },
    });
    pool.addClient('Client2', {
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        callbackUrls: [ 'redirect-url' ],
        scopes: [ OAuthScope.PHONE ],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: [ 'implicit', 'code' ],
      AllowedOAuthFlowsUserPoolClient: true,
    });

    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: [ 'client_credentials' ],
      AllowedOAuthFlowsUserPoolClient: true,
    });
  });

  test('fails when callbackUrls are not specified for codeGrant or implicitGrant', () => {
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    expect(() => pool.addClient('Client1', {
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [ OAuthScope.PHONE ],
      },
    })).toThrow(/callbackUrl must be specified/);

    expect(() => pool.addClient('Client2', {
      oAuth: {
        flows: { implicitCodeGrant: true },
        scopes: [ OAuthScope.PHONE ],
      },
    })).toThrow(/callbackUrl must be specified/);

    expect(() => pool.addClient('Client3', {
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [ OAuthScope.PHONE ],
      },
    })).not.toThrow();
  });

  test('fails when clientCredentials OAuth flow is selected along with codeGrant or implicitGrant', () => {
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    expect(() => pool.addClient('Client1', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          clientCredentials: true,
        },
        callbackUrls: [ 'redirect-url' ],
        scopes: [ OAuthScope.PHONE ],
      },
    })).toThrow(/clientCredentials OAuth flow cannot be selected/);

    expect(() => pool.addClient('Client2', {
      oAuth: {
        flows: {
          implicitCodeGrant: true,
          clientCredentials: true,
        },
        callbackUrls: [ 'redirect-url' ],
        scopes: [ OAuthScope.PHONE ],
      },
    })).toThrow(/clientCredentials OAuth flow cannot be selected/);
  });

  test('OAuth scopes', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client', {
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [
          OAuthScope.PHONE,
          OAuthScope.EMAIL,
          OAuthScope.OPENID,
          OAuthScope.PROFILE,
          OAuthScope.COGNITO_ADMIN,
          OAuthScope.custom('my-resource-server/my-own-scope'),
        ],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      AllowedOAuthScopes: [
        'phone',
        'email',
        'openid',
        'profile',
        'aws.cognito.signin.user.admin',
        'my-resource-server/my-own-scope',
      ],
    });
  });

  test('OAuthScope - openid is included when email or phone is specified', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client1', {
      userPoolClientName: 'Client1',
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [ OAuthScope.PHONE ],
      },
    });
    pool.addClient('Client2', {
      userPoolClientName: 'Client2',
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [ OAuthScope.EMAIL ],
      },
    });
    pool.addClient('Client3', {
      userPoolClientName: 'Client3',
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [ OAuthScope.PROFILE ],
      },
    });
    pool.addClient('Client4', {
      userPoolClientName: 'Client4',
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [ OAuthScope.COGNITO_ADMIN ],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client1',
      AllowedOAuthScopes: [ 'phone', 'openid' ],
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client2',
      AllowedOAuthScopes: [ 'email', 'openid' ],
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client3',
      AllowedOAuthScopes: [ 'profile', 'openid' ],
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client4',
      AllowedOAuthScopes: [ 'aws.cognito.signin.user.admin' ],
    });
  });

  test('read/write attributes defaults are set as expected', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client1', {
      userPoolClientName: 'Client1',
    });
    pool.addClient('Client2', {
      userPoolClientName: 'Client2',
      readAttributes: undefined,
    });
    pool.addClient('Client3', {
      userPoolClientName: 'Client3',
      writeAttributes: undefined,
    });
    pool.addClient('Client4', {
      userPoolClientName: 'Client4',
      readAttributes: undefined,
      writeAttributes: undefined,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client1',
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client2',
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client3',
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client4',
    });
  });

  test('read/write attributes are set as expected', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('None', {
      userPoolClientName: 'None',
    });
    pool.addClient('CustomOnly', {
      userPoolClientName: 'CustomOnly',
      readAttributes: {
        custom: ['read1', 'custom:read2'],
      },
      writeAttributes: {
        custom: ['write1'],
      },
    });
    pool.addClient('StandardOnly', {
      userPoolClientName: 'StandardOnly',
      readAttributes: {
        standard: [StandardAttribute.ADDRESS, StandardAttribute.EMAIL],
      },
      writeAttributes: {
        standard: [StandardAttribute.EMAIL],
      },
    });
    pool.addClient('AllAttributes', {
      userPoolClientName: 'AllAttributes',
      readAttributes: {
        custom: ['read1'],
        standard: [StandardAttribute.EMAIL],
      },
      writeAttributes: {
        custom: ['write1', 'custom:write2'],
        standard: [StandardAttribute.ADDRESS, StandardAttribute.EMAIL],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'None',
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'CustomOnly',
      WriteAttributes: ['custom:write1'],
      ReadAttributes: ['custom:read1', 'custom:read2'],
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'StandardOnly',
      WriteAttributes: ['email'],
      ReadAttributes: ['address', 'email'],
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPoolClient', {
      ClientName: 'AllAttributes',
      WriteAttributes: ['address', 'email', 'custom:write1', 'custom:write2'],
      ReadAttributes: ['email', 'custom:read1'],
    });
  });
});
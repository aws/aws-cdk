import { Match, Template } from '@aws-cdk/assertions';
import { Stack, Duration } from '@aws-cdk/core';
import { OAuthScope, ResourceServerScope, UserPool, UserPoolClient, UserPoolClientIdentityProvider, UserPoolIdentityProvider, ClientAttributes } from '../lib';

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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      UserPoolId: stack.resolve(pool.userPoolId),
      AllowedOAuthFlows: ['implicit', 'code'],
      AllowedOAuthScopes: ['profile', 'phone', 'email', 'openid', 'aws.cognito.signin.user.admin'],
      CallbackURLs: ['https://example.com'],
      SupportedIdentityProviders: ['COGNITO'],
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

  describe('Client with secret', () => {

    test('generate secret', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      const clientWithSecret = new UserPoolClient(stack, 'clientWithSecret', {
        userPool: pool,
        generateSecret: true,
      });

      // THEN
      expect(clientWithSecret.userPoolClientSecret).toBeDefined();

      // Make sure getter returns the same secret regardless if it's called one or many times
      expect(clientWithSecret.userPoolClientSecret).toEqual(clientWithSecret.userPoolClientSecret);

      // Make sure the generated template has correct resources
      Template.fromStack(stack).hasResourceProperties('Custom::DescribeCognitoUserPoolClient', {
        ServiceToken: {
          'Fn::GetAtt': [
            'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
            'Arn',
          ],
        },
        Create: {
          'Fn::Join': [
            '',
            [
              '{"region":"',
              {
                Ref: 'AWS::Region',
              },
              '","service":"CognitoIdentityServiceProvider","action":"describeUserPoolClient","parameters":{"UserPoolId":"',
              {
                Ref: 'PoolD3F588B8',
              },
              '","ClientId":"',
              {
                Ref: 'clientWithSecretD25031A8',
              },
              '"},"physicalResourceId":{"id":"',
              {
                Ref: 'clientWithSecretD25031A8',
              },
              '"}}',
            ],
          ],
        },
        Update: {
          'Fn::Join': [
            '',
            [
              '{"region":"',
              {
                Ref: 'AWS::Region',
              },
              '","service":"CognitoIdentityServiceProvider","action":"describeUserPoolClient","parameters":{"UserPoolId":"',
              {
                Ref: 'PoolD3F588B8',
              },
              '","ClientId":"',
              {
                Ref: 'clientWithSecretD25031A8',
              },
              '"},"physicalResourceId":{"id":"',
              {
                Ref: 'clientWithSecretD25031A8',
              },
              '"}}',
            ],
          ],
        },
        InstallLatestAwsSdk: false,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Action: 'cognito-idp:DescribeUserPoolClient',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'PoolD3F588B8',
                'Arn',
              ],
            },
          }],
          Version: '2012-10-17',
        },
        PolicyName: 'clientWithSecretDescribeCognitoUserPoolClientCustomResourcePolicyCDE4AB00',
        Roles: [{ Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2' }],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          }],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [{
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        }],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Role: {
          'Fn::GetAtt': [
            'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
            'Arn',
          ],
        },
        Handler: 'index.handler',
        Timeout: 120,
      });
    });

    test('explicitly disable secret generation', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      const clientWithoutSecret = new UserPoolClient(stack, 'clientWithoutSecret1', {
        userPool: pool,
        generateSecret: false,
      });

      // THEN
      expect(() => clientWithoutSecret.userPoolClientSecret).toThrow(/userPoolClientSecret is available only if generateSecret is set to true./);

      // Make sure the generated template does not create resources
      expect(Template.fromStack(stack).findResources('Custom::DescribeCognitoUserPoolClient')).toEqual({});
      expect(Template.fromStack(stack).findResources('AWS::IAM::Policy')).toEqual({});
      expect(Template.fromStack(stack).findResources('AWS::IAM::Role')).toEqual({});
      expect(Template.fromStack(stack).findResources('AWS::Lambda::Function')).toEqual({});
    });

    test('lacking secret configuration implicitly disables it', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      const clientWithoutSecret = new UserPoolClient(stack, 'clientWithoutSecret2', {
        userPool: pool,
        generateSecret: undefined,
      });

      // THEN
      expect(() => clientWithoutSecret.userPoolClientSecret).toThrow(/userPoolClientSecret is available only if generateSecret is set to true./);

      // Make sure the generated template does not create resources
      expect(Template.fromStack(stack).findResources('Custom::DescribeCognitoUserPoolClient')).toEqual({});
      expect(Template.fromStack(stack).findResources('AWS::IAM::Policy')).toEqual({});
      expect(Template.fromStack(stack).findResources('AWS::IAM::Role')).toEqual({});
      expect(Template.fromStack(stack).findResources('AWS::Lambda::Function')).toEqual({});
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ExplicitAuthFlows: Match.absent(),
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
        userPassword: true,
        userSrp: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ExplicitAuthFlows: [
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_ADMIN_USER_PASSWORD_AUTH',
        'ALLOW_CUSTOM_AUTH',
        'ALLOW_USER_SRP_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
      ],
    });
  });

  test('ExplicitAuthFlows makes only refreshToken true when all options are false', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client', {
      authFlows: {
        adminUserPassword: false,
        custom: false,
        userPassword: false,
        userSrp: false,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ExplicitAuthFlows: [
        'ALLOW_REFRESH_TOKEN_AUTH',
      ],
    });
  });

  test('ExplicitAuthFlows is absent when authFlows is empty', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client', {
      authFlows: {},
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ExplicitAuthFlows: Match.absent(),
    });
  });

  test('ExplicitAuthFlows makes refreshToken true by default', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client', {
      authFlows: {
        userSrp: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ExplicitAuthFlows: [
        'ALLOW_USER_SRP_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
      ],
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
        scopes: [OAuthScope.PHONE],
      },
    });
    pool.addClient('Client2', {
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: [OAuthScope.PHONE],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: ['implicit', 'code'],
      AllowedOAuthFlowsUserPoolClient: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: ['client_credentials'],
      AllowedOAuthFlowsUserPoolClient: true,
    });
  });

  test('callbackUrl defaults are correctly chosen', () => {
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    pool.addClient('Client1', {
      oAuth: {
        flows: {
          clientCredentials: true,
        },
      },
    });

    pool.addClient('Client2', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
      },
    });

    pool.addClient('Client3', {
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: ['client_credentials'],
      CallbackURLs: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: ['implicit'],
      CallbackURLs: ['https://example.com'],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      AllowedOAuthFlows: ['code'],
      CallbackURLs: ['https://example.com'],
    });
  });

  test('callbackUrls are not rendered if OAuth is disabled ', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    new UserPoolClient(stack, 'PoolClient', {
      userPool: pool,
      disableOAuth: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      CallbackURLs: Match.absent(),
    });
  });

  test('fails when callbackUrls is empty for codeGrant or implicitGrant', () => {
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    expect(() => pool.addClient('Client1', {
      oAuth: {
        flows: { implicitCodeGrant: true },
        callbackUrls: [],
      },
    })).toThrow(/callbackUrl must not be empty/);

    expect(() => pool.addClient('Client3', {
      oAuth: {
        flows: { authorizationCodeGrant: true },
        callbackUrls: [],
      },
    })).toThrow(/callbackUrl must not be empty/);

    expect(() => pool.addClient('Client4', {
      oAuth: {
        flows: { clientCredentials: true },
        callbackUrls: [],
      },
    })).not.toThrow();
  });

  test('logoutUrls can be set', () => {
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    pool.addClient('Client', {
      oAuth: {
        logoutUrls: ['https://example.com'],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      LogoutURLs: ['https://example.com'],
    });
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
        scopes: [OAuthScope.PHONE],
      },
    })).toThrow(/clientCredentials OAuth flow cannot be selected/);

    expect(() => pool.addClient('Client2', {
      oAuth: {
        flows: {
          implicitCodeGrant: true,
          clientCredentials: true,
        },
        scopes: [OAuthScope.PHONE],
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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
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

  test('OAuth scopes - resource server', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');
    const scope = new ResourceServerScope({ scopeName: 'scope-name', scopeDescription: 'scope-desc' });
    const resourceServer = pool.addResourceServer('ResourceServer', {
      identifier: 'resource-server',
      scopes: [scope],
    });

    // WHEN
    pool.addClient('Client', {
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [
          OAuthScope.resourceServer(resourceServer, scope),
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      AllowedOAuthScopes: [
        {
          'Fn::Join': [
            '', [
              stack.resolve(resourceServer.userPoolResourceServerId),
              '/scope-name',
            ],
          ],
        },
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
        scopes: [OAuthScope.PHONE],
      },
    });
    pool.addClient('Client2', {
      userPoolClientName: 'Client2',
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [OAuthScope.EMAIL],
      },
    });
    pool.addClient('Client3', {
      userPoolClientName: 'Client3',
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [OAuthScope.PROFILE],
      },
    });
    pool.addClient('Client4', {
      userPoolClientName: 'Client4',
      oAuth: {
        flows: { clientCredentials: true },
        scopes: [OAuthScope.COGNITO_ADMIN],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client1',
      AllowedOAuthScopes: ['phone', 'openid'],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client2',
      AllowedOAuthScopes: ['email', 'openid'],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client3',
      AllowedOAuthScopes: ['profile', 'openid'],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'Client4',
      AllowedOAuthScopes: ['aws.cognito.signin.user.admin'],
    });
  });

  test('enable user existence errors prevention', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    new UserPoolClient(stack, 'Client', {
      userPool: pool,
      preventUserExistenceErrors: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      UserPoolId: stack.resolve(pool.userPoolId),
      PreventUserExistenceErrors: 'ENABLED',
    });
  });

  test('disable user existence errors prevention', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    new UserPoolClient(stack, 'Client', {
      userPool: pool,
      preventUserExistenceErrors: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      UserPoolId: stack.resolve(pool.userPoolId),
      PreventUserExistenceErrors: 'LEGACY',
    });
  });

  test('user existence errors prevention is absent by default', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    new UserPoolClient(stack, 'Client', {
      userPool: pool,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      UserPoolId: stack.resolve(pool.userPoolId),
      PreventUserExistenceErrors: Match.absent(),
    });
  });

  test('default supportedIdentityProviders', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    const idp = UserPoolIdentityProvider.fromProviderName(stack, 'imported', 'userpool-idp');
    pool.registerIdentityProvider(idp);

    // WHEN
    new UserPoolClient(stack, 'Client', {
      userPool: pool,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      SupportedIdentityProviders: [
        'userpool-idp',
        'COGNITO',
      ],
    });
  });

  test('supportedIdentityProviders', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('AllEnabled', {
      userPoolClientName: 'AllEnabled',
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
        UserPoolClientIdentityProvider.FACEBOOK,
        UserPoolClientIdentityProvider.AMAZON,
        UserPoolClientIdentityProvider.GOOGLE,
        UserPoolClientIdentityProvider.APPLE,
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'AllEnabled',
      SupportedIdentityProviders: ['COGNITO', 'Facebook', 'LoginWithAmazon', 'Google', 'SignInWithApple'],
    });
  });

  test('disableOAuth', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('OAuthDisabled', {
      userPoolClientName: 'OAuthDisabled',
      disableOAuth: true,
    });
    pool.addClient('OAuthEnabled', {
      userPoolClientName: 'OAuthEnabled',
      disableOAuth: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'OAuthDisabled',
      AllowedOAuthFlows: Match.absent(),
      AllowedOAuthScopes: Match.absent(),
      AllowedOAuthFlowsUserPoolClient: false,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'OAuthEnabled',
      AllowedOAuthFlows: ['implicit', 'code'],
      AllowedOAuthScopes: ['profile', 'phone', 'email', 'openid', 'aws.cognito.signin.user.admin'],
      AllowedOAuthFlowsUserPoolClient: true,
    });
  });

  test('fails when oAuth is specified but is disableOAuth is set', () => {
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    expect(() => pool.addClient('Client', {
      disableOAuth: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
      },
    })).toThrow(/disableOAuth is set/);
  });

  test('EnableTokenRevocation is absent by default', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      EnableTokenRevocation: Match.absent(),
    });
  });

  test('enableTokenRevocation in addClient', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    pool.addClient('Client', {
      enableTokenRevocation: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      EnableTokenRevocation: true,
    });
  });

  test('enableTokenRevocation in UserPoolClient', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    new UserPoolClient(stack, 'Client1', {
      userPool: pool,
      enableTokenRevocation: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      EnableTokenRevocation: true,
    });
  });

  describe('auth session validity', () => {
    test('default', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        authSessionValidity: Duration.minutes(3),
      });
      pool.addClient('Client2', {
        userPoolClientName: 'Client2',
        authSessionValidity: Duration.minutes(9),
      });
      pool.addClient('Client3', {
        userPoolClientName: 'Client3',
        authSessionValidity: Duration.minutes(15),
      });
      pool.addClient('Client5', {
        userPoolClientName: 'Client4',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        AuthSessionValidity: 3,
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client2',
        AuthSessionValidity: 9,
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client3',
        AuthSessionValidity: 15,
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client4',
      });
    });

    test.each([
      Duration.minutes(0),
      Duration.minutes(1),
      Duration.minutes(3).minus(Duration.minutes(1)),
      Duration.minutes(15).plus(Duration.minutes(1)),
      Duration.minutes(100),
    ])('validates authSessionValidity is a duration between 3 and 15 minutes', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');
      expect(() => {
        pool.addClient('Client1', {
          userPoolClientName: 'Client1',
          authSessionValidity: validity,
        });
      }).toThrow(`authSessionValidity: Must be a duration between 3 minutes and 15 minutes (inclusive); received ${validity.toHumanString()}.`);
    });

    test.each([
      Duration.minutes(3),
      Duration.minutes(9),
      Duration.minutes(15),
    ])('validates authSessionValidity is a duration between 3 and 15 minutes (valid)', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        authSessionValidity: validity,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        AuthSessionValidity: validity.toMinutes(),
      });
    });
  });

  describe('token validity', () => {
    test('default', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        accessTokenValidity: Duration.minutes(60),
        idTokenValidity: Duration.minutes(60),
        refreshTokenValidity: Duration.days(30),
      });
      pool.addClient('Client2', {
        userPoolClientName: 'Client2',
        accessTokenValidity: Duration.minutes(60),
      });
      pool.addClient('Client3', {
        userPoolClientName: 'Client3',
        idTokenValidity: Duration.minutes(60),
      });
      pool.addClient('Client4', {
        userPoolClientName: 'Client4',
        refreshTokenValidity: Duration.days(30),
      });
      pool.addClient('Client5', {
        userPoolClientName: 'Client5',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        AccessTokenValidity: 60,
        IdTokenValidity: 60,
        RefreshTokenValidity: 43200,
        TokenValidityUnits: {
          AccessToken: 'minutes',
          IdToken: 'minutes',
          RefreshToken: 'minutes',
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client2',
        AccessTokenValidity: 60,
        IdTokenValidity: Match.absent(),
        RefreshTokenValidity: Match.absent(),
        TokenValidityUnits: {
          AccessToken: 'minutes',
          IdToken: Match.absent(),
          RefreshToken: Match.absent(),
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client3',
        AccessTokenValidity: Match.absent(),
        IdTokenValidity: 60,
        RefreshTokenValidity: Match.absent(),
        TokenValidityUnits: {
          AccessToken: Match.absent(),
          IdToken: 'minutes',
          RefreshToken: Match.absent(),
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client4',
        AccessTokenValidity: Match.absent(),
        IdTokenValidity: Match.absent(),
        RefreshTokenValidity: 43200,
        TokenValidityUnits: {
          AccessToken: Match.absent(),
          IdToken: Match.absent(),
          RefreshToken: 'minutes',
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client5',
        TokenValidityUnits: Match.absent(),
        IdTokenValidity: Match.absent(),
        RefreshTokenValidity: Match.absent(),
        AccessTokenValidity: Match.absent(),
      });
    });

    test.each([
      Duration.minutes(0),
      Duration.minutes(4),
      Duration.days(1).plus(Duration.minutes(1)),
      Duration.days(2),
    ])('validates accessTokenValidity is a duration between 5 minutes and 1 day', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');
      expect(() => {
        pool.addClient('Client1', {
          userPoolClientName: 'Client1',
          accessTokenValidity: validity,
        });
      }).toThrow(`accessTokenValidity: Must be a duration between 5 minutes and 1 day (inclusive); received ${validity.toHumanString()}.`);
    });

    test.each([
      Duration.minutes(0),
      Duration.minutes(4),
      Duration.days(1).plus(Duration.minutes(1)),
      Duration.days(2),
    ])('validates idTokenValidity is a duration between 5 minutes and 1 day', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');
      expect(() => {
        pool.addClient('Client1', {
          userPoolClientName: 'Client1',
          idTokenValidity: validity,
        });
      }).toThrow(`idTokenValidity: Must be a duration between 5 minutes and 1 day (inclusive); received ${validity.toHumanString()}.`);
    });

    test.each([
      Duration.hours(1).plus(Duration.minutes(1)),
      Duration.hours(12),
      Duration.days(1),
    ])('validates accessTokenValidity is not greater than refresh token expiration', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');
      expect(() => {
        pool.addClient('Client1', {
          userPoolClientName: 'Client1',
          accessTokenValidity: validity,
          refreshTokenValidity: Duration.hours(1),
        });
      }).toThrow(`accessTokenValidity: Must be a duration between 5 minutes and 1 hour (inclusive); received ${validity.toHumanString()}.`);
    });

    test.each([
      Duration.hours(1).plus(Duration.minutes(1)),
      Duration.hours(12),
      Duration.days(1),
    ])('validates idTokenValidity is not greater than refresh token expiration', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');
      expect(() => {
        pool.addClient('Client1', {
          userPoolClientName: 'Client1',
          idTokenValidity: validity,
          refreshTokenValidity: Duration.hours(1),
        });
      }).toThrow(`idTokenValidity: Must be a duration between 5 minutes and 1 hour (inclusive); received ${validity.toHumanString()}.`);
    });

    test.each([
      Duration.minutes(0),
      Duration.minutes(59),
      Duration.days(10 * 365).plus(Duration.minutes(1)),
      Duration.days(10 * 365 + 1),
    ])('validates refreshTokenValidity is a duration between 1 hour and 10 years', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');
      expect(() => {
        pool.addClient('Client1', {
          userPoolClientName: 'Client1',
          refreshTokenValidity: validity,
        });
      }).toThrow(`refreshTokenValidity: Must be a duration between 1 hour and 3650 days (inclusive); received ${validity.toHumanString()}.`);
    });

    test.each([
      Duration.minutes(5),
      Duration.minutes(60),
      Duration.days(1),
    ])('validates accessTokenValidity is a duration between 5 minutes and 1 day (valid)', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        accessTokenValidity: validity,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        AccessTokenValidity: validity.toMinutes(),
        TokenValidityUnits: {
          AccessToken: 'minutes',
        },
      });
    });

    test.each([
      Duration.minutes(5),
      Duration.minutes(60),
      Duration.days(1),
    ])('validates idTokenValidity is a duration between 5 minutes and 1 day (valid)', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        idTokenValidity: validity,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        IdTokenValidity: validity.toMinutes(),
        TokenValidityUnits: {
          IdToken: 'minutes',
        },
      });
    });

    test.each([
      Duration.minutes(60),
      Duration.minutes(120),
      Duration.days(365),
      Duration.days(10 * 365),
    ])('validates refreshTokenValidity is a duration between 1 hour and 10 years (valid)', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        refreshTokenValidity: validity,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        RefreshTokenValidity: validity.toMinutes(),
        TokenValidityUnits: {
          RefreshToken: 'minutes',
        },
      });
    });

    test.each([
      Duration.minutes(5),
      Duration.minutes(60),
      Duration.hours(1),
    ])('validates accessTokenValidity is not greater than refresh token expiration (valid)', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        accessTokenValidity: validity,
        refreshTokenValidity: Duration.hours(1),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        AccessTokenValidity: validity.toMinutes(),
        TokenValidityUnits: {
          AccessToken: 'minutes',
        },
      });
    });

    test.each([
      Duration.minutes(5),
      Duration.minutes(60),
      Duration.hours(1),
    ])('validates idTokenValidity is not greater than refresh token expiration (valid)', (validity) => {
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client1', {
        userPoolClientName: 'Client1',
        idTokenValidity: validity,
        refreshTokenValidity: Duration.hours(1),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ClientName: 'Client1',
        IdTokenValidity: validity.toMinutes(),
        TokenValidityUnits: {
          IdToken: 'minutes',
        },
      });
    });
  });

  describe('read and write attributes', () => {
    test('undefined by default', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');

      // WHEN
      pool.addClient('Client', {});

      // EXPECT
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ReadAttributes: Match.absent(),
        WriteAttributes: Match.absent(),
      });
    });

    test('set attributes', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'Pool');
      const writeAttributes = (new ClientAttributes()).withCustomAttributes('my_first').withStandardAttributes({ givenName: true, familyName: true });
      const readAttributes = (new ClientAttributes()).withStandardAttributes({
        address: true,
        birthdate: true,
        email: true,
        emailVerified: true,
        familyName: true,
        fullname: true,
        gender: true,
        givenName: true,
        lastUpdateTime: true,
        locale: true,
        middleName: true,
        nickname: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        preferredUsername: true,
        profilePage: true,
        profilePicture: true,
        timezone: true,
        website: true,
      });

      // WHEN
      pool.addClient('Client', {
        readAttributes,
        writeAttributes,
      });

      // EXPECT
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
        ReadAttributes: Match.arrayWith(['address', 'birthdate', 'email', 'email_verified', 'family_name', 'gender',
          'given_name', 'locale', 'middle_name', 'name', 'nickname', 'phone_number', 'phone_number_verified', 'picture',
          'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo']),
        WriteAttributes: Match.arrayWith(['custom:my_first', 'family_name', 'given_name']),
      });
    });
  });
});

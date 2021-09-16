import { Template } from '@aws-cdk/assertions';
import {
  Role,
  ServicePrincipal,
  ArnPrincipal,
  AnyPrincipal,
  OpenIdConnectProvider,
  SamlProvider,
  SamlMetadataDocument,
  PolicyStatement,
  Effect,
  PolicyDocument,
} from '@aws-cdk/aws-iam';
import { Function } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { IdentityPool, AuthenticationProviderType, RoleMappingMatchType } from '../lib/identity-pool';
import { UserPool } from '../lib/user-pool';
import { UserPoolIdentityProvider } from '../lib/user-pool-idp';

describe('identity pool', () => {
  test('minimal setup', () => {
    const stack = new Stack();
    new IdentityPool(stack, 'TestIdentityPoolMinimal');
    const temp = Template.fromStack(stack);

    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      AllowUnauthenticatedIdentities: false,
    });

    temp.resourceCountIs('AWS::IAM::Role', 2);
    temp.resourceCountIs('AWS::IAM::Policy', 0);
    temp.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              'StringEquals': {
                'cognito-identity.amazonaws.com:aud': {
                  Ref: 'TestIdentityPoolMinimalCA44517F',
                },
              },
              'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'authenticated',
              },
            },
            Effect: 'Allow',
            Principal: {
              Federated: 'cognito-identity.amazonaws.com',
            },
          },
        ],
      },
    });

  });

  test('adding actions and resources to default roles', () => {
    const stack = new Stack();
    const identityPool = new IdentityPool(stack, 'TestIdentityPoolActions', {
      userPermissions: [{
        effect: Effect.ALLOW,
        actions: ['execute-api:*'],
        resources: ['*'],
      }],
      guestPermissions: [{
        effect: Effect.ALLOW,
        actions: ['execute-api:*'],
        resources: ['arn:aws:execute-api:us-east-1:*:my-api/prod'],
      }],
    });
    identityPool.addUserPermissions({
      effect: Effect.ALLOW,
      actions: ['dynamodb:*'],
      resources: ['*'],
    });
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::IAM::Role', 2);
    temp.resourceCountIs('AWS::IAM::Policy', 3);
    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      AllowUnauthenticatedIdentities: true,
    });
    temp.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'execute-api:*',
            Effect: 'Allow',
            Resource: 'arn:aws:execute-api:us-east-1:*:my-api/prod',
          },
        ],
      },
    });

    temp.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'execute-api:*',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });

    temp.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:*',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });

  test('changing assume action', () => {
    const stack = new Stack();
    new IdentityPool(stack, 'TestIdentityPoolActions', {
      assumeAction: 'sts:AssumeRole',
      userPermissions: [
        {
          effect: Effect.ALLOW,
          actions: ['execute-api:*'],
          resources: ['*'],
        },
      ],
    });
    const temp = Template.fromStack(stack);
    temp.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Condition: {
              'StringEquals': {
                'cognito-identity.amazonaws.com:aud': {
                  Ref: 'TestIdentityPoolActions02A84B9A',
                },
              },
              'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'authenticated',
              },
            },
            Effect: 'Allow',
            Principal: {
              Federated: 'cognito-identity.amazonaws.com',
            },
          },
        ],
      },
    });

    temp.resourceCountIs('AWS::IAM::Role', 2);

    temp.hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolActions02A84B9A',
      },
      Roles: {
        authenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolActionsTestIdentityPoolActionsAuthenticatedRoleC93FFB7C',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolActionsTestIdentityPoolActionsUnauthenticatedRoleE17FC01D',
            'Arn',
          ],
        },
      },
    });
  });

  test('from static', () => {
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'my-region',
        account: '1234567891011',
      },
    });
    expect(() => IdentityPool.fromIdentityPoolId(stack, 'idPoolIdError', 'idPool')).toThrowError('Invalid Identity Pool Id: Identity Pool Ids must follow the format <region>:<id>');
    expect(() => IdentityPool.fromIdentityPoolArn(stack, 'idPoolArnError', 'arn:aws:cognito-identity:my-region:1234567891011:identitypool\/your-region:idPool/')).toThrowError('Invalid Identity Pool Id: Region in Identity Pool Id must match stack region');
    const idPool = IdentityPool.fromIdentityPoolId(stack, 'staticIdPool', 'my-region:idPool');

    expect(idPool.identityPoolId).toEqual('my-region:idPool');
    expect(idPool.identityPoolArn).toMatch(/cognito-identity:my-region:1234567891011:identitypool\/my-region:idPool/);
  });

  test('user pools are properly configured', () => {
    const stack = new Stack();
    const poolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'poolProvider', 'poolProvider');
    const otherPoolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'otherPoolProvider', 'otherPoolProvider');
    const pool = new UserPool(stack, 'Pool');
    const otherPool = new UserPool(stack, 'OtherPool');
    pool.registerIdentityProvider(poolProvider);
    otherPool.registerIdentityProvider(otherPoolProvider);
    const userPools = [{
      userPool: pool,
    }];
    const idPool = new IdentityPool(stack, 'TestIdentityPoolUserPools', {
      authenticationProviders: { userPools },
    });
    idPool.addUserPool(otherPool, undefined, true);
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::Cognito::UserPool', 2);
    temp.resourceCountIs('AWS::Cognito::UserPoolClient', 2);
    temp.hasResourceProperties('AWS::Cognito::UserPoolClient', {
      UserPoolId: {
        Ref: 'PoolD3F588B8',
      },
      AllowedOAuthFlows: [
        'implicit',
        'code',
      ],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: [
        'profile',
        'phone',
        'email',
        'openid',
        'aws.cognito.signin.user.admin',
      ],
      CallbackURLs: [
        'https://example.com',
      ],
      SupportedIdentityProviders: [
        'poolProvider',
        'COGNITO',
      ],
    });
    temp.hasResourceProperties('AWS::Cognito::UserPoolClient', {
      UserPoolId: {
        Ref: 'OtherPool7DA7F2F7',
      },
      AllowedOAuthFlows: [
        'implicit',
        'code',
      ],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: [
        'profile',
        'phone',
        'email',
        'openid',
        'aws.cognito.signin.user.admin',
      ],
      CallbackURLs: [
        'https://example.com',
      ],
      SupportedIdentityProviders: [
        'otherPoolProvider',
        'COGNITO',
      ],
    });
    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      AllowUnauthenticatedIdentities: false,
      CognitoIdentityProviders: [
        {
          ClientId: {
            Ref: 'PoolUserPoolClientForundefinedBF6BDE57',
          },
          ProviderName: 'poolProvider',
          ServerSideTokenCheck: true,
        },
        {
          ClientId: {
            Ref: 'OtherPoolUserPoolClientForundefined1B97829F',
          },
          ProviderName: 'otherPoolProvider',
          ServerSideTokenCheck: false,
        },
      ],
    });
  });

  test('openId, saml, classicFlow, customProviders', () => {
    const stack = new Stack();
    const openId = new OpenIdConnectProvider(stack, 'OpenId', {
      url: 'https://example.com',
      clientIds: ['client1', 'client2'],
      thumbprints: ['thumbprint'],
    });
    const saml = new SamlProvider(stack, 'Provider', {
      metadataDocument: SamlMetadataDocument.fromXml('document'),
    });
    new IdentityPool(stack, 'TestIdentityPoolCustomProviders', {
      authenticationProviders: {
        openIdConnectProvider: openId,
        samlProvider: saml,
        customProvider: 'my-custom-provider.com',
      },
      allowClassicFlow: true,
    });
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 1);
    temp.resourceCountIs('AWS::IAM::SAMLProvider', 1);
    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      AllowUnauthenticatedIdentities: false,
      AllowClassicFlow: true,
      DeveloperProviderName: 'my-custom-provider.com',
      OpenIdConnectProviderARNs: [
        {
          Ref: 'OpenId76D94D20',
        },
      ],
      SamlProviderARNs: [
        {
          Ref: 'Provider2281708E',
        },
      ],
    });
  });

  test('pushSync, cognito events and streams, supported login providers', () => {
    const stack = new Stack();
    const pushSyncRole = new Role(stack, 'pushSyncRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const streamRole = new Role(stack, 'streamRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    new IdentityPool(stack, 'TestIdentityPoolPushSyncStreamsEventsEtc', {
      identityPoolName: 'my-id-pool',
      pushSyncConfig: {
        applicationArns: ['arn::my::application'],
        role: pushSyncRole,
      },
      streamOptions: {
        streamName: 'my-stream',
        enableStreamingStatus: true,
        role: streamRole,
      },
      authenticationProviders: {
        amazon: { appId: 'amzn1.application.12312k3j234j13rjiwuenf' },
        google: { appId: '12345678012.apps.googleusercontent.com' },
      },
      syncTrigger: Function.fromFunctionArn(stack, 'my-event-function', 'arn:aws:lambda:my-lambda-region:123456789012:function:my-sync-trigger'),
    });
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::IAM::Role', 4);
    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      CognitoEvents: {
        SyncTrigger: 'arn:aws:lambda:my-lambda-region:123456789012:function:my-sync-trigger',
      },
      CognitoStreams: {
        RoleArn: {
          'Fn::GetAtt': [
            'streamRoleFD11C7FD',
            'Arn',
          ],
        },
        StreamName: 'my-stream',
        StreamingStatus: 'ENABLED',
      },
      IdentityPoolName: 'my-id-pool',
      PushSync: {
        ApplicationArns: [
          'arn::my::application',
        ],
        RoleArn: {
          'Fn::GetAtt': [
            'pushSyncRole90B6639A',
            'Arn',
          ],
        },
      },
      SupportedLoginProviders: {
        'www.amazon.com': {
          appId: 'amzn1.application.12312k3j234j13rjiwuenf',
        },
        'accounts.google.com': {
          appId: '12345678012.apps.googleusercontent.com',
        },
      },
    });
  });
});

describe('role mappings', () => {
  test('using token', () => {
    const stack = new Stack();
    new IdentityPool(stack, 'TestIdentityPoolRoleMappingToken', {
      roleMappings: [{
        providerUrl: AuthenticationProviderType.AMAZON,
        useToken: true,
      }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingTokenE6CC49E0',
      },
      RoleMappings: {
        'www.amazon.com': {
          AmbiguousRoleResolution: 'Deny',
          IdentityProvider: 'www.amazon.com',
          Type: 'Token',
        },
      },
      Roles: {
        authenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingTokenTestIdentityPoolRoleMappingTokenAuthenticatedRoleD2ED95FF',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingTokenTestIdentityPoolRoleMappingTokenUnauthenticatedRole0BEF1509',
            'Arn',
          ],
        },
      },
    });
  });

  test('rules type without rules throws', () => {
    const stack = new Stack();
    expect(() => new IdentityPool(stack, 'TestIdentityPoolRoleMappingErrors', {
      roleMappings: [{
        providerUrl: AuthenticationProviderType.AMAZON,
      }],
    })).toThrowError('IdentityPoolRoleMapping.rules is required when useToken is false');
  });

  test('role mapping with rules configuration', () => {
    const stack = new Stack();
    const adminRole = new Role(stack, 'adminRole', {
      assumedBy: new ServicePrincipal('admin.amazonaws.com'),
    });
    const nonAdminRole = new Role(stack, 'nonAdminRole', {
      assumedBy: new AnyPrincipal(),
      inlinePolicies: {
        DenyAll: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.DENY,
              actions: ['update:*', 'put:*', 'delete:*'],
              resources: ['*'],
            }),
          ],
        }),
      },
    });
    const facebookRole = new Role(stack, 'facebookRole', {
      assumedBy: new ArnPrincipal('arn:aws:iam::123456789012:user/FacebookUser'),
    });
    const idPool = new IdentityPool(stack, 'TestIdentityPoolRoleMappingRules', {
      roleMappings: [{
        providerUrl: AuthenticationProviderType.AMAZON,
        resolveAmbiguousRoles: true,
        rules: [
          {
            claim: 'custom:admin',
            claimValue: 'admin',
            mappedRole: adminRole,
          },
          {
            claim: 'custom:admin',
            claimValue: 'admin',
            matchType: RoleMappingMatchType.NOTEQUAL,
            mappedRole: nonAdminRole,
          },
        ],
      }],
    });
    idPool.addRoleMappings({
      providerUrl: AuthenticationProviderType.FACEBOOK,
      rules: [
        {
          claim: 'iss',
          claimValue: 'https://graph.facebook.com',
          mappedRole: facebookRole,
        },
      ],
    });
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::Cognito::IdentityPoolRoleAttachment', 2);
    temp.hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingRulesA841EAFB',
      },
      RoleMappings: {
        'www.amazon.com': {
          AmbiguousRoleResolution: 'AuthenticatedRole',
          IdentityProvider: 'www.amazon.com',
          RulesConfiguration: {
            Rules: [
              {
                Claim: 'custom:admin',
                MatchType: 'Equals',
                RoleARN: {
                  'Fn::GetAtt': [
                    'adminRoleC345D70B',
                    'Arn',
                  ],
                },
                Value: 'admin',
              },
              {
                Claim: 'custom:admin',
                MatchType: 'NotEqual',
                RoleARN: {
                  'Fn::GetAtt': [
                    'nonAdminRole43C19D5C',
                    'Arn',
                  ],
                },
                Value: 'admin',
              },
            ],
          },
          Type: 'Rules',
        },
      },
      Roles: {
        authenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingRulesTestIdentityPoolRoleMappingRulesAuthenticatedRole1785BA7D',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingRulesTestIdentityPoolRoleMappingRulesUnauthenticatedRoleA5D688B7',
            'Arn',
          ],
        },
      },
    });
    temp.hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingRulesA841EAFB',
      },
      RoleMappings: {
        'graph.facebook.com': {
          AmbiguousRoleResolution: 'Deny',
          IdentityProvider: 'graph.facebook.com',
          RulesConfiguration: {
            Rules: [
              {
                Claim: 'iss',
                MatchType: 'Equals',
                RoleARN: {
                  'Fn::GetAtt': [
                    'facebookRole9D649CD8',
                    'Arn',
                  ],
                },
                Value: 'https://graph.facebook.com',
              },
            ],
          },
          Type: 'Rules',
        },
      },
    });
  });
});
import {
  Template,
} from '@aws-cdk/assertions';
import {
  UserPool,
  UserPoolIdentityProvider,
} from '@aws-cdk/aws-cognito';
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
import {
  Fn,
  Stack,
} from '@aws-cdk/core';
import {
  IdentityPool,
  IdentityPoolProviderUrl,
} from '../lib/identitypool';
import {
  RoleMappingMatchType,
} from '../lib/identitypool-role-attachment';
import { UserPoolAuthenticationProvider } from '../lib/identitypool-user-pool-authentication-provider';

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
                  Ref: 'TestIdentityPoolMinimal44837852',
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

    temp.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              'StringEquals': {
                'cognito-identity.amazonaws.com:aud': {
                  Ref: 'TestIdentityPoolMinimal44837852',
                },
              },
              'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'unauthenticated',
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

  test('providing default roles directly', () => {
    const stack = new Stack();
    const authenticatedRole = new Role(stack, 'authRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const unauthenticatedRole = new Role(stack, 'unauthRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const identityPool = new IdentityPool(stack, 'TestIdentityPoolActions', {
      authenticatedRole, unauthenticatedRole, allowUnauthenticatedIdentities: true,
    });
    identityPool.authenticatedRole.addToPrincipalPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['execute-api:*', 'dynamodb:*'],
      resources: ['*'],
    }));
    identityPool.unauthenticatedRole.addToPrincipalPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['execute-api:*'],
      resources: ['arn:aws:execute-api:us-east-1:*:my-api/prod'],
    }));
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::IAM::Role', 2);
    temp.resourceCountIs('AWS::IAM::Policy', 2);
    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      AllowUnauthenticatedIdentities: true,
    });
    temp.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'service.amazonaws.com',
            },
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
            Resource: 'arn:aws:execute-api:us-east-1:*:my-api/prod',
          },
        ],
      },
    });

    temp.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['execute-api:*', 'dynamodb:*'],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });
  test('adding actions and resources to default roles', () => {
    const stack = new Stack();
    const identityPool = new IdentityPool(stack, 'TestIdentityPoolActions');
    identityPool.authenticatedRole.addToPrincipalPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['execute-api:*', 'dynamodb:*'],
      resources: ['*'],
    }));
    identityPool.unauthenticatedRole.addToPrincipalPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['execute-api:*'],
      resources: ['arn:aws:execute-api:us-east-1:*:my-api/prod'],
    }));
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::IAM::Role', 2);
    temp.resourceCountIs('AWS::IAM::Policy', 2);
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
            Action: ['execute-api:*', 'dynamodb:*'],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
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

  test('user pools auth provider properly generates URL', () => {
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');
    const authProvider = new UserPoolAuthenticationProvider({ userPool: pool });
    console.log(Template.fromStack(stack))
    expect(authProvider.providerUrl.value)
      .toEqual('cognito-idp.my-idp-region.amazonaws.com/my-idp-region_abcdefghi:app_client_id');
  });

  test('user pools are properly configured', () => {
    const stack = new Stack();
    const poolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'poolProvider', 'poolProvider');
    const otherPoolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'otherPoolProvider', 'otherPoolProvider');
    const pool = new UserPool(stack, 'Pool');
    const otherPool = new UserPool(stack, 'OtherPool');
    pool.registerIdentityProvider(poolProvider);
    otherPool.registerIdentityProvider(otherPoolProvider);
    const idPool = new IdentityPool(stack, 'TestIdentityPoolUserPools', {
      authenticationProviders: {
        userPools: [new UserPoolAuthenticationProvider({ userPool: pool })],
      },
    });
    idPool.addUserPoolAuthentication(
      new UserPoolAuthenticationProvider({
        userPool: otherPool,
        disableServerSideTokenCheck: true,
      }),
    );
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
            Ref: 'PoolUserPoolAuthenticationProviderClient20F2FFC4',
          },
          ProviderName: {
            'Fn::Join': [
              '',
              [
                'cognito-idp.',
                {
                  Ref: 'AWS::Region',
                },
                '.',
                {
                  Ref: 'AWS::URLSuffix',
                },
                '/',
                {
                  Ref: 'PoolD3F588B8',
                },
              ],
            ],
          },
          ServerSideTokenCheck: true,
        },
        {
          ClientId: {
            Ref: 'OtherPoolUserPoolAuthenticationProviderClient08F670F8',
          },
          ProviderName: {
            'Fn::Join': [
              '',
              [
                'cognito-idp.',
                {
                  Ref: 'AWS::Region',
                },
                '.',
                {
                  Ref: 'AWS::URLSuffix',
                },
                '/',
                {
                  Ref: 'OtherPool7DA7F2F7',
                },
              ],
            ],
          },
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
        openIdConnectProviders: [openId],
        samlProviders: [saml],
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

  test('cognito authentication providers', () => {
    const stack = new Stack();
    new IdentityPool(stack, 'TestIdentityPoolauthproviders', {
      identityPoolName: 'my-id-pool',
      authenticationProviders: {
        amazon: { appId: 'amzn1.application.12312k3j234j13rjiwuenf' },
        google: { clientId: '12345678012.apps.googleusercontent.com' },
      },
    });
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::IAM::Role', 2);
    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      IdentityPoolName: 'my-id-pool',
      SupportedLoginProviders: {
        'www.amazon.com': 'amzn1.application.12312k3j234j13rjiwuenf',
        'accounts.google.com': '12345678012.apps.googleusercontent.com',
      },
    });
  });
});

describe('role mappings', () => {
  test('mappingKey respected when identity provider is not a token', () => {
    const stack = new Stack();
    new IdentityPool(stack, 'TestIdentityPoolRoleMappingToken', {
      roleMappings: [{
        mappingKey: 'amazon',
        providerUrl: IdentityPoolProviderUrl.AMAZON,
        useToken: true,
      }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingToken0B11D690',
      },
      RoleMappings: {
        amazon: {
          AmbiguousRoleResolution: 'Deny',
          IdentityProvider: 'www.amazon.com',
          Type: 'Token',
        },
      },
      Roles: {
        authenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingTokenAuthenticatedRoleD99CE043',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingTokenUnauthenticatedRole1D86D800',
            'Arn',
          ],
        },
      },
    });
  });

  test('mappingKey required when identity provider is not a token', () => {
    const stack = new Stack();
    const providerUrl = Fn.importValue('ProviderUrl');
    expect(() => new IdentityPool(stack, 'TestIdentityPoolRoleMappingErrors', {
      roleMappings: [{
        providerUrl: IdentityPoolProviderUrl.userPool(providerUrl),
        useToken: true,
      }],
    })).toThrowError('mappingKey must be provided when providerUrl.value is a token');
  });

  test('mappingKey respected when identity provider is a token', () => {
    const stack = new Stack();
    const providerUrl = Fn.importValue('ProviderUrl');
    new IdentityPool(stack, 'TestIdentityPoolRoleMappingToken', {
      roleMappings: [{
        mappingKey: 'theKey',
        providerUrl: IdentityPoolProviderUrl.userPool(providerUrl),
        useToken: true,
      }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingToken0B11D690',
      },
      RoleMappings: {
        theKey: {
          AmbiguousRoleResolution: 'Deny',
          IdentityProvider: {
            'Fn::ImportValue': 'ProviderUrl',
          },
          Type: 'Token',
        },
      },
      Roles: {
        authenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingTokenAuthenticatedRoleD99CE043',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingTokenUnauthenticatedRole1D86D800',
            'Arn',
          ],
        },
      },
    });
  });
  test('using token', () => {
    const stack = new Stack();
    new IdentityPool(stack, 'TestIdentityPoolRoleMappingToken', {
      roleMappings: [{
        providerUrl: IdentityPoolProviderUrl.AMAZON,
        useToken: true,
      }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingToken0B11D690',
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
            'TestIdentityPoolRoleMappingTokenAuthenticatedRoleD99CE043',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingTokenUnauthenticatedRole1D86D800',
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
        providerUrl: IdentityPoolProviderUrl.AMAZON,
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
    const customRole = new Role(stack, 'customRole', {
      assumedBy: new ArnPrincipal('arn:aws:iam::123456789012:user/CustomUser'),
    });
    const idPool = new IdentityPool(stack, 'TestIdentityPoolRoleMappingRules', {
      roleMappings: [{
        providerUrl: IdentityPoolProviderUrl.AMAZON,
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
      providerUrl: IdentityPoolProviderUrl.FACEBOOK,
      rules: [
        {
          claim: 'iss',
          claimValue: 'https://graph.facebook.com',
          mappedRole: facebookRole,
        },
      ],
    },
    {
      providerUrl: IdentityPoolProviderUrl.custom('example.com'),
      rules: [
        {
          claim: 'iss',
          claimValue: 'https://example.com',
          mappedRole: customRole,
        },
      ],
    });
    const temp = Template.fromStack(stack);
    temp.resourceCountIs('AWS::Cognito::IdentityPoolRoleAttachment', 2);
    temp.hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingRulesC8C07BC3',
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
            'TestIdentityPoolRoleMappingRulesAuthenticatedRole14D102C7',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'TestIdentityPoolRoleMappingRulesUnauthenticatedRole79A7AF99',
            'Arn',
          ],
        },
      },
    });
    temp.hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPoolRoleMappingRulesC8C07BC3',
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
        'example.com': {
          AmbiguousRoleResolution: 'Deny',
          IdentityProvider: 'example.com',
          RulesConfiguration: {
            Rules: [
              {
                Claim: 'iss',
                MatchType: 'Equals',
                RoleARN: {
                  'Fn::GetAtt': [
                    'customRole4C920FF0',
                    'Arn',
                  ],
                },
                Value: 'https://example.com',
              },
            ],
          },
          Type: 'Rules',
        },
      },
    });
  });
});
import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal, OpenIdConnectProvider, SamlProvider, SamlMetadataDocument } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { IdentityPool } from '../lib/identity-pool';
import { UserPool } from '../lib/user-pool';
import { UserPoolIdentityProvider } from '../lib/user-pool-idp';
describe('Identity Pool', () => {
  test('minimal setup', () => {
    const stack = new Stack();
    const authRole = new Role(stack, 'authRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const unauthRole = new Role(stack, 'unauthRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    new IdentityPool(stack, 'TestIdentityPool', {
      authenticatedRole: authRole,
      unauthenticatedRole: unauthRole,
    });
    const temp = Template.fromStack(stack);

    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      AllowUnauthenticatedIdentities: false,
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

    temp.resourceCountIs('AWS::IAM::Role', 2);

    temp.hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPool328F7622',
      },
      Roles: {
        authenticated: {
          'Fn::GetAtt': [
            'authRoleB7A6401B',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'unauthRole8318277E',
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
    const idPool = IdentityPool.fromIdentityPoolId(stack, 'staticIdPool', 'my-region:idPool');

    expect(idPool.identityPoolId).toEqual('my-region:idPool');
    expect(idPool.identityPoolArn).toMatch(/cognito-identity:my-region:1234567891011:identitypool\/idPool/);
  });

  test('user pools are properly configured', () => {
    const stack = new Stack();
    const authRole = new Role(stack, 'authRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const unauthRole = new Role(stack, 'unauthRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const poolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'poolProvider', 'poolProvider');
    const otherPoolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'otherPoolProvider', 'otherPoolProvider');
    const pool = new UserPool(stack, 'Pool');
    const otherPool = new UserPool(stack, 'OtherPool');
    pool.registerIdentityProvider(poolProvider);
    otherPool.registerIdentityProvider(otherPoolProvider);
    const userPools = [pool];
    const idPool = new IdentityPool(stack, 'TestIdentityPoolUserPools', {
      authenticatedRole: authRole,
      unauthenticatedRole: unauthRole,
      userPools,
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

  test('openId and Saml providers are properly configured', () => {
    const stack = new Stack();
    const authRole = new Role(stack, 'authRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const unauthRole = new Role(stack, 'unauthRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const openId = new OpenIdConnectProvider(stack, 'OpenId', {
      url: 'https://example.com',
      clientIds: ['client1', 'client2'],
      thumbprints: ['thumbprint'],
    });
    const saml =  new SamlProvider(stack, 'Provider', {
      metadataDocument: SamlMetadataDocument.fromXml('document'),
    });
    const idPool = new IdentityPool(stack, 'TestIdentityPoolUserPools', {
      authenticatedRole: authRole,
      unauthenticatedRole: unauthRole,
      openIdConnectProviders: [openId],
      samlProviders: [saml],
    });
  })
});
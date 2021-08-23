import {
  Role,
  ServicePrincipal,
  AnyPrincipal,
  ArnPrincipal,
  OpenIdConnectProvider,
  SamlProvider,
  SamlMetadataDocument,
  Effect,
  PolicyDocument,
  PolicyStatement,
} from '@aws-cdk/aws-iam';
import { Function } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { IdentityPool, SupportedLoginProviderType, RoleMappingMatchType } from '../lib/identity-pool';
import { UserPool } from '../lib/user-pool';
import { UserPoolIdentityProvider } from '../lib/user-pool-idp';

const app = new App();
const stack = new Stack(app, 'integ-identity-pool');
const authRole = new Role(stack, 'authRole', {
  assumedBy: new ServicePrincipal('service.amazonaws.com'),
});
const unauthRole = new Role(stack, 'unauthRole', {
  assumedBy: new ServicePrincipal('service.amazonaws.com'),
});
const pushSyncRole = new Role(stack, 'pushSyncRole', {
  assumedBy: new ServicePrincipal('service.amazonaws.com'),
});
const streamRole = new Role(stack, 'streamRole', {
  assumedBy: new ServicePrincipal('service.amazonaws.com'),
});
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
const poolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'poolProvider', 'poolProvider');
const otherPoolProvider = UserPoolIdentityProvider.fromProviderName(stack, 'otherPoolProvider', 'otherPoolProvider');
const pool = new UserPool(stack, 'Pool');
const otherPool = new UserPool(stack, 'OtherPool');
pool.registerIdentityProvider(poolProvider);
otherPool.registerIdentityProvider(otherPoolProvider);
const userPools = [pool];
const openId = new OpenIdConnectProvider(stack, 'OpenId', {
  url: 'https://example.com',
  clientIds: ['client1', 'client2'],
  thumbprints: ['thumbprint'],
});
const saml = new SamlProvider(stack, 'Provider', {
  metadataDocument: SamlMetadataDocument.fromXml('document'),
});

const idPool = new IdentityPool(stack, 'identitypool', {
  authenticatedRole: authRole,
  unauthenticatedRole: unauthRole,
  userPools,
  openIdConnectProviders: [openId],
  samlProviders: [saml],
  customProvider: 'https://my-custom-provider.com',
  allowClassicFlow: true,
  allowUnauthenticatedIdentities: true,
  identityPoolName: 'my-id-pool',
  pushSyncConfig: {
    applicationArns: ['my::application::arn'],
    role: pushSyncRole,
  },
  streamOptions: {
    streamName: 'my-stream',
    enableStreamingStatus: true,
    role: streamRole,
  },
  supportedLoginProviders: {
    amazon: 'my-app.amazon.com',
    google: 'my-app.google.com',
  },
  syncTrigger: Function.fromFunctionArn(stack, 'my-event-function', 'my::lambda::arn'),
  roleMappings: [{
    providerUrl: SupportedLoginProviderType.AMAZON,
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
  providerUrl: SupportedLoginProviderType.FACEBOOK,
  rules: [
    {
      claim: 'iss',
      claimValue: 'https://graph.facebook.com',
      mappedRole: facebookRole,
    },
  ],
});
app.synth();
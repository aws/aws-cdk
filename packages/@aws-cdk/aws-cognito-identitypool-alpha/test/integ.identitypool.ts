import { UserPool, UserPoolIdentityProviderGoogle, UserPoolIdentityProviderAmazon, ProviderAttribute, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { App, SecretValue, Stack } from 'aws-cdk-lib';
import { IdentityPool, IdentityPoolProviderUrl } from '../lib/identitypool';
import { UserPoolAuthenticationProvider } from '../lib/identitypool-user-pool-authentication-provider';

const app = new App();
const stack = new Stack(app, 'integ-identitypool');

const userPool = new UserPool(stack, 'Pool');
new UserPoolIdentityProviderGoogle(stack, 'PoolProviderGoogle', {
  userPool,
  clientId: 'google-client-id',
  clientSecretValue: new SecretValue('google-client-secret-value'),
  attributeMapping: {
    givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
    familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
    email: ProviderAttribute.GOOGLE_EMAIL,
    gender: ProviderAttribute.GOOGLE_GENDER,
    custom: {
      names: ProviderAttribute.GOOGLE_NAMES,
    },
  },
});
const otherPool = new UserPool(stack, 'OtherPool');
new UserPoolIdentityProviderAmazon(stack, 'OtherPoolProviderAmazon', {
  userPool: otherPool,
  clientId: 'amzn-client-id',
  clientSecret: 'amzn-client-secret',
  attributeMapping: {
    givenName: ProviderAttribute.AMAZON_NAME,
    email: ProviderAttribute.AMAZON_EMAIL,
    custom: {
      userId: ProviderAttribute.AMAZON_USER_ID,
    },
  },
});
const client = userPool.addClient('testClient');
const userPoolToImport = new UserPool(stack, 'UserPoolToImport');
const clientToImport = userPoolToImport.addClient('clientToImport');
const importedUserPool = UserPool.fromUserPoolArn(stack, 'ImportedUserPool', userPoolToImport.userPoolArn);
const importedUserPoolClient = UserPoolClient.fromUserPoolClientId(stack, 'ImportedUserPoolClient', clientToImport.userPoolClientId);
const provider = new UserPoolAuthenticationProvider({ userPool, userPoolClient: client });
const importedProvider = new UserPoolAuthenticationProvider({ userPool: importedUserPool, userPoolClient: importedUserPoolClient });
const idPool = new IdentityPool(stack, 'identitypool', {
  authenticationProviders: {
    userPools: [provider, importedProvider],
    amazon: { appId: 'amzn1.application.12312k3j234j13rjiwuenf' },
    google: { clientId: '12345678012.apps.googleusercontent.com' },
  },
  roleMappings: [
    {
      mappingKey: 'theKey',
      providerUrl: IdentityPoolProviderUrl.userPool(userPool, client),
      useToken: true,
    },
    {
      mappingKey: 'importedUserPool',
      providerUrl: IdentityPoolProviderUrl.userPool(importedUserPool, importedUserPoolClient),
      useToken: true,
    },
  ],
  allowClassicFlow: true,
  identityPoolName: 'my-id-pool',
});
idPool.authenticatedRole.addToPrincipalPolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ['dynamodb:*'],
  resources: ['*'],
}));
idPool.unauthenticatedRole.addToPrincipalPolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ['dynamodb:Get*'],
  resources: ['*'],
}));
idPool.addUserPoolAuthentication(new UserPoolAuthenticationProvider({ userPool: otherPool }));
app.synth();

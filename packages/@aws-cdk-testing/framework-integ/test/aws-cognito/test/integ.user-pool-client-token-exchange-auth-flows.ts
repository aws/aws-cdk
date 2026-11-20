import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { FeaturePlan, OAuthScope, ResourceServerScope, UserPool } from 'aws-cdk-lib/aws-cognito';

/**
 * App clients with the token exchange flows, and a machine-to-machine client with the client token flow.
 * Token exchange requires a user pool on the Essentials or Plus feature plan.
 */
const app = new App();
const stack = new Stack(app, 'IntegUserPoolClientTokenExchangeAuthFlows');

const userPool = new UserPool(stack, 'Pool', {
  featurePlan: FeaturePlan.ESSENTIALS,
  removalPolicy: RemovalPolicy.DESTROY,
});

const readScope = new ResourceServerScope({ scopeName: 'read', scopeDescription: 'Read access' });
const resourceServer = userPool.addResourceServer('ResourceServer', {
  identifier: 'api',
  scopes: [readScope],
});

const tokenExchangeClient = userPool.addClient('TokenExchangeClient', {
  generateSecret: true,
  authFlows: {
    tokenExchangeImpersonation: true,
    tokenExchangeDelegation: true,
  },
  oAuth: {
    flows: { clientCredentials: true },
    scopes: [OAuthScope.resourceServer(resourceServer, readScope)],
  },
});

const clientTokenClient = userPool.addClient('ClientTokenClient', {
  generateSecret: true,
  authFlows: {
    clientToken: true,
  },
  oAuth: {
    flows: { clientCredentials: true },
    scopes: [OAuthScope.resourceServer(resourceServer, readScope)],
  },
});

const integ = new IntegTest(app, 'integ-user-pool-client-token-exchange-auth-flows', {
  testCases: [stack],
});

// Cognito returns ExplicitAuthFlows in no fixed order, so check each flow on its own.
for (const flow of ['ALLOW_TOKEN_EXCHANGE_IMPERSONATION', 'ALLOW_TOKEN_EXCHANGE_DELEGATION']) {
  integ.assertions.awsApiCall('CognitoIdentityServiceProvider', 'describeUserPoolClient', {
    UserPoolId: userPool.userPoolId,
    ClientId: tokenExchangeClient.userPoolClientId,
  }).expect(ExpectedResult.objectLike({
    UserPoolClient: {
      ExplicitAuthFlows: Match.arrayWith([flow]),
    },
  }));
}

integ.assertions.awsApiCall('CognitoIdentityServiceProvider', 'describeUserPoolClient', {
  UserPoolId: userPool.userPoolId,
  ClientId: clientTokenClient.userPoolClientId,
}).expect(ExpectedResult.objectLike({
  UserPoolClient: {
    ExplicitAuthFlows: ['ALLOW_CLIENT_TOKEN_AUTH'],
  },
}));

import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { OAuthScope, UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-resource-server');

/*
 * Stack verification steps:
 * Cognito will only allow you to add a custom scope on a user pool client that is defined by a resource server.
 * Checking the app client scopes will verify if the resource server was made and is working correctly.
 * The exports userPoolId and userPoolClientId are exported here to test
 *
 * * `aws cognito-idp describe-user-pool-client --user-pool-id $userPoolId --client-id $userPoolClientId` should return "users/read" in "AllowedOAuthScopes"
 */
const userPool = new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
});

const resourceServer = userPool.addResourceServer('myserver', {
  identifier: 'users',
  scopes: [
    {
      scopeName: 'read',
      scopeDescription: 'read only',
    },
  ],
});

const client = userPool.addClient('client', {
  userPoolClientName: 'users-app',
  generateSecret: true,
  oAuth: {
    flows: {
      clientCredentials: true,
    },
    scopes: [
      OAuthScope.custom('users/read'),
    ],
  },
});

client.node.addDependency(resourceServer);

new CfnOutput(stack, 'pool-id', {
  value: userPool.userPoolId,
});

new CfnOutput(stack, 'client-id', {
  value: client.userPoolClientId,
});
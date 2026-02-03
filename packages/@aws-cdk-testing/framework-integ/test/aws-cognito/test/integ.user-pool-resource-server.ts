import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { OAuthScope, ResourceServerScope, UserPool } from 'aws-cdk-lib/aws-cognito';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-resource-server');

/*
 * Stack verification steps:
 * Cognito will only allow you to add a custom scope on a user pool client that is defined by a resource server.
 * Checking the app client scopes will verify if the resource server is configured correctly.
 * The exports userPoolId and userPoolClientId are exported here to test
 *
 * * `aws cognito-idp describe-user-pool-client --user-pool-id $userPoolId --client-id $userPoolClientId` should return "users/read" in "AllowedOAuthScopes"
 */
const userPool = new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
  removalPolicy: RemovalPolicy.DESTROY,
});

const readScope = new ResourceServerScope({ scopeName: 'read', scopeDescription: 'read only' });
const userServer = userPool.addResourceServer('myserver', {
  identifier: 'users',
  scopes: [readScope],
});

const client = userPool.addClient('client', {
  userPoolClientName: 'users-app',
  generateSecret: true,
  oAuth: {
    flows: {
      clientCredentials: true,
    },
    scopes: [
      OAuthScope.resourceServer(userServer, readScope),
    ],
  },
});

new CfnOutput(stack, 'pool-id', {
  value: userPool.userPoolId,
});

new CfnOutput(stack, 'client-id', {
  value: client.userPoolClientId,
});

import { App, Stack } from '@aws-cdk/core';
import { OAuthScope, UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-client-explicit-props');

const userpool = new UserPool(stack, 'myuserpool');

userpool.addClient('myuserpoolclient', {
  userPoolClientName: 'myuserpoolclient',
  authFlows: {
    adminUserPassword: true,
    custom: true,
    userPassword: true,
    userSrp: true,
  },
  generateSecret: true,
  oAuth: {
    flows: {
      implicitCodeGrant: true,
      authorizationCodeGrant: true,
    },
    scopes: [
      OAuthScope.PHONE,
      OAuthScope.EMAIL,
      OAuthScope.OPENID,
      OAuthScope.PROFILE,
      OAuthScope.COGNITO_ADMIN,
    ],
    callbackUrls: ['https://redirect-here.myapp.com'],
  },
  preventUserExistenceErrors: true,
});

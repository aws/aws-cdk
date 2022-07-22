import { App, CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';
import { OAuthScope, UserPool, ClientAttributes, StringAttribute } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-client-explicit-props');

const userpool = new UserPool(stack, 'myuserpool', {
  removalPolicy: RemovalPolicy.DESTROY,
  customAttributes: {
    attribute_one: new StringAttribute(),
    attribute_two: new StringAttribute(),
  },
});

const client = userpool.addClient('myuserpoolclient', {
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
  writeAttributes: (new ClientAttributes()).withStandardAttributes(
    {
      address: true,
      birthdate: true,
      email: true,
      familyName: true,
      fullname: true,
      gender: true,
      givenName: true,
      lastUpdateTime: true,
      locale: true,
      middleName: true,
      nickname: true,
      phoneNumber: true,
      preferredUsername: true,
      profilePage: true,
      profilePicture: true,
      timezone: true,
      website: true,
    }).withCustomAttributes('attribute_one', 'attribute_two'),
});

new CfnOutput(client, 'CfnOutput', {
  value: client.userPoolClientSecret as string,
});
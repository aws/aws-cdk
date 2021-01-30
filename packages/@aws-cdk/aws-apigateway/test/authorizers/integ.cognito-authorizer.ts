import * as cognito from '@aws-cdk/aws-cognito';
import { App, Stack } from '@aws-cdk/core';
import { AuthorizationType, CognitoAuthorizer, RestApi } from '../../lib';

const app = new App();
const stack = new Stack(app, 'CognitoAuthorizerInteg');

const userPool = new cognito.UserPool(stack, 'UserPool');

const authorizer = new CognitoAuthorizer(stack, 'myauthorizer', {
  cognitoUserPools: [userPool],
});

const restApi = new RestApi(stack, 'myrestapi');
restApi.root.addMethod('ANY', undefined, {
  authorizer,
  authorizationType: AuthorizationType.COGNITO,
});

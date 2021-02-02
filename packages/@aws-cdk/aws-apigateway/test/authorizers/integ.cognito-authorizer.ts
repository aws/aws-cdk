import * as cognito from '@aws-cdk/aws-cognito';
import { App, Stack } from '@aws-cdk/core';
import { AuthorizationType, CognitoUserPoolsAuthorizer, MockIntegration, PassthroughBehavior, RestApi } from '../../lib';

/*
 * Stack verification steps:
 * * get the IdToken for the created pool by adding user/app-client and using aws cognito-idp
 * * `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: <Invalid-IdToken>' <url>` should return 403
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: <Valid-IdToken>' <url>` should return 200
 */

const app = new App();
const stack = new Stack(app, 'CognitoUserPoolsAuthorizerInteg');

const userPool = new cognito.UserPool(stack, 'UserPool');

const authorizer = new CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
  cognitoUserPools: [userPool],
});

const restApi = new RestApi(stack, 'myrestapi');
restApi.root.addMethod('ANY', new MockIntegration({
  integrationResponses: [
    { statusCode: '200' },
  ],
  passthroughBehavior: PassthroughBehavior.NEVER,
  requestTemplates: {
    'application/json': '{ "statusCode": 200 }',
  },
}), {
  methodResponses: [
    { statusCode: '200' },
  ],
  authorizer,
  authorizationType: AuthorizationType.COGNITO,
});

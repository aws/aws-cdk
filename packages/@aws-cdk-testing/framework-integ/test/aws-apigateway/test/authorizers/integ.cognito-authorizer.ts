import * as cognito from 'aws-cdk-lib/aws-cognito';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AuthorizationType, CognitoUserPoolsAuthorizer, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';

/*
 * Stack verification steps:
 * * 1. Get the IdToken for the created pool by adding user/app-client and using aws cognito-idp:
 * *  a. aws cognito-idp create-user-pool-client --user-pool-id <value> --client-name <value> --no-generate-secret
 * *  b. aws cognito-idp admin-create-user --user-pool-id <value> --username <value> --temporary-password <value>
 * *  c. aws cognito-idp initiate-auth --client-id <value> --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=<value>,PASSWORD=<value>
 * *  d. aws cognito-idp respond-to-auth-challenge --client-id <value> --challenge-name <value> --session <value>
 * *
 * * 2. Verify the stack using above obtained token:
 * *  a. `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
 * *  b. `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: <Invalid-IdToken>' <url>` should return 403
 * *  c. `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: <Valid-IdToken>' <url>` should return 200
 */

const app = new App();
const stack = new Stack(app, 'CognitoUserPoolsAuthorizerInteg');

const userPool = new cognito.UserPool(stack, 'UserPool');

const authorizer = new CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
  cognitoUserPools: [userPool],
});

const restApi = new RestApi(stack, 'myrestapi', { cloudWatchRole: true });
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

new IntegTest(app, 'cognito-authorizer', {
  testCases: [stack],
});

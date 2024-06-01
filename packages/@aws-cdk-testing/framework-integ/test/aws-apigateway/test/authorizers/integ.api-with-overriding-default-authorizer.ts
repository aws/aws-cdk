import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as agw from 'aws-cdk-lib/aws-apigateway';
import { AuthorizationType, MockIntegration, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';

/*
 * Stack verification steps:
 * * `curl -i <CFN output PetsURL>` should return HTTP code 200
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-with-overriding-default-authorizer');

// create a cognito user pool
const userPool = new cognito.UserPool(stack, 'UserPool', {
  selfSignUpEnabled: true,
  signInAliases: {
    email: true,
  },
});

const authorizer = new agw.CognitoUserPoolsAuthorizer(stack, 'Authorizer', {
  cognitoUserPools: [userPool],
});

const api = new agw.RestApi(stack, 'Actions-ApiGateway', {
  defaultCorsPreflightOptions: {
    allowOrigins: agw.Cors.ALL_ORIGINS,
    maxAge: cdk.Duration.days(10),
  },
  defaultMethodOptions: {
    authorizer: authorizer,
    authorizationType: agw.AuthorizationType.COGNITO,
    authorizationScopes: ['scope'],
  },
});

api.root.addMethod('ANY', new MockIntegration({
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
  authorizationType: AuthorizationType.NONE,
});

api.root.addMethod('GET', new MockIntegration({
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
});

new IntegTest(app, 'apigateway-with-overriding-default-authorizer', {
  testCases: [stack],
});

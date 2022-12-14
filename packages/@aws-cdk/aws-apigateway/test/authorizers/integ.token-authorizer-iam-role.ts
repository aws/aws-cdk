import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { AuthorizationType, MockIntegration, PassthroughBehavior, RestApi, TokenAuthorizer } from '../../lib';

/*
 * Stack verification steps:
 * * `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: deny' <url>` should return 403
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: allow' <url>` should return 200
 */

const app = new App();
const stack = new Stack(app, 'TokenAuthorizerIAMRoleInteg');

const authorizerFn = new lambda.Function(stack, 'MyAuthorizerFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.token-authorizer.handler')),
});

const role = new iam.Role(stack, 'authorizerRole', {
  assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
});

const authorizer = new TokenAuthorizer(stack, 'MyAuthorizer', {
  handler: authorizerFn,
  assumeRole: role,
});

const restapi = new RestApi(stack, 'MyRestApi', { cloudWatchRole: true });

restapi.root.addMethod('ANY', new MockIntegration({
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
  authorizationType: AuthorizationType.CUSTOM,
});

new IntegTest(app, 'iam-token-authorizer', {
  testCases: [stack],
});

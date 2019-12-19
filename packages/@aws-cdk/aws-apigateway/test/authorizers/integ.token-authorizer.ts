import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import * as path from 'path';
import { AuthorizationType, Authorizer, MockIntegration, PassthroughBehavior, RestApi } from '../../lib';

// Against the RestApi endpoint from the stack output, run
// `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
// `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: deny' <url>` should return 403
// `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: allow' <url>` should return 200

const app = new App();
const stack = new Stack(app, 'TokenAuthorizerInteg');

const authorizerFn = new lambda.Function(stack, 'MyAuthorizerFunction', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.token-authorizer.handler'))
});

const restapi = new RestApi(stack, 'MyRestApi');

const authorizer = Authorizer.token(stack, 'MyAuthorizer', {
  handler: authorizerFn,
});

restapi.root.addMethod('ANY', new MockIntegration({
  integrationResponses: [
    { statusCode: '200' }
  ],
  passthroughBehavior: PassthroughBehavior.NEVER,
  requestTemplates: {
    'application/json': '{ "statusCode": 200 }',
  },
}), {
  methodResponses: [
    { statusCode: '200' }
  ],
  authorizer,
  authorizationType: AuthorizationType.CUSTOM
});
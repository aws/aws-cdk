/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { MockIntegration, PassthroughBehavior, RestApi } from '../../lib';
import { RequestAuthorizer } from '../../lib/authorizers';
import { IdentitySource } from '../../lib/authorizers/identity-source';

// Against the RestApi endpoint from the stack output, run
// `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
// `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: deny' <url>?allow=yes` should return 403
// `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: allow' <url>?allow=yes` should return 200

const app = new App();
const stack = new Stack(app, 'RequestAuthorizerInteg');

const authorizerFn = new lambda.Function(stack, 'MyAuthorizerFunction', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.request-authorizer.handler')),
});

const restapi = new RestApi(stack, 'MyRestApi');

const authorizer = new RequestAuthorizer(stack, 'MyAuthorizer', {
  handler: authorizerFn,
  identitySources: [IdentitySource.header('Authorization'), IdentitySource.queryString('allow')],
});

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
});

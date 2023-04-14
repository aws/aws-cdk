import * as path from 'path';
import * as lambda from '../../../aws-lambda';
import { App, Stack } from '../../../core';
import { MockIntegration, PassthroughBehavior, RestApi, RequestAuthorizer, IdentitySource } from '../../lib';

// Against the RestApi endpoint from the stack output, run
// `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
// `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: deny' <url>?allow=yes` should return 403
// `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: allow' <url>?allow=yes` should return 200

const app = new App();
const stack = new Stack(app, 'RequestAuthorizerInteg');

const authorizerFn = new lambda.Function(stack, 'MyAuthorizerFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.request-authorizer.handler')),
});

const restapi = new RestApi(stack, 'MyRestApi', { cloudWatchRole: true });

const authorizer = new RequestAuthorizer(stack, 'MyAuthorizer', {
  handler: authorizerFn,
  identitySources: [IdentitySource.header('Authorization'), IdentitySource.queryString('allow')],
});

const secondAuthorizer = new RequestAuthorizer(stack, 'MySecondAuthorizer', {
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

restapi.root.resourceForPath('auth').addMethod('ANY', new MockIntegration({
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
  authorizer: secondAuthorizer,
});

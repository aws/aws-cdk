/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import * as cognito from '@aws-cdk/aws-cognito';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { HttpApi, HttpJwtAuthorizer, HttpMethod, LambdaProxyIntegration } from '../../lib';

/*
 * Stack verification steps:
 * * `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: deny' <url>` should return 403
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: allow' <url>` should return 200
 */

const app = new App();
const stack = new Stack(app, 'AuthorizerInteg');

const httpApi = new HttpApi(stack, 'MyHttpApi');

const userPool = new cognito.UserPool(stack, 'userpool');

const client = userPool.addClient('my-client');

const authorizer = new HttpJwtAuthorizer(stack, 'MyAuthorizer', {
  httpApi,
  jwtConfiguration: {
    audience: [client.userPoolClientId],
    issuer: `https://cognito-idp.${stack.region}.amazonaws.com/${userPool.userPoolId}`,
  },
});

const handler = new lambda.Function(stack, 'lambda', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.authorizer.handler')),
});

httpApi.addRoutes({
  path: '/',
  methods: [HttpMethod.GET],
  integration: new LambdaProxyIntegration({ handler }),
  authorizer,
});

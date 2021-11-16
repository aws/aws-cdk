/// !cdk-integ pragma:ignore-assets
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { HttpIamAuthorizer } from '../../lib';

/*
 * Stack verification steps:
 * * curl <url> without sigv4 should result in a 403
 */

const app = new App();
const stack = new Stack(app, 'AuthorizerInteg');

const httpApi = new HttpApi(stack, 'MyHttpApi');
httpApi.addRoutes({
  path: '/',
  methods: [HttpMethod.GET],
  integration: new HttpProxyIntegration({
    url: 'https://aws.amazon.com/',
  }),
  authorizer: new HttpIamAuthorizer(),
});

new CfnOutput(stack, 'ApiUrl', {
  value: httpApi.url!,
});
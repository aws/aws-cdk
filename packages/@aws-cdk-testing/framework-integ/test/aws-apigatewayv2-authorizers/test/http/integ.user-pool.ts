import * as path from 'path';
import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

/*
 * Stack verification steps:
 * * `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: deny' <url>` should return 403
 * * `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: allow' <url>` should return 200
 */

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'AuthorizerInteg');

const userPool = new cognito.UserPool(stack, 'userpool');
const userPoolForDefaultAuthorizer = new cognito.UserPool(stack, 'userpoolForDefaultAuthorizer');

const authorizer = new HttpUserPoolAuthorizer('UserPoolAuthorizer', userPool);
const defaultAuthorizer = new HttpUserPoolAuthorizer('UserPoolDefaultAuthorizer', userPoolForDefaultAuthorizer);

const httpApi = new HttpApi(stack, 'MyHttpApi');
const httpApiWithDefaultAuthorizer = new HttpApi(stack, 'MyHttpApiWithDefaultAuthorizer', {
  defaultAuthorizer,
  defaultAuthorizationScopes: ['scope1', 'scope2'],
});

const handler = new lambda.Function(stack, 'lambda', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, '..', 'integ.user-pool.handler'), { exclude: ['*.ts'] }),
});

httpApi.addRoutes({
  path: '/',
  methods: [HttpMethod.GET],
  integration: new HttpLambdaIntegration('RootIntegratin', handler),
  authorizer,
});

new HttpRoute(stack, 'Route', {
  httpApi: httpApiWithDefaultAuthorizer,
  routeKey: HttpRouteKey.with('/v1/mything/{proxy+}', HttpMethod.ANY),
  integration: new HttpLambdaIntegration('RootIntegration', handler),
});

new CfnOutput(stack, 'AuthorizerId', {
  value: authorizer.authorizerId,
});
new CfnOutput(stack, 'AuthorizationType', {
  value: authorizer.authorizationType,
});

import * as path from 'path';
import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

/*
 * Stack verification steps:
 * * `curl -H 'X-API-Key: 123' <url>` should return 200
 * * `curl <url>` should return 401
 * * `curl -H 'X-API-Key: 1234' <url>` should return 403
 */

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'AuthorizerInteg');

const authHandler = new lambda.Function(stack, 'auth-function', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, '..', 'auth-handler'), { exclude: ['*.ts'] }),
});

const authorizer = new HttpLambdaAuthorizer('LambdaAuthorizer', authHandler, {
  authorizerName: 'my-simple-authorizer',
  identitySource: ['$request.header.X-API-Key'],
  responseTypes: [HttpLambdaResponseType.SIMPLE],
});

const defaultAuthorizer = new HttpLambdaAuthorizer('LambdaDefaultAuthorizer', authHandler, {
  authorizerName: 'my-simple-authorizer',
  identitySource: ['$request.header.X-API-Key'],
  responseTypes: [HttpLambdaResponseType.SIMPLE],
});

const httpApi = new HttpApi(stack, 'MyHttpApi');
const httpApiWithDefaultAuthorizer = new HttpApi(stack, 'MyHttpApiWithDefaultAuthorizer', {
  defaultAuthorizer,
});

const handler = new lambda.Function(stack, 'lambda', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, '..', 'integ.lambda.handler'), { exclude: ['*.ts'] }),
});

httpApi.addRoutes({
  path: '/',
  methods: [HttpMethod.GET],
  integration: new HttpLambdaIntegration('RootIntegration', handler),
  authorizer,
});

new HttpRoute(stack, 'Route', {
  httpApi: httpApiWithDefaultAuthorizer,
  routeKey: HttpRouteKey.with('/v1/mything/{proxy+}', HttpMethod.ANY),
  integration: new HttpLambdaIntegration('RootIntegration', handler),
});

new CfnOutput(stack, 'URL', {
  value: httpApi.url!,
});
new CfnOutput(stack, 'URLWithDefaultAuthorizer', {
  value: httpApiWithDefaultAuthorizer.url!,
});
new CfnOutput(stack, 'AuthorizerId', {
  value: authorizer.authorizerId,
});
new CfnOutput(stack, 'AuthorizationType', {
  value: authorizer.authorizationType,
});

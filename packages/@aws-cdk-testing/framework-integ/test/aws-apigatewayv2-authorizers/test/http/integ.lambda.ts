import * as path from 'path';
import { AuthorizerPayloadVersion, HttpApi, HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';
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

const app = new App();
const stack = new Stack(app, 'AuthorizerInteg');

const authHandler = new lambda.Function(stack, 'auth-function', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, '..', 'auth-handler'), { exclude: ['*.ts'] }),
});

const defaultAuthorizer = new HttpLambdaAuthorizer('LambdaDefaultAuthorizer', authHandler, {
  authorizerName: 'my-simple-authorizer',
  identitySource: ['$request.header.X-API-Key'],
  responseType: HttpLambdaResponseType.SIMPLE,
});

const httpApiWithDefaultAuthorizer = new HttpApi(stack, 'MyHttpApiWithDefaultAuthorizer', {
  defaultAuthorizer,
});

const handler = new lambda.Function(stack, 'lambda', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, '..', 'integ.lambda.handler'), { exclude: ['*.ts'] }),
});

new HttpRoute(stack, 'Route', {
  httpApi: httpApiWithDefaultAuthorizer,
  routeKey: HttpRouteKey.with('/v1/mything/{proxy+}', HttpMethod.ANY),
  integration: new HttpLambdaIntegration('RootIntegration', handler),
});

new CfnOutput(stack, 'URLWithDefaultAuthorizer', {
  value: httpApiWithDefaultAuthorizer.url!,
});

const attributes: [AuthorizerPayloadVersion | undefined, HttpLambdaResponseType | undefined][] = [
  [undefined, undefined],
  [undefined, HttpLambdaResponseType.SIMPLE],
  [undefined, HttpLambdaResponseType.IAM],
  [AuthorizerPayloadVersion.VERSION_1_0, undefined],
  [AuthorizerPayloadVersion.VERSION_1_0, HttpLambdaResponseType.IAM],
  [AuthorizerPayloadVersion.VERSION_2_0, undefined],
  [AuthorizerPayloadVersion.VERSION_2_0, HttpLambdaResponseType.SIMPLE],
  [AuthorizerPayloadVersion.VERSION_2_0, HttpLambdaResponseType.IAM],
];

attributes.forEach(([payloadFormatVersion, responseType], index) => {
  const authorizer = new HttpLambdaAuthorizer(`LambdaAuthorizer${index}`, authHandler, {
    authorizerName: `my-simple-authorizer${index}`,
    identitySource: ['$request.header.X-API-Key'],
    payloadFormatVersion,
    responseType,
  });

  const httpApi = new HttpApi(stack, `MyHttpApi${index}`);

  httpApi.addRoutes({
    path: '/',
    methods: [HttpMethod.GET],
    integration: new HttpLambdaIntegration(`RootIntegration${index}`, handler),
    authorizer,
  });

  new CfnOutput(stack, `URL${index}`, {
    value: httpApi.url!,
  });
});
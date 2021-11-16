import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../../lib';

class ExampleComIntegration implements apigatewayv2.IHttpRouteIntegration {
  public bind(): apigatewayv2.HttpRouteIntegrationConfig {
    return {
      type: apigatewayv2.HttpIntegrationType.HTTP_PROXY,
      payloadFormatVersion: apigatewayv2.PayloadFormatVersion.VERSION_1_0,
      method: apigatewayv2.HttpMethod.GET,
      uri: 'https://www.example.com/',
    };
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'IntegApiGatewayV2Iam');
const user = new iam.User(stack, 'User');
const userAccessKey = new iam.CfnAccessKey(stack, 'UserAccess', {
  userName: user.userName,
});

const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

const fooRoute = new apigatewayv2.HttpRoute(stack, 'FooRoute', {
  httpApi,
  integration: new ExampleComIntegration(),
  routeKey: apigatewayv2.HttpRouteKey.with('/foo'),
});

fooRoute.grantInvoke(user);

const booksRoute = new apigatewayv2.HttpRoute(stack, 'BooksRoute', {
  httpApi,
  integration: new ExampleComIntegration(),
  routeKey: apigatewayv2.HttpRouteKey.with('/books/{book}'),
});

booksRoute.grantInvoke(user);


const curlCmd = 'docker run --rm curlimages/curl -s -o/dev/null -w"%{http_code}"';
const authString = `--user "${userAccessKey.ref}:${userAccessKey.attrSecretAccessKey}" --aws-sigv4 "aws:amz:${stack.region}:execute-api"`;

new cdk.CfnOutput(stack, 'TestScript', {
  value: `
echo Expect 403: $(${curlCmd} "${httpApi.url!}foo")
echo Expect 200: $(${curlCmd} "${httpApi.url!}foo" ${authString})
echo Expect 403: $(${curlCmd} "${httpApi.url!}books/something")
echo Expect 200: $(${curlCmd} "${httpApi.url!}books/something" ${authString})`,
});

// To verify, run the script emitted from TestScript and check that it outputs this:
// Expect 403: 403
// Expect 200: 200
// Expect 403: 403
// Expect 200: 200
import { WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';

/*
 * A single WebSocketLambdaIntegration instance is reused across the $connect,
 * $disconnect and $default routes. Each route must get its own
 * AWS::Lambda::Permission so API Gateway can invoke the function for every route
 * (previously only $connect received a permission, causing API_CONFIGURATION_ERROR
 * for the other routes at runtime).
 */
const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'WebSocketApiSharedIntegrationInteg');

const handler = new lambda.Function(stack, 'Handler', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event) { console.log(event); return { statusCode: 200, body: "ok" }; };'),
});

const integration = new WebSocketLambdaIntegration('SharedIntegration', handler);

const webSocketApi = new WebSocketApi(stack, 'mywsapi', {
  connectRouteOptions: { integration },
  disconnectRouteOptions: { integration },
  defaultRouteOptions: { integration },
});

const stage = new WebSocketStage(stack, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

new CfnOutput(stack, 'ApiEndpoint', { value: stage.url });

const integ = new IntegTest(app, 'websocket-lambda-shared-integration', {
  testCases: [stack],
});

// All three routes share one function. Its resource policy should grant
// apigateway invoke permission for each route key, including $disconnect and
// $default which previously did not receive a permission.
const policy = integ.assertions.awsApiCall('Lambda', 'getPolicy', {
  FunctionName: handler.functionName,
});
policy.expect(ExpectedResult.objectLike({
  Policy: Match.serializedJson(Match.objectLike({
    Statement: Match.arrayWith([
      Match.objectLike({ Condition: { ArnLike: { 'AWS:SourceArn': Match.stringLikeRegexp('.*/\\*\\$connect$') } } }),
      Match.objectLike({ Condition: { ArnLike: { 'AWS:SourceArn': Match.stringLikeRegexp('.*/\\*\\$disconnect$') } } }),
      Match.objectLike({ Condition: { ArnLike: { 'AWS:SourceArn': Match.stringLikeRegexp('.*/\\*\\$default$') } } }),
    ]),
  })),
}));

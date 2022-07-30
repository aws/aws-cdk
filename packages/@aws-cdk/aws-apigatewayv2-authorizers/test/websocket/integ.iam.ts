import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
// import * as iam from '@aws-cdk/aws-iam';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { WebSocketIamAuthorizer } from '../../lib';

// class ExampleComIntegration extends apigatewayv2.WebSocketRouteIntegration {
//   public bind(): apigatewayv2.WebSocketRouteIntegrationConfig {
//     return {
//       type: apigatewayv2.WebSocketIntegrationType.AWS_PROXY,
//       uri: 'https://www.example.com/',
//     };
//   }
// }

const app = new cdk.App();
const stack = new cdk.Stack(app, 'IntegApiGatewayV2Iam');
// const user = new iam.User(stack, 'User');

const webSocketApi = new apigatewayv2.WebSocketApi(stack, 'WebSocketApi');

const handler = new Function(stack, 'auth-function', {
  runtime: Runtime.NODEJS_14_X,
  code: Code.fromInline('exports.handler = () => {return true}'),
  handler: 'index.handler',
});

webSocketApi.addRoute('$connect', {
  integration: new WebSocketLambdaIntegration('WebSocketLambdaIntegration', handler),
  authorizer: new WebSocketIamAuthorizer(),
});

// const handlerRole = new iam.Role(stack, 'InvokeApiRole', {
//   assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
// });
// handlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'));

new integ.IntegTest(app, 'ApiGatewayV2WebSocketIamTest', {
  testCases: [stack],
});

app.synth();

/*
 * Stack verification steps:
 * * Get cURL version 7.75.0 or later so you can use the --aws-sigv4 option
 * * Curl <url>/foo without sigv4 and expect a 403
 * * Curl <url>/books/something without sigv4 and expect a 403
 * * Curl <url>/foo with sigv4 from the authorized user and expect 200
 * * Curl <url>/books/something with sigv4 from the authorized user and expect 200
 *
 * Reference:
 * * Using cURL 7.75.0 or later via the official docker image: docker run --rm curlimages/curl -s -o/dev/null -w"%{http_code}" <url>
 * * Args to enable sigv4 with authorized credentials: --user "$TESTACCESSKEYID:$TESTSECRETACCESSKEY" --aws-sigv4 "aws:amz:$TESTREGION:execute-api"
 */

import { WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import * as iam from 'aws-cdk-lib/aws-iam';
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
//
// Lambda getPolicy returns a large response that exceeds the 4096-byte
// CloudFormation custom resource limit. Using outputPaths to scope to
// 'Policy' does not help because deepParseJson expands the JSON-encoded
// Policy string before flattening, so assertAtPath/expect cannot match.
// Instead, a small verification Lambda extracts just the source ARNs.
const verifier = new lambda.Function(stack, 'PolicyVerifier', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: new lambda.InlineCode(`
const { LambdaClient, GetPolicyCommand } = require('@aws-sdk/client-lambda');
exports.handler = async () => {
  const client = new LambdaClient();
  const res = await client.send(new GetPolicyCommand({ FunctionName: process.env.TARGET_FUNCTION }));
  const policy = JSON.parse(res.Policy);
  const sourceArns = policy.Statement
    .map(s => s.Condition?.ArnLike?.['AWS:SourceArn'] || '')
    .sort();
  return { sourceArns };
};
  `),
  environment: {
    TARGET_FUNCTION: handler.functionName,
  },
});
verifier.addToRolePolicy(new iam.PolicyStatement({
  actions: ['lambda:GetPolicy'],
  resources: [handler.functionArn],
}));

const verify = integ.assertions.invokeFunction({
  functionName: verifier.functionName,
});

verify.expect(ExpectedResult.objectLike({
  Payload: Match.serializedJson(Match.objectLike({
    sourceArns: Match.arrayWith([
      Match.stringLikeRegexp('.*/\\*\\$connect$'),
      Match.stringLikeRegexp('.*/\\*\\$default$'),
      Match.stringLikeRegexp('.*/\\*\\$disconnect$'),
    ]),
  })),
}));

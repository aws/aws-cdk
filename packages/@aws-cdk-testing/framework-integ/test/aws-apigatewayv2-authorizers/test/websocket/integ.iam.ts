import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { WebSocketIamAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'IntegApiGatewayV2Iam');
const user = new iam.User(stack, 'User');
const userAccessKey = new iam.AccessKey(stack, 'UserAccess', {
  user,
});

const handler = new Function(stack, 'auth-function', {
  runtime: Runtime.NODEJS_18_X,
  code: Code.fromInline('exports.handler = () => {return true}'),
  handler: 'index.handler',
});

const webSocketApi = new apigatewayv2.WebSocketApi(stack, 'WebSocketApi', {
  connectRouteOptions: {
    integration: new WebSocketLambdaIntegration('WebSocketLambdaIntegration', handler),
    authorizer: new WebSocketIamAuthorizer(),
  },
});

const arn = Stack.of(stack).formatArn({
  service: 'execute-api',
  resource: webSocketApi.apiId,
});

user.attachInlinePolicy(new iam.Policy(stack, 'AllowInvoke', {
  statements: [
    new iam.PolicyStatement({
      actions: ['execute-api:Invoke'],
      effect: iam.Effect.ALLOW,
      resources: [arn],
    }),
  ],
}));

new integ.IntegTest(app, 'ApiGatewayV2WebSocketIamTest', {
  testCases: [stack],
});

new cdk.CfnOutput(stack, 'TESTACCESSKEYID', {
  value: userAccessKey.accessKeyId,
});

new cdk.CfnOutput(stack, 'TESTSECRETACCESSKEY', {
  value: userAccessKey.secretAccessKey.unsafeUnwrap(),
});

new cdk.CfnOutput(stack, 'TESTREGION', {
  value: stack.region,
});

app.synth();

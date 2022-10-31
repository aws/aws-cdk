import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { AuthType, HttpMethod, CallApiGatewayHttpApiEndpoint } from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return the string \"hello, world!\"
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CallHttpApiInteg');
const httpApi = new apigatewayv2.HttpApi(stack, 'MyHttpApi');

const handler = new lambda.Function(stack, 'HelloHandler', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "hello, world!" }; };'),
});
httpApi.addRoutes({
  path: '/',
  integration: new integrations.HttpLambdaIntegration('DefaultIntegration', handler),
});

const callEndpointJob = new CallApiGatewayHttpApiEndpoint(stack, 'Call APIGW', {
  apiId: httpApi.apiId,
  apiStack: cdk.Stack.of(httpApi),
  method: HttpMethod.GET,
  authType: AuthType.IAM_ROLE,
  outputPath: sfn.JsonPath.stringAt('$.ResponseBody'),
});

const chain = sfn.Chain.start(callEndpointJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

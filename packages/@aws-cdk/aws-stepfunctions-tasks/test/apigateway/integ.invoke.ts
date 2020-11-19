import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayInvoke, AuthType, HttpMethod } from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED and a query-execution-id
 * * aws apigateway test-invoke-method --rest-api-id <value> --resource-id <value> --http-method <value>: should return the same response as the state machine
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-apigateway-invoke-integ');
const restApi = new apigateway.RestApi(stack, 'MyRestApi');

const hello = new apigateway.LambdaIntegration(new lambda.Function(stack, 'Hello', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.inline(`exports.handler = ${helloCode}`),
}));

function helloCode(_event: any, _context: any, callback: any) {
  return callback(undefined, {
    statusCode: 200,
    body: 'hello, world!',
  });
}
restApi.root.addMethod('ANY', hello);

const invokeJob = new ApiGatewayInvoke(stack, 'Invoke APIGW', {
  api: restApi,
  apiEndpoint: restApi.restApiId,
  stageName: 'prod',
  method: HttpMethod.GET,
  authType: AuthType.IAM_ROLE,
});

const chain = sfn.Chain.start(invokeJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

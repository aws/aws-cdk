import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayInvoke, HttpMethod } from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED and a query-execution-id
 * * aws apigateway test-invoke-method --rest-api-id <value> --resource-id <value> --http-method <value>: should return the same response as the state machine
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-apigateway-invoke-integ');

const invokeJob = new ApiGatewayInvoke(stack, 'Invoke APIGW', {
  apiEndpoint: 'apiid.execute-api.us-east-1.amazonaws.com',
  stage: 'prod',
  method: HttpMethod.GET,
});

const chain = sfn.Chain.start(invokeJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

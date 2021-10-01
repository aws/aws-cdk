import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { StateMachine, Chain, StateMachineType, Pass } from '@aws-cdk/aws-stepfunctions';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { StepFunctionsStartSyncExecutionIntegration } from '../../lib';

/*
 * Stack verification steps:
 * "curl <endpoint-in-the-stack-output>" should return 'success'
 */

const app = new App();

const stack = new Stack(app, 'integ-aws-service');

const stateMachine = new StateMachine(stack, 'MyStateMachine', {
  definition: Chain.start(new Pass(stack, 'Pass')),
  stateMachineType: StateMachineType.EXPRESS,
});

const endpoint = new HttpApi(stack, 'AwsIntegrationApi', {
  defaultIntegration: new StepFunctionsStartSyncExecutionIntegration(stack, {
    stateMachine: stateMachine,
    input: '$request.body',
  }),
});

new CfnOutput(stack, 'Endpoint', {
  value: endpoint.url!,
});
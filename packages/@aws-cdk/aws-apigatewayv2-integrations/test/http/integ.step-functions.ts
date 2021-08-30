import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { StateMachine, StateMachineType, Wait, WaitTime } from '@aws-cdk/aws-stepfunctions';
import { App, CfnOutput, Duration, Stack } from '@aws-cdk/core';
import { Mapping, StateMachineMappingExpression, StepFunctionsStartExecutionIntegration, StepFunctionsStartSyncExecutionIntegration, StepFunctionsStopExecutionIntegration, StringMappingExpression } from '../../lib';

// Stack verification steps
// <step-1> deploy the stack and find the API Url from the stack outputs
// <step-2> send a POST request to <api-url>/sync and confirm that the standard step function
//   is started. Note the execution ARN
// <step-3> send a DELETE request to <api-url>/?execution=<exection-arn>; confirm that the function
//   is stopped
// <step-4> send a POST request to <api-url>/sync; confirm that it completes after 5 seconds.

const app = new App();
const stack = new Stack(app, 'integ-step-functions');

const stateMachine = new StateMachine(stack, 'StateMachine', {
  definition: new Wait(stack, 'Waiter', {
    time: WaitTime.duration(Duration.seconds(30)),
  }),
});
const role = new Role(stack, 'StateMachineRole', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});
stateMachine.grantStartExecution(role);
stateMachine.grantExecution(role, 'states:StopExecution');

const expressMachine = new StateMachine(stack, 'Express', {
  definition: new Wait(stack, 'ExpressWait', {
    time: WaitTime.duration(Duration.seconds(5)),
  }),
  stateMachineType: StateMachineType.EXPRESS,
});
expressMachine.grant(role, 'states:StartSyncExecution');

const httpApi = new HttpApi(stack, 'HttpApi');
httpApi.addRoutes({
  path: '/async',
  methods: [HttpMethod.POST],
  integration: new StepFunctionsStartExecutionIntegration({
    role,
    stateMachine: StateMachineMappingExpression.fromStateMachine(stateMachine),
  }),
});

httpApi.addRoutes({
  path: '/sync',
  methods: [HttpMethod.POST],
  integration: new StepFunctionsStartSyncExecutionIntegration({
    role,
    stateMachine: StateMachineMappingExpression.fromStateMachine(expressMachine),
  }),
});

httpApi.addRoutes({
  path: '/',
  methods: [HttpMethod.DELETE],
  integration: new StepFunctionsStopExecutionIntegration({
    role,
    executionArn: StringMappingExpression.fromMapping(Mapping.fromQueryParam('execution')),
  }),
});

new CfnOutput(stack, 'HttpApiUrl', {
  value: httpApi.apiEndpoint,
});

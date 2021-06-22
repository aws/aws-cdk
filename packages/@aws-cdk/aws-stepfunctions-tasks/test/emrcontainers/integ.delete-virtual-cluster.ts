import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { firstAPI } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-new-connector-first-api-integ');

const firstApiJob = new firstAPI(stack, 'taskName' {
  requestParamater1: 'RequestParamater1',
  requestParamater2: 'RequestParamater2',
})

const chain = sfn.Chain.start(firstApiJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
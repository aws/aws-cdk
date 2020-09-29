import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as sfn from '../lib';
/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 * -- aws iam get-role-policy --role-name <role-name> --policy-name <policy-name> has all actions mapped to respective resources.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const wait = new sfn.Wait(stack, 'wait time', {
  time: sfn.WaitTime.secondsPath('$.waitSeconds'),
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definition: wait,
});

stateMachine.grantRead(role);
stateMachine.grant(role, 'states:SendTaskSuccess');

app.synth();

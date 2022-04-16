import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as sfn from '../lib';
import { Parallel, Pass } from '../lib';
/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 * -- aws iam get-role-policy --role-name <role-name> --policy-name <policy-name> has all actions mapped to respective resources.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const branch1 = new Pass(stack, 'branch1');
const branch2 = new Pass(stack, 'branch2');

const parallelStep = new Parallel(stack, 'ParallelStep', {
  parameters: {
    static: 'value',
    dynamic: sfn.JsonPath.stringAt('$.dynamic'),
  },
}).branch(branch1, branch2);

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definition: parallelStep,
});

stateMachine.grantRead(role);
stateMachine.grant(role, 'states:SendTaskSuccess');

app.synth();

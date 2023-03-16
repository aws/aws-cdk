import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { FakeTask } from './fake-task';
import * as sfn from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-state-machine-credentials-integ');

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});

new sfn.StateMachine(stack, 'StateMachineWithLiteralCredentials', {
  definition: new FakeTask(stack, 'FakeTaskWithLiteralCredentials', { credentials: { role: sfn.TaskRole.fromRole(role) } }),
  timeout: cdk.Duration.seconds(30),
});

const crossAccountRole = iam.Role.fromRoleArn(stack, 'CrossAccountRole', 'arn:aws:iam::123456789012:role/CrossAccountRole');

new sfn.StateMachine(stack, 'StateMachineWithCrossAccountLiteralCredentials', {
  definition: new FakeTask(stack, 'FakeTaskWithCrossAccountLiteralCredentials', { credentials: { role: sfn.TaskRole.fromRole(crossAccountRole) } }),
  timeout: cdk.Duration.seconds(30),
});

new sfn.StateMachine(stack, 'StateMachineWithJsonPathCredentials', {
  definition: new FakeTask(stack, 'FakeTaskWithJsonPathCredentials', { credentials: { role: sfn.TaskRole.fromRoleArnJsonPath('$.RoleArn') } }),
  timeout: cdk.Duration.seconds(30),
});

new IntegTest(app, 'StateMachineCredentials', { testCases: [stack] });

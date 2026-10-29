import { App, ArnFormat, Duration, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Verifies that a state machine using its default execution role can run a task
 * with `credentials` that assume a role in another account.
 *
 * Regression test for https://github.com/aws/aws-cdk/issues/39526
 *
 * How to run this integ test:
 * - you need 2 AWS accounts: a testing account and a cross account
 * - in the cross account, run:
 *   `cdk bootstrap aws://<<cross_account>>/<<region>> --trust <<testing_account>> --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'`
 * - set CDK_INTEG_ACCOUNT=<<testing_account>> and CDK_INTEG_CROSS_ACCOUNT=<<cross_account>>
 * - run the integ test using the testing account credentials
 * - before you commit, unset both variables, run the integ test in dry run mode, and then push the snapshot
 */

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';

// As the integ-runner doesn't provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';
const region = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;

// Literal names, so the testing stack can reference the cross account resources without a physical name generator.
const targetStateMachineName = 'CrossAccountCredentialsTarget';
const taskRoleName = 'CrossAccountCredentialsTaskRole';

const app = new App();

const crossAccountStack = new Stack(app, 'StateMachineCrossAccountCredentialsTargetStack', {
  env: { account: crossAccount, region },
});

const targetStateMachine = new sfn.StateMachine(crossAccountStack, 'TargetStateMachine', {
  stateMachineName: targetStateMachineName,
  definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Pass(crossAccountStack, 'Pass')),
});

const taskRole = new iam.Role(crossAccountStack, 'TaskRole', {
  roleName: taskRoleName,
  assumedBy: new iam.AccountPrincipal(account),
});
targetStateMachine.grantStartExecution(taskRole);

const testingStack = new Stack(app, 'StateMachineCrossAccountCredentialsStack', {
  env: { account, region },
});
testingStack.addStackDependency(crossAccountStack);

const importedTaskRole = iam.Role.fromRoleArn(testingStack, 'ImportedTaskRole', testingStack.formatArn({
  service: 'iam',
  region: '',
  account: crossAccount,
  resource: 'role',
  resourceName: taskRoleName,
}), { mutable: false });

const importedTargetStateMachine = sfn.StateMachine.fromStateMachineArn(testingStack, 'ImportedTargetStateMachine', testingStack.formatArn({
  service: 'states',
  account: crossAccount,
  resource: 'stateMachine',
  resourceName: targetStateMachineName,
  arnFormat: ArnFormat.COLON_RESOURCE_NAME,
}));

// Uses the default execution role, whose trust policy is under test.
const stateMachine = new sfn.StateMachine(testingStack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(new tasks.StepFunctionsStartExecution(testingStack, 'StartTargetExecution', {
    stateMachine: importedTargetStateMachine,
    credentials: { role: sfn.TaskRole.fromRole(importedTaskRole) },
  })),
});

// The assertions must run in the testing account, where the state machine lives.
const assertionStack = new Stack(app, 'StateMachineCrossAccountCredentialsAssertionStack', {
  env: { account, region },
});

const test = new IntegTest(app, 'StateMachineCrossAccountCredentials', {
  testCases: [crossAccountStack, testingStack],
  assertionStack,
});

const start = test.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});

test.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: Duration.minutes(2),
  interval: Duration.seconds(10),
});

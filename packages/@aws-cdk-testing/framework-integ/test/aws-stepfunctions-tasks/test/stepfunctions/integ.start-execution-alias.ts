import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { StepFunctionsStartExecution } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-sfn-start-execution-alias');

const child = new sfn.StateMachine(stack, 'Child', {
  definition: new sfn.Pass(stack, 'Pass'),
});

const stateMachineVersion = new sfn.CfnStateMachineVersion(stack, 'MyStateMachineVersion', {
  stateMachineRevisionId: child.stateMachineRevisionId,
  stateMachineArn: child.stateMachineArn,
});

const stateMachineAlias = new sfn.CfnStateMachineAlias(stack, 'MyStateMachineAlias', {
  name: 'alias',
  routingConfiguration: [
    {
      stateMachineVersionArn: stateMachineVersion.attrArn,
      weight: 100,
    },
  ],
});

new StepFunctionsStartExecution(stack, 'StartExecutionTask', {
  stateMachine: child,
  stateMachineArn: stateMachineAlias.attrArn,
  input: sfn.TaskInput.fromObject({
    foo: 'bar',
  }),
  name: 'myExecutionTask',
});

new sfn.StateMachine(stack, 'Parent', {
  definition: new StepFunctionsStartExecution(stack, 'Task', {
    stateMachine: child,
    input: sfn.TaskInput.fromObject({
      hello: sfn.JsonPath.stringAt('$.hello'),
    }),
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  }),
});

new IntegTest(app, 'cdk-integ-sfn-start-execution-alias', {
  testCases: [stack],
});

app.synth();

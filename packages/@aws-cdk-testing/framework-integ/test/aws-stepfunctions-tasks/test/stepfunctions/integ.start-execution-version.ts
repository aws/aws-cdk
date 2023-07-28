import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { StepFunctionsStartExecution } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-sfn-start-execution-alias');

const stateMachine = new sfn.StateMachine(stack, 'Child', {
  definition: new sfn.Pass(stack, 'Pass'),
});

const stateMachineVersion = new sfn.CfnStateMachineVersion(stack, 'MyStateMachineVersion', {
  stateMachineRevisionId: stateMachine.stateMachineRevisionId,
  stateMachineArn: stateMachine.stateMachineArn,
});

new StepFunctionsStartExecution(stack, 'StartExecutionTask', {
  stateMachine: stateMachine,
  stateMachineArn: stateMachineVersion.attrArn,
  input: sfn.TaskInput.fromObject({
    foo: 'bar',
  }),
  name: 'myExecutionTask',
});

new IntegTest(app, 'cdk-integ-sfn-start-execution-alias', {
  testCases: [stack],
});

app.synth();

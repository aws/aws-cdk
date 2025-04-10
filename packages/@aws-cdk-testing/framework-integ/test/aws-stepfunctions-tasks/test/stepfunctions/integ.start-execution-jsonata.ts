import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { StepFunctionsStartExecution } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'integ-sfn-start-execution-jsonata');

const child = new sfn.StateMachine(stack, 'Child', {
  definition: new sfn.Pass(stack, 'Pass'),
});

const parent = new sfn.StateMachine(stack, 'Parent', {
  definition: StepFunctionsStartExecution.jsonata(stack, 'Task', {
    stateMachine: child,
    input: sfn.TaskInput.fromObject({
      hello: '{% $states.input.hello %}',
    }),
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    associateWithParent: true,
  }),
});

const integTest = new integ.IntegTest(app, 'integ-sfn-start-execution-jsonata-integ', {
  testCases: [stack],
});

const startExecutionCall = integTest.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: parent.stateMachineArn,
  input: JSON.stringify({
    hello: 'world',
  }),
});

integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: startExecutionCall.getAttString('executionArn'),
  includedData: 'METADATA_ONLY',
})
  .expect(integ.ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  }));

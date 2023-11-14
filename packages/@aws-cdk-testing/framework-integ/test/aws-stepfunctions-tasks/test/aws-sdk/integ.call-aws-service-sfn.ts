import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { CallAwsService, StepFunctionsStartExecution } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-call-aws-service-sfn-integ');

const task = new CallAwsService(stack, 'SendTaskSuccess', {
  service: 'sfn',
  action: 'sendTaskSuccess',
  iamResources: ['*'],
  parameters: {
    Output: sfn.JsonPath.objectAt('$.output'),
    TaskToken: sfn.JsonPath.stringAt('$.taskToken'),
  },
});

const childStateMachine = new sfn.StateMachine(stack, 'ChildStateMachine', {
  definition: task,
});

const stateMachine = new sfn.StateMachine(stack, 'ParentStateMachine', {
  definition: new StepFunctionsStartExecution(stack, 'StepFunctionsStartExecution', {
    stateMachine: childStateMachine,
    integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    input: sfn.TaskInput.fromObject({
      output: sfn.JsonPath.entirePayload,
      taskToken: sfn.JsonPath.taskToken,
    }),
  }),
});

// THEN
const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
const res = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});
const executionArn = res.getAttString('executionArn');
integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn,
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(10),
  interval: cdk.Duration.seconds(3),
});

app.synth();

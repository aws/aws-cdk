import * as events from '@aws-cdk/aws-events';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { EventBridgePutEvents } from '../../lib';

/*
 * Stack verification steps :
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> : should return status as SUCCEEDED
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-eventbridge-put-events-integ');

const eventBus = new events.EventBus(stack, 'EventBus', {
  eventBusName: 'MyEventBus1',
});

const putEventsTask = new EventBridgePutEvents(stack, 'Put Custom Events', {
  entries: [{
    // Entry with no event bus specified
    detail: sfn.TaskInput.fromObject({
      Message: 'Hello from Step Functions!',
    }),
    detailType: 'MessageFromStepFunctions',
    source: 'step.functions',
  }, {
    // Entry with EventBus provided as object
    detail: sfn.TaskInput.fromObject({
      Message: 'Hello from Step Functions!',
    }),
    eventBus,
    detailType: 'MessageFromStepFunctions',
    source: 'step.functions',
  }],
});

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: putEventsTask,
  timeout: cdk.Duration.seconds(30),
});


const testCase = new IntegTest(app, 'PutEvents', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assert.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assert.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// assert the results
describe.assert(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
}));

app.synth();

import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StepFunctionsStartExecution } from '../lib/step-functions-start-execution';

/*
 * Stack verification steps:
 * 1. The step functions create a Parameter 'MyParameter' in SystemsManager(SSM) with Value '🌥️':
 * 2. The step function is invoked by the scheduler once.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-sfn-start-execution');


const payload = {
  Name: "MyParameter",
  Value: '🌥️',
};

const putParameterStep = new tasks.CallAwsService(stack, 'PutParameter', {
  service: 'ssm',
  action: 'putParameter',
  iamResources: ['*'],
  parameters: {
    "Name.$": '$.Name',
    "Value.$": '$.Value',
    Type: 'String',
    Overwrite: true,
  },
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(putParameterStep)
})

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.at(new Date()),
  target: new StepFunctionsStartExecution(stateMachine, {
    input: scheduler.ScheduleTargetInput.fromObject(payload),
  }),
});

const integrationTest = new IntegTest(app, 'integrationtest-stepfunctions-start-execution', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const getParameter = integrationTest.assertions.awsApiCall('SSM', 'getParameter', {
  Name: payload.Name,
});

// Verifies that expected parameter is created by the invoked step function
getParameter.expect(ExpectedResult.objectLike({
  Parameter: {
    Name: payload.Name,
    Value: payload.Value,
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
});

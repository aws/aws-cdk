import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StepFunctionsStartExecution } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * 1. Create a parameter 'MyParameter' in SystemsManager(SSM) with value '🌧️'
 * 2. The step functions updates the Parameter 'MyParameter' from value '🌧️' to '🌈':
 * 3. The step function is invoked by the scheduler every 10 minutes (but it needs only one successful execution to pass).
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-sfn-start-execution');

const payload = {
  Name: 'MyParameter',
  Value: '🌈',
};

new ssm.StringParameter(stack, 'MyParameter', {
  parameterName: payload.Name,
  stringValue: '🌧️',
});

const putParameterStep = new tasks.CallAwsService(stack, 'PutParameter', {
  service: 'ssm',
  action: 'putParameter',
  iamResources: ['*'],
  parameters: {
    'Name.$': '$.Name',
    'Value.$': '$.Value',
    'Type': 'String',
    'Overwrite': true,
  },
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(putParameterStep),
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(10)),
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

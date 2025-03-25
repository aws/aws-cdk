import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { EventBridgePutEvents, EventBridgePutEventsEntry } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * 1. Create a parameter 'MyEventBridgePutParameter' in SystemsManager(SSM) with value '🐶'
 * 2. Create a step function which updates the Parameter 'MyEventBridgePutParameter' from value '🐶' to '😺':
 * 3. Create an event bus and a rule which triggers the step function every 10 minutes (but it needs only one successful execution to pass)
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-event-bridge-put-events');

const stateMachinePayload = {
  Name: 'MyEventBridgePutParameter',
  Value: '😺',
};

const parameter = new ssm.StringParameter(stack, 'MyParameter', {
  parameterName: stateMachinePayload.Name,
  stringValue: '🐶',
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(new tasks.CallAwsService(stack, 'PutParameter', {
    service: 'ssm',
    action: 'putParameter',
    iamResources: ['*'],
    parameters: {
      'Name.$': '$.Name',
      'Value.$': '$.Value',
      'Type': 'String',
      'Overwrite': true,
    },
  })),
});

const eventBus = new events.EventBus(stack, 'EventBus', {
  eventBusName: 'EmojisTransformationEventBus',
});

const rule = new events.Rule(stack, 'Rule', {
  description: `Trigger the step function ${stateMachine.stateMachineName} every 10 minutes, which transforms the value of the parameter ${parameter.parameterName} from 🐶 to 😺`,
  ruleName: 'Transforms_dog_to_cat',
  eventBus: eventBus,
  eventPattern: {
    detailType: ['🐶➡️😺'],
  },
  targets: [new targets.SfnStateMachine(stateMachine, {
    input: events.RuleTargetInput.fromObject(stateMachinePayload),
  })],
});

const eventEntry: EventBridgePutEventsEntry = {
  eventBus,
  source: 'emoji-transformation',
  detail: scheduler.ScheduleTargetInput.fromObject({ foo: 'bar' }),
  detailType: '🐶➡️😺',
};

const scheduleRule = new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(10)),
  target: new EventBridgePutEvents(eventEntry, {}),
});

scheduleRule.node.addDependency(rule); // the schedule rule must be created after the event bus rule, so that the event bus rule can trigger the step function

const integrationTest = new IntegTest(app, 'integrationtest-event-bridge-put-events', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const getParameter = integrationTest.assertions.awsApiCall('SSM', 'getParameter', {
  Name: stateMachinePayload.Name,
});

// Verifies that expected parameter is created by the invoked step function
getParameter.expect(ExpectedResult.objectLike({
  Parameter: {
    Name: stateMachinePayload.Name,
    Value: stateMachinePayload.Value,
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
});

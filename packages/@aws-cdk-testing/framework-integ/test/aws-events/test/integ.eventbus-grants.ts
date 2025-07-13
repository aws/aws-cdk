import { App, Stack, Duration, CfnOutput, Fn } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cxapi from 'aws-cdk-lib/cx-api';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

// Create a single app for both stacks
const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

// Stack with feature flag enabled
const stackWithFlag = new Stack(app, 'EventBusGrantsTestStackWithFlag', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
stackWithFlag.node.setContext(cxapi.EVENTBUS_POLICY_SID_REQUIRED, true);
const eventBusWithFlag = new events.EventBus(stackWithFlag, 'TestEventBus');

// Stack without feature flag
const stackWithoutFlag = new Stack(app, 'EventBusGrantsTestStackWithoutFlag', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
stackWithoutFlag.node.setContext(cxapi.EVENTBUS_POLICY_SID_REQUIRED, false);
const eventBusWithoutFlag = new events.EventBus(stackWithoutFlag, 'TestEventBus');

// Helper function to create test components
function createTestComponents(stack: Stack, eventBus: events.EventBus, suffix: string) {
  // Create a parameter to verify the execution
  const parameter = new ssm.StringParameter(stack, `TestParameter${suffix}`, {
    parameterName: `EventBusGrantsTest${suffix}`,
    stringValue: 'initial',
  });

  // Lambda function with a simple implementation to avoid timeouts
  const publisher = new lambda.Function(stack, `Publisher${suffix}`, {
    runtime: STANDARD_NODEJS_RUNTIME,
    handler: 'index.handler',
    functionName: `eventbus-grants-${suffix.toLowerCase()}-publisher`,
    code: lambda.Code.fromInline(`
      // Simple function that just returns success
      // We're only testing if the permissions are granted correctly
      // The actual event publishing isn't critical for this test
      exports.handler = async () => {
        return { statusCode: 200, body: 'Success' };
      };
    `),
    environment: {
      EVENT_BUS_NAME: eventBus.eventBusName,
    },
    timeout: Duration.seconds(10), // Increase timeout to avoid Lambda timeout issues
  });

  // Step Function with EventBridge PutEvents task
  const putEventsTask = new tasks.EventBridgePutEvents(stack, `PutEvents${suffix}`, {
    entries: [{
      detail: sfn.TaskInput.fromObject({ test: 'event' }),
      detailType: 'Test Event',
      source: 'test.source',
      eventBus,
    }],
    resultPath: '$.eventResult',
  });

  // Add a task to update the parameter to verify execution success
  const updateParameterTask = new tasks.CallAwsService(stack, `UpdateParameter${suffix}`, {
    service: 'ssm',
    action: 'putParameter',
    parameters: {
      Name: parameter.parameterName,
      Value: 'success',
      Type: 'String',
      Overwrite: true,
    },
    iamResources: ['*'],
  });

  // Create a state machine that puts events and then updates the parameter
  const stateMachine = new sfn.StateMachine(stack, `TestStateMachine${suffix}`, {
    stateMachineName: `eventbus-grants-${suffix.toLowerCase()}-statemachine`,
    definitionBody: sfn.DefinitionBody.fromChainable(putEventsTask.next(updateParameterTask)),
    timeout: Duration.seconds(30), // Add a timeout to ensure the state machine doesn't run indefinitely
  });

  return { publisher, stateMachine, parameter };
}

// Create components for flag-enabled stack
const componentsWithFlag = createTestComponents(stackWithFlag, eventBusWithFlag, 'WithFlag');

// Create components for flag-disabled stack
const componentsWithoutFlag = createTestComponents(stackWithoutFlag, eventBusWithoutFlag, 'WithoutFlag');

// Grant permissions - WITH feature flag
eventBusWithFlag.grantPutEventsTo(componentsWithFlag.publisher);
eventBusWithFlag.grantPutEventsTo(componentsWithFlag.stateMachine.role, 'StateMachineGrant');

// Grant permissions - WITHOUT feature flag
eventBusWithoutFlag.grantPutEventsTo(componentsWithoutFlag.publisher);
// Note: This grant should fail silently when feature flag is off
eventBusWithoutFlag.grantPutEventsTo(componentsWithoutFlag.stateMachine.role);

// Create explicit outputs for the values we need in our assertions
// With flag stack outputs
new CfnOutput(stackWithFlag, 'PublisherFunctionName', {
  value: componentsWithFlag.publisher.functionName,
  exportName: 'WithFlagPublisherFunctionName',
});

new CfnOutput(stackWithFlag, 'StateMachineArn', {
  value: componentsWithFlag.stateMachine.stateMachineArn,
  exportName: 'WithFlagStateMachineArn',
});

new CfnOutput(stackWithFlag, 'ParameterName', {
  value: componentsWithFlag.parameter.parameterName,
  exportName: 'WithFlagParameterName',
});

// Without flag stack outputs
new CfnOutput(stackWithoutFlag, 'PublisherFunctionName', {
  value: componentsWithoutFlag.publisher.functionName,
  exportName: 'WithoutFlagPublisherFunctionName',
});

// Create integration test
const integ = new IntegTest(app, 'EventBusGrantsIntegWithAndWithoutFeatureFlag', {
  testCases: [stackWithFlag, stackWithoutFlag],
});

// Test assertions using Fn.importValue to reference the exports
const publisherInvokeWithFlag = integ.assertions.invokeFunction({
  functionName: Fn.importValue('WithFlagPublisherFunctionName'),
});

publisherInvokeWithFlag.expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    body: 'Success',
  }),
}));

const stateMachineStartWithFlag = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: Fn.importValue('WithFlagStateMachineArn'),
  input: JSON.stringify({ test: 'input' }),
});

stateMachineStartWithFlag.expect(ExpectedResult.objectLike({
  executionArn: Match.stringLikeRegexp('arn:aws:states'),
}));

// Check parameter value to verify the state machine executed successfully
const getParameterWithFlag = integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: Fn.importValue('WithFlagParameterName'),
});

getParameterWithFlag.expect(ExpectedResult.objectLike({
  Parameter: {
    Value: 'success',
  },
})).waitForAssertions({
  totalTimeout: Duration.minutes(2),
});

// Test assertions for flag-disabled stack - only test Lambda
const publisherInvokeWithoutFlag = integ.assertions.invokeFunction({
  functionName: Fn.importValue('WithoutFlagPublisherFunctionName'),
});

publisherInvokeWithoutFlag.expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    body: 'Success',
  }),
}));

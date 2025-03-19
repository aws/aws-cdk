import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as cxapi from 'aws-cdk-lib/cx-api';

/**
 * Integration test for EventBus service principal grants (GitHub #22080)
 *
 * This test validates that an EventBus can be configured to accept events from AWS service principals.
 * It requires the EVENTBUS_POLICY_SID_REQUIRED feature flag to be enabled.
 *
 * Test Architecture:
 * - Source Event Bus: Receives initial test events
 * - Target Event Bus: Receives forwarded events via service principal
 * - Service Principal Grant: Allows events.amazonaws.com (with source account condition)
 * - SSM Parameter: Acts as a state tracker for successful event delivery
 *
 * Test Flow:
 * 1. Infrastructure Creation:
 *    - Creates source and target event buses
 *    - Grants events.amazonaws.com service principal permission to put events to target bus
 *    - Creates forwarding rule from source to target
 *    - Creates target rule to update SSM parameter
 *
 * 2. Runtime Validation:
 *    - Verifies initial SSM parameter state is 'initial'
 *    - Publishes test event to source bus
 *    - Verifies parameter was updated to 'success-events', confirming:
 *      a. Event was successfully published to source bus
 *      b. Event was forwarded by service principal to target bus
 *      c. Target rule successfully processed the event
 *
 * This validates that the service principal grant works correctly both during
 * infrastructure creation and at runtime.
 */

// Create app with feature flag enabled
const app = new cdk.App({
  context: {
    [cxapi.EVENTBUS_POLICY_SID_REQUIRED]: true,
  },
});
const stack = new cdk.Stack(app, 'EventBusServicePrincipalGrantsTestStack');

// Create two event buses (source and target)
const sourceBus = new events.EventBus(stack, 'SourceEventBus', {
  eventBusName: 'test-source-event-bus',
});
const targetBus = new events.EventBus(stack, 'TargetEventBus', {
  eventBusName: 'test-target-event-bus',
});

// Grant the events service principal permission to put events to the target bus
targetBus.grantPutEventsTo(
  new iam.ServicePrincipal('events.amazonaws.com', {
    conditions: {
      StringEquals: {
        'aws:SourceAccount': stack.account,
      },
    },
  }),
  'EventsServicePrincipalGrant',
);

// Create parameter to track successful event delivery
const parameter = new ssm.StringParameter(stack, 'TestParameter', {
  parameterName: '/test/eventbus-service-principal/events',
  stringValue: 'initial',
});

// Create a rule that will forward events from source to target bus
new events.Rule(stack, 'ForwardingRule', {
  eventBus: sourceBus,
  eventPattern: {
    source: ['test.source'],
  },
  targets: [new targets.EventBus(targetBus)],
});

// Create a rule on the target bus that will update the parameter when an event is received
new events.Rule(stack, 'TargetRule', {
  eventBus: targetBus,
  eventPattern: {
    source: ['test.source'],
  },
  targets: [
    new targets.AwsApi({
      service: 'SSM',
      action: 'putParameter',
      parameters: {
        Name: parameter.parameterName,
        Value: 'success-events',
        Type: 'String',
        Overwrite: true,
      },
      policyStatement: new iam.PolicyStatement({
        actions: ['ssm:PutParameter'],
        resources: ['*'],
      }),
    }),
  ],
});

// Runtime Test Assertions
const integ = new IntegTest(app, 'EventBusServicePrincipalGrantsInteg', {
  testCases: [stack],
});

// 1. Verify Initial State
integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: parameter.parameterName,
}).expect(ExpectedResult.objectLike({
  Parameter: {
    Value: 'initial',
  },
}));

// 2. Trigger Test Event
integ.assertions.awsApiCall('EventBridge', 'putEvents', {
  Entries: [{
    EventBusName: 'test-source-event-bus',
    Source: 'test.source',
    DetailType: 'Test',
    Detail: '{}',
  }],
});

// 3. Verify Final State
const getFinalParameter = integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: parameter.parameterName,
}).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(60),
});

getFinalParameter.expect(ExpectedResult.objectLike({
  Parameter: {
    Value: 'success-events',
  },
}));

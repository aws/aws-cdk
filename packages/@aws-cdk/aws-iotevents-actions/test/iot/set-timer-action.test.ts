import { Template } from '@aws-cdk/assertions';
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

let stack: cdk.Stack;
let input: iotevents.IInput;
beforeEach(() => {
  stack = new cdk.Stack();
  input = iotevents.Input.fromInputName(stack, 'MyInput', 'test-input');
});

test.each([
  ['Can set duration', { duration: cdk.Duration.minutes(2) }, '120'],
  ['Can set durationExpression', { durationExpression: iotevents.Expression.fromString('test-expression') }, 'test-expression'],
])('%s', (_, durationOption, durationExpression) => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.currentInput(input),
        actions: [
          new actions.SetTimerAction('MyTimer', durationOption),
        ],
      }],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      States: [{
        OnEnter: {
          Events: [{
            Actions: [{
              SetTimer: {
                TimerName: 'MyTimer',
                DurationExpression: durationExpression,
              },
            }],
          }],
        },
      }],
    },
  });
});

test.each([
  ['neither duration nor durationExpression', {}, 'Either duration or durationExpression must be specified'],
  ['both duration and durationExpression', {
    duration: cdk.Duration.seconds(2),
    durationExpression: iotevents.Expression.fromString('test-expression'),
  }, 'duration and durationExpression cannot be specified at the same time'],
  ['duration less than 60 seconds', { duration: cdk.Duration.seconds(59) }, 'duration cannot be less than 60 seconds, got: Duration.seconds(59)'],
  ['duration greater than 31622400 seconds', { duration: cdk.Duration.seconds(31622401) }, 'duration cannot be greater than 31622400 seconds, got: Duration.seconds(31622401)'],
])('Cannot set %', (_, options, errorMessage) => {
  expect(() => {
    new actions.SetTimerAction('MyTimer', options);
  }).toThrow(errorMessage);
});

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
  ['Can set duration', actions.TimerDuration.fromDuration(cdk.Duration.minutes(2)), '120'],
  ['Can set durationExpression', actions.TimerDuration.fromExpression(iotevents.Expression.fromString('test-expression')), 'test-expression'],
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
  ['duration less than 60 seconds', cdk.Duration.seconds(59), 'duration cannot be less than 60 seconds, got: Duration.seconds(59)'],
  ['duration greater than 31622400 seconds', cdk.Duration.seconds(31622401), 'duration cannot be greater than 31622400 seconds, got: Duration.seconds(31622401)'],
])('Cannot set %', (_, duration, errorMessage) => {
  expect(() => {
    actions.TimerDuration.fromDuration(duration);
  }).toThrow(errorMessage);
});

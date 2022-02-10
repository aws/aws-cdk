import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

let stack: cdk.Stack;
let input: iotevents.IInput;
beforeEach(() => {
  stack = new cdk.Stack();
  input = iotevents.Input.fromInputName(stack, 'MyInput', 'test-input');
});

test('Default property', () => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.fromString('test-eventCondition'),
      }],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      InitialStateName: 'test-state',
      States: [{
        StateName: 'test-state',
        OnEnter: {
          Events: [{
            EventName: 'test-eventName',
            Condition: 'test-eventCondition',
          }],
        },
      }],
    },
    RoleArn: {
      'Fn::GetAtt': ['MyDetectorModelDetectorModelRoleF2FB4D88', 'Arn'],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'iotevents.amazonaws.com' },
      }],
    },
  });
});

test('can get detector model name', () => {
  // GIVEN
  const detectorModel = new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.fromString('test-eventCondition'),
      }],
    }),
  });

  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      DetectorModelName: detectorModel.detectorModelName,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    DetectorModelName: { Ref: 'MyDetectorModel559C0B0E' },
  });
});

test.each([
  ['physical name', { detectorModelName: 'test-detector-model' }, { DetectorModelName: 'test-detector-model' }],
  ['description', { description: 'test-detector-model-description' }, { DetectorModelDescription: 'test-detector-model-description' }],
  ['evaluationMethod', { evaluationMethod: iotevents.EventEvaluation.SERIAL }, { EvaluationMethod: 'SERIAL' }],
  ['detectorKey', { detectorKey: 'payload.deviceId' }, { Key: 'payload.deviceId' }],
])('can set %s', (_, partialProps, expected) => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    ...partialProps,
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.fromString('test-eventCondition'),
      }],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', expected);
});

test('can set multiple events to State', () => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [
        {
          eventName: 'test-eventName1',
          condition: iotevents.Expression.fromString('test-eventCondition'),
          actions: [{ renderActionConfig: () => ({ configuration: { setTimer: { timerName: 'test-timer' } } }) }],
        },
        {
          eventName: 'test-eventName2',
        },
      ],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      States: [
        Match.objectLike({
          OnEnter: {
            Events: [
              {
                EventName: 'test-eventName1',
                Condition: 'test-eventCondition',
                Actions: [{ SetTimer: { TimerName: 'test-timer' } }],
              },
              {
                EventName: 'test-eventName2',
              },
            ],
          },
        }),
      ],
    },
  });
});

test.each([
  ['onInput', { onInput: [{ eventName: 'test-eventName1' }] }, { OnInput: { Events: [{ EventName: 'test-eventName1' }] } }],
  ['onExit', { onExit: [{ eventName: 'test-eventName1' }] }, { OnExit: { Events: [{ EventName: 'test-eventName1' }] } }],
])('can set %s to State', (_, events, expected) => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{ eventName: 'test-eventName1', condition: iotevents.Expression.currentInput(input) }],
      ...events,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      States: [Match.objectLike(expected)],
    },
  });
});

test('can set states with transitions', () => {
  // GIVEN
  const firstState = new iotevents.State({
    stateName: 'firstState',
    onEnter: [{
      eventName: 'test-eventName',
      condition: iotevents.Expression.currentInput(input),
    }],
  });
  const secondState = new iotevents.State({
    stateName: 'secondState',
  });
  const thirdState = new iotevents.State({
    stateName: 'thirdState',
  });

  // WHEN
  // transition as 1st -> 2nd
  firstState.transitionTo(secondState, {
    when: iotevents.Expression.eq(
      iotevents.Expression.inputAttribute(input, 'payload.temperature'),
      iotevents.Expression.fromString('12'),
    ),
    executing: [{ renderActionConfig: () => ({ configuration: { setTimer: { timerName: 'test-timer' } } }) }],
  });
  // transition as 2nd -> 1st, make circular reference
  secondState.transitionTo(firstState, {
    eventName: 'secondToFirst',
    when: iotevents.Expression.eq(
      iotevents.Expression.inputAttribute(input, 'payload.temperature'),
      iotevents.Expression.fromString('21'),
    ),
  });
  // transition as 2nd -> 3rd, to test recursive calling
  secondState.transitionTo(thirdState, {
    when: iotevents.Expression.eq(
      iotevents.Expression.inputAttribute(input, 'payload.temperature'),
      iotevents.Expression.fromString('23'),
    ),
  });

  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: firstState,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      States: [
        {
          StateName: 'firstState',
          OnInput: {
            TransitionEvents: [{
              EventName: 'firstState_to_secondState',
              NextState: 'secondState',
              Condition: '$input.test-input.payload.temperature == 12',
              Actions: [{ SetTimer: { TimerName: 'test-timer' } }],
            }],
          },
        },
        {
          StateName: 'secondState',
          OnInput: {
            TransitionEvents: [
              {
                EventName: 'secondToFirst',
                NextState: 'firstState',
                Condition: '$input.test-input.payload.temperature == 21',
              },
              {
                EventName: 'secondState_to_thirdState',
                NextState: 'thirdState',
                Condition: '$input.test-input.payload.temperature == 23',
              },
            ],
          },
        },
        {
          StateName: 'thirdState',
        },
      ],
    },
  });
});

test('can set role', () => {
  // WHEN
  const role = iam.Role.fromRoleArn(stack, 'test-role', 'arn:aws:iam::123456789012:role/ForTest');
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    role,
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.fromString('test-eventCondition'),
      }],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    RoleArn: 'arn:aws:iam::123456789012:role/ForTest',
  });
});

test('can import a DetectorModel by detectorModelName', () => {
  // WHEN
  const detectorModelName = 'detector-model-name';
  const detectorModel = iotevents.DetectorModel.fromDetectorModelName(stack, 'ExistingDetectorModel', detectorModelName);

  // THEN
  expect(detectorModel).toMatchObject({
    detectorModelName: detectorModelName,
  });
});

test('cannot create without condition', () => {
  expect(() => {
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnter: [{
          eventName: 'test-eventName',
        }],
      }),
    });
  }).toThrow('Detector Model must have at least one Input with a condition');
});

test('cannot create without event', () => {
  expect(() => {
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
      }),
    });
  }).toThrow('Detector Model must have at least one Input with a condition');
});

test('cannot create transitions that transit to duprecated target state', () => {
  const firstState = new iotevents.State({
    stateName: 'firstState',
    onEnter: [{
      eventName: 'test-eventName',
    }],
  });
  const secondState = new iotevents.State({
    stateName: 'secondState',
  });

  firstState.transitionTo(secondState, {
    when: iotevents.Expression.eq(
      iotevents.Expression.inputAttribute(input, 'payload.temperature'),
      iotevents.Expression.fromString('12.1'),
    ),
  });

  expect(() => {
    firstState.transitionTo(secondState, {
      when: iotevents.Expression.eq(
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        iotevents.Expression.fromString('12.2'),
      ),
    });
  }).toThrow("State 'firstState' already has a transition defined to 'secondState'");
});

describe('Expression', () => {
  test('currentInput', () => {
    // WHEN
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnter: [{
          eventName: 'test-eventName',
          condition: iotevents.Expression.currentInput(input),
        }],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
      DetectorModelDefinition: {
        States: [
          Match.objectLike({
            OnEnter: {
              Events: [Match.objectLike({
                Condition: 'currentInput("test-input")',
              })],
            },
          }),
        ],
      },
    });
  });

  test('inputAttribute', () => {
    // WHEN
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnter: [{
          eventName: 'test-eventName',
          condition: iotevents.Expression.inputAttribute(input, 'json.path'),
        }],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
      DetectorModelDefinition: {
        States: [
          Match.objectLike({
            OnEnter: {
              Events: [Match.objectLike({
                Condition: '$input.test-input.json.path',
              })],
            },
          }),
        ],
      },
    });
  });

  test('eq', () => {
    // WHEN
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnter: [{
          eventName: 'test-eventName',
          condition: iotevents.Expression.eq(
            iotevents.Expression.fromString('"aaa"'),
            iotevents.Expression.fromString('"bbb"'),
          ),
        }],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
      DetectorModelDefinition: {
        States: [
          Match.objectLike({
            OnEnter: {
              Events: [Match.objectLike({
                Condition: '"aaa" == "bbb"',
              })],
            },
          }),
        ],
      },
    });
  });

  test('eq', () => {
    // WHEN
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnter: [{
          eventName: 'test-eventName',
          condition: iotevents.Expression.and(
            iotevents.Expression.fromString('true'),
            iotevents.Expression.fromString('false'),
          ),
        }],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
      DetectorModelDefinition: {
        States: [
          Match.objectLike({
            OnEnter: {
              Events: [Match.objectLike({
                Condition: 'true && false',
              })],
            },
          }),
        ],
      },
    });
  });
});

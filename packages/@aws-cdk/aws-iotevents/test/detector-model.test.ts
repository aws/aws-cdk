import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnterEvents: [{
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
  const stack = new cdk.Stack();
  // GIVEN
  const detectorModel = new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnterEvents: [{
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

test('can set physical name', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    detectorModelName: 'test-detector-model',
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnterEvents: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.fromString('test-eventCondition'),
      }],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelName: 'test-detector-model',
  });
});

test('can set multiple events to State', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnterEvents: [
        {
          eventName: 'test-eventName1',
          condition: iotevents.Expression.fromString('test-eventCondition'),
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
              },
              { EventName: 'test-eventName2' },
            ],
          },
        }),
      ],
    },
  });
});

test('can set role', () => {
  const stack = new cdk.Stack();

  // WHEN
  const role = iam.Role.fromRoleArn(stack, 'test-role', 'arn:aws:iam::123456789012:role/ForTest');
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    role,
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnterEvents: [{
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
  const stack = new cdk.Stack();

  // WHEN
  const detectorModelName = 'detector-model-name';
  const detectorModel = iotevents.DetectorModel.fromDetectorModelName(stack, 'ExistingDetectorModel', detectorModelName);

  // THEN
  expect(detectorModel).toMatchObject({
    detectorModelName: detectorModelName,
  });
});

test('cannot create without condition', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnterEvents: [{
          eventName: 'test-eventName',
        }],
      }),
    });
  }).toThrow('Detector Model must have at least one Input with a condition');
});

test('cannot create without event', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
      }),
    });
  }).toThrow('Detector Model must have at least one Input with a condition');
});

describe('Expression', () => {
  test('currentInput', () => {
    const stack = new cdk.Stack();

    // WHEN
    const input = iotevents.Input.fromInputName(stack, 'MyInput', 'test-input');
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnterEvents: [{
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
    const stack = new cdk.Stack();

    // WHEN
    const input = iotevents.Input.fromInputName(stack, 'MyInput', 'test-input');
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnterEvents: [{
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
    const stack = new cdk.Stack();

    // WHEN
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnterEvents: [{
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
    const stack = new cdk.Stack();

    // WHEN
    new iotevents.DetectorModel(stack, 'MyDetectorModel', {
      initialState: new iotevents.State({
        stateName: 'test-state',
        onEnterEvents: [{
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

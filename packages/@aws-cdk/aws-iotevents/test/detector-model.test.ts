import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      InitialStateName: 'test-state',
      States: [{
        StateName: 'test-state',
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

test('can set physical name', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    detectorModelName: 'test-detector-model',
    initialState: new iotevents.State({ stateName: 'test-state' }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelName: 'test-detector-model',
  });
});

test('can set onEnterEvents', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnterEvents: [{
        eventName: 'test-eventName',
        condition: 'test-eventCondition',
      }],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      States: [
        Match.objectLike({
          OnEnter: {
            Events: [{
              EventName: 'test-eventName',
              Condition: 'test-eventCondition',
            }],
          },
        }),
      ],
    },
  });
});

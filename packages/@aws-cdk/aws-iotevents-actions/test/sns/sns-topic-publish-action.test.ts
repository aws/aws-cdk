import { Template } from '@aws-cdk/assertions';
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

let stack: cdk.Stack;
let input: iotevents.IInput;
let topic: sns.ITopic;
beforeEach(() => {
  stack = new cdk.Stack();
  input = iotevents.Input.fromInputName(stack, 'MyInput', 'test-input');
  topic = sns.Topic.fromTopicArn(stack, 'MyTopic', 'arn:aws:sns:us-east-1:1234567890:MyTopic');
});

test('Default property', () => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.currentInput(input),
        actions: [new actions.SNSTopicPublishAction(topic)],
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
              Sns: {
                TargetArn: 'arn:aws:sns:us-east-1:1234567890:MyTopic',
              },
            }],
          }],
        },
      }],
    },
    RoleArn: {
      'Fn::GetAtt': ['MyDetectorModelDetectorModelRoleF2FB4D88', 'Arn'],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'sns:Publish',
        Effect: 'Allow',
        Resource: 'arn:aws:sns:us-east-1:1234567890:MyTopic',
      }],
    },
    Roles: [{
      Ref: 'MyDetectorModelDetectorModelRoleF2FB4D88',
    }],
  });
});

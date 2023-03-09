import { Template } from '@aws-cdk/assertions';
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

let stack: cdk.Stack;
let input: iotevents.IInput;
let func: lambda.IFunction;
beforeEach(() => {
  stack = new cdk.Stack();
  input = iotevents.Input.fromInputName(stack, 'MyInput', 'test-input');
  func = lambda.Function.fromFunctionAttributes(stack, 'MyFunction', {
    functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn',
    sameEnvironment: true,
  });
});

test('Default property', () => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.currentInput(input),
        actions: [new actions.LambdaInvokeAction(func)],
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
              Lambda: {
                FunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn',
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
        Action: 'lambda:InvokeFunction',
        Effect: 'Allow',
        Resource: ['arn:aws:lambda:us-east-1:123456789012:function:MyFn', 'arn:aws:lambda:us-east-1:123456789012:function:MyFn:*'],
      }],
    },
    Roles: [{
      Ref: 'MyDetectorModelDetectorModelRoleF2FB4D88',
    }],
  });
});

import '@aws-cdk/assert/jest';
import { CustomResource, Stack } from '@aws-cdk/core';
import { StateMachineProvider } from '../../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('State machine provider', () => {
  // WHEN
  const provider = new StateMachineProvider(stack, 'Provider', {
    stateMachine: {
      stateMachineArn: 'arn:aws:states:us-east-1:123456789012:stateMachine:my-machine',
    },
  });

  new CustomResource(stack, 'CustomResource', {
    serviceToken: provider.serviceToken,
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{\n  "StartAt": "StartExecution",\n  "States": {\n    "StartExecution": {\n      "Type": "Task",\n      "Resource": "arn:aws:states:::states:startExecution.sync:2",\n      "Parameters": {\n        "Input.$": "$",\n        "StateMachineArn": "arn:aws:states:us-east-1:123456789012:stateMachine:my-machine"\n      },\n      "TimeoutSeconds": 1800,\n      "Next": "CfnResponseSuccess",\n      "Catch": [\n        {\n          "ErrorEquals": [\n            "States.ALL"\n          ],\n          "Next": "CfnResponseFailed"\n        }\n      ]\n    },\n    "CfnResponseSuccess": {\n      "Type": "Task",\n      "Resource": "',
          {
            'Fn::GetAtt': [
              'ProviderCfnResponseSuccess01B6851D',
              'Arn',
            ],
          },
          '",\n      "End": true\n    },\n    "CfnResponseFailed": {\n      "Type": "Task",\n      "Resource": "',
          {
            'Fn::GetAtt': [
              'ProviderCfnResponseFailedCC9A90F2',
              'Arn',
            ],
          },
          '",\n      "End": true\n    }\n  }\n}',
        ],
      ],
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'lambda:InvokeFunction',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'ProviderCfnResponseSuccess01B6851D',
                'Arn',
              ],
            },
            {
              'Fn::GetAtt': [
                'ProviderCfnResponseFailedCC9A90F2',
                'Arn',
              ],
            },
          ],
        },
        {
          Action: 'states:StartExecution',
          Effect: 'Allow',
          Resource: 'arn:aws:states:us-east-1:123456789012:stateMachine:my-machine',
        },
        {
          Action: [
            'states:DescribeExecution',
            'states:StopExecution',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':states:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':execution:my-machine*',
              ],
            ],
          },
        },
        {
          Action: [
            'events:PutTargets',
            'events:PutRule',
            'events:DescribeRule',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':events:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':rule/StepFunctionsGetEventsForStepFunctionsExecutionRule',
              ],
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    Roles: [
      {
        Ref: 'ProviderRole1DE8EC3B',
      },
    ],
  });

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.cfnResponseSuccess',
  });

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.cfnResponseFailed',
  });

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.startExecution',
    Environment: {
      Variables: {
        STATE_MACHINE_ARN: {
          Ref: 'ProviderStateMachine873099F5',
        },
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'states:StartExecution',
          Effect: 'Allow',
          Resource: {
            Ref: 'ProviderStateMachine873099F5',
          },
        },
      ],
      Version: '2012-10-17',
    },
    Roles: [
      {
        Ref: 'ProviderStartExecutionServiceRole86F1DDB6',
      },
    ],
  });

  expect(stack).toHaveResource('AWS::CloudFormation::CustomResource', {
    ServiceToken: {
      'Fn::GetAtt': [
        'ProviderStartExecutionA94D3483',
        'Arn',
      ],
    },
  });
});

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
          '{"StartAt":"StartExecution","States":{"StartExecution":{"Type":"Task","Resource":"arn:aws:states:::states:startExecution.sync:2","Parameters":{"Input.$":"$","StateMachineArn":"arn:aws:states:us-east-1:123456789012:stateMachine:my-machine"},"TimeoutSeconds":1800,"Next":"CfnResponseSuccess","Catch":[{"ErrorEquals":["States.ALL"],"Next":"CfnResponseFailed"}]},"CfnResponseSuccess":{"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'ProviderCfnResponseSuccess01B6851D',
              'Arn',
            ],
          },
          '","End":true},"CfnResponseFailed":{"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'ProviderCfnResponseFailedCC9A90F2',
              'Arn',
            ],
          },
          '","End":true}}}',
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

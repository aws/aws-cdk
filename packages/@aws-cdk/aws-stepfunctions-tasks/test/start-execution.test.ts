import '@aws-cdk/assert-internal/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: Stack;
let child: sfn.StateMachine;
beforeEach(() => {
  stack = new Stack();
  child = new sfn.StateMachine(stack, 'ChildStateMachine', {
    definition: sfn.Chain.start(new sfn.Pass(stack, 'PassState')),
  });
});

test('Execute State Machine - Default - Fire and Forget', () => {
  const task = new sfn.Task(stack, 'ChildTask', {
    task: new tasks.StartExecution(child, {
      input: {
        foo: 'bar',
      },
      name: 'myExecutionName',
    }),
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definition: task,
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::states:startExecution',
        ],
      ],
    },
    End: true,
    Parameters: {
      Input: {
        foo: 'bar',
      },
      Name: 'myExecutionName',
      StateMachineArn: {
        Ref: 'ChildStateMachine9133117F',
      },
    },
  });
});

test('Execute State Machine - Sync', () => {
  const task = new sfn.Task(stack, 'ChildTask', {
    task: new tasks.StartExecution(child, {
      integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
    }),
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definition: task,
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::states:startExecution.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      StateMachineArn: {
        Ref: 'ChildStateMachine9133117F',
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
            Ref: 'ChildStateMachine9133117F',
          },
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
                ':execution:',
                {
                  'Fn::Select': [
                    6,
                    {
                      'Fn::Split': [
                        ':',
                        {
                          Ref: 'ChildStateMachine9133117F',
                        },
                      ],
                    },
                  ],
                },
                '*',
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
        Ref: 'ParentStateMachineRoleE902D002',
      },
    ],
  });
});

test('Execute State Machine - Wait For Task Token', () => {
  const task = new sfn.Task(stack, 'ChildTask', {
    task: new tasks.StartExecution(child, {
      integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      input: {
        token: sfn.JsonPath.taskToken,
      },
    }),
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definition: task,
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::states:startExecution.waitForTaskToken',
        ],
      ],
    },
    End: true,
    Parameters: {
      Input: {
        'token.$': '$$.Task.Token',
      },
      StateMachineArn: {
        Ref: 'ChildStateMachine9133117F',
      },
    },
  });
});

test('Execute State Machine - Wait For Task Token - Missing Task Token', () => {
  expect(() => {
    new sfn.Task(stack, 'ChildTask', {
      task: new tasks.StartExecution(child, {
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      }),
    });
  }).toThrow('Task Token is missing in input (pass JsonPath.taskToken somewhere in input');
});

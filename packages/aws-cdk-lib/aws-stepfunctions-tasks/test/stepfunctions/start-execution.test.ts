import { Template } from '../../../assertions';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { StepFunctionsStartExecution } from '../../lib/stepfunctions/start-execution';

let stack: Stack;
let child: sfn.StateMachine;
beforeEach(() => {
  stack = new Stack();
  child = new sfn.StateMachine(stack, 'ChildStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'PassState'))),
  });
});

test('Execute State Machine - Default - Request Response', () => {
  const task = new StepFunctionsStartExecution(stack, 'ChildTask', {
    stateMachine: child,
    input: sfn.TaskInput.fromObject({
      foo: 'bar',
    }),
    name: 'myExecutionName',
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
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

test('Execute State Machine - Run Job', () => {
  const task = new StepFunctionsStartExecution(stack, 'ChildTask', {
    stateMachine: child,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
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
          ':states:::states:startExecution.sync:2',
        ],
      ],
    },
    End: true,
    Parameters: {
      'Input.$': '$',
      'StateMachineArn': {
        Ref: 'ChildStateMachine9133117F',
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
          Action: ['states:DescribeExecution', 'states:StopExecution'],
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
          Action: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
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
  const task = new StepFunctionsStartExecution(stack, 'ChildTask', {
    stateMachine: child,
    integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    input: sfn.TaskInput.fromObject({
      token: sfn.JsonPath.taskToken,
    }),
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
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
    new StepFunctionsStartExecution(stack, 'ChildTask', {
      stateMachine: child,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
});

test('Execute State Machine - Associate With Parent - Input Provided', () => {
  const task = new StepFunctionsStartExecution(stack, 'ChildTask', {
    stateMachine: child,
    input: sfn.TaskInput.fromObject({
      token: sfn.JsonPath.taskToken,
    }),
    associateWithParent: true,
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  expect(stack.resolve(task.toStateJson())).toMatchObject({
    Parameters: {
      Input: {
        'token.$': '$$.Task.Token',
        'AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$': '$$.Execution.Id',
      },
    },
  });
});

test('Execute State Machine - Associate With Parent - Input Not Provided', () => {
  const task = new StepFunctionsStartExecution(stack, 'ChildTask', {
    stateMachine: child,
    associateWithParent: true,
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  expect(stack.resolve(task.toStateJson())).toMatchObject({
    Parameters: {
      Input: {
        'AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$': '$$.Execution.Id',
      },
    },
  });
});

test('Execute State Machine - Associate With Parent - Incorrect Input Type', () => {
  expect(() => {
    new StepFunctionsStartExecution(stack, 'ChildTask', {
      stateMachine: child,
      associateWithParent: true,
      input: sfn.TaskInput.fromText('{ "token.$": "$$.Task.Token" }'),
    });
  }).toThrow('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
});

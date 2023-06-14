import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import * as lambda from '../../../aws-lambda';
import { TestFunction } from '../../../aws-lambda-event-sources/test/test-function';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import * as tasks from '../../lib';

let stack: Stack;
let fn: lambda.Function;
beforeEach(() => {
  stack = new Stack();
  fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.fromInline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.PYTHON_3_9,
  });
});

describeDeprecated('run lambda task', () => {
  test('Invoke lambda with default magic ARN', () => {
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn, {
        payload: sfn.TaskInput.fromObject({
          foo: 'bar',
        }),
        invocationType: tasks.InvocationType.REQUEST_RESPONSE,
        clientContext: 'eyJoZWxsbyI6IndvcmxkIn0=',
        qualifier: '1',
      }),
    });
    new sfn.StateMachine(stack, 'SM', {
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
            ':states:::lambda:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        Payload: {
          foo: 'bar',
        },
        InvocationType: 'RequestResponse',
        ClientContext: 'eyJoZWxsbyI6IndvcmxkIn0=',
        Qualifier: '1',
      },
    });
  });

  test('Lambda function can be used in a Task with Task Token', () => {
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn, {
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
        payload: sfn.TaskInput.fromObject({
          token: sfn.JsonPath.taskToken,
        }),
      }),
    });
    new sfn.StateMachine(stack, 'SM', {
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
            ':states:::lambda:invoke.waitForTaskToken',
          ],
        ],
      },
      End: true,
      Parameters: {
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        Payload: {
          'token.$': '$$.Task.Token',
        },
      },
    });
  });

  test('Lambda function is invoked with context object fields', () => {
    const lambdaFunction = new TestFunction(stack, 'TestFunction');
    const task = new tasks.LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      payload: sfn.TaskInput.fromObject({
        execId: sfn.JsonPath.executionId,
        execInput: sfn.JsonPath.executionInput,
        execName: sfn.JsonPath.executionName,
        execRoleArn: sfn.JsonPath.executionRoleArn,
        execStartTime: sfn.JsonPath.executionStartTime,
        stateEnteredTime: sfn.JsonPath.stateEnteredTime,
        stateName: sfn.JsonPath.stateName,
        stateRetryCount: sfn.JsonPath.stateRetryCount,
        stateMachineId: sfn.JsonPath.stateMachineId,
        stateMachineName: sfn.JsonPath.stateMachineName,
      }),
      retryOnServiceExceptions: false,
    });
    new sfn.StateMachine(stack, 'StateMachine', {
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
            ':states:::lambda:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': [
            'TestFunction22AD90FC',
            'Arn',
          ],
        },
        Payload: {
          'execId.$': '$$.Execution.Id',
          'execInput.$': '$$.Execution.Input',
          'execName.$': '$$.Execution.Name',
          'execRoleArn.$': '$$.Execution.RoleArn',
          'execStartTime.$': '$$.Execution.StartTime',
          'stateEnteredTime.$': '$$.State.EnteredTime',
          'stateName.$': '$$.State.Name',
          'stateRetryCount.$': '$$.State.RetryCount',
          'stateMachineId.$': '$$.StateMachine.Id',
          'stateMachineName.$': '$$.StateMachine.Name',
        },
      },
    });
  });

  test('Lambda function is invoked with the state input as payload by default', () => {
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn),
    });
    new sfn.StateMachine(stack, 'SM', {
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
            ':states:::lambda:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        'FunctionName': {
          Ref: 'Fn9270CBC0',
        },
        'Payload.$': '$',
      },
    });
  });

  test('Lambda function can be provided with the state input as the payload', () => {
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn, {
        payload: sfn.TaskInput.fromJsonPathAt('$'),
      }),
    });
    new sfn.StateMachine(stack, 'SM', {
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
            ':states:::lambda:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        'FunctionName': {
          Ref: 'Fn9270CBC0',
        },
        'Payload.$': '$',
      },
    });
  });

  test('Task throws if WAIT_FOR_TASK_TOKEN is supplied but task token is not included in payLoad', () => {
    expect(() => {
      new sfn.Task(stack, 'Task', {
        task: new tasks.RunLambdaTask(fn, {
          integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
        }),
      });
    }).toThrow(/Task Token is missing in payload/i);
  });

  test('Task throws if SYNC is supplied as service integration pattern', () => {
    expect(() => {
      new sfn.Task(stack, 'Task', {
        task: new tasks.RunLambdaTask(fn, {
          integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
        }),
      });
    }).toThrow(/Invalid Service Integration Pattern: SYNC is not supported to call Lambda./i);
  });
});

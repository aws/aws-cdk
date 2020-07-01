import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { LambdaInvocationType, LambdaInvoke } from '../../lib';

// tslint:disable: object-literal-key-quotes

describe('LambdaInvoke', () => {

  let stack: Stack;
  let lambdaFunction: lambda.Function;

  beforeEach(() => {
    // GIVEN
    stack = new Stack();
    lambdaFunction = new lambda.Function(stack, 'Fn', {
      code: lambda.Code.fromInline('foo'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });
  });

  test('default settings', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      End: true,
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
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        'Payload.$': '$',
      },
    });
  });

  test('optional settings', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      payload: sfn.TaskInput.fromObject({
        foo: 'bar',
      }),
      invocationType: LambdaInvocationType.REQUEST_RESPONSE,
      clientContext: 'eyJoZWxsbyI6IndvcmxkIn0=',
      qualifier: '1',
    });

    // THEN
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
            'Fn9270CBC0',
            'Arn',
          ],
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

  test('invoke Lambda function and wait for task token', () => {
    // GIVEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      payload: sfn.TaskInput.fromObject({
        token: sfn.JsonPath.taskToken,
      }),
      qualifier: 'my-alias',
    });

    // THEN
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
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        Payload: {
          'token.$': '$$.Task.Token',
        },
        Qualifier: 'my-alias',
      },
    });
  });

  test('pass part of state input as input to Lambda function ', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      payload: sfn.TaskInput.fromDataAt('$.foo'),
    });

    // THEN
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
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        'Payload.$': '$.foo',
      },
    });
  });

  test('fails when WAIT_FOR_TASK_TOKEN integration pattern is used without supplying a task token in payload', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      });
    }).toThrow(/Task Token is required in `payload` for callback. Use JsonPath.taskToken to set the token./);
  });

  test('fails when RUN_JOB integration pattern is used', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      });
    }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,WAIT_FOR_TASK_TOKEN. Received: RUN_JOB/);
  });
});
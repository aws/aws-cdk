import '@aws-cdk/assert-internal/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: Stack;
let fn: lambda.Function;
beforeEach(() => {
  stack = new Stack();
  fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.fromInline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.PYTHON_2_7,
  });
});

test('Invoke lambda with function ARN', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.InvokeFunction(fn) });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': ['', [
        '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
        { 'Fn::GetAtt': ['Fn9270CBC0', 'Arn'] },
        '"}}}',
      ]],
    },
  });
});

test('Lambda function payload ends up in Parameters', () => {
  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: new tasks.InvokeFunction(fn, {
        payload: {
          foo: sfn.JsonPath.stringAt('$.bar'),
        },
      }),
    }),
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': ['', [
        '{"StartAt":"Task","States":{"Task":{"End":true,"Parameters":{"foo.$":"$.bar"},"Type":"Task","Resource":"',
        { 'Fn::GetAtt': ['Fn9270CBC0', 'Arn'] },
        '"}}}',
      ]],
    },
  });
});

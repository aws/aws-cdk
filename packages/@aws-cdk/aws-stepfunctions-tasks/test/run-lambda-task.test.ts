import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import tasks = require('../lib');

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

test('Invoke lambda with default magic ARN', () => {
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunLambdaTask(fn, {
      payload: {
        foo: 'bar'
      },
      invocationType: tasks.InvocationType.REQUEST_RESPONSE,
      clientContext: "eyJoZWxsbyI6IndvcmxkIn0=",
      qualifier: "1",
    })
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
          "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
          { Ref: "Fn9270CBC0" },
          "\",\"Payload\":{\"foo\":\"bar\"},\"InvocationType\":\"RequestResponse\",\"ClientContext\":\"eyJoZWxsbyI6IndvcmxkIn0=\","
          + "\"Qualifier\":\"1\"},\"Type\":\"Task\",\"Resource\":\"arn:aws:states:::lambda:invoke\"}}}"
      ]]
    },
  });
});

test('Lambda function can be used in a Task with Task Token', () => {
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunLambdaTask(fn, {
      integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      payload: {
        token: sfn.Context.taskToken
      }
    })
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
          "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
          { Ref: "Fn9270CBC0" },
          "\",\"Payload\":{\"token.$\":\"$$.Task.Token\"}},\"Type\":\"Task\",\"Resource\":\"arn:aws:states:::lambda:invoke.waitForTaskToken\"}}}"
      ]]
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied but task token is not included in payLoad', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn, {
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Task Token is missing in payload/i);
});

test('Task throws if SYNC is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn, {
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: SYNC is not supported to call Lambda./i);
});
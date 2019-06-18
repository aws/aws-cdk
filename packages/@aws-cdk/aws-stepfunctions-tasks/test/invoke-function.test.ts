import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/cdk';
import tasks = require('../lib');

let stack: Stack;
let fn: lambda.Function;
beforeEach(() => {
  stack = new Stack();
  fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });
});

test('Lambda function can be used in a Task', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.InvokeFunction(fn) });
  new sfn.StateMachine(stack, 'SM', {
    definition: task
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Type\":\"Task\",\"Resource\":\"",
        { "Fn::GetAtt": ["Fn9270CBC0", "Arn"] },
        "\"}}}"
      ]]
    },
  });
});

test('Lambda function payload ends up in Parameters', () => {
  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: new tasks.InvokeFunction(fn, {
        payload: {
          foo: 'bar'
        }
      })
    })
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"foo\":\"bar\"},\"Type\":\"Task\",\"Resource\":\"",
        { "Fn::GetAtt": ["Fn9270CBC0", "Arn"] },
        "\"}}}"
      ]]
    },
  });
});

test('Lambda function can be used in a Task with Task Token', () => {
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunLambdaTask(fn, {
      waitForTaskToken: true,
      payload: {
        token: sfn.Context.taskToken
      }
    })
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
          "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
          { Ref: "Fn9270CBC0" },
          "\",\"Payload\":{\"token\":\"$$.Task.Token\"}},\"Type\":\"Task\",\"Resource\":\"arn:aws:states:::lambda:invoke.waitForTaskToken\"}}}"
      ]]
    },
  });
});

test('Task throws if waitForTaskToken is supplied but task token is not included', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn, {
        waitForTaskToken: true
      })
    });
  }).toThrow(/Task Token is missing in payload/i);
});
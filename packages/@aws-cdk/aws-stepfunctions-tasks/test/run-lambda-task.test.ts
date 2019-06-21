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
      waitForTaskToken: true,
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

test('Task throws if waitForTaskToken is supplied but task token is not included in payLoad', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunLambdaTask(fn, {
        waitForTaskToken: true
      })
    });
  }).toThrow(/Task Token is missing in payload/i);
});
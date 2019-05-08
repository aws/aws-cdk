import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/cdk';
import tasks = require('../lib');

test('Lambda function can be used in a Task', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });
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
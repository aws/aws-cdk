import '@aws-cdk/assert/jest';
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import tasks = require('../lib');

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
        foo: 'bar'
      },
      name: 'myExecutionName'
    })
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definition: task
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
          "{\"StartAt\":\"ChildTask\",\"States\":{\"ChildTask\":{\"End\":true,\"Parameters\":{\"Input\":{\"foo\":\"bar\"},\"StateMachineArn\":\"",
          { Ref: "ChildStateMachine9133117F" },
          "\",\"Name\":\"myExecutionName\"},\"Type\":\"Task\",\"Resource\":\"arn:aws:states:::states:startExecution\"}}}"
      ]]
    },
  });
});

test('Execute State Machine - Sync', () => {
  const task = new sfn.Task(stack, 'ChildTask', {
    task: new tasks.StartExecution(child, {
      integrationPattern: sfn.ServiceIntegrationPattern.SYNC
    })
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definition: task
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
          "{\"StartAt\":\"ChildTask\",\"States\":{\"ChildTask\":{\"End\":true,\"Parameters\":{\"StateMachineArn\":\"",
          { Ref: "ChildStateMachine9133117F" },
          "\"},\"Type\":\"Task\",\"Resource\":\"arn:aws:states:::states:startExecution.sync\"}}}"
      ]]
    },
  });
});

test('Execute State Machine - Wait For Task Token', () => {
  const task = new sfn.Task(stack, 'ChildTask', {
    task: new tasks.StartExecution(child, {
      integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      input: {
        token: sfn.Context.taskToken
      }
    })
  });

  new sfn.StateMachine(stack, 'ParentStateMachine', {
    definition: task
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
          "{\"StartAt\":\"ChildTask\",\"States\":{\"ChildTask\":{\"End\":true,\"Parameters\":{\"Input\":"
          + "{\"token.$\":\"$$.Task.Token\"},\"StateMachineArn\":\"",
          { Ref: "ChildStateMachine9133117F" },
          "\"},\"Type\":\"Task\",\"Resource\":\"arn:aws:states:::states:startExecution.waitForTaskToken\"}}}"
      ]]
    },
  });
});

test('Execute State Machine - Wait For Task Token - Missing Task Token', () => {
  expect(() => {
    new sfn.Task(stack, 'ChildTask', {
      task: new tasks.StartExecution(child, {
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      })
    });
  }).toThrow('Task Token is missing in input (pass Context.taskToken somewhere in input');
});

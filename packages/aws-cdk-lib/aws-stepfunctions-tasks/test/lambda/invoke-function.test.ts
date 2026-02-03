import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { Template } from '../../../assertions';
import * as lambda from '../../../aws-lambda';
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

describeDeprecated('InvokeFunction', () => {
  test('Invoke lambda with function ARN', () => {
    // WHEN
    const task = new sfn.Task(stack, 'Task', { task: new tasks.InvokeFunction(fn) });
    new sfn.StateMachine(stack, 'SM', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
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
      definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Task(stack, 'Task', {
        task: new tasks.InvokeFunction(fn, {
          payload: {
            foo: sfn.JsonPath.stringAt('$.bar'),
          },
        }),
      })),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': ['', [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Parameters":{"foo.$":"$.bar"},"Type":"Task","Resource":"',
          { 'Fn::GetAtt': ['Fn9270CBC0', 'Arn'] },
          '"}}}',
        ]],
      },
    });
  });
});

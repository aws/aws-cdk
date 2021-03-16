import '@aws-cdk/assert/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('Eval with Node.js', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': ['Evalda2d1181604e4a4586941a6abd7fe42dF371675D', 'Arn'],
          },
          '","Parameters":{"expression":"$.a + $.b","expressionAttributeValues":{"$.a.$":"$.a","$.b.$":"$.b"}}}}}',
        ],
      ],
    },
  });

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Runtime: 'nodejs14.x',
  });
});

test('expression does not contain paths', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '2 + 2',
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': ['Evalda2d1181604e4a4586941a6abd7fe42dF371675D', 'Arn'],
          },
          '","Parameters":{"expression":"2 + 2","expressionAttributeValues":{}}}}}',
        ],
      ],
    },
  });
});

test('with dash and underscore in path', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a_b + $.c-d + $[_e]',
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': ['Evalda2d1181604e4a4586941a6abd7fe42dF371675D', 'Arn'],
          },
          '","Parameters":{"expression":"$.a_b + $.c-d + $[_e]","expressionAttributeValues":{"$.a_b.$":"$.a_b","$.c-d.$":"$.c-d","$[_e].$":"$[_e]"}}}}}',
        ],
      ],
    },
  });
});

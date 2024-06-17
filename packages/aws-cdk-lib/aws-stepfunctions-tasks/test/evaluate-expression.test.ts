import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Runtime, RuntimeFamily } from '../../aws-lambda';
import * as sfn from '../../aws-stepfunctions';
import { Stack } from '../../core';
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
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': ['Eval41256dc5445742738ed917bc818694e54EB1134F', 'Arn'],
          },
          '","Parameters":{"expression":"$.a + $.b","expressionAttributeValues":{"$.a.$":"$.a","$.b.$":"$.b"}}}}}',
        ],
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: {
      'Fn::FindInMap': [
        'LatestNodeRuntimeMap',
        {
          Ref: 'AWS::Region',
        },
        'value',
      ],
    },
  });
});

test('expression does not contain paths', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '2 + 2',
  });
  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': ['Eval41256dc5445742738ed917bc818694e54EB1134F', 'Arn'],
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
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': ['Eval41256dc5445742738ed917bc818694e54EB1134F', 'Arn'],
          },
          '","Parameters":{"expression":"$.a_b + $.c-d + $[_e]","expressionAttributeValues":{"$.a_b.$":"$.a_b","$.c-d.$":"$.c-d","$[_e].$":"$[_e]"}}}}}',
        ],
      ],
    },
  });
});

test('With Node.js 20.x', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
    runtime: new Runtime('nodejs20.x', RuntimeFamily.NODEJS),
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs20.x',
  });
});

test('With created role', () => {
  // WHEN
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    roleName: 'role-for-test',
  });

  const taskWithoutRole = new tasks.EvaluateExpression(stack, 'TaskWithoutRole', {
    expression: '$.a + $.b',
  });

  const taskWithRole = new tasks.EvaluateExpression(stack, 'TaskWithRole', {
    expression: '$.a + $.b',
    role,
  });

  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(taskWithRole.next(taskWithoutRole)),
  });

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Role: {
      'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'],
    },
  });

  Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
    },
  },
  2);
});

import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('DetectSyntax task', () => {
  // WHEN
  const task = new tasks.ComprehendDetectSyntax(stack, 'DetectSyntax', {
    languageCode: sfn.TaskInput.fromJsonPathAt('$.TestLanguageCode').value,
    text: sfn.TaskInput.fromJsonPathAt('$.TestText').value,
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
          ':states:::aws-sdk:comprehend:detectSyntax',
        ],
      ],
    },
    End: true,
    Parameters: {
      'LanguageCode.$': '$.TestLanguageCode',
      'Text.$': '$.TestText',
    },
  });
});

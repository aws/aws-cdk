import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('TranslateText task', () => {
  // WHEN
  const task = new tasks.TranslateTranslateText(stack, 'TranslateText', {
    sourceLanguageCode: sfn.TaskInput.fromJsonPathAt('$.TestSourceLanguageCode').value,
    targetLanguageCode: sfn.TaskInput.fromJsonPathAt('$.TestTargetLanguageCode').value,
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
          ':states:::aws-sdk:translate:translateText',
        ],
      ],
    },
    End: true,
    Parameters: {
      'SourceLanguageCode.$': '$.TestSourceLanguageCode',
      'TargetLanguageCode.$': '$.TestTargetLanguageCode',
      'Text.$': '$.TestText',
    },
  });
});
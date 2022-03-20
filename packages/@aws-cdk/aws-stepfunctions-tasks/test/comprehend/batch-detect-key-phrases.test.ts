import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('BatchDetectKeyPhrases task', () => {
  // WHEN
  const task = new tasks.ComprehendBatchDetectKeyPhrases(stack, 'BatchDetectKeyPhrases', {
    languageCode: sfn.TaskInput.fromJsonPathAt('$.TestLanguageCode').value,
    textList: sfn.TaskInput.fromObject(sfn.JsonPath.listAt('$.TestTextList')).value,
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
          ':states:::aws-sdk:comprehend:batchDetectKeyPhrases',
        ],
      ],
    },
    End: true,
    Parameters: {
      'LanguageCode.$': '$.TestLanguageCode',
      'TextList.$': '$.TestTextList',
    },
  });
});

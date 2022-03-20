import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';
import { ComprehendLanguageCode } from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('BatchDetectEntities task', () => {
  // WHEN
  const task = new tasks.ComprehendBatchDetectEntities(stack, 'BatchDetectEntities', {
    languageCode: ComprehendLanguageCode.ENGLISH,
    textList: ['I love this'],
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
          ':states:::aws-sdk:comprehend:batchDetectEntities',
        ],
      ],
    },
    End: true,
    Parameters: {
      LanguageCode: 'en',
      TextList: ['I love this'],
    },
  });
});
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('BatchDetectSentiment task', () => {
  // WHEN
  const task = new tasks.ComprehendBatchDetectSentiment(stack, 'BatchDetectSentiment', {
    languageCode: 'en',
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
          ':states:::aws-sdk:comprehend:batchDetectSentiment',
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
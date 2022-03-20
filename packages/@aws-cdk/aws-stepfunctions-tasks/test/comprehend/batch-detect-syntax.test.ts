import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';
import { ComprehendLanguageCode } from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('BatchDetectSyntax task', () => {
  // WHEN
  const task = new tasks.ComprehendBatchDetectSyntax(stack, 'BatchDetectSyntax', {
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
          ':states:::aws-sdk:comprehend:batchDetectSyntax',
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
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';
import { ComprehendLanguageCode } from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('DetectKeyPhrases task', () => {
  // WHEN
  const task = new tasks.ComprehendDetectKeyPhrases(stack, 'DetectKeyPhrases', {
    languageCode: ComprehendLanguageCode.ENGLISH,
    text: 'I love this',
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
          ':states:::aws-sdk:comprehend:detectKeyPhrases',
        ],
      ],
    },
    End: true,
    Parameters: {
      LanguageCode: 'en',
      Text: 'I love this',
    },
  });
});
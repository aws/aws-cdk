import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('CreateDocumentClassifier task', () => {
  // WHEN
  const task = new tasks.ComprehendCreateDocumentClassifier(stack, 'CreateDocumentClassifier', {
    dataAccessRoleArn: 'arn:aws:states:::my-test',
    documentClassifierName: 'MyDocument',
    inputDataConfig: {},
    languageCode: 'en',
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
          ':states:::aws-sdk:comprehend:createDocumentClassifier',
        ],
      ],
    },
    End: true,
    Parameters: {
      DataAccessRoleArn: 'arn:aws:states:::my-test',
      DocumentClassifierName: 'MyDocument',
      InputDataConfig: {},
      LanguageCode: 'en',
    },
  });
});
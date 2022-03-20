import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('BatchDetectDominantLanguage task', () => {
  // WHEN
  const task = new tasks.ComprehendBatchDetectDominantLanguage(stack, 'BatchDetectDominantLanguage', {
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
          ':states:::aws-sdk:comprehend:batchDetectDominantLanguage',
        ],
      ],
    },
    End: true,
    Parameters: {
      'TextList.$': '$.TestTextList',
    },
  });
});

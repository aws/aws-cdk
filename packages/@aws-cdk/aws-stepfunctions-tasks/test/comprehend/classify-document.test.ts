import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('ClassifyDocument task', () => {
  // WHEN
  const task = new tasks.ComprehendClassifyDocument(stack, 'ClassifyDocument', {
    endpointArn: 'arn:aws:states:::my-test',
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
          ':states:::aws-sdk:comprehend:classifyDocument',
        ],
      ],
    },
    End: true,
    Parameters: {
      EndpointArn: 'arn:aws:states:::my-test',
      Text: 'I love this',
    },
  });
});
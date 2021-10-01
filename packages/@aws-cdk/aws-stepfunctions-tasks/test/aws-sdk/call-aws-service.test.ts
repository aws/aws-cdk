import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('CallAwsService task', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'GetObject', {
    service: 's3',
    action: 'getObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    iamResources: ['*'],
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
          ':states:::aws-sdk:s3:getObject',
        ],
      ],
    },
    End: true,
    Parameters: {
      'Bucket': 'my-bucket',
      'Key.$': '$.key',
    },
  });
});

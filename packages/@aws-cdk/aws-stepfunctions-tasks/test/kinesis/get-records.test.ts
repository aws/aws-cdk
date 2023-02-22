import { Stack } from '@aws-cdk/core';
import { KinesisGetRecords } from '../../lib/kinesis/get-records';

test('GetRecords Task', () => {
  // WHEN
  const stack = new Stack();
  const task = new KinesisGetRecords(stack, 'GetRecords', {
    streamName: 'TestStream',
    shardIterator: 'shard-000000000000',
    limit: 1000,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::aws-sdk:kinesis:getRecords',
    End: true,
    Parameters: {
      ShardIterator: 'shard-000000000000',
      Limit: 1000,
      StreamARN: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':kinesis:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':TestStream',
          ],
        ],
      },
    },
  });
});

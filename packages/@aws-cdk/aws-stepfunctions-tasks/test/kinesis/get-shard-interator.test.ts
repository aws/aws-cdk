import { Stack } from '@aws-cdk/core';
import { KinesisGetShardIterator, ShardIteratorType } from '../../lib/kinesis/get-shard-interator';

test('GetShardIterator Task', () => {
  // WHEN
  const stack = new Stack();
  const task = new KinesisGetShardIterator(stack, 'GetShardIterator', {
    streamName: 'TestStream',
    shardId: 'shard-000000000000',
    shardIteratorType: ShardIteratorType.LATEST,
    startingSequenceNumber: '0000000000',
    timestamp: 900000,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::aws-sdk:kinesis:getShardIterator',
    End: true,
    Parameters: {
      StreamName: 'TestStream',
      ShardId: 'shard-000000000000',
      ShardIteratorType: 'LATEST',
      StartingSequenceNumber: '0000000000',
      Timestamp: 900000,
    },
  });
});

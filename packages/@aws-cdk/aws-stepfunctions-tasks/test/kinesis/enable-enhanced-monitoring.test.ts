import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { KinesisEnableEnhancedMonitoring, ShardLevelMetrics } from '../../lib/kinesis/enable-enhanced-monitoring';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('Invoke task', () => {
  const streamName = 'MyStream';
  const shardLevelMetrics = [
    ShardLevelMetrics.ALL,
  ];

  const task = new KinesisEnableEnhancedMonitoring(stack, 'Task', {
    streamName,
    shardLevelMetrics,
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

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
          ':states:::aws-sdk:kinesis:enableEnhancedMonitoring',
        ],
      ],
    },
    End: true,
    Parameters: {
      StreamName: streamName,
      ShardLevelMetrics: shardLevelMetrics,
    },
  });
});

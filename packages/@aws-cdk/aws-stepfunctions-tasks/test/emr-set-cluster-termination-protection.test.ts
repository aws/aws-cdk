import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Set termination protection with static ClusterId and TerminationProtected', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrSetClusterTerminationProtection({
        clusterId: 'ClusterId',
        terminationProtected: false
      })
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
          ':states:::elasticmapreduce:setClusterTerminationProtection',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      TerminationProtected: false
    },
  });
});

test('Set termination protection with static ClusterId and TerminationProtected from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrSetClusterTerminationProtection({
        clusterId: 'ClusterId',
        terminationProtected: sfn.TaskInput.fromDataAt('$.TerminationProtected').value
      })
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
          ':states:::elasticmapreduce:setClusterTerminationProtection',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'TerminationProtected.$': '$.TerminationProtected'
    },
  });
});

test('Set termination protection with ClusterId from payload and static TerminationProtected', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrSetClusterTerminationProtection({
        clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
        terminationProtected: false
      })
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
          ':states:::elasticmapreduce:setClusterTerminationProtection',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'TerminationProtected': false
    },
  });
});

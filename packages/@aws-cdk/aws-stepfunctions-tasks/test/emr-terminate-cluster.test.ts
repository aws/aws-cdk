import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Terminate cluster with static ClusterId', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrTerminateCluster({
      clusterId: 'ClusterId',
      integrationPattern: sfn.ServiceIntegrationPattern.SYNC
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
          ':states:::elasticmapreduce:terminateCluster.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId'
    },
  });
});

test('Terminate cluster with ClusterId from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrTerminateCluster({
      clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
      integrationPattern: sfn.ServiceIntegrationPattern.SYNC
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
          ':states:::elasticmapreduce:terminateCluster.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId'
    },
  });
});

test('Terminate cluster with static ClusterId and SYNC integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrTerminateCluster({
      clusterId: 'ClusterId',
      integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
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
          ':states:::elasticmapreduce:terminateCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId'
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.EmrTerminateCluster({
        clusterId: 'ClusterId',
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call TerminateCluster./i);
});

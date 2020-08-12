import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Terminate cluster with static ClusterId', () => {
  // WHEN
  const task = new tasks.EmrTerminateCluster(stack, 'Task', {
    clusterId: 'ClusterId',
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
      ClusterId: 'ClusterId',
    },
  });
});

test('Terminate cluster with ClusterId from payload', () => {
  // WHEN
  const task = new tasks.EmrTerminateCluster(stack, 'Task', {
    clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
      'ClusterId.$': '$.ClusterId',
    },
  });
});

test('Terminate cluster with static ClusterId and SYNC integrationPattern', () => {
  // WHEN
  const task = new tasks.EmrTerminateCluster(stack, 'Task', {
    clusterId: 'ClusterId',
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
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
      ClusterId: 'ClusterId',
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new tasks.EmrTerminateCluster(stack, 'Task', {
      clusterId: 'ClusterId',
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});

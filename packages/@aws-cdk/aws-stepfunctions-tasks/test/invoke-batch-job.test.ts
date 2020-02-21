import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';
import { Aws } from '@aws-cdk/core';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Task with only the required parameters', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.InvokeBatchJob({
      jobDefinition: 'JobArn',
      jobName: 'JobName',
      jobQueue: 'QueueArn'
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
            Ref: 'AWS::Partition'
          },
          ':states:::batch:submitJob.sync'
        ]
      ]
    },
    End: true,
    Parameters: {
      JobDefinition: 'JobArn',
      JobName: 'JobName',
      JobQueue: 'QueueArn'
    }
  });
});

test('Task with all the parameters', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.InvokeBatchJob({
      jobDefinition: 'JobArn',
      jobName: 'JobName',
      jobQueue: `arn:aws:batch:${Aws.REGION}:${Aws.ACCOUNT_ID}:job-queue/QueueArn`,
      payload: {
        foo: sfn.Data.stringAt('$.bar')
      },
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
            Ref: 'AWS::Partition'
          },
          ':states:::batch:submitJob'
        ]
      ]
    },
    End: true,
    Parameters: {
      JobDefinition: 'JobArn',
      JobName: 'JobName',
      JobQueue: {
        'Fn::Join': [
          '',
          [
            'arn:aws:batch:',
            {
              Ref: 'AWS::Region'
            },
            ':',
            {
              Ref: 'AWS::AccountId'
            },
            ':job-queue/QueueArn'
          ]
        ]
      },
      Parameter: {
        'foo.$': '$.bar'
      }
    }
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.InvokeBatchJob({
        jobDefinition: 'JobArn',
        jobName: 'JobName',
        jobQueue: 'QueueArn',
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(
    /Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call InvokeBatchJob./i
  );
});

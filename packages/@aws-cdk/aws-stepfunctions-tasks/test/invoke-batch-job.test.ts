import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

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
      jobQueue: `JobQueue`,
      arrayProperties: {
        size: 15
      },
      containerOverrides: {
        command: ['sudo', 'rm'],
        environment: [{ name: 'key', value: 'value' }],
        instanceType: 'MULTI',
        memory: 1024,
        resourceRequirements: [{ type: 'GPU', value: '1' }],
        vcpus: 10
      },
      dependsOn: [{ jobId: '1234', type: 'some_type' }],
      payload: {
        foo: sfn.Data.stringAt('$.bar')
      },
      retryStrategy: { attempts: 3 },
      timeout: cdk.Duration.seconds(30),
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
      JobQueue: 'JobQueue',
      ArrayProperties: { Size: 15 },
      ContainerOverrides: {
        Command: ['sudo', 'rm'],
        Environment: [{ Name: 'key', Value: 'value' }],
        InstanceType: 'MULTI',
        Memory: 1024,
        ResourceRequirements: [{ Type: 'GPU', Value: '1' }],
        Vcpus: 10
      },
      DependsOn: [{ JobId: '1234', Type: 'some_type' }],
      Parameters: { 'foo.$': '$.bar' },
      RetryStrategy: { Attempts: 3 },
      Timeout: { AttemptDurationSeconds: 30 }
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

import * as path from 'path';
import * as batch from '@aws-cdk/aws-batch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;
let batchJobDefinition: batch.IJobDefinition;
let batchJobQueue: batch.IJobQueue;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();

  batchJobDefinition = new batch.JobDefinition(stack, 'JobDefinition', {
    container: {
      image: ecs.ContainerImage.fromAsset(
        path.join(__dirname, 'batchjob-image'),
      ),
    },
  });

  batchJobQueue = new batch.JobQueue(stack, 'JobQueue', {
    computeEnvironments: [
      {
        order: 1,
        computeEnvironment: new batch.ComputeEnvironment(stack, 'ComputeEnv', {
          computeResources: { vpc: new ec2.Vpc(stack, 'vpc') },
        }),
      },
    ],
  });
});

test('Task with only the required parameters', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunBatchJob({
      jobDefinition: batchJobDefinition,
      jobName: 'JobName',
      jobQueue: batchJobQueue,
    }),
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
          ':states:::batch:submitJob.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      JobDefinition: { Ref: 'JobDefinition24FFE3ED' },
      JobName: 'JobName',
      JobQueue: { Ref: 'JobQueueEE3AD499' },
    },
  });
});

test('Task with all the parameters', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunBatchJob({
      jobDefinition: batchJobDefinition,
      jobName: 'JobName',
      jobQueue: batchJobQueue,
      arraySize: 15,
      containerOverrides: {
        command: ['sudo', 'rm'],
        environment: { key: 'value' },
        instanceType: new ec2.InstanceType('MULTI'),
        memory: 1024,
        gpuCount: 1,
        vcpus: 10,
      },
      dependsOn: [{ jobId: '1234', type: 'some_type' }],
      payload: {
        foo: sfn.JsonPath.stringAt('$.bar'),
      },
      attempts: 3,
      timeout: cdk.Duration.seconds(60),
      integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
    }),
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
          ':states:::batch:submitJob',
        ],
      ],
    },
    End: true,
    Parameters: {
      JobDefinition: { Ref: 'JobDefinition24FFE3ED' },
      JobName: 'JobName',
      JobQueue: { Ref: 'JobQueueEE3AD499' },
      ArrayProperties: { Size: 15 },
      ContainerOverrides: {
        Command: ['sudo', 'rm'],
        Environment: [{ Name: 'key', Value: 'value' }],
        InstanceType: 'MULTI',
        Memory: 1024,
        ResourceRequirements: [{ Type: 'GPU', Value: '1' }],
        Vcpus: 10,
      },
      DependsOn: [{ JobId: '1234', Type: 'some_type' }],
      Parameters: { 'foo.$': '$.bar' },
      RetryStrategy: { Attempts: 3 },
      Timeout: { AttemptDurationSeconds: 60 },
    },
  });
});

test('supports tokens', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunBatchJob({
      jobDefinition: batchJobDefinition,
      jobName: sfn.JsonPath.stringAt('$.jobName'),
      jobQueue: batchJobQueue,
      arraySize: sfn.JsonPath.numberAt('$.arraySize'),
      timeout: cdk.Duration.seconds(sfn.JsonPath.numberAt('$.timeout')),
      attempts: sfn.JsonPath.numberAt('$.attempts'),
    }),
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
          ':states:::batch:submitJob.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      'JobDefinition': { Ref: 'JobDefinition24FFE3ED' },
      'JobName.$': '$.jobName',
      'JobQueue': { Ref: 'JobQueueEE3AD499' },
      'ArrayProperties': {
        'Size.$': '$.arraySize',
      },
      'RetryStrategy': {
        'Attempts.$': '$.attempts',
      },
      'Timeout': {
        'AttemptDurationSeconds.$': '$.timeout',
      },
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      }),
    });
  }).toThrow(
    /Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call RunBatchJob./i,
  );
});

test('Task throws if environment in containerOverrides contain env with name starting with AWS_BATCH', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        containerOverrides: {
          environment: { AWS_BATCH_MY_NAME: 'MY_VALUE' },
        },
      }),
    });
  }).toThrow(
    /Invalid environment variable name: AWS_BATCH_MY_NAME. Environment variable names starting with 'AWS_BATCH' are reserved./i,
  );
});

test('Task throws if arraySize is out of limits 2-10000', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        arraySize: 1,
      }),
    });
  }).toThrow(
    /arraySize must be between 2 and 10,000/,
  );

  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        arraySize: 10001,
      }),
    });
  }).toThrow(
    /arraySize must be between 2 and 10,000/,
  );
});

test('Task throws if dependencies exceeds 20', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        dependsOn: [...Array(21).keys()].map(i => ({
          jobId: `${i}`,
          type: `some_type-${i}`,
        })),
      }),
    });
  }).toThrow(
    /dependencies must be 20 or less/,
  );
});

test('Task throws if attempts is out of limits 1-10', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        attempts: 0,
      }),
    });
  }).toThrow(
    /attempts must be between 1 and 10/,
  );

  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        attempts: 11,
      }),
    });
  }).toThrow(
    /attempts must be between 1 and 10/,
  );
});

test('Task throws if timeout is less than 60 sec', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'JobName',
        jobQueue: batchJobQueue,
        timeout: cdk.Duration.seconds(59),
      }),
    });
  }).toThrow(
    /timeout must be greater than 60 seconds/,
  );
});

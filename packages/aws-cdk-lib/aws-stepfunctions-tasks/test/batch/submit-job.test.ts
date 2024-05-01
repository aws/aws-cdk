import * as path from 'path';
import * as batch from '../../../aws-batch';
import * as ec2 from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import * as sfn from '../../../aws-stepfunctions';
import { BatchSubmitJob } from '../../../aws-stepfunctions-tasks';
import * as cdk from '../../../core';

let stack: cdk.Stack;
let batchJobDefinition: batch.IJobDefinition;
let batchJobQueue: batch.IJobQueue;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();

  batchJobDefinition = new batch.EcsJobDefinition(stack, 'JobDefinition', {
    container: new batch.EcsEc2ContainerDefinition(stack, 'Container', {
      image: ecs.ContainerImage.fromAsset(
        path.join(__dirname, 'batchjob-image'),
      ),
      cpu: 256,
      memory: cdk.Size.mebibytes(2048),
    }),
  });

  batchJobQueue = new batch.JobQueue(stack, 'JobQueue', {
    computeEnvironments: [
      {
        order: 1,
        computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(stack, 'ComputeEnv', {
          vpc: new ec2.Vpc(stack, 'vpc'),
        }),
      },
    ],
  });
});

test('Task with only the required parameters', () => {
  // WHEN
  const task = new BatchSubmitJob(stack, 'Task', {
    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
    jobName: 'JobName',
    jobQueueArn: batchJobQueue.jobQueueArn,
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
      JobQueue: {
        'Fn::GetAtt': [
          'JobQueueEE3AD499',
          'JobQueueArn',
        ],
      },
    },
  });
});

test('Task with all the parameters', () => {
  // WHEN
  const task = new BatchSubmitJob(stack, 'Task', {
    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
    jobName: 'JobName',
    jobQueueArn: batchJobQueue.jobQueueArn,
    arraySize: 15,
    containerOverrides: {
      command: ['sudo', 'rm'],
      environment: { key: 'value' },
      instanceType: new ec2.InstanceType('MULTI'),
      memory: cdk.Size.mebibytes(1024),
      gpuCount: 1,
      vcpus: 10,
    },
    dependsOn: [{ jobId: '1234', type: 'some_type' }],
    payload: sfn.TaskInput.fromObject({
      foo: sfn.JsonPath.stringAt('$.bar'),
    }),
    attempts: 3,
    taskTimeout: sfn.Timeout.duration(cdk.Duration.seconds(60)),
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
          ':states:::batch:submitJob',
        ],
      ],
    },
    End: true,
    Parameters: {
      JobDefinition: { Ref: 'JobDefinition24FFE3ED' },
      JobName: 'JobName',
      JobQueue: {
        'Fn::GetAtt': [
          'JobQueueEE3AD499',
          'JobQueueArn',
        ],
      },
      ArrayProperties: { Size: 15 },
      ContainerOverrides: {
        Command: ['sudo', 'rm'],
        Environment: [{ Name: 'key', Value: 'value' }],
        InstanceType: 'MULTI',
        ResourceRequirements: [{ Type: 'GPU', Value: '1' }, { Type: 'MEMORY', Value: '1024' }, { Type: 'VCPU', Value: '10' }],
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
  const task = new BatchSubmitJob(stack, 'Task', {
    jobName: sfn.JsonPath.stringAt('$.jobName'),
    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
    jobQueueArn: batchJobQueue.jobQueueArn,
    arraySize: sfn.JsonPath.numberAt('$.arraySize'),
    taskTimeout: sfn.Timeout.at('$.timeout'),
    attempts: sfn.JsonPath.numberAt('$.attempts'),
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
      'JobQueue': {
        'Fn::GetAtt': [
          'JobQueueEE3AD499',
          'JobQueueArn',
        ],
      },
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

test('container overrides are tokens', () => {
  // WHEN
  const task = new BatchSubmitJob(stack, 'Task', {
    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
    jobName: 'JobName',
    jobQueueArn: batchJobQueue.jobQueueArn,
    containerOverrides: {
      memory: cdk.Size.mebibytes(sfn.JsonPath.numberAt('$.asdf')),
    },
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':states:::batch:submitJob.sync']] },
    End: true,
    Parameters: {
      JobDefinition: { Ref: 'JobDefinition24FFE3ED' },
      JobName: 'JobName',
      JobQueue: {
        'Fn::GetAtt': [
          'JobQueueEE3AD499',
          'JobQueueArn',
        ],
      },
      ContainerOverrides: {
        ResourceRequirements: [{ 'Type': 'MEMORY', 'Value.$': '$.asdf' }],
      },
    },
  });
});

test('supports passing task input into payload', () => {
  // WHEN
  const task = new BatchSubmitJob(stack, 'Task', {
    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
    jobQueueArn: batchJobQueue.jobQueueArn,
    jobName: sfn.JsonPath.stringAt('$.jobName'),
    payload: sfn.TaskInput.fromJsonPathAt('$.foo'),
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
      'JobQueue': {
        'Fn::GetAtt': [
          'JobQueueEE3AD499',
          'JobQueueArn',
        ],
      },
      'Parameters.$': '$.foo',
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new BatchSubmitJob(stack, 'Task', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/,
  );
});

test('Task throws if environment in containerOverrides contain env with name starting with AWS_BATCH', () => {
  expect(() => {
    new BatchSubmitJob(stack, 'Task', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      containerOverrides: {
        environment: { AWS_BATCH_MY_NAME: 'MY_VALUE' },
      },
    });
  }).toThrow(
    /Invalid environment variable name: AWS_BATCH_MY_NAME. Environment variable names starting with 'AWS_BATCH' are reserved./,
  );
});

test('Task throws if arraySize is out of limits 2-10000', () => {
  expect(() => {
    new BatchSubmitJob(stack, 'Task', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      arraySize: 1,
    });
  }).toThrow(
    /arraySize must be between 2 and 10,000/,
  );

  expect(() => {
    new BatchSubmitJob(stack, 'Task2', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      arraySize: 10001,
    });
  }).toThrow(
    /arraySize must be between 2 and 10,000/,
  );
});

test('Task throws if dependencies exceeds 20', () => {
  expect(() => {
    new BatchSubmitJob(stack, 'Task', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      dependsOn: [...Array(21).keys()].map(i => ({
        jobId: `${i}`,
        type: `some_type-${i}`,
      })),
    });
  }).toThrow(
    /dependencies must be 20 or less/,
  );
});

test('Task throws if attempts is out of limits 1-10', () => {
  expect(() => {
    new BatchSubmitJob(stack, 'Task', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      attempts: 0,
    });
  }).toThrow(
    /attempts must be between 1 and 10/,
  );

  expect(() => {
    new BatchSubmitJob(stack, 'Task2', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      attempts: 11,
    });
  }).toThrow(
    /attempts must be between 1 and 10/,
  );
});

test('Task throws if attempt duration is less than 60 sec', () => {
  expect(() => {
    new BatchSubmitJob(stack, 'Task', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      taskTimeout: sfn.Timeout.duration(cdk.Duration.seconds(59)),
    });
  }).toThrow(
    /attempt duration must be greater than 60 seconds./,
  );
});

test('supports passing tags', () => {
  // WHEN
  const task = new BatchSubmitJob(stack, 'Task', {
    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
    jobQueueArn: batchJobQueue.jobQueueArn,
    jobName: sfn.JsonPath.stringAt('$.jobName'),
    tags: {
      test: 'this is a tag',
    },
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
      'JobQueue': {
        'Fn::GetAtt': [
          'JobQueueEE3AD499',
          'JobQueueArn',
        ],
      },
      'Tags': {
        test: 'this is a tag',
      },
    },
  });
});

test('throws if tags has invalid value', () => {
  expect(() => {
    const tags: { [key: string]: string } = {};
    for (let i = 0; i < 100; i++) {
      tags[i] = 'tag';
    }
    new BatchSubmitJob(stack, 'Task1', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      tags,
    });
  }).toThrow(
    /Maximum tag number of entries is 50./,
  );

  expect(() => {
    const keyTooLong = 'k'.repeat(150);
    const tags: { [key: string]: string } = {};
    tags[keyTooLong] = 'tag';
    new BatchSubmitJob(stack, 'Task2', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      tags,
    });
  }).toThrow(
    /Tag key size must be between 1 and 128/,
  );

  expect(() => {
    const tags = { key: 'k'.repeat(300) };
    new BatchSubmitJob(stack, 'Task3', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
      jobName: 'JobName',
      jobQueueArn: batchJobQueue.jobQueueArn,
      tags,
    });
  }).toThrow(
    /Tag value maximum size is 256/,
  );
});

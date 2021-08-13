

import '@aws-cdk/assert-internal/jest';
// import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersStartJobRun, ReleaseLabel, ApplicationConfiguration, Classification } from '../../lib/emrcontainers/start-job-run';

//const emrContainersJobName = 'EMR Containers Job';
let stack: Stack;
let clusterId: string;
/**
 * To do for testing
 * 1. Need to test without default properties AND also test for required properties- not done
 * 2. Need to test ALL supported integration patterns and throw errors when needed - not done
 * 3. Need to finish testing for all policy statements - COMPLETED
 * 4. Need to test for validation errors - PARTIAL
 */

beforeEach(() => {
  stack = new Stack();
  clusterId = 'clusterId';
});

test('Task throws if Application Configuration array is larger than 100', () => {
  const struct = { classification: Classification.SPARK };
  // fiil 101 indexes in the array with an application configuration
  const appConfig: ApplicationConfiguration[] = [];
  for (let index = 0; index <= 100; index++) {
    appConfig[index] = struct;
  }

  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
        },
      },
      applicationConfig: appConfig,
    });
  }).toThrow(`Application configuration array must have 100 or fewer entries. Received ${appConfig.length}.`);
});

test('Task throws if Application Configuration array is larger than 100', () => {
  const struct = { classification: Classification.SPARK };
  // fiil 101 indexes in the array with an application configuration
  let appConfig: ApplicationConfiguration[] = [];
  for (let index = 0; index <= 100; index++) {
    appConfig[index] = struct;
  }

  // add a nested configuration array with 101 elements
  const nestedConfigStruct = { classification: Classification.SPARK, nestedConfig: appConfig };
  appConfig[0] = nestedConfigStruct;

  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
        },
      },
      applicationConfig: appConfig,
    });
  }).toThrow(`Application configuration array must have 100 or fewer entries. Received ${appConfig.length}`);
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
        },
      },
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
        },
      },
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
        },
      },
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});

test('Permitted role actions with Start Job Run for SYNC integration pattern', () => {
  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'Task', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('job-location'),
      },
    },
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: [
          'emr-containers:StartJobRun',
        ],
        Condition: {
          StringEquals: {
            'emr-containers:ExecutionRoleArn': {
              'Fn::GetAtt': [
                'EMRContainersStartJobRunJobExecutionRole40B8DD81',
                'Arn',
              ],
            },
          },
        },
        Resource: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':emr-containers:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              `:/virtualclusters/${clusterId}`,
            ],
          ],
        },
      },
      {
        Action: [
          'emr-containers:DescribeJobRun',
          'emr-containers:CancelJobRun',
        ],
        Effect: 'Allow',
        Resource: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':emr-containers:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              `:/virtualclusters/${clusterId}/jobruns/*`,
            ],
          ],
        },
      }],
    },
  });
});

test('Permitted role actions for Start Job Run with REQUEST/RESPONSE integration pattern', () => {
  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'Task', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('job-location'),
      },
    },
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: [
          'emr-containers:StartJobRun',
        ],
        Condition: {
          StringEquals: {
            'emr-containers:ExecutionRoleArn': {
              'Fn::GetAtt': [
                'EMRContainersStartJobRunJobExecutionRole40B8DD81',
                'Arn',
              ],
            },
          },
        },
        Resource: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':emr-containers:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              `:/virtualclusters/${clusterId}`,
            ],
          ],
        },
      }],
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
        },
      },
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});
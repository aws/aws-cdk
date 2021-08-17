

import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersStartJobRun, ReleaseLabel, ApplicationConfiguration, Classification } from '../../lib/emrcontainers/start-job-run';

let stack: Stack;
let clusterId: string;
/**
 * To do for testing
 * 1. Need to test without default properties AND also test for required properties- DONE
 * 2. Need to test ALL supported integration patterns and throw errors when needed - DONE
 * 3. Need to finish testing for all policy statements - DONE
 * 4. Need to test for validation errors - DONE
 */

beforeEach(() => {
  stack = new Stack();
  clusterId = 'clusterId';
});

test('Invoke EMR Containers Start Job Run with Request/Response integration pattern', () => {

  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
      },
    },
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
          ':states:::emr-containers:startJobRun',
        ],
      ],
    },
    End: true,
    Parameters: {
      VirtualClusterId: clusterId,
      ReleaseLabel: ReleaseLabel.EMR_6_2_0.label,
      JobDriver: {
        SparkSubmitJobDriver: {
          EntryPoint: 'local:///usr/lib/spark/examples/src/main/python/pi.py',
          SparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
        },
      },
      ConfigurationOverrides: {},
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'EMRContainersStartJobRunJobExecutionRole40B8DD81',
          'Arn',
        ],
      },
    },
  });
});

test('Invoke EMR Containers Start Job Run with .sync integration pattern', () => {

  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
      },
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
          ':states:::emr-containers:startJobRun.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      VirtualClusterId: clusterId,
      ReleaseLabel: ReleaseLabel.EMR_6_2_0.label,
      JobDriver: {
        SparkSubmitJobDriver: {
          EntryPoint: 'local:///usr/lib/spark/examples/src/main/python/pi.py',
          SparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
        },
      },
      ConfigurationOverrides: {},
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'EMRContainersStartJobRunJobExecutionRole40B8DD81',
          'Arn',
        ],
      },
    },
  });
});

test('Invoke EMR Containers Start Job Run with virtual cluster id from payload', () => {

  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromDataAt('$.ClusterId'),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    executionRole: iam.Role.fromRoleArn(stack, 'Job Execution Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
      },
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
          ':states:::emr-containers:startJobRun.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      'VirtualClusterId.$': '$.ClusterId',
      'ReleaseLabel': ReleaseLabel.EMR_6_2_0.label,
      'JobDriver': {
        SparkSubmitJobDriver: {
          EntryPoint: 'local:///usr/lib/spark/examples/src/main/python/pi.py',
          SparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
        },
      },
      'ConfigurationOverrides': {},
      'ExecutionRoleArn': 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole',
    },
  });
});

test('Invoke EMR Containers Start Job Run with Tags', () => {

  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
      },
    },
    tags: {
      key: 'value',
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
          ':states:::emr-containers:startJobRun.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      VirtualClusterId: clusterId,
      ReleaseLabel: ReleaseLabel.EMR_6_2_0.label,
      JobDriver: {
        SparkSubmitJobDriver: {
          EntryPoint: 'local:///usr/lib/spark/examples/src/main/python/pi.py',
          SparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
        },
      },
      ConfigurationOverrides: {},
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'EMRContainersStartJobRunJobExecutionRole40B8DD81',
          'Arn',
        ],
      },
      Tags: [{
        Key: 'key',
        Value: 'value',
      }],
    },
  });
});


test('Invoke EMR Containers Start Job Run with Application Configuration', () => {

  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
      },
    },
    applicationConfig: [{
      classification: Classification.SPARK_DEFAULTS,
      properties: {
        'spark.executor.instances': '1',
        'spark.executor.memory': '512M',
      },
    }],
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
          ':states:::emr-containers:startJobRun.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      VirtualClusterId: clusterId,
      ReleaseLabel: ReleaseLabel.EMR_6_2_0.label,
      JobDriver: {
        SparkSubmitJobDriver: {
          EntryPoint: 'local:///usr/lib/spark/examples/src/main/python/pi.py',
          SparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
        },
      },
      ConfigurationOverrides: {
        ApplicationConfiguration: [{
          Classification: Classification.SPARK_DEFAULTS.classificationStatement,
          Properties: {
            'spark.executor.instances': '1',
            'spark.executor.memory': '512M',
          },
        }],
      },
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'EMRContainersStartJobRunJobExecutionRole40B8DD81',
          'Arn',
        ],
      },

    },
  });
});

test('Invoke EMR Containers Start Job Run with Monitoring', () => {
  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
      },
    },
    monitoring: {
      logging: true,
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
          ':states:::emr-containers:startJobRun.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      VirtualClusterId: clusterId,
      ReleaseLabel: ReleaseLabel.EMR_6_2_0.label,
      JobDriver: {
        SparkSubmitJobDriver: {
          EntryPoint: 'local:///usr/lib/spark/examples/src/main/python/pi.py',
          SparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
        },
      },
      ConfigurationOverrides: {
        MonitoringConfiguration: {
          CloudWatchMonitoringConfiguration: {
            LogGroupName: {
              Ref: 'EMRContainersStartJobRunMonitoringLogGroup882D450C',
            },
          },
          PersistentAppUI: 'ENABLED',
          S3MonitoringConfiguration: {
            LogUri: {
              'Fn::Join': [
                '',
                [
                  's3://',
                  {
                    Ref: 'EMRContainersStartJobRunMonitoringBucket8BB3FC54',
                  },
                ],
              ],
            },
          },
        },
      },
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'EMRContainersStartJobRunJobExecutionRole40B8DD81',
          'Arn',
        ],
      },
    },
  });
});

test('Invoke EMR Containers Start Job Run with Job Execution Role', () => {

  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    executionRole: iam.Role.fromRoleArn(stack, 'Job Execution Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
      },
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
          ':states:::emr-containers:startJobRun.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      VirtualClusterId: clusterId,
      ReleaseLabel: ReleaseLabel.EMR_6_2_0.label,
      JobDriver: {
        SparkSubmitJobDriver: {
          EntryPoint: 'local:///usr/lib/spark/examples/src/main/python/pi.py',
          SparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor cores=2 --conf spark.driver.cores=1',
        },
      },
      ConfigurationOverrides: {},
      ExecutionRoleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole',
    },
  });
});

test('Task throws if Application Configuration array is larger than 100', () => {
  const struct = { classification: Classification.SPARK };
  // fiil 101 indexes in the array with an application configuration
  const appConfig: ApplicationConfiguration[] = new Array(101).fill(struct);

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

test('Task throws if Application Configuration nested configuration array is larger than 100', () => {
  const struct = { classification: Classification.SPARK };
  // fiil 101 indexes in the array with an application configuration
  let appConfig: ApplicationConfiguration[] = new Array(101).fill(struct);

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

test('Task throws if Entry Point is not between 1 to 256 characters in length', () => {

  // WHEN
  const entryPointString = 'x'.repeat(257);

  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Start Job Run Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText(entryPointString),
        },
      },
    });
  }).toThrow(`Entry point must be between 1 and 256 characters in length. Received ${entryPointString.length}.`);

  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText(''),
        },
      },
    });
  }).toThrow('Entry point must be between 1 and 256 characters in length. Received 0.');
});

test('Task throws if Entry Point Arguments is not an string array that is between 1 and 10280 entries in length', () => {
  // WHEN
  const entryPointArgs = sfn.TaskInput.fromObject(new Array(10281).fill('x', 10281));
  const entryPointArgsNone = sfn.TaskInput.fromObject([]);
  const entryPointNumbers = sfn.TaskInput.fromObject(new Array(1).fill(1));
  const entryPointJson = sfn.TaskInput.fromJsonPathAt('$.Job');

  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'String array error Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
          entryPointArguments: entryPointNumbers,
        },
      },
    });
  }).toThrow(`Entry point arguments must be a string array. Received ${entryPointNumbers.type}.`);


  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'JSON Path error Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
          entryPointArguments: entryPointJson,
        },
      },
    });
  }).toThrow(`Entry point arguments must be a string array. Received ${entryPointJson.type}.`);

  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Greater than 256 Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
          entryPointArguments: entryPointArgs,
        },
      },
    });
  }).toThrow(`Entry point arguments must be an string array between 1 and 10280 in length. Received ${entryPointArgs.value.length}.`);

  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Less than 1 Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
          entryPointArguments: entryPointArgsNone,
        },
      },
    });
  }).toThrow(`Entry point arguments must be an string array between 1 and 10280 in length. Received ${entryPointArgsNone.value.length}.`);
});

test('Task throws if Spark Submit Parameters is NOT between 1 characters and 102400 characters in length', () => {

  // WHEN
  const sparkSubmitParam = 'x'.repeat(10 * 101 * 101 * 2);

  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Spark Submit Parameter Task', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
          sparkSubmitParameters: sparkSubmitParam,
        },
      },
    });
  }).toThrow(`Spark submit parameters must be between 1 and 102400 characters in length. Received ${sparkSubmitParam.length}.`);
});

test('Task throws if an execution role is undefined and the virtual cluster ID is not a concrete value', () => {
  // WHEN
  const jsonPath = '$.ClusterId';

  // THEN
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromJsonPathAt(jsonPath),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('job-location'),
        },
      },
    });
  }).toThrow('Execution role cannot be undefined when the virtual cluster ID is not a concrete value. Provide an execution role with the correct trust policy');
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
        Action: 'emr-containers:StartJobRun',
        Condition: {
          StringEquals: {
            'emr-containers:ExecutionRoleArn': {
              'Fn::GetAtt': [
                'TaskJobExecutionRole5D5BBA5A',
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

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'logs:DescribeLogGroups',
            'logs:DescribeLogStreams',
          ],
          Effect: 'Allow',
          Resource: 'arn:aws:logs:*:*:*',
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'TaskJobExecutionRoleDefaultPolicy6FE2FE84',
    Roles: [
      {
        Ref: 'TaskJobExecutionRole5D5BBA5A',
      },
    ],
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'emr-containers:DescribeVirtualCluster',
        Resource: '*',
      }],
    },
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'lambda:InvokeFunction',
        Resource: {
          'Fn::GetAtt': [
            'SingletonLambda8693BB64968944B69AAFB0CC9EB8757CB6182A5B',
            'Arn',
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
        Action: 'emr-containers:StartJobRun',
        Condition: {
          StringEquals: {
            'emr-containers:ExecutionRoleArn': {
              'Fn::GetAtt': [
                'TaskJobExecutionRole5D5BBA5A',
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

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'logs:DescribeLogGroups',
            'logs:DescribeLogStreams',
          ],
          Effect: 'Allow',
          Resource: 'arn:aws:logs:*:*:*',
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'TaskJobExecutionRoleDefaultPolicy6FE2FE84',
    Roles: [
      {
        Ref: 'TaskJobExecutionRole5D5BBA5A',
      },
    ],
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'emr-containers:DescribeVirtualCluster',
        Resource: '*',
      }],
    },
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'lambda:InvokeFunction',
        Resource: {
          'Fn::GetAtt': [
            'SingletonLambda8693BB64968944B69AAFB0CC9EB8757CB6182A5B',
            'Arn',
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

import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersStartJobRun, ReleaseLabel, ApplicationConfiguration, Classification } from '../../lib/emrcontainers/start-job-run';

let stack: Stack;
let clusterId: string;

beforeEach(() => {
  stack = new Stack();
  clusterId = 'clusterId';
});

describe('Invoke EMR Containers Start Job Run with ', () => {
  test('Request/Response integration pattern', () => {

    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
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
            SparkSubmitParameters: '--conf spark.executor.instances=2',
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

  test('.sync integration pattern', () => {

    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
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
            SparkSubmitParameters: '--conf spark.executor.instances=2',
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

  test('virtual cluster id from payload', () => {

    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromDataAt('$.ClusterId'),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      executionRole: iam.Role.fromRoleArn(stack, 'Job Execution Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
        },
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        'VirtualClusterId.$': '$.ClusterId',
        'ExecutionRoleArn': 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole',
      },
    });
  });

  test('Tags', () => {

    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
        },
      },
      tags: {
        key: 'value',
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        Tags: [{
          Key: 'key',
          Value: 'value',
        }],
      },
    });
  });


  test('Application Configuration', () => {

    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
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
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        ConfigurationOverrides: {
          ApplicationConfiguration: [{
            Classification: Classification.SPARK_DEFAULTS.classificationStatement,
            Properties: {
              'spark.executor.instances': '1',
              'spark.executor.memory': '512M',
            },
          }],
        },
      },
    });
  });

  test('Job Execution Role', () => {

    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      executionRole: iam.Role.fromRoleArn(stack, 'Job Execution Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
        },
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        ExecutionRoleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole',
      },
    });
  });
});

describe('Invoke EMR Containers Start Job Run with Monitoring ', () => {
  test('generated automatically', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
        },
      },
      monitoring: {
        logging: true,
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject*',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'EMRContainersStartJobRunMonitoringBucket8BB3FC54',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'EMRContainersStartJobRunMonitoringBucket8BB3FC54',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
          {
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'EMRContainersStartJobRunMonitoringLogGroup882D450C',
                'Arn',
              ],
            },
          },
          {
            Action: 'logs:DescribeLogStreams',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'EMRContainersStartJobRunMonitoringLogGroup882D450C',
                'Arn',
              ],
            },
          },
          {
            Action: 'logs:DescribeLogGroups',
            Effect: 'Allow',
            Resource: 'arn:aws:logs:*:*:*',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'EMRContainersStartJobRunJobExecutionRoleDefaultPolicyCDBDF13E',
      Roles: [
        {
          Ref: 'EMRContainersStartJobRunJobExecutionRole40B8DD81',
        },
      ],
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
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
      },
    });
  });

  test('provided from user', () => {
    // WHEN

    const logGroup = new logs.LogGroup(stack, 'Log Group');
    const s3Bucket = new s3.Bucket(stack, 'Bucket');
    const prefixName = 'prefix';

    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      virtualClusterId: sfn.TaskInput.fromText(clusterId),
      releaseLabel: ReleaseLabel.EMR_6_2_0,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
          sparkSubmitParameters: '--conf spark.executor.instances=2',
        },
      },
      monitoring: {
        logBucket: s3Bucket,
        logGroup: logGroup,
        logStreamNamePrefix: prefixName,
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject*',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'EMRContainersStartJobRunMonitoringBucket8BB3FC54',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'EMRContainersStartJobRunMonitoringBucket8BB3FC54',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
          {
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'EMRContainersStartJobRunMonitoringLogGroup882D450C',
                'Arn',
              ],
            },
          },
          {
            Action: 'logs:DescribeLogStreams',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'EMRContainersStartJobRunMonitoringLogGroup882D450C',
                'Arn',
              ],
            },
          },
          {
            Action: 'logs:DescribeLogGroups',
            Effect: 'Allow',
            Resource: 'arn:aws:logs:*:*:*',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'EMRContainersStartJobRunJobExecutionRoleDefaultPolicyCDBDF13E',
      Roles: [
        {
          Ref: 'EMRContainersStartJobRunJobExecutionRole40B8DD81',
        },
      ],
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        ConfigurationOverrides: {
          MonitoringConfiguration: {
            CloudWatchMonitoringConfiguration: {
              LogGroupName: {
                Ref: 'EMRContainersStartJobRunMonitoringLogGroup882D450C',
              },
              LogStreamNamePrefix: prefixName,
            },
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
});

describe('Task throws if ', () => {
  test('Application Configuration array is larger than 100', () => {
    // WHEN
    const struct = { classification: Classification.SPARK };
    const appConfig: ApplicationConfiguration[] = new Array(101).fill(struct);

    // THEN
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

  test('Application Configuration nested configuration array is larger than 100', () => {
    // WHEN
    const struct = { classification: Classification.SPARK };
    let appConfig: ApplicationConfiguration[] = new Array(101).fill(struct);

    const nestedConfigStruct = { classification: Classification.SPARK, nestedConfig: appConfig };
    appConfig[0] = nestedConfigStruct;

    // THEN
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

  test('Application Configuration properties is larger than 100 entries', () => {
    // WHEN
    const properties: { [key: string]: string } = {};
    for (let index = 0; index <= 100; index++) {
      properties[index.toString()] = 'value';
    }
    const appConfig: ApplicationConfiguration = { classification: Classification.SPARK, properties: properties };

    expect(() => {
      new EmrContainersStartJobRun(stack, 'Task', {
        virtualClusterId: sfn.TaskInput.fromText(clusterId),
        releaseLabel: ReleaseLabel.EMR_6_2_0,
        jobDriver: {
          sparkSubmitJobDriver: {
            entryPoint: sfn.TaskInput.fromText('job-location'),
          },
        },
        applicationConfig: [appConfig],
      });
    }).toThrow(`Application configuration properties must have 100 or fewer entries. Received ${Object.keys(properties).length}`);
  });

  test('Entry Point is not between 1 to 256 characters in length', () => {
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

  test('Entry Point Arguments is not an string array that is between 1 and 10280 entries in length', () => {
    // WHEN
    const entryPointArgs = sfn.TaskInput.fromObject(new Array(10281).fill('x', 10281));
    const entryPointArgsNone = sfn.TaskInput.fromObject([]);
    const entryPointNumbers = sfn.TaskInput.fromObject(new Array(1).fill(1));
    const entryPointJson = sfn.TaskInput.fromText('x');

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
    }).toThrow(`Entry point arguments must be a string array. Received ${typeof entryPointNumbers.value}.`);

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
    }).toThrow(`Entry point arguments must be a string array. Received ${typeof entryPointJson.value}.`);

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

  test('Spark Submit Parameters is NOT between 1 characters and 102400 characters in length', () => {
    // WHEN
    const sparkSubmitParam = 'x'.repeat(102401);

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

  test('an execution role is undefined and the virtual cluster ID is not a concrete value', () => {
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
});


test('Permitted role actions and resources with Start Job Run for SYNC integration pattern', () => {
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
});

test('Permitted role actions and resources with Start Job Run from payload', () => {
  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'Task', {
    virtualClusterId: sfn.TaskInput.fromJsonPathAt('$.ClusterId'),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    executionRole: iam.Role.fromRoleArn(stack, 'Job Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
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
            'emr-containers:ExecutionRoleArn': 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole',
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
              ':/virtualclusters/*',
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
              ':/virtualclusters/*',
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

});

test('Permitted IAM policy actions for EMR Containers SDK call for Describe Virtual Cluster', () => {
  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2',
      },
    },
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'emr-containers:DescribeVirtualCluster',
        Resource: '*',
      }],
    },
  });
});

test('Permitted IAM policy permissions for Custom Resource Lambda', () => {

  // WHEN
  const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
    virtualClusterId: sfn.TaskInput.fromText(clusterId),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2',
      },
    },
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
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

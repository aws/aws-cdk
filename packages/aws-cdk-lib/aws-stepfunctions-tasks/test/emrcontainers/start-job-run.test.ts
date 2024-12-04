import { Template } from '../../../assertions';
import * as iam from '../../../aws-iam';
import * as logs from '../../../aws-logs';
import * as s3 from '../../../aws-s3';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { EmrContainersStartJobRun, VirtualClusterInput, ReleaseLabel, ApplicationConfiguration, Classification, EmrContainersStartJobRunProps } from '../../lib/emrcontainers/start-job-run';

let stack: Stack;
let clusterId: string;
let defaultProps: EmrContainersStartJobRunProps;

beforeEach(() => {
  stack = new Stack();
  clusterId = 'clusterId';
  defaultProps = {
    virtualCluster: VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
    releaseLabel: ReleaseLabel.EMR_6_2_0,
    jobDriver: {
      sparkSubmitJobDriver: {
        entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
        sparkSubmitParameters: '--conf spark.executor.instances=2',
      },
    },
  };
});

describe('Invoke EMR Containers Start Job Run with ', () => {
  test('Request/Response integration pattern', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      ...defaultProps,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
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
    });
  });

  test('.sync integration pattern', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', defaultProps);
    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
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
    });
  });

  test('virtual cluster id from payload', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      ...defaultProps,
      virtualCluster: VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt('$.ClusterId')),
      executionRole: iam.Role.fromRoleArn(stack, 'Job Execution Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
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
      ...defaultProps,
      tags: {
        key: 'value',
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        Tags: {
          key: 'value',
        },
      },
    });
  });

  test('Application Configuration', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      ...defaultProps,
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

  test('Application Configuration with nested app config and no properties', () => {
    const properties: { [key: string]: string } = { HADOOP_DATANODE_HEAPSIZE: '2048', HADOOP_NAMENODE_OPTS: '-XX:GCTimeRatio=19' };
    const struct = { classification: new Classification('export'), properties: properties };
    const appConfigNested: ApplicationConfiguration[] = [struct];

    const mainConfig = { classification: new Classification('hadoop-env'), nestedConfig: appConfigNested };
    const appConfig: ApplicationConfiguration[] = [mainConfig];
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      ...defaultProps,
      applicationConfig: appConfig,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        ConfigurationOverrides: {
          ApplicationConfiguration: [{
            Classification: 'hadoop-env',
            Configurations: [{
              Classification: 'export',
              Properties: {
                HADOOP_DATANODE_HEAPSIZE: '2048',
                HADOOP_NAMENODE_OPTS: '-XX:GCTimeRatio=19',
              },
            }],
          }],
        },
      },
    });
  });

  test('Job Driver with Entry Point Arguments', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      ...defaultProps,
      jobDriver: {
        sparkSubmitJobDriver: {
          entryPoint: sfn.TaskInput.fromText('entrypoint'),
          entryPointArguments: sfn.TaskInput.fromJsonPathAt('$.entrypointArguments'),
        },
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        JobDriver: {
          SparkSubmitJobDriver: {
            'EntryPoint': 'entrypoint',
            'EntryPointArguments.$': '$.entrypointArguments',
          },
        },
      },
    });
  });

  test('Job Execution Role', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      ...defaultProps,
      executionRole: iam.Role.fromRoleArn(stack, 'Job Execution Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        ExecutionRoleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole',
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::CloudFormation::CustomResource', 0);
  });

  test('Virtual Cluster Input from virtualClusterId', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
      ...defaultProps,
      virtualCluster: VirtualClusterInput.fromVirtualClusterId(clusterId),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        VirtualClusterId: clusterId,
      },
    });
  });

  describe('Invoke EMR Containers Start Job Run with Monitoring ', () => {
    test('generated automatically', () => {
      // WHEN
      const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
        ...defaultProps,
        monitoring: {
          logging: true,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
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
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':*',
                  ],
                ],
              },
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
      const logGroup = logs.LogGroup.fromLogGroupName(stack, 'Monitoring Group', 'providedloggroup');
      const s3Bucket = s3.Bucket.fromBucketName(stack, 'Monitoring Bucket', 'providedbucket');;
      const prefixName = 'prefix';

      const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
        ...defaultProps,
        monitoring: {
          logBucket: s3Bucket,
          logGroup: logGroup,
          logStreamNamePrefix: prefixName,
          logging: false,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::providedbucket',
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::providedbucket/*',
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
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':log-group:providedloggroup:*',
                  ],
                ],
              },
            },
            {
              Action: 'logs:DescribeLogStreams',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':log-group:providedloggroup:*',
                  ],
                ],
              },
            },
            {
              Action: 'logs:DescribeLogGroups',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':*',
                  ],
                ],
              },
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
                LogGroupName: logGroup.logGroupName,
                LogStreamNamePrefix: prefixName,
              },
              S3MonitoringConfiguration: {
                LogUri: 's3://' + s3Bucket.bucketName,
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

    test('PersistentAppUI to be disabled when set to false', () => {
      // WHEN
      const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
        ...defaultProps,
        monitoring: {
          persistentAppUI: false,
        },
      });

      // THEN
      expect(stack.resolve(task.toStateJson())).toMatchObject({
        Parameters: {
          ConfigurationOverrides: {
            MonitoringConfiguration: {
              PersistentAppUI: 'DISABLED',
            },
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
          ...defaultProps,
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
          ...defaultProps,
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
          ...defaultProps,
          applicationConfig: [appConfig],
        });
      }).toThrow(`Application configuration properties must have 100 or fewer entries. Received ${Object.keys(properties).length}`);
    });

    test('Application Configuration properties is undefined and nested configuration array is undefined', () => {
      // WHEN
      const struct = { classification: Classification.SPARK };
      let appConfig: ApplicationConfiguration[] = new Array(1).fill(struct);

      // THEN
      expect(() => {
        new EmrContainersStartJobRun(stack, 'Task', {
          ...defaultProps,
          applicationConfig: appConfig,
        });
      }).toThrow('Application configuration must have either properties or nested app configurations defined.');
    });

    test('Entry Point is not between 1 to 256 characters in length', () => {
      // WHEN
      const entryPointString = 'x'.repeat(257);

      // THEN
      expect(() => {
        new EmrContainersStartJobRun(stack, 'Start Job Run Task', {
          ...defaultProps,
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
          ...defaultProps,
          jobDriver: {
            sparkSubmitJobDriver: {
              entryPoint: sfn.TaskInput.fromText(''),
            },
          },
        });
      }).toThrow('Entry point must be between 1 and 256 characters in length. Received 0.');
    });

    test('Entry Point Arguments is not a string array that is between 1 and 10280 entries in length', () => {
      // WHEN
      const entryPointArgs = sfn.TaskInput.fromObject(new Array(10281).fill('x', 10281));
      const entryPointArgsNone = sfn.TaskInput.fromObject([]);
      const entryPointNumbers = sfn.TaskInput.fromObject(new Array(1).fill(1));
      const entryPointJson = sfn.TaskInput.fromText('x');

      // THEN
      expect(() => {
        new EmrContainersStartJobRun(stack, 'String array error Task', {
          ...defaultProps,
          jobDriver: {
            sparkSubmitJobDriver: {
              entryPoint: sfn.TaskInput.fromText('job-location'),
              entryPointArguments: entryPointNumbers,
            },
          },
        });
      }).toThrow('Entry point arguments must be a string array or an encoded JSON path but received object');

      // THEN
      expect(() => {
        new EmrContainersStartJobRun(stack, 'JSON Path error Task', {
          ...defaultProps,
          jobDriver: {
            sparkSubmitJobDriver: {
              entryPoint: sfn.TaskInput.fromText('job-location'),
              entryPointArguments: entryPointJson,
            },
          },
        });
      }).toThrow('Entry point arguments must be a string array or an encoded JSON path, but received a non JSON path string');

      // THEN
      expect(() => {
        new EmrContainersStartJobRun(stack, 'Greater than 256 Task', {
          ...defaultProps,
          jobDriver: {
            sparkSubmitJobDriver: {
              entryPoint: sfn.TaskInput.fromText('job-location'),
              entryPointArguments: entryPointArgs,
            },
          },
        });
      }).toThrow(`Entry point arguments must be a string array between 1 and 10280 in length. Received ${entryPointArgs.value.length}.`);

      // THEN
      expect(() => {
        new EmrContainersStartJobRun(stack, 'Less than 1 Task', {
          ...defaultProps,
          jobDriver: {
            sparkSubmitJobDriver: {
              entryPoint: sfn.TaskInput.fromText('job-location'),
              entryPointArguments: entryPointArgsNone,
            },
          },
        });
      }).toThrow(`Entry point arguments must be a string array between 1 and 10280 in length. Received ${entryPointArgsNone.value.length}.`);
    });

    test('Spark Submit Parameters is NOT between 1 characters and 102400 characters in length', () => {
      // WHEN
      const sparkSubmitParam = 'x'.repeat(102401);

      // THEN
      expect(() => {
        new EmrContainersStartJobRun(stack, 'Spark Submit Parameter Task', {
          ...defaultProps,
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
          ...defaultProps,
          virtualCluster: VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt(jsonPath)),
        });
      }).toThrow('Execution role cannot be undefined when the virtual cluster ID is not a concrete value. Provide an execution role with the correct trust policy');
    });
  });

  test('Permitted role actions and resources with Start Job Run for SYNC integration pattern', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', defaultProps);

    new sfn.StateMachine(stack, 'SM', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'emr-containers:StartJobRun',
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
      ...defaultProps,
      virtualCluster: VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt('$.ClusterId')),
      executionRole: iam.Role.fromRoleArn(stack, 'Job Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
    });

    new sfn.StateMachine(stack, 'SM', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'emr-containers:StartJobRun',
          Condition: {
            StringEquals: {
              'emr-containers:ExecutionRoleArn': 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole',
            },
          },
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
      ...defaultProps,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });

    new sfn.StateMachine(stack, 'SM', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
                `:/virtualclusters/${clusterId}`,
              ],
            ],
          },
        }],
      },
    });
  });

  test('Custom resource is created with EMR Containers Describe Virtual Cluster invocation and has correct IAM policy permissions', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'Task', defaultProps);

    new sfn.StateMachine(stack, 'SM', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
      ServiceToken: {
        'Fn::GetAtt': [
          'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
          'Arn',
        ],
      },
      Create: '{\"service\":\"EMRcontainers\",\"action\":\"describeVirtualCluster\",\"parameters\":{\"id\":\"clusterId\"},\"outputPaths\":[\"virtualCluster.containerProvider.info.eksInfo.namespace\",\"virtualCluster.containerProvider.id\"],\"physicalResourceId\":{\"id\":\"id\"}}',
      InstallLatestAwsSdk: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'emr-containers:DescribeVirtualCluster',
          Effect: 'Allow',
          Resource: '*',
        }],
      },
    });
  });

  test('Custom resource is created that has correct EKS namespace, environment, AWSCLI layer, and IAM policy permissions', () => {
    // WHEN
    const task = new EmrContainersStartJobRun(stack, 'Task', defaultProps);

    new sfn.StateMachine(stack, 'SM', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'eks:DescribeCluster',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':eks:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':cluster/',
                  {
                    'Fn::GetAtt': [
                      'TaskGetEksClusterInfo2F156985',
                      'virtualCluster.containerProvider.id',
                    ],
                  },
                ],
              ],
            },
          },
          {
            Action: [
              'iam:GetRole',
              'iam:UpdateAssumeRolePolicy',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'TaskJobExecutionRole5D5BBA5A',
                'Arn',
              ],
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Layers: [
        {
          Ref: 'TaskawsclilayerB1A11740',
        },
      ],
      MemorySize: 256,
      Runtime: 'python3.11',
      Timeout: 30,
    });
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersStartJobRun(stack, 'Task', {
      virtualCluster: VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
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

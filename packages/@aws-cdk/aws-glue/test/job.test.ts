import * as cdkassert from '@aws-cdk/assert-internal';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import '@aws-cdk/assert-internal/jest';
import * as glue from '../lib';
import { PythonVersion } from '../lib';

describe('GlueVersion', () => {
  test('.V0_9', () => expect(glue.GlueVersion.V0_9.name).toEqual('0.9'));

  test('.V1_0', () => expect(glue.GlueVersion.V1_0.name).toEqual('1.0'));

  test('.V2_0', () => expect(glue.GlueVersion.V2_0.name).toEqual('2.0'));

  test('of(customVersion) sets name correctly', () => expect(glue.GlueVersion.of('CustomVersion').name).toEqual('CustomVersion'));
});

describe('WorkerType', () => {
  test('.STANDARD', () => expect(glue.WorkerType.STANDARD.name).toEqual('Standard'));

  test('.G_1X', () => expect(glue.WorkerType.G_1X.name).toEqual('G.1X'));

  test('.G_2X', () => expect(glue.WorkerType.G_2X.name).toEqual('G.2X'));

  test('of(customType) sets name correctly', () => expect(glue.WorkerType.of('CustomType').name).toEqual('CustomType'));
});

describe('JobType', () => {
  test('.ETL', () => expect(glue.JobType.ETL.name).toEqual('glueetl'));

  test('.STREAMING', () => expect(glue.JobType.STREAMING.name).toEqual('gluestreaming'));

  test('.PYTHON_SHELL', () => expect(glue.JobType.PYTHON_SHELL.name).toEqual('pythonshell'));

  test('of(customName) sets name correctly', () => expect(glue.JobType.of('CustomName').name).toEqual('CustomName'));
});

describe('Job', () => {
  let stack: cdk.Stack;
  let jobName: string;

  beforeEach(() => {
    stack = new cdk.Stack();
    jobName = 'test-job';
  });

  test('.fromJobAttributes() should return correct jobName and jobArn', () => {
    const iJob = glue.Job.fromJobAttributes(stack, 'ImportedJob', { jobName });

    expect(iJob.jobName).toEqual(jobName);
    expect(iJob.jobArn).toEqual(stack.formatArn({
      service: 'glue',
      resource: 'job',
      resourceName: jobName,
    }));
  });

  describe('new', () => {
    let scriptLocation: string;
    let extraJars: string[];
    let extraFiles: string[];
    let extraPythonFiles: string[];
    let className: string;
    let job: glue.Job;

    beforeEach(() => {
      scriptLocation = 's3://bucketName/script';
      className = 'com.amazon.test.ClassName';
      extraJars = ['s3://bucketName/file1.jar', 's3://bucketName/file2.jar'];
      extraPythonFiles = ['s3://bucketName/file1.py', 's3://bucketName/file2.py'];
      extraFiles = ['s3://bucketName/file1.txt', 's3://bucketName/file2.txt'];
    });

    describe('with necessary props only', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
        });
      });

      test('should create a role and use it with the job', () => {
        // check the role
        expect(job.role).toBeDefined();
        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::IAM::Role', {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'glue.amazonaws.com',
                },
              },
            ],
            Version: '2012-10-17',
          },
          ManagedPolicyArns: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::aws:policy/service-role/AWSGlueServiceRole',
                ],
              ],
            },
          ],
        }));

        // check the job using the role
        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          Command: {
            Name: 'glueetl',
            ScriptLocation: scriptLocation,
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
        }));
      });

      test('should return correct jobName and jobArn from CloudFormation', () => {
        expect(stack.resolve(job.jobName)).toEqual({ Ref: 'JobB9D00F9F' });
        expect(stack.resolve(job.jobArn)).toEqual({
          'Fn::Join': ['', [
            'arn:', { Ref: 'AWS::Partition' },
            ':glue:', { Ref: 'AWS::Region' }, ':',
            { Ref: 'AWS::AccountId' }, ':job/', { Ref: 'JobB9D00F9F' },
          ]],
        });
      });

      test('with a custom role should use it and set it in CloudFormation', () => {
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
        job = new glue.Job(stack, 'JobWithRole', {
          executable: glue.JobExecutable.etlPython({
            glueVersion: glue.GlueVersion.V2_0,
            pythonVersion: PythonVersion.TWO,
            scriptLocation,
          }),
          role,
        });

        expect(job.role).toEqual(role);
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          Role: role.roleArn,
        }));
      });

      test('with a custom jobName should set it in CloudFormation', () => {
        job = new glue.Job(stack, 'JobWithName', {
          executable: glue.JobExecutable.streamingScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
          jobName,
        });

        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          Name: jobName,
        }));
      });
    });

    describe('enabling continuous logging with defaults', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
          continuousLogging: {},
        });
      });

      test('should set minimal default arguments', () => {
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          DefaultArguments: {
            '--enable-continuous-cloudwatch-log': 'true',
            '--enable-continuous-log-filter': 'true',
          },
        }));
      });
    });

    describe('enabling continuous logging with all props set', () => {
      let logGroup;

      beforeEach(() => {
        logGroup = logs.LogGroup.fromLogGroupName(stack, 'LogGroup', 'LogGroupName');
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
          continuousLogging: {
            filter: false,
            logStreamPrefix: 'LogStreamPrefix',
            conversionPattern: '%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n',
            logGroup,
          },
        });
      });

      test('should set all arguments', () => {
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          DefaultArguments: {
            '--enable-continuous-cloudwatch-log': 'true',
            '--enable-continuous-log-filter': 'false',
            '--continuous-log-logGroup': 'LogGroupName',
            '--continuous-log-logStreamPrefix': 'LogStreamPrefix',
            '--continuous-log-conversionPattern': '%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n',
          },
        }));
      });

      test('should grant cloudwatch log write permissions', () => {
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
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
                      ':log-group:LogGroupName:*',
                    ],
                  ],
                },
              },
            ],
          },
          Roles: [
            {
              Ref: 'JobServiceRole4F432993',
            },
          ],
        }));
      });
    });

    describe('enabling spark ui but no bucket or path provided', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
          sparkUI: {},
        });
      });

      test('should create spark ui bucket', () => {
        cdkassert.expect(stack).to(cdkassert.countResources('AWS::S3::Bucket', 1));
      });

      test('should grant the role read/write permissions to the spark ui bucket', () => {
        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::IAM::Policy', {
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
                      'JobSparkUIBucket8E6A0139',
                      'Arn',
                    ],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': [
                            'JobSparkUIBucket8E6A0139',
                            'Arn',
                          ],
                        },
                        '/*',
                      ],
                    ],
                  },
                ],
              },
            ],
            Version: '2012-10-17',
          },
          PolicyName: 'JobServiceRoleDefaultPolicy03F68F9D',
          Roles: [
            {
              Ref: 'JobServiceRole4F432993',
            },
          ],
        }));
      });

      test('should set spark arguments on the job', () => {
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          DefaultArguments: {
            '--enable-spark-ui': 'true',
            '--spark-event-logs-path': {
              'Fn::Join': [
                '',
                [
                  's3://',
                  {
                    Ref: 'JobSparkUIBucket8E6A0139',
                  },
                  '/',
                ],
              ],
            },
          },
        }));
      });
    });

    describe('enabling spark ui with bucket provided', () => {
      let bucketName: string;
      let bucket: s3.IBucket;

      beforeEach(() => {
        bucketName = 'BucketName';
        bucket = s3.Bucket.fromBucketName(stack, 'BucketId', bucketName);
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
          sparkUI: {
            bucket,
          },
        });
      });

      test('should grant the role read/write permissions to the provided spark ui bucket', () => {
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::IAM::Policy', {
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
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':s3:::BucketName',
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
                        ':s3:::BucketName/*',
                      ],
                    ],
                  },
                ],
              },
            ],
          },
          Roles: [
            {
              Ref: 'JobServiceRole4F432993',
            },
          ],
        }));
      });

      test('should set spark arguments on the job', () => {
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          DefaultArguments: {
            '--enable-spark-ui': 'true',
            '--spark-event-logs-path': `s3://${bucketName}/`,
          },
        }));
      });
    });

    describe('enabling spark ui with bucket and path provided', () => {
      let bucketName: string;
      let bucket: s3.IBucket;
      let path: string;

      beforeEach(() => {
        bucketName = 'BucketName';
        bucket = s3.Bucket.fromBucketName(stack, 'BucketId', bucketName);
        path = 'some/path/';
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
          sparkUI: {
            bucket,
            path,
          },
        });
      });

      test('should set spark arguments on the job', () => {
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          DefaultArguments: {
            '--enable-spark-ui': 'true',
            '--spark-event-logs-path': `s3://${bucketName}/${path}`,
          },
        }));
      });
    });

    describe('with extended props', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          jobName,
          description: 'test job',
          executable: glue.JobExecutable.streamingPython({
            glueVersion: glue.GlueVersion.V2_0,
            pythonVersion: PythonVersion.TWO,
            scriptLocation,
          }),
          workerType: glue.WorkerType.G_2X,
          numberOfWorkers: 10,
          maxConcurrentRuns: 2,
          maxRetries: 2,
          timeout: cdk.Duration.minutes(5),
          notifyDelayAfter: cdk.Duration.minutes(1),
          defaultArguments: {
            arg1: 'value1',
            arg2: 'value2',
          },
          connections: [glue.Connection.fromConnectionName(stack, 'ImportedConnection', 'ConnectionName')],
          securityConfiguration: glue.SecurityConfiguration.fromSecurityConfigurationName(stack, 'ImportedSecurityConfiguration', 'SecurityConfigurationName'),
          enableProfilingMetrics: true,
          tags: {
            key: 'value',
          },
        });
      });

      test('should synthesize correctly', () => {
        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          Command: {
            Name: 'gluestreaming',
            ScriptLocation: 's3://bucketName/script',
            PythonVersion: '2',
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
          DefaultArguments: {
            '--job-language': 'python',
            '--enable-metrics': '',
            'arg1': 'value1',
            'arg2': 'value2',
          },
          Description: 'test job',
          ExecutionProperty: {
            MaxConcurrentRuns: 2,
          },
          GlueVersion: '2.0',
          MaxRetries: 2,
          Name: 'test-job',
          NotificationProperty: {
            NotifyDelayAfter: 1,
          },
          NumberOfWorkers: 10,
          Tags: {
            key: 'value',
          },
          Timeout: 5,
          WorkerType: 'G.2X',
          Connections: {
            Connections: [
              'ConnectionName',
            ],
          },
          SecurityConfiguration: 'SecurityConfigurationName',
        }));
      });
    });

    describe('python shell job', () => {

      test('with minimal props should synthesize correctly', () => {
        new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.shellPython({
            glueVersion: glue.GlueVersion.V2_0,
            pythonVersion: PythonVersion.THREE,
            scriptLocation,
          }),
        });

        // check the job using the role
        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          Command: {
            Name: 'pythonshell',
            ScriptLocation: scriptLocation,
            PythonVersion: '3',
          },
          GlueVersion: '2.0',
        }));
      });

      test('with unsupported glue version throws', () => {
        expect(() => new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.shellPython({
            glueVersion: glue.GlueVersion.V0_9,
            pythonVersion: PythonVersion.TWO,
            scriptLocation,
          }),
        })).toThrow('Specified GlueVersion 0.9 does not support Python Shell');
      });

      test('with unsupported Spark UI prop throws', () => {
        expect(() => new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.shellPython({
            glueVersion: glue.GlueVersion.V2_0,
            pythonVersion: PythonVersion.TWO,
            scriptLocation,
          }),
          sparkUI: {},
        })).toThrow('Spark UI can only be configured for JobType.ETL or JobType.STREAMING jobs');
      });

      test('with all props should synthesize correctly', () => {
        new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.shellPython({
            glueVersion: glue.GlueVersion.V2_0,
            pythonVersion: PythonVersion.THREE,
            scriptLocation,
            extraPythonFiles,
            extraFiles,
          }),
        });

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          Command: {
            Name: 'pythonshell',
            ScriptLocation: scriptLocation,
            PythonVersion: '3',
          },
          GlueVersion: '2.0',
          DefaultArguments: {
            '--job-language': 'python',
            '--extra-py-files': 's3://bucketName/file1.py,s3://bucketName/file2.py',
            '--extra-files': 's3://bucketName/file1.txt,s3://bucketName/file2.txt',
          },
        }));
      });
    });

    describe('python etl job', () => {

      test('with minimal props should synthesize correctly', () => {
        new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlPython({
            glueVersion: glue.GlueVersion.V2_0,
            pythonVersion: PythonVersion.TWO,
            scriptLocation,
          }),
        });

        // check the job using the role
        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          GlueVersion: '2.0',
          Command: {
            Name: 'glueetl',
            ScriptLocation: scriptLocation,
            PythonVersion: '2',
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
          DefaultArguments: {
            '--job-language': 'python',
          },
        }));
      });

      test('with all props should synthesize correctly', () => {
        new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlPython({
            glueVersion: glue.GlueVersion.V2_0,
            pythonVersion: PythonVersion.TWO,
            extraJarsFirst: true,
            scriptLocation,
            extraPythonFiles,
            extraJars,
            extraFiles,
          }),
        });

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          GlueVersion: '2.0',
          Command: {
            Name: 'glueetl',
            ScriptLocation: scriptLocation,
            PythonVersion: '2',
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
          DefaultArguments: {
            '--job-language': 'python',
            '--extra-jars': 's3://bucketName/file1.jar,s3://bucketName/file2.jar',
            '--extra-py-files': 's3://bucketName/file1.py,s3://bucketName/file2.py',
            '--extra-files': 's3://bucketName/file1.txt,s3://bucketName/file2.txt',
            '--user-jars-first': 'true',
          },
        }));
      });
    });

    describe('scala streaming job', () => {

      test('with minimal props should synthesize correctly', () => {
        new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.streamingScala({
            glueVersion: glue.GlueVersion.V2_0,
            scriptLocation,
            className,
          }),
        });

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          GlueVersion: '2.0',
          Command: {
            Name: 'gluestreaming',
            ScriptLocation: scriptLocation,
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
          DefaultArguments: {
            '--job-language': 'scala',
            '--class': 'com.amazon.test.ClassName',
          },
        }));
      });

      test('with all props should synthesize correctly', () => {
        new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.streamingScala({
            glueVersion: glue.GlueVersion.V2_0,
            extraJarsFirst: true,
            className,
            scriptLocation,
            extraJars,
            extraFiles,
          }),
        });

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          GlueVersion: '2.0',
          Command: {
            Name: 'gluestreaming',
            ScriptLocation: scriptLocation,
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
          DefaultArguments: {
            '--job-language': 'scala',
            '--class': 'com.amazon.test.ClassName',
            '--extra-jars': 's3://bucketName/file1.jar,s3://bucketName/file2.jar',
            '--extra-files': 's3://bucketName/file1.txt,s3://bucketName/file2.txt',
            '--user-jars-first': 'true',
          },
        }));
      });
    });

    describe('event rules and rule-based metrics', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.etlScala({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            scriptLocation,
          }),
        });
      });

      test('.onEvent() creates the expected event rule', () => {
        job.onEvent('eventId', {});

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
          EventPattern: {
            'source': [
              'aws.glue',
            ],
            'detail-type': [
              'Glue Job State Change',
              'Glue Job Run Status',
            ],
            'detail': {
              jobName: [
                {
                  Ref: 'JobB9D00F9F',
                },
              ],
            },
          },
          State: 'ENABLED',
        }));
      });

      describe('.onSuccess()', () => {
        test('with no-args and multiple calls should create one resource and cache it', () => {
          const firstInvocationRule = job.onSuccess();
          const subsequentInvocationRule = job.onSuccess();

          expect(subsequentInvocationRule).toEqual(firstInvocationRule);
          cdkassert.countResources('AWS::Events::Rule', 1);
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ' is in SUCCEEDED state',
                ],
              ],
            },
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'SUCCEEDED',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
        });

        test('with args should ignore the cached rule and return a new one', () => {
          const firstInvocationRule = job.onSuccess();
          const subsequentInvocationRuleWithNoArgs = job.onSuccess();
          job.onSuccess('noCache', { description: 'description override' });

          expect(subsequentInvocationRuleWithNoArgs).toEqual(firstInvocationRule);
          cdkassert.countResources('AWS::Events::Rule', 2);
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ' is in SUCCEEDED state',
                ],
              ],
            },
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'SUCCEEDED',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: 'description override',
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'SUCCEEDED',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
        });
      });

      describe('.onFailure()', () => {
        test('with no-args and multiple calls should create one resource and cache it', () => {
          const firstInvocationRule = job.onFailure();
          const subsequentInvocationRule = job.onFailure();

          expect(subsequentInvocationRule).toEqual(firstInvocationRule);
          cdkassert.countResources('AWS::Events::Rule', 1);
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ' is in FAILED state',
                ],
              ],
            },
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'FAILED',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
        });

        test('with args should ignore the cached rule and return a new one', () => {
          const firstInvocationRule = job.onFailure();
          const subsequentInvocationRuleWithNoArgs = job.onFailure();
          job.onFailure('noCache', { description: 'description override' });

          expect(subsequentInvocationRuleWithNoArgs).toEqual(firstInvocationRule);
          cdkassert.countResources('AWS::Events::Rule', 2);
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ' is in FAILED state',
                ],
              ],
            },
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'FAILED',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: 'description override',
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'FAILED',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
        });
      });

      describe('.onTimeout()', () => {
        test('with no-args and multiple calls should create one resource and cache it', () => {
          const firstInvocationRule = job.onTimeout();
          const subsequentInvocationRule = job.onTimeout();

          expect(subsequentInvocationRule).toEqual(firstInvocationRule);
          cdkassert.countResources('AWS::Events::Rule', 1);
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ' is in TIMEOUT state',
                ],
              ],
            },
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'TIMEOUT',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
        });

        test('with args should ignore the cached rule and return a new one', () => {
          const firstInvocationRule = job.onTimeout();
          job.onTimeout('noCache', { description: 'description override' });
          const subsequentInvocationRuleWithNoArgs = job.onTimeout();

          expect(subsequentInvocationRuleWithNoArgs).toEqual(firstInvocationRule);
          cdkassert.countResources('AWS::Events::Rule', 2);
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ' is in TIMEOUT state',
                ],
              ],
            },
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'TIMEOUT',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
          cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
            Description: 'description override',
            EventPattern: {
              'source': [
                'aws.glue',
              ],
              'detail-type': [
                'Glue Job State Change',
                'Glue Job Run Status',
              ],
              'detail': {
                state: [
                  'TIMEOUT',
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          }));
        });
      });

      test('.metricSuccess() creates the expected event rule and corresponding metric', () => {
        const metric = job.metricSuccess();

        expect(metric).toEqual(new cloudwatch.Metric({
          dimensions: {
            RuleName: job.onSuccess().ruleName,
          },
          metricName: 'TriggeredRules',
          namespace: 'AWS/Events',
          statistic: 'Sum',
        }));

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
          Description: {
            'Fn::Join': [
              '',
              [
                'Rule triggered when Glue job ',
                {
                  Ref: 'JobB9D00F9F',
                },
                ' is in SUCCEEDED state',
              ],
            ],
          },
          EventPattern: {
            'source': [
              'aws.glue',
            ],
            'detail-type': [
              'Glue Job State Change',
              'Glue Job Run Status',
            ],
            'detail': {
              state: [
                'SUCCEEDED',
              ],
              jobName: [
                {
                  Ref: 'JobB9D00F9F',
                },
              ],
            },
          },
          State: 'ENABLED',
        }));
      });

      test('.metricFailure() creates the expected event rule and corresponding metric', () => {
        const metric = job.metricFailure();

        expect(metric).toEqual(new cloudwatch.Metric({
          dimensions: {
            RuleName: job.onFailure().ruleName,
          },
          metricName: 'TriggeredRules',
          namespace: 'AWS/Events',
          statistic: 'Sum',
        }));

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
          Description: {
            'Fn::Join': [
              '',
              [
                'Rule triggered when Glue job ',
                {
                  Ref: 'JobB9D00F9F',
                },
                ' is in FAILED state',
              ],
            ],
          },
          EventPattern: {
            'source': [
              'aws.glue',
            ],
            'detail-type': [
              'Glue Job State Change',
              'Glue Job Run Status',
            ],
            'detail': {
              state: [
                'FAILED',
              ],
              jobName: [
                {
                  Ref: 'JobB9D00F9F',
                },
              ],
            },
          },
          State: 'ENABLED',
        }));
      });

      test('.metricTimeout() creates the expected event rule and corresponding metric', () => {
        const metric = job.metricTimeout();

        expect(metric).toEqual(new cloudwatch.Metric({
          dimensions: {
            RuleName: job.onTimeout().ruleName,
          },
          metricName: 'TriggeredRules',
          namespace: 'AWS/Events',
          statistic: 'Sum',
        }));

        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Events::Rule', {
          Description: {
            'Fn::Join': [
              '',
              [
                'Rule triggered when Glue job ',
                {
                  Ref: 'JobB9D00F9F',
                },
                ' is in TIMEOUT state',
              ],
            ],
          },
          EventPattern: {
            'source': [
              'aws.glue',
            ],
            'detail-type': [
              'Glue Job State Change',
              'Glue Job Run Status',
            ],
            'detail': {
              state: [
                'TIMEOUT',
              ],
              jobName: [
                {
                  Ref: 'JobB9D00F9F',
                },
              ],
            },
          },
          State: 'ENABLED',
        }));
      });
    });

    describe('.metric()', () => {

      test('to create a count sum metric', () => {
        const metricName = 'glue.driver.aggregate.bytesRead';
        const props = { statistic: cloudwatch.Statistic.SUM };

        expect(job.metric(metricName, glue.MetricType.COUNT, props)).toEqual(new cloudwatch.Metric({
          metricName,
          statistic: 'Sum',
          namespace: 'Glue',
          dimensions: {
            JobName: job.jobName,
            JobRunId: 'ALL',
            Type: 'count',
          },
        }));
      });

      test('to create a gauge average metric', () => {
        const metricName = 'glue.driver.BlockManager.disk.diskSpaceUsed_MB';
        const props = { statistic: cloudwatch.Statistic.AVERAGE };

        expect(job.metric(metricName, glue.MetricType.GAUGE, props)).toEqual(new cloudwatch.Metric({
          metricName,
          statistic: 'Average',
          namespace: 'Glue',
          dimensions: {
            JobName: job.jobName,
            JobRunId: 'ALL',
            Type: 'gauge',
          },
        }));
      });
    });
  });
});

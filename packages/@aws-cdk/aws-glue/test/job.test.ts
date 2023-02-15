import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

describe('WorkerType', () => {
  test('.STANDARD should set the name correctly', () => expect(glue.WorkerType.STANDARD.name).toEqual('Standard'));

  test('.G_1X should set the name correctly', () => expect(glue.WorkerType.G_1X.name).toEqual('G.1X'));

  test('.G_2X should set the name correctly', () => expect(glue.WorkerType.G_2X.name).toEqual('G.2X'));

  test('.G_025X should set the name correctly', () => expect(glue.WorkerType.G_025X.name).toEqual('G.025X'));

  test('.Z_2X should set the name correctly', () => expect(glue.WorkerType.Z_2X.name).toEqual('Z.2X'));

  test('of(customType) should set name correctly', () => expect(glue.WorkerType.of('CustomType').name).toEqual('CustomType'));
});

describe('Job', () => {
  const jobName = 'test-job';
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('.fromJobAttributes()', () => {
    test('with required attrs only', () => {
      const job = glue.Job.fromJobAttributes(stack, 'ImportedJob', { jobName });

      expect(job.jobName).toEqual(jobName);
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: jobName,
      }));
      expect(job.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: job }));
    });

    test('with all attrs', () => {
      const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
      const job = glue.Job.fromJobAttributes(stack, 'ImportedJob', { jobName, role });

      expect(job.jobName).toEqual(jobName);
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: jobName,
      }));
      expect(job.grantPrincipal).toEqual(role);
    });
  });


  describe('new', () => {
    const className = 'com.amazon.test.ClassName';
    const codeBucketName = 'bucketname';
    const codeBucketAccessStatement = {
      Action: [
        's3:GetObject*',
        's3:GetBucket*',
        's3:List*',
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
              `:s3:::${codeBucketName}`,
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
              `:s3:::${codeBucketName}/script`,
            ],
          ],
        },
      ],
    };
    let codeBucket: s3.IBucket;
    let script: glue.Code;
    let extraJars: glue.Code[];
    let extraFiles: glue.Code[];
    let extraPythonFiles: glue.Code[];
    let job: glue.Job;
    let defaultProps: glue.JobProps;

    beforeEach(() => {
      codeBucket = s3.Bucket.fromBucketName(stack, 'CodeBucket', codeBucketName);
      script = glue.Code.fromBucket(codeBucket, 'script');
      extraJars = [glue.Code.fromBucket(codeBucket, 'file1.jar'), glue.Code.fromBucket(codeBucket, 'file2.jar')];
      extraPythonFiles = [glue.Code.fromBucket(codeBucket, 'file1.py'), glue.Code.fromBucket(codeBucket, 'file2.py')];
      extraFiles = [glue.Code.fromBucket(codeBucket, 'file1.txt'), glue.Code.fromBucket(codeBucket, 'file2.txt')];
      defaultProps = {
        executable: glue.JobExecutable.scalaEtl({
          glueVersion: glue.GlueVersion.V2_0,
          className,
          script,
        }),
      };
    });

    describe('with necessary props only', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', defaultProps);
      });

      test('should create a role and use it with the job', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        });

        // Role policy should grant reading from the assets bucket
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              codeBucketAccessStatement,
            ],
          },
          Roles: [
            {
              Ref: 'JobServiceRole4F432993',
            },
          ],
        });

        // check the job using the role
        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          Command: {
            Name: 'glueetl',
            ScriptLocation: 's3://bucketname/script',
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
        });
      });

      test('should return correct jobName and jobArn from CloudFormation', () => {
        expect(stack.resolve(job.jobName)).toEqual({ Ref: 'JobB9D00F9F' });
        expect(stack.resolve(job.jobArn)).toEqual({
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':glue:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':job/', { Ref: 'JobB9D00F9F' }]],
        });
      });

      test('with a custom role should use it and set it in CloudFormation', () => {
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
        job = new glue.Job(stack, 'JobWithRole', {
          ...defaultProps,
          role,
        });

        expect(job.grantPrincipal).toEqual(role);
        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          Role: role.roleArn,
        });
      });

      test('with a custom jobName should set it in CloudFormation', () => {
        job = new glue.Job(stack, 'JobWithName', {
          ...defaultProps,
          jobName,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          Name: jobName,
        });
      });
    });

    describe('enabling continuous logging with defaults', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          ...defaultProps,
          continuousLogging: { enabled: true },
        });
      });

      test('should set minimal default arguments', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          DefaultArguments: {
            '--enable-continuous-cloudwatch-log': 'true',
            '--enable-continuous-log-filter': 'true',
          },
        });
      });
    });

    describe('enabling continuous logging with all props set', () => {
      let logGroup;

      beforeEach(() => {
        logGroup = logs.LogGroup.fromLogGroupName(stack, 'LogGroup', 'LogGroupName');
        job = new glue.Job(stack, 'Job', {
          ...defaultProps,
          continuousLogging: {
            enabled: true,
            quiet: false,
            logStreamPrefix: 'LogStreamPrefix',
            conversionPattern: '%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n',
            logGroup,
          },
        });
      });

      test('should set all arguments', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          DefaultArguments: {
            '--enable-continuous-cloudwatch-log': 'true',
            '--enable-continuous-log-filter': 'false',
            '--continuous-log-logGroup': 'LogGroupName',
            '--continuous-log-logStreamPrefix': 'LogStreamPrefix',
            '--continuous-log-conversionPattern': '%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n',
          },
        });
      });

      test('should grant cloudwatch log write permissions', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
              codeBucketAccessStatement,
            ],
          },
          Roles: [
            {
              Ref: 'JobServiceRole4F432993',
            },
          ],
        });
      });
    });

    describe('enabling spark ui', () => {
      describe('with no bucket or path provided', () => {
        beforeEach(() => {
          job = new glue.Job(stack, 'Job', {
            ...defaultProps,
            sparkUI: { enabled: true },
          });
        });

        test('should create spark ui bucket', () => {
          Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
        });

        test('should grant the role read/write permissions to the spark ui bucket', () => {
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
                codeBucketAccessStatement,
              ],
              Version: '2012-10-17',
            },
            PolicyName: 'JobServiceRoleDefaultPolicy03F68F9D',
            Roles: [
              {
                Ref: 'JobServiceRole4F432993',
              },
            ],
          });
        });

        test('should set spark arguments on the job', () => {
          Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
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
                  ],
                ],
              },
            },
          });
        });
      });

      describe('with bucket provided', () => {
        const sparkUIBucketName = 'sparkbucketname';
        let sparkUIBucket: s3.IBucket;

        beforeEach(() => {
          sparkUIBucket = s3.Bucket.fromBucketName(stack, 'SparkBucketId', sparkUIBucketName);
          job = new glue.Job(stack, 'Job', {
            ...defaultProps,
            sparkUI: {
              enabled: true,
              bucket: sparkUIBucket,
            },
          });
        });

        test('should grant the role read/write permissions to the provided spark ui bucket', () => {
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
                          ':s3:::sparkbucketname',
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
                          ':s3:::sparkbucketname/*',
                        ],
                      ],
                    },
                  ],
                },
                codeBucketAccessStatement,
              ],
            },
            Roles: [
              {
                Ref: 'JobServiceRole4F432993',
              },
            ],
          });
        });

        test('should set spark arguments on the job', () => {
          Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
            DefaultArguments: {
              '--enable-spark-ui': 'true',
              '--spark-event-logs-path': `s3://${sparkUIBucketName}`,
            },
          });
        });
      });

      describe('with bucket and path provided', () => {
        const sparkUIBucketName = 'sparkbucketname';
        const prefix = 'some/path/';
        let sparkUIBucket: s3.IBucket;

        beforeEach(() => {
          sparkUIBucket = s3.Bucket.fromBucketName(stack, 'BucketId', sparkUIBucketName);
          job = new glue.Job(stack, 'Job', {
            ...defaultProps,
            sparkUI: {
              enabled: true,
              bucket: sparkUIBucket,
              prefix,
            },
          });
        });

        test('should set spark arguments on the job', () => {
          Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
            DefaultArguments: {
              '--enable-spark-ui': 'true',
              '--spark-event-logs-path': `s3://${sparkUIBucketName}/${prefix}`,
            },
          });
        });
      });
    });

    describe('with extended props', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          ...defaultProps,
          jobName,
          description: 'test job',
          workerType: glue.WorkerType.G_2X,
          workerCount: 10,
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
        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          Command: {
            Name: 'glueetl',
            ScriptLocation: 's3://bucketname/script',
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
        });
      });
    });

    test('with reserved args should throw', () => {
      ['--debug', '--mode', '--JOB_NAME'].forEach((arg, index) => {
        const defaultArguments: {[key: string]: string} = {};
        defaultArguments[arg] = 'random value';

        expect(() => new glue.Job(stack, `Job${index}`, {
          executable: glue.JobExecutable.scalaEtl({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            script,
          }),
          defaultArguments,
        })).toThrow(/argument is reserved by Glue/);
      });
    });

    describe('shell job', () => {
      test('with unsupported glue version should throw', () => {
        expect(() => new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.pythonShell({
            glueVersion: glue.GlueVersion.V0_9,
            pythonVersion: glue.PythonVersion.TWO,
            script,
          }),
        })).toThrow('Specified GlueVersion 0.9 does not support Python Shell');
      });

      test('with unsupported Spark UI prop should throw', () => {
        expect(() => new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.pythonShell({
            glueVersion: glue.GlueVersion.V1_0,
            pythonVersion: glue.PythonVersion.THREE,
            script,
          }),
          sparkUI: { enabled: true },
        })).toThrow('Spark UI is not available for JobType.PYTHON_SHELL');
      });
    });

    describe('ray job', () => {
      test('with unsupported glue version should throw', () => {
        expect(() => new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.pythonRay({
            glueVersion: glue.GlueVersion.V3_0,
            pythonVersion: glue.PythonVersion.THREE_NINE,
            script,
          }),
          workerType: glue.WorkerType.Z_2X,
          workerCount: 2,
        })).toThrow('Specified GlueVersion 3.0 does not support Ray');
      });

      test('with unsupported Spark UI prop should throw', () => {
        expect(() => new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.pythonRay({
            glueVersion: glue.GlueVersion.V4_0,
            pythonVersion: glue.PythonVersion.THREE_NINE,
            script,
          }),
          workerType: glue.WorkerType.Z_2X,
          workerCount: 2,
          sparkUI: { enabled: true },
        })).toThrow('Spark UI is not available for JobType.RAY');
      });
    });


    test('etl job with all props should synthesize correctly', () => {
      new glue.Job(stack, 'Job', {
        executable: glue.JobExecutable.pythonEtl({
          glueVersion: glue.GlueVersion.V2_0,
          pythonVersion: glue.PythonVersion.THREE,
          extraJarsFirst: true,
          script,
          extraPythonFiles,
          extraJars,
          extraFiles,
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '2.0',
        Command: {
          Name: 'glueetl',
          ScriptLocation: 's3://bucketname/script',
          PythonVersion: '3',
        },
        Role: {
          'Fn::GetAtt': [
            'JobServiceRole4F432993',
            'Arn',
          ],
        },
        DefaultArguments: {
          '--job-language': 'python',
          '--extra-jars': 's3://bucketname/file1.jar,s3://bucketname/file2.jar',
          '--extra-py-files': 's3://bucketname/file1.py,s3://bucketname/file2.py',
          '--extra-files': 's3://bucketname/file1.txt,s3://bucketname/file2.txt',
          '--user-jars-first': 'true',
        },
      });
    });

    test('streaming job with all props should synthesize correctly', () => {
      new glue.Job(stack, 'Job', {
        executable: glue.JobExecutable.scalaStreaming({
          glueVersion: glue.GlueVersion.V2_0,
          extraJarsFirst: true,
          className,
          script,
          extraJars,
          extraFiles,
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '2.0',
        Command: {
          Name: 'gluestreaming',
          ScriptLocation: 's3://bucketname/script',
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
          '--extra-jars': 's3://bucketname/file1.jar,s3://bucketname/file2.jar',
          '--extra-files': 's3://bucketname/file1.txt,s3://bucketname/file2.txt',
          '--user-jars-first': 'true',
        },
      });
    });

    describe('event rules and rule-based metrics', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          executable: glue.JobExecutable.scalaEtl({
            glueVersion: glue.GlueVersion.V2_0,
            className,
            script,
          }),
        });
      });

      test('.onEvent() should create the expected event rule', () => {
        job.onEvent('eventId', {});

        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
        });
      });

      [
        { name: 'onSuccess()', invoke: (testJob: glue.Job) => testJob.onSuccess('SuccessRule'), state: 'SUCCEEDED' },
        { name: 'onFailure()', invoke: (testJob: glue.Job) => testJob.onFailure('FailureRule'), state: 'FAILED' },
        { name: 'onTimeout()', invoke: (testJob: glue.Job) => testJob.onTimeout('TimeoutRule'), state: 'TIMEOUT' },
      ].forEach((testCase) => {
        test(`${testCase.name} should create a rule with correct properties`, () => {
          testCase.invoke(job);

          Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ` is in ${testCase.state} state`,
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
                  testCase.state,
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          });
        });
      });

      [
        { name: '.metricSuccess()', invoke: (testJob: glue.Job) => testJob.metricSuccess(), state: 'SUCCEEDED', ruleId: 'SuccessMetricRule' },
        { name: '.metricFailure()', invoke: (testJob: glue.Job) => testJob.metricFailure(), state: 'FAILED', ruleId: 'FailureMetricRule' },
        { name: '.metricTimeout()', invoke: (testJob: glue.Job) => testJob.metricTimeout(), state: 'TIMEOUT', ruleId: 'TimeoutMetricRule' },
      ].forEach((testCase) => {
        test(`${testCase.name} should create the expected singleton event rule and corresponding metric`, () => {
          const metric = testCase.invoke(job);
          testCase.invoke(job);

          expect(metric).toEqual(new cloudwatch.Metric({
            dimensionsMap: {
              RuleName: (job.node.findChild(testCase.ruleId) as events.Rule).ruleName,
            },
            metricName: 'TriggeredRules',
            namespace: 'AWS/Events',
            statistic: 'Sum',
          }));

          Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 1);
          Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Description: {
              'Fn::Join': [
                '',
                [
                  'Rule triggered when Glue job ',
                  {
                    Ref: 'JobB9D00F9F',
                  },
                  ` is in ${testCase.state} state`,
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
                  testCase.state,
                ],
                jobName: [
                  {
                    Ref: 'JobB9D00F9F',
                  },
                ],
              },
            },
            State: 'ENABLED',
          });
        });
      });
    });

    describe('.metric()', () => {

      test('with MetricType.COUNT should create a count sum metric', () => {
        const metricName = 'glue.driver.aggregate.bytesRead';
        const props = { statistic: cloudwatch.Statistic.SUM };

        expect(job.metric(metricName, glue.MetricType.COUNT, props)).toEqual(new cloudwatch.Metric({
          metricName,
          statistic: 'Sum',
          namespace: 'Glue',
          dimensionsMap: {
            JobName: job.jobName,
            JobRunId: 'ALL',
            Type: 'count',
          },
        }));
      });

      test('with MetricType.GAUGE should create a gauge average metric', () => {
        const metricName = 'glue.driver.BlockManager.disk.diskSpaceUsed_MB';
        const props = { statistic: cloudwatch.Statistic.AVERAGE };

        expect(job.metric(metricName, glue.MetricType.GAUGE, props)).toEqual(new cloudwatch.Metric({
          metricName,
          statistic: 'Average',
          namespace: 'Glue',
          dimensionsMap: {
            JobName: job.jobName,
            JobRunId: 'ALL',
            Type: 'gauge',
          },
        }));
      });
    });
  });
});

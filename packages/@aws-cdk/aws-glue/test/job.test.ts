import * as cdkassert from '@aws-cdk/assert-internal';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import '@aws-cdk/assert-internal/jest';
import * as glue from '../lib';

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

describe('JobCommandName', () => {
  test('.GLUE_ETL', () => expect(glue.JobCommandName.GLUE_ETL.name).toEqual('glueetl'));

  test('.GLUE_STREAMING', () => expect(glue.JobCommandName.GLUE_STREAMING.name).toEqual('gluestreaming'));

  test('.PYTHON_SHELL', () => expect(glue.JobCommandName.PYTHON_SHELL.name).toEqual('pythonshell'));

  test('of(customName) sets name correctly', () => expect(glue.JobCommandName.of('CustomName').name).toEqual('CustomName'));
});

describe('JobCommand', () => {
  let scriptLocation: string;

  beforeEach(() => {
    scriptLocation = 's3://bucketName/script';
  });

  describe('new', () => {
    let jobCommandName: glue.JobCommandName;

    // known command names + custom one
    [glue.JobCommandName.GLUE_STREAMING, glue.JobCommandName.PYTHON_SHELL, glue.JobCommandName.GLUE_ETL,
      glue.JobCommandName.of('CustomName')].forEach((name) => {
      describe(`with ${name} JobCommandName`, () => {

        beforeEach(() => {
          jobCommandName = name;
        });

        test('without specified python version sets properties correctly', () => {
          const jobCommand = new glue.JobCommand(jobCommandName, scriptLocation);

          expect(jobCommand.name).toEqual(jobCommandName);
          expect(jobCommand.scriptLocation).toEqual(scriptLocation);
          expect(jobCommand.pythonVersion).toBeUndefined();
        });

        test('with specified python version sets properties correctly', () => {
          const pythonVersion = glue.PythonVersion.TWO;
          const jobCommand = new glue.JobCommand(jobCommandName, scriptLocation, pythonVersion);

          expect(jobCommand.name).toEqual(jobCommandName);
          expect(jobCommand.scriptLocation).toEqual(scriptLocation);
          expect(jobCommand.pythonVersion).toEqual(pythonVersion);
        });
      });
    });
  });

  test('.etl() uses GLUE_ETL JobCommandName', () => {
    const jobCommand = glue.JobCommand.etl(scriptLocation);

    expect(jobCommand.name).toEqual(glue.JobCommandName.GLUE_ETL);
    expect(jobCommand.scriptLocation).toEqual(scriptLocation);
    expect(jobCommand.pythonVersion).toBeUndefined();
  });

  test('.streaming() uses GLUE_STREAMING JobCommandName', () => {
    const jobCommand = glue.JobCommand.streaming(scriptLocation, glue.PythonVersion.THREE);

    expect(jobCommand.name).toEqual(glue.JobCommandName.GLUE_STREAMING);
    expect(jobCommand.scriptLocation).toEqual(scriptLocation);
    expect(jobCommand.pythonVersion).toEqual(glue.PythonVersion.THREE);
  });

  test('.python() uses PYTHON_SHELL JobCommandName', () => {
    const jobCommand = glue.JobCommand.python(scriptLocation, glue.PythonVersion.TWO);

    expect(jobCommand.name).toEqual(glue.JobCommandName.PYTHON_SHELL);
    expect(jobCommand.scriptLocation).toEqual(scriptLocation);
    expect(jobCommand.pythonVersion).toEqual(glue.PythonVersion.TWO);
  });
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

  describe('.ruleMetric()', () => {
    let rule: events.IRule;

    beforeEach(() => {
      rule = events.Rule.fromEventRuleArn(stack, 'Rule', 'arn:aws:events:us-east-1:123456789012:rule/example');
    });

    test('with no props returns default metric', () => {
      expect(glue.Job.metricRule(rule)).toEqual(new cloudwatch.Metric({
        dimensions: {
          RuleName: 'example',
        },
        metricName: 'TriggeredRules',
        namespace: 'AWS/Events',
        statistic: 'Sum',
      }));
    });

    test('with props overrides', () => {
      expect(glue.Job.metricRule(rule, { statistic: cloudwatch.Statistic.AVERAGE })).toEqual(new cloudwatch.Metric({
        dimensions: {
          RuleName: 'example',
        },
        metricName: 'TriggeredRules',
        namespace: 'AWS/Events',
        statistic: 'Average',
      }));
    });
  });

  describe('new', () => {
    let scriptLocation: string;
    let job: glue.Job;

    beforeEach(() => {
      scriptLocation = 's3://bucketName/script';
    });

    describe('with necessary props only', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          glueVersion: glue.GlueVersion.V2_0,
          jobCommand: glue.JobCommand.etl(scriptLocation),
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
          glueVersion: glue.GlueVersion.V2_0,
          jobCommand: glue.JobCommand.etl(scriptLocation),
          role,
        });

        expect(job.role).toEqual(role);
        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          Role: role.roleArn,
        }));
      });

      test('with a custom jobName should set it in CloudFormation', () => {
        job = new glue.Job(stack, 'JobWithName', {
          glueVersion: glue.GlueVersion.V2_0,
          jobCommand: glue.JobCommand.etl(scriptLocation),
          jobName,
        });

        cdkassert.expect(stack).to(cdkassert.haveResourceLike('AWS::Glue::Job', {
          Name: jobName,
        }));
      });
    });

    describe('with extended props', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          jobName,
          description: 'test job',
          jobCommand: glue.JobCommand.etl(scriptLocation),
          glueVersion: glue.GlueVersion.V2_0,
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
          tags: {
            key: 'value',
          },
        });
      });

      test('should synthesize correctly', () => {
        cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::Job', {
          Command: {
            Name: 'glueetl',
            ScriptLocation: 's3://bucketName/script',
          },
          Role: {
            'Fn::GetAtt': [
              'JobServiceRole4F432993',
              'Arn',
            ],
          },
          DefaultArguments: {
            arg1: 'value1',
            arg2: 'value2',
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

    describe('event rules and rule-based metrics', () => {
      beforeEach(() => {
        job = new glue.Job(stack, 'Job', {
          glueVersion: glue.GlueVersion.V2_0,
          jobCommand: glue.JobCommand.etl(scriptLocation),
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

        expect(job.metric(metricName, 'ALL', glue.MetricType.COUNT, props)).toEqual(new cloudwatch.Metric({
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

        expect(job.metric(metricName, 'ALL', glue.MetricType.GAUGE, props)).toEqual(new cloudwatch.Metric({
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

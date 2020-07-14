import * as path from 'path';
import { expect, haveOutput, haveResource } from '@aws-cdk/assert';
import { ProfilingGroup } from '@aws-cdk/aws-codeguruprofiler';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as _ from 'lodash';
import {Test, testCase} from 'nodeunit';
import * as lambda from '../lib';

/* eslint-disable quote-props */

export = testCase({
  'add incompatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const func = new lambda.Function(stack, 'myFunc', {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      code,
    });
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code,
      compatibleRuntimes: [lambda.Runtime.NODEJS],
    });

    // THEN
    test.throws(() => func.addLayers(layer),
      /This lambda function uses a runtime that is incompatible with this layer/);

    test.done();
  },
  'add compatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const func = new lambda.Function(stack, 'myFunc', {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      code,
    });
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code,
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
    });

    // THEN
    // should not throw
    func.addLayers(layer);

    test.done();
  },
  'add compatible layer for deep clone'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const runtime = lambda.Runtime.PYTHON_3_7;
    const func = new lambda.Function(stack, 'myFunc', {
      runtime,
      handler: 'index.handler',
      code,
    });
    const clone = _.cloneDeep(runtime);
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code,
      compatibleRuntimes: [clone],
    });

    // THEN
    // should not throw
    func.addLayers(layer);

    test.done();
  },

  'empty inline code is not allowed'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN/THEN
    test.throws(() => new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline(''),
    }), /Lambda inline code cannot be empty/);
    test.done();
  },

  'logGroup is correctly returned'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
    });
    const logGroup = fn.logGroup;
    test.ok(logGroup.logGroupName);
    test.ok(logGroup.logGroupArn);
    test.done();
  },

  'dlq is returned when provided by user'(test: Test) {
    const stack = new cdk.Stack();

    const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriod: cdk.Duration.days(14),
    });

    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      deadLetterQueue: dlQueue,
    });
    const deadLetterQueue = fn.deadLetterQueue;
    test.ok(deadLetterQueue?.queueArn);
    test.ok(deadLetterQueue?.queueName);
    test.ok(deadLetterQueue?.queueUrl);
    test.done();
  },

  'dlq is returned when setup by cdk'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      deadLetterQueueEnabled: true,
    });
    const deadLetterQueue = fn.deadLetterQueue;
    test.ok(deadLetterQueue?.queueArn);
    test.ok(deadLetterQueue?.queueName);
    test.ok(deadLetterQueue?.queueUrl);
    test.done();
  },

  'dlq is undefined when not setup'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
    });
    const deadLetterQueue = fn.deadLetterQueue;
    test.ok(deadLetterQueue === undefined);
    test.done();
  },

  'one and only one child LogRetention construct will be created'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      logRetention: logs.RetentionDays.FIVE_DAYS,
    });

    // Call logGroup a few times. If more than one instance of LogRetention was created,
    // the second call will fail on duplicate constructs.
    fn.logGroup;
    fn.logGroup;
    fn.logGroup;

    test.done();
  },

  'fails when inline code is specified on an incompatible runtime'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(() => new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.PROVIDED,
      code: lambda.Code.fromInline('foo'),
    }), /Inline source not allowed for/);
    test.done();
  },

  'default function with CDK created Profiling Group'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      profiling: true,
    });

    expect(stack).to(haveResource('AWS::CodeGuruProfiler::ProfilingGroup', {
      ProfilingGroupName: 'MyLambdaProfilingGroupC5B6CCD8',
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'codeguru-profiler:ConfigureAgent',
              'codeguru-profiler:PostAgentProfile',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyLambdaProfilingGroupEC6DE32F', 'Arn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
      Roles: [
        {
          Ref: 'MyLambdaServiceRole4539ECB6',
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          AWS_CODEGURU_PROFILER_GROUP_ARN: { 'Fn::GetAtt': ['MyLambdaProfilingGroupEC6DE32F', 'Arn'] },
          AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
        },
      },
    }));

    test.done();
  },

  'default function with client provided Profiling Group'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      profilingGroup: new ProfilingGroup(stack, 'ProfilingGroup'),
    });

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'codeguru-profiler:ConfigureAgent',
              'codeguru-profiler:PostAgentProfile',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['ProfilingGroup26979FD7', 'Arn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
      Roles: [
        {
          Ref: 'MyLambdaServiceRole4539ECB6',
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          AWS_CODEGURU_PROFILER_GROUP_ARN: {
            'Fn::Join': [
              '',
              [
                'arn:', { Ref: 'AWS::Partition' }, ':codeguru-profiler:', { Ref: 'AWS::Region' },
                ':', { Ref: 'AWS::AccountId' }, ':profilingGroup/', { Ref: 'ProfilingGroup26979FD7' },
              ],
            ],
          },
          AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
        },
      },
    }));

    test.done();
  },

  'default function with client provided Profiling Group but profiling set to false'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      profiling: false,
      profilingGroup: new ProfilingGroup(stack, 'ProfilingGroup'),
    });

    expect(stack).notTo(haveResource('AWS::IAM::Policy'));

    expect(stack).notTo(haveResource('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          AWS_CODEGURU_PROFILER_GROUP_ARN: {
            'Fn::Join': [
              '',
              [
                'arn:', { Ref: 'AWS::Partition' }, ':codeguru-profiler:', { Ref: 'AWS::Region' },
                ':', { Ref: 'AWS::AccountId' }, ':profilingGroup/', { Ref: 'ProfilingGroup26979FD7' },
              ],
            ],
          },
          AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
        },
      },
    }));

    test.done();
  },

  'default function with profiling enabled and client provided env vars'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      profiling: true,
      environment: {
        AWS_CODEGURU_PROFILER_GROUP_ARN: 'profiler_group_arn',
        AWS_CODEGURU_PROFILER_ENABLED: 'yes',
      },
    }),
    /AWS_CODEGURU_PROFILER_GROUP_ARN and AWS_CODEGURU_PROFILER_ENABLED must not be set when profiling options enabled/);

    test.done();
  },

  'default function with client provided Profiling Group and client provided env vars'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      profilingGroup: new ProfilingGroup(stack, 'ProfilingGroup'),
      environment: {
        AWS_CODEGURU_PROFILER_GROUP_ARN: 'profiler_group_arn',
        AWS_CODEGURU_PROFILER_ENABLED: 'yes',
      },
    }),
    /AWS_CODEGURU_PROFILER_GROUP_ARN and AWS_CODEGURU_PROFILER_ENABLED must not be set when profiling options enabled/);

    test.done();
  },

  'currentVersion': {
    // see test.function-hash.ts for more coverage for this
    'logical id of version is based on the function hash'(test: Test) {
      // GIVEN
      const stack1 = new cdk.Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        handler: 'foo',
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        environment: {
          FOO: 'bar',
        },
      });
      const stack2 = new cdk.Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        handler: 'foo',
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        environment: {
          FOO: 'bear',
        },
      });

      // WHEN
      new cdk.CfnOutput(stack1, 'CurrentVersionArn', {
        value: fn1.currentVersion.functionArn,
      });
      new cdk.CfnOutput(stack2, 'CurrentVersionArn', {
        value: fn2.currentVersion.functionArn,
      });

      // THEN
      expect(stack1).to(haveOutput({
        outputName: 'CurrentVersionArn',
        outputValue: {
          Ref: 'MyFunctionCurrentVersion197490AF1a9a73cf5c46aec5e40fb202042eb60b',
        },
      }));
      expect(stack2).to(haveOutput({
        outputName: 'CurrentVersionArn',
        outputValue: {
          Ref: 'MyFunctionCurrentVersion197490AF8360a045031060e3117269037b7bffd6',
        },
      }));
      test.done();
    },
  },

  'filesystem': {

    'mount efs filesystem'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc', {
        maxAzs: 3,
        natGateways: 1,
      });

      const fs = new efs.FileSystem(stack, 'Efs', {
        vpc,
      });
      const accessPoint = fs.addAccessPoint('AccessPoint');
      // WHEN
      new lambda.Function(stack, 'MyFunction', {
        handler: 'foo',
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg'),
      });

      // THEN
      expect(stack).to(haveResource('AWS::Lambda::Function', {
        FileSystemConfigs: [
          {
            Arn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':elasticfilesystem:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':access-point/',
                  {
                    Ref: 'EfsAccessPointE419FED9',
                  },
                ],
              ],
            },
            LocalMountPath: '/mnt/msg',
          }],
      }));
      test.done();
    },
  },
});

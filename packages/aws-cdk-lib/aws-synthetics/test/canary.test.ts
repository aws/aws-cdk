import * as path from 'path';
import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { Duration, Lazy, Size, Stack } from '../../core';
import * as synthetics from '../lib';

test('Basic canary properties work', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    successRetentionPeriod: Duration.days(10),
    failureRetentionPeriod: Duration.days(10),
    startAfterCreation: false,
    timeToLive: Duration.minutes(30),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    SuccessRetentionPeriod: 10,
    FailureRetentionPeriod: 10,
    StartCanaryAfterCreation: false,
    Schedule: Match.objectLike({ DurationInSeconds: '1800' }),
    RuntimeVersion: 'syn-nodejs-puppeteer-8.0',
  });
});

test('cleanup.LAMBDA introduces custom resource to delete lambda', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code'),
    }),
    cleanup: synthetics.Cleanup.LAMBDA,
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).resourceCountIs('Custom::SyntheticsAutoDeleteUnderlyingResources', 1);
});

test('Canary can have generated name', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Name: 'canary',
  });
});

test('Name validation does not fail when using Tokens', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: Lazy.string({ produce: () => 'My Canary' }),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN: no exception
  Template.fromStack(stack).resourceCountIs('AWS::Synthetics::Canary', 1);
});

test('Throws when name is specified incorrectly', () => {
  // GIVEN
  const stack = new Stack();

  // THEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    canaryName: 'My Canary',
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  }))
    .toThrowError('Canary name must be lowercase, numbers, hyphens, or underscores (got "My Canary")');
});

test('Throws when name has more than 21 characters', () => {
  // GIVEN
  const stack = new Stack();

  // THEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    canaryName: 'a'.repeat(22),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  }))
    .toThrowError(`Canary name is too large, must be between 1 and 21 characters, but is 22 (got "${'a'.repeat(22)}")`);
});

test('An existing role can be specified instead of auto-created', () => {
  // GIVEN
  const stack = new Stack();

  const role = new iam.Role(stack, 'role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  // role.addToPolicy(/* required permissions per the documentation */);

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    role,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    ExecutionRoleArn: stack.resolve(role.roleArn),
  });
});

test('An auto-generated bucket can have lifecycle rules', () => {
  // GIVEN
  const stack = new Stack();
  const lifecycleRules = [{
    expiration: Duration.days(30),
  }];

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    artifactsBucketLifecycleRules: lifecycleRules,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
    LifecycleConfiguration: {
      Rules: [
        {
          ExpirationInDays: 30,
        },
      ],
    },
  });
});

test('An existing bucket and prefix can be specified instead of auto-created', () => {
  // GIVEN
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'mytestbucket');
  const prefix = 'canary';

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    artifactsBucketLocation: { bucket, prefix },
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    ArtifactS3Location: stack.resolve(bucket.s3UrlForObject(prefix)),
  });
});

test('Runtime can be specified', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RuntimeVersion: 'syn-nodejs-puppeteer-8.0',
  });
});

test('Python runtime can be specified', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_4_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('# Synthetics handler code'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RuntimeVersion: 'syn-python-selenium-4.0',
  });
});

test.each([true, false])('activeTracing can be set to %s', (activeTracing: boolean) => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    activeTracing,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RunConfig: {
      ActiveTracing: activeTracing,
    },
  });
});

test('throws when activeTracing is enabled with an unsupported runtime', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('# Synthetics handler code'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_2_1,
    activeTracing: true,
  }))
    .toThrow('You can only enable active tracing for canaries that use canary runtime version `syn-nodejs-2.0` or later.');
});

test('environment variables can be specified', () => {
  // GIVEN
  const stack = new Stack();
  const environmentVariables = {
    TEST_KEY_1: 'TEST_VALUE_1',
    TEST_KEY_2: 'TEST_VALUE_2',
  };

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    environmentVariables: environmentVariables,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RunConfig: {
      EnvironmentVariables: environmentVariables,
    },
  });
});

test('environment variables are skipped if not provided', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RunConfig: Match.absent(),
  });
});

test('memory can be set', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    memory: Size.mebibytes(1024),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RunConfig: {
      MemoryInMB: 1024,
    },
  });
});

test('throws when memory is not a multiple of 64 MiB', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    memory: Size.mebibytes(5),
  }))
    .toThrow('\`memory\` must be a multiple of 64 MiB, got 5 MiB.');
});

test.each([64, 6400])('throws when memory is out of range, %d MiB', (memoryInMb: number) => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    memory: Size.mebibytes(memoryInMb),
  }))
    .toThrow(`\`memory\` must be between 960 MiB and 3008 MiB, got ${memoryInMb} MiB.`);
});

test('timeout can be set', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    timeout: Duration.seconds(60),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RunConfig: {
      TimeoutInSeconds: 60,
    },
  });
});

test.each([100, 3100])('throws when timeout is not set as an integer representing seconds , %d milliseconds', (milliseconds: number) => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    timeout: Duration.millis(milliseconds),
  }))
    .toThrow(`\`timeout\` must be set as an integer representing seconds, got ${milliseconds} milliseconds.`);
});

test.each([2, 900])('throws when timeout is out of range, %d seconds', (seconds: number) => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    timeout: Duration.seconds(seconds),
  }))
    .toThrow(`\`timeout\` must be between 3 seconds and 840 seconds, got ${seconds} seconds.`);
});

test('Runtime can be customized', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: new synthetics.Runtime('fancy-future-runtime-1337.42', synthetics.RuntimeFamily.OTHER),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RuntimeVersion: 'fancy-future-runtime-1337.42',
  });
});

test('Schedule can be set with Rate', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.rate(Duration.minutes(3)),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Schedule: Match.objectLike({ Expression: 'rate(3 minutes)' }),
  });
});

test('Schedule can be set to 1 minute', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.rate(Duration.minutes(1)),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Schedule: Match.objectLike({ Expression: 'rate(1 minute)' }),
  });
});

test('Schedule can be set with Cron', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.cron({ minute: '30' }),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Schedule: Match.objectLike({ Expression: 'cron(30 * * * ? *)' }),
  });
});

test('Schedule can be set with Expression', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.expression('rate(1 hour)'),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Schedule: Match.objectLike({ Expression: 'rate(1 hour)' }),
  });
});

test('Schedule can be set to run once', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.once(),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Schedule: Match.objectLike({ Expression: 'rate(0 minutes)' }),
  });
});

test('Throws when rate above 60 minutes', () => {
  // GIVEN
  const stack = new Stack();

  // THEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.rate(Duration.minutes(61)),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  }))
    .toThrowError('Schedule duration must be between 1 and 60 minutes');
});

test('Throws when rate above is not a whole number of minutes', () => {
  // GIVEN
  const stack = new Stack();

  // THEN
  expect(() => new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.rate(Duration.seconds(59)),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  }))
    .toThrowError('\'59 seconds\' cannot be converted into a whole number of minutes.');
});

test('Can share artifacts bucket between canaries', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const canary1 = new synthetics.Canary(stack, 'Canary1', {
    schedule: synthetics.Schedule.once(),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  const canary2 = new synthetics.Canary(stack, 'Canary2', {
    schedule: synthetics.Schedule.once(),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    artifactsBucketLocation: { bucket: canary1.artifactsBucket },
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  expect(canary1.artifactsBucket).toEqual(canary2.artifactsBucket);
});

test('can specify custom test', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline(`
        exports.handler = async () => {
          console.log(\'hello world\');
        };`),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Code: {
      Handler: 'index.handler',
      Script: `
        exports.handler = async () => {
          console.log(\'hello world\');
        };`,
    },
  });
});

describe('canary in a vpc', () => {
  test('can specify vpc', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

    // WHEN
    new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
      Code: {
        Handler: 'index.handler',
        Script: `
          exports.handler = async () => {
            console.log(\'hello world\');
          };`,
      },
      VPCConfig: {
        VpcId: {
          Ref: Match.anyValue(),
        },
      },
    });
  });

  test('default security group and subnets', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

    // WHEN
    new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
      Code: {
        Handler: 'index.handler',
        Script: `
          exports.handler = async () => {
            console.log(\'hello world\');
          };`,
      },
      VPCConfig: {
        VpcId: {
          Ref: Match.anyValue(),
        },
        SecurityGroupIds: Match.anyValue(),
        SubnetIds: [...vpc.privateSubnets.map(subnet => ({ Ref: Match.stringLikeRegexp(subnet.node.id) }))],
      },
    });
  });

  test('provided security group', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
    const sg = new ec2.SecurityGroup(stack, 'Sg', { vpc });

    // WHEN
    new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
      vpc,
      securityGroups: [sg],
    });

    // THEN
    const template = Template.fromStack(stack);
    const sgTemplate = template.findResources('AWS::EC2::SecurityGroup');
    const sgIds = Object.keys(sgTemplate);

    expect(sgIds).toHaveLength(1);

    template.hasResourceProperties('AWS::Synthetics::Canary', {
      Code: {
        Handler: 'index.handler',
        Script: `
          exports.handler = async () => {
            console.log(\'hello world\');
          };`,
      },
      VPCConfig: {
        VpcId: {
          Ref: Match.anyValue(),
        },
        SecurityGroupIds: [{ 'Fn::GetAtt': [sgIds[0], 'GroupId'] }],
      },
    });
  });
});

test('Role policy generated as expected', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    Policies: [{
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:ListAllMyBuckets',
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 's3:GetBucketLocation',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'CanaryArtifactsBucket4A60D32B',
                'Arn',
              ],
            },
          },
          {
            Action: 's3:PutObject',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'CanaryArtifactsBucket4A60D32B',
                      'Arn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          },
          {
            Action: 'cloudwatch:PutMetricData',
            Condition: {
              StringEquals: {
                'cloudwatch:namespace': 'CloudWatchSynthetics',
              },
            },
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'logs:CreateLogStream',
              'logs:CreateLogGroup',
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
                  ':log-group:/aws/lambda/cwsyn-*',
                ],
              ],
            },
          },
        ],
      },
    }],
  });
});

test('Should create handler with path for recent runtimes', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    test: synthetics.Test.custom({
      handler: 'folder/canary.functionName',
      code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_8_0,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'folder/canary.functionName',
    },
    RuntimeVersion: 'syn-nodejs-puppeteer-8.0',
  });
});

describe('handler validation', () => {
  test('legacy runtimes', () => {
    const stack = new Stack();
    expect(() => {
      new synthetics.Canary(stack, 'Canary', {
        test: synthetics.Test.custom({
          handler: 'index.functionName',
          code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_1_0,
      });
    }).toThrow(/Canary Handler must be specified as 'fileName.handler' for legacy runtimes/);
  });

  test('recent runtimes', () => {
    const stack = new Stack();

    expect(() => {
      new synthetics.Canary(stack, 'Canary', {
        test: synthetics.Test.custom({
          handler: 'invalidHandler',
          code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_6_0,
      });
    }).toThrow(/Canary Handler must be specified either as 'fileName.handler', 'fileName.functionName', or 'folder\/fileName.functionName'/);

    expect(() => {
      new synthetics.Canary(stack, 'Canary1', {
        test: synthetics.Test.custom({
          handler: 'canary.functionName',
          code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_6_0,
      });
    }).not.toThrow();

    expect(() => {
      new synthetics.Canary(stack, 'Canary2', {
        test: synthetics.Test.custom({
          handler: 'folder/canary.functionName',
          code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_6_0,
      });
    }).not.toThrow();
  });

  test('handler length', () => {
    const stack = new Stack();
    expect(() => {
      new synthetics.Canary(stack, 'Canary1', {
        test: synthetics.Test.custom({
          handler: 'longHandlerName'.repeat(10) + '.handler',
          code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_9,
      });
    }).toThrow(/Canary Handler length must be between 1 and 128/);
  });
});

import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, Lazy, Stack } from '@aws-cdk/core';
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    SuccessRetentionPeriod: 10,
    FailureRetentionPeriod: 10,
    StartCanaryAfterCreation: false,
    Schedule: Match.objectLike({ DurationInSeconds: '1800' }),
    RuntimeVersion: 'syn-nodejs-puppeteer-3.8',
  });
});

test('Can set `DeleteLambdaResourceOnCanaryDeletion`', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code'),
    }),
    enableAutoDeleteLambdas: true,
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    DeleteLambdaResourcesOnCanaryDeletion: true,
  });
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    ExecutionRoleArn: stack.resolve(role.roleArn),
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RuntimeVersion: 'syn-nodejs-puppeteer-3.8',
  });
});

test('Python runtime can be specified', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_1_3,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('# Synthetics handler code'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
    RuntimeVersion: 'syn-python-selenium-1.3',
  });
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
  });

  const canary2 = new synthetics.Canary(stack, 'Canary2', {
    schedule: synthetics.Schedule.once(),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('/* Synthetics handler code */'),
    }),
    artifactsBucketLocation: { bucket: canary1.artifactsBucket },
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
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

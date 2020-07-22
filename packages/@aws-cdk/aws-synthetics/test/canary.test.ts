import '@aws-cdk/assert/jest';
import { arrayWith, objectLike } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Duration, Size, Stack } from '@aws-cdk/core';
import * as synthetics from '../lib';
import { createTokenDouble } from '@aws-cdk/core/lib/private/encoding';

let stack: Stack;
beforeEach(() => {
  stack = new Stack(new App(), 'canaries');
});

test('Create a basic canary', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
  });
});

test('Create a basic canary with no name', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'canariescanary8f7842',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
  });
});

test('Canary can have specified IAM role', () => {
  // GIVEN
  const role = new iam.Role(stack, 'role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    resources: ['*'],
    actions: [
      's3:PutObject',
      's3:GetBucketLocation',
      's3:ListAllMyBuckets',
      'cloudwatch:PutMetricData',
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
    ],
  }));

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    role,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    ExecutionRoleArn: objectLike({
      'Fn::GetAtt': arrayWith('roleC7B7E775'),
    }),
  });
});

test('Canary can have specified s3 Bucket', () => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'mytestbucket');

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    artifactBucket: bucket,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    ArtifactS3Location: objectLike({
      'Fn::Join': arrayWith(arrayWith('s3://', {Ref: 'mytestbucket8DC16178'})),
    }),
  });
});

test('Canary can set frequency', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    frequency: Duration.minutes(3),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    Schedule: objectLike({ Expression: 'rate(3 minutes)'}),
  });
});

test('Canary can set timeToLive', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    timeToLive: Duration.minutes(30),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    Schedule: objectLike({ DurationInSeconds: '1800'}),
  });
});

test('Canary can set timeout', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    timeout: Duration.seconds(60),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    RunConfig: objectLike({ TimeoutInSeconds: 60}),
  });
});

test('Canary cannot set timeout value to be greater than frequency', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    timeout: Duration.seconds(120),
    frequency: Duration.seconds(60),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    RunConfig: objectLike({ TimeoutInSeconds: 60}),
    Schedule: objectLike({ Expression: 'rate(1 minute)'}),
  });
});

test('Timeout is set to frequency when unspecified', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    frequency: Duration.minutes(5),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    RunConfig: objectLike({ TimeoutInSeconds: 300}),
    Schedule: objectLike({ Expression: 'rate(5 minutes)'}),
  });
});

test('Canary can set memorySize', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    memorySize: Size.mebibytes(3008),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    RunConfig: objectLike({ MemoryInMB: 3008}),
  });
});

test('memorySize must be below 3008 MiB', () => {
  expect(() => defineCanaryWithMemory(Size.mebibytes(3009))).toThrowError('memory size must be greater than 960 mebibytes and less than 3008 mebibytes');
});

test('memorySize must be a multiple of 64 MiB', () => {
  expect(() => defineCanaryWithMemory(Size.mebibytes(1000))).toThrowError('memory size must be a multiple of 64 mebibytes');
});

test('Canary can disable startCanaryAfterCreation', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    enable: false,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    StartCanaryAfterCreation: false,
  });
});

test('Canary can set successRetentionPeriod', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    successRetentionPeriod: Duration.days(1),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    SuccessRetentionPeriod: 1,
  });
});

test('Canary can set failureRetentionPeriod', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    name: 'mycanary',
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
    failureRetentionPeriod: Duration.days(1),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
    },
    RuntimeVersion: 'syn-1.0',
    FailureRetentionPeriod: 1,
  });
});

test('Canary returns error when name is specified incorrectly', () => {
  expect(() => defineCanaryWithName('myCanary')).toThrowError('Canary Name must be lowercase, numbers, hyphens, or underscores (no spaces)');
});

test('Canary name must be less than 21 characters', () => {
  expect(() => defineCanaryWithName('canary-name-super-long')).toThrowError('Canary Name must be less than 21 characters');
});

function defineCanaryWithName(name: string) {
  new synthetics.Canary(stack, 'Canary', {
    name,
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
  });
}

function defineCanaryWithMemory(mem: Size) {
  new synthetics.Canary(stack, 'Canary', {
    memorySize: mem,
    test: synthetics.Test.custom(stack, {
      code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      handler: 'index.handler',
    }),
  });
}

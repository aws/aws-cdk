import '@aws-cdk/assert/jest';
import { arrayWith, objectLike } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, Stack } from '@aws-cdk/core';
import * as synth from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('Create a basic canary', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
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
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    role,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
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
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    artifactBucket: bucket,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    ArtifactS3Location: objectLike({
      'Fn::Join': arrayWith(arrayWith('s3://', {Ref: 'mytestbucket8DC16178'})),
    }),
  });
});

test('Canary can set frequency', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    frequency: Duration.minutes(3),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    Schedule: objectLike({ Expression: 'rate(3 minutes)'}),
  });
});

test('Canary can set timeToLive', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    timeToLive: Duration.minutes(30),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    Schedule: objectLike({ DurationInSeconds: '1800'}),
  });
});

test('Canary can set timeout', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    timeout: Duration.seconds(60),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    RunConfig: objectLike({ TimeoutInSeconds: 60}),
  });
});

test('Canary cannot set timeout value to be greater than frequency', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    timeout: Duration.seconds(120),
    frequency: Duration.seconds(60),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    RunConfig: objectLike({ TimeoutInSeconds: 60}),
    Schedule: objectLike({ Expression: 'rate(1 minute)'}),
  });
});

test('Timeout is set to frequency when unspecified', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    frequency: Duration.minutes(5),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    RunConfig: objectLike({ TimeoutInSeconds: 300}),
    Schedule: objectLike({ Expression: 'rate(5 minutes)'}),
  });
});

test('Canary can disable startCanaryAfterCreation', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    enable: false,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    StartCanaryAfterCreation: false,
  });
});

test('Canary can set successRetentionPeriod', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    successRetentionPeriod: Duration.days(1),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
    },
    RuntimeVersion: 'syn-1.0',
    SuccessRetentionPeriod: 1,
  });
});

test('Canary can set failureRetentionPeriod', () => {
  // WHEN
  new synth.Canary(stack, 'Canary', {
    name: 'mycanary',
    failureRetentionPeriod: Duration.days(1),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    Code: {
      Handler: 'index.handler',
      Script: 'foo',
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
  new synth.Canary(stack, 'Canary', {
    name,
  });
}


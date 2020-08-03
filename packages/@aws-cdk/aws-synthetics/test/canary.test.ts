import '@aws-cdk/assert/jest';
import { objectLike } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Duration, Lazy, Stack } from '@aws-cdk/core';
import * as synthetics from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack(new App(), 'canaries');
});

test('Basic canary properties work', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
    successRetentionPeriod: Duration.days(10),
    failureRetentionPeriod: Duration.days(10),
    startAfterCreation: false,
    timeToLive: Duration.minutes(30),
    runtime: synthetics.Runtime.SYNTHETICS_1_0,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'mycanary',
    SuccessRetentionPeriod: 10,
    FailureRetentionPeriod: 10,
    StartCanaryAfterCreation: false,
    Schedule: objectLike({ DurationInSeconds: '1800'}),
    RuntimeVersion: 'syn-1.0',
  });
});

test('Canary can have generated name', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Name: 'canariescanary8ee009f',
  });
});

test('Name validation does not fail when using Tokens', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: Lazy.stringValue({produce: () => 'myCanary'}),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // THEN: no exception
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary');
});

test('Throws when name is specified incorrectly', () => {
  expect(() => new synthetics.Canary(stack, 'Canary', {
    canaryName: 'myCanary',
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  }))
    .toThrowError('Canary name must be lowercase, numbers, hyphens, or underscores (no spaces) (myCanary)');
});

test('Throws when name has more than 21 characters', () => {
  expect(() => new synthetics.Canary(stack, 'Canary', {
    canaryName: 'a'.repeat(22),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  }))
    .toThrowError('Canary name is too large, must be <= 21 characters, but is 22');
});

test('An existing role can be specified instead of auto-created', () => {
  // GIVEN
  const role = new iam.Role(stack, 'role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  // role.addToPolicy(/* required permissions per the documentation */);

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    role,
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    ExecutionRoleArn: stack.resolve(role.roleArn),
  });
});

test('An existing bucket can be specified instead of auto-created', () => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'mytestbucket');
  const prefix = 'canary';

  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    artifactsBucketLocation: { bucket, prefix },
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    ArtifactS3Location: stack.resolve(bucket.s3UrlForObject(prefix)),
  });
});

test('Schedule can be set with Rate', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    schedule: synthetics.Schedule.rate(Duration.minutes(3)),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Schedule: objectLike({ Expression: 'rate(3 minutes)'}),
  });
});

test('Schedule can be set with Expression', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    schedule: synthetics.Schedule.expression('rate(1 hour)'),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Schedule: objectLike({ Expression: 'rate(1 hour)'}),
  });
});

test('Schedule can be set to run once', () => {
  // WHEN
  new synthetics.Canary(stack, 'Canary', {
    canaryName: 'mycanary',
    schedule: synthetics.Schedule.once(),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
    Schedule: objectLike({ Expression: 'rate(0 minutes)'}),
  });
});

test('Throws when rate above 60 minutes', () => {
  expect(() => new synthetics.Canary(stack, 'Canary', {
    schedule: synthetics.Schedule.rate(Duration.minutes(61)),
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  }))
    .toThrowError('Schedule duration must be between 1 and 60 minutes');
});


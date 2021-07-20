import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { createBufferingHints, createLoggingOptions } from '../lib/private';

describe('createLoggingOptions', () => {
  let stack: cdk.Stack;
  let destinationRole: iam.IRole;

  beforeEach(() => {
    stack = new cdk.Stack();
    destinationRole = iam.Role.fromRoleArn(stack, 'Delivery Stream Role', 'arn:aws:iam::111122223333:role/DestinationRole');
  });

  test('creates resources and configuration by default', () => {
    const loggingOptions = createLoggingOptions(stack, { streamId: 'streamId', role: destinationRole });

    expect(stack).toHaveResource('AWS::Logs::LogGroup');
    expect(stack).toHaveResource('AWS::Logs::LogStream');
    expect(stack.resolve(loggingOptions)).toStrictEqual({
      enabled: true,
      logGroupName: {
        Ref: 'LogGroupF5B46931',
      },
      logStreamName: {
        Ref: 'LogGroupstreamId3B940622',
      },
    });
  });
  test('does not create resources or configuration if disabled', () => {
    const loggingOptions = createLoggingOptions(stack, { logging: false, streamId: 'streamId', role: destinationRole });

    expect(stack.resolve(loggingOptions)).toBeUndefined();
  });

  test('creates configuration if log group provided', () => {
    const loggingOptions = createLoggingOptions(stack, { logGroup: new logs.LogGroup(stack, 'Log Group'), streamId: 'streamId', role: destinationRole });

    expect(stack.resolve(loggingOptions)).toMatchObject({
      enabled: true,
    });
  });

  test('throws error if logging disabled but log group provided', () => {
    expect(() => createLoggingOptions(stack, { logging: false, logGroup: new logs.LogGroup(stack, 'Log Group'), streamId: 'streamId', role: destinationRole })).toThrowError('logging cannot be set to false when logGroup is provided');
  });

  test('uses provided log group', () => {
    const loggingOptions = createLoggingOptions(stack, { logGroup: new logs.LogGroup(stack, 'Log Group'), streamId: 'streamId', role: destinationRole });

    expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
    expect(stack.resolve(loggingOptions)).toMatchObject({
      enabled: true,
      logGroupName: {
        Ref: 'LogGroupD9735569',
      },
      logStreamName: {
        Ref: 'LogGroupstreamIdA1293DC2',
      },
    });
  });

  test('re-uses log group if called multiple times', () => {
    const loggingOptions = createLoggingOptions(stack, { streamId: 'streamId', role: destinationRole });
    const anotherLoggingOptions = createLoggingOptions(stack, { streamId: 'anotherStreamId', role: destinationRole });

    expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
    expect(stack.resolve(loggingOptions)).toMatchObject({
      logGroupName: {
        Ref: 'LogGroupF5B46931',
      },
      logStreamName: {
        Ref: 'LogGroupstreamId3B940622',
      },
    });
    expect(stack.resolve(anotherLoggingOptions)).toMatchObject({
      logGroupName: {
        Ref: 'LogGroupF5B46931',
      },
      logStreamName: {
        Ref: 'LogGroupanotherStreamIdF2754481',
      },
    });
  });
});

describe('createBufferingHints', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('does not create configuration by default', () => {
    const bufferingHints = createBufferingHints();

    expect(stack.resolve(bufferingHints)).toBeUndefined();
  });

  test('creates configuration when interval and size provided', () => {
    const bufferingHints = createBufferingHints(cdk.Duration.minutes(1), cdk.Size.kibibytes(1024));

    expect(stack.resolve(bufferingHints)).toMatchObject({
      intervalInSeconds: 60,
      sizeInMBs: 1,
    });
  });

  test('throws when only one of interval and size provided', () => {
    expect(() => createBufferingHints(cdk.Duration.minutes(1)))
      .toThrowError('If bufferingInterval is specified, bufferingSize must also be specified');
    expect(() => createBufferingHints(undefined, cdk.Size.kibibytes(1024)))
      .toThrowError('If bufferingSize is specified, bufferingInterval must also be specified');
  });

  test('validates bufferingInterval', () => {
    expect(() => createBufferingHints(cdk.Duration.seconds(30), cdk.Size.mebibytes(1)))
      .toThrowError('Buffering interval must be between 60 and 900 seconds');
    expect(() => createBufferingHints(cdk.Duration.minutes(16), cdk.Size.mebibytes(1)))
      .toThrowError('Buffering interval must be between 60 and 900 seconds');
  });

  test('validates bufferingSize', () => {
    expect(() => createBufferingHints(cdk.Duration.minutes(1), cdk.Size.mebibytes(0)))
      .toThrowError('Buffering size must be between 1 and 128 MBs');
    expect(() => createBufferingHints(cdk.Duration.minutes(1), cdk.Size.mebibytes(256)))
      .toThrowError('Buffering size must be between 1 and 128 MBs');
  });
});

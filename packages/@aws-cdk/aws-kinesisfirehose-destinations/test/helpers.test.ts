import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { createLoggingOptions } from '../lib/private';

describe('createLoggingOptions', () => {
  let stack: cdk.Stack;
  let destinationRole: iam.IRole;

  beforeEach(() => {
    stack = new cdk.Stack();
    destinationRole = iam.Role.fromRoleArn(stack, 'Delivery Stream Role', 'arn:aws:iam::111122223333:role/DestinationRole');
  });

  it('creates resources and configuration by default', () => {
    const loggingOutput = createLoggingOptions(stack, { streamId: 'streamId', role: destinationRole });

    expect(stack).toHaveResource('AWS::Logs::LogGroup');
    expect(stack).toHaveResource('AWS::Logs::LogStream');
    expect(stack.resolve(loggingOutput?.loggingOptions)).toStrictEqual({
      enabled: true,
      logGroupName: {
        Ref: 'LogGroupF5B46931',
      },
      logStreamName: {
        Ref: 'LogGroupstreamId3B940622',
      },
    });
  });

  it('does not create resources or configuration if disabled', () => {
    const loggingOutput = createLoggingOptions(stack, { logging: false, streamId: 'streamId', role: destinationRole });

    expect(stack.resolve(loggingOutput)).toBeUndefined();
  });

  it('creates configuration if log group provided', () => {
    const loggingOutput = createLoggingOptions(stack, { logGroup: new logs.LogGroup(stack, 'Log Group'), streamId: 'streamId', role: destinationRole });

    expect(stack.resolve(loggingOutput?.loggingOptions)).toMatchObject({
      enabled: true,
    });
  });

  it('throws error if logging disabled but log group provided', () => {
    expect(() => createLoggingOptions(stack, { logging: false, logGroup: new logs.LogGroup(stack, 'Log Group'), streamId: 'streamId', role: destinationRole })).toThrowError('logging cannot be set to false when logGroup is provided');
  });

  it('uses provided log group', () => {
    const loggingOutput = createLoggingOptions(stack, { logGroup: new logs.LogGroup(stack, 'Log Group'), streamId: 'streamId', role: destinationRole });

    expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
    expect(stack.resolve(loggingOutput?.loggingOptions)).toMatchObject({
      enabled: true,
      logGroupName: {
        Ref: 'LogGroupD9735569',
      },
      logStreamName: {
        Ref: 'LogGroupstreamIdA1293DC2',
      },
    });
  });

  it('re-uses log group if called multiple times', () => {
    const loggingOutput = createLoggingOptions(stack, { streamId: 'streamId', role: destinationRole });
    const anotherLoggingOutput = createLoggingOptions(stack, { streamId: 'anotherStreamId', role: destinationRole });

    expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
    expect(stack.resolve(loggingOutput?.loggingOptions)).toMatchObject({
      logGroupName: {
        Ref: 'LogGroupF5B46931',
      },
      logStreamName: {
        Ref: 'LogGroupstreamId3B940622',
      },
    });
    expect(stack.resolve(anotherLoggingOutput?.loggingOptions)).toMatchObject({
      logGroupName: {
        Ref: 'LogGroupF5B46931',
      },
      logStreamName: {
        Ref: 'LogGroupanotherStreamIdF2754481',
      },
    });
  });

  it('grants log group write permissions to destination role', () => {
    const logGroup = new logs.LogGroup(stack, 'Log Group');

    createLoggingOptions(stack, { logGroup, streamId: 'streamId', role: destinationRole });

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      Roles: [stack.resolve(destinationRole.roleName)],
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
            Resource: stack.resolve(logGroup.logGroupArn),
          },
        ],
      },
    });
  });

  it('returns log group grant as dependable', () => {
    const loggingOutput = createLoggingOptions(stack, { logging: true, streamId: 'streamId', role: destinationRole });

    expect(loggingOutput?.dependables?.length).toBe(1);
    expect(loggingOutput?.dependables[0]).toBeInstanceOf(iam.Grant);
  });
});

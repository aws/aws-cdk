import { anything } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as firehose from '../lib';

describe('destination', () => {
  let stack: cdk.Stack;
  let destinationRole: iam.IRole;

  beforeEach(() => {
    stack = new cdk.Stack();
    destinationRole = new iam.Role(stack, 'DeliveryStreamRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
  });

  describe('createLoggingOptions', () => {
    class LoggingDestination extends firehose.DestinationBase {
      public bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        return {
          extendedS3DestinationConfiguration: {
            bucketArn: 'arn:aws:s3:::destination-bucket',
            roleArn: destinationRole.roleArn,
            cloudWatchLoggingOptions: this.createLoggingOptions(scope, destinationRole, 'streamId'),
          },

        };
      }
    }

    test('creates resources and configuration by default', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new LoggingDestination()],
      });

      expect(stack).toHaveResource('AWS::Logs::LogGroup');
      expect(stack).toHaveResource('AWS::Logs::LogStream');
      expect(stack).toHaveResource('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          BucketARN: 'arn:aws:s3:::destination-bucket',
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: anything(),
            LogStreamName: anything(),
          },
          RoleARN: stack.resolve(destinationRole.roleArn),
        },
      });
    });

    test('does not create resources or configuration if disabled', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new LoggingDestination({
          logging: false,
        })],
      });
      expect(stack).toHaveResource('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          BucketARN: 'arn:aws:s3:::destination-bucket',
          RoleARN: stack.resolve(destinationRole.roleArn),
        },
      });
    });

    test('creates configuration if log group provided', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new LoggingDestination({
          logGroup: new logs.LogGroup(stack, 'LogGroup'),
        })],
      });

      expect(stack).toHaveResource('AWS::Logs::LogGroup');
      expect(stack).toHaveResource('AWS::Logs::LogStream');
      expect(stack).toHaveResource('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          BucketARN: 'arn:aws:s3:::destination-bucket',
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: anything(),
            LogStreamName: anything(),
          },
          RoleARN: stack.resolve(destinationRole.roleArn),
        },
      });
    });

    test('throws error if logging disabled but log group provided', () => {
      const testDestination = new LoggingDestination({ logging: false, logGroup: new logs.LogGroup(stack, 'Log Group') });

      expect(() => testDestination.bind(stack, { role: destinationRole })).toThrowError('logging cannot be set to false when logGroup is provided');
    });

    test('uses provided log group', () => {
      const providedLogGroup = new logs.LogGroup(stack, 'LogGroup');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new LoggingDestination({
          logGroup: providedLogGroup,
        })],
      });

      expect(stack).toHaveResource('AWS::Logs::LogGroup');
      expect(stack).toHaveResource('AWS::Logs::LogStream');
      expect(stack).toHaveResource('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          BucketARN: 'arn:aws:s3:::destination-bucket',
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: stack.resolve(providedLogGroup.logGroupName),
            LogStreamName: anything(),
          },
          RoleARN: stack.resolve(destinationRole.roleArn),
        },
      });
    });

    test('re-uses log group if called multiple times', () => {
      class TestDestination extends firehose.DestinationBase {
        public bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
          let loggingOptions = this.createLoggingOptions(scope, destinationRole, 'streamId');
          loggingOptions = this.createLoggingOptions(scope, destinationRole, 'anotherStreamId');
          return {
            extendedS3DestinationConfiguration: {
              bucketArn: 'arn:aws:s3:::destination-bucket',
              roleArn: destinationRole.roleArn,
              cloudWatchLoggingOptions: loggingOptions,
            },
          };
        }
      };

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new TestDestination()],
      });
      expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
    });
  });
});

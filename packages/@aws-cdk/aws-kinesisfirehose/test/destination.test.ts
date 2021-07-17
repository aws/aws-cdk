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
    destinationRole = iam.Role.fromRoleArn(stack, 'Delivery Stream Role', 'arn:aws:iam::111122223333:role/DestinationRole');
  });

  describe('createLoggingOptions', () => {
    class LoggingDestination extends firehose.DestinationBase {
      public bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        return {
          properties: {
            testDestinationConfig: {
              loggingConfig: this.createLoggingOptions(scope, destinationRole, 'streamId'),
            },
          },
        };
      }
    }

    test('creates resources and configuration by default', () => {
      const testDestination = new LoggingDestination();

      const testDestinationConfig = testDestination.bind(stack, { role: destinationRole });

      expect(stack).toHaveResource('AWS::Logs::LogGroup');
      expect(stack).toHaveResource('AWS::Logs::LogStream');
      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            loggingConfig: {
              enabled: true,
              logGroupName: {
                Ref: 'LogGroupF5B46931',
              },
              logStreamName: {
                Ref: 'LogGroupstreamId3B940622',
              },
            },
          },
        },
      });
    });
    test('does not create resources or configuration if disabled', () => {
      const testDestination = new LoggingDestination({ logging: false });

      const testDestinationConfig = testDestination.bind(stack, { role: destinationRole });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {},
        },
      });
    });

    test('creates configuration if log group provided', () => {
      const testDestination = new LoggingDestination({ logGroup: new logs.LogGroup(stack, 'Log Group') });

      const testDestinationConfig = testDestination.bind(stack, { role: destinationRole });

      expect(stack.resolve(testDestinationConfig)).toMatchObject({
        properties: {
          testDestinationConfig: {
            loggingConfig: {
              enabled: true,
            },
          },
        },
      });
    });

    test('throws error if logging disabled but log group provided', () => {
      const testDestination = new LoggingDestination({ logging: false, logGroup: new logs.LogGroup(stack, 'Log Group') });

      expect(() => testDestination.bind(stack, { role: destinationRole })).toThrowError('logging cannot be set to false when logGroup is provided');
    });

    test('uses provided log group', () => {
      const testDestination = new LoggingDestination({ logGroup: new logs.LogGroup(stack, 'Log Group') });

      const testDestinationConfig = testDestination.bind(stack, { role: destinationRole });

      expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
      expect(stack.resolve(testDestinationConfig)).toMatchObject({
        properties: {
          testDestinationConfig: {
            loggingConfig: {
              enabled: true,
              logGroupName: {
                Ref: 'LogGroupD9735569',
              },
              logStreamName: {
                Ref: 'LogGroupstreamIdA1293DC2',
              },
            },
          },
        },
      });
    });

    test('re-uses log group if called multiple times', () => {
      const testDestination = new class extends firehose.DestinationBase {
        public bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
          return {
            properties: {
              testDestinationConfig: {
                loggingConfig: this.createLoggingOptions(scope, destinationRole, 'streamId'),
                anotherLoggingConfig: this.createLoggingOptions(scope, destinationRole, 'anotherStreamId'),
              },
            },
          };
        }
      }();

      const testDestinationConfig = testDestination.bind(stack, { role: destinationRole });

      expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
      expect(stack.resolve(testDestinationConfig)).toMatchObject({
        properties: {
          testDestinationConfig: {
            loggingConfig: {
              logGroupName: {
                Ref: 'LogGroupF5B46931',
              },
              logStreamName: {
                Ref: 'LogGroupstreamId3B940622',
              },
            },
            anotherLoggingConfig: {
              logGroupName: {
                Ref: 'LogGroupF5B46931',
              },
              logStreamName: {
                Ref: 'LogGroupanotherStreamIdF2754481',
              },
            },
          },
        },
      });
    });
  });
});

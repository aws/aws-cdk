import '@aws-cdk/assert-internal/jest';
import { arrayWith, objectLike } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as firehose from '../lib';

describe('destination', () => {
  let stack: cdk.Stack;
  let deliveryStreamRole: iam.IRole;
  let deliveryStream: firehose.IDeliveryStream;

  const deliveryStreamRoleArn = 'arn:aws:iam::111122223333:role/DeliveryStreamRole';

  beforeEach(() => {
    stack = new cdk.Stack();
    deliveryStreamRole = iam.Role.fromRoleArn(stack, 'Delivery Stream Role', deliveryStreamRoleArn);
    deliveryStream = firehose.DeliveryStream.fromDeliveryStreamAttributes(stack, 'Delivery Stream', {
      deliveryStreamName: 'mydeliverystream',
      role: deliveryStreamRole,
    });
  });

  describe('createLoggingOptions', () => {
    class LoggingDestination extends firehose.DestinationBase {
      public bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        return {
          properties: {
            testDestinationConfig: {
              loggingConfig: this.createLoggingOptions(scope, options.deliveryStream, 'streamId'),
            },
          },
        };
      }
    }

    test('creates resources and configuration by default', () => {
      const testDestination = new LoggingDestination();

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

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

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {},
        },
      });
    });

    test('creates configuration if log group provided', () => {
      const testDestination = new LoggingDestination({ logGroup: new logs.LogGroup(stack, 'Log Group') });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

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

      expect(() => testDestination.bind(stack, { deliveryStream })).toThrowError('logging cannot be set to false when logGroup is provided');
    });

    test('uses provided log group', () => {
      const testDestination = new LoggingDestination({ logGroup: new logs.LogGroup(stack, 'Log Group') });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

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
        public bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
          return {
            properties: {
              testDestinationConfig: {
                loggingConfig: this.createLoggingOptions(scope, options.deliveryStream, 'streamId'),
                anotherLoggingConfig: this.createLoggingOptions(scope, options.deliveryStream, 'anotherStreamId'),
              },
            },
          };
        }
      }();

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

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

  describe('createBackupConfig', () => {
    class BackupDestination extends firehose.DestinationBase {
      public bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        return {
          properties: {
            testDestinationConfig: {
              backupConfig: this.createBackupConfig(scope, options.deliveryStream),
            },
          },
        };
      }
    }

    test('does not create resources or configuration if no backupConfiguration provided', () => {
      const testDestination = new BackupDestination();

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {},
        },
      });
    });

    test('does not create resources or configuration if backupConfiguration is empty', () => {
      const testDestination = new BackupDestination({ backupConfiguration: {} });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {},
        },
      });
    });

    test('create resources and configuration if explicitly enabled', () => {
      const testDestination = new BackupDestination({ backupConfiguration: { backupMode: firehose.BackupMode.ALL } });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            backupConfig: {
              bucketArn: { 'Fn::GetAtt': ['BackupBucket26B8E51C', 'Arn'] },
              roleArn: deliveryStreamRoleArn,
              encryptionConfiguration: {
                noEncryptionConfig: 'NoEncryption',
              },
              cloudWatchLoggingOptions: {
                enabled: true,
                logGroupName: {
                  Ref: 'BackupLogGroupB15A0768',
                },
                logStreamName: {
                  Ref: 'BackupLogGroupS3BackupA7B3FB1E',
                },
              },
            },
          },
        },
      });
    });

    test('allows custom prefixes', () => {
      const testDestination = new BackupDestination({
        backupConfiguration: {
          prefix: 'custom-prefix',
          errorOutputPrefix: 'custom-error-prefix',
          backupMode: firehose.BackupMode.ALL,
        },
      });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            backupConfig: {
              bucketArn: { 'Fn::GetAtt': ['BackupBucket26B8E51C', 'Arn'] },
              roleArn: deliveryStreamRoleArn,
              encryptionConfiguration: {
                noEncryptionConfig: 'NoEncryption',
              },
              prefix: 'custom-prefix',
              errorOutputPrefix: 'custom-error-prefix',
              cloudWatchLoggingOptions: {
                enabled: true,
                logGroupName: {
                  Ref: 'BackupLogGroupB15A0768',
                },
                logStreamName: {
                  Ref: 'BackupLogGroupS3BackupA7B3FB1E',
                },
              },
            },
          },
        },
      });
    });

    test('allows compression', () => {
      const testDestination = new BackupDestination({
        backupConfiguration: {
          compression: firehose.Compression.GZIP,
          backupMode: firehose.BackupMode.ALL,
        },
      });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            backupConfig: {
              bucketArn: { 'Fn::GetAtt': ['BackupBucket26B8E51C', 'Arn'] },
              roleArn: deliveryStreamRoleArn,
              encryptionConfiguration: {
                noEncryptionConfig: 'NoEncryption',
              },
              compressionFormat: 'GZIP',
              cloudWatchLoggingOptions: {
                enabled: true,
                logGroupName: {
                  Ref: 'BackupLogGroupB15A0768',
                },
                logStreamName: {
                  Ref: 'BackupLogGroupS3BackupA7B3FB1E',
                },
              },
            },
          },
        },
      });
    });

    test('allows encryption', () => {
      const encryptionKeyArn = 'arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab';
      const encryptionKey = kms.Key.fromKeyArn(stack, 'Backup Key', encryptionKeyArn);
      const testDestination = new BackupDestination({
        backupConfiguration: {
          encryptionKey,
          backupMode: firehose.BackupMode.ALL,
        },
      });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            backupConfig: {
              bucketArn: { 'Fn::GetAtt': ['BackupBucket26B8E51C', 'Arn'] },
              roleArn: deliveryStreamRoleArn,
              encryptionConfiguration: {
                kmsEncryptionConfig: {
                  awskmsKeyArn: encryptionKeyArn,
                },
              },
              cloudWatchLoggingOptions: {
                enabled: true,
                logGroupName: {
                  Ref: 'BackupLogGroupB15A0768',
                },
                logStreamName: {
                  Ref: 'BackupLogGroupS3BackupA7B3FB1E',
                },
              },
            },
          },
        },
      });
      expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: arrayWith(objectLike({
            Action: arrayWith(
              'kms:Encrypt',
              'kms:Decrypt',
            ),
            Resource: encryptionKeyArn,
          })),
        },
        Roles: ['DeliveryStreamRole'],
      });
    });

    test('creates configuration using bucket if provided', () => {
      const testDestination = new BackupDestination({ backupConfiguration: { backupBucket: new s3.Bucket(stack, 'Bucket') } });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack).toCountResources('AWS::S3::Bucket', 1);
      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            backupConfig: {
              bucketArn: { 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] },
              roleArn: deliveryStreamRoleArn,
              encryptionConfiguration: {
                noEncryptionConfig: 'NoEncryption',
              },
              cloudWatchLoggingOptions: {
                enabled: true,
                logGroupName: {
                  Ref: 'BackupLogGroupB15A0768',
                },
                logStreamName: {
                  Ref: 'BackupLogGroupS3BackupA7B3FB1E',
                },
              },
            },
          },
        },
      });
    });

    test('throws error if backup disabled and bucket provided', () => {
      const testDestination = new BackupDestination({ backupConfiguration: { backupMode: firehose.BackupMode.DISABLED, backupBucket: new s3.Bucket(stack, 'Bucket') } });

      expect(() => testDestination.bind(stack, { deliveryStream })).toThrowError('Destination backup cannot be set to DISABLED when backupBucket is provided');
    });

    test('can configure backup prefix', () => {
      const testDestination = new BackupDestination({ backupConfiguration: { backupMode: firehose.BackupMode.ALL, prefix: 'backupPrefix' } });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toMatchObject({
        properties: {
          testDestinationConfig: {
            backupConfig: {
              prefix: 'backupPrefix',
            },
          },
        },
      });
    });
  });

  describe('createProcessingConfig', () => {
    class ProcessingDestination extends firehose.DestinationBase {
      public bind(_scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        return {
          properties: {
            testDestinationConfig: {
              processingConfig: this.createProcessingConfig(options.deliveryStream),
            },
          },
        };
      }
    }

    let lambdaFunction: lambda.IFunction;
    const lambdaFunctionArn = 'arn:aws:lambda:us-west-1:111122223333:function:my-function';
    beforeEach(() => {
      lambdaFunction = lambda.Function.fromFunctionAttributes(stack, 'Processor', {
        functionArn: lambdaFunctionArn,
        sameEnvironment: true,
      });
    });

    test('does not create configuration by default', () => {
      const testDestination = new ProcessingDestination();

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {},
        },
      });
    });

    test('does not create configuration if processors array is empty', () => {
      const testDestination = new ProcessingDestination({ processors: [] });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {},
        },
      });
    });

    test('creates configuration if a processor is specified with only required parameters', () => {
      const testDestination = new ProcessingDestination({ processors: [new firehose.LambdaFunctionProcessor(lambdaFunction, {})] });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            processingConfig: {
              enabled: true,
              processors: [
                {
                  parameters: [
                    {
                      parameterName: 'RoleArn',
                      parameterValue: deliveryStreamRoleArn,
                    },
                    {
                      parameterName: 'LambdaArn',
                      parameterValue: lambdaFunctionArn,
                    },
                  ],
                  type: 'Lambda',
                },
              ],
            },
          },
        },
      });
    });

    test('creates configuration if a processor is specified with optional parameters', () => {
      const testDestination = new ProcessingDestination({
        processors: [
          new firehose.LambdaFunctionProcessor(lambdaFunction, {
            bufferInterval: cdk.Duration.minutes(1),
            bufferSize: cdk.Size.kibibytes(1024),
            retries: 1,
          }),
        ],
      });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            processingConfig: {
              enabled: true,
              processors: [
                {
                  parameters: [
                    {
                      parameterName: 'RoleArn',
                      parameterValue: deliveryStreamRoleArn,
                    },
                    {
                      parameterName: 'LambdaArn',
                      parameterValue: lambdaFunctionArn,
                    },
                    {
                      parameterName: 'BufferIntervalInSeconds',
                      parameterValue: '60',
                    },
                    {
                      parameterName: 'BufferSizeInMBs',
                      parameterValue: '1',
                    },
                    {
                      parameterName: 'NumberOfRetries',
                      parameterValue: '1',
                    },
                  ],
                  type: 'Lambda',
                },
              ],
            },
          },
        },
      });
    });

    test('throws an error if multiple processors are specified', () => {
      const testDestination = new ProcessingDestination({
        processors: [new firehose.LambdaFunctionProcessor(lambdaFunction), new firehose.LambdaFunctionProcessor(lambdaFunction)],
      });

      expect(() => testDestination.bind(stack, { deliveryStream })).toThrowError('Only one processor is allowed per delivery stream destination');
    });
  });

  describe('createBufferingHints', () => {
    class BufferingDestination extends firehose.DestinationBase {
      constructor(protected readonly props: firehose.DestinationProps = {}) {
        super(props);
      }

      public bind(_scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        return {
          properties: {
            testDestinationConfig: {
              bufferingConfig: this.createBufferingHints(this.props.backupConfiguration?.bufferingInterval,
                this.props.backupConfiguration?.bufferingSize),
            },
          },
        };
      }
    }

    test('does not create configuration by default', () => {
      const testDestination = new BufferingDestination();

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {},
        },
      });
    });

    test('creates configuration when interval and size provided', () => {
      const testDestination = new BufferingDestination({
        backupConfiguration: { bufferingInterval: cdk.Duration.minutes(1), bufferingSize: cdk.Size.kibibytes(1024) },
      });

      const testDestinationConfig = testDestination.bind(stack, { deliveryStream });

      expect(stack.resolve(testDestinationConfig)).toStrictEqual({
        properties: {
          testDestinationConfig: {
            bufferingConfig: {
              intervalInSeconds: 60,
              sizeInMBs: 1,
            },
          },
        },
      });
    });

    test('throws when only one of interval and size provided', () => {
      expect(() => new BufferingDestination({ backupConfiguration: { bufferingInterval: cdk.Duration.minutes(1) } }).bind(stack, { deliveryStream }))
        .toThrowError('If bufferingInterval is specified, bufferingSize must also be specified');
      expect(() => new BufferingDestination({ backupConfiguration: { bufferingSize: cdk.Size.kibibytes(1024) } }).bind(stack, { deliveryStream }))
        .toThrowError('If bufferingSize is specified, bufferingInterval must also be specified');
    });

    test('validates bufferingInterval', () => {
      expect(() => new BufferingDestination({
        backupConfiguration: { bufferingInterval: cdk.Duration.seconds(30), bufferingSize: cdk.Size.mebibytes(1) },
      }).bind(stack, { deliveryStream }))
        .toThrowError('Buffering interval must be between 60 and 900 seconds');
      expect(() => new BufferingDestination({
        backupConfiguration: { bufferingInterval: cdk.Duration.minutes(16), bufferingSize: cdk.Size.mebibytes(1) },
      }).bind(stack, { deliveryStream }))
        .toThrowError('Buffering interval must be between 60 and 900 seconds');
    });

    test('validates bufferingSize', () => {
      expect(() => new BufferingDestination({
        backupConfiguration: { bufferingSize: cdk.Size.mebibytes(0), bufferingInterval: cdk.Duration.minutes(1) },
      }).bind(stack, { deliveryStream }))
        .toThrowError('Buffering size must be between 1 and 128 MBs');
      expect(() => new BufferingDestination({
        backupConfiguration: { bufferingSize: cdk.Size.mebibytes(256), bufferingInterval: cdk.Duration.minutes(1) },
      }).bind(stack, { deliveryStream }))
        .toThrowError('Buffering size must be between 1 and 128 MBs');
    });
  });
});

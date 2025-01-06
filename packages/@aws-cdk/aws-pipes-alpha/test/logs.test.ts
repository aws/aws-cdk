import { DeliveryStream, DestinationBindOptions, DestinationConfig, IDestination } from '@aws-cdk/aws-kinesisfirehose-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { TestSource, TestTarget } from './test-classes';
import { CloudwatchLogsLogDestination, FirehoseLogDestination, IncludeExecutionData, LogLevel, Pipe, S3LogDestination, S3OutputFormat } from '../lib';

describe('Pipe', () => {
  let stack: Stack;
  const source = new TestSource();
  const target = new TestTarget();

  beforeEach(() => {
    jest.resetAllMocks();
    const app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  describe('logs', () => {
    it('should pass along cloudwatch logs log configuration', () => {
      // WHEN
      const logGroup = new LogGroup(stack, 'LogGroup');
      const cwlLogDestination = new CloudwatchLogsLogDestination(logGroup);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.INFO,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [cwlLogDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            CloudwatchLogsLogDestination: {
              LogGroupArn: {
                'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'],
              },
            },
            Level: 'INFO',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should allow write to log group with pipe role', () => {
      // WHEN
      const logGroup = new LogGroup(stack, 'LogGroup');
      const cwlLogDestination = new CloudwatchLogsLogDestination(logGroup);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logDestinations: [cwlLogDestination],
      });

      const template = Template.fromStack(stack);

      // ASSERT
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Resource: {
                'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'],
              },
            }],
          },
        },
      });
    });

    it('should pass along s3 log configuration', () => {
      // WHEN
      const bucket = new Bucket(stack, 'LogBucket');
      const s3LogDestination = new S3LogDestination({
        bucket,
        prefix: 'mike',
        outputFormat: S3OutputFormat.W3C,
      });

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [s3LogDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            S3LogDestination: {
              BucketName: {
                Ref: 'LogBucketCC3B17E8',
              },
              BucketOwner: stack.account,
              Prefix: 'mike',
              OutputFormat: 'w3c',
            },
            Level: 'ERROR',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should pass along s3 log configuration for cross-account bucket', () => {
      // WHEN
      const bucket = new Bucket(stack, 'LogBucket');
      const s3LogDestination = new S3LogDestination({
        bucket,
        bucketOwner: '111111111111',
        prefix: 'mike',
        outputFormat: S3OutputFormat.JSON,
      });

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [s3LogDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            S3LogDestination: {
              BucketName: {
                Ref: 'LogBucketCC3B17E8',
              },
              BucketOwner: '111111111111',
              Prefix: 'mike',
              OutputFormat: 'json',
            },
            Level: 'ERROR',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should pass along bucketOwner for imported bucket', () => {
      // WHEN
      const bucket = Bucket.fromBucketName(stack, 'ImportedBucket', 'MyTestBucket');
      const s3LogDestination = new S3LogDestination({
        bucket,
        prefix: 'mike',
        outputFormat: S3OutputFormat.JSON,
      });

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [s3LogDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            S3LogDestination: {
              BucketName: 'MyTestBucket',
              BucketOwner: '123456789012',
              Prefix: 'mike',
              OutputFormat: 'json',
            },
            Level: 'ERROR',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should allow write to S3 bucket with pipe role', () => {
      // WHEN
      const bucket = new Bucket(stack, 'LogBucket');
      const s3LogDestination = new S3LogDestination({ bucket });

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logDestinations: [s3LogDestination],
      });

      const template = Template.fromStack(stack);

      // ASSERT
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: [
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              Resource: {
                'Fn::Join': ['', [{ 'Fn::GetAtt': ['LogBucketCC3B17E8', 'Arn'] }, '/*']],
              },
            }],
          },
        },
      });
    });

    it('should pass along firehose log configuration', () => {
      // WHEN
      const firehoseBucket = new Bucket(stack, 'FirehoseBucket');
      const role = new Role(stack, 'Role', { assumedBy: new ServicePrincipal('firehose.amazonaws.com') });

      const mockS3Destination: IDestination = {
        bind(_scope: Construct, _options: DestinationBindOptions): DestinationConfig {
          const bucketGrant = firehoseBucket.grantReadWrite(role);
          return {
            extendedS3DestinationConfiguration: {
              bucketArn: firehoseBucket.bucketArn,
              roleArn: role.roleArn,
            },
            dependables: [bucketGrant],
          };
        },
      };

      const deliveryStream = new DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
        destination: mockS3Destination,
      });

      const firehoseDestination = new FirehoseLogDestination(deliveryStream);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [firehoseDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            FirehoseLogDestination: {
              DeliveryStreamArn: {
                'Fn::GetAtt': ['DeliveryStreamNoSourceOrEncryptionKey0E4AAB82', 'Arn'],
              },
            },
            Level: 'ERROR',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should allow write to firehose stream', () => {
      // WHEN
      const firehoseBucket = new Bucket(stack, 'FirehoseBucket');
      const role = new Role(stack, 'Role', { assumedBy: new ServicePrincipal('firehose.amazonaws.com') });

      const mockS3Destination: IDestination = {
        bind(_scope: Construct, _options: DestinationBindOptions): DestinationConfig {
          const bucketGrant = firehoseBucket.grantReadWrite(role);
          return {
            extendedS3DestinationConfiguration: {
              bucketArn: firehoseBucket.bucketArn,
              roleArn: role.roleArn,
            },
            dependables: [bucketGrant],
          };
        },
      };

      const deliveryStream = new DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
        destination: mockS3Destination,
      });

      const firehoseDestination = new FirehoseLogDestination(deliveryStream);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [firehoseDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: [
                'firehose:PutRecord',
                'firehose:PutRecordBatch',
              ],
              Resource: {
                'Fn::GetAtt': ['DeliveryStreamNoSourceOrEncryptionKey0E4AAB82', 'Arn'],
              },
            }],
          },
        },
      });
    });
  });
});

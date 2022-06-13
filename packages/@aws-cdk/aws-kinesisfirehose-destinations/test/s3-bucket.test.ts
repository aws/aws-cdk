import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as firehosedestinations from '../lib';

describe('S3 destination', () => {
  let stack: cdk.Stack;
  let bucket: s3.IBucket;
  let destinationRole: iam.IRole;

  beforeEach(() => {
    stack = new cdk.Stack();
    bucket = new s3.Bucket(stack, 'Bucket');
    destinationRole = new iam.Role(stack, 'Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
  });

  it('provides defaults when no configuration is provided', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [new firehosedestinations.S3Bucket(bucket, { role: destinationRole })],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        BucketARN: stack.resolve(bucket.bucketArn),
        CloudWatchLoggingOptions: {
          Enabled: true,
        },
        RoleARN: stack.resolve(destinationRole.roleArn),
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 1);
  });

  it('creates a role when none is provided', () => {

    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [new firehosedestinations.S3Bucket(bucket)],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        RoleARN: {
          'Fn::GetAtt': [
            'DeliveryStreamS3DestinationRoleD96B8345',
            'Arn',
          ],
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'firehose.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });
  });

  it('grants read/write access to the bucket', () => {
    const destination = new firehosedestinations.S3Bucket(bucket, { role: destinationRole });

    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [destination],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [stack.resolve(destinationRole.roleName)],
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject',
              's3:PutObjectLegalHold',
              's3:PutObjectRetention',
              's3:PutObjectTagging',
              's3:PutObjectVersionTagging',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              stack.resolve(bucket.bucketArn),
              { 'Fn::Join': ['', [stack.resolve(bucket.bucketArn), '/*']] },
            ],
          },
        ]),
      },
    });
  });

  it('bucket and log group grants are depended on by delivery stream', () => {
    const logGroup = logs.LogGroup.fromLogGroupName(stack, 'Log Group', 'evergreen');
    const destination = new firehosedestinations.S3Bucket(bucket, { role: destinationRole, logGroup });
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [destination],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: 'DestinationRoleDefaultPolicy1185C75D',
      Roles: [stack.resolve(destinationRole.roleName)],
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject',
              's3:PutObjectLegalHold',
              's3:PutObjectRetention',
              's3:PutObjectTagging',
              's3:PutObjectVersionTagging',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              stack.resolve(bucket.bucketArn),
              { 'Fn::Join': ['', [stack.resolve(bucket.bucketArn), '/*']] },
            ],
          },
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
    Template.fromStack(stack).hasResource('AWS::KinesisFirehose::DeliveryStream', {
      DependsOn: ['DestinationRoleDefaultPolicy1185C75D'],
    });
  });

  describe('logging', () => {
    it('creates resources and configuration by default', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket)],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
          },
        },
      });
    });

    it('does not create resources or configuration if disabled', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, { logging: false })],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CloudWatchLoggingOptions: Match.absent(),
        },
      });
    });

    it('uses provided log group', () => {
      const logGroup = new logs.LogGroup(stack, 'Log Group');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, { logGroup })],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: stack.resolve(logGroup.logGroupName),
          },
        },
      });
    });

    it('throws error if logging disabled but log group provided', () => {
      const destination = new firehosedestinations.S3Bucket(bucket, { logging: false, logGroup: new logs.LogGroup(stack, 'Log Group') });

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      })).toThrowError('logging cannot be set to false when logGroup is provided');
    });

    it('grants log group write permissions to destination role', () => {
      const logGroup = new logs.LogGroup(stack, 'Log Group');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, { logGroup, role: destinationRole })],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: stack.resolve(logGroup.logGroupArn),
            },
          ]),
        },
      });
    });
  });

  describe('processing configuration', () => {
    let lambdaFunction: lambda.IFunction;
    let basicLambdaProcessor: firehose.LambdaFunctionProcessor;
    let destinationWithBasicLambdaProcessor: firehosedestinations.S3Bucket;

    beforeEach(() => {
      lambdaFunction = new lambda.Function(stack, 'DataProcessorFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'bar',
      });
      basicLambdaProcessor = new firehose.LambdaFunctionProcessor(lambdaFunction);
      destinationWithBasicLambdaProcessor = new firehosedestinations.S3Bucket(bucket, {
        role: destinationRole,
        processor: basicLambdaProcessor,
      });
    });

    it('creates configuration for LambdaFunctionProcessor', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destinationWithBasicLambdaProcessor],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          ProcessingConfiguration: {
            Enabled: true,
            Processors: [{
              Type: 'Lambda',
              Parameters: [
                {
                  ParameterName: 'RoleArn',
                  ParameterValue: stack.resolve(destinationRole.roleArn),
                },
                {
                  ParameterName: 'LambdaArn',
                  ParameterValue: stack.resolve(lambdaFunction.functionArn),
                },
              ],
            }],
          },
        },
      });
    });

    it('set all optional parameters', () => {
      const processor = new firehose.LambdaFunctionProcessor(lambdaFunction, {
        bufferInterval: cdk.Duration.minutes(1),
        bufferSize: cdk.Size.mebibytes(1),
        retries: 5,
      });
      const destination = new firehosedestinations.S3Bucket(bucket, {
        role: destinationRole,
        processor: processor,
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          ProcessingConfiguration: {
            Enabled: true,
            Processors: [{
              Type: 'Lambda',
              Parameters: [
                {
                  ParameterName: 'RoleArn',
                  ParameterValue: stack.resolve(destinationRole.roleArn),
                },
                {
                  ParameterName: 'LambdaArn',
                  ParameterValue: stack.resolve(lambdaFunction.functionArn),
                },
                {
                  ParameterName: 'BufferIntervalInSeconds',
                  ParameterValue: '60',
                },
                {
                  ParameterName: 'BufferSizeInMBs',
                  ParameterValue: '1',
                },
                {
                  ParameterName: 'NumberOfRetries',
                  ParameterValue: '5',
                },
              ],
            }],
          },
        },
      });
    });

    it('grants invoke access to the lambda function and delivery stream depends on grant', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destinationWithBasicLambdaProcessor],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'DestinationRoleDefaultPolicy1185C75D',
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: 'lambda:InvokeFunction',
              Effect: 'Allow',
              Resource: [
                stack.resolve(lambdaFunction.functionArn),
                { 'Fn::Join': ['', [stack.resolve(lambdaFunction.functionArn), ':*']] },
              ],
            },
          ]),
        },
      });
      Template.fromStack(stack).hasResource('AWS::KinesisFirehose::DeliveryStream', {
        DependsOn: ['DestinationRoleDefaultPolicy1185C75D'],
      });
    });
  });

  describe('compression', () => {
    it('configures when specified', () => {
      const destination = new firehosedestinations.S3Bucket(bucket, {
        compression: firehosedestinations.Compression.GZIP,
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CompressionFormat: 'GZIP',
        },
      });
    });

    it('allows custom compression types', () => {
      const destination = new firehosedestinations.S3Bucket(bucket, {
        compression: firehosedestinations.Compression.of('SNAZZY'),
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CompressionFormat: 'SNAZZY',
        },
      });
    });
  });

  describe('buffering', () => {
    it('creates configuration when interval and size provided', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(1),
        })],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          BufferingHints: {
            IntervalInSeconds: 60,
            SizeInMBs: 1,
          },
        },
      });
    });

    it('validates bufferingInterval', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.seconds(30),
          bufferingSize: cdk.Size.mebibytes(1),
        })],
      })).toThrowError('Buffering interval must be between 60 and 900 seconds. Buffering interval provided was 30 seconds.');

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destinations: [new firehosedestinations.S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(16),
          bufferingSize: cdk.Size.mebibytes(1),
        })],
      })).toThrowError('Buffering interval must be between 60 and 900 seconds. Buffering interval provided was 960 seconds.');
    });

    it('validates bufferingSize', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(0),

        })],
      })).toThrowError('Buffering size must be between 1 and 128 MiBs. Buffering size provided was 0 MiBs');

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destinations: [new firehosedestinations.S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(256),
        })],
      })).toThrowError('Buffering size must be between 1 and 128 MiBs. Buffering size provided was 256 MiBs');
    });
  });

  describe('destination encryption', () => {
    it('creates configuration', () => {
      const key = new kms.Key(stack, 'Key');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, {
          encryptionKey: key,
          role: destinationRole,
        })],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          EncryptionConfiguration: {
            KMSEncryptionConfig: {
              AWSKMSKeyARN: stack.resolve(key.keyArn),
            },
          },
        },
      });
    });

    it('grants encrypt/decrypt access to the destination encryptionKey', () => {
      const key = new kms.Key(stack, 'Key');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, {
          encryptionKey: key,
          role: destinationRole,
        })],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: [
              'kms:Decrypt',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: stack.resolve(key.keyArn),
          }]),
        },
      });
    });
  });

  describe('s3 backup configuration', () => {
    it('set backupMode to ALL creates resources', () => {
      const destination = new firehosedestinations.S3Bucket(bucket, {
        role: destinationRole,
        s3Backup: {
          mode: firehosedestinations.BackupMode.ALL,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          S3BackupConfiguration: {
            CloudWatchLoggingOptions: {
              Enabled: true,
            },
            RoleARN: stack.resolve(destinationRole.roleArn),
          },
          S3BackupMode: 'Enabled',
        },
      });
    });

    it('sets backup configuration if backup bucket provided', () => {
      const backupBucket = new s3.Bucket(stack, 'MyBackupBucket');
      const destination = new firehosedestinations.S3Bucket(bucket, {
        role: destinationRole,
        s3Backup: {
          bucket: backupBucket,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          S3BackupConfiguration: {
            BucketARN: stack.resolve(backupBucket.bucketArn),
            CloudWatchLoggingOptions: {
              Enabled: true,
            },
            RoleARN: stack.resolve(destinationRole.roleArn),
          },
          S3BackupMode: 'Enabled',
        },
      });
    });

    it('throws error if backupMode set to FAILED', () => {
      expect(() => new firehosedestinations.S3Bucket(bucket, {
        role: destinationRole,
        s3Backup: {
          mode: firehosedestinations.BackupMode.FAILED,
        },
      })).toThrowError('S3 destinations do not support BackupMode.FAILED');
    });

    it('by default does not create resources', () => {
      const destination = new firehosedestinations.S3Bucket(bucket);
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          S3BackupConfiguration: Match.absent(),
        },
      });
    });

    it('sets full backup configuration', () => {
      const backupBucket = new s3.Bucket(stack, 'MyBackupBucket');
      const key = new kms.Key(stack, 'Key');
      const logGroup = new logs.LogGroup(stack, 'BackupLogGroup');
      const destination = new firehosedestinations.S3Bucket(bucket, {
        role: destinationRole,
        s3Backup: {
          mode: firehosedestinations.BackupMode.ALL,
          bucket: backupBucket,
          dataOutputPrefix: 'myBackupPrefix',
          errorOutputPrefix: 'myBackupErrorPrefix',
          bufferingSize: cdk.Size.mebibytes(1),
          bufferingInterval: cdk.Duration.minutes(1),
          compression: firehosedestinations.Compression.ZIP,
          encryptionKey: key,
          logging: true,
          logGroup: logGroup,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          S3BackupConfiguration: {
            BucketARN: stack.resolve(backupBucket.bucketArn),
            CloudWatchLoggingOptions: {
              Enabled: true,
              LogGroupName: stack.resolve(logGroup.logGroupName),
            },
            RoleARN: stack.resolve(destinationRole.roleArn),
            EncryptionConfiguration: {
              KMSEncryptionConfig: {
                AWSKMSKeyARN: stack.resolve(key.keyArn),
              },
            },
            Prefix: 'myBackupPrefix',
            ErrorOutputPrefix: 'myBackupErrorPrefix',
            BufferingHints: {},
            CompressionFormat: 'ZIP',
          },
          S3BackupMode: 'Enabled',
        },
      });
    });
  });
});

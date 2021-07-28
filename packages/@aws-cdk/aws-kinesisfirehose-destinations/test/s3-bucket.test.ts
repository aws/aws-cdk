import '@aws-cdk/assert-internal/jest';
import { ABSENT, MatchStyle, ResourcePart, anything, arrayWith } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as firehosedestinations from '../lib';
import { S3Bucket } from '../lib';

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

    expect(stack).toHaveResource('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        BucketARN: stack.resolve(bucket.bucketArn),
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: anything(),
          LogStreamName: anything(),
        },
        RoleARN: stack.resolve(destinationRole.roleArn),
      },
    });
    expect(stack).toHaveResource('AWS::Logs::LogGroup');
    expect(stack).toHaveResource('AWS::Logs::LogStream');
  });

  it('creates a role when none is provided', () => {

    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [new firehosedestinations.S3Bucket(bucket)],
    });

    expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        RoleARN: {
          'Fn::GetAtt': [
            'DeliveryStreamS3DestinationRoleD96B8345',
            'Arn',
          ],
        },
      },
    });
    expect(stack).toMatchTemplate({
      ['DeliveryStreamS3DestinationRoleD96B8345']: {
        Type: 'AWS::IAM::Role',
      },
    }, MatchStyle.SUPERSET);
  });

  it('grants read/write access to the bucket', () => {
    const destination = new firehosedestinations.S3Bucket(bucket, { role: destinationRole });

    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [destination],
    });

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      Roles: [stack.resolve(destinationRole.roleName)],
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject*',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              stack.resolve(bucket.bucketArn),
              { 'Fn::Join': ['', [stack.resolve(bucket.bucketArn), '/*']] },
            ],
          },
        ],
      },
    });
  });

  it('bucket and log group grants are depended on by delivery stream', () => {
    const logGroup = logs.LogGroup.fromLogGroupName(stack, 'Log Group', 'evergreen');
    const destination = new firehosedestinations.S3Bucket(bucket, { role: destinationRole, logGroup });
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [destination],
    });

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
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
              's3:PutObject*',
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
    expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
      DependsOn: ['DestinationRoleDefaultPolicy1185C75D'],
    }, ResourcePart.CompleteDefinition);
  });

  describe('logging', () => {
    it('creates resources and configuration by default', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket)],
      });

      expect(stack).toHaveResource('AWS::Logs::LogGroup');
      expect(stack).toHaveResource('AWS::Logs::LogStream');
      expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: anything(),
            LogStreamName: anything(),
          },
        },
      });
    });

    it('does not create resources or configuration if disabled', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, { logging: false })],
      });

      expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
      expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CloudWatchLoggingOptions: ABSENT,
        },
      });
    });

    it('uses provided log group', () => {
      const logGroup = new logs.LogGroup(stack, 'Log Group');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new firehosedestinations.S3Bucket(bucket, { logGroup })],
      });

      expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
      expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: stack.resolve(logGroup.logGroupName),
            LogStreamName: anything(),
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

      expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: arrayWith(
            {
              Action: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: stack.resolve(logGroup.logGroupArn),
            },
          ),
        },
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

      expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
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

      expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          CompressionFormat: 'SNAZZY',
        },
      });
    });
  });

  describe('buffering', () => {
    it('creates configuration when interval and size provided', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(1),
        })],
      });

      expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
        ExtendedS3DestinationConfiguration: {
          BufferingHints: {
            IntervalInSeconds: 60,
            SizeInMBs: 1,
          },
        },
      });
    });

    test('throws when only one of interval and size provided', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(1),
        })],
      })).toThrowError('If bufferingInterval is specified, bufferingSize must also be specified');

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destinations: [new S3Bucket(bucket, {
          bufferingSize: cdk.Size.mebibytes(1),
        })],
      })).toThrowError('If bufferingSize is specified, bufferingInterval must also be specified');
    });

    it('validates bufferingInterval', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.seconds(30),
          bufferingSize: cdk.Size.mebibytes(1),
        })],
      })).toThrowError('Buffering interval must be between 60 and 900 seconds');

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destinations: [new S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(16),
          bufferingSize: cdk.Size.mebibytes(1),
        })],
      })).toThrowError('Buffering interval must be between 60 and 900 seconds');
    });

    it('validates bufferingSize', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [new S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(0),

        })],
      })).toThrowError('Buffering size must be between 1 and 128 MBs');

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destinations: [new S3Bucket(bucket, {
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(256),
        })],
      })).toThrowError('Buffering size must be between 1 and 128 MBs');
    });
  });
});

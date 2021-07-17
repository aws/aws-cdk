import '@aws-cdk/assert-internal/jest';
import { ABSENT, anything } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as firehosedestinations from '../lib';

describe('S3 destination', () => {
  let stack: cdk.Stack;
  let bucket: s3.IBucket;
  let deliveryStreamRole: iam.IRole;

  beforeEach(() => {
    stack = new cdk.Stack();
    bucket = new s3.Bucket(stack, 'Bucket');
    deliveryStreamRole = new iam.Role(stack, 'Delivery Stream Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
  });

  it('provides defaults when no configuration is provided', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [new firehosedestinations.S3Bucket(bucket)],
      role: deliveryStreamRole,
    });

    expect(stack).toHaveResource('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        BucketARN: stack.resolve(bucket.bucketArn),
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: anything(),
          LogStreamName: anything(),
        },
        RoleARN: stack.resolve(deliveryStreamRole.roleArn),
      },
    });
    expect(stack).toHaveResource('AWS::Logs::LogGroup');
    expect(stack).toHaveResource('AWS::Logs::LogStream');
  });

  it('allows disabling logging', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [new firehosedestinations.S3Bucket(bucket, {
        logging: false,
      })],
      role: deliveryStreamRole,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        CloudWatchLoggingOptions: ABSENT,
      },
    });
  });

  it('allows providing a log group', () => {
    const logGroup = logs.LogGroup.fromLogGroupName(stack, 'Log Group', 'evergreen');

    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [new firehosedestinations.S3Bucket(bucket, {
        logGroup,
      })],
      role: deliveryStreamRole,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        CloudWatchLoggingOptions: {
          LogGroupName: 'evergreen',
        },
      },
    });
  });

  it('grants read/write access to the bucket', () => {
    const destination = new firehosedestinations.S3Bucket(bucket);

    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destinations: [destination],
      role: deliveryStreamRole,
    });

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      Roles: [stack.resolve(deliveryStreamRole.roleName)],
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
              {
                'Fn::Join': [
                  '',
                  [
                    stack.resolve(bucket.bucketArn),
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
      },
    });
  });
});

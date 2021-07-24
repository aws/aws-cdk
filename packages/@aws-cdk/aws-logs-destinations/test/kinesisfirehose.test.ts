import '@aws-cdk/assert-internal/jest';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as firehoseDestinations from '@aws-cdk/aws-kinesisfirehose-destinations';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as dests from '../lib';

test('firehose can be subscription destination', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');
  const deliveryStream = new firehose.DeliveryStream(stack, 'MyFirehose', {
    destinations: [new firehoseDestinations.S3Bucket(bucket)],
  });
  const logGroup = new logs.LogGroup(stack, 'LogGroup');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.KinesisFirehoseDestination(deliveryStream),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is firehose
  expect(stack).toHaveResource('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { 'Fn::GetAtt': ['MyFirehoseFCA2F9D3', 'Arn'] },
    RoleArn: { 'Fn::GetAtt': ['MyFirehoseCloudWatchLogsCanPutRecordsIntoKinesisFirehose30DECEBA', 'Arn'] },
  });

  // THEN: we have a role to write to the firehose
  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: {
            'Fn::Join': ['', [
              'logs.',
              { Ref: 'AWS::Region' },
              '.amazonaws.com',
            ]],
          },
        },
      }],
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: [
            'firehose:PutRecord',
            'firehose:PutRecordBatch',
          ],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['MyFirehoseFCA2F9D3', 'Arn'] },
        },
      ],
    },
  });
});

test('firehose can be subscription destination twice, without duplicating permissions', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');
  const deliveryStream = new firehose.DeliveryStream(stack, 'MyFirehose', {
    destinations: [new firehoseDestinations.S3Bucket(bucket)],
  });
  const firehoseDestination = new dests.KinesisFirehoseDestination(deliveryStream);
  const logGroup1 = new logs.LogGroup(stack, 'LogGroup1');
  const logGroup2 = new logs.LogGroup(stack, 'LogGroup2');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription1', {
    logGroup: logGroup1,
    destination: firehoseDestination,
    filterPattern: logs.FilterPattern.allEvents(),
  });
  new logs.SubscriptionFilter(stack, 'Subscription2', {
    logGroup: logGroup2,
    destination: firehoseDestination,
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is firehose
  expect(stack).toHaveResource('AWS::Logs::SubscriptionFilter', {
    LogGroupName: { Ref: 'LogGroup106AAD846' },
    DestinationArn: { 'Fn::GetAtt': ['MyFirehoseFCA2F9D3', 'Arn'] },
    RoleArn: { 'Fn::GetAtt': ['MyFirehoseCloudWatchLogsCanPutRecordsIntoKinesisFirehose30DECEBA', 'Arn'] },
  });
  expect(stack).toHaveResource('AWS::Logs::SubscriptionFilter', {
    LogGroupName: { Ref: 'LogGroup2477F707C' },
    DestinationArn: { 'Fn::GetAtt': ['MyFirehoseFCA2F9D3', 'Arn'] },
    RoleArn: { 'Fn::GetAtt': ['MyFirehoseCloudWatchLogsCanPutRecordsIntoKinesisFirehose30DECEBA', 'Arn'] },
  });

  // THEN: we have a single role to write to the Firehose
  expect(stack).toCountResources('AWS::IAM::Role', 1
    + 1 /* for FirehoseServiceRole */
    + 1, /* for FirehoseS3DestinationRole */
  );
  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: {
            'Fn::Join': ['', [
              'logs.',
              { Ref: 'AWS::Region' },
              '.amazonaws.com',
            ]],
          },
        },
      }],
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: [
            'firehose:PutRecord',
            'firehose:PutRecordBatch',
          ],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['MyFirehoseFCA2F9D3', 'Arn'] },
        },
      ],
    },
  });
});

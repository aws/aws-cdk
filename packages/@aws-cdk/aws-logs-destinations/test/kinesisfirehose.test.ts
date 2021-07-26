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
    RoleArn: { 'Fn::GetAtt': ['SubscriptionCloudWatchLogsCanPutRecordsIntoKinesisFirehoseC45D3D89', 'Arn'] },
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

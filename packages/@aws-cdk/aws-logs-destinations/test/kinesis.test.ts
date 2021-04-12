import '@aws-cdk/assert-internal/jest';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as dests from '../lib';

test('stream can be subscription destination', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const stream = new kinesis.Stream(stack, 'MyStream');
  const logGroup = new logs.LogGroup(stack, 'LogGroup');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.KinesisDestination(stream),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is Stream
  expect(stack).toHaveResource('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
    RoleArn: { 'Fn::GetAtt': ['SubscriptionCloudWatchLogsCanPutRecords9C1223EC', 'Arn'] },
  });

  // THEN: we have a role to write to the Stream
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
              '.',
              { Ref: 'AWS::URLSuffix' },
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
            'kinesis:ListShards',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
        },
        {
          Action: 'iam:PassRole',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['SubscriptionCloudWatchLogsCanPutRecords9C1223EC', 'Arn'] },
        },
      ],
    },
  });
});

test('stream can be subscription destination twice, without duplicating permissions', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const stream = new kinesis.Stream(stack, 'MyStream');
  const logGroup1 = new logs.LogGroup(stack, 'LogGroup');
  const logGroup2 = new logs.LogGroup(stack, 'LogGroup2');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup: logGroup1,
    destination: new dests.KinesisDestination(stream),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  new logs.SubscriptionFilter(stack, 'Subscription2', {
    logGroup: logGroup2,
    destination: new dests.KinesisDestination(stream),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is Stream
  expect(stack).toHaveResource('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
    RoleArn: { 'Fn::GetAtt': ['SubscriptionCloudWatchLogsCanPutRecords9C1223EC', 'Arn'] },
  });

  // THEN: we have a role to write to the Stream
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
              '.',
              { Ref: 'AWS::URLSuffix' },
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
            'kinesis:ListShards',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
        },
        {
          Action: 'iam:PassRole',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['SubscriptionCloudWatchLogsCanPutRecords9C1223EC', 'Arn'] },
        },
      ],
    },
  });
});

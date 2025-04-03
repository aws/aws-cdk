import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as firehose from '../../aws-kinesisfirehose';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as dests from '../lib';

test('stream can be subscription destination', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const stream = new firehose.DeliveryStream(stack, 'MyStream', { destination: new firehose.S3Bucket(bucket) });
  const logGroup = new logs.LogGroup(stack, 'LogGroup');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.FirehoseDestination(stream),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is Stream
  Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
    RoleArn: { 'Fn::GetAtt': ['SubscriptionCloudWatchLogsCanPutRecords9C1223EC', 'Arn'] },
  });

  // THEN: we have a role to write to the Stream
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: 'logs.amazonaws.com',
        },
        Condition: {
          StringLike: {
            'aws:SourceArn': { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':logs:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':*']] },
          },
        },
      }],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
        },
      ],
    },
  });
});

test('stream can be subscription destination twice, without duplicating permissions', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const stream = new firehose.DeliveryStream(stack, 'MyStream', { destination: new firehose.S3Bucket(bucket) });
  const logGroup1 = new logs.LogGroup(stack, 'LogGroup');
  const logGroup2 = new logs.LogGroup(stack, 'LogGroup2');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup: logGroup1,
    destination: new dests.FirehoseDestination(stream),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  new logs.SubscriptionFilter(stack, 'Subscription2', {
    logGroup: logGroup2,
    destination: new dests.FirehoseDestination(stream),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is Stream
  Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
    RoleArn: { 'Fn::GetAtt': ['SubscriptionCloudWatchLogsCanPutRecords9C1223EC', 'Arn'] },
  });

  // THEN: we have a role to write to the Stream
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: 'logs.amazonaws.com',
        },
        Condition: {
          StringLike: {
            'aws:SourceArn': { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':logs:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':*']] },
          },
        },
      }],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
        },
      ],
    },
  });
});

test('an existing IAM role can be passed to new destination instance instead of auto-created', ()=> {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const stream = new firehose.DeliveryStream(stack, 'MyStream', { destination: new firehose.S3Bucket(bucket) });
  const logGroup = new logs.LogGroup(stack, 'LogGroup');

  const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/ImportedRoleFirehoseDestinationTest');

  const firehoseDestination = new dests.FirehoseDestination(stream, { role: importedRole });

  new logs.SubscriptionFilter(logGroup, 'MySubscriptionFilter', {
    logGroup: logGroup,
    destination: firehoseDestination,
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.hasResourceProperties('AWS::Logs::SubscriptionFilter', {
    RoleArn: importedRole.roleArn,
  });
});

test('creates a new IAM Role if not passed on new destination instance', ()=> {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const stream = new firehose.DeliveryStream(stack, 'MyStream', { destination: new firehose.S3Bucket(bucket) });
  const logGroup = new logs.LogGroup(stack, 'LogGroup');

  const firehoseDestination = new dests.FirehoseDestination(stream);

  new logs.SubscriptionFilter(logGroup, 'MySubscriptionFilter', {
    logGroup: logGroup,
    destination: firehoseDestination,
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::IAM::Role', 2);
  template.hasResourceProperties('AWS::Logs::SubscriptionFilter', {
    RoleArn: {
      'Fn::GetAtt': [
        'LogGroupMySubscriptionFilterCloudWatchLogsCanPutRecords9112BD02',
        'Arn',
      ],
    },
  });

  // THEN: SubscriptionFilter depends on the default Role's Policy
  template.hasResource('AWS::Logs::SubscriptionFilter', {
    DependsOn: ['LogGroupMySubscriptionFilterCloudWatchLogsCanPutRecordsDefaultPolicyEC6729D5'],
  });
});

import { Template, Match } from '../../assertions';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import {
  Delivery,
  DeliveryDestination,
  DeliveryDestinationTarget,
  DeliverySource,
  LogGroup,
  LogType,
} from '../lib';

const ACCOUNT = '123456789012';
const REGION = 'us-east-1';

function makeStack() {
  return new cdk.Stack(undefined, 'Stack', {
    env: { account: ACCOUNT, region: REGION },
  });
}

describe('Delivery', () => {
  test('creates AWS::Logs::Delivery with source name and destination ARN', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = new DeliverySource(stack, 'Source', {
      deliverySourceName: 'my-source',
      resourceArn: `arn:aws:eks:${REGION}:${ACCOUNT}:cluster/my-cluster`,
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });
    const dest = new DeliveryDestination(stack, 'Dest', {
      deliveryDestinationName: 'my-dest',
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    new Delivery(stack, 'Delivery', { source, destination: dest });

    // DeliverySourceName resolves to CFN Ref (getResourceNameAttribute returns a token)
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      DeliverySourceName: Match.anyValue(),
      DeliveryDestinationArn: {
        'Fn::GetAtt': [Match.stringLikeRegexp('Dest'), 'Arn'],
      },
    });
  });

  test('automatically grants write on S3 destination when constructing Delivery', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = new DeliverySource(stack, 'Source', {
      deliverySourceName: 'my-source',
      resourceArn: `arn:aws:eks:${REGION}:${ACCOUNT}:cluster/my-cluster`,
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    new Delivery(stack, 'Delivery', { source, destination: dest });

    // grantWrite was called automatically — bucket policy should exist with s3:PutObject
    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({ Action: 's3:PutObject' }),
        ]),
      }),
    });
  });

  test('automatically grants write on CloudWatch Logs destination when constructing Delivery', () => {
    const stack = makeStack();
    const logGroup = new LogGroup(stack, 'LogGroup', { logGroupName: 'my-log-group' });
    const source = new DeliverySource(stack, 'Source', {
      deliverySourceName: 'my-source',
      resourceArn: `arn:aws:eks:${REGION}:${ACCOUNT}:cluster/my-cluster`,
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromLogGroup(logGroup),
    });

    new Delivery(stack, 'Delivery', { source, destination: dest });

    // PolicyDocument contains tokens so it renders as Fn::Join rather than a literal JSON string.
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
      PolicyDocument: Match.objectLike({ 'Fn::Join': Match.anyValue() }),
    });
  });

  test('sets optional S3 fields when provided', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = new DeliverySource(stack, 'Source', {
      resourceArn: `arn:aws:eks:${REGION}:${ACCOUNT}:cluster/my-cluster`,
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    new Delivery(stack, 'Delivery', {
      source,
      destination: dest,
      s3EnableHiveCompatiblePath: true,
      s3SuffixPath: 'year=!{timestamp:yyyy}/month=!{timestamp:MM}',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      S3EnableHiveCompatiblePath: true,
      S3SuffixPath: 'year=!{timestamp:yyyy}/month=!{timestamp:MM}',
    });
  });

  test('sets optional record fields when provided', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = new DeliverySource(stack, 'Source', {
      resourceArn: `arn:aws:eks:${REGION}:${ACCOUNT}:cluster/my-cluster`,
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    new Delivery(stack, 'Delivery', {
      source,
      destination: dest,
      fieldDelimiter: '\t',
      recordFields: ['timestamp', 'message', 'severity'],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      FieldDelimiter: '\t',
      RecordFields: ['timestamp', 'message', 'severity'],
    });
  });

  test('optional fields are absent when not provided', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = new DeliverySource(stack, 'Source', {
      resourceArn: `arn:aws:eks:${REGION}:${ACCOUNT}:cluster/my-cluster`,
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    new Delivery(stack, 'Delivery', { source, destination: dest });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      FieldDelimiter: Match.absent(),
      RecordFields: Match.absent(),
      S3EnableHiveCompatiblePath: Match.absent(),
      S3SuffixPath: Match.absent(),
    });
  });

  test('deliveryArn and deliveryId attributes resolve to CFN GetAtt', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = new DeliverySource(stack, 'Source', {
      resourceArn: `arn:aws:eks:${REGION}:${ACCOUNT}:cluster/my-cluster`,
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    const delivery = new Delivery(stack, 'Delivery', { source, destination: dest });

    expect(stack.resolve(delivery.deliveryArn)).toEqual({
      'Fn::GetAtt': [expect.stringContaining('Delivery'), 'Arn'],
    });
    expect(stack.resolve(delivery.deliveryId)).toEqual({
      'Fn::GetAtt': [expect.stringContaining('Delivery'), 'DeliveryId'],
    });
  });
});

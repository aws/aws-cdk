import { Template, Match } from '../../assertions';
import * as firehose from '../../aws-kinesisfirehose';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import {
  DeliveryDestination,
  DeliveryDestinationTarget,
  DeliverySource,
  LogGroup,
  LogType,
  OutputFormat,
} from '../lib';

const ACCOUNT = '123456789012';
const REGION = 'us-east-1';

function makeStack() {
  return new cdk.Stack(undefined, 'Stack', {
    env: { account: ACCOUNT, region: REGION },
  });
}

function makeSource(stack: cdk.Stack) {
  return DeliverySource.fromDeliverySourceArn(
    stack,
    'Source',
    `arn:aws:logs:${REGION}:${ACCOUNT}:delivery-source:my-source`,
  );
}

describe('DeliveryDestination — S3 target', () => {
  test('creates AWS::Logs::DeliveryDestination with bucket ARN', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');

    new DeliveryDestination(stack, 'Dest', {
      deliveryDestinationName: 'my-dest',
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      Name: 'my-dest',
      DestinationResourceArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('Bucket'), 'Arn'] },
    });
  });

  test('sets OutputFormat when provided', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');

    new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket, OutputFormat.PARQUET),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      OutputFormat: 'parquet',
    });
  });

  test('grantWrite adds s3:GetBucketAcl and s3:ListBucket on bucket ARN', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = makeSource(stack);
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    dest.grantWrite(source);

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['s3:GetBucketAcl', 's3:ListBucket']),
            Principal: { Service: 'delivery.logs.amazonaws.com' },
            Effect: 'Allow',
            Condition: Match.objectLike({
              StringEquals: { 'aws:SourceAccount': ACCOUNT },
            }),
          }),
        ]),
      }),
    });
  });

  test('grantWrite adds s3:PutObject on objects with AWSLogs prefix', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = makeSource(stack);
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    dest.grantWrite(source);

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 's3:PutObject',
            Principal: { Service: 'delivery.logs.amazonaws.com' },
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': [Match.stringLikeRegexp('Bucket'), 'Arn'] }, `/AWSLogs/${ACCOUNT}/*`]],
            },
            Condition: Match.objectLike({
              StringEquals: Match.objectLike({
                's3:x-amz-acl': 'bucket-owner-full-control',
              }),
            }),
          }),
        ]),
      }),
    });
  });
});

describe('DeliveryDestination — CloudWatch Logs target', () => {
  test('creates AWS::Logs::DeliveryDestination with log group ARN', () => {
    const stack = makeStack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromLogGroup(logGroup),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DestinationResourceArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('LogGroup'), 'Arn'] },
    });
  });

  test('sets OutputFormat when provided', () => {
    const stack = makeStack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromLogGroup(logGroup, OutputFormat.JSON),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      OutputFormat: 'json',
    });
  });

  test('grantWrite creates AWS::Logs::ResourcePolicy with CreateLogStream and PutLogEvents', () => {
    const stack = makeStack();
    const logGroup = new LogGroup(stack, 'LogGroup', { logGroupName: 'my-log-group' });
    const source = makeSource(stack);
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromLogGroup(logGroup),
    });

    dest.grantWrite(source);

    // PolicyDocument contains tokens (logGroupName resolves via CFN Ref),
    // so it renders as Fn::Join rather than a literal JSON string.
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
      PolicyDocument: Match.objectLike({ 'Fn::Join': Match.anyValue() }),
    });
  });
});

describe('DeliveryDestination — Firehose target', () => {
  test('creates AWS::Logs::DeliveryDestination with stream ARN', () => {
    const stack = makeStack();
    const stream = firehose.DeliveryStream.fromDeliveryStreamArn(
      stack,
      'Stream',
      `arn:aws:firehose:${REGION}:${ACCOUNT}:deliverystream/my-stream`,
    );

    new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromDeliveryStream(stream),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DestinationResourceArn: `arn:aws:firehose:${REGION}:${ACCOUNT}:deliverystream/my-stream`,
    });
  });

  test('grantWrite is a no-op for Firehose (no S3 or resource policy created)', () => {
    const stack = makeStack();
    const stream = firehose.DeliveryStream.fromDeliveryStreamArn(
      stack,
      'Stream',
      `arn:aws:firehose:${REGION}:${ACCOUNT}:deliverystream/my-stream`,
    );
    const source = makeSource(stack);
    const dest = new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromDeliveryStream(stream),
    });

    dest.grantWrite(source);

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 0);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 0);
  });
});

describe('DeliveryDestination — cross-account policy', () => {
  test('addToDeliveryDestinationPolicy adds statement to DeliveryDestinationPolicy', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const dest = new DeliveryDestination(stack, 'Dest', {
      deliveryDestinationName: 'my-dest',
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    dest.addToDeliveryDestinationPolicy(new iam.PolicyStatement({
      principals: [new iam.AccountPrincipal('999999999999')],
      actions: ['logs:CreateDelivery'],
      resources: ['*'],
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationPolicy: Match.objectLike({
        DeliveryDestinationName: 'my-dest',
        DeliveryDestinationPolicy: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'logs:CreateDelivery',
              Effect: 'Allow',
            }),
          ]),
        }),
      }),
    });
  });

  test('DeliveryDestinationPolicy is absent when no statements added', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');

    new DeliveryDestination(stack, 'Dest', {
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationPolicy: Match.absent(),
    });
  });

  test('multiple calls accumulate all statements', () => {
    const stack = makeStack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const dest = new DeliveryDestination(stack, 'Dest', {
      deliveryDestinationName: 'my-dest',
      target: DeliveryDestinationTarget.fromBucket(bucket),
    });

    dest.addToDeliveryDestinationPolicy(new iam.PolicyStatement({
      principals: [new iam.AccountPrincipal('111111111111')],
      actions: ['logs:CreateDelivery'],
      resources: ['*'],
    }));
    dest.addToDeliveryDestinationPolicy(new iam.PolicyStatement({
      principals: [new iam.AccountPrincipal('222222222222')],
      actions: ['logs:CreateDelivery'],
      resources: ['*'],
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationPolicy: Match.objectLike({
        DeliveryDestinationPolicy: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({ Action: 'logs:CreateDelivery', Effect: 'Allow' }),
            Match.objectLike({ Action: 'logs:CreateDelivery', Effect: 'Allow' }),
          ]),
        }),
      }),
    });
  });
});

describe('DeliveryDestination — import methods', () => {
  test('fromDeliveryDestinationArn returns correct ref', () => {
    const stack = makeStack();
    const arn = `arn:aws:logs:${REGION}:${ACCOUNT}:delivery-destination:my-dest`;

    const dest = DeliveryDestination.fromDeliveryDestinationArn(stack, 'Dest', arn);

    expect(dest.deliveryDestinationRef.deliveryDestinationName).toEqual('my-dest');
    expect(dest.deliveryDestinationRef.deliveryDestinationArn).toEqual(arn);
  });

  test('fromDeliveryDestinationName returns correct ref', () => {
    const stack = makeStack();

    const dest = DeliveryDestination.fromDeliveryDestinationName(stack, 'Dest', 'my-dest');

    expect(dest.deliveryDestinationRef.deliveryDestinationName).toEqual('my-dest');
    expect(dest.deliveryDestinationRef.deliveryDestinationArn).toContain('delivery-destination:my-dest');
  });

  test('grantWrite on imported destination is a no-op', () => {
    const stack = makeStack();
    const source = makeSource(stack);
    const dest = DeliveryDestination.fromDeliveryDestinationName(stack, 'Dest', 'my-dest');

    dest.grantWrite(source);

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 0);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 0);
  });
});

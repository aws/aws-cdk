import { Construct } from 'constructs';
import { Template } from '../../assertions';
import * as kms from '../../aws-kms';
import * as cdk from '../../core';
import * as s3 from '../lib';
import { BucketEncryption } from '../lib/mixins';

describe('BucketEncryption Mixin', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack(new cdk.App(), 'TestStack');
  });

  test('supports CfnBucket', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    const mixin = new BucketEncryption({
      serverSideEncryptionByDefault: { sseAlgorithm: BucketEncryption.SSEAlgorithm.AES256 },
    });

    expect(mixin.supports(bucket)).toBe(true);
  });

  test('does not support non-S3 constructs', () => {
    const construct = new Construct(stack, 'Other');
    const mixin = new BucketEncryption({
      serverSideEncryptionByDefault: { sseAlgorithm: BucketEncryption.SSEAlgorithm.AES256 },
    });

    expect(mixin.supports(construct)).toBe(false);
  });

  test('applies AES256 encryption to L1 bucket', () => {
    new s3.CfnBucket(stack, 'Bucket').with(
      new BucketEncryption({
        serverSideEncryptionByDefault: { sseAlgorithm: BucketEncryption.SSEAlgorithm.AES256 },
      }),
    );

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' },
        }],
      },
    });
  });

  test('applies KMS encryption with string key ID', () => {
    new s3.CfnBucket(stack, 'Bucket').with(
      new BucketEncryption({
        serverSideEncryptionByDefault: {
          sseAlgorithm: BucketEncryption.SSEAlgorithm.AWS_KMS,
          kmsMasterKeyId: 'arn:aws:kms:us-east-1:123456789012:key/my-key-id',
        },
      }),
    );

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'aws:kms',
            KMSMasterKeyID: 'arn:aws:kms:us-east-1:123456789012:key/my-key-id',
          },
        }],
      },
    });
  });

  test('applies KMS encryption with IKeyRef', () => {
    const key = new kms.Key(stack, 'Key');

    new s3.CfnBucket(stack, 'Bucket').with(
      new BucketEncryption({
        serverSideEncryptionByDefault: {
          sseAlgorithm: BucketEncryption.SSEAlgorithm.AWS_KMS,
          kmsMasterKeyId: key,
        },
      }),
    );

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'aws:kms',
            KMSMasterKeyID: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
          },
        }],
      },
    });
  });

  test('applies with bucket key enabled', () => {
    new s3.CfnBucket(stack, 'Bucket').with(
      new BucketEncryption({
        serverSideEncryptionByDefault: { sseAlgorithm: BucketEncryption.SSEAlgorithm.AWS_KMS },
        bucketKeyEnabled: true,
      }),
    );

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: { SSEAlgorithm: 'aws:kms' },
          BucketKeyEnabled: true,
        }],
      },
    });
  });

  test('applies to L2 bucket via .with()', () => {
    new s3.Bucket(stack, 'Bucket').with(
      new BucketEncryption({
        serverSideEncryptionByDefault: { sseAlgorithm: BucketEncryption.SSEAlgorithm.AES256 },
      }),
    );

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' },
        }],
      },
    });
  });

  test('enum values are correct', () => {
    expect(BucketEncryption.SSEAlgorithm.AES256).toBe('AES256');
    expect(BucketEncryption.SSEAlgorithm.AWS_KMS).toBe('aws:kms');
    expect(BucketEncryption.SSEAlgorithm.AWS_KMS_DSSE).toBe('aws:kms:dsse');
  });

  test('EncryptionType enum values are correct', () => {
    expect(BucketEncryption.EncryptionType.NONE).toBe('NONE');
    expect(BucketEncryption.EncryptionType.SSE_C).toBe('SSE-C');
  });
});

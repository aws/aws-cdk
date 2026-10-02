import { Match, Template } from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';

/* eslint-disable @stylistic/quote-props */

const VECTOR_BUCKET_CFN_RESOURCE = 'AWS::S3Vectors::VectorBucket';
const KMS_KEY_CFN_RESOURCE = 'AWS::KMS::Key';
const VECTOR_BUCKET_NAME = 'example-vector-bucket';

describe('VectorBucket with encryption', () => {
  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  describe('with encryption undefined and no encryptionKey', () => {
    beforeEach(() => {
      new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
      });
    });

    test(`creates a ${VECTOR_BUCKET_CFN_RESOURCE} resource without encryption`, () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'VectorBucketName': VECTOR_BUCKET_NAME,
      });
      const resources = Template.fromStack(stack).findResources(VECTOR_BUCKET_CFN_RESOURCE);
      const key = Object.keys(resources)[0];
      expect(resources[key].Properties.EncryptionConfiguration).toBeUndefined();
    });
  });

  describe('with encryption undefined and a user-provided encryptionKey', () => {
    const keyName = 'ExampleKey469AF2A8';

    beforeEach(() => {
      const userKey = new kms.Key(stack, 'ExampleKey', {});
      new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    test('sets sseType aws:kms and the provided key ARN', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'EncryptionConfiguration': {
          'KmsKeyArn': { 'Fn::GetAtt': [keyName, 'Arn'] },
          'SseType': 'aws:kms',
        },
      });
    });
  });

  describe('with encryption KMS and no encryptionKey', () => {
    beforeEach(() => {
      new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    test(`creates a ${VECTOR_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_CFN_RESOURCE, 1);
    });

    test(`creates a ${KMS_KEY_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(KMS_KEY_CFN_RESOURCE, 1);
    });

    test('sets sseType aws:kms and a generated key ARN', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'EncryptionConfiguration': {
          'SseType': 'aws:kms',
        },
      });
    });

    test('grants kms:Decrypt to the indexing.s3vectors service principal', () => {
      Template.fromStack(stack).hasResourceProperties(KMS_KEY_CFN_RESOURCE, {
        'KeyPolicy': {
          'Statement': Match.arrayWith([
            Match.objectLike({
              'Action': 'kms:Decrypt',
              'Effect': 'Allow',
              'Principal': { 'Service': 'indexing.s3vectors.amazonaws.com' },
              'Condition': Match.objectLike({
                'ArnLike': {
                  'aws:SourceArn': {
                    'Fn::Join': ['', Match.arrayWith([':s3vectors:'])],
                  },
                },
                'StringEquals': { 'aws:SourceAccount': { 'Ref': 'AWS::AccountId' } },
                'ForAnyValue:StringEquals': {
                  'kms:EncryptionContextKeys': ['aws:s3vectors:arn', 'aws:s3vectors:resource-id'],
                },
              }),
            }),
          ]),
        },
      });
    });
  });

  describe('with encryption KMS and user-provided encryptionKey', () => {
    const keyName = 'ExampleKey469AF2A8';

    beforeEach(() => {
      const userKey = new kms.Key(stack, 'ExampleKey', {});
      new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    test('sets sseType aws:kms and the provided key ARN', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'EncryptionConfiguration': {
          'KmsKeyArn': { 'Fn::GetAtt': [keyName, 'Arn'] },
          'SseType': 'aws:kms',
        },
      });
    });

    test('does not create a new KMS key', () => {
      Template.fromStack(stack).resourceCountIs(KMS_KEY_CFN_RESOURCE, 1);
    });
  });

  describe('with encryption S3_MANAGED and no encryptionKey', () => {
    beforeEach(() => {
      new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    test('sets sseType AES256', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'EncryptionConfiguration': {
          'SseType': 'AES256',
        },
      });
    });

    test('does not create a KMS key', () => {
      Template.fromStack(stack).resourceCountIs(KMS_KEY_CFN_RESOURCE, 0);
    });
  });

  describe('with encryption S3_MANAGED and user-provided encryptionKey', () => {
    test('throws a validation error in the constructor', () => {
      const userKey = new kms.Key(stack, 'ExampleKey', {});
      expect(() => new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      })).toThrow(/Expected encryption = `KMS`/);
    });
  });
});

/**
 * Unit tests for AWS S3 encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::S3::Bucket
 */

import { CfnBucket } from 'aws-cdk-lib/aws-s3';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnBucketEncryptionAtRestMixin } from '../../../lib/services/aws-s3/encryption-at-rest-mixins.generated';

describe('CfnBucketEncryptionAtRestMixin', () => {
  test('supports CfnBucket', () => {
    const { stack } = createTestContext();
    const resource = new CfnBucket(stack, 'Resource', {});
    const mixin = new CfnBucketEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnBucketEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses SSE-KMS with AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnBucket(stack, 'Resource', {});
    const mixin = new CfnBucketEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // S3 sets SSEAlgorithm to aws:kms even without a customer key
    template().hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'AES256',
          },
        }],
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnBucket(stack, 'Resource', {});
    const mixin = new CfnBucketEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'aws:kms',
            KMSMasterKeyID: {
              'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
            },
          },
        }],
      },
    });
  });
});

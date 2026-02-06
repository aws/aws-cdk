/**
 * Unit tests for AWS S3Tables encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::S3Tables::TableBucket
 */

import { CfnTableBucket } from 'aws-cdk-lib/aws-s3tables';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnTableBucketEncryptionAtRestMixin } from '../../../lib/services/aws-s3tables/encryption-at-rest-mixins.generated';

describe('CfnTableBucketEncryptionAtRestMixin', () => {
  test('supports CfnTableBucket', () => {
    const { stack } = createTestContext();
    const resource = new CfnTableBucket(stack, 'Resource', {
      tableBucketName: 'test-table-bucket',
    });
    const mixin = new CfnTableBucketEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnTableBucketEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnTableBucket(stack, 'Resource', {
      tableBucketName: 'test-table-bucket',
    });
    const mixin = new CfnTableBucketEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without a customer KMS key, S3Tables defaults to AES256 (SSE-S3)
    template().hasResourceProperties('AWS::S3Tables::TableBucket', {
      EncryptionConfiguration: {
        SSEAlgorithm: 'AES256',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnTableBucket(stack, 'Resource', {
      tableBucketName: 'test-table-bucket',
    });
    const mixin = new CfnTableBucketEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::S3Tables::TableBucket', {
      EncryptionConfiguration: {
        SSEAlgorithm: 'aws:kms',
        KMSKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

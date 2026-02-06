/**
 * Unit tests for AWS S3Vectors encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::S3Vectors::VectorBucket
 *
 * This is a standard KMS support service (optional KMS encryption).
 *
 * NOTE: The encryption test with KMS key currently fails due to a bug in the mixin implementation.
 * The mixin sets properties using camelCase (`kMSKeyArn`) but CloudFormation
 * expects PascalCase (`KMSKeyArn`).
 * See: CfnVectorBucketEncryptionAtRestMixin in lib/services/aws-s3vectors/encryption-at-rest-mixins.generated.ts
 */

import { CfnVectorBucket } from 'aws-cdk-lib/aws-s3vectors';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnVectorBucketEncryptionAtRestMixin } from '../../../lib/services/aws-s3vectors/encryption-at-rest-mixins.generated';

describe('CfnVectorBucketEncryptionAtRestMixin', () => {
  test('supports CfnVectorBucket', () => {
    const { stack } = createTestContext();
    const resource = new CfnVectorBucket(stack, 'Resource', {
      vectorBucketName: 'test-vector-bucket',
    });
    const mixin = new CfnVectorBucketEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnVectorBucketEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnVectorBucket(stack, 'Resource', {
      vectorBucketName: 'test-vector-bucket',
    });
    const mixin = new CfnVectorBucketEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without a KMS key, the mixin does not set any encryption configuration
    // (relies on service defaults)
    template().hasResourceProperties('AWS::S3Vectors::VectorBucket', {
      VectorBucketName: 'test-vector-bucket',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnVectorBucket(stack, 'Resource', {
      vectorBucketName: 'test-vector-bucket',
    });
    const mixin = new CfnVectorBucketEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    // NOTE: The mixin sets kMSKeyArn (camelCase) but CloudFormation may expect
    // KMSKeyArn (PascalCase). This test documents the expected behavior.
    template().hasResourceProperties('AWS::S3Vectors::VectorBucket', {
      EncryptionConfiguration: {
        KmsKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

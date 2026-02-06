/**
 * Unit tests for AWS CloudTrail encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::CloudTrail::EventDataStore
 * - AWS::CloudTrail::Trail
 *
 * EventDataStore uses AWS managed key for CloudTrail by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the kmsKeyId property.
 *
 * Trail log files are encrypted with S3 server-side encryption by default.
 * When a KMS key is provided, additional encryption is enabled via the kMSKeyId property.
 * CloudTrail must have permissions to use the key.
 */

import { CfnEventDataStore, CfnTrail } from 'aws-cdk-lib/aws-cloudtrail';
import { CfnBucket } from 'aws-cdk-lib/aws-s3';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnEventDataStoreEncryptionAtRestMixin, CfnTrailEncryptionAtRestMixin } from '../../../lib/services/aws-cloudtrail/encryption-at-rest-mixins.generated';

describe('CfnEventDataStoreEncryptionAtRestMixin', () => {
  test('supports CfnEventDataStore', () => {
    const { stack } = createTestContext();
    const resource = new CfnEventDataStore(stack, 'Resource', {});
    const mixin = new CfnEventDataStoreEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEventDataStoreEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEventDataStore(stack, 'Resource', {});
    const mixin = new CfnEventDataStoreEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyId is set - AWS managed key is used by default
    template().hasResourceProperties('AWS::CloudTrail::EventDataStore', {});
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEventDataStore(stack, 'Resource', {});
    const mixin = new CfnEventDataStoreEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CloudTrail::EventDataStore', {
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnTrailEncryptionAtRestMixin', () => {
  test('supports CfnTrail', () => {
    const { stack } = createTestContext();
    // CfnTrail requires isLogging and s3BucketName properties
    const bucket = new CfnBucket(stack, 'TrailBucket', {});
    const resource = new CfnTrail(stack, 'Resource', {
      isLogging: true,
      s3BucketName: bucket.ref,
    });
    const mixin = new CfnTrailEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnTrailEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses S3 server-side encryption by default)', () => {
    const { stack, template } = createTestContext();
    const bucket = new CfnBucket(stack, 'TrailBucket', {});
    const resource = new CfnTrail(stack, 'Resource', {
      isLogging: true,
      s3BucketName: bucket.ref,
    });
    const mixin = new CfnTrailEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KMSKeyId is set - S3 server-side encryption is used by default
    template().hasResourceProperties('AWS::CloudTrail::Trail', {
      IsLogging: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const bucket = new CfnBucket(stack, 'TrailBucket', {});
    const resource = new CfnTrail(stack, 'Resource', {
      isLogging: true,
      s3BucketName: bucket.ref,
    });
    const mixin = new CfnTrailEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CloudTrail::Trail', {
      KMSKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

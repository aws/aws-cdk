/**
 * Unit tests for AWS S3Express encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::S3Express::DirectoryBucket
 */

import { CfnDirectoryBucket } from 'aws-cdk-lib/aws-s3express';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDirectoryBucketEncryptionAtRestMixin } from '../../../lib/services/aws-s3express/encryption-at-rest-mixins.generated';

describe('CfnDirectoryBucketEncryptionAtRestMixin', () => {
  test('supports CfnDirectoryBucket', () => {
    const { stack } = createTestContext();
    const resource = new CfnDirectoryBucket(stack, 'Resource', {
      dataRedundancy: 'SingleAvailabilityZone',
      locationName: 'us-east-1--use1-az1',
    });
    const mixin = new CfnDirectoryBucketEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDirectoryBucketEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDirectoryBucket(stack, 'Resource', {
      dataRedundancy: 'SingleAvailabilityZone',
      locationName: 'us-east-1--use1-az1',
    });
    const mixin = new CfnDirectoryBucketEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::S3Express::DirectoryBucket', {
      DataRedundancy: 'SingleAvailabilityZone',
      LocationName: 'us-east-1--use1-az1',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDirectoryBucket(stack, 'Resource', {
      dataRedundancy: 'SingleAvailabilityZone',
      locationName: 'us-east-1--use1-az1',
    });
    const mixin = new CfnDirectoryBucketEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::S3Express::DirectoryBucket', {
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

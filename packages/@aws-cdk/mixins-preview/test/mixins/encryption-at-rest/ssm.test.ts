/**
 * Unit tests for AWS SSM encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::SSM::ResourceDataSync
 *
 * SSM ResourceDataSync supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kMSKeyArn property.
 */

import { CfnResourceDataSync } from 'aws-cdk-lib/aws-ssm';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnResourceDataSyncEncryptionAtRestMixin } from '../../../lib/services/aws-ssm/encryption-at-rest-mixins.generated';

describe('CfnResourceDataSyncEncryptionAtRestMixin', () => {
  test('supports CfnResourceDataSync', () => {
    const { stack } = createTestContext();
    const resource = new CfnResourceDataSync(stack, 'Resource', {
      syncName: 'test-sync',
    });
    const mixin = new CfnResourceDataSyncEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnResourceDataSyncEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnResourceDataSync(stack, 'Resource', {
      syncName: 'test-sync',
    });
    const mixin = new CfnResourceDataSyncEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SSM::ResourceDataSync', {
      SyncName: 'test-sync',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnResourceDataSync(stack, 'Resource', {
      syncName: 'test-sync',
    });
    const mixin = new CfnResourceDataSyncEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SSM::ResourceDataSync', {
      SyncName: 'test-sync',
      KMSKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnResourceDataSync(stack, 'Resource', {
      syncName: 'test-sync',
      syncType: 'SyncToDestination',
      s3Destination: {
        bucketName: 'test-bucket',
        bucketRegion: 'us-east-1',
        syncFormat: 'JsonSerDe',
      },
    });
    const mixin = new CfnResourceDataSyncEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SSM::ResourceDataSync', {
      SyncName: 'test-sync',
      SyncType: 'SyncToDestination',
      KMSKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnResourceDataSync(stack, 'Resource', {
      syncName: 'test-sync',
    });
    const mixin = new CfnResourceDataSyncEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

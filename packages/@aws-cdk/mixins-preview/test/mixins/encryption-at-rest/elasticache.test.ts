/**
 * Unit tests for AWS ElastiCache encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::ElastiCache::ReplicationGroup
 */

import { CfnReplicationGroup } from 'aws-cdk-lib/aws-elasticache';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnReplicationGroupEncryptionAtRestMixin } from '../../../lib/services/aws-elasticache/encryption-at-rest-mixins.generated';

describe('CfnReplicationGroupEncryptionAtRestMixin', () => {
  test('supports CfnReplicationGroup', () => {
    const { stack } = createTestContext();
    const resource = new CfnReplicationGroup(stack, 'Resource', {
      replicationGroupDescription: 'test-replication-group',
    });
    const mixin = new CfnReplicationGroupEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnReplicationGroupEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnReplicationGroup(stack, 'Resource', {
      replicationGroupDescription: 'test-replication-group',
    });
    const mixin = new CfnReplicationGroupEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ElastiCache::ReplicationGroup', {
      ReplicationGroupDescription: 'test-replication-group',
      AtRestEncryptionEnabled: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnReplicationGroup(stack, 'Resource', {
      replicationGroupDescription: 'test-replication-group',
    });
    const mixin = new CfnReplicationGroupEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ElastiCache::ReplicationGroup', {
      ReplicationGroupDescription: 'test-replication-group',
      AtRestEncryptionEnabled: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

/**
 * Unit tests for AWS DocumentDB Elastic encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DocDBElastic::Cluster
 */

import { CfnCluster } from 'aws-cdk-lib/aws-docdbelastic';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnClusterEncryptionAtRestMixin } from '../../../lib/services/aws-docdbelastic/encryption-at-rest-mixins.generated';

describe('CfnClusterEncryptionAtRestMixin', () => {
  test('supports CfnCluster', () => {
    const { stack } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      adminUserName: 'admin',
      adminUserPassword: 'password123',
      authType: 'PLAIN_TEXT',
      shardCapacity: 2,
      shardCount: 1,
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnClusterEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      adminUserName: 'admin',
      adminUserPassword: 'password123',
      authType: 'PLAIN_TEXT',
      shardCapacity: 2,
      shardCount: 1,
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::DocDBElastic::Cluster', {
      ClusterName: 'test-cluster',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      adminUserName: 'admin',
      adminUserPassword: 'password123',
      authType: 'PLAIN_TEXT',
      shardCapacity: 2,
      shardCount: 1,
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DocDBElastic::Cluster', {
      ClusterName: 'test-cluster',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

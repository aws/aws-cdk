/**
 * Unit tests for AWS DocumentDB encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DocDB::DBCluster
 */

import { CfnDBCluster } from 'aws-cdk-lib/aws-docdb';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDBClusterEncryptionAtRestMixin } from '../../../lib/services/aws-docdb/encryption-at-rest-mixins.generated';

describe('CfnDBClusterEncryptionAtRestMixin', () => {
  test('supports CfnDBCluster', () => {
    const { stack } = createTestContext();
    const resource = new CfnDBCluster(stack, 'Resource', {
      masterUsername: 'admin',
      masterUserPassword: 'password123',
    });
    const mixin = new CfnDBClusterEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDBClusterEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDBCluster(stack, 'Resource', {
      masterUsername: 'admin',
      masterUserPassword: 'password123',
    });
    const mixin = new CfnDBClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DocDB::DBCluster', {
      MasterUsername: 'admin',
      StorageEncrypted: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDBCluster(stack, 'Resource', {
      masterUsername: 'admin',
      masterUserPassword: 'password123',
    });
    const mixin = new CfnDBClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DocDB::DBCluster', {
      MasterUsername: 'admin',
      StorageEncrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

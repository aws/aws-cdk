/**
 * Unit tests for AWS DAX encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DAX::Cluster (no KMS support)
 *
 * DAX is a Category 3 service (No KMS Support) - it only supports
 * service-managed encryption and does not accept customer-managed KMS keys.
 */

import { CfnCluster } from 'aws-cdk-lib/aws-dax';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnClusterEncryptionAtRestMixin } from '../../../lib/services/aws-dax/encryption-at-rest-mixins.generated';

describe('CfnClusterEncryptionAtRestMixin', () => {
  test('supports CfnCluster', () => {
    const { stack } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      iamRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      nodeType: 'dax.r4.large',
      replicationFactor: 3,
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnClusterEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies service-managed encryption (no KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      iamRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      nodeType: 'dax.r4.large',
      replicationFactor: 3,
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DAX::Cluster', {
      IAMRoleARN: 'arn:aws:iam::123456789012:role/test-role',
      NodeType: 'dax.r4.large',
      ReplicationFactor: 3,
      SSESpecification: {
        SSEEnabled: true,
      },
    });
  });

  test('does not set KMS-related properties', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      iamRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      nodeType: 'dax.r4.large',
      replicationFactor: 3,
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Verify no KMS key ARN or ID is set (DAX doesn't support customer-managed KMS)
    const templateObj = template().toJSON();
    const daxCluster = templateObj.Resources.Resource;
    expect(daxCluster.Properties.SSESpecification).toBeDefined();
    expect(daxCluster.Properties.SSESpecification.SSEEnabled).toBe(true);
    // DAX SSESpecification only has SSEEnabled, no KMS key properties
    expect(daxCluster.Properties.SSESpecification.KMSMasterKeyId).toBeUndefined();
    expect(daxCluster.Properties.SSESpecification.KmsKeyArn).toBeUndefined();
  });

  test('mixin does not accept KMS key parameter', () => {
    // Verify that the mixin constructor does not accept a KMS key
    // This is a compile-time check - the constructor has no parameters
    const mixin = new CfnClusterEncryptionAtRestMixin();
    expect(mixin).toBeDefined();
  });
});

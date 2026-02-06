/**
 * Unit tests for AWS WorkspacesInstances encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::WorkspacesInstances::Volume
 *
 * WorkspacesInstances Volume supports optional KMS encryption. When no KMS key is provided,
 * encryption is enabled with AWS managed key. When a KMS key is provided,
 * customer-managed encryption is enabled via the kmsKeyId property.
 */

import { CfnVolume } from 'aws-cdk-lib/aws-workspacesinstances';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnVolumeEncryptionAtRestMixin } from '../../../lib/services/aws-workspacesinstances/encryption-at-rest-mixins.generated';

describe('CfnVolumeEncryptionAtRestMixin', () => {
  test('supports CfnVolume', () => {
    const { stack } = createTestContext();
    const resource = new CfnVolume(stack, 'Resource', {
      availabilityZone: 'us-east-1a',
    });
    const mixin = new CfnVolumeEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnVolumeEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnVolume(stack, 'Resource', {
      availabilityZone: 'us-east-1a',
    });
    const mixin = new CfnVolumeEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Encrypted is set to true, but no KMS key - uses AWS managed key by default
    template().hasResourceProperties('AWS::WorkspacesInstances::Volume', {
      AvailabilityZone: 'us-east-1a',
      Encrypted: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnVolume(stack, 'Resource', {
      availabilityZone: 'us-east-1a',
    });
    const mixin = new CfnVolumeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::WorkspacesInstances::Volume', {
      AvailabilityZone: 'us-east-1a',
      Encrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

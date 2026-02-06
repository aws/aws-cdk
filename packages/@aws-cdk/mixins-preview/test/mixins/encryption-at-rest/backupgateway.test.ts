/**
 * Unit tests for AWS BackupGateway encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::BackupGateway::Hypervisor
 */

import { CfnHypervisor } from 'aws-cdk-lib/aws-backupgateway';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnHypervisorEncryptionAtRestMixin } from '../../../lib/services/aws-backupgateway/encryption-at-rest-mixins.generated';

describe('CfnHypervisorEncryptionAtRestMixin', () => {
  test('supports CfnHypervisor', () => {
    const { stack } = createTestContext();
    const resource = new CfnHypervisor(stack, 'Resource', {});
    const mixin = new CfnHypervisorEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnHypervisorEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnHypervisor(stack, 'Resource', {});
    const mixin = new CfnHypervisorEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::BackupGateway::Hypervisor', {});
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnHypervisor(stack, 'Resource', {});
    const mixin = new CfnHypervisorEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::BackupGateway::Hypervisor', {
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

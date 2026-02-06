/**
 * Unit tests for AWS IoT encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::IoT::EncryptionConfiguration
 *
 * IoT EncryptionConfiguration supports optional KMS encryption.
 */

import { CfnEncryptionConfiguration } from 'aws-cdk-lib/aws-iot';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnEncryptionConfigurationEncryptionAtRestMixin } from '../../../lib/services/aws-iot/encryption-at-rest-mixins.generated';

describe('CfnEncryptionConfigurationEncryptionAtRestMixin', () => {
  test('supports CfnEncryptionConfiguration', () => {
    const { stack } = createTestContext();
    const resource = new CfnEncryptionConfiguration(stack, 'Resource', {
      encryptionType: 'AWS_OWNED_KMS_KEY',
    });
    const mixin = new CfnEncryptionConfigurationEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEncryptionConfigurationEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS owned key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEncryptionConfiguration(stack, 'Resource', {
      encryptionType: 'AWS_OWNED_KMS_KEY',
    });
    const mixin = new CfnEncryptionConfigurationEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::IoT::EncryptionConfiguration', {
      EncryptionType: 'AWS_OWNED_KMS_KEY',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEncryptionConfiguration(stack, 'Resource', {
      encryptionType: 'AWS_OWNED_KMS_KEY',
    });
    const mixin = new CfnEncryptionConfigurationEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::IoT::EncryptionConfiguration', {
      EncryptionType: 'CUSTOMER_MANAGED_KMS_KEY',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnEncryptionConfiguration(stack, 'Resource', {
      encryptionType: 'AWS_OWNED_KMS_KEY',
    });
    const mixin = new CfnEncryptionConfigurationEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

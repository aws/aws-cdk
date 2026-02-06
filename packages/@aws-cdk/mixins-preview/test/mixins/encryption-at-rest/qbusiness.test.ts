/**
 * Unit tests for AWS QBusiness encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::QBusiness::Application
 *
 * QBusiness Application supports optional KMS encryption.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * encryptionConfiguration.kmsKeyId property.
 */

import { CfnApplication } from 'aws-cdk-lib/aws-qbusiness';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnApplicationEncryptionAtRestMixin } from '../../../lib/services/aws-qbusiness/encryption-at-rest-mixins.generated';

describe('CfnApplicationEncryptionAtRestMixin', () => {
  test('supports CfnApplication', () => {
    const { stack } = createTestContext();
    const resource = new CfnApplication(stack, 'Resource', {
      displayName: 'test-app',
    });
    const mixin = new CfnApplicationEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnApplicationEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnApplication(stack, 'Resource', {
      displayName: 'test-app',
    });
    const mixin = new CfnApplicationEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::QBusiness::Application', {
      DisplayName: 'test-app',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnApplication(stack, 'Resource', {
      displayName: 'test-app',
    });
    const mixin = new CfnApplicationEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::QBusiness::Application', {
      DisplayName: 'test-app',
      EncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnApplication(stack, 'Resource', {
      displayName: 'test-app',
    });
    const mixin = new CfnApplicationEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

/**
 * Unit tests for AWS SecretsManager encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::SecretsManager::Secret
 *
 * SecretsManager Secret is encrypted with AWS managed key (aws/secretsmanager) by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyId property.
 */

import { CfnSecret } from 'aws-cdk-lib/aws-secretsmanager';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnSecretEncryptionAtRestMixin } from '../../../lib/services/aws-secretsmanager/encryption-at-rest-mixins.generated';

describe('CfnSecretEncryptionAtRestMixin', () => {
  test('supports CfnSecret', () => {
    const { stack } = createTestContext();
    const resource = new CfnSecret(stack, 'Resource', {
      name: 'test-secret',
    });
    const mixin = new CfnSecretEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnSecretEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnSecret(stack, 'Resource', {
      name: 'test-secret',
    });
    const mixin = new CfnSecretEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: 'test-secret',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnSecret(stack, 'Resource', {
      name: 'test-secret',
    });
    const mixin = new CfnSecretEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: 'test-secret',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnSecret(stack, 'Resource', {
      name: 'test-secret',
      description: 'Test secret description',
      secretString: '{"username":"admin","password":"secret123"}',
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnSecretEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: 'test-secret',
      Description: 'Test secret description',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnSecret(stack, 'Resource', {
      name: 'test-secret',
    });
    const mixin = new CfnSecretEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

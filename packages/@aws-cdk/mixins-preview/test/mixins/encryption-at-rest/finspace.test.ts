/**
 * Unit tests for AWS FinSpace encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::FinSpace::Environment
 *
 * FinSpace Environment supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyId property.
 */

import { CfnEnvironment } from 'aws-cdk-lib/aws-finspace';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnEnvironmentEncryptionAtRestMixin } from '../../../lib/services/aws-finspace/encryption-at-rest-mixins.generated';

describe('CfnEnvironmentEncryptionAtRestMixin', () => {
  test('supports CfnEnvironment', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::FinSpace::Environment', {
      Name: 'test-environment',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::FinSpace::Environment', {
      Name: 'test-environment',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

/**
 * Unit tests for AWS Deadline encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Deadline::Farm
 *
 * Deadline Farm supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyArn property.
 */

import { CfnFarm } from 'aws-cdk-lib/aws-deadline';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnFarmEncryptionAtRestMixin } from '../../../lib/services/aws-deadline/encryption-at-rest-mixins.generated';

describe('CfnFarmEncryptionAtRestMixin', () => {
  test('supports CfnFarm', () => {
    const { stack } = createTestContext();
    const resource = new CfnFarm(stack, 'Resource', {
      displayName: 'test-farm',
    });
    const mixin = new CfnFarmEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFarmEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFarm(stack, 'Resource', {
      displayName: 'test-farm',
    });
    const mixin = new CfnFarmEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Deadline::Farm', {
      DisplayName: 'test-farm',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnFarm(stack, 'Resource', {
      displayName: 'test-farm',
    });
    const mixin = new CfnFarmEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Deadline::Farm', {
      DisplayName: 'test-farm',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnFarm(stack, 'Resource', {
      displayName: 'test-farm',
    });
    const mixin = new CfnFarmEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

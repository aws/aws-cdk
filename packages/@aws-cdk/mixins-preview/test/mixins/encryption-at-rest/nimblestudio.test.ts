/**
 * Unit tests for AWS NimbleStudio encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::NimbleStudio::Studio
 *
 * NimbleStudio Studio supports optional KMS encryption.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * studioEncryptionConfiguration.keyArn property.
 */

import { CfnStudio } from 'aws-cdk-lib/aws-nimblestudio';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnStudioEncryptionAtRestMixin } from '../../../lib/services/aws-nimblestudio/encryption-at-rest-mixins.generated';

describe('CfnStudioEncryptionAtRestMixin', () => {
  test('supports CfnStudio', () => {
    const { stack } = createTestContext();
    const resource = new CfnStudio(stack, 'Resource', {
      adminRoleArn: 'arn:aws:iam::123456789012:role/admin-role',
      displayName: 'test-studio',
      studioName: 'test-studio',
      userRoleArn: 'arn:aws:iam::123456789012:role/user-role',
    });
    const mixin = new CfnStudioEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnStudioEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStudio(stack, 'Resource', {
      adminRoleArn: 'arn:aws:iam::123456789012:role/admin-role',
      displayName: 'test-studio',
      studioName: 'test-studio',
      userRoleArn: 'arn:aws:iam::123456789012:role/user-role',
    });
    const mixin = new CfnStudioEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::NimbleStudio::Studio', {
      StudioName: 'test-studio',
      StudioEncryptionConfiguration: {
        KeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnStudio(stack, 'Resource', {
      adminRoleArn: 'arn:aws:iam::123456789012:role/admin-role',
      displayName: 'test-studio',
      studioName: 'test-studio',
      userRoleArn: 'arn:aws:iam::123456789012:role/user-role',
    });
    const mixin = new CfnStudioEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

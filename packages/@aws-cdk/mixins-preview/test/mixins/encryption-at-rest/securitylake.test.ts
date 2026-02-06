/**
 * Unit tests for AWS SecurityLake encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::SecurityLake::DataLake
 *
 * SecurityLake DataLake supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * encryptionConfiguration.kmsKeyId property.
 */

import { CfnDataLake } from 'aws-cdk-lib/aws-securitylake';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDataLakeEncryptionAtRestMixin } from '../../../lib/services/aws-securitylake/encryption-at-rest-mixins.generated';

describe('CfnDataLakeEncryptionAtRestMixin', () => {
  test('supports CfnDataLake', () => {
    const { stack } = createTestContext();
    const resource = new CfnDataLake(stack, 'Resource', {});
    const mixin = new CfnDataLakeEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDataLakeEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDataLake(stack, 'Resource', {});
    const mixin = new CfnDataLakeEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResource('AWS::SecurityLake::DataLake', {});
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataLake(stack, 'Resource', {});
    const mixin = new CfnDataLakeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SecurityLake::DataLake', {
      EncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataLake(stack, 'Resource', {
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnDataLakeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SecurityLake::DataLake', {
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      EncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnDataLake(stack, 'Resource', {});
    const mixin = new CfnDataLakeEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

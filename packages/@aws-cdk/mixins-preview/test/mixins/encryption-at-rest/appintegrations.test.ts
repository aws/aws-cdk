/**
 * Unit tests for AWS AppIntegrations encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::AppIntegrations::DataIntegration (KMS required)
 *
 * AppIntegrations DataIntegration requires a KMS key for encryption.
 * The mixin will not apply without a KMS key.
 */

import { CfnDataIntegration } from 'aws-cdk-lib/aws-appintegrations';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDataIntegrationEncryptionAtRestMixin } from '../../../lib/services/aws-appintegrations/encryption-at-rest-mixins.generated';

describe('CfnDataIntegrationEncryptionAtRestMixin', () => {
  test('supports CfnDataIntegration', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnDataIntegration(stack, 'Resource', {
      name: 'test-data-integration',
      kmsKey: kmsKey.keyArn,
      sourceUri: 'arn:aws:s3:::test-bucket',
    });
    const mixin = new CfnDataIntegrationEncryptionAtRestMixin(kmsKey);
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack, kmsKey } = createTestContext();
    const mixin = new CfnDataIntegrationEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key (required)', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataIntegration(stack, 'Resource', {
      name: 'test-data-integration',
      kmsKey: 'placeholder-key',
      sourceUri: 'arn:aws:s3:::test-bucket',
    });
    const mixin = new CfnDataIntegrationEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppIntegrations::DataIntegration', {
      Name: 'test-data-integration',
      KmsKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataIntegration(stack, 'Resource', {
      name: 'test-data-integration',
      kmsKey: 'placeholder-key',
      sourceUri: 'arn:aws:s3:::test-bucket',
      description: 'Test data integration',
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnDataIntegrationEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppIntegrations::DataIntegration', {
      Name: 'test-data-integration',
      Description: 'Test data integration',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      KmsKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnDataIntegration(stack, 'Resource', {
      name: 'test-data-integration',
      kmsKey: kmsKey.keyArn,
      sourceUri: 'arn:aws:s3:::test-bucket',
    });
    const mixin = new CfnDataIntegrationEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

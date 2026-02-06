/**
 * Unit tests for AWS APS (Amazon Managed Service for Prometheus) encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::APS::Workspace
 *
 * APS Workspace supports optional KMS encryption. Uses AWS managed key for APS by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the kmsKeyArn property.
 */

import { CfnWorkspace } from 'aws-cdk-lib/aws-aps';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnWorkspaceEncryptionAtRestMixin } from '../../../lib/services/aws-aps/encryption-at-rest-mixins.generated';

describe('CfnWorkspaceEncryptionAtRestMixin', () => {
  test('supports CfnWorkspace', () => {
    const { stack } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {});
    const mixin = new CfnWorkspaceEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnWorkspaceEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {
      alias: 'test-workspace',
    });
    const mixin = new CfnWorkspaceEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no kmsKeyArn is set (uses AWS managed key by default)
    template().hasResourceProperties('AWS::APS::Workspace', {
      Alias: 'test-workspace',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {
      alias: 'test-workspace',
    });
    const mixin = new CfnWorkspaceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::APS::Workspace', {
      Alias: 'test-workspace',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing workspace configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {
      alias: 'test-workspace',
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnWorkspaceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::APS::Workspace', {
      Alias: 'test-workspace',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {});
    const mixin = new CfnWorkspaceEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

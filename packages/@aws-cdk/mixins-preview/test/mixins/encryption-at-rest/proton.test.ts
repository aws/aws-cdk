/**
 * Unit tests for AWS Proton encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Proton::EnvironmentTemplate
 * - AWS::Proton::ServiceTemplate
 *
 * Proton supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * encryptionKey property.
 */

import { CfnEnvironmentTemplate, CfnServiceTemplate } from 'aws-cdk-lib/aws-proton';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnEnvironmentTemplateEncryptionAtRestMixin,
  CfnServiceTemplateEncryptionAtRestMixin,
} from '../../../lib/services/aws-proton/encryption-at-rest-mixins.generated';

describe('CfnEnvironmentTemplateEncryptionAtRestMixin', () => {
  test('supports CfnEnvironmentTemplate', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironmentTemplate(stack, 'Resource', {});
    const mixin = new CfnEnvironmentTemplateEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEnvironmentTemplateEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEnvironmentTemplate(stack, 'Resource', {
      name: 'test-template',
    });
    const mixin = new CfnEnvironmentTemplateEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Proton::EnvironmentTemplate', {
      Name: 'test-template',
      EncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironmentTemplate(stack, 'Resource', {});
    const mixin = new CfnEnvironmentTemplateEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnServiceTemplateEncryptionAtRestMixin', () => {
  test('supports CfnServiceTemplate', () => {
    const { stack } = createTestContext();
    const resource = new CfnServiceTemplate(stack, 'Resource', {});
    const mixin = new CfnServiceTemplateEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnServiceTemplateEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnServiceTemplate(stack, 'Resource', {
      name: 'test-template',
    });
    const mixin = new CfnServiceTemplateEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Proton::ServiceTemplate', {
      Name: 'test-template',
      EncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnServiceTemplate(stack, 'Resource', {});
    const mixin = new CfnServiceTemplateEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

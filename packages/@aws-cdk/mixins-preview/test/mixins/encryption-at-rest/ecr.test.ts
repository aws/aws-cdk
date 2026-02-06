/**
 * Unit tests for AWS ECR encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::ECR::Repository
 * - AWS::ECR::RepositoryCreationTemplate
 */

import { CfnRepository, CfnRepositoryCreationTemplate } from 'aws-cdk-lib/aws-ecr';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnRepositoryEncryptionAtRestMixin, CfnRepositoryCreationTemplateEncryptionAtRestMixin } from '../../../lib/services/aws-ecr/encryption-at-rest-mixins.generated';

describe('CfnRepositoryEncryptionAtRestMixin', () => {
  test('supports CfnRepository', () => {
    const { stack } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {});
    const mixin = new CfnRepositoryEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnRepositoryEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {});
    const mixin = new CfnRepositoryEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // ECR sets encryptionType to KMS even without a customer key
    template().hasResourceProperties('AWS::ECR::Repository', {
      EncryptionConfiguration: {
        EncryptionType: 'AES256',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {});
    const mixin = new CfnRepositoryEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ECR::Repository', {
      EncryptionConfiguration: {
        EncryptionType: 'KMS',
        KmsKey: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

describe('CfnRepositoryCreationTemplateEncryptionAtRestMixin', () => {
  test('supports CfnRepositoryCreationTemplate', () => {
    const { stack } = createTestContext();
    const resource = new CfnRepositoryCreationTemplate(stack, 'Resource', {
      prefix: 'test-prefix',
      appliedFor: ['PULL_THROUGH_CACHE'],
    });
    const mixin = new CfnRepositoryCreationTemplateEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnRepositoryCreationTemplateEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnRepositoryCreationTemplate(stack, 'Resource', {
      prefix: 'test-prefix',
      appliedFor: ['PULL_THROUGH_CACHE'],
    });
    const mixin = new CfnRepositoryCreationTemplateEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // ECR sets encryptionType to KMS even without a customer key
    template().hasResourceProperties('AWS::ECR::RepositoryCreationTemplate', {
      EncryptionConfiguration: {
        EncryptionType: 'AES256',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnRepositoryCreationTemplate(stack, 'Resource', {
      prefix: 'test-prefix',
      appliedFor: ['PULL_THROUGH_CACHE'],
    });
    const mixin = new CfnRepositoryCreationTemplateEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ECR::RepositoryCreationTemplate', {
      EncryptionConfiguration: {
        EncryptionType: 'KMS',
        KmsKey: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

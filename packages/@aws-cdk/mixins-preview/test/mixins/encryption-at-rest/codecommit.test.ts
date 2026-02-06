/**
 * Unit tests for AWS CodeCommit encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::CodeCommit::Repository
 *
 * CodeCommit Repository supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyId property.
 */

import { CfnRepository } from 'aws-cdk-lib/aws-codecommit';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnRepositoryEncryptionAtRestMixin } from '../../../lib/services/aws-codecommit/encryption-at-rest-mixins.generated';

describe('CfnRepositoryEncryptionAtRestMixin', () => {
  test('supports CfnRepository', () => {
    const { stack } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnRepositoryEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeCommit::Repository', {
      RepositoryName: 'test-repo',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeCommit::Repository', {
      RepositoryName: 'test-repo',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {
      repositoryName: 'test-repo',
      repositoryDescription: 'Test repository',
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnRepositoryEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeCommit::Repository', {
      RepositoryName: 'test-repo',
      RepositoryDescription: 'Test repository',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnRepository(stack, 'Resource', {
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

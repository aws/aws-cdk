/**
 * Unit tests for AWS CodeStarConnections encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::CodeStarConnections::RepositoryLink
 *
 * CodeStarConnections RepositoryLink supports optional KMS encryption.
 * Uses AWS managed key by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the encryptionKeyArn property.
 */

import { CfnRepositoryLink } from 'aws-cdk-lib/aws-codestarconnections';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnRepositoryLinkEncryptionAtRestMixin } from '../../../lib/services/aws-codestarconnections/encryption-at-rest-mixins.generated';

describe('CfnRepositoryLinkEncryptionAtRestMixin', () => {
  test('supports CfnRepositoryLink', () => {
    const { stack } = createTestContext();
    const resource = new CfnRepositoryLink(stack, 'Resource', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/test-connection',
      ownerId: 'test-owner',
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryLinkEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnRepositoryLinkEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnRepositoryLink(stack, 'Resource', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/test-connection',
      ownerId: 'test-owner',
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryLinkEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeStarConnections::RepositoryLink', {
      RepositoryName: 'test-repo',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnRepositoryLink(stack, 'Resource', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/test-connection',
      ownerId: 'test-owner',
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryLinkEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeStarConnections::RepositoryLink', {
      RepositoryName: 'test-repo',
      EncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnRepositoryLink(stack, 'Resource', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/test-connection',
      ownerId: 'test-owner',
      repositoryName: 'test-repo',
    });
    const mixin = new CfnRepositoryLinkEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

/**
 * Unit tests for AWS CodeArtifact encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::CodeArtifact::Domain
 *
 * CodeArtifact Domain supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * encryptionKey property.
 */

import { CfnDomain } from 'aws-cdk-lib/aws-codeartifact';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDomainEncryptionAtRestMixin } from '../../../lib/services/aws-codeartifact/encryption-at-rest-mixins.generated';

describe('CfnDomainEncryptionAtRestMixin', () => {
  test('supports CfnDomain', () => {
    const { stack } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'test-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDomainEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'test-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeArtifact::Domain', {
      DomainName: 'test-domain',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'test-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeArtifact::Domain', {
      DomainName: 'test-domain',
      EncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'test-domain',
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeArtifact::Domain', {
      DomainName: 'test-domain',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      EncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'test-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

/**
 * Unit tests for AWS Elasticsearch encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Elasticsearch::Domain
 */

import { CfnDomain } from 'aws-cdk-lib/aws-elasticsearch';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDomainEncryptionAtRestMixin } from '../../../lib/services/aws-elasticsearch/encryption-at-rest-mixins.generated';

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

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'test-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Elasticsearch::Domain', {
      DomainName: 'test-domain',
      EncryptionAtRestOptions: {
        Enabled: true,
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'test-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Elasticsearch::Domain', {
      DomainName: 'test-domain',
      EncryptionAtRestOptions: {
        Enabled: true,
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

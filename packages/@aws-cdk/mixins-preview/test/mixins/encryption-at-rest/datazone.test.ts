/**
 * Unit tests for AWS DataZone encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DataZone::Domain
 *
 * DataZone Domain uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the kmsKeyIdentifier property.
 */

import { CfnDomain } from 'aws-cdk-lib/aws-datazone';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDomainEncryptionAtRestMixin } from '../../../lib/services/aws-datazone/encryption-at-rest-mixins.generated';

describe('CfnDomainEncryptionAtRestMixin', () => {
  test('supports CfnDomain', () => {
    const { stack } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainExecutionRole: 'arn:aws:iam::123456789012:role/datazone-role',
      name: 'my-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDomainEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainExecutionRole: 'arn:aws:iam::123456789012:role/datazone-role',
      name: 'my-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyIdentifier is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::DataZone::Domain', {
      DomainExecutionRole: 'arn:aws:iam::123456789012:role/datazone-role',
      Name: 'my-domain',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainExecutionRole: 'arn:aws:iam::123456789012:role/datazone-role',
      name: 'my-domain',
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DataZone::Domain', {
      DomainExecutionRole: 'arn:aws:iam::123456789012:role/datazone-role',
      Name: 'my-domain',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

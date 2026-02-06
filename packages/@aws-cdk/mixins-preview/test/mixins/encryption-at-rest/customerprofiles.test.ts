/**
 * Unit tests for AWS CustomerProfiles encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::CustomerProfiles::Domain
 * - AWS::CustomerProfiles::ObjectType
 *
 * Both resources use AWS managed key for CustomerProfiles by default.
 * When a KMS key is provided, customer-managed encryption is enabled.
 */

import { CfnDomain, CfnObjectType } from 'aws-cdk-lib/aws-customerprofiles';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnDomainEncryptionAtRestMixin,
  CfnObjectTypeEncryptionAtRestMixin,
} from '../../../lib/services/aws-customerprofiles/encryption-at-rest-mixins.generated';

describe('CfnDomainEncryptionAtRestMixin', () => {
  test('supports CfnDomain', () => {
    const { stack } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'my-domain',
      defaultExpirationDays: 365,
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
      domainName: 'my-domain',
      defaultExpirationDays: 365,
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no DefaultEncryptionKey is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::CustomerProfiles::Domain', {
      DomainName: 'my-domain',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      domainName: 'my-domain',
      defaultExpirationDays: 365,
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CustomerProfiles::Domain', {
      DomainName: 'my-domain',
      DefaultEncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnObjectTypeEncryptionAtRestMixin', () => {
  test('supports CfnObjectType', () => {
    const { stack } = createTestContext();
    const resource = new CfnObjectType(stack, 'Resource', {
      domainName: 'my-domain',
      objectTypeName: 'my-object-type',
      description: 'Test object type',
    });
    const mixin = new CfnObjectTypeEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnObjectTypeEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnObjectType(stack, 'Resource', {
      domainName: 'my-domain',
      objectTypeName: 'my-object-type',
      description: 'Test object type',
    });
    const mixin = new CfnObjectTypeEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no EncryptionKey is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::CustomerProfiles::ObjectType', {
      DomainName: 'my-domain',
      ObjectTypeName: 'my-object-type',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnObjectType(stack, 'Resource', {
      domainName: 'my-domain',
      objectTypeName: 'my-object-type',
      description: 'Test object type',
    });
    const mixin = new CfnObjectTypeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CustomerProfiles::ObjectType', {
      DomainName: 'my-domain',
      ObjectTypeName: 'my-object-type',
      EncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

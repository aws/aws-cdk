/**
 * Unit tests for AWS HealthImaging encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::HealthImaging::Datastore
 *
 * HealthImaging Datastore supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyArn property.
 */

import { CfnDatastore } from 'aws-cdk-lib/aws-healthimaging';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDatastoreEncryptionAtRestMixin } from '../../../lib/services/aws-healthimaging/encryption-at-rest-mixins.generated';

describe('CfnDatastoreEncryptionAtRestMixin', () => {
  test('supports CfnDatastore', () => {
    const { stack } = createTestContext();
    const resource = new CfnDatastore(stack, 'Resource', {
      datastoreName: 'test-datastore',
    });
    const mixin = new CfnDatastoreEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDatastoreEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDatastore(stack, 'Resource', {
      datastoreName: 'test-datastore',
    });
    const mixin = new CfnDatastoreEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::HealthImaging::Datastore', {
      DatastoreName: 'test-datastore',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDatastore(stack, 'Resource', {
      datastoreName: 'test-datastore',
    });
    const mixin = new CfnDatastoreEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::HealthImaging::Datastore', {
      DatastoreName: 'test-datastore',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnDatastore(stack, 'Resource', {
      datastoreName: 'test-datastore',
    });
    const mixin = new CfnDatastoreEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

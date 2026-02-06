/**
 * Unit tests for AWS HealthLake encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::HealthLake::FHIRDatastore
 *
 * HealthLake FHIRDatastore supports optional KMS encryption.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * sseConfiguration.kmsEncryptionConfig.kmsKeyId property.
 */

import { CfnFHIRDatastore } from 'aws-cdk-lib/aws-healthlake';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnFHIRDatastoreEncryptionAtRestMixin } from '../../../lib/services/aws-healthlake/encryption-at-rest-mixins.generated';

describe('CfnFHIRDatastoreEncryptionAtRestMixin', () => {
  test('supports CfnFHIRDatastore', () => {
    const { stack } = createTestContext();
    const resource = new CfnFHIRDatastore(stack, 'Resource', {
      datastoreTypeVersion: 'R4',
    });
    const mixin = new CfnFHIRDatastoreEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFHIRDatastoreEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFHIRDatastore(stack, 'Resource', {
      datastoreTypeVersion: 'R4',
      datastoreName: 'test-datastore',
    });
    const mixin = new CfnFHIRDatastoreEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without a KMS key, HealthLake defaults to AWS owned key.
    // See: https://docs.aws.amazon.com/healthlake/latest/devguide/encryption-at-rest.html
    template().hasResourceProperties('AWS::HealthLake::FHIRDatastore', {
      DatastoreTypeVersion: 'R4',
      DatastoreName: 'test-datastore',
      SseConfiguration: {
        KmsEncryptionConfig: {
          CmkType: 'AWS_OWNED_KMS_KEY',
        },
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnFHIRDatastore(stack, 'Resource', {
      datastoreTypeVersion: 'R4',
      datastoreName: 'test-datastore',
    });
    const mixin = new CfnFHIRDatastoreEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::HealthLake::FHIRDatastore', {
      DatastoreTypeVersion: 'R4',
      DatastoreName: 'test-datastore',
      SseConfiguration: {
        KmsEncryptionConfig: {
          CmkType: 'CUSTOMER_MANAGED_KMS_KEY',
          KmsKeyId: {
            'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
          },
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnFHIRDatastore(stack, 'Resource', {
      datastoreTypeVersion: 'R4',
    });
    const mixin = new CfnFHIRDatastoreEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

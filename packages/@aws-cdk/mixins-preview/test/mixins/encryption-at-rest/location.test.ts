/**
 * Unit tests for AWS Location encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Location::GeofenceCollection
 * - AWS::Location::Tracker
 *
 * Location services support optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyId property.
 */

import { CfnGeofenceCollection, CfnTracker } from 'aws-cdk-lib/aws-location';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnGeofenceCollectionEncryptionAtRestMixin,
  CfnTrackerEncryptionAtRestMixin,
} from '../../../lib/services/aws-location/encryption-at-rest-mixins.generated';

describe('CfnGeofenceCollectionEncryptionAtRestMixin', () => {
  test('supports CfnGeofenceCollection', () => {
    const { stack } = createTestContext();
    const resource = new CfnGeofenceCollection(stack, 'Resource', {
      collectionName: 'test-collection',
    });
    const mixin = new CfnGeofenceCollectionEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnGeofenceCollectionEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnGeofenceCollection(stack, 'Resource', {
      collectionName: 'test-collection',
    });
    const mixin = new CfnGeofenceCollectionEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Location::GeofenceCollection', {
      CollectionName: 'test-collection',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnGeofenceCollection(stack, 'Resource', {
      collectionName: 'test-collection',
    });
    const mixin = new CfnGeofenceCollectionEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Location::GeofenceCollection', {
      CollectionName: 'test-collection',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnGeofenceCollection(stack, 'Resource', {
      collectionName: 'test-collection',
    });
    const mixin = new CfnGeofenceCollectionEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnTrackerEncryptionAtRestMixin', () => {
  test('supports CfnTracker', () => {
    const { stack } = createTestContext();
    const resource = new CfnTracker(stack, 'Resource', {
      trackerName: 'test-tracker',
    });
    const mixin = new CfnTrackerEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnTrackerEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnTracker(stack, 'Resource', {
      trackerName: 'test-tracker',
    });
    const mixin = new CfnTrackerEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Location::Tracker', {
      TrackerName: 'test-tracker',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnTracker(stack, 'Resource', {
      trackerName: 'test-tracker',
    });
    const mixin = new CfnTrackerEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

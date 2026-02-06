/**
 * Unit tests for AWS EC2 encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::EC2::Instance (no KMS support - Category 3)
 * - AWS::EC2::Volume
 */

import { CfnInstance, CfnVolume } from 'aws-cdk-lib/aws-ec2';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnInstanceEncryptionAtRestMixin,
  CfnVolumeEncryptionAtRestMixin,
} from '../../../lib/services/aws-ec2/encryption-at-rest-mixins.generated';

describe('CfnInstanceEncryptionAtRestMixin', () => {
  test('supports CfnInstance', () => {
    const { stack } = createTestContext();
    const resource = new CfnInstance(stack, 'Resource', {});
    const mixin = new CfnInstanceEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnInstanceEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies service-managed encryption (no KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnInstance(stack, 'Resource', {
      imageId: 'ami-12345678',
      instanceType: 't3.micro',
    });
    const mixin = new CfnInstanceEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // EC2 Instance encryption is managed at the account level via EBS encryption-by-default
    // The mixin does not set any KMS-related properties since it doesn't support customer-managed keys
    template().hasResourceProperties('AWS::EC2::Instance', {
      ImageId: 'ami-12345678',
      InstanceType: 't3.micro',
    });
  });
});

describe('CfnVolumeEncryptionAtRestMixin', () => {
  test('supports CfnVolume', () => {
    const { stack } = createTestContext();
    const resource = new CfnVolume(stack, 'Resource', {
      availabilityZone: 'us-east-1a',
    });
    const mixin = new CfnVolumeEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnVolumeEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnVolume(stack, 'Resource', {
      availabilityZone: 'us-east-1a',
    });
    const mixin = new CfnVolumeEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Encrypted is set to true, but no KMS key - uses AWS managed key by default
    template().hasResourceProperties('AWS::EC2::Volume', {
      AvailabilityZone: 'us-east-1a',
      Encrypted: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnVolume(stack, 'Resource', {
      availabilityZone: 'us-east-1a',
    });
    const mixin = new CfnVolumeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::EC2::Volume', {
      AvailabilityZone: 'us-east-1a',
      Encrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

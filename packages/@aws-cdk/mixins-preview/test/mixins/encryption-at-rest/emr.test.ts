/**
 * Unit tests for AWS EMR encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::EMR::Studio
 *
 * EMR Studio supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * encryptionKeyArn property.
 */

import { CfnStudio } from 'aws-cdk-lib/aws-emr';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnStudioEncryptionAtRestMixin } from '../../../lib/services/aws-emr/encryption-at-rest-mixins.generated';

describe('CfnStudioEncryptionAtRestMixin', () => {
  test('supports CfnStudio', () => {
    const { stack } = createTestContext();
    const resource = new CfnStudio(stack, 'Resource', {
      authMode: 'IAM',
      defaultS3Location: 's3://test-bucket/studio',
      engineSecurityGroupId: 'sg-12345678',
      name: 'test-studio',
      serviceRole: 'arn:aws:iam::123456789012:role/emr-studio-role',
      subnetIds: ['subnet-12345678'],
      vpcId: 'vpc-12345678',
      workspaceSecurityGroupId: 'sg-87654321',
    });
    const mixin = new CfnStudioEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnStudioEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStudio(stack, 'Resource', {
      authMode: 'IAM',
      defaultS3Location: 's3://test-bucket/studio',
      engineSecurityGroupId: 'sg-12345678',
      name: 'test-studio',
      serviceRole: 'arn:aws:iam::123456789012:role/emr-studio-role',
      subnetIds: ['subnet-12345678'],
      vpcId: 'vpc-12345678',
      workspaceSecurityGroupId: 'sg-87654321',
    });
    const mixin = new CfnStudioEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::EMR::Studio', {
      Name: 'test-studio',
      EncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnStudio(stack, 'Resource', {
      authMode: 'IAM',
      defaultS3Location: 's3://test-bucket/studio',
      engineSecurityGroupId: 'sg-12345678',
      name: 'test-studio',
      serviceRole: 'arn:aws:iam::123456789012:role/emr-studio-role',
      subnetIds: ['subnet-12345678'],
      vpcId: 'vpc-12345678',
      workspaceSecurityGroupId: 'sg-87654321',
    });
    const mixin = new CfnStudioEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

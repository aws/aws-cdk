/**
 * Unit tests for AWS CleanRooms encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::CleanRooms::IdMappingTable
 */

import { CfnIdMappingTable } from 'aws-cdk-lib/aws-cleanrooms';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnIdMappingTableEncryptionAtRestMixin } from '../../../lib/services/aws-cleanrooms/encryption-at-rest-mixins.generated';

describe('CfnIdMappingTableEncryptionAtRestMixin', () => {
  test('supports CfnIdMappingTable', () => {
    const { stack } = createTestContext();
    const resource = new CfnIdMappingTable(stack, 'Resource', {
      inputReferenceConfig: {
        inputReferenceArn: 'arn:aws:entityresolution:us-east-1:123456789012:idmappingworkflow/test-workflow',
        manageResourcePolicies: false,
      },
      membershipIdentifier: 'test-membership-id',
      name: 'test-id-mapping-table',
    });
    const mixin = new CfnIdMappingTableEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnIdMappingTableEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnIdMappingTable(stack, 'Resource', {
      inputReferenceConfig: {
        inputReferenceArn: 'arn:aws:entityresolution:us-east-1:123456789012:idmappingworkflow/test-workflow',
        manageResourcePolicies: false,
      },
      membershipIdentifier: 'test-membership-id',
      name: 'test-id-mapping-table',
    });
    const mixin = new CfnIdMappingTableEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no encryption config is set (uses AWS managed key by default)
    template().hasResourceProperties('AWS::CleanRooms::IdMappingTable', {
      Name: 'test-id-mapping-table',
      MembershipIdentifier: 'test-membership-id',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnIdMappingTable(stack, 'Resource', {
      inputReferenceConfig: {
        inputReferenceArn: 'arn:aws:entityresolution:us-east-1:123456789012:idmappingworkflow/test-workflow',
        manageResourcePolicies: false,
      },
      membershipIdentifier: 'test-membership-id',
      name: 'test-id-mapping-table',
    });
    const mixin = new CfnIdMappingTableEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CleanRooms::IdMappingTable', {
      Name: 'test-id-mapping-table',
      MembershipIdentifier: 'test-membership-id',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

/**
 * Unit tests for AWS AIOps encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::AIOps::InvestigationGroup
 */

import { CfnInvestigationGroup } from 'aws-cdk-lib/aws-aiops';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnInvestigationGroupEncryptionAtRestMixin } from '../../../lib/services/aws-aiops/encryption-at-rest-mixins.generated';

describe('CfnInvestigationGroupEncryptionAtRestMixin', () => {
  test('supports CfnInvestigationGroup', () => {
    const { stack } = createTestContext();
    const resource = new CfnInvestigationGroup(stack, 'Resource', {
      name: 'test-investigation-group',
    });
    const mixin = new CfnInvestigationGroupEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnInvestigationGroupEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnInvestigationGroup(stack, 'Resource', {
      name: 'test-investigation-group',
    });
    const mixin = new CfnInvestigationGroupEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no encryption config is set (uses AWS managed key by default)
    template().hasResourceProperties('AWS::AIOps::InvestigationGroup', {
      Name: 'test-investigation-group',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnInvestigationGroup(stack, 'Resource', {
      name: 'test-investigation-group',
    });
    const mixin = new CfnInvestigationGroupEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AIOps::InvestigationGroup', {
      Name: 'test-investigation-group',
      EncryptionConfig: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

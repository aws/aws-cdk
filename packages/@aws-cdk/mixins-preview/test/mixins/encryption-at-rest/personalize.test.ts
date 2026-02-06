/**
 * Unit tests for AWS Personalize encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Personalize::DatasetGroup
 */

import { CfnDatasetGroup } from 'aws-cdk-lib/aws-personalize';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDatasetGroupEncryptionAtRestMixin } from '../../../lib/services/aws-personalize/encryption-at-rest-mixins.generated';

describe('CfnDatasetGroupEncryptionAtRestMixin', () => {
  test('supports CfnDatasetGroup', () => {
    const { stack } = createTestContext();
    const resource = new CfnDatasetGroup(stack, 'Resource', {
      name: 'test-dataset-group',
    });
    const mixin = new CfnDatasetGroupEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDatasetGroupEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDatasetGroup(stack, 'Resource', {
      name: 'test-dataset-group',
    });
    const mixin = new CfnDatasetGroupEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Personalize::DatasetGroup', {
      Name: 'test-dataset-group',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDatasetGroup(stack, 'Resource', {
      name: 'test-dataset-group',
    });
    const mixin = new CfnDatasetGroupEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Personalize::DatasetGroup', {
      Name: 'test-dataset-group',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

/**
 * Unit tests for AWS Forecast encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Forecast::Dataset
 */

import { CfnDataset } from 'aws-cdk-lib/aws-forecast';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDatasetEncryptionAtRestMixin } from '../../../lib/services/aws-forecast/encryption-at-rest-mixins.generated';

describe('CfnDatasetEncryptionAtRestMixin', () => {
  test('supports CfnDataset', () => {
    const { stack } = createTestContext();
    const resource = new CfnDataset(stack, 'Resource', {
      datasetName: 'test-dataset',
      datasetType: 'TARGET_TIME_SERIES',
      domain: 'RETAIL',
      schema: {
        attributes: [
          { attributeName: 'item_id', attributeType: 'string' },
          { attributeName: 'timestamp', attributeType: 'timestamp' },
          { attributeName: 'demand', attributeType: 'float' },
        ],
      },
    });
    const mixin = new CfnDatasetEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDatasetEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDataset(stack, 'Resource', {
      datasetName: 'test-dataset',
      datasetType: 'TARGET_TIME_SERIES',
      domain: 'RETAIL',
      schema: {
        attributes: [
          { attributeName: 'item_id', attributeType: 'string' },
          { attributeName: 'timestamp', attributeType: 'timestamp' },
          { attributeName: 'demand', attributeType: 'float' },
        ],
      },
    });
    const mixin = new CfnDatasetEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Forecast::Dataset', {
      DatasetName: 'test-dataset',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataset(stack, 'Resource', {
      datasetName: 'test-dataset',
      datasetType: 'TARGET_TIME_SERIES',
      domain: 'RETAIL',
      schema: {
        attributes: [
          { attributeName: 'item_id', attributeType: 'string' },
          { attributeName: 'timestamp', attributeType: 'timestamp' },
          { attributeName: 'demand', attributeType: 'float' },
        ],
      },
    });
    const mixin = new CfnDatasetEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Forecast::Dataset', {
      DatasetName: 'test-dataset',
      EncryptionConfig: {
        kmsKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

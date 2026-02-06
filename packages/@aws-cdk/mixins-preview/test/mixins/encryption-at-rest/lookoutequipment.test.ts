/**
 * Unit tests for AWS LookoutEquipment encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::LookoutEquipment::InferenceScheduler
 */

import { CfnInferenceScheduler } from 'aws-cdk-lib/aws-lookoutequipment';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnInferenceSchedulerEncryptionAtRestMixin } from '../../../lib/services/aws-lookoutequipment/encryption-at-rest-mixins.generated';

describe('CfnInferenceSchedulerEncryptionAtRestMixin', () => {
  test('supports CfnInferenceScheduler', () => {
    const { stack } = createTestContext();
    const resource = new CfnInferenceScheduler(stack, 'Resource', {
      dataInputConfiguration: {
        s3InputConfiguration: {
          bucket: 'test-bucket',
        },
      },
      dataOutputConfiguration: {
        s3OutputConfiguration: {
          bucket: 'test-output-bucket',
        },
      },
      dataUploadFrequency: 'PT5M',
      modelName: 'test-model',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnInferenceSchedulerEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnInferenceSchedulerEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnInferenceScheduler(stack, 'Resource', {
      dataInputConfiguration: {
        s3InputConfiguration: {
          bucket: 'test-bucket',
        },
      },
      dataOutputConfiguration: {
        s3OutputConfiguration: {
          bucket: 'test-output-bucket',
        },
      },
      dataUploadFrequency: 'PT5M',
      modelName: 'test-model',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnInferenceSchedulerEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::LookoutEquipment::InferenceScheduler', {
      ModelName: 'test-model',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnInferenceScheduler(stack, 'Resource', {
      dataInputConfiguration: {
        s3InputConfiguration: {
          bucket: 'test-bucket',
        },
      },
      dataOutputConfiguration: {
        s3OutputConfiguration: {
          bucket: 'test-output-bucket',
        },
      },
      dataUploadFrequency: 'PT5M',
      modelName: 'test-model',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnInferenceSchedulerEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::LookoutEquipment::InferenceScheduler', {
      ModelName: 'test-model',
      ServerSideKmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

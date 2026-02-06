/**
 * Unit tests for AWS Omics encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Omics::AnnotationStore
 * - AWS::Omics::ReferenceStore
 * - AWS::Omics::SequenceStore
 * - AWS::Omics::VariantStore
 *
 * All Omics resources support optional KMS encryption through nested sseConfig properties.
 * When a KMS key is provided, customer-managed encryption is enabled via the sseConfig.keyArn property.
 */

import { CfnAnnotationStore, CfnReferenceStore, CfnSequenceStore, CfnVariantStore } from 'aws-cdk-lib/aws-omics';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnAnnotationStoreEncryptionAtRestMixin,
  CfnReferenceStoreEncryptionAtRestMixin,
  CfnSequenceStoreEncryptionAtRestMixin,
  CfnVariantStoreEncryptionAtRestMixin,
} from '../../../lib/services/aws-omics/encryption-at-rest-mixins.generated';

describe('CfnAnnotationStoreEncryptionAtRestMixin', () => {
  test('supports CfnAnnotationStore', () => {
    const { stack } = createTestContext();
    const resource = new CfnAnnotationStore(stack, 'Resource', {
      name: 'my-annotation-store',
      storeFormat: 'VCF',
    });
    const mixin = new CfnAnnotationStoreEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnAnnotationStoreEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnAnnotationStore(stack, 'Resource', {
      name: 'my-annotation-store',
      storeFormat: 'VCF',
    });
    const mixin = new CfnAnnotationStoreEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no SseConfig is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Omics::AnnotationStore', {
      Name: 'my-annotation-store',
      StoreFormat: 'VCF',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnAnnotationStore(stack, 'Resource', {
      name: 'my-annotation-store',
      storeFormat: 'VCF',
    });
    const mixin = new CfnAnnotationStoreEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Omics::AnnotationStore', {
      Name: 'my-annotation-store',
      StoreFormat: 'VCF',
      SseConfig: {
        Type: 'KMS',
        KeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

describe('CfnReferenceStoreEncryptionAtRestMixin', () => {
  test('supports CfnReferenceStore', () => {
    const { stack } = createTestContext();
    const resource = new CfnReferenceStore(stack, 'Resource', {
      name: 'my-reference-store',
    });
    const mixin = new CfnReferenceStoreEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnReferenceStoreEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnReferenceStore(stack, 'Resource', {
      name: 'my-reference-store',
    });
    const mixin = new CfnReferenceStoreEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no SseConfig is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Omics::ReferenceStore', {
      Name: 'my-reference-store',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnReferenceStore(stack, 'Resource', {
      name: 'my-reference-store',
    });
    const mixin = new CfnReferenceStoreEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Omics::ReferenceStore', {
      Name: 'my-reference-store',
      SseConfig: {
        Type: 'KMS',
        KeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

describe('CfnSequenceStoreEncryptionAtRestMixin', () => {
  test('supports CfnSequenceStore', () => {
    const { stack } = createTestContext();
    const resource = new CfnSequenceStore(stack, 'Resource', {
      name: 'my-sequence-store',
    });
    const mixin = new CfnSequenceStoreEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnSequenceStoreEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnSequenceStore(stack, 'Resource', {
      name: 'my-sequence-store',
    });
    const mixin = new CfnSequenceStoreEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no SseConfig is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Omics::SequenceStore', {
      Name: 'my-sequence-store',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnSequenceStore(stack, 'Resource', {
      name: 'my-sequence-store',
    });
    const mixin = new CfnSequenceStoreEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Omics::SequenceStore', {
      Name: 'my-sequence-store',
      SseConfig: {
        Type: 'KMS',
        KeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

describe('CfnVariantStoreEncryptionAtRestMixin', () => {
  test('supports CfnVariantStore', () => {
    const { stack } = createTestContext();
    const resource = new CfnVariantStore(stack, 'Resource', {
      name: 'my-variant-store',
      reference: {
        referenceArn: 'arn:aws:omics:us-east-1:123456789012:referenceStore/1234567890/reference/1234567890',
      },
    });
    const mixin = new CfnVariantStoreEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnVariantStoreEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnVariantStore(stack, 'Resource', {
      name: 'my-variant-store',
      reference: {
        referenceArn: 'arn:aws:omics:us-east-1:123456789012:referenceStore/1234567890/reference/1234567890',
      },
    });
    const mixin = new CfnVariantStoreEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no SseConfig is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Omics::VariantStore', {
      Name: 'my-variant-store',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnVariantStore(stack, 'Resource', {
      name: 'my-variant-store',
      reference: {
        referenceArn: 'arn:aws:omics:us-east-1:123456789012:referenceStore/1234567890/reference/1234567890',
      },
    });
    const mixin = new CfnVariantStoreEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Omics::VariantStore', {
      Name: 'my-variant-store',
      SseConfig: {
        Type: 'KMS',
        KeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

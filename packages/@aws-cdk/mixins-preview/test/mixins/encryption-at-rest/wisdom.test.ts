/**
 * Unit tests for AWS Wisdom encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Wisdom::Assistant
 * - AWS::Wisdom::KnowledgeBase
 */

import { CfnAssistant, CfnKnowledgeBase } from 'aws-cdk-lib/aws-wisdom';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnAssistantEncryptionAtRestMixin,
  CfnKnowledgeBaseEncryptionAtRestMixin,
} from '../../../lib/services/aws-wisdom/encryption-at-rest-mixins.generated';

describe('CfnAssistantEncryptionAtRestMixin', () => {
  test('supports CfnAssistant', () => {
    const { stack } = createTestContext();
    const resource = new CfnAssistant(stack, 'Resource', {
      name: 'test-assistant',
      type: 'AGENT',
    });
    const mixin = new CfnAssistantEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnAssistantEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnAssistant(stack, 'Resource', {
      name: 'test-assistant',
      type: 'AGENT',
    });
    const mixin = new CfnAssistantEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Wisdom::Assistant', {
      Name: 'test-assistant',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnAssistant(stack, 'Resource', {
      name: 'test-assistant',
      type: 'AGENT',
    });
    const mixin = new CfnAssistantEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Wisdom::Assistant', {
      Name: 'test-assistant',
      ServerSideEncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

describe('CfnKnowledgeBaseEncryptionAtRestMixin', () => {
  test('supports CfnKnowledgeBase', () => {
    const { stack } = createTestContext();
    const resource = new CfnKnowledgeBase(stack, 'Resource', {
      name: 'test-knowledge-base',
      knowledgeBaseType: 'CUSTOM',
    });
    const mixin = new CfnKnowledgeBaseEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnKnowledgeBaseEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnKnowledgeBase(stack, 'Resource', {
      name: 'test-knowledge-base',
      knowledgeBaseType: 'CUSTOM',
    });
    const mixin = new CfnKnowledgeBaseEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Wisdom::KnowledgeBase', {
      Name: 'test-knowledge-base',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnKnowledgeBase(stack, 'Resource', {
      name: 'test-knowledge-base',
      knowledgeBaseType: 'CUSTOM',
    });
    const mixin = new CfnKnowledgeBaseEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Wisdom::KnowledgeBase', {
      Name: 'test-knowledge-base',
      ServerSideEncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

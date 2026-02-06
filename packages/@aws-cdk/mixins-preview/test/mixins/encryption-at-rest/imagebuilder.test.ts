/**
 * Unit tests for AWS ImageBuilder encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::ImageBuilder::Component
 * - AWS::ImageBuilder::ContainerRecipe
 * - AWS::ImageBuilder::Workflow
 *
 * ImageBuilder supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyId property.
 */

import { CfnComponent, CfnContainerRecipe, CfnWorkflow } from 'aws-cdk-lib/aws-imagebuilder';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnComponentEncryptionAtRestMixin,
  CfnContainerRecipeEncryptionAtRestMixin,
  CfnWorkflowEncryptionAtRestMixin,
} from '../../../lib/services/aws-imagebuilder/encryption-at-rest-mixins.generated';

describe('CfnComponentEncryptionAtRestMixin', () => {
  test('supports CfnComponent', () => {
    const { stack } = createTestContext();
    const resource = new CfnComponent(stack, 'Resource', {
      name: 'test-component',
      platform: 'Linux',
      version: '1.0.0',
    });
    const mixin = new CfnComponentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnComponentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnComponent(stack, 'Resource', {
      name: 'test-component',
      platform: 'Linux',
      version: '1.0.0',
    });
    const mixin = new CfnComponentEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ImageBuilder::Component', {
      Name: 'test-component',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnComponent(stack, 'Resource', {
      name: 'test-component',
      platform: 'Linux',
      version: '1.0.0',
    });
    const mixin = new CfnComponentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ImageBuilder::Component', {
      Name: 'test-component',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnComponent(stack, 'Resource', {
      name: 'test-component',
      platform: 'Linux',
      version: '1.0.0',
    });
    const mixin = new CfnComponentEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnContainerRecipeEncryptionAtRestMixin', () => {
  test('supports CfnContainerRecipe', () => {
    const { stack } = createTestContext();
    const resource = new CfnContainerRecipe(stack, 'Resource', {
      components: [],
      containerType: 'DOCKER',
      name: 'test-recipe',
      parentImage: 'amazonlinux:latest',
      targetRepository: {
        repositoryName: 'test-repo',
        service: 'ECR',
      },
      version: '1.0.0',
    });
    const mixin = new CfnContainerRecipeEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnContainerRecipe(stack, 'Resource', {
      components: [],
      containerType: 'DOCKER',
      name: 'test-recipe',
      parentImage: 'amazonlinux:latest',
      targetRepository: {
        repositoryName: 'test-repo',
        service: 'ECR',
      },
      version: '1.0.0',
    });
    const mixin = new CfnContainerRecipeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ImageBuilder::ContainerRecipe', {
      Name: 'test-recipe',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnContainerRecipe(stack, 'Resource', {
      components: [],
      containerType: 'DOCKER',
      name: 'test-recipe',
      parentImage: 'amazonlinux:latest',
      targetRepository: {
        repositoryName: 'test-repo',
        service: 'ECR',
      },
      version: '1.0.0',
    });
    const mixin = new CfnContainerRecipeEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnWorkflowEncryptionAtRestMixin', () => {
  test('supports CfnWorkflow', () => {
    const { stack } = createTestContext();
    const resource = new CfnWorkflow(stack, 'Resource', {
      name: 'test-workflow',
      type: 'BUILD',
      version: '1.0.0',
    });
    const mixin = new CfnWorkflowEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnWorkflow(stack, 'Resource', {
      name: 'test-workflow',
      type: 'BUILD',
      version: '1.0.0',
    });
    const mixin = new CfnWorkflowEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::ImageBuilder::Workflow', {
      Name: 'test-workflow',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnWorkflow(stack, 'Resource', {
      name: 'test-workflow',
      type: 'BUILD',
      version: '1.0.0',
    });
    const mixin = new CfnWorkflowEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

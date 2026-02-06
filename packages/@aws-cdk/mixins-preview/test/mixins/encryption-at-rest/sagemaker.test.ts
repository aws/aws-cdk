/**
 * Unit tests for AWS SageMaker encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::SageMaker::Domain
 * - AWS::SageMaker::EndpointConfig
 * - AWS::SageMaker::InferenceExperiment
 * - AWS::SageMaker::NotebookInstance
 * - AWS::SageMaker::PartnerApp
 */

import {
  CfnDomain,
  CfnEndpointConfig,
  CfnInferenceExperiment,
  CfnNotebookInstance,
  CfnPartnerApp,
} from 'aws-cdk-lib/aws-sagemaker';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnDomainEncryptionAtRestMixin,
  CfnEndpointConfigEncryptionAtRestMixin,
  CfnInferenceExperimentEncryptionAtRestMixin,
  CfnNotebookInstanceEncryptionAtRestMixin,
  CfnPartnerAppEncryptionAtRestMixin,
} from '../../../lib/services/aws-sagemaker/encryption-at-rest-mixins.generated';

describe('CfnDomainEncryptionAtRestMixin', () => {
  test('supports CfnDomain', () => {
    const { stack } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      authMode: 'IAM',
      defaultUserSettings: {
        executionRole: 'arn:aws:iam::123456789012:role/test-role',
      },
      domainName: 'test-domain',
      vpcId: 'vpc-12345678',
      subnetIds: ['subnet-12345678'],
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDomainEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      authMode: 'IAM',
      defaultUserSettings: {
        executionRole: 'arn:aws:iam::123456789012:role/test-role',
      },
      domainName: 'test-domain',
      vpcId: 'vpc-12345678',
      subnetIds: ['subnet-12345678'],
    });
    const mixin = new CfnDomainEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::Domain', {
      DomainName: 'test-domain',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      authMode: 'IAM',
      defaultUserSettings: {
        executionRole: 'arn:aws:iam::123456789012:role/test-role',
      },
      domainName: 'test-domain',
      vpcId: 'vpc-12345678',
      subnetIds: ['subnet-12345678'],
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::Domain', {
      DomainName: 'test-domain',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnEndpointConfigEncryptionAtRestMixin', () => {
  test('supports CfnEndpointConfig', () => {
    const { stack } = createTestContext();
    const resource = new CfnEndpointConfig(stack, 'Resource', {
      productionVariants: [
        {
          modelName: 'test-model',
          variantName: 'test-variant',
          initialInstanceCount: 1,
          instanceType: 'ml.t2.medium',
        },
      ],
    });
    const mixin = new CfnEndpointConfigEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEndpointConfigEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEndpointConfig(stack, 'Resource', {
      productionVariants: [
        {
          modelName: 'test-model',
          variantName: 'test-variant',
          initialInstanceCount: 1,
          instanceType: 'ml.t2.medium',
        },
      ],
    });
    const mixin = new CfnEndpointConfigEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::EndpointConfig', {
      ProductionVariants: [
        {
          ModelName: 'test-model',
          VariantName: 'test-variant',
        },
      ],
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEndpointConfig(stack, 'Resource', {
      productionVariants: [
        {
          modelName: 'test-model',
          variantName: 'test-variant',
          initialInstanceCount: 1,
          instanceType: 'ml.t2.medium',
        },
      ],
    });
    const mixin = new CfnEndpointConfigEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::EndpointConfig', {
      ProductionVariants: [
        {
          ModelName: 'test-model',
          VariantName: 'test-variant',
        },
      ],
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnInferenceExperimentEncryptionAtRestMixin', () => {
  test('supports CfnInferenceExperiment', () => {
    const { stack } = createTestContext();
    const resource = new CfnInferenceExperiment(stack, 'Resource', {
      name: 'test-experiment',
      type: 'ShadowMode',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      endpointName: 'test-endpoint',
      modelVariants: [
        {
          modelName: 'test-model',
          variantName: 'test-variant',
          infrastructureConfig: {
            infrastructureType: 'RealTimeInference',
            realTimeInferenceConfig: {
              instanceType: 'ml.t2.medium',
              instanceCount: 1,
            },
          },
        },
      ],
    });
    const mixin = new CfnInferenceExperimentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnInferenceExperimentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnInferenceExperiment(stack, 'Resource', {
      name: 'test-experiment',
      type: 'ShadowMode',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      endpointName: 'test-endpoint',
      modelVariants: [
        {
          modelName: 'test-model',
          variantName: 'test-variant',
          infrastructureConfig: {
            infrastructureType: 'RealTimeInference',
            realTimeInferenceConfig: {
              instanceType: 'ml.t2.medium',
              instanceCount: 1,
            },
          },
        },
      ],
    });
    const mixin = new CfnInferenceExperimentEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::InferenceExperiment', {
      Name: 'test-experiment',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnInferenceExperiment(stack, 'Resource', {
      name: 'test-experiment',
      type: 'ShadowMode',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      endpointName: 'test-endpoint',
      modelVariants: [
        {
          modelName: 'test-model',
          variantName: 'test-variant',
          infrastructureConfig: {
            infrastructureType: 'RealTimeInference',
            realTimeInferenceConfig: {
              instanceType: 'ml.t2.medium',
              instanceCount: 1,
            },
          },
        },
      ],
    });
    const mixin = new CfnInferenceExperimentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::InferenceExperiment', {
      Name: 'test-experiment',
      KmsKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnNotebookInstanceEncryptionAtRestMixin', () => {
  test('supports CfnNotebookInstance', () => {
    const { stack } = createTestContext();
    const resource = new CfnNotebookInstance(stack, 'Resource', {
      instanceType: 'ml.t2.medium',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnNotebookInstanceEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnNotebookInstanceEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnNotebookInstance(stack, 'Resource', {
      instanceType: 'ml.t2.medium',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnNotebookInstanceEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::NotebookInstance', {
      InstanceType: 'ml.t2.medium',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnNotebookInstance(stack, 'Resource', {
      instanceType: 'ml.t2.medium',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnNotebookInstanceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::NotebookInstance', {
      InstanceType: 'ml.t2.medium',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnPartnerAppEncryptionAtRestMixin', () => {
  test('supports CfnPartnerApp', () => {
    const { stack } = createTestContext();
    const resource = new CfnPartnerApp(stack, 'Resource', {
      name: 'test-partner-app',
      type: 'lakera-guard',
      tier: 'Standard',
      authType: 'IAM',
      executionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnPartnerAppEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnPartnerAppEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnPartnerApp(stack, 'Resource', {
      name: 'test-partner-app',
      type: 'lakera-guard',
      tier: 'Standard',
      authType: 'IAM',
      executionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnPartnerAppEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::PartnerApp', {
      Name: 'test-partner-app',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnPartnerApp(stack, 'Resource', {
      name: 'test-partner-app',
      type: 'lakera-guard',
      tier: 'Standard',
      authType: 'IAM',
      executionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnPartnerAppEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SageMaker::PartnerApp', {
      Name: 'test-partner-app',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

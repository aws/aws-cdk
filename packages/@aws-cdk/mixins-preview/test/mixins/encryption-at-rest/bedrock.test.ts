/**
 * Unit tests for AWS Bedrock encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Bedrock::Agent
 * - AWS::Bedrock::AutomatedReasoningPolicy
 * - AWS::Bedrock::Blueprint
 * - AWS::Bedrock::DataAutomationProject
 * - AWS::Bedrock::DataSource
 * - AWS::Bedrock::Flow
 * - AWS::Bedrock::Guardrail
 * - AWS::Bedrock::Prompt
 */

import {
  CfnAgent,
  CfnAutomatedReasoningPolicy,
  CfnBlueprint,
  CfnDataAutomationProject,
  CfnDataSource,
  CfnFlow,
  CfnGuardrail,
  CfnPrompt,
} from 'aws-cdk-lib/aws-bedrock';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnAgentEncryptionAtRestMixin,
  CfnAutomatedReasoningPolicyEncryptionAtRestMixin,
  CfnBlueprintEncryptionAtRestMixin,
  CfnDataAutomationProjectEncryptionAtRestMixin,
  CfnDataSourceEncryptionAtRestMixin,
  CfnFlowEncryptionAtRestMixin,
  CfnGuardrailEncryptionAtRestMixin,
  CfnPromptEncryptionAtRestMixin,
} from '../../../lib/services/aws-bedrock/encryption-at-rest-mixins.generated';

describe('CfnAgentEncryptionAtRestMixin', () => {
  test('supports CfnAgent', () => {
    const { stack } = createTestContext();
    const resource = new CfnAgent(stack, 'Resource', {
      agentName: 'test-agent',
    });
    const mixin = new CfnAgentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnAgentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnAgent(stack, 'Resource', {
      agentName: 'test-agent',
    });
    const mixin = new CfnAgentEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Agent', {
      AgentName: 'test-agent',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnAgent(stack, 'Resource', {
      agentName: 'test-agent',
    });
    const mixin = new CfnAgentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Agent', {
      AgentName: 'test-agent',
      CustomerEncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnAutomatedReasoningPolicyEncryptionAtRestMixin', () => {
  test('supports CfnAutomatedReasoningPolicy', () => {
    const { stack } = createTestContext();
    const resource = new CfnAutomatedReasoningPolicy(stack, 'Resource', {
      name: 'test-policy',
    });
    const mixin = new CfnAutomatedReasoningPolicyEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnAutomatedReasoningPolicyEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnAutomatedReasoningPolicy(stack, 'Resource', {
      name: 'test-policy',
    });
    const mixin = new CfnAutomatedReasoningPolicyEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::AutomatedReasoningPolicy', {
      Name: 'test-policy',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnAutomatedReasoningPolicy(stack, 'Resource', {
      name: 'test-policy',
    });
    const mixin = new CfnAutomatedReasoningPolicyEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::AutomatedReasoningPolicy', {
      Name: 'test-policy',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnBlueprintEncryptionAtRestMixin', () => {
  test('supports CfnBlueprint', () => {
    const { stack } = createTestContext();
    const resource = new CfnBlueprint(stack, 'Resource', {
      blueprintName: 'test-blueprint',
      type: 'DOCUMENT_PROCESSING',
      schema: { type: 'object' },
    });
    const mixin = new CfnBlueprintEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnBlueprintEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnBlueprint(stack, 'Resource', {
      blueprintName: 'test-blueprint',
      type: 'DOCUMENT_PROCESSING',
      schema: { type: 'object' },
    });
    const mixin = new CfnBlueprintEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Blueprint', {
      BlueprintName: 'test-blueprint',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnBlueprint(stack, 'Resource', {
      blueprintName: 'test-blueprint',
      type: 'DOCUMENT_PROCESSING',
      schema: { type: 'object' },
    });
    const mixin = new CfnBlueprintEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Blueprint', {
      BlueprintName: 'test-blueprint',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnDataAutomationProjectEncryptionAtRestMixin', () => {
  test('supports CfnDataAutomationProject', () => {
    const { stack } = createTestContext();
    const resource = new CfnDataAutomationProject(stack, 'Resource', {
      projectName: 'test-project',
    });
    const mixin = new CfnDataAutomationProjectEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDataAutomationProjectEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDataAutomationProject(stack, 'Resource', {
      projectName: 'test-project',
    });
    const mixin = new CfnDataAutomationProjectEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::DataAutomationProject', {
      ProjectName: 'test-project',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataAutomationProject(stack, 'Resource', {
      projectName: 'test-project',
    });
    const mixin = new CfnDataAutomationProjectEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::DataAutomationProject', {
      ProjectName: 'test-project',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnDataSourceEncryptionAtRestMixin', () => {
  test('supports CfnDataSource', () => {
    const { stack } = createTestContext();
    const resource = new CfnDataSource(stack, 'Resource', {
      knowledgeBaseId: 'kb-123',
      name: 'test-datasource',
      dataSourceConfiguration: {
        type: 'S3',
        s3Configuration: {
          bucketArn: 'arn:aws:s3:::test-bucket',
        },
      },
    });
    const mixin = new CfnDataSourceEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDataSourceEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDataSource(stack, 'Resource', {
      knowledgeBaseId: 'kb-123',
      name: 'test-datasource',
      dataSourceConfiguration: {
        type: 'S3',
        s3Configuration: {
          bucketArn: 'arn:aws:s3:::test-bucket',
        },
      },
    });
    const mixin = new CfnDataSourceEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::DataSource', {
      Name: 'test-datasource',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataSource(stack, 'Resource', {
      knowledgeBaseId: 'kb-123',
      name: 'test-datasource',
      dataSourceConfiguration: {
        type: 'S3',
        s3Configuration: {
          bucketArn: 'arn:aws:s3:::test-bucket',
        },
      },
    });
    const mixin = new CfnDataSourceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::DataSource', {
      Name: 'test-datasource',
      ServerSideEncryptionConfiguration: {
        KmsKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});

describe('CfnFlowEncryptionAtRestMixin', () => {
  test('supports CfnFlow', () => {
    const { stack } = createTestContext();
    const resource = new CfnFlow(stack, 'Resource', {
      name: 'test-flow',
      executionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnFlowEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFlowEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFlow(stack, 'Resource', {
      name: 'test-flow',
      executionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnFlowEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Flow', {
      Name: 'test-flow',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnFlow(stack, 'Resource', {
      name: 'test-flow',
      executionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnFlowEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Flow', {
      Name: 'test-flow',
      CustomerEncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnGuardrailEncryptionAtRestMixin', () => {
  test('supports CfnGuardrail', () => {
    const { stack } = createTestContext();
    const resource = new CfnGuardrail(stack, 'Resource', {
      name: 'test-guardrail',
      blockedInputMessaging: 'Input blocked',
      blockedOutputsMessaging: 'Output blocked',
    });
    const mixin = new CfnGuardrailEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnGuardrailEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnGuardrail(stack, 'Resource', {
      name: 'test-guardrail',
      blockedInputMessaging: 'Input blocked',
      blockedOutputsMessaging: 'Output blocked',
    });
    const mixin = new CfnGuardrailEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'test-guardrail',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnGuardrail(stack, 'Resource', {
      name: 'test-guardrail',
      blockedInputMessaging: 'Input blocked',
      blockedOutputsMessaging: 'Output blocked',
    });
    const mixin = new CfnGuardrailEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'test-guardrail',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnPromptEncryptionAtRestMixin', () => {
  test('supports CfnPrompt', () => {
    const { stack } = createTestContext();
    const resource = new CfnPrompt(stack, 'Resource', {
      name: 'test-prompt',
    });
    const mixin = new CfnPromptEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnPromptEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnPrompt(stack, 'Resource', {
      name: 'test-prompt',
    });
    const mixin = new CfnPromptEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Prompt', {
      Name: 'test-prompt',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnPrompt(stack, 'Resource', {
      name: 'test-prompt',
    });
    const mixin = new CfnPromptEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Bedrock::Prompt', {
      Name: 'test-prompt',
      CustomerEncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

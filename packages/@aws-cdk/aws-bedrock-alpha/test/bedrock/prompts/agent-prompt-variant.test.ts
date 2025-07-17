import { App, Stack } from 'aws-cdk-lib';
import * as bedrock from '../../../bedrock';
import { ValidationError } from '../../../bedrock/agents/validation-helpers';

describe('AgentPromptVariant', () => {
  let stack: Stack;
  let foundationModel: bedrock.IBedrockInvokable;
  let mockAgent: bedrock.IAgent;
  let mockAgentAlias: bedrock.IAgentAlias;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');
    foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;

    // Create a mock agent for testing
    mockAgent = bedrock.Agent.fromAgentAttributes(stack, 'MockAgent', {
      agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });

    // Create a mock agent alias for testing
    mockAgentAlias = bedrock.AgentAlias.fromAttributes(stack, 'MockAgentAlias', {
      aliasId: 'test-alias-id',
      aliasName: 'test-alias',
      agent: mockAgent,
      agentVersion: '1',
    });
  });

  describe('createAgentPromptVariant', () => {
    test('creates agent prompt variant with minimal properties', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'test-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Hello agent!',
      });

      expect(variant.name).toBe('test-agent-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
      expect(variant.modelId).toBeUndefined();
      expect(variant.genAiResource).toBeInstanceOf(bedrock.PromptGenAiResource);
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates agent prompt variant with all properties', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'advanced-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Hello {{name}}, please help with {{task}}.',
        promptVariables: ['name', 'task'],
      });

      expect(variant.name).toBe('advanced-agent-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
      expect(variant.modelId).toBeUndefined();
      expect(variant.genAiResource).toBeInstanceOf(bedrock.PromptGenAiResource);
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates agent prompt variant with multiple variables', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'multi-var-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Agent, please process {{input}} for user {{user}} in context {{context}}.',
        promptVariables: ['input', 'user', 'context'],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates agent prompt variant with empty variables array', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'no-vars-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Static agent prompt with no variables.',
        promptVariables: [],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates agent prompt variant without variables', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'undefined-vars-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Static agent prompt.',
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });
  });

  describe('integration with Prompt', () => {
    test('agent variant works with Prompt construct', () => {
      const agentVariant = bedrock.PromptVariant.agent({
        variantName: 'integration-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Integration test: {{message}}',
        promptVariables: ['message'],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'integration-agent-test',
          variants: [agentVariant],
        });
      }).not.toThrow();
    });

    test('multiple agent variants work with Prompt construct', () => {
      const variant1 = bedrock.PromptVariant.agent({
        variantName: 'agent-variant-1',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'First agent variant: {{input}}',
        promptVariables: ['input'],
      });

      const variant2 = bedrock.PromptVariant.agent({
        variantName: 'agent-variant-2',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Second agent variant: {{input}}',
        promptVariables: ['input'],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'multi-agent-variant-test',
          variants: [variant1, variant2],
        });
      }).not.toThrow();
    });

    test('mixed variant types work with Prompt construct', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'text-variant',
        model: foundationModel,
        promptText: 'Text variant: {{input}}',
        promptVariables: ['input'],
      });

      const agentVariant = bedrock.PromptVariant.agent({
        variantName: 'agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Agent variant: {{input}}',
        promptVariables: ['input'],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'mixed-variant-test',
          variants: [textVariant, agentVariant],
        });
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    test('handles special characters in prompt text', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'special-chars-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('handles multiline prompt text', () => {
      const multilineText = `This is a multiline agent prompt.
It spans multiple lines.
And includes {{variable}} placeholders.`;

      const variant = bedrock.PromptVariant.agent({
        variantName: 'multiline-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: multilineText,
        promptVariables: ['variable'],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('handles empty prompt text', () => {
      expect(() => {
        bedrock.PromptVariant.agent({
          variantName: 'empty-text-agent-variant',
          model: foundationModel,
          agentAlias: mockAgentAlias,
          promptText: '',
        });
      }).toThrow(ValidationError);
    });

    test('handles very long prompt text', () => {
      const longText = 'A'.repeat(10000);
      const variant = bedrock.PromptVariant.agent({
        variantName: 'long-text-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: longText,
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });
  });

  describe('agent alias integration', () => {
    test('uses correct agent alias ARN', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'arn-test-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Test prompt',
      });

      expect(variant.genAiResource).toBeInstanceOf(bedrock.PromptGenAiResource);
    });

    test('works with different agent aliases', () => {
      const anotherAgent = bedrock.Agent.fromAgentAttributes(stack, 'AnotherAgent', {
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/another-agent-id',
        roleArn: 'arn:aws:iam::123456789012:role/another-role',
      });

      const anotherAlias = bedrock.AgentAlias.fromAttributes(stack, 'AnotherAlias', {
        aliasId: 'another-alias-id',
        aliasName: 'another-alias',
        agent: anotherAgent,
        agentVersion: '2',
      });

      const variant = bedrock.PromptVariant.agent({
        variantName: 'another-agent-variant',
        model: foundationModel,
        agentAlias: anotherAlias,
        promptText: 'Another agent prompt',
      });

      expect(variant.genAiResource).toBeInstanceOf(bedrock.PromptGenAiResource);
    });
  });

  describe('template configuration', () => {
    test('correctly maps variables to input variables', () => {
      const variables = ['var1', 'var2', 'var3', 'var4', 'var5'];
      const variant = bedrock.PromptVariant.agent({
        variantName: 'many-vars-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Variables: {{var1}} {{var2}} {{var3}} {{var4}} {{var5}}',
        promptVariables: variables,
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('handles duplicate variable names', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'duplicate-vars-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Duplicates: {{name}} {{name}} {{age}} {{name}}',
        promptVariables: ['name', 'name', 'age', 'name'],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('preserves variable order', () => {
      const orderedVariables = ['z', 'a', 'm', 'b', 'y'];
      const variant = bedrock.PromptVariant.agent({
        variantName: 'ordered-vars-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Ordered: {{z}} {{a}} {{m}} {{b}} {{y}}',
        promptVariables: orderedVariables,
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });
  });

  describe('variant properties', () => {
    test('has correct template type', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'template-type-test',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Template type test',
      });

      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
    });

    test('does not set modelId for agent variants', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'model-id-test',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Model ID test',
      });

      expect(variant.modelId).toBeUndefined();
    });

    test('does not set inference configuration for agent variants', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'inference-config-test',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Inference config test',
      });

      expect(variant.inferenceConfiguration).toBeUndefined();
    });

    test('sets genAiResource correctly', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'genai-resource-test',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'GenAI resource test',
      });

      expect(variant.genAiResource).toBeInstanceOf(bedrock.PromptGenAiResource);
    });
  });
});

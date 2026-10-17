import { App, Stack } from 'aws-cdk-lib';
import * as bedrock from '../../../bedrock';

describe('PromptVariant', () => {
  let stack: Stack;
  let foundationModel: bedrock.IBedrockInvokable;
  let mockAgent: bedrock.IAgent;
  let mockAgentAlias: bedrock.IAgentAlias;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');
    foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;

    // Create mock agent and alias for agent variant tests
    mockAgent = bedrock.Agent.fromAgentAttributes(stack, 'MockAgent', {
      agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });

    mockAgentAlias = bedrock.AgentAlias.fromAttributes(stack, 'MockAgentAlias', {
      aliasId: 'test-alias-id',
      aliasName: 'test-alias',
      agent: mockAgent,
      agentVersion: '1',
    });
  });

  describe('PromptTemplateType enum', () => {
    test('has correct values', () => {
      expect(bedrock.PromptTemplateType.TEXT).toBe('TEXT');
      expect(bedrock.PromptTemplateType.CHAT).toBe('CHAT');
    });

    test('enum values are strings', () => {
      expect(typeof bedrock.PromptTemplateType.TEXT).toBe('string');
      expect(typeof bedrock.PromptTemplateType.CHAT).toBe('string');
    });
  });

  describe('PromptVariant factory class', () => {
    test('provides static factory methods', () => {
      expect(typeof bedrock.PromptVariant.text).toBe('function');
      expect(typeof bedrock.PromptVariant.chat).toBe('function');
      expect(typeof bedrock.PromptVariant.agent).toBe('function');
    });
  });

  describe('text factory method', () => {
    test('creates text prompt variant', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'test-text-variant',
        model: foundationModel,
        promptText: 'Hello world!',
      });

      expect(variant.name).toBe('test-text-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
    });

    test('creates text prompt variant with all properties', () => {
      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({
        maxTokens: 100,
        temperature: 0.7,
      });

      const variant = bedrock.PromptVariant.text({
        variantName: 'advanced-text-variant',
        model: foundationModel,
        promptText: 'Hello {{name}}!',
        promptVariables: ['name'],
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.name).toBe('advanced-text-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
      expect(variant.inferenceConfiguration).toBe(inferenceConfig);
    });
  });

  describe('chat factory method', () => {
    test('creates chat prompt variant', () => {
      const messages = [
        bedrock.ChatMessage.user('Hello'),
        bedrock.ChatMessage.assistant('Hi there!'),
      ];

      const variant = bedrock.PromptVariant.chat({
        variantName: 'test-chat-variant',
        model: foundationModel,
        messages,
      });

      expect(variant.name).toBe('test-chat-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.CHAT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
    });

    test('creates chat prompt variant with all properties', () => {
      const messages = [
        bedrock.ChatMessage.user('What is {{topic}}?'),
        bedrock.ChatMessage.assistant('Let me help you with that.'),
      ];

      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({
        maxTokens: 200,
        temperature: 0.8,
      });

      const variant = bedrock.PromptVariant.chat({
        variantName: 'advanced-chat-variant',
        model: foundationModel,
        messages,
        system: 'You are a helpful assistant.',
        promptVariables: ['topic'],
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.name).toBe('advanced-chat-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.CHAT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
      expect(variant.inferenceConfiguration).toBe(inferenceConfig);
    });
  });

  describe('agent factory method', () => {
    test('creates agent prompt variant', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'test-agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Hello agent!',
      });

      expect(variant.name).toBe('test-agent-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
      expect(variant.modelId).toBeUndefined();
      expect(variant.genAiResource).toBeDefined();
    });

    test('creates agent prompt variant with variables', () => {
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
      expect(variant.genAiResource).toBeDefined();
    });
  });

  describe('variant type consistency', () => {
    test('all variants implement IPromptVariant interface', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'text-variant',
        model: foundationModel,
        promptText: 'Text prompt',
      });

      const chatVariant = bedrock.PromptVariant.chat({
        variantName: 'chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Chat message')],
      });

      const agentVariant = bedrock.PromptVariant.agent({
        variantName: 'agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Agent prompt',
      });

      // All variants should have the required properties
      const variants = [textVariant, chatVariant, agentVariant];
      variants.forEach(variant => {
        expect(variant).toHaveProperty('name');
        expect(variant).toHaveProperty('templateType');
        expect(variant).toHaveProperty('templateConfiguration');
        expect(typeof variant.name).toBe('string');
        expect(typeof variant.templateType).toBe('string');
        expect(typeof variant.templateConfiguration).toBe('object');
      });
    });

    test('text and chat variants have modelId, agent variants do not', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'text-variant',
        model: foundationModel,
        promptText: 'Text prompt',
      });

      const chatVariant = bedrock.PromptVariant.chat({
        variantName: 'chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Chat message')],
      });

      const agentVariant = bedrock.PromptVariant.agent({
        variantName: 'agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Agent prompt',
      });

      expect(textVariant.modelId).toBe(foundationModel.invokableArn);
      expect(chatVariant.modelId).toBe(foundationModel.invokableArn);
      expect(agentVariant.modelId).toBeUndefined();
    });

    test('only agent variants have genAiResource', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'text-variant',
        model: foundationModel,
        promptText: 'Text prompt',
      });

      const chatVariant = bedrock.PromptVariant.chat({
        variantName: 'chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Chat message')],
      });

      const agentVariant = bedrock.PromptVariant.agent({
        variantName: 'agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Agent prompt',
      });

      expect(textVariant.genAiResource).toBeUndefined();
      expect(chatVariant.genAiResource).toBeUndefined();
      expect(agentVariant.genAiResource).toBeDefined();
    });

    test('text and chat variants have inference configuration, agent variants do not', () => {
      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({ maxTokens: 100 });

      const textVariant = bedrock.PromptVariant.text({
        variantName: 'text-variant',
        model: foundationModel,
        promptText: 'Text prompt',
        inferenceConfiguration: inferenceConfig,
      });

      const chatVariant = bedrock.PromptVariant.chat({
        variantName: 'chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Chat message')],
        inferenceConfiguration: inferenceConfig,
      });

      const agentVariant = bedrock.PromptVariant.agent({
        variantName: 'agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Agent prompt',
      });

      expect(textVariant.inferenceConfiguration).toBeDefined();
      expect(chatVariant.inferenceConfiguration).toBeDefined();
      expect(agentVariant.inferenceConfiguration).toBeUndefined();
    });
  });

  describe('template configuration structure', () => {
    test('text variants have text template configuration', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'text-variant',
        model: foundationModel,
        promptText: 'Hello {{name}}!',
        promptVariables: ['name'],
      });

      expect(variant.templateConfiguration).toBeDefined();
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('chat variants have chat template configuration', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
      });

      expect(variant.templateConfiguration).toBeDefined();
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('agent variants have text template configuration', () => {
      const variant = bedrock.PromptVariant.agent({
        variantName: 'agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Hello agent!',
      });

      expect(variant.templateConfiguration).toBeDefined();
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });
  });

  describe('integration with Prompt construct', () => {
    test('all variant types work with Prompt construct', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'text-variant',
        model: foundationModel,
        promptText: 'Text: {{input}}',
        promptVariables: ['input'],
      });

      const chatVariant = bedrock.PromptVariant.chat({
        variantName: 'chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Chat: {{input}}')],
        promptVariables: ['input'],
      });

      const agentVariant = bedrock.PromptVariant.agent({
        variantName: 'agent-variant',
        model: foundationModel,
        agentAlias: mockAgentAlias,
        promptText: 'Agent: {{input}}',
        promptVariables: ['input'],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'mixed-variants-test',
          variants: [textVariant, chatVariant, agentVariant],
        });
      }).not.toThrow();
    });

    test('variants can be used as default variant', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'default-text-variant',
        model: foundationModel,
        promptText: 'Default text variant',
      });

      const chatVariant = bedrock.PromptVariant.chat({
        variantName: 'default-chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Default chat variant')],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TextDefaultPrompt', {
          promptName: 'text-default-test',
          variants: [textVariant],
          defaultVariant: textVariant,
        });
      }).not.toThrow();

      expect(() => {
        new bedrock.Prompt(stack, 'ChatDefaultPrompt', {
          promptName: 'chat-default-test',
          variants: [chatVariant],
          defaultVariant: chatVariant,
        });
      }).not.toThrow();
    });
  });

  describe('error handling', () => {
    test('factory methods require valid parameters', () => {
      // These should not throw as they have valid required parameters
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'valid-text',
          model: foundationModel,
          promptText: 'Valid text',
        });
      }).not.toThrow();

      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'valid-chat',
          model: foundationModel,
          messages: [bedrock.ChatMessage.user('Valid message')],
        });
      }).not.toThrow();

      expect(() => {
        bedrock.PromptVariant.agent({
          variantName: 'valid-agent',
          model: foundationModel,
          agentAlias: mockAgentAlias,
          promptText: 'Valid agent text',
        });
      }).not.toThrow();
    });
  });
});

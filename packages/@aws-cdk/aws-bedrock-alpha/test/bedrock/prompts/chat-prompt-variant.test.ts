import { App, Stack } from 'aws-cdk-lib';
import * as bedrock from '../../../bedrock';

describe('ChatPromptVariant', () => {
  let stack: Stack;
  let foundationModel: bedrock.IBedrockInvokable;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');
    foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;
  });

  describe('ChatMessage', () => {
    test('creates user message', () => {
      const message = bedrock.ChatMessage.user('Hello, how are you?');

      expect(message.role).toBe(bedrock.ChatMessageRole.USER);
      expect(message.text).toBe('Hello, how are you?');
    });

    test('creates assistant message', () => {
      const message = bedrock.ChatMessage.assistant('I am doing well, thank you!');

      expect(message.role).toBe(bedrock.ChatMessageRole.ASSISTANT);
      expect(message.text).toBe('I am doing well, thank you!');
    });

    test('renders message correctly', () => {
      const userMessage = bedrock.ChatMessage.user('Test message');
      const rendered = userMessage._render();

      expect(rendered).toEqual({
        role: 'user',
        content: [
          {
            text: 'Test message',
          },
        ],
      });
    });

    test('renders assistant message correctly', () => {
      const assistantMessage = bedrock.ChatMessage.assistant('Assistant response');
      const rendered = assistantMessage._render();

      expect(rendered).toEqual({
        role: 'assistant',
        content: [
          {
            text: 'Assistant response',
          },
        ],
      });
    });
  });

  describe('createChatPromptVariant', () => {
    test('creates chat prompt variant with minimal properties', () => {
      const messages = [
        bedrock.ChatMessage.user('Hello'),
      ];

      const variant = bedrock.PromptVariant.chat({
        variantName: 'test-chat-variant',
        model: foundationModel,
        messages,
      });

      expect(variant.name).toBe('test-chat-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.CHAT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
      expect(variant.inferenceConfiguration).toEqual({
        text: {},
      });
      expect((variant.templateConfiguration.chat as any)?.messages).toHaveLength(1);
      expect((variant.templateConfiguration.chat as any)?.system).toBeUndefined();
      expect((variant.templateConfiguration.chat as any)?.toolConfiguration).toBeUndefined();
    });

    test('creates chat prompt variant with all properties', () => {
      const messages = [
        bedrock.ChatMessage.user('What is the weather like?'),
        bedrock.ChatMessage.assistant('I can help you with weather information.'),
        bedrock.ChatMessage.user('Tell me about {{city}}'),
      ];

      const inferenceConfig = {
        maxTokens: 200,
        temperature: 0.8,
      };

      const variant = bedrock.PromptVariant.chat({
        variantName: 'advanced-chat-variant',
        model: foundationModel,
        messages,
        system: 'You are a helpful weather assistant.',
        promptVariables: ['city'],
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.name).toBe('advanced-chat-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.CHAT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
      expect(variant.inferenceConfiguration).toEqual({
        text: inferenceConfig,
      });
      expect((variant.templateConfiguration.chat as any)?.messages).toHaveLength(3);
      expect((variant.templateConfiguration.chat as any)?.system).toEqual([{ text: 'You are a helpful weather assistant.' }]);
      expect((variant.templateConfiguration.chat as any)?.inputVariables).toEqual([{ name: 'city' }]);
    });

    test('creates chat prompt variant with tool configuration', () => {
      const messages = [
        bedrock.ChatMessage.user('Use tools to help me'),
      ];

      const toolConfig = {
        toolChoice: bedrock.ToolChoice.AUTO,
        tools: [
          {
            toolSpec: {
              name: 'weather_tool',
              description: 'Get weather information',
              inputSchema: {
                json: {
                  type: 'object',
                  properties: {
                    city: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      };

      const variant = bedrock.PromptVariant.chat({
        variantName: 'tool-chat-variant',
        model: foundationModel,
        messages,
        toolConfiguration: toolConfig,
      });

      expect((variant.templateConfiguration.chat as any)?.toolConfiguration).toBeDefined();
      expect((variant.templateConfiguration.chat as any)?.toolConfiguration.toolChoice).toEqual(bedrock.ToolChoice.AUTO._render());
      expect((variant.templateConfiguration.chat as any)?.toolConfiguration.tools).toEqual(toolConfig.tools);
    });

    test('creates chat prompt variant with multiple variables', () => {
      const messages = [
        bedrock.ChatMessage.user('Hello {{name}}, you are {{age}} years old'),
        bedrock.ChatMessage.assistant('Nice to meet you!'),
        bedrock.ChatMessage.user('Tell me about {{topic}}'),
      ];

      const variant = bedrock.PromptVariant.chat({
        variantName: 'multi-var-chat-variant',
        model: foundationModel,
        messages,
        promptVariables: ['name', 'age', 'topic'],
      });

      expect((variant.templateConfiguration.chat as any)?.inputVariables).toEqual([
        { name: 'name' },
        { name: 'age' },
        { name: 'topic' },
      ]);
    });

    test('creates chat prompt variant without variables', () => {
      const messages = [
        bedrock.ChatMessage.user('Static message'),
        bedrock.ChatMessage.assistant('Static response'),
      ];

      const variant = bedrock.PromptVariant.chat({
        variantName: 'no-vars-chat-variant',
        model: foundationModel,
        messages,
      });

      expect((variant.templateConfiguration.chat as any)?.inputVariables).toBeUndefined();
    });
  });

  describe('ToolChoice', () => {
    test('creates ANY tool choice', () => {
      const toolChoice = bedrock.ToolChoice.ANY;
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: {},
        auto: undefined,
        tool: undefined,
      });
    });

    test('creates AUTO tool choice', () => {
      const toolChoice = bedrock.ToolChoice.AUTO;
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: {},
        tool: undefined,
      });
    });

    test('creates specific tool choice', () => {
      const toolChoice = bedrock.ToolChoice.specificTool('weather_tool');
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: undefined,
        tool: { name: 'weather_tool' },
      });
    });
  });

  describe('integration with Prompt', () => {
    test('chat variant works with Prompt construct', () => {
      const messages = [
        bedrock.ChatMessage.user('Integration test message'),
        bedrock.ChatMessage.assistant('Integration test response'),
      ];

      const chatVariant = bedrock.PromptVariant.chat({
        variantName: 'integration-chat-variant',
        model: foundationModel,
        messages,
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'integration-chat-test',
          variants: [chatVariant],
        });
      }).not.toThrow();
    });

    test('multiple chat variants work with Prompt construct', () => {
      const variant1 = bedrock.PromptVariant.chat({
        variantName: 'chat-variant-1',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('First variant')],
      });

      const variant2 = bedrock.PromptVariant.chat({
        variantName: 'chat-variant-2',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Second variant')],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'multi-chat-variant-test',
          variants: [variant1, variant2],
        });
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    test('handles empty messages array', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'empty-messages-variant',
          model: foundationModel,
          messages: [],
        });
      }).not.toThrow();
    });

    test('handles single message', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'single-message-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Single message')],
      });

      expect((variant.templateConfiguration.chat as any)?.messages).toHaveLength(1);
    });

    test('handles alternating user and assistant messages', () => {
      const messages = [
        bedrock.ChatMessage.user('User message 1'),
        bedrock.ChatMessage.assistant('Assistant response 1'),
        bedrock.ChatMessage.user('User message 2'),
        bedrock.ChatMessage.assistant('Assistant response 2'),
      ];

      const variant = bedrock.PromptVariant.chat({
        variantName: 'alternating-messages-variant',
        model: foundationModel,
        messages,
      });

      expect((variant.templateConfiguration.chat as any)?.messages).toHaveLength(4);
    });

    test('handles special characters in messages', () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const message = bedrock.ChatMessage.user(specialText);

      expect(message.text).toBe(specialText);
    });

    test('handles multiline messages', () => {
      const multilineText = `This is a multiline message.
It spans multiple lines.
And includes {{variable}} placeholders.`;

      const message = bedrock.ChatMessage.user(multilineText);
      expect(message.text).toBe(multilineText);
    });

    test('handles empty message text', () => {
      const message = bedrock.ChatMessage.user('');
      expect(message.text).toBe('');
    });

    test('handles very long message text', () => {
      const longText = 'A'.repeat(10000);
      const message = bedrock.ChatMessage.user(longText);
      expect(message.text).toBe(longText);
    });
  });

  describe('system message', () => {
    test('handles undefined system message', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'no-system-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        system: undefined,
      });

      expect((variant.templateConfiguration.chat as any)?.system).toBeUndefined();
    });

    test('handles empty system message', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'empty-system-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        system: '',
      });

      expect((variant.templateConfiguration.chat as any)?.system).toEqual([{ text: '' }]);
    });

    test('handles long system message', () => {
      const longSystemMessage = 'A'.repeat(1000);
      const variant = bedrock.PromptVariant.chat({
        variantName: 'long-system-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        system: longSystemMessage,
      });

      expect((variant.templateConfiguration.chat as any)?.system).toEqual([{ text: longSystemMessage }]);
    });
  });

  describe('inference configuration', () => {
    test('handles undefined inference configuration', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'no-inference-chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        inferenceConfiguration: undefined,
      });

      expect(variant.inferenceConfiguration).toEqual({
        text: {},
      });
    });

    test('handles empty inference configuration object', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'empty-inference-chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        inferenceConfiguration: {},
      });

      expect(variant.inferenceConfiguration).toEqual({
        text: {},
      });
    });

    test('preserves all inference configuration properties', () => {
      const inferenceConfig = {
        maxTokens: 500,
        temperature: 0.5,
        topP: 0.8,
        topK: 50,
        stopSequences: ['END', 'STOP'],
      };

      const variant = bedrock.PromptVariant.chat({
        variantName: 'full-inference-chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.inferenceConfiguration).toEqual({
        text: inferenceConfig,
      });
    });
  });
});

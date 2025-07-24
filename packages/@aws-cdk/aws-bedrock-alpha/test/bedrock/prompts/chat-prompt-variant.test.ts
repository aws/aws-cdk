import { App, Stack } from 'aws-cdk-lib';
import * as bedrock from '../../../bedrock';
import { ValidationError } from '../../../bedrock/agents/validation-helpers';

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
      expect(variant.inferenceConfiguration).toBeUndefined();
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates chat prompt variant with all properties', () => {
      const messages = [
        bedrock.ChatMessage.user('What is the weather like?'),
        bedrock.ChatMessage.assistant('I can help you with weather information.'),
        bedrock.ChatMessage.user('Tell me about {{city}}'),
      ];

      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({
        maxTokens: 200,
        temperature: 0.8,
      });

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
      expect(variant.inferenceConfiguration).toBe(inferenceConfig);
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates chat prompt variant with tool configuration', () => {
      const messages = [
        bedrock.ChatMessage.user('Use tools to help me'),
      ];

      const toolConfig = {
        toolChoice: bedrock.ToolChoice.AUTO,
        tools: [
          bedrock.Tool.function({
            name: 'weather_tool',
            description: 'Get weather information',
            inputSchema: {
              type: 'object',
              properties: {
                city: { type: 'string' },
              },
            },
          }),
        ],
      };

      const variant = bedrock.PromptVariant.chat({
        variantName: 'tool-chat-variant',
        model: foundationModel,
        messages,
        toolConfiguration: toolConfig,
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
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

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
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

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
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
      }).toThrow(ValidationError);
    });

    test('handles single message', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'single-message-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Single message')],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
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

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
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

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('handles empty system message', () => {
      const variant = bedrock.PromptVariant.chat({
        variantName: 'empty-system-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        system: '',
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('handles long system message', () => {
      const longSystemMessage = 'A'.repeat(1000);
      const variant = bedrock.PromptVariant.chat({
        variantName: 'long-system-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        system: longSystemMessage,
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
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

      expect(variant.inferenceConfiguration).toBeUndefined();
    });

    test('handles empty inference configuration object', () => {
      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({});

      const variant = bedrock.PromptVariant.chat({
        variantName: 'empty-inference-chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.inferenceConfiguration).toBe(inferenceConfig);
    });

    test('preserves all inference configuration properties', () => {
      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({
        maxTokens: 500,
        temperature: 0.5,
        topP: 0.8,
        stopSequences: ['END', 'STOP'],
      });

      const variant = bedrock.PromptVariant.chat({
        variantName: 'full-inference-chat-variant',
        model: foundationModel,
        messages: [bedrock.ChatMessage.user('Hello')],
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.inferenceConfiguration).toBe(inferenceConfig);
    });
  });

  describe('validation', () => {
    test('throws ValidationError for empty messages array', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [],
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError for undefined messages', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: undefined as any,
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError for null messages', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: null as any,
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError when first message is not user message', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.assistant('I am an assistant'),
          ],
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError for consecutive user messages', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('First user message'),
            bedrock.ChatMessage.user('Second user message'),
          ],
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError for consecutive assistant messages', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('User message'),
            bedrock.ChatMessage.assistant('First assistant message'),
            bedrock.ChatMessage.assistant('Second assistant message'),
          ],
        });
      }).toThrow(ValidationError);
    });

    test('accepts valid alternating user-assistant pattern', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('User message 1'),
            bedrock.ChatMessage.assistant('Assistant response 1'),
            bedrock.ChatMessage.user('User message 2'),
            bedrock.ChatMessage.assistant('Assistant response 2'),
          ],
        });
      }).not.toThrow();
    });

    test('accepts single user message', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('Single user message'),
          ],
        });
      }).not.toThrow();
    });

    test('accepts user-assistant pattern', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('User message'),
            bedrock.ChatMessage.assistant('Assistant response'),
          ],
        });
      }).not.toThrow();
    });

    test('validation error messages are descriptive', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [],
        });
      }).toThrow('At least one message must be provided');

      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.assistant('Assistant first'),
          ],
        });
      }).toThrow('The first message must be a User message');

      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('User message'),
            bedrock.ChatMessage.user('Another user message'),
          ],
        });
      }).toThrow('Messages must alternate between User and Assistant roles');
    });

    test('validation works with complex message patterns', () => {
      // Valid long alternating pattern
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('User 1'),
            bedrock.ChatMessage.assistant('Assistant 1'),
            bedrock.ChatMessage.user('User 2'),
            bedrock.ChatMessage.assistant('Assistant 2'),
            bedrock.ChatMessage.user('User 3'),
            bedrock.ChatMessage.assistant('Assistant 3'),
          ],
        });
      }).not.toThrow();

      // Invalid pattern with consecutive messages in the middle
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('User 1'),
            bedrock.ChatMessage.assistant('Assistant 1'),
            bedrock.ChatMessage.assistant('Assistant 2'), // Invalid consecutive
            bedrock.ChatMessage.user('User 2'),
          ],
        });
      }).toThrow(ValidationError);
    });

    test('validation error includes position information', () => {
      expect(() => {
        bedrock.PromptVariant.chat({
          variantName: 'test-variant',
          model: foundationModel,
          messages: [
            bedrock.ChatMessage.user('User 1'),
            bedrock.ChatMessage.assistant('Assistant 1'),
            bedrock.ChatMessage.assistant('Assistant 2'), // Position 2 and 3
          ],
        });
      }).toThrow('positions 2 and 3');
    });
  });
});

import * as bedrock from '../../../bedrock';

describe('PromptTemplateConfiguration', () => {
  describe('text factory method', () => {
    test('creates text template configuration', () => {
      const config = bedrock.PromptTemplateConfiguration.text({
        text: 'Hello world!',
      });

      expect(config).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates text template configuration with input variables', () => {
      const config = bedrock.PromptTemplateConfiguration.text({
        text: 'Hello {{name}}!',
        inputVariables: ['name'],
      });

      expect(config).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('renders correctly to CloudFormation', () => {
      const config = bedrock.PromptTemplateConfiguration.text({
        text: 'Hello {{name}}!',
        inputVariables: ['name'],
      });

      const rendered = config._render();
      expect(rendered).toEqual({
        text: {
          text: 'Hello {{name}}!',
          inputVariables: [{ name: 'name' }],
        },
      });
    });

    test('renders without input variables', () => {
      const config = bedrock.PromptTemplateConfiguration.text({
        text: 'Hello world!',
      });

      const rendered = config._render();
      expect(rendered).toEqual({
        text: {
          text: 'Hello world!',
          inputVariables: undefined,
        },
      });
    });
  });

  describe('chat factory method', () => {
    test('creates chat template configuration', () => {
      const messages = [bedrock.ChatMessage.user('Hello')];
      const config = bedrock.PromptTemplateConfiguration.chat({
        messages,
      });

      expect(config).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates chat template configuration with all properties', () => {
      const messages = [
        bedrock.ChatMessage.user('What is {{topic}}?'),
        bedrock.ChatMessage.assistant('Let me help you with that.'),
      ];

      const toolChoice = bedrock.ToolChoice.AUTO;
      const toolConfig: bedrock.ToolConfiguration = {
        toolChoice,
        tools: [],
      };

      const config = bedrock.PromptTemplateConfiguration.chat({
        messages,
        system: 'You are a helpful assistant.',
        inputVariables: ['topic'],
        toolConfiguration: toolConfig,
      });

      expect(config).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('renders correctly to CloudFormation', () => {
      const messages = [
        bedrock.ChatMessage.user('What is {{topic}}?'),
        bedrock.ChatMessage.assistant('Let me help you with that.'),
      ];

      const config = bedrock.PromptTemplateConfiguration.chat({
        messages,
        system: 'You are a helpful assistant.',
        inputVariables: ['topic'],
      });

      const rendered = config._render();
      expect(rendered).toEqual({
        chat: {
          messages: [
            {
              role: 'user',
              content: [{ text: 'What is {{topic}}?' }],
            },
            {
              role: 'assistant',
              content: [{ text: 'Let me help you with that.' }],
            },
          ],
          system: [{ text: 'You are a helpful assistant.' }],
          inputVariables: [{ name: 'topic' }],
          toolConfiguration: undefined,
        },
      });
    });

    test('renders without optional properties', () => {
      const messages = [bedrock.ChatMessage.user('Hello')];
      const config = bedrock.PromptTemplateConfiguration.chat({
        messages,
      });

      const rendered = config._render();
      expect(rendered).toEqual({
        chat: {
          messages: [
            {
              role: 'user',
              content: [{ text: 'Hello' }],
            },
          ],
          system: undefined,
          inputVariables: undefined,
          toolConfiguration: undefined,
        },
      });
    });

    test('renders with tool configuration', () => {
      const messages = [bedrock.ChatMessage.user('Hello')];
      const toolChoice = bedrock.ToolChoice.AUTO;
      const toolConfig: bedrock.ToolConfiguration = {
        toolChoice,
        tools: [],
      };

      const config = bedrock.PromptTemplateConfiguration.chat({
        messages,
        toolConfiguration: toolConfig,
      });

      const rendered = config._render();
      expect(rendered).toHaveProperty('chat');
      const chatConfig = rendered.chat as any;
      expect(chatConfig.toolConfiguration).toEqual({
        toolChoice: { auto: {}, any: undefined, tool: undefined },
        tools: [],
      });
    });
  });

  describe('type safety', () => {
    test('text and chat configurations are distinct types', () => {
      const textConfig = bedrock.PromptTemplateConfiguration.text({
        text: 'Hello world!',
      });

      const chatConfig = bedrock.PromptTemplateConfiguration.chat({
        messages: [bedrock.ChatMessage.user('Hello')],
      });

      expect(textConfig).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
      expect(chatConfig).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
      expect(textConfig).not.toBe(chatConfig);
    });
  });
});

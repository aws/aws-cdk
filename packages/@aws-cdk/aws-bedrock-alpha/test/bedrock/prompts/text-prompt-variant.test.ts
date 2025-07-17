import { App, Stack } from 'aws-cdk-lib';
import * as bedrock from '../../../bedrock';
import { ValidationError } from '../../../bedrock/agents/validation-helpers';

describe('TextPromptVariant', () => {
  let stack: Stack;
  let foundationModel: bedrock.IBedrockInvokable;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');
    foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;
  });

  describe('createTextPromptVariant', () => {
    test('creates text prompt variant with minimal properties', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'test-variant',
        model: foundationModel,
        promptText: 'Hello world!',
      });

      expect(variant.name).toBe('test-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
      expect(variant.inferenceConfiguration).toBeUndefined();
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates text prompt variant with all properties', () => {
      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({
        maxTokens: 100,
        temperature: 0.7,
        topP: 0.9,
      });

      const variant = bedrock.PromptVariant.text({
        variantName: 'advanced-variant',
        model: foundationModel,
        promptText: 'Hello {{name}}, how are you today?',
        promptVariables: ['name'],
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.name).toBe('advanced-variant');
      expect(variant.templateType).toBe(bedrock.PromptTemplateType.TEXT);
      expect(variant.modelId).toBe(foundationModel.invokableArn);
      expect(variant.inferenceConfiguration).toBe(inferenceConfig);
      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates text prompt variant with multiple variables', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'multi-var-variant',
        model: foundationModel,
        promptText: 'Hello {{name}}, you are {{age}} years old and live in {{city}}.',
        promptVariables: ['name', 'age', 'city'],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates text prompt variant with empty variables array', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'no-vars-variant',
        model: foundationModel,
        promptText: 'This is a static prompt with no variables.',
        promptVariables: [],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('creates text prompt variant without variables', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'undefined-vars-variant',
        model: foundationModel,
        promptText: 'This is a static prompt.',
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });
  });

  describe('integration with Prompt', () => {
    test('text variant works with Prompt construct', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'integration-variant',
        model: foundationModel,
        promptText: 'Integration test: {{message}}',
        promptVariables: ['message'],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'integration-test',
          variants: [textVariant],
        });
      }).not.toThrow();
    });

    test('multiple text variants work with Prompt construct', () => {
      const variant1 = bedrock.PromptVariant.text({
        variantName: 'variant-1',
        model: foundationModel,
        promptText: 'First variant: {{input}}',
        promptVariables: ['input'],
      });

      const variant2 = bedrock.PromptVariant.text({
        variantName: 'variant-2',
        model: foundationModel,
        promptText: 'Second variant: {{input}}',
        promptVariables: ['input'],
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'multi-variant-test',
          variants: [variant1, variant2],
        });
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    test('handles special characters in prompt text', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'special-chars-variant',
        model: foundationModel,
        promptText: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('handles multiline prompt text', () => {
      const multilineText = `This is a multiline prompt.
It spans multiple lines.
And includes {{variable}} placeholders.`;

      const variant = bedrock.PromptVariant.text({
        variantName: 'multiline-variant',
        model: foundationModel,
        promptText: multilineText,
        promptVariables: ['variable'],
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });

    test('handles empty prompt text', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'empty-text-variant',
          model: foundationModel,
          promptText: '',
        });
      }).toThrow(ValidationError);
    });

    test('handles very long prompt text', () => {
      const longText = 'A'.repeat(10000);
      const variant = bedrock.PromptVariant.text({
        variantName: 'long-text-variant',
        model: foundationModel,
        promptText: longText,
      });

      expect(variant.templateConfiguration).toBeInstanceOf(bedrock.PromptTemplateConfiguration);
    });
  });

  describe('inference configuration', () => {
    test('handles undefined inference configuration', () => {
      const variant = bedrock.PromptVariant.text({
        variantName: 'no-inference-variant',
        model: foundationModel,
        promptText: 'No inference config',
        inferenceConfiguration: undefined,
      });

      expect(variant.inferenceConfiguration).toBeUndefined();
    });

    test('handles empty inference configuration object', () => {
      const inferenceConfig = bedrock.PromptInferenceConfiguration.text({});

      const variant = bedrock.PromptVariant.text({
        variantName: 'empty-inference-variant',
        model: foundationModel,
        promptText: 'Empty inference config',
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

      const variant = bedrock.PromptVariant.text({
        variantName: 'full-inference-variant',
        model: foundationModel,
        promptText: 'Full inference config',
        inferenceConfiguration: inferenceConfig,
      });

      expect(variant.inferenceConfiguration).toBe(inferenceConfig);
    });
  });

  describe('validation', () => {
    test('throws ValidationError for empty promptText', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'test-variant',
          model: foundationModel,
          promptText: '',
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError for whitespace-only promptText', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'test-variant',
          model: foundationModel,
          promptText: '   \n\t  ',
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError for undefined promptText', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'test-variant',
          model: foundationModel,
          promptText: undefined as any,
        });
      }).toThrow(ValidationError);
    });

    test('throws ValidationError for null promptText', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'test-variant',
          model: foundationModel,
          promptText: null as any,
        });
      }).toThrow(ValidationError);
    });

    test('accepts valid promptText with content', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'test-variant',
          model: foundationModel,
          promptText: 'Valid prompt text',
        });
      }).not.toThrow();
    });

    test('accepts promptText with only spaces but some content', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'test-variant',
          model: foundationModel,
          promptText: '  valid content  ',
        });
      }).not.toThrow();
    });

    test('validation error message is descriptive', () => {
      expect(() => {
        bedrock.PromptVariant.text({
          variantName: 'test-variant',
          model: foundationModel,
          promptText: '',
        });
      }).toThrow('promptText cannot be empty');
    });
  });
});

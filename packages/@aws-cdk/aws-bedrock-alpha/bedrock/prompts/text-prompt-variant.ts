import { CommonPromptVariantProps, PromptTemplateType, IPromptVariant } from './prompt-variant';
import { PromptInferenceConfiguration } from './prompt-inference-configuration';
import { PromptTemplateConfiguration } from './prompt-template-configuration';
import { ValidationError } from '../agents/validation-helpers';

/**
 * Properties for creating a text prompt variant.
 */
export interface TextPromptVariantProps extends CommonPromptVariantProps {
  /**
   * Inference configuration for the Text Prompt.
   *
   * @default - No inference configuration provided.
   */
  readonly inferenceConfiguration?: PromptInferenceConfiguration;

  /**
   * The text prompt. Variables are used by enclosing its name with double curly braces
   * as in `{{variable_name}}`.
   */
  readonly promptText: string;
}

/**
 * Creates a text template variant.
 *
 * @param props - Properties for the text prompt variant
 * @returns A PromptVariant configured for text processing
 */
export function createTextPromptVariant(props: TextPromptVariantProps): IPromptVariant {
  if (!props.promptText || props.promptText.trim() === '') {
    throw new ValidationError('promptText cannot be empty');
  }

  return {
    name: props.variantName,
    templateType: PromptTemplateType.TEXT,
    modelId: props.model.invokableArn,
    inferenceConfiguration: props.inferenceConfiguration,
    templateConfiguration: PromptTemplateConfiguration.text({
      inputVariables: props.promptVariables,
      text: props.promptText,
    }),
  };
}

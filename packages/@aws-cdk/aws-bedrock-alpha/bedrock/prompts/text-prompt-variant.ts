import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { CommonPromptVariantProps, PromptTemplateType, IPromptVariant } from './prompt-variant';

/**
 * Properties for creating a text prompt variant.
 */
export interface TextPromptVariantProps extends CommonPromptVariantProps {
  /**
   * Inference configuration for the Text Prompt.
   *
   * @default - No inference configuration provided.
   */
  readonly inferenceConfiguration?: bedrock.CfnPrompt.PromptModelInferenceConfigurationProperty;

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
  return {
    name: props.variantName,
    templateType: PromptTemplateType.TEXT,
    modelId: props.model.invokableArn,
    inferenceConfiguration: {
      text: props.inferenceConfiguration ? { ...props.inferenceConfiguration } : {},
    },
    templateConfiguration: {
      text: {
        inputVariables: props.promptVariables?.flatMap((variable: string) => {
          return { name: variable };
        }),
        text: props.promptText,
      },
    },
  };
}

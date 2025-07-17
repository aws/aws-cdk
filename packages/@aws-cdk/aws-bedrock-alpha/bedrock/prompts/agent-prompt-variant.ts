import { CommonPromptVariantProps, PromptTemplateType, IPromptVariant } from './prompt-variant';
import { IAgentAlias } from '../agents/agent-alias';
import { PromptTemplateConfiguration } from './prompt-template-configuration';
import { PromptGenAiResource } from './prompt-genai-resource';
import { ValidationError } from '../agents/validation-helpers';

/**
 * Properties for creating an agent prompt variant.
 */
export interface AgentPromptVariantProps extends CommonPromptVariantProps {
  /**
   * An alias pointing to the agent version to be used.
   */
  readonly agentAlias: IAgentAlias;

  /**
   * The text prompt. Variables are used by enclosing its name with double curly braces
   * as in `{{variable_name}}`.
   */
  readonly promptText: string;
}

/**
 * Creates an agent prompt template variant.
 *
 * @param props - Properties for the agent prompt variant
 * @returns A PromptVariant configured for agent interactions
 */
export function createAgentPromptVariant(props: AgentPromptVariantProps): IPromptVariant {
  if (!props.promptText || props.promptText.trim() === '') {
    throw new ValidationError('promptText cannot be empty');
  }

  return {
    name: props.variantName,
    templateType: PromptTemplateType.TEXT,
    genAiResource: PromptGenAiResource.agent({
      agentAlias: props.agentAlias,
    }),
    templateConfiguration: PromptTemplateConfiguration.text({
      inputVariables: props.promptVariables,
      text: props.promptText,
    }),
  };
}

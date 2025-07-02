import { CommonPromptVariantProps, PromptTemplateType, IPromptVariant } from './prompt-variant';
import { IAgentAlias } from '../agents/agent-alias';

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
  return {
    name: props.variantName,
    templateType: PromptTemplateType.TEXT,
    genAiResource: {
      agent: {
        agentIdentifier: props.agentAlias.aliasArn,
      },
    },
    templateConfiguration: {
      text: {
        inputVariables: props.promptVariables?.map((variable: string) => {
          return { name: variable };
        }),
        text: props.promptText,
      },
    },
  };
}

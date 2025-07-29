import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { IAgentAlias } from '../agents/agent-alias';

/**
 * Properties for creating an agent GenAI resource configuration.
 */
export interface AgentGenAiResourceProps {
  /**
   * The agent alias to use for the GenAI resource.
   */
  readonly agentAlias: IAgentAlias;
}

/**
 * Abstract base class for prompt GenAI resource configurations.
 *
 * This provides a high-level abstraction over the underlying CloudFormation
 * GenAI resource properties, offering a more developer-friendly interface
 * while maintaining full compatibility with the underlying AWS Bedrock service.
 */
export abstract class PromptGenAiResource {
  /**
   * Creates an agent GenAI resource configuration.
   */
  public static agent(props: AgentGenAiResourceProps): PromptGenAiResource {
    return new AgentGenAiResource(props);
  }

  /**
   * Renders the GenAI resource configuration as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): bedrock.CfnPrompt.PromptGenAiResourceProperty;
}

/**
 * Agent GenAI resource configuration for prompts.
 */
class AgentGenAiResource extends PromptGenAiResource {
  constructor(private readonly props: AgentGenAiResourceProps) {
    super();
  }

  public _render(): bedrock.CfnPrompt.PromptGenAiResourceProperty {
    return {
      agent: {
        agentIdentifier: this.props.agentAlias.aliasArn,
      },
    };
  }
}

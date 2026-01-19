import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { ChatMessage } from './chat-prompt-variant';
import { ToolConfiguration } from './tool-choice';

/**
 * Properties for creating a text template configuration.
 */
export interface TextTemplateConfigurationProps {
  /**
   * The input variables for the template.
   *
   * @default - No input variables
   */
  readonly inputVariables?: string[];

  /**
   * The text content of the template.
   */
  readonly text: string;
}

/**
 * Properties for creating a chat template configuration.
 */
export interface ChatTemplateConfigurationProps {
  /**
   * The input variables for the template.
   *
   * @default - No input variables
   */
  readonly inputVariables?: string[];

  /**
   * The messages in the chat template.
   */
  readonly messages: ChatMessage[];

  /**
   * The system message for the chat template.
   *
   * @default - No system message
   */
  readonly system?: string;

  /**
   * The tool configuration for the chat template.
   *
   * @default - No tool configuration
   */
  readonly toolConfiguration?: ToolConfiguration;
}

/**
 * Abstract base class for prompt template configurations.
 *
 * This provides a high-level abstraction over the underlying CloudFormation
 * template configuration properties, offering a more developer-friendly interface
 * while maintaining full compatibility with the underlying AWS Bedrock service.
 */
export abstract class PromptTemplateConfiguration {
  /**
   * Creates a text template configuration.
   */
  public static text(props: TextTemplateConfigurationProps): PromptTemplateConfiguration {
    return new TextTemplateConfiguration(props);
  }

  /**
   * Creates a chat template configuration.
   */
  public static chat(props: ChatTemplateConfigurationProps): PromptTemplateConfiguration {
    return new ChatTemplateConfiguration(props);
  }

  /**
   * Renders the template configuration as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): bedrock.CfnPrompt.PromptTemplateConfigurationProperty;
}

/**
 * Text template configuration for prompts.
 */
class TextTemplateConfiguration extends PromptTemplateConfiguration {
  constructor(private readonly props: TextTemplateConfigurationProps) {
    super();
  }

  public _render(): bedrock.CfnPrompt.PromptTemplateConfigurationProperty {
    return {
      text: {
        inputVariables: this.props.inputVariables?.map((variable: string) => {
          return { name: variable };
        }),
        text: this.props.text,
      },
    };
  }
}

/**
 * Chat template configuration for prompts.
 */
class ChatTemplateConfiguration extends PromptTemplateConfiguration {
  constructor(private readonly props: ChatTemplateConfigurationProps) {
    super();
  }

  public _render(): bedrock.CfnPrompt.PromptTemplateConfigurationProperty {
    return {
      chat: {
        inputVariables: this.props.inputVariables?.map((variable: string) => {
          return { name: variable };
        }),
        messages: this.props.messages?.flatMap(m => m._render()),
        system: this.props.system !== undefined ? [{ text: this.props.system }] : undefined,
        toolConfiguration: this.props.toolConfiguration
          ? {
            toolChoice: this.props.toolConfiguration.toolChoice._render(),
            tools: this.props.toolConfiguration.tools.map(tool => tool._render()),
          }
          : undefined,
      },
    };
  }
}

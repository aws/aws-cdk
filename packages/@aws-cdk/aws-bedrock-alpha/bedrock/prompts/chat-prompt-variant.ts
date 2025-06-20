import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { CfnPrompt } from 'aws-cdk-lib/aws-bedrock';
import { CommonPromptVariantProps, PromptTemplateType, IPromptVariant } from './prompt-variant';
import { ToolConfiguration } from './tool-choice';

/**
 * Properties for creating a chat prompt variant.
 */
export interface ChatPromptVariantProps extends CommonPromptVariantProps {
  /**
   * The messages in the chat prompt.
   * Must include at least one User Message.
   * The messages should alternate between User and Assistant.
   */
  readonly messages: ChatMessage[];

  /**
   * Context or instructions for the model to consider before generating a response.
   *
   * @default - No system message provided.
   */
  readonly system?: string;

  /**
   * The configuration with available tools to the model and how it must use them.
   *
   * @default - No tool configuration provided.
   */
  readonly toolConfiguration?: ToolConfiguration;

  /**
   * Inference configuration for the Chat Prompt.
   *
   * @default - No inference configuration provided.
   */
  readonly inferenceConfiguration?: bedrock.CfnPrompt.PromptModelInferenceConfigurationProperty;
}

/**
 * The role of a message in a chat conversation.
 */
export enum ChatMessageRole {
  /**
   * This role represents the human user in the conversation. Inputs from the
   * user guide the conversation and prompt responses from the assistant.
   */
  USER = 'user',

  /**
   * This is the role of the model itself, responding to user inputs based on
   * the context set by the system.
   */
  ASSISTANT = 'assistant',
}

/**
 * Represents a message in a chat conversation.
 */
export class ChatMessage {
  /**
   * Creates a user message.
   *
   * @param text - The text content of the user message
   * @returns A ChatMessage instance representing a user message
   */
  public static user(text: string): ChatMessage {
    return new ChatMessage(ChatMessageRole.USER, text);
  }

  /**
   * Creates an assistant message.
   *
   * @param text - The text content of the assistant message
   * @returns A ChatMessage instance representing an assistant message
   */
  public static assistant(text: string): ChatMessage {
    return new ChatMessage(ChatMessageRole.ASSISTANT, text);
  }

  /**
   * The role of the message sender.
   */
  public readonly role: ChatMessageRole;

  /**
   * The text content of the message.
   */
  public readonly text: string;

  constructor(role: ChatMessageRole, text: string) {
    this.role = role;
    this.text = text;
  }

  /**
   * Renders the message as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnPrompt.MessageProperty {
    return {
      role: this.role,
      content: [
        {
          text: this.text,
        },
      ],
    };
  }
}

/**
 * Creates a chat template variant. Use this template type when
 * the model supports the Converse API or the Anthropic Claude Messages API.
 * This allows you to include a System prompt and previous User messages
 * and Assistant messages for context.
 *
 * @param props - Properties for the chat prompt variant
 * @returns A PromptVariant configured for chat interactions
 */
export function createChatPromptVariant(props: ChatPromptVariantProps): IPromptVariant {
  return {
    name: props.variantName,
    templateType: PromptTemplateType.CHAT,
    modelId: props.model.invokableArn,
    inferenceConfiguration: {
      text: { ...props.inferenceConfiguration },
    },
    templateConfiguration: {
      chat: {
        inputVariables: props.promptVariables?.flatMap((variable: string) => {
          return { name: variable };
        }),
        messages: props.messages?.flatMap(m => m._render()),
        system: props.system !== undefined ? [{ text: props.system }] : undefined,
        toolConfiguration: props.toolConfiguration
          ? {
            toolChoice: props.toolConfiguration.toolChoice._render(),
            tools: props.toolConfiguration.tools,
          }
          : undefined,
      },
    },
  };
}

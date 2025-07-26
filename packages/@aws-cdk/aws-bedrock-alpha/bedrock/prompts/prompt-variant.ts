// Internal Libs
import { IBedrockInvokable } from '../models';
import { TextPromptVariantProps, createTextPromptVariant } from './text-prompt-variant';
import { ChatPromptVariantProps, createChatPromptVariant } from './chat-prompt-variant';
import { AgentPromptVariantProps, createAgentPromptVariant } from './agent-prompt-variant';
import { PromptInferenceConfiguration } from './prompt-inference-configuration';
import { PromptTemplateConfiguration } from './prompt-template-configuration';
import { PromptGenAiResource } from './prompt-genai-resource';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * The type of prompt template.
 */
export enum PromptTemplateType {
  /**
   * Text template for simple text-based prompts.
   */
  TEXT = 'TEXT',
  /**
   * Chat template for conversational prompts with message history.
   */
  CHAT = 'CHAT',
}

/**
 * Common properties for all prompt variants.
 */
export interface CommonPromptVariantProps {
  /**
   * The name of the prompt variant.
   */
  readonly variantName: string;

  /**
   * The model which is used to run the prompt. The model could be a foundation
   * model, a custom model, or a provisioned model.
   */
  readonly model: IBedrockInvokable;

  /**
   * The variables in the prompt template that can be filled in at runtime.
   *
   * @default - No variables defined.
   */
  readonly promptVariables?: string[];
}

/******************************************************************************
 *                              PROMPT VARIANT INTERFACE
 *****************************************************************************/
/**
 * Interface representing a prompt variant configuration.
 * Variants are specific sets of inputs that guide FMs on Amazon Bedrock to
 * generate an appropriate response or output for a given task or instruction.
 */
export interface IPromptVariant {
  /**
   * The name of the prompt variant.
   */
  readonly name: string;

  /**
   * The type of prompt template.
   * @default - Text
   */
  readonly templateType: PromptTemplateType;

  /**
   * The inference configuration.
   */
  readonly inferenceConfiguration?: PromptInferenceConfiguration;

  /**
   * The unique identifier of the model with which to run inference on the prompt.
   */
  readonly modelId?: string;

  /**
   * The template configuration.
   */
  readonly templateConfiguration: PromptTemplateConfiguration;

  /**
   * The generative AI resource configuration.
   */
  readonly genAiResource?: PromptGenAiResource;
}

/******************************************************************************
 *                              PROMPT VARIANT FACTORY
 *****************************************************************************/
/**
 * Factory class for creating prompt variants.
 * Provides static methods to create different types of prompt variants
 * with proper configuration and type safety.
 */
export class PromptVariant {
  /******************************************************************************
   *                            STATIC METHODS
   *****************************************************************************/
  /**
   * Creates a text template variant.
   *
   * @param props - Properties for the text prompt variant
   * @returns A PromptVariant configured for text processing
   */
  public static text(props: TextPromptVariantProps): IPromptVariant {
    return createTextPromptVariant(props);
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
  public static chat(props: ChatPromptVariantProps): IPromptVariant {
    return createChatPromptVariant(props);
  }

  /**
   * Creates an agent prompt template variant.
   *
   * @param props - Properties for the agent prompt variant
   * @returns A PromptVariant configured for agent interactions
   */
  public static agent(props: AgentPromptVariantProps): IPromptVariant {
    return createAgentPromptVariant(props);
  }

  /******************************************************************************
   *                            CONSTRUCTOR
   *****************************************************************************/
  private constructor() {
    // Private constructor to prevent instantiation
    // This class should only be used for its static factory methods
  }
}

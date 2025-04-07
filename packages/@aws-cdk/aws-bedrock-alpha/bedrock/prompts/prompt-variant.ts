/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { aws_bedrock as bedrock } from 'aws-cdk-lib';
import { CfnPrompt } from 'aws-cdk-lib/aws-bedrock';
import { IAgentAlias } from '../agents/agent-alias';
import { IInvokable } from '../models';

// ------------------------------------------------------
// COMMON
// ------------------------------------------------------
export enum PromptTemplateType {
  TEXT = 'TEXT',
  CHAT = 'CHAT',
}

export interface CommonPromptVariantProps {
  /**
   * The name of the prompt variant.
   */
  readonly variantName: string;
  /**
   * The model which is used to run the prompt. The model could be a foundation
   * model, a custom model, or a provisioned model.
   */
  readonly model: IInvokable;
  /**
   * The variables in the prompt template that can be filled in at runtime.
   */
  readonly promptVariables?: string[];
}

// ------------------------------------------------------
// TEXT
// ------------------------------------------------------
export interface TextPromptVariantProps extends CommonPromptVariantProps {
  /**
   * Inference configuration for the Text Prompt
   */
  readonly inferenceConfiguration?: bedrock.CfnPrompt.PromptModelInferenceConfigurationProperty;
  /**
   * The text prompt. Variables are used by enclosing its name with double curly braces
   * as in `{{variable_name}}`.
   */
  readonly promptText: string;
}

// ------------------------------------------------------
// CHAT
// ------------------------------------------------------
export interface ChatPromptVariantProps extends CommonPromptVariantProps {
  /**
   * Inference configuration for the Chat Prompt.
   * Must include at least one User Message.
   * The messages should alternate between User and Assistant.
   */
  readonly messages: ChatMessage[];
  /**
   * Context or instructions for the model to consider before generating a response.
   */
  readonly system?: string;
  /**
   * The configuration with available tools to the model and how it must use them.
   */
  readonly toolConfiguration?: ToolConfiguration;
  /**
   * Inference configuration for the Text Prompt
   */
  readonly inferenceConfiguration?: bedrock.CfnPrompt.PromptModelInferenceConfigurationProperty;
}

export enum ChatMessageRole {
  /**
   * This role represents the human user in the conversation. Inputs from the
   * user guide  the conversation and prompt responses from the assistant.
   */
  USER = 'user',
  /**
   * This is the role of the model itself, responding to user inputs based on
   * the context set by the system.
   */
  ASSISTANT = 'assistant',
}

export class ChatMessage {
  public static user(text: string) {
    return new ChatMessage(ChatMessageRole.USER, text);
  }
  public static assistant(text: string) {
    return new ChatMessage(ChatMessageRole.ASSISTANT, text);
  }
  public readonly role: ChatMessageRole;
  public readonly text: string;

  constructor(role: ChatMessageRole, text: string) {
    (this.role = role), (this.text = text);
  }
  /**
   * Renders as Cfn Property
   * @internal This is an internal core function and should not be called directly.
   */
  public __render(): CfnPrompt.MessageProperty {
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

export interface ToolConfiguration {
  readonly toolChoice: ToolChoice;
  readonly tools: CfnPrompt.ToolProperty[];
}

export class ToolChoice {
  /** The model must request at least one tool (no text is generated) */
  public static readonly ANY = new ToolChoice({}, undefined, undefined);
  /** (Default). The Model automatically decides if a tool should be called or whether to generate text instead.*/
  public static readonly AUTO = new ToolChoice(undefined, {}, undefined);
  /** The Model must request the specified tool. Only supported by some models like Anthropic Claude 3 models. */
  public static specificTool(toolName: string) {
    return new ToolChoice(undefined, undefined, toolName);
  }
  public readonly any?: any;
  public readonly auto?: any;
  public readonly tool?: string;

  constructor(any: any, auto: any, tool?: string) {
    (this.any = any), (this.auto = auto), (this.tool = tool);
  }
  /**
   *
   * @internal
   */
  public __render(): CfnPrompt.ToolChoiceProperty {
    return {
      any: this.any,
      auto: this.auto,
      tool: this.tool ? { name: this.tool } : undefined,
    };
  }
}
// ------------------------------------------------------
// AGENT
// ------------------------------------------------------

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

// ------------------------------------------------------
// VARIANTS
// ------------------------------------------------------
/**
 * Variants are specific sets of inputs that guide FMs on Amazon Bedrock to
 * generate an appropriate response or output for a given task or instruction.
 * You can optimize the prompt for specific use cases and models.
 */
export abstract class PromptVariant {
  // ------------------------------------------------------
  // Static Methods
  // ------------------------------------------------------
  /**
   * Static method to create a text template
   */
  public static text(props: TextPromptVariantProps): PromptVariant {
    return {
      name: props.variantName,
      templateType: PromptTemplateType.TEXT,
      modelId: props.model.invokableArn,
      inferenceConfiguration: {
        text: { ...props.inferenceConfiguration },
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

  /**
   * Static method to create a chat template. Use this template type when
   * the model supports the Converse API or the AnthropicClaude Messages API.
   * This allows you to include a System prompt and previous User messages
   * and Assistant messages for context.
   */
  public static chat(props: ChatPromptVariantProps): PromptVariant {
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
          messages: props.messages?.flatMap(m => m.__render()),
          system: props.system ? [{ text: props.system }] : undefined,
          toolConfiguration: props.toolConfiguration
            ? {
              toolChoice: props.toolConfiguration.toolChoice.__render(),
              tools: props.toolConfiguration.tools,
            }
            : undefined,
        },
      },
    };
  }

  /**
   * Static method to create an agent prompt template.
   */
  public static agent(props: AgentPromptVariantProps): PromptVariant {
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
          inputVariables: props.promptVariables?.flatMap((variable: string) => {
            return { name: variable };
          }),
          text: props.promptText,
        },
      },
    };
  }

  // ------------------------------------------------------
  // Properties
  // ------------------------------------------------------
  /**
   * The name of the prompt variant.
   */
  public abstract name: string;
  /**
   * The type of prompt template.
   */
  public abstract templateType: PromptTemplateType;
  /**
   * The inference configuration.
   */
  public abstract inferenceConfiguration?: bedrock.CfnPrompt.PromptInferenceConfigurationProperty;
  /**
   * The unique identifier of the model with which to run inference on the prompt.
   */
  public abstract modelId?: string;
  /**
   * The template configuration.
   */
  public abstract templateConfiguration: bedrock.CfnPrompt.PromptTemplateConfigurationProperty;
  /**
   * The template configuration.
   */
  public abstract genAiResource?: bedrock.CfnPrompt.PromptGenAiResourceProperty;

  // ------------------------------------------------------
  // Constructor
  // ------------------------------------------------------
  protected constructor() {}
}

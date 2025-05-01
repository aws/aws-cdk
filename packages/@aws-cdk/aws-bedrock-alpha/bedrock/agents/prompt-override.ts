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

import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as validation from './validation-helpers';
import { IInvokable } from '../models';

/**
 * The step in the agent sequence that this prompt configuration applies to.
 */
/**
 * The step in the agent sequence that this prompt configuration applies to.
 */
export enum AgentStepType {
  /**
   * Pre-processing step that prepares the user input for orchestration.
   */
  PRE_PROCESSING = 'PRE_PROCESSING',

  /**
   * Main orchestration step that determines the agent's actions.
   */
  ORCHESTRATION = 'ORCHESTRATION',

  /**
   * Post-processing step that refines the agent's response.
   */
  POST_PROCESSING = 'POST_PROCESSING',

  /**
   * Step that classifies and routes requests to appropriate collaborators.
   */
  ROUTING_CLASSIFIER = 'ROUTING_CLASSIFIER',

  /**
   * Step that summarizes conversation history for memory retention.
   */
  MEMORY_SUMMARIZATION = 'MEMORY_SUMMARIZATION',

  /**
   * Step that generates responses using knowledge base content.
   */
  KNOWLEDGE_BASE_RESPONSE_GENERATION = 'KNOWLEDGE_BASE_RESPONSE_GENERATION',
}

/**
 * LLM inference configuration
 */
export interface InferenceConfiguration {
  /**
   * The likelihood of the model selecting higher-probability options while
   * generating a response. A lower value makes the model more likely to choose
   * higher-probability options, while a higher value makes the model more
   * likely to choose lower-probability options.
   *
   * Floating point
   *
   * min 0
   * max 1
   */
  readonly temperature: number;
  /**
   * While generating a response, the model determines the probability of the
   * following token at each point of generation. The value that you set for
   * Top P determines the number of most-likely candidates from which the model
   * chooses the next token in the sequence. For example, if you set topP to
   * 80, the model only selects the next token from the top 80% of the
   * probability distribution of next tokens.
   *
   * Floating point
   *
   * min 0
   * max 1
   */
  readonly topP: number;
  /**
   * While generating a response, the model determines the probability of the
   * following token at each point of generation. The value that you set for
   * topK is the number of most-likely candidates from which the model chooses
   * the next token in the sequence. For example, if you set topK to 50, the
   * model selects the next token from among the top 50 most likely choices.
   *
   * Integer
   *
   * min 0
   * max 500
   */
  readonly topK: number;
  /**
   * A list of stop sequences. A stop sequence is a sequence of characters that
   * causes the model to stop generating the response.
   *
   * length 0-4
   */
  readonly stopSequences: string[];
  /**
   * The maximum number of tokens to generate in the response.
   *
   * Integer
   *
   * min 0
   * max 4096
   */
  readonly maximumLength: number;
}

/**
 * Contains configurations to override a prompt template in one part of an agent sequence.
 */
export interface PromptStepConfiguration {
  /**
   * The step in the agent sequence where to set a specific prompt configuration.
   */
  readonly stepType: AgentStepType;
  /**
   * Whether to enable or skip this step in the agent sequence.
   * @default - The default state for each step type is as follows.
   *
   *     PRE_PROCESSING – ENABLED
   *     ORCHESTRATION – ENABLED
   *     KNOWLEDGE_BASE_RESPONSE_GENERATION – ENABLED
   *     POST_PROCESSING – DISABLED
   */
  readonly stepEnabled?: boolean;
  /**
   * The custom prompt template to be used.
   *
   * @default - The default prompt template will be used.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-placeholders.html
   */
  readonly customPromptTemplate?: string;
  /**
   * The inference configuration parameters to use.
   * @default undefined - Default inference configuration will be used
   */
  readonly inferenceConfig?: InferenceConfiguration;
  /**
   * The foundation model to use for this specific prompt step.
   * This allows using different models for different steps in the agent sequence.
   *
   * @default - The agent's default foundation model will be used.
   */
  readonly foundationModel?: IInvokable;
}

/**
 * Configuration for a prompt step that can use a custom Lambda parser.
 * Extends the base PromptStepConfiguration with custom parser options.
 */
export interface PromptStepConfigurationCustomParser extends PromptStepConfiguration {
  /**
   * Whether to use the custom Lambda parser defined for the sequence.
   *
   * @default - false
   */
  readonly useCustomParser?: boolean;
}

/**
 * Properties for configuring a custom Lambda parser for prompt overrides.
 */
export interface CustomParserProps {
  /**
   * Lambda function to use as custom parser.
   * @default undefined - No custom parser is used
   */
  readonly parser?: IFunction;

  /**
   * Prompt step configurations. At least one of the steps must make use of the custom parser.
   * @default undefined - No custom prompt step configurations
   */
  readonly steps?: PromptStepConfigurationCustomParser[];
}

/**
 * Configuration for overriding prompt templates and behaviors in different parts
 * of an agent's sequence. This allows customizing how the agent processes inputs,
 * makes decisions, and generates responses.
 */
export class PromptOverrideConfiguration {
  /**
   * Creates a PromptOverrideConfiguration from a list of prompt step configurations.
   * Use this method when you want to override prompts without using a custom parser.
   * @param steps The prompt step configurations to use
   * @returns A new PromptOverrideConfiguration instance
   */
  public static fromSteps(steps?: PromptStepConfiguration[]): PromptOverrideConfiguration {
    // Create new object
    return new PromptOverrideConfiguration({ steps });
  }
  /**
   * Creates a PromptOverrideConfiguration with a custom Lambda parser function.
   * @param props Configuration including:
   *   - `parser`: Lambda function to use as custom parser
   *   - `steps`: prompt step configurations. At least one of the steps must make use of the custom parser.
   */
  public static withCustomParser(props: CustomParserProps): PromptOverrideConfiguration {
    // Create new object
    return new PromptOverrideConfiguration(props);
  }

  /**
   * The custom Lambda parser function to use.
   * The Lambda parser processes and interprets the raw foundation model output.
   * It receives an input event with:
   * - messageVersion: Version of message format (1.0)
   * - agent: Info about the agent (name, id, alias, version)
   * - invokeModelRawResponse: Raw model output to parse
   * - promptType: Type of prompt being parsed
   * - overrideType: Type of override (OUTPUT_PARSER)
   *
   * The Lambda must return a response that the agent uses for next actions.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/lambda-parser.html
   */
  readonly parser?: IFunction;

  /**
   * The prompt configurations to override the prompt templates in the agent sequence.
   *
   * @default - No prompt configuration will be overridden.
   */
  readonly steps?: PromptStepConfigurationCustomParser[];

  /**
   * Create a new PromptOverrideConfiguration.
   *
   * @internal - This is marked as private so end users leverage it only through static methods
   */
  private constructor(props: CustomParserProps) {
    // Validate props
    validation.throwIfInvalid(this.validateSteps, props.steps);
    if (props.parser) {
      validation.throwIfInvalid(this.validateCustomParser, props.steps);
    }
    this.parser = props.parser;
    this.steps = props.steps;
  }

  /**
   * Format as CfnAgent.PromptOverrideConfigurationProperty
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnAgent.PromptOverrideConfigurationProperty {
    return {
      overrideLambda: this.parser?.functionArn,
      promptConfigurations:
        this.steps?.map(step => ({
          // prettier-ignore
          promptType: step.stepType,
          /** Maps stepEnabled (true → 'ENABLED', false → 'DISABLED', undefined → undefined (uses CFN DEFAULT)) */
          promptState: step?.stepEnabled === undefined ? undefined : step.stepEnabled ? 'ENABLED' : 'DISABLED',
          /** Maps stepEnabled (true → 'OVERRIDDEN', false → 'DEFAULT', undefined → undefined (uses CFN DEFAULT)) */
          // prettier-ignore
          parserMode:
            step?.useCustomParser === undefined
              ? undefined
              : step?.useCustomParser ? 'OVERRIDDEN' : 'DEFAULT',
          // Use custom prompt template if provided, otherwise use default
          // prettier-ignore
          promptCreationMode: step?.customPromptTemplate === undefined
            ? undefined
            : step?.customPromptTemplate ? 'OVERRIDDEN' : 'DEFAULT',
          basePromptTemplate: step.customPromptTemplate,
          inferenceConfiguration: step.inferenceConfig,
          // Include foundation model if provided
          foundationModel: step.foundationModel?.invokableArn,
        })) || [],
    };
  }

  private validateInferenceConfig = (config?: InferenceConfiguration): string[] => {
    const errors: string[] = [];

    if (config) {
      if (config.temperature < 0 || config.temperature > 1) {
        errors.push('Temperature must be between 0 and 1');
      }
      if (config.topP < 0 || config.topP > 1) {
        errors.push('TopP must be between 0 and 1');
      }
      if (config.topK < 0 || config.topK > 500) {
        errors.push('TopK must be between 0 and 500');
      }
      if (config.stopSequences.length > 4) {
        errors.push('Maximum 4 stop sequences allowed');
      }
      if (config.maximumLength < 0 || config.maximumLength > 4096) {
        errors.push('MaximumLength must be between 0 and 4096');
      }
    }

    return errors;
  };

  private validateSteps = (steps?: PromptStepConfiguration[]): string[] => {
    const errors: string[] = [];

    if (!steps || steps.length === 0) {
      errors.push('Steps array cannot be empty');
    }

    // Validate each step's inference config
    steps?.forEach(step => {
      const inferenceErrors = this.validateInferenceConfig(step.inferenceConfig);
      if (inferenceErrors.length > 0) {
        errors.push(`Step  ${inferenceErrors.join(', ')}`);
      }

      // Validate foundationModel if provided
      if (step.foundationModel !== undefined) {
        if (!step.foundationModel.invokableArn) {
          errors.push('Step Foundation model must be a valid IInvokable with an invokableArn');
        }
        // Only allow foundation model override for ROUTING_CLASSIFIER
        if (step.stepType !== AgentStepType.ROUTING_CLASSIFIER) {
          errors.push('Step Foundation model can only be specified for ROUTING_CLASSIFIER step type');
        }
      }
    });

    return errors;
  };

  private validateCustomParser = (steps?: PromptStepConfigurationCustomParser[]): string[] => {
    const errors: string[] = [];

    const hasCustomParser = steps?.some(step => step.useCustomParser);
    if (!hasCustomParser) {
      errors.push('At least one step must use custom parser');
    }

    return errors;
  };
}

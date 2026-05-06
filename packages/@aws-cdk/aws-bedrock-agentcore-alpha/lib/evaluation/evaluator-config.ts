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

import type { Duration } from 'aws-cdk-lib';
import type * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import type * as lambda from 'aws-cdk-lib/aws-lambda';
import type { CategoricalRatingOption, EvaluatorInferenceConfig, NumericalRatingOption } from './types';
import {
  throwIfInvalid,
  validateCategoricalRatingScale,
  validateInstructions,
  validateNumericalRatingScale,
} from './validation-helpers';

/**
 * Options for configuring an LLM-as-a-Judge custom evaluator.
 *
 * Uses a foundation model to assess agent performance based on
 * custom instructions and a rating scale.
 */
export interface LlmAsAJudgeOptions {
  /**
   * The evaluation instructions that guide the language model in assessing agent performance.
   *
   * These instructions define the evaluation criteria, context, and expected behavior.
   * Instructions must contain placeholders appropriate for the evaluation level
   * (e.g., `{context}`, `{available_tools}` for SESSION level).
   *
   * Note: Evaluators using reference-input placeholders (e.g., `{expected_tool_trajectory}`,
   * `{assertions}`, `{expected_response}`) are only compatible with on-demand evaluation,
   * not online evaluation.
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/custom-evaluators.html
   */
  readonly instructions: string;

  /**
   * The identifier of the Amazon Bedrock model to use for evaluation.
   *
   * Accepts standard model IDs (e.g., `'anthropic.claude-sonnet-4-6'`)
   * and cross-region inference profile IDs with region prefixes
   * (e.g., `'us.anthropic.claude-sonnet-4-6'`, `'eu.anthropic.claude-sonnet-4-6'`).
   */
  readonly modelId: string;

  /**
   * The rating scale that defines how the evaluator should score agent performance.
   */
  readonly ratingScale: EvaluatorRatingScale;

  /**
   * Optional inference configuration parameters that control model behavior during evaluation.
   *
   * When not specified, the foundation model uses its own default values for
   * maxTokens, temperature, and topP.
   *
   * @default - The foundation model's default inference parameters are used
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/custom-evaluators.html
   */
  readonly inferenceConfig?: EvaluatorInferenceConfig;

  /**
   * Additional model-specific request fields.
   *
   * @default - No additional fields
   */
  readonly additionalModelRequestFields?: { [key: string]: any };
}

/**
 * Options for configuring a code-based custom evaluator using a Lambda function.
 *
 * Uses a Lambda function to implement custom evaluation logic.
 */
export interface CodeBasedOptions {
  /**
   * The Lambda function used for evaluation.
   *
   * The function will be granted invoke permissions for the
   * `bedrock-agentcore.amazonaws.com` service principal, scoped
   * to this specific evaluator resource.
   */
  readonly lambdaFunction: lambda.IFunction;

  /**
   * The timeout for the Lambda function invocation during evaluation.
   *
   * When not specified, the AgentCore evaluation service uses its default
   * timeout for Lambda-based evaluators.
   *
   * @default - The AgentCore evaluation service's default Lambda timeout is used
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/custom-evaluators.html
   */
  readonly timeout?: Duration;
}

/**
 * Represents a rating scale for custom LLM-as-a-Judge evaluators.
 *
 * Rating scales define how the evaluator scores agent performance.
 * Use either categorical (discrete labels) or numerical (labeled numeric values) scales.
 *
 * @example
 * // Categorical rating scale
 * const categorical = agentcore.EvaluatorRatingScale.categorical([
 *   { label: 'Good', definition: 'The response fully addresses the query.' },
 *   { label: 'Bad', definition: 'The response fails to address the query.' },
 * ]);
 *
 * // Numerical rating scale
 * const numerical = agentcore.EvaluatorRatingScale.numerical([
 *   { label: 'Poor', definition: 'Inadequate response.', value: 1 },
 *   { label: 'Good', definition: 'Adequate response.', value: 3 },
 *   { label: 'Excellent', definition: 'Outstanding response.', value: 5 },
 * ]);
 */
export class EvaluatorRatingScale {
  /**
   * Creates a categorical rating scale.
   *
   * Categorical scales define discrete labels for scoring, such as "Good" / "Bad"
   * or "Pass" / "Fail".
   *
   * @param options - The categorical rating options (at least 1 required)
   */
  public static categorical(options: CategoricalRatingOption[]): EvaluatorRatingScale {
    throwIfInvalid(validateCategoricalRatingScale, options);
    return new EvaluatorRatingScale({ categorical: options });
  }

  /**
   * Creates a numerical rating scale.
   *
   * Numerical scales define labeled numeric values for scoring, such as
   * 1 (Poor) through 5 (Excellent).
   *
   * @param options - The numerical rating options (at least 1 required)
   */
  public static numerical(options: NumericalRatingOption[]): EvaluatorRatingScale {
    throwIfInvalid(validateNumericalRatingScale, options);
    return new EvaluatorRatingScale({ numerical: options });
  }

  private readonly config: bedrockagentcore.CfnEvaluator.RatingScaleProperty;

  private constructor(config: bedrockagentcore.CfnEvaluator.RatingScaleProperty) {
    this.config = config;
  }

  /**
   * Binds the rating scale to produce the L1 property.
   * @internal
   */
  public _bind(): bedrockagentcore.CfnEvaluator.RatingScaleProperty {
    return this.config;
  }
}

/**
 * Configuration for a custom evaluator.
 *
 * Defines how an evaluator assesses agent performance. Supports two strategies:
 * - **LLM-as-a-Judge**: Uses a foundation model with custom instructions and a rating scale.
 * - **Code-based**: Uses a Lambda function for custom evaluation logic.
 *
 * @example
 * // LLM-as-a-Judge evaluator
 * const llmConfig = agentcore.EvaluatorConfig.llmAsAJudge({
 *   instructions: 'Evaluate whether the agent response is helpful.',
 *   modelId: 'us.anthropic.claude-sonnet-4-6',
 *   ratingScale: agentcore.EvaluatorRatingScale.categorical([
 *     { label: 'Good', definition: 'The response is helpful.' },
 *     { label: 'Bad', definition: 'The response is not helpful.' },
 *   ]),
 * });
 *
 * // Code-based evaluator
 * declare const myEvalFunction: lambda.IFunction;
 * const codeConfig = agentcore.EvaluatorConfig.codeBased({
 *   lambdaFunction: myEvalFunction,
 * });
 */
export class EvaluatorConfig {
  /**
   * Creates an LLM-as-a-Judge evaluator configuration.
   *
   * Uses a foundation model to assess agent performance based on custom
   * instructions and a rating scale.
   *
   * @param options - The LLM-as-a-Judge configuration options
   */
  public static llmAsAJudge(options: LlmAsAJudgeOptions): EvaluatorConfig {
    throwIfInvalid(validateInstructions, options.instructions);

    const modelConfig: bedrockagentcore.CfnEvaluator.EvaluatorModelConfigProperty = {
      bedrockEvaluatorModelConfig: {
        modelId: options.modelId,
        ...(options.inferenceConfig !== undefined ? {
          inferenceConfig: {
            maxTokens: options.inferenceConfig.maxTokens,
            temperature: options.inferenceConfig.temperature,
            topP: options.inferenceConfig.topP,
          },
        } : {}),
        ...(options.additionalModelRequestFields !== undefined ? {
          additionalModelRequestFields: options.additionalModelRequestFields,
        } : {}),
      },
    };

    const cfnConfig: bedrockagentcore.CfnEvaluator.EvaluatorConfigProperty = {
      llmAsAJudge: {
        instructions: options.instructions,
        modelConfig,
        ratingScale: options.ratingScale._bind(),
      },
    };

    return new EvaluatorConfig(cfnConfig);
  }

  /**
   * Creates a code-based evaluator configuration using a Lambda function.
   *
   * The Lambda function implements custom evaluation logic. The function will
   * automatically be granted invoke permissions for the bedrock-agentcore service.
   *
   * @param options - The code-based configuration options
   */
  public static codeBased(options: CodeBasedOptions): EvaluatorConfig {
    const timeoutInSeconds = options.timeout?.toSeconds();

    const cfnConfig: bedrockagentcore.CfnEvaluator.EvaluatorConfigProperty = {
      codeBased: {
        lambdaConfig: {
          lambdaArn: options.lambdaFunction.functionArn,
          ...(timeoutInSeconds !== undefined ? {
            lambdaTimeoutInSeconds: timeoutInSeconds,
          } : {}),
        },
      },
    };

    return new EvaluatorConfig(cfnConfig, options.lambdaFunction);
  }

  /**
   * The Lambda function used for code-based evaluation, if applicable.
   */
  public readonly lambdaFunction?: lambda.IFunction;

  private readonly cfnConfig: bedrockagentcore.CfnEvaluator.EvaluatorConfigProperty;

  private constructor(
    cfnConfig: bedrockagentcore.CfnEvaluator.EvaluatorConfigProperty,
    lambdaFunction?: lambda.IFunction,
  ) {
    this.cfnConfig = cfnConfig;
    this.lambdaFunction = lambdaFunction;
  }

  /**
   * Binds the evaluator configuration to produce the L1 property.
   * @internal
   */
  public _bind(): bedrockagentcore.CfnEvaluator.EvaluatorConfigProperty {
    return this.cfnConfig;
  }
}

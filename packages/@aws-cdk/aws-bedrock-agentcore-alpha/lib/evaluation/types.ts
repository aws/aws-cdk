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

import type * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Built-in evaluators provided by Amazon Bedrock AgentCore.
 *
 * These evaluators assess different aspects of agent performance
 * at various levels (session, trace, or tool call).
 */
export enum BuiltinEvaluator {
  /**
   * Evaluates whether the information in the agent's response is factually accurate.
   */
  CORRECTNESS = 'Builtin.Correctness',

  /**
   * Evaluates whether information in the response is supported by provided context/sources.
   */
  FAITHFULNESS = 'Builtin.Faithfulness',

  /**
   * Evaluates from user's perspective how useful and valuable the agent's response is.
   */
  HELPFULNESS = 'Builtin.Helpfulness',

  /**
   * Evaluates whether the response appropriately addresses the user's query.
   */
  RESPONSE_RELEVANCE = 'Builtin.ResponseRelevance',

  /**
   * Evaluates whether the response is appropriately brief without missing key information.
   */
  CONCISENESS = 'Builtin.Conciseness',

  /**
   * Evaluates whether the response is logically structured and coherent.
   */
  COHERENCE = 'Builtin.Coherence',

  /**
   * Measures how well the agent follows the provided system instructions.
   */
  INSTRUCTION_FOLLOWING = 'Builtin.InstructionFollowing',

  /**
   * Detects when agent evades questions or directly refuses to answer.
   */
  REFUSAL = 'Builtin.Refusal',

  /**
   * Evaluates whether the conversation successfully meets the user's goals.
   */
  GOAL_SUCCESS_RATE = 'Builtin.GoalSuccessRate',

  /**
   * Evaluates whether the agent selected the appropriate tool for the task.
   */
  TOOL_SELECTION_ACCURACY = 'Builtin.ToolSelectionAccuracy',

  /**
   * Evaluates how accurately the agent extracts parameters from user queries.
   */
  TOOL_PARAMETER_ACCURACY = 'Builtin.ToolParameterAccuracy',

  /**
   * Evaluates whether the response contains harmful content.
   */
  HARMFULNESS = 'Builtin.Harmfulness',

  /**
   * Detects content that makes generalizations about individuals or groups.
   */
  STEREOTYPING = 'Builtin.Stereotyping',
}

/**
 * The execution status of an online evaluation configuration.
 */
export enum ExecutionStatus {
  /**
   * The evaluation is enabled and actively processing agent traces.
   */
  ENABLED = 'ENABLED',

  /**
   * The evaluation is disabled and not processing agent traces.
   */
  DISABLED = 'DISABLED',
}

/**
 * Filter operators for online evaluation filtering.
 */
export enum FilterOperator {
  /**
   * Exact equality comparison.
   */
  EQUALS = 'Equals',

  /**
   * Not equal comparison.
   */
  NOT_EQUALS = 'NotEquals',

  /**
   * Greater than comparison (numeric values).
   */
  GREATER_THAN = 'GreaterThan',

  /**
   * Less than comparison (numeric values).
   */
  LESS_THAN = 'LessThan',

  /**
   * Greater than or equal comparison (numeric values).
   */
  GREATER_THAN_OR_EQUAL = 'GreaterThanOrEqual',

  /**
   * Less than or equal comparison (numeric values).
   */
  LESS_THAN_OR_EQUAL = 'LessThanOrEqual',

  /**
   * String contains comparison.
   */
  CONTAINS = 'Contains',

  /**
   * String does not contain comparison.
   */
  NOT_CONTAINS = 'NotContains',
}

/**
 * Filter configuration for online evaluation.
 *
 * Filters determine which agent traces should be included in the evaluation
 * based on trace properties.
 */
export interface FilterConfig {
  /**
   * The key or field name to filter on within the agent trace data.
   *
   * @example 'user.region'
   */
  readonly key: string;

  /**
   * The comparison operator to use for filtering.
   */
  readonly operator: FilterOperator;

  /**
   * The value to compare against using the specified operator.
   */
  readonly value: string | number | boolean;
}

/**
 * Configuration for CloudWatch Logs data source.
 */
export interface CloudWatchLogsDataSourceConfig {
  /**
   * The list of CloudWatch log group names to monitor for agent traces.
   *
   * @minimum 1
   * @maximum 5
   */
  readonly logGroupNames: string[];

  /**
   * The list of service names to filter traces within the specified log groups.
   * Used to identify relevant agent sessions.
   *
   * For agents hosted on AgentCore Runtime, service name follows the format:
   * `<agent-runtime-name>.<agent-runtime-endpoint-name>`
   */
  readonly serviceNames: string[];
}

/**
 * Base properties for creating an OnlineEvaluationConfig.
 * The actual OnlineEvaluationProps is defined in online-evaluation-config.ts
 * to avoid circular dependencies.
 */
export interface OnlineEvaluationBaseProps {
  /**
   * The name of the online evaluation configuration.
   *
   * Must be unique within your account. Valid characters are a-z, A-Z, 0-9, _ (underscore).
   * Must start with a letter and can be up to 48 characters long.
   *
   * @pattern ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
   */
  readonly configName: string;

  /**
   * The IAM role that provides permissions for the evaluation to access AWS services.
   *
   * If not provided, a role will be created automatically with the required permissions.
   *
   * @default - A new role will be created
   */
  readonly executionRole?: iam.IRole;

  /**
   * The description of the online evaluation configuration.
   *
   * @default - No description
   * @maxLength 200
   */
  readonly description?: string;

  /**
   * The percentage of agent traces to sample for evaluation.
   *
   * @default 10
   * @minimum 0.01
   * @maximum 100
   */
  readonly samplingPercentage?: number;

  /**
   * The list of filters that determine which agent traces should be evaluated.
   *
   * @default - No filters (evaluate all sampled traces)
   * @maximum 5
   */
  readonly filters?: FilterConfig[];

  /**
   * The number of minutes of inactivity after which an agent session
   * is considered complete and ready for evaluation.
   *
   * @default 15
   * @minimum 1
   * @maximum 1440
   */
  readonly sessionTimeoutMinutes?: number;

  /**
   * The execution status of the online evaluation configuration.
   *
   * Controls whether the evaluation actively processes agent traces.
   *
   * @default ExecutionStatus.ENABLED
   */
  readonly executionStatus?: ExecutionStatus;
}

/**
 * The result of binding an EvaluatorReference.
 */
export interface EvaluatorReferenceBindResult {
  /**
   * The evaluator identifier.
   */
  readonly evaluatorId: string;
}

/**
 * The result of binding a DataSourceConfig.
 */
export interface DataSourceConfigBindResult {
  /**
   * The CloudWatch Logs data source configuration.
   */
  readonly cloudWatchLogs: CloudWatchLogsDataSourceConfig;
}

/**
 * The level at which a custom evaluator assesses agent performance.
 *
 * Determines what granularity of data the evaluator operates on.
 */
export enum EvaluationLevel {
  /**
   * Evaluates individual tool call invocations within a trace.
   */
  TOOL_CALL = 'TOOL_CALL',

  /**
   * Evaluates a complete agent trace (a single request-response cycle).
   */
  TRACE = 'TRACE',

  /**
   * Evaluates an entire agent session (multiple traces across a conversation).
   */
  SESSION = 'SESSION',
}

/**
 * A categorical rating scale option for custom evaluators.
 *
 * Categorical scales define discrete labels for scoring agent performance.
 */
export interface CategoricalRatingOption {
  /**
   * The label for this rating option.
   *
   * @example 'Good'
   */
  readonly label: string;

  /**
   * The description that explains what this rating represents.
   *
   * @example 'The response fully addresses the user query with accurate information.'
   */
  readonly definition: string;
}

/**
 * A numerical rating scale option for custom evaluators.
 *
 * Numerical scales define labeled numeric values for scoring agent performance.
 */
export interface NumericalRatingOption {
  /**
   * The label for this rating option.
   *
   * @example 'Excellent'
   */
  readonly label: string;

  /**
   * The description that explains what this numerical rating represents.
   *
   * @example 'The response is comprehensive, accurate, and well-structured.'
   */
  readonly definition: string;

  /**
   * The numerical value for this rating scale option.
   *
   * @example 5
   */
  readonly value: number;
}

/**
 * Inference configuration for a custom LLM-as-a-Judge evaluator.
 *
 * Controls how the foundation model generates evaluation responses.
 */
export interface EvaluatorInferenceConfig {
  /**
   * The maximum number of tokens to generate in the model response.
   *
   * @default - Service default
   */
  readonly maxTokens?: number;

  /**
   * The temperature value that controls randomness in the model's responses.
   *
   * Higher values produce more diverse outputs. Range: 0.0 to 1.0.
   *
   * @default - Service default
   */
  readonly temperature?: number;

  /**
   * The top-p sampling parameter that controls the diversity of the model's responses.
   *
   * Range: 0.0 to 1.0.
   *
   * @default - Service default
   */
  readonly topP?: number;
}

/**
 * Attributes for importing an existing Evaluator.
 */
export interface EvaluatorAttributes {
  /**
   * The ARN of the evaluator.
   */
  readonly evaluatorArn: string;

  /**
   * The ID of the evaluator.
   */
  readonly evaluatorId: string;

  /**
   * The name of the evaluator.
   *
   * @default - No name available
   */
  readonly evaluatorName?: string;
}

/**
 * Attributes for importing an existing OnlineEvaluationConfig.
 */
export interface OnlineEvaluationConfigAttributes {
  /**
   * The ARN of the online evaluation configuration.
   */
  readonly onlineEvaluationConfigArn: string;

  /**
   * The ID of the online evaluation configuration.
   */
  readonly onlineEvaluationConfigId: string;

  /**
   * The name of the online evaluation configuration.
   */
  readonly onlineEvaluationConfigName: string;

  /**
   * The ARN of the IAM execution role.
   *
   * @default - No role ARN provided
   */
  readonly executionRoleArn?: string;
}

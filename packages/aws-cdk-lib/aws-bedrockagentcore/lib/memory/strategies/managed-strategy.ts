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

import type { IConstruct } from 'constructs';
import type { MetadataSchemaEntry } from './metadata-schema';
import { renderMemoryRecordSchema, validateMetadataSchema } from './metadata-schema';
import type { IModel } from '../../../../aws-bedrock';
import type * as bedrockagentcore from '../../../../aws-bedrockagentcore';
import { Grant, type IGrantable } from '../../../../aws-iam';
import { Arn, ArnFormat } from '../../../../core';
import { validateStringFieldLength, throwIfInvalid, validateFieldPattern } from '../../common/validation-helpers';
import type { MemoryStrategyCommonProps, IMemoryStrategy } from '../memory-strategy';
import { MemoryStrategyType, MEMORY_NAME_MIN_LENGTH, MEMORY_NAME_MAX_LENGTH } from '../memory-strategy';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * Minimum length for prompt
 * @internal
 */
const PROMPT_MIN_LENGTH = 1;
/**
 * Maximum length for prompt
 * @internal
 */
const PROMPT_MAX_LENGTH = 30000;

/**
 * Configuration for overriding model and prompt template
 */
export interface OverrideConfig {
  /**
   * The model to use for consolidation/extraction
   */
  readonly model: IModel;
  /**
   * The prompt that will be appended to the system prompt to define
   * the model's memory consolidation/extraction strategy.
   * This configuration provides customization to how the model identifies and extracts
   * relevant information for memory storage. You can use the default user prompt or create a customized one.
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/system-prompts.html
   */
  readonly appendToPrompt: string;
}

/**
 * Configuration for episodic memory reflection
 */
export interface EpisodicReflectionConfiguration {
  /**
   * Namespaces for episodic reflection
   * Minimum 1 namespace required
   */
  readonly namespaces: string[];
  /**
   * Schema for metadata fields attached to records produced by reflection.
   *
   * Configured independently from the strategy-level `metadataSchema`, allowing reflection
   * memories to have a different metadata shape than memories extracted from raw events.
   * Must contain between 1 and 20 entries.
   *
   * @default - No metadata schema for reflection records
   */
  readonly metadataSchema?: MetadataSchemaEntry[];
}

/**
 * Configuration parameters for a memory strategy that can override
 * existing built-in default prompts/models
 */
export interface ManagedStrategyProps extends MemoryStrategyCommonProps {
  /**
   * The configuration for the custom extraction.
   * This configuration provides customization to how the model identifies
   * and extracts relevant information for memory storage.
   * @default - No custom extraction
   */
  readonly customExtraction?: OverrideConfig;
  /**
   * The configuration for the custom consolidation.
   * This configuration provides customization to how the model identifies
   * and extracts relevant information for memory storage.
   * @default - No custom extraction
   */
  readonly customConsolidation?: OverrideConfig;
  /**
   * The namespaces for the strategy
   * Represents a namespace for organizing memory data
   * Use a hierarchical format separated by forward slashes (/)
   *
   * Use a hierarchical format separated by forward slashes (/) to organize namespaces logically.
   * You can include these defined variables:
   *
   * - {sessionId} - the user identifier to be created in the CreateEvent API
   * - {memoryStrategyId} - an identifier for an extraction strategy
   * - {sessionId} - an identifier for each session
   *
   * Example namespace path:
   * /strategies/{memoryStrategyId}/actions/{actionId}/sessions/{sessionId}
   *
   * After memory creation, this namespace might look like:
   * /actor/actor-3afc5aa8fef9/strategy/summarization-fy5c5fwc7/session/session-qj7tpd1kvr8
   */
  readonly namespaces: string[];
  /**
   * Configuration for episodic memory reflection (only applicable for EPISODIC strategy type)
   * Defines additional namespaces for reflection-based episodic recall
   * @default - No reflection configuration
   */
  readonly reflectionConfiguration?: EpisodicReflectionConfiguration;
  /**
   * Schema for metadata fields attached to records produced by this strategy.
   *
   * Each entry declares a metadata field name (and optional type / extraction rules) that
   * the service will populate on extracted memory records. Indexed keys can later be used
   * to filter retrieval. Must contain between 1 and 20 entries.
   *
   * For `EPISODIC` strategies, this controls metadata for memories extracted from raw events;
   * see `EpisodicReflectionConfiguration.metadataSchema` for reflection records.
   *
   * @default - No metadata schema
   */
  readonly metadataSchema?: MetadataSchemaEntry[];
}

/**
 * Managed memory strategy that handles both built-in and override configurations.
 * This strategy can be used for quick setup with built-in defaults or customized
 * with specific models and prompt templates.
 */
export class ManagedMemoryStrategy implements IMemoryStrategy {
  public readonly strategyName: string;
  public readonly description?: string;
  /**
   * The namespaces for the strategy
   */
  public readonly namespaces: string[];
  /**
   * The configuration for the custom consolidation.
   */
  public readonly consolidationOverride?: OverrideConfig;
  /**
   * The configuration for the custom extraction.
   */
  public readonly extractionOverride?: OverrideConfig;
  /**
   * The configuration for episodic reflection.
   */
  public readonly reflectionConfiguration?: EpisodicReflectionConfiguration;
  /**
   * The metadata schema for memory records produced by this strategy.
   */
  public readonly metadataSchema?: MetadataSchemaEntry[];
  public readonly strategyType: MemoryStrategyType;

  /**
   * Constructor to create a new managed memory strategy
   * @param strategyType the strategy type
   * @param props the properties for the strategy
   */
  constructor(strategyType: MemoryStrategyType, props: ManagedStrategyProps) {
    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.strategyName = props.strategyName;
    this.description = props.description;
    this.namespaces = props.namespaces;
    this.strategyType = strategyType;
    this.consolidationOverride = props.customConsolidation;
    this.extractionOverride = props.customExtraction;
    this.reflectionConfiguration = props.reflectionConfiguration;
    this.metadataSchema = props.metadataSchema;

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------
    throwIfInvalid(this._validatePrompt, this.consolidationOverride?.appendToPrompt);
    throwIfInvalid(this._validatePrompt, this.extractionOverride?.appendToPrompt);
    throwIfInvalid(this._validateMemoryStrategyName, this.strategyName);
    if (this.namespaces) {
      throwIfInvalid(this._validateMemoryStrategyNamespaces, this.namespaces);
    }
    if (this.reflectionConfiguration) {
      throwIfInvalid(this._validateReflectionConfiguration, this.reflectionConfiguration);
    }
    throwIfInvalid(validateMetadataSchema, this.metadataSchema);
    throwIfInvalid(validateMetadataSchema, this.reflectionConfiguration?.metadataSchema);
  }

  /**
   * Renders the network configuration as a CloudFormation property.
   * @returns The CloudFormation property for the memory strategy.
   */
  public render(): bedrockagentcore.CfnMemory.MemoryStrategyProperty {
    const memoryRecordSchema = renderMemoryRecordSchema(this.metadataSchema);

    // If no overrides and no reflection config, use built-in strategy format
    if (!this.consolidationOverride && !this.extractionOverride && !this.reflectionConfiguration) {
      const cfnStrategyMap: Record<MemoryStrategyType, string> = {
        [MemoryStrategyType.USER_PREFERENCE]: 'userPreferenceMemoryStrategy',
        [MemoryStrategyType.SEMANTIC]: 'semanticMemoryStrategy',
        [MemoryStrategyType.SUMMARIZATION]: 'summaryMemoryStrategy',
        [MemoryStrategyType.EPISODIC]: 'episodicMemoryStrategy',
        [MemoryStrategyType.CUSTOM]: 'customMemoryStrategy',
      };
      const strategyKey = cfnStrategyMap[this.strategyType];
      return {
        [strategyKey]: {
          name: this.strategyName,
          description: this.description,
          namespaces: this.namespaces,
          memoryRecordSchema,
        },
      };
    }

    // For episodic with reflection config only (no other overrides)
    if (this.strategyType === MemoryStrategyType.EPISODIC && this.reflectionConfiguration &&
        !this.consolidationOverride && !this.extractionOverride) {
      return {
        episodicMemoryStrategy: {
          name: this.strategyName,
          description: this.description,
          namespaces: this.namespaces,
          memoryRecordSchema,
          reflectionConfiguration: {
            namespaces: this.reflectionConfiguration.namespaces,
            memoryRecordSchema: renderMemoryRecordSchema(this.reflectionConfiguration.metadataSchema),
          },
        },
      };
    }

    // If overrides are provided, use custom strategy format
    const cfnStrategyMap: Record<MemoryStrategyType, string> = {
      [MemoryStrategyType.USER_PREFERENCE]: 'userPreferenceOverride',
      [MemoryStrategyType.SEMANTIC]: 'semanticOverride',
      [MemoryStrategyType.SUMMARIZATION]: 'summaryOverride',
      [MemoryStrategyType.EPISODIC]: 'episodicOverride',
      [MemoryStrategyType.CUSTOM]: '',
    };

    const strategyKey = cfnStrategyMap[this.strategyType];
    return {
      customMemoryStrategy: {
        name: this.strategyName,
        description: this.description,
        namespaces: this.namespaces,
        memoryRecordSchema,
        configuration: {
          [strategyKey]: {
            ...(this.consolidationOverride && {
              consolidation: {
                modelId: Arn.split(this.consolidationOverride.model.modelArn, ArnFormat.SLASH_RESOURCE_NAME)
                  .resourceName,
                appendToPrompt: this.consolidationOverride.appendToPrompt,
              },
            }),
            ...(this.extractionOverride && {
              extraction: {
                modelId: Arn.split(this.extractionOverride.model.modelArn, ArnFormat.SLASH_RESOURCE_NAME)
                  .resourceName,
                appendToPrompt: this.extractionOverride.appendToPrompt,
              },
            }),
          },
        },
      },
    };
  }

  /**
   * Grants the necessary permissions to the role
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The grantee to grant permissions to
   * @returns The Grant object for chaining
   */
  public grant(grantee: IGrantable): Grant | undefined {
    // Memory custom strategies use the model for consolidation/extraction of memories.
    // The service invokes the model via bedrock:InvokeModel (and InvokeModelWithResponseStream).
    // The wildcard 'bedrock:InvokeModel*' covers both actions, matching the AWS managed policy:
    // AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy
    // @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-configuring-custom-strategies.html
    // @see https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy.html
    const grant1 = this.consolidationOverride
      ? Grant.addToPrincipal({ grantee, actions: ['bedrock:InvokeModel*'], resourceArns: [this.consolidationOverride.model.modelArn] })
      : undefined;
    const grant2 = this.extractionOverride
      ? Grant.addToPrincipal({ grantee, actions: ['bedrock:InvokeModel*'], resourceArns: [this.extractionOverride.model.modelArn] })
      : undefined;
    return grant1 && grant2 ? grant1.combine(grant2) : grant1 || grant2;
  }

  // ------------------------------------------------------
  // VALIDATORS
  // ------------------------------------------------------
  /**
   * Validates the memory strategy name
   * @param name - The name to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateMemoryStrategyName = (name: string, scope?: IConstruct): string[] => {
    let errors: string[] = [];

    errors.push(...validateStringFieldLength({
      value: name,
      fieldName: 'Memory name',
      minLength: MEMORY_NAME_MIN_LENGTH,
      maxLength: MEMORY_NAME_MAX_LENGTH,
    }, scope));

    // Check if name matches the AWS API pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
    // Must start with a letter, followed by up to 47 letters, numbers, or underscores
    const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
    errors.push(...validateFieldPattern(name, 'Memory name', validNamePattern, undefined, scope));

    return errors;
  };

  /**
   * Validates the prompt
   * @param prompt - The prompt to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validatePrompt = (prompt?: string, scope?: IConstruct): string[] => {
    let errors: string[] = [];
    if (!prompt) {
      return errors;
    }
    errors.push(...validateStringFieldLength({
      value: prompt,
      fieldName: 'Prompt',
      minLength: PROMPT_MIN_LENGTH,
      maxLength: PROMPT_MAX_LENGTH,
    }, scope));
    return errors;
  };

  /**
   * Validates the memory strategy namespaces
   * @param namespaces - The namespaces to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateMemoryStrategyNamespaces = (namespaces: string[]): string[] => {
    let errors: string[] = [];

    if (namespaces.length === 0) {
      return errors;
    }

    for (const namespace of namespaces) {
      // Only check for template variables in namespace definition
      if (namespace.includes('{') && !(
        namespace.includes('{actorId}') ||
            namespace.includes('{sessionId}') ||
            namespace.includes('{memoryStrategyId}')
      )) {
        errors.push(`Namespace with templates should contain valid variables: ${namespace}`);
      }
    }

    return errors;
  };

  /**
   * Validates the episodic reflection configuration
   * @param config - The reflection configuration to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateReflectionConfiguration = (config: EpisodicReflectionConfiguration): string[] => {
    let errors: string[] = [];

    // Validate that namespaces array is not empty
    if (!config.namespaces || config.namespaces.length === 0) {
      errors.push('Reflection configuration must have at least one namespace');
    }

    // Validate each namespace in reflection configuration
    if (config.namespaces) {
      errors.push(...this._validateMemoryStrategyNamespaces(config.namespaces));
    }

    return errors;
  };
}

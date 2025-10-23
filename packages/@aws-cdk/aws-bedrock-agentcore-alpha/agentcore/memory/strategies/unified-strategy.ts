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

import { IBedrockInvokable } from '@aws-cdk/aws-bedrock-alpha';
import { Arn, ArnFormat } from 'aws-cdk-lib';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { MemoryStrategyCommonProps, IMemoryStrategy, MemoryStrategyClassType, MemoryStrategyType } from '../memory-strategy';
import { validateStringFieldLength, throwIfInvalid, validateFieldPattern } from '../validation-helpers';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * Minimum length for memory strategy name
 * @internal
 */
const MEMORY_NAME_MIN_LENGTH = 1;
/**
 * Maximum length for memory strategy name
 * @internal
 */
const MEMORY_NAME_MAX_LENGTH = 48;
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
  readonly model: IBedrockInvokable;
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
 * Configuration parameters for a memory strategy that can override
 * existing built-in default prompts/models
 */
export interface UnifiedStrategyProps extends MemoryStrategyCommonProps {
  /**
   * The configuration for the custom extraction.
   * This configuration provides customization to how the model identifies
   * and extracts relevant information for memory storage.
   * @default - No custom extraction
   * @required - No
   */
  readonly customExtraction?: OverrideConfig;
  /**
   * The configuration for the custom consolidation.
   * This configuration provides customization to how the model identifies
   * and extracts relevant information for memory storage.
   * @default - No custom extraction
   * @required - No
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
   * @required - Yes
   */
  readonly namespaces: string[];
}

/**
 * Unified memory strategy that handles both built-in and override configurations.
 * This strategy can be used for quick setup with built-in defaults or customized
 * with specific models and prompt templates.
 */
export class UnifiedMemoryStrategy implements IMemoryStrategy {
  public readonly strategyClassType: MemoryStrategyClassType;
  public readonly name: string;
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
  public readonly strategyType: MemoryStrategyType;

  /**
   * Constructor to create a new unified memory strategy
   * @param strategyType the strategy type
   * @param props the properties for the strategy
   */
  constructor(strategyType: MemoryStrategyType, props: UnifiedStrategyProps) {
    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.name = props.name;
    this.description = props.description;
    this.namespaces = props.namespaces;
    this.strategyType = strategyType;
    this.consolidationOverride = props.customConsolidation;
    this.extractionOverride = props.customExtraction;

    // Determine strategy class type based on whether overrides are provided
    this.strategyClassType = (this.consolidationOverride || this.extractionOverride)
      ? MemoryStrategyClassType.BUILT_IN_OVERRIDE
      : MemoryStrategyClassType.BUILT_IN;

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------
    throwIfInvalid(this._validatePrompt, this.consolidationOverride?.appendToPrompt);
    throwIfInvalid(this._validatePrompt, this.extractionOverride?.appendToPrompt);
    throwIfInvalid(this._validateMemoryStrategyName, this.name);
    if (this.namespaces) {
      throwIfInvalid(this._validateMemoryStrategyNamespaces, this.namespaces);
    }
  }

  /**
   * Renders the network configuration as a CloudFormation property.
   * @returns The CloudFormation property for the memory strategy.
   */
  public render(): bedrockagentcore.CfnMemory.MemoryStrategyProperty {
    // If no overrides, use built-in strategy format
    if (!this.consolidationOverride && !this.extractionOverride) {
      const cfnStrategyMap: Record<MemoryStrategyType, string> = {
        [MemoryStrategyType.USER_PREFERENCE]: 'userPreferenceMemoryStrategy',
        [MemoryStrategyType.SEMANTIC]: 'semanticMemoryStrategy',
        [MemoryStrategyType.SUMMARIZATION]: 'summaryMemoryStrategy',
        [MemoryStrategyType.CUSTOM]: 'customMemoryStrategy',
      };
      const strategyKey = cfnStrategyMap[this.strategyType];
      return {
        [strategyKey]: {
          name: this.name,
          description: this.description,
          namespaces: this.namespaces,
          type: this.strategyType,
        },
      };
    }

    // If overrides are provided, use custom strategy format
    const cfnStrategyMap: Record<MemoryStrategyType, string> = {
      [MemoryStrategyType.USER_PREFERENCE]: 'userPreferenceOverride',
      [MemoryStrategyType.SEMANTIC]: 'semanticOverride',
      [MemoryStrategyType.SUMMARIZATION]: 'summaryOverride',
      [MemoryStrategyType.CUSTOM]: '',
    };

    const strategyKey = cfnStrategyMap[this.strategyType];
    return {
      customMemoryStrategy: {
        name: this.name,
        description: this.description,
        namespaces: this.namespaces,
        type: this.strategyType,
        configuration: {
          [strategyKey]: {
            ...(this.consolidationOverride && {
              consolidation: {
                modelId: Arn.split(this.consolidationOverride.model.invokableArn, ArnFormat.SLASH_RESOURCE_NAME)
                  .resourceName,
                appendToPrompt: this.consolidationOverride.appendToPrompt,
              },
            }),
            ...(this.extractionOverride && {
              extraction: {
                modelId: Arn.split(this.extractionOverride.model.invokableArn, ArnFormat.SLASH_RESOURCE_NAME)
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
   * @param role - The role to grant permissions to
   * @returns The Grant object for chaining
   */
  public grant(role: IRole): Grant | undefined {
    const grant1 = this.consolidationOverride?.model.grantInvoke(role);
    const grant2 = this.extractionOverride?.model.grantInvoke(role);
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
  private _validateMemoryStrategyName = (name: string): string[] => {
    let errors: string[] = [];

    errors.push(...validateStringFieldLength({
      value: name,
      fieldName: 'Memory name',
      minLength: MEMORY_NAME_MIN_LENGTH,
      maxLength: MEMORY_NAME_MAX_LENGTH,
    }));

    // Check if name matches the AWS API pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
    // Must start with a letter, followed by up to 47 letters, numbers, or underscores
    const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
    errors.push(...validateFieldPattern(name, 'Memory name', validNamePattern));

    return errors;
  };

  /**
   * Validates the prompt
   * @param prompt - The prompt to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validatePrompt = (prompt?: string): string[] => {
    let errors: string[] = [];
    if (!prompt) {
      return errors;
    }
    errors.push(...validateStringFieldLength({
      value: prompt,
      fieldName: 'Prompt',
      minLength: PROMPT_MIN_LENGTH,
      maxLength: PROMPT_MAX_LENGTH,
    }));
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
}

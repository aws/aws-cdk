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

import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import {
  IMemoryStrategy,
  MemoryStrategyClassType,
  MemoryStrategyCommonProps,
  MemoryStrategyType,
} from '../memory-strategy';
import { throwIfInvalid, validateFieldPattern, validateStringFieldLength } from '../validation-helpers';

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
 * If you need long-term memory for context recall across sessions,
 * you can setup memory extraction strategies to extract the relevant memory from the raw events.
 * Use built-in strategies for quick setup
 */
export class BuiltInMemoryStrategy implements IMemoryStrategy {
  // ------------------------------------------------------
  // Built-in Static methods
  // ------------------------------------------------------
  public readonly strategyClassType: MemoryStrategyClassType;
  public readonly name: string;
  public readonly description?: string;
  public readonly namespaces: string[];
  public readonly strategyType: MemoryStrategyType;

  constructor(strategyType: MemoryStrategyType, props: MemoryStrategyCommonProps) {
    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.name = props.name;
    this.description = props.description;
    this.namespaces = props.namespaces;
    this.strategyType = strategyType;
    this.strategyClassType = MemoryStrategyClassType.BUILT_IN;

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------
    throwIfInvalid(this._validateMemoryStrategyName, this.name);
    throwIfInvalid(this._validateMemoryStrategyNamespaces, this.namespaces);
  }

  /**
   * Renders the network configuration as a CloudFormation property.
   * @returns The CloudFormation property for the memory strategy.
   */
  public render(): bedrockagentcore.CfnMemory.MemoryStrategyProperty {
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
  /**
   * Grants the necessary permissions to the role
   * @param _role - The role to grant permissions to
   * @returns The Grant object for chaining
   */
  public grant(_role: IRole): Grant | undefined {
    return undefined;
  }

  // ------------------------------------------------------
  // VALIDATORS
  // ------------------------------------------------------
  /**
   * Validates the memory strategy
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

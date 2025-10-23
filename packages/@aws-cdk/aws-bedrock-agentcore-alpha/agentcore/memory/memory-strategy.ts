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
import * as iam from 'aws-cdk-lib/aws-iam';
// Internal libs
import { UnifiedMemoryStrategy, UnifiedStrategyProps } from './strategies/unified-strategy';
import { SelfManagedMemoryStrategy, SelfManagedStrategyProps } from './strategies/self-managed-strategy';

/**
 * Internal enum used to differentiate the different classes of memory strategies
 */
export enum MemoryStrategyClassType {
  /**
   * Built-in memory strategy
   */
  BUILT_IN = 'BUILT-IN',
  /**
   * Overrides a built-in memory strategy
   */
  BUILT_IN_OVERRIDE = 'BUILT_IN_OVERRIDE',
  /**
   * Fully custom memory strategy
   */
  CUSTOM = 'CUSTOM',
}

/**
 * Long-term memory extraction strategy types.
 */
export enum MemoryStrategyType {
  /**
   * Summarization strategy - extracts concise summaries to preserve critical context and key insights
   */
  SUMMARIZATION = 'SUMMARIZATION',
  /**
   * Semantic memory strategy - extracts general factual knowledge, concepts and meanings from raw conversations
   * using vector embeddings for similarity search.
   */
  SEMANTIC = 'SEMANTIC',
  /**
   * User preferences strategy - extracts user behavior patterns from raw conversations.
   */
  USER_PREFERENCE = 'USER_PREFERENCE',
  /**
   * Customize memory processing through custom foundation model and prompt templates.
   */
  CUSTOM = 'CUSTOM',
}

/******************************************************************************
 *                                 Common
 *****************************************************************************/
/**
 * Configuration parameters common for any memory strategy
 */
export interface MemoryStrategyCommonProps {
  /**
   * The name for the strategy
   * @required - Yes
   */
  readonly name: string;
  /**
   * The description of the strategy
   * @default No description
   * @required - No
   */
  readonly description?: string;
}

/******************************************************************************
 *                                 Interface
 *****************************************************************************/
/**
 * Interface for Memory strategies
 */
export interface IMemoryStrategy {
  /**
   * The name of the memory strategy
   */
  readonly name: string;
  /**
   * The description of the memory strategy
   */
  readonly description?: string;
  /**
   * The class of memory strategy (built-in or custom)
   */
  readonly strategyClassType: MemoryStrategyClassType;
  /**
   * The type of memory strategy
   */
  readonly strategyType: MemoryStrategyType;
  /**
   * Renders internal attributes to CloudFormation
   */
  render(): bedrockagentcore.CfnMemory.MemoryStrategyProperty;
  /**
   * Grants the necessary permissions to the role
   * @param role - The role to grant permissions to
   * @returns The Grant object for chaining
   */
  grant(role: iam.IRole): iam.Grant | undefined;
}

/******************************************************************************
 *                                 Factory
 *****************************************************************************/
/**
 * Factory class for creating memory strategies
 * If you need long-term memory for context recall across sessions, you can setup memory extraction strategies to extract the relevant memory from the raw events.
 * Use built-in strategies for quick setup, use built-in strategies with override to specify models and prompt templates.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-strategies.html
 */
export class MemoryStrategy {
  /**
   * Default strategies for organizing and extracting memory data, each optimized for specific use cases.
   * This strategy compresses conversations into concise overviews, preserving essential context and key insights for quick recall.
   * Extracted memory example: Users confused by cloud setup during onboarding.
   * @returns A UnifiedMemoryStrategy.
   */
  public static usingBuiltInSummarization(): UnifiedMemoryStrategy {
    return new UnifiedMemoryStrategy(MemoryStrategyType.SUMMARIZATION, {
      name: 'summary_builtin_cdkGen0001',
      description: 'Summarize interactions to preserve critical context and key insights',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}'],
    });
  }
  /**
   * Default strategies for organizing and extracting memory data, each optimized for specific use cases.
   * Distills general facts, concepts, and underlying meanings from raw conversational data, presenting the information in a context-independent format.
   * Extracted memory example: In-context learning = task-solving via examples, no training needed.
   * @returns A UnifiedMemoryStrategy.
   */
  public static usingBuiltInSemantic(): UnifiedMemoryStrategy {
    return new UnifiedMemoryStrategy(MemoryStrategyType.SEMANTIC, {
      name: 'semantic_builtin_cdkGen0001',
      description:
      'Extract general factual knowledge, concepts and meanings from raw conversations in a context-independent format.',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
    });
  }
  /**
   * Default strategies for organizing and extracting memory data, each optimized for specific use cases.
   * Captures individual preferences, interaction patterns, and personalized settings to enhance future experiences.
   * Extracted memory example: User needs clear guidance on cloud storage account connection during onboarding.
   * @returns A UnifiedMemoryStrategy.
   */
  public static usingBuiltInUserPreference(): UnifiedMemoryStrategy {
    return new UnifiedMemoryStrategy(MemoryStrategyType.USER_PREFERENCE, {
      name: 'preference_builtin_cdkGen0001',
      description: 'Capture individual preferences, interaction patterns, and personalized settings to enhance future experiences.',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
    });
  }
  /**
   * Creates a semantic memory strategy with custom configuration.
   * Distills general facts, concepts, and underlying meanings from raw conversational data, presenting the information in a context-independent format.
   * Extracted memory example: In-context learning = task-solving via examples, no training needed.
   * @param config - The configuration for the semantic memory strategy.
   * @returns A UnifiedMemoryStrategy.
   */
  public static usingSemantic(config: UnifiedStrategyProps): UnifiedMemoryStrategy {
    return new UnifiedMemoryStrategy(MemoryStrategyType.SEMANTIC, config);
  }
  /**
   * Creates a user preference memory strategy with custom configuration.
   * Captures individual preferences, interaction patterns, and personalized settings to enhance future experiences.
   * Extracted memory example: User needs clear guidance on cloud storage account connection during onboarding.
   * @param config - The configuration for the user preference memory strategy.
   * @returns A UnifiedMemoryStrategy.
   */
  public static usingUserPreference(config: UnifiedStrategyProps): UnifiedMemoryStrategy {
    return new UnifiedMemoryStrategy(MemoryStrategyType.USER_PREFERENCE, config);
  }
  /**
   * Creates a summarization memory strategy with custom configuration.
   * This strategy compresses conversations into concise overviews, preserving essential context and key insights for quick recall.
   * Extracted memory example: Users confused by cloud setup during onboarding.
   * @param config - The configuration for the summarization memory strategy.
   * @returns A UnifiedMemoryStrategy.
   */
  public static usingSummarization(config: UnifiedStrategyProps): UnifiedMemoryStrategy {
    return new UnifiedMemoryStrategy(MemoryStrategyType.SUMMARIZATION, config);
  }
  /**
   * Creates a self-managed memory strategy.
   * A self-managed strategy gives you complete control over your memory extraction and consolidation pipelines.
   * @param config - The configuration for the self-managed memory strategy.
   * @returns A SelfManagedMemoryStrategy.
   */
  public static usingSelfManaged(config: SelfManagedStrategyProps): SelfManagedMemoryStrategy {
    // Scope is passed for future use in permission granting
    return new SelfManagedMemoryStrategy(MemoryStrategyType.CUSTOM, config);
  }
}

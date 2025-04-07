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
import * as validation from './validation-helpers';
/**
 * Memory options for agent conversational context retention.
 * Memory enables agents to maintain context across multiple sessions and recall past interactions.
 * By default, agents retain context from the current session only.
 */
enum MemoryType {
  /**
   * Your agent uses memory summarization to enhance accuracy using
   * advanced prompt templates in Amazon Bedrock to call the foundation model with guidelines
   * to summarize all your sessions. You can optionally modify the default prompt template
   * or provide your own custom parser to parse model output.
   *
   * Since the summarization process takes place in an asynchronous flow after a session ends,
   * logs for any failures in summarization due to overridden template or parser will be
   * published to your AWS accounts. For more information on enabling the logging, see
   * Enable memory summarization log delivery.
   */
  SESSION_SUMMARY = 'SESSION_SUMMARY',
}

/**
 * Properties for SessionSummaryConfiguration.
 */
export interface SessionSummaryMemoryProps {
  /**
   * Duration in days for which session summaries are retained (1-365)
   * @default 30
   */
  readonly memoryDurationDays?: number;

  /**
   * Maximum number of recent session summaries to include (min 1)
   * @default 20
   */
  readonly maxRecentSessions?: number;
}

/**
 * Memory class for managing Bedrock Agent memory configurations. Enables conversational context retention
 * across multiple sessions through session identifiers. Memory context is stored with unique
 * memory IDs per user, allowing access to conversation history and summaries. Supports viewing
 * stored sessions and clearing memory.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/agents-memory.html
 */
export class Memory {
  /**
   * Returns session summary memory with default configuration.
   * @default memoryDurationDays=30, maxRecentSessions=20
   */
  public static readonly SESSION_SUMMARY = Memory.sessionSummary({ memoryDurationDays: 30, maxRecentSessions: 20 });

  /**
   * Creates a session summary memory with custom configuration.
   * @param props Optional memory configuration properties
   * @returns Memory configuration object
   */
  public static sessionSummary(props: SessionSummaryMemoryProps): CfnAgent.MemoryConfigurationProperty {
    // Do some checks
    validation.throwIfInvalid(this.validateSessionSummaryMemoryProps, props);

    return {
      enabledMemoryTypes: [MemoryType.SESSION_SUMMARY],
      storageDays: props?.memoryDurationDays ?? 30,
      sessionSummaryConfiguration: {
        maxRecentSessions: props?.maxRecentSessions ?? 20,
      },
    };
  }

  /**
   * Validate at synth time the configuration.
   */
  private static validateSessionSummaryMemoryProps(props: SessionSummaryMemoryProps): string[] {
    let errors: string[] = [];

    // Validate storage days is between 0 and 365
    if (props.memoryDurationDays !== undefined) {
      if (props.memoryDurationDays < 1 || props.memoryDurationDays > 365) {
        errors.push('memoryDurationDays must be between 1 and 365');
      }
    }
    if (props.maxRecentSessions !== undefined) {
      if (props.maxRecentSessions < 1) {
        errors.push('maxRecentSessions must be greater than 0');
      }
    }

    return errors;
  }
}

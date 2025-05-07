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

import { Duration } from 'aws-cdk-lib/core';
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
   * Duration for which session summaries are retained (between 1 and 365 days)
   * @default Duration.days(30)
   */
  readonly memoryDuration?: Duration;

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
   * @default memoryDuration=Duration.days(30), maxRecentSessions=20
   */
  public static readonly SESSION_SUMMARY = Memory.sessionSummary({ memoryDuration: Duration.days(30), maxRecentSessions: 20 });

  /**
   * Creates a session summary memory with custom configuration.
   * @param props Optional memory configuration properties
   * @returns Memory configuration object
   */
  public static sessionSummary(props: SessionSummaryMemoryProps): CfnAgent.MemoryConfigurationProperty {
    // Do some checks
    validation.throwIfInvalid((config: SessionSummaryMemoryProps) => {
      let errors: string[] = [];

      // Validate memory duration is between 1 and 365 days
      if (config.memoryDuration !== undefined) {
        const days = config.memoryDuration.toDays();
        if (days < 1 || days > 365) {
          errors.push('memoryDuration must be between 1 and 365 days');
        }
      }
      if (config.maxRecentSessions !== undefined) {
        if (config.maxRecentSessions < 1) {
          errors.push('maxRecentSessions must be greater than 0');
        }
      }

      return errors;
    }, props);

    return {
      enabledMemoryTypes: [MemoryType.SESSION_SUMMARY],
      storageDays: props?.memoryDuration?.toDays() ?? 30,
      sessionSummaryConfiguration: {
        maxRecentSessions: props?.maxRecentSessions ?? 20,
      },
    };
  }
}

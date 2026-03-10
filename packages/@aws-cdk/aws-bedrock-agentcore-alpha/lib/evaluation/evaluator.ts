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

import type { BuiltinEvaluator } from './types';

/**
 * Represents a reference to a built-in evaluator for online evaluation.
 *
 * Use the static factory method to create evaluator references:
 * - `EvaluatorReference.builtin()` for built-in evaluators
 *
 * @example
 * // Using built-in evaluators
 * const helpfulness = agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.HELPFULNESS);
 * const correctness = agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.CORRECTNESS);
 */
export class EvaluatorReference {
  /**
   * Creates a reference to a built-in evaluator.
   *
   * Built-in evaluators are provided by Amazon Bedrock AgentCore and assess
   * different aspects of agent performance at various levels (session, trace, or tool call).
   *
   * @param evaluator - The built-in evaluator to reference
   * @returns An EvaluatorReference instance
   *
   * @example
   * const helpfulness = agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.HELPFULNESS);
   * const goalSuccess = agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.GOAL_SUCCESS_RATE);
   */
  public static builtin(evaluator: BuiltinEvaluator): EvaluatorReference {
    return new EvaluatorReference(evaluator);
  }

  /**
   * The evaluator identifier.
   */
  public readonly evaluatorId: string;

  private constructor(evaluatorId: string) {
    this.evaluatorId = evaluatorId;
  }

  /**
   * Renders the evaluator reference for API calls.
   * @internal
   */
  public _render(): { evaluatorId: string } {
    return {
      evaluatorId: this.evaluatorId,
    };
  }
}

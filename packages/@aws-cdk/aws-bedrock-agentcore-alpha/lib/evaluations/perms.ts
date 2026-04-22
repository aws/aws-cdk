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

/******************************************************************************
 *                               EVALUATOR
 *****************************************************************************/

/**
 * Permissions for reading evaluator information
 */
export const EVALUATOR_READ_PERMS = ['bedrock-agentcore:GetEvaluator'];

/**
 * Permissions for listing evaluators
 */
export const EVALUATOR_LIST_PERMS = ['bedrock-agentcore:ListEvaluators'];

/**
 * Permissions for managing evaluators (update and delete)
 */
export const EVALUATOR_MANAGE_PERMS = [
  'bedrock-agentcore:UpdateEvaluator',
  'bedrock-agentcore:DeleteEvaluator',
];

/**
 * Permissions for invoking an evaluator
 */
export const EVALUATOR_INVOKE_PERMS = ['bedrock-agentcore:InvokeEvaluator'];

/******************************************************************************
 *                        ONLINE EVALUATION CONFIG
 *****************************************************************************/

/**
 * Permissions for reading online evaluation configuration information
 */
export const ONLINE_EVAL_CONFIG_READ_PERMS = ['bedrock-agentcore:GetOnlineEvaluationConfig'];

/**
 * Permissions for listing online evaluation configurations
 */
export const ONLINE_EVAL_CONFIG_LIST_PERMS = ['bedrock-agentcore:ListOnlineEvaluationConfigs'];

/**
 * Permissions for managing online evaluation configurations (update and delete)
 */
export const ONLINE_EVAL_CONFIG_MANAGE_PERMS = [
  'bedrock-agentcore:UpdateOnlineEvaluationConfig',
  'bedrock-agentcore:DeleteOnlineEvaluationConfig',
];

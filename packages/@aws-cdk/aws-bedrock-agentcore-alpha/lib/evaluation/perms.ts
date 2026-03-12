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

/**
 * IAM permission constants for Online Evaluation configurations.
 */
export namespace EvaluationPerms {
  /**
   * Permissions to manage online evaluation configurations (CRUD).
   */
  export const ADMIN_PERMS = [
    'bedrock-agentcore:CreateOnlineEvaluationConfig',
    'bedrock-agentcore:GetOnlineEvaluationConfig',
    'bedrock-agentcore:UpdateOnlineEvaluationConfig',
    'bedrock-agentcore:DeleteOnlineEvaluationConfig',
    'bedrock-agentcore:ListOnlineEvaluationConfigs',
  ];

  /**
   * Permissions for the execution role to read CloudWatch Logs.
   */
  export const CLOUDWATCH_LOGS_READ_PERMS = [
    'logs:DescribeLogGroups',
    'logs:GetQueryResults',
    'logs:StartQuery',
  ];

  /**
   * Permissions for the execution role to invoke Bedrock models.
   */
  export const BEDROCK_MODEL_PERMS = [
    'bedrock:InvokeModel',
    'bedrock:InvokeModelWithResponseStream',
  ];

  /**
   * Permissions for the execution role to write evaluation results.
   */
  export const CLOUDWATCH_LOGS_WRITE_PERMS = [
    'logs:CreateLogGroup',
    'logs:CreateLogStream',
    'logs:PutLogEvents',
  ];

  /**
   * Permissions for CloudWatch index policies.
   */
  export const CLOUDWATCH_INDEX_POLICY_PERMS = [
    'logs:DescribeIndexPolicies',
    'logs:PutIndexPolicy',
  ];
}

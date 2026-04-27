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
 * Permissions to describe CloudWatch Log Groups.
 * This is a list operation that does not support resource-level permissions.
 */
export const EVALUATION_CLOUDWATCH_LOGS_DESCRIBE_PERMS = [
  'logs:DescribeLogGroups',
];

/**
 * Permissions for the execution role to query CloudWatch Logs.
 * These actions support resource-level permissions scoped to specific log groups.
 */
export const EVALUATION_CLOUDWATCH_LOGS_QUERY_PERMS = [
  'logs:GetQueryResults',
  'logs:StartQuery',
];

/**
 * Permissions for the execution role to invoke Bedrock models.
 */
export const EVALUATION_BEDROCK_MODEL_PERMS = [
  'bedrock:InvokeModel',
  'bedrock:InvokeModelWithResponseStream',
];

/**
 * Permissions for the execution role to write evaluation results.
 */
export const EVALUATION_CLOUDWATCH_LOGS_WRITE_PERMS = [
  'logs:CreateLogGroup',
  'logs:CreateLogStream',
  'logs:PutLogEvents',
];

/**
 * Permissions for CloudWatch index policies.
 */
export const EVALUATION_CLOUDWATCH_INDEX_POLICY_PERMS = [
  'logs:DescribeIndexPolicies',
  'logs:PutIndexPolicy',
];

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

export namespace RuntimePerms {
  /******************************************************************************
   *                         Data Plane Permissions
   *****************************************************************************/
  /**
   * Permissions to invoke the agent runtime
   */
  export const INVOKE_PERMS = ['bedrock-agentcore:InvokeAgentRuntime'];

  /******************************************************************************
   *                         Control Plane Permissions
   *****************************************************************************/
  /**
   * Grants control plane operations to manage the runtime (CRUD)
   */
  export const ADMIN_PERMS = [
    'bedrock-agentcore:CreateAgentRuntime',
    'bedrock-agentcore:CreateAgentRuntimeEndpoint',
    'bedrock-agentcore:DeleteAgentRuntime',
    'bedrock-agentcore:DeleteAgentRuntimeEndpoint',
    'bedrock-agentcore:GetAgentRuntime',
    'bedrock-agentcore:GetAgentRuntimeEndpoint',
    'bedrock-agentcore:ListAgentRuntimes',
    'bedrock-agentcore:ListAgentRuntimeVersions',
    'bedrock-agentcore:ListAgentRuntimeEndpoints',
    'bedrock-agentcore:UpdateAgentRuntime',
    'bedrock-agentcore:UpdateAgentRuntimeEndpoint',
  ];

  /******************************************************************************
   *                    Execution Role Permissions
   *****************************************************************************/

  /**
   * ECR permissions for pulling container images
   * Used to download container images from ECR repositories
   */
  export const ECR_IMAGE_ACTIONS = [
    'ecr:BatchGetImage',
    'ecr:GetDownloadUrlForLayer',
  ];

  /**
   * ECR authorization token permissions
   * Required to authenticate with ECR (must use * resource)
   */
  export const ECR_TOKEN_ACTIONS = ['ecr:GetAuthorizationToken'];

  /**
   * CloudWatch Logs permissions for log group operations
   * Used to create and describe log groups for runtime logs
   */
  export const LOGS_GROUP_ACTIONS = [
    'logs:DescribeLogStreams',
    'logs:CreateLogGroup',
  ];

  /**
   * CloudWatch Logs describe permissions
   * Used to list and describe all log groups
   */
  export const LOGS_DESCRIBE_ACTIONS = ['logs:DescribeLogGroups'];

  /**
   * CloudWatch Logs permissions for log stream operations
   * Used to create log streams and write log events
   */
  export const LOGS_STREAM_ACTIONS = [
    'logs:CreateLogStream',
    'logs:PutLogEvents',
  ];

  /**
   * X-Ray tracing permissions
   * Required for distributed tracing (must use * resource)
   */
  export const XRAY_ACTIONS = [
    'xray:PutTraceSegments',
    'xray:PutTelemetryRecords',
    'xray:GetSamplingRules',
    'xray:GetSamplingTargets',
  ];

  /**
   * CloudWatch metrics permissions
   * Used to publish custom metrics
   */
  export const CLOUDWATCH_METRICS_ACTIONS = ['cloudwatch:PutMetricData'];

  /**
   * Bedrock AgentCore workload identity permissions
   * Used to obtain access tokens for workload identity
   */
  export const WORKLOAD_IDENTITY_ACTIONS = [
    'bedrock-agentcore:GetWorkloadAccessToken',
    'bedrock-agentcore:GetWorkloadAccessTokenForJWT',
    'bedrock-agentcore:GetWorkloadAccessTokenForUserId',
  ];

  /**
   * CloudWatch namespace for metrics
   * Used as a condition for CloudWatch metrics permissions
   */
  export const CLOUDWATCH_NAMESPACE = 'bedrock-agentcore';
}

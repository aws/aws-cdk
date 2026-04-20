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
 *                         Data Plane Permissions
 *****************************************************************************/
/**
 * Permissions to obtain access tokens for workload identity
 */
export const WORKLOAD_IDENTITY_ACCESS_TOKEN_PERMS = [
  'bedrock-agentcore:GetWorkloadAccessToken',
  'bedrock-agentcore:GetWorkloadAccessTokenForJWT',
  'bedrock-agentcore:GetWorkloadAccessTokenForUserId',
];

/******************************************************************************
 *                         Control Plane Permissions
 *****************************************************************************/
/**
 * Permissions to read workload identity information
 */
export const WORKLOAD_IDENTITY_READ_PERMS = [
  'bedrock-agentcore:GetWorkloadIdentity',
];

/**
 * Permissions to list workload identities
 */
export const WORKLOAD_IDENTITY_LIST_PERMS = [
  'bedrock-agentcore:ListWorkloadIdentities',
];

/**
 * Grants control plane operations to manage the workload identity (CRUD)
 */
export const WORKLOAD_IDENTITY_ADMIN_PERMS = [
  'bedrock-agentcore:CreateWorkloadIdentity',
  'bedrock-agentcore:GetWorkloadIdentity',
  'bedrock-agentcore:UpdateWorkloadIdentity',
  'bedrock-agentcore:DeleteWorkloadIdentity',
  'bedrock-agentcore:ListWorkloadIdentities',
];

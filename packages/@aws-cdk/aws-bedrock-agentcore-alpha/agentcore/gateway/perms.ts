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

export namespace GatewayPerms {
  export const GET_PERMS = ['bedrock-agentcore:GetGatewayTarget', 'bedrock-agentcore:GetGateway'];
  export const LIST_PERMS = [
    'bedrock-agentcore:ListGateways',
    'bedrock-agentcore:ListGatewayTargets',
  ];

  export const CREATE_PERMS = [
    'bedrock-agentcore:CreateGateway',
    'bedrock-agentcore:CreateGatewayTarget',
  ];
  export const UPDATE_PERMS = [
    'bedrock-agentcore:UpdateGateway',
    'bedrock-agentcore:UpdateGatewayTarget',
  ];
  export const DELETE_PERMS = [
    'bedrock-agentcore:DeleteGateway',
    'bedrock-agentcore:DeleteGatewayTarget',
  ];

  export const READ_PERMS = [...new Set([...GET_PERMS, ...LIST_PERMS])];
  export const MANAGE_PERMS = [...new Set([...CREATE_PERMS, ...UPDATE_PERMS, ...DELETE_PERMS])];
}

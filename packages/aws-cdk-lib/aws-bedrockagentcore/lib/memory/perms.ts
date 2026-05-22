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

export namespace MemoryPerms {
  /******************************************************************************
   *                          Data Plane Permissions
   *****************************************************************************/
  /**
   * Permissions for Short-Term Memory (STM)
   */
  export namespace STM {
    /**
     * Permissions to write Short-Term Memory (STM)
     */
    export const WRITE_PERMS = ['bedrock-agentcore:CreateEvent'];
    /**
     * Permissions to read Short-Term Memory (STM)
     */
    export const READ_PERMS = [
      'bedrock-agentcore:GetEvent',
      'bedrock-agentcore:ListEvents',
      'bedrock-agentcore:ListActors',
      'bedrock-agentcore:ListSessions',
    ];
    /**
     * Permissions to delete Short-Term Memory (STM)
     */
    export const DELETE_PERMS = ['bedrock-agentcore:DeleteEvent'];
  }

  /**
   * Permissions for Long-Term Memory (LTM)
   */
  export namespace LTM {
    // Note how there is no "bedrock-agentcore:CreateMemoryRecord" as you cannot write directly to LTM
    // This is done asynchronously once extraction stategies have been configured.
    /**
     * Permissions to read Long-Term Memory (LTM)
     */
    export const READ_PERMS = [
      'bedrock-agentcore:GetMemoryRecord',
      'bedrock-agentcore:RetrieveMemoryRecords', // Read via sematic query
      'bedrock-agentcore:ListMemoryRecords',
      'bedrock-agentcore:ListActors',
      'bedrock-agentcore:ListSessions',
    ];
    /**
     * Permissions to delete Long-Term Memory (LTM)
     */
    export const DELETE_PERMS = ['bedrock-agentcore:DeleteMemoryRecord'];
  }

  /**
   * Permissions to read both Short-Term Memory (STM) and Long-Term Memory (LTM)
   */
  export const READ_PERMS = [...new Set([...STM.READ_PERMS, ...LTM.READ_PERMS])];
  /**
   * Permissions to delete both Short-Term Memory (STM) and Long-Term Memory (LTM)
   */
  export const DELETE_PERMS = [...new Set([...STM.DELETE_PERMS, ...LTM.DELETE_PERMS])];

  /******************************************************************************
   *                         Control Plane Permissions
   *****************************************************************************/
  /**
   * Grants control plane operations to manage the memory (CRUD)
   */
  export const ADMIN_PERMS = [
    'bedrock-agentcore:CreateMemory',
    'bedrock-agentcore:GetMemory',
    'bedrock-agentcore:DeleteMemory',
    'bedrock-agentcore:UpdateMemory',
  ];

  export const FULL_ACCESS_PERMS = [
    ...new Set([...STM.WRITE_PERMS, ...READ_PERMS, ...DELETE_PERMS, ...ADMIN_PERMS]),
  ];
}

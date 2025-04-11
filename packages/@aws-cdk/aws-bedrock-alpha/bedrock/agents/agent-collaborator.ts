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
import { IGrantable, Grant } from 'aws-cdk-lib/aws-iam';
import { IAgentAlias } from './agent-alias';

/**
 * Enum for collaborator's relay conversation history types.
 */
export enum AgentCollaboratorType {
  /**
   * Supervisor agent.
   */
  SUPERVISOR = 'SUPERVISOR',

  /**
   * Disabling collaboration.
   */
  DISABLED = 'DISABLED',

  /**
   * Supervisor router.
   */
  SUPERVISOR_ROUTER = 'SUPERVISOR_ROUTER'
}

/**
 * Enum for collaborator's relay conversation history types.
 */
export enum RelayConversationHistoryType {
  /**
     * Sending to the collaborator.
     */
  TO_COLLABORATOR = 'TO_COLLABORATOR',

  /**
     * Disabling relay of conversation history to the collaborator.
     */
  DISABLED = 'DISABLED'
}

/******************************************************************************
 *                    PROPS - Agent Collaborator Class
 *****************************************************************************/
export interface AgentCollaboratorProps {
  /**
   * Descriptor for the collaborating agent.
   * This cannot be the TSTALIASID (`agent.testAlias`).
   */
  readonly agentAlias: IAgentAlias;

  /**
   * Instructions on how this agent should collaborate with the main agent.
   */
  readonly collaborationInstruction: string;

  /**
   * A friendly name for the collaborator.
   */
  readonly collaboratorName: string;

  /**
   * Whether to relay conversation history to this collaborator.
   *
   * @default - undefined (uses service default)
   */
  readonly relayConversationHistory?: boolean;
}

/******************************************************************************
 *                         DEF - Agent Collaborator Class
 *****************************************************************************/

export class AgentCollaborator {
  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  public readonly agentAlias: IAgentAlias;

  /**
   * Instructions on how this agent should collaborate with the main agent.
   */
  public readonly collaborationInstruction: string;

  /**
   * A friendly name for the collaborator.
   */
  public readonly collaboratorName: string;

  /**
   * Whether to relay conversation history to this collaborator.
   *
   * @default - undefined (uses service default)
   */
  public readonly relayConversationHistory?: boolean;


  public constructor(props: AgentCollaboratorProps) {
    // Validate Props
    this.validateProps(props);

    // ------------------------------------------------------
    // Set attributes or defaults
    // ------------------------------------------------------
    this.agentAlias = props.agentAlias;
    this.collaborationInstruction = props.collaborationInstruction;
    this.collaboratorName = props.collaboratorName;
    this.relayConversationHistory = props.relayConversationHistory;
  }

  private validateProps(props: AgentCollaboratorProps) {
    // Validate required properties
    if (!props.agentAlias) {
      throw new Error('agentAlias is required for AgentCollaborator');
    }
    if (props.agentAlias.aliasId === 'TSTALIASID') {
      throw new Error('Agent cannot collaborate with TSTALIASID alias of another agent. Use a different alias to collaborate with.');
    }

    if (!props.collaborationInstruction || props.collaborationInstruction.trim() === '') {
      throw new Error('collaborationInstruction is required and cannot be empty for AgentCollaborator');
    }

    if (!props.collaboratorName || props.collaboratorName.trim() === '') {
      throw new Error('collaboratorName is required and cannot be empty for AgentCollaborator');
    }
  }

  /**
 * Format as CFN properties
 *
 * @internal This is an internal core function and should not be called directly.
 */
  public _render(): CfnAgent.AgentCollaboratorProperty {
    return {
      agentDescriptor: {
        aliasArn: this.agentAlias.aliasArn,
      },
      collaborationInstruction: this.collaborationInstruction,
      collaboratorName: this.collaboratorName,
      relayConversationHistory: this.relayConversationHistory ? RelayConversationHistoryType.TO_COLLABORATOR : RelayConversationHistoryType.DISABLED,
    };
  }

  /**
 * Grants the specified principal permissions to get the agent alias and invoke the agent
 * from this collaborator.
 *
 * @param grantee The principal to grant permissions to
 * @returns The Grant object
 */
  public grant(grantee: IGrantable): Grant {
    const grant1 = this.agentAlias.grantInvoke(grantee);
    const combinedGrant = grant1.combine(this.agentAlias.grantGet(grantee));
    return combinedGrant;
  }
}

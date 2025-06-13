import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import { IGrantable, Grant } from 'aws-cdk-lib/aws-iam';
import { IAgentAlias } from './agent-alias';
import { ValidationError } from './validation-helpers';

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
  SUPERVISOR_ROUTER = 'SUPERVISOR_ROUTER',
}

/**
 * Enum for collaborator's relay conversation history types.
 * @internal
 */
enum RelayConversationHistoryType {
  /**
   * Sending to the collaborator.
   */
  TO_COLLABORATOR = 'TO_COLLABORATOR',

  /**
   * Disabling relay of conversation history to the collaborator.
   */
  DISABLED = 'DISABLED',
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
 *                         Agent Collaborator Class
 *****************************************************************************/

export class AgentCollaborator {
  /**
   * The agent alias that this collaborator represents.
   * This is the agent that will be called upon for collaboration.
   */
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
    if (props.agentAlias.aliasId === 'TSTALIASID') {
      throw new ValidationError('Agent cannot collaborate with TSTALIASID alias of another agent');
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
   * Grants the given identity permissions to collaborate with the agent
   * @param grantee The principal to grant permissions to
   * @returns The Grant object
   */
  public grant(grantee: IGrantable): Grant {
    const grant1 = this.agentAlias.grantInvoke(grantee);
    const combinedGrant = grant1.combine(this.agentAlias.grantGet(grantee));
    return combinedGrant;
  }
}

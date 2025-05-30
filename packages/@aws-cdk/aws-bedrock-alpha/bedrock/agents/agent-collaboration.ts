import { AgentCollaborator, AgentCollaboratorType } from './agent-collaborator';

/**
 * Configuration for agent collaboration settings.
 */
export interface AgentCollaborationConfig {
  /**
   * The collaboration type for the agent.
   */
  readonly type: AgentCollaboratorType;

  /**
   * Collaborators that this agent will work with.
   */
  readonly collaborators: AgentCollaborator[];
}

/**
 * Class to manage agent collaboration configuration.
 */
export class AgentCollaboration {
  /**
   * The collaboration type for the agent.
   */
  public readonly type: AgentCollaboratorType;

  /**
   * Collaborators that this agent will work with.
   */
  public readonly collaborators: AgentCollaborator[];

  constructor(config: AgentCollaborationConfig) {
    this.type = config.type;
    this.collaborators = config.collaborators;
  }
}

import { OrchestrationExecutor } from './orchestration-executor';

/**
 * Configuration for custom orchestration of the agent.
 */
export interface CustomOrchestration {
  /**
   * The Lambda function to use for custom orchestration.
   */
  readonly executor: OrchestrationExecutor;
}

/**
 * Enum for orchestration types available for agents.
 */
export enum OrchestrationType {
  /**
   * Default orchestration by the agent.
   */
  DEFAULT = 'DEFAULT',

  /**
   * Custom orchestration using Lambda.
   */
  CUSTOM_ORCHESTRATION = 'CUSTOM_ORCHESTRATION',
}

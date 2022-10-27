import { Duration } from '@aws-cdk/core';
import { CfnFleet } from './gamelift.generated';

/**
 * Configiuration of a resource creation limit policy
 */
export interface ResourceCreationLimitPolicyConfig {
  /**
     * The maximum number of game sessions that an individual can create during the policy period.
     *
     * @default no limit on the number of game sessions that an individual can create during the policy period
     */
  readonly newGameSessionsPerCreator?: number;
  /**
   * The time span used in evaluating the resource creation limit policy.
   *
   * @default no policy period
   */
  readonly policyPeriod?: Duration,
}

/**
 * A policy that limits the number of game sessions a player can create on the same fleet.
 * This optional policy gives game owners control over how players can consume available game server resources.
 * A resource creation policy makes the following statement: "An individual player can create a maximum number of new game sessions within a specified time period".
 *
 * The policy is evaluated when a player tries to create a new game session.
 * For example, assume you have a policy of 10 new game sessions and a time period of 60 minutes.
 * On receiving a `CreateGameSession` request, Amazon GameLift checks that the player (identified by CreatorId) has created fewer than 10 game sessions in the past 60 minutes.
 */
export class ResourceCreationLimitPolicy {
  constructor(private readonly props: ResourceCreationLimitPolicyConfig) {}

  /**
   * Convert a resource creation limit policy entity to its Json representation
   */
  public toJson(): CfnFleet.ResourceCreationLimitPolicyProperty {
    return {
      newGameSessionsPerCreator: this.props.newGameSessionsPerCreator,
      policyPeriodInMinutes: this.props.policyPeriod && this.props.policyPeriod.toMinutes(),
    };
  }
}
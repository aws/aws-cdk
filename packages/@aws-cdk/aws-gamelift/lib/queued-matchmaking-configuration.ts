import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as gamelift from './gamelift.generated';
import { MatchmakingConfigurationProps, GameProperty, MatchmakingConfigurationBase, IMatchmakingConfiguration } from './matchmaking-configuration';

/**
 * Properties for a new queued matchmaking configuration
 */
export interface QueuedMatchmakingConfigurationProps extends MatchmakingConfigurationProps {
/**
   * The number of player slots in a match to keep open for future players.
   * For example, if the configuration's rule set specifies a match for a single 12-person team, and the additional player count is set to 2, only 10 players are selected for the match.
   *
   * @default no additional player slots
   */
  readonly additionalPlayerCount?: number;

  /**
   * The method used to backfill game sessions that are created with this matchmaking configuration.
   * - Choose manual when your game manages backfill requests manually or does not use the match backfill feature.
   * - Otherwise backfill is settled to automatic to have GameLift create a `StartMatchBackfill` request whenever a game session has one or more open slots.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-backfill.html
   *
   * @default automatic backfill mode
   */
  readonly manualBackfillMode?: boolean;

  /**
   * A set of custom properties for a game session, formatted as key-value pairs.
   * These properties are passed to a game server process with a request to start a new game session.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-api.html#gamelift-sdk-server-startsession
   */
  readonly gameProperties?: GameProperty[];

  /**
   * A set of custom game session properties, formatted as a single string value.
   * This data is passed to a game server process with a request to start a new game session.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-api.html#gamelift-sdk-server-startsession
   */
  readonly gameSessionData?: string;

  /**
   * Queues are used to start new GameLift-hosted game sessions for matches that are created with this matchmaking configuration.
   *
   * Queues can be located in any Region.
   */
  readonly gameSessionQueues: string[];
}

/**
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-intro.html
 *
 * @resource AWS::GameLift::MatchmakingConfiguration
 */
export class QueuedMatchmakingConfiguration extends MatchmakingConfigurationBase {

  /**
   * Import an existing matchmaking configuration from its identifier.
   */
  static fromQueuedMatchmakingConfigurationId(scope: Construct, id: string, matchmakingConfigurationId: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationId: matchmakingConfigurationId });
  }

  /**
   * Import an existing matchmaking configuration from its ARN.
   */
  static fromQueuedMatchmakingConfigurationArn(scope: Construct, id: string, matchmakingConfigurationArn: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationArn: matchmakingConfigurationArn });
  }

  /**
     * The Identifier of the matchmaking configuration.
     */
  public readonly matchmakingConfigurationId: string;
  /**
     * The ARN of the matchmaking configuration.
     */
  public readonly matchmakingConfigurationArn: string;

  private readonly gameSessionQueues: string[] = [];

  constructor(scope: Construct, id: string, props: QueuedMatchmakingConfigurationProps) {
    super(scope, id, {
      physicalName: props.matchmakingConfigurationName,
    });

    if (!cdk.Token.isUnresolved(props.matchmakingConfigurationName)) {
      if (props.matchmakingConfigurationName.length > 128) {
        throw new Error(`Matchmaking configuration name can not be longer than 128 characters but has ${props.matchmakingConfigurationName.length} characters.`);
      }

      if (!/^[a-zA-Z0-9-\.]+$/.test(props.matchmakingConfigurationName)) {
        throw new Error(`Matchmaking configuration name ${props.matchmakingConfigurationName} can contain only letters, numbers, hyphens, back slash or dot with no spaces.`);
      }
    }

    if (props.description && !cdk.Token.isUnresolved(props.description)) {
      if (props.description.length > 1024) {
        throw new Error(`Matchmaking configuration description can not be longer than 1024 characters but has ${props.description.length} characters.`);
      }
    }

    if (props.gameProperties && props.gameProperties.length > 16) {
      throw new Error(`The maximum number of game properties allowed in the matchmaking configuration cannot be higher than 16, given ${props.gameProperties.length}`);
    }

    if (props.gameSessionData && props.gameSessionData.length > 4096) {
      throw new Error(`Matchmaking configuration game session data can not be longer than 4096 characters but has ${props.gameSessionData.length} characters.`);
    }

    if (props.customEventData && props.customEventData.length > 256) {
      throw new Error(`Matchmaking configuration custom event data can not be longer than 256 characters but has ${props.customEventData.length} characters.`);
    }

    if (props.acceptanceTimeout && props.acceptanceTimeout.toSeconds() > 600) {
      throw new Error(`Matchmaking configuration acceptance timeout can not exceed 600 seconds, actual ${props.acceptanceTimeout.toSeconds()} seconds.`);
    }

    if (props.requestTimeout && props.requestTimeout.toSeconds() > 43200) {
      throw new Error(`Matchmaking configuration request timeout can not exceed 43200 seconds, actual ${props.requestTimeout.toSeconds()} seconds.`);
    }

    // Add all queues
    (props.gameSessionQueues || []).forEach(this.addGameSessionQueue.bind(this));

    const resource = new gamelift.CfnMatchmakingConfiguration(this, 'Resource', {
      name: this.physicalName,
      acceptanceRequired: props.requireAcceptance,
      acceptanceTimeoutSeconds: props.acceptanceTimeout && props.acceptanceTimeout.toSeconds(),
      additionalPlayerCount: props.additionalPlayerCount,
      backfillMode: props.manualBackfillMode ? 'MANUAL' : 'AUTOMATIC',
      customEventData: props.customEventData,
      description: props.description,
      flexMatchMode: 'WITH_QUEUE',
      gameProperties: this.parseGameProperties(props),
      gameSessionData: props.gameSessionData,
      gameSessionQueueArns: cdk.Lazy.any({ produce: () => this.parseGameSessionQueues() }),
      notificationTarget: props.notificationTarget && props.notificationTarget.topicArn,
      requestTimeoutSeconds: props.requestTimeout && props.requestTimeout.toSeconds() || 300,
      ruleSetName: props.ruleSet.matchmakingRuleSetArn,
    });

    this.matchmakingConfigurationId = this.getResourceNameAttribute(resource.ref);
    this.matchmakingConfigurationArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'matchmakingconfiguration',
      resourceName: this.matchmakingConfigurationId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * Adds a game session queue destination to the matchmaking configuration.
   *
   * @param gameSessionQueue A game session queue
   */
  public addGameSessionQueue(gameSessionQueue: string) {
    this.gameSessionQueues.push(gameSessionQueue);
  }

  private parseGameSessionQueues(): string[] | undefined {
    if (!this.gameSessionQueues || this.gameSessionQueues.length === 0) {
      return undefined;
    }

    return this.gameSessionQueues.map((queue) => queue);
  }

  private parseGameProperties(props: QueuedMatchmakingConfigurationProps): gamelift.CfnMatchmakingConfiguration.GamePropertyProperty[] | undefined {
    if (!props.gameProperties || props.gameProperties.length === 0) {
      return undefined;
    }

    return props.gameProperties.map(parseGameProperty);

    function parseGameProperty(gameProperty: GameProperty): gamelift.CfnMatchmakingConfiguration.GamePropertyProperty {
      return {
        key: gameProperty.key,
        value: gameProperty.value,
      };
    }
  }

}
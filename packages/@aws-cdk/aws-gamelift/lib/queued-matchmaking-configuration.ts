import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IGameSessionQueue } from './game-session-queue';
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
   *
   * @default no additional game properties
   */
  readonly gameProperties?: GameProperty[];

  /**
   * A set of custom game session properties, formatted as a single string value.
   * This data is passed to a game server process with a request to start a new game session.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-api.html#gamelift-sdk-server-startsession
   *
   * @default no additional game session data
   */
  readonly gameSessionData?: string;

  /**
   * Queues are used to start new GameLift-hosted game sessions for matches that are created with this matchmaking configuration.
   *
   * Queues can be located in any Region.
   */
  readonly gameSessionQueues: IGameSessionQueue[];
}

/**
 * A FlexMatch matchmaker process does the work of building a game match.
 * It manages the pool of matchmaking requests received, forms teams for a match, processes and selects players to find the best possible player groups, and initiates the process of placing and starting a game session for the match.
 * This topic describes the key aspects of a matchmaker and how to configure one customized for your game.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-configuration.html
 *
 * @resource AWS::GameLift::MatchmakingConfiguration
 */
export class QueuedMatchmakingConfiguration extends MatchmakingConfigurationBase {

  /**
   * Import an existing matchmaking configuration from its name.
   */
  static fromQueuedMatchmakingConfigurationName(scope: Construct, id: string, matchmakingConfigurationName: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationName: matchmakingConfigurationName });
  }

  /**
   * Import an existing matchmaking configuration from its ARN.
   */
  static fromQueuedMatchmakingConfigurationArn(scope: Construct, id: string, matchmakingConfigurationArn: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationArn: matchmakingConfigurationArn });
  }

  /**
     * The name of the matchmaking configuration.
     */
  public readonly matchmakingConfigurationName: string;
  /**
     * The ARN of the matchmaking configuration.
     */
  public readonly matchmakingConfigurationArn: string;
  /**
   * The notification target for matchmaking events
   */
  public readonly notificationTarget?: sns.ITopic;

  /**
   * A list of game session queue destinations
   */
  private readonly gameSessionQueues: IGameSessionQueue[] = [];

  constructor(scope: Construct, id: string, props: QueuedMatchmakingConfigurationProps) {
    super(scope, id, {
      physicalName: props.matchmakingConfigurationName,
    });

    if (props.matchmakingConfigurationName && !cdk.Token.isUnresolved(props.matchmakingConfigurationName)) {
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

    //Notification target
    this.notificationTarget = props.notificationTarget;
    if (!this.notificationTarget) {
      this.notificationTarget = new sns.Topic(this, 'Topic', {});
    }
    // Be sure to add the right TopicPolicy to enable gamelift publish action to given topic
    const topicPolicy = new sns.TopicPolicy(this, 'TopicPolicy', {
      topics: [this.notificationTarget],
    });
    topicPolicy.document.addStatements(new iam.PolicyStatement({
      actions: ['sns:Publish'],
      principals: [new iam.ServicePrincipal('gamelift.amazonaws.com')],
      resources: [this.notificationTarget.topicArn],
    }));

    // Add all queues
    (props.gameSessionQueues || []).forEach(this.addGameSessionQueue.bind(this));

    const resource = new gamelift.CfnMatchmakingConfiguration(this, 'Resource', {
      name: this.physicalName,
      acceptanceRequired: Boolean(props.requireAcceptance),
      acceptanceTimeoutSeconds: props.acceptanceTimeout && props.acceptanceTimeout.toSeconds(),
      additionalPlayerCount: props.additionalPlayerCount,
      backfillMode: props.manualBackfillMode ? 'MANUAL' : 'AUTOMATIC',
      customEventData: props.customEventData,
      description: props.description,
      flexMatchMode: 'WITH_QUEUE',
      gameProperties: this.parseGameProperties(props),
      gameSessionData: props.gameSessionData,
      gameSessionQueueArns: cdk.Lazy.list({ produce: () => this.parseGameSessionQueues() }),
      notificationTarget: this.notificationTarget.topicArn,
      requestTimeoutSeconds: props.requestTimeout && props.requestTimeout.toSeconds() || cdk.Duration.seconds(300).toSeconds(),
      ruleSetName: props.ruleSet.matchmakingRuleSetName,
    });

    this.matchmakingConfigurationName = this.getResourceNameAttribute(resource.ref);
    this.matchmakingConfigurationArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'matchmakingconfiguration',
      resourceName: this.matchmakingConfigurationName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * Adds a game session queue destination to the matchmaking configuration.
   *
   * @param gameSessionQueue A game session queue
   */
  public addGameSessionQueue(gameSessionQueue: IGameSessionQueue) {
    this.gameSessionQueues.push(gameSessionQueue);
  }

  private parseGameSessionQueues(): string[] | undefined {
    if (!this.gameSessionQueues || this.gameSessionQueues.length === 0) {
      return undefined;
    }

    return this.gameSessionQueues.map((queue) => queue.gameSessionQueueArn);
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
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';

/**
   * A set of custom properties for a game session, formatted as key-value pairs.
   * These properties are passed to a game server process with a request to start a new game session.
   *
   * This parameter is not used for Standalone FlexMatch mode.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-api.html#gamelift-sdk-server-startsession
   */
export interface GameProperty {
  /**
     * The game property identifier.
     */
  readonly key: string;
  /**
     * The game property value.
     */
  readonly value: string;
}

/**
 * Represents a Gamelift matchmaking configuration
 */
export interface IMatchmakingConfiguration extends cdk.IResource {
  /**
     * The Identifier of the matchmaking configuration.
     *
     * @attribute
     */
  readonly matchmakingconfigurationId: string;

  /**
     * The ARN of the matchmaking configuration.
     *
     * @attribute
     */
  readonly matchmakingConfigurationArn: string;


  /**
     * Return the given named metric for this matchmaking configuration.
     */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
     * Matchmaking requests currently being processed or waiting to be processed.
     */
  metricCurrentTickets(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
     * For matchmaking configurations that require acceptance, the potential matches that were accepted since the last report.
     */
  metricMatchesAccepted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
     * Potential matches that were created since the last report.
     */
  metricMatchesCreated(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
     * Matches that were successfully placed into a game session since the last report.
     */
  metricMatchesPlaced(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
     * For matchmaking configurations that require acceptance, the potential matches that were rejected by at least one player since the last report.
     */
  metricMatchesRejected(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
     * Players in matchmaking tickets that were added since the last report.
     */
  metricPlayersStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
     * For matchmaking requests that were put into a potential match before the last report,
     * the amount of time between ticket creation and potential match creation.
     *
     * Units: seconds
     */
  metricTimeToMatch(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Properties for a new Gamelift matchmaking configuration
 */
export interface MatchmakingConfigurationProps {

  /**
     * A unique identifier for the matchmaking configuration.
     * This name is used to identify the configuration associated with a matchmaking request or ticket.
     */
  readonly matchmakingConfigurationName: string;

  /**
   * A human-readable description of the matchmaking configuration.
   *
   * @default no description is provided
   */
  readonly description?: string;

  /**
     * A flag that determines whether a match that was created with this configuration must be accepted by the matched players.
     * With this option enabled, matchmaking tickets use the status `REQUIRES_ACCEPTANCE` to indicate when a completed potential match is waiting for player acceptance.
     *
     * @default Acceptance is not required
     */
  readonly requireAcceptance?: boolean;

  /**
   * The length of time (in seconds) to wait for players to accept a proposed match, if acceptance is required.
   *
   * @default 300 seconds
   */
  readonly acceptanceTimeout?: cdk.Duration;

  /**
   * Information to add to all events related to the matchmaking configuration.
   *
   * @default no custom data added to events
   */
  readonly customEventData?: string;

  /**
   * An SNS topic ARN that is set up to receive matchmaking notifications.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-notification.html
   *
   * @default no notification target
   */
  readonly notificationTarget?: sns.ITopic;

  /**
   * The maximum duration, that a matchmaking ticket can remain in process before timing out.
   * Requests that fail due to timing out can be resubmitted as needed.
   *
   * @default 300 seconds
   */
  readonly requestTimeout?: cdk.Duration;

  /**
   * A matchmaking rule set to use with this configuration.
   *
   * A matchmaking configuration can only use rule sets that are defined in the same Region.
   */
  readonly ruleSet: string;
}

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
  readonly gameSessionQueues: string[]
}

/**
 * Properties for a new standalone matchmaking configuration
 */
export interface StandaloneMatchmakingConfigurationProps extends MatchmakingConfigurationProps {
}
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IMatchmakingRuleSet } from '.';

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
     * The name of the matchmaking configuration.
     *
     * @attribute
     */
  readonly matchmakingConfigurationName: string;

  /**
     * The ARN of the matchmaking configuration.
     *
     * @attribute
     */
  readonly matchmakingConfigurationArn: string;

  /**
   * The notification target for matchmaking events
   *
   * @attribute
   */
  readonly notificationTarget?: sns.ITopic;


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
 * A full specification of a matchmaking configuration that can be used to import it fluently into the CDK application.
 */
export interface MatchmakingConfigurationAttributes {
  /**
        * The ARN of the Matchmaking configuration
        *
        * At least one of `matchmakingConfigurationArn` and `matchmakingConfigurationName` must be provided.
        *
        * @default derived from `matchmakingConfigurationName`.
        */
  readonly matchmakingConfigurationArn?: string;

  /**
      * The identifier of the Matchmaking configuration
      *
      * At least one of `matchmakingConfigurationName` and `matchmakingConfigurationArn`  must be provided.
      *
      * @default derived from `matchmakingConfigurationArn`.
      */
  readonly matchmakingConfigurationName?: string;

  /**
   * An SNS topic ARN that is set up to receive matchmaking notifications.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-notification.html
   *
   * @default no notification target binded to imported ressource
   */
  readonly notificationTarget?: sns.ITopic;
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
  readonly ruleSet: IMatchmakingRuleSet;
}

/**
 * Base class for new and imported GameLift Matchmaking configuration.
 */
export abstract class MatchmakingConfigurationBase extends cdk.Resource implements IMatchmakingConfiguration {


  /**
   * Import an existing matchmaking configuration from its attributes.
   */
  static fromMatchmakingConfigurationAttributes(scope: Construct, id: string, attrs: MatchmakingConfigurationAttributes): IMatchmakingConfiguration {
    if (!attrs.matchmakingConfigurationName && !attrs.matchmakingConfigurationArn) {
      throw new Error('Either matchmakingConfigurationName or matchmakingConfigurationArn must be provided in MatchmakingConfigurationAttributes');
    }
    const matchmakingConfigurationName = attrs.matchmakingConfigurationName ??
     cdk.Stack.of(scope).splitArn(attrs.matchmakingConfigurationArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!matchmakingConfigurationName) {
      throw new Error(`No matchmaking configuration name found in ARN: '${attrs.matchmakingConfigurationArn}'`);
    }

    const matchmakingConfigurationArn = attrs.matchmakingConfigurationArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'matchmakingconfiguration',
      resourceName: attrs.matchmakingConfigurationName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends MatchmakingConfigurationBase {
      public readonly matchmakingConfigurationName = matchmakingConfigurationName!;
      public readonly matchmakingConfigurationArn = matchmakingConfigurationArn;
      public readonly notificationTarget = attrs.notificationTarget;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: matchmakingConfigurationArn,
        });
      }
    }
    return new Import(scope, id);
  }

  /**
     * The Identifier of the matchmaking configuration.
     */
  public abstract readonly matchmakingConfigurationName: string;
  /**
     * The ARN of the matchmaking configuration.
     */
  public abstract readonly matchmakingConfigurationArn: string;

  /**
   * The notification target for matchmaking events
   */
  public abstract readonly notificationTarget?: sns.ITopic;

  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/GameLift',
      metricName: metricName,
      dimensionsMap: {
        MatchmakingConfigurationName: this.matchmakingConfigurationName,
      },
      ...props,
    }).attachTo(this);
  }

  metricCurrentTickets(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CurrentTickets', props);
  }

  metricMatchesAccepted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MatchesAccepted', props);
  }

  metricMatchesCreated(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MatchesCreated', props);
  }

  metricMatchesPlaced(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MatchesPlaced', props);
  }

  metricMatchesRejected(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MatchesRejected', props);
  }

  metricPlayersStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('PlayersStarted', props);
  }

  metricTimeToMatch(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('TimeToMatch', props);
  }

}
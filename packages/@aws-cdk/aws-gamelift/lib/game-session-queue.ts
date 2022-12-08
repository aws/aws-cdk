import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnGameSessionQueue } from './gamelift.generated';

/**
 * Represents a game session queue destination
 */
export interface IGameSessionQueueDestination {
  /**
   * The ARN(s) to put into the destination field for a game session queue.
   *
   * This property is for cdk modules to consume only. You should not need to use this property.
   * Instead, use dedicated identifier on each components.
   */
  readonly resourceArnForDestination: string;
}

/**
 * Priority to condider when placing new game sessions
 */
export enum PriorityType {
  /**
     * FleetIQ prioritizes locations where the average player latency (provided in each game session request) is lowest.
     */
  LATENCY = 'LATENCY',
  /**
   * FleetIQ prioritizes destinations with the lowest current hosting costs. Cost is evaluated based on the location, instance type, and fleet type (Spot or On-Demand) for each destination in the queue.
   */
  COST = 'COST',
  /**
   * FleetIQ prioritizes based on the order that destinations are listed in the queue configuration.
   */
  DESTINATION = 'DESTINATION',
  /**
   * FleetIQ prioritizes based on the provided order of locations, as defined in `LocationOrder`
   */
  LOCATION = 'LOCATION'
}

/**
 * Custom prioritization settings for use by a game session queue when placing new game sessions with available game servers.
 * When defined, this configuration replaces the default FleetIQ prioritization process, which is as follows:
 *
 * - If player latency data is included in a game session request, destinations and locations are prioritized first based on lowest average latency (1), then on lowest hosting cost (2), then on destination list order (3), and finally on location (alphabetical) (4).
 * This approach ensures that the queue's top priority is to place game sessions where average player latency is lowest, and--if latency is the same--where the hosting cost is less, etc.
 *
 * - If player latency data is not included, destinations and locations are prioritized first on destination list order (1), and then on location (alphabetical) (2).
 * This approach ensures that the queue's top priority is to place game sessions on the first destination fleet listed. If that fleet has multiple locations, the game session is placed on the first location (when listed alphabetically).
 *
 * Changing the priority order will affect how game sessions are placed.
 */
export interface PriorityConfiguration {
  /**
     * The prioritization order to use for fleet locations, when the PriorityOrder property includes LOCATION. Locations are identified by AWS Region codes such as `us-west-2.
     *
     * Each location can only be listed once.
     */
  readonly locationOrder: string[];
  /**
   * The recommended sequence to use when prioritizing where to place new game sessions.
   * Each type can only be listed once.
   */
  readonly priorityOrder: PriorityType[];
}

/**
 * The queue setting that determines the highest latency allowed for individual players when placing a game session.
 * When a latency policy is in force, a game session cannot be placed with any fleet in a Region where a player reports latency higher than the cap.
 *
 * Latency policies are only enforced when the placement request contains player latency information.
 */
export interface PlayerLatencyPolicy {
  /**
     * The maximum latency value that is allowed for any player, in milliseconds.
     *
     * All policies must have a value set for this property.
     */
  readonly maximumIndividualPlayerLatency: cdk.Duration;

  /**
   * The length of time, in seconds, that the policy is enforced while placing a new game session.
   *
   * @default the policy is enforced until the queue times out.
   */
  readonly policyDuration?: cdk.Duration;
}

/**
 * Represents a Gamelift GameSessionQueue for a Gamelift fleet destination.
 */
export interface IGameSessionQueue extends cdk.IResource {

  /**
       * The Name of the gameSessionQueue.
       *
       * @attribute
       */
  readonly gameSessionQueueName: string;

  /**
     * The ARN of the gameSessionQueue.
     *
     * @attribute
     */
  readonly gameSessionQueueArn: string;

  /**
    * Return the given named metric for this fleet.
    */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Average amount of time that game session placement requests in the queue with status PENDING have been waiting to be fulfilled.
   */
  metricAverageWaitTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Game session placement requests that were canceled before timing out since the last report.
   */
  metricPlacementsCanceled(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Game session placement requests that failed for any reason since the last report.
   */
  metricPlacementsFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * New game session placement requests that were added to the queue since the last report.
   */
  metricPlacementsStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Game session placement requests that resulted in a new game session since the last report.
   */
  metricPlacementsSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Game session placement requests that reached the queue's timeout limit without being fulfilled since the last report.
   */
  metricPlacementsTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
   * A full specification of an gameSessionQueue that can be used to import it fluently into the CDK application.
   */
export interface GameSessionQueueAttributes {
  /**
   * The ARN of the gameSessionQueue
   *
   * At least one of `gameSessionQueueArn` and `gameSessionQueueName` must be provided.
   *
   * @default derived from `gameSessionQueueName`.
   */
  readonly gameSessionQueueArn?: string;

  /**
   * The name of the gameSessionQueue
   *
   * At least one of `gameSessionQueueName` and `gameSessionQueueArn`  must be provided.
   *
   * @default derived from `gameSessionQueueArn`.
   */
  readonly gameSessionQueueName?: string;
}

/**
   * Properties for a new Fleet gameSessionQueue
   */
export interface GameSessionQueueProps {
  /**
       * Name of this gameSessionQueue
       */
  readonly gameSessionQueueName: string;

  /**
   *  Information to be added to all events that are related to this game session queue.
   *
   * @default no customer event data
   */
  readonly customEventData?: string;

  /**
   * A list of locations where a queue is allowed to place new game sessions.
   *
   * Locations are specified in the form of AWS Region codes, such as `us-west-2`.
   *
   * For queues that have multi-location fleets, you can use a filter configuration allow placement with some, but not all of these locations.
   *
   * @default game sessions can be placed in any queue location
   */
  readonly allowedLocations?: string[];

  /**
   * An SNS topic is set up to receive game session placement notifications.
   *
   * @default no notification
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/queue-notification.html
   */
  readonly notificationTarget?: sns.ITopic;

  /**
   * A set of policies that act as a sliding cap on player latency.
   * FleetIQ works to deliver low latency for most players in a game session.
   * These policies ensure that no individual player can be placed into a game with unreasonably high latency.
   * Use multiple policies to gradually relax latency requirements a step at a time.
   * Multiple policies are applied based on their maximum allowed latency, starting with the lowest value.
   *
   * @default no player latency policy
   */
  readonly playerLatencyPolicies?: PlayerLatencyPolicy[];

  /**
   * Custom settings to use when prioritizing destinations and locations for game session placements.
   * This configuration replaces the FleetIQ default prioritization process.
   *
   * Priority types that are not explicitly named will be automatically applied at the end of the prioritization process.
   *
   * @default no priority configuration
   */
  readonly priorityConfiguration?: PriorityConfiguration;

  /**
   * The maximum time, that a new game session placement request remains in the queue.
   * When a request exceeds this time, the game session placement changes to a `TIMED_OUT` status.
   *
   * @default 50 seconds
   */
  readonly timeout?: cdk.Duration;

  /**
     * A list of fleets and/or fleet alias that can be used to fulfill game session placement requests in the queue.
     *
     * Destinations are listed in order of placement preference.
     */
  readonly destinations: IGameSessionQueueDestination[];
}

/**
 * Base class for new and imported GameLift GameSessionQueue.
 */
export abstract class GameSessionQueueBase extends cdk.Resource implements IGameSessionQueue {
  /**
   * The name of the gameSessionQueue.
   */
  public abstract readonly gameSessionQueueName: string;
  /**
     * The ARN of the gameSessionQueue
     */
  public abstract readonly gameSessionQueueArn: string;

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/GameLift',
      metricName: metricName,
      dimensionsMap: {
        GameSessionQueueName: this.gameSessionQueueName,
      },
      ...props,
    }).attachTo(this);
  }

  metricAverageWaitTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('AverageWaitTime', props);
  }

  metricPlacementsCanceled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('PlacementsCanceled', props);
  }

  metricPlacementsFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('PlacementsFailed', props);
  }

  metricPlacementsStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('PlacementsStarted', props);
  }

  metricPlacementsSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('PlacementsSucceeded', props);
  }

  metricPlacementsTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('PlacementsTimedOut', props);
  }
}

/**
 * The GameSessionQueue resource creates a placement queue that processes requests for new game sessions.
 * A queue uses FleetIQ algorithms to determine the best placement locations and find an available game server, then prompts the game server to start a new game session.
 * Queues can have destinations (GameLift fleets or gameSessionQueuees), which determine where the queue can place new game sessions.
 * A queue can have destinations with varied fleet type (Spot and On-Demand), instance type, and AWS Region.
 *
 * @resource AWS::GameLift::GameSessionQueue
 */
export class GameSessionQueue extends GameSessionQueueBase {

  /**
   * Import an existing gameSessionQueue from its name.
   */
  static fromGameSessionQueueName(scope: Construct, id: string, gameSessionQueueName: string): IGameSessionQueue {
    return this.fromGameSessionQueueAttributes(scope, id, { gameSessionQueueName });
  }

  /**
   * Import an existing gameSessionQueue from its ARN.
   */
  static fromGameSessionQueueArn(scope: Construct, id: string, gameSessionQueueArn: string): IGameSessionQueue {
    return this.fromGameSessionQueueAttributes(scope, id, { gameSessionQueueArn });
  }

  /**
   * Import an existing gameSessionQueue from its attributes.
   */
  static fromGameSessionQueueAttributes(scope: Construct, id: string, attrs: GameSessionQueueAttributes): IGameSessionQueue {
    if (!attrs.gameSessionQueueName && !attrs.gameSessionQueueArn) {
      throw new Error('Either gameSessionQueueName or gameSessionQueueArn must be provided in GameSessionQueueAttributes');
    }
    const gameSessionQueueName = attrs.gameSessionQueueName ??
      cdk.Stack.of(scope).splitArn(attrs.gameSessionQueueArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!gameSessionQueueName) {
      throw new Error(`No gameSessionQueue name found in ARN: '${attrs.gameSessionQueueArn}'`);
    }

    const gameSessionQueueArn = attrs.gameSessionQueueArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'gamesessionqueue',
      resourceName: attrs.gameSessionQueueName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends GameSessionQueueBase {
      public readonly gameSessionQueueName = gameSessionQueueName!;
      public readonly gameSessionQueueArn = gameSessionQueueArn;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: gameSessionQueueArn,
        });
      }
    }
    return new Import(scope, id);
  }

  /**
   * The Identifier of the gameSessionQueue.
   */
  public readonly gameSessionQueueName: string;

  /**
    * The ARN of the gameSessionQueue.
    */
  public readonly gameSessionQueueArn: string;

  private readonly destinations: IGameSessionQueueDestination[] = [];

  constructor(scope: Construct, id: string, props: GameSessionQueueProps) {
    super(scope, id, {
      physicalName: props.gameSessionQueueName,
    });

    if (!cdk.Token.isUnresolved(props.gameSessionQueueName)) {
      if (props.gameSessionQueueName.length > 128) {
        throw new Error(`GameSessionQueue name can not be longer than 128 characters but has ${props.gameSessionQueueName.length} characters.`);
      }

      if (!/^[a-zA-Z0-9-]+$/.test(props.gameSessionQueueName)) {
        throw new Error(`GameSessionQueue name ${props.gameSessionQueueName} can contain only letters, numbers, hyphens with no spaces.`);
      }
    }

    if (props.customEventData && props.customEventData.length > 256) {
      throw new Error(`GameSessionQueue custom event data can not be longer than 256 characters but has ${props.customEventData.length} characters.`);
    }

    if (props.allowedLocations && props.allowedLocations.length > 100) {
      throw new Error(`No more than 100 allowed locations are allowed per game session queue, given ${props.allowedLocations.length}`);
    }

    // Add all destinations
    (props.destinations || []).forEach(this.addDestination.bind(this));

    const resource = new CfnGameSessionQueue(this, 'Resource', {
      name: this.physicalName,
      customEventData: props.customEventData,
      destinations: cdk.Lazy.any({ produce: () => this.parseDestinations() }),
      filterConfiguration: this.parseFilterConfiguration(props),
      notificationTarget: props.notificationTarget && props.notificationTarget.topicArn,
      playerLatencyPolicies: this.parsePlayerLatencyPolicies(props),
      priorityConfiguration: this.parsePriorityConfiguration(props),
      timeoutInSeconds: props.timeout && props.timeout.toSeconds(),
    });

    this.gameSessionQueueName = this.getResourceNameAttribute(resource.ref);
    this.gameSessionQueueArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'gamesessionqueue',
      resourceName: this.gameSessionQueueName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * Adds a destination to fulfill requests for new game sessions
   *
   * @param destination A destination to add
   */
  public addDestination(destination: IGameSessionQueueDestination) {
    this.destinations.push(destination);
  }

  protected parsePriorityConfiguration(props: GameSessionQueueProps): CfnGameSessionQueue.PriorityConfigurationProperty | undefined {
    if (!props.priorityConfiguration) {
      return undefined;
    }

    if (props.priorityConfiguration.locationOrder.length > 100) {
      throw new Error(`No more than 100 locations are allowed per priority configuration, given ${props.priorityConfiguration.locationOrder.length}`);
    }

    if (props.priorityConfiguration.priorityOrder.length > 4) {
      throw new Error(`No more than 4 priorities are allowed per priority configuration, given ${props.priorityConfiguration.priorityOrder.length}`);
    }

    return {
      priorityOrder: props.priorityConfiguration.priorityOrder,
      locationOrder: props.priorityConfiguration.locationOrder,
    };
  }

  protected parsePlayerLatencyPolicies(props: GameSessionQueueProps): CfnGameSessionQueue.PlayerLatencyPolicyProperty[] | undefined {
    if (!props.playerLatencyPolicies) {
      return undefined;
    }

    return props.playerLatencyPolicies.map(parsePlayerLatencyPolicy);

    function parsePlayerLatencyPolicy(playerLatencyPolicy: PlayerLatencyPolicy): CfnGameSessionQueue.PlayerLatencyPolicyProperty {
      return {
        maximumIndividualPlayerLatencyMilliseconds: playerLatencyPolicy.maximumIndividualPlayerLatency.toMilliseconds(),
        policyDurationSeconds: playerLatencyPolicy.policyDuration && playerLatencyPolicy.policyDuration.toSeconds(),
      };
    }
  }

  protected parseFilterConfiguration(props: GameSessionQueueProps): CfnGameSessionQueue.FilterConfigurationProperty | undefined {
    if (!props.allowedLocations) {
      return undefined;
    }

    return {
      allowedLocations: props.allowedLocations,
    };
  }

  private parseDestinations(): CfnGameSessionQueue.DestinationProperty[] | undefined {
    if (!this.destinations || this.destinations.length === 0) {
      return undefined;
    }

    return this.destinations.map(parseDestination);

    function parseDestination(destination: IGameSessionQueueDestination): CfnGameSessionQueue.DestinationProperty {
      return {
        destinationArn: destination.resourceArnForDestination,
      };
    }
  }
}
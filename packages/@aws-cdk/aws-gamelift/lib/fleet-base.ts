import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Alias, AliasOptions } from './alias';
import { IGameSessionQueueDestination } from './game-session-queue';
import { GameLiftMetrics } from './gamelift-canned-metrics.generated';
import { CfnFleet } from './gamelift.generated';


/**
 * Current resource capacity settings in a specified fleet or location.
 * The location value might refer to a fleet's remote location or its home Region.
 */
export interface LocationCapacity {
  /**
       * The number of Amazon EC2 instances you want to maintain in the specified fleet location.
       * This value must fall between the minimum and maximum size limits.
       *
       * @default the default value is 0
       */
  readonly desiredCapacity?: number;
  /**
       * The maximum number of instances that are allowed in the specified fleet location.
       *
       * @default the default value is 1
       */
  readonly maxSize?: number;
  /**
       * The minimum number of instances that are allowed in the specified fleet location.
       *
       * @default the default value is 0
       */
  readonly minSize?: number;
}

/**
   * A remote location where a multi-location fleet can deploy EC2 instances for game hosting.
   */
export interface Location {
  /**
       * An AWS Region code
       */
  readonly region: string;
  /**
     * Current resource capacity settings in a specified fleet or location.
     * The location value might refer to a fleet's remote location or its home Region.
     *
     * @default no capacity settings on the specified location
     */
  readonly capacity?: LocationCapacity;
}

/**
 * Configuration of a fleet server process
 */
export interface ServerProcess {
  /**
       * The number of server processes using this configuration that run concurrently on each instance.
       * Minimum is `1`
       *
       * @default 1
       */
  readonly concurrentExecutions?: number;
  /**
       * The location of a game build executable or the Realtime script file that contains the Init() function. Game builds and Realtime scripts are installed on instances at the root:
       * - Windows (custom game builds only): `C:\game`. Example: `C:\game\MyGame\server.exe`
       * - Linux: `/local/game`. Examples: `/local/game/MyGame/server.exe` or `/local/game/MyRealtimeScript.js`
       */
  readonly launchPath: string;

  /**
       * An optional list of parameters to pass to the server executable or Realtime script on launch.
       *
       * @default no parameters
       */
  readonly parameters?: string;
}

/**
   * A collection of server process configurations that describe the set of processes to run on each instance in a fleet.
   * Server processes run either an executable in a custom game build or a Realtime Servers script.
   * GameLift launches the configured processes, manages their life cycle, and replaces them as needed.
   * Each instance checks regularly for an updated runtime configuration.
   *
   * A GameLift instance is limited to 50 processes running concurrently.
   * To calculate the total number of processes in a runtime configuration, add the values of the `ConcurrentExecutions` parameter for each `ServerProcess`.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/fleets-multiprocess.html
   */
export interface RuntimeConfiguration {
  /**
       * The maximum amount of time allowed to launch a new game session and have it report ready to host players.
       * During this time, the game session is in status `ACTIVATING`.
       *
       * If the game session does not become active before the timeout, it is ended and the game session status is changed to `TERMINATED`.
       *
       * @default by default game session activation timeout is 300 seconds
       */
  readonly gameSessionActivationTimeout?: cdk.Duration;
  /**
       * The number of game sessions in status `ACTIVATING` to allow on an instance.
       *
       * This setting limits the instance resources that can be used for new game activations at any one time.
       *
       * @default no limit
       */
  readonly maxConcurrentGameSessionActivations?: number;

  /**
       * A collection of server process configurations that identify what server processes to run on each instance in a fleet.
       */
  readonly serverProcesses: ServerProcess[];
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
export interface ResourceCreationLimitPolicy {
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
  readonly policyPeriod?: cdk.Duration,
}

/**
 * Represents a Gamelift fleet
 */
export interface IFleet extends cdk.IResource, iam.IGrantable, IGameSessionQueueDestination {
  /**
   * The Identifier of the fleet.
   *
   * @attribute
   */
  readonly fleetId: string;

  /**
   * The ARN of the fleet.
   *
   * @attribute
   */
  readonly fleetArn: string;

  /**
   * Grant the `grantee` identity permissions to perform `actions`.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Return the given named metric for this fleet.
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Instances with `ACTIVE` status, which means they are running active server processes.
   * The count includes idle instances and those that are hosting one or more game sessions.
   * This metric measures current total instance capacity.
   *
   * This metric can be used with automatic scaling.
   */
  metricActiveInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Percentage of all active instances that are idle (calculated as IdleInstances / ActiveInstances).
   * This metric can be used for automatic scaling.
   */
  metricPercentIdleInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Target number of active instances that GameLift is working to maintain in the fleet.
   * With automatic scaling, this value is determined based on the scaling policies currently in force.
   * Without automatic scaling, this value is set manually.
   * This metric is not available when viewing data for fleet metric groups.
   */
  metricDesiredInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Active instances that are currently hosting zero (0) game sessions.
   * This metric measures capacity that is available but unused.
   * This metric can be used with automatic scaling.
   */
  metricIdleInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Number of spot instances that have been interrupted.
   */
  metricInstanceInterruptions(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Maximum number of instances that are allowed for the fleet.
   * A fleet's instance maximum determines the capacity ceiling during manual or automatic scaling up.
   * This metric is not available when viewing data for fleet metric groups.
   */
  metricMaxInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Minimum number of instances allowed for the fleet.
   * A fleet's instance minimum determines the capacity floor during manual or automatic scaling down.
   * This metric is not available when viewing data for fleet metric groups.
   */
  metricMinInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Properties for a new Gamelift fleet
 */
export interface FleetProps {

  /**
     * A descriptive label that is associated with a fleet. Fleet names do not need to be unique.
     */
  readonly fleetName: string;

  /**
   * A human-readable description of the fleet.
   *
   * @default no description is provided
   */
  readonly description?: string;

  /**
   * Indicates whether to use On-Demand or Spot instances for this fleet.
   * By default, fleet use on demand capacity.
   *
   * This property cannot be changed after the fleet is created.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-ec2-instances.html#gamelift-ec2-instances-spot
   *
   * @default Gamelift fleet use on demand capacity
   */
  readonly useSpot?: boolean;

  /**
   * Prompts GameLift to generate a TLS/SSL certificate for the fleet.
   * GameLift uses the certificates to encrypt traffic between game clients and the game servers running on GameLift.
   *
   * You can't change this property after you create the fleet.
   *
   * Additionnal info:
   * AWS Certificate Manager (ACM) certificates expire after 13 months.
   * Certificate expiration can cause fleets to fail, preventing players from connecting to instances in the fleet.
   * We recommend you replace fleets before 13 months, consider using fleet aliases for a smooth transition.
   *
   * @default TLS/SSL certificate are generated for the fleet
   */
  readonly useCertificate?: boolean;

  /**
    * The IAM role assumed by GameLift fleet instances to access AWS ressources.
    * With a role set, any application that runs on an instance in this fleet can assume the role, including install scripts, server processes, and daemons (background processes).
    * If providing a custom role, it needs to trust the GameLift service principal (gamelift.amazonaws.com).
    * No permission is required by default.
    *
    * This property cannot be changed after the fleet is created.
    *
    * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-resources.html
    *
    * @default - a role will be created with default trust to Gamelift service principal.
    */
  readonly role?: iam.IRole;

  /**
   * A VPC peering connection between your GameLift-hosted game servers and your other non-GameLift resources.
   * Use Amazon Virtual Private Cloud (VPC) peering connections to enable your game servers to communicate directly and privately with your other AWS resources, such as a web service or a repository.
   * You can establish VPC peering with any resources that run on AWS and are managed by an AWS account that you have access to.
   * The VPC must be in the same Region as your fleet.
   *
   * Warning:
   * Be sure to create a VPC Peering authorization through Gamelift Service API.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/vpc-peering.html
   *
   * @default no vpc peering
   */
  readonly peerVpc?: ec2.IVpc;

  /**
   * The name of an AWS CloudWatch metric group to add this fleet to.
   * A metric group is used to aggregate the metrics for multiple fleets.
   * You can specify an existing metric group name or set a new name to create a new metric group.
   * A fleet can be included in only one metric group at a time.
   *
   * @default Fleet metrics are aggregated with other fleets in the default metric group
   */
  readonly metricGroup?: string;

  /**
   * The GameLift-supported Amazon EC2 instance type to use for all fleet instances.
   * Instance type determines the computing resources that will be used to host your game servers, including CPU, memory, storage, and networking capacity.
   *
   * @see http://aws.amazon.com/ec2/instance-types/ for detailed descriptions of Amazon EC2 instance types.
   */
  readonly instanceType: ec2.InstanceType;

  /**
   * The number of EC2 instances that you want this fleet to host.
   * When creating a new fleet, GameLift automatically sets this value to "1" and initiates a single instance.
   * Once the fleet is active, update this value to trigger GameLift to add or remove instances from the fleet.
   *
   * @default Default capacity is 0
   */
  readonly desiredCapacity?: number;

  /**
   * The minimum number of instances that are allowed in the specified fleet location.
   *
   * @default the default is 0
   */
  readonly minSize?: number;

  /**
   * The maximum number of instances that are allowed in the specified fleet location.
   *
   * @default the default is 1
   */
  readonly maxSize?: number;

  /**
   * The status of termination protection for active game sessions on the fleet.
   * By default, new game sessions are protected and cannot be terminated during a scale-down event.
   *
   * @default true - Game sessions in `ACTIVE` status cannot be terminated during a scale-down event.
   */
  readonly protectNewGameSession? : boolean;

  /**
   * A collection of server process configurations that describe the set of processes to run on each instance in a fleet.
   * Server processes run either an executable in a custom game build or a Realtime Servers script.
   * GameLift launches the configured processes, manages their life cycle, and replaces them as needed.
   * Each instance checks regularly for an updated runtime configuration.
   *
   * A GameLift instance is limited to 50 processes running concurrently.
   * To calculate the total number of processes in a runtime configuration, add the values of the ConcurrentExecutions parameter for each ServerProcess.
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/fleets-multiprocess.html
   */
  readonly runtimeConfiguration: RuntimeConfiguration;

  /**
   * A set of remote locations to deploy additional instances to and manage as part of the fleet.
   * This parameter can only be used when creating fleets in AWS Regions that support multiple locations.
   * You can add any GameLift-supported AWS Region as a remote location, in the form of an AWS Region code such as `us-west-2`.
   * To create a fleet with instances in the home region only, omit this parameter.
   *
   * @default Create a fleet with instances in the home region only
   */
  readonly locations?: Location[];

  /**
   * A policy that limits the number of game sessions that an individual player can create on instances in this fleet within a specified span of time.
   *
   * @default No resource creation limit policy
   */
  readonly resourceCreationLimitPolicy?: ResourceCreationLimitPolicy;
}

/**
 * A full specification of a fleet that can be used to import it fluently into the CDK application.
 */
export interface FleetAttributes {
  /**
     * The ARN of the fleet
     *
     * At least one of `fleetArn` and `fleetId` must be provided.
     *
     * @default derived from `fleetId`.
     */
  readonly fleetArn?: string;

  /**
   * The identifier of the fleet
   *
   * At least one of `fleetId` and `fleetArn`  must be provided.
   *
   * @default derived from `fleetArn`.
   */
  readonly fleetId?: string;

  /**
   * The IAM role assumed by GameLift fleet instances to access AWS ressources.
   *
   * @default the imported fleet cannot be granted access to other resources as an `iam.IGrantable`.
   */
  readonly role?: iam.IRole;
}

/**
 * Base class for new and imported GameLift fleet.
 */
export abstract class FleetBase extends cdk.Resource implements IFleet {

  /**
   * Import an existing fleet from its attributes.
   */
  static fromFleetAttributes(scope: Construct, id: string, attrs: FleetAttributes): IFleet {
    if (!attrs.fleetId && !attrs.fleetArn) {
      throw new Error('Either fleetId or fleetArn must be provided in FleetAttributes');
    }
    const fleetId = attrs.fleetId ??
      cdk.Stack.of(scope).splitArn(attrs.fleetArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!fleetId) {
      throw new Error(`No fleet identifier found in ARN: '${attrs.fleetArn}'`);
    }

    const fleetArn = attrs.fleetArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'fleet',
      resourceName: attrs.fleetId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends FleetBase {
      public readonly fleetId = fleetId!;
      public readonly fleetArn = fleetArn;
      public readonly grantPrincipal = attrs.role ?? new iam.UnknownPrincipal({ resource: this });
      public readonly role = attrs.role;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: fleetArn,
        });
      }
    }
    return new Import(scope, id);
  }

  /**
    * The Identifier of the fleet.
    */
  public abstract readonly fleetId: string;
  /**
   * The ARN of the fleet.
   */
  public abstract readonly fleetArn: string;

  /**
   * The principal this GameLift fleet is using.
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  private readonly locations: Location[] = [];

  /**
   * Defines an alias for this fleet.
   *
   * ```ts
   * declare const fleet: gamelift.FleetBase;
   *
   * fleet.addAlias('Live');
   *
   * // Is equivalent to
   *
   * new gamelift.Alias(this, 'AliasLive', {
   *   aliasName: 'Live',
   *   fleet: fleet,
   * });
   * ```
   *
   * @param aliasName The name of the alias
   * @param options Alias options
   */
  public addAlias(aliasName: string, options: AliasOptions = {}) {
    return new Alias(this, `Alias${aliasName}`, {
      aliasName,
      fleet: this,
      ...options,
    });
  }

  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      resourceArns: [this.fleetArn],
      grantee: grantee,
      actions: actions,
    });
  }

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/GameLift',
      metricName: metricName,
      dimensionsMap: {
        FleetId: this.fleetId,
      },
      ...props,
    }).attachTo(this);
  }

  public metricActiveInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(GameLiftMetrics.activeInstancesAverage, props);
  }

  public metricPercentIdleInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(GameLiftMetrics.percentIdleInstancesAverage, props);
  }

  public metricDesiredInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(GameLiftMetrics.desiredInstancesAverage, props);
  }

  public metricIdleInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(GameLiftMetrics.idleInstancesAverage, props);
  }

  public metricInstanceInterruptions(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(GameLiftMetrics.instanceInterruptionsSum, props);
  }

  public metricMaxInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(GameLiftMetrics.maxInstancesAverage, props);
  }

  public metricMinInstances(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(GameLiftMetrics.minInstancesAverage, props);
  }

  private cannedMetric(fn: (dims: { FleetId: string }) => cloudwatch.MetricProps, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      ...fn({ FleetId: this.fleetId }),
      ...props,
    }).attachTo(this);
  }

  /**
   * The ARN to put into the destination field of a game session queue
   */
  public get resourceArnForDestination() {
    return this.fleetArn;
  }

  /**
   * Adds a remote locations to deploy additional instances to and manage as part of the fleet.
   *
   * @param region The AWS region to add
   */
  public addLocation(region: string, desiredCapacity?: number, minSize?: number, maxSize?: number) {
    this.addInternalLocation({
      region: region,
      capacity: {
        desiredCapacity: desiredCapacity,
        minSize: minSize,
        maxSize: maxSize,
      },
    });
  }

  /**
   * Adds a remote locations to deploy additional instances to and manage as part of the fleet.
   *
   * @param location The location to add
   */
  public addInternalLocation(location: Location) {
    if (this.locations.length == 100) {
      throw new Error('No more than 100 locations are allowed per fleet');
    }

    this.locations.push(location);
  }

  protected parseResourceCreationLimitPolicy(props: FleetProps): CfnFleet.ResourceCreationLimitPolicyProperty | undefined {
    if (!props.resourceCreationLimitPolicy ||
        (!props.resourceCreationLimitPolicy.newGameSessionsPerCreator
            && !props.resourceCreationLimitPolicy.policyPeriod)) {
      return undefined;
    }

    return {
      newGameSessionsPerCreator: props.resourceCreationLimitPolicy.newGameSessionsPerCreator,
      policyPeriodInMinutes: props.resourceCreationLimitPolicy.policyPeriod?.toMinutes(),
    };
  }

  protected parseLocations(): CfnFleet.LocationConfigurationProperty[] | undefined {
    if (!this.locations || this.locations.length === 0) {
      return undefined;
    }

    const self = this;

    return this.locations.map(parseLocation);

    function parseLocation(location: Location): CfnFleet.LocationConfigurationProperty {
      return {
        location: location.region,
        locationCapacity: self.parseLocationCapacity(location.capacity),
      };
    }
  }

  protected parseLocationCapacity(capacity?: LocationCapacity): CfnFleet.LocationCapacityProperty | undefined {
    if (!capacity ||
        (!capacity.desiredCapacity
            && !capacity.minSize
            && !capacity.maxSize)) {
      return undefined;
    }

    return {
      desiredEc2Instances: capacity.desiredCapacity ?? 0,
      minSize: capacity.minSize ?? 0,
      maxSize: capacity.maxSize ?? 1,
    };

  }
  protected parseRuntimeConfiguration(props: FleetProps): CfnFleet.RuntimeConfigurationProperty | undefined {
    if (!props.runtimeConfiguration ||
        (!props.runtimeConfiguration.gameSessionActivationTimeout
            && !props.runtimeConfiguration.maxConcurrentGameSessionActivations
            && props.runtimeConfiguration.serverProcesses.length == 0)) {
      return undefined;
    }
    return {
      gameSessionActivationTimeoutSeconds: props.runtimeConfiguration.gameSessionActivationTimeout?.toSeconds(),
      maxConcurrentGameSessionActivations: props.runtimeConfiguration.maxConcurrentGameSessionActivations,
      serverProcesses: props.runtimeConfiguration.serverProcesses.map(parseServerProcess),
    };

    function parseServerProcess(serverProcess: ServerProcess): CfnFleet.ServerProcessProperty {
      return {
        parameters: serverProcess.parameters,
        launchPath: serverProcess.launchPath,
        concurrentExecutions: serverProcess.concurrentExecutions ?? 1,
      };
    }
  }

  protected warnVpcPeeringAuthorizations(scope: Construct): void {
    cdk.Annotations.of(scope).addWarning([
      'To authorize the VPC peering, call the GameLift service API CreateVpcPeeringAuthorization() or use the AWS CLI command create-vpc-peering-authorization.',
      'Make this call using the account that manages your non-GameLift resources.',
      'See: https://docs.aws.amazon.com/gamelift/latest/developerguide/vpc-peering.html',
    ].join('\n'));
  }
}
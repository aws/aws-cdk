import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { RuntimeConfiguration } from './runtime-configuration';

/**
 * Represents a Gamelift fleet
 */
export interface IFleet extends cdk.IResource, iam.IGrantable {
  /**
   * The Identifier of the fleet.
   *
   * @attribute
   */
  readonly fleetId: string;

  /**
   * The name of the fleet.
   *
   * @attribute
   */
  readonly fleetName: string;

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
}

/**
 * Properties for a new Gamelift fleet
 */
export interface FleetProps {

  /**
     * A descriptive label that is associated with a fleet. Fleet names do not need to be unique.
     *
     * @default No name
     */
  readonly fleetName?: string;

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
  readonly minSize: number;

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
  readonly runtimeConfigurations: RuntimeConfiguration[];

  /**
   * A set of remote locations to deploy additional instances to and manage as part of the fleet.
   * This parameter can only be used when creating fleets in AWS Regions that support multiple locations.
   * You can add any GameLift-supported AWS Region as a remote location, in the form of an AWS Region code such as `us-west-2`.
   * To create a fleet with instances in the home region only, omit this parameter.
   *
   * @default Create a fleet with instances in the home region only
   */
  readonly locations?: Location[];
}

/**
 * A full specification of a fleet that can be used to import it fluently into the CDK application.
 */
export interface FleetAttributes {
  /**
     * The ARN of the fleet
     *
     * At least one of `fleetArn` and `fleetName` must be provided.
     *
     * @default derived from `fleetName`.
     */
  readonly fleetArn: string;

  /**
   * The name of the fleet
   *
   * At least one of `fleetName` and `fleetArn`  must be provided.
   *
   * @default derived from `fleetArn`.
   */
  readonly fleetName?: string;

  /**
   * The IAM role assumed by GameLift fleet instances to access AWS ressources.
   *
   * @default the imported fleet cannot be granted access to other resources as an `iam.IGrantable`.
   */
  readonly role?: iam.IRole;
}

/**
 * Base class for new and imported GameLift server build.
 */
export abstract class FleetBase extends cdk.Resource implements IFleet {
  /**
    * The Identifier of the fleet.
    */
  public abstract readonly fleetId: string;
  /**
   * The name of the fleet.
   */
  public abstract readonly fleetName: string;
  /**
   * The ARN of the fleet.
   */
  public abstract readonly fleetArn: string;

  public abstract readonly grantPrincipal: iam.IPrincipal;

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

  private cannedMetric(fn: (dims: { FleetId: string }) => cloudwatch.MetricProps, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      ...fn({ FleetId: this.fleetId }),
      ...props,
    }).attachTo(this);
  }
}
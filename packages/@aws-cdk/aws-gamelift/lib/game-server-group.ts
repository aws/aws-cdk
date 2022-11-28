import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnGameServerGroup } from './gamelift.generated';


/**
 * Configuration settings for intelligent automatic scaling that uses target tracking.
 * After the Auto Scaling group is created, all updates to Auto Scaling policies, including changing this policy and adding or removing other policies, is done directly on the Auto Scaling group.
 */
export interface AutoScalingPolicy {
  /**
     * Length of time, it takes for a new instance to start new game server processes and register with GameLift FleetIQ.
     * Specifying a warm-up time can be useful, particularly with game servers that take a long time to start up, because it avoids prematurely starting new instances.
     *
     * @default no instance warmup duration settled
     */
  readonly estimatedInstanceWarmup?: cdk.Duration;

  /**
   * Settings for a target-based scaling policy applied to Auto Scaling group.
   * These settings are used to create a target-based policy that tracks the GameLift FleetIQ metric `PercentUtilizedGameServers` and specifies a target value for the metric.
   *
   * As player usage changes, the policy triggers to adjust the game server group capacity so that the metric returns to the target value.
   */
  readonly targetTrackingConfiguration: number;

}
/**
 * An allowed instance type for a game server group.
 * All game server groups must have at least two instance types defined for it.
 * GameLift FleetIQ periodically evaluates each defined instance type for viability.
 * It then updates the Auto Scaling group with the list of viable instance types.
 */
export interface InstanceDefinition {
  /**
     * An Amazon EC2 instance type designation.
     */
  readonly instanceType: ec2.InstanceType;
  /**
   * Instance weighting that indicates how much this instance type contributes to the total capacity of a game server group.
   * Instance weights are used by GameLift FleetIQ to calculate the instance type's cost per unit hour and better identify the most cost-effective options.
   *
   * @see https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-weighting.html
   *
   * @default default value is 1
   */
  readonly weight?: number;
}
/**
 * The type of delete to perform.
 * To delete a game server group, specify the DeleteOption.
 */
export enum DeleteOption {
  /**
    * Terminates the game server group and Amazon EC2 Auto Scaling group only when it has no game servers that are in UTILIZED status.
    */
  SAFE_DELETE = 'SAFE_DELETE',
  /**
   * Terminates the game server group, including all active game servers regardless of their utilization status, and the Amazon EC2 Auto Scaling group.
   */
  FORCE_DELETE = 'FORCE_DELETE',
  /**
   * Does a safe delete of the game server group but retains the Amazon EC2 Auto Scaling group as is.
   */
  RETAIN = 'RETAIN',
}
/**
 * Indicates how GameLift FleetIQ balances the use of Spot Instances and On-Demand Instances in the game server group.
 */
export enum BalancingStrategy {
  /**
     * Only Spot Instances are used in the game server group.
     * If Spot Instances are unavailable or not viable for game hosting, the game server group provides no hosting capacity until Spot Instances can again be used.
     * Until then, no new instances are started, and the existing nonviable Spot Instances are terminated (after current gameplay ends) and are not replaced.
     */
  SPOT_ONLY = 'SPOT_ONLY',
  /**
   * Spot Instances are used whenever available in the game server group.
   * If Spot Instances are unavailable, the game server group continues to provide hosting capacity by falling back to On-Demand Instances.
   * Existing nonviable Spot Instances are terminated (after current gameplay ends) and are replaced with new On-Demand Instances.
   */
  SPOT_PREFERRED = 'SPOT_PREFERRED',
  /**
   * Only On-Demand Instances are used in the game server group.
   * No Spot Instances are used, even when available, while this balancing strategy is in force.
   */
  ON_DEMAND_ONLY = 'ON_DEMAND_ONLY',

}
/**
 * Represent a GameLift FleetIQ game server group.
 */
export interface IGameServerGroup extends cdk.IResource, iam.IGrantable {
  /**
   * The ARN of the game server group.
   *
   * @attribute
   */
  readonly gameServerGroupArn: string;

  /**
   * The ARN of the generated AutoScaling group
   *
   * @attribute
   */
  readonly autoScalingGroupArn: string;

  /**
   * The name of the game server group
   *
   * @attribute
   */
  readonly gameServerGroupName: string;

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
 * Base class for new and imported GameLift FleetIQ game server group.
 */
export abstract class GameServerGroupBase extends cdk.Resource implements IGameServerGroup {

  /**
  * The ARN of the game server group.
  */
  public abstract readonly gameServerGroupArn: string;

  /**
   * The ARN of the generated AutoScaling group
   */
  public abstract readonly autoScalingGroupArn: string;

  /**
  * The name of the game server group.
  */
  public abstract readonly gameServerGroupName: string;

  /**
  * The principal this GameLift game server group is using.
  */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      resourceArns: [this.gameServerGroupArn],
      grantee: grantee,
      actions: actions,
    });
  }

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/GameLift',
      metricName: metricName,
      dimensionsMap: {
        GameServerGroupArn: this.gameServerGroupArn,
      },
      ...props,
    }).attachTo(this);
  }

}

/**
 * Represents a GameServerGroup content defined outside of this stack.
 */
export interface GameServerGroupAttributes {

  /**
     * The name of the game server group
     *
     * At least one of `gameServerGroupArn` and `gameServerGroupName` must be provided.
     *
     * @default derived from `gameServerGroupArn`.
     */
  readonly gameServerGroupName?: string;
  /**
     * The ARN of the game server group
     *
     * At least one of `gameServerGroupArn` and `gameServerGroupName` must be provided.
     *
     * @default derived from `gameServerGroupName`.
     */
  readonly gameServerGroupArn?: string;

  /**
   * The ARN of the generated AutoScaling group
   *
   * @default the imported game server group does not have autoscaling group information
   */
  readonly autoScalingGroupArn: string;

  /**
   * The IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
   *
   * @default the imported game server group cannot be granted access to other resources as an `iam.IGrantable`.
   */
  readonly role?: iam.IRole;
}

/**
 * Properties for a new Gamelift FleetIQ Game server group
 */
export interface GameServerGroupProps {
  /**
     * A developer-defined identifier for the game server group.
     * The name is unique for each Region in each AWS account.
     */
  readonly gameServerGroupName: string;

  /**
    * The IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
    *
    * @see https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-iam-permissions-roles.html
    *
    * @default - a role will be created with default trust to Gamelift and Autoscaling service principal with a default policy `GameLiftGameServerGroupPolicy` attached.
    */
  readonly role?: iam.IRole;

  /**
   * The minimum number of instances allowed in the Amazon EC2 Auto Scaling group.
   * During automatic scaling events, GameLift FleetIQ and Amazon EC2 do not scale down the group below this minimum.
   *
   * In production, this value should be set to at least 1.
   *
   * After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
   *
   * @default the default is 0
   */
  readonly minSize?: number;

  /**
    * The maximum number of instances allowed in the Amazon EC2 Auto Scaling group. During automatic scaling events, GameLift FleetIQ and EC2 do not scale up the group above this maximum.
    *
    * After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
    *
    * @default the default is 1
    */
  readonly maxSize?: number;

  /**
   * The VPC network to place the game server group in.
   *
   * By default, all GameLift FleetIQ-supported Availability Zones are used.
   *
   * You can use this parameter to specify VPCs that you've set up.
   *
   * This property cannot be updated after the game server group is created,
   * and the corresponding Auto Scaling group will always use the property value that is set with this request,
   * even if the Auto Scaling group is updated directly.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Game server group subnet selection
   *
   * @default all GameLift FleetIQ-supported Availability Zones are used.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The set of Amazon EC2 instance types that GameLift FleetIQ can use when balancing and automatically scaling instances in the corresponding Auto Scaling group.
   */
  readonly instanceDefinitions: InstanceDefinition[];

  /**
   * The Amazon EC2 launch template that contains configuration settings and game server code to be deployed to all instances in the game server group.
   * After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
   *
   * NOTE:
   * If you specify network interfaces in your launch template, you must explicitly set the property AssociatePublicIpAddress to `true`.
   * If no network interface is specified in the launch template, GameLift FleetIQ uses your account's default VPC.
   *
   * @see https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html
   */
  readonly launchTemplate: ec2.ILaunchTemplate;

  /**
   * A flag that indicates whether instances in the game server group are protected from early termination.
   * Unprotected instances that have active game servers running might be terminated during a scale-down event, causing players to be dropped from the game.
   * Protected instances cannot be terminated while there are active game servers running except in the event of a forced game server group deletion.
   *
   * An exception to this is with Spot Instances, which can be terminated by AWS regardless of protection status.
   *
   * @default game servers running might be terminated during a scale-down event
   */
  readonly protectGameServer?: boolean;

  /**
   * Configuration settings to define a scaling policy for the Auto Scaling group that is optimized for game hosting.
   * The scaling policy uses the metric `PercentUtilizedGameServers` to maintain a buffer of idle game servers that can immediately accommodate new games and players.
   *
   * After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
   *
   * @default no autoscaling policy settled
   */
  readonly autoScalingPolicy?: AutoScalingPolicy;

  /**
   * The type of delete to perform. To delete a game server group, specify the DeleteOption
   *
   * @default SAFE_DELETE
   */
  readonly deleteOption?: DeleteOption;

  /**
    * Indicates how GameLift FleetIQ balances the use of Spot Instances and On-Demand Instances in the game server group.
    *
    * @default SPOT_PREFERRED
    */
  readonly balancingStrategy?: BalancingStrategy;
}

/**
 * Creates a GameLift FleetIQ game server group for managing game hosting on a collection of Amazon EC2 instances for game hosting.
 * This operation creates the game server group, creates an Auto Scaling group in your AWS account, and establishes a link between the two groups.
 * You can view the status of your game server groups in the GameLift console.
 * Game server group metrics and events are emitted to Amazon CloudWatch.
 * Before creating a new game server group, you must have the following:
 *  - An Amazon EC2 launch template that specifies how to launch Amazon EC2 instances with your game server build.
 *  - An IAM role that extends limited access to your AWS account to allow GameLift FleetIQ to create and interact with the Auto Scaling group.
 *
 * To create a new game server group, specify a unique group name, IAM role and Amazon EC2 launch template, and provide a list of instance types that can be used in the group.
 * You must also set initial maximum and minimum limits on the group's instance count.
 * You can optionally set an Auto Scaling policy with target tracking based on a GameLift FleetIQ metric.
 *
 * Once the game server group and corresponding Auto Scaling group are created, you have full access to change the Auto Scaling group's configuration as needed.
 * Several properties that are set when creating a game server group, including maximum/minimum size and auto-scaling policy settings, must be updated directly in the Auto Scaling group.
 * Keep in mind that some Auto Scaling group properties are periodically updated by GameLift FleetIQ as part of its balancing activities to optimize for availability and cost.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-intro.html
 *
 * @resource AWS::GameLift::GameServerGroup
 */
export class GameServerGroup extends GameServerGroupBase {

  /**
   * Import an existing game server group from its attributes.
   */
  static fromGameServerGroupAttributes(scope: Construct, id: string, attrs: GameServerGroupAttributes): IGameServerGroup {
    if (!attrs.gameServerGroupArn && !attrs.gameServerGroupName) {
      throw new Error('Either gameServerGroupName or gameServerGroupArn must be provided in GameServerGroupAttributes');
    }
    const gameServerGroupName = attrs.gameServerGroupName ??
      cdk.Stack.of(scope).splitArn(attrs.gameServerGroupArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!gameServerGroupName) {
      throw new Error(`No game server group name found in ARN: '${attrs.gameServerGroupArn}'`);
    }

    const gameServerGroupArn = attrs.gameServerGroupArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'gameservergroup',
      resourceName: attrs.gameServerGroupName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });

    class Import extends GameServerGroupBase {
      public readonly gameServerGroupName = gameServerGroupName!;
      public readonly gameServerGroupArn = gameServerGroupArn;
      public readonly autoScalingGroupArn = attrs.autoScalingGroupArn;
      public readonly grantPrincipal = attrs.role ?? new iam.UnknownPrincipal({ resource: this });
      public readonly role = attrs.role;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: gameServerGroupArn,
        });
      }
    }
    return new Import(scope, id);
  }

  /**
   * The name of the game server group
   */
  public readonly gameServerGroupName: string;

  /**
   * The ARN of the game server group.
   */
  public readonly gameServerGroupArn: string;

  /**
   * The ARN of the generated AutoScaling group
   */
  public readonly autoScalingGroupArn: string;

  /**
    * The IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
    */
  public readonly role: iam.IRole;

  /**
    * The principal this GameLift game server group is using.
    */
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The VPC network to place the game server group in.
   */
  public readonly vpc: ec2.IVpc;

  /**
    * The game server group's subnets.
    */
  public readonly vpcSubnets?: ec2.SubnetSelection;

  constructor(scope: Construct, id: string, props: GameServerGroupProps) {
    super(scope, id, {
      physicalName: props.gameServerGroupName,
    });

    if (!cdk.Token.isUnresolved(props.gameServerGroupName)) {
      if (props.gameServerGroupName.length > 128) {
        throw new Error(`GameServerGroup name can not be longer than 128 characters but has ${props.gameServerGroupName.length} characters.`);
      }

      if (!/^[a-zA-Z0-9-\.]+$/.test(props.gameServerGroupName)) {
        throw new Error(`Game server group name ${props.gameServerGroupName} can contain only letters, numbers, hyphens, back slash or dot with no spaces.`);
      }
    }

    this.vpc = props.vpc;
    this.vpcSubnets = props.vpcSubnets ?? { subnetType: ec2.SubnetType.PUBLIC };
    const { subnetIds } = props.vpc.selectSubnets(this.vpcSubnets);

    if (props.minSize && props.minSize < 0) {
      throw new Error(`The minimum number of instances allowed in the Amazon EC2 Auto Scaling group cannot be lower than 0, given ${props.minSize}`);
    }

    if (props.maxSize && props.maxSize < 1) {
      throw new Error(`The maximum number of instances allowed in the Amazon EC2 Auto Scaling group cannot be lower than 1, given ${props.maxSize}`);
    }

    if (subnetIds.length > 20) {
      throw new Error(`No more than 20 subnets are allowed per game server group, given ${subnetIds.length}`);
    }

    // Add all instance definitions
    if (props.instanceDefinitions.length > 20) {
      throw new Error(`No more than 20 instance definitions are allowed per game server group, given ${props.instanceDefinitions.length}`);
    }

    this.role = props.role ?? new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('gamelift.amazonaws.com'),
        new iam.ServicePrincipal('autoscaling.amazonaws.com')),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('GameLiftGameServerGroupPolicy'),
      ],
    });
    this.grantPrincipal = this.role;

    const resource = new CfnGameServerGroup(this, 'Resource', {
      gameServerGroupName: this.physicalName,
      autoScalingPolicy: this.parseAutoScalingPolicy(props),
      deleteOption: props.deleteOption,
      balancingStrategy: props.balancingStrategy,
      gameServerProtectionPolicy: props.protectGameServer ? 'FULL_PROTECTION' : 'NO_PROTECTION',
      instanceDefinitions: this.parseInstanceDefinitions(props),
      launchTemplate: this.parseLaunchTemplate(props),
      minSize: props.minSize,
      maxSize: props.maxSize,
      roleArn: this.role.roleArn,
      vpcSubnets: subnetIds,
    });

    this.gameServerGroupName = this.getResourceNameAttribute(resource.ref);
    this.gameServerGroupArn = this.getResourceArnAttribute(resource.attrGameServerGroupArn, {
      service: 'gamelift',
      resource: 'gameservergroup',
      resourceName: this.physicalName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    this.autoScalingGroupArn = this.getResourceArnAttribute(resource.attrAutoScalingGroupArn, {
      service: 'autoscaling',
      resource: 'autoScalingGroup',
      resourceName: this.physicalName,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });

  }

  protected parseLaunchTemplate(props: GameServerGroupProps): CfnGameServerGroup.LaunchTemplateProperty {
    return {
      launchTemplateId: props.launchTemplate.launchTemplateId,
      launchTemplateName: props.launchTemplate.launchTemplateName,
      version: props.launchTemplate.versionNumber,
    };
  }

  protected parseAutoScalingPolicy(props: GameServerGroupProps): CfnGameServerGroup.AutoScalingPolicyProperty | undefined {
    if (!props.autoScalingPolicy) {
      return undefined;
    }

    return {
      estimatedInstanceWarmup: props.autoScalingPolicy.estimatedInstanceWarmup?.toSeconds(),
      targetTrackingConfiguration: {
        targetValue: props.autoScalingPolicy.targetTrackingConfiguration,
      },
    };
  }

  protected parseInstanceDefinitions(props: GameServerGroupProps): CfnGameServerGroup.InstanceDefinitionProperty[] {
    return props.instanceDefinitions.map(parseInstanceDefinition);

    function parseInstanceDefinition(instanceDefinition: InstanceDefinition): CfnGameServerGroup.InstanceDefinitionProperty {
      return {
        instanceType: instanceDefinition.instanceType.toString(),
        weightedCapacity: instanceDefinition.weight?.toString(),
      };
    }
  }
}
import ec2 = require('@aws-cdk/aws-ec2');
import { Construct, Lazy, Resource } from '@aws-cdk/core';
import { BaseService, BaseServiceOptions, IService, LaunchType, PropagatedTagSource } from '../base/base-service';
import { NetworkMode, TaskDefinition } from '../base/task-definition';
import { CfnService } from '../ecs.generated';
import { PlacementConstraint, PlacementStrategy } from '../placement';

/**
 * The properties for defining a service using the EC2 launch type.
 */
export interface Ec2ServiceProps extends BaseServiceOptions {
  /**
   * The task definition to use for tasks in the service.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: TaskDefinition;

  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   * If true, each task will receive a public IP address.
   *
   * This property is only used for tasks that use the awsvpc network mode.
   *
   * @default - Use subnet default.
   */
  readonly assignPublicIp?: boolean;

  /**
   * The subnets to associate with the service.
   *
   * This property is only used for tasks that use the awsvpc network mode.
   *
   * @default - Private subnets.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The security groups to associate with the service. If you do not specify a security group, the default security group for the VPC is used.
   *
   * This property is only used for tasks that use the awsvpc network mode.
   *
   * @default - A new security group is created.
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The placement constraints to use for tasks in the service. For more information, see
   * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
   *
   * @default - No constraints.
   */
  readonly placementConstraints?: PlacementConstraint[];

  /**
   * The placement strategies to use for tasks in the service. For more information, see
   * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
   *
   * @default - No strategies.
   */
  readonly placementStrategies?: PlacementStrategy[];

  /**
   * Specifies whether the service will use the daemon scheduling strategy.
   * If true, the service scheduler deploys exactly one task on each container instance in your cluster.
   *
   * When you are using this strategy, do not specify a desired number of tasks orany task placement strategies.
   *
   * @default false
   */
  readonly daemon?: boolean;

  /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @default PropagatedTagSource.NONE
   */
  readonly propagateTaskTagsFrom?: PropagatedTagSource;
}

/**
 * The interface for a service using the EC2 launch type on an ECS cluster.
 */
export interface IEc2Service extends IService {

}

/**
 * This creates a service using the EC2 launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export class Ec2Service extends BaseService implements IEc2Service {

  /**
   * Imports from the specified service ARN.
   */
  public static fromEc2ServiceArn(scope: Construct, id: string, ec2ServiceArn: string): IEc2Service {
    class Import extends Resource implements IEc2Service {
      public readonly serviceArn = ec2ServiceArn;
    }
    return new Import(scope, id);
  }

  private readonly constraints: CfnService.PlacementConstraintProperty[];
  private readonly strategies: CfnService.PlacementStrategyProperty[];
  private readonly daemon: boolean;

  /**
   * Constructs a new instance of the Ec2Service class.
   */
  constructor(scope: Construct, id: string, props: Ec2ServiceProps) {
    if (props.daemon && props.desiredCount !== undefined) {
      throw new Error('Daemon mode launches one task on every instance. Don\'t supply desiredCount.');
    }

    if (props.daemon && props.maxHealthyPercent !== undefined && props.maxHealthyPercent !== 100) {
      throw new Error('Maximum percent must be 100 for daemon mode.');
    }

    if (props.daemon && props.minHealthyPercent !== undefined && props.minHealthyPercent !== 0) {
      throw new Error('Minimum healthy percent must be 0 for daemon mode.');
    }

    if (!props.taskDefinition.isEc2Compatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with EC2');
    }

    if (props.propagateTags && props.propagateTaskTagsFrom) {
      throw new Error('You can only specify either propagateTags or propagateTaskTagsFrom. Alternatively, you can leave both blank');
    }

    const propagateTagsFromSource = props.propagateTaskTagsFrom !== undefined ? props.propagateTaskTagsFrom
                                      : (props.propagateTags !== undefined ? props.propagateTags : PropagatedTagSource.NONE);

    super(scope, id, {
      ...props,
      // If daemon, desiredCount must be undefined and that's what we want. Otherwise, default to 1.
      desiredCount: props.daemon || props.desiredCount !== undefined ? props.desiredCount : 1,
      maxHealthyPercent: props.daemon && props.maxHealthyPercent === undefined ? 100 : props.maxHealthyPercent,
      minHealthyPercent: props.daemon && props.minHealthyPercent === undefined ? 0 : props.minHealthyPercent,
      launchType: LaunchType.EC2,
      propagateTags: propagateTagsFromSource,
      enableECSManagedTags: props.enableECSManagedTags,
    },
    {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      placementConstraints: Lazy.anyValue({ produce: () => this.constraints }, { omitEmptyArray: true }),
      placementStrategies: Lazy.anyValue({ produce: () => this.strategies }, { omitEmptyArray: true }),
      schedulingStrategy: props.daemon ? 'DAEMON' : 'REPLICA',
    }, props.taskDefinition);

    this.constraints = [];
    this.strategies = [];
    this.daemon = props.daemon || false;

    if (props.taskDefinition.networkMode === NetworkMode.AWS_VPC) {
      this.configureAwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, props.securityGroup);
    } else {
      // Either None, Bridge or Host networking. Copy SecurityGroup from ASG.
      validateNoNetworkingProps(props);
      this.connections.addSecurityGroup(...props.cluster.connections.securityGroups);
    }

    this.addPlacementConstraints(...props.placementConstraints || []);
    this.addPlacementStrategies(...props.placementStrategies || []);

    if (!this.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }
  }

  /**
   * Adds one or more placement strategies to use for tasks in the service. For more information, see
   * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
   */
  public addPlacementStrategies(...strategies: PlacementStrategy[]) {
    if (strategies.length > 0 && this.daemon) {
      throw new Error("Can't configure placement strategies when daemon=true");
    }

    for (const strategy of strategies) {
      this.strategies.push(...strategy.toJson());
    }
  }

  /**
   * Adds one or more placement strategies to use for tasks in the service. For more information, see
   * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
   */
  public addPlacementConstraints(...constraints: PlacementConstraint[]) {
    for (const constraint of constraints) {
      this.constraints.push(...constraint.toJson());
    }
  }

  /**
   * Validates this Ec2Service.
   */
  protected validate(): string[] {
    const ret = super.validate();
    if (!this.cluster.hasEc2Capacity) {
      ret.push('Cluster for this service needs Ec2 capacity. Call addXxxCapacity() on the cluster.');
    }
    return ret;
  }
}

/**
 * Validate combinations of networking arguments
 */
function validateNoNetworkingProps(props: Ec2ServiceProps) {
  if (props.vpcSubnets !== undefined || props.securityGroup !== undefined || props.assignPublicIp) {
    throw new Error('vpcSubnets, securityGroup and assignPublicIp can only be used in AwsVpc networking mode');
  }
}

/**
 * The built-in container instance attributes
 */
export class BuiltInAttributes {
  /**
   * The id of the instance.
   */
  public static readonly INSTANCE_ID = 'instanceId';

  /**
   * The AvailabilityZone where the instance is running in.
   */
  public static readonly AVAILABILITY_ZONE = 'attribute:ecs.availability-zone';

  /**
   * The AMI id the instance is using.
   */
  public static readonly AMI_ID = 'attribute:ecs.ami-id';

  /**
   * The EC2 instance type.
   */
  public static readonly INSTANCE_TYPE = 'attribute:ecs.instance-type';

  /**
   * The operating system of the instance.
   *
   * Either 'linux' or 'windows'.
   */
  public static readonly OS_TYPE = 'attribute:ecs.os-type';
}

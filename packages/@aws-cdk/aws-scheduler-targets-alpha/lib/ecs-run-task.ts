import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '@aws-cdk/aws-scheduler-alpha';
import { Lazy, ValidationError } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Metadata that you apply to a resource to help categorize and organize the resource. Each tag consists of a key and an optional value, both of which you define.
 */
export interface Tag {
  /**
   * Key is the name of the tag
   */
  readonly key: string;
  /**
   * Value is the metadata contents of the tag
   */
  readonly value: string;
}

/**
 * Parameters for scheduling ECS Run Task (common to EC2 and Fargate launch types).
 */
export interface EcsRunTaskBaseProps extends ScheduleTargetBaseProps {
  /**
   * The task definition to use for scheduled tasks.
   *
   * Note: this must be TaskDefinition, and not ITaskDefinition,
   * as it requires properties that are not known for imported task definitions
   * If you want to run a RunTask with an imported task definition,
   * consider using a Universal target.
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * The capacity provider strategy to use for the task.
   *
   * @default - No capacity provider strategy
   */
  readonly capacityProviderStrategies?: ecs.CapacityProviderStrategy[];

  /**
   * Specifies whether to enable Amazon ECS managed tags for the task.
   * @default - false
   */
  readonly enableEcsManagedTags?: boolean;

  /**
   * Whether to enable execute command functionality for the containers in this task.
   * If true, this enables execute command functionality on all containers in the task.
   *
   * @default - false
   */
  readonly enableExecuteCommand?: boolean;

  /**
   * Specifies an ECS task group for the task.
   *
   * @default - No group
   */
  readonly group?: string;

  /**
   * Specifies whether to propagate the tags from the task definition to the task.
   * If no value is specified, the tags are not propagated.
   *
   * @default - No tag propagation
   */
  readonly propagateTags?: boolean;

  /**
   * The reference ID to use for the task.
   *
   * @default - No reference ID.
   */
  readonly referenceId?: string;

  /**
   * The metadata that you apply to the task to help you categorize and organize them.
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * @default - No tags
   */
  readonly tags?: Tag[];

  /**
   * The number of tasks to create based on TaskDefinition.
   *
   * @default 1
   */
  readonly taskCount?: number;

}

/**
 * Properties for scheduling an ECS Fargate Task.
 */
export interface FargateTaskProps extends EcsRunTaskBaseProps {
  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   * If true, the task will receive a public IP address and be accessible from the internet.
   * Should only be set to true when using public subnets.
   *
   * @default - true if the subnet type is PUBLIC, otherwise false
   */
  readonly assignPublicIp?: boolean;

  /**
   * The subnets associated with the task. These subnets must all be in the same VPC.
   * The task will be launched in these subnets.
   *
   * @default - all private subnets of the VPC are selected.
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The security groups associated with the task. These security groups must all be in the same VPC.
   * Controls inbound and outbound network access for the task.
   *
   * @default - The security group for the VPC is used.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Specifies the platform version for the task.
   * Specify only the numeric portion of the platform version, such as 1.1.0.
   * Platform versions determine the underlying runtime environment for the task.
   *
   * @default - LATEST
   */
  readonly platformVersion?: string;
}

/**
 * Properties for scheduling an ECS Task on EC2.
 */
export interface Ec2TaskProps extends EcsRunTaskBaseProps {
  /**
   * The rules that must be met in order to place a task on a container instance.
   *
   * @default - No placement constraints.
   */
  readonly placementConstraints?: ecs.PlacementConstraint[];

  /**
   * The algorithm for selecting container instances for task placement.
   *
   * @default - No placement strategies.
   */
  readonly placementStrategies?: ecs.PlacementStrategy[];
}

/**
 * Schedule an ECS Task using AWS EventBridge Scheduler.
 */
export abstract class EcsRunTask extends ScheduleTargetBase implements IScheduleTarget {
  /**
   * Schedule an ECS Task on Fargate using AWS EventBridge Scheduler.
   */
  public static onFargate(cluster: ecs.ICluster, props: FargateTaskProps): IScheduleTarget {
    return new FargateTask(cluster, props);
  }

  /**
   * Schedule an ECS Task on EC2 using AWS EventBridge Scheduler.
   */
  public static onEc2(cluster: ecs.ICluster, props: Ec2TaskProps): IScheduleTarget {
    return new Ec2Task(cluster, props);
  }

  constructor(
    protected readonly cluster: ecs.ICluster,
    protected readonly props: EcsRunTaskBaseProps,
  ) {
    super(props, cluster.clusterArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    this.props.taskDefinition.grantRun(role);

    // If it so happens that a Task Execution Role was created for the TaskDefinition,
    // then the EventBridge Role must have permissions to pass it (otherwise it doesn't).
    if (this.props.taskDefinition.executionRole !== undefined) {
      role.addToPrincipalPolicy(new PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.props.taskDefinition.executionRole.roleArn],
      }));
    }

    if (this.props.propagateTags === true || this.props.tags) {
      role.addToPrincipalPolicy(new PolicyStatement({
        actions: ['ecs:TagResource'],
        resources: [`arn:${this.cluster.stack.partition}:ecs:${this.cluster.env.region}:${this.props.taskDefinition.env.account}:task/${this.cluster.clusterName}/*`],
      }));
    }
  }

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    return {
      ...super.bindBaseTargetConfig(_schedule),
      ecsParameters: {
        taskDefinitionArn: this.props.taskDefinition.taskDefinitionArn,
        capacityProviderStrategy: this.props.capacityProviderStrategies,
        taskCount: this.props.taskCount,
        tags: this.props.tags,
        propagateTags: this.props.propagateTags ? ecs.PropagatedTagSource.TASK_DEFINITION : undefined,
        enableEcsManagedTags: this.props.enableEcsManagedTags,
        enableExecuteCommand: this.props.enableExecuteCommand,
        group: this.props.group,
        referenceId: this.props.referenceId,
      },
    };
  }
}

class FargateTask extends EcsRunTask {
  private readonly subnetSelection?: ec2.SubnetSelection;
  private readonly securityGroups?: ec2.ISecurityGroup[];
  private readonly assignPublicIp?: boolean;
  private readonly platformVersion?: string;
  private readonly capacityProviderStrategies?: ecs.CapacityProviderStrategy[];

  constructor(
    cluster: ecs.ICluster,
    props: FargateTaskProps,
  ) {
    super(cluster, props);
    this.subnetSelection = props.subnetSelection;
    this.securityGroups = props.securityGroups;
    this.assignPublicIp = props.assignPublicIp;
    this.platformVersion = props.platformVersion;
    this.capacityProviderStrategies = props.capacityProviderStrategies;
  }

  protected addTargetActionToRole(role: IRole): void {
    super.addTargetActionToRole(role);
    // For Fargate tasks we need permission to pass the task role.
    if (this.props.taskDefinition.isFargateCompatible) {
      role.addToPrincipalPolicy(new PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.props.taskDefinition.taskRole.roleArn],
      }));
    }
  }

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    if (!this.props.taskDefinition.isFargateCompatible) {
      throw new ValidationError('TaskDefinition is not compatible with Fargate launch type.', _schedule);
    }

    const subnetSelection = this.subnetSelection || { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS };

    // Throw an error if assignPublicIp is true and the subnet type is not public
    if (this.assignPublicIp && subnetSelection.subnetType !== ec2.SubnetType.PUBLIC) {
      throw new ValidationError('assignPublicIp should be set to true only for public subnets', _schedule);
    }

    const assignPublicIp = this.assignPublicIp !== undefined
      ? (this.assignPublicIp ? 'ENABLED' : 'DISABLED')
      : (subnetSelection.subnetType === ec2.SubnetType.PUBLIC ? 'ENABLED' : 'DISABLED');

    // Only one of capacityProviderStrategy or launchType can be set
    // See https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html#ECS-RunTask-request-launchType
    const launchType = this.capacityProviderStrategies ? undefined : ecs.LaunchType.FARGATE;

    const bindBaseTargetConfigParameters = super.bindBaseTargetConfig(_schedule).ecsParameters!;

    return {
      ...super.bindBaseTargetConfig(_schedule),
      ecsParameters: {
        ...bindBaseTargetConfigParameters,
        launchType,
        platformVersion: this.platformVersion,
        networkConfiguration: {
          awsvpcConfiguration: {
            assignPublicIp,
            subnets: this.cluster.vpc.selectSubnets(subnetSelection).subnetIds,
            securityGroups: this.securityGroups?.map((sg) => sg.securityGroupId),
          },
        },
      },
    };
  }
}
class Ec2Task extends EcsRunTask {
  private readonly capacityProviderStrategies?: ecs.CapacityProviderStrategy[];
  private readonly placementConstraints?: ecs.PlacementConstraint[];
  private readonly placementStrategies?: ecs.PlacementStrategy[];

  constructor(
    cluster: ecs.ICluster,
    props: Ec2TaskProps,
  ) {
    super(cluster, props);
    this.placementConstraints = props.placementConstraints;
    this.placementStrategies = props.placementStrategies;
    this.capacityProviderStrategies = props.capacityProviderStrategies;
  }

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    if (this.props.taskDefinition.compatibility === ecs.Compatibility.FARGATE) {
      throw new ValidationError('TaskDefinition is not compatible with EC2 launch type', _schedule);
    }

    // Only one of capacityProviderStrategy or launchType can be set
    // See https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html#ECS-RunTask-request-launchType
    const launchType = this.capacityProviderStrategies ? undefined : ecs.LaunchType.EC2;

    const bindBaseTargetConfigParameters = super.bindBaseTargetConfig(_schedule).ecsParameters!;

    return {
      ...super.bindBaseTargetConfig(_schedule),
      ecsParameters: {
        ...bindBaseTargetConfigParameters,
        launchType,
        placementConstraints: Lazy.any({
          produce: () => {
            // Only map if placementConstraints is defined and has items
            return this.placementConstraints?.length
              ? this.placementConstraints?.map((constraint) => constraint.toJson()).flat()
              : undefined;
          },
        }),
        placementStrategy: Lazy.any({ produce: () => this.placementStrategies }),
      },
    };
  }
}

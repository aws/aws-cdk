import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '@aws-cdk/aws-scheduler-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ValidationError } from 'aws-cdk-lib';

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
 * Parameters for scheduling ECS Run Task.
 */
export interface EcsRunTaskProps extends ScheduleTargetBaseProps {
  /**
   * [disable-awslint:ref-via-interface]
   * The task definition to use for scheduled tasks.
   *
   * Task Definition used for running tasks in the service.
   *
   * Note: this must be TaskDefinition, and not ITaskDefinition,
   * as it requires properties that are not known for imported task definitions
   * If you want to run a RunTask with an imported task definition,
   * consider using a Universal target.
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   * You can specify true only when LaunchType is set to FARGATE.
   *
   * @default - true if the subnet type is PUBLIC, otherwise false
   */
  readonly assignPublicIp?: boolean;

  /**
   * The capacity provider strategy to use for the task.
   *
   * @default - No capacity provider strategy
   */
  readonly capacityProviderStrategy?: ecs.CapacityProviderStrategy[];

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
   * Specifies the launch type on which your task is running.
   * The launch type that you specify here must match one of the launch type (compatibilities) of the target task.
   *
   * @default - No launch type
   */
  readonly launchType?: ecs.LaunchType;

  /**
   * Specifies the platform version for the task.
   * Specify only the numeric portion of the platform version, such as 1.1.0.
   *
   * @default - LATEST
   */
  readonly platformVersion?: string;

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
   * The subnets associated with the task. These subnets must all be in the same VPC.
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The security gorups associated with the task. These security groups must all be in the same VPC.
   * @default - The security group for the VPC is used.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

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
 * Schedule an ECS Task using AWS EventBridge Scheduler.
 */
export class EcsRunTask extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly cluster: ecs.ICluster,
    private readonly props: EcsRunTaskProps,
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

    // For Fargate tasks we need permission to pass the task role.
    if (this.props.taskDefinition.isFargateCompatible) {
      role.addToPrincipalPolicy(new PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.props.taskDefinition.taskRole.roleArn],
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
    const subnetSelection = this.props.subnetSelection || { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS };

    // Throw an error if assignPublicIp is true and the subnet type is not PUBLIC
    if (this.props.assignPublicIp && subnetSelection.subnetType !== ec2.SubnetType.PUBLIC) {
      throw new ValidationError('assignPublicIp should be set to true only for PUBLIC subnets', _schedule);
    }

    const assignPublicIp = (this.props.assignPublicIp ?? subnetSelection.subnetType === ec2.SubnetType.PUBLIC) ? 'ENABLED' : 'DISABLED';
    const launchType = this.props.launchType ?? (this.props.taskDefinition.isEc2Compatible ? 'EC2' : 'FARGATE');

    if (assignPublicIp === 'ENABLED' && launchType !== 'FARGATE') {
      throw new ValidationError('assignPublicIp is only supported for FARGATE tasks', _schedule);
    }

    return {
      ...super.bindBaseTargetConfig(_schedule),
      ecsParameters: {
        taskDefinitionArn: this.props.taskDefinition.taskDefinitionArn,
        taskCount: this.props.taskCount,
        propagateTags: this.props.propagateTags ? 'TASK_DEFINITION' : undefined,
        enableEcsManagedTags: this.props.enableEcsManagedTags,
        enableExecuteCommand: this.props.enableExecuteCommand,
        group: this.props.group,
        launchType,
        platformVersion: this.props.platformVersion,
        referenceId: this.props.referenceId,
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: this.cluster.vpc.selectSubnets(this.props.subnetSelection).subnetIds,
            assignPublicIp,
            securityGroups: this.props.securityGroups && this.props.securityGroups.map(sg => sg.securityGroupId),
          },
        },
      },
    };
  }
}

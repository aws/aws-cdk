import { Construct } from 'constructs';
import { ContainerOverride } from './ecs-task-properties';
import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig, singletonEventRole, TargetBaseProps } from './util';
import * as ec2 from '../../aws-ec2';
import * as ecs from '../../aws-ecs';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';

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
 * Properties to define an ECS Event Task
 */
export interface EcsTaskProps extends TargetBaseProps {
  /**
   * Cluster where service will be deployed
   */
  readonly cluster: ecs.ICluster;

  /**
   * Task Definition of the task that should be started
   */
  readonly taskDefinition: ecs.ITaskDefinition;

  /**
   * How many tasks should be started when this event is triggered
   *
   * @default 1
   */
  readonly taskCount?: number;

  /**
   * Container setting overrides
   *
   * Key is the name of the container to override, value is the
   * values you want to override.
   */
  readonly containerOverrides?: ContainerOverride[];

  /**
   * In what subnets to place the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default Private subnets
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * Existing security group to use for the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default A new security group is created
   * @deprecated use securityGroups instead
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Existing security groups to use for the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default A new security group is created
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Existing IAM role to run the ECS task
   *
   * @default A new IAM role is created
   */
  readonly role?: iam.IRole;

  /**
   * The platform version on which to run your task
   *
   * Unless you have specific compatibility requirements, you don't need to specify this.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
   *
   * @default - ECS will set the Fargate platform version to 'LATEST'
   */
  readonly platformVersion?: ecs.FargatePlatformVersion;

  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   * You can specify true only when LaunchType is set to FARGATE.
   *
   * @default - true if the subnet type is PUBLIC, otherwise false
   */
  readonly assignPublicIp?: boolean;

  /**
    * Specifies whether to propagate the tags from the task definition to the task. If no value is specified, the tags are not propagated.
    *
    * @default - Tags will not be propagated
    */
  readonly propagateTags?: ecs.PropagatedTagSource

  /**
     * The metadata that you apply to the task to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define.
     *
     * @default - No additional tags are applied to the task
     */
  readonly tags?: Tag[]

  /**
    * Whether or not to enable the execute command functionality for the containers in this task.
    * If true, this enables execute command functionality on all containers in the task.
    *
    * @default - false
    */
  readonly enableExecuteCommand?: boolean;
}

/**
 * Start a task on an ECS cluster
 */
export class EcsTask implements events.IRuleTarget {
  // Security group fields are public because we can generate a new security group if none is provided.

  /**
   * The security group associated with the task. Only applicable with awsvpc network mode.
   *
   * @default - A new security group is created.
   * @deprecated use securityGroups instead.
   */
  public readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The security groups associated with the task. Only applicable with awsvpc network mode.
   *
   * @default - A new security group is created.
   */
  public readonly securityGroups?: ec2.ISecurityGroup[];
  private readonly cluster: ecs.ICluster;
  private readonly taskDefinition: ecs.ITaskDefinition;
  private readonly taskCount: number;
  private readonly role: iam.IRole;
  private readonly platformVersion?: ecs.FargatePlatformVersion;
  private readonly assignPublicIp?: boolean;
  private readonly propagateTags?: ecs.PropagatedTagSource;
  private readonly tags?: Tag[];
  private readonly enableExecuteCommand?: boolean;

  constructor(private readonly props: EcsTaskProps) {
    if (props.securityGroup !== undefined && props.securityGroups !== undefined) {
      throw new Error('Only one of SecurityGroup or SecurityGroups can be populated.');
    }

    this.cluster = props.cluster;
    this.taskDefinition = props.taskDefinition;
    this.taskCount = props.taskCount ?? 1;
    this.platformVersion = props.platformVersion;
    this.assignPublicIp = props.assignPublicIp;
    this.enableExecuteCommand = props.enableExecuteCommand;

    const propagateTagsValidValues = [ecs.PropagatedTagSource.TASK_DEFINITION, ecs.PropagatedTagSource.NONE];
    if (props.propagateTags && !propagateTagsValidValues.includes(props.propagateTags)) {
      throw new Error('When propagateTags is passed, it must be set to TASK_DEFINITION or NONE.');
    }
    this.propagateTags = props.propagateTags;

    this.role = props.role ?? singletonEventRole(this.taskDefinition);
    for (const stmt of this.createEventRolePolicyStatements()) {
      this.role.addToPrincipalPolicy(stmt);
    }

    this.tags = props.tags;

    // Security groups are only configurable with the "awsvpc" network mode.
    if (this.taskDefinition.networkMode !== ecs.NetworkMode.AWS_VPC) {
      if (props.securityGroup !== undefined || props.securityGroups !== undefined) {
        cdk.Annotations.of(this.taskDefinition).addWarningV2('@aws-cdk/aws-events-targets:ecsTaskSecurityGroupIgnored', 'security groups are ignored when network mode is not awsvpc');
      }
      return;
    }
    if (props.securityGroups) {
      this.securityGroups = props.securityGroups;
      return;
    }

    if (!Construct.isConstruct(this.taskDefinition)) {
      throw new Error('Cannot create a security group for ECS task. ' +
        'The task definition in ECS task is not a Construct. ' +
        'Please pass a taskDefinition as a Construct in EcsTaskProps.');
    }

    let securityGroup = props.securityGroup || this.taskDefinition.node.tryFindChild('SecurityGroup') as ec2.ISecurityGroup;
    securityGroup = securityGroup || new ec2.SecurityGroup(this.taskDefinition, 'SecurityGroup', { vpc: this.props.cluster.vpc });
    this.securityGroup = securityGroup; // Maintain backwards-compatibility for customers that read the generated security group.
    this.securityGroups = [securityGroup];
  }

  /**
   * Allows using tasks as target of EventBridge events
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const arn = this.cluster.clusterArn;
    const role = this.role;
    const containerOverrides = this.props.containerOverrides && this.props.containerOverrides
      .map(({ containerName, ...overrides }) => ({ name: containerName, ...overrides }));
    const input = { containerOverrides };
    const taskCount = this.taskCount;
    const taskDefinitionArn = this.taskDefinition.taskDefinitionArn;
    const propagateTags = this.propagateTags;
    const tagList = this.tags;
    const enableExecuteCommand = this.enableExecuteCommand;

    const subnetSelection = this.props.subnetSelection || { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS };

    // throw an error if assignPublicIp is true and the subnet type is not PUBLIC
    if (this.assignPublicIp && subnetSelection.subnetType !== ec2.SubnetType.PUBLIC) {
      throw new Error('assignPublicIp should be set to true only for PUBLIC subnets');
    }

    const assignPublicIp = (this.assignPublicIp ?? subnetSelection.subnetType === ec2.SubnetType.PUBLIC) ? 'ENABLED' : 'DISABLED';
    const launchType = this.taskDefinition.isEc2Compatible ? 'EC2' : 'FARGATE';
    if (assignPublicIp === 'ENABLED' && launchType !== 'FARGATE') {
      throw new Error('assignPublicIp is only supported for FARGATE tasks');
    };

    const baseEcsParameters = { taskCount, taskDefinitionArn, propagateTags, tagList, enableExecuteCommand };

    const ecsParameters: events.CfnRule.EcsParametersProperty = this.taskDefinition.networkMode === ecs.NetworkMode.AWS_VPC
      ? {
        ...baseEcsParameters,
        launchType,
        platformVersion: this.platformVersion,
        networkConfiguration: {
          awsVpcConfiguration: {
            subnets: this.props.cluster.vpc.selectSubnets(subnetSelection).subnetIds,
            assignPublicIp,
            securityGroups: this.securityGroups && this.securityGroups.map(sg => sg.securityGroupId),
          },
        },
      }
      : baseEcsParameters;

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn,
      role,
      ecsParameters,
      input: events.RuleTargetInput.fromObject(input),
      targetResource: this.taskDefinition,
    };
  }

  private createEventRolePolicyStatements(): iam.PolicyStatement[] {
    const policyStatements = [new iam.PolicyStatement({
      actions: ['ecs:RunTask'],
      resources: [this.taskDefinition.taskDefinitionArn],
      conditions: {
        ArnEquals: { 'ecs:cluster': this.cluster.clusterArn },
      },
    })];

    // If it so happens that a Task Execution Role was created for the TaskDefinition,
    // then the EventBridge Role must have permissions to pass it (otherwise it doesn't).
    if (this.taskDefinition.executionRole !== undefined) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.taskDefinition.executionRole.roleArn],
      }));
    }

    // For Fargate task we need permission to pass the task role.
    if (this.taskDefinition.isFargateCompatible) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.taskDefinition.taskRole.roleArn],
      }));
    }

    return policyStatements;
  }
}

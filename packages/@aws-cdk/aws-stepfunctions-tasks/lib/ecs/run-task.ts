import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { ContainerOverride } from '..';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Basic properties for ECS Tasks
 */
export interface EcsRunTaskProps extends sfn.TaskStateBaseProps {
  /**
   * The ECS cluster to run the task on
   */
  readonly cluster: ecs.ICluster;

  /**
   * [disable-awslint:ref-via-interface]
   * Task Definition used for running tasks in the service.
   *
   * Note: this must be TaskDefinition, and not ITaskDefinition,
   * as it requires properties that are not known for imported task definitions
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * Container setting overrides
   *
   * Key is the name of the container to override, value is the
   * values you want to override.
   *
   * @default - No overrides
   */
  readonly containerOverrides?: ContainerOverride[];

  /**
   * In what subnets to place the task's ENIs
   *
   * @default - Private subnet if assignPublicIp, public subnets otherwise
   */
  readonly subnets?: ec2.SubnetSelection;

  /**
   * Existing security group to use for the tasks
   *
   * @default - A new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Assign public IP addresses to each task
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * An Amazon ECS launch type determines the type of infrastructure on which your
   * tasks and services are hosted.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html
   */
  readonly launchTarget: IEcsLaunchTarget;
}

/**
 * An Amazon ECS launch type determines the type of infrastructure on which your tasks and services are hosted.
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html
 */
export interface IEcsLaunchTarget {
  /**
   * called when the ECS launch target is configured on RunTask
   */
  bind(_task: EcsRunTask): EcsLaunchTargetConfig;
}

/**
 * Configuration options for the ECS launch type
 */
export interface EcsLaunchTargetConfig {
  /**
   * Additional parameters to pass to the base task
   *
   * @default - No additional parameters passed
   */
  readonly parameters?: { [key: string]: any };
}

/**
 * Properties to define an ECS service
 */
export interface EcsFargateLaunchTargetOptions {
  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default FargatePlatformVersion.LATEST
   */
  readonly platformVersion?: ecs.FargatePlatformVersion;
}

/**
 * Options to run an ECS task on EC2 in StepFunctions and ECS
 */
export interface EcsEc2LaunchTargetOptions {
  /**
   * Placement constraints
   *
   * @default  - None
   */
  readonly placementConstraints?: ecs.PlacementConstraint[];

  /**
   * Placement strategies
   *
   * @default - None
   */
  readonly placementStrategies?: ecs.PlacementStrategy[];
}

/**
 * Configuration for running an ECS task on Fargate
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/userguide/launch_types.html#launch-type-fargate
 */
export class EcsFargateLaunchTarget implements IEcsLaunchTarget {
  constructor(private readonly options?: EcsFargateLaunchTargetOptions) {}

  /**
   * Called when the Fargate launch type configured on RunTask
   */
  public bind(_task: EcsRunTask): EcsLaunchTargetConfig {
    return {
      parameters: {
        LaunchType: 'FARGATE',
        PlatformVersion: this.options?.platformVersion,
      },
    };
  }
}

/**
 * Configuration for running an ECS task on EC2
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/userguide/launch_types.html#launch-type-ec2
 */
export class EcsEc2LaunchTarget implements IEcsLaunchTarget {
  constructor(private readonly options?: EcsEc2LaunchTargetOptions) {}
  /**
   * Called when the EC2 launch type is configured on RunTask
   */
  public bind(_task: EcsRunTask): EcsLaunchTargetConfig {
    return {
      parameters: {
        LaunchType: 'EC2',
        PlacementConstraints: noEmpty(flatten((this.options?.placementConstraints || []).map((c) => c.toJson().map(uppercaseKeys)))),
        PlacementStrategy: noEmpty(flatten((this.options?.placementStrategies || []).map((c) => c.toJson().map(uppercaseKeys)))),
      },
    };

    function uppercaseKeys(obj: { [key: string]: any }): { [key: string]: any } {
      const ret: { [key: string]: any } = {};
      for (const key of Object.keys(obj)) {
        ret[key.slice(0, 1).toUpperCase() + key.slice(1)] = obj[key];
      }
      return ret;
    }

    function flatten<A>(xs: A[][]): A[] {
      return Array.prototype.concat([], ...xs);
    }

    function noEmpty<A>(xs: A[]): A[] | undefined {
      if (xs.length === 0) {
        return undefined;
      }
      return xs;
    }
  }
}

/**
 * Run a Task on ECS or Fargate
 */
export class EcsRunTask extends sfn.TaskStateBase implements ec2.IConnectable {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  /**
   * Manage allowed network traffic for this service
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private securityGroup?: ec2.ISecurityGroup;
  private networkConfiguration?: any;
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: cdk.Construct, id: string, private readonly props: EcsRunTaskProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EcsRunTask.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.containerOverrides)) {
      throw new Error('Task Token is required in `containerOverrides` for callback. Use Context.taskToken to set the token.');
    }

    this.validateLaunchTarget();

    for (const override of this.props.containerOverrides || []) {
      const name = override.containerDefinition.containerName;
      if (!cdk.Token.isUnresolved(name)) {
        const cont = this.props.taskDefinition.node.tryFindChild(name);
        if (!cont) {
          throw new Error(`Overrides mention container with name '${name}', but no such container in task definition`);
        }
      }
    }

    this.taskPolicies = this.makePolicyStatements();
  }

  protected renderTask(): any {
    if (this.networkConfiguration !== undefined) {
      // Make sure we have a security group if we're using AWSVPC networking
      this.securityGroup = this.securityGroup ?? new ec2.SecurityGroup(this, 'SecurityGroup', { vpc: this.props.cluster.vpc });
      this.connections.addSecurityGroup(this.securityGroup);
    }

    return {
      Resource: integrationResourceArn('ecs', 'runTask', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        Cluster: this.props.cluster.clusterArn,
        TaskDefinition: this.props.taskDefinition.taskDefinitionArn,
        NetworkConfiguration: this.networkConfiguration,
        Overrides: renderOverrides(this.props.containerOverrides),
        ...this.props.launchTarget.bind(this).parameters,
      }),
    };
  }

  private configureAwsVpcNetworking() {
    const subnetSelection = this.props.subnets ?? { subnetType: this.props.assignPublicIp ? ec2.SubnetType.PUBLIC : ec2.SubnetType.PRIVATE };

    this.networkConfiguration = {
      AwsvpcConfiguration: {
        AssignPublicIp: this.props.assignPublicIp ? (this.props.assignPublicIp ? 'ENABLED' : 'DISABLED') : undefined,
        Subnets: this.props.cluster.vpc.selectSubnets(subnetSelection).subnetIds,
        SecurityGroups: cdk.Lazy.listValue({ produce: () => [this.securityGroup!.securityGroupId] }),
      },
    };
  }

  private validateLaunchTarget() {
    if (this.props.launchTarget instanceof EcsFargateLaunchTarget) {
      this.validateFargateLaunchType();
    }

    if (this.props.launchTarget instanceof EcsEc2LaunchTarget) {
      this.validateEc2LaunchType();
    }

    if (!this.props.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }
  }

  private validateEc2LaunchType() {
    if (!this.props.cluster.hasEc2Capacity) {
      throw new Error('Cluster for this service needs Ec2 capacity. Call addXxxCapacity() on the cluster.');
    }

    if (this.props.taskDefinition.networkMode === ecs.NetworkMode.AWS_VPC) {
      this.configureAwsVpcNetworking();
    } else {
      // Either None, Bridge or Host networking. Copy SecurityGroup from ASG.
      this.validateNoNetworkingProps();
      this.connections.addSecurityGroup(...this.props.cluster.connections.securityGroups);
    }
  }

  private validateNoNetworkingProps() {
    if (this.props.subnets !== undefined || this.props.securityGroup !== undefined) {
      throw new Error('vpcPlacement and securityGroup can only be used in AwsVpc networking mode');
    }
  }

  private validateFargateLaunchType() {
    if (!this.props.taskDefinition.isFargateCompatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with Fargate');
    }

    this.configureAwsVpcNetworking();
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    const stack = cdk.Stack.of(this);

    // https://docs.aws.amazon.com/step-functions/latest/dg/ecs-iam.html
    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['ecs:RunTask'],
        resources: [this.props.taskDefinition.taskDefinitionArn],
      }),
      new iam.PolicyStatement({
        actions: ['ecs:StopTask', 'ecs:DescribeTasks'],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: cdk.Lazy.listValue({ produce: () => this.taskExecutionRoles().map((r) => r.roleArn) }),
      }),
    ];

    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          resources: [
            stack.formatArn({
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForECSTaskRule',
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }

  private taskExecutionRoles(): iam.IRole[] {
    // Need to be able to pass both Task and Execution role, apparently
    const ret = new Array<iam.IRole>();
    ret.push(this.props.taskDefinition.taskRole);
    if (this.props.taskDefinition.executionRole) {
      ret.push(this.props.taskDefinition.executionRole);
    }
    return ret;
  }
}

function renderOverrides(containerOverrides?: ContainerOverride[]) {
  if (!containerOverrides) {
    return undefined;
  }

  const ret = new Array<any>();
  for (const override of containerOverrides) {
    ret.push({
      Name: override.containerDefinition.containerName,
      Command: override.command,
      Cpu: override.cpu,
      Memory: override.memoryLimit,
      MemoryReservation: override.memoryReservation,
      Environment:
        override.environment &&
        override.environment.map((e) => ({
          Name: e.name,
          Value: e.value,
        })),
    });
  }

  return { ContainerOverrides: ret };
}

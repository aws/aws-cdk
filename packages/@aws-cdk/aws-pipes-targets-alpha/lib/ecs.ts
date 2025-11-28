import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import * as cdk from 'aws-cdk-lib';
import {
  Connections,
  IConnectable,
  ISecurityGroup,
  IVpc,
  SecurityGroup,
  SubnetSelection,
} from 'aws-cdk-lib/aws-ec2';
import {
  CapacityProviderStrategy,
  Compatibility,
  FargatePlatformVersion,
  ICluster,
  ITaskDefinition,
  PlacementConstraint,
  PlacementStrategy,
} from 'aws-cdk-lib/aws-ecs';
import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';

/**
 * Configuration returned from binding compute to the pipe
 */
export interface IEcsTaskTargetComputeConfig {
  /**
   * The ECS task parameters
   */
  readonly ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty;
}

/**
 * Compute configuration for ECS task target
 */
export interface IEcsTaskTargetCompute {
  /**
   * Bind the compute configuration to the pipe
   */
  bind(
    pipe: IPipe,
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty
  ): IEcsTaskTargetComputeConfig;
}

class DefaultCapacityProviderStrategyCompute implements IEcsTaskTargetCompute {
  bind(
    _pipe: IPipe,
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty,
  ) {
    return { ecsTaskParameters };
  }
}

enum LaunchType {
  EC2 = 'EC2',
  FARGATE = 'FARGATE',
  EXTERNAL = 'EXTERNAL',
}
abstract class LaunchTypeCompute implements IEcsTaskTargetCompute {
  constructor(private readonly launchType: LaunchType) {}
  bind(
    _pipe: IPipe,
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty,
  ): IEcsTaskTargetComputeConfig {
    ecsTaskParameters = {
      ...ecsTaskParameters,
      launchType: this.launchType,
    } satisfies CfnPipe.PipeTargetEcsTaskParametersProperty;
    return { ecsTaskParameters };
  }

  protected isAssignPublicIp(
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty,
  ) {
    return (
      ecsTaskParameters.networkConfiguration &&
      'awsvpcConfiguration' in ecsTaskParameters.networkConfiguration &&
      ecsTaskParameters.networkConfiguration.awsvpcConfiguration &&
      'assignPublicIp' in
        ecsTaskParameters.networkConfiguration.awsvpcConfiguration &&
      ecsTaskParameters.networkConfiguration.awsvpcConfiguration
        ?.assignPublicIp === 'ENABLED'
    );
  }
}
class Ec2LaunchTypeCompute extends LaunchTypeCompute {
  constructor() {
    super(LaunchType.EC2);
  }
  bind(
    pipe: IPipe,
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty,
  ): IEcsTaskTargetComputeConfig {
    if (this.isAssignPublicIp(ecsTaskParameters)) {
      throw new cdk.ValidationError(
        "Specifies whether the task's elastic network interface receives a public IP address. You can specify ENABLED only when LaunchType in EcsParameters is set to FARGATE.",
        pipe,
      );
    }
    return super.bind(pipe, ecsTaskParameters);
  }
}
/**
 * Options for Fargate launch type compute
 */
export interface FargateLaunchTypeComputeOptions {
  /**
   * The platform version on which to run your task
   *
   * Unless you have specific compatibility requirements, you don't need to specify this.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
   *
   * @default - ECS will set the Fargate platform version to 'LATEST'
   */
  readonly platformVersion?: FargatePlatformVersion;
}
class FargateLaunchTypeCompute extends LaunchTypeCompute {
  constructor(private readonly options?: FargateLaunchTypeComputeOptions) {
    super(LaunchType.FARGATE);
  }
  bind(
    pipe: IPipe,
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty,
  ): IEcsTaskTargetComputeConfig {
    return {
      ecsTaskParameters: {
        ...super.bind(pipe, ecsTaskParameters).ecsTaskParameters,
        platformVersion: this.options?.platformVersion,
      } satisfies CfnPipe.PipeTargetEcsTaskParametersProperty,
    };
  }
}
class ExternalLaunchTypeCompute extends LaunchTypeCompute {
  constructor() {
    super(LaunchType.EXTERNAL);
  }
  bind(
    pipe: IPipe,
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty,
  ): IEcsTaskTargetComputeConfig {
    if (this.isAssignPublicIp(ecsTaskParameters)) {
      throw new cdk.ValidationError(
        "Specifies whether the task's elastic network interface receives a public IP address. You can specify ENABLED only when LaunchType in EcsParameters is set to FARGATE.",
        pipe,
      );
    }
    return super.bind(pipe, ecsTaskParameters);
  }
}

class CapacityProviderStrategyCompute implements IEcsTaskTargetCompute {
  constructor(
    private readonly capacityProviderStrategy: CapacityProviderStrategy[],
  ) {}
  bind(
    _pipe: IPipe,
    ecsTaskParameters: CfnPipe.PipeTargetEcsTaskParametersProperty,
  ): IEcsTaskTargetComputeConfig {
    return {
      ecsTaskParameters: {
        ...ecsTaskParameters,
        capacityProviderStrategy: this.capacityProviderStrategy,
      },
    };
  }
}

/**
 * Compute configuration for ECS task target
 */
export abstract class EcsTaskTargetCompute {
  /**
   * Use EC2 launch type
   */
  static ec2LaunchType(): IEcsTaskTargetCompute {
    return new Ec2LaunchTypeCompute();
  }
  /**
   * Use Fargate launch type
   */
  static fargateLaunchType(
    options?: FargateLaunchTypeComputeOptions,
  ): IEcsTaskTargetCompute {
    return new FargateLaunchTypeCompute(options);
  }
  /**
   * Use External launch type
   */
  static externalLaunchType(): IEcsTaskTargetCompute {
    return new ExternalLaunchTypeCompute();
  }
  /**
   * Use the cluster's default capacity provider strategy
   */
  static defaultCapacityProviderStrategy(): IEcsTaskTargetCompute {
    return new DefaultCapacityProviderStrategyCompute();
  }
  /**
   * Use a custom capacity provider strategy
   */
  static capacityProviderStrategy(
    capacityProviderStrategy: CapacityProviderStrategy[],
  ): IEcsTaskTargetCompute {
    return new CapacityProviderStrategyCompute(capacityProviderStrategy);
  }
}
/**
 * An environment variable to be set in the container run as a task
 */
export interface EcsEnvironmentVariable {
  /**
   * The name of the key-value pair.
   * For environment variables, this is the name of the environment variable.
   */
  readonly name: string;
  /**
   * The value of the key-value pair.
   * For environment variables, this is the value of the environment variable.
   */
  readonly value: string;
}

/**
 * Container override settings
 */
export interface ContainerOverride {
  /**
   * Name of the container inside the task definition
   */
  readonly containerName: string;
  /**
   * Command to run inside the container
   *
   * @default - Default command
   */
  readonly command?: string[];
  /**
   * Variables to set in the container's environment
   * @default - No environment variables.
   */
  readonly environment?: EcsEnvironmentVariable[];
  /**
   * The number of cpu units reserved for the container
   *
   * @default - The default value from the task definition.
   */
  readonly cpu?: number;
  /**
   * The hard limit of memory to present to the container.
   *
   * @default - The default value from the task definition.
   */
  readonly memory?: cdk.Size;
  /**
   * The soft limit of memory to reserve for the container.
   *
   * @default - The default value from the task definition.
   */
  readonly memoryReservation?: cdk.Size;
}

/**
 * Properties for EcsTaskTarget
 */
export interface EcsTaskTargetProps {
  /**
   * Task Definition of the task that should be started
   */
  readonly taskDefinition: ITaskDefinition;
  /**
   * How many tasks should be started when this event is triggered
   *
   * @default 1
   */
  readonly taskCount?: number;
  /**
   * The compute configuration for the ECS task
   *
   * @default - The computing option for LaunchType is automatically set according to the compatibility of the TaskDefinition.
   * If both EC2 and Fargate are present, the cluster's default capacity strategy will be selected.
   */
  readonly compute?: IEcsTaskTargetCompute;
  /**
   * Existing security groups to use for the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default A new security group is created
   */
  readonly securityGroups?: ISecurityGroup[];
  /**
   * In what subnets to place the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default Private subnets
   */
  readonly subnetSelection?: SubnetSelection;
  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   * You can specify true only when LaunchType is set to FARGATE.
   *
   * @default - true if the subnet type is PUBLIC, otherwise false
   */
  readonly assignPublicIp?: boolean;
  /**
   * When this parameter is enabled, Amazon ECS automatically tags your tasks with two tags corresponding to the cluster and service names.
   * These tags allow you to identify tasks easily in your AWS Cost and Usage Report.
   *
   * @default - true
   */
  readonly enableECSManagedTags?: boolean;
  /**
   * When this parameter is enabled, your tasks will be enabled for Amazon ECS Exec
   * which allows you to directly interact with the containers using an interactive shell.
   *
   * @default - false
   */
  readonly enableExecuteCommand?: boolean;
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
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;
  /**
   * Specifies an Amazon ECS task group for the task.
   *
   * @default - No group
   */
  readonly group?: string;
  /**
   * The placement constraints to use for tasks in the service.
   *
   * @default - No constraints
   */
  readonly placementConstraints?: PlacementConstraint[];
  /**
   * The placement strategies to use for tasks in the service.
   *
   * @default - No strategies
   */
  readonly placementStrategies?: PlacementStrategy[];
  /**
   * The cpu override for the task.
   *
   * @default - No override
   */
  readonly cpu?: string;
  /**
   * The memory override for the task.
   *
   * @default - No override
   */
  readonly memory?: string;
  /**
   * The ephemeral storage setting override for the task.
   *
   * Only supported for tasks hosted on Fargate using platform version 1.4.0 or later.
   *
   * @default - No override
   */
  readonly ephemeralStorage?: cdk.Size;
  /**
   * The task execution IAM role override for the task.
   *
   * @default - No override
   */
  readonly executionRole?: IRole;
  /**
   * The IAM role that containers in this task can assume.
   *
   * @default - No override
   */
  readonly taskRole?: IRole;
}

/**
 * An EventBridge Pipes target that sends messages to an ECS task
 */
export class EcsTaskTarget implements ITarget, IConnectable {
  readonly connections: Connections;
  private readonly cluster: ICluster;
  private readonly taskDefinition: ITaskDefinition;
  private readonly subnetSelection?: SubnetSelection;
  private readonly taskCount?: number;
  private readonly assignPublicIp?: boolean;
  private readonly enableExecuteCommand?: boolean;
  private readonly enableECSManagedTags?: boolean;
  private readonly compute: IEcsTaskTargetCompute;
  private readonly inputTransformation?: IInputTransformation;
  private readonly containerOverrides?: ContainerOverride[];
  private readonly group?: string;
  private readonly placementConstraints?: PlacementConstraint[];
  private readonly placementStrategies?: PlacementStrategy[];
  private readonly cpu?: string;
  private readonly memory?: string;
  private readonly ephemeralStorage?: cdk.Size;
  private readonly executionRole?: IRole;
  private readonly taskRole?: IRole;

  constructor(cluster: ICluster, props: EcsTaskTargetProps) {
    this.cluster = cluster;
    this.taskDefinition = props.taskDefinition;
    this.subnetSelection = props.subnetSelection;
    this.taskCount = props.taskCount ?? 1;
    this.assignPublicIp = props.assignPublicIp;
    this.enableExecuteCommand = props.enableExecuteCommand;
    this.enableECSManagedTags = props.enableECSManagedTags ?? true;
    this.compute =
      props.compute ?? this.getDefaultCompute(props.taskDefinition);
    this.inputTransformation = props.inputTransformation;
    this.containerOverrides = props.containerOverrides;
    this.group = props.group;
    this.placementConstraints = props.placementConstraints;
    this.placementStrategies = props.placementStrategies;
    this.cpu = props.cpu;
    this.memory = props.memory;
    this.ephemeralStorage = props.ephemeralStorage;
    this.executionRole = props.executionRole;
    this.taskRole = props.taskRole;

    this.connections = new Connections({
      securityGroups: props.securityGroups ?? [
        (this.taskDefinition.node.tryFindChild('SecurityGroup') as ISecurityGroup)
          ?? this.createDefaultSecurityGroup(cluster.vpc),
      ],
    });
  }
  get targetArn(): string {
    return this.cluster.clusterArn;
  }
  bind(pipe: IPipe): TargetConfig {
    const ecsTaskParameters = {
      taskDefinitionArn: this.taskDefinition.taskDefinitionArn,
      taskCount: this.taskCount,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: this.assignPublicIp ? 'ENABLED' : 'DISABLED',
          subnets: this.cluster.vpc.selectSubnets(this.subnetSelection)
            .subnetIds,
          securityGroups: cdk.Lazy.list({
            produce: () =>
              this.connections.securityGroups.map((sg) => sg.securityGroupId),
          }),
        },
      },
      enableEcsManagedTags: this.enableECSManagedTags,
      enableExecuteCommand: this.enableExecuteCommand,
      group: this.group,
      placementConstraints: this.placementConstraints?.flatMap((c) => c.toJson()),
      placementStrategy: this.placementStrategies?.flatMap((s) => s.toJson()),
      overrides: {
        containerOverrides: this.containerOverrides?.map(
          ({ containerName, memory, memoryReservation, ...overrides }) => ({
            name: containerName,
            memory: memory?.toMebibytes(),
            memoryReservation: memoryReservation?.toMebibytes(),
            ...overrides,
          }),
        ),
        cpu: this.cpu,
        memory: this.memory,
        ephemeralStorage: this.ephemeralStorage ? { sizeInGiB: this.ephemeralStorage.toGibibytes() } : undefined,
        executionRoleArn: this.executionRole?.roleArn,
        taskRoleArn: this.taskRole?.roleArn,
      },
    } satisfies CfnPipe.PipeTargetEcsTaskParametersProperty;
    const computeConfig = this.compute.bind(pipe, ecsTaskParameters);

    const targetConfig = {
      targetParameters: {
        ecsTaskParameters: computeConfig.ecsTaskParameters,
        inputTemplate: this.inputTransformation?.bind(pipe).inputTemplate,
      },
    } satisfies TargetConfig;

    return targetConfig;
  }
  grantPush(grantee: IRole): void {
    Grant.addToPrincipal({
      grantee,
      actions: ['ecs:RunTask'],
      resourceArns: [this.taskDefinition.taskDefinitionArn],
    });
    Grant.addToPrincipal({
      grantee,
      actions: ['iam:PassRole'],
      resourceArns: [
        this.taskDefinition.taskRole.roleArn,
        this.taskDefinition.executionRole?.roleArn ?? '',
      ].filter((arn) => !!arn),
      conditions: {
        StringLike: {
          'iam:PassedToService': 'ecs-tasks.amazonaws.com',
        },
      },
    });
  }

  private createDefaultSecurityGroup(vpc: IVpc) {
    return new SecurityGroup(this.taskDefinition, 'SecurityGroup', {
      vpc,
    });
  }

  private getDefaultCompute(taskDefinition: ITaskDefinition) {
    switch (taskDefinition.compatibility) {
      case Compatibility.EC2:
        return EcsTaskTargetCompute.ec2LaunchType();
      case Compatibility.FARGATE:
        return EcsTaskTargetCompute.fargateLaunchType();
      case Compatibility.EXTERNAL:
        return EcsTaskTargetCompute.externalLaunchType();
      default:
        return EcsTaskTargetCompute.defaultCapacityProviderStrategy();
    }
  }
}

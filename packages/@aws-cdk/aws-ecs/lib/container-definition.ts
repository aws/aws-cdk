import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { NetworkMode, TaskDefinition } from './base/task-definition';
import { ContainerImage, ContainerImageConfig } from './container-image';
import { CfnTaskDefinition } from './ecs.generated';
import { EnvironmentFile, EnvironmentFileConfig } from './environment-file';
import { LinuxParameters } from './linux-parameters';
import { LogDriver, LogDriverConfig } from './log-drivers/log-driver';

/**
 * Specify the secret's version id or version stage
 */
export interface SecretVersionInfo {
  /**
   * version id of the secret
   *
   * @default - use default version id
   */
  readonly versionId?: string;
  /**
   * version stage of the secret
   *
   * @default - use default version stage
   */
  readonly versionStage?: string;
}

/**
 * A secret environment variable.
 */
export abstract class Secret {
  /**
   * Creates an environment variable value from a parameter stored in AWS
   * Systems Manager Parameter Store.
   */
  public static fromSsmParameter(parameter: ssm.IParameter): Secret {
    return {
      arn: parameter.parameterArn,
      grantRead: grantee => parameter.grantRead(grantee),
    };
  }

  /**
   * Creates a environment variable value from a secret stored in AWS Secrets
   * Manager.
   *
   * @param secret the secret stored in AWS Secrets Manager
   * @param field the name of the field with the value that you want to set as
   * the environment variable value. Only values in JSON format are supported.
   * If you do not specify a JSON field, then the full content of the secret is
   * used.
   */
  public static fromSecretsManager(secret: secretsmanager.ISecret, field?: string): Secret {
    return {
      arn: field ? `${secret.secretArn}:${field}::` : secret.secretArn,
      hasField: !!field,
      grantRead: grantee => secret.grantRead(grantee),
    };
  }

  /**
   * Creates a environment variable value from a secret stored in AWS Secrets
   * Manager.
   *
   * @param secret the secret stored in AWS Secrets Manager
   * @param versionInfo the version information to reference the secret
   * @param field the name of the field with the value that you want to set as
   * the environment variable value. Only values in JSON format are supported.
   * If you do not specify a JSON field, then the full content of the secret is
   * used.
   */
  public static fromSecretsManagerVersion(secret: secretsmanager.ISecret, versionInfo: SecretVersionInfo, field?: string): Secret {
    return {
      arn: `${secret.secretArn}:${field ?? ''}:${versionInfo.versionStage ?? ''}:${versionInfo.versionId ?? ''}`,
      hasField: !!field,
      grantRead: grantee => secret.grantRead(grantee),
    };
  }

  /**
   * The ARN of the secret
   */
  public abstract readonly arn: string;

  /**
   * Whether this secret uses a specific JSON field
   */
  public abstract readonly hasField?: boolean;

  /**
   * Grants reading the secret to a principal
   */
  public abstract grantRead(grantee: iam.IGrantable): iam.Grant;
}

/*
 * The options for creating a container definition.
 */
export interface ContainerDefinitionOptions {
  /**
   * The image used to start a container.
   *
   * This string is passed directly to the Docker daemon.
   * Images in the Docker Hub registry are available by default.
   * Other repositories are specified with either repository-url/image:tag or repository-url/image@digest.
   * TODO: Update these to specify using classes of IContainerImage
   */
  readonly image: ContainerImage;

  /**
   * The name of the container.
   *
   * @default - id of node associated with ContainerDefinition.
   */
  readonly containerName?: string;

  /**
   * The command that is passed to the container.
   *
   * If you provide a shell command as a single string, you have to quote command-line arguments.
   *
   * @default - CMD value built into container image.
   */
  readonly command?: string[];

  /**
   * The minimum number of CPU units to reserve for the container.
   *
   * @default - No minimum CPU units reserved.
   */
  readonly cpu?: number;

  /**
   * Specifies whether networking is disabled within the container.
   *
   * When this parameter is true, networking is disabled within the container.
   *
   * @default false
   */
  readonly disableNetworking?: boolean;

  /**
   * A list of DNS search domains that are presented to the container.
   *
   * @default - No search domains.
   */
  readonly dnsSearchDomains?: string[];

  /**
   * A list of DNS servers that are presented to the container.
   *
   * @default - Default DNS servers.
   */
  readonly dnsServers?: string[];

  /**
   * A key/value map of labels to add to the container.
   *
   * @default - No labels.
   */
  readonly dockerLabels?: { [key: string]: string };

  /**
   * A list of strings to provide custom labels for SELinux and AppArmor multi-level security systems.
   *
   * @default - No security labels.
   */
  readonly dockerSecurityOptions?: string[];

  /**
   * The ENTRYPOINT value to pass to the container.
   *
   * @see https://docs.docker.com/engine/reference/builder/#entrypoint
   *
   * @default - Entry point configured in container.
   */
  readonly entryPoint?: string[];

  /**
   * The environment variables to pass to the container.
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * The environment files to pass to the container.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html
   *
   * @default - No environment files.
   */
  readonly environmentFiles?: EnvironmentFile[];

  /**
   * The secret environment variables to pass to the container.
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: Secret };

  /**
   * Time duration (in seconds) to wait before giving up on resolving dependencies for a container.
   *
   * @default - none
   */
  readonly startTimeout?: cdk.Duration;

  /**
   * Time duration (in seconds) to wait before the container is forcefully killed if it doesn't exit normally on its own.
   *
   * @default - none
   */
  readonly stopTimeout?: cdk.Duration;

  /**
   * Specifies whether the container is marked essential.
   *
   * If the essential parameter of a container is marked as true, and that container fails
   * or stops for any reason, all other containers that are part of the task are stopped.
   * If the essential parameter of a container is marked as false, then its failure does not
   * affect the rest of the containers in a task. All tasks must have at least one essential container.
   *
   * If this parameter is omitted, a container is assumed to be essential.
   *
   * @default true
   */
  readonly essential?: boolean;

  /**
   * A list of hostnames and IP address mappings to append to the /etc/hosts file on the container.
   *
   * @default - No extra hosts.
   */
  readonly extraHosts?: { [name: string]: string };

  /**
   * The health check command and associated configuration parameters for the container.
   *
   * @default - Health check configuration from container.
   */
  readonly healthCheck?: HealthCheck;

  /**
   * The hostname to use for your container.
   *
   * @default - Automatic hostname.
   */
  readonly hostname?: string;

  /**
   * The amount (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory limit.
   */
  readonly memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   *
   * When system memory is under heavy contention, Docker attempts to keep the
   * container memory to this soft limit. However, your container can consume more
   * memory when it needs to, up to either the hard limit specified with the memory
   * parameter (if applicable), or all of the available memory on the container
   * instance, whichever comes first.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory reserved.
   */
  readonly memoryReservationMiB?: number;

  /**
   * Specifies whether the container is marked as privileged.
   * When this parameter is true, the container is given elevated privileges on the host container instance (similar to the root user).
   *
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * When this parameter is true, the container is given read-only access to its root file system.
   *
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;

  /**
   * The user name to use inside the container.
   *
   * @default root
   */
  readonly user?: string;

  /**
   * The working directory in which to run commands inside the container.
   *
   * @default /
   */
  readonly workingDirectory?: string;

  /**
   * The log configuration specification for the container.
   *
   * @default - Containers use the same logging driver that the Docker daemon uses.
   */
  readonly logging?: LogDriver;

  /**
   * Linux-specific modifications that are applied to the container, such as Linux kernel capabilities.
   * For more information see [KernelCapabilities](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_KernelCapabilities.html).
   *
   * @default - No Linux parameters.
   */
  readonly linuxParameters?: LinuxParameters;

  /**
   * The number of GPUs assigned to the container.
   *
   * @default - No GPUs assigned.
   */
  readonly gpuCount?: number;

  /**
   * The port mappings to add to the container definition.
   * @default - No ports are mapped.
   */
  readonly portMappings?: PortMapping[];

  /**
   * The inference accelerators referenced by the container.
   * @default - No inference accelerators assigned.
   */
  readonly inferenceAcceleratorResources?: string[];

  /**
   * A list of namespaced kernel parameters to set in the container.
   *
   * @default - No system controls are set.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-systemcontrol.html
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definition_systemcontrols
   */
  readonly systemControls?: SystemControl[];
}

/**
 * The properties in a container definition.
 */
export interface ContainerDefinitionProps extends ContainerDefinitionOptions {
  /**
   * The name of the task definition that includes this container definition.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: TaskDefinition;
}

/**
 * A container definition is used in a task definition to describe the containers that are launched as part of a task.
 */
export class ContainerDefinition extends Construct {
  /**
   * The Linux-specific modifications that are applied to the container, such as Linux kernel capabilities.
   */
  public readonly linuxParameters?: LinuxParameters;

  /**
   * The mount points for data volumes in your container.
   */
  public readonly mountPoints = new Array<MountPoint>();

  /**
   * The list of port mappings for the container. Port mappings allow containers to access ports
   * on the host container instance to send or receive traffic.
   */
  public readonly portMappings = new Array<PortMapping>();

  /**
   * The data volumes to mount from another container in the same task definition.
   */
  public readonly volumesFrom = new Array<VolumeFrom>();

  /**
   * An array of ulimits to set in the container.
   */
  public readonly ulimits = new Array<Ulimit>();

  /**
   * An array dependencies defined for container startup and shutdown.
   */
  public readonly containerDependencies = new Array<ContainerDependency>();

  /**
   * Specifies whether the container will be marked essential.
   *
   * If the essential parameter of a container is marked as true, and that container
   * fails or stops for any reason, all other containers that are part of the task are
   * stopped. If the essential parameter of a container is marked as false, then its
   * failure does not affect the rest of the containers in a task.
   *
   * If this parameter is omitted, a container is assumed to be essential.
   */
  public readonly essential: boolean;

  /**
   * The name of this container
   */
  public readonly containerName: string;

  /**
   * Whether there was at least one memory limit specified in this definition
   */
  public readonly memoryLimitSpecified: boolean;

  /**
   * The name of the task definition that includes this container definition.
   */
  public readonly taskDefinition: TaskDefinition;

  /**
   * The environment files for this container
   */
  public readonly environmentFiles?: EnvironmentFileConfig[];

  /**
   * The log configuration specification for the container.
   */
  public readonly logDriverConfig?: LogDriverConfig;

  /**
   * The name of the image referenced by this container.
   */
  public readonly imageName: string;

  /**
   * The inference accelerators referenced by this container.
   */
  private readonly inferenceAcceleratorResources: string[] = [];

  /**
   * The configured container links
   */
  private readonly links = new Array<string>();

  private readonly imageConfig: ContainerImageConfig;

  private readonly secrets: CfnTaskDefinition.SecretProperty[] = [];

  private readonly environment: { [key: string]: string };

  private _namedPorts: Map<string, PortMapping>;

  /**
   * Constructs a new instance of the ContainerDefinition class.
   */
  constructor(scope: Construct, id: string, private readonly props: ContainerDefinitionProps) {
    super(scope, id);
    if (props.memoryLimitMiB !== undefined && props.memoryReservationMiB !== undefined) {
      if (props.memoryLimitMiB < props.memoryReservationMiB) {
        throw new Error('MemoryLimitMiB should not be less than MemoryReservationMiB.');
      }
    }
    this.essential = props.essential ?? true;
    this.taskDefinition = props.taskDefinition;
    this.memoryLimitSpecified = props.memoryLimitMiB !== undefined || props.memoryReservationMiB !== undefined;
    this.linuxParameters = props.linuxParameters;
    this.containerName = props.containerName ?? this.node.id;

    this.imageConfig = props.image.bind(this, this);
    this.imageName = this.imageConfig.imageName;

    this._namedPorts = new Map<string, PortMapping>();

    if (props.logging) {
      this.logDriverConfig = props.logging.bind(this, this);
    }

    if (props.secrets) {
      for (const [name, secret] of Object.entries(props.secrets)) {
        this.addSecret(name, secret);
      }
    }

    if (props.environment) {
      this.environment = { ...props.environment };
    } else {
      this.environment = {};
    }

    if (props.environmentFiles) {
      this.environmentFiles = [];

      for (const environmentFile of props.environmentFiles) {
        this.environmentFiles.push(environmentFile.bind(this));
      }
    }

    props.taskDefinition._linkContainer(this);

    if (props.portMappings) {
      this.addPortMappings(...props.portMappings);
    }

    if (props.inferenceAcceleratorResources) {
      this.addInferenceAcceleratorResource(...props.inferenceAcceleratorResources);
    }
  }

  /**
   * This method adds a link which allows containers to communicate with each other without the need for port mappings.
   *
   * This parameter is only supported if the task definition is using the bridge network mode.
   * Warning: The --link flag is a legacy feature of Docker. It may eventually be removed.
   */
  public addLink(container: ContainerDefinition, alias?: string) {
    if (this.taskDefinition.networkMode !== NetworkMode.BRIDGE) {
      throw new Error('You must use network mode Bridge to add container links.');
    }
    if (alias !== undefined) {
      this.links.push(`${container.containerName}:${alias}`);
    } else {
      this.links.push(`${container.containerName}`);
    }
  }

  /**
   * This method adds one or more mount points for data volumes to the container.
   */
  public addMountPoints(...mountPoints: MountPoint[]) {
    this.mountPoints.push(...mountPoints);
  }

  /**
   * This method mounts temporary disk space to the container.
   *
   * This adds the correct container mountPoint and task definition volume.
   */
  public addScratch(scratch: ScratchSpace) {
    const mountPoint = {
      containerPath: scratch.containerPath,
      readOnly: scratch.readOnly,
      sourceVolume: scratch.name,
    };

    const volume = {
      host: {
        sourcePath: scratch.sourcePath,
      },
      name: scratch.name,
    };

    this.taskDefinition.addVolume(volume);
    this.addMountPoints(mountPoint);
  }

  /**
   * This method adds one or more port mappings to the container.
   */
  public addPortMappings(...portMappings: PortMapping[]) {
    this.portMappings.push(...portMappings.map(pm => {
      const portMap = new PortMap(this.taskDefinition.networkMode, pm);
      portMap.validate();
      const serviceConnect = new ServiceConnect(this.taskDefinition.networkMode, pm);
      if (serviceConnect.isServiceConnect()) {
        serviceConnect.validate();
        this.setNamedPort(pm);
      }
      const sanitizedPM = this.addHostPortIfNeeded(pm);
      return sanitizedPM;
    }));
  }

  /**
   * This method adds an environment variable to the container.
   */
  public addEnvironment(name: string, value: string) {
    this.environment[name] = value;
  }

  /**
   * This method adds a secret as environment variable to the container.
   */
  public addSecret(name: string, secret: Secret) {
    secret.grantRead(this.taskDefinition.obtainExecutionRole());

    this.secrets.push({
      name,
      valueFrom: secret.arn,
    });
  }

  /**
   * This method adds one or more resources to the container.
   */
  public addInferenceAcceleratorResource(...inferenceAcceleratorResources: string[]) {
    this.inferenceAcceleratorResources.push(...inferenceAcceleratorResources.map(resource => {
      for (const inferenceAccelerator of this.taskDefinition.inferenceAccelerators) {
        if (resource === inferenceAccelerator.deviceName) {
          return resource;
        }
      }
      throw new Error(`Resource value ${resource} in container definition doesn't match any inference accelerator device name in the task definition.`);
    }));
  }

  /**
   * This method adds one or more ulimits to the container.
   */
  public addUlimits(...ulimits: Ulimit[]) {
    this.ulimits.push(...ulimits);
  }

  /**
   * This method adds one or more container dependencies to the container.
   */
  public addContainerDependencies(...containerDependencies: ContainerDependency[]) {
    this.containerDependencies.push(...containerDependencies);
  }

  /**
   * This method adds one or more volumes to the container.
   */
  public addVolumesFrom(...volumesFrom: VolumeFrom[]) {
    this.volumesFrom.push(...volumesFrom);
  }

  /**
   * This method adds the specified statement to the IAM task execution policy in the task definition.
   */
  public addToExecutionPolicy(statement: iam.PolicyStatement) {
    this.taskDefinition.addToExecutionRolePolicy(statement);
  }

  /**
   * Returns the host port for the requested container port if it exists
   */
  public findPortMapping(containerPort: number, protocol: Protocol): PortMapping | undefined {
    for (const portMapping of this.portMappings) {
      const p = portMapping.protocol || Protocol.TCP;
      const c = portMapping.containerPort;
      if (c === containerPort && p === protocol) {
        return portMapping;
      }
    }
    return undefined;
  }

  /**
   * Returns the port mapping with the given name, if it exists.
   */
  public findPortMappingByName(name: string): PortMapping | undefined {
    return this._namedPorts.get(name);
  }

  /**
   * This method adds an namedPort
   */
  private setNamedPort(pm: PortMapping) :void {
    if (!pm.name) return;
    if (this._namedPorts.has(pm.name)) {
      throw new Error(`Port mapping name '${pm.name}' already exists on this container`);
    }
    this._namedPorts.set(pm.name, pm);
  }


  /**
   * Set HostPort to 0 When netowork mode is Brdige
   */
  private addHostPortIfNeeded(pm: PortMapping) :PortMapping {
    const newPM = {
      ...pm,
    };
    if (this.taskDefinition.networkMode !== NetworkMode.BRIDGE) return newPM;
    if (pm.hostPort !== undefined) return newPM;
    newPM.hostPort = 0;
    return newPM;
  }


  /**
   * Whether this container definition references a specific JSON field of a secret
   * stored in Secrets Manager.
   */
  public get referencesSecretJsonField(): boolean | undefined {
    for (const secret of this.secrets) {
      if (secret.valueFrom.endsWith('::')) {
        return true;
      }
    }
    return false;
  }

  /**
   * The inbound rules associated with the security group the task or service will use.
   *
   * This property is only used for tasks that use the awsvpc network mode.
   */
  public get ingressPort(): number {
    if (this.portMappings.length === 0) {
      throw new Error(`Container ${this.containerName} hasn't defined any ports. Call addPortMappings().`);
    }
    const defaultPortMapping = this.portMappings[0];

    if (defaultPortMapping.hostPort !== undefined && defaultPortMapping.hostPort !== 0) {
      return defaultPortMapping.hostPort;
    }

    if (this.taskDefinition.networkMode === NetworkMode.BRIDGE) {
      return 0;
    }
    return defaultPortMapping.containerPort;
  }

  /**
   * The port the container will listen on.
   */
  public get containerPort(): number {
    if (this.portMappings.length === 0) {
      throw new Error(`Container ${this.containerName} hasn't defined any ports. Call addPortMappings().`);
    }
    const defaultPortMapping = this.portMappings[0];
    return defaultPortMapping.containerPort;
  }

  /**
   * Render this container definition to a CloudFormation object
   *
   * @param _taskDefinition [disable-awslint:ref-via-interface] (unused but kept to avoid breaking change)
   */
  public renderContainerDefinition(_taskDefinition?: TaskDefinition): CfnTaskDefinition.ContainerDefinitionProperty {
    return {
      command: this.props.command,
      cpu: this.props.cpu,
      disableNetworking: this.props.disableNetworking,
      dependsOn: cdk.Lazy.any({ produce: () => this.containerDependencies.map(renderContainerDependency) }, { omitEmptyArray: true }),
      dnsSearchDomains: this.props.dnsSearchDomains,
      dnsServers: this.props.dnsServers,
      dockerLabels: this.props.dockerLabels,
      dockerSecurityOptions: this.props.dockerSecurityOptions,
      entryPoint: this.props.entryPoint,
      essential: this.essential,
      hostname: this.props.hostname,
      image: this.imageConfig.imageName,
      memory: this.props.memoryLimitMiB,
      memoryReservation: this.props.memoryReservationMiB,
      mountPoints: cdk.Lazy.any({ produce: () => this.mountPoints.map(renderMountPoint) }, { omitEmptyArray: true }),
      name: this.containerName,
      portMappings: cdk.Lazy.any({ produce: () => this.portMappings.map(renderPortMapping) }, { omitEmptyArray: true }),
      privileged: this.props.privileged,
      readonlyRootFilesystem: this.props.readonlyRootFilesystem,
      repositoryCredentials: this.imageConfig.repositoryCredentials,
      startTimeout: this.props.startTimeout && this.props.startTimeout.toSeconds(),
      stopTimeout: this.props.stopTimeout && this.props.stopTimeout.toSeconds(),
      ulimits: cdk.Lazy.any({ produce: () => this.ulimits.map(renderUlimit) }, { omitEmptyArray: true }),
      user: this.props.user,
      volumesFrom: cdk.Lazy.any({ produce: () => this.volumesFrom.map(renderVolumeFrom) }, { omitEmptyArray: true }),
      workingDirectory: this.props.workingDirectory,
      logConfiguration: this.logDriverConfig,
      environment: this.environment && Object.keys(this.environment).length ? renderKV(this.environment, 'name', 'value') : undefined,
      environmentFiles: this.environmentFiles && renderEnvironmentFiles(cdk.Stack.of(this).partition, this.environmentFiles),
      secrets: this.secrets.length ? this.secrets : undefined,
      extraHosts: this.props.extraHosts && renderKV(this.props.extraHosts, 'hostname', 'ipAddress'),
      healthCheck: this.props.healthCheck && renderHealthCheck(this.props.healthCheck),
      links: cdk.Lazy.list({ produce: () => this.links }, { omitEmpty: true }),
      linuxParameters: this.linuxParameters && this.linuxParameters.renderLinuxParameters(),
      resourceRequirements: (!this.props.gpuCount && this.inferenceAcceleratorResources.length == 0 ) ? undefined :
        renderResourceRequirements(this.props.gpuCount, this.inferenceAcceleratorResources),
      systemControls: this.props.systemControls && renderSystemControls(this.props.systemControls),
    };
  }
}

/**
 * The health check command and associated configuration parameters for the container.
 */
export interface HealthCheck {
  /**
   * A string array representing the command that the container runs to determine if it is healthy.
   * The string array must start with CMD to execute the command arguments directly, or
   * CMD-SHELL to run the command with the container's default shell.
   *
   * For example: [ "CMD-SHELL", "curl -f http://localhost/ || exit 1" ]
   */
  readonly command: string[];

  /**
   * The time period in seconds between each health check execution.
   *
   * You may specify between 5 and 300 seconds.
   *
   * @default Duration.seconds(30)
   */
  readonly interval?: cdk.Duration;

  /**
   * The number of times to retry a failed health check before the container is considered unhealthy.
   *
   * You may specify between 1 and 10 retries.
   *
   * @default 3
   */
  readonly retries?: number;

  /**
   * The optional grace period within which to provide containers time to bootstrap before
   * failed health checks count towards the maximum number of retries.
   *
   * You may specify between 0 and 300 seconds.
   *
   * @default No start period
   */
  readonly startPeriod?: cdk.Duration;

  /**
   * The time period in seconds to wait for a health check to succeed before it is considered a failure.
   *
   * You may specify between 2 and 60 seconds.
   *
   * @default Duration.seconds(5)
   */
  readonly timeout?: cdk.Duration;
}

function renderKV(env: { [key: string]: string }, keyName: string, valueName: string): any[] {
  const ret = [];
  for (const [key, value] of Object.entries(env)) {
    ret.push({ [keyName]: key, [valueName]: value });
  }
  return ret;
}

function renderEnvironmentFiles(partition: string, environmentFiles: EnvironmentFileConfig[]): any[] {
  const ret = [];
  for (const environmentFile of environmentFiles) {
    const s3Location = environmentFile.s3Location;

    if (!s3Location) {
      throw Error('Environment file must specify an S3 location');
    }

    ret.push({
      type: environmentFile.fileType,
      value: `arn:${partition}:s3:::${s3Location.bucketName}/${s3Location.objectKey}`,
    });
  }
  return ret;
}

function renderHealthCheck(hc: HealthCheck): CfnTaskDefinition.HealthCheckProperty {
  if (hc.interval?.toSeconds() !== undefined) {
    if (5 > hc.interval?.toSeconds() || hc.interval?.toSeconds() > 300) {
      throw new Error('Interval must be between 5 seconds and 300 seconds.');
    }
  }

  if (hc.timeout?.toSeconds() !== undefined) {
    if (2 > hc.timeout?.toSeconds() || hc.timeout?.toSeconds() > 120) {
      throw new Error('Timeout must be between 2 seconds and 120 seconds.');
    }
  }
  if (hc.interval?.toSeconds() !== undefined && hc.timeout?.toSeconds() !== undefined) {
    if (hc.interval?.toSeconds() < hc.timeout?.toSeconds()) {
      throw new Error('Health check interval should be longer than timeout.');
    }
  }

  return {
    command: getHealthCheckCommand(hc),
    interval: hc.interval?.toSeconds() ?? 30,
    retries: hc.retries ?? 3,
    startPeriod: hc.startPeriod?.toSeconds(),
    timeout: hc.timeout?.toSeconds() ?? 5,
  };
}

function getHealthCheckCommand(hc: HealthCheck): string[] {
  const cmd = hc.command;
  const hcCommand = new Array<string>();

  if (cmd.length === 0) {
    throw new Error('At least one argument must be supplied for health check command.');
  }

  if (cmd.length === 1) {
    hcCommand.push('CMD-SHELL', cmd[0]);
    return hcCommand;
  }

  if (cmd[0] !== 'CMD' && cmd[0] !== 'CMD-SHELL') {
    hcCommand.push('CMD');
  }

  return hcCommand.concat(cmd);
}

function renderResourceRequirements(gpuCount: number = 0, inferenceAcceleratorResources: string[] = []):
CfnTaskDefinition.ResourceRequirementProperty[] | undefined {
  const ret = [];
  for (const resource of inferenceAcceleratorResources) {
    ret.push({
      type: 'InferenceAccelerator',
      value: resource,
    });
  }
  if (gpuCount > 0) {
    ret.push({
      type: 'GPU',
      value: gpuCount.toString(),
    });
  }
  return ret;
}

/**
 * The ulimit settings to pass to the container.
 *
 * NOTE: Does not work for Windows containers.
 */
export interface Ulimit {
  /**
   * The type of the ulimit.
   *
   * For more information, see [UlimitName](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-ecs/ulimitname.html#aws_ecs_UlimitName).
   */
  readonly name: UlimitName,

  /**
   * The soft limit for the ulimit type.
   */
  readonly softLimit: number,

  /**
   * The hard limit for the ulimit type.
   */
  readonly hardLimit: number,
}

/**
 * Type of resource to set a limit on
 */
export enum UlimitName {
  CORE = 'core',
  CPU = 'cpu',
  DATA = 'data',
  FSIZE = 'fsize',
  LOCKS = 'locks',
  MEMLOCK = 'memlock',
  MSGQUEUE = 'msgqueue',
  NICE = 'nice',
  NOFILE = 'nofile',
  NPROC = 'nproc',
  RSS = 'rss',
  RTPRIO = 'rtprio',
  RTTIME = 'rttime',
  SIGPENDING = 'sigpending',
  STACK = 'stack'
}

function renderUlimit(ulimit: Ulimit): CfnTaskDefinition.UlimitProperty {
  return {
    name: ulimit.name,
    softLimit: ulimit.softLimit,
    hardLimit: ulimit.hardLimit,
  };
}
/**
 * The details of a dependency on another container in the task definition.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDependency.html
 */
export interface ContainerDependency {
  /**
   * The container to depend on.
   */
  readonly container: ContainerDefinition;

  /**
   * The state the container needs to be in to satisfy the dependency and proceed with startup.
   * Valid values are ContainerDependencyCondition.START, ContainerDependencyCondition.COMPLETE,
   * ContainerDependencyCondition.SUCCESS and ContainerDependencyCondition.HEALTHY.
   *
   * @default ContainerDependencyCondition.HEALTHY
   */
  readonly condition?: ContainerDependencyCondition;
}

export enum ContainerDependencyCondition {
  /**
   * This condition emulates the behavior of links and volumes today.
   * It validates that a dependent container is started before permitting other containers to start.
   */
  START = 'START',

  /**
   * This condition validates that a dependent container runs to completion (exits) before permitting other containers to start.
   * This can be useful for nonessential containers that run a script and then exit.
   */
  COMPLETE = 'COMPLETE',

  /**
   * This condition is the same as COMPLETE, but it also requires that the container exits with a zero status.
   */
  SUCCESS = 'SUCCESS',

  /**
   * This condition validates that the dependent container passes its Docker health check before permitting other containers to start.
   * This requires that the dependent container has health checks configured. This condition is confirmed only at task startup.
   */
  HEALTHY = 'HEALTHY',
}

function renderContainerDependency(containerDependency: ContainerDependency): CfnTaskDefinition.ContainerDependencyProperty {
  return {
    containerName: containerDependency.container.containerName,
    condition: containerDependency.condition || ContainerDependencyCondition.HEALTHY,
  };
}

/**
 * Port mappings allow containers to access ports on the host container instance to send or receive traffic.
 */
export interface PortMapping {
  /**
   * The port number on the container that is bound to the user-specified or automatically assigned host port.
   *
   * If you are using containers in a task with the awsvpc or host network mode, exposed ports should be specified using containerPort.
   * If you are using containers in a task with the bridge network mode and you specify a container port and not a host port,
   * your container automatically receives a host port in the ephemeral port range.
   *
   * For more information, see hostPort.
   * Port mappings that are automatically assigned in this way do not count toward the 100 reserved ports limit of a container instance.
   */
  readonly containerPort: number;

  /**
   * The port number on the container instance to reserve for your container.
   *
   * If you are using containers in a task with the awsvpc or host network mode,
   * the hostPort can either be left blank or set to the same value as the containerPort.
   *
   * If you are using containers in a task with the bridge network mode,
   * you can specify a non-reserved host port for your container port mapping, or
   * you can omit the hostPort (or set it to 0) while specifying a containerPort and
   * your container automatically receives a port in the ephemeral port range for
   * your container instance operating system and Docker version.
   */
  readonly hostPort?: number;

  /**
   * The protocol used for the port mapping. Valid values are Protocol.TCP and Protocol.UDP.
   *
   * @default TCP
   */
  readonly protocol?: Protocol;

  /**
   * The name to give the port mapping.
   *
   * Name is required in order to use the port mapping with ECS Service Connect.
   * This field may only be set when the task definition uses Bridge or Awsvpc network modes.
   *
   * @default - no port mapping name
   */
  readonly name?: string;

  /**
   * The protocol used by Service Connect. Valid values are AppProtocol.http, AppProtocol.http2, and
   * AppProtocol.grpc. The protocol determines what telemetry will be shown in the ECS Console for
   * Service Connect services using this port mapping.
   *
   * This field may only be set when the task definition uses Bridge or Awsvpc network modes.
   *
   * @default - no app protocol
   */
  readonly appProtocol?: AppProtocol;
}

/**
 * PortMap ValueObjectClass having by ContainerDefinition
 */
export class PortMap {

  /**
   * The networking mode to use for the containers in the task.
   */
  readonly networkmode: NetworkMode;

  /**
   * Port mappings allow containers to access ports on the host container instance to send or receive traffic.
   */
  readonly portmapping: PortMapping;

  constructor(networkmode: NetworkMode, pm: PortMapping) {
    this.networkmode = networkmode;
    this.portmapping = pm;
  }

  /**
   * validate invalid portmapping and networkmode parameters.
   * throw Error when invalid parameters.
   */
  public validate(): void {
    if (!this.isvalidPortName()) {
      throw new Error('Port mapping name cannot be an empty string.');
    }
    if (!this.isValidPorts()) {
      const pm = this.portmapping;
      throw new Error(`Host port (${pm.hostPort}) must be left out or equal to container port ${pm.containerPort} for network mode ${this.networkmode}`);
    }
  }

  private isvalidPortName(): boolean {
    if (this.portmapping.name === '') {
      return false;
    }
    return true;
  }

  private isValidPorts() :boolean {
    const isAwsVpcMode = this.networkmode == NetworkMode.AWS_VPC;
    const isHostMode = this.networkmode == NetworkMode.HOST;
    if (!isAwsVpcMode && !isHostMode) return true;
    const hostPort = this.portmapping.hostPort;
    const containerPort = this.portmapping.containerPort;
    if (containerPort !== hostPort && hostPort !== undefined ) return false;
    return true;
  }

}


/**
 * ServiceConnect ValueObjectClass having by ContainerDefinition
 */
export class ServiceConnect {
  /**
   * Port mappings allow containers to access ports on the host container instance to send or receive traffic.
   */
  readonly portmapping: PortMapping;

  /**
   * The networking mode to use for the containers in the task.
   */
  readonly networkmode: NetworkMode;

  constructor(networkmode: NetworkMode, pm: PortMapping) {
    this.portmapping = pm;
    this.networkmode = networkmode;
  }

  /**
   * Judge parameters can be serviceconnect logick.
   * If parameters can be serviceConnect return true.
   */
  public isServiceConnect() :boolean {
    const hasPortname = this.portmapping.name;
    const hasAppProtcol = this.portmapping.appProtocol;
    if (hasPortname || hasAppProtcol) return true;
    return false;
  }

  /**
   * Judge serviceconnect parametes are valid.
   * If invalid, throw Error.
   */
  public validate() :void {
    if (!this.isValidNetworkmode()) {
      throw new Error(`Service connect related port mapping fields 'name' and 'appProtocol' are not supported for network mode ${this.networkmode}`);
    }
    if (!this.isValidPortName()) {
      throw new Error('Service connect-related port mapping field \'appProtocol\' cannot be set without \'name\'');
    }
  }

  private isValidNetworkmode() :boolean {
    const isAwsVpcMode = this.networkmode == NetworkMode.AWS_VPC;
    const isBridgeMode = this.networkmode == NetworkMode.BRIDGE;
    if (isAwsVpcMode || isBridgeMode) return true;
    return false;
  }

  private isValidPortName() :boolean {
    if (!this.portmapping.name) return false;
    return true;
  }
}

/**
 * Network protocol
 */
export enum Protocol {
  /**
   * TCP
   */
  TCP = 'tcp',

  /**
   * UDP
   */
  UDP = 'udp',
}


/**
 * Service connect app protocol.
 */
export class AppProtocol {
  /**
   * HTTP app protocol.
   */
  public static http = new AppProtocol('http');
  /**
   * HTTP2 app protocol.
   */
  public static http2 = new AppProtocol('http2');
  /**
   * GRPC app protocol.
   */
  public static grpc = new AppProtocol('grpc');

  /**
   * Custom value.
   */
  public readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }
}

function renderPortMapping(pm: PortMapping): CfnTaskDefinition.PortMappingProperty {
  return {
    containerPort: pm.containerPort,
    hostPort: pm.hostPort,
    protocol: pm.protocol || Protocol.TCP,
    appProtocol: pm.appProtocol?.value,
    name: pm.name ? pm.name : undefined,
  };
}

/**
 * The temporary disk space mounted to the container.
 */
export interface ScratchSpace {
  /**
   * The path on the container to mount the scratch volume at.
   */
  readonly containerPath: string,
  /**
   * Specifies whether to give the container read-only access to the scratch volume.
   *
   * If this value is true, the container has read-only access to the scratch volume.
   * If this value is false, then the container can write to the scratch volume.
   */
  readonly readOnly: boolean,
  readonly sourcePath: string,
  /**
   * The name of the scratch volume to mount. Must be a volume name referenced in the name parameter of task definition volume.
   */
  readonly name: string,
}

/**
 * The details of data volume mount points for a container.
 */
export interface MountPoint {
  /**
   * The path on the container to mount the host volume at.
   */
  readonly containerPath: string,
  /**
   * Specifies whether to give the container read-only access to the volume.
   *
   * If this value is true, the container has read-only access to the volume.
   * If this value is false, then the container can write to the volume.
   */
  readonly readOnly: boolean,
  /**
   * The name of the volume to mount.
   *
   * Must be a volume name referenced in the name parameter of task definition volume.
   */
  readonly sourceVolume: string,
}

function renderMountPoint(mp: MountPoint): CfnTaskDefinition.MountPointProperty {
  return {
    containerPath: mp.containerPath,
    readOnly: mp.readOnly,
    sourceVolume: mp.sourceVolume,
  };
}

/**
 * The details on a data volume from another container in the same task definition.
 */
export interface VolumeFrom {
  /**
   * The name of another container within the same task definition from which to mount volumes.
   */
  readonly sourceContainer: string,

  /**
   * Specifies whether the container has read-only access to the volume.
   *
   * If this value is true, the container has read-only access to the volume.
   * If this value is false, then the container can write to the volume.
   */
  readonly readOnly: boolean,
}

function renderVolumeFrom(vf: VolumeFrom): CfnTaskDefinition.VolumeFromProperty {
  return {
    sourceContainer: vf.sourceContainer,
    readOnly: vf.readOnly,
  };
}

/**
 * Kernel parameters to set in the container
 */
export interface SystemControl {
  /**
   * The namespaced kernel parameter for which to set a value.
   */
  readonly namespace: string;

  /**
   * The value for the namespaced kernel parameter specified in namespace.
   */
  readonly value: string;
}

function renderSystemControls(systemControls: SystemControl[]): CfnTaskDefinition.SystemControlProperty[] {
  return systemControls.map(sc => ({
    namespace: sc.namespace,
    value: sc.value,
  }));
}

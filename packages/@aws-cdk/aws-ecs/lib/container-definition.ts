import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { NetworkMode, TaskDefinition } from './base/task-definition';
import { ContainerImage, ContainerImageConfig } from './container-image';
import { CfnTaskDefinition } from './ecs.generated';
import { LinuxParameters } from './linux-parameters';
import { LogDriver, LogDriverConfig } from './log-drivers/log-driver';

export interface ContainerDefinitionOptions {
  /**
   * The image to use for a container.
   *
   * You can use images in the Docker Hub registry or specify other
   * repositories (repository-url/image:tag).
   * TODO: Update these to specify using classes of IContainerImage
   */
  readonly image: ContainerImage;

  /**
   * The CMD value to pass to the container.
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
   * Indicates whether networking is disabled within the container.
   *
   * @default false
   */
  readonly disableNetworking?: boolean;

  /**
   * A list of DNS search domains that are provided to the container.
   *
   * @default - No search domains.
   */
  readonly dnsSearchDomains?: string[];

  /**
   * A list of DNS servers that Amazon ECS provides to the container.
   *
   * @default - Default DNS servers.
   */
  readonly dnsServers?: string[];

  /**
   * A key-value map of labels for the container.
   *
   * @default - No labels.
   */
  readonly dockerLabels?: { [key: string]: string };

  /**
   * A list of custom labels for SELinux and AppArmor multi-level security systems.
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
   * Indicates whether the task stops if this container fails.
   *
   * If you specify true and the container fails, all other containers in the
   * task stop. If you specify false and the container fails, none of the other
   * containers in the task is affected.
   *
   * You must have at least one essential container in a task.
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
   * Container health check.
   *
   * @default - Health check configuration from container.
   */
  readonly healthCheck?: HealthCheck;

  /**
   * The name that Docker uses for the container hostname.
   *
   * @default - Automatic hostname.
   */
  readonly hostname?: string;

  /**
   * The hard limit (in MiB) of memory to present to the container.
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
   * When system memory is under contention, Docker attempts to keep the
   * container memory within the limit. If the container requires more memory,
   * it can consume up to the value specified by the Memory property or all of
   * the available memory on the container instance—whichever comes first.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory reserved.
   */
  readonly memoryReservationMiB?: number;

  /**
   * Indicates whether the container is given full access to the host container instance.
   *
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * Indicates whether the container's root file system is mounted as read only.
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
   * The working directory in the container to run commands in.
   *
   * @default /
   */
  readonly workingDirectory?: string;

  /**
   * Configures a custom log driver for the container.
   *
   * @default - Containers use the same logging driver that the Docker daemon uses.
   */
  readonly logging?: LogDriver;

  /**
   * Configures Linux Parameters
   *
   * @default - No Linux paramters.
   */
  readonly linuxParameters?: LinuxParameters;
}

/**
 * Properties of a container definition
 */
export interface ContainerDefinitionProps extends ContainerDefinitionOptions {
  /**
   * The task this container definition belongs to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: TaskDefinition;
}

/**
 * A definition for a single container in a Task
 */
export class ContainerDefinition extends cdk.Construct {
  /**
   * Access Linux Parameters
   */
  public readonly linuxParameters?: LinuxParameters;

  /**
   * The configured mount points
   */
  public readonly mountPoints = new Array<MountPoint>();

  /**
   * The configured port mappings
   */
  public readonly portMappings = new Array<PortMapping>();

  /**
   * The configured volumes
   */
  public readonly volumesFrom = new Array<VolumeFrom>();

  /**
   * The configured ulimits
   */
  public readonly ulimits = new Array<Ulimit>();

  /**
   * Whether or not this container is essential
   */
  public readonly essential: boolean;

  /**
   * Whether there was at least one memory limit specified in this definition
   */
  public readonly memoryLimitSpecified: boolean;

  /**
   * The task definition this container definition is part of
   */
  public readonly taskDefinition: TaskDefinition;

  /**
   * The configured container links
   */
  private readonly links = new Array<string>();

  private readonly imageConfig: ContainerImageConfig;

  private readonly logDriverConfig?: LogDriverConfig;

  constructor(scope: cdk.Construct, id: string, private readonly props: ContainerDefinitionProps) {
    super(scope, id);
    this.essential = props.essential !== undefined ? props.essential : true;
    this.taskDefinition = props.taskDefinition;
    this.memoryLimitSpecified = props.memoryLimitMiB !== undefined || props.memoryReservationMiB !== undefined;
    this.linuxParameters = props.linuxParameters;

    this.imageConfig = props.image.bind(this, this);
    if (props.logging) {
      this.logDriverConfig = props.logging.bind(this, this);
    }
    props.taskDefinition._linkContainer(this);
  }

  /**
   * Add a link from this container to a different container
   * The link parameter allows containers to communicate with each other without the need for port mappings.
   * Only supported if the network mode of a task definition is set to bridge.
   * Warning: The --link flag is a legacy feature of Docker. It may eventually be removed.
   */
  public addLink(container: ContainerDefinition, alias?: string) {
    if (this.taskDefinition.networkMode !== NetworkMode.BRIDGE) {
      throw new Error(`You must use network mode Bridge to add container links.`);
    }
    if (alias !== undefined) {
      this.links.push(`${container.node.id}:${alias}`);
    } else {
      this.links.push(`${container.node.id}`);
    }
  }

  /**
   * Add one or more mount points to this container.
   */
  public addMountPoints(...mountPoints: MountPoint[]) {
    this.mountPoints.push(...mountPoints);
  }

  /**
   * Mount temporary disc space to a container.
   * This adds the correct container mountPoint and task definition volume.
   */
  public addScratch(scratch: ScratchSpace) {
    const mountPoint = {
      containerPath: scratch.containerPath,
      readOnly: scratch.readOnly,
      sourceVolume: scratch.name
    };

    const volume = {
      host: {
        sourcePath: scratch.sourcePath
      },
      name: scratch.name
    };

    this.taskDefinition.addVolume(volume);
    this.addMountPoints(mountPoint);
  }

  /**
   * Add one or more port mappings to this container
   */
  public addPortMappings(...portMappings: PortMapping[]) {
    this.portMappings.push(...portMappings.map(pm => {
      if (this.taskDefinition.networkMode === NetworkMode.AWS_VPC || this.taskDefinition.networkMode === NetworkMode.HOST) {
        if (pm.containerPort !== pm.hostPort && pm.hostPort !== undefined) {
          throw new Error(`Host port ${pm.hostPort} does not match container port ${pm.containerPort}.`);
        }
      }

      if (this.taskDefinition.networkMode === NetworkMode.BRIDGE) {
        if (pm.hostPort === undefined) {
          pm = {
            ...pm,
            hostPort: 0
          };
        }
      }

      return pm;
    }));
  }

  /**
   * Add one or more ulimits to this container
   */
  public addUlimits(...ulimits: Ulimit[]) {
    this.ulimits.push(...ulimits);
  }

  /**
   * Add one or more volumes to this container
   */
  public addVolumesFrom(...volumesFrom: VolumeFrom[]) {
    this.volumesFrom.push(...volumesFrom);
  }

  /**
   * Add a statement to the Task Definition's Execution policy
   */
  public addToExecutionPolicy(statement: iam.PolicyStatement) {
    this.taskDefinition.addToExecutionRolePolicy(statement);
  }

  /**
   * Ingress Port is needed to set the security group ingress for the task/service
   */
  public get ingressPort(): number {
    if (this.portMappings.length === 0) {
      throw new Error(`Container ${this.node.id} hasn't defined any ports. Call addPortMappings().`);
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
   * Return the port that the container will be listening on by default
   */
  public get containerPort(): number {
    if (this.portMappings.length === 0) {
      throw new Error(`Container ${this.node.id} hasn't defined any ports. Call addPortMappings().`);
    }
    const defaultPortMapping = this.portMappings[0];
    return defaultPortMapping.containerPort;
  }

  /**
   * Render this container definition to a CloudFormation object
   */
  public renderContainerDefinition(): CfnTaskDefinition.ContainerDefinitionProperty {
    return {
      command: this.props.command,
      cpu: this.props.cpu,
      disableNetworking: this.props.disableNetworking,
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
      mountPoints: this.mountPoints.map(renderMountPoint),
      name: this.node.id,
      portMappings: this.portMappings.map(renderPortMapping),
      privileged: this.props.privileged,
      readonlyRootFilesystem: this.props.readonlyRootFilesystem,
      repositoryCredentials: this.imageConfig.repositoryCredentials,
      ulimits: this.ulimits.map(renderUlimit),
      user: this.props.user,
      volumesFrom: this.volumesFrom.map(renderVolumeFrom),
      workingDirectory: this.props.workingDirectory,
      logConfiguration: this.logDriverConfig,
      environment: this.props.environment && renderKV(this.props.environment, 'name', 'value'),
      extraHosts: this.props.extraHosts && renderKV(this.props.extraHosts, 'hostname', 'ipAddress'),
      healthCheck: this.props.healthCheck && renderHealthCheck(this.props.healthCheck),
      links: this.links,
      linuxParameters: this.linuxParameters && this.linuxParameters.renderLinuxParameters(),
    };
  }
}

/**
 * Container health check configuration
 */
export interface HealthCheck {
  /**
   * Command to run, as the binary path and arguments.
   *
   * If you provide a shell command as a single string, you have to quote command-line arguments.
   */
  readonly command: string[];

  /**
   * Time period in seconds between each health check execution.
   *
   * You may specify between 5 and 300 seconds.
   *
   * @default Duration.seconds(30)
   */
  readonly interval?: cdk.Duration;

  /**
   * Number of times to retry a failed health check before the container is considered unhealthy.
   *
   * You may specify between 1 and 10 retries.
   *
   * @default 3
   */
  readonly retries?: number;

  /**
   * Grace period after startup before failed health checks count.
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

function renderKV(env: { [key: string]: string }, keyName: string, valueName: string): any {
  const ret = [];
  for (const [key, value] of Object.entries(env)) {
    ret.push({ [keyName]: key, [valueName]: value });
  }
  return ret;
}

function renderHealthCheck(hc: HealthCheck): CfnTaskDefinition.HealthCheckProperty {
  return {
    command: getHealthCheckCommand(hc),
    interval: hc.interval != null ? hc.interval.toSeconds() : 30,
    retries: hc.retries !== undefined ? hc.retries : 3,
    startPeriod: hc.startPeriod && hc.startPeriod.toSeconds(),
    timeout: hc.timeout !== undefined ? hc.timeout.toSeconds() : 5,
  };
}

function getHealthCheckCommand(hc: HealthCheck): string[] {
  const cmd = hc.command;
  const hcCommand = new Array<string>();

  if (cmd.length === 0) {
    throw new Error(`At least one argument must be supplied for health check command.`);
  }

  if (cmd.length === 1) {
    hcCommand.push('CMD-SHELL', cmd[0]);
    return hcCommand;
  }

  if (cmd[0] !== "CMD" && cmd[0] !== 'CMD-SHELL') {
    hcCommand.push('CMD');
  }

  return hcCommand.concat(cmd);
}

/**
 * Container ulimits.
 *
 * Correspond to ulimits options on docker run.
 *
 * NOTE: Does not work for Windows containers.
 */
export interface Ulimit {
  /**
   * What resource to enforce a limit on
   */
  readonly name: UlimitName,

  /**
   * Soft limit of the resource
   */
  readonly softLimit: number,

  /**
   * Hard limit of the resource
   */
  readonly hardLimit: number,
}

/**
 * Type of resource to set a limit on
 */
export enum UlimitName {
  CORE = "core",
  CPU = "cpu",
  DATA = "data",
  FSIZE = "fsize",
  LOCKS = "locks",
  MEMLOCK = "memlock",
  MSGQUEUE = "msgqueue",
  NICE = "nice",
  NOFILE = "nofile",
  NPROC = "nproc",
  RSS = "rss",
  RTPRIO = "rtprio",
  RTTIME = "rttime",
  SIGPENDING = "sigpending",
  STACK = "stack"
}

function renderUlimit(ulimit: Ulimit): CfnTaskDefinition.UlimitProperty {
  return {
    name: ulimit.name,
    softLimit: ulimit.softLimit,
    hardLimit: ulimit.hardLimit,
  };
}

/**
 * Map a host port to a container port
 */
export interface PortMapping {
  /**
   * Port inside the container
   */
  readonly containerPort: number;

  /**
   * Port on the host
   *
   * In AwsVpc or Host networking mode, leave this out or set it to the
   * same value as containerPort.
   *
   * In Bridge networking mode, leave this out or set it to non-reserved
   * non-ephemeral port.
   */
  readonly hostPort?: number;

  /**
   * Protocol
   *
   * @default Tcp
   */
  readonly protocol?: Protocol
}

/**
 * Network protocol
 */
export enum Protocol {
  /**
   * TCP
   */
  TCP = "tcp",

  /**
   * UDP
   */
  UDP = "udp",
}

function renderPortMapping(pm: PortMapping): CfnTaskDefinition.PortMappingProperty {
  return {
    containerPort: pm.containerPort,
    hostPort: pm.hostPort,
    protocol: pm.protocol || Protocol.TCP,
  };
}

export interface ScratchSpace {
  readonly containerPath: string,
  readonly readOnly: boolean,
  readonly sourcePath: string
  readonly name: string,
}

export interface MountPoint {
  readonly containerPath: string,
  readonly readOnly: boolean,
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
 * A volume from another container
 */
export interface VolumeFrom {
  /**
   * Name of the source container
   */
  readonly sourceContainer: string,

  /**
   * Whether the volume is read only
   */
  readonly readOnly: boolean,
}

function renderVolumeFrom(vf: VolumeFrom): CfnTaskDefinition.VolumeFromProperty {
  return {
    sourceContainer: vf.sourceContainer,
    readOnly: vf.readOnly,
  };
}

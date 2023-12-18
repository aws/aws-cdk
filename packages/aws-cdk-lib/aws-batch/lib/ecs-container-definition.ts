import { Construct, IConstruct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { LinuxParameters } from './linux-parameters';
import * as ecs from '../../aws-ecs';
import { IFileSystem } from '../../aws-efs';
import * as iam from '../../aws-iam';
import { LogGroup } from '../../aws-logs';
import * as secretsmanager from '../../aws-secretsmanager';
import * as ssm from '../../aws-ssm';
import { Lazy, PhysicalName, Size } from '../../core';

const EFS_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/container-definition.EfsVolume');
const HOST_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/container-definition.HostVolume');

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

/**
 * Options to configure an EcsVolume
 */
export interface EcsVolumeOptions {
  /**
   * the name of this volume
   */
  readonly name: string;

  /**
   * the path on the container where this volume is mounted
   */
  readonly containerPath: string;

  /**
   * if set, the container will have readonly access to the volume
   *
   * @default false
   */
  readonly readonly?: boolean;
}

/**
 * Represents a Volume that can be mounted to a container that uses ECS
 */
export abstract class EcsVolume {
  /**
   * Creates a Volume that uses an AWS Elastic File System (EFS); this volume can grow and shrink as needed
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html
   */
  static efs(options: EfsVolumeOptions) {
    return new EfsVolume(options);
  }

  /**
   * Creates a Host volume. This volume will persist on the host at the specified `hostPath`.
   * If the `hostPath` is not specified, Docker will choose the host path. In this case,
   * the data may not persist after the containers that use it stop running.
   */
  static host(options: HostVolumeOptions) {
    return new HostVolume(options);
  }

  /**
   * The name of this volume
   */
  public readonly name: string;

  /**
   * The path on the container that this volume will be mounted to
   */
  public readonly containerPath: string;

  /**
   * Whether or not the container has readonly access to this volume
   *
   * @default false
   */
  public readonly readonly?: boolean;

  constructor(options: EcsVolumeOptions) {
    this.name = options.name;
    this.containerPath = options.containerPath;
    this.readonly = options.readonly;
  }
}

/**
 * Options for configuring an EfsVolume
 */
export interface EfsVolumeOptions extends EcsVolumeOptions {
  /**
   * The EFS File System that supports this volume
   */
  readonly fileSystem: IFileSystem;

  /**
   * The directory within the Amazon EFS file system to mount as the root directory inside the host.
   * If this parameter is omitted, the root of the Amazon EFS volume is used instead.
   * Specifying `/` has the same effect as omitting this parameter.
   * The maximum length is 4,096 characters.
   *
   * @default - root of the EFS File System
   */
  readonly rootDirectory?: string;

  /**
   * Enables encryption for Amazon EFS data in transit between the Amazon ECS host and the Amazon EFS server
   *
   * @see https://docs.aws.amazon.com/efs/latest/ug/encryption-in-transit.html
   *
   * @default false
   */
  readonly enableTransitEncryption?: boolean;

  /**
   * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server.
   * The value must be between 0 and 65,535.
   *
   * @see https://docs.aws.amazon.com/efs/latest/ug/efs-mount-helper.html
   *
   * @default - chosen by the EFS Mount Helper
   */
  readonly transitEncryptionPort?: number;

  /**
   * The Amazon EFS access point ID to use.
   * If an access point is specified, `rootDirectory` must either be omitted or set to `/`
   * which enforces the path set on the EFS access point.
   * If an access point is used, `enableTransitEncryption` must be `true`.
   *
   * @see https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html
   *
   * @default - no accessPointId
   */
  readonly accessPointId?: string;

  /**
   * Whether or not to use the AWS Batch job IAM role defined in a job definition when mounting the Amazon EFS file system.
   * If specified, `enableTransitEncryption` must be `true`.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html#efs-volume-accesspoints
   *
   * @default false
   */
  readonly useJobRole?: boolean;
}

/**
 * A Volume that uses an AWS Elastic File System (EFS); this volume can grow and shrink as needed
 */
export class EfsVolume extends EcsVolume {
  /**
   * Returns true if x is an EfsVolume, false otherwise
   */
  public static isEfsVolume(x: any) : x is EfsVolume {
    return x !== null && typeof(x) === 'object' && EFS_VOLUME_SYMBOL in x;
  }

  /**
   * The EFS File System that supports this volume
   */
  public readonly fileSystem: IFileSystem;

  /**
   * The directory within the Amazon EFS file system to mount as the root directory inside the host.
   * If this parameter is omitted, the root of the Amazon EFS volume is used instead.
   * Specifying `/` has the same effect as omitting this parameter.
   * The maximum length is 4,096 characters.
   *
   * @default - root of the EFS File System
   */
  public readonly rootDirectory?: string;

  /**
   * Enables encryption for Amazon EFS data in transit between the Amazon ECS host and the Amazon EFS server
   *
   * @see https://docs.aws.amazon.com/efs/latest/ug/encryption-in-transit.html
   *
   * @default false
   */
  public readonly enableTransitEncryption?: boolean;

  /**
   * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server.
   * The value must be between 0 and 65,535.
   *
   * @see https://docs.aws.amazon.com/efs/latest/ug/efs-mount-helper.html
   *
   * @default - chosen by the EFS Mount Helper
   */
  public readonly transitEncryptionPort?: number;

  /**
   * The Amazon EFS access point ID to use.
   * If an access point is specified, `rootDirectory` must either be omitted or set to `/`
   * which enforces the path set on the EFS access point.
   * If an access point is used, `enableTransitEncryption` must be `true`.
   *
   * @see https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html
   *
   * @default - no accessPointId
   */
  public readonly accessPointId?: string;

  /**
   * Whether or not to use the AWS Batch job IAM role defined in a job definition when mounting the Amazon EFS file system.
   * If specified, `enableTransitEncryption` must be `true`.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html#efs-volume-accesspoints
   *
   * @default false
   */
  public readonly useJobRole?: boolean;

  constructor(options: EfsVolumeOptions) {
    super(options);

    this.fileSystem = options.fileSystem;
    this.rootDirectory = options.rootDirectory;
    this.enableTransitEncryption = options.enableTransitEncryption;
    this.transitEncryptionPort = options.transitEncryptionPort;
    this.accessPointId = options.accessPointId;
    this.useJobRole = options.useJobRole;
  }
}

Object.defineProperty(EfsVolume.prototype, EFS_VOLUME_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});

/**
 * Options for configuring an ECS HostVolume
 */
export interface HostVolumeOptions extends EcsVolumeOptions {
  /**
   * The path on the host machine this container will have access to
   *
   * @default - Docker will choose the host path.
   * The data may not persist after the containers that use it stop running.
   */
  readonly hostPath?: string;
}

/**
 * Creates a Host volume. This volume will persist on the host at the specified `hostPath`.
 * If the `hostPath` is not specified, Docker will choose the host path. In this case,
 * the data may not persist after the containers that use it stop running.
 */
export class HostVolume extends EcsVolume {
  /**
   * returns `true` if `x` is a `HostVolume`, `false` otherwise
   */
  public static isHostVolume(x: any): x is HostVolume {
    return x !== null && typeof (x) === 'object' && HOST_VOLUME_SYMBOL in x;
  }

  /**
   * The path on the host machine this container will have access to
   */
  public readonly hostPath?: string;

  constructor(options: HostVolumeOptions) {
    super(options);
    this.hostPath = options.hostPath;
  }
}

Object.defineProperty(HostVolume.prototype, HOST_VOLUME_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});

/**
 * A container that can be run with ECS orchestration
 */
export interface IEcsContainerDefinition extends IConstruct {
  /**
   * The image that this container will run
   */
  readonly image: ecs.ContainerImage;

  /**
   * The number of vCPUs reserved for the container.
   * Each vCPU is equivalent to 1,024 CPU shares.
   * For containers running on EC2 resources, you must specify at least one vCPU.
   */
  readonly cpu: number;

  /**
   * The memory hard limit present to the container.
   * If your container attempts to exceed the memory specified, the container is terminated.
   * You must specify at least 4 MiB of memory for a job.
   */
  readonly memory: Size;

  /**
   * The command that's passed to the container
   *
   * @see https://docs.docker.com/engine/reference/builder/#cmd
   */
  readonly command?: string[];

  /**
   * The environment variables to pass to a container.
   * Cannot start with `AWS_BATCH`.
   * We don't recommend using plaintext environment variables for sensitive information, such as credential data.
   *
   * @default - no environment variables
   */
  readonly environment?: { [key:string]: string };

  /**
   * The role used by Amazon ECS container and AWS Fargate agents to make AWS API calls on your behalf.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html
   */
  readonly executionRole: iam.IRole;

  /**
   * The role that the container can assume.
   *
   * @default - no jobRole
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
   */
  readonly jobRole?: iam.IRole;

  /**
   * Linux-specific modifications that are applied to the container, such as details for device mappings.
   *
   * @default none
   */
  readonly linuxParameters?: LinuxParameters;

  /**
   * The configuration of the log driver
   */
  readonly logDriverConfig?: ecs.LogDriverConfig;

  /**
   * Gives the container readonly access to its root filesystem.
   *
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;

  /**
   * A map from environment variable names to the secrets for the container. Allows your job definitions
   * to reference the secret by the environment variable name defined in this property.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data.html
   *
   * @default - no secrets
   */
  readonly secrets?: { [envVarName: string]: Secret };

  /**
   * The user name to use inside the container
   *
   * @default - no user
   */
  readonly user?: string;

  /**
   * The volumes to mount to this container. Automatically added to the job definition.
   *
   * @default - no volumes
   */
  readonly volumes: EcsVolume[];

  /**
   * Renders this container to CloudFormation
   *
   * @internal
   */
  _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty;

  /**
   * Add a Volume to this container
   */
  addVolume(volume: EcsVolume): void;
}

/**
 * Props to configure an EcsContainerDefinition
 */
export interface EcsContainerDefinitionProps {
  /**
   * The image that this container will run
   */
  readonly image: ecs.ContainerImage;

  /**
   * The number of vCPUs reserved for the container.
   * Each vCPU is equivalent to 1,024 CPU shares.
   * For containers running on EC2 resources, you must specify at least one vCPU.
   */
  readonly cpu: number;

  /**
   * The memory hard limit present to the container.
   * If your container attempts to exceed the memory specified, the container is terminated.
   * You must specify at least 4 MiB of memory for a job.
   */
  readonly memory: Size;

  /**
   * The command that's passed to the container
   *
   * @see https://docs.docker.com/engine/reference/builder/#cmd
   *
   * @default - no command
   */
  readonly command?: string[];

  /**
   * The environment variables to pass to a container.
   * Cannot start with `AWS_BATCH`.
   * We don't recommend using plaintext environment variables for sensitive information, such as credential data.
   *
   * @default - no environment variables
   */
  readonly environment?: { [key:string]: string };

  /**
   * The role used by Amazon ECS container and AWS Fargate agents to make AWS API calls on your behalf.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html
   *
   * @default - a Role will be created
   */
  readonly executionRole?: iam.IRole;

  /**
   * The role that the container can assume.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
   *
   * @default - no job role
   */
  readonly jobRole?: iam.IRole;

  /**
   * Linux-specific modifications that are applied to the container, such as details for device mappings.
   *
   * @default none
   */
  readonly linuxParameters?: LinuxParameters;

  /**
   * The loging configuration for this Job
   *
   * @default - the log configuration of the Docker daemon
   */
  readonly logging?: ecs.LogDriver;

  /**
   * Gives the container readonly access to its root filesystem.
   *
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;

  /**
   * A map from environment variable names to the secrets for the container. Allows your job definitions
   * to reference the secret by the environment variable name defined in this property.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data.html
   *
   * @default - no secrets
   */
  readonly secrets?: { [envVarName: string]: Secret };

  /**
   * The user name to use inside the container
   *
   * @default - no user
   */
  readonly user?: string;

  /**
   * The volumes to mount to this container. Automatically added to the job definition.
   *
   * @default - no volumes
   */
  readonly volumes?: EcsVolume[];
}

/**
 * Abstract base class for ECS Containers
 */
abstract class EcsContainerDefinitionBase extends Construct implements IEcsContainerDefinition {
  public readonly image: ecs.ContainerImage;
  public readonly cpu: number;
  public readonly memory: Size;
  public readonly command?: string[];
  public readonly environment?: { [key:string]: string };
  public readonly executionRole: iam.IRole;
  public readonly jobRole?: iam.IRole;
  public readonly linuxParameters?: LinuxParameters;
  public readonly logDriverConfig?: ecs.LogDriverConfig;
  public readonly readonlyRootFilesystem?: boolean;
  public readonly secrets?: { [envVarName: string]: Secret };
  public readonly user?: string;
  public readonly volumes: EcsVolume[];

  private readonly imageConfig: ecs.ContainerImageConfig;

  constructor(scope: Construct, id: string, props: EcsContainerDefinitionProps) {
    super(scope, id);

    this.image = props.image;
    this.cpu = props.cpu;
    this.command = props.command;
    this.environment = props.environment;
    this.executionRole = props.executionRole ?? createExecutionRole(this, 'ExecutionRole', props.logging ? true : false);
    this.jobRole = props.jobRole;
    this.linuxParameters = props.linuxParameters;
    this.memory = props.memory;

    if (props.logging) {
      this.logDriverConfig = props.logging.bind(this, {
        ...this as any,
        // TS!
        taskDefinition: {
          obtainExecutionRole: () => this.executionRole,
        },
      });
    }

    this.readonlyRootFilesystem = props.readonlyRootFilesystem ?? false;
    this.secrets = props.secrets;
    this.user = props.user;
    this.volumes = props.volumes ?? [];

    this.imageConfig = props.image.bind(this, {
      ...this as any,
      taskDefinition: {
        obtainExecutionRole: () => this.executionRole,
      },
    });
  }

  /**
   * @internal
   */
  public _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      image: this.imageConfig.imageName,
      command: this.command,
      environment: Object.keys(this.environment ?? {}).map((envKey) => ({
        name: envKey,
        value: (this.environment ?? {})[envKey],
      })),
      jobRoleArn: this.jobRole?.roleArn,
      executionRoleArn: this.executionRole?.roleArn,
      linuxParameters: this.linuxParameters && this.linuxParameters.renderLinuxParameters(),
      logConfiguration: this.logDriverConfig,
      readonlyRootFilesystem: this.readonlyRootFilesystem,
      resourceRequirements: this._renderResourceRequirements(),
      secrets: this.secrets ? Object.entries(this.secrets).map(([name, secret]) => {
        secret.grantRead(this.executionRole);

        return {
          name,
          valueFrom: secret.arn,
        };
      }) : undefined,
      mountPoints: Lazy.any({
        produce: () => {
          if (this.volumes.length === 0) {
            return undefined;
          }
          return this.volumes.map((volume) => {
            return {
              containerPath: volume.containerPath,
              readOnly: volume.readonly,
              sourceVolume: volume.name,
            };
          });
        },
      }),
      volumes: Lazy.any({
        produce: () => {
          if (this.volumes.length === 0) {
            return undefined;
          }

          return this.volumes.map((volume) => {
            if (EfsVolume.isEfsVolume(volume)) {
              return {
                name: volume.name,
                efsVolumeConfiguration: {
                  fileSystemId: volume.fileSystem.fileSystemId,
                  rootDirectory: volume.rootDirectory,
                  transitEncryption: volume.enableTransitEncryption ? 'ENABLED' : (volume.enableTransitEncryption === false ? 'DISABLED' : undefined),
                  transitEncryptionPort: volume.transitEncryptionPort,
                  authorizationConfig: volume.accessPointId || volume.useJobRole ? {
                    accessPointId: volume.accessPointId,
                    iam: volume.useJobRole ? 'ENABLED' : (volume.useJobRole === false ? 'DISABLED' : undefined),
                  } : undefined,
                },
              };
            } else if (HostVolume.isHostVolume(volume)) {
              return {
                name: volume.name,
                host: {
                  sourcePath: volume.hostPath,
                },
              };
            }

            throw new Error('unsupported Volume encountered');
          });
        },
      }),
      user: this.user,
    };
  }

  public addVolume(volume: EcsVolume): void {
    this.volumes.push(volume);
  }

  /**
   * @internal
   */
  protected _renderResourceRequirements() {
    const resourceRequirements = [];

    resourceRequirements.push({
      type: 'MEMORY',
      value: this.memory.toMebibytes().toString(),
    });

    resourceRequirements.push({
      type: 'VCPU',
      value: this.cpu.toString(),
    });

    return resourceRequirements;
  }
}

/**
 * Sets limits for a resource with `ulimit` on linux systems.
 * Used by the Docker daemon.
 */
export interface Ulimit {
  /**
   * The hard limit for this resource. The container will
   * be terminated if it exceeds this limit.
   */
  readonly hardLimit: number;

  /**
   * The resource to limit
   */
  readonly name: UlimitName;

  /**
   * The reservation for this resource. The container will
   * not be terminated if it exceeds this limit.
   */
  readonly softLimit: number;
}

/**
 * The resources to be limited
 */
export enum UlimitName {
  /**
   * max core dump file size
   */
  CORE = 'core',

  /**
   * max cpu time (seconds) for a process
   */
  CPU = 'cpu',

  /**
   * max data segment size
   */
  DATA = 'data',

  /**
   * max file size
   */
  FSIZE = 'fsize',

  /**
   * max number of file locks
   */
  LOCKS = 'locks',

  /**
   * max locked memory
   */
  MEMLOCK = 'memlock',

  /**
   * max POSIX message queue size
   */
  MSGQUEUE = 'msgqueue',

  /**
   * max nice value for any process this user is running
   */
  NICE = 'nice',

  /**
   * maximum number of open file descriptors
   */
  NOFILE = 'nofile',

  /**
   * maximum number of processes
   */
  NPROC = 'nproc',

  /**
   * size of the process' resident set (in pages)
   */
  RSS = 'rss',

  /**
   * max realtime priority
   */
  RTPRIO = 'rtprio',

  /**
   * timeout for realtime tasks
   */
  RTTIME = 'rttime',

  /**
   * max number of pending signals
   */
  SIGPENDING = 'sigpending',

  /**
   * max stack size (in bytes)
   */
  STACK = 'stack',
}

/**
 * A container orchestrated by ECS that uses EC2 resources
 */
export interface IEcsEc2ContainerDefinition extends IEcsContainerDefinition {
  /**
   * When this parameter is true, the container is given elevated permissions on the host container instance (similar to the root user).
   *
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * Limits to set for the user this docker container will run as
   */
  readonly ulimits: Ulimit[];

  /**
   * The number of physical GPUs to reserve for the container.
   * Make sure that the number of GPUs reserved for all containers in a job doesn't exceed
   * the number of available GPUs on the compute resource that the job is launched on.
   *
   * @default - no gpus
   */
  readonly gpu?: number;

  /**
   * Add a ulimit to this container
   */
  addUlimit(ulimit: Ulimit): void;
}

/**
 * Props to configure an EcsEc2ContainerDefinition
 */
export interface EcsEc2ContainerDefinitionProps extends EcsContainerDefinitionProps {
  /**
   * When this parameter is true, the container is given elevated permissions on the host container instance (similar to the root user).
   *
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * Limits to set for the user this docker container will run as
   *
   * @default - no ulimits
   */
  readonly ulimits?: Ulimit[];

  /**
   * The number of physical GPUs to reserve for the container.
   * Make sure that the number of GPUs reserved for all containers in a job doesn't exceed
   * the number of available GPUs on the compute resource that the job is launched on.
   *
   * @default - no gpus
   */
  readonly gpu?: number;
}

/**
 * A container orchestrated by ECS that uses EC2 resources
 */
export class EcsEc2ContainerDefinition extends EcsContainerDefinitionBase implements IEcsEc2ContainerDefinition {
  public readonly privileged?: boolean;
  public readonly ulimits: Ulimit[];
  public readonly gpu?: number;

  constructor(scope: Construct, id: string, props: EcsEc2ContainerDefinitionProps) {
    super(scope, id, props);
    this.privileged = props.privileged;
    this.ulimits = props.ulimits ?? [];
    this.gpu = props.gpu;
  }

  /**
   * @internal
   */
  public _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      ...super._renderContainerDefinition(),
      ulimits: Lazy.any({
        produce: () => {
          if (this.ulimits.length === 0) {
            return undefined;
          }

          return this.ulimits.map((ulimit) => ({
            hardLimit: ulimit.hardLimit,
            name: ulimit.name,
            softLimit: ulimit.softLimit,
          }));
        },
      }),
      privileged: this.privileged,
      resourceRequirements: this._renderResourceRequirements(),
    };
  };

  /**
   * Add a ulimit to this container
   */
  addUlimit(ulimit: Ulimit): void {
    this.ulimits.push(ulimit);
  }

  /**
   * @internal
   */
  protected _renderResourceRequirements() {
    const resourceRequirements = super._renderResourceRequirements();
    if (this.gpu) {
      resourceRequirements.push({
        type: 'GPU',
        value: this.gpu.toString(),
      });
    }

    return resourceRequirements;
  }
}

/**
 * A container orchestrated by ECS that uses Fargate resources and is orchestrated by ECS
 */
export interface IEcsFargateContainerDefinition extends IEcsContainerDefinition {
  /**
   * Indicates whether the job has a public IP address.
   * For a job that's running on Fargate resources in a private subnet to send outbound traffic to the internet
   * (for example, to pull container images), the private subnet requires a NAT gateway be attached to route requests to the internet.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;

  /**
   * The size for ephemeral storage.
   *
   * @default - 20 GiB
   */
  readonly ephemeralStorageSize?: Size;
}

/**
 * Props to configure an EcsFargateContainerDefinition
 */
export interface EcsFargateContainerDefinitionProps extends EcsContainerDefinitionProps {
  /**
   * Indicates whether the job has a public IP address.
   * For a job that's running on Fargate resources in a private subnet to send outbound traffic to the internet
   * (for example, to pull container images), the private subnet requires a NAT gateway be attached to route requests to the internet.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;

  /**
   * The size for ephemeral storage.
   *
   * @default - 20 GiB
   */
  readonly ephemeralStorageSize?: Size;
}

/**
 * A container orchestrated by ECS that uses Fargate resources
 */
export class EcsFargateContainerDefinition extends EcsContainerDefinitionBase implements IEcsFargateContainerDefinition {
  public readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
  public readonly assignPublicIp?: boolean;
  public readonly ephemeralStorageSize?: Size;

  constructor(scope: Construct, id: string, props: EcsFargateContainerDefinitionProps) {
    super(scope, id, props);
    this.assignPublicIp = props.assignPublicIp;
    this.fargatePlatformVersion = props.fargatePlatformVersion;
    this.ephemeralStorageSize = props.ephemeralStorageSize;

    // validates ephemeralStorageSize is within limits
    if (props.ephemeralStorageSize) {
      if (props.ephemeralStorageSize.toGibibytes() > 200) {
        throw new Error(`ECS Fargate container '${id}' specifies 'ephemeralStorageSize' at ${props.ephemeralStorageSize.toGibibytes()} > 200 GB`);
      } else if (props.ephemeralStorageSize.toGibibytes() < 21) {
        throw new Error(`ECS Fargate container '${id}' specifies 'ephemeralStorageSize' at ${props.ephemeralStorageSize.toGibibytes()} < 21 GB`);
      }
    }
  }

  /**
   * @internal
   */
  public _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      ...super._renderContainerDefinition(),
      ephemeralStorage: this.ephemeralStorageSize? {
        sizeInGiB: this.ephemeralStorageSize?.toGibibytes(),
      } : undefined,
      fargatePlatformConfiguration: {
        platformVersion: this.fargatePlatformVersion?.toString(),
      },
      networkConfiguration: {
        assignPublicIp: this.assignPublicIp ? 'ENABLED' : 'DISABLED',
      },
    };
  };
}

function createExecutionRole(scope: Construct, id: string, logging: boolean): iam.IRole {
  const execRole = new iam.Role(scope, id, {
    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    // needed for cross-account access with TagParameterContainerImage
    roleName: PhysicalName.GENERATE_IF_NEEDED,
  });

  if (!logging) {
    // all jobs will fail without this if they produce any output at all when no logging is specified
    LogGroup.fromLogGroupName(scope, 'batchDefaultLogGroup', '/aws/batch/job').grantWrite(execRole);
  }

  return execRole;
}

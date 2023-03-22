import * as ecs from '@aws-cdk/aws-ecs';
import { IFileSystem } from '@aws-cdk/aws-efs';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Lazy, PhysicalName } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';

const EFS_VOLUME_SYMBOL = Symbol.for('@aws-cdk/aws-batch/lib/container-definition.EfsVolume');
const HOST_VOLUME_SYMBOL = Symbol.for('@aws-cdk/aws-batch/lib/container-definition.HostVolume');

export class LinuxParameters extends ecs.LinuxParameters {
  /**
   * Renders the Linux parameters to the Batch version of this resource,
   * which does not have 'capabilities' and requires tmpfs.containerPath to be defined.
   */
  public renderBatchLinuxParameters(): CfnJobDefinition.LinuxParametersProperty {
    return {
      initProcessEnabled: this.initProcessEnabled,
      sharedMemorySize: this.sharedMemorySize,
      maxSwap: this.maxSwap?.toMebibytes(),
      swappiness: this.swappiness,
      devices: Lazy.any({ produce: () => this.devices.map(this.renderDevice) }, { omitEmptyArray: true }),
      tmpfs: Lazy.any({ produce: () => this.tmpfs.map(this.renderTmpfs) }, { omitEmptyArray: true }),
    };
  }
}

export interface EcsVolumeOptions {
  readonly name: string;
  /**
   * The path on the container where this volume is mounted
   */
  readonly containerPath: string;
  readonly readonly?: boolean;
}


export abstract class EcsVolume {
  static efs(options: EfsVolumeOptions) {
    return new EfsVolume(options);
  }
  static host(options: HostVolumeOptions) {
    return new HostVolume(options);
  }

  readonly name: string;
  readonly containerPath: string;
  readonly readonly?: boolean;

  constructor(options: EcsVolumeOptions) {
    this.name = options.name;
    this.containerPath = options.containerPath;
    this.readonly = options.readonly;
  }
}

export interface EfsVolumeOptions extends EcsVolumeOptions {
  readonly fileSystem: IFileSystem;
  readonly rootDirectory?: string;
  /**
   * @default false
   */
  readonly enableTransitEncryption?: boolean;
  readonly transitEncryptionPort?: number;
  readonly accessPointId?: string;
  readonly useJobDefinitionRole?: boolean;
}

export class EfsVolume extends EcsVolume {
  public static isEfsVolume(x: any) : x is EfsVolume {
    return x !== null && typeof(x) === 'object' && EFS_VOLUME_SYMBOL in x;
  }

  readonly fileSystem: IFileSystem;
  readonly rootDirectory?: string;
  readonly enableTransitEncryption?: boolean;
  readonly transitEncryptionPort?: number;
  readonly accessPointId?: string;
  readonly useJobDefinitionRole?: boolean;

  constructor(options: EfsVolumeOptions) {
    super(options);

    this.fileSystem = options.fileSystem;
    this.rootDirectory = options.rootDirectory;
    this.enableTransitEncryption = options.enableTransitEncryption;
    this.transitEncryptionPort = options.transitEncryptionPort;
    this.accessPointId = options.accessPointId;
    this.useJobDefinitionRole = options.useJobDefinitionRole;
  }
}

Object.defineProperty(EfsVolume.prototype, EFS_VOLUME_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});

export interface HostVolumeOptions extends EcsVolumeOptions {
  /**
   * The path on the host machine this container will have access to
   */
  readonly hostPath?: string;
}

export class HostVolume extends EcsVolume {
  public static isHostVolume(x: any) : x is HostVolume {
    return x !== null && typeof(x) === 'object' && HOST_VOLUME_SYMBOL in x;
  }

  readonly hostPath?: string;

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

export interface IEcsContainerDefinition {
  readonly image: ecs.ContainerImage;
  readonly cpu: number;
  readonly memoryMiB: number;
  readonly command?: string[];
  readonly environment?: { [key:string]: string };
  readonly executionRole?: iam.IRole;
  readonly jobRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logDriverConfig?: ecs.LogDriverConfig;
  readonly readonlyRootFilesystem?: boolean;
  readonly gpu?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly user?: string;
  readonly volumes?: EcsVolume[];

  renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty;
}

export interface EcsContainerDefinitionProps {
  readonly command?: string[];
  readonly memoryMiB: number;
  readonly environment?: { [key:string]: string };
  readonly image: ecs.ContainerImage;
  readonly jobRole?: iam.IRole;
  readonly executionRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logging?: ecs.LogDriver;
  /**
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;
  readonly cpu: number;
  readonly gpu?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly user?: string;
  readonly volumes?: EcsVolume[];
}

abstract class EcsContainerDefinitionBase extends Construct implements IEcsContainerDefinition {
  readonly image: ecs.ContainerImage;
  readonly cpu: number;
  readonly memoryMiB: number;
  readonly command?: string[];
  readonly environment?: { [key:string]: string };
  readonly jobRole?: iam.IRole;
  readonly executionRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logDriverConfig?: ecs.LogDriverConfig;
  readonly readonlyRootFilesystem?: boolean;
  readonly gpu?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly user?: string;
  readonly volumes?: EcsVolume[];

  private readonly imageConfig: ecs.ContainerImageConfig;

  constructor(scope: Construct, id: string, props: EcsContainerDefinitionProps) {
    super(scope, id);

    this.image = props.image;
    this.cpu = props.cpu;
    this.command = props.command;
    this.environment = props.environment;
    this.jobRole = props.jobRole;
    this.executionRole = props.executionRole ?? new iam.Role(this, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      // needed for cross-account access with TagParameterContainerImage
      roleName: PhysicalName.GENERATE_IF_NEEDED,
    });

    this.linuxParameters = props.linuxParameters;
    this.memoryMiB = props.memoryMiB;

    if (props.logging) {
      this.logDriverConfig = props.logging.bind(this, {
        ...this as any,
        taskDefinition: {
          obtainExecutionRole: () => this.executionRole,
        },
      });
    }
    this.readonlyRootFilesystem = props.readonlyRootFilesystem ?? false;
    this.gpu = props.gpu;
    this.secrets = props.secrets;
    this.user = props.user;
    this.volumes = props.volumes;

    this.imageConfig = props.image.bind(this, this as any);
  }

  public renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      image: this.imageConfig.imageName,
      command: this.command,
      environment: Object.keys(this.environment ?? {}).map((envKey) => ({
        name: envKey,
        value: (this.environment ?? {})[envKey],
      })),
      jobRoleArn: this.jobRole?.roleArn,
      executionRoleArn: this.executionRole?.roleArn,
      linuxParameters: this.linuxParameters && this.linuxParameters.renderBatchLinuxParameters(),
      logConfiguration: this.logDriverConfig,
      readonlyRootFilesystem: this.readonlyRootFilesystem,
      resourceRequirements: this.renderResourceRequirements(),
      secrets: this.secrets?.map((secret) => {
        return {
          name: secret.secretName,
          valueFrom: secret.secretArn,
        };
      }),
      mountPoints: this.volumes?.map((volume) => {
        return {
          containerPath: volume.containerPath,
          readOnly: volume.readonly,
          sourceVolume: volume.name,
        };
      }),
      volumes: this.volumes?.map((volume) => {
        if (EfsVolume.isEfsVolume(volume)) {
          return {
            name: volume.name,
            efsVolumeConfiguration: {
              fileSystemId: volume.fileSystem.fileSystemId,
              rootDirectory: volume.rootDirectory,
              transitEncryption: volume.enableTransitEncryption ? 'ENABLED' : (volume.enableTransitEncryption === false ? 'DISABLED' : undefined),
              transitEncryptionPort: volume.transitEncryptionPort,
              authorizationConfig: {
                accessPointId: volume.accessPointId,
                iam: volume.useJobDefinitionRole ? 'ENABLED' : (volume.useJobDefinitionRole === false ? 'DISABLED' : undefined),
              },
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
      }),
      user: this.user,
    };
  }

  //addUlimit(...Ulimit[])
  //addMountedVolume(..EcsVolume[])

  private renderResourceRequirements() {
    const resourceRequirements = [];

    if (this.gpu) {
      resourceRequirements.push({
        type: 'GPU',
        value: this.gpu.toString(),
      });
    }

    resourceRequirements.push({
      type: 'MEMORY',
      value: this.memoryMiB.toString(),
    });

    resourceRequirements.push({
      type: 'VCPU',
      value: this.cpu.toString(),
    });

    return resourceRequirements;
  }
}

export interface Ulimit {
  readonly hardLimit: number;
  readonly name: UlimitName;
  readonly softLimit: number;
}

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
  STACK = 'stack',
}

export interface IEcsEc2ContainerDefinition extends IEcsContainerDefinition {
  readonly privileged?: boolean;
  readonly ulimits?: Ulimit[];
}

export interface EcsEc2ContainerDefinitionProps extends EcsContainerDefinitionProps {
  /**
   * @default false
   */
  readonly privileged?: boolean;
  readonly ulimits?: Ulimit[];
}

export class EcsEc2ContainerDefinition extends EcsContainerDefinitionBase {
  readonly privileged?: boolean;
  readonly ulimits?: Ulimit[];

  constructor(scope: Construct, id: string, props: EcsEc2ContainerDefinitionProps) {
    super(scope, id, props);
    this.privileged = props.privileged;
    this.ulimits = props.ulimits;
  }

  public renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      ...super.renderContainerDefinition(),
      ulimits: this.ulimits?.map((ulimit) => ({
        hardLimit: ulimit.hardLimit,
        name: ulimit.name,
        softLimit: ulimit.softLimit,
      })),
      privileged: this.privileged,
    };
  };
}

export interface IEcsFargateContainerDefinition extends IEcsContainerDefinition {
  readonly assignPublicIp?: boolean;
  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
}

export interface EcsFargateContainerDefinitionProps extends EcsContainerDefinitionProps {
  readonly assignPublicIp?: boolean;
  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
}

export class EcsFargateContainerDefinition extends EcsContainerDefinitionBase {
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
  readonly assignPublicIp?: boolean;

  constructor(scope: Construct, id: string, props: EcsFargateContainerDefinitionProps) {
    super(scope, id, props);
    this.assignPublicIp = props.assignPublicIp;
    this.fargatePlatformVersion = props.fargatePlatformVersion;
  }

  public renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      ...super.renderContainerDefinition(),
      fargatePlatformConfiguration: {
        platformVersion: this.fargatePlatformVersion?.toString(),
      },
      networkConfiguration: {
        assignPublicIp: this.assignPublicIp ? 'ENABLED' : 'DISABLED',
      },
    };
  };
}

import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';


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

export interface IEcsContainerDefinition {
  readonly image: ecs.ContainerImage;
  readonly cpu: number;
  readonly memoryMiB: number;
  readonly command?: string[];
  readonly environments?: Array<{ [key:string]: string }>;
  readonly executionRole?: iam.IRole;
  readonly fargateVersion?: FargateVersion;
  readonly jobRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logDriverConfig?: ecs.LogDriverConfig;
  readonly assignPublicIp?: boolean;
  readonly priveleged?: boolean;
  readonly readonlyRootFileSystem?: boolean;
  readonly gpuCount?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly ulimits?: Ulimit[];
  readonly user?: string;
  readonly volumes?: MountedEcsVolume[];
}

export interface EcsContainerDefinitionProps {
  readonly command?: string[];
  readonly memoryMiB: number;
  readonly environments?: Array<{ [key:string]: string }>;
  readonly executionRole?: iam.IRole;
  readonly fargateVersion?: FargateVersion;
  readonly image: ecs.ContainerImage;
  readonly jobRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logging?: ecs.LogDriver;
  readonly assignPublicIp?: boolean;
  readonly priveleged?: boolean;
  readonly readonlyRootFileSystem?: boolean;
  readonly cpu: number;
  readonly gpuCount?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly ulimits?: Ulimit[];
  readonly user?: string;
  readonly volumes?: MountedEcsVolume[];
}

export class EcsContainerDefinition extends Construct implements IEcsContainerDefinition {
  readonly image: ecs.ContainerImage;
  readonly cpu: number;
  readonly memoryMiB: number;
  readonly command?: string[];
  readonly environments?: Array<{ [key:string]: string }>;
  readonly executionRole?: iam.IRole;
  readonly fargateVersion?: FargateVersion;
  readonly jobRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly assignPublicIp?: boolean;
  readonly logDriverConfig?: ecs.LogDriverConfig;
  readonly priveleged?: boolean;
  readonly readonlyRootFileSystem?: boolean;
  readonly gpuCount?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly ulimits?: Ulimit[];
  readonly user?: string;
  readonly volumes?: MountedEcsVolume[];

  private readonly imageConfig: ecs.ContainerImageConfig;

  constructor(scope: Construct, id: string, props: EcsContainerDefinitionProps) {
    super(scope, id);

    this.image = props.image;
    this.cpu = props.cpu;
    this.command = props.command;
    this.environments = props.environments;
    this.executionRole = props.executionRole;
    this.fargateVersion = props.fargateVersion;
    this.jobRole = props.jobRole;
    this.linuxParameters = props.linuxParameters;
    this.memoryMiB = props.memoryMiB;

    if (props.logging) {
      this.logDriverConfig = props.logging.bind(this, this as any);
    }
    this.assignPublicIp = props.assignPublicIp;
    this.priveleged = props.priveleged;
    this.readonlyRootFileSystem = props.readonlyRootFileSystem;
    this.gpuCount = props.gpuCount;
    this.secrets = props.secrets;
    this.ulimits = props.ulimits;
    this.user = props.user;
    this.volumes = props.volumes;

    this.imageConfig = props.image.bind(this, this as any);
  }

  renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      image: this.imageConfig.imageName,
      command: this.command,
      environment: this.environments,
      executionRoleArn: this.executionRole?.roleArn,
      fargatePlatformConfiguration: {
        platformVersion: this.fargateVersion?.toString(),
      },
      jobRoleArn: this.jobRole?.roleArn,
      linuxParameters: this.linuxParameters && this.linuxParameters.renderBatchLinuxParameters(),
      logConfiguration: this.logDriverConfig,
      networkConfiguration: {
        assignPublicIp: this.assignPublicIp ? 'ENABLED' : 'DISABLED',
      },
      privileged: this.priveleged,
      readonlyRootFilesystem: this.readonlyRootFileSystem,
      resourceRequirements: this.renderResourceRequirements(),
      secrets: this.secrets?.map((secret) => {
        return {
          name: secret.secretName,
          valueFrom: secret.secretArn,
        };
      }),
      ulimits: this.ulimits?.map((ulimit) => {
        return {
          hardLimit: ulimit.hardLimit,
          name: ulimit.name,
          softLimit: ulimit.softLimit,
        };
      }),
      user: this.user,
    };
  }

  //addUlimit(...Ulimit[])
  //addMountedVolume(..MountedEcsVolume[])

  private renderResourceRequirements() {
    const resourceRequirements = [];

    if (this.gpuCount) {
      resourceRequirements.push({
        type: 'GPU',
        value: this.gpuCount?.toString(),
      });
    }

    if (this.memoryMiB) {
      resourceRequirements.push({
        type: 'MEMORY',
        value: this.memoryMiB.toString(),
      });
    }

    if (this.cpu) {
      resourceRequirements.push({
        type: 'VCPU',
        value: this.cpu.toString(),
      });
    }

    return resourceRequirements;
  }
}

export enum FargateVersion {
  FOO = 'bar',
}

export interface Ulimit {
  readonly hardLimit: number;
  readonly name: UlimitName;
  readonly softLimit: number;
}

export enum UlimitName {
  FOO = 'foo',
}

export interface MountedEcsVolume {
  readonly name: string;
  readonly efsVolumeConfiguration?: EfsVolumeConfiguration; // TODO: see if EfsVolumeConfiguration can be specified with host volumes
  readonly host?: string;
  readonly containerPath: string;
  readonly readOnly: boolean;
}

export interface EfsVolumeConfiguration {
  readonly fileSystemId: string;
  readonly rootDirectory?: string;
  readonly transitEncryption?: string;
  readonly transitEncryptionPort?: number;
  readonly authorizationConfig?: AuthorizationConfig;
}

export interface AuthorizationConfig {
  readonly accessPointId?: string;
  readonly iam?: string;
}


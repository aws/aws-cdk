import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Lazy, PhysicalName } from '@aws-cdk/core';
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

export interface IEcsContainerDefinition {
  readonly image: ecs.ContainerImage;
  readonly cpu: number;
  readonly memoryMiB: number;
  readonly command?: string[];
  readonly environments?: Array<{ [key:string]: string }>;
  readonly executionRole?: iam.IRole;
  readonly jobRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logDriverConfig?: ecs.LogDriverConfig;
  readonly readonlyRootFileSystem?: boolean;
  readonly gpuCount?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly user?: string;
  readonly volumes?: MountedEcsVolume[];

  renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty;
}

export interface EcsContainerDefinitionProps {
  readonly command?: string[];
  readonly memoryMiB: number;
  readonly environments?: Array<{ [key:string]: string }>;
  readonly image: ecs.ContainerImage;
  readonly jobRole?: iam.IRole;
  readonly executionRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logging?: ecs.LogDriver;
  readonly readonlyRootFileSystem?: boolean;
  readonly cpu: number;
  readonly gpuCount?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly user?: string;
  readonly volumes?: MountedEcsVolume[];
}

export abstract class EcsContainerDefinitionBase extends Construct implements IEcsContainerDefinition {
  readonly image: ecs.ContainerImage;
  readonly cpu: number;
  readonly memoryMiB: number;
  readonly command?: string[];
  readonly environments?: Array<{ [key:string]: string }>;
  readonly jobRole?: iam.IRole;
  readonly executionRole?: iam.IRole;
  readonly linuxParameters?: LinuxParameters;
  readonly logDriverConfig?: ecs.LogDriverConfig;
  readonly readonlyRootFileSystem?: boolean;
  readonly gpuCount?: number;
  readonly secrets?: secretsmanager.Secret[];
  readonly user?: string;
  readonly volumes?: MountedEcsVolume[];

  private readonly imageConfig: ecs.ContainerImageConfig;

  constructor(scope: Construct, id: string, props: EcsContainerDefinitionProps) {
    super(scope, id);

    this.image = props.image;
    this.cpu = props.cpu;
    this.command = props.command;
    this.environments = props.environments;
    this.jobRole = props.jobRole;
    this.executionRole = props.executionRole ?? new iam.Role(this, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      // needed for cross-account access with TagParameterContainerImage
      roleName: PhysicalName.GENERATE_IF_NEEDED,
    });

    this.linuxParameters = props.linuxParameters;
    this.memoryMiB = props.memoryMiB;

    if (props.logging) {
      this.logDriverConfig = props.logging.bind(this, this as any);
    }
    this.readonlyRootFileSystem = props.readonlyRootFileSystem;
    this.gpuCount = props.gpuCount;
    this.secrets = props.secrets;
    this.user = props.user;
    this.volumes = props.volumes;

    this.imageConfig = props.image.bind(this, this as any);
  }

  public renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      image: this.imageConfig.imageName,
      command: this.command,
      environment: this.environments,
      jobRoleArn: this.jobRole?.roleArn,
      executionRoleArn: this.executionRole?.roleArn,
      linuxParameters: this.linuxParameters && this.linuxParameters.renderBatchLinuxParameters(),
      logConfiguration: this.logDriverConfig,
      readonlyRootFilesystem: this.readonlyRootFileSystem,
      resourceRequirements: this.renderResourceRequirements(),
      secrets: this.secrets?.map((secret) => {
        return {
          name: secret.secretName,
          valueFrom: secret.secretArn,
        };
      }),
    };
  }

  //addUlimit(...Ulimit[])
  //addMountedVolume(..MountedEcsVolume[])

  private renderResourceRequirements() {
    const resourceRequirements = [];

    /*if (this.gpuCount) {
      resourceRequirements.push({
        type: 'GPU',
        value: this.gpuCount?.toString(),
      });
    }
    */

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
  FOO = 'foo',
}
export interface IEcsEc2ContainerDefinition extends IEcsContainerDefinition {
  readonly privileged?: boolean;
  readonly ulimits?: Ulimit[];
}

export interface EcsEc2ContainerDefinitionProps extends EcsContainerDefinitionProps {
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
      ulimits: this.ulimits?.map((ulimit) => {
        return {
          hardLimit: ulimit.hardLimit,
          name: ulimit.name,
          softLimit: ulimit.softLimit,
        };
      }),
      privileged: this.privileged,
    };
  };
}

export enum FargateVersion {
  FOO = 'bar',
}

export interface IEcsFargateContainerDefinition extends IEcsContainerDefinition {
  readonly fargateVersion?: FargateVersion;
  readonly assignPublicIp?: boolean;
}

export interface EcsFargateContainerDefinitionProps extends EcsContainerDefinitionProps {
  readonly fargateVersion?: FargateVersion;
  readonly assignPublicIp?: boolean;
}

export class EcsFargateContainerDefinition extends EcsContainerDefinitionBase {
  readonly fargateVersion?: FargateVersion;
  readonly assignPublicIp?: boolean;

  constructor(scope: Construct, id: string, props: EcsFargateContainerDefinitionProps) {
    super(scope, id, props);
    this.assignPublicIp = props.assignPublicIp;
  }

  public renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      ...super.renderContainerDefinition(),
      fargatePlatformConfiguration: {
        platformVersion: this.fargateVersion?.toString(),
      },
      networkConfiguration: {
        assignPublicIp: this.assignPublicIp ? 'ENABLED' : 'DISABLED',
      },
    };
  };
}

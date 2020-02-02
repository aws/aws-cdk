import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { TaskDefinition } from './task-definition';

/**
 * Properties of a job definition container.
 */
export interface IJobDefinitionContainer {
  /**
   * The command that is passed to the container.
   *
   * If you provide a shell command as a single string, you have to quote command-line arguments.
   *
   * @default - CMD value built into container image.
   */
  readonly command?: string[];

  /**
   * The environment variables to pass to the container.
   *
   * @default none
   */
  readonly environment?: { [key: string]: string };

  /**
   * The image used to start a container.
   */
  readonly image: ecs.ContainerImage;

  /**
   * The instance type to use for a multi-node parallel job. Currently all node groups in a
   * multi-node parallel job must use the same instance type. This parameter is not valid
   * for single-node container jobs.
   *
   * @default - None
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The IAM role that the container can assume for AWS permissions.
   *
   * @default - An IAM role will created.
   */
  readonly jobRole?: iam.IRole;

  /**
   * Linux-specific modifications that are applied to the container, such as details for device mappings.
   * For now, only the `devices` property is supported.
   *
   * @default - None will be used.
   */
  readonly linuxParams?: ecs.LinuxParameters;

  /**
   * The hard limit (in MiB) of memory to present to the container. If your container attempts to exceed
   * the memory specified here, the container is killed. You must specify at least 4 MiB of memory for a job.
   *
   * @default 4
   */
  readonly memoryLimitMiB?: number;

  /**
   * The mount points for data volumes in your container.
   *
   * @default - No mount points will be used.
   */
  readonly mountPoints?: ecs.MountPoint[];

  /**
   * When this parameter is true, the container is given elevated privileges on the host container instance (similar to the root user).
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * When this parameter is true, the container is given read-only access to its root file system.
   *
   * @default false
   */
  readonly readOnly?: boolean;

  /**
   * The number of physical GPUs to reserve for the container. The number of GPUs reserved for all
   * containers in a job should not exceed the number of available GPUs on the compute resource that the job is launched on.
   *
   * @default - No GPU reservation.
   */
  readonly gpuCount?: number;

  /**
   * A list of ulimits to set in the container.
   *
   * @default - No limits.
   */
  readonly ulimits?: ecs.Ulimit[];

  /**
   * The user name to use inside the container.
   *
   * @default - None will be used.
   */
  readonly user?: string;

  /**
   * The number of vCPUs reserved for the container. Each vCPU is equivalent to
   * 1,024 CPU shares. You must specify at least one vCPU.
   *
   * @default 1
   */
  readonly vcpus?: number;

  /**
   * A list of data volumes used in a job.
   *
   * @default - No data volumes will be used.
   */
  readonly volumes?: ecs.Volume[];
}

/**
 * An interface representing a job definition image config
 * for binding a container image to a batch job definition.
 */
export interface IJobDefinitionImageConfig {
  /**
   * Specifies the name of the container image.
   */
  readonly imageName: string;

  /**
   * Specifies the credentials used to access the image repository.
   */
  readonly repositoryCredentials?: ecs.CfnTaskDefinition.RepositoryCredentialsProperty | undefined;
}

/**
 * The configuration for creating a batch container image.
 */
export class JobDefinitionImageConfig implements IJobDefinitionImageConfig {
  public readonly imageName: string;
  public readonly repositoryCredentials?: ecs.CfnTaskDefinition.RepositoryCredentialsProperty | undefined;

  constructor(scope: cdk.Construct, container: IJobDefinitionContainer) {
    const config = this.bindImageConfig(scope, container);

    this.imageName = config.imageName;
    this.repositoryCredentials = config.repositoryCredentials;
  }

  private bindImageConfig(scope: cdk.Construct, container: IJobDefinitionContainer): ecs.ContainerImageConfig {
    return container.image.bind(scope, new ecs.ContainerDefinition(scope, 'Resource-Batch-Job-Container-Definiton', {
      command: container.command,
      cpu: container.vcpus,
      image: container.image,
      environment: container.environment,
      linuxParameters: container.linuxParams,
      memoryLimitMiB: container.memoryLimitMiB,
      privileged: container.privileged,
      readonlyRootFilesystem: container.readOnly,
      gpuCount: container.gpuCount,
      user: container.user,
      taskDefinition: new TaskDefinition({
        executionRole: container.jobRole || new iam.LazyRole(scope, 'Resource-Batch-Task-Definition-Role', {
          assumedBy: new iam.ServicePrincipal('batch.amazonaws.com')
        }),
      }) as unknown as ecs.TaskDefinition,
    }));
  }
}

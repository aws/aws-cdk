import { ManagedInstancesTaskDefinition, RuntimePlatform } from '../../../aws-ecs';

/**
 * Base properties for Managed Instances services in ECS patterns.
 */
export interface ManagedInstancesServiceBaseProps {
  /**
   * The task definition to use for tasks in the service. TaskDefinition or TaskImageOptions must be specified, but not both.
   *
   * [disable-awslint:ref-via-interface]
   *
   * @default - none
   */
  readonly taskDefinition?: ManagedInstancesTaskDefinition;

  /**
   * The number of cpu units used by the task.
   *
   * Uses the same values as ECS task definition CPU settings.
   *
   * @default 256
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * Uses the same values as ECS task definition memory settings.
   *
   * @default 512
   */
  readonly memoryLimitMiB?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * @default 512
   */
  readonly memoryMib?: number;

  /**
   * The amount (in GiB) of ephemeral storage to be allocated to the task.
   *
   * Not supported for Managed Instances tasks.
   *
   * @default - undefined
   */
  readonly ephemeralStorageGiB?: number;

  /**
   * The runtime platform of the task definition.
   *
   * @default - If the property is undefined, `operatingSystemFamily` is LINUX and `cpuArchitecture` is X86_64
   */
  readonly runtimePlatform?: RuntimePlatform;

  /**
   * When set to true, the container will have a read-only root filesystem.
   *
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;
}

export interface ContainerOverride {
  /**
   * Name of the container inside the task definition
   */
  readonly containerName: string;

  /**
   * Command to run inside the container
   *
   * @default Default command
   */
  readonly command?: string[];

  /**
   * Variables to set in the container's environment
   */
  readonly environment?: TaskEnvironmentVariable[];

  /**
   * The number of cpu units reserved for the container
   *
   * @default The default value from the task definition.
   */
  readonly cpu?: number;

  /**
   * Hard memory limit on the container
   *
   * @default The default value from the task definition.
   */
  readonly memoryLimit?: number;

  /**
   * Soft memory limit on the container
   *
   * @default The default value from the task definition.
   */
  readonly memoryReservation?: number;
}

/**
 * An environment variable to be set in the container run as a task
 */
export interface TaskEnvironmentVariable {
  /**
   * Name for the environment variable
   *
   * Exactly one of `name` and `namePath` must be specified.
   */
  readonly name: string;

  /**
   * Value of the environment variable
   *
   * Exactly one of `value` and `valuePath` must be specified.
   */
  readonly value: string;
}

/**
 * Override ephemeral storage for the task.
 */
export interface EphemeralStorageOverride {
  /**
   * The total amount, in GiB, of ephemeral storage to set for the task.
   *
   * The minimum supported value is 20 GiB and the maximum supported value is 200 GiB.
   */
  readonly sizeInGiB: number;
}

/**
 * Override inference accelerators for the task.
 */
export interface InferenceAcceleratorOverride {
  /**
   * The Elastic Inference accelerator device name to override for the task.
   * This parameter must match a `deviceName` specified in the task definition.
   */
  readonly deviceName: string;

  /**
   * The Elastic Inference accelerator type to use.
   */
  readonly deviceType: string;
}

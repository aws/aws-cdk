export interface ContainerOverride {
  /**
   * Name of the container inside the task definition
   *
   * Exactly one of `containerName` and `containerNamePath` is required.
   */
  readonly containerName?: string;

  /**
   * JSONPath expression for the name of the container inside the task definition
   *
   * Exactly one of `containerName` and `containerNamePath` is required.
   */
  readonly containerNamePath?: string;

  /**
   * Command to run inside the container
   *
   * @default Default command
   */
  readonly command?: string[];

  /**
   * JSON expression for command to run inside the container
   *
   * @default Default command
   */
  readonly commandPath?: string;

  /**
   * Variables to set in the container's environment
   */
  readonly environment?: TaskEnvironmentVariable[];

  /**
   * The number of cpu units reserved for the container
   *
   * @Default The default value from the task definition.
   */
  readonly cpu?: number;

  /**
   * JSON expression for the number of CPU units
   *
   * @Default The default value from the task definition.
   */
  readonly cpuPath?: string;

  /**
   * Hard memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  readonly memoryLimit?: number;

  /**
   * JSON expression path for the hard memory limit
   *
   * @Default The default value from the task definition.
   */
  readonly memoryLimitPath?: string;

  /**
   * Soft memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  readonly memoryReservation?: number;

  /**
   * JSONExpr path for memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  readonly memoryReservationPath?: number;
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
  readonly name?: string;

  /**
   * JSONExpr for the name of the variable
   *
   * Exactly one of `name` and `namePath` must be specified.
   */
  readonly namePath?: string;

  /**
   * Value of the environment variable
   *
   * Exactly one of `value` and `valuePath` must be specified.
   */
  readonly value?: string;

  /**
   * JSONPath expr for the environment variable
   *
   * Exactly one of `value` and `valuePath` must be specified.
   */
  readonly valuePath?: string;
}

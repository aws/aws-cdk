import { ContainerDefinition } from '@aws-cdk/aws-ecs';

/**
 * A list of container overrides that specify the name of a container
 * and the overrides it should receive.
 */
export interface ContainerOverride {
  /**
   * Name of the container inside the task definition
   */
  readonly containerDefinition: ContainerDefinition;

  /**
   * Command to run inside the container
   *
   * @default - Default command from the Docker image or the task definition
   */
  readonly command?: string[];

  /**
   * The environment variables to send to the container.
   *
   * You can add new environment variables, which are added to the container at launch,
   * or you can override the existing environment variables from the Docker image or the task definition.
   *
   * @default - The existing environment variables from the Docker image or the task definition
   */
  readonly environment?: TaskEnvironmentVariable[];

  /**
   * The number of cpu units reserved for the container
   *
   * @default - The default value from the task definition.
   */
  readonly cpu?: number;

  /**
   * The hard limit (in MiB) of memory to present to the container
   *
   * @default - The default value from the task definition.
   */
  readonly memoryLimit?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container
   *
   * @default - The default value from the task definition.
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

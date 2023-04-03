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

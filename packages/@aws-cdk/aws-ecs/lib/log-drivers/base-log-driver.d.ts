export interface BaseLogDriverProps {
    /**
     * By default, Docker uses the first 12 characters of the container ID to tag
     * log messages. Refer to the log tag option documentation for customizing the
     * log tag format.
     *
     * @default - The first 12 characters of the container ID
     */
    readonly tag?: string;
    /**
     * The labels option takes an array of keys. If there is collision
     * between label and env keys, the value of the env takes precedence. Adds additional
     * fields to the extra attributes of a logging message.
     *
     * @default - No labels
     */
    readonly labels?: string[];
    /**
     * The env option takes an array of keys. If there is collision between
     * label and env keys, the value of the env takes precedence. Adds additional fields
     * to the extra attributes of a logging message.
     *
     * @default - No env
     */
    readonly env?: string[];
    /**
     * The env-regex option is similar to and compatible with env. Its value is a regular
     * expression to match logging-related environment variables. It is used for advanced
     * log tag options.
     *
     * @default - No envRegex
     */
    readonly envRegex?: string;
}

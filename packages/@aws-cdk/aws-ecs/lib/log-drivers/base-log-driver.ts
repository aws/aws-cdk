export interface BaseLogDriverProps {
  /**
   * By default, Docker uses the first 12 characters of the container ID to tag
   * log messages. Refer to the log tag option documentation for customizing the
   * log tag format.
   *
   * @default - tag not set
   */
  readonly tag?: string;

  /**
   * The labels option takes a comma-separated list of keys. If there is collision
   * between label and env keys, the value of the env takes precedence. Adds additional
   * fields to the extra attributes of a logging message.
   *
   * @default - labels not set
   */
  readonly labels?: string[];

  /**
   * The env option takes a comma-separated list of keys. If there is collision between
   * label and env keys, the value of the env takes precedence. Adds additional fields
   * to the extra attributes of a logging message.
   *
   * @default - env not set
   */
  readonly env?: { [key: string]: string };

  /**
   * The env-regex option is similar to and compatible with env. Its value is a regular
   * expression to match logging-related environment variables. It is used for advanced
   * log tag options.
   *
   * @default - envRegex not set
   */
  readonly envRegex?: string;
}
